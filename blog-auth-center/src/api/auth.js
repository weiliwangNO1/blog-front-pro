import request from '@/utils/request'

//数据格式
const headers = { 'Content-Type' : 'application/x-www-form-urlencoded'}

//请求头添加
/*const auth = {
    username : 'weili',
    password : 'w1211840085',
}*/
const auth = {
    username : 'mxg-blog-admin',
    password : '123456',
}

//用户登录
export const login = (data) => {
    return request({
        headers,
        auth,
        url : '/auth/login',
        method : 'post',
        params : data
    })
}

//获取协议内容
export const getxieyi = () => {
    return request({
        // 如果当前url带上了请求参数，如 ?redirectURL=xxx ，就会获取不到协议内容
        // url: `${window.location.href}/xieyi.html`, // 访问到的是 public/xieyi.html
        // 下面方式才能保证正确获取协议内容
        url: `${window.location.protocol}//${window.location.host}/xieyi.html`,
        method: 'get'
    })
}

//检查用户名是否被注册
export const checkUsernameRegister = (username) => {
    return request({
        url : `/system/api/user/username/${username}`,
        method : 'get',
    })
}

//注册用户
export const register = (data) => {
    return request({
        url : `/system/api/user/register`,
        method : 'post',
        data : data,
    })
}

//单点退出系统
export const logout = (accessToken) => {
    return request({
        url : `/auth/logout`,
        method : "get",
        params: {
            accessToken
        }
    })
}


//刷新令牌获取新的认证信息
export const refreshLongin = (refreshToken) => {
    return request({
        headers,
        auth,
        url : `/auth/refreshLogin`,
        method : "get",
        params: {
            refreshToken
        }
    })
}
