var app = getApp();
var request = app.request
var setting = require('../setting')
export const req = (options)=>{
  return new Promise((resolve,reject)=>{
    var url = options.url.indexOf('http') == -1 ? (setting.url + options.url) : options.url
    if (!options.showLoading) {wx.showLoading({})} //默认提示Loading...
    wx.request({
      url: url + '?is_json=1'+ '&unique_id=' + request.getUniqueId() + '&token=' + request.getToken(),
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || { "content-type": "application/x-www-form-urlencoded" },
      complete:(res)=>{
        if (res.statusCode != 200) { //请求异常  抛出错误 回退一页
          wx.showToast({title: '开发完善中', icon: 'none',mask: true })
          setTimeout(() => {wx.navigateBack({})}, 800);
          return
        }
        if (res.data.status != 1) { //请求返回不是 1 依据传递的是否要页面自己处理 决定是否返回结果 
          if (options.doSelf) {
            resolve(res.data)
            return
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            resolve('')
            return
          }
        }
        resolve(res.data)
      },
      
    })
  }).catch((err)=>{
    reject(err)
  })
}

