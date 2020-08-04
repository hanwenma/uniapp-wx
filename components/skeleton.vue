<template>
	<view class="skeleton">
		<view class="head"></view>
		<view class="item" :class="{it:!(index%2)}" 
		v-for="(item,index) in 10" :key="index"></view>
	</view>
</template>

<script>
	export default {
		
	}
</script>

<style lang="scss">
	.skeleton {
		@keyframes bg{
		   from{background:#C0C0C0;}
		   to{background:#F1F1F1}
		}
		
		.head {
			width: 70px;
			height: 70px;
			border-radius: 50%;
			animation: bg 1s ease-in-out infinite;
		}

		.item {
			margin: 10px 0;
			height: 20px;
			border-radius: 10px;
			animation: bg 1s ease-in-out infinite;
		}
		
		.it{
			width: 80%;
		}
	}
</style>
