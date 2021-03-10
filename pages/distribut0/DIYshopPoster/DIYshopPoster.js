var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var common = require('../../../utils/common.js');
var { operaList } = require('../../../utils/util2.js');
Page({

  data: {
    url: setting.url,
    operaList: operaList,
    shouldOperationsShow: false,
    shouldProposalShow: false,
    page: 2,
    isiphoneX: wx.getStorageSync('isiphoneX') || false,
    is_A: true,
    share_btn: false,//海报
    proposalData: {
      img: [],
      proposalArea: ''
    },
    isProposalDone: false,//反馈是否完成展示成功的界面
  },
  onLoad: function (options) {
    this.setData({
      is_A: wx.getStorageSync('app:userInfo').is_B == 1 ? false : true
    })
  },
  getPic(){
    var that = this
    wx.showModal({
      content: '是否立即生成店铺海报并群发',
      confirmColor: '#18c2ba',
      cancelColor: '#777',
      success:function(res){
        if (res.confirm) {
          that.haibao()
        }
      }
    })
  },
  haibao:function(store_id){
    var that = this
    // return
    request.get( that.data.url + '/api/Goods/isStoreSharePoster',{
      data:{
        store_id: wx.getStorageSync('app:userInfo').store_id,
        type: 0
      },
      success: function(res2){
        if (res2.data.status == 1) {
          wx.showLoading({
            title: '正在生成',
            mask: true,
          })
          wx.getImageInfo({
            src: that.data.url + '/api/goods/storeSharePoster?store_id='+ wx.getStorageSync('app:userInfo').store_id + '&type=0&token=' + wx.getStorageSync('app:userInfo').token,
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
              // console.log(res)
              wx.hideLoading()
            }
          })
        }
      }
    } )

  },
  // 展示海报
  previewSharePic: function() {
    wx.previewImage({
      urls: [this.data.share_pic],
    })
  },
  // 关闭海报
  closeShareModal: function() {
    this.setData({
      share_btn: false
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
  distributTopages: function (e) {
    var index = e.currentTarget.dataset.idx
    if ( (index == 5||index == 3) && !this.data.is_A ) {
        return wx.showToast({
          title: '开发中~~',
          icon: 'none'
        })
    }
    if (index == 2) { //点击的店铺操作
      this.setData({
        shouldOperationsShow: true
      })
      return
    }
      common.todistribut(index, this.data.page);
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
    var that = this
    var pages = getCurrentPages()
    var historyArr = []
    for (let i = 0; i < pages.length; i++) {
        historyArr.push(pages[i].route)
    }
    console.log(historyArr)
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