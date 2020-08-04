class Http{

  constructor(){
    this.requestTask = null;
  }

  request(url, method, data){
    return new Promise((resolve, reject)=>{
      /* 
          每一次请求都要携带 用户的 登录态 tooken
       */
      let obj = {};
      let tooken = uni.getStorageSync("TOOKEN");
      if(tooken){
        obj.tooken = tooken; 
      }
      this.requestTask = uni.request({
        url,
       data: {
         ...data,
         ...obj
        },
        method,
        success: (res)=>{
          const { data, statusCode, header,autocomplete_terms } = res;
          if(statusCode >= 200 && statusCode < 300){
            resolve(data);
          }else{
            this.handleError(data.message);
            reject(data.message);
          }
        },
        fail: (error)=>{
          this.handleError(error.errMsg);
          reject(error.errMsg);
        }
      })

    })
  };

  get(url, data){
    return this.request(url, 'GET', data);
  };

  post(url, data){
    return this.request(url, 'POST', data);
  };

  cancel(){
    this.requestTask.abort();
  };

  handleError(msg){
    uni.showToast({
      title: msg,
      icon: 'none'
    })
  }

}



export default Http;
