import request from '@/utils/request';

//广告分页列表接口
export const getAdvertList = (query, current = 1, size = 20) => {
  return request({
    url : `/article/advert/search`,
    method : 'post',
    data: {
      ...query,
      current,
      size,
    }
  })
}

//新增广告
export const addAdvert = (data) => {
  return request({
    url : `/article/advert`,
    method : 'post',
    data,
  })
}

//根据广告id获取广告信息
export const getAdvertById = (id) => {
  return request({
    url : `/article/advert/${id}`,
    method : 'get',
  })
}

//更新广告信息
export const updateAdvert = (data) => {
  return request({
    url : `/article/advert`,
    method : 'put',
    data,  //需要更新的广告数据
  })
}

//根据id删除广告
export const deleteAdvert = (id) => {
  return request({
    url : `/article/advert/${id}`,
    method : 'delete',
  })
}
