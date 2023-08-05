import request from '@/utils/request'

// 查询课程节数列表
export function listCourseNumWork(query) {
  return request({
    url: '/courseNumWork/courseNumWork/list',
    method: 'get',
    params: query
  })
}

// 查询课程节数详细
export function getCourseNumWork(id) {
  return request({
    url: '/courseNumWork/courseNumWork/' + id,
    method: 'get'
  })
}

// 新增课程节数
export function addCourseNumWork(data) {
  return request({
    url: '/courseNumWork/courseNumWork',
    method: 'post',
    data: data
  })
}

// 修改课程节数
export function updateCourseNumWork(data) {
  return request({
    url: '/courseNumWork/courseNumWork',
    method: 'put',
    data: data
  })
}

// 删除课程节数
export function delCourseNumWork(id) {
  return request({
    url: '/courseNumWork/courseNumWork/' + id,
    method: 'delete'
  })
}
