var common = require('../../../utils/common.js');
import Dialog from '../../../dist/dialog/dialog';
var { operaList } = require('../../../utils/util2.js');
var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: setting.url,
    page: 5,
    is_A: true,
    isiphoneX: wx.getStorageSync('isiphoneX')||false,
    active1: 0,//当前Nav
    addMemberDialog: false,//增加新的会员显示
    inputValue: '',//输入框的值
    hasMore: true,
    status: 1,
    p: 1,
    editName: '',
    audit_count: 0,
    passList: [],//已通过列表
    unPassList: [],//未通过列表
    showInput: false,//备注的input框
    showAddPopup: false,
    addNew: {
      phone: '',
      remark: ''
    },
    shouldOperationsShow: false,
    shouldProposalShow: false,
    operaList:operaList,
    proposalData: { //反馈 相关
      img: [],
      proposalArea: ''
    },
    isProposalDone: false,//反馈是否完成展示成功的界面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMember(1,1)
    this.setData({
      is_A: wx.getStorageSync('app:userInfo').is_B == 1 ? false : true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.hasMore) {
      return wx.showToast({
        title: '已经加载完全部',
        icon: 'none'
      })
    }
    var p = this.data.p
    this.getMember(this.data.status, p - 0 + 1)
    this.setData({
      p: p - 0 + 1
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getMember:function(status,p){//获取会员列表数据
    var that = this
    request.get( that.data.url + '/api/Store/getStoreMember',{
      data: {
        status: status,
        p:p
      },
      success:function(res){
        // console.log(res)
        // return
        if (res.data.status == 1) {
          if (res.data.result.list.length == 0) {
            wx.showToast({
              title: '已加载完全部',
              icon: 'none'
            })
            that.setData({
              hasMore: false
            })
          }
          if (that.data.status == 1) {
            that.setData({
              audit_count: res.data.result.audit_count,
              passList: that.data.passList.concat(res.data.result.list)
            })
          } else {
            that.setData({
              audit_count: res.data.result.audit_count,
              unPassList: that.data.unPassList.concat(res.data.result.list)
            })
          }
        }
      }
    } )
  },
  onNavChange:function(e){
    var curNav = e.detail.name
    // console.log(curNav)
    this.setData({
      status: curNav == 0 ? 1 : 2,
      p: 1,
      passList: [],
      unPassList: [],
      hasMore: true
    })
    this.getMember(this.data.status,1)
  },
  addMember:function(){//添加会员
    var that = this
    // this.setData({
    //   showAddPopup: true
    // })
    // return
    if (this.data.inputValue == '') { 
      return
    }
    if(!(/^1[3456789]\d{9}$/.test(this.data.inputValue))){
        return wx.showToast({
          title: '手机号输入有误，请填写正确手机号',
          icon: 'none'
        })
    } else {
      that.setData({
        passList: [],
        unPassList: []
      })
      wx.showModal({
        title: '提示',
        content: '确定添加' + that.data.inputValue + '成为您的VIP客户吗？添加后对方将能看到您的私密商品',
        success (res) {
          if (res.confirm) {
            that.setData({
              p: 1
            })
            that.addRequest()
          } else if (res.cancel) {
          }
        } 
      })
      
    }
  },
  addNewInput(e){
    var val = e.detail.value
    var type = e.currentTarget.dataset.type
    if (type == 'a') {
      this.setData({
        [`addNew.phone`]: val
      })
    } else {
      this.setData({
        [`addNew.remark`]: val
      })
    }
  },
  submitNew(){
    if (this.data.addNew.phone == '') { 
      return
    }
    if(!(/^1[3456789]\d{9}$/.test(this.data.addNew.phone))){
      return wx.showToast({
        title: '手机号输入有误，请填写正确手机号',
        icon: 'none'
      })
    } 
    // console.log(this.data.addNew)
  },
  addRequest:function(){//添加会员请求
    var that = this
    request.post( that.data.url + '/api/Store/addStoreMember',{
      data:{
        phone: that.data.inputValue
      },
      success:function(res){
        if (res.data.status == 1) {
          wx.showToast({
            title: '添加成功，会员已添加至您的会员列表中',
            duration: 2000
          })
          // 再次获取会员列表
          that.getMember(1,1)
        } else {
          if (res.data.status == 2) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            setTimeout(function(){
              that.getMember(that.data.status, 1)
            },1500)
          }
          
        }
      }
    } )
  },
  onPopupClose(){
    this.setData({
      showAddPopup: false
    })
  },
  doMember:function(id,type,status){//会员操作
    console.log(id,type,status)
    // return
    var that = this
    var data = {id: id}
    if (status == 'refuse') {
      data = {
        id: id,
        status: 0
      }
    } else if (status == 'pass') {
      data = {
        id: id,
        status: 1,
        remark: that.data.editName
      }
    }
    request.post( that.data.url + '/api/Store/' + type,{
      data,
      success:function(res){
        console.log(res)
        if (res.data.status == 1) {
          that.setData({
            passList: [],
            unPassList: [],
            p: 1
          })
          wx.showToast({
            title: '操作成功',
          })
          that.getMember(that.data.status,1)
        }
      }
    } )
  },
  ask:function(e){//删除会员询问
    var id = e.currentTarget.dataset.id
    var tel = e.currentTarget.dataset.tel
    var type = e.currentTarget.dataset.type
    var str = ''
    var status = 'ok'
    var that = this
    this.setData({ //默认不展示备注的input框 
      showInput: false,
      editName: ''
    })
    if (type == 'delStoreMember') {
      str = '确定删除VIP-' + e.currentTarget.dataset.remark + '-'
    } else if(type == 'auditStoreMember'){
      if (e.currentTarget.dataset.type2 == 'pass') {
        str = '确定通过VIP-'
        status = 'pass'
        this.setData({
          showInput: true
        })
      } else {
        str = '确定拒绝VIP-'
        status = 'refuse'
      }
    } 
    var that = this

    Dialog.confirm({
      title: str + tel + '-吗？',
      asyncClose: true
    }).then(() => {
      console.log(11111)
      that.doMember(id,type,status)
      Dialog.close();
    }).catch(() => {
      Dialog.close();
    });

  },
  inputChange:function(e){ //输入手机号
    var tel = e.detail.value
      this.setData({
        inputValue: tel
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
onAddClose:function(){
  this.setData({
    addMemberDialog: false
  })
},
editInputChange:function(e){//修改备注
  if (e.detail.value) {
    if (e.detail.value.trim().length > 8) {
      wx.showToast({
        title: '备注名称不能超过8个字',
        icon: 'none'
      })
      this.setData({
        editName: e.detail.value.slice(0,8)
      })
      return
    }
  }
  this.setData({
    editName: e.detail.value
  })
},
editName:function(e){//修改备注
  var id = e.currentTarget.dataset.id
  var that = this
  this.setData({
    showInput: true,
    editName: e.currentTarget.dataset.remark
  })
    Dialog.confirm({
      title: '修改备注(0-8个字)',
      asyncClose: true
    }).then(() => {
      console.log(11111)
      request.post(that.data.url + '/api/Store/updateStoreMemberRemark',{
        data:{
          id: id,
          remark: that.data.editName
        },
        success:function(res){
          if (res.data.msg == '添加成功') {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            that.setData({
              passList: [],
              unPassList: [],
              p: 1
            })
            that.getMember(that.data.status,1)
            Dialog.close();
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            Dialog.close();
          }
        }
      })
    }).catch(() => {
      Dialog.close();
    });



  },
  addNewGoods:function(){
    wx.navigateTo({
      url: '/pages/goods/addGoods/index?goods_id=0&is_A=1',
    })
  },
  // =======================================  以下为新增加店铺设置 以及底部导航
  closeOperations(){//关闭店铺管理的操作选项
    this.setData({
      shouldOperationsShow: false,
      shouldProposalShow: false
    })
  },

  addNewGoods:function(){
    wx.navigateTo({
      url: '/pages/goods/addGoods/index?goods_id=0&is_A=1'
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