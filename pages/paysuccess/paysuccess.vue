<template>
	<view class="paysuccess">
		<image src="../../static/success.png" />
		<view class="text">支付成功</view>
		<view class="price">￥{{price}}</view>

		<button class="confirm" @click="toOrder" type="default">确定</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				price: 0
			}
		},
		methods: {
			toOrder() {
				uni.switchTab({
					url: "../order/order",
					success: (e) => {
						let page = getCurrentPages().pop();
						if (page == undefined || page == null) return;
						page.onLoad();
					}
				})
			}
		},
		onLoad({price = 0}) {
			this.price = price;
		}
	}
</script>

<style lang="scss">
	.paysuccess {
		position: relative;
		font-size: 30px;
		margin-top: 50px;

		image {
			margin: 50px auto;
			display: block;
			width: 140px;
			height: 140px;
		}

		.text {
			text-align: center;
		}

		.price {
			padding: 30px 0;
			text-align: center;
		}

		.confirm {
			margin: 60px auto 0;
			width: 50%;
			color: #fff;
			background: #00EE5F;
		}
	}
</style>
