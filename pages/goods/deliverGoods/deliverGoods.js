// pages/goods/deliverGoods/deliverGoods.js
var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
Page({
  data: {
    url: setting.url,
    value1: '',
    id: '',//订单的ID
    store_id: '',//店铺ID
    shopId: '',
    orderSn: '',
    shipping_list: [],//快递
    address: [],//地址列表
    defAddress: {},//默认地址
    curExpress: {
      shipping_code: '',
      shipping_name: ''
    },
    showExpressPicker: false,
    isFirst: true,
    receiveCode: '',//提货码
    orderType: '',// a 普通发货 b 自提发货
    preIndex: '',//上一页面过来时  列表数据的索引
  },
  onLoad: function (options) {
    if (options.index == '' || options.index == 'undefined') {
      wx.navigateBack()
      return
    }
    const pages = getCurrentPages()
    var i = pages.length - 2
    var index = options.index
    var preData = pages[i].data.list[index] //拿到上一页 被点击操作的订单数据
    this.setData({
      id: preData.order_id,
      store_id: preData.store_id,
      orderType: preData.seller_order_status_detail == '待自提' ? 'b' : 'a',
      shopId: preData.shop_id,
      orderSn: preData.order_sn,
    })


  },
  getImg(){ //获取图片
    var that = this
    wx.scanCode({
      success (res) {
        console.log(res)
        that.setData({
          value1: res.result
        })
      }
    })
    return
    //百度AI获取图片内的信息
    wx.chooseImage({
      count: 1,
      success:function(res){
        wx.request({
          method: 'POST',
          url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=FXI2TYpyEw2PDhmeGEsFeH8v&client_secret=GEEGoGhsg9Xtm5414krWbQDjQQq2DQYj',
          success:function(tokenRes){
            var base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
            wx.request({
              method:'POST',
              url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=' + tokenRes.data.access_token,
              header:{
                'Content-Type':'application/x-www-form-urlencoded',
              },
              data:{
                image: base64
              },
              success:function(result){
                console.log(result)
              }
            }) 
          }
        })
       
      }
    })
  },
  setKuaidi(){
    this.setData({
      showExpressPicker: true
    })
  },
  chooseAddress(){//重新选地址
    wx.navigateTo({
      url: '/pages/user/address_list/address_list?operate=deliver&order_id=' + this.data.store_id,
    })
  },
  getAddress(){
    var that = this
    request.get(that.data.url + '/api/StoreOrder/pushShipping',{
      data:{
        store_id: that.data.store_id
      },
      success(res){
        if (res.data.result) {
          var defAddress = res.data.result.deliver_address.filter((item)=> {
            return item.is_default == 1
          })
        }
        console.log(defAddress)
        that.setData({
          address: res.data.result.deliver_address,
          shipping_list: res.data.result.shipping_list,
          defAddress: defAddress[0] || {}
        })
      }
    })
  },
  onWuliuChange(e){

    var express = e.detail.value
    this.setData({
      curExpress: express,
      showExpressPicker: false
    })
  },
  sureDeliver(){
    var that = this
    var address_id = ''
    var codeReg = /^[0-9]*$/
    if (!this.data.defAddress.address_id) {
      return wx.showToast({
        title: '您还未设置发货地址',
        icon: 'none'
      })
    } else {
      address_id = this.data.defAddress.address_id
    }
    if (this.data.orderType == 'a') {
      if (this.data.value1 == '') {
        return wx.showToast({
          title: '您还未填写快递单号',
          icon: 'none'
        })
      }
      if (this.data.curExpress.shipping_code == '') {
        return wx.showToast({
          title: '您还没有选择快递公司',
          icon: 'none'
        })
      }
          // 请求快递 判断用户选的快递公司 跟真实的是否一致 
      request.post( `${this.data.url}/api/StoreOrder/orderNumFindKd`,{
        data: {
          kd_num: this.data.value1
        },
        success:function(res){
          console.log(res)
          
          if (res.data.result[0]) {
            if (res.data.result[0].comCode != that.data.curExpress.shipping_code) {
              wx.showToast({
                title: '快递单号与快递公司名不符',
                icon: 'none'
              })
            } else {
              var params = {}
              var postUrl = ''
              // 走到这里  可以收集数据提交了
              if (that.data.orderType == 'a') {
                postUrl = 'deliveryHandleMini'
                params.store_id = that.data.store_id
                params.order_id = that.data.id
                params.shipping = 0
                params.shipping_name = that.data.curExpress.shipping_name
                params.shipping_code = that.data.curExpress.shipping_code
                params.send_type = 0
                params.invoice_no = that.data.value1
                params.store_address_id = address_id
                params.note = '订单发货'
                const pages = getCurrentPages()
                var i = pages.length - 2
                params.goods = pages[i].data.list[pages[i].data.curIndex].order_goods.map((item)=>{
                  return item.goods_id
                })
                params.goods = params.goods.join(',')
              }
              // console.log(params)
              // return
              request.post((that.data.url + '/api/StoreOrder/' + postUrl), {
                data:params,
                success:function(res){
                  if (res.data.status == 1) {
                    wx.showToast({
                      title: '发货成功',
                    })
                    setTimeout(()=>{wx.navigateBack()},1500)
                  }
                }
              })
            }
          } else {
            wx.showToast({
              title: '请仔细检查您填写的快递单号是否正确',
              icon: 'none'
            })
          }
        }
      })
      return
    } else {
      if (this.data.receiveCode == '' || !codeReg.test(this.data.receiveCode)) {
        return wx.showToast({
          title: '请填写正确的提货码!由数字组成!',
          icon: 'none'
        })
      } else {
        var params = {}
        var postUrl = 'writeOff'
        params.bar_code = that.data.receiveCode
        params.order_id = that.data.id
        params.order_sn = that.data.orderSn
        params.shop_id = that.data.shopId
        request.post((that.data.url + '/api/StoreOrder/' + postUrl), {
          data:params,
          success:function(res){
            if (res.data.status == 1) {
              wx.showToast({
                title: '发货成功',
              })
              setTimeout(()=>{wx.navigateBack()},1500)
            }
          }
        })
      }
    }

  },
  calcelPicker(){
    this.setData({
      showExpressPicker: false
    })
  },
  onReady: function () {

  },
  onShow: function () {
    if (this.data.isFirst) {
      this.getAddress()
      this.setData({isFirst: false})
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})