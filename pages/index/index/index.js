var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var bmap = require('../../../libs/bmap-wx.min.js');
var util = require('../../../utils/util.js');
var common = require('../../../utils/common.js');
var WxParse = require('../../../utils/wxParse/wxParse.js');
import LoadMore from '../../../utils/LoadMore.js';
import Regions from '../../../utils/regions/Regions.js';
import Dialog from '../../../dist/dialog/dialog';
var load = new LoadMore;
var timeSum = new Date()
var riqi = timeSum.getDate()
var timer1 = ''
Page({
  data: {
    url: setting.url,
    resourceUrl: setting.resourceUrl,
    logo: setting.appLogo,
    stickyHeight: wx.getSystemInfoSync().screenWidth * 88 / 750,
    randomSwiper: Math.ceil(Math.random()*4),
    homeData: null, //首页轮播和广告
    saleGoods: null, //秒杀商品
    marginBottom: wx.getStorageSync('marginBottom') || 0,
    sale: {
      countTime: {
        hour: '00',
        minute: '00',
        second: '00',
      },
      diffTime: 0,
      good: null,
    },
    timer: null, //活动倒计时定时器
    shopList: [], //门店列表
    recommend: null, //推荐商品
    teamActivityHome: null, //拼团列表
    scrollTop: 0,
    currentPage: 1,
    wap_home_logo: '',
    latitude: 0,
    longitude: 0,
    region_id: 0,
    currentCity: "", 
    isChangeRegion: false, //是否切换地址
      countDownList: {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00',
      }, //秒杀结束初始化时间
      webUrl: '',
      is_block: 1,
      defaultMenu: false,  //默认底部菜单显示状态
      infologin: false,
      newcomers: false,  //新人好礼专享
      xinrengit: [],  //新人好礼专享数据
      coupon_id: "",
      custom_skill_status: false,
      from_address: {},
      menu_index: 0,//菜单索引
      goods_show: 0,
      address: '', //当前地址
      end_time: '',  //秒杀结束时间
    search:[],
    ak: 'fZksmKUsUDqqYs2FHWv6CHHBIF3cR5qK',  //百度地图key
    is_apply:0,
    listArr:[],//获取到的首页数据
    is_store_member: false,
    goodsTips: true,
    randomSum: 0,
    isiphoneX: wx.getStorageSync('isiphoneX')||false,
    recommendGoodsNavIndex: 0,//默认为你推荐是第一项 下标0
    listP: 1,//商品模块page
    listType: 1,
    listGoods: [],
    supportPageScroll: false,
    loadingShow: true,
    sc: false
  },

  //事件处理函数
  onLoad: function(options) {
    
    // console.log(wx.getSystemInfoSync().screenWidth)
    wx.hideShareMenu()
    // var randomSum = timeSum.getFullYear() * 2.1 + timeSum.getDate() * (timeSum.getDay() - 0 + 1) * (timeSum.getMonth() - 0 + 1) + timeSum.getDate() * (timeSum.getDay() - 0 + 1) * 2

    var that = this;
    
    // if (wx.getStorageSync('riqi') != riqi || !wx.getStorageSync('riqi')) {
    //   timer1 = setTimeout(function(){
    //     that.setData({
    //       goodsTips: false,
    //       randomSum: parseInt(randomSum)
    //     })
    //     clearTimeout(timer1)
    //   },1500)
    //   wx.setStorageSync('riqi', riqi)
    // }


    // this.hidetabbar()
    // that.miniapp_status();		
      if (options.first_leader) {
          wx.setStorageSync('first_leader', options.first_leader);
      }
      //预加载自定义缓存页面
      if (wx.getStorageSync('custom_data')) {
          that.customRendering(wx.getStorageSync('custom_data'));
      }

 
    wx.setNavigationBarTitle({
      title: setting.appName,
    });

    //以前有登录过，则直接登录
    if (app.auth.hadAuth()) {
      app.getUserInfo(function(){
        //新人好礼专享
        // that.newtect()
      });
    }
    

   // this.initLocation()
     load.init(this, '', 'recommend');
    this.requestHomePage();
    // this.requestRecommend();
    // this.requestTeamActivityHome();
    //首页logo
    request.get('/api/Index/getConfig', {
      failRollback: true,
      successReload: true,
      success: function(res) {
        var data = res.data.result.config;
        app.globalData.config = data;
        var is_block = common.getConfigByName(data, 'is_block_index');
        var wap_home_logo = '';
        for (let i = 0; i < data.length; i++) {
          if (data[i]['name'] == 'wap_home_logo') {
            wap_home_logo = data[i]['value']
          }
          if (data[i]['name'] == 'hot_keywords'){
            var lemd = data[i]['value'].split('|')
            wx.setStorageSync('hot_keywords', lemd);
          }
        }

          //is_block = 0
        that.setData({
          is_block: is_block,
          wap_home_logo: setting.url + wap_home_logo
        })

          if (is_block == 0) {
              wx.removeStorageSync('custom_data');
              // that.requestHomePage();
              that.setData({ defaultMenu: true, menu_model: [] });
              app.globalData.menu_model = [];
              app.globalData.defaultMenu = true;
          
          } else {
              load.init(this, '', 'shopList');
              // that.requestShopList();

              //第一次加载默认读取该页面自定义控件，有良好体验，通过点击菜单是一个跳转到自定义页面customPage        
              that.checklogin();
              that.getAutoData();
          }
      }
    });
    that.hasActive();
    this.getListGoods(1,1)

    if (wx.pageScrollTo) {
      this.setData({
        supportPageScroll: true
      });
    }
  },

  // 获取活动列表
  hasActive(){
    let that = this;
    request.get('/api/Activity/dayNotch', {
        data: {
            
        },
        success: function (res) {
          // console.log(res.data.result);
          let tempArr = res.data.result;
          tempArr.forEach(item=>{
            item.title_img = setting.url+item.title_img;
          })
            that.setData({
              listArr:tempArr
            })
        }
    });
},

  // 跳转到分类
  toList(e){
    
    // if(e.currentTarget.dataset.title== '档口排行'){
    //   wx.navigateTo({
    //     url: '/pages/index/dk/dk',
    //   })
    // }else{
   
    //   wx.switchTab({
    //     url: '/pages/goods/goodsList/goodsList',
    //   })
    // }
  },

  // 去商品详情
  goDetail(e){
    let item = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/goods/goodsInfo/goodsInfo?store_id='+item.store_id+'&goods_id='+item.goods_id,
    })
  },

  //是否在审核阶段
  // miniapp_status: function () {
  //   var that = this;
  //   //获取是不是在审核隐藏一些功能
  //   request.get(that.data.url + '/api/app/mini_app', {
  //     success: function (res) {
  //       if (res.data.result.status == 1) {
  //         app.globalData.is_apply = 1
  //         that.setData({ is_apply:1 })
  //       }
  //     }
  //   });
  // },
  //新人专享好礼数据
  newtect: function () {
    let that = this;
    request.get(app.globalData.setting.url + '/api/index/get_noob', {
      successReload: true,
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            newcomers: true,
            xinrengit: res.data.noob_gift
          })
          var comId = "";
          that.data.xinrengit.forEach(function (ele, index) {
            if (index === 0) {
              comId = ele.id
            } else {
              comId += '_' + ele.id
            }
          })
          that.setData({
            coupon_id: comId
          })
        }
      }

    })

  },
  //领取新人好礼
  newdax: function () {
    var that = this;
    that.setData({
      newcomers: false
    })
    request.get(app.globalData.setting.url + '/api/index/get_noob_coupon', {
      successReload: true,
      data: {
        coupon_id: that.data.coupon_id
      }
      
    })
  },
  //关闭新人好礼
  daxhide: function () {
    this.setData({
      newcomers: false
    })
  },


  onShow: function() {
    // if (app.auth.hadAuth()) {  
    //     this.newtect();
    // }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#3abdb7'
    })
    var is_store_member  = wx.getStorageSync('app:userInfo').is_store_member || 0
    if (is_store_member > 0) {
      this.setData({
        is_store_member: true
      })
    }
    // this.hidetabbar()
    if (this.data.isChangeRegion) {
      this.data.currentPage = 1;
      this.setData({
        shopList: null
      })
      load.resetConfig();
      // this.requestShopList();
    }
      if (this.data.infologin) {
          this.data.infologin = false;
          this.checklogin();
      }
  },
  initLocation: function() {
    //获取当前定位
    var that = this
    wx.authorize({
      scope: 'scope.userLocation',
      success: function(res) {
        wx.getLocation({
          success: function(res) {
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude
            })
            // that.requestShopList();
          },
        })
      },
      fail: function(res) {
        wx.showModal({
          title: '用户未授权',
          content: '未授权获取位置信息将不能体验小程序完整功能，前往个人中心页底部->授权管理',
          success: (res) => {
            if (res.confirm) {
                wx.reLaunch({
                url: '/pages/user0/index/index',
              })
            }
          }
        })
      }

    })

  },

  onReachBottom: function() {
      // if (this.data.is_block == 0 && load.canloadMore()) {
          // this.requestShopList();
	  // this.requestRecommend();
      // }
      this.setData({
        listP: this.data.listP - 0 + 1
      },function(){
        this.getListGoods(this.data.listType,this.data.listP,'')
      })
  },
