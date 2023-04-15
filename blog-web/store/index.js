
//状态必须定义为function
const state = () => ({
  userInfo : null,
  accessToken : null,
  refreshToken : null,
})


//定义cookie行为
const mutations = {
  RESET_USER_STATE (state) {
    state.userInfo = null;
    state.accessToken = null;
    state.refreshToken = null;
  },

  //把userinfo，accessToken，refreshToken值赋给state，服务端可以通过app.$store.userInfo获取
  //客户端可以通过this.$store.userInfo获取
  UPDATE_ALL_STATE (state, data) {
    state.userInfo = data.userInfo;
    state.accessToken = data.accessToken;
    state.refreshToken = data.refreshToken;
  }
}

//定义action
const actions = {

  //nuxtjs服务端方法，刷新或者重定向页面就会调用该方法
  nuxtServerInit({commit}, {app}) {
      const data = {};
      data.userInfo = app.$cookies.get('userInfo');  //获取用户信息
      data.accessToken = app.$cookies.get('accessToken');  //获取令牌
      data.refreshToken = app.$cookies.get('refreshToken');   //获取刷新令牌

      //把userinfo，accessToken，refreshToken值赋给state，服务端可以通过app.$store.userInfo获取
      //客户端可以通过this.$store.userInfo获取
      commit('UPDATE_ALL_STATE', data);
  },

  //跳转到登录页面
  LoginPage({commit}) {
    //先清除用户信息
    commit('RESET_USER_STATE');
    //跳转到单点登录页，使用process.env.authURL动态配置地址
    window.location.href = `${process.env.authURL}?redirectURL=${window.location.href}`;
  },

  //退出系统操作
  logOutPage({commit}) {
    //清除登录信息
    commit('RESET_USER_STATE');
    //跳转到登录中心的退出链接
    window.location.href = `${process.env.authURL}/logout?redirectURL=${window.location.href}`;
  },

  //退出系统后并跳转到登录页面
  logOutResetLogin({commit}) {
    //清除登录信息
    commit('RESET_USER_STATE');
    //跳转到登录页面
    window.location.href = `${process.env.authURL}?redirectURL=${window.location.href}`;
  },

  //

}

//导出
export default {
  state,
  mutations,
  actions
}


