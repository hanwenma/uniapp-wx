<template>
	<view id="personal">
		<!-- 用户个人信息 -->
		<view class="user">
			<view class="item">
				<text class="text">头像</text>
				<image :src="attr" mode="" @click="changeAction"></image>
			</view>
			<view class="item">
				<text class="text">微信昵称</text>
				<text>{{nickname}}</text>
			</view>
		</view>

		<!-- 其他信息 -->
		<view class="message">			
			<view class="mess-item" v-for="(item,index) in message" :key="index">
				<text class="title">{{item.title}}</text>
				<view class="con">
					<template v-if="item.title!='发票领取时间'">
						<view class="con-item" v-for="(im,id) in item.con" :key="id">
							<text class="left">{{im.left}}</text>
							<input v-model="im.right" 
							placeholder="完善个人信息......"
							class="right active" />
						</view>
					</template>
					<template v-else>
						<radio-group v-els @change="radioChange">
						  <view v-for="(im,id) in item.con" :key="id" class="radio">
							<radio :value="im.right" :checked="getInvoice==im.right" />
							<text class="radio_r">{{im.right}}</text>
				          </view>
				       </radio-group>
                  </template>
                </view>
            </view>
        </view>
    
	    <!-- 保存修改 -->
		<button type="default" class="save" @click="saveAction">保存修改</button>
	</view>
</template>

<script>
	export default {
		onLoad(){
			this.initData();
		},
		onUnload(){
			uni.navigateBack({
				success: (e) => {
					let page = getCurrentPages().pop();
					if (page == undefined || page == null) return;
					page.onLoad();
				}
			})
		},
		data() {
			return {
				attr: "http://img1.imgtn.bdimg.com/it/u=2548703246,1137028007&fm=11&gp=0.jpg",
				nickname: "",
				getInvoice:"离店时领取", // 领取发票的方式
				message: [{
						title: "入住信息",
						con: [{
								left: "姓名",
								right: ""
							},
							{
								left: "手机号",
								right: ""
							}
						]
					},
					{
						title: "发票信息",
						con: [{
								left: "发票抬头",
								right: ""
							},
							{
								left: "信用代码",
								right: "8888-6666"
							},
							{
								left: "邮箱",
								right: ""
							}
						]
					},
					{
						title: "发票领取时间",
						con: [{
								left: 1,
								right: "离店时领取"
							},
							{
								left: 1,
								right: "电子发票"
							}
						]
					}
				]
			}
		},
		methods: {
			initData(){
				this.msg = uni.getStorageSync("userInfo");
				let self = this;
				this.attr = this.msg.attr;
				this.nickname = this.msg.nickName;
				this.message = this.message.map((item,index)=>{
					switch (index){
						case 0:
						 item.con[0].right = this.msg.name;
						 item.con[1].right = this.msg.tel;
						 return item;
						case 1:
						 item.con[0].right = this.msg.invoiceTitle;
						 item.con[1].right = this.msg.creditCode;
						 item.con[2].right = this.msg.email;
						 return item;
						case 2:
						 self.getInvoice = this.msg.debitTime;
						 return item;
					}
				});
			},
			radioChange(ev) {
				this.getInvoice = ev.detail.value;
			},
			async saveAction(){
			  let user = {
			     attr: this.attr,
				 creditCode: this.message[1].con[1].right,
				 debitTime:this.getInvoice,
				 email:this.message[1].con[2].right,
				 gender: this.msg.gender,
				 invoiceTitle: this.message[1].con[0].right,
				 name: this.message[0].con[0].right,
				 nickName: this.msg.nickName,
				 openId: this.msg.openId,
				 tel: this.message[0].con[1].right,
				 _id: this.msg._id
			  };
			  
			  // 新数据替换旧数据
			  uni.setStorage({
			  	key: 'userInfo',
			    data: user
			  });
			  
			  // 更新页面数据
			 this.initData();
			 uni.showToast({
			 	title:"数据更新成功"
			 });
			 
			 // 更新数据库数据
			   await wx.cloud.callFunction({
					name: "updateUser",
					data: user
				});
			   getCurrentPages().onLoad();
			},
			// 切换头像
			changeAction(){
			  const uploadTask = uni.chooseImage({
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.getStorageSync("userInfo").attr = this.attr = tempFilePaths[0];
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	#personal {
		padding: 20px 10px;
		box-sizing: border-box;
		.user {
			border-bottom:1px solid #eee;
			.item {
				font-size: 20px;
				display: flex;
				align-items: center;
				margin-bottom: 10px;

				image {
					width: 80px;
					height: 80px;
					border-radius: 5px;
					box-shadow: 0 0 10px rgba($color: #000, $alpha: 0.8);
				}

				.text {
					width: 40%;
				}
			}
		}

		.message {
			.mess-item {
				margin-top: 10px;
				padding-bottom: 10px;
				border-bottom:1px solid #eee;
				.title {
					display: inline-block;
					font-size: 20px;
					padding: 10px 5px;
					border-bottom: 2px solid #169BD5;
				}
				.con{
					font-size: 18px;
				}
				.con-item {
					display:flex;
					align-items:center;
					margin-left:10px;
					margin-top: 10px;
					text {
						display: inline-block;
					}
					.left {
						min-width: 30%;
					}
					.right {
						padding:5px;
						width: 70%;
						border:0.5px solid #fff;
						border-radius: 3px;
					}
					.right.active{
						border-color:#169BD5;
					}
					.radio_r{width: 70%;}
				}
			    .radio{
					margin-top:10px;
					margin-left:10px;
					text{
						margin-left:20px;
					}
				}
			}
		}
	
	    .save{
			width:40%;
			color:#fff;
			margin: 20px auto;
			background:#169BD5;
		}
	}
</style>
