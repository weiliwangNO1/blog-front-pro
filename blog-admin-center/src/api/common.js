import request from '@/utils/request'
//这里是公共方法

//上传图片接口
export const uploadImg = (data) => {
  return request({
    url : `/article/file/upload`,
    method: 'post',
    data,  //图片数据
  })
}

//删除图片接口
export const deleteImg = (imageUrl) => {
  return request({
    url : `/article/file/delete`,
    method : 'delete',
    params: {
      'fileUrl' : imageUrl,
    }
  })
}
