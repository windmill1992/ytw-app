var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var common = require('../../../utils/common.js');
var { operaList } = require('../../../utils/util2.js');
import Regions from '../../../utils/regions/Regions.js';
Page({

  data: {
    store_id: 0,
    shouldOperationsShow: false,
    shouldProposalShow: false,
    
    operaList: operaList,
    url: setting.url,
    page: 99,
    isiphoneX: wx.getStorageSync('isiphoneX') || false,
    is_A: true,
    address: {}, //收货地址信息
    subParams: {
      store_id: 48,
      store_name: '毛毛虫',
      province_id: '',
      city_id: '',
      district: '',
      store_info_address: '',
      store_phone: '',
      share_poster_is_show_price: 0,
      store_re_address: ''
    },
    isModifyAddress: false,//有无修改过地址
    showPopup: false,
    modifyType: 'none',//修改的类型  name tel
    proposalData: {
      img: [],
      proposalArea: ''
    },
    isProposalDone: false,//反馈是否完成展示成功的界面
  },

  onLoad: function (options) {
    var that = this
    var id = wx.getStorageSync('app:userInfo').store_id
    this.initRegions();
    this.getDefaultInfo(id)
    this.setData({
      store_id: id,
      is_A: wx.getStorageSync('app:userInfo').is_B == 1 ? false : true
    })
    setTimeout(()=>{
      console.log(that)
    },5000)
  },
  getDefaultInfo(id){
    var that = this
    request.get(that.data.url + '/api/StoreBusiness/getStoreInfo',{
      data: {
        store_id: id
      },
      success: function(res) {
        that.setData({
          [`subParams.share_poster_is_show_price`]: res.data.result.share_poster_is_show_price,
          [`subParams.store_name`]: res.data.result.store_name,
          [`subParams.store_phone`]: res.data.result.store_phone,
          [`subParams.store_info_address`]: res.data.result.store_info_address,
          [`subParams.store_re_address`]: res.data.result.store_re_address,
        })
      }
    })
  },
  change_share_poster_is_show_price(e){
    var type = e.currentTarget.dataset.type
    this.setData({
      [`subParams.share_poster_is_show_price`]: type == 'a' ? 1 : 0,
    })
    this.req({
      store_id: this.data.store_id,
      share_poster_is_show_price: type == 'a' ? 1 : 0
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
    console.log(index)
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
        var index = historyArr.indexOf("pages/distribut0/DIYshop/DIYshop")
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
        var index = historyArr.indexOf("pages/distribut0/DIYshopPoster/DIYshopPoster")
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
  initRegions: function () {
    var that = this;
    new Regions(this, 'regions', {
        endAreaLevelCall: function (parentId, regionName, address) {
            Object.assign(that.data.address, address);
            that.setData({
                'address.province_name': that.data.address.province_name,
                'address.city_name': that.data.address.city_name,
                'address.district_name': that.data.address.district_name,
                'address.twon_name': that.data.address.twon_name,
                isModifyAddress: true
            });
            that.req({
              store_id: that.data.store_id,
              province_id: that.data.address.province,
              city_id: that.data.address.city,
              district: that.data.address.district
            })
        }
    });
},
  distributTopages: function (e) {
    var index = e.currentTarget.dataset.idx
    if ( (index == 5||index == 3) && !this.data.is_A ) {
        return wx.showToast({
          title: '开发中~~',
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

  modifyItem(e){
    var type = e.currentTarget.dataset.type
    this.setData({
      showPopup: true,
      modifyType: type,
      changeText: type == 'name' ? '店铺名称' : '联系方式'
    })
  },
  closeOperations(){//关闭店铺管理的操作选项
    this.setData({
      shouldOperationsShow: false,
      shouldProposalShow: false
    })
  },
  onPopupClose(){
    this.setData({
      showPopup: false
    })
  },
  setDetail(e){ //设置详细地址
    this.setData({
      [`subParams.store_info_address`]: e.detail.value
    })
  },
  detailAddressBlur(e){//详细地址提交
    this.req({
      store_id: this.data.store_id,
      store_address: this.data.subParams.store_info_address
    })
  },
  modifyPopupInput(e){//输入框的变化
    var type = e.currentTarget.dataset.type
    if (type == 'name') {
      this.setData({
        [`subParams.store_name`]: e.detail.value
      })
      return
    }
    this.setData({
      [`subParams.store_phone`]: e.detail.value
    })
  },
  sureChange(){ //改名字 手机号的确定
    var type = this.data.modifyType
    if (type == 'name') {
      this.req({
        store_id: this.data.store_id,
        store_name: this.data.subParams.store_name
      })
      this.setData({
        showPopup: false
      })
    } else if (type == 'tel') {
      var reg = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
      if (!reg.test(this.data.subParams.store_phone)) {
        return wx.showToast({
          title: '手机号码格式不正确',
          icon: 'noen'
        })
      }
      this.req({
        store_id: this.data.store_id,
        store_phone: this.data.subParams.store_phone
      })
      this.setData({
        showPopup: false
      })
    }
    
  },
  req(params){ //提交修改
    var that = this
    request.post(that.data.url + '/api/StoreBusiness/editStore',{
      data: params,
      success:function(res){
        wx.showToast({
          title: '修改成功',
        })
      }
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
  },
})