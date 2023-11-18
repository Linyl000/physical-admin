import request from '@/utils/request'

// 查询学生作业列表
export function listWork(query) {
  return request({
    url: '/system/work/list',
    method: 'get',
    params: query
  })
}

// 查询学生作业详细
export function getWork(id) {
  return request({
    url: '/system/work/' + id,
    method: 'get'
  })
}

// 新增学生作业
export function addWork(data) {
  return request({
    url: '/system/work',
    method: 'post',
    data: data
  })
}

// 修改学生作业
export function updateWork(data) {
  return request({
    url: '/system/work',
    method: 'put',
    data: data
  })
}

// 删除学生作业
export function delWork(id) {
  return request({
    url: '/system/work/' + id,
    method: 'delete'
  })
}
