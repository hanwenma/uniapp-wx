<template>
	<view id="message">
		<!-- 头部 -->
		<view class="top">
			<view @click="tabChage(0)" :class="{active:slectIndex===0}">
				订单消息
				<uni-badge v-if="orderMessage.length" class="badge" type="error" :text="orderMessage.length"></uni-badge>
			</view>
			<view @click="tabChage(1)" :class="{active:slectIndex===1}">
				系统消息
				<uni-badge v-if="systemMessage.length" class="badge" type="error" :text="systemMessage.length"></uni-badge>
			</view>
		</view>

		<!-- 内容 -->
		<view class="content">
			<template v-if="showList.length">
				<view class="item" v-for="(item,index) in showList" :key="index">
					<view class="item-head">
						<uni-badge type="error" @click="deleteMessage(index)" :text="item.del?'x':'-'" size="25"></uni-badge>
						<text>{{item.stutas}}</text>
					</view>
					<view class="item-con">{{item.content}}</view>
				</view>
			</template>
			<view v-else class="nothing">
				<view class="text">您暂时还没有任何消息哟！</view>
				<image src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3087547988,181661009&fm=26&gp=0.jpg" mode=""></image>
			</view>

		</view>
	</view>
</template>

<script>
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	export default {
		components: {
			uniBadge
		},
		onLoad() {
			this.initData();
		},
		data() {
			return {
				showList: [],
				orderMessage: [],
				systemMessage: [],
				slectIndex: 0
			};
		},
		methods: {
			async initData() {
				// 显示加载
				uni.showNavigationBarLoading();
				uni.showLoading({
					mask:true,
					title:"加载中..."
				});
				
				// 获取订单的数据
				let orders = await wx.cloud.callFunction({
					name: "getOrderByUserId",
					data: {
						userId: uni.getStorageSync("userId").id
					}
				});
				
				// 获取系统消息
				let systemMessage = await wx.cloud.callFunction({
					name: "getStewards",
					data: {
						id: uni.getStorageSync("userId").id
					}
				});
				
				// 做好信息的排版
				this.formMessage(orders.result.data,systemMessage);
			},
			tabChage(n) {
				this.slectIndex = n;
				if (n == 0) {
					this.showList = this.orderMessage;
				} else {
					this.showList = this.systemMessage;
				}
			},
			async deleteMessage(num) {
				// 删除消息，应该从数据库中删除
				let {del,id} = this.showList[num];
				if(del){
					this.systemMessage = this.systemMessage.filter( (item,index) => index!=num );
					this.showList = this.systemMessage;
					await wx.cloud.callFunction({
						name:'deleteStewards',
						data:{
							_id:id
						}
					});
				}else{
					this.orderMessage = this.showList = this.orderMessage.filter( (item,index) => index!=num );
					let oldArr = uni.getStorageSync("orderIds");
					if(oldArr){
						uni.setStorage({
							key:"orderIds",
							data:oldArr.push(id)
						});
					}else{
						uni.setStorage({
							key:"orderIds",
							data:[id]
						});
					}
				}
				uni.showToast({
					mask:true,
					title:'该消息已删除！'
				});	
			},
			// 排版消息
			formMessage(orderMessage,systemMessage){
				// 系统消息
				systemMessage.result.data.forEach(item => {
					this.systemMessage.unshift({
						id: item._id,
						del: true,
						stutas: "系统反馈",
						content: `系统已经接收到您的反馈，来自于 ${item.roomNum} 房，联系方式为：${item.userTel}, 描述内容为：【${item.desc}】， 我们会尽快为您解决问题.`
					});
				});
				
				// 订单的消息
				let ids = uni.getStorageSync("orderIds");
				ids && orderMessage.forEach((item,index)=>{
					if(ids.includes(item._id)){
						orderMessage.splice(index,1);
					}
				});
				
				// 关闭加载
				uni.hideNavigationBarLoading();
				uni.hideLoading();
				
				orderMessage.forEach(item => {
					if (item.status == 0) {
						this.orderMessage.unshift({
							id: item._id,
							stutas: "预订成功",
							content: `您预定了【${item.hotelTitle}】,入住时间为 ${item.startTime}, ${item.night}晚 ${item.count}间 ${item.room.type}。订单号为: ${item._id}, 酒店地址: ${item.locate}. 电话: ${item.hotelTel} 转预订部.`
						});
					} else if (item.status == -1) {
						this.orderMessage.unshift({
							id: item._id,
							stutas: "取消订单",
							content: `您成功取消了订单号为: ${item._id},【${item.hotelTitle}】入住时间为${item.startTime}, ${item.night}晚 ${item.count}间 ${item.room.type}, 酒店地址:${item.locate}.`
						});
					}else if(item.status == 1){
						this.orderMessage.unshift({
							id: item._id,
							stutas: "支付成功",
							content: `您已支付成功了【${item.hotelTitle}】的订单,入住时间为 ${item.startTime}, ${item.night}晚 ${item.count}间 ${item.room.type}。订单号为: ${item._id}, 酒店地址: ${item.locate}. 电话: ${item.hotelTel} 转预订部.`
						});
					}
				});
			}
		},
		mounted() {
			this.showList = this.orderMessage;
		}
	}
</script>

<style lang="scss">
	#message {
		.top {
			display: flex;
			justify-content: space-around;

			view.active {
				border-color: red;
				color: #000;
			}

			view {
				position: relative;
				text-align: center;
				width: 30%;
				padding: 20px 0 10px;
				border-bottom: 3px solid #FFF;
				color: #999;

				.badge {
					position: absolute;
					right: 0;
					top: 5px;
					color: #fff;
				}
			}
		}

		.content {
			box-sizing: border-box;
			height: 100px;
			padding: 10px;

			.nothing {
				.text {
					font-size: 20px;
					text-align: center;
					padding: 50px 0;
					color: #999999;
				}

				image {
					display: block;
					margin: auto;
					width: 100px;
					height: 100px;
				}
			}

			.item {
				padding: 10px;
				margin-bottom: 10px;
				border-radius: 5px;
				color: #fff;
				box-shadow: 5px 5px 5px rgba($color: #000000, $alpha: 0.4);
				background: rgba($color: #007AFF, $alpha: 0.6);

				.item-head {
					margin-bottom: 10px;

					text {
						margin-left: 10px;
					}
				}

				.item-con {
					word-break: break-all;
				}
			}
		}
	}
</style>
