var app = getApp();
import LoadMore from '../../../utils/LoadMore.js'
var load = new LoadMore;

Page({
    data: {
        url: app.globalData.setting.url,
        resourceUrl: app.globalData.setting.resourceUrl,
        currentPage: 1,
        requestData: null, //请求的数据
        requestUrl: '', //请求的链接
        searchWord: '',
        storeId: 0,
        mode: '',
        cat_id:'',
    },

    onLoad: function (options) {
        load.init(this, 'goods_list', 'requestData');
        this.data.storeId = options.store_id;
        this.data.mode = options.mode;
        this.data.cat_id = options.cat_id;
        this.requestStoreGoods(this.getDefaultUrl());
    },

    getDefaultUrl: function () {
        var baseUrl = '/api/store/storeGoods'; //基地址
        return baseUrl + '?store_id=' + this.data.storeId;
    },

    changeTab: function (e) {
        this.resetData();
        this.requestStoreGoods(e.currentTarget.dataset.href);
    },

    requestStoreGoods: function (requestUrl) {
        var that = this;
        this.data.requestUrl = requestUrl;
        requestUrl += (requestUrl.indexOf('?') > 0 ? '&' : '?') + 'p=' + that.data.currentPage;
        requestUrl += '&q=' + this.data.searchWord;
        requestUrl += (typeof this.data.mode != 'undefined' ? '&sta=' + this.data.mode : '');
        load.request(requestUrl, function (res) {
            that.data.currentPage++;
            wx.stopPullDownRefresh();
        });
    },

    onReachBottom: function () {
        if (load.canloadMore()) {
            this.requestStoreGoods(this.data.requestUrl);
        }
    },

    onPullDownRefresh: function () {
        this.resetData();
        this.requestStoreGoods(this.data.requestUrl);
    },

    /** 商品筛选 */
    filterGoods: function (e) {
        this.resetData();
        this.requestStoreGoods(e.currentTarget.dataset.href);
        this.closeFilterModal();
    },

    /** 重置数据 */
    resetData: function () {
        load.resetConfig();
        this.data.requestData = null;
        this.data.currentPage = 1;
    },

    /** 输入搜索关键字 */
    inputSearch: function (e) {
        this.data.searchWord = e.detail.value;
    },

    searchGoods: function () {
        this.data.mode = '';
        this.resetData();
        this.requestStoreGoods(this.getDefaultUrl());
    },
    toGoodsInfo:function(e){
        var sell = e.currentTarget.dataset.sell
        if (sell != 1) {
            if (e.currentTarget.dataset.member != 1) {
                return wx.showToast({
                  title: '该商品只有店家指定VIP客户才可以查看，您可返回上一页，申请成为VIP!!!',
                  icon: 'none'
                })
            }
        }
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        })
    },

});