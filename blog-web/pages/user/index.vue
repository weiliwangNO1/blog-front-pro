<template>
    <div >
        <!-- 个人信息 -->
        <el-row class="main-top">
            <div class="avatar">
                <el-tooltip content="点击上传头像" effect="light">
                    <el-upload
                        accept="image/*"
                        action=""
                        :show-file-list="false"
                        :http-request="uploadMainImg"
                        >
                        <el-avatar :size="120" :src="this.userInfo.imageUrl" >{{userInfo.nickName}}</el-avatar>
                    </el-upload>
                </el-tooltip>
            </div>
            <div class="info">
                <div>
                    <span class="meta-block">&nbsp;&nbsp;&nbsp;昵称：</span>
                    <span class="name">{{userInfo.nickName}}</span>
                </div>
                <div>
                    <span class="meta-block">用户名：</span>
                    <span class="name">{{userInfo.username}}</span>
                </div>
            </div>
        </el-row>
        <el-row >
            <el-tabs value="public" @tab-click="handleClick" >
                <el-tab-pane label="公开文章" name="public">
                    <article-list
                    name="public" :page="query" :listData="articleList"
                    @fetch-data="findUserArticleList"
                    />
                </el-tab-pane>
                <el-tab-pane label="私密文章" name="nopublic">
                    <article-list
                    name="nopublic" :page="query" :listData="articleList"
                    @fetch-data="findUserArticleList"
                    />
                </el-tab-pane>
                <el-tab-pane label="我的提问" name="question">
                    <question-list
                    name="question"
                    :page="questionQuery"
                    :listData="questionList"
                    @fetch-data="findUserQuestionList"
                    />
                </el-tab-pane>
                <el-tab-pane label="修改个人资料" name="user">
                    <user-edit :loading="loading" :formData="userInfo" @submitForm="submitUserForm" />
                </el-tab-pane>
                <el-tab-pane label="修改密码" name="password">
                    <user-password :loading="loading" :formData="passwordData" @submitForm="submitPasswordForm" />
                </el-tab-pane>
            </el-tabs>
        </el-row>
    </div>
</template>
<script>
import ArticleList from '@/components/article/List'
import QuestionList from '@/components/question/List'
import UserEdit from '@/components/user/Edit'
import UserPassword from '@/components/user/Password'

export default {
    components: { QuestionList, ArticleList, UserEdit, UserPassword },

    middleware : 'auth',   //中间件权限拦截，如果用户没有登录，那么跳转到登录页面

    data() {
        return {
            loading: false,
            userInfo: {
                imageUrl: '',   //用户头像
            },
            passwordData: { // 修改密码表单
                userId: this.$store.state.userInfo && this.$store.state.userInfo.uid
            },
            questionList: [], // 提问列表
            questionQuery : {  //提问列表查询条件
              userId : this.$store.state.userInfo && this.$store.state.userInfo.uid,
              current : 1,
              size : 20,
              total : 0,
            }
        }
    },

    methods: {
        handleClick(tab, event) {
            switch (tab.paneName) {
                case 'public':  //公开
                    this.findUserArticleList(tab.paneName, 1, 20);
                    break;
                case 'nopublic':  //私密
                    this.findUserArticleList(tab.paneName, 1, 20);
                    break;
                case 'question':  //问题
                    this.findUserQuestionList(tab.paneName, 1, 20);
                    break;
                case 'user':
                    // 用户不用查询，在加载此页面时已经查询了
                    break;
            }
        },
        async findUserArticleList (name, current = 1, size = 20) {  //文章子组件回调方法
          //设置查询条件
          this.query.current = current;
          //设置每页的记录数
          this.query.size = size;
          //0.未公开，1.公开
          this.query.isPublic = name === 'public' ? 1 : 0;
          //查询，不要少了$
          const {data} = await this.$findUserArticle(this.query);
          //更新总记录数
          this.query.total = data.total;
          //列表数量
          this.articleList = data.records;
        },
        async findUserQuestionList(name, current = 1, size = 20) {  //查询我的提问列表current默认为1，size默认为20
          //设置查询条件
          this.questionQuery.current = current;
          this.questionQuery.size = size;
          console.log("我的提问query:", this.questionQuery);
          const {data} = await this.$findUserQuestion(this.questionQuery);
          //更新总记录数
          this.questionQuery.total = data.total;
          //更新提问数据
          this.questionList = data.records;
        },

        // 上传头像
        async uploadMainImg(file) {
          //封装表单对象
          const fileData = new FormData();
          fileData.append("file", file.file);
          try {
            //发送请求上传
            const {data} = await this.$uploadImg(fileData);
            //根据图片路径把原来的图片删除
            this.deleteImg();
            //删除后再重新赋值
            this.userInfo.imageUrl = data;
            //更新用户数据
            this.$updateUserInfo(this.userInfo);
          }catch(error) {
            this.$message.error("更新头像失败！");
          }
        },

        // 删除头像, 上传成功后删除原来的头像
        deleteImg() {
          if(this.userInfo.imageUrl) {
            //删除
            this.$deleteImg(this.userInfo.imageUrl);
          }
        },

        // 提交修改个人资料
        async submitUserForm() {
            this.loading = true
            const {code, message} = await this.$updateUserInfo(this.userInfo);
            if(code === 20000) {  //个人信息修改成功
              this.$message.success("修改成功！");
            }else {  //修改失败
              this.$message.error("修改失败！");
            }
            this.loading = false;
        },

        // 修改密码
        async submitPasswordForm() {
          this.loading = true;
          //提交修改密码
          //获取最新的用户id
          this.passwordData.userId = this.$store.state.userInfo && this.$store.state.userInfo.uid;
          const {code , message} = await this.$updatePassword(this.passwordData);
          if(code === 20000) {  //密码修改成功
            this.$message.success("密码修改成功，请重新登录！");
            //清空数据
            this.passwordData = {};
            //跳转到单点退出页面
            this.$store.dispatch("logOutPage");
          }else {  //密码修改失败
            this.$message.error("密码修改失败！");
          }
          this.loading = false;
        }
    },

    async asyncData( {app, redirect, store} ) {

        if(!app.store.state.userInfo) {  //如果用户没有登录，那么阻止并跳转到主页
          redirect("/");  //跳转到博客主页
          //store.dispatch("LoginPage")//跳转到登录页面
        }
        //获取当前登录用户id
        const userId = store.state.userInfo && store.state.userInfo.uid;
        // 1. 查询用户信息
        const {data : userInfo} = await app.$getUserInfo(userId);
        debugger;
        // 2. 查询公开文章列表
        //封装查询条件
        const query = {
          userId,
          isPublic : 1, //0 未公开，1.公开
          current : 1,
          size : 20,
          total : 0,
        }
        const {data} = await app.$findUserArticle(query);
        query.total = data.total;
        //返回用户信息和公开的文章信息
        return {userInfo, query, articleList : data.records};
    },

}
</script>
<style scoped>
.main-top {
    padding: 30px 0;
}
.avatar{
    float:left;
}
.info {
    margin: 30px 0 0 140px;
}
.info .name {
    font-size: 18px;
    font-weight: 500;
    padding-top: 10px;
}
.info .meta-block {
    font-size: 14px;
    color: #969696;
}
</style>
