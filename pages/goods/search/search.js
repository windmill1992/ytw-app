var app = getApp();
import LoadMore from '../../../utils/LoadMore.js'
const util = require('../../../utils/util.js');
var load = new LoadMore;
var request = app.request;
Page({
    data: { 
        is_apply: app.globalData.is_apply,
        url: app.globalData.setting.url,
        resourceUrl: app.globalData.setting.resourceUrl,
        currentPage: 1,
        requestData: null, //请求的数据
        allData: null, //第一次请求到的所有数据，用于恢复筛选数据
        openFilterModal: false, //打开筛选弹框
        openSearchModal: false, //打开搜索界面
        hotWords: ['手机', '小米', 'iphone', '三星', '华为', '冰箱'], //搜索热词
        baseUrl: '/api/goods/search', //基地址
        requestUrl: '', //请求的链接
        goodsInputNum: 1, //选中的商品件数
        openSpecModal: false, //是否打开规格弹窗
        specSelect: 0, //选中的组合规格数组spec_goods_price下标
        data: null, //请求的商品详情数据
        select: { //选择的(规格)商品的参数，用于显示
            price: 0,
            stock: 0,
            spec_img: '',
            specName: '',
            activity: null
        },
        placehoderTxt: "搜索商品",
        is_apply: 0,//是否在审核
        searchValue: '',
    },

    onLoad: function (options) {
        var that = this;
        this.setData({ 
            hotWords: wx.getStorageSync('hot_keywords'),
            is_apply: app.globalData.is_apply
        })
        load.init(this, 'goods_list', 'requestData');
        if (typeof options.brand_id != 'undefined') {
            return this.requestSearch(this.data.baseUrl + '?brand_id=' + options.brand_id);
        }
        this.openSearchModal();
    },
    /** 初始化数据，注意顺序 */
    initData: function (data) {
        //检查商品
        this.initCheckGoods(data);
        //检查一下购物的数量，可能无库存
        this.checkCartNum(this.data.goodsInputNum);
    },

    /** 检查商品 */
    initCheckGoods: function (data) {
        var that = this;
        var item_id = data.spec_goods_price.length > 0 ? data.spec_goods_price[0]['item_id'] : '';
        if (that.data.optionItemId) {
            item_id = that.data.optionItemId;
        }
        request.get('/api/goods/activity', {
            data: {
                goods_id: data.goods.goods_id,
                item_id: item_id,
            },
            success: function (res) {
                //初始化规格
                if (res.data.result.goods.activity_is_on == 1) {
                    data.activity = res.data.result.goods
                    that.initSpecsPrice(data);
                } else {
                    data.goods.prom_type = 0;
                    that.initSpecsPrice(data);
                }
            }
        });
    },
    /** 初始化所有规格 */
    initSpecsPrice: function (data) {
        var specSelect = 0; //初始化选中第一个规格
        var specs = data.spec_goods_price;
        if (specs.length == 0) { //没有规格
            this.initActivity(data.activity);
            return;
        }
        //第一次请求的总数据中的activity默认是第一种规格的,可减少一次请求
        specs[0].activity = data.activity;
        if (this.data.optionItemId) { //指定规格
            for (var i = 0; i < specs.length; i++) {
                if (specs[i].item_id == this.data.optionItemId) {
                    specSelect = i;
                    break;
                }
            }
        } else { //初始化选库存不为0的规格
            for (var i = 0; i < specs.length; i++) {
                if (specs[i].store_count <= 0) {
                    continue;
                }
                specSelect = i;
                break;
            }
        }
        //生成子规格组(goods_spec_list)的各自选中项
        var specIds = specs[specSelect].key.split("_");
        var list = data.goods_spec_list;
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < list[i].spec_list.length; j++) {
                if (util.inArray(list[i].spec_list[j].item_id, specIds)) {
                    list[i].selectItemId = list[i].spec_list[j].item_id;
                    break;
                }
            }
        }
        this.setData({
            specSelect: specSelect,
            'data.goods_spec_list': list,
            'data.spec_goods_price': specs
        });
        this.initSelectSpecGoods();
    },
    /** 关闭规格弹窗 */
    closeSpecModal: function (e) {

        this.setData({
            openSpecModal: false,
        });
    },
        /** 打开规格弹窗 */
    openSpecModel: function (e) {
        var that = this;
        request.get('/api/goods/goodsInfo', {
            data: { id: e.currentTarget.dataset.goods_id },
            failRollback: true,
            success: function (res) {
                
                that.setData({ data: res.data.result, openSpecModal: true, isSeparate: true });
                that.initData(res.data.result);
            }
        });

    },
    /** 减少购买的商品数量 */
    subCartNum: function (e) {
        this.checkCartNum(this.data.goodsInputNum - 1);
    },
    /** 增加购买的商品数量 */
    addCartNum: function (e) {
        this.checkCartNum(this.data.goodsInputNum + 1);
    },
    /** 输入购买的数量 */
    inputCartNum: function (e) {
        this.checkCartNum(Number(e.detail.value));
    },
    /** 检查购买的数量 */
    checkCartNum: function (num) {
        var stock = this.data.select.stock;
        if (this.data.data.spec_goods_price.length > 0) {
            stock = this.data.data.spec_goods_price[this.data.specSelect].store_count;
        }
        if (num > stock || stock == 0) {
            num = stock;
        } else if (num < 1) {
            num = 1;
        }
        this.setData({
            goodsInputNum: num
        });
    },
    /** 初始化选中的规格商品 */
    initSelectSpecGoods: function () {
        var specSelect = this.data.specSelect;
        var specs = this.data.data.spec_goods_price;
       
        var itemId = specs[specSelect].item_id;
        
        if (specs[specSelect].prom_type == 0) {
            var noActivity = { prom_type: 0 };
            specs[specSelect].activity = noActivity;
            this.initActivity(noActivity);
        } else if (typeof specs[specSelect].activity != 'undefined') {
            this.initActivity(specs[specSelect].activity);
        } else {
            this.requestSpecInfo(specSelect);
        }
    },
    /** 请求规格商品的活动信息 */
    requestSpecInfo: function (specSelect) {
        var that = this;
        var specs = that.data.data.spec_goods_price;
        request.get('/api/goods/activity', {
            data: {
                goods_id: that.data.data.goods.goods_id,
                item_id: specs.length > 0 ? specs[specSelect].item_id : '',
            },
            success: function (res) {
                if (res.data.result.goods.activity_is_on == 1) {
                    that.initActivity(res.data.result.goods);
                }
            }
        });
    },
    /** 初始化选中的（规格）商品的显示参数 */
    initSelectedData: function () {
        var goods = this.data.data.goods;
        var activity = this.data.select.activity;
        var specs = this.data.data.spec_goods_price;
        var specSelect = this.data.specSelect;
        var stock = 0;
        var price = 0;
        if (activity.prom_type == 1 || activity.prom_type == 2) {
            price = activity.shop_price;
            stock = activity.store_count;
        } else if (activity.prom_type == 3) {
            price = activity.shop_price;
            stock = activity.store_count;
        } else if (activity.prom_type == 4) {
            price = activity.shop_price;
            stock = activity.store_count;
        }
        else if (activity.prom_type == 8 && !this.data.isBragain) {
            price = activity.end_price ? activity.end_price : activity.shop_price;
            stock = activity.store_count;
            this.setData({
                'select.bargain_price': price,
            });
        }
        else if (specs.length > 0) {
            price = specs[specSelect].price;
            stock = specs[specSelect].store_count;
        } else {
            price = goods.shop_price;
            stock = goods.store_count;
        }
        price = price.toString().split('.')
        this.setData({
            'select.price': price,
            'select.stock': stock,
            'select.specName': specs.length > 0 ? specs[specSelect].key_name : '',
        });
        if (this.data.isBragain) {
            this.setData({ isBragain: false })
        }
    },
    /** 点击规格按钮的回调函数 */
    selectSpec: function (e) {
        //对商品数量进行判断，对库存进行判断
        var itemId = e.currentTarget.dataset.itemid;
        var listIdx = e.currentTarget.dataset.listidx;
        var list = this.data.data.goods_spec_list;
        if (list[listIdx].selectItemId == itemId) {
            return;
        }
        list[listIdx].selectItemId = itemId;
        var newSpecKeys = [];
        for (var i = 0; i < list.length; i++) {
            newSpecKeys[i] = list[i].selectItemId;
        }
        //item排序,生成key
        var newSpecKeys = util.sortSize(newSpecKeys).join('_');
        var newSpecSelect = 0;
        var specs = this.data.data.spec_goods_price;
        for (var i = 0; i < specs.length; i++) {
            if (specs[i].key == newSpecKeys) {
                newSpecSelect = i;
                break;
            }
        }
        this.setData({
            specSelect: newSpecSelect,
            'data.goods_spec_list': list
        });
        this.initSelectSpecGoods();
        this.checkCartNum(this.data.goodsInputNum);
    },
    /** 初始化显示的活动信息 */
    initActivity: function (activity) {
        if (activity.prom_type && activity.prom_type != 6) {
            var startTime = (new Date()).getTime();
            if (activity.prom_type == 1) { //抢购
                activity.priceName = '抢购价';
                activity.countName = '限时抢购';
            } else if (activity.prom_type == 2) { //团购
                activity.priceName = '团购价';
                activity.countName = '限时团购';
            } else if (activity.prom_type == 3) { //促销
                activity.countName = '优惠促销';
            } else if (activity.prom_type == 4) { //预售
                activity.priceName = '预售价';
                activity.countName = '预售商品';
            } else if (activity.prom_type == 8) { //砍价
                !this.data.isBragain ? activity.priceName = '砍价享' : activity.priceName = ''
                !this.data.isBragain ? activity.countName = '砍价活动' : activity.countName = ''
            }

            activity.countTime = '--天--时--分--秒';
            if (!activity.diffTime) {
                activity.diffTime = (new Date()).getTime() - activity.on_time * 1000;
            }
        } else if (activity.prom_type == 6) {
            activity.countName = '该商品正在参与拼团';
            activity.goods_id = activity.goods_id;
            activity.team_id = activity.prom_id ? activity.prom_id : 0;
            activity.item_id = activity.item_id ? activity.item_id : 0;
        }
        this.setData({ 'select.activity': activity });
        this.destroyActivityTimer();
        this.createActivityTimer();
        this.initSelectedData();
    },

    /** 检查是否倒计时是否结束 */
    checkActivityTime: function () {
        var that = this;
        var activity = that.data.select.activity;
        var remainTime = activity.end_time * 1000 - (new Date()).getTime() + activity.diffTime;
        if (remainTime > 0) {
            remainTime = util.remainTime(remainTime);
            that.setData({ 'select.activity.countTime': remainTime });
        } else {
            that.requestSpecInfo(that.data.specSelect);
            return;
        }
    },

    /** 创建活动倒计时定时器 */
    createActivityTimer: function () {
        var that = this;
        var activity = that.data.select.activity;
        if (!activity.prom_type || activity.prom_type == 6 || that.data.isBragain) {
            return;
        }
        that.data.timer = setInterval(function () {
            that.checkActivityTime();
        }, 1000);
    },

    /** 销毁活动倒计时定时器 */
    destroyActivityTimer: function () {
        if (this.data.timer) {
            clearInterval(this.data.timer);
            this.data.timer = null;
        }
    },
    /** 购买虚拟商品 */
    buyVirtualGoods: function (data) {
        //检查用户是否登录方可操作立即购买
        if (!app.auth.isAuth()) {
            app.showLoading(null, 1500);
            app.getUserInfo();
            return;
        }
        Object.assign(data, {
            goods_name: this.data.data.goods.goods_name,
            spec_name: this.data.select.specName,
            price: this.data.select.price,
        });
        wx.navigateTo({
            url: '/pages/virtual/buy_step/buy_step?' + util.Obj2Str(data)
        });
    },
    /** 加入购物车 */
    addCart: function (e) {
        var that = this;
        var itemId = 0;
        var specs = this.data.data.spec_goods_price;
        //区分有规格和无规格
        if (specs.length > 0) {
            if (specs[this.data.specSelect].store_count <= 0) {
                return app.showWarning("库存已为空！");
            }
            itemId = specs[this.data.specSelect].item_id;
        } else {
            if (this.data.data.goods.store_count <= 0) {
                return app.showWarning("库存已为空！");
            }
        }
        if (this.data.goodsInputNum <= 0) {
            return app.showWarning("商品数量不能为0");
        }
        var data = {
            goods_id: this.data.data.goods.goods_id,
            goods_num: this.data.goodsInputNum,
            item_id: itemId,
            form: 1
        };
        if (this.data.data.goods.is_virtual) {
            return this.buyVirtualGoods(data);
        }
        //检查用户是否登录方可操作立即购买
        if (!app.auth.isAuth()) {
            app.showLoading(null, 1500);
            app.getUserInfo();
            return;
        }
        
        if (e.currentTarget.dataset.action == 'add') { //加入购物车
            if (this.data.shippingCost < 0 || this.data.select.stock <= 0) {
                return;
            }
            request.post('/api/cart/addCart', {
                data: data,
                success: function (res) {
                    wx.showModal({
                        title: '添加成功！',
                        cancelText: '去购物车',
                        confirmText: '再逛逛',
                        success: function (res) {
                            if (res.cancel) {
                                wx.reLaunch({
                                    url: '/pages/cart/cart/cart'
                                });
                            } else {
                                that.requestCardNum();
                            }
                        }
                    });
                }
            });
        } else if (e.currentTarget.dataset.action == 'exchange') { //立即兑换
            this.exchange(data);
        } else { //立即购买
            this.buyNow(data);
        }
    },
    /** 立即购买 */
    buyNow: function (data) {
        //检查用户是否登录方可操作立即购买
        if (!app.auth.isAuth()) {
            app.showLoading(null, 1500);
            app.getUserInfo();
            return;
        }
        if (this.data.shippingCost < 0 || this.data.select.stock <= 0) {
            return;
        }
        Object.assign(data, {
            action: 'buy_now',
        });
        wx.navigateTo({
            url: '/pages/cart/cart2/cart2?' + util.Obj2Str(data)
        });
    },



    //删除搜索记录
    deleteSearch:function(e){
      var that = this;
      request.post('/api/goods/deleteSearch', {
        success: function (res) {
          that.setData({ 'searchlist': res.data.result });
        }
      });
      
    },

    changeTab: function (e) {
        this.resetData();
        this.requestSearch(e.currentTarget.dataset.href);
    },

    requestSearch: function (requestUrl) {
        var that = this;
        this.data.requestUrl = requestUrl; //保存链接
        this.setData({
          requestUrl: requestUrl
        })
        requestUrl += (requestUrl.indexOf('?') > 0 ? '&' : '?') + 'p=' + that.data.currentPage;
        load.request(requestUrl, function (res) {
            that.data.currentPage++;
            if (that.data.allData == null) {
                that.data.allData = Object.assign({}, res.data.result);
            }
            that.closeSearchModal();
        });
    },

    onReachBottom: function () {
        if (this.data.openSearchModal) {
            return;
        }
        if (load.canloadMore()) {
            this.requestSearch(this.data.requestUrl);
        }
    },

    openFilterModal: function () {
        this.setData({ openFilterModal: true });
    },

    closeFilterModal: function () {
        this.setData({ openFilterModal: false });
    },

    /** 商品筛选 */
    filterGoods: function (e) {
        this.resetData();
        this.requestSearch(e.currentTarget.dataset.href);
        this.closeFilterModal();
    },

    /** 重置数据 */
    resetData: function () {
        load.resetConfig();
        this.data.requestData = null;
        this.data.currentPage = 1;
    },

    /** 恢复数据 */
    restoreData: function () {
        this.setData({ 'requestData': this.data.allData });
    },

    openSearchModal: function () {
        this.setData({ openSearchModal: true });
    },

    closeSearchModal: function () {
        this.setData({ openSearchModal: false });
    },

    /** 提交搜索事件 */
    submitSearch: function (e) {
        this.search(e.detail.value.word);
    },

    /** 点击搜索热词事件 */
    searchHotWord: function (e) {
        this.setData({
            searchValue: e.currentTarget.dataset.word
        })
        this.search(e.currentTarget.dataset.word);
    }, 
    searchChange:function(e){
        console.log(e)
        this.setData({
            searchValue: e.detail.value
        })
    },
    /** 对搜索词进行搜索 */
    search: function (word) {
        if (this.data.placehoderTxt=='搜索店铺') { 
            if ( this.data.searchValue.trim() == '' ) {
                return wx.showToast({
                  title: '请输入有效搜索关键字',
                  icon: 'none'
                })
            }
            wx.navigateTo({
              url: '/pages/index/dk/dk?key_word=' + this.data.searchValue.trim(),
            })
            return
        }
        if (typeof this.data.searchValue != 'string' || this.data.searchValue == '') {
             return app.showWarning('请输入搜索关键词');
        }
        this.resetData();
        this.requestSearch(this.data.baseUrl + '?q=' + this.data.searchValue + '&is_addsearch=' + 1);
    },
    searchGoods:function(){
        this.setData({
            placehoderTxt: "搜索商品"
        })
    },
    searchStore:function(){
        this.setData({
            placehoderTxt: "搜索店铺"
        })
    },
    /** 请求店铺数据 */
    requrstStores: function () {
        // var that = this;
        // var params = util.Obj2Str({
        //     page: 1,
        //     pageSize: 15,
        //     key_word: '06'
        // });
        // load.request('/api/index/store_street?' + params, function (res) {
        //     console.log(res)
        // });
    },
});