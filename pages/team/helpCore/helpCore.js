
var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var flag = true //true 可以翻页 false 不能翻页
const {req} = require('../../../utils/req')
Page({
  data: {
    url: setting.url,
    list:[{
      src: '/images/swiper-img-temp1.png'
    },{
      src:'/images/swiper-img-temp2.png'
    }],
    navList: [{
      src: 'https://test.yitongwang.com/public/static/images/minniapp/help_list_tel.png',
      txt: '平台客服电话',
    },
    {
      src: 'https://test.yitongwang.com/public/static/images/minniapp/help_list_video.png',
      txt: '新手教程',
    }],
    swiperList:[],
    p: 1,//推荐商品翻页
    goodsList: []
  },
  onLoad: function (options) {
    // async console.log(typeof req)
    // var res = await req({
    //   url: '/api/StoreOrder/storeOrderList',
    // })
    // console.log(res)
    this.getSwiper()
    this.getRecomendGoods()

    // const query = wx.createSelectorQuery()                // 创建节点查询器 query
    // query.selectAll('.coreItem').boundingClientRect()    // 这段代码的意思是选择Id=productServe的节点，获取节点位置信息的查询请求
    // query.selectViewport().scrollOffset()                 // 这段代码的意思是获取页面滑动位置的查询请求
    // query.exec((res) => {
    //   console.log(res)
    // })
  },
  clickNav:function(e){//点击每一项
    var index = e.currentTarget.dataset.index
    switch (index) {
      case 0:
        wx.makePhoneCall({
          phoneNumber: '4000086336',
        })
        break;
      case 1:
        wx.navigateTo({
          url: '/pages/team/NoviceHelp/NoviceHelp',
        })
        break;
      default:
        break;
    }
  },
  getSwiper(){
    var that = this
    request.get(that.data.url + '/api/Ad/getHelpCenterAd', {
      data: {},
      success:function(res){
        that.setData({
          swiperList: res.data.result.reverse()
        })
      }
    })
  },
  getRecomendGoods(){//获取推荐商品
    if (!flag) {
      return
    }
    var that = this
    request.get(that.data.url + '/api/Activity/recommendGoods',{
      data: {
        type: 1,
        p: that.data.p
      },
      success:function(res){
        that.setData({
          goodsList: [...that.data.goodsList,...res.data.result]
        })
        if (res.data.result.length < 10) {
          flag = false
        }
      }
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {
    flag = true
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})