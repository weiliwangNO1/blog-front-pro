export default ({$axios}, inject) => {

  //查询热门问答接口
  inject("getHotList", page => $axios.$post('/question/api/question/hot', page));

  //查询最新问答接口
  inject("getNewList", page => $axios.$post('/question/api/question/new', page));

  //查询等待问答接口
  inject("getWaitList", page => $axios.$post('/question/api/question/wait', page));

  //查询问题详情
  inject("getQuestionById", id => $axios.$get(`/question/api/question/${id}`));

  //更新浏览数量
  inject("updateQuestionViewCount", id => $axios.$put(`/question/api/question/viewCount/${id}`));

  //通过问题id查询所有回复数据接口
  inject("getReplayByQuestionId" , questionId => $axios.$get(`/question/api/replay/list/${questionId}`));

  //更新点赞数
  inject("updateQuestionThumb", (questionId, count) => $axios.$put(`/question/api/question/thumb/${questionId}/${count}`));

  //新增问题回答内容
  inject("addReplay", data => $axios.$post(`/question/replay`, data));

  //删除评论  id是当前评论id
  inject("deleteReplayById", id => $axios.$delete(`/question/replay/${id}`));

  //新增问题接口
  inject("addQuestion" , data => $axios.$post(`/question/question`, data));

  //更改问题接口
  inject("updateQuestion", data => $axios.$put(`/question/question`, data));

  //标签Id查询问题列表
  inject("getQuestionListByLabelId", (page, labelId) => $axios.$post(`/question/api/question/list/${labelId}`, page));




}
