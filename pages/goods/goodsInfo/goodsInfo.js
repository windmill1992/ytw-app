var util = require('../../../utils/util.js');
var common = require('../../../utils/common.js');
var WxParse = require('../../../utils/wxParse/wxParse.js');
var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
import LoadMore from '../../../utils/LoadMore.js'
var load = new LoadMore;
import Dialog from '../../../dist/dialog/dialog';
Page({
  data: {
    url: setting.url,
    is_apply: 0,
    resourceUrl: setting.resourceUrl,
    defaultAvatar: "https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/user68.jpg",
    userInfo: null,
    data: null, //请求的商品详情数据
    result: null,
    content: '', //商品详情页html
    goodsAttrs: null, //商品属性列表
    cartGoodsNum: 0, //购物车商品数量
    specSelect: 0, //选中的组合规格数组spec_goods_price下标
    optionItemId: 0, //页面参数，页面初始化指定显示的itemid，用于活动
    goodsInputNum: 1, //选中的商品件数
    openSpecModal: false, //是否打开规格弹窗
    openPromModal: false, //是否打开优惠信息弹窗
    showStore: false,
    cardList: [],
    activeCategoryId: 0, //商品主页tab
    supportPageScroll: false, //微信版本是否支持页面滚动回顶部
    goods_norms:0,       //是否显示图文详情
    judge:true,         //判断确定按钮是加入购物车还是立即购买
    address: {
      address: '',
      district: 0,
    },
    shipping: '',
    shippingCost: 0,
    enterAddressPage: false,
    categories: [{
        name: "商品",
        id: 0
      },
      {
        name: "详情",
        id: 1
      },
      {
        name: "评论",
        id: 2
      }
    ],
    activeCategoryId2: 0, //商品内容tab
    categories2: [{
        name: "商品详情",
        id: 0
      },
      {
        name: "规格参数",
        id: 1
      },
    ],
    activeCategoryId3: 0, //商品评论tab
    categories3: [{
        name: "全部",
        id: 0,
        num: 0
      },
      {
        name: "好评",
        id: 1,
        num: 0
      },
      {
        name: "中评",
        id: 2,
        num: 0
      },
      {
        name: "差评",
        id: 3,
        num: 0
      },
      {
        name: "有图",
        id: 4,
        num: 0
      }
    ],
    select: { //选择的(规格)商品的参数，用于显示
      price: 0,
      stock: 0,
      spec_img: '',
      specName: '',
      activity: null
    },
    timer: null, //活动倒计时定时器
    imChoose: 0, //0 QQ客服,1 IM客服,2 小能客服
    imgs: [], //商品图片组
    options: null,
    share_btn: false, //自定义分享按钮状态
    actionSheetHidden: true, //自定义actionSheet隐藏True
    activityIn: 0,
    isBragain: false,
    isSeparate: true,
    cardList: [],
    combinations: [], //搭配购
    maskShow: true,
    showCar: false, 
    showYes: false,
    goodId:'',//商品id
    dialog1:false,//弹窗
    price1:'',//分销价格
    hasQcode: false, //分享给下级 弹窗
    qCodeImg: '', //分享下级  商品二维码
    store_id:'',
    lll:0,
    show: false,
    ssuumm:8,
    scrollBoxWidth:950,
    scrollBoxHeight:840,
    sItemWidth:230,
    ulWidth: 0,
    proportionPx: wx.getSystemInfoSync().screenWidth / 750,
    pressLeft: 0,
    curImg: 'ldsjh',
    selictGoods: {
      introduce:'',
      goods_id:0,
      goods_num: 1,
      item_id: '',
      form: 1,
      price: 0,
      allprice: 0,
      stock: 0,
    },
    currentShoushu: 0,
    singlePrice: 0,
    sheetMaxNum: 0,
    sheetMaxSum: 10,
    v: 1,
    upsum: 0,
    nextSum: 0,
    carOrBuy: '',
    hasVideo: false,
    videoLink: '',
    previewImageIndex: 0,
    isSwiperShow: true,
    currentSwiperIndex: 1,
    temmmmm: 'src="http://yitongwang.oss-accelerate.aliyuncs.com/public/upload/store/10/goods/fd0fb9821f8954c04233ae982c6b4983.jpg"',
    goodsError: false,//极低测试情况下，数据不完整
    totalPrice: 0,//选择了的商品的总价
    telShow: false,//非ios拨打电话的开关
    shareTogether: false,//分享同行的再次弹出
    shareTxt: '分享至朋友圈',
    tipsmask: true,
    pastSum: 1,
    isFirstIn: true
  },

  onLoad: function(options) {
    wx.hideShareMenu()
    if(options){
      console.log(options)
      this.setData({
        goodId:options.goods_id,
        store_id:options.store_id
      })
    }
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      var data = scene.split('&');
      options.goods_id = data[0].split('=')[1];
      options.store_id = data[1].split('=')[1];
      // options.first_leader = data[2].split('=')[1]; 
    }
    var that = this;
    if (options.first_leader) {
      wx.setStorageSync('first_leader', options.first_leader);
    }
    var userInfo = wx.getStorageSync('app:userInfo');
    this.setData({
      userInfo: userInfo
    });
    var that = this;
    app.getConfig(function(res) {
      var im_choose = common.getConfigByName(res.config, 'im_choose');
      that.setData({
        imChoose: im_choose
      });
    });
    this.data.optionItemId = typeof options.item_id == 'undefined' ? 0 : options.item_id;
    request.get('/api/goods/goodsInfo', {
      data: {
        id: options.goods_id,
        store_id: options.store_id
      },
      failRollback: true,
      success: function(res) {
        console.log(res)
        //  如果有video 则取出
        var videoLink = ''
        if (res.data.result.goods.video) {
          videoLink = res.data.result.goods.video
        }

        var lll = res.data.result.spec_goods_price.length//获取到规格参数的数量
        var recommend_goods = res.data.result.recommend_goods;
        for (var i in recommend_goods){
            recommend_goods[i].price_new = recommend_goods[i].shop_price.split(".");
        }
        that.initData(res.data.result);
        var result = res.data.result

        var images = res.data.result.goods_spec_list[0].spec_list.map((item)=>{
          return item.src
        })
        if (!res.data.result.goods_spec_list[1]) {//判断手数问题有没有传递正确 不行就再见 不让展示商品信息了 无法操作
          wx.showToast({
            title: '该商品商家未设置购买手数规格，暂无法购买',
            icon: 'none'
          })
          that.setData({
            goodsError: true
          })
          return
        }
        if (res.data.result.goods_spec_list[0].spec_name == "每手几件") {
            result.goods_spec_list = result.goods_spec_list.reverse()
        }
        that.setData({
          result: result,
          lll:lll,
          selictGoods:{
            introduce:'',
            goods_id: res.data.result.goods.goods_id,
            goods_num: 1,
            item_id: '',
            form: 1,
            price: res.data.result.goods.each_hand_single_price,
            allprice:res.data.result.goods.each_hand_all_price,
            store_count:res.data.result.spec_goods_price[0].store_count
          },
          totalPrice: res.data.result.goods.each_hand_all_price,
          currentShoushu:res.data.result.goods_spec_list[1].spec_list[0].item,
          sheetMaxSum: Math.floor(res.data.result.spec_goods_price[0].store_count),
          previewImages: images,
          videoLink: videoLink
        });
        that.requestGoodsContent();
        that.refreshDispatch(res.data.result);
        // that.requestCardList(); 
      }
    });
    this.requestCardNum();
    //是否支持返回按钮
  
    if (wx.pageScrollTo) {
      this.setData({
        supportPageScroll: true
      });
    }
    //小程序嵌套不能超过5层
    var pages = getCurrentPages();
    if (pages.length < 5) {
      this.setData({
        showStore: true
      }); 
    }
    // this.mini_status();
    this.getStoreInfo(options.store_id)
      if (!wx.getStorageSync('maskSum2') && ( !this.data.userInfo || this.data.userInfo.is_B == 1 )) { //大B  现实提示的遮罩层
        wx.setStorageSync('maskSum2', 7)
        this.setData({
            tipsmask: false
        })
      } else {
          if(wx.getStorageSync('maskSum2') == 1) {
            console.log(11111)
            this.setData({
                tipsmask: true
            })
          } else {
            this.setData({
              tipsmask: false,
              pastSum: 6 - wx.getStorageSync('maskSum2')  + 2
          })
          }
      }
  if (this.data.userInfo.is_B != 1 && this.data.userInfo.store_id > 0) {//做个保底 大A不要
    this.setData({
      tipsmask: true
  })
  }
  },
  getStoreInfo:function(store_id){
    const that = this
  },
  // 显示分销价格
  copyDetail(){
    var that = this
    if (!wx.getStorageSync('wx_user_info')) {
      app.getUserInfo(function (userInfo) {
        that.setData({ userInfo: userInfo, click :false });
      }, true, false);
      return false;
  }
    if(that.data.goodsError){ // 判断是不是极低概率，出现的商品错乱情况
      return
    }
    if ( this.data.userInfo.store_id == 0 ) {
      Dialog.confirm({
        message: '您还没有店铺，无法使用分销功能。是否前往免费开店？',
        confirmButtonText: '免费开店',
        cancelButtonText: '再看看'
      }) 
        .then(() => {
          wx.navigateTo({
            url: '/pages/newjoin/join4/join4',
          })
          Dialog.close()
        })
        .catch(() => {
          Dialog.close()
        });
        return
    }
    if (this.data.userInfo.store_id != 0 && this.data.userInfo.is_B != 1) { // 大A
      // return
      Dialog.confirm({
        message: '对不起，目前该功能只针对采购商开放，您当前的身份为供应商，暂无法使用该功能！',
        confirmButtonText: '好的',
        showCancelButton: false
      }) 
        .then(() => {
          
          Dialog.close()
        })
        return
    }
 
    request.post(that.data.url + '/api/Distribut/add_goods',{
      data:{
        goods_ids: that.data.goodId,
        type: 1
      },
      success: function(res){
        if (res.data.status==-1){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: '2000'
          })
      } else {
         that.fenxiaowai()
      }
      }
    })
  },
  fenxiaowai:function(){
    if( this.data.lll > 0 ){
      wx.navigateTo({
         url:"/pages/distribution/index?good_id=" + this.data.goodId + "&store_id=" + this.data.result.store.store_id
       })
       return
     }
     this.setData({
       dialog1:true
     })
  },
  // 分销弹窗
  cancel(){
    this.setData({
      dialog1:false,
      price1:'',
    })
  },
  // 复制商品确定
  sure(){
    let that = this;
    if(!that.data.price1){
      wx.showToast({
        title: '请输入分销价格',
        icon:'none',
        duration:2000
      })
      return false
    }
    if(that.data.select.price[0]>=parseFloat(that.data.price1)){
      wx.showToast({
        title: '分销价格要比原价格高',
        icon:'none',
        duration:2000
      })
      return false
    }
    request.post('/api/Distribut/add_goods', {
      data: { 
          goods_ids: that.data.goodId,
          terminal: "miniapp",
          goods_new_price:that.data.price1,
      },
      success: function (res) {
          wx.showToast({
            title: '复制成功',
            icon:'none',
            duration:2000
          })
      }
  });
  },

  // 获取价格
  hasPrice(e){
    this.setData({
      price1:e.detail.value
    })
  },
  
  //重新刷新物流数据
  onShow: function() {
    if (this.data.enterAddressPage) {
      this.data.enterAddressPage = false;
      this.refreshDispatch(this.data.result);
    }
    if (this.data.isFirstIn) {
      this.setData({
        isFirstIn: false
      })
    } else {
      this.setData({
        userInfo: wx.getStorageSync('app:userInfo')
      })
    }
  },
  // mini_status: function() {
  //   var that = this;
  //   //获取是不是在审核隐藏一些功能
  //   request.get(that.data.url + '/api/app/mini_app', {
  //       isShowLoading: false,
  //     success: function(res) {
  //       // console.log(res)
  //       if (res.data.result.status == "1") {
  //         that.setData({
  //           showStore: false
  //         });
  //       } else {
  //         that.setData({
  //           showStore: true 
  //         });
  //       }
  //     }
  //   });
  // },
  /**查询商品物流 */
  refreshDispatch: function(result) {
    var that = this;
    //地址为0，没有地址时候先默认给1，提交订单再选择地址
    if (consigneeAddress) {
      consigneeAddress.district = consigneeAddress.district ? consigneeAddress.district : 1;
    }
    var consigneeAddress = wx.getStorageSync('goodsInfo:goodsInfo:address') ? wx.getStorageSync('goodsInfo:goodsInfo:address') : result.consignee;
    that.setData({
      'address.address': consigneeAddress.address,
      'address.district': consigneeAddress.district,
    });
    request.get('/api/goods/dispatching', {
      data: {
        goods_id: result.goods.goods_id,
        region_id: consigneeAddress.district,
      },
        isShowLoading: false,
      success: function(res) {
        var shippinginfo;
        if (res.data.result > 0) {
          shippinginfo = '￥' + res.data.result;
        } else if (res.data.result == 0) {
          shippinginfo = '包邮';
        } else {
          shippinginfo = res.data.msg;
        }
        if (consigneeAddress.district > 0) {
          that.setData({
            shippingCost: res.data.result
          });
        }
        that.setData({
          shipping: shippinginfo
        });
      },
    });
  },

  enterAddress: function() {
    //检查用户是否登录方可操作立即购买
    if (!app.auth.isAuth()) {
      app.showLoading(null, 1500);
      app.getUserInfo();
      return;
    }
    this.data.enterAddressPage = true;
    wx.navigateTo({
      url: '/pages/user/address_list/address_list?operate=selectAddress'
    });
  },

  onUnload: function() {
    this.destroyActivityTimer();
  },

  /** 初始化数据，注意顺序 */
  initData: function(data) {
    //初始化评论
    this.initComment(data);
    //初始化规格
    //this.initSpecsPrice(data);
    // this.initCheckGoods(data);
    //初始化店铺
    this.initStore(data);
    //检查一下购物的数量，可能无库存
    this.checkCartNum(this.data.goodsInputNum);
  },

  /** 检查商品 */
  initCheckGoods: function(data) {
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
        isShowLoading: false,
      success: function(res) {
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


  /** 初始化店铺 */
  initStore: function(data) {
    var s = data.store;
    s.avgScore = (s.store_desccredit / 3 + s.store_servicecredit / 3 + s.store_deliverycredit / 3).toFixed(2);
    s.descScoreDesc = common.getStoreScoreDecs(s.store_desccredit);
    s.serviceScoreDesc = common.getStoreScoreDecs(s.store_servicecredit);
    s.deliveryScoreDesc = common.getStoreScoreDecs(s.store_deliverycredit);
    this.setData({
      'data.store': s
    });
  },

  /** 初始化评论相关 */
  initComment: function(data) {
    //好评率
    data.goods.goodCommentRate = data.statistics.high_rate;
    //评论日期格式化
    for (var i = 0; i < data.comment.length; i++) {
      data.comment[i].addTimeFormat = util.formatTime(data.comment[i].add_time, false);
      //设置5颗星s
      var on = 'on';
      var half = 'half';
      var off = 'off';
      var goods_rank_new = [];
      for (var ii = 1; ii <= 5; ii++) {
        if (data.comment[i].goods_rank >= ii) {
          goods_rank_new.push(on);
        } else {
          if (ii - 1 < data.comment[i].goods_rank && data.comment[i].goods_rank < ii) {
            goods_rank_new.push(half);
          } else {
            goods_rank_new.push(off);
          }
        }
      }
      data.comment[i].goods_rank_new = goods_rank_new;
      //设置5颗星
      data.comment[i].goods_rank = parseInt(data.comment[i].goods_rank);

    }
    //评论数
    this.data.categories3[0].num = data.statistics.total_sum;
    this.data.categories3[1].num = data.statistics.high_sum;
    this.data.categories3[2].num = data.statistics.center_sum;
    this.data.categories3[3].num = data.statistics.low_sum;
    this.data.categories3[4].num = data.statistics.img_sum;
    //渲染视图
    this.setData({
      categories3: this.data.categories3,
      data: data
    });
  },

  /** 初始化所有规格 */
  initSpecsPrice: function(data) {
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

  /** 初始化选中的规格商品 */
  initSelectSpecGoods: function() {
    var specSelect = this.data.specSelect;
    var specs = this.data.data.spec_goods_price;
    var itemId = specs[specSelect].item_id;
    if (specs[specSelect].prom_type == 0) {
      var noActivity = {
        prom_type: 0
      };
      specs[specSelect].activity = noActivity;
      this.initActivity(noActivity);
    } else if (typeof specs[specSelect].activity != 'undefined') {
      this.initActivity(specs[specSelect].activity);
    } else {
      // this.requestSpecInfo(specSelect);
    }
  },

  /** 请求规格商品的活动信息 */
  requestSpecInfo: function(specSelect) {
    var that = this;
    var specs = this.data.data.spec_goods_price;
    request.get('/api/goods/activity', {
      data: {
        goods_id: this.data.data.goods.goods_id,
        item_id: specs[specSelect].item_id
      },
        isShowLoading: false,
      success: function(res) {
        specs[specSelect].activity = res.data.result.goods;
        that.initActivity(res.data.result.goods);
      }
    });
  },

  /** 初始化显示的活动信息 */
  initActivity: function(activity) {
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
        activity.countName = '预售';
        
      }
      this.setData({
        'data.goods.shop_price': activity.shop_price,
      });
      activity.countTime = '--天--时--分--秒';
    } else if (activity.prom_type == 6) {

      activity.countName = '该商品正在参与拼团';
      activity.goods_id = activity.goods_id;
      activity.team_id = activity.prom_id ? activity.prom_id : 0;
      activity.item_id = activity.item_id ? activity.item_id : 0;
    }
    this.setData({
      'select.activity': activity,
    });
    this.destroyActivityTimer();
    this.createActivityTimer();
    this.initSelectedData();
  },

  /** 初始化选中的（规格）商品的显示参数 */
  initSelectedData: function() {
    var goods = this.data.data.goods;
    var activity = this.data.select.activity;
    var specs = this.data.data.spec_goods_price;
    var specSelect = this.data.specSelect;
    var stock = 0;
    var price = 0;
    var item_id = 0;
    var active_item_id = 0;
    var specImg = "/api/goods/goodsThumImages?goods_id=" + this.data.data.goods.goods_id + "&width=200&height=200";
    if (activity.prom_type == 1 || activity.prom_type == 2) {
      price = activity.shop_price;
      //处理参与活动的数量为0的库存错误展示
      item_id = typeof(activity.item_id) != 'undefined' ? specs[specSelect].item_id : 0;
      active_item_id = typeof(activity.item_id) != 'undefined' ? activity.item_id : 0;
      if (item_id == active_item_id) {
        stock = activity.store_count;
      } else if (specs.length == 0) {
        stock = activity.store_count;
      } else {
        stock = specs[specSelect].store_count;
      }
    } else if (activity.prom_type == 3) {
      price = activity.prom_price;
      stock = specs.length > 0 ? specs[specSelect].store_count : goods.store_count;
    } else if (specs.length > 0) {
      price = specs[specSelect].price;
      stock = specs[specSelect].store_count;
    } else {
      price = goods.shop_price;
      stock = goods.store_count;
    }
    if (specs.length > 0) {
      specImg = specs[specSelect].spec_img;
      if (!specImg) {
        specImg = "/api/goods/goodsThumImages?goods_id=" + this.data.data.goods.goods_id + "&width=200&height=200";
      }
    }
      if (specImg.indexOf('http') < 0 && specImg.indexOf('https') < 0) {
          specImg = this.data.url + specImg;
      }
    if (goods.exchange_integral > 0) {
      price = price - goods.exchange_integral / parseInt(goods.point_rate);
      price = price.toFixed(2);
    }
    if (this.data.select.activity.prom_type && this.data.select.activity.prom_type != 6){
        this.setData({
            'select.stock': stock,
            'select.spec_img': specImg,
            'select.specName': specs.length > 0 ? specs[specSelect].key_name : '',
        });
        return false;
        
    }else{
        this.setData({
            'select.price': price.split('.'),
            'select.stock': stock,
            'select.spec_img': specImg,
            'select.specName': specs.length > 0 ? specs[specSelect].key_name : '',
        });
    }
  },

  /** 创建活动倒计时定时器 */
  createActivityTimer: function() {
    var activity = this.data.select.activity;
    if (!activity.prom_type) {
      return;
    }
    var that = this;
    this.data.timer = setInterval(function() {
      var remainTime = activity.end_time * 1000 - (new Date()).getTime();
      remainTime = util.remainTime(remainTime);
      that.setData({
        'select.activity.countTime': remainTime
      });
    }, 1000);
  },

  /** 销毁活动倒计时定时器 */
  destroyActivityTimer: function() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
      this.data.timer = null;
    }
  },

  /** 商品首页 */
  tabClick: function(e) {
    var typeId = e.currentTarget.id;
    this.setData({
      activeCategoryId: typeId
    });
    if (typeId == 1) {
      this.tabGoodsContent();
      this.setData({
        loading: true,//加载动画的显示
        goods_norms: 1,
      })
    } else if (typeId == 2) {
      this.tabComment();
    }
  },

  /** 商品详情页 */
  tabClick2: function(e) {
    this.setData({
      activeCategoryId2: e.currentTarget.id
    });
  },

  /** 评论页 */
  tabClick3: function(e) {
    if (e.currentTarget.id == this.data.activeCategoryId3) {
      return;
    }
    this.setData({
      activeCategoryId3: e.currentTarget.id
    });
    this.requestComments(this.data.data.goods.goods_id, e.currentTarget.id);
  },

  /** 请求评论数据 */
  requestComments: function(goodsId, commentType) {
    var that = this;
    commentType++;
    var requestUrl = that.data.url + '/api/goods/getGoodsComment?goods_id=' + goodsId + '&type=' + commentType;
    request.get(requestUrl, {
        isShowLoading: false,
      success: function(res) {
        var comments = res.data.result;
        for (var i = 0; i < comments.length; i++) {
          comments[i].addTimeFormat = util.formatTime(comments[i].add_time);
          comments[i].goods_rank = parseInt(comments[i].goods_rank);
        }
          isShowLoading: false,
        that.setData({
          comments: comments
        });
      }
    });
  },

  /** 返回顶部 */
  doScrollTop: function() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },

  /** 打开评论页 */
  tabComment: function() {
    this.setData({
      activeCategoryId: 2
    });
    if (!this.data.comments) {
      this.requestComments(this.data.data.goods.goods_id, this.data.activeCategoryId3);
    }
  },

  /** 打开商品内容页 */
  tabGoodsContent: function() {
    this.setData({
      activeCategoryId: 1
    });
  },

  /** 请求商品详情页嵌入的html内容 */
  requestGoodsContent: function() {
    var that = this;
    request.get('/api/goods/goodsContent', {
      data: {
        id: this.data.data.goods.goods_id
      },
      isShowLoading:false,
      success: function(res) {
        // console.log(res)
        WxParse.wxParse('content', 'html', res.data.result.goods_content, that, 6);
        //网页中的图片加上域名
        common.wxParseAddFullImageUrl(that, 'content');
        that.setData({
          goodsAttrs: res.data.result.goods_attr_list
        });
      },
    });
  },
  /** 获取可领券的优惠券 */
  requestCardList: function () {
    var that = this;
    request.get('/api/activity/coupon_center', {
      data: {
        cat_id: that.data.result.goods.cat_id3,
        goods_id: that.data.result.goods.goods_id,
      },
      isShowLoading: false,
      success: function (res) {
        for (let i in res.data.result){
          res.data.result[i].condition = parseInt(res.data.result[i].condition);
          res.data.result[i].money = parseInt(res.data.result[i].money);
        }
        that.setData({ cardList: res.data.result || [] })
      }
    });
  },
  /** 领取卡券 */
  getCardList: function () {
    wx.navigateTo({
      url: '../../activity/coupon_list/coupon_list?type=goodsinfo',
    })
  },

  /** 点击规格按钮的回调函数 */
  selectSpec: function(e) {
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

  /** 加入购物车 */
  addCart: function(e) {
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
      form:1
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
        success: function(res) {
          wx.showModal({
            title: '添加成功！',
            cancelText: '去购物车',
            confirmText: '再逛逛',
            success: function(res) {
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
    goCard(){
      wx.switchTab({
        url: '/pages/cart/cart/cart'
      });
    },
  /** 购买虚拟商品 */
  buyVirtualGoods: function(data) {
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

  /** 立即兑换 */
  exchange: function(data) {
    //检查用户是否登录方可操作立即购买
    if (!app.auth.isAuth()) {
      app.showLoading(null, 1500);
      app.getUserInfo();
      return;
    }
    if (this.data.shippingCost < 0 || this.data.select.stock <= 0) {
      return;
    }
    wx.navigateTo({
      url: '/pages/cart/integral/integral?' + util.Obj2Str(data)
    });
  },

  /** 立即购买 */
  buyNow: function(data) {
    //检查用户是否登录方可操作立即购买
    if (!app.auth.isAuth()) {
      app.showLoading(null, 1500);
      app.getUserInfo();
      return;
    }
    Object.assign(data, {
      action: 'buy_now',
    });
    wx.navigateTo({
      url: '/pages/cart/cart2/cart2?' + util.Obj2Str(data)
    });
  },

  /** 增加购买的商品数量 */
  addCartNum: function(e) {
    this.checkCartNum(this.data.goodsInputNum + 1);
  },

  /** 减少购买的商品数量 */
  subCartNum: function(e) {
    this.checkCartNum(this.data.goodsInputNum - 1);
  },

  /** 输入购买的数量 */
  inputCartNum: function(e) {
    this.checkCartNum(Number(e.detail.value));
  },

  /** 检查购买的数量 */
  checkCartNum: function(num) {
    var stock = this.data.data.goods.store_count;
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

  /** 关闭规格弹窗 */
  closeSpecModal: function(e) {
    var query = wx.createSelectorQuery();
    //选择class
    var that = this;
    var height = 0;
    query.select('.spec-model').boundingClientRect(function (rect) {
      height = rect.height
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'ease'
      });
      animation.translate(0, height).step()
      that.setData({
        ani: animation.export(),
      })
      setTimeout(function(){
        that.setData({
          openSpecModal: false,
        })
      },200)
    }).exec();
  },

  /** 打开规格弹窗 */
  openSpecModel: function(e) {
    console.log('123123123123')
    this.setSize();

      var type = e.currentTarget.dataset.type;
      
      this.setData({
        carOrBuy: type,
        show: true
      })
    // this.setData({
    //   openSpecModal: true,
    //   judge: a
    // });
    // var query = wx.createSelectorQuery();
    // //选择class
    // var that = this;
    // var height = 0;
    // query.select('.spec-model').boundingClientRect(function (rect) {
    //   // console.log(rect.width)
    //   height = rect.height
    //   var animation = wx.createAnimation({
    //     duration: 200,
    //     timingFunction: 'ease'
    //   });
    //   console.log(height)
    //   animation.translate(0,-height).step()
    //   that.setData({
    //     ani: animation.export()
    //   })
    // }).exec();
  },
 
  collectGoods: function() {
    var that = this; 
    if (!wx.getStorageSync('wx_user_info')) {
      app.getUserInfo(function (userInfo) {
        that.setData({ userInfo: userInfo, click :false });
      }, true, false);
      return false;
  }
    request.post('/api/goods/collectGoodsOrNo', {
      data: {
        goods_id: that.data.data.goods.goods_id
      },
        isShowLoading: false, 
      success: function(res) {
        var status = that.data.data.goods.is_collect
        var sum = that.data.data.goods.collect_sum + ( status ? -1 : 1 )
        that.setData({
          'data.goods.is_collect': !that.data.data.goods.is_collect,
          'data.goods.collect_sum': sum,
        });
      }
    });
  },
  collectStore:function(){
    var that = this;
    if (!wx.getStorageSync('wx_user_info')) {
      app.getUserInfo(function (userInfo) {
        that.setData({ userInfo: userInfo, click :false });
      }, true, false);
      return false;
  }
    request.post('/api/store/collectStoreOrNo', {
        data: { store_id: that.data.data.goods.store_id },
        success: function (res) {
            console.log(res)
            if (res.data.status == 1) {
              if (res.data.msg == '关注成功') {
                wx.showToast({
                  title: '收藏成功',
                })
              } else {
                wx.showToast({
                  title: '已取消收藏',
                  icon: 'none'
                })
              }
            }
        }
    });
  },
  toStore:function(e){ 
    var store_id = this.data.data.store.store_id
    var user_store_id = this.data.userInfo.store_id || 0
    if (store_id == user_store_id ) {
      wx.navigateTo({
        url: '/pages/distribut0/shop/shop',
      })
      return
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /** 联系客服 */
  onTelClose:function(){
    this.setData({
      telShow: false
    })
  },
  callOtherTel:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.result.store.store_phone,
    })
  },
  contactService: function() {
    app.confirmBox('请联系客服：' + this.data.data.store.store_phone);
  },
  contactTel:function(){//展示商家电话号码
    if (this.data.result.store.store_phone != 0) {
      if (wx.getStorageSync('telsystem').indexOf('iOS') != -1 ) { //是苹果手机时候 ios
        wx.makePhoneCall({
          phoneNumber: this.data.result.store.store_phone,
        })
        return
      } else { // 不是ios系统手机
        this.setData({
          telShow: true
        })
      }
      
    } else {
      wx.showToast({
        title: '店家很神秘，未留下客服MM的联系方式',
        icon: 'none'
      })
    }
    
  },
  /** 请求购物车数量 */
  requestCardNum: function() {
    var that = this;
    request.get('/api/cart/cartList', {
        isShowLoading: false,
      success: function(res) {
        var cartGoodsNum = 0;
        var list = res.data.result.storeList;
        if (!list) {
          return;
        }
        for (var i = 0; i < list.length; i++) {
          for (var j = 0; j < list[i].cartList.length; j++) {
            cartGoodsNum += list[i].cartList[j].goods_num;
          }
        }
        that.setData({
          cartGoodsNum: cartGoodsNum
        });
      }
    });
  },

  /** 预览图片 */
  previewCommentImgs: function(e) {
    var imgs = this.data.comments[e.currentTarget.dataset.cidx].img;
    wx.previewImage({
      current: imgs[e.currentTarget.dataset.id],
      urls: imgs
    });
  },

  /** 预览图片 */
  previewGoodsCommentImgs: function(e) {
    var that = this;
    var imgs = this.data.data.comment[e.currentTarget.dataset.cidx].img;
    imgs = imgs.map(function(val) {
      return that.data.url + val;
    });
    wx.previewImage({
      current: imgs[e.currentTarget.dataset.id],
      urls: imgs
    });
  },
  /** 关闭优惠信息弹窗 */
  closePromModal: function() {
    this.setData({
      openPromModal: false
    });
  },

  /** 打开优惠信息弹窗 */
  openPromModal: function() {
    this.setData({
      openPromModal: true
    });
  },

  /**
   * 转发按钮
   */
  // onShareAppMessage: function (res) {
  //     return setting.share;
  // },
  /**
   * 转发按钮
   */
  shareTogetherClose:function(){
    this.setData({
      shareTogether: false
    })
  },
  shareTogether:function(){
    var that = this
    var store_id = this.data.userInfo.store_id || 0
    var is_B = this.data.userInfo.is_B || 0
    if (!this.data.userInfo) {//未登录
      wx.showModal({
        content: '您还没有登录，无法使用分享功能哦~',
        confirmText: '前往登录',
        success (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/user0/index/index',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
    } else { //已登录
      if (store_id == 0) {
        that.setData({
          actionSheetHidden: true
        })
        Dialog.confirm({
          message: '您还没有店铺，无法使用分享功能。是否前往免费开店？',
          confirmButtonText: '免费开店',
          cancelButtonText: '再看看'
        }) 
          .then(() => {
            wx.navigateTo({
              url: '/pages/newjoin/join4/join4',
            })
            Dialog.close()
          })
          .catch(() => {
            Dialog.close()
          });
      } else if(is_B == 1) {
        wx.showModal({
          title: '提示',
          content: '本次分享，对方将知晓壹童网信息，是否继续',
          messageAlign: "left",
          cancelText: '返回',
          confirmText: '继续',
          success (res) {
            if (res.confirm) {
              that.setData({
                shareTogether: true
              })
            } else if (res.cancel) {
              console.log('啥也不用干1')
            }
          }
        })
      }
    }
  },
  onShareAppMessage: function(res) {
 
    var that = this
    var goods = that.data.data.goods;
    var url = that.data.url; 
    var original_img = goods.original_img;
    if (!original_img) {
      original_img = goods.spec_goods_price[0].spec_img;
    }
    if (original_img.indexOf('http') < 0 && original_img.indexOf('https') < 0) {
      original_img = url + original_img
    }
    var name = ''
    if (that.data.userInfo.nickname) {
      name = that.data.userInfo.nickname
    }
    return {
      title: name + '发现了一件好货' + goods.goods_name, //自定义转发标题
      path: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + goods.goods_id + '&item_id=' + that.data.optionItemId + '&first_leader=' + wx.getStorageSync('app:userInfo')['user_id'],
      // imageUrl: goods.original_img ? url + goods.original_img : url + goods.spec_goods_price[0].spec_img
      imageUrl: original_img
    }
  },
  /** 商品分享海报s */
  catchShare: function() {
    if (!wx.getStorageSync('wx_user_info')) {
      app.getUserInfo(function (userInfo) {
        that.setData({ userInfo: userInfo, click :false });
      }, true, false);
      return false;
  }
    this.setData({
      actionSheetHidden: false
    })
  },

  listenerActionSheet: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  
  //关闭二维码弹窗
  closeQcode: function(){
    this.setData({
      hasQcode: false
    })
  },

  /**
   * 获取商品分享海报
   */
  getSharePic: function(e) {
    if (!wx.getStorageSync('app:userInfo').token) {
      wx.reLaunch({
        url: '/pages/user0/index/index',
      })
    } 
    var that = this
    var type = e.currentTarget.dataset.type
    var store_id = wx.getStorageSync('app:userInfo').store_id
    var is_B = this.data.userInfo.is_B || 0
    if (store_id == 0 && is_B == 0) { // 普通人 看看得了
      this.setData({
        actionSheetHidden: true
      })
      Dialog.confirm({
        message: '您还没有店铺，无法使用分享功能。是否前往免费开店？',
        confirmButtonText: '免费开店',
        cancelButtonText: '再看看'
      }) 
        .then(() => {
          wx.navigateTo({
            url: '/pages/newjoin/join4/join4',
          })
          Dialog.close()
        })
        .catch(() => {
          Dialog.close()
        });
        return
    }
    if (store_id > 0 && is_B == 0) { // 大A 海报
      type = 0
      this.haibao(type)
    }
    if (store_id > 0 && is_B == 1) { // 大B 海报
      that.setData({
        shareTxt: '  为保护您的商业机密，请保存海报后， 通过微信发送给下级'
      })
      type = 3
      request.get( that.data.url + '/api/Goods/isGoodsSharePoster',{
        data:{
          goods_id: that.data.goodId
        },
        success: function(res){
          if (res.data.status == 1) {
            wx.showModal({ 
              title: '提示',
              content: '请确认分享的是下级采购商吗？',
              success (res) {
                if (res.confirm) {
                  that.haibao(type)
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            
          }
        }
      } )
      
    }

  },
  haibao:function(type){
    const that = this
    that.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    wx.showLoading({
      title: '正在生成',
      mask: true,
    })

    var item_id = (that.data.data.spec_goods_price.length) > 0 ? that.data.data.spec_goods_price[that.data.specSelect].item_id : 0

    wx.getImageInfo({
      src: that.data.url + '/api/goods/goodsSharePoster?id=' + that.data.data.goods.goods_id +
        '&item_id=' + item_id +
        '&prom_id=' + that.data.data.goods.prom_id +
        '&store_id=' + that.data.data.goods.store_id +
        '&prom_type=' + that.data.data.goods.prom_type +
        '&token=' + that.data.userInfo.token +
        '&type='+ type +'&leader_id=' + wx.getStorageSync('app:userInfo')['user_id'],
        isShowLoading: false,
      success: function(res) {
        console.log('res')
  
        that.setData({
          share_btn: true,
          share_pic: res.path
        })
      },
      complete: function(res) {
        console.log(res)
        
        wx.hideLoading()
        if (res.errMsg.indexOf('fail') != -1 ) {
          Dialog.confirm({
            message: '您的店铺暂无出售中的商品,或当前商品您还没有加入分销，无法分享，您可点击加入分销，分销商品,或发布新商品',
            confirmButtonText: '好的',
            showCancelButton: false
          }) 
            .then(() => {
              
              Dialog.close()
            })
            .catch(() => {
              Dialog.close()
            });
        }
      }
    })
  },
  closeShareModal: function() {
    this.setData({
      share_btn: false
    })

  },

  saveSharePic: function() {
    var that = this
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: that.data.share_pic,
          success: function(res) {
            that.setData({
              share_btn: false
            })
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
          }
        })
      },
      fail: function(res) {
        common.checkAuthorize('scope.writePhotosAlbum')
      }
    })

  },

  previewSharePic: function() {
    wx.previewImage({
      urls: [this.data.share_pic],
    })
  },
  /** 商品分享海报e */
    /** 领取卡券 */
    getCardList: function () {
        wx.navigateTo({
            url: '../../activity/coupon_list/coupon_list?type=goodsinfo',
        })
    },
    // 页面上拉触底事件的处理函数
    onReachBottom: function () {
        // if (load.canloadMore()) {
          if (true) {
            this.setData({
                loading: true,//加载动画的显示
                goods_norms: 1,
            })
        }
    },
    onClose() {
      this.setData({ show: false });
    },
  
    onGetUserInfo(e) {
      console.log(e.detail);
    },
    // 初始化购买弹框数据 根据款式数量 设定弹框横向滑动的总宽 以及每项的宽  和分几行显示
    setSize:function(){
      // console.log(this.data)
      var length = this.data.result.goods_spec_list[0].spec_list.length
      // const length = 8
      // 根据款项的数量设置横向画框的尺寸
      if(length<4){
        // 3件以内的情况
          this.setData({
            scrollBoxWidth: 730,//一个整的宽度
            scrollBoxHeight:330,//一个item的高度
            sItemWidth:228,//每个1/3的宽度
            ulWidth: '200rpx'
          })
      } else if (length <7){
        this.setData({
          scrollBoxWidth: 730,//4个小的规格的宽度
          scrollBoxHeight:660,//两个item的高度
          sItemWidth:235,//每个1/3的宽度
          ulWidth: '200rpx'
        })
      }else {
        if (length %2 == 0) {
          this.setData({
            scrollBoxWidth: length/2*235,//4个小的规格的宽度
            scrollBoxHeight:660,//两个item的高度
            sItemWidth:235,//每个1/3的宽度
            ulWidth: 750 / (length/2*235) * 200 + 'rpx'
          })
        } else {
          this.setData({
            scrollBoxWidth: (length + 1)/2*235,//4个小的规格的宽度
            scrollBoxHeight:660,//两个item的高度
            sItemWidth:235,//每个1/3的宽度
            ulWidth: 750 / ((length + 1)/2*235) * 200 + 'rpx'
          })
        }
      }
    },
    // 选择不同规格产品
    clickImg:function(e){
      const index = e.currentTarget.dataset.index
      if(this.data.result.spec_goods_price[index].store_count == 0) {
          return wx.showToast({
            title: '当前规格没有库存，请选择其他规格查看',
            icon: 'none'
          })
        }
      if (index == this.data.curImg) {
        this.setData({
          curImg: 'lkdh',
          selictGoods:{
            introduce:'',
            goods_id: this.data.result.goods.goods_id,
            goods_num: this.data.selictGoods.goods_num > Math.floor(this.data.result.spec_goods_price[0].store_count) ? Math.floor(this.data.result.spec_goods_price[0].store_count) : this.data.selictGoods.goods_num,
            item_id: '',
            form: 1,
            price: this.data.result.goods.each_hand_single_price,
            allprice: this.data.result.goods.each_hand_all_price,
            store_count: this.data.result.spec_goods_price[0].store_count
          },
          totalPrice: this.data.result.goods.each_hand_all_price,
          sheetMaxSum: Math.floor(this.data.result.spec_goods_price[0].store_count),
          v:1,
          upsum: 1,
        })
        return
      }
      var v = 1
      var sheetMaxNum = this.data.sheetMaxNum
      var goodsName = this.data.result.goods.goods_name
      var item_id = this.data.result.spec_goods_price[index].item_id
      var kuanshi = this.data.result.goods_spec_list[0].spec_list[index].item
      var kuanshiname = this.data.result.goods_spec_list[0].spec_name
      var goods_id = this.data.result.goods.goods_id
      var totalPrice = this.data.result.spec_goods_price[index].price * (this.data.selictGoods.goods_num > Math.floor(this.data.result.spec_goods_price[0].store_count) ? Math.floor(this.data.result.spec_goods_price[0].store_count) : this.data.selictGoods.goods_num)
      var goods_num = this.data.selictGoods.goods_num > Math.floor(this.data.result.spec_goods_price[0].store_count) ? Math.floor(this.data.result.spec_goods_price[0].store_count) : this.data.selictGoods.goods_num
      var price = this.data.result.spec_goods_price[index].each_hand_unit_price
      var sheetMaxSum = Math.floor(this.data.result.spec_goods_price[index].store_count)
      var introduce = goodsName + '  ' + kuanshiname + '-' + kuanshi
      this.setData({
        curImg: e.currentTarget.dataset.index,
        selictGoods:{
          introduce: introduce,
          goods_id: goods_id,
          goods_num: goods_num,
          item_id: item_id,
          form : 1,
          price: price,
          allprice:this.data.result.spec_goods_price[index].price,
          store_count: this.data.result.spec_goods_price[index].store_count
        },
        totalPrice: totalPrice,
        sheetMaxSum: sheetMaxSum,
        v: v
      })
    },
    // 手数变化
    changeShoushu:function(e){
      var index = e.currentTarget.dataset.index
      var shoushu = this.data.result.goods_spec_list[1].spec_list[index].item
      const selictGoods = JSON.parse(JSON.stringify(this.data.selictGoods))
      var count = selictGoods.store_count
      
      var sheetMaxSum = Math.floor(this.data.selictGoods.store_count)
      this.setData({
        currentShoushu: shoushu,
        selictGoods: selictGoods,
        sheetMaxSum: sheetMaxSum,
      })
    },
    // 购买数量变化
    bunSumChange:function(e){
      // console.log(e.detail)
      console.log(e.detail)
      var num = e.detail * this.data.currentShoushu
      if (num>this.data.selictGoods.store_count) {
        this.setData({
          v: Math.floor(this.data.selictGoods.store_count)
        })
      }
      const selictGoods = JSON.parse(JSON.stringify(this.data.selictGoods))
      selictGoods.goods_num = e.detail
      this.setData({
        selictGoods: selictGoods,
        upsum: num,
        totalPrice: selictGoods.allprice * e.detail,
      })
      if (e.detail > this.data.sheetMaxSum) {
        wx.showToast({
          title: '当前库存' + this.data.sheetMaxSum + '件' + '，您可联系商家增加库存',
          icon: 'none'
        })
      }
    },
    // 购买 或者添加购物车
    buyOrcar:function(e){
      const that = this
      var type = this.data.carOrBuy
      // console.log(type)
      // return
      const selictGoods = JSON.parse(JSON.stringify(this.data.selictGoods))
      if (selictGoods.introduce == '') {
        return wx.showToast({
          title: '您还没有选择商品',
          icon: 'none'
        })
      }
      const data = {
        goods_id: selictGoods.goods_id,
        goods_num: selictGoods.goods_num,
        item_id: selictGoods.item_id,
        form: 1,
        store_id: this.data.data.goods.store_id
      }
      if (type == 'car') {
        if (!app.auth.isAuth()) {
          app.showLoading(null, 1500);
          app.getUserInfo();
          return;
        }
       
        console.log(data)
        request.post('/api/cart/addCart', {
          data: data,
          success: function(res) {
            wx.showModal({
              title: '添加成功！',
              cancelText: '去购物车',
              confirmText: '再逛逛',
              success: function(res) {
                if (res.cancel) {
                  wx.reLaunch({
                    url: '/pages/cart/cart/cart'
                  });
                } else {
                  that.setData({
                    show: false
                  })
                  that.requestCardNum();
                }
              }
            });
          }
        });
      } else {
        this.buyNow(data);
      }
    },
    imageFangDa:function(e){
      var index = e.currentTarget.dataset.index
      this.setData({
        currentSwiperIndex: index,
        isSwiperShow: false
      })
    },
    // 模拟图片预览
    previewImageChange:function(e){
      var index = e.detail.current
      this.setData({
        previewImageIndex: index
      })
    },
    // 商品预览滚动
    scrollXfun:function(e){
      var bili = this.data.proportionPx
      // console.log(e.detail.scrollLeft,'=====',e.detail.scrollWidth)
      // console.log(e.detail.scrollLeft / (e.detail.scrollWidth - (730*bili)))
      this.setData({
        pressLeft: e.detail.scrollLeft / e.detail.scrollWidth * 100 + '%'
      })
    },
//  关闭模拟预览
previewImageClose:function(){
  this.setData({
    isSwiperShow: true
  })
},
previewImageTap:function(e){
  var index = this.data.previewImageIndex
  if(this.data.result.spec_goods_price[index].store_count == 0) {
    return wx.showToast({
      title: '当前规格没有库存，请选择其他规格查看',
      icon: 'none'
    })
  }
  const { goods_spec_list, spec_goods_price, goods} = this.data.result
  var v = 1
  var goodsName = goods.goods_name
  var kuanshi = goods_spec_list[0].spec_list[index].item
  var kuanshiname = goods_spec_list[0].spec_name
  var goods_id = goods.goods_id
  var item_id = spec_goods_price[index].item_id
  var introduce = goodsName + '  ' + kuanshiname + '-' + kuanshi
  var price = spec_goods_price[index].each_hand_unit_price
  var goods_num = this.data.selictGoods.goods_num > Math.floor(this.data.result.spec_goods_price[0].store_count) ? Math.floor(this.data.result.spec_goods_price[0].store_count) : this.data.selictGoods.goods_num
  var totalPrice = this.data.result.spec_goods_price[index].price * (this.data.selictGoods.goods_num > Math.floor(this.data.result.spec_goods_price[0].store_count) ? Math.floor(this.data.result.spec_goods_price[0].store_count) : this.data.selictGoods.goods_num)
  var sheetMaxSum = Math.floor(this.data.result.spec_goods_price[index].store_count)
  this.setData({
    curImg: this.data.previewImageIndex,
    selictGoods:{
      introduce: introduce,
      goods_id: goods_id,
      goods_num: goods_num,
      item_id: item_id,
      form : 1,
      price: price,
      allprice:this.data.currentShoushu * price * v,
      store_count: this.data.result.spec_goods_price[index].store_count
    },
    sheetMaxSum: sheetMaxSum,
    v: v,
    isSwiperShow: true,
    totalPrice: totalPrice
  })

},
swiperOver:function(e){
  this.setData({
    previewImageIndex: e.detail.current
  })
},
siseHelp:function(){//每手几件的弹出
  Dialog.alert({
    message: "每‘手’即该商品 ··所有尺码各一件·· \n例:某商品所含尺码为-S/M/L/XL/XXL。\n一手则含S至XXL在内所有五个尺码各一件",
  })
},
closeMask: function(){ // 提示信息
  this.setData({
      tipsmask: true
  })
  if (wx.getStorageSync('maskSum2')) {//判断本地有无数量设置过
      var maskSum = wx.getStorageSync('maskSum2') - 1
      wx.setStorageSync('maskSum2', maskSum)
  } else {
      wx.setStorageSync('maskSum2', 5)
  }
},
showImg:function(e){
  var imgs = this.data.data.gallery.map(function(item){
    return item.image_url
  })
  wx.previewImage({
    urls: imgs,
    current: e.currentTarget.dataset.curimg
  })
},
copyTitle(e){
  wx.setClipboardData({
    data: e.currentTarget.dataset.txt,
  })
}
});