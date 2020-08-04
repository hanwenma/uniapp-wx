// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"test-xl206",
  traceUser:true
});

// 云函数入口函数
exports.main = async (event, context) => {
	// 获得 page 和 count
	let {page,count} = event;
	
   //  获取数据库对象
    let db = cloud.database();
   //  拿到集合对象
    let hotelCollect = db.collection("hotels"); 
	
	// 获取数据
	let rs = await hotelCollect.skip((page-1)*count).limit(count).get();
	
    return rs;
}