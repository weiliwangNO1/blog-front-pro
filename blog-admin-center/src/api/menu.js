import request from '@/utils/request'

//获取菜单列表，不用分页
export const getMenuList = (query) =>{
  return request({
    url : `/system/menu/search`,
    method : 'post',
    data : query,
  })
}

//新增菜单
export const addMenu = (data) =>{
  return request({
    url : `/system/menu`,
    method : 'post',
    data,
  })
}

//通过菜单id获取菜单数据
export const getMenuById = (id) => {
  return request({
    url : `/system/menu/${id}`,
    method : 'get'
  })
}

//更新菜单数据
export const updateMenu = (data) => {
  return request({
    url : `/system/menu`,
    method : 'put',
    data,
  })
}

//根据菜单id删除菜单信息
export const deleteMenuById = (id) => {
  return request({
    url : `/system/menu/${id}`,
    method : 'delete',
  })
}
