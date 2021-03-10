var app = getApp()
var request = app.request;
Page({
  data: {
    url: app.globalData.setting.url,
    resourceUrl: app.globalData.setting.resourceUrl,
    order: null,
    orderInfo:[],
  },

  onLoad: function(param) {
    if (!param.order_sn || param.order_sn =='undefined'){
      param.order_sn='0'
    }
    if (!param.master_order_sn || param.master_order_sn == 'undefined') {
      param.master_order_sn = '0'
    }
    this.setData({
      order: param
    });

    this.getOrderInfo();
  },

  lookOrder: function() {
    if (this.data.orderInfo.prom_type==6){//跳转到拼单详情
      wx.redirectTo({
        url: '/pages/team/team_detail/team_detail?order_sn=' + this.data.order.order_sn
      });
    }else{
      if (typeof this.data.orderInfo.order_id != 'undefined' && this.data.orderInfo.order_id >0){
        wx.redirectTo({
          url: '/pages/user/order_detail/order_detail?order_id=' + this.data.orderInfo.order_id
        });
      }else{
        url: '/pages/user/order_detail/order_detail?order_id=' + this.data.orderInfo.order_id
      }
      
    }
  },
  getOrderInfo: function() {
    var that = this;
    request.get(that.data.url + '/api/order/order_detail?order_sn=' + that.data.order.order_sn + '&sn=' + that.data.order.master_order_sn, {
      success: function (res) {
        var order = res.data.result;
        that.setData({
          orderInfo: res.data.result
        });
      }
    });
  }

})