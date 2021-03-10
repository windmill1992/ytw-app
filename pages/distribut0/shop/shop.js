//index.js
var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var common = require('../../../utils/common.js');
var util = require('../../../utils/util.js');
var { operaList } = require('../../../utils/util2.js');

import LoadMore from '../../../utils/LoadMore.js'
import Dialog from '../../../dist/dialog/dialog';
var load = new LoadMore;
function returnNotFx (t) {
  return [
    {
      img:setting.url + '/public/static/images/minniapp/operation-edit.png',
      title: '编辑',
      info: '可以修改商品的所有信息',
      index: 0
    },
    {
      img:setting.url + '/public/static/images/minniapp/operation-num.png',
      title: '改库存',
      info: '增减库存或下架某个颜色',
      index: 1
    },
    {
      img:setting.url + '/public/static/images/minniapp/operation-copy.png',
      title: '复制',
      info: '相似商品复制模板，更换主图，快速上款',
      index: 2
    },
    t
    ,
    {
      img:setting.url + '/public/static/images/minniapp/opera-del.png',
      title: '删除',
      info: '请谨慎操作，删除后将无法找回',
      index: 4
    },
    {
      img:setting.url + '/public/static/images/minniapp/operation-share.png',
      title: '分享',
      info: '让更多的人知道您的商品',
      index: 5
    },
  ]
}
Page({
  data: {
    shouldOperationsShow: false,
    shouldProposalShow: false,
    operaList: operaList,
    page: 4,   
    currentPage: 1,
    list: null,
    url: setting.url,
    userInfo:null,
    store:null,
    store_id: 0,
    goods: null,  //待上架商品
    total_goods_num: 0,//商品总数
    store_img: 'https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/shopbanner.jpg',//默认的店铺背景图片
    type: '1',//当前浏览的商品类型
    p0: 1,
    p1: 1,
    p2: 1,//每个类目分页
    p3: 1,//每个类目分页
    p4: 1,//每个类目分页
    actionSheetHidden: true,//控制分享的展示与否
    actionSheetHidden2: true,//控制分享的展示与否
    shareTogether2: false,//是否展示大B二次确认
    share_btn: false,
    share_pic: '',
    shareTogether: false,
    isiphoneX: wx.getStorageSync('isiphoneX') || false,
    is_first: true,//默认是第一次进来
    shouldShareStore: true,//默认可以分享店铺
    shareTxt: '分享到朋友圈',//默认分享到朋友圈
    tipsmask: true,
    pastSum: 1,
    firstLoad: true,
    fx: true,
    beClose: false,//默认店铺没有被关闭
    showDelGoods: false,
    curId: 0,//要操作的商品id存储
    exclusive_B: false,//针对大B 额外的提示
    operationItems:[//操作的选项
    ],
    showOperationMask:false,//是否显示操作选项
    isFxGoods: false,
    shareType: '',//分享的类型  店铺  商品
    goodsTit: '',//点击被分享操作的商品名字
    shareImg: '',//分享的图片
    isProposalDone: false,
    proposalData: {
      img: [],
      proposalArea: ''
    },
  },
    onLoad: function (options) { 
        // this.requestGoodsList();
        if (!wx.getStorageSync('maskSum9') ) { 
          wx.setStorageSync('maskSum9', 7)
          this.setData({
              tipsmask: false
          })
      } else {
        if(wx.getStorageSync('maskSum9') == 1) {
            this.setData({
                tipsmask: true
            })
        } else {
          this.setData({
            tipsmask: false,
            pastSum: 6 - wx.getStorageSync('maskSum9') + 2
          })
        }
      }
    },
       // 请求待上架商品
    requestGoodsList: function (e) {
        var that = this;
        request.get('/api/Distribut/goods_list', {
            success: function (res) {
                var res = res.data.result;
                if (that.data.firstLoad && res.data.result.length == 0 ) {
                  that.setData({
                    fx: false
                })
                }
                that.setData({
                    firstLoad: false,
                    goods: res
                })
            }
        });
    },
    onShow:function(){
        var that = this;
        var userInfo = wx.getStorageSync('app:userInfo');
        // if (userInfo) {
        //     userInfo.head_pic = common.getFullUrl(userInfo.head_pic);
        // }
        that.setData({ userInfo: userInfo });
        load.init(this, '', 'list');
        that.resetData();
        that.getGoodsList();
        that.getStore();
    },
    getStore:function(){//获取店铺基本信息
        var that = this;
        request.post('/api/Distribut/get_store', {
            successReload: true,
            success: function (res) {
                if (res.data.result){
                    that.setData({ 
                        store: res.data.result,
                        total_goods_num: res.data.result.total_goods_num,
                        beClose: res.data.result.store_state,
                    })
                    if (res.data.result.store_img) {
                        that.setData({
                            store_img: res.data.result.store_img
                        })
                    }
                }                
            }
        });
    },
    getGoodsList: function () {//请求店铺商品
        var that = this;
        var type = that.data.type
        var p = 1
        switch (type) {
            case '0':
            p = that.data.p0
                break;
            case '1':
                p = that.data.p1
                break;
            case '2':
                p = that.data.p2
                break;
            case '3':
              p = that.data.p3
              break;
            case '4':
              p = that.data.p4
              break;
        }
        load.request('/api/Distribut/my_store?p=' + p + '&type=' + type, function (res) {
            switch (type) {
                case '0':
                    that.data.p0++;
                    break;
                case '1':
                    that.data.p1++;
                    break;
                case '2':
                    p = that.data.p2++;
                    break;
                case '3':
                  p = that.data.p3++;
                  break;
                case '4':
                  p = that.data.p4++;
                  break;
            }
            that.data.currentPage++;
           if (that.data.is_first) {
            // console.log(res,'=============================')
            if (res.data.result.length == 0) {
              that.setData({
                is_first: false,
                shouldShareStore: false
              })
            }
           }
        });
    },
    distributTopages: function (e) {
      var index = e.currentTarget.dataset.idx
      if (this.data.page == index) {
        return
      }
      if ( (index == 5||index == 3) && this.data.store.is_A != 1 ) {
          return wx.showToast({
            title: '开发中~',
            icon: 'none'
          })
      }
      if (index == 2) { //点击的店铺操作
        if (this.data.shouldProposalShow) {
          return
        }
        this.setData({
          shouldOperationsShow: !this.data.shouldOperationsShow
        })
        return
      }
        common.todistribut(index, this.data.page);
    },
    //重置数据
    resetData: function () {
        load.resetConfig();
        this.setData({
            p0: 1,
            p1: 1,
            p2: 1,
            p3: 1,
            p4: 1,
            list: null,
            currentPage: 1
        })
    },
    chooseSize:function(e){//选择不同类型的商品
        var type = e.currentTarget.dataset.type + ''//转为字符串
        if (type == this.data.type) {
            return
        }
        switch (type) {
            case '0':
                this.setData({
                    type: '0'
                })
                this.resetData();
                this.getGoodsList()
                break;
            case '1':
                this.setData({
                        type: '1'
                    })
                this.resetData();
                this.getGoodsList()
                break;
            case '2':
                this.setData({
                    type: '2'
                })
                this.resetData();
                this.getGoodsList()
                break;
            case '3':
                this.setData({
                    type: '3'
                })
                this.resetData();
                this.getGoodsList()
                break;
            case '4':
                this.setData({
                    type: '4'
                })
                this.resetData();
                this.getGoodsList()
                break;
        }
    },
    catchShare:function(){//分享
        this.setData({
          actionSheetHidden: false,
          shareType: 'store'
        })
    },

    closeShare:function(){//关闭分享
        this.setData({
            showShareButton: false
        })
    },
    listenerActionSheet:function(){
      this.setData({
        actionSheetHidden: true,
        actionSheetHidden2: true,
      })
    },
    onReachBottom: function () {
        if (load.canloadMore()) {
            this.getGoodsList();
        }
    },
  
    onPullDownRefresh: function (e) {
        this.resetData();
        this.getGoodsList();
    },
    backToHome:function(){
        wx.reLaunch({
          url: '/pages/index/index/index',
        })
    },
    getSharePic: function(e) { //分享海报朋友圈
        var type = e.currentTarget.dataset.type || 0
        var store_id = this.data.store.store_id || wx.getStorageSync('app:userInfo').store_id
        var is_B = this.data.userInfo.is_B || 0
        var that = this
        
        if (is_B == 0) { // 大A 
          if (type == 3) { //分享下级 没有这种操作 驳回
            return
          }
          if (that.data.fx) {
              this.haibao(store_id,type)
          }
        }
          
        if ( is_B == 1) { // 大B 下级分享
          // 最终生成的是大B自己的store_id码
          this.setData({
            shareTxt: '为保护您的商业机密，请保存海报后，通过微信发送给下级'
          })
          if (type == 0) { //大B普通分享
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
                  // console.log('啥也不用干1')
                }
              }
            })
            return
          } else if (type == 3 ) {
            // console.log(that.data.userInfo.store_id)
            // return
            var sId = this.data.store.store_id || wx.getStorageSync('app:userInfo').store_id
            that.haibao(sId,type)
            // request.get( that.data.url + '/api/Goods/isStoreSharePoster',{
            //   data:{
            //     store_id: that.data.userInfo.store_id,
            //     type: 3,
            //   },
            //   success: function(res2){
            //     if (res2.data.status == 1) {
            //     }
            //   }
            // } )
          }
          // that.haibao(store_id,type)
        }
        var that = this
        that.setData({
          actionSheetHidden: !this.data.actionSheetHidden
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
           if(is_B == 1) {//大B
            wx.showModal({
              title: '提示',
              content: '本次分享，对方将知晓壹童网信息，是否继续',
              cancelText: '返回',
              messageAlign: 'left',
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
      // 生成海报
      haibao:function(store_id,type){
        var that = this
        var type = type || 0
        // console.log(store_id,type)
        // return
        request.get( that.data.url + '/api/Goods/isStoreSharePoster',{
          data:{
            store_id: store_id,
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
                  // console.log(res)
                  that.setData({
                    share_btn: true,
                    share_pic: res.path,
                    actionSheetHidden: true
                  })
                },
                complete: function(res) {
                  // console.log(res)
                  wx.hideLoading()
                }
              })
            }
          }
        } )
  
      },
      haibaoB:function(){ //大B二次确认海报
        this.shareTogetherClose2()
        var sId = this.data.store.store_id || wx.getStorageSync('app:userInfo').store_id
        this.haibao(sId,3)
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
    copyUrl:function(){//复制url
      wx.setClipboardData({ //设置粘贴板内容
        data: 'https://www.yitongwang.com/seller',
        success (res) {
          
        }
      })
    },
    closeMask: function(){//关闭提示
      this.setData({
        tipsmask: true,
    })
    if (wx.getStorageSync('maskSum9')) {//判断本地有无数量设置过
        var maskSum = wx.getStorageSync('maskSum9') - 1
        wx.setStorageSync('maskSum9', maskSum)
    } else {
        wx.setStorageSync('maskSum9', 5)
    }
    if (this.data.store.is_A == 0 && this.data.store.store_state == 1 ) {
      this.setData({
        exclusive_B: true,
    })
    } 

    },
    delGoods:function(){
      var that = this
      that.setData({ 
        showDelGoods: false
      })
      var url = that.data.isFxGoods ? '/api/Distribut/delFxGoods' : '/api/Goods/delGoods'
      request.post( that.data.url + url,{
        data:{
          goods_id: that.data.curId
        },
        success:function(res){
          if (res.data.status == 1) {
            that.setData({
              list: [],
              p0:1,
              p1:1,
              p2:1,
              p3:1,
              p4:1,
            }) 
            that.getGoodsList()
            that.getStore()
          }
        }
      } )
      that.setData({
        isFxGoods: false
      })
    },
    toGoodsInfo:function(e){//前往店铺详情
      if (this.data.type != 1 && this.data.type != 2) {
        return
      }
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    },
    closeBack:function(){//店铺被关闭
      wx.reLaunch({
        url: '/pages/index/index/index',
      })
    },
    closeDel:function(){
      this.setData({
        showDelGoods: false
      })
    },
    showProup2:function(e){
      var curId = e.currentTarget.dataset.id
      var fx = e.currentTarget.dataset.fx == 1
      var obj = {
        img: setting.url + '/public/static/images/minniapp/operation-sellerdown.png',
        title: (this.data.type == 3 || this.data.type == 4) ? '上架' : '下架',
        info: (this.data.type == 3 || this.data.type == 4) ? '将已下架的商品，上架出售' : '缺货中/补货中的商品，可以先下架再上架',
        index: 3
      }
      this.setData({
        showOperationMask: true,
        curId: curId,
        operationItems: returnNotFx(obj),
        isFxGoods: fx,
        goodsTit: this.data.list[e.currentTarget.dataset.index].goods_name
      })
    },
    callMe:function(){
      wx.makePhoneCall({
        phoneNumber: '400-008-6336',
      })
    },
    onInfoClose:function(){
      this.setData({
        exclusive_B: false
      })
    },
    //10.15 发布新品
    addNewGoods:function(){
      wx.navigateTo({
        url: '/pages/goods/addGoods/index?goods_id=0&is_A=' + this.data.store.is_A,
      })
    },
    operationGoods:function(e){ //操作
      var type = e.currentTarget.dataset.type
      const that = this
      this.setData({
        showOperationMask: false
      })
      switch (type) {
        case 0://编辑
        if (this.data.type == 1 && this.data.store.is_A == 0) {
          return wx.showToast({
            title: '分销商品无法编辑哦~~',
            icon: 'none'
          })
        }
        var copy = 'none'
        if (this.data.type == 4 && this.data.store.is_A == 1) {
          copy = 'copyA'
        }
        wx.navigateTo({
          url: '/pages/goods/addGoods/index?goods_id='+ that.data.curId +'&is_A=' + this.data.store.is_A + '&isCopy=' + copy,
        })
        break;
        case 1://改库存
        if (this.data.type == 1 && this.data.store.is_A == 0) {
          return wx.showToast({
            title: '分销商品无法修改库存哦~~',
            icon: 'none'
          })
        }
          wx.navigateTo({
            url: '/pages/goods/specSize/index?goods_id='+ that.data.curId +'&from=shop',
          })
          break;
        case 2://复制
        if (this.data.type == 1 && this.data.store.is_A == 0) {
          return wx.showToast({
            title: '分销商品无法复制哦~~',
            icon: 'none'
          })
        }
        Dialog.confirm({
          message: '复制商品后，您可以在您的草稿箱中查看商品，修改主图，快捷上架更多商品~~',
          confirmButtonText: '复制',
          cancelButtonText: '取消'
        })
          .then(() => {
            // 复制商品操作
            that.copyOrOffGoods('copyGoods',{goods_id: that.data.curId},'商品复制成功，已添加至您的草稿箱中')
          })
          .catch(() => {
          });
        break;
        case 3://下架  上架
        if (this.data.type == 1 && this.data.store.is_A == 0) {
          return wx.showToast({
            title: '分销商品无法下架哦~~',
            icon: 'none'
          })
        }
        if (this.data.type == 4) {
          return wx.showToast({
            title: '草稿箱中的商品，需要编辑后才可以发布哦~~',
            icon: 'none'
          })
        }
        Dialog.confirm({
          message: (this.data.type == 3 || this.data.type == 4) ? '商品上架后，将展示在您的店铺中，如需再次下架，可重新进行商品操作' : '商品下架后，将暂时存放在您的"已下架"商品列表中，下架后，如需重新上架，可以在"已下架"列表中重新编辑上架',
          confirmButtonText: (this.data.type == 3 || this.data.type == 4) ? "上架" : "下架",
          cancelButtonText: '取消'
        })
          .then(() => {
            // 下架商品的操作
            that.copyOrOffGoods('changeGoodsStatus',{
              field: 'is_on_sale',
              value: that.data.type == 3 ? 1 : 0,
              goods_id: that.data.curId
            },'商品'+ that.data.type == 3 ? "上架" : "下架" +'成功')
          })
          .catch(() => {
          });
        break;
        case 4://删除的操作
          this.setData({
            showDelGoods: true
          })
        break;
        case 5://分享的操作
          if (this.data.type == 3 || this.data.type == 4) {
            return wx.showToast({
              title: '未发布的商品，无法进行分享哦~~',
              icon: 'none'
            })
          }
          that.setData({
            actionSheetHidden2: false,
            shareImg: that.data.url + '/api/goods/goodsThumImages?goods_id='+ that.data.curId +'&width=400&height=400'
          })
        break;
        default:
        break;
      }
    },
    closeOperationMask:function(){ //关闭操作
      this.setData({
        showOperationMask: false
      })
    },
    shareGoods:function(e){ //商品item分享
      this.setData({
        curId: e.currentTarget.dataset.id,
        actionSheetHidden2: false,
        shareType: 'goods',
        goodsTit: e.currentTarget.dataset.tit,
        shareImg: e.currentTarget.dataset.img
      })
    },
    copyOrOffGoods:function(url,data,msg){
      var that = this
      request.post( that.data.url + '/api/store/' + url, {
        data,
        success:function(res){
          wx.showToast({
            title: msg,
            duration: 2000
          })
          //刷新页面
          that.setData({
            list: [],
            p0:1,
            p1:1,
            p2:1,
            p3:1,
            p4:1,
          })
          that.getGoodsList()
          that.getStore()
        }
      })
    },
    shareHaiBao:function(){
      wx.showLoading()
      var that = this
      var type = that.data.store.is_A == 1 ? 0 : 3
      wx.getImageInfo({
        src: that.data.url + '/api/goods/goodsSharePoster?id=' + that.data.curId +
          '&token=' + that.data.userInfo.token +
          '&type='+ type +'&leader_id=' + wx.getStorageSync('app:userInfo')['user_id'],
          isShowLoading: false,
        success: function(res) {
          that.setData({
            share_btn: true,
            share_pic: res.path
          })
        },
        complete: function(res) {
          // console.log(res)
          wx.hideLoading()
        }
      })
    },
    toTongHang:function(e){ //点击商品的分享给同行
      this.setData({
        actionSheetHidden: true,
        actionSheetHidden2: true
      })
      Dialog.confirm({
        message: '此操作，对方将会知晓壹童网，请确认，您将要分享的是同行吗？',
        confirmButtonText: '确定分享',
        cancelButtonText: '取消',
        confirmButtonOpenType: 'share'
      })
        .then(() => {
        })
        .catch(() => {
        });
    },
    share2:function(e){

      this.setData({
        shareTxt: this.data.store.is_A == 1 ? '分享至朋友圈' : '私密分享给下级',
        actionSheetHidden: true,
        actionSheetHidden2: true
      })
      this.shareHaiBao()
    },
    onShareAppMessage:function(){
      var sId = this.data.store.store_id || wx.getStorageSync('app:userInfo').store_id
      var path = this.data.shareType == 'store' ? '/pages/store/index/index?store_id=' + sId : '/pages/goods/goodsInfo/goodsInfo?goods_id=' + this.data.curId
      var title = this.data.shareType == 'store' ? '我发现一间好店@' + this.data.store.store_name + '，推荐给你！' : this.data.userInfo.nickname + '超值推荐-' + this.data.goodsTit
      var img = this.data.shareImg || ''
      this.setData({
        shareImg: ''
      })
      return {
        title: title,
        path: path,
        imageUrl: img
      }
    },
    closeOperations(){//关闭店铺管理的操作选项
      this.setData({
        shouldOperationsShow: false,
        shouldProposalShow: false
      })
    },
    clickTelmpleteOpera(e){
      
      var index = e.currentTarget.dataset.index + ''
      // if (index != 0) {
      //   wx.showToast({
      //     title: '开发中~',
      //     icon: 'none'
      //   })
      //   return
      // }
     
      // console.log(index)
      var that = this
      var pages = getCurrentPages()
      var historyArr = []
      for (let i = 0; i < pages.length; i++) {
          historyArr.push(pages[i].route)
      }
      that.setData({
        shouldOperationsShow: false
      })
      switch (index) {
        case '0':
          var index = historyArr.indexOf("pages/user/account_b/account_b")
          if (index != -1) {
              wx.navigateBack({
              delta: historyArr.length - index - 1,
              })
              return
          }
          wx.navigateTo({
            url: '/pages/user/account_b/account_b?is_A=' + that.data.store.is_A,
          })
          break;
        case '1':
          var index = historyArr.indexOf("/pages/distribut0/DIYshop/DIYshop")
          if (index != -1) {
              wx.navigateBack({
              delta: historyArr.length - index - 1,
              })
              return
          }
          wx.navigateTo({
            url: '/pages/distribut0/DIYshop/DIYshop?is_A=' + that.data.store.is_A,
          })
          break;
        case '2':
          that.setData({
            shouldProposalShow: true,
            isProposalDone: false
          })
          break;
        case '3':
          var index = historyArr.indexOf("/pages/distribut0/DIYshopPoster/DIYshopPoster")
          if (index != -1) {
            wx.navigateBack({
            delta: historyArr.length - index - 1,
            })
            return
          }
          wx.navigateTo({
            url: '/pages/distribut0/DIYshopPoster/DIYshopPoster?is_A=' + that.data.store.is_A,
          })
          break;
        default:
          break;
      }
    },
    callService(){
      wx.makePhoneCall({
        phoneNumber: '400-008-6336',
      })
    },
    proposalAddImg(){//增加投诉建议的图片

      var that = this
      if (that.data.proposalData.img.length >= 5) {
        return
      }
      wx.chooseImage({
        count: 5 - this.data.proposalData.img,
        sourceType: ['album'],
        success:function(res){
          res.tempFilePaths.forEach((item)=>{
            that.uploadFile(item)
          })
        }
      })
    },
    delProposalImg(e){//删除投诉建议的图片
      var index = e.currentTarget.dataset.index
      var imgs = this.data.proposalData.img
      imgs.splice(index,1)
      this.setData({
        [`proposalData.img`]: imgs
      })
    },
    uploadFile:function(src){ //上传图片
      if (this.data.proposalData.img >= 5) {
        return
      }
      wx.showLoading({
        title: '上传中...',
        mask:true
      })
      const that = this
      wx.uploadFile({
        filePath: src,
        name: 'qinzi_imgs',
        url: that.data.url + '/api/newjoin/upload_qianzi_img',
        success:function(res){
          if(res.statusCode !== 200){
            return
          }
          var result = JSON.parse(res.data)
          that.setData({
            [`proposalData.img`]: [...that.data.proposalData.img,...[result.result]]
          })
          wx.hideLoading()
        }
      })
    },
    proposalAreaInput(e){ //input值变化
      this.setData({
        [`proposalData.proposalArea`]: e.detail.value
      })
    },
    proposalSubmit(){//提交
      var complaint_content = this.data.proposalData.proposalArea + ''
      var img = this.data.proposalData.img
      complaint_content = complaint_content.replace(' ','')
      if (complaint_content.length <= 5) {
        return wx.showToast({
          title: '请输入至少5个字以上的问题描述~',
          icon: 'none'
        })
      }
      if (img.length == 0) {
        return wx.showToast({
          title: '请至少上传一张问题描述图片~',
          icon: 'none'
        })
      }
      var complaint_img = img.join(',')
      var that = this
      request.post(that.data.url + '/api/StoreBusiness/complaint', {
        data: {
          store_id: this.data.store.store_id || wx.getStorageSync('app:userInfo').store_id,
          user_id: this.data.store.user_id || wx.getStorageSync('app:userInfo').store_id,
          complaint_content,
          complaint_img
        },
        success:function(res){
          that.setData({
            proposalData: {
              img: [],
              proposalArea: ''
            },
            isProposalDone: true
          })
        }
      })
    },
})
