var app = getApp();
var request = app.request;
var common = require('../../../utils/common.js');

Page({
    data: {
        url: app.globalData.setting.url,
        firstCategoris: [],
        categories: [],
        ad: null, //广告
        currentCategoryId: 0, //目前的第一分类id
        scrollHeight: 0, //界面高度，用于滚动
        defaultMenu: false,  //默认底部菜单显示状态
    },

    onLoad: function() {
        this.requestFirstCategoris();
        if (app.globalData.menu_model.length == 0) {
            app.globalData.menu_index = 1
        } else {
            //遍历自定义底部，该页面在哪个位置
            for (var i in app.globalData.menu_model) {
                if (app.globalData.menu_model[i].app_url.indexOf('categoryList') != -1) {
                    app.globalData.menu_index = i;
                }
            }
        }

        this.setData({
            defaultMenu: app.globalData.defaultMenu,
            menu_index: app.globalData.menu_index,
            menu_model: app.globalData.menu_model,
        }) 
    },
    /** 默认菜单 */
    topages: function (e) {
        var idx = e.currentTarget.dataset.idx;
        app.globalData.menu_index = idx;
        common.defaultTotabar(idx, 1);
    },
    /** 跳转模式 自定义页面 || 自定义菜单 || 自定义控件控件*/
    topage(e) {
        //自定义菜单
        var idx = e.currentTarget.dataset.idx;
        app.globalData.menu_index = idx;
        var page_type = this.data.menu_model[idx].url_type
        var id = this.data.menu_model[idx].app_url
        //判断跳转的类型  0 = 外部网址,1 = 小程序页面，2 = 分类商品，3 = 商品详情 ，4 = 自定义页面
        if (page_type == 1) {
            //要访问的页面idx，当前页面menu_index
            common.totabar(idx, this.data.menu_index, this.data.menu_model);
        } else if (page_type == 2) {
            wx.navigateTo({ url: '/pages/goods/goodsList/goodsList?cat_id=' + id });
        } else if (page_type == 3) {
            wx.navigateTo({ url: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + id });
        } else if (page_type == 0) {
            this.setData({ webUrl: id });
            wx.navigateTo({ url: '/pages/index/webview/webview' });
        } else {
            wx.reLaunch({
                url: '../../index/customPage/customPage?id=' + this.data.menu_model[idx].app_url,
            })
        }
    },

    requestFirstCategoris: function () {
        var that = this;
        request.post('/api/goods/goodsCategoryList', {
            data: { new_ad: 1 },
            success: function (res) {
                console.log(res)
                if (res.data.result.adv != null){
                    that.setData({ ad: res.data.result.adv });
                }
                var categories = res.data.result.category;
                if (categories.length == 0) {
                    return;
                }
                that.setData({ firstCategoris: categories });
                that.requestCategories(categories[0].id);
            }
        });
    },

    //请求分类
    requestCategories: function (parenId) {
        var that = this;
        request.get('/api/goods/goodsSecAndThirdCategoryList', {
            data: { 'parent_id': parenId },
            success: function (res) {
                that.setData({ 
                    categories: res.data.result,
                    currentCategoryId: parenId
                });
            }
        });
    },

    //切换第一分类
    switchFirstCategory: function(e) {
        this.requestCategories(e.currentTarget.dataset.id);
    },

    goodsList: function(e){
        var catId = e.currentTarget.dataset.id;
        wx.navigateTo({ url: '/pages/goods/goodsList/goodsList?cat_id=' + catId, })
    },

})