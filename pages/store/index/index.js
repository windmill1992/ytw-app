var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var common = require('../../../utils/common.js');
import LoadMore from '../../../utils/LoadMore.js'
var load = new LoadMore;
import Dialog from '../../../dist/dialog/dialog';
Page({ 
    data: {
        url: setting.url,
        userInfo: null,
        resourceUrl: setting.resourceUrl,
        store: {store_id: 0}, //请求的店铺信息
        requestData: [], //请求的数据
        requestUrl: '', //请求的链接
        searchWord: '', //搜索词
        mode1: '',
        currentPage: 1,
        storeId:0,        //店铺id
        flag:0,      //展示方式
        tabType:0,   //默认，销量，价格切换
        actionSheetHidden: true,
        actionSheetHidden: true,
        hasFocusStore: false,//是否收藏过
        telShow: false,//非ios拨打电话的开关
        shareTogether: false,
        shareTogether2: false,//是否展示大B二次确认
        share_btn: false,
        share_pic: '',//``
        isiphoneX: wx.getStorageSync('isiphoneX')||false,
        current: 'one',
        p: 1,//当前page
        sort: 'comprehensive',//默认销量
        mode: 'asc',//默认正序
        goods_type: 1,//默认全部商品
        list: [],//存放数据
        tipsmask: true,//提示信息
        shareTxt: '分享到朋友圈',
        tips2: true,//记录是否是分享进来
        pastSum: 1,
        showLine: false,//是否显示底线
    },

    onLoad: function (options) {
      wx.hideShareMenu()
      var userInfo = wx.getStorageSync('app:userInfo');
        let that = this;
        that.setData({
            storeId:options.store_id,
            mode1:options.mode||'',
            userInfo: userInfo
        })
        load.init(this, 'goods_list', 'list');  //初始化商品列表
        // that.requestStoreGoods(that.getDefaultUrl());
        console.log(options)
        if (options.scene) {
          
          var scene = decodeURIComponent(options.scene)
          var data = scene.split('&');
          console.log(data)
          options.store_id = data[0].split('=')[1];
          wx.setStorageSync('scene_store_id', data[0].split('=')[1])
          that.setData({
            storeId:options.store_id,
        })
        }
        
        that.getGoods(that.data.sort,that.data.mode,that.data.goods_type,1)

        if (!wx.getStorageSync('maskSum4') ) { 
          wx.setStorageSync('maskSum4', 7)
          this.setData({
              tipsmask: false
          })
      } else {
        if(wx.getStorageSync('maskSum4') == 1) {
              this.setData({
                  tipsmask: true
              })
          } else {
            this.setData({
              tipsmask: false,
              pastSum: 6 - wx.getStorageSync('maskSum4') + 2
          })
          }
      }
    },
    onShow:function(){ //如果是自己的店铺 重定向到 我的小店
      this.setData({
        userInfo: wx.getStorageSync('app:userInfo')
      })
      this.requestStore(this.data.storeId);
    },
    // 橱窗，列表式切换
    tab:function(){
        this.setData({
            flag : !this.data.flag,
        })    
    },
    /** 请求店家信息 */
    requestStore: function(storeId) {
        var that = this;
        request.get('/api/store/index', {
            failRollBack: true,
            data: { store_id: storeId },
            success: function (res) {
                that.setData({ store: res.data.result });
                if (res.data.status == 1) {
                  if (wx.getStorageSync('app:userInfo').store_id == res.data.result.store_id) {
                    wx.redirectTo({
                      url: '/pages/distribut0/shop/shop',
                    })
                  }
                }
            }
        });
    },

    /** 关注店铺 */
    focusStore: function () {
        var that = this;
        request.post('/api/store/collectStoreOrNo', {
            data: { store_id: that.data.store.store_id },
            success: function () {
                if (!that.data.store.is_collect) {
                    app.showSuccess('关注成功');
                }
                var num = that.data.store.store_collect;
                that.setData({ 
                    'store.is_collect': !that.data.store.is_collect,
                    'store.store_collect': !that.data.store.is_collect ? (num + 1) : (num - 1)
                });
            }
        });
    },
    // 获取默认url
    getDefaultUrl: function () {
        var baseUrl = '/api/store/storeGoods'; //基地址
        return baseUrl + '?store_id=' + this.data.storeId;
    },
    // 默认，销售，价格切换
    changeTab: function (e) {
        // this.resetData();
        // this.requestStoreGoods(e.currentTarget.dataset.href);
        // var tabType=e.currentTarget.dataset.type;
        // this.setData({
        //     tabType: tabType,
        // })

    },
    // 请求店铺商品
    requestStoreGoods: function (requestUrl) {
        var that = this;
        that.data.requestUrl = requestUrl;
        requestUrl += (requestUrl.indexOf('?') > 0 ? '&' : '?') + 'p=' + that.data.currentPage;
        requestUrl += '&q=' + that.data.searchWord;
        requestUrl += (typeof that.data.mode != 'undefined' ? '&sta=' + that.data.mode : '');
        load.request(requestUrl, function (res) {
            that.data.currentPage++;
            console.log(res)
            wx.stopPullDownRefresh();
        });
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
        this.data.mode = '';
        // this.resetData();
        this.setData({
          list: [],
          p: 1
        })
        this.requestStoreGoods(this.getDefaultUrl());
    },
    // 搜索
    searchGoods: function () {
        // alert('点击了搜索按钮');
        this.data.mode = '';
        this.resetData();
        this.requestStoreGoods(this.getDefaultUrl());
    },
    // 页面上拉触底事件
    onReachBottom: function () {
        // if (load.canloadMore()) {
        //     this.requestStoreGoods(this.data.requestUrl);
        // }
        this.setData({
          p: this.data.p - 0 + 1
        })
        this.getGoods(this.data.sort,this.data.mode,this.data.goods_type,this.data.p )
        
    },
    // 下拉刷新
    onPullDownRefresh: function () {
        // this.resetData();
        // this.requestStoreGoods(this.data.requestUrl);

        
    },
    guanzhuStore:function(){
      app.getUserInfo(function (userInfo) {
          that.setData({ userInfo: userInfo });
      }, true, false);
      if (!this.data.userInfo) {
        return
      }
      var that = this;
      var store = that.data.store
      request.post('/api/store/collectStoreOrNo', {
          data: { store_id: store.store_id },
          success: function () {
              if (!store.is_collect) {
                  app.showSuccess('关注成功');
              }
              var num = store.store_collect;
              store.is_collect = !store.is_collect;
              store.store_collect = store.is_collect ? (num + 1) : (num - 1);
              that.setData({ store: store });
          }
      });
    },
     /** 联系客服 */
  onTelClose:function(){
    this.setData({
      telShow: false
    })
  },
  callOtherTel:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.store.store_phone,
    })
  },
  contactService: function() {
    // app.confirmBox('请联系客服：' + this.data.data.store.store_phone);
  },
  contactTel:function(){//展示商家电话号码
    if (this.data.store.store_phone != 0) {
      if (wx.getStorageSync('telsystem').indexOf('iOS') != -1 ) { //是苹果手机时候 ios
        wx.makePhoneCall({
          phoneNumber: this.data.store.store_phone,
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
    collectStore: function() {
        var that = this;
        request.post('/api/goods/collectGoodsOrNo', {
          data: {
            goods_id: that.data.data.goods.goods_id
          },
            isShowLoading: false,
          success: function(res) {
            that.setData({
              'data.goods.is_collect': !that.data.data.goods.is_collect
            });
          }
        });
      },
      closeShare:function(){
        this.setData({
            showShareButton: false
        })
      },
    catchShare:function(){//分享按钮
      var that = this
      app.getUserInfo(function (userInfo) {
          that.setData({ userInfo: userInfo });
      }, true, false);

      if (this.data.userInfo) {
          this.setData({
            actionSheetHidden: false
        })
      }
      },
    listenerActionSheet:function(){
      this.setData({
        actionSheetHidden: true
      })
    },
    //同行的分享
    shareTogether:function(){
      var that = this
      var store_id = this.data.userInfo.store_id || 0
      var is_B = this.data.userInfo.is_B || 0
      if (!this.data.userInfo) {//未登录
        wx.showToast({
          title: '您还没有登录，无法分享',
        })
      } else { //已登录
        if (store_id == 0) {
          that.setData({
            actionSheetHidden: true
          })
          Dialog.confirm({
            message: '您还没有店铺，无法使用享功能。是否前往免费开店？',
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
        } else if(is_B == 1) {//大B
   
          wx.showModal({
            title: '提示',
            content: '本次分享，对方将知晓壹童网信息，是否继续',
            messageAlign: 'left',
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
    shareTogetherClose:function(){
      this.setData({
        shareTogether: false
      })
    },
    getSharePic: function(e) { //分享海报朋友圈
      var type = e.currentTarget.dataset.type || 0
      var store_id = this.data.userInfo.store_id || 0
      var is_B = this.data.userInfo.is_B || 0
      var that = this
      if (store_id == 0) { // 或普通会员
        this.setData({
          actionSheetHidden: true
        })
        Dialog.confirm({
          message: '您还没有店铺，无法使用享功能。是否前往免费开店？',
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
      if (store_id != 0 && is_B == 0) { // 大A 
        if (type == 3) { //分享下级 没有这种操作 驳回
          return
        }
        store_id = this.data.store.store_id //普通分享  改店铺id为当前店铺
        this.haibao(store_id,type)
      }
      if (store_id != 0 && is_B == 1) { // 大B 下级分享
        this.setData({
          shareTxt: '为保护您的商业机密，请保存海报后，通过微信发送给下级'
        })
        // 最终生成的是大B自己的store_id码
        if (type == 3) { //大B普通分享
          wx.showModal({
            title: '提示',
            content: '本次分享，对方将知晓壹童网信息，是否继续',
            cancelText: '返回',
            messageAlign: 'left',
            confirmText: '继续',
            success (res) {
              if (res.confirm) {
                that.setData({
                  shareTogether2: true
                })
              } else if (res.cancel) {
                console.log('啥也不用干1')
              }
            }
          })
          return
        }
        this.haibao(store_id,type)
      }
      var that = this
      
      that.setData({
        actionSheetHidden: !this.data.actionSheetHidden
      })
      
  
      // var item_id = (that.data.data.spec_goods_price.length) > 0 ? that.data.data.spec_goods_price[that.data.specSelect].item_id : 0
  

    },
    // 生成海报
    haibao:function(store_id,type){
      var that = this
      var type = type || 0
      console.log(store_id,type)
      // return
      // isStoreSharePoster
      // store_id  type （3分享给下级）

      request.get( that.data.url + '/api/Goods/isStoreSharePoster',{
        data:{
          store_id: that.data.store.store_id,
          type: type
        }, 
        success: function(res2){
          if (res2.data.status == 1) {
            wx.showLoading({
              title: '正在生成',
              mask: true,
            })
            wx.getImageInfo({
              src: that.data.url + '/api/goods/storeSharePoster?store_id='+ store_id + '&type=' + type + '&token=' + wx.getStorageSync('app:userInfo').token,
                isShowLoading: false,
              success: function(res) {
                console.log(res)
                that.setData({
                  share_btn: true,
                  share_pic: res.path,
                  actionSheetHidden: true
                })
              },
              complete: function(res) {
                console.log(res)
                wx.hideLoading()
              }
            })
          }
        }
      } )



    },
    haibaoB:function(){ //大B二次确认海报
      this.shareTogetherClose2()
      this.haibao(this.data.userInfo.store_id,3)
    },
    // 关闭二次弹窗
    shareTogetherClose2:function(){
      this.setData({
        shareTogether2: false
      })
    },
    // 关闭海报
    closeShareModal: function() {
      this.setData({
        share_btn: false
      })
  
    },
    // 展示海报
    previewSharePic: function() {
      wx.previewImage({
        urls: [this.data.share_pic],
      })
    },
    // 保存海报
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
      /** 关闭优惠信息弹窗 */
  closePromModal: function() {
    this.setData({
      openPromModal: false
    });
  },
  toGoodsInfo:function(e){ //点击前往商品详情
    var sell = e.currentTarget.dataset.sell
    
    if (sell == 0) { //未公开
      if (this.data.store.store_member_status == 1) { //是VIP
        var url = e.currentTarget.dataset.url
        wx.navigateTo({
          url: url,
        })
        return
      } 
      var that = this
      if (!wx.getStorageSync('wx_user_info')) {
        app.getUserInfo(function (userInfo) {
          that.setData({ userInfo: userInfo, click :false });
        }, true, false);
        return false;
    }
      var txt = that.data.store.store_member_status == -1 ? '立即申请' : '好的' //判断有没有曾经申请过
     return wx.showModal({
        title: '提示',
        content: '该厂家设置了私密商品权限，只有申请成为该店的VIP客户才能查看私密商品。',
        showCancel: that.data.store.store_member_status == -1 ? true : false,
        confirmText: txt,
        success (res) {
          if (res.confirm) {
            if (that.data.store.store_member_status == -1) {
              that.toBeMember()
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    } else {
      var url = e.currentTarget.dataset.url
      wx.navigateTo({
        url: url,
      })
    }
    
  },
  showModal1:function(){
    var that = this
    if (!wx.getStorageSync('wx_user_info')) {
      app.getUserInfo(function (userInfo) {
        that.setData({ userInfo: userInfo, click :false });
      }, true, false);
      return false;
  }
    if (!wx.getStorageSync('wx_user_info')) {
      app.getUserInfo(function (userInfo) {
        that.setData({ userInfo: userInfo, click :false });
      }, true, false);
      return false;
  }
    wx.showModal({
      title: '提示',
      content: '该厂家设置了私密商品权限，只有申请成为该店的VIP客户才能查看私密商品。',
      showCancel: true,
      confirmText: '立即申请',
      success (res) {
        if (res.confirm) {
          if (that.data.store.store_member_status == -1) {
            that.toBeMember()
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  changeTab1:function(e){//顶部切换
    var cur = e.currentTarget.dataset.cur
    var goods_type = 'all'
    if (cur == 'one') {
      goods_type = '1' 
    } else if (cur == 'three') {
      goods_type = 0
    }

    this.setData({
      list: [],
      current: cur
    })
   this.resetData('comprehensive','asc',goods_type)
  },
  changeTab2:function(e){//排序切换
    var sort = e.currentTarget.dataset.sort
    var mode ='asc'
    if (sort == 'price') {
      mode = this.data.mode == 'asc' ? 'desc' : 'asc'
    }
    this.resetData(sort,mode,this.data.goods_type,1)
  },
  resetData:function(sort,mode,goods_type){//重新设置数据
    this.setData({
      sort: sort,
      mode: mode,
      goods_type: goods_type,
      p: 1,
      list: []
    })
    this.getGoods(sort,mode,goods_type,1)
  },

getGoods:function(sort,mode,goods_type,p){// 请求数据  后修正 前面的要删掉不要了
  var that = this
  that.setData({
    showLine: false
  })
  request.get( that.data.url + '/api/store/storeGoods/sort/' + sort + '/mode/' + mode + '/goods_type/' + goods_type,{
    data:{
      p: p,
      store_id: that.data.storeId
    },
    success:function(res){
      
      if (res.data.status == 1) {
        that.setData({
          list: that.data.list.concat(res.data.result.goods_list)
        },function(){
          that.setData({
            showLine: true
          })
        })
      }
      if (res.data.result.length == 0) {
        wx.showToast({
          title: '已加载完商家全部商品',
          icon: 'none',
        })
      }
    }
  } )
},
toBeMember:function(){//申请成为VIP
  var that = this
  request.post( that.data.url + '/api/Store/applyStoreMember',{
    data:{
      store_id: that.data.store.store_id
    },
    success:function(res){
      if (res.data.status == 1) {
        if (res.data.msg == '申请成功') {
          that.requestStore(that.data.store.store_id)
          wx.showModal({
            title: '提示',
            content: '申请已提交，商家审核中，如需加急处理，请点击右下角，联系客服，加急处理!',
            showCancel:false,
            success (res) {
              if (res.confirm) {
              }
            } 
          })
        }
      } else if (res.data.msg == '请先登录') {
        wx.navigateTo({
          url: '/pages/user/get_user_info/get_user_info',
        })
      }
    }
  } )
},
closeMask: function(){//关闭提示
  
  this.setData({
      tipsmask: true
  })
  if (wx.getStorageSync('maskSum4')) {//判断本地有无数量设置过
      var maskSum = wx.getStorageSync('maskSum4') - 1
      wx.setStorageSync('maskSum4', maskSum)
  } else {
      wx.setStorageSync('maskSum4', 5)
  }


},
closeMask1:function(){
  this.setData({
    tips2: false
  })
}, 
onShareAppMessage:function(){
  this.setData({
    shareTogether2: false,
    actionSheetHidden: true
  })
},
});