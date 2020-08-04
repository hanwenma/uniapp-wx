import Vue  from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

const store = new Vuex.Store({
  state:{
	  mineRefresh: false,
	  location:{
		  latitude: "",
		  longitude: ""
	  },
	  orderStatus:{
		  pay: false,// 订单是否支付
		  book: false, // 订单是否生成
		  cancel: false, // 订单是否取消
	  },
	  viewApi:[
		  'https://m.anjuke.com/sz/loupan/437182/quanjing/huxing/422256/',
		  'https://m.anjuke.com/sz/loupan/431897/quanjing/huxing/330936/',
		  'https://m.anjuke.com/sz/loupan/411141/quanjing/huxing/270051/',
		  'https://m.anjuke.com/sz/loupan/250011/quanjing/huxing/399548/',
		  'https://m.anjuke.com/xinfang/fuwu/vr/?loupan_id=456580&housetype_id=517379',
		  'https://m.anjuke.com/sz/loupan/250732/quanjing/huxing/248047/',
		  'https://m.anjuke.com/sz/loupan/460294/quanjing/huxing/497341/'
	  ]
  },
  actions:{},
  mutations:{
	setLocation(state, value){
		state.location.latitude = value.latitude; 
		state.location.longitude = value.longitude; 
	},
	setMineRefresh(state, value) {
	   state.mineRefresh = value;
	},
	setOrderStatus(state,newStatus) {
		state.orderStatus[newStatus[key]] = newStatus[val];
	}
  },
  modules: {}
});

export default store;