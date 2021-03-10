// pages/infoservice/index.js
const app = getApp()
const request = require('../../../utils/request')
var setting = app.globalData.setting;
Page({

  /**
   * 页面的初始数据
   */

    data: {
      url: setting.url,
      currentSwiper:'',
      swiperImages: [
          'https://i04piccdn.sogoucdn.com/30e1da0a524cc4fb',
          'https://i04piccdn.sogoucdn.com/30e1da0a524cc4fb',
          'https://i04piccdn.sogoucdn.com/30e1da0a524cc4fb',
      ],
      currentSwiperIndex:'',
      machining:[
        {
          img:'../../assects/image/工人默认图片.png',
          name:"aaaaaa",
          business:"卡士大夫 沙拉豆腐花甲可乐是绝代风华看手机的画风手机导航风科技收费的卡视角的发货开始接单",
          address:"浙江省湖州市区",
          tel:110
        },
        {
          img:'../../assects/image/工人默认图片.png',
          name:"aaaaaa",
          business:"啥啥啥的",
          address:"浙江省湖州市区",
          tel:120
        },
        {
          img:'../../assects/image/工人默认图片.png',
          name:"aaaaaa",
          business:"啥啥啥的",
          address:"浙江省湖州市区",
          tel:120
        },
        {
          img:'../../assects/image/工人默认图片.png',
          name:"aaaaaa",
          business:"啥啥啥的",
          address:"浙江省湖州市区",
          tel:120
        },
        {
          img:'../../assects/image/工人默认图片.png',
          name:"aaaaaa",
          business:"啥啥啥的",
          address:"浙江省湖州市区",
          tel:120
        },
        {
          img:'../../assects/image/工人默认图片.png',
          name:"aaaaaa",
          business:"啥啥啥的",
          address:"浙江省湖州市区",
          tel:120
        }
      ],
      isShowTel:[],
      rentalInfo: [
        {
          danwei:'a公司',
          gangwei:'打工仔',
          shijian:'997',
          dizhi:'太阳系',
          xinzi:123,
          tel:'13067788'
        },
        {
          danwei:'a公司',
          gangwei:'打工仔',
          shijian:'997',
          dizhi:'太阳系',
          xinzi:123,
          tel:'13067788'
        },
        {
          danwei:'a公司',
          gangwei:'打工仔',
          shijian:'997',
          dizhi:'太阳系',
          xinzi:123,
          tel:'13067788'
        },
        {
          danwei:'a公司',
          gangwei:'打工仔',
          shijian:'997',
          dizhi:'太阳系',
          xinzi:123,
          tel:'13067788'
        },
        {
          danwei:'a公司',
          gangwei:'打工仔',
          shijian:'997',
          dizhi:'太阳系',
          xinzi:123,
          tel:'13067788'
        }
      ],
      testTxt:"卡士大夫 沙拉豆腐花甲可乐是绝代风华看手机的画风手机导航风科技收费的卡视角的发货开始接单",
      qzzp: [],
      fwzs: [],
      syps: [],
      scjg: [],
      yhml: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aaaa = []
    for(var i=0; i < this.data.machining.length ;i++){
      aaaa.push('')
    }
    this.setData({
      isShowTel:aaaa
    })
    this.getInfo()
  },
  getInfo:function(){
    const that = this
    request.get(that.data.url + '/api/ServiceMarket/index',{
      success:function(res){
        if (res.data.status != 200) {
          return 
        }
        var qzzp = this.infoAddFlag(res.data.result.zp)
        var fwzs = this.infoAddFlag(res.data.result.zs)
        var syps = this.infoAddFlag(res.data.result.sy)
        var scjg = this.infoAddFlag(res.data.result.gc)
        var yhml = this.infoAddFlag(res.data.result.yh)
        that.setData({
          qzzp,
          fwzs,
          syps,
          scjg,
          yhml,
        })
      }
    })
  },
  toBannerLink:()=>{
    wx.navigateTo({
      url: '/pages/Photography/index',
    })
  },
  swiperChange: function (e) {
    console.log(e)
    this.setData({
      currentSwiperIndex: e.detail.current
    })
},
showTelNumber:function(e){
  const index = e.currentTarget.dataset.index
  var aa = [...this.data.isShowTel]
  aa[index] = !this.data.isShowTel[index]
  this.setData({
    isShowTel:aa
  })

},
toIndex:function(){
  wx.reLaunch({
    url: '/pages/index/index/index',
  })
},
// 对数据处理 增加flag属性
infoAddFlag:function(arr){
  var tempArr = arr.map((item)=>{
    item.flag = false
    return item
  })
  return tempArr
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
  backToTop:function(){
    wx.pageScrollTo({
      duration: 1000,
      scrollTop: 0
    })
  },
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})