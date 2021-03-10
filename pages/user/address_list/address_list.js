var app = getApp();
var request = require('../../../utils/request.js');

Page({
    data: {
        url: app.globalData.setting.url,
        resourceUrl: app.globalData.setting.resourceUrl,
        addresses: null, //请求的地址列表
        operate: null, //操作类型，select：订单选择地址操作，其他：普通展示
        orderInfo:null,
        id: '',//发货的那个Id
    }, 
 
    onLoad: function (options) {
        this.data.operate = options.operate;
        if (options.operate == 'deliver') { //设置发货地址进来
            wx.setNavigationBarTitle({
              title: '发货地址',
            })
            this.setData({
                id: options.order_id
            })
        }
        this.setData({
            operate: options.operate,
            orderInfo: options.operate == 'change' ? {order_id: options.order_id,order_sn: options.order_sn} : ''
        })
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
        if (this.data.operate == 'deliver') {
            request.get(that.data.url + '/api/StoreOrder/pushShipping',{
                data:{
                  store_id: that.data.id
                },
                success(res){
                  that.setData({
                    addresses: res.data.result.deliver_address,
                  })
                }
            })
            return
        }
        request.get(that.data.url + '/api/user/getAddressList', {
            success: function (res) {
                console.log(res)
                that.setData({ addresses: res.data.result });
                wx.stopPullDownRefresh();
            }
        });
    },
    changeOrderAddress:function(id){//更改收货地址
        var that = this
        request.post( that.data.url + '/api/order/editNoPushOrder', {
            data:{
                order_id: that.data.orderInfo.order_id,
                order_sn: that.data.orderInfo.order_sn,
                address_id: id
            },
            success:function(res){
                wx.navigateBack()
            }
        } )
    },
    /** 修改地址  */
    editAddress: function (e) {
        var address = this.getAddressData(e.currentTarget.dataset.id);
        var params = '';
        for (var item in address) {
            params += (params.length != 0 ? '&' : '?') + (item + '=' + address[item]);
        }
        if (this.data.operate == 'deliver') {
            params += '&from=deliver2&id=' + this.data.id
        }
        params && wx.navigateTo({ url: "/pages/user/add_address/add_address" + params });
    },

    /** 填写订单(商品详情)的时候可触发选择地址 */
    selectAddress: function (e) {
 
        if (this.data.operate == 'select') {
            //更新订单页的地址
            wx.setStorageSync('cart:cart2:address_id', e.currentTarget.dataset.item.address_id);
            wx.navigateBack();
        } else if (this.data.operate == 'teamSelect'){
            //更新拼团订单页的地址
            wx.setStorageSync('team:confirm:address_id', e.currentTarget.dataset.item.address_id);
            wx.navigateBack();
        } else if (this.data.operate == 'selectAddress'){
            //更新商品详情的配送地
            var totalAddress = e.currentTarget.dataset.item.province_name + e.currentTarget.dataset.item.city_name + e.currentTarget.dataset.item.district_name;
            var address={
                address: totalAddress,
                district: e.currentTarget.dataset.item.district,
            };
            wx.setStorageSync('goodsInfo:goodsInfo:address', address);
            wx.navigateBack();
        } else if (this.data.operate == 'change') {
            // 用户更改收货地址
            this.changeOrderAddress(e.currentTarget.dataset.item.address_id)
        } else if (this.data.operate == 'deliver') {
            // 发货地址点击地址选项
            console.log(e.currentTarget.dataset.item)
            const pages = getCurrentPages()
            var i = pages.length - 2
            var address = e.currentTarget.dataset.item
            address.is_default = 1
            pages[i].setData({
                defAddress: address
            })
            wx.navigateBack()
        }
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
        var url = '/api/user/addAddress'
        if (that.data.operate == 'deliver') {
            address.store_id = that.data.id
            address.type = 0
            address.store_address_id = address.address_id
            url = '/api/StoreOrder/storeAddressAdd'
        }
        address.is_default = !address.is_default
        var is_default = address.is_default
        address.is_default = Number(address.is_default);
        request.post(url, {
            data: address,
            success: function (res) {
            that.data.addresses.forEach(function(item,index){
                item.is_default = 0
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