import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/*
vue添加路由步骤：
1.npm install vue-router安装组件，安装好后再package.json文件中查看dependencies里是否有vue-router，如果有表示安装成功
2.App.vue文件中增加<router-view>标签
3.在src目录下创建router目录，并创建index.js文件,使用import Router from 'vue-router'导入组件，然后定义router常量配置
4.routes是数组，里面每个对象中path是目录，component是引入需要的页面文件，children引入子页面，也是一个数组
5.在src目录下的main.js文件中，把components目录下的index.js文件引入到App实例中
 */

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',   //登录主页面
            component: ()=> import('@/components/layout/index'),
            children: [
                {
                    path : '',
                    component: ()=> import('@/views/auth/login'),
                }
            ]
        },
        {
            path: '/refresh',  //刷新令牌登录界面
            component: ()=> import('@/components/layout/index'),
            children: [
                {
                    path : '',
                    component: ()=> import('@/views/auth/refresh'),
                }
            ]
        },
        {
            path: '/test/test',  //测试界面
            component: ()=> import('@/views/test/test'),
        },
        {
            path: '/test/teacher',  //测试界面
            component: ()=> import('@/views/test/teacher'),
        },
        {
            path: '/test/student',  //测试界面
            component: ()=> import('@/views/test/student'),
        }

    ]
})


import store from '@/store';

//路由拦截器
router.beforeEach((to, from, next) => {
    if(to.path === "/logout") {  //退出操作
        store.dispatch("UserLogout", to.query.redirectURL);
    }else {
        next();
    }
})


export default router;