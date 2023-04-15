import request from '@/utils/request';

//分页条件获取文章数据
export const getArticleList = (query, current= 1, size = 20) => {
  return request({
    url : `/article/article/search`,
    method : 'post',
    data : {
      ...query,
      current,
      size,
    }
  })
}

//通过文章id获取文章信息
export const getArticleById = (id) => {
  return request({
    url : `/article/article/${id}`,
    method : 'get',
  })
}

//文章审核通过
export const auditSuccess = (id) => {
  return request({
    url : `/article/article/audit/success/${id}`,
    method : 'get'
  })
}

//文章审核不通过
export const auditFail = (id) => {
  return request({
    url : `/article/article/audit/fail/${id}`,
    method : 'get',
  })
}

//根据文章id删除对应的文章
export const deleteArticleById = (id) => {
  return request({
    url : `/article/article/${id}`,
    method : 'delete'
  })
}
