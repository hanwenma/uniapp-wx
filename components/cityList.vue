<template>
	<view class="pickerbox">
		
		<view class="btns">
			<button type="default" size="mini" @click="cancelAction">取消</button>
			<button type="primary" size="mini" @click="confirmAction">确定</button>
		</view>
		
		<picker-view class="picker-view-box" :indicator-style="indicatorStyle" :value="value" @change="bindChange">
			<picker-view-column class="pickitem">
				<view class="item" v-for="(item,index) in city" :key="index">{{item}}</view>
			</picker-view-column>
			<picker-view-column class="pickitem">
				<view class="item" v-for="(item,index) in block" :key="index">{{item}}</view>
			</picker-view-column>
		</picker-view>
		
	</view>
</template>

<script>
	import citys from "../citydata/city.js"
	export default {
		data: function() {
			const city = [];
			const blocks = [];
			citys.map(item => {
				item.city.map(ct => {
					city.push(ct.name);
					blocks.push(ct.area);
				})
			});
			return {
				lastIndex: 0,
				title: 'picker-view',
				c: city[0],
				b: blocks[0][0],
				city,
				block: blocks[0],
				blocks,
				indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`
			}
		},
		methods: {
			bindChange: function(e) {
				const val = e.detail.value;
				this.block = this.blocks[val[0]];
				this.c = this.city[val[0]];
				this.b = this.block[val[1]];
				this.lastIndex = val[0];
			},
			
			// 点击确定的事件
			confirmAction(){
				// 关闭选择器
				this.$emit("hideCity",{city:this.c,block:this.b});
			},
			
			// 点击取消的事件
			cancelAction(){
				// 关闭选择器
				this.$emit("hideCity");
			}
		}
	}
</script>

<style lang="scss">
	.pickerbox {
		.picker-view-box {
			z-index: 20;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 210px;
			background: #C8C7CC;
		}
		
		.pickitem {
			height: 100%;
			text-align: center;
		}
		
		.pickitem .item {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.btns {
			position: fixed;
			bottom: 210px;
			left: 0;
			width: 100%;
			display: flex;
			justify-content: space-between;
			padding: 10px 0;
			background-color: #f1f1f1;
			z-index: 10;
		}
		
		.btns button {
			width: 75px;
		}
	}
</style>
