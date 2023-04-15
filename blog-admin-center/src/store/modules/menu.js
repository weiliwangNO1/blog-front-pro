import { getUserMenuList } from '@/api/user'

import {PcCookie, Key} from '@/utils/cookie'

//定义状态
const state = {
  init: false,  //是否已加载用户菜单
  menuList : [],  //用户拥有的菜单集合
  buttonList : [],  //拥有按钮权限集合
}

//改变状态值
const mutations = {
  SET_SYSTEM_MENU : (state, data) => {
    state.init = true;
    //注意是data.menuTreeList
    state.menuList = data.menuTreeList;
    state.buttonList = data.buttonList;
  }
}

//定义行为
const actions = {
  //获取用户菜单
  getUserMenu({commit}) {
    return new Promise((resolve, reject) => {
      //获取用户id
      const userId = PcCookie.get(Key.userInfoKey) ?
        JSON.parse(PcCookie.get(Key.userInfoKey)).uid : null;
      if(userId) {
        getUserMenuList(userId).then(response => {
          const {code, data} = response;
          if(code === 20000) {
            commit('SET_SYSTEM_MENU', data);
            resolve();  //正常响应钩子
          }else {
            reject(`服务器返回状态码：${code}`);  //异常响应钩子
          }
        }).catch(error => {
          reject(error);  //异常处理钩子
        })
      }
    })
  }
}

//导出
export default {
  namespaced : true,  //引用时需要模块名，即当前文件名menu/getUserMenu
  state,
  mutations,
  actions,
}
