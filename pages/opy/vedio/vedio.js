
var request = require('../../../utils/request')
var app = getApp()
var setting = app.globalData.setting;
var util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:setting.url,
    order_id: '',
    res: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      order_id: options.order_id
    })
    this.getInfo()
  },
  getInfo:function(){
    const that = this
    request.get(that.data.url + "/api/pinbao/order_detail",{
      data:{
        order_id:that.data.order_id
      },
      success:function(res){
        console.log(res)
        if (res.data.status ==1 ) {
          const obj = res.data.result
          obj.dabao_end_time  = obj.dabao_end_time?util.format(obj.dabao_end_time*1000,"yyyy-MM-dd hh:mm:ss.S"):''
          that.setData({
            res: obj
          })
          
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})