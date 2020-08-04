<template>
	<view class="banner">
		<swiper class="swiper" indicator-color="rgba(0,0,0,0.6)" indicator-active-color="#fff" :circular="true"
		 :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in banner" :key="index">
				<image :src="item"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		props:{
			banner:Array
		}
	}
</script>

<style lang="scss">
   .banner{
		padding:0 2px 10px 2px;
		swiper{
			background: rgba($color: #555555, $alpha: 0.4);
			box-shadow: 0px 2px 5px rgba($color: #169BD5, $alpha: 0.5);
		}
		swiper-item{
			background: #555555;
			color: #fff;
		}
		swiper-item image{
			width: 100%;
			height: 100%;
		}
	}
</style>
