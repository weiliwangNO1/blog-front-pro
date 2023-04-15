<template>
    <div class="mxg-header mxg-header-fixed">
      <div class="mxg-nav">
        <!-- 头部， space-between 表示 flex 布局下的水平排列方式-->
        <el-row type="flex" justify="space-between">
          <!-- Logo， 任意宽度都是占4格-->
          <el-col class="logo" :xs="4" :sm="4" :md="4" >
            <!-- Logo -->
              <a href="/"><img src="@/assets/images/blog1.png" height="40px"></a>
          </el-col>
          <!-- 导航菜单， 手机与平板坚屏都占0格，也就是隐藏，其他10格-->
            <!-- <el-col :xs="0" :sm="0" :md="10"> -->
          <el-col class="hidden-sm-and-down" :md="10" >
            <!-- 导航菜单 ，horizontal 水平， router 开启 index 指定路由地址， default-active默认哪个被选中-->
            <el-menu  mode="horizontal"
              router
              :default-active="defaultActive"
              active-text-color="#345dc2"
              background-color="#fafafa"
              >
              <el-menu-item index="/" >博客</el-menu-item>
              <el-menu-item index="/question">问答</el-menu-item>
              <el-menu-item index="/label" >标签</el-menu-item>
            </el-menu>
          </el-col>
          <!-- 登录、注册/头像 手机与平板坚屏都占18格，其他占8格式-->
          <el-col class="nav-right" :xs="18" :sm="18" :md="8" >
              <!-- 登录、注册/头像 -->
                <div class="nav-sign" >
                  <el-button type="text" @click="skipManagement" >管理后台</el-button>
                  <el-button type="text" @click="userLogin" v-if="!userInfo" >登录</el-button>
                  <el-button type="primary" @click="userLogin" size="small" v-if="!userInfo"  round>注册</el-button>
                </div>
                <el-dropdown v-if="true" @command="handleCommand">
                  <div class="el-dropdown-link">
                    <el-avatar :src="$store.state.userInfo ? $store.state.userInfo.imageUrl : null"
                      icon="el-icon-user-solid">
                    </el-avatar>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="article">写文章</el-dropdown-item>
                    <el-dropdown-item command="question">提问题</el-dropdown-item>
                    <el-dropdown-item command="user">我的主页</el-dropdown-item>
                    <el-dropdown-item v-if="userInfo" command="logout">退出</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
          </el-col>
        </el-row>
      </div>
    </div>
</template>
<script>
export default {

    created() {

    },
  computed: {
      userInfo() {
        return this.$store.state.userInfo ? this.$store.state.userInfo : null;
      },
      //动态高亮显示导航标签
      defaultActive() {
        //是否存在多级子路由
        let routePath = this.$route.matched[0].path || '/';
        //从第2个字符开始往后查找是否存在第二个/
        if(routePath.indexOf('/', 1) !== -1) {
          //查找到，截取一级路由
          routePath = routePath.substring(0, routePath.indexOf('/', 1));
        }
        // /article路由转化为/
        return routePath.indexOf('/article') !== -1 ? '/' : routePath;
      }
    },
    methods: {
      //跳转到登录界面
      userLogin() {
        this.$store.dispatch("LoginPage");
      },
      // 下拉点击后调用
      handleCommand(command) {
        // this.$message('click on item ' + command)
        //如果没有登录，那么跳转到登录页面
        if(!this.userInfo) {
          //跳转到登录页面
          this.$store.dispatch('LoginPage');
          return ;
        }

        switch (command) {
          case 'article':
            // 打开新窗口
            let routeData = this.$router.resolve('/article/edit')
            window.open(routeData.href, '_blank')
            break;
          case 'question':
            // 打开新窗口
            routeData = this.$router.resolve('/question/edit')
            window.open(routeData.href, '_blank')
            break;
          case 'logout':
            this.$store.dispatch('logOutPage');   //跳转到退出系统
            break;
          case 'user':
            //打开我的主页窗口
            routeData = this.$router.resolve('/user');
            window.open(routeData.href, '_blank');
            break;
          default:
            break;
        }
      },
      skipManagement() {  //跳转到后台管理系统

        window.location.href = `${process.env.manageMentURL}`;
      }
    },
}
</script>
<style scoped>
/* 头部 */
.mxg-header {
  width: 100%;
  height: 60px;
  border-top: 3px solid #345dc2;
  background-color: #fafafa;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .12);
  z-index: 1501;
}
/* 固定头部 */
.mxg-header-fixed {
  position: fixed;
}

/* 导航 */
.mxg-header .mxg-nav {
  max-width: 1140px;
  /* 居中 */
  margin: auto;
  padding: 10px;
}

.el-menu.el-menu--horizontal {
  /* 去除底部边框 */
  border-bottom: 0px;
  margin-top: -10px;
}

/* 导航右侧 */
.nav-right {
  text-align: right;
}
.nav-sign {
  position: absolute;
  right: 0;
  margin-right: 50px;
}

/* 防止点击头像有边框 */
div:focus {
  outline: none;
}
</style>
