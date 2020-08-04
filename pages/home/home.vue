<template>
	<view id="home">
		<!-- 头部 -->
		<view class="header">
			<uni-icons type="search" size="25" class="fdj" />
			<input type="text" placeholder="请输入关键字搜索" v-model="inputVal" @input="keywordAction" class="search" />
			<view class="right" @click="locateAction">
				<uni-icons type="location" size="25" class="dw" />
				<text>{{locate}}</text>
			</view>
			<!-- 关键字列表 -->
			<view class="list">
				<view class="list-item" v-for="(item,index) in keywords" @click="searchAction(item)" :key="index">
					{{item}}
				</view>
			</view>
		</view>

		<!-- 轮播图 -->
		<SlideImg :banner="banner" />

		<!-- 酒店条件 -->
		<view class="condition">
			<!-- 左侧 城市选择 -->
			<view class="left">
				<view class="title">您要去哪？</view>
				<text @click="showCity" class="city">{{city}}</text>
			</view>
			<!-- 右侧 日期选择 -->
			<view class="right">
				<DatePick @setDate="dateAction" />
			</view>

			<!-- 城市列表 -->
			<CitysList v-if="visible" @hideCity="hideCity" />
		</view>

		<!-- 条件筛选 -->
		<view class="options">
			<!-- 标签栏 -->
			<view class="tabs">
				<button size="mini" :class="{active:tabsIndex==0}" type="default" @click="tabsAction(0)">酒店</button>
				<button size="mini" :class="{active:tabsIndex==1}" type="default" @click="tabsAction(1)">公寓</button>
				<button size="mini" :class="{active:tabsIndex==2}" type="default" @click="tabsAction(2)">民宿</button>
			</view>
			<!-- 价格 -->
			<view class="priceBeteew">
				价格 <input type="number" placeholder="请输入金额" v-model="minPrice" />
				——
				<input type="number" placeholder="请输入金额" v-model="maxPrice" />
			</view>
			<!-- 查找按钮 -->
			<button type="default" class="button" @click="searchAction(null)">查找酒店</button>
		</view>

		<!-- 语音按钮 -->
		<view class="record">
			<view>
			  <text class="txtTil">{{'猜你想说：'}}</text>
			  <text class="txtcon">{{vioceText}}</text>
			</view>
			<view>
			   <text class="txtTil">{{'Tanslation：'}}</text>
			   <text class="txtcon">{{translation}}</text>
			</view>
			<view class="voice">
			  <uniIcons type="mic-filled" size="50" @touchend="stopRecord" @touchstart="startRecord" color="#169BD5" />
			</view>
		</view>


		<!-- 酒店平台介绍 -->
		<view class="introduce">
			<text>酒店平台介绍</text>
			<view class="con">
				Hotels.com 好订网是一家领先的在线住宿预订网站。我们对旅游行业充满激情。每一天，我们通过 90 个本地网站和 41
				种语言为数百万旅客提供相关的旅游资讯，向他们大力推广精彩优惠。因此，在帮助客户找到心目中的理想酒店、度假短租、度假村、公寓、旅馆或树屋方面，我们都能为您提供服务。我们有数十万家合作酒店遍布 200
				多个国家和地区，还提供无与伦比的价格保证。除了有趣且简单易用的网站，我们也为客户提供创新的在线工具以及广受好评的移动端 App。
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "../../components/uni-icons/uni-icons.vue"
	import CitysList from "../../components/cityList.vue"
	import DatePick from "../../components/datePick.vue"
	import SlideImg from "../../components/slideImg.vue"
	import Http from "../../request/index.js"
	import Api from "../../request/api.js"

	let qqmapsdk = null;
	let QQMapWX = require("qqmap-wx-jssdk/qqmap-wx-jssdk.min.js");
	// 微信同声传译
	var plugin = requirePlugin("WechatSI");
	let manager = plugin.getRecordRecognitionManager();

	export default {
		components: {
			uniIcons,
			CitysList,
			DatePick,
			SlideImg
		},
		onLoad() {
			qqmapsdk = new QQMapWX({
				key: 'HF2BZ-64566-3JXSF-MNYFH-XYJIF-6SBIA' //这里自己的key秘钥进行填充
			});
			// 设置用户位置信息
			this.getLocationFromUser();
			// 同声传译
			let self = this;
			manager.onStop = function(res) {
				console.log("record file path", res.tempFilePath)
				console.log("result", res.result);
				self.vioceText = res.result;
				plugin.translate({
				    lfrom:"zh_CN",
				    lto:"en_US",
				    content: res.result,
				    success: function(rs) {
				        if(rs.retcode == 0) {
							self.translation = rs.result;
							self.searchAction();
				        } else {
				            console.warn("翻译失败", rs)
				        }
				    },
				    fail: function(rs) {
				        console.log("网络失败",rs)
				    }
				})
			}
			manager.onStart = function(res) {
				console.log("成功开始录音识别", res)
			}
			manager.onError = function(res) {
				console.error("error msg", res.msg)
			}
		},
		data() {
			return {
				banner: ["https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1663648085,1909453417&fm=26&gp=0.jpg",
				    "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3653178293,336057315&fm=26&gp=0.jpg",
					"http://img2.imgtn.bdimg.com/it/u=2089202687,1622906025&fm=26&gp=0.jpg",
					"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1557021266,2285162138&fm=26&gp=0.jpg",
					"http://img3.imgtn.bdimg.com/it/u=337065087,273125202&fm=26&gp=0.jpg"
				],
				inputVal: "",
				// 这是城市选择的参数
				visible: false,
				city: "选择",
				block: "",
				locate: "未获得定位",
				night: 0,
				starDate: "",
				endDate: "",
				tabsIndex: 0,
				tab: "酒店",
				maxPrice: NaN,
				minPrice: NaN,
				keywords: [],
				vioceText: "按下开始，松开结束！",
				translation:"Press start, release end!"
			};
		},
		methods: {
			// 开始录音
			//开始录制语音
			startRecord(e) {
				manager.start({
					duration: 30000,
					lang: "zh_CN"
				});
				uni.showToast({
					icon: "none",
					title: "录音开始"
				});
			},
			//停止录音
			stopRecord() {
				manager.stop();
				uni.showToast({
					icon: "loading",
					title: "正在识别...",
					duration: 2000
				})
			},
			// 获取用户位置
			getLocationFromUser(){
				uni.getLocation({
					type: 'wgs84',
					success: ({longitude,latitude}) => {
						this.getLocal(latitude, longitude);
					}
				});
			},
			// 获得当前位置信息
			getLocal(latitude, longitude) {
				let vm = this;
				this.$store.commit('setLocation', {
					latitude,
					longitude
				});
				qqmapsdk.reverseGeocoder({
					location: {
						latitude: latitude,
						longitude: longitude
					},
					success: (res) => {
						this.city = res.result.ad_info.city;
						this.block = res.result.ad_info.district;
						this.locate = this.city + this.block;
					},
					fail: (err) => {
						console.log(err);
					}
				})
			},
			locateAction() {
			  wx.getSetting({
			    success: (res) => {
			      if (!res.authSetting["scope.userLocation"]){
					wx.openSetting({
					  success:(res)=> {
						if (res.authSetting["scope.userLocation"]) {
						  this.getLocationFromUser();
						  uni.navigateTo({
						  	url: "../map/map"
						  });
						}
					  }
					});
				   }else{
					   uni.navigateTo({
					   	url: "../map/map"
					   });
				   }
				}
			  });
					
			},
			searchAction(item) {
				// 如果最小最大的价格都存在，必须要合理
				if (this.minPrice && this.maxPrice) {
					// 最大值不能小于最小值
					if (this.maxPrice - this.minPrice < 0) {
						uni.showToast({
							icon: "none",
							title: "最大价格不能小于最小价格"
						})
						return;
					}
				}
				// 检验晚数
				if (this.night <= 0) {
					uni.showToast({
						icon: "none",
						title: "您还没有选择离店时间哦！"
					})
					return;
				}
				let locate = item ? item : this.locate;
				this.inputVal = "";
				this.keywords = [];
				uni.setStorage({
					key: 'info',
					data: {
						city: this.city,
						starDate: this.starDate,
						endDate: this.endDate,
						night: this.night
					},
				});
				uni.navigateTo({
					url: `../hotels/hotelList/hotelList?city=${this.city}&block=${this.block}&minPrice=${this.minPrice}&maxPrice=${this.maxPrice}&night=${this.night}&starTime=${this.starDate}&endTime=${this.endDate}`
				});
			},
			showCity() {
				this.visible = true;
			},
			// 城市选择的关闭事件
			hideCity(rs) {
				this.visible = false;
				// 关闭事件，若有返回值，就说明是确认选择城市，否则即为取消
				if (rs) {
					this.city = rs.city;
					this.block = rs.block;
					this.locate = rs.city + rs.block;
				}
				this.nearby_search(this.locate);
			},
			// 附近搜索
			nearby_search(val) {
				//调用地址解析接口
				qqmapsdk.geocoder({
					//获取表单传入地址
					address: val, //地址参数
					success: ({
						result
					}) => { //成功后的回调
						var latitude = result.location.lat;
						var longitude = result.location.lng;
						this.getLocal(latitude, longitude);
					},
					fail: function(error) {
						console.error(error);
					}
				});
			},
			tabsAction(num) {
				let tab = "";
				switch (num) {
					case 0:
						tab = "酒店";
						break;
					case 1:
						tab = "公寓";
						break;
					case 2:
						tab = "民宿";
						break;
				}
				this.tabsIndex = num;
				this.tab = tab;
			},
			async keywordAction() {
				const http = new Http();
				const {
					autocomplete_terms
				} = await http.get(Api.KEYWORD_API, {
					key: "d306zoyjsyarp7ifhu67rjxn52tv0t20",
					language: "zh",
					locale: "zh",
					num_results: 5,
					api_version: "1.1.13",
					vertical_refinement: "homes",
					options: "should_filter_by_vertical_refinement%7Cshould_show_stays",
					user_input: this.inputVal
				});
				this.keywords = autocomplete_terms.map(item => item.display_name);
			},
			dateAction(val) {
				this.night = val.night;
				this.starDate = val.starTime;
				this.endDate = val.endTime;
			}
		}
	}
