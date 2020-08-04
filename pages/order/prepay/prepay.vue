<template>
	<view id="prepay">
		<!-- 房间型号 -->
		<view class="roomType">
			<view class="left">
				<text class="title">{{type[roomType.scale-1]}}</text>
				<view>
					<text class="">{{roomType.size||0}}㎡</text>
					<text class="">{{roomType.window}}</text>
					<text class="">{{roomType.bathtub}}</text>
					<text class="">{{roomType.breakfast}}</text>
				</view>
			</view>
			<image :src="roomType.pic" mode=""></image>
		</view>
		
		<!-- 时间信息 -->
		<view class="time">
			<view class="left">
				<view class="">
					<text>{{start}}--{{end}}</text>
					<text class="night">共 {{night}} 晚</text>
				</view>
				<text class="tips">{{info.starDate}}  12:00前可免费取消</text>
			</view>
			<view class="right">
				<yp-number-box :min="1" :max="20" 
				:value="night" @change="chageAct"></yp-number-box>
			</view>
		</view>
		
		<!-- 房间信息 -->
		<view class="userMsg">
			<view class="top">
				<text class="left">入住人：</text>
				<input type="text" class="right" 
				v-model="username" placeholder="请填写入住人真实姓名" />
			</view>
			<view class="cen">
			    <text class="left">联系电话：</text>
			    <input type="text" class="right" 
				v-model="tel" placeholder="请填写入住人联系电话" />
			</view>
			<view class="bto">
				<text class="left">备注：</text>
				<input class="right" type="text" 
				v-model="note" placeholder="在这填写您的备注" />
			</view>
		</view>
		
		
		<!-- 其他信息 -->
		<view class="other">
			<!-- 退订政策 \ 入住政策-->
			<view class="box" v-for="(item,index) in others" :key="index">
				<text class="title">{{item.title}}</text>
				<view class="con">{{item.con}}</view>
			</view>
		</view>
		
		<!-- 立即支付 -->
		<view class="pay" v-if="totalPrice">
			<text class="price">￥{{totalPrice}}</text>
			<button type="primary" @click="payAction">点击预定</button>
		</view>
	</view>
</template>

<script>
	import ypNumberBox from "@/components/yp-number-box/yp-number-box.vue"
	export default {
		onLoad(options){
			this.id = options.id;
			this.scale = parseInt(options.scale);
			this.getHotel(options.id);
			this.info = uni.getStorageSync("info");
			this.initData(this.info);
		},
		components: {
			ypNumberBox
		},
		data() {
			return {
				others:[{
					title:"退订政策",
					con:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget."
				},{
					title:"入住政策",
					con:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget."
				}],
				username:"",
				tel:"",
				note:"",
				start:"",
				end:"",
				night:"",
				id:"",
				scale: 1,
				info:{},
				roomType:{},
				totalPrice:0,
				type:["标准单人房","舒适双人房","豪华大床房"]
			};
		},
		methods:{
			async payAction(){
				if(!this.tel||!this.username){
					uni.showToast({
						icon:"none",
						title:"入住人姓名和入住人电话不能为空！"
					});
					return;
				}else{
					uni.showToast({
						title:"你已成功预定！"
					});
				}
				// 执行支付操作，生成用户订单
			  let rs = await wx.cloud.callFunction({
					name:"setOrder",
					data:{
						userId: uni.getStorageSync("userId").id,
						hotelId: this.id,
						hotelTitle:(this.city + this.hotelTitle)+"酒店",
						locate: this.city + this.locate.replace(/市/,"") + "顺丰单大道77号",
						hotelTel: this.hotelTel,
						price:this.totalPrice,
						startTime: this.startTime.replace(/-/g,"."),
						endTime: this.endTime.replace(/-/g,"."),
						night: this.night,
						roomNum: parseInt(Math.random()*3000) + 3,
						status: 0,
						count: 1,
						room:{
						  "remark": this.note, // 房间备注
						  "username": this.username,
						  "usertel": this.tel,
						  "type":this.type[this.roomType.scale-1]
						}
					}
				});
				uni.switchTab({
					url:"../order",
					success: (e) => {
						let page = getCurrentPages()[0];
						if (page == undefined || page == null) return;
						// page.data.initData();
						page.onLoad();
					}
				});
			},
			chageAct(num){
				this.night = num;
				this.totalPrice = num * this.roomType.currentPrice;
			},
			initData(info){
				this.startTime = info.starDate;
				this.endTime = info.endDate;
			 	this.start = info.starDate.replace(/(\d+)-/,"");
				this.end = info.endDate.replace(/(\d+)-/,"");
				this.night = info.night;
				this.city = info.city;
			},
			async getHotel(id) {
				// 显示加载
				uni.showNavigationBarLoading();
				uni.showLoading({
					mask:true,
					title:"加载中..."
				});
				let rs = await wx.cloud.callFunction({
					name:"getHotelById",
					data: {
						id
					}
				});
				let hotel = rs.result.data[0];
				this.hotelTitle = hotel.title;
				this.locate = hotel.locate;
				this.hotelTel = hotel.tel;
				// 获得对应的房型
				this.roomType = hotel.roomType.filter(item=>item.scale===this.scale)[0];
				this.totalPrice = this.night * this.roomType.currentPrice;
				// 显示加载
				uni.hideNavigationBarLoading();
				uni.hideLoading({
					mask:true,
					title:"加载中..."
				});
			},
		}
	}
