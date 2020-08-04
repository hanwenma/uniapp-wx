<template>
	<view id="mine">
		<view class="user">
			<image :src="attr" mode=""></image>
			<image :src="isLogin?'../../static/login.jpg':'../../static/logout.jpg'" class="login"></image>
			<button class="text" open-type="getUserInfo" @getuserinfo="getUserInfo">{{nickname}}</button>
		</view>

		<view class="con">
			<navigator class="item" @click="showTips(item.url)" :url="isLogin?item.url:'/login'" v-for="(item,index) in conItem" :key="index">
				{{item.title}}
				<image v-if="item.url!='#'" src="../../static/arrow.png" mode="" class="arrow"></image>
				<UniIcons
				 v-else
				 type="scan" 
				 size="25" 
				 color="#999" />
			</navigator>
		</view>
		
		<button type="default" @click="logout" class="logout" v-if="isLogin">退出登录</button>
		
		<uni-drawer :visible="isShow" class="drawer" @close="hideDrawer">
		    <view class="uni-title">
		        扫描结果
		    </view>
			<view class="result" v-for="(item,index) in codes" :key="item.title">
				<text class="item item1">{{item.title}}</text>
				<view class="item item2" @click="textPaste(item.con)">{{item.con}}</view>
				<view class="progress-box">
					<progress :percent="percent" 
					active stroke-width="2" 
					activeColor="#169BD5"
					:backgroundColor="index==0?'#9900FF':'#FF9999'"/>
				</view>
			</view>
			<image src="../../static/ok.jpg" mode="" />
		</uni-drawer>
	</view>
</template>

<script>
	import { mapState } from  'vuex';
	import UniIcons from "../../components/uni-icons/uni-icons.vue";
	import UniDrawer from "../../components/uni-drawer/uni-drawer.vue";
	export default {
		components:{
			UniIcons,
			UniDrawer
		},
		onLoad() {
			this.msg = uni.getStorageSync("userInfo");
			if(this.msg){
				this.attr = this.msg.attr;
			    this.nickname = this.msg.nickName;
			}
			this.login();
		},
		computed:{
		    ...mapState({
		      refresh: state=>state.mineRefresh
		    })
		},
		data() {
			return {
				isShow: false,
				isLogin: false,
				percent:'0',
				nickname: "点击此授权！",
				attr: "http://img5.imgtn.bdimg.com/it/u=1426822276,3750139757&fm=26&gp=0.jpg",
				codes:[{
					title:"二维码类型：",
					con:'暂无结果'
				},{
					title:"二维码信息：",
					con:'暂无结果'
				}],
				conItem: [{
						title: "个人资料",
						url: "./personal/personal"
					},
					{
						title: "消息中心",
						url: "./message/message"
					},
					{
						title: "呼叫管家",
						url: "./steward/steward"
					},
					{
						title: "意见反馈",
						url: "./suggestion/suggestion"
					},
					{
						title: "扫一扫",
						url: "#"
					}
				]
			};
		},
		methods: {
			// 点击复制
			textPaste(val){
			    wx.showToast({
			      title: '复制成功',
			    })
			    wx.setClipboardData({
			      data: val,
			      success: function (res) {
			        wx.getClipboardData({    //这个api是把拿到的数据放到电脑系统中的
			          success: function (res) {
			            console.log(res.data) // data
			          }
			        })
			      }
			    })
			  },
			  // 退出登录
			  logout(){
				  uni.clearStorage();
				  uni.showToast({
				  	title: '退出登录',
					success() {
						Page.onLoad();
					}
				  });
			  },
			// 获得用户信息授权
			async getUserInfo() {
				if (!this.isLogin) {
					// 获得用户信息
					uni.getSetting({
						success: (res) => {
							if (res.authSetting["scope.userInfo"]) {
								uni.getUserInfo({
									success: (res) => {
										uni.showLoading({
											mask:true,
											title:"授权中..."
										});
										let attr = uni.getStorageSync("userInfo").attr;
										attr && (res.userInfo.avatarUrl = attr);
										this.setUseInfo(res.userInfo);
									},
									fail: (res) => {
										console.log(res);
									}
								})
							}
						},
						fail: (err) => {
							console.log(err);
						}
					});
				}
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
				if (rs.result._id) {
					await uni.setStorage({
						key: 'userId',
						data: {
							id: rs.result._id
						}
					});
					// 使得当前页面重新加载
					getCurrentPages()[0].onLoad();
					uni.hideLoading();
				};
			},
			async getUser(id) {
				let rs = await wx.cloud.callFunction({
					name: "getUserById",
					data: {
						id
					}
				});
				let msg = rs.result.data[0];
				this.nickname = msg.nickName;
				this.attr = msg.attr;
				uni.setStorage({
					key: 'userInfo',
					data: msg
				});
			},
			showTips(url) {
				if (!this.isLogin) {
					uni.showToast({
						icon: "none",
						title: "请先授权在进行此操作！"
					});
				}else if(url=="#"){
					// 允许从相机和相册扫码
					wx.scanCode({
					  onlyFromCamera: false,
					  scanType: "qrCode",
					  success: (res)=>{
						this.isShow = true;
						this.codes[0].con = res.scanType;
						this.codes[1].con = res.result;
						this.percent = '100';
					  },
					  fail:(err)=>{
						uni.showToast({
						  icon:'none',
						  title:'扫码失败，请确保你扫描的是二维码！',
						  duration:3000
						});
					  }
					});
				}
			},
			 login(){
				let id = uni.getStorageSync("userId").id;
				if (id) {
					this.getUser(id);
					this.isLogin = true;
				}
			},
			hideDrawer(){
				this.isShow = false;
				this.percent = '0';
			}
		}
	}
