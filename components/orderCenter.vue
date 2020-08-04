<template>
	<view class="orderCenter">
		<view class="con-item" v-for="(item,index) in dataList" :key="index">
			<!-- 信息 -->
			<view class="msg">
				<view class="top">
					<text>{{item.hotelTitle}}</text>
					<text class="right status">{{list[active]}}</text>
				</view>
				<view class="center">
					<text>{{item.room.type}}</text>
					<view class="right" v-if="active==0">
						<view>剩余支付时间</view>
						<text>15:00</text>
					</view>
					<view class="right" v-else-if="active==1">
						<view>请尽快办理入住</view> 
					    <text>24小时后订单自动取消</text>
					</view>
					<view class="right" v-else-if="active==2">
						<view>退房时间 </view>
						<text>{{item.endTime}} 14:00前</text> 
					</view>
				</view>
				<view class="bottom">
					<text>{{item.startTime}}-{{item.endTime}}</text>
					<text>共{{item.night}}晚 {{item.count}}间</text>
				</view>
			</view>

			<!-- 按钮 -->
			<view class="pay">
				<text>￥{{item.price}}</text>
				<button v-show="btnTitle"
				  class="button" size="mini" 
				  type="default" 
				  @click="handleAction(item._id)">{{btnTitle}}</button>
			</view>
		</view>
	
	    <!-- 暂无数据 -->
	    <nothing v-if="!dataList.length" />
	</view>

</template>

<script>
	import nothing from "./nothing.vue"
	export default {
		components:{
			nothing
		},
		props: {
			btnTitle: String, // 判断是否需要按钮
			dataList: Array,
			url: String ,// 点击按钮要跳转的地址
			active: Number
		},
		methods: {
			handleAction(id) {
				this.$emit("btnAction");
				uni.navigateTo({
					url:this.url+"?id="+id
				})
			}
		},
		data() {
			return {
				    
				list: [ '待支付','待入驻', '入住中', '待评价', '已完成'],
			};
		}
	}
</script>

<style lang="scss">
	.orderCenter {
		border-top: 0.5px solid #C8C7CC;
		.con-item {
			padding: 0 15px 5px 15px;
			box-sizing: border-box;
			border-bottom: 0.5px solid #C8C7CC;
			box-shadow: 0 5px 10px rgba($color: #000, $alpha: 0.3);
			margin-bottom: 10px;
			.msg {
				padding: 10px 0;
				box-sizing: border-box;
				.top,.center,.bottom {
					padding: 5px 0;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
				.center{
				   .right {
				   	width: 60%;
					font-size: 14px;
					text-align: right;
				   }	
				}
				.status {
					color: red;
				}
			}

			.pay {
				border-top: 0.5px solid #C8C7CC;
				padding: 10px 0;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.button {
					margin: 0;
					background: #169BD5;
					color: #fff;
				}

				text {
					font-size: 20px;
				}
			}
		}
	}
</style>