</script>

<style lang="scss">
#prepay{
	position: relative;
	padding: 10px;
	box-sizing: border-box;
	.roomType{
		display: flex;
		align-items: center;
		.left{
			flex: 1;
			margin-right: 10px;
			.title{
				font-size: 18px;
				font-weight: bold;
			}
			view{
			  text{
				  display: inline-block;
				  width: 50%;
				  padding:5px 0;
			  }	
			}
		}
		image{
			width: 150px;
			height: 130px;
			border-radius: 10px;
			background: #ccc;
		}
	}

    .time{
		display: flex;
		margin:20px 0 10px;
		align-items: center;
		.left{
			flex: 1;
			font-size: 16px;
			.night{padding-left: 10px;}
			.tips{
				color: #f00;
				font-size: 12px;
			}
			line-height: 20px;
		}
		.right{
			width: 30%;
			.uni-numbox{
				height: 35px;
				.uni-numbox__minus,.uni-numbox__plus{
					color: #fff;
					background: #169BD5;
				}
			}
		}
	}

    .userMsg{
		margin:20px 0;
		view{
			padding: 10px;
			display: flex;
			align-items: flex-end;
			.left{
				font-size: 18px;
				width: 35%;
			}
			.right{
				font-size: 16px;
				flex: 1;
				padding: 0 10px;
				box-sizing: border-box;
			}
			input{
				border-bottom: 0.5px solid #C0C0C0;
			}
		}
	}
   
    .other{
		margin-bottom: 70px;
		.box{
			margin-bottom: 10px;
			.title{
				font-size: 18px;
				font-weight: bold;
				padding: 20px 0 10px;
				display: block;
			}
			.con{
				line-height: 20px;
				color: #555;
			}
		}
	}

    .pay{
		position: fixed;
		bottom:0;
		background:#fff;
		width: 100%;
		height: 60px;
		box-sizing: border-box;
		padding:5px 20px 5px 10px;
		display: flex;
		align-items: center;
		border-top: 0.5px solid #C0C0C0;
		text{
			width: 65%;
			line-height: 60px;
			font-size: 25px;
			font-weight: bold;
		}
		button{
			flex: 1;
			font-size: 16px;
			height: 40px;
			line-height: 40px;
			color: #fff;
			background: #169BD5;
		}
	}
}
</style>
