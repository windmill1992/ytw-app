var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var mapType = ['WAITPAY', 'WAITSEND', 'WAITRECEIVE', '']
var check = false
var common = require('../../../utils/common.js'); 
var { operaList } = require('../../../utils/util2.js');
import { req } from '../../../utils/req'
Page({
  data: {
    shouldOperationsShow: false,
    shouldProposalShow: false,
    operaList:operaList,
    isiphoneX: wx.getStorageSync('isiphoneX') || false,
    is_A: true,
    url: setting.url,
    active: 0,
    userInfo: app.globalData.userInfo,
    p: 1,
    page: 3,
    curType: 'WAITPAY',//请求类型
    list: [],//存放数据
    showRemarkPopup: false,//展示备注框
    remarkVal: '',
    curIndex: {},//当前操作的数据
    isFirst: true,
    load: true,
    showEmpty: false,
    proposalData: { //反馈 相关
      img: [],
      proposalArea: ''
    },
    isProposalDone: false,//反馈是否完成展示成功的界面
  },
  // async rreeqq(){
  //   var res = await req({
  //     url:'/api/StoreOrder/storeOrderList',
  //     data:{
  //       type: '',
  //       store_id: 48,
  //       p: 1
  //     }
  //   })
  //   console.log(res)
  //   console.log('123321')
  // },
  getInfo(){
    var that = this
    if (!this.data.load) {
      return
    }
    request.get( that.data.url + '/api/StoreOrder/storeOrderList',{
      data:{
        type: that.data.curType,
        store_id: that.data.userInfo.store_id,
        p: that.data.p
      },
      success:function(res){
        if (check) {
          check = false
          that.setData({
            load: true
          },function(){
            that.setData({
              list: res.data.result,
              load: !(res.data.result.length < 10)
            })
          })
          return
        }
        that.setData({
          list: that.data.list.concat(res.data.result),
          load: !(res.data.result.length == 0)
        })
        
      },
      complete:function(){
        wx.stopPullDownRefresh()
      },
    })
  },
  resetData(){//重置部分数据
    this.setData({
      p: 1,
      list: [],
      load: true
    })
  },
  onNavChange(e){ //切换Nav
    check = true
    this.setData({
      curType: mapType[e.detail.index],
      load: true,
      p: 1
    },function(){this.getInfo()})
    
  },
  clickItem(e){ //点击订单中的商品
    // console.log(e)  this.data.list[index]
    var index = e.detail.index
    wx.navigateTo({
      url: `/pages/goods/orderDetail/orderDetail?order_id=${this.data.list[index].order_id}&store_id=${this.data.list[index].store_id}&order_sn=${this.data.list[index].order_sn}`
    })
  },
  operationOrder(e){ //下面的按钮操作
    // console.log(e,this.data)
    var that = this
    var type = e.detail.type
    var id = e.detail.id
    var index = e.detail.index
    this.setData({
      curIndex: index
    })
    if (type == 'zf') { //自发
      if (that.data.list[index].is_delivery == 1) {
        return wx.showToast({
          title: '该订单已申请平台代发！请等待平台代发~',
          icon: 'none'
        })
      }
      wx.navigateTo({
        // url: '/pages/goods/deliverGoods/deliverGoods?order_id=' + id + '&store_id=' + this.data.list[0].store_id + '&orderType=' + (this.data.list[index].seller_order_status_detail == '待发货' ? 'a' : 'b') + '&shopId=' + this.data.list[0].shop_id,
        url: '/pages/goods/deliverGoods/deliverGoods?index=' + index,
      })
    } else if (type == 'bz') {//备注
      this.setData({
        showRemarkPopup: true
      })
    } else if (type == 'df') {//代发
      
      wx.showModal({
        content: '请平台代发后，您将不能自己发货，且该订单的款项将划拨给平台，由平台工作人员上门现金拿货代发出去，谢谢您的配合',
        confirmColor: '#18c2ba',
        cancelText: '不需要了',
        confirmText: '申请代发',
        success (res) {
          if (res.confirm) {
            request.post(that.data.url + '/api/StoreOrder/platformSend', {
              data: {
                store_id: that.data.list[index].store_id,
                order_id: that.data.list[index].order_id,
              },
              success: function(res){
                if (res.data.status == 1) {
                  wx.showToast({
                    title: '代发成功',
                  })
                  setTimeout(()=>{
                    that.resetData()
                    that.getInfo()
                  },1000)
                }
              }
            })
          } else if (res.cancel) {
          }
        }
      })
    } else if (type == 'gj') {
      wx.navigateTo({
        url: `/pages/goods/changeGoodsPrice/changeGoodsPrice?order_id=${this.data.list[index].order_id}&store_id=${this.data.list[index].store_id}&order_sn=${this.data.list[index].order_sn}`
      })
    } else if (type == 'pj') {
      
    }
  },
  onPopupClose(){
    this.setData({
      showRemarkPopup: false
    })
  },
  areaInput(e){//备注输入框变化
    var val = e.detail.value + ''
    val = val.substring(0,100)
    this.setData({
      remarkVal: val
    })
  },
  savreRemark(){ //保存备注
    var that = this
    var Val = that.data.remarkVal
    if (Val.trim() == '') {
      return
    }
    var order = that.data.list[that.data.curIndex]
    request.post(that.data.url + '/api/StoreOrder/orderLogAdd',{
      data: {
        type: order.seller_order_status_detail == '待发货' ? 'WAITSEND' : 'WAITPAY',
        order_id: order.order_id,
        store_id: order.store_id,
        order_status: order.order_status,
        pay_status: order.pay_status,
        shipping_status: order.shipping_status,
        user_id: that.data.userInfo.user_id,
        note: Val
      },
      success:function(res){
        wx.showToast({
          title: '保存成功',
        })
        that.setData({
          showRemarkPopup: false,
          remarkVal: ''
        })
      }
    })
  },
  onLoad: function (options) {
    // this.rreeqq()
    this.setData({
      userInfo: app.globalData.userInfo,
      is_A: app.globalData.userInfo.is_B == 0 && app.globalData.userInfo.store_id > 0
    },function(){
      this.getInfo()
    })
  },
  onReady: function () {

  },
  onShow: function () {
    if (this.data.isFirst) {
      this.setData({
        isFirst: false
      })
      return
    } else {
      this.resetData()
      this.getInfo()
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    this.resetData()
    this.getInfo()
  },
  onReachBottom: function () {
    this.setData({
      p: this.data.p - 0 + 1
    },function(){
      this.getInfo()
    })
  },
  onShareAppMessage: function () {
    
  },
  // =======================================  以下为新增加店铺设置 以及底部导航
  closeOperations(){//关闭店铺管理的操作选项
    this.setData({
      shouldOperationsShow: false,
      shouldProposalShow: false
    })
  },
  distributTopages: function (e) {
    var index = e.currentTarget.dataset.idx
    var is_A = (this.data.userInfo.is_B == 0 && this.data.userInfo.store_id > 0)
    if (is_A == 0 && (e.currentTarget.dataset.idx == 5 || e.currentTarget.dataset.idx == 3)) {
      return wx.showToast({
        title: '开发中~',
        icon: 'none'
      })
    }
    if (index == 2) { //点击的店铺操作
      if (this.data.shouldProposalShow) {
        return
      }
      this.setData({
        shouldOperationsShow: !this.data.shouldOperationsShow
      })
      return
    }
    common.todistribut(e.currentTarget.dataset.idx, this.data.page);
  },
  addNewGoods:function(){
    wx.navigateTo({
      url: '/pages/goods/addGoods/index?goods_id=0&is_A=' + (this.data.userInfo.is_B == 1 ? 0 : 1),
    })
  },
  clickTelmpleteOpera(e){
    var index = e.currentTarget.dataset.index + ''
    // if (index != 0) {
    //   wx.showToast({
    //     title: '开发中~',
    //     icon: 'none'
    //   })
    //   return
    // }
    // console.log(index)
    var that = this
    var pages = getCurrentPages()
    var historyArr = []
    for (let i = 0; i < pages.length; i++) {
        historyArr.push(pages[i].route)
    }
    that.setData({
      shouldOperationsShow: false
    })
    switch (index) {
      case '0':
        var index = historyArr.indexOf("pages/user/account_b/account_b")
        if (index != -1) {
            wx.navigateBack({
            delta: historyArr.length - index - 1,
            })
            return
        }
        wx.navigateTo({
          url: '/pages/user/account_b/account_b',
        })
        break;
      case '1':
        var index = historyArr.indexOf("/pages/distribut0/DIYshop/DIYshop")
        if (index != -1) {
            wx.navigateBack({
            delta: historyArr.length - index - 1,
            })
            return
        }
        wx.navigateTo({
          url: '/pages/distribut0/DIYshop/DIYshop',
        })
        break;
      case '2':
        that.setData({
          shouldProposalShow: true
        })
        break;
      case '3':
        var index = historyArr.indexOf("/pages/distribut0/DIYshopPoster/DIYshopPoster")
        if (index != -1) {
          wx.navigateBack({
          delta: historyArr.length - index - 1,
          })
          return
        }
        wx.navigateTo({
          url: '/pages/distribut0/DIYshopPoster/DIYshopPoster',
        })
        break;
      default:
        break;
    }
  },
  proposalAddImg(){//增加投诉建议的图片

    var that = this
    if (that.data.proposalData.img.length >= 5) {
      return
    }
    wx.chooseImage({
      count: 5 - this.data.proposalData.img,
      sourceType: ['album'],
      success:function(res){
        res.tempFilePaths.forEach((item)=>{
          that.uploadFile(item)
        })
      }
    })
  },
  delProposalImg(e){//删除投诉建议的图片
    var index = e.currentTarget.dataset.index
    var imgs = this.data.proposalData.img
    imgs.splice(index,1)
    this.setData({
      [`proposalData.img`]: imgs
    })
  },
  uploadFile:function(src){ //上传图片
    if (this.data.proposalData.img >= 5) {
      return
    }
    wx.showLoading({
      title: '上传中...',
      mask:true
    })
    const that = this
    wx.uploadFile({
      filePath: src,
      name: 'qinzi_imgs',
      url: that.data.url + '/api/newjoin/upload_qianzi_img',
      success:function(res){
        if(res.statusCode !== 200){
          return
        }
        var result = JSON.parse(res.data)
        that.setData({
          [`proposalData.img`]: [...that.data.proposalData.img,...[result.result]]
        })
        wx.hideLoading()
      }
    })
  },
  proposalAreaInput(e){ //input值变化
    this.setData({
      [`proposalData.proposalArea`]: e.detail.value
    })
  },
  proposalSubmit(){//提交
    var complaint_content = this.data.proposalData.proposalArea + ''
    var img = this.data.proposalData.img
    complaint_content = complaint_content.replace(' ','')
    if (complaint_content.length <= 5) {
      return wx.showToast({
        title: '请输入至少5个字以上的问题描述~',
        icon: 'none'
      })
    }
    if (img.length == 0) {
      return wx.showToast({
        title: '请至少上传一张问题描述图片~',
        icon: 'none'
      })
    }
    var complaint_img = img.join(',')
    var that = this
    request.post(that.data.url + '/api/StoreBusiness/complaint', {
      data: {
        store_id: wx.getStorageSync('app:userInfo').store_id || 0,
        user_id: wx.getStorageSync('app:userInfo').user_id || 0,
        complaint_content,
        complaint_img
      },
      success:function(res){
        that.setData({
          proposalData: {
            img: [],
            proposalArea: ''
          },
          isProposalDone: true
        })
      }
    })
  }

})