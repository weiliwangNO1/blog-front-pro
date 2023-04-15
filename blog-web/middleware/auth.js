// 定义权限判断中间件，中间件的第1个参数是context
export default ({store, route, redirect, req}) =>{
  console.log('auth.js认证中间件被调用')
  if(!store || !store.state.userInfo) {
    // 如果未认证，前往认证中心
    // 这种方式，在生产环境通过域名访问项目时，获取的也是 http://localhost:3000/api
    // 而不是获取域名 htpp://blog.mengxuegu.com/api
    const redirectURL = process.env._AXIOS_BASE_URL_.replace('api', '') + route.path
    // 方式2：通过 req.headers.host 在生产环境可获取域名
    //const redirectURL = 'http://' + req.headers.host + route.path
    redirect(`${process.env.authURL}?redirectURL=${redirectURL}`)

  }
}
