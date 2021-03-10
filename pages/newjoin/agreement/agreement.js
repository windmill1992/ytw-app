// pages/newjoin/agreement/agreement.js
var app = getApp()
var request = require('../../../utils/request')
var setting = app.globalData.setting;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: setting.url,
    arrNodes: '',
    from: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      from: options.from
    })
    var url = options.from == 'shop' ? this.data.url +  '/api/Message/getSystemArticle' : this.data.url +  ''
    this.getAgreement( this.data.url + '/api/User/getSystemArticle' )
  },
  getAgreement:function(url){
    var that = this
    request.get( url,{
      success:function(res){
        console.log(res)
        // if (res.data.status == 1) {
        //   that.setData({
        //     arrNodes: res.data
        //   })
        // }
      }
    } )
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