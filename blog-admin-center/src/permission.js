import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import getPageTitle from '@/utils/get-page-title'

//引入cookies工具
import {PcCookie, Key} from '@/utils/cookie';

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

/**
 * 跳转路由前，进行拦截鉴权
 *
 */
router.beforeEach(async(to, from, next) => {
  // start progress bar
  //顶部进度条
  NProgress.start()

  // set page title
  //设置页面标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  /**
   * 1.获取accessToken
   * 2.如果存在accessToken，
   * 2.1，存在accessToken情况下，获取userInfo用户信息，如果userInfo信息存在
   *
   */
  const accessToken = PcCookie.get(Key.accessTokenKey);  //获取accessToken信息

  if (accessToken) {  //如果存在accessToken
    const userInfo = PcCookie.get(Key.userInfoKey);  //获取userInfo信息
    if(userInfo) {  //用户信息存在
      if (to.path === '/login') {  //在有accessToken和userInfo情况下访问登录页面，跳转到主页
        next({ path: '/' })
        NProgress.done()
      } else {  //跳转到其它页面
        if(!store.getters.init) {  //没有加载过菜单和按钮权限
          //获取用户拥有的菜单、按钮权限
          store.dispatch('menu/getUserMenu').then(response => {
            console.log(response);
            //路由继续跳转
            //replace标识访问目标路由不会留下history记录
            next({...to, replace:true})
          }).catch(error => {  //返回错误信息，那么给出提示，并跳转到第三方登录界面
            Message({'message': '获取菜单权限失败，请重新登录', 'type': 'error'})
            window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}/?redirectURL=${window.location.href}`;
          })
        }else {  //已经加载过菜单和按钮权限（如果需要重新加载，那么只能退出系统后，重新登录）
          next()
          NProgress.done()
        }
      }
    }else {  //用户信息不存在，那么跳转到登录界面
      window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}/?redirectURL=${window.location.href}`;
      NProgress.done()
    }
  } else {  //如果不存在accessToken
    //白名单数组
    if(to.path === '/login') {
      //如果在没有accessToken情况下，访问后台管理网站的login，那么跳转到主页，访问主页肯定会被拦截
      //被拦截后跳转到第三方登录页面
      next({ path: '/' })
      NProgress.done()
    }
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
      NProgress.done()
    } else {  //如果没有accessToken，并且也不在白名单内，那么跳转到登录界面
      window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}/?redirectURL=${window.location.href}`;
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
