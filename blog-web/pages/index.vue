<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!--左侧区域 -->
      <el-col class="hidden-sm-and-down" :md="3">
        <!-- 技术频道 -->
        <el-divider content-position="left">技术频道</el-divider>
        <!--类目 -->
        <el-menu active-text-color="#ffffff"
        router
        :default-active="$route.path">
          <el-menu-item index="/">推荐</el-menu-item>
          <el-menu-item v-for="item in categroyList" :key="item.id" :index="'/' + item.id">
            {{item.name}}
          </el-menu-item>
        </el-menu>
      </el-col>
      <!--中间区域 -->
      <el-col :xs="24" :sm="24" :md="16">
        <div class="blog-center">
          <!--走马灯 -->
          <div class="banner">
            <el-carousel height="230px">
              <el-carousel-item v-for="item in advertList1" :key="item.id">
                <a :target="item.advertTarget" :href="item.advertUrl">
                  <img :src="item.imageUrl">
                </a>
              </el-carousel-item>
            </el-carousel>
          </div>
          <!--文章列表 -->
          <nuxt-child />
        </div>
      </el-col>
      <!--右侧区域 -->
      <el-col class="hidden-sm-and-down" :md="5">
        <el-row>
          <el-col>
            <el-card class="right-card" shadow="hover" :body-style="{padding:'10px'}">
              <p>广告火热招商</p>
              <el-carousel height="210px">
                <el-carousel-item v-for="item in advertList2" :key="item.id">
                  <a :target="item.advertTarget" :href="item.advertUrl">
                    <img :src="item.imageUrl">
                    <span>{{item.title}}</span>
                  </a>
                </el-carousel-item>
              </el-carousel>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>


<script>
  export default {

    //服务端获取数据
    async asyncData({ app }) {
      //查询技术频道列表数据
      const {data : categroyList} = await app.$getCategoryList();
      //获取指定位置的广告信息(位置1)
      const {data : advertList1} = await  app.$getAdvertList(1);
      //获取指定位置的广告信息(位置2)
      const {data : advertList2} = await  app.$getAdvertList(2);

      return {categroyList, advertList1, advertList2};
    }

  }
</script>

<style scoped>
  /* scoped局部引入样式 */
  @import '@/assets/css/blog/index.css';
</style>
