import request  from '@/utils/request.js';

//获取文章类别数据
export const getCateGoryList = (query, current = 1, size = 20) => {
  return request({
    url : `/article/category/search`,
    method : 'post',
    data: {   //...query是ES6的语法，合并字段，数据格式为{name: "", status: 0, current: 1, size: 20}
      ...query,
      current,
      size,
    }
  })
}

//新增类别
export const addCategroy = (data) => {
  return request({
    url : `/article/category`,
    method : 'post',
    data,
  })
}

//通过类别id查询对应的类别数据信息
export const getCategoryById = (id) => {
  return request({
    url : `/article/category/${id}`,
    method : 'get',
  })
}

//更新类别数据
export const updateCategory = (data) => {
  return request({
    url : `/article/category`,
    method : 'put',
    data,
  })
}

//根据id删除文章类别
export const deleteCategoryById = (id) => {
  return request({
    url : `/article/category/${id}`,
    method : 'delete'
  })
}

//查询所有正常状态的分类
export const getNormalCategoryList = () => {
  return request({
    url : `/article/category/list`,
    method : 'get'
  })
}

//获取所有正常的分类和标签
export const getCategoryAndLabel = () =>{
  return request({
    url : `/article/category/label/list`,
    method : 'get',
  })
}

