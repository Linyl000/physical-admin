import request from '@/utils/request'

// 查询学生选课列表
export function listStuCourceSester(query) {
  return request({
    url: '/api/work/stuCourceSester/list',
    method: 'get',
    params: query
  })
}

// 查询学生选课详细
export function getStuCourceSester(id) {
  return request({
    url: '/api/work/stuCourceSester/' + id,
    method: 'get'
  })
}

// 新增学生选课
export function addStuCourceSester(data) {
  return request({
    url: '/api/work/stuCourceSester',
    method: 'post',
    data: data
  })
}

// 修改学生选课
export function updateStuCourceSester(data) {
  return request({
    url: '/api/work/stuCourceSester',
    method: 'put',
    data: data
  })
}

// 删除学生选课
export function delStuCourceSester(id) {
  return request({
    url: '/api/work/stuCourceSester/' + id,
    method: 'delete'
  })
}
