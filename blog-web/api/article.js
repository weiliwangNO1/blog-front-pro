//需要在nuxt.config.js中的plugins引入该插件
export default ({$axios}, inject) => {

  //查询技术频道列表接口
  inject("getCategoryList", () => $axios.$get('/article/api/category/list'));

  //获取指定位置的广告信息（带有反单引号）
  inject("getAdvertList", position => $axios.$get(`/article/api/advert/show/${position}`));

  //文章列表分页接口
  inject("getArticleList", query => $axios.$post('/article/api/article/list', query));

  //根据id查询文章详情
  inject("getArticleById" , id => $axios.$get(`/article/api/article/${id}`));

  //根据id更新文章浏览数  反单引号会自动拼接
  inject("updateArticleViewCount" , id => $axios.$put(`/article/api/article/viewCount/${id}`));

  //更新点赞数量接口
  inject("updateArticleThumb", (articleId, count) => $axios.$put(`/article/article/thumb/${articleId}/${count}`));

  //根据文章id获取对应的评论信息
  inject("getCommentListByArticleId", articleId => $axios.$get(`/article/api/comment/list/${articleId}`));

  //新增文章评论接口
  inject("addComment", data => $axios.$post('/article/comment', data));

  //删除文章评论接口
  inject("deleteCommentById", id => $axios.$delete(`/article/comment/${id}`))

  //获取新增文章的所有正常的分类和标签
  inject("getCategoryAndLabel" , () => $axios.$get('/article/api/category/label/list'));

  //新增文章
  inject("addArticle" , data => $axios.$post('/article/article', data));

  //更新修改文章
  inject("updateArticle", data => $axios.$put('/article/article', data));

}
