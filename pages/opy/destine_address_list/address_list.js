var app = getApp();
var request = require('../../../utils/request');
Page({
    data: {
        url: app.globalData.setting.url,
        resourceUrl: app.globalData.setting.resourceUrl,
        addresses: null, //请求的地址列表
        operate: null, //操作类型，select：订单选择地址操作，其他：普通展示
    },

    onLoad: function (options) {
        this.data.operate = options.operate;
    },
    onShow: function () {
        this.requestAddressList();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.requestAddressList();
    },

    /** 请求地址列表数据 */
    requestAddressList: function () {
        var that = this;
        request.get(that.data.url + '/api/user/getAddressList', {
            success: function (res) {
                console.log(res)
                that.setData({ addresses: res.data.result });
                wx.stopPullDownRefresh();
            }
        });
    },

    /** 修改地址 */
    editAddress: function (e) {
        var address = this.getAddressData(e.currentTarget.dataset.id);
        var params = '';
        for (var item in address) {
            params += (params.length != 0 ? '&' : '?') + (item + '=' + address[item]);
        }
        params && wx.navigateTo({ url: "/pages/user/add_address/add_address" + params });
    },

    /** 填写订单(商品详情)的时候可触发选择地址 */
    selectAddress: function (e) { //选择了地址后  进行处理  返回上一页
    //     console.log(e)
    //    app.changeSelectedAddress(e.currentTarget.dataset.item)
    //    wx.navigateBack({delta: 1})
        const pages = getCurrentPages()
        const i = pages.length-2
        const address = e.currentTarget.dataset.item
        var allAddress = address.province_name + address.city_name + address.district_name + address.twon_name + address.address
        // console.log(address)
        const def = JSON.parse(JSON.stringify(pages[i].data.defaultInfo))
        // console.log(pages[i].data.defaultInfo)
        def.address.consignee = address.consignee
        def.address.mobile = address.mobile
        def.address.user_address = allAddress
        // console.log(def)
        // console.log(address.consignee)
        // return
        // console.log(def)
        pages[i].setData({
            defaultInfo: def
        })
        // return
        wx.navigateBack({delta: 1})
        // if (this.data.operate == 'select') {
        //     //更新订单页的地址
        //     wx.setStorageSync('cart:cart2:address_id', e.currentTarget.dataset.item.address_id);
        //     wx.navigateBack();
        // } else if (this.data.operate == 'teamSelect'){
        //     //更新拼团订单页的地址
        //     wx.setStorageSync('team:confirm:address_id', e.currentTarget.dataset.item.address_id);
        //     wx.navigateBack();
        // } else if (this.data.operate == 'selectAddress'){
        //     //更新商品详情的配送地
        //     var totalAddress = e.currentTarget.dataset.item.province_name + e.currentTarget.dataset.item.city_name + e.currentTarget.dataset.item.district_name;
        //     var address={
        //         address: totalAddress,
        //         district: e.currentTarget.dataset.item.district,
        //     };
        //     wx.setStorageSync('goodsInfo:goodsInfo:address', address);
        //     wx.navigateBack();
        // }
    },

    /** 由addressId获取地址数据 */
    getAddressData: function (addressId) {
        var addresses = this.data.addresses;
        for (var idx in addresses) {
            if (addresses[idx].address_id == addressId) {
                break;
            }
        }
        if (!idx) {
            return {};
        }
        return addresses[idx];
    },
    setDefault:function(e){
      var that = this
      var address = e.currentTarget.dataset.obj
      var id = address.address_id
      address.is_default = !address.is_default
      var is_default = address.is_default
      address.is_default = Number(address.is_default);
      request.post('/api/user/addAddress', {
        data: address,
        success: function (res) {
          that.data.addresses.forEach(function(item,index){
            item.is_default = 0
          })
          that.data.addresses.forEach(function (item, index) {
            if (item.address_id == id){
              item.is_default = is_default
            }
          })
          that.setData({
            addresses:that.data.addresses
          })
        }
      });
    }

})