</script>

<style lang="scss">
	#home {
		box-sizing: border-box;
		overflow-x: hidden;
		.record {
			padding: 5px 10px;
			.voice{
				display: flex;
				justify-content: center;
			}
			view{
				display: flex;
				justify-content: center;
				text{
					padding: 5px 0;
				}
				.txtTil{
				   width: 30%;
				}
				.txtcon{
					width: 80%;
				}
			}
		}

		.header {
			padding: 10px;
			box-sizing: border-box;
			position: relative;
			align-items: center;
			display: flex;
			position: relative;

			.list {
				position: absolute;
				top: 42px;
				width: 60%;
				background: #fff;
				z-index: 10;
				box-shadow: 0px 1px 5px #000;

				.list-item {
					padding: 10px 5px;
					font-size: 14px;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
					border-bottom: 0.5px solid #999;
				}
			}

			.fdj {
				position: absolute;
				left: 15px;
				top: 12px;
			}

			.right {
				flex: 1;
				font-size: 14px;
				text-align: right;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			.search {
				border: 1px solid #999;
				border-radius: 5px;
				padding: 0 10px 0 30px;
				box-sizing: border-box;
				width: 60%;
				font-size: 14px;
				height: 30px;
			}
		}

		.condition {
			display: flex;
			padding: 5px;
			box-sizing: border-box;

			.left {
				width: 30%;
				text-align: center;
				border-bottom: 1px solid #999;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.title {
					color: #555;
				}

				.city {
					line-height: 82px;
					font-size: 20px;
				}
			}

			.right {
				flex: 1;
				border-bottom: 1px solid #999;
			}
		}

		.options {
			margin: 10px 0;
			text-align: center;

			.tabs {
				display: flex;
				justify-content: space-around;

				button: {
					width: 20%;
				}

				button.active {
					background: #169BD5;
					color: #fff;
				}
			}

			.priceBeteew {
				margin: 10px 0;
				display: flex;
				justify-content: center;
				align-items: center;

				input {
					border-radius: 5px;
					border: 1px solid #999;
					display: inline-block;
					width: 30%;
					font-size: 12px;
					height: 30px;
					box-sizing: border-box;
					text-align: center;
					padding: 0 10px;
					margin: 10px;
				}
			}

			.button {
				width: 60%;
				background: #169BD5;
				margin: 30px auto;
				color: #fff;
			}
		}

		.introduce {
			box-sizing: border-box;
			padding: 10px;

			text {
				font-weight: bold;
			}

			.con {
				text-indent: 2rem;
				line-height: 30px;
				white-space: 10px;
				color: #888;
			}
		}
	}
</style>
