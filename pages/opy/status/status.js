
const app = getApp()
var setting = app.globalData.setting;
const request = require('../../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:setting.url,
    isOk: false,
    store_id: 0,
    mode: ''
  },

  navBack2:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  navBack3:function(){
    wx.navigateBack({
      delta: 2,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.status == 1) {
      this.setData({
        isOk: true,
        mode: options.mode
      })
    }
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