</script>

<style lang="scss">
	#mine {
		.logout{
			color: #999;
			border-radius: 5px;
			width: 90%;
			margin: 0 auto 20px;
			display: block;
		}
		.user {
			position: relative;
			position: relative;
			padding: 30px 20px;
			display: flex;
			align-items: center;
			box-shadow: 5px 5px 5px rgba($color: #000000, $alpha: 0.6);
			image {
				width: 80px;
				height: 80px;
				border-radius: 5px;
				background: #fff;
				box-shadow: 0 0 10px rgba($color: #fff, $alpha: 0.8);
			}
			.login{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: -1;
				border-radius: 0;
			}

			.text {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				padding: 0 20px;
				font-size: 25px;
				border-radius: 0 10px 10px 0px;
				color: #fff;
				background: rgba($color: #000000, $alpha: 0.6);
			}
		}

		.con {
			margin-top: 30px;
			padding-bottom: 30px;
			.item {
				padding: 0 10px;
				box-sizing: border-box;
				height: 60px;
				line-height: 60px;
				border-bottom: 0.5px solid #C0C0C0;
				border-top: 0.5px solid #C0C0C0;
				box-shadow: 0 0 5px rgba($color: #000000, $alpha: 0.1);
				display: flex;
				justify-content: space-between;
				align-items: center;
				.arrow {
					width: 20px;
					height: 20px;
				}
			}
		}
	    
	    .drawer{
			.uni-title{
				font-size: 20px;
				font-weight: bold;
				text-align: center;
				background: #169BD5;
				color: #fff;
				padding: 10px;
				margin-bottom: 26px;
			}
			image{
				width: 70%;
				height: 100px;
				position: absolute;
				bottom: 10%;
				left: 10%;
			}
			.result{
				padding: 10px;
				.item{
					padding: 10px 0;
					&.item1{
					  font-size: 18px;
					  font-weight: bold;
				    }
					&.item2{
					  font-size: 16px;
					  color: #169BD5;
					  word-break: break-word;
					  font-weight: bold;
				    }
				}
			}
		}
	}
</style>
