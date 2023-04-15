export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '维利博客技术交流门户网站',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'Nuxtjs，Vuejs，ElementUI技术交流博客社区' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    //引入全局样式
    //引入element-ui组件样式
    'element-ui/lib/theme-chalk/index.css',
    //引入element-ui布局样式
    'element-ui/lib/theme-chalk/display.css',
    //引入项目布局样式
    '@/assets/css/global.css',
    //引入mavon-editor组件样式
    'mavon-editor/dist/css/index.css',
  ],

  env: {
    //如果process.env.NODE_ENV等于dev，代表开发环境，否则代表生产环境  http://120.77.24.28:7000生产环境
    authURL : process.env.NODE_ENV === 'dev' ? `http://localhost:7000` : `//login.weiliwang.top`,
    manageMentURL : process.env.NODE_ENV === 'dev' ? `http://localhost:9528` : `//admin.weiliwang.top`,
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/Element-ui.js',   //elementui
    '@/plugins/interceptor.js',   //拦截请求接口
    '@/api/article.js',  //文章接口
    '@/api/common.js',   //公共接口
    {src : '@/plugins/mavon-editor', mode: 'client'},  //只能在client使用
    '@/api/question.js',   //问答接口
    '@/api/user.js',   //用户中心接口
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',   //引入该插件解决远程调用和跨域问题
    'cookie-universal-nuxt',   //解决nuxt服务端获取cookie
  ],

  axios: {
    proxy: true,  //开启代理，解决跨域问题
    retry: { retries: 3 } ,   //最多重试三次
    prefix: '/api',   //添加前缀api
  },
  //解决跨域问题，前端的url如果定义了前缀/api，后端没有定义，则写成这样。但是如果前端定义了/api，后端也有/api，pathRewrite可以删除
  proxy: {
    /*'/api/auth' : {
      target : "http://localhost:7001",
      pathRewrite : {'^/api' : ''},  //最后真实地址是：http://localhost:8088/student/obtainAllStudent
    },
    '/api/system' : {
      target : "http://localhost:8003",
      pathRewrite : {'^/api' : ''},  //最后真实地址是：http://localhost:8088/student/obtainAllStudent
    },
    '/api/article' : {
      target : "http://localhost:8001",
      pathRewrite : {'^/api' : ''},  //最后真实地址是：http://localhost:8088/student/obtainAllStudent
    },
    '/api/question' : {
      target : "http://localhost:8002",
      pathRewrite : {'^/api' : ''},  //最后真实地址是：http://localhost:8088/student/obtainAllStudent
    },*/
    '/api' : {
      //https://mock.mengxuegu.com/mock/61bf17c707f7da19bb946030/blog-web
      target : "http://localhost:6001",  //http://localhost:6001   http://175.24.203.178:6001
      pathRewrite : {'^/api' : ''},  //最后真实地址是：http://localhost:8088/student/obtainAllStudent
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    //将node-modules下的element-ui导出
    transpile : [/^Element-ui/],
    //webpack自定义配置
    extend (config, ctx) {

    }
  }
}