//   特色推荐
  requestRecommend: function () {
        var that = this;
        var requestUrl = '/api/index/recommend?p=' + that.data.currentPage;
        load.request(requestUrl, function () {
            that.data.currentPage++;
        });
    },
    // 拼团列表
    requestTeamActivityHome: function () {
        var that = this;
        request.get('/api/team/teamActivityHome', {
            success: function (res) {
                var res = res.data;
                if (res.status == 1){
                    for (var i in res.result){

                        res.result[i].team_price_new = res.result[i].team_price.split('.');
                    }

                    that.setData({
                        teamActivityHome: res.result
                    })
                }
               
            }
        });
    },
  requestShopList: function() {
    var that = this;
    //设置点击的城市
      var search = that.data.search;
    search.currentCity = that.data.currentCity

          that.setData({
              // 获取当前城市
              search: search
          })
      var requestUrl = '/api/index/shopList?p=' + that.data.currentPage + '&latitude=' + that.data.latitude + '&longitude=' + that.data.longitude + '&city_id=' + that.data.region_id;
    load.request(requestUrl, function(res) {
        that.data.region_id == 0 ;
      that.setData({
        // currentCity: res.data.city_name
      })
        that.setData({
            shop_list: res.data.result,
        })
      that.data.currentPage++;
    });
  },
  requestHomePage: function() {
    var that = this;
    request.get('/api/index/homePage?new_ad=1', {
      success: function(res) {
        var result = {};
        var banners = res.data.result.banner || [];
        for (var i = 0; i < banners.length; i++) {
          banners[i].ad_code = common.getFullUrl(banners[i].ad_code);
          if (banners[i].media_type == 3) {
            banners[i].media_link = '/pages/goods/goodsInfo/goodsInfo?goods_id=' + banners[i].ad_link;
          } else if (banners[i].media_type == 4) {
            banners[i].media_link = '/pages/goods/goodsList/goodsList?cat_id=' + banners[i].ad_link;
          }
        }
          var ad = res.data.result.ad
          var ads = {}
          for (var i = 0; i < ad.length; i++) {
              ad[i].ad_link = that.parseAdUrl(ad[i].media_type, ad[i].ad_link);
              ad[i].ad_code = common.getFullUrl(ad[i].ad_code);
              ads['ad_' + ad[i].pid] = ad[i]
          }
          res.data.result.ad = ads
	        var sale_goods = res.data.result.flash_sale_goods;
                if (sale_goods.length > 0) {
                    that.setSaleTime(res.data.result);
                }
                if (sale_goods.length > 0 && sale_goods.length < 3) {
                    that.setData({ saleGoods: sale_goods });
                } else if (sale_goods.length >= 3) {
                    var goods=[];
                    for (var j = 0; j <= 3; j++) {
                        goods[j] = sale_goods[j];
                    }
                    that.setData({ saleGoods: goods });
                    
                }
        that.setData({
          homeData: res.data.result
        });
        wx.stopPullDownRefresh();
        if (wx.getStorageSync('riqi') != riqi || !wx.getStorageSync('riqi')) {
          timer1 = setTimeout(function(){
            that.setData({
              goodsTips: false,
              randomSum: res.data.result.yesterday_add_goods_num
            })
            clearTimeout(timer1)
          },1500)
          wx.setStorageSync('riqi', riqi)
        }
    
      }
    });
  },

    parseAdUrl: function (type, link) {
        var $url
        switch (type) {
            case 3:
                $url = '/pages/goods/goodsInfo/goodsInfo?goods_id=' + link
                break;
            case 4:
                $url = '/pages/goods/goodsList/goodsList?id=' + link
                break;
            default:
                $url = link
                break;
        }
        return $url;
    },
  onPullDownRefresh: function(e) {
      if (this.data.is_block == 0) {
          this.data.recommend = null;
          this.data.currentPage = 1;
          load.resetConfig();
          this.requestHomePage(); //首页数据
          // this.requestShopList();
	  //  this.requestRecommend();
      } else {
          this.getAutoData();
          wx.stopPullDownRefresh();
      }
  },
  onUnload: function() {
    this.destroyActivityTimer();
  },
  setSaleTime: function(result) {
    if (!result.diffTime) {
      result.diffTime = (new Date()).getTime() - result.server_time * 1000;
    }

    if (!result.diffTime) {
      result.diffTime = (new Date()).getTime() - result.server_time * 1000;
    }
    var hour = util.format(result.server_time, 'h');
    var flash_now_time = 0;
    if (hour % 2 == 0) {
      flash_now_time = hour;
    } else {
      flash_now_time = hour - 1;
    }
    if (hour.length == 1) {
      flash_now_time = '0' + flash_now_time
    }
    this.setData({ flash_now_time: flash_now_time });

    this.setData({
      'sale.diffTime': result.diffTime
    });
    this.setData({
      'sale.good': result.flash_sale_goods[0]
    });
    
    this.destroyActivityTimer();
    // this.createActivityTimer();
  },
  /** 创建活动倒计时定时器 */
  createActivityTimer: function() {
    var sale = this.data.sale;
    var that = this;
    this.data.timer = setInterval(function() {
      var time = sale.good.end_time * 1000 - (new Date()).getTime() + sale.diffTime;
      var remainTime = util.transTime(time);
      if (time <= 0) {
        // that.destroyActivityTimer();
        that.requestHomePage(); //首页数据
        return;
      }
      that.setData({
        'sale.countTime': remainTime
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
  /** 页面滚动事件 */
  onPageScroll: function(e) {
    // this.setData({
    //   scrollTop: e.scrollTop
    // });
    // //可能还在滚动就跳到其他页面去了，导致导航栏变色，所以要判断路由
    // var pages = getCurrentPages();
    // if (pages[pages.length - 1].route == 'pages/index/index/index') {
    //   if (e.scrollTop > 10) {
    //     wx.setNavigationBarColor({
    //       frontColor: '#ffffff',
    //       backgroundColor: '#3abdb7'
    //     });
    //   } else {
    //     wx.setNavigationBarColor({
    //       frontColor: '#ffffff',
    //       backgroundColor: '#3abdb7'
    //     });
    //   }
    // }
  },
  jumpSearch: function() {
    wx.navigateTo({
      url: '/pages/goods/search/search'
    });
  },

  /**
   * 转发按钮
   */
  onShareAppMessage: function(res) {
    return setting.share;
  },

  // goShopIndex:function(e){

  //     wx.navigateTo({
  //         url: '/pages/shopIndex/shopIndex?store=' + JSON.stringify(this.data.shopList[e.currentTarget.dataset.index]),
  //     })
  // }
//   跳转到店铺详情
    goShopIndex:function(e){
      wx.navigateTo({
          url: '/pages/shopIndex/shopIndex?store_id=' + e.currentTarget.dataset.item.store_id,
      })
  },
    /****************************** 自定义 start ********************************/        
    //获取自定义首页数据
    getAutoData: function (id) {
        var that = this;
        var url = !id ? '/api/Index/block_index' : '/api/Index/block_index/id/' + id
        request.get(url, {
            failRollback: true,
            successReload: true,
            success: function (res) {
                if (res.data.status == 1) {
                    wx.setStorageSync('custom_data', res.data.result.blocks)
                    that.customRendering(res.data.result.blocks)
                }
              
            }
        });
    },
     /** 自定义组件渲染 */
    customRendering:function(custom){
        var that = this;
        var data = custom;      //模块集合
        var skill = [];                         //秒杀
        var block_model = [];                   //其他模块集合
        var shop = [];                          //多门店集合
        var content = [];                       //富文本集合
        var menu_model = [];                    //菜单集合
        var video = [];                         //视频集合
        var search = [];                        //搜索
        var ids = [];


        for (let z = 0; z < data.length; z++) {
            if (data[z]['block_type'] == '6') {
                skill = data[z];
            }

            if (data[z]['block_type'] == '14') {
                data[z]['video_url'] = data[z]['video_url'].indexOf('http') == -1 ? setting.url + data[z]['video_url'] : data[z]['video_url'];
                video = data[z];
            }

            if (data[z]['block_type'] != '8' && data[z]['block_type'] != '9' && data[z]['block_type'] != '11') {
                if (data[z]['block_type'] == '13') {
                    let goodslist = data[z]['goods_list'];

                    for (let gl = 0; gl < goodslist.length; gl++) {

                        if (goodslist[gl].original_img.indexOf('http') < 0 && goodslist[gl].original_img.indexOf('https') < 0) {

                            goodslist[gl].original_img = that.data.url + goodslist[gl].original_img;
                        }
                    }

                    data[z]['goods_list'] = goodslist;
                }
                if (data[z]['block_type'] == '3') {
                    let goodslist = data[z]['nav'][0]['goods_list'];
                    for (let gl = 0; gl < goodslist.length; gl++) {
                        if (goodslist[gl].original_img.indexOf('http') < 0 && goodslist[gl].original_img.indexOf('https') < 0) {
                            goodslist[gl].original_img = that.data.url + goodslist[gl].original_img;
                        }
                    }
                    data[z]['list'] = goodslist;

                }


                block_model.push(data[z]);
                ids.push(data[z]['div_order'])
            }
            if (data[z]['block_type'] == '8') {
                search = data[z];

            }

            if (data[z]['block_type'] == '18') {
                shop = data[z];
            }

            if (data[z]['block_type'] == '16') {
                content = data[z];
            }

            if (data[z]['block_type'] == '11') {
                menu_model = data[z];
            }

            if (data[z]['block_type'] == '19') {
                for (let i = 0; i < data[z]['nav'].length; i++) {
                    if (data[z]['nav'][i]['type'] == 4) {
                        //radio_from = data[z]['nav'][i]['option_name'];
                        var len = data[z]['nav'][i]['option_name'].length;
                        var arrs = [];
                        for (let ii = 0; ii < len; ii++) {
                            let obj = { name: data[z]['nav'][i]['option_name'][ii], selected: -1 }
                            arrs.push(obj)
                        }
                        data[z]['nav'][i]['option_name'] = arrs
                    }

                    if (data[z]['nav'][i]['type'] == 5) {
                        //checked_from = data[z]['nav'][i]['option_name'];
                        var len = data[z]['nav'][i]['option_name'].length;
                        var arrs = [];
                        for (let ii = 0; ii < len; ii++) {
                            let obj = { name: data[z]['nav'][i]['option_name'][ii], selected: -1 }
                            arrs.push(obj)
                        }
                        data[z]['nav'][i]['option_name'] = arrs
                    }
                }
                that.initRegions();
            }
        }

        var array = [];
        if (ids.length > 0) {
            for (let y = 1; y <= ids.length; y++) {
                array.push(y);
            }
        }

        if (content != '') {
            WxParse.wxParse('content', 'html', content.content, that, 6);
        }

        if (skill != '' && skill.activity_type == 1) {
            that.setData({
                end_time: skill.end_time
            })
            that.destroyActivityTimer();
            that.data.timer = setInterval(function () {
                that.secondKill();
            }, 1000);

        }

        if (shop == '') {
            wx.getLocation({
                type: 'wgs84',
                altitude: true,
                success: function (res) {
                    that.getUserLatitudeLongitude(shop, res);
                },
                fail(e) {
                    // app.confirmBox('如需正常使用小程序门店自提点功能，请在【我的】页面中点击授权按钮，勾选用户信息并点击确定。');
                }
            })
        }
        block_model = that.returnModelArr(block_model, array);
        app.globalData.menu_model = menu_model.nav;
        that.setData({
            video: video,
            search: search,
            menu_model: menu_model.nav ? menu_model.nav : [],
            models: data,
            block_model: block_model
        });
    },
    /** 获取授权用户经纬度 */
    getUserLatitudeLongitude(result, res) {
        var that = this;
        //根据用户当前经纬度获取相应的附近门店
        request.post('/api/Index/shopList', {
            data: {
                lng: res.longitude,
                lat: res.latitude,
                province: '',
                search_radius: result.search_radius,
            },
            failRollback: true,
            successReload: true,
            success: function (res) {
                var ad = res.data.result.length > 0 ? false : true;
                that.setData({
                    shop_list: res.data.result,
                    ad: ad
                })
            }
        });
        //用户当前经纬度地址位置
        var BMap = new bmap.BMapWX({
            ak: that.data.ak,
        });
        var fail = function (data) {
        };
        var success = function (data) {
            var originalData = data.originalData;
            var search = that.data.search;
            search.currentCity = originalData.result.addressComponent.city,
            that.setData({
                address: originalData.result.formatted_address,
                // 获取当前城市
                search: search
            })
        }
        BMap.regeocoding({
            location: res.latitude + ',' + res.longitude, //22.622572 + ',' + 114.077780, // 22.71991 + ',' + 114.24779, 
            fail: fail,
            success: success,
        });
    },
    shop_page(e) {
        wx.navigateTo({ url: '/pages/cart/cart2/shopDetail/shopDetail?datas=' + JSON.stringify(e.currentTarget.dataset.item) });
    },
    /** 自定义模板秒杀接口时间数据 */
    secondKill: function () {
        // 获取当前时间
        let newTime = new Date().getTime();
        let countDownArr = null;
        // 对结束时间进行处理渲染到页面    
        let endTime = this.data.end_time * 1000;    //活动结束时间       
        let obj = null;
        // 如果活动未结束，对时间进行处理
        if (endTime - newTime > 0) {
            let time = (endTime - newTime) / 1000;
            // 获取天、时、分、秒
            let day = parseInt(time / (60 * 60 * 24));
            let hou = parseInt(time % (60 * 60 * 24) / 3600);
            let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
            let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
            obj = {
                day: this.timeFormat(day),
                hou: this.timeFormat(hou),
                min: this.timeFormat(min),
                sec: this.timeFormat(sec)
            }
        } else {//活动已结束，全部设置为'00'
            //if (time <= 0) {
            this.destroyActivityTimer();
            this.setData({ custom_skill_status: false })
            this.getAutoData(); //首页数据
            return;
            // }
        }
        countDownArr = obj;
        this.setData({ countDownList: countDownArr, custom_skill_status: true });
    },

    timeFormat(param) {//小于10的格式化函数
        return param < 10 ? '0' + param : param;
    },

    /** 领券 */
    getCoupon: function (e) {
        var that = this;
        var coupon_id = e.currentTarget.dataset.cid;
        request.post('/api/activity/get_coupon', {
            data: { coupon_id: coupon_id },
            success: function (res) {
                app.showSuccess(res.data.msg);
                for (var i in that.data.coupons) {
                    if (that.data.coupons[i].id == coupon_id) {
                        that.data.coupons.splice(i, 1);
                        that.setData({ coupons: that.data.coupons });
                        break;
                    }
                }
            }
        });
    },
    /** 跳转模式 自定义页面 || 自定义菜单 || 自定义控件控件*/
    topage: function (e) {
        //自定义控件控件
        var obj = e.currentTarget.dataset.obj ? e.currentTarget.dataset.obj : '';
        var url = e.currentTarget.dataset.url;
        var page_type = e.currentTarget.dataset.type;
        var id = e.currentTarget.dataset.id;
        if (obj == 'custom') {
            //底部自定义菜单
            var idx = e.currentTarget.dataset.idx;
            app.globalData.menu_index = idx;
            //  page_type = this.data.menu_model[this.data.menu_index].url_type
            page_type = this.data.menu_model[idx].url_type
            id = this.data.menu_model[idx].app_url
        }
        //判断跳转的类型  1 = 小程序页面，2 = 分类商品，3 = 商品详情 ，4 = 自定义页面 , 5 = 外部网址链接,
        if (page_type == 1) {
            if (obj == 'custom') {
                //要访问的页面idx，当前页面menu_index
                common.totabar(idx, this.data.menu_index, this.data.menu_model);
                
            } else {
                var url = common.meunCheck(e.currentTarget.dataset.url);
                wx.navigateTo({ url: url, });
            }

        } else if (page_type == 2) {
            wx.navigateTo({ url: '/pages/goods/goodsList/goodsList?cat_id=' + id });
        } else if (page_type == 3) {
            wx.navigateTo({ url: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + id });
        } else if (page_type == 5 || page_type == 0) {
            if (url == "") {
                return false;
            }
            this.setData({ webUrl: url ? url : id });
            wx.navigateTo({ url: '/pages/index/webview/webview' });
        } else {
            //自定义页面      
            if (obj == 'custom') {
                wx.reLaunch({
                    url: '../../index/customPage/customPage?id=' + this.data.menu_model[idx].app_url,
                })
            } else {
                wx.navigateTo({
                    url: '../../index/customPage/customPage?id=' + id + '&types=-1',
                })
            }

        }
        
    },
    /** 默认菜单 */
    topages: function (e) {
      // var idx = e.currentTarget.dataset.idx;
      var idx = e.detail.idx;
      var that = this
      if (idx == 2) {
          if (!wx.getStorageSync('app:userInfo')) {
            app.getUserInfo(function (userInfo) {
              that.setData({ userInfo: userInfo, click :false });
            }, true, false);
            return false;
        }
      }
    if (e.currentTarget.dataset.type && e.currentTarget.dataset.type == 'store') {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
      return
    }
        
        app.globalData.menu_index = idx;
        common.defaultTotabar(idx, 0);
    },

    //新闻详情
    goNewsDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        var link = e.currentTarget.dataset.link;
        var webUrl;
        if (link != '') {
            webUrl = link;
        } else {
            webUrl = "/api/news/news_detail?news_id=" + id;
        }
        this.setData({ webUrl: webUrl });
        wx.navigateTo({ url: '/pages/index/webview/webview' });
    },

    changeGoodsShow(e) {
        var index = e.currentTarget.dataset.index;
        var fid = e.currentTarget.dataset.fid;
        this.data.block_model[fid]['list'] = this.data.block_model[fid]['nav'][index]['goods_list']
        this.data.block_model[fid]['title_selected'] = index
        this.setData({ goods_show: index, goods_show_fid: fid, block_model: this.data.block_model });
    },

    returnModelArr: function (data, ids) {
        var arr = [];
        for (let i = 0; i < ids.length; i++) {
            for (let l = 0; l < data.length; l++) {
                if (ids[i] == data[l]['div_order']) {
                    arr.push(data[l]);
                }
            }
        }
        return arr;
    },
    tologin: function () {
        if (!app.auth.isAuth()) {
            app.showLoading(null, 1500);
            app.getUserInfo();
            this.data.infologin = true;
        }
    },
    checklogin: function () {
        this.setData({ iflogin: app.auth.hadAuth() })
    },
    bindTimeChange(e) {
        var that = this;
        let fid = e.currentTarget.dataset.fid;
        let idx = e.currentTarget.dataset.idx;
        let datas = that.data.block_model;
        datas[fid]['nav'][idx]['val'] = e.detail.value
        this.setData({ intelligence_date: e.detail.value, block_model: datas });
    },
    /** 初始化区域弹框相关 */
    initRegions: function (e) {
        var that = this;
        new Regions(this, 'regions', {
            endAreaLevelCall: function (parentId, regionName, address) {
                Object.assign(that.data.from_address, address);
                that.setData({
                    'from_address.province_name': that.data.from_address.province_name,
                    'from_address.city_name': that.data.from_address.city_name,
                    'from_address.district_name': that.data.from_address.district_name,
                    'from_address.twon_name': that.data.from_address.twon_name,
                });
            },
            setFromRegionsVal: function (selected, address) {
                let fid = selected.fid;
                let idx = selected.idx;
                let datas = that.data.block_model;

                datas[fid]['nav'][idx]['val'] = address.province_name + address.city_name + address.district_name + address.twon_name
                that.setData({ block_model: datas })
            }
        });
    },

    radioChange: function (e) {
        var that = this;
        let fid = e.currentTarget.dataset.fid;
        let idx = e.currentTarget.dataset.idx;
        let idxs = e.currentTarget.dataset.idxs;
        let datas = that.data.block_model;
        for (let i = 0; i < datas[fid]['nav'][idx]['option_name'].length; i++) {
            datas[fid]['nav'][idx]['option_name'][i]['selected'] = -1
            datas[fid]['nav'][idx]['val'] = ''
        }
        datas[fid]['nav'][idx]['option_name'][idxs]['selected'] = idxs
        datas[fid]['nav'][idx]['val'] = datas[fid]['nav'][idx]['option_name'][idxs]['name']
        that.setData({ block_model: datas })

    },
    checkboxChange: function (e) {
        var that = this;
        let fid = e.currentTarget.dataset.fid;
        let idx = e.currentTarget.dataset.idx;
        let idxs = e.currentTarget.dataset.idxs;
        let datas = that.data.block_model;

        if (datas[fid]['nav'][idx]['option_name'][idxs]['selected'] == idxs) {
            datas[fid]['nav'][idx]['option_name'][idxs]['selected'] = -1
        } else {
            datas[fid]['nav'][idx]['option_name'][idxs]['selected'] = idxs
        }
        let val = '';
        if (datas[fid]['nav'][idx]['option_name'].length > 0) {
            for (let i = 0; i < datas[fid]['nav'][idx]['option_name'].length; i++) {
                if (datas[fid]['nav'][idx]['option_name'][i]['selected'] >= 0) {
                    if (val) {
                        val += ',' + datas[fid]['nav'][idx]['option_name'][i]['name']
                    } else {
                        val += datas[fid]['nav'][idx]['option_name'][i]['name']
                    }
                }
            }
        }
        datas[fid]['nav'][idx]['val'] = val;
        that.setData({ block_model: datas })
    },
    checkFromType: function (e) {
        var that = this;
        let fid = e.currentTarget.dataset.fid;
        let idx = e.currentTarget.dataset.idx;
        let datas = that.data.block_model;
        datas[fid]['nav'][idx]['val'] = e.detail.value;
        that.setData({ block_model: datas })
    },
    fromSubmit: function (e) {

        var that = this;
        let datas = that.data.block_model;
        let fid = e.currentTarget.dataset.fid;
        var data = '';
        for (let j = 0; j < datas[fid]['nav'].length; j++) {
            if (datas[fid]['nav'][j]['required'] == 1 && !datas[fid]['nav'][j]['val'] && (datas[fid]['nav'][j]['type'] == 0 || datas[fid]['nav'][j]['type'] == 1)) {
                return app.showTextWarining("请填写" + datas[fid]['nav'][j]['title']);
            }

            if (datas[fid]['nav'][j]['type'] == 0 && datas[fid]['nav'][j]['verify_type'] == 1) {
                if (!app.validatemobile(datas[fid]['nav'][j]['val'])) {
                    return;
                }
            }

            if (datas[fid]['nav'][j]['type'] == 0 && datas[fid]['nav'][j]['verify_type'] == 2) {
                if (!common.checkEmail(datas[fid]['nav'][j]['val'])) {
                    return app.showTextWarining("请填写" + datas[fid]['nav'][j]['title'] + '正确的格式');
                }
            }

            if (datas[fid]['nav'][j]['required'] == 1 && !datas[fid]['nav'][j]['val'] && (datas[fid]['nav'][j]['type'] == 2 || datas[fid]['nav'][j]['type'] == 3 || datas[fid]['nav'][j]['type'] == 5 || datas[fid]['nav'][j]['type'] == 4)) {
                return app.showTextWarining("请选择" + datas[fid]['nav'][j]['title']);
            }
            let text = datas[fid]['nav'][j]['val'] ? datas[fid]['nav'][j]['val'] : '';
            data += '&name' + j + '=' + text
        }

        //验证之后清空数据
        for (let i = 0; i < datas[fid]['nav'].length; i++) {
            datas[fid]['nav'][i]['val'] = '';
            if (datas[fid]['nav'][i]['type'] == 4) {
                for (let y = 0; y < datas[fid]['nav'][i]['option_name'].length; y++) {
                    datas[fid]['nav'][i]['option_name'][y]['selected'] = -1;
                }
            }

            if (datas[fid]['nav'][i]['type'] == 5) {
                for (let u = 0; u < datas[fid]['nav'][i]['option_name'].length; u++) {
                    datas[fid]['nav'][i]['option_name'][u]['selected'] = -1;
                }
            }
        }

        var from_datas = '?timeid=' + datas[fid]['timeid'] + '&form_name=' + datas[fid]['form_name'] + data
        request.get('/Api/Index/save_form' + from_datas, {
            data: data,
            failRollback: true,
            success: function (res) {
                app.showTextWarining(datas[fid]['result'] || '提交成功', function () {
                    that.setData({
                        block_model: datas
                    })
                });
            }
        });
    },
    toDestine:function(){ // 针对进入拼包，做的单独判断
      var that = this
      if (!wx.getStorageSync('app:userInfo')) {
        app.getUserInfo(function (userInfo) {
          that.setData({ userInfo: userInfo, click :false });
        }, true, false);
        return false;
      }
      wx.navigateTo({
        // url: '/pages/subcontract/destine/destine',
        url: '/pages/subcontract/unPublicPage/unPublic',
      })

      // request.get(that.data.url + '/api/pinbao/getOrderCount',{
      //   success:function(res){
      //       if (res.data.status == 1 && res.data.result.is_check_user == 1) { // 管理员
      //         wx.navigateTo({
      //           url: '/pages/subcontract/destine/destine',
      //         })
      //         return
      //       } else if(app.globalData.userInfo.store_id > 0 && app.globalData.userInfo.is_B ==1 ) {
      //           // 大B
      //         wx.navigateTo({
      //           url: '/pages/subcontract/destine/destine',
      //         })
      //       } else {
      //           if (app.globalData.userInfo.store_id == 0 ) { //无店铺
      //             console.log(222)
      //             Dialog.confirm({
      //               message: '您还没有店铺，无法使用拼包功能。是否前往免费开店？',
      //               confirmButtonText: '免费开店',
      //               cancelButtonText: '再看看'
      //             }) 
      //               .then(() => {
      //                 wx.navigateTo({
      //                   url: '/pages/newjoin/join4/join4',
      //                 })
      //                 Dialog.close()
      //               })
      //               .catch(() => {
      //                 Dialog.close()
      //               });
      //               return
      //           }
      //           if (app.globalData.userInfo.store_id > 0 && app.globalData.userInfo.is_B !=1 ) { //大A
              
      //             wx.showModal({
      //               content: '您当前的身份为生产厂家， 目前该功能至针对采购商开放！',
      //               showCancel: false,
      //               success (res) {
      //                 if (res.confirm){}
      //               }
      //             })
          
      //             return
      //           }

      //       }
            
      //     }
      // })

    },
    hidetabbar() {  //隐藏默认tab
      wx.hideTabBar({
        fail: function() {
          setTimeout(function() { // 做了个延时重试一次，作为保底。
            wx.hideTabBar()
          }, 500)
        }
      });
    },
    closeGoodsTips:function(){
      this.setData({
        goodsTips: true
      })
    },

 /****************************** 自定义 end ********************************/

 chooseNav:function(e){
   var curNav = e.detail.index
   console.log(curNav)
   this.setData({
     listType: curNav - 0 + 1
   })

   this.data.sc ? this.getListGoods(curNav - 0 + 1,1,'a') : this.getListGoods(curNav - 0 + 1,1,'s')
  //  this.getListGoods(curNav - 0 + 1,this.data.listP,'a')
 },
 resetListGoods:function(cb){
   this.setData({
     listP: 1,
     listGoods: [],
   })
 },
 getListGoods:function(type,p,scroll){
   this.setData({
    loadingShow: true,
   })
   var that = this
  request.get( that.data.url + '/api/Activity/recommendGoods', {
    data: {
      type: type, 
      page: p
    },
    success:function(res) {
      that.setData({  
      loadingShow: false,
      })
      if (res.data.status == 1) {
        if (scroll == 'a') {
          that.resetListGoods()
          that.setData({
            listGoods: that.data.listGoods.concat(res.data.result)
          })
          wx.pageScrollTo({
            scrollTop: 1950,
            duration: 100
          })
          return
         } else if(scroll == 's') {
          that.resetListGoods()
          that.setData({
            listGoods: that.data.listGoods.concat(res.data.result)
          })
          return
         }
        that.setData({
          listGoods: that.data.listGoods.concat(res.data.result)
        })
       
      }
    }
  } )
 },
 listGoodsToDetail:function(e){
   var that = this
    if (that.data.listType == 1) {
      request.post( that.data.url + '/api/Activity/addClickCount',{
        data:{
          goods_id: e.currentTarget.dataset.id
        },
        success:function(){}
      } )
    }
    wx.navigateTo({
      url: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + e.currentTarget.dataset.id,
    })
 },
 listGoodsToStore:function(e){
  var that = this
  if (that.data.listType == 1) {
    request.post( that.data.url + '/api/Activity/addClickCount',{
      data:{
        goods_id: e.currentTarget.dataset.goods_id
      },
      success:function(){}
    } )
  }
   wx.navigateTo({
     url: '/pages/store/index/index?store_id=' + e.currentTarget.dataset.store_id,
   })
 },
   /** 返回顶部 */
   doScrollTop: function() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  onPageScroll:function(res){
    // console.log(res)
    if (res.scrollTop > 1930) {
      this.setData({
        sc: true
      })
    } else {
      this.setData({
        sc: false
      })
    }
  },
});