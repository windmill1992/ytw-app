const app = getApp()
var request = require("../../../utils/request")
var setting = app.globalData.setting;
var bottomTab = [{
    name: '当日未完成',
    index: 1
  },
  {
    name: '历史未完成',
    index: 2
  },
  {
    name: '待审核',
    index: 3
  },
  {
    name: '已完成',
    index: 4
  },
  {
    name: '其他',
    index: 5
  },
]
var screenItems = [{
    name: '未送齐',
    i: 0,
  },
  {
    name: '已送齐',
    i: 1,
  },
  {
    name: '已打包(部分)/待拉',
    i: 2,
  },
  {
    name: '已打包/待拉',
    i: 3,
  },
  {
    name: '已拉包(部分)',
    i: 4,
  },
  {
    name: '已超时',
    i: 8,
  }

]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: setting.url,
    bottomTab: bottomTab,
    screenItems: screenItems,
    index: 'a', //用于长按忽略
    isShow: false, //遮盖
    isShowMsg: false, //忽略弹窗
    statu: '全部', //选择的状态
    isDialog1: false, //选择弹出框
    pId: 0, //选择的状态值
    //仓位列表
    p: 1,
    size: -999,
    activeNames: ['4'],
    showInfo: [], //用来展示的
    cangInFo: [],
    seeScreen: false, //筛选的选项是否可见
    searchTxt: '', //确认码
    type: 1, //当前的列表类型
    orderType: -99, //当前的筛选类型
    otherCssRight: '-999rpx',
    numsLeft: '-999rpx',
    curId: '',
    orderAuditCount: 0,
    isFirst: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onChange(event) { //没啥意义的监听函数
    this.setData({
      activeNames: event.detail,
    });
  },
  getOrderAuditCount:function(){
    var that = this
    request.get(that.data.url + '/api/pinbao/getOrderAuditCount',{
      data:{},
      success:function(res){
        that.setData({
          orderAuditCount: res.data.result
        })
      }
    })
  },
  onLoad: function (options) {
    this.getInfo(1, 1, -999)
    this.getOrderAuditCount()
  },
  //获取仓位可用信息
  getCangInfo: function () {
    const that = this
    request.get(that.data.url + '/api/pinbao/getPositionList', {
      success: function (res) {
        that.setData({
          cangInFo: res.data.result.position,
        })
        var sum = 0
        that.data.cangInFo.forEach((item) => {
          sum = Number(item.used_number) + Number(sum)
        })
        that.setData({
          sum: sum,
          numsLeft: '10rpx',
          otherCssRight: '-999rpx'
        })
      }
    })
  },
  // 获取所有订单信息
  getInfo: function (p, type, orderType) {
    const that = this
    request.get(that.data.url + '/api/Pinbao/getAdminOrderList', {
      data: {
        p: p,
        type: type,
        order_type: orderType,
      },
      success: function (res) {
        that.setData({
          showInfo: that.data.showInfo.concat(res.data.result),
          seeScreen: false,
          otherCssRight: '-999rpx'
        })
      }
    })
  },
  resetParams: function () { // 重置 P showInfo数组 
    this.setData({
      p: 1,
      showInfo: [],
      orderType: -99,
    })
  },
  todetail: function (e) { // 前往详情
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/subcontract/detail/detail?order_id=' + id,
    })
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
    var p = this.data.p + 1
    this.getInfo(p, this.data.type, this.data.orderType)
    this.setData({
      p: p,
      numsLeft: '-999rpx',
      otherCssRight: '-999rpx'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  reFresh: function () {
    this.resetParams()
    this.getInfo(1, -999)
    this.getCangInfo()
    this.setData({
      size: -999,
      statu: '全部'
    })
  },
  onShow: function () {
    if (this.data.isFirst) {
      this.setData({
        isFirst: false
      })
    } else {
      this.setData({
        p: 1,
        showInfo: []
      })
      this.getInfo(1,this.data.type, this.data.orderType)
    }
  },

  // ============================================================ 2 版本
  showScreen: function () { //切换显示筛选规则
    this.setData({
      seeScreen: !this.data.seeScreen
    })
  },
  onPageScroll(e) {
    if (this.data.index != 'a') {
      var index = this.data.index
      this.setData({
        seeScreen: false,
        [`showInfo[${index}].lj`]: '0',
        index: 'a',
        otherCssRight: '-999rpx',
        numsLeft: '-999rpx'
      })
    } else {
      this.setData({
        seeScreen: false,
        otherCssRight: '-999rpx',
        numsLeft: '-999rpx'
      })
    }
  },
  searchInput: function (e) { //搜索框
    var txt = e.detail.value
    this.setData({
      searchTxt: txt
    }, function () {
      if (this.data.searchTxt.length == 5) {
        this.searchOrder()
      }
    })

  },
  searchOrder: function () { //按校验码查询
    var txt = this.data.searchTxt
    var exp = /^\d{5}$/
    if (!exp.test(txt)) {
      return wx.showToast({
        title: '请正确填写校验码（5位数字）',
        icon: 'none'
      })
    }
    this.resetParams()
    const that = this
    request.get(that.data.url + '/api/Pinbao/getAdminOrderList', {
      data: {
        p: 1,
        type: 1,
        order_type: 1,
        auth_code: txt
      },
      success: function (res) {
        that.setData({
          showInfo: res.data.result,
          seeScreen: false,
          otherCssRight: '-999rpx'
        })
      }
    })
  },
  clickScreenItem: function (e) { //点击筛选item
    var index = e.currentTarget.dataset.index
    this.resetParams()
    this.getInfo(1, this.data.type, index)
    this.getOrderAuditCount()
    this.setData({
      orderType: index
    })
  },
  clickTab: function (e) { //点击底部Tab
    var index = e.currentTarget.dataset.index
    if (index == 5) { //其他
      this.setData({
        otherCssRight: this.data.otherCssRight == '-999rpx' ? '35rpx' : '-999rpx',
        numsLeft: '-999rpx'
      })
    } else {
      this.setData({
        type: index,
        orderType: -99,
        numsLeft: '-999rpx',
        showInfo: []
      })
      this.resetParams()
      this.getInfo(1, index, -99)
    }
  },
  clickOtherOpera: function (e) {
    var index = e.currentTarget.dataset.index
    if (index == 1) { //点击的是仓位情况
      //====----====----====----====----====----
      this.getCangInfo()
      return
    }
    this.resetParams()
    
    this.setData({
      type: index
    },function(){
      this.getInfo(1, this.data.type, index)
    })
  },
  closeNums: function () {
    this.setData({
      numsLeft: '-999rpx'
    })
  },
  longTapItem: function (e) { //长按 显示忽略
    if (this.data.type != 2) return
    var curIndex = e.currentTarget.dataset.index
    var index = this.data.index
    if (index != 'a') {
      this.setData({
        [`showInfo[${curIndex}].lj`]: '1',
        [`showInfo[${index}].lj`]: '0',
        index: curIndex,
        numsLeft: '-999rpx'
      })
    } else {
      this.setData({
        [`showInfo[${curIndex}].lj`]: '1',
        index: curIndex,
        numsLeft: '-999rpx'
      })
    }

  },
  ignoreItem: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      curId: id,
      isShowMsg: true
    })
  },
  sureIgnoreItem: function () { //确定忽略
    var that = this
    request.get(that.data.url + './api/pinbao/ignoreOrder', {
      data: {
        order_id: this.data.curId
      },
      success: function (res) {
        that.setData({
          isShowMsg: false,
          showInfo: [],
          p: 1
        })
        that.getInfo(1, that.data.type, that.data.orderType)
      }
    })
  },
  kslslsa: function () {
    console.log(11)
  },
})