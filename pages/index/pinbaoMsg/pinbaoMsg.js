const app = getApp();
const request = app.request;
const setting = app.globalData.setting;
Page({
  data: {
    url: setting.url,
    info:{},
  },
  onLoad: function (options) {
    var id = options.order_id
    this.getInfo(id)
  },
  getInfo:function(id){
    console.log(id)
    var that = this
    request.get(that.data.url + '/api/pinbao/getFactoryOrderDetails',{
      data:{
        order_id: id
      },
      success:function(res){
        // console.log(res)
        that.setData({
          info: res.data.result
        })
      }
    })
  },
  reIndex:function(){
    wx.reLaunch({
      url: '/pages/index/index/index',
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})