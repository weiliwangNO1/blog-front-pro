export default ({$axios}, inject) => {

  //上传图片接口
  inject("uploadImg", data => $axios.$post(`/article/file/upload`, data));

  //删除图片接口
  inject("deleteImg", fileUrl => $axios.$delete(`/article/file/delete`, {params: {fileUrl: fileUrl}}));

}
