var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var common = require('../../../utils/common.js');

Page({
    data: {
        url: setting.url,
        resourceUrl: setting.resourceUrl,
        goods: null,
        mobile: '',
        newprice: null,  //订单价格
    },

    onLoad: function (options) {
        var that = this;
        this.setData({ goods: options });
        app.getUserInfo(function(user) {
            that.setData({ mobile: user.mobile });
        });
        that.setData({
            'goods.price': that.data.goods.price.split(','),
        })
        that.setData({
            newprice: that.data.goods.price[0] + '.' + that.data.goods.price[1]
        })
    },

    submitOrder: function (e) {
        var that = this;
        request.post('/api/virtual/add_order/add_order', {
            data: {
                goods_id: this.data.goods.goods_id,
                item_id: this.data.goods.item_id,
                goods_num: this.data.goods.goods_num,
                mobile: e.detail.value.mobile,
                user_note: e.detail.value.user_note,
            },
            success: function (res) {
                common.jumpToCart4({
                    order_sn: res.data.result,
                    order_amount: that.data.newprice
                }, true);
        
            }
        });
    }

});