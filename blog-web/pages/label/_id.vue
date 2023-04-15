<template>
    <div>
        <!-- 面包屑 https://element.eleme.cn/#/zh-CN/component/breadcrumb -->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/label' }">标签</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: $route.path, query:{name:$route.query.name} }">{{$route.query.name}}</el-breadcrumb-item>
            <el-breadcrumb-item>标签动态</el-breadcrumb-item>
        </el-breadcrumb>

        <!--标签所属类别 -->
        <div v class="label-tab">
          <el-tabs value="question" type="card" @tab-click="handleClick">
            <el-tab-pane label="技术问答" name="question">
              <question-list name="question" :page="page"
                             :listData="questionList"
                             @fetch-data="fetchData"
              />
            </el-tab-pane>
            <el-tab-pane label="博客文章" name="article">
              <article-list  name="article"
                             :page="articlePage"
                             :listData="articleList"
                             @fetch-data="fetchData" />
            </el-tab-pane>
          </el-tabs>
        </div>
    </div>
</template>
<script>
  import QuestionList from '@/components/question/List';
  import ArticleList from '@/components/article/List';
export default {
    components: {
      QuestionList,
      ArticleList,
    },
    //路由校验
    validate({params}) {
      return /^\d+$/.test(params.id);
    },
    //页面首次加载问题列表
    async asyncData({params, app}) {
      //分页对象
      const page ={
        current : 1,
        size : 20,
        total : 0,
      }
      //查询问题列表数据
      const {data} = await app.$getQuestionListByLabelId(page, params.id);
      page.total = data.total;
      //查询问题结果返回渲染
      return {page, questionList : data.records};
    },
    data() {
        return {
          articleList: [], // 文章列表数组要声明出来，因为没有在asyncData返回
          articlePage : {   //文章列表page
            current : 1,
            size : 20,
            total : 0,
          },
        }
    },
    methods: {
      //标签切换
      handleClick(tab) {
        //tab切换，size默认为20
        this.fetchData(tab.name, 1, 20);
      },
      //问题模块子分页组件回传数据，使用emit回传
      async fetchData(name, current, size) {
        switch (name) {
          case 'question' :
            let response = null;
            //问题分页对象
            this.page.current = current;
            this.page.size = size;
            //查询技术问答列表
            response = await this.$getQuestionListByLabelId(this.page, this.$route.params.id);
            //总记录数
            this.page.total = response.data.total;
            //列表数据
            this.questionList = response.data.records;
            break;
          case 'article' :
            //文章分页对象
            this.articlePage.current = current;
            this.articlePage.size = size;
            //查询博客文章列表
            const query = {
              current : this.articlePage.current, //当前页
              size : this.articlePage.size,   //每页的文章数量
              labelId : this.$route.params.id,
            }
            const {data} = await this.$getArticleList(query);
            //文章总记录数
            this.articlePage.total = data.total;
            this.articleList = data.records;
            break;
        }
      }
    }
}
</script>
<style scoped>
  .label-tab {
    margin-top: 20px;
  }
.label-list {
    margin-top: 30px
}
.label-list .count {
    text-align: center;
    height: 100%;
    line-height: 20px;
}
.label-list .info {
    color: #999;
    font-size: 13px;
}
.label-list .title {
    display: inline-block;
    margin: 0 5px 0 0;
    font-size: 16px;
    height: 22px;
    line-height: 22px;
}
a:hover{
  text-decoration-line: underline;
}
</style>
