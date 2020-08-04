<template>
	<view class="datePickBox">
		<view class="uni-title uni-common-pl">入住日期</view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<!-- 入住 -->
				<view class="uni-list-cell-left inputbox">
					<picker mode="date" 
					:value="date" 
					:start="startDate" 
					:end="endDate" 
					@change="dateChange1">
					   <input class="timebox" type="text" :value="startTime" />
					   <uni-icons class="icon" type="bars" color="#ddd" size="23" />
					</picker>
					<text class="tips">入住</text>
				</view>
				
				<!-- 离店 -->
				<view class="uni-list-cell-left inputbox">
					<picker mode="date" 
					:value="date" 
					:start="startDate" 
					:end="endDate" 
					@change="dateChange2">
					   <input class="timebox" type="text" :value="endTime" />
					   <uni-icons class="icon" type="bars" color="#ddd" size="23" />
					</picker>
					<text class="tips">离店</text>
					<text class="tips">共{{day}}晚 </text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "./uni-icons/uni-icons.vue"
	export default {
		components: {
			uniIcons
		},
		data() {
			const currentDate = this.getDate({format: true});
			console.log('currentDate:',currentDate);
			return {
				currentDate,
				startTime: currentDate,
				endTime: "",
				day: ""
			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			dateChange1: function(e) {
				let time1 = new Date(e.target.value).getTime();
				let time2 = new Date(this.currentDate).getTime();
				// 入住的时间不能 为过去的时间
				if(time1>=time2){
					this.startTime = e.target.value;
				}else{
				   wx.showToast({
					icon:"none",
				   	title:"您选择的时间不合理！"
				   })
				}
			},
			dateChange2: function(e) {
				let time1 = new Date(e.target.value).getTime();
				let time2 = new Date(this.startTime).getTime();
				// 入住的时间不能 为你过去的时间
				if(time1>time2){
					this.getDaysBetween(time2,time1);
					this.endTime = e.target.value;
					this.$emit("setDate",{endTime:this.endTime,starTime:this.startTime,night:this.day}); 
				}else{
				   wx.showToast({
					icon:"none",
				   	title:"入住时间最少为一个晚上"
				   })
				}
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			// 获得两个日期之间相差的天数
			getDaysBetween(dateString1,dateString2){
			   let  startDate = parseInt(dateString1);
			   let  endDate = parseInt(dateString2);
			   let days=(endDate - startDate)/(1*24*60*60*1000);
			   this.day = days;
			}
		}
	}
</script>

<style lang="scss">
	.datePickBox{
		width: 100%;
		padding-left: 5%;
		border-left: 1px solid #999;
		.uni-title{color: #555;}
		.timebox {
			width: 110px;
			height: 35px;
			padding-left: 10px;
			padding-right: 30px;
			display: inline-block;
			border: 1px solid #ccc;
			border-radius: 5px;
			box-sizing: border-box;
		}
		.inputbox{
			position: relative;
			display: flex;
			align-items: center;
		}
		.inputbox input{
			font-size: 12px;
			color: #999999;
		}
		.icon{
			position: absolute;
			top: 5px;
			left: 80px;
		}
		text.tips {
			padding-left: 5px;
		}
		.uni-list-cell{
			margin: 10px 0 0;
		}
	}
</style>
