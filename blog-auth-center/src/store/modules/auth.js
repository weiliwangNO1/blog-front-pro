import Vue from 'vue';
import { login, logout , refreshLongin } from '@/api/auth';
import { PcCookie, Key } from '@/utils/cookie';   //对cookie操作

//定义状态，state必须是function

const state = {

    userInfo : PcCookie.get(Key.userInfoKey)
            ? JSON.parse(PcCookie.get(Key.userInfoKey)) : null,  //用户对象信息
    accessToken : PcCookie.get(Key.accessTokenKey),  //访问令牌字符串
    refreshToken : PcCookie.get(Key.refreshTokenKey),   //刷新令牌访问
}

//改变状态值
const mutations = {
    //赋值用户状态
    SET_USER_STATE (state, data) {
        //状态赋值
        const {userInfo, access_token, refresh_token} = data;
        state.userInfo = JSON.stringify(userInfo);
        state.accessToken = access_token;
        state.refreshToken = refresh_token;

        //保存到cookie中
        PcCookie.set(Key.userInfoKey, JSON.stringify(userInfo));
        PcCookie.set(Key.accessTokenKey, access_token);
        PcCookie.set(Key.refreshTokenKey, refresh_token);
    },

    //重置用户状态，退出和登录失败时使用
    RESET_USER_STATE(state) {
        //状态置空
        state.userInfo = null;
        state.accessToken = null;
        state.refreshToken = null;

        //移除cookie
        PcCookie.remove(Key.userInfoKey);
        PcCookie.remove(Key.accessTokenKey);
        PcCookie.remove(Key.refreshTokenKey);
    }
}

//定义行为
const actions = {
    //登录操作
    UserLogin({commit}, userInfo) {
        const {username, password} = userInfo;
        return new Promise((resolve, reject) => {   //异步执行方法
            login({username: username.trim(), password : password}).then(response => {

                const {code, data} = response;
                if(code === 20000) {//登录成功
                    commit('SET_USER_STATE', data);
                }else {  //如果登录失败，那么清除cookie信息
                    commit('RESET_USER_STATE');
                }
                resolve(response);  //把正常数据响应回去
            }).catch(error => {  //登录失败，重置状态
                //重置状态
                commit('RESET_USER_STATE');
                reject(error);   //把异常数据信息响应回去
            })
        })
    },
    //单点退出系统
    UserLogout({state, commit}, redirectURL) {
        logout(state.accessToken).then(response => {
            const {code, message} = response;
            if(code === 20000) {   //退出成功
                //清除浏览器cookie值，重置状态
                commit('RESET_USER_STATE');
                window.location.href = redirectURL || '/';
            }else {  //退出失败
                commit('RESET_USER_STATE');
                window.location.href = redirectURL || '/';
            }
        }).catch(error => {
            commit('RESET_USER_STATE');
            window.location.href = redirectURL || '/';
        });
    },

    //刷新令牌重新获取认证信息
    UserRefreshToken({state, commit}) {
        return new Promise( (resolve,reject) => {   //异步执行方法
            //判断是否存在刷新令牌
            if(!state.refreshToken) {  //不存在刷新令牌
                //重置状态，清除认证信息
                commit('RESET_USER_STATE');
                reject("没有刷新令牌");
                return false;
            }
            //存在刷新令牌
            refreshLongin(state.refreshToken).then(response => {
                //把新认证的信息重新放入cookie中
                commit('SET_USER_STATE', response.data);
                resolve(response);
            }).catch(error => {
                //重置状态，清除认证信息
                commit('RESET_USER_STATE');
                reject("获取刷新令牌失败");
            });
        })
    }

}

//导出组件
export default {
    state,
    mutations,
    actions,
}