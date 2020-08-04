<template>
	<view id="steward">
		<!-- 用户信息部分 -->
		<view v-for="(item,index) in dataList" :key="index" class="msg">
			<text class="left">{{item.title}}:</text>
			<input type="text" v-model="item.content" :placeholder="item.pla"/>
		</view>
		
		<!-- 用户描述 -->
		<view class="desc">
			<view class="top">详情描述</view>
			<textarea class="con" placeholder="在这里输入您的描述......" v-model="desc"></textarea>
		</view>
		
		<!-- 提交按钮 -->
		<button type="default" class="commit" @click="commitAction">提交</button>
	</view>
</template>

<script>
	export default {
		onLoad({userTel,roomNum}){
			this.dataList[0].content = roomNum;
			this.dataList[1].content = userTel;
			this.userId = uni.getStorageSync("userId").id;
		},
		data() {
			return {
				userId:"",
				dataList:[
					{
						title:"入住房间号",
						content:"",
						pla:"请输入房间号"
					},
					{
						title:"联系方式",
						content:"",
						pla:"请输入手机号"
					}
				],
				desc:""
			};
		},
	   methods:{
		  async commitAction(){
			   let room = this.dataList[0].content;
			   let tel = this.dataList[1].content;
			   if(!(room && tel && this.desc)){
				   uni.showToast({
				   	icon:"none",
					title:"请输入完整后在进行提交！"
				   });
				   return;
			   }
			  let msg = {
				  "desc": this.desc, // 反映问题的描述
				  "userId": this.userId, // 关联 users
				  "roomNum": this.dataList[0].content, // 房间号
				  "userTel": this.dataList[1].content
			  };
			  let rs = await wx.cloud.callFunction({
				  name:"setStewards",
				  data:msg
			  });
			  uni.showToast({
			  	title:"管家已接收您提交的问题，我们尽快为您解决！"
			  });
			 uni.navigateBack();
		   }
	   }
	}
</script>

<style lang="scss">
#steward{
	padding: 20px;
	box-sizing: border-box;
	margin-top: 30px;
	font-size: 20px;
	background: url(data:image/jpeg;base64,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);
	background-size: 100% 100%;
	background-repeat: no-repeat;
	border-radius: 5px;
	.msg{
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
		padding: 5px;
		background: rgba($color: #fff, $alpha: 0.7);
		input{
			width: 58%;
			border-radius: 5px;
			height:30px;
			padding: 0 5px;
			font-size: 16px;
			box-sizing: border-box;
			border: 0.5px solid #169BD5;
		}
	}
    .desc{
		margin: 20px 0;
		padding: 5px;
		background: rgba($color: #fff, $alpha: 0.7);
		border-radius: 5px;
		.con{
			margin-top: 10px;
			font-size: 18px;
			line-height: 25px;
			height: 200px;
			border: 1px solid #169BD5;
			width: 100%;
			word-break:all;
			padding: 10px 5px;
			border-radius: 5px;
			box-sizing: border-box;
		}
	}
	.commit{
		width: 40%;
		margin: auto;
		background: #169BD5;
		color: #fff;
	}

}
</style>
