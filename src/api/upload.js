import request from '@/utils/request'

//单文件上传
export function uploadImg(param) {
  return request({
    url: '/usermanage/api/uploadImg',
    method: 'post',
    data: param
  })
}
//批量附件上传
export function batchUploadImg(param) {
  return request({
    url: '/usermanage/api/batchUploadImg',
    method: 'post',
    data: param
  })
}

//单文件上传到表单附件
export function uploadImgToOaFile(param) {
  return request({
    url: '/usermanage/api/OaFormFile/uploadImg',
    method: 'post',
    data: param
  })
}

//根据ids获取表单附件列表
export function getOaFormFileListByIds(ids) {
  return request({
    url: '/usermanage/api/list/' + ids,
    method: 'get'
  })
}
