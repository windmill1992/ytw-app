var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
import Category from '../../../utils/category/Category.js';

Page({
    data: {
        url: setting.url,
        categorydata: null,
        storeTypes: [
            { id: 1, name: '旗舰店'}, 
            { id: 2, name: '专卖店'}, 
            { id: 3, name: '专营店'}
        ],
        storeType: -1,
        storeCats: null,
        storeCat: -1,
    },

    onLoad: function (options) {
        this.getApplyInfo();
        this.initCategory();
    },

    getApplyInfo: function () {
        var that = this;
        request.get('/api/newjoin/getApply', {
            fallRollBack: true,
            success: function (res) {
                that.setData({ storeCats: res.data.result.store_class });
            }
        });
    },

    /** 初始化经营类目弹框相关 */
    initCategory: function () {
        var that = this;
        new Category(this, 'categories', {
            endCall: function (categories) {
                that.setData({ categorydata: categories });
            }
        });
    },

    submitInfo: function (e) {
        if (this.data.storeType==-1){
            app.showWarning('请选择店铺类型');
            return;
        }
         if (this.data.categorydata == null ){
            app.showWarning('请选择经营类目');
            return;
        }
        if (this.data.storeCat == -1) {
            app.showWarning('请选择店铺分类');
            return;
        }
        var data = e.detail.value;
        Object.assign(data, {
            store_type: this.data.storeTypes[this.data.storeType].id,
            'store_class_ids[]': this.data.categorydata.category3,
            sc_id: this.data.storeCats[this.data.storeCat].sc_id,
            sc_name: this.data.storeCats[this.data.storeCat].sc_name,
        });
        request.post('/api/newjoin/storeInfo', {
            data: data,
            success: function (res) {
                wx.redirectTo({ url: '/pages/newjoin/join3/join3' });
            }
        });
    },

    selectStoreType: function (e) {
        this.setData({ storeType: e.detail.value })
    },

    selectStoreCat: function (e) {
        this.setData({ storeCat: e.detail.value })
    }

})