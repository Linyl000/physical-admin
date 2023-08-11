import request from '@/utils/request'

// 查询专业列表
export function listStudy(query) {
  return request({
    url: '/system/study/list',
    method: 'get',
    params: query
  })
}

// 查询专业详细
export function getStudy(studyId) {
  return request({
    url: '/system/study/' + studyId,
    method: 'get'
  })
}

// 新增专业
export function addStudy(data) {
  return request({
    url: '/system/study',
    method: 'post',
    data: data
  })
}

// 修改专业
export function updateStudy(data) {
  return request({
    url: '/system/study',
    method: 'put',
    data: data
  })
}

// 删除专业
export function delStudy(studyId) {
  return request({
    url: '/system/study/' + studyId,
    method: 'delete'
  })
}
