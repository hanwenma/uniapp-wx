<template>
	<view id="order">
		<!-- 头部 -->
		<view class="tabs">
			<ms-tabs :list="list" v-model="active" itemColor="#03A9F4" lineColor="#03A9F4"></ms-tabs>
		</view>

		<!-- 内容 -->
		<orderCenter 
		:active="active" 
		:url="list[active].url" 
		:dataList="dataList[active]" 
		@btnAction="btnAction" 
		:btnTitle="(active!=4)?list[active].btn:''" />

	</view>
</template>

<script>
	import msTabs from "../../components/ms-tabs/ms-tabs.vue"
	import orderCenter from "../../components/orderCenter.vue"
	export default {
		components: {
			msTabs,
			orderCenter
		},
		onLoad() {
			this.initData();
		},
		data() {
			return {
				active: 0,
				list: [{
					title: '待付款',
					url:'../orderpay/orderpay',
					btn:"立即支付"
				}, {
					title: '待入住',
					url:'../orderpay/orderpay',
					btn:"入住码"
				}, {
					title: '入住中',
					url:'../orderpay/orderpay',
					btn:"呼叫管家"
				}, {
					title: '待评价',
					url:'../orderpay/orderpay',
					btn:"去评价"
				}, {
					title: '已完成',
					url:'../orderpay/orderpay'
				}],
				dataList: [],

			};
		},
		methods: {
			/** tab点击 */
			onTabItemTap() {
			   let userId = uni.getStorageSync("userId").id;
			   if(!userId){
			   	uni.switchTab({
			   		url:'../mine/mine',
			   	});
			   }else{
			   	this.initData();
			   }
			 },
			btnAction() {
				console.log("按钮被点击了");
			},
			async initData() {
				// 展示加载
				uni.showNavigationBarLoading();
				uni.showLoading({
					mask:true,
					title:"加载中..."
				});
				
				let orders = await wx.cloud.callFunction({
					name: "getOrderByUserId",
					data: {
						userId: uni.getStorageSync("userId").id
					}
				});
				
				this.splitData(orders.result.data);
				
				// 隐藏加载
				 uni.hideNavigationBarLoading();
				 uni.hideLoading({
				 	mask:true,
				 	title:"加载中..."
				 });
			},
			// 将数据分类
			splitData(data){
				let wait_Pay = [];
				let wait_in = [];
				let inner = [];
				let wait_comment = [];
				let finish = [];
				data.forEach((item) => {
					switch (item.status) {
						case 0:
						    wait_Pay.push(item);
							break;
						case 1:
						    wait_in.push(item);
							break;
						case 2:
						    inner.push(item);
							break;
						case 3:
						    wait_comment.push(item);
							break;
						case 4:
						    finish.push(item);
							break;
					}
				});
				this.dataList = [wait_Pay,wait_in,inner,wait_comment,finish];
			}
		}
	}
</script>

<style lang="scss">
	#order {
		.tabs {
			margin-top: 10px;
			padding: 0 5px;

			.tabBlock {
				.tab__item-title {
					font-size: 16px;
					margin: 0;
				}
			}
		}
	}
</style>
