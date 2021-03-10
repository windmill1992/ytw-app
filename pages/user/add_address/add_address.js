var app = getApp();
var setting = app.globalData.setting;
var request = app.request;
import Regions from '../../../utils/regions/Regions.js';

Page({
    data: {
        url: setting.url,
        resourceUrl: setting.resourceUrl,
        address: {
            province_name: '',
            city_name: '',
            district_name: '',
            twon_name: '',
            province: 0,
            city: 0,
            district: 0,
            twon: 0,
        }, //收货地址信息
        from: '',
        id: ''
    },

    onLoad: function (options) {
        console.log(options)
        if (options.from) {
            wx.setNavigationBarTitle({
              title: '发货地址',
            })
            this.setData({
                from: (options.from == 'normal' || options.from == '') ? '' : options.from,
                id: options.id
            })
        }
        var that = this;
        this.setData({ address: options });
        app.getUserInfo(function (userInfo) {
            that.setData({ user: userInfo });
        });
        this.initRegions();
    },

    /** 初始化区域弹框相关 */
    initRegions: function () {
        var that = this;
        new Regions(this, 'regions', {
            endAreaLevelCall: function (parentId, regionName, address) {
                Object.assign(that.data.address, address);
                that.setData({
                    'address.province_name': that.data.address.province_name,
                    'address.city_name': that.data.address.city_name,
                    'address.district_name': that.data.address.district_name,
                    'address.twon_name': that.data.address.twon_name,
                });
            }
        });
    },

    submitAddress: function (e) {
        var address = this.data.address;
        Object.assign(address, e.detail.value);
        address.is_default = Number(address.is_default);
        var url = this.data.from == '' ? '/api/user/addAddress' : '/api/StoreOrder/storeAddressAdd'
        if (this.data.from == 'deliver' || this.data.from == 'deliver2') {
            address.store_id = this.data.id
            address.type = 0
        } 
        if (this.data.from == 'deliver2') {
            address.store_address_id = this.data.address.address_id
        }
        request.post(this.data.url + url, {
            data: address,
            success: function (res) {
                app.showSuccess(res.data.msg, function () {
                    wx.navigateBack();
                });
            }
        });
    },

    /** 删除地址 */
    deleteAddress: function () {
        var addressId = this.data.address.address_id;
        if (!addressId) {
            return;
        }
        var data = { id: addressId }
        var url = this.data.from == '' ? '/api/user/del_address' : '/api/StoreOrder/storeAddressDel'
        if (this.data.from == 'deliver' || this.data.from == 'deliver2' ) {
            data.store_id = this.data.id
        }
        wx.showModal({
            title: '确定删除？',
            success: function (res) {
                res.confirm && request.post(url, {
                    data,
                    success: function (res) {
                        app.showSuccess('删除成功', function () {
                            wx.navigateBack();
                        }, 500);
                    }
                });
            }
        })
    },

});