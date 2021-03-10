var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var util = require('../../../utils/util.js');
// ytw-express  ytw999
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: setting.url,//
    store_id: '',//
    order_id: '',//
    order_sn: '',//
    userInfo: app.globalData.userInfo,
    eyeFlag: {//控制**显示
      a: false,
      b: false
    },
    list: [],//订单相关数据
    showRemarkPopup: false,//展示备注框
    isModify: false,//是添加备注还修改  false 添加
    curIndex: '',//当前操作的数据
    orderLog: {},
    remarkVal: '',//备注
    express: {
      code: 0
    },//快递信息
  },

  onLoad: function (options) {
    this.setData({
      store_id: options.store_id,
      order_id: options.order_id,
      order_sn: options.order_sn
    },function(){this.getDetail()})
    this.getOrderLogList()
  },
  getDetail(){
    var that = this
    // /api/StoreOrder/storeOrderDetails 
    request.get(that.data.url + '/api/StoreOrder/storeOrderDetails', {
      data: {
        store_id: that.data.store_id,
        order_id: that.data.order_id,
        order_sn: that.data.order_sn,
      },
      success: function(res) {
        var list = res.data.result
        // order.vrorder[i].vrUsertimeFormat = util.format(order.vrorder[i].vr_usetime, 'yyyy-MM-dd hh:mm');
        list.time1 = res.data.result.add_time == 0 ? '- - - -' : util.format(res.data.result.add_time, 'yyyy-MM-dd hh:mm')
        list.time2 = res.data.result.pay_time == 0 ? '- - - -' :  util.format(res.data.result.pay_time, 'yyyy-MM-dd hh:mm')
        list.time3 = res.data.result.confirm_time == 0 ? '- - - -' :  util.format(res.data.result.confirm_time, 'yyyy-MM-dd hh:mm')
        that.setData({
          list: [list]
        })
        if (res.data.result.shipping_code && res.data.result.invoice_no ) {
          that.requestExpress({shipping_code: res.data.result.shipping_code,invoice_no: res.data.result.invoice_no})
        }
      }
    })
  },
  operationOrder(e){ //下面的按钮操作
    console.log(e,this.data)
    var that = this
    var type = e.detail.type
    var id = e.detail.id
    var index = e.detail.index
    this.setData({
      curIndex: index
    })
    if (type == 'zf') { //自发
      wx.navigateTo({
        // url: '/pages/goods/deliverGoods/deliverGoods?order_id=' + id + '&store_id=' + this.data.list[0].store_id + '&orderType=' + (this.data.list[index].seller_order_status_detail == '待发货' ? 'a' : 'b') + '&shopId=' + this.data.list[0].shop_id,
        url: '/pages/goods/deliverGoods/deliverGoods?index=0',
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
                store_id: that.data.list[0].store_id,
                order_id: that.data.list[0].order_id,
              },
              success: function(res){
                if (res.data.status == 1) {
                  wx.showToast({
                    title: '代发成功',
                  })
                  that.resetData()
                  that.getInfo()
                }
              }
            })
          } else if (res.cancel) {
          }
        }
      })
    }
  },
  copyOrderCode(e){//拷贝订单号
    wx.setClipboardData({
      data: e.currentTarget.dataset.code,
      success:function(){
        wx.getClipboardData({
          success: (option) => {
            wx.showToast({
              title: '订单号复制成功',
              icon: 'none'
            })
          },
        })
      }
    })
  },
  clickItem(e){
    
  },
  onPopupClose(){
    this.setData({
      showRemarkPopup: false
    })
  },
  areaInput(e){
    var val = e.detail.value + ''
    val = val.substring(0,100)
    this.setData({
      remarkVal: val
    })
  },
  savreRemark(){ //保存备注
    var that = this
    var remark = that.data.remarkVal + ''
    if (remark.trim() == '') {
      return
    }
    var data = {
      type: that.data.list[0].seller_order_status_detail == '待发货' ? 'WAITSEND' : 'WAITPAY',
      order_id: that.data.list[0].order_id,
      store_id: that.data.list[0].store_id,
      order_status: that.data.list[0].order_status,
      pay_status: that.data.list[0].pay_status,
      shipping_status: that.data.list[0].shipping_status,
      user_id: that.data.userInfo.user_id,
      note: remark
    }
    if (that.data.isModify) {
      data.action_id = that.data.orderLog.action_id
    }
    request.post(that.data.url + '/api/StoreOrder/orderLogAdd',{
      data,
      success:function(res){
        wx.showToast({
          title: '保存成功',
        })
        that.setData({
          showRemarkPopup: false,
          remarkVal: ''
        })
        that.getOrderLogList()
      }
    })
  },
  modifyRemark(e){//编辑备注
    this.setData({
      showRemarkPopup: true,
      isModify: true
    })
  },
  toExpressPage(e){//前往物流信息页面
    wx.navigateTo({
      url: `/pages/user/express/express?order_id=${e.currentTarget.dataset.id}`,
    })
  },
  modifyAddress(){//修改
    wx.navigateTo({
      url: '/pages/user/address_list/address_list?operate=deliver&order_id=' + this.data.store_id,
    })
  },
  looklook(e){//查看
    var type = e.currentTarget.dataset.type
    if (type == 'a') {
      this.setData({
        [`eyeFlag.a`]: !this.data.eyeFlag.a
      })
    } else {
      this.setData({
        [`eyeFlag.b`]: !this.data.eyeFlag.a
      })
    }

  },
  getOrderLogList(){//获取备注列表
    var that = this
    request.get(that.data.url + '/api/StoreOrder/orderLogList',{data:{ order_id: that.data.order_id},success:function(res){
      var log = res.data.result
      if (log.admin_note_time) {
        log.time1 = log.admin_note_time.split(' ')[0]
        log.time2 = log.admin_note_time.split(' ')[1]
      }
      that.setData({
        orderLog: log
      })
    }})
  },
  requestExpress: function (data) {
    var that = this;
    wx.request({
        url: this.data.url + '/home/api/queryExpress',
        data,
        success: function (res) {
            console.log('success', res);
            that.setData({ express: res.data });
        },
        fail: function (res) {
            app.showWarning('请求失败');
        }
    });
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
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
})