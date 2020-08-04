<template>
	<view id="grade">
		<skeleton v-if="!info._id" />
		<view class="bigBox" v-else>
			<!-- 头部 -->
			<view class=" top">
				<view class="title">{{info.hotelTitle}}</view>
				<view class="box">{{info.room.type}}</view>
				<view class="box">
					<text>{{info.startTime}}-{{info.endTime}}</text>
					<text>共{{info.night}}晚 {{info.count}}间</text>
				</view>
			</view>
			
			<!-- 评分 -->
			<view class="start">
				<uni-rate 
				max="5" @change="changeAction"
				size="50" value="3"></uni-rate>
				<view class="tips">{{tips[grade-1]}}</view>
			</view>
			
			<!-- 标签 -->
			<view class="tabs">
				<view class="tab" 
				:class="{active:tabs[index].flag}"
				@click="chageTips(index)"
				v-for="(item,index) in tabs" :key="index">
					<text>{{item.con}}</text>
				</view>
			</view>
			
			<!-- 用户描述 -->
			<view class="desc">
				<textarea class="con" placeholder="其他想说的......" v-model="desc"></textarea>
			</view>
			
			<!-- 提交按钮 -->
			<button type="default" class="commit" @click="commitAction">提交</button>
			
		</view>
	</view>
</template>

<script>
	import skeleton from "../../../components/skeleton.vue";
	import uniRate from "../../../components/uni-rate/uni-rate.vue"
	export default {
		components:{
			skeleton,
			uniRate
		},
		onLoad({_id,userId}){
			this.initData(_id);
			this.orderId = _id;
			this.userId = userId;
		},
		data() {
			return {
				tabCon:[],
				info:"",
				"grade": 3, // 用户评分
				"desc": "", // 评价内容
				"orderId": "" ,
				tabs:[
					{flag:false,con:"卫生干净"},
					{flag:false,con:"服务周到"},
					{flag:false,con:"环境安静"},
					{flag:false,con:"早餐好吃"}],
				tips:["非常不满意！！！","不是很满意，给两星鼓励鼓励！","满意度一般，在努努力更好","比较满意，仍可改善！","非常满意，真是太赞了！"],
			};
		},
		methods:{
			async commitAction(){
				let msg = {
					"grade": this.grade, // 用户评分
					"desc": this.desc+"【"+this.tabCon+"】", // 评价内容
					"orderId": this.orderId,
					 userId: this.userId
				};
				await wx.cloud.callFunction({
					name:"setComments",
					data:msg
				});
				await wx.cloud.callFunction({
					name: "updateOrder",
					data: {
						_id: this.orderId,
						status: 4
					}
				});
				uni.showToast({
					title:"感谢您的评价，祝您生活愉快！"
				});
				uni.switchTab({
					url: "../order",
					success: (e) => {
						let page = getCurrentPages().pop();
						if (page == undefined || page == null) return;
						page.onload();
					}
				});
			},
			chageTips(index){
				this.tabs[index].flag = !this.tabs[index].flag;
				if(this.tabs[index].flag){
					this.tabCon.push(this.tabs[index].con); 
				}else{
					this.tabCon = this.tabCon.map(item=>{
						if(item!=this.tabs[index].con){
							return item;
						}
					});
				}
			},
			changeAction({value}){
				this.grade = value;
			},
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
						_id:id
					}
				});
			
				this.info = order.result.data[0];
				
				uni.hideNavigationBarLoading();
				uni.hideLoading();
			}
		}
	}
</script>

<style lang="scss">
#grade{
	padding: 10px;
	box-sizing: border-box;
	.top {
		margin-bottom: 20px;
		padding: 10px 0 15px;
		border-bottom: 0.5px solid #C8C7CC;
		.title {
			font-size: 20px;
			font-weight: bold;
			margin-bottom: 20px;
		}
		.box{
			margin:10px 0;
			display: flex;
			justify-content: space-between;
		}
	}
    .start{
		margin: 60px 0;
		display: flex;
		align-items: center;
		flex-direction: column;
		.tips{
			padding-top: 30px;
			font-size: 16px;
			text-align: center;
			color: #FEBB29;
		}
	}
    .tabs{
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		.tab{
			text-align: center;
			width: 40%;
			margin: 3%;
			border: 0.5px solid #FEBB29;
			border-radius: 5px;
			padding: 15px 0;
			color: #555;
		}
		.tab.active{
			background: #FEBB29;
			color: #fff;
		}
	}
	
	.desc{
		margin: 20px 0;
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
