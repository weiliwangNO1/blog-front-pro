<template>
  <!--文章列表 -->
  <div id="list-container">
    <ul class="note-list">
      <!--支持展示有图片或没有图片 -->
      <li :class=" item.imageUrl ? 'have-img' : ''" v-for="item in articleList" :key="item.id">
        <div class="content">
          <!-- <nuxt-link>与<router-link>用法一致 -->
          <nuxt-link :to="`/article/${item.id}`" target="_blank">
            <p class="title">{{item.title}}</p>
            <p class="abstract">
              {{item.summary}}
            </p>
          </nuxt-link>
          <div class="meta">
            <nuxt-link :to="`/user/${item.userId}`" target="_blank" class="nickname">
              <i class="el-icon-user-solid"></i>{{item.nickName}}
            </nuxt-link>
            <span><i class="el-icon-thumb"></i>{{item.thumhup}}</span>
            <span><i class="el-icon-view"></i>{{item.viewCount}}</span>
          </div>
        </div>
        <!--图片 -->
        <nuxt-link v-if="item.imageUrl" :to="`/article/${item.id}`" class="wrap-img" target="_blank">
          <img :src="item.imageUrl">
        </nuxt-link>
      </li>
    </ul>
    <!-- 文章列表分页操作 组件居中 -->
    <el-row class="page" type="flex" justify="center">
      <el-tag v-if="noMore" type="success">没有更多了</el-tag>
      <el-button @click="onloadCategroy" v-else type="primary" size="small" round :loading="loading">
        {{loading ? '数据正在加载中..' : '点击查看更多'}}
      </el-button>
    </el-row>

  </div>

</template>

<script>
  export default  {
    data() {
      return {
        loading : false,   //文章列表加载中  true 加载中，false加载结束
        noMore : false,   //没有更多文章,true是，false否
      }
    },
    validate({params}) {
      const id = params.id ? params.id : 0;
      //接收参数必须是数值类型
      return /^\d+$/.test(id);
    },
    async asyncData({ params, app} ) {
      //文章分页，根据前端传入的参数，获取文章分页数据
      //接收文章类型id
      const categoryId = params.id ? params.id : null;
      //获取文章列表
      const query = {
        categoryId : categoryId,
        current : 1, //当前页
        size : 20,   //每页的文章数量
      }
      const {data} = await app.$getArticleList(query);
      if(data.records === null || data.records.length <= 0) {
        this.loading = false;
        this.noMore = true;  //显示没有更多了
      }
      //asyncData返回的数据会直接赋值给data()数据里
      return { query , articleList: data.records }; // articleList: data.records
    },
    methods: {
      async onloadCategroy() {   //点击加载更多文章
        this.loading = true;  //提示加载中
        //页数自增1，获取下一页数据
        this.query.current ++;
        const {data} = await this.$getArticleList(this.query);
        debugger;
        if(data.records && data.records.length >0) {  //说明还有文章数据
          this.articleList = this.articleList.concat(data.records);  //文章追加到articleList对象里
        }else {  //没有文章数据了
          this.noMore = true;
        }
        this.loading = false;  //加载完毕
      },
    }

  }
</script>

<style scoped>
  /* 样式布局只在本页面有效 */
  @import '@/assets/css/blog/list.css';
</style>
