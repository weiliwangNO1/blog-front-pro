import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'  //弃用！！！

import { PcCookie, Key } from '@/utils/cookie'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
//后台地址请求拦截
service.interceptors.request.use(
  config => {
    // do something before request is sent
    //获取accessToken
    const accessToken = PcCookie.get(Key.accessTokenKey);
    if (accessToken) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      //请求头Authorization加上 Bearer accessToken
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if(error.response && error.response.status !== 401) {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }else {  //如果是令牌没有过期
      const refreshToken = PcCookie.get(Key.refreshTokenKey);  //获取refreshToken
      let isLock = true;
      if(isLock) {
        isLock = false;
        if(refreshToken) {  //如果refreshToken有效，跳转到登录中心
          window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}/refresh?redirectURL=${window.location.href}`;
        }else {  //refreshToken无效，跳转到登录中心
          window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}?redirectURL=${window.location.href}`;
        }
      }
      return Promise.reject("令牌已过期，请重新登录")
    }
  }
)

export default service
