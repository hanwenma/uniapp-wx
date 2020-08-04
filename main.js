import Vue from 'vue'
import App from './App'
import store from "./store"

Vue.config.productionTip = false

App.mpType = 'app'

wx.cloud.init({
	 env:"test-xl206",
	 traceUser:true
})

const app = new Vue({
    ...App,
	store
})
app.$mount()
