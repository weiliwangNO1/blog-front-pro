//创建拦截器
export default({store, route, redirect, $axios}) => {

  $axios.onRequest(config => {
    const accessToken = store.state.accessToken;
    //如果存在accessToken，那么头部信息带上accessToken
    if(accessToken) {
      //针对每个请求，请求头带上令牌 Authorization: Bearer token
      config.headers.Authorization = 'Bearer ' + accessToken;
    }
    return config;
  })

  $axios.onResponse(response => {
    //模拟出现401状态
    /*if(!store.state.accessToken) {
      console.log("没有令牌");
      sendRefreshRequest(store, route, redirect);
    }*/
    return response;
  })

  $axios.onError(error => {
    //如果是后台请求服务出现问题
    //console.log("拦截器显示报错信息:" + error.response.status);
    if(error.response.status !== 401) {  //如果后端返回状态码不是401，未授权
      return Promise.reject(error);  //返回错误信息
    }
    //如果后端返回401状态码
    sendRefreshRequest(store, route, redirect);
    return Promise.reject("令牌过期，重新登录");
  })

}

let isLock = true;  //防止重复刷新令牌，true还未请求，false正在请求刷新令牌

//通过刷新令牌重新获取令牌
const sendRefreshRequest = (store, route, redirect) => {
  //console.log("isLock:", isLock);
  if(isLock && store.state.refreshToken) {  //刷新令牌存在
    isLock = false;
    //通过刷新令牌获取新的令牌，跳转
    redirect(`${process.env.authURL}/refresh?redirectURL=${redirectURL(route)}`);
  }else {
    isLock = true;
    //如果没有刷新令牌，那么跳转到登录页
    //先重置state里userInfo，accessToken，refreshToken为空
    store.commit('RESET_USER_STATE');
    //然后跳转到登录页面
    redirect(`${process.env.authURL}?redirectURL=${redirectURL(route)}`);
  }
}

//获取当前网页地址
const redirectURL = (route) => {
  //客户端
  if(process.client) {
    return window.location.href;
  }
  //服务端
  return process.env._AXIOS_BASE_URL_.replace('/api', '') + route.path;
}

