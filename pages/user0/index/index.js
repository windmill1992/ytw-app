var app = getApp();
var setting = app.globalData.setting;
var common = require('../../../utils/common.js');
var request = require('../../../utils/request.js');
import Dialog from '../../../dist/dialog/dialog';
Page({
    data: {
      is_apply: 0,
      url: setting.url,
      resourceUrl: setting.resourceUrl,
      defaultAvatar: "https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/user68.jpg",
      logo: setting.appLogo,
      name: setting.appName,
      userInfo: {
          collect_count: 0,
          message_count: 0,
          waitPay: 0,
          waitSend: 0,
          waitReceive: 0,
          uncomment_count: 0,
          return_count: 0,
          user_money: 0,
          coupon_count: 0,
          pay_points: 0
      },
      webUrl: '',
      userInfoList:{
        manageList:[],
        a:1,
        click:false, //避免多次发出请求造成token的覆盖
        defaultMenu: false,  //默认底部菜单显示状态
        distribut: 0,
        sign: 0,
      },
      showModal:false,
      showModal_1:false,
      countDownNum: '60', //倒计时初始值
      is_send:false,
      is_store_member: false,
      isiphoneX: wx.getStorageSync('isiphoneX')||false,
      oneIn: true,
    },
/** 新手必看 */
    distributSee: function () {
      // this.setData({ webUrl: "/api/Article/agreement?doc_code=create_circle" });
      this.setData({ webUrl: "/api/distribut/must_see" });
        wx.navigateTo({ url: '/pages/index/webview/webview' });
    },
    toVip:function(){
      wx.navigateTo({ url: '/pages/distribut0/vipList/vipList' });
    },
    //自定义必备功能
    getMenu: function () {
      var that = this;
      request.get('/api/index/getMenu', {
        successReload: true,
        success: function (res) {
          if (res.data.status == 1) {
            res.data.menu.forEach(function (ele, index) {
              var url2 = ele.img_src;
              if (!url2 || url2.indexOf('http') == 0) {
                url2;
              } else {
                res.data.menu[index].img_src = setting.url + url2;
              }
            })
            // console.log(res.data.menu)
            var userInfoList = 'userInfoList.manageList';
            that.setData({
              [userInfoList]: res.data.menu,
            })
          }
        },
      })
    },

    onShow: function() {
      var is_store_member  = wx.getStorageSync('app:userInfo').is_store_member || 0
      if (is_store_member > 0) {
        this.setData({
          is_store_member: true
        })
      }
        var that = this;
        that.data.click = false;
        // this.hidetabbar();
        //遍历自定义底部，该页面在哪个位置
        for (var i in app.globalData.menu_model) {
            if (app.globalData.menu_model[i].app_url.indexOf('User/index') != -1) {
                app.globalData.menu_index = i;
            }
        }
        //预加载
        that.setData({
            defaultMenu: app.globalData.defaultMenu,
            menu_index: app.globalData.menu_index,
            menu_model: app.globalData.menu_model,
        })
    
        var status = false;
        //先预设值，加速加载
        if (app.globalData.userInfo) {
            that.setData({ userInfo: app.globalData.userInfo });
            status = true;
        }
        // if (!app.auth.isAuth()) {
        //     app.showLoading(null, 1500);
        // }

        if (that.data.oneIn && !wx.getStorageSync('app:userInfo')) {//  避免原先的请求响应拦截不停跳转登录页面  后面优化拦截问题
          that.setData({
            oneIn: false
          })
            app.getUserInfo(function (userInfo) {
                that.setData({ userInfo: userInfo });
            }, true, false);
        }
        if (wx.getStorageSync('app:userInfo')) {  // 登录过的 每次进入我的  都刷新用户信息
          app.getUserInfo(function (userInfo) {
              that.setData({ userInfo: userInfo });
          }, true, false);
        }
        // app.getUserInfo(function (userInfo) {
        //         that.setData({ userInfo: userInfo });
        //     }, true, false);


      // this.mini_status();
     
    },
    onLoad:function(){
      // this.getAutoData(); 
      this.setData({
        is_apply: app.globalData.is_apply
      })
        var that = this;
        that.getMenu();  //自定义必备功能
        if (app.globalData.menu_model.length == 0 || !app.globalData.menu_model){
            request.get('/api/Index/getConfig', {
                failRollback: true,
                successReload: true,
                success: function (res) {
                  // console.log(res)
                    var data = res.data.result.config;
                  app.globalData.config = data;
                    var is_block = common.getConfigByName(data, 'is_block_index');

                    if (is_block == 0) {
                        that.setData({ defaultMenu: true });
                        app.globalData.defaultMenu = true;
                    } else {
                        that.getAutoData(); 
                    }
                }
            });
        }
        
    },
    getAutoData: function (id) {
        var that = this;
        var url = !id ? '/api/Index/block_index' : '/api/Index/block_index/id/' + id
        request.get(url, {
            failRollback: true,
            successReload: true,
            success: function (res) {
              // console.log(res)
                if (res.data.status == 1) {
                    wx.setStorageSync('custom_data', res.data.result.blocks)
                    that.customRendering(res.data.result.blocks)
                }
            }
        });
    },
    /** 自定义组件渲染 */
    customRendering: function (custom) {
        var that = this;
        var data = custom;
        var menu_model = [];                    //菜单集合
        for (let z = 0; z < data.length; z++) {
            if (data[z]['block_type'] == '11') {
                menu_model = data[z];
            }
        }
        app.globalData.menu_model = menu_model.nav;
        for (var i in app.globalData.menu_model) {
            if (app.globalData.menu_model[i].app_url.indexOf('User/index') != -1) {
                app.globalData.menu_index = i;
            }
        }

        that.setData({
            defaultMenu: app.globalData.defaultMenu,
            menu_index: app.globalData.menu_index,
            menu_model: app.globalData.menu_model,
        })
    },
    // mini_status:function(){
    //   var that = this;
    //   //获取是不是在审核隐藏一些功能
    //   request.get(that.data.url + '/api/app/mini_app', {
    //     success: function (res) {
    //       var unset_arr = ['分销中心', '免费开店'];//需要隐藏的功能
    //       if (res.data.result.status == 1) {
    //         var manageList = Array();
    //         for (var k in that.data.userInfoList['manageList']) {
    //           if (unset_arr.indexOf(that.data.userInfoList['manageList'][k]['des']) < 0) {
    //             manageList.push(that.data.userInfoList['manageList'][k]);
    //           }
    //         }
    //         var userInfoList = that.data.userInfoList;
    //         userInfoList['manageList'] = manageList;
    //         that.setData({ 
    //           userInfoList: userInfoList,
    //           is_apply: res.data.result.status
    //         });
    //       }

    //     }
    //   });
    // },
    /** 首次登陆小程序，授权用户信息 */
    login: function () {
        var that = this;
        if(that.data.click) return false;
        that.data.click = true;
        if (!that.data.userInfo.user_id) {
            app.getUserInfo(function (userInfo) {
                that.setData({ userInfo: userInfo });
            }, true, false);
        }
    },
    toAccount_b:function(e){
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }, 
    clickMenu(e) {
      var that = this
      if (!wx.getStorageSync('app:userInfo')) {
        app.getUserInfo(function (userInfo) {
          that.setData({ userInfo: userInfo, click :false });
        }, true, false);
        return false;
    }
      
      if (e.currentTarget.dataset.url == '') {
        return
      }
      if ( e.currentTarget.dataset.url == '/pages/distribut0/shop/shop' ) {
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        })
        return
      }
        if(that.data.click) return false;
        that.data.click = true;
        //在个人中心浏览其他入口页面前判断是否登录
        // if (!that.data.userInfo.user_id) {
        //     app.getUserInfo(function (userInfo) {
        //       that.setData({ userInfo: userInfo, click :false });
        //     }, true, false);
        //     return false;
        // }
        // console.log(e.currentTarget.dataset.url )
        wx.navigateTo({ url: e.currentTarget.dataset.url });
    },
    onPullDownRefresh: function (e) {
        var that = this;
        app.getUserInfo(function (userInfo) {
            that.setData({ userInfo: userInfo });
            wx.stopPullDownRefresh();
        }, true);
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
    /** 默认菜单 */
    topages: function (e) {
      // var idx = e.currentTarget.dataset.idx;
      var idx = e.detail.idx;
      if (idx == 2) {
        if (!wx.getStorageSync('wx_user_info')) {
          app.getUserInfo(function (userInfo) {
            that.setData({ userInfo: userInfo, click :false });
          }, true, false);
          return false;
      }
      }
        
        app.globalData.menu_index = idx;
        common.defaultTotabar(idx, 4);
    },

    authorization: function () {
        //再授权
        wx.openSetting({
            success: (res) => {
                //因为openSetting会返回用户当前设置
                if (res.authSetting["scope.userInfo"] === true) {
                    var that = this
                    app.getUserInfo(function (userInfo) {
                        //更新数据
                        that.setData({
                            userInfo: userInfo,
                        })
                    })
                }
                else {
                    wx.showModal({
                        title: '用户未授权',
                        content: '如需正常使用小程序，请点击授权按钮。',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            }
                        }
                    })
                }
            }
        })
    },
    usePhone:function(){
      this.setData({
        showModal: false,
        showModal_1: true
      })
    },
    countDown: function () {
      let that = this;
      that.setData({
        is_send:true
      })
      let countDownNum = that.data.countDownNum;
      that.setData({
        timer: setInterval(function () {
          if (countDownNum == 0) {
            clearInterval(that.data.timer);
            that.setData({
              is_send: false,
              countDownNum: 60
            });
            return;
          } else {
            countDownNum--;
            that.setData({
              countDownNum: countDownNum
            })
          }
        }, 1000)
      })
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
    toDestine:function(){ // 针对进入拼包，做的单独判断
      var that = this
      // console.log(app.globalData)
      if (!wx.getStorageSync('wx_user_info')) {
        app.getUserInfo(function (userInfo) {
          that.setData({ userInfo: userInfo, click :false });
        }, true, false);
        return false;
      }

      wx.navigateTo({
        url: '/pages/subcontract/destine/destine',
        url: '/pages/subcontract/unPublicPage/unPublic',
      })
      return
      request.get(that.data.url + '/api/pinbao/getOrderCount',{
        success:function(res){
            if (res.data.status == 1 && res.data.result.is_check_user == 1) { // 管理员
              wx.navigateTo({
                url: '/pages/subcontract/destine/destine',
              })
              return
            } else if(app.globalData.userInfo.store_id > 0 && app.globalData.userInfo.is_B ==1 ) {
                // 大B
              wx.navigateTo({
                url: '/pages/subcontract/destine/destine',
              })
            } else {
                if (app.globalData.userInfo.store_id == 0 ) { //无店铺
                  Dialog.confirm({
                    message: '您还没有店铺，无法使用拼包功能。是否前往免费开店？',
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
                if (app.globalData.userInfo.store_id > 0 && app.globalData.userInfo.is_B !=1 ) { //大A
              
                  wx.showModal({
                    content: '您当前的身份为生产厂家， 目前该功能至针对采购商开放！',
                    showCancel: false,
                    success (res) {
                      if (res.confirm){}
                    }
                  })
          
                  return
                }

            }
            
          }
      })

    },
    navigateToUrl:function(e){
      if (!wx.getStorageSync('app:userInfo')) {
        app.getUserInfo(function (userInfo) {
          that.setData({ userInfo: userInfo, click :false });
        }, true, false);
        return false;
    }
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })

    },

})