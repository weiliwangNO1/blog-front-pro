<template>
  <div>
    <!-- 博客头部信息 -->
    <blog-header />
    <!-- 博客中间信息 -->
    <div class="weili-blog">
      <nuxt />
    </div>
    <!-- 博客底部信息 -->
    <blog-footer />

    <!-- 回到顶部按钮 -->
    <el-backtop  :bottom="100"></el-backtop>

  </div>
</template>

<script >
  import BlogFooter from '@/components/layout/Footer.vue';
  import BlogHeader from '@/components/layout/Header.vue';
  export default {
    data() {
      return {

      }
    },
    components: {   //使用ES6的写法
      BlogFooter,
      BlogHeader
    }
  }

</script>

<style>
  .weili-blog {
    padding-top: 90px;
    max-width: 1140px;
    margin: 0 auto;
  }
</style>

