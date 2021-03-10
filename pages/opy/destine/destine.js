
const app = getApp()
const request = require('../../../utils/request')
var setting = app.globalData.setting;
import Dialog from '../../../dist/dialog/dialog';
var flag = true //true 可以加载推荐商品 false 加载完了
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userImg:'https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/avator.png',
    // url: setting.url,
    url: setting.url,
    isAdministratorsStatus: -999,
    list:[],
    goodsList: [],//推荐商品
    p: 1,//推荐商品翻页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('app:userInfo')) {
      app.getUserInfo(function (userInfo) {
        that.setData({ userInfo: userInfo, click :false });
      }, true, false);
      return false;
    }
    var img = app.globalData.userInfo.head_pic || ""
    const that = this
    // request.get(that.data.url + "/api/pinbao/getOrderCount",{
      request.get(that.data.url + "/api/pinbao/getUserIdentity",{
      success:function(res){
        // console.log(res)
        var result = res.data.result.ad || []
        that.setData({
          isAdministratorsStatus: res.data.result.is_check_user,
          userImg: img,
          list: result.reverse()
        })
        // if (res.data.status === 1) {
        //   that.setData({
        //     sum: res.data.result.count,
        //     isAdministrators:res.data.result.is_check_user == 1 ? true : false,
        //     userImg: img
        //   })
        // }else if(res.data.status ==2) {
        //   wx.showToast({
        //     title: res.data.msg,
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   setTimeout(()=>{
        //     wx.navigateBack({
        //       delta: 1,
        //     })
        //   },2000)
        // }
      }
    })
    this.getRecomendGoods()
  },
  toMytions:function(){
    if (this.data.isAdministratorsStatus != 2 ) {
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
    } 
    wx.navigateTo({
      url: '/pages/subcontract/myTions/mytions',
    })
  },
  toCore:function() {
    wx.navigateTo({
      url: '/pages/subcontract/core/core',
    })
  },
  back1:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  getRecomendGoods(){//获取推荐商品
    if (!flag) {
      return
    }
    var that = this
    request.get(that.data.url + '/api/Activity/recommendGoods',{
      data: {
        type: 1,
        p: that.data.p
      },
      success:function(res){
        that.setData({
          goodsList: [...that.data.goodsList,...res.data.result]
        })
        if (res.data.result.length < 10) {
          flag = false
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
    var p = (this.data.p - 0) + 1
    this.setData({
      p
    },function(){this.getRecomendGoods()})
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})