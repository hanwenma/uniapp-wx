<template>
	<view id="hotelDetail">
		<!-- 轮播图 -->
		<SlideImg :banner="hotel.hotelPic" />

		<!-- 内容区 -->
		<view class="content">
			<!-- 头部 -->
			<view class="top">
				<view class="title" v-show="hotel.title">
				{{city}}{{hotel.title}}酒店
				<navigator url='../view/view' class="viewBtn">3D全景</navigator>
				</view>
				<view class="locate">
					<view v-show="hotel.locate">{{city}}{{hotel.locate}}江燕路59号</view>
					<view class="check">
						<!-- 定位 -->
						<uni-icons type="location" size="25" class="dw" />
						<text class="txt">查看位置</text>
					</view>
					<view class="tel">
						<uni-icons type="phone-filled" size="25" class="dw" />
						<text class="txt">{{hotel.tel}}</text>
					</view>
				</view>
			</view>

			<!-- tab部分 -->
			<view class="tabs">
				<ms-tabs :list="tabs" v-model="active" itemColor="#03A9F4" lineColor="#03A9F4"></ms-tabs>
			</view>

			<!-- 概况 -->
			<view class="about" v-if="active==0">
				<view class="facility">
					<view class="title">酒店设施</view>
					<view class="list">
						<text v-for="(item,index) in facility" :key="index">{{item}}</text>
					</view>
				</view>

				<!-- 详情 -->
				<view class="poster">
					<view class="title">酒店详情</view>
					<view class="">
						<image :src="item" v-for="(item,index) in hotel.hotelPic" :key="indx"></image>
					</view>
				</view>
			</view>

			<!-- 房型 -->
			<view class="roomtype" v-else>
				<view class="item" v-for="(item,index) in hotel.roomType" :key="index">
					<view class="title">{{roomTitle[index]}}</view>
					<view class="msg">
						<image :src="item.pic" mode=""></image>
						<view class="right">
							<view class="">{{item.size}}㎡</view>
							<view class="">{{item.window}}</view>
							<view class="">{{item.bathtub}}</view>
							<view class="">{{item.breakfast}}</view>
							<view class="">
								<view class="pass">￥{{item.originalPrice}}</view>
								<view class="curr">￥{{item.currentPrice}}</view>
								<button type="default" size="mini" 
								open-type="getUserInfo" 
								@getuserinfo="toPay(item.scale)">立即预定</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import SlideImg from "../../../components/slideImg.vue";
	import uniIcons from "../../../components/uni-icons/uni-icons.vue";
	import msTabs from "@/components/ms-tabs/ms-tabs.vue";
	export default {
		components: {
			SlideImg,
			uniIcons,
			msTabs
		},
		onLoad(options) {
			// 获取数据
			this.getHotel(options.id);
			this.city = options.city;
			this.id = options.id;
		},
		data() {
			return {
				id: "",
				permission: false,
				active: 0,
				hotel: {},
				banner: [],
				facility: ["免费停车场", "洗衣房", "健身房", "会议室"],
				city: "",
				roomTitle: ["单人床", "双人床", "大床房"],
				tabs: [{
						id: "1",
						title: "概括"
					},
					{
						id: "2",
						title: "房型"
					}
				]
			}
		},
		methods: {
			// 获得酒店信息
			async getHotel(id) {
				// 显示加载
				uni.showNavigationBarLoading();
				uni.showLoading({
					mask:true,
					title:"加载中..."
				});
				let rs = await wx.cloud.callFunction({
					name: "getHotelById",
					data: {
						id
					}
				});
				this.hotel = rs.result.data[0];
				
				uni.hideNavigationBarLoading();
				uni.hideLoading();
			},
			// 设置用户信息
			async setUseInfo({avatarUrl,nickName,gender}) {
				let rs = await wx.cloud.callFunction({
					name: "setUserInfo",
					data: {
						attr: avatarUrl,
						nickName,
						gender
					}
				});
				rs.result._id && (uni.setStorage({
					key: 'userId',
					data: {
						id:rs.result._id
					},
				}));
			},
			// 预定操作
			toPay(scale) {
				// 获得用户信息
				uni.getSetting({
					success: (res) => {
						if (res.authSetting["scope.userInfo"]) {
							uni.getUserInfo({
								success: (res) => {
									this.setUseInfo(res.userInfo);
									this.$store.commit("setMineRefresh",true);
									uni.navigateTo({
										url: "../../order/prepay/prepay?id=" + this.id + "&scale=" + scale
									});
								},
								fail: (res) => {
									console.log(res);
								}
							})
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	#hotelDetail {
		.content {
			.top {
				padding: 10px;
				box-sizing: border-box;
				
				.title {
					font-size: 18px;
					margin: 10px 0 20px;
					position: relative;
					.viewBtn{
						position: absolute;
						right: 0;
						bottom: -40%;
						color: #169BD5;
						padding: 10px;
						border: 1px solid #169BD5;
						text-shadow: 3px 3px 5px rgba($color: #169BD5, $alpha: 0.6);
						border-radius: 50%;
					}
				}

				.check {
					margin: 10px 0;
				}

				.txt {
					padding-left: 5px;
				}
			}

			.tab__item-title {
				font-size: 18px;
			}

			.about {
				.title {
					margin-bottom: 10px;
				}

				.facility {
					padding: 10px;
					box-sizing: border-box;
				}

				.poster {
					.title {
						padding-left: 10px;
					}
				}

				image {
					width: 100%;
					display: block;
				}

				.list {
					text {
						display: inline-block;
						width: 33%;
						padding: 5px 0;
						color: #169BD5;
						text-align: center;
					}
				}
			}

			.roomtype {
				.item {
					padding: 10px;
					box-sizing: border-box;

					.msg {
						display: flex;

						image {
							width: 160px;
							background: #ccc;
						}

						.right {
							margin-left: 15px;
							flex: 1;

							button {
								background: #169BD5;
								color: #fff;
							}

							.pass,
							.curr {
								font-size: 25px;
								font-weight: bold;
							}

							.pass {
								text-decoration: line-through;
							}

							view {
								margin-bottom: 10px;
							}
						}
					}

					.title {
						margin: 10px 0;
						font-size: 18px;
						font-weight: bold;
					}
				}
			}
		}
	}
</style>
