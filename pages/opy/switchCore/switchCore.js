// pages/subcontract/switchCore/switchCore.js
var app = getApp();
// var common = require('../../../utils/common.js');
var request = require("../../../utils/request")
var setting = app.globalData.setting;
import Dialog from '../../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: setting.url,
    coreInfo: [],
    userStatus: -999
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCoreInfo()
    this.setData({
      userStatus: options.status
    })
  },
  getCoreInfo:function(){
    var that = this
    request.get( that.data.url + '/api/pinbao/getSellerList', {
      success:function(res){
        if (res.data.status == 1) {
          that.setData({
            coreInfo: res.data.result
          })
        }
      }
    } )
  },
  toWrite:function(e){

    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    var name = e.currentTarget.dataset.name
    if (status == 0) {
      return wx.showToast({
        title: '洽谈中，相信很快就可以使用啦``',
        icon: 'none'
      })
    }
    if (id) {
      if (this.data.userStatus != 2) {
        if (!wx.getStorageSync('app:userInfo')) {
          app.getUserInfo(function (userInfo) {
            that.setData({ userInfo: userInfo, click :false });
          }, true, false);
          return false;
        } else {
          if (wx.getStorageSync('app:userInfo').store_id == 0) {
            Dialog.confirm({
              message: '您还没有店铺，无法使用拼包功能。是否前往免费开店？',
              confirmButtonText: '免费开店',
              cancelButtonText: '再看看'
            }) 
              .then(() => {
                wx.navigateTo({
                  url: '/pages/newjoin/join4/join4',
                })
                Dialog.close()
              })
              .catch(() => {
                Dialog.close()
              });
              return 
          } else {
            Dialog.confirm({
              message: '该功能目前只针对批发商开放~~',
              confirmButtonText: '知道了',
              showCancelButton: false
            }) 
              .then(() => {
                Dialog.close()
              })
              .catch(() => {
                Dialog.close()
              });
              return 
          }
        }
        return
      }
      wx.navigateTo({
        url: '/pages/subcontract/write/write?seller_id=' + id + '&seller_name=' + name,
      })
    }
  },
  callTel:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
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