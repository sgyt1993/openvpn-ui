import request from '@/utils/request'

export function getCcdRoutes() {
  return request({
    url: '/api/ccdRoute/query',
    method: 'get'
  })
}

export function addCcdRoute(data) {
  return request({
    url: '/api/ccdRoute/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function getCcdRouteByRoleId(data) {
  return request({
    url: '/api/roleCcd/queryByRoleId',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;'
    },
    data: data,
    transformRequest: [
      function(data) {
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.lastIndexOf('&'))
        return ret
      }
    ]
  })
}

export function roleCcdRouteApply(data) {
  return request({
    url: '/api/roleCcd/queryByRoleId',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;'
    },
    data: data,
    transformRequest: [
      function(data) {
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.lastIndexOf('&'))
        return ret
      }
    ]
  })
}

export function getAllNotInRoleId(data) {
  return request({
    url: '/api/roleCcd/queryAllNotInRoleId',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;'
    },
    data: data,
    transformRequest: [
      function(data) {
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.lastIndexOf('&'))
        return ret
      }
    ]
  })
}

export function updateCcdRoute(data) {
  return request({
    url: `/api/ccdRoute/update`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function deleteCcdRoute(id) {
  return request({
    url: `/api/ccdRoute/del?ccdRouteId=${id}`,
    method: 'get'
  })
}
