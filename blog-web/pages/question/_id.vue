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
                <!--这里传入问答id -->
                <nuxt-link v-if="this.$store.state.userInfo && this.$store.state.userInfo.uid === data.userId "
                  :to="{path: '/question/edit', query: {id : data.id}}">
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
          <!--  精彩回答-->
          <div>
            <h2>精彩回答</h2>
            <el-card v-if="!commentList || commentList.length === 0">暂无回答</el-card>
            <el-card v-for="comment in commentList" :key="comment.id">
              <!-- 登录后显示 评论组件-->
              <!-- showComment不显示评论组件 -->
              <mxg-comment :userId="userId" :userImage="userImage"
                           :authorId="data.userId"
                           :showComment="false"
                           @doChildSend="doChildSend" @doRemove="doRemove"
                           :commentList="[comment]">
              </mxg-comment>
            </el-card>
          </div>
          <!-- 编写回答 -->
          <div>
            <h2>参与发表回答</h2>
            <!-- 未登录-->
            <el-card v-if="!$store.state.userInfo">
              <h4>登录后参与评论交流、获取后续问答消息</h4>
              <div>
                <el-button @click="$store.dispatch('LoginPage')" type="primary" size="small">登录</el-button>
                <el-button @click="$store.dispatch('LoginPage')" type="primary" size="small">注册</el-button>
              </div>
            </el-card>
            <div v-else>
              <!-- 主题内容 markdown是用全局配置，不用import手动引入-->
              <mavon-editor :autofocus="false" ref="md" placeholder="请在此处编辑文章"
                            v-model="mdContent"
                            @change="getMdHtml" @imgAdd="uploadContentImg"
                            @imgDel="delContentImg" >

              </mavon-editor>
              <el-row style="margin-top: 20px" type="flex" justify="center" >
                <el-button type="primary" @click="submitReplay">提交问答</el-button>
              </el-row>
            </div>
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
    //获取问答详细数据
    async asyncData({ params, app }) {
        //查询问答详情
      const {data} = await app.$getQuestionById(params.id);
      //更新浏览数，判断再Cookie中是否存在
      const isView = app.$cookies.get(`question-view-${params.id}`);
      //判断从Cookie中获取的值是否存在
      if(!isView) {  //不存在，那么调用更新浏览数接口
        const {code} = await app.$updateQuestionViewCount(params.id);
        if(code === 20000) {  //如果后台更新成功，需要把isView放在浏览器的Cookie中
          data.viewCount ++;  //浏览数自增
        }
        //保存到Cookie中，关闭浏览器后删除
        app.$cookies.set(`question-view-${params.id}`, true);
      }
      //根据问答id获取该问答的评论信息
      const {data : commentList } = await app.$getReplayByQuestionId(params.id);
      return {data , commentList};
    },
    data() {
      return {
        isThumb : this.$cookies.get(`question-thumb-${this.$route.params.id}`) ?
          this.$cookies.get(`question-thumb-${this.$route.params.id}`) : false,  //获取浏览器cookie的值，true点赞，false未点赞
        //当前登录用户id
        userId : this.$store.state.userInfo && this.$store.state.userInfo.uid,
        //当前登录用户头像
        userImage : this.$store.state.userInfo && this.$store.state.userInfo.imageUrl,
        mdContent : '',
        htmlContent : '',
      }
    },
    methods: {
      //发布问答
      /*doSend(content) {
        console.log(`针对文章${this.$route.params.id}发布评论内容：${content}`);
        this.doChildSend(content);
      },*/
      //发布回复评论触发
      doChildSend(htmlContent , parentId = "-1", mdContent = "") {
        //console.log(`对父评论id：${parentId}发布的回复评论内容：${content}`);
        const data = {
          htmlContent,
          mdContent,
          parentId,
          questionId : this.$route.params.id,
          userId : this.userId,
          userImage : this.userImage,
          nickName: this.$store.state.userInfo && this.$store.state.userInfo.nickName,
        }
        //提交评论
        this.$addReplay(data).then(response => {
          const {code} = response;
          if(code === 20000) {  //回复成功，刷新评论数据
            this.$message.success("回复成功！");
            this.getCommentList();  //刷新评论
          }else {  //回复失败，刷新评论数据
            this.$message.error("回复失败！请重试！");
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
        this.$deleteReplayById(id).then(response => {
          const {code } = response;
          if(code === 20000) {  //删除评论成功，获取最新的评论信息
            this.$message.success("删除评论成功！");
            this.getCommentList();
          }else {  //删除评论失败，重新获取评论信息
            this.$message.error("删除失败，请重试！");
            this.getCommentList();
          }
        }).catch(error => {
          console.log("删除评论：", error);
          this.$message.error("服务器繁忙，请稍后重试！");
          this.getCommentList();
        });
      },
      async getCommentList() {  //获取问答评论信息
        const {data} = await this.$getReplayByQuestionId(this.$route.params.id);
        this.commentList = data;
      },
      getDateFormat(date) {   //格式化日期
        return dateFormat(date);
      },
      async handleThumb() {  //点赞
        if(!this.$store.state.userInfo) {
          this.$message.warning("请先登录，再点赞！");
          return false;
        }
        this.isThumb = !this.isThumb; //取反
        const count = this.isThumb ? 1 : -1;  //1.点赞加1，-1取消点赞减1
        //获取问答的id
        const questionId = this.$route.params.id;
        //更新获取取消点赞
        const {code} = await this.$updateQuestionThumb(questionId, count);
        if(code === 20000) {  //点赞或者取消点赞成功
          //更新页面显示的点赞数量
          this.data.thumhup = this.data.thumhup + count;  //加1或者减1
          //然后把isThumb保存到cookie中，并设置保存时间
          this.$cookies.set(`question-thumb-${this.$route.params.id}`, this.isThumb, {
            maxAge : 60*60*24*365*10,   //时间保存为10年
          });
        }
      },
      //mdContent: md内容 htmlContent:转成后的html内容
      getMdHtml(mdContent, htmlContent) {
        this.mdContent = mdContent;
        this.htmlContent = htmlContent;
      },
      //上传内容图片（第一个参数图片位置编号，file文件对象）
      uploadContentImg(pos, file) {
        //console.log("上传图片内容", file);
        //将图片上传到服务器
        let fd = new FormData();
        fd.append("file", file);
        this.$uploadImg(file).then(response => {
          const {code, data} = response;
          if(code === 20000) {
            //this.$message.success("图片上传成功！");
            //将图片回显到图片原来的位置，data为服务器图片路径地址
            this.$refs.md.$img2Url(pos, data);
          }
        }).catch(error => {
          console.log("markdown上传图片", error);
        });
      },
      //删除内容图片
      delContentImg(urlAndFileArr) {
        const fileUrl = urlAndFileArr[0];  //文件URL
        const file = urlAndFileArr[1];  //file对象
        //console.log("删除内容图片", fileUrl, file);
        this.$deleteImg(fileUrl);
      },
      submitReplay() {  //提交评论回答
        if(this.mdContent) {
          this.doChildSend(this.htmlContent, -1 , this.mdContent);
          this.mdContent = '';
          this.htmlContent = '';
        }else { //没有内容
          this.$message.error("请输入回答的内容！");
        }
      }
    }

  }
</script>

<style scoped>
  /* 样式本文件有效 */
  @import '@/assets/css/blog/article.css';
</style>
