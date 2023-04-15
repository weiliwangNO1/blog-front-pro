import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

//分页获取用户列表数据
export const getUserList = (query , current = 1, size = 20) => {
  return request({
    url : `/system/user/search`,
    method : 'post',
    data : {
      ...query,
      current,
      size
    }
  })
}

//新增用户
export const addUser = (data) =>{
  return request({
    url : `/system/user`,
    method : 'post',
    data,
  })
}

//根据用户id获取用户数据
export const getUserbyId = (id) => {
  return request({
    url : `/system/user/${id}`,
    method : 'get'
  })
}

//更新用户数据
export const updateUser = (data) => {
  return request({
    url : `/system/user`,
    method : 'put',
    data,
  })
}

//根据用户id删除（禁用）用户
export const deleteUserById = (id) =>{
  return request({
    url : `/system/user/${id}`,
    method : 'delete'
  })
}

//根据用户Id查询拥有所有角色的id集合
export const getRoleIdsByUserId = (id) =>{
  return request({
    url : `/system/user/${id}/role/ids`,
    method : 'get'
  })
}

//提交用户分配角色
export const saveUserRole = (id, roleIds) => {
  return request({
    url : `/system/user/${id}/role/save`,
    method: 'post',
    data:roleIds
  })
}

//用户提交新密码
export const updateUserPassword = (data) => {
  return request({
    url : `/system/user/password`,
    method : 'put',
    data,
  })
}

//查询登录用户所拥有的权限菜单树
export const getUserMenuList = (userId) => {
  return request({
    url : `/system/menu/user/${userId}`,
    method : 'get',
  })
}
