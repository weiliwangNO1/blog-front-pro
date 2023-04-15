import request from '@/utils/request'

//角色分页列表接口
export const getRoleList = (query, current= 1, size = 20) => {
  return request({
    url : `/system/role/search`,
    method : 'post',
    data: {
      ...query,
      current,
      size,
    }
  })
}

//新增角色
export const addRole = (data) => {
  return request({
    url : `/system/role`,
    method : 'post',
    data,
  })
}

//根据角色id获取角色数据
export const getRoleById = (id) =>{
  return request({
    url : `/system/role/${id}`,
    method : 'get'
  })
}

//更新角色
export const updateRole = (data) => {
  return request({
    url : `/system/role`,
    method : 'put',
    data,
  })
}

//根据角色id删除角色
export const deleteRoleById = (id) => {
  return request({
    url : `/system/role/${id}`,
    method : 'delete',
  })
}

//根据角色id获取拥有的所有菜单id
export const getMenuIdsByRoleId = (id) => {
  return request({
    url : `/system/role/${id}/menu/ids`,
    method : 'get'
  })
}

//提交角色权限数据，id为角色id，menuIds为选中的菜单id集合
export const saveRoleMenu = (id, menuIds) => {
  return request({
    url : `/system/role/${id}/menu/save`,
    method : 'post',
    data : menuIds,
  })
}
