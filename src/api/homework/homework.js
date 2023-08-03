import request from '@/utils/request'
import { parseStrEmpty } from '@/utils/ruoyi'

// 查询作业列表
export function listStudentwork(query) {
  return request({
    url: '/api/work/studentwork/list',
    method: 'get',
    params: query
  })
}

// 查询作业详细
export function getStudentwork(userId) {
  return request({
    url: '/api/work/studentwork/' + userId,
    method: 'get'
  })
}

// 新增作业
export function addStudentwork(data) {
  return request({
    url: '/api/work/studentwork',
    method: 'post',
    data: data
  })
}

// 修改作业
export function updateStudentwork(data) {
  return request({
    url: '/api/work/studentwork',
    method: 'put',
    data: data
  })
}

// 删除作业
export function delStudentwork(userId) {
  return request({
    url: '/api/work/studentwork/' + userId,
    method: 'delete'
  })
}
