import request from '@/utils/request'

//获取标签分页数据  query查询条件对象，current当前页码，size每页记录数 current默认为1，size默认为20
export const getLabelList = (query, current = 1, size = 20) => {
  return request({
    url : `/article/label/search`,
    method: 'post',
    data: {   //...query, current,size会合并属性为一个对象
      ...query,
      current,
      size,
    }
  })
}

//新增标签
export const addLabel = (data) => {
  return request({
    url : `/article/label`,
    method: 'post',
    data,
  })
}

//通过标签id查询数据接口
export const getLabelById = (id) => {
  return request({
    url : `/article/label/${id}`,
    method : 'get',
  })
}

//更新标签数据
export const updateLabel = (data) => {
  return request({
    url : `/article/label`,
    method : 'put',
    data,
  })
}

//根据标签id删除标签信息
export const deleteLabelById = (id) => {
  return request({
    url : `/article/label/${id}`,
    method : 'delete',
  })
}



