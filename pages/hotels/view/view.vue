<template>
	<view>
		 <web-view 
		 :webview-styles="webviewStyles" 
		 :src="url"></web-view>
	</view>
</template>

<script>
	import { mapState } from  'vuex';
	export default {
		data(){
			return {
				url:"##"
			}
		},
		onLoad(){
			this.url = this.urls[Math.floor(Math.random()*(this.urls.length-1))];
		},
		computed:{
			...mapState({
				urls: state=>state.viewApi
			})
		}
	}
</script>

<style>

</style>
