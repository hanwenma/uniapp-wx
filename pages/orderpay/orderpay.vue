<template>
	<view class="orderPay">
		<!-- 骨架 -->
		<skeleton v-if="!info._id" />
		 <!-- 内容 -->
		<view class="bigBox" v-else>

			<!-- 头部 -->
			<view class=" top item">
				<view class="title">{{info.hotelTitle}}</view>
				<view class="box">{{info.room.type}}</view>
				<view class="box">
					<text>{{info.startTime}}-{{info.endTime}}</text>
					<text>共{{info.night}}晚 {{info.count}}间</text>
				</view>
				<view class="box">
					<text class="left" @click="showAddress(info.locate)">地址：{{info.locate}}</text>
					<navigator url="../map/map" class="right">
						<uni-icons type="location" size="25" class="dw" />
						<text>立即导航</text>
					</navigator>
				</view>
				<view class="box">
					<text class="left">电话：{{info.hotelTel}}</text>
					<view class="right">
						<uni-icons type="phone-filled" size="25" class="dw" />
						<text>联系酒店</text>
					</view>
				</view>
			</view>

			<!-- 订单信息 -->
			<view class="order item">
				<view class="box">
					<text class="left order">订单号：{{info._id}}</text>
					<text>{{list[info.status].title}}</text>
				</view>
				<view class="box" >
					<view class="left">
						订单金额：<text class="price">￥{{info.price}}</text>
					</view>
					<view class="right time">
						<view>剩余支付时间</view>
						<view>15:00</view>
					</view>
				</view>
				<!-- 按钮 -->
				<view class="btns">
					<button type="default" 
					@click="cancelAction" 
					v-show="info.status==0||info.status==1"
					size="mini">取消订单</button>
					<button type="default" @click="comfirmAction" 
					class="diff" size="mini">{{list[info.status].btn}}</button>
				</view>
			</view>

			<!-- 用户信息 -->
			<view class="user item">
				<view class="box">
					<text class="left">入住人：</text>
					<text class="right">{{info.room.username}}</text>
				</view>
				<view class="box">
					<text class="left">联系电话：</text>
					<text class="right">{{info.room.usertel}}</text>
				</view>
				<view class="box">
					<text class="left">备注：</text>
					<text class="right">{{info.room.remark}}</text>
				</view>
			</view>

			<!-- 退订政策 -->
			<view class="unsubscribe">
				<text class="title">退订政策</text>
				<view class="con">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin
					gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque
					penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate,
					felis tellus mollis orci, sed rhoncus pronin sapien nunc accuan eget."</view>
			</view>
		</view>
	    
		<!-- code -->
		<view class="qr" v-if="qr" @click="()=>this.qr = false">
			<image 
			src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1578228828164&di=df002a15a2f0f969c7d5edf1a90ed2fa&imgtype=0&src=http%3A%2F%2F7.pic.pc6.com%2Fup%2F2016-12%2F20161213153647219.png" mode=""></image>
		</view>
	   
	</view>
</template>

<script>
	import uniIcons from "../../components/uni-icons/uni-icons.vue";
	import skeleton from "../../components/skeleton.vue"
	export default {
		components: {
			uniIcons,
			skeleton
		},
		onLoad({id}) {
			this.initData(id);
		},
		data() {
			return {
				qr:false,
				info: {},
				list: [{
					title: '待付款',
					btn: "立即支付",
					url: '../paysuccess/paysuccess'
				}, {
					title: '待入驻',
					btn: "入住码",
					url: ''
				}, {
					title: '入住中',
					btn: "呼叫管家",
					url: '../mine/steward/steward'
				}, {
					title: '待评价',
					btn: "立即评价",
					url: '../order/grade/grade'
				}],
			};
		},
		methods: {
			async initData(id) {
				// 展示加载
				uni.showNavigationBarLoading();
				uni.showLoading({
					mask: true,
					title: "加载中..."
				});

				let order = await wx.cloud.callFunction({
					name: "getOrderById",
					data: {
						_id: id
					}
				});

				this.info = order.result.data[0];

				// 隐藏加载
				uni.hideNavigationBarLoading();
				uni.hideLoading({
					mask: true,
					title: "加载中..."
				});
			},
			async comfirmAction() {
				let url = this.list[this.info.status].url;
				let {userId,price,_id,room,roomNum} = this.info;
				let rs = [];
				if (this.info.status == 0) {
					await wx.cloud.callFunction({
						name: "updateOrder",
						data: {
							_id,
							status: 1
						}
					});
				}else if(this.info.status == 1){
					this.qr = true;
				}
				uni.navigateTo({
					url: url + "?userId=" + userId + "&price=" + price+"&userTel="+room.usertel+"&roomNum="+roomNum+"&_id="+this.info._id
				});
			},
			async cancelAction() {
				await wx.cloud.callFunction({
					name: "updateOrder",
					data: {
						_id: this.info._id,
						status: -1
					}
				});
				uni.showToast({
					title:"您已成功取消该订单！"
				});
				uni.switchTab({
					url: "../order/order",
					success: (e) => {
						let page = getCurrentPages().pop();
						if (page == undefined || page == null) return;
						page.onLoad();
					}
				})
			},
			showAddress(val){
				uni.showToast({
					icon:"none",
					mask: true,
					title:"地址：" + val,
					duration: 5000
				})
			}
		}
	}
</script>

<style lang="scss">
	.orderPay {
		position: relative;
		padding: 10px;
		box-sizing: border-box;
		
		.qr{
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			background: rgba($color: #000000, $alpha: 0.4);
			image{
				position: fixed;
				left: 5%;
				top: 22%;
				height: 300px;
				width: 90%;
			}
		}

		@mixin txt {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		.top {
			background: url(http://img4.imgtn.bdimg.com/it/u=3792203305,1358458435&fm=11&gp=0.jpg) no-repeat;
			background-size: 100% 100%;
			.title {
				font-size: 20px;
				font-weight: bold;
				margin-bottom: 20px;
			}
		}

		.item {
			margin-bottom: 20px;
			padding: 10px 0 15px;
			border-bottom: 0.5px solid #C8C7CC;
		}

		.box {
			line-height: 20px;
			margin-bottom: 10px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.order {
				padding-right: 20px;
			}

			.left {
				@include txt;
				flex: 1;
			}

			.right {
				width: 30%;
				text-align: right;
			}

			.time {
				width: 32%;
			}
		}

		.order {
			.price {
				font-weight: bold;
				font-size: 18px;
			}

			.btns {
				display: flex;
				justify-content: space-between;
				margin: 0;
				padding: 0;

				.diff {
					color: #fff;
					background: #169BD5;
				}
			}
		}

		.user {
			background: url(https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1193670225,3478084376&fm=26&gp=0.jpg) no-repeat;
			background-size: 100% 100%;
			color: #fff;
			.left {
				width: 30%;
				flex: none;
				padding-left: 10px;
			}
			.right {
				text-align: left;
				flex: 1;
				@include txt;
			}
		}

		.unsubscribe {
			margin: 20px 0 10px;
			padding: 10px 0;

			.title {
				font-size: 18px;
				font-weight: bold;
				padding: 20px 0 10px;
				display: block;
			}

			.con {
				line-height: 20px;
				color: #555;
			}
		}

	}
</style>
