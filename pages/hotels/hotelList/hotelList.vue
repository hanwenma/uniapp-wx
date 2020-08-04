<template>
	<view id="hotelList"> 
	<!-- 头部 -->
	<view class="top">
		<!-- 左侧 -->
		<view class="left">
			<view class="start">
				住<text>{{condition.starTime}}</text>
			</view>
			<view class="end">
				离<text>{{condition.endTime}}</text>
			</view>
		</view>
		<!-- 右侧 -->
		<view class="center">
			<view class="locate">{{condition.city}}</view>
			<input type="text" 
			@input="keywordSearch()"
			v-model="inputVal" 
			placeholder="搜索酒店名或地标" />
		</view>
		<!-- 定位 -->
		<uni-icons type="location-filled" @click="toMap" size="25" class="dw" />
	</view>
	
	<!-- 列表部分 -->
		<view class="list">
			<view class="item" 
			@click="toDetail(item._id)"
			v-for="(item,index) in hotels" 
			:key="index">
				<view class="top">
					<image :src="item.hotelPic[0]"></image>
					<text class="grade">{{item.grade}}</text>
				</view>
				<view class="com">
					<text class="title left">{{item.title}}酒店</text>
					<text class="right">标价：{{item.price}}</text>
				</view>
				<view class="com">
					<text class="distance left">直线距离{{ item.distance}}公里</text>
					<text class="right">会员价：{{item.vipPrice}}</text>
				</view>
			</view>
		</view>
		
	<!-- 加载更多 -->
		<uniLoadMore :status="loadStatus" size="25"/>
	</view>
</template>

<script>
	import uniIcons from "../../../components/uni-icons/uni-icons.vue"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	import msTabs from "@/components/ms-tabs/ms-tabs.vue"
	let timer = 0;
	export default {
		components:{
			uniIcons,
			uniLoadMore
		},
	    async onLoad(ev){
		    // 得到传递的参数
		    this.condition = ev; 
			// 初始化数据
			await this.getHotels({count:10,page:1});
			 this.hotels = this.data;
		},
		data() {
			return {
				canLoad: true,
				data:[],
				loadStatus:"loading",// noMore
				count:10,
				page:1,
				condition:{},
				inputVal:"",
				hotels:[]
			};
		},
		methods:{
		    async onPullDownRefresh(){
				this.canLoad = true;
				this.page = Math.ceil(Math.random()*10);
			    await this.getHotels({page:this.page,count:this.count});
			    this.hotels = this.data;
			},
			onReachBottom(){
				this.getHotels({page:this.page,count:this.count});
				if(this.canLoad){
					this.hotels = [...this.hotels,...this.data];
				}
			},
		    async getHotels({count,page}) {
				// 显示加载
				uni.showNavigationBarLoading();
				uni.showLoading({
					mask:true,
					title:"加载中..."
				});
				let self = this;
				self.page += 1;  
				
			  if(self.canLoad&&self.page<=10){
			   await wx.cloud.callFunction({
			      name: "getHotels",
				  data:{
					  page,
					  count
				  }
			    })
			    .then(res=>{
			      self.data = res.result.data;
				  self.canLoad = true;
			    })
			    .catch(err=>{
			      console.log("失败了：", err);
			    })
				.finally(()=>{
					// 关闭加载
					uni.hideLoading();
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh();
				});
				}else{
					self.canLoad = false;
					self.loadStatus = "noMore";
					// 关闭加载
					uni.hideLoading();
					uni.hideNavigationBarLoading();
				}
			  },
			toDetail(id){
				uni.navigateTo({
					url:"../hotelDetail/hotelDetail?id="+id
				});
			},
			keywordSearch(){
			    timer && clearTimeout(timer);//如果500毫秒内又一次触发，则会重新计算时间
				if(!this.inputVal) return;
				timer = setTimeout(async () => {
					this.canLoad = true;
					this.page = Math.ceil(Math.random()*10);
					await this.getHotels({page:this.page,count:this.count});
					this.hotels = this.data;
				}, 1000);
			},
			toMap(){
				uni.navigateTo({
					url:"../../map/map"
				});
			}
		}
	}
</script>

<style lang="scss">
#hotelList{
	@mixin text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.top{
		display: flex;
		align-items: center;
		padding: 10px 5px;
		box-sizing: border-box;
		
		.uni-icons.data-v-d4989bdc{
			padding-bottom: 5px;
			border-bottom: 1px solid #000;
			color: "#000";
		}
		
		.left{
			width: 30%;
			background:rgba($color: #169BD5, $alpha: 0.5);
			color: #fff;
			border-radius: 5px;
			view{
				font-size: 14px;
				margin: 5px 0;
				box-sizing: border-box;
				padding-left: 5px;
				text{
					font-size: 12px;
					padding-left: 5px;
				}
			}
		}
		.center{
			flex: 1;
			margin: 0 5px;
			display: flex;
			align-items: center;
			font-size: 14px;
			height: 90%;
			padding: 5px;
			border-radius: 3px;
			background: #eee;
			
			.locate{
				width: 40px;
				border-right: 1px solid #FFFFFF;
				color: #333;
				font-weight: bold;
			}
			input{
				height: 100%;
				padding-left: 5px;
				color: #333;
			}
		}
		.dw{
			width: 25px;
		}
	}
	.list{
		.item{
			padding: 10px 5px;
			box-sizing: border-box;
			box-shadow: 0px 2px 5px rgba($color: #000000, $alpha: 0.8);
			width: 96%;
			margin: 0px auto 10px;

			.com{
				margin: 5px;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.top{
				position: relative;
				padding: 0;
				.grade{
					position: absolute;
					left: 10px;
					bottom: 10px;
					padding: 5px;
					border-radius: 5px;
					color: #555555;
					background: rgba($color: #fff, $alpha: 0.6);
				}
				image{
					width: 100%;
					height: 200px;
					background: #C8C7CC;
				}
			}
		    .com{
				.title{
					font-size:20px;
					font-weight: bold;
				}
				.left{
					flex: 1;
				}
				.right{
					text-align: right;
					width: 40%;
				}
			}
		}
	}
}
</style>
