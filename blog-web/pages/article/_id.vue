<template>
  <div>
    <el-row type="flex">
      <el-col :xs="24" :sm="24" :md="18">
        <div class="article-left">
          <el-card>
            <!--标题 -->
            <div class="article-title">
              <h1>{{data.title}}</h1>
              <div class="article-count">
                <nuxt-link :to="`/user/${data.userId}`" target="_blank" class="nickname">
                  <i class="el-icon-user-solid"></i> {{data.nickName}}
                </nuxt-link>
                <span>
                  <i class="el-icon-date"></i> {{ getDateFormat(data.updateDate)}}
                  <i class="el-icon-thumb"></i> {{data.thumhup}}
                  <i class="el-icon-view"></i> {{data.viewCount}}
                </span>

                <!--编辑文章入口 -->
                <!-- to属性如果只有一个参数时，可以使用 :to="`/article/edit?id=${data.id}`"拼接地址 -->
                <!-- 如果存在多个参数，那么需要 {path: '/article/edit', query: `{id : ${data.userId}`}-->
                <!-- 这里传入文章id -->
                <nuxt-link v-if="this.$store.state.userInfo && this.$store.state.userInfo.uid === data.userId "
                  :to="{path: '/article/edit', query: {id : data.id}}">
                  <el-tag type="success">编辑</el-tag>
                </nuxt-link>
              </div>
              <el-tag style="margin: 5px" v-for="item in data.labelList" :key="item.id" size="small">
                {{item.name}}
              </el-tag>
            </div>
            <!-- 内容-->
            <div class="article-content">
              <div class="markdown-body" v-html="data.htmlContent"></div>
            </div>
            <!-- isThumb -->
            <el-button @click="handleThumb" icon="el-icon-thumb" type="success" size="medium" :plain="!isThumb">
              赞
            </el-button>
          </el-card>
          <!--  评论区-->
          <div>
            <h2>评论区</h2>
            <!-- 未登录-->
            <el-card v-if="!$store.state.userInfo">
              <h4>登录后参与评论交流、获取后续评论消息</h4>
              <div>
                <el-button @click="$store.dispatch('LoginPage')" type="primary" size="small">登录</el-button>
                <el-button @click="$store.dispatch('LoginPage')" type="primary" size="small">注册</el-button>
              </div>
            </el-card>
            <!-- 登录后显示 评论组件-->
            <mxg-comment :userId="userId" :userImage="userImage"
            :authorId="data.userId"
            :showComment="$store.state.userInfo ? true : false"
            @doSend="doSend" @doChildSend="doChildSend" @doRemove="doRemove"
            :commentList="commentList">
            </mxg-comment>
          </div>
        </div>
      </el-col>

      <!--右侧 -->
      <el-col class="hidden-sm-and-down" :md="6">
        <el-row>
          <el-col>
            <!-- 固定距离-->
            <mxg-affix :offset="80">
              <!-- parentClass 指定文章内容的父元素class值 -->
              <mxg-directory parentClass="article-content"></mxg-directory>
            </mxg-affix>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  //引入高亮显示md内容样式
  import "@/assets/css/md/github-markdown.css";
  import "@/assets/css/md/github-min.css";

  import { dateFormat } from "@/utils/date.js";

  //固定
  import MxgAffix from "@/components/common/Affix/index";
  //生成文章导航目录
  import MxgDirectory from "@/components/common/Directory/index";
  //评论组件
  import MxgComment from "@/components/common/Comment/index";

  export default {
    components : {
      MxgAffix,
      MxgDirectory,
      MxgComment,
    },
    //检验路由参数
    validate({params}) {
      return /^\d+$/.test(params.id);
    },
    head() {
      return {
        title : this.data.title,  //浏览器显示的标题
      }
    },
    //获取文章详细数据
    async asyncData({ params, app }) {
        //查询文章详情
      const {data} = await app.$getArticleById(params.id);
      //更新浏览数，判断再Cookie中是否存在
      const isView = app.$cookies.get(`article-view-${params.id}`);
      //判断从Cookie中获取的值是否存在
      if(!isView) {  //不存在，那么调用更新浏览数接口
        const {code} = await app.$updateArticleViewCount(params.id);
        if(code === 20000) {  //如果后台更新成功，需要把isView放在浏览器的Cookie中
          data.viewCount ++;  //浏览数自增
        }
        //保存到Cookie中，关闭浏览器后删除
        app.$cookies.set(`article-view-${params.id}`, true);
      }
      //根据文章id获取该文章的评论信息
      const {data : commentList } = await app.$getCommentListByArticleId(params.id);
      return {data , commentList};
    },
    data() {
      return {
        isThumb : this.$cookies.get(`article-thumb-${this.$route.params.id}`) ?
          this.$cookies.get(`article-thumb-${this.$route.params.id}`) : false,  //获取浏览器cookie的值，true点赞，false未点赞
        //当前登录用户id
        userId : this.$store.state.userInfo && this.$store.state.userInfo.uid,
        //当前登录用户头像
        userImage : this.$store.state.userInfo && this.$store.state.userInfo.imageUrl,
      }
    },
    methods: {
      //发布评论
      doSend(content) {
        console.log(`针对文章${this.$route.params.id}发布评论内容：${content}`);
        this.doChildSend(content);
      },
      //发布回复评论触发
      doChildSend(content , parentId = "-1") {
        console.log(`对父评论id：${parentId}发布的回复评论内容：${content}`);
        const data = {
          content,
          parentId,
          articleId : this.$route.params.id,
          userId : this.userId,
          userImage : this.userImage,
          nickName: this.$store.state.userInfo && this.$store.state.userInfo.nickName,
        }
        //提交评论
        this.$addComment(data).then(response => {
          const {code} = response;
          if(code === 20000) {  //回复成功，刷新评论数据
            this.$message.success("回复成功！");
            this.getCommentList();  //刷新评论
          }else {  //回复失败，刷新评论数据
            this.$message.error("回复失败，请重试！");
            this.getCommentList();  //刷新评论
          }
        }).catch(error => {
          this.$message.error("服务器繁忙，请稍后重试！");
          console.log("提交评论", error);
        });
      },
      //删除评论
      doRemove(id) {
        console.log(`删除评论id：${id}`);
        this.$deleteCommentById(id).then(response => {
          const {code } = response;
          if(code === 20000) {  //删除评论成功，获取最新的评论信息
            this.$message.success("删除成功！");
            this.getCommentList();
          }else {  //删除评论失败，重新获取评论信息
            this.$message.error("删除失败，请重试！");
            this.getCommentList();
          }
        }).catch(error => {
          this.$message.error("服务器繁忙，请稍后重试！");
          console.log("删除评论：", error);
          this.getCommentList();
        });
      },
      async getCommentList() {  //获取文章评论信息
        const {data} = await this.$getCommentListByArticleId(this.$route.params.id);
        this.commentList = data;
      },
      getDateFormat(date) {   //格式化日期
        return dateFormat(date);
      },
      async handleThumb() {  //点赞
        //点赞动作，判断用户是否登录，如果未登录，那么提示登录
        if(!this.$store.state.userInfo) {
          this.$message.warning("请先登录，再点赞！");
          return false;
        }
        this.isThumb = !this.isThumb; //取反
        const count = this.isThumb ? 1 : -1;  //1.点赞加1，-1取消点赞减1
        //获取文章的id
        const articleId = this.$route.params.id;
        //更新获取取消点赞
        const {code} = await this.$updateArticleThumb(articleId, count);
        if(code === 20000) {  //点赞或者取消点赞成功
          //更新页面显示的点赞数量
          this.data.thumhup = this.data.thumhup + count;  //加1或者减1
          //然后把isThumb保存到cookie中，并设置保存时间
          this.$cookies.set(`article-thumb-${this.$route.params.id}`, this.isThumb, {
            maxAge : 60*60*24*365*10,   //时间保存为10年
          });
        }
      }
    }

  }
</script>

<style scoped>
  /* 样式本文件有效 */
  @import '@/assets/css/blog/article.css';
</style>
