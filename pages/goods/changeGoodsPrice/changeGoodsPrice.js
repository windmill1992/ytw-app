
var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var util = require('../../../utils/util.js');
Page({
  data: {
    url: setting.url,
    discountStep: '8折', 
    currentValue: 456,
    mapDiscount: ['无折扣','9.5折','9.0折','8.5折','8.0折','7.5折','7.0折','6.5折','6.0折','5.5折','5.0折','4.5折','4.0折','3.5折','3.0折','2.5折','2.0折','1.5折','1.0折','0.5折'],
    curDiscountIndex: 0,
    typeA: true,//false 是打折 true 减价
    typeB: true,//false 是免邮 true 减运费
    list: [],
    originalP: '9999.45',//原本的价格
    newP: '',//改了后的价格
    originalPostage: '5.00',// 原邮费
    newPostage: '',// 现在的邮费
    total: '',//总价
    minPrice: '',
    goodprice: '',
    postprice: '',
  },
  onLoad: function (options) {
    var that = this
    // return
    // /api/StoreOrder/storeOrderDetails
    request.get(that.data.url + '/api/StoreOrder/storeOrderDetails', {
      data: {
        store_id: options.store_id,
        order_id: options.order_id,
        order_sn: options.order_sn,
      },
      success: function(res) {
        var list = res.data.result
        // order.vrorder[i].vrUsertimeFormat = util.format(order.vrorder[i].vr_usetime, 'yyyy-MM-dd hh:mm');
        list.time1 = res.data.result.add_time == 0 ? '- - - -' : util.format(res.data.result.add_time, 'yyyy-MM-dd hh:mm')
        list.time2 = res.data.result.pay_time == 0 ? '- - - -' :  util.format(res.data.result.pay_time, 'yyyy-MM-dd hh:mm')
        list.time3 = res.data.result.confirm_time == 0 ? '- - - -' :  util.format(res.data.result.confirm_time, 'yyyy-MM-dd hh:mm')
        that.setData({
          list: [list],
          originalP: ((res.data.result.goods_price - 0) +( res.data.result.discount - 0)).toFixed(2),
          newP: ((res.data.result.goods_price - 0) + (res.data.result.discount - 0)).toFixed(2),
          originalPostage: (res.data.result.shipping_price - 0).toFixed(2),
          newPostage: (res.data.result.shipping_price - 0).toFixed(2),
          total: (res.data.result.total_amount - 0).toFixed(2),
          typeB: (res.data.result.shipping_price - 0) == 0 ? false : true
        })
      }
    })
  },
  changeType(e){
    var t = e.currentTarget.dataset.type1
    var t2 = e.currentTarget.dataset.type2
    if (t == 'a') {
      this.setData({
        typeA: t2== 'a1' ? true : false
      })
      if (t2 == 'a2') {
        this.setData({
          curDiscountIndex: 0,
          newP: this.data.originalP
        })
      } else {
        this.setData({
          curDiscountIndex: 0,
          newP: this.data.originalP - (this.data.goodprice - 0)
        })
      }
    } else {
      if ((this.data.originalPostage - 0) == 0) {
        return
      }
      // this.setData({
      //   typeB: t2== 'b1' ? true : false
      // })
      if (t2 == 'b2') {
        this.setData({
          newPostage: 0.00,
          typeB: t2== 'b1' ? true : false
        })
      } else {
        this.setData({
          newPostage: this.data.originalPostage,
          typeB: t2== 'b1' ? true : false
        })
      }
    }
  },
  onDrag(event) {
    this.setData({
      newP: event.detail.value.toFixed(2),
      curDiscountIndex: 0
    });
  },
  doDiscount(e){//折扣 加减 + -
    var type = e.currentTarget.dataset.type
    var curIndex = this.data.curDiscountIndex
    if (type == 'sub') {
      if (curIndex == 19) {
        return
      }
      this.setData({
        curDiscountIndex: curIndex == 19 ? 19 : ((curIndex-0) + 1),
        newP: (this.data.originalP - ((curIndex - 0 + 1) * 5 * this.data.originalP)/100).toFixed(2)
      })
    } else {
      if (curIndex == 0) {
        return
      }
      this.setData({
        curDiscountIndex: curIndex == 0 ? 0 : (curIndex - 1),
        newP: (this.data.originalP - ((curIndex - 1) * 5 * this.data.originalP)/100).toFixed(2)
      })
    }
  },
  priceBlur(e){ //新价格 input
    var p = e.detail.value - 0
    // console.log(p)
    if (!p) {
      p = 0
    }
    var reg = /(^[1-9][0-9]{0,7}$)|(^((0\.0[1-9]$)|(^0\.[1-9]\d?)$)|(^[1-9][0-9]{0,7}\.\d{1,2})$)/
    if (!reg.test(p)) {p=0}
    if (p < 0) {
      p = 0
      wx.showToast({
        title: '商品减价不能为负数哦',
        icon: 'none'
      })
    }
    if (p > this.data.originalP) {
      p = this.data.originalP
      wx.showToast({
        title: '商品减价不能高于原商品价格哦',
        icon: 'none'
      })
    }
    if (p > (this.data.originalP * 0.95)) {
      wx.showToast({
        title: '商品减价至多减去原价的95%',
        icon: 'none'
      })
      p = this.data.originalP * 0.95
    }
    if ((this.data.originalP - p).toFixed(2) <= 0.01) {
      wx.showToast({
        title: '商品价格最低为0.02',
        icon: 'none'
      })
      p = this.data.originalP - 0.02
    }
    this.setData({
      newP: (this.data.originalP - p).toFixed(2),
      goodprice: p
    })
  },
  newPostageBlur(e){//邮费input
    var p = e.detail.value - 0
    if (!p) {
      p = 0
    }
    var reg = /(^[1-9][0-9]{0,7}$)|(^((0\.0[1-9]$)|(^0\.[1-9]\d?)$)|(^[1-9][0-9]{0,7}\.\d{1,2})$)/
    if (!reg.test(p)) {p=0}
    if (p < 0) {
      p = 0
      return wx.showToast({
        title: '邮费减价不能小于0哦',
        icon: 'none'
      })
    }
    if (p > this.data.originalPostage) {
      p = this.data.originalPostage
      wx.showToast({
        title: `邮费减价不能高于${this.data.originalPostage}`,
        icon: 'none'
      })
    }
    this.setData({
      newPostage: (this.data.originalPostage - p).toFixed(2),
      postprice: p
    })
  },
  sureChange(){//最终提交
    var { goodprice, postprice, originalP, originalPostage } = this.data
    if ( (goodprice-0) > (originalP-0)) {
      return wx.showToast({
        title: '商品减价不能大于商品原价',
        icon: 'none'
      })
    }

    if ( (postprice-0) > (originalPostage-0) ) {
      return wx.showToast({
        title: '邮费减价不能大于原邮费',
        icon: 'none'
      })
    }
    if (this.data.newPostage == originalPostage && this.data.newP == originalP) {
      return wx.showToast({
        title: '价格没有变化~',
        icon: 'none'
      })
    }
    var shipping_price = this.data.newPostage
    // shipping_price = this.data.typeB ? shipping_price : (0-this.data.originalPostage)
    var discount = this.data.newP - this.data.originalP
    discount = (discount + '') ? discount : 0
    discount = discount + + ((this.data.list[0].discount + '') - 0)
    var that = this
    var data = {
      order_id: this.data.list[0].order_id,
      store_id: this.data.list[0].store_id,
      shipping_price,
      discount
    }
    // if ( discount == 0 && shipping_price == 0 ) {
    //   return wx.showToast({
    //     title: '您没有做价格减免',
    //     icon: 'none'
    //   })
    // }
    console.log(data)
    // return
    request.post(that.data.url + '/api/StoreOrder/editOrderPrice', {
      data,
      success:function(res){
        // console.log(res)
        if (res.data.status == 1) {
          wx.showToast({
            title: '改价成功',
          })
          setTimeout(()=>{wx.navigateBack()},1000)
        }
      }
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
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})