import request from '@/utils/request.js';

//测试调用接口2022-1-8

export const  test = () => {
  return request({
    url : '/test',
    method : 'get',
  })
}

export const  postTest = (data) => {
  return request({
    url : '/test',
    method : 'post',
    data : data,
  })
}

