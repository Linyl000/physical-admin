import request from '@/utils/request'

// 查询课程评价列表
export function listEvaluate(query) {
  return request({
    url: '/base/evaluate/list',
    method: 'get',
    params: query
  })
}

// 查询课程评价详细
export function getEvaluate(evaluateId) {
  return request({
    url: '/base/evaluate/' + evaluateId,
    method: 'get'
  })
}

// 新增课程评价
export function addEvaluate(data) {
  return request({
    url: '/base/evaluate',
    method: 'post',
    data: data
  })
}

// 修改课程评价
export function updateEvaluate(data) {
  return request({
    url: '/base/evaluate',
    method: 'put',
    data: data
  })
}

// 删除课程评价
export function delEvaluate(evaluateId) {
  return request({
    url: '/base/evaluate/' + evaluateId,
    method: 'delete'
  })
}
