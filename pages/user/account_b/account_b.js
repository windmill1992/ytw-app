// account.js
var app = getApp();
import LoadMore from '../../../utils/LoadMore.js'
var load = new LoadMore;
var util = require('../../../utils/util.js');
var common = require('../../../utils/common.js');
var request = require('../../../utils/request')
var { operaList } = require('../../../utils/util2.js');
Page({
  data: {
    shouldOperationsShow: false,
    shouldProposalShow: false,
    operaList:operaList,
    isiphoneX: wx.getStorageSync('isiphoneX') || false,
    is_A: true,
    url: app.globalData.setting.url,
    resourceUrl: app.globalData.setting.resourceUrl,
    userInfo: null,
    page: 2,
    active: 0,
    active2:0,
    outOrTixian:0,
    pAll: 1,//全部的page
    pIn: 1,//收入的page
    pOut: 1,//支出的page
    pTX: 1,//提现的page
    listAll:[],
    listIn:[],
    listOut:[],
    store_id: 0,
    type: 1,//默认获取全部信息
    enter_money: 0,//累计收入
    out_money: 0,//累计支出
    store_money: 0,//可用余额
    pullDown: false,//记录是否是pulldowm下拉
    isiphoneX: wx.getStorageSync('isiphoneX')||false,
    proposalData: {
      img: [],
      proposalArea: ''
    },
    isProposalDone: false,//反馈是否完成展示成功的界面
  },
  onLoad: function (options) {
    var store_id = wx.getStorageSync('app:userInfo').store_id
    this.setData({
      store_id: store_id,
      userInfo: wx.getStorageSync('app:userInfo'),
      is_A: wx.getStorageSync('app:userInfo').is_B == 1 ? false : true
    },function(){
      this.getInfo(1,1)//默认先获取一次全部的信息
    })
  },
  onShow: function () {
    
  },
  onChange(event) {//余额 提现切换
    console.log(event.detail)
    var { listAll, listOut } = this.data
    var type = event.detail.index
    this.setData({
      type: type == 0 ? '1' : '3',
      outOrTixian: type == 0 ? this.data.outOrTixian : 'tixian',
    })
    switch (this.data.type + '') {
      case '1':
        if (listAll.length == 0) {
          this.getInfo(1,1)
        }
        break;
      case '3':
        if (listOut.length == 0) {
          this.getInfo(3,1)
        }
        break;
    }
  },
  onChange2:function(e){ //全部 收入 支出 切换
    console.log(e)
    var { listAll, listIn, listOut } = this.data
    var type = e.detail.index
    this.setData({
      type: type - 0 + 1,
      outOrTixian: type == 2 ? 'zhichu' : this.data.outOrTixian
    })
    switch (this.data.type + '') {
      case '1':
        if (listAll.length == 0) {
          this.getInfo(1,1)
        }
        break;
      case '2':
        if (listIn.length == 0) {
          this.getInfo(2,1)
        }
        break;
      case '3':
        if (listOut.length == 0) {
          this.getInfo(3,1)
        }
        break;
    }
  },
  getInfo:function(type,p){
    const that = this
    request.get( that.data.url + '/api/store/storeMoney',{
      data: {
        store_id: that.data.store_id,
        p: p,
        type: type
      },
      success:function(res){
        // console.log(res)
        switch (type + '') {
          case '1':
            that.setData({
              listAll: that.data.listAll.concat(res.data.result.list),
              enter_money: res.data.result.enter_money,
              out_money: res.data.result.out_money,
              store_money: res.data.result.store_money
            })
            break;
          case '2':
            that.setData({
              listIn: that.data.listIn.concat(res.data.result.list)
            })
            break;
          case '3':
            that.setData({
              listOut: that.data.listOut.concat(res.data.result.list)
            },function(){//因为提现记录每项高度小 所以 在此判断 如果获取到的数据少于10，则再发送一次请求 请求下一页的数据
              if ( that.data.listOut.length <= 10 && that.data.outOrTixian == 'tixian' && that.data.pOut == 1 ) {
                that.getInfo(3,2)
                  that.setData({
                    pOut: 2
                  })
              }
            })
            break;
        }
        if (that.data.pullDown) {//如果是下拉刷新  关闭下拉刷新
          wx.stopPullDownRefresh()
        }
      }
    } )
  },
  onReachBottom: function () {//触底加载更多数据
    var { pAll, pIn, pOut } = this.data
    switch (this.data.type + '') {
      case '1':
        this.setData({
          pAll: pAll - 0 + 1
        },function(){//设置完page，回调中再去继续获取数据 --1
          this.getInfo(1,this.data.pAll)
        })
        break;
      case '2':
        this.setData({
          pIn: pIn - 0 + 1
        },function(){//设置完page，回调中再去继续获取数据 --2
          this.getInfo(2,this.data.pIn)
        })
        break;
      case '3':
        this.setData({
          pOut: pOut - 0 + 1
        },function(){//设置完page，回调中再去继续获取数据 --3
          this.getInfo(3,this.data.pOut)
        })
        break;
    }
  },
  resetDate:function(){//下拉刷新  重置数据
    this.setData({
      pall: 1,//全部的page
      pIn: 1,//收入的page
      pOut: 1,//支出的page
      pTX: 1,//提现的page
      listAll:[],
      listIn:[],
      listOut:[],
      pullDown: true,
    })
  },
  onPullDownRefresh: function (e) {
    this.resetDate()
    switch (this.data.type + '') {
      case '1':
        this.getInfo(1,1)
        break;
      case '2':
        this.getInfo(2,1)
        break;
      case '3':
        this.getInfo(3,1)
        break;
    }
  },
  preImage:function(e){
    wx.previewImage({
      urls: [e.currectTarget.dataset.src],
    })
  },
  // =======================================  以下为新增加店铺设置 以及底部导航
  closeOperations(){//关闭店铺管理的操作选项
    this.setData({
      shouldOperationsShow: false,
      shouldProposalShow: false
    })
  },
  distributTopages: function (e) {
    var index = e.currentTarget.dataset.idx
    var is_A = (this.data.userInfo.is_B == 0 && this.data.userInfo.store_id > 0)
    if (is_A == 0 && (e.currentTarget.dataset.idx == 5 || e.currentTarget.dataset.idx == 3)) {
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
    common.todistribut(e.currentTarget.dataset.idx, this.data.page);
  },
  addNewGoods:function(){
    wx.navigateTo({
      url: '/pages/goods/addGoods/index?goods_id=0&is_A=' + (this.data.userInfo.is_B == 1 ? 0 : 1),
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
          url: '/pages/user/account_b/account_b',
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
          url: '/pages/distribut0/DIYshop/DIYshop',
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
          url: '/pages/distribut0/DIYshopPoster/DIYshopPoster',
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
        store_id: wx.getStorageSync('app:userInfo').store_id || 0,
        user_id: wx.getStorageSync('app:userInfo').user_id || 0,
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
  }
})