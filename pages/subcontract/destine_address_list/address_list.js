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
        console.log(e.currentTarget.dataset.item)
        var d = e.currentTarget.dataset.item
        // return 
        const pages = getCurrentPages()
        const i = pages.length-2
        pages[i].setData({
            [`defaultInfo.receipt_name`]: d.consignee,
            [`defaultInfo.receipt_mobile`]: d.mobile,
            [`defaultInfo.receipt_address`]: `${d.province_name} ${d.city_name} ${d.district_name} ${d.address}`,
        })
        wx.navigateBack({delta: 1})
       
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