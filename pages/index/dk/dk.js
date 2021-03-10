const app = getApp();
const request = app.request;
const setting = app.globalData.setting;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:[],//轮播图
    list:[],//店铺列表
    dialog:false,//弹窗
    businessId:0,//商圈Id
    pageIndex:1,//页码数
    pageSize:10,//请求条数
    storeBusiness:[],//商圈
    isDone: false,//默认没有加载完
    mode: '',
    is_apply: 0,//默认不是
    supportPageScroll: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    if (options.key_word) {
      this.setData({
        mode: options.key_word
      })
    } else {
      that.getBanner();
    }
    console.log(options)
    that.getList();
    if (wx.pageScrollTo) {
      this.setData({
        supportPageScroll: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getList() {
    let that = this;
    if (this.data.isDone) {
      wx.showToast({
        title: '已加载全部',
        icon: 'none',
      })
      return
    }
    var defaultData = {
      store_business:that.data.businessId,
      page:that.data.pageIndex,
      pageSize:that.data.pageSize,
    }
    var searchData = {
      page: that.data.pageIndex,
      pageSize: that.data.pageSize,
      key_word: that.data.mode
    }
    request.get('/api/Activity/notchRanking', {
      data: that.data.mode ? searchData : defaultData,
      success: function (res) {
        console.log(res)
        if (res.data.status == 1 ) {
          if (res.data.result.length > 0) {
            var  tempArr = res.data.result;
            var list = that.data.list
            tempArr.forEach(item=>{
              item.current = 0
            })
            list = list.concat(tempArr)
            that.setData({
              list: list
            })
          } else {
            wx.showToast({
              title: '已加载全部',
              icon: 'none',
            })
            that.setData({
              isDone: true
            })
          }
        }
       
      }
    });
  },
  setall(){
    this.setData({
      businessId:0
    })
    this.getList();
    this.close();
  },

  setItem(e){
    let that = this;
    that.setData({
      businessId:e.currentTarget.dataset.id,
      list: [],
      isDone: false,
      pageIndex: 1
    });
    that.getList();
    that.close();
  },
  close(){
    this.setData({
      dialog:false
    })
  },
  getBanner() {
    let that = this;
    request.get('/api/Activity/business', {
      data: {},
      success: function (res) {
       let tempArr = res.data.result.ad;
       tempArr.forEach(item=>{
         item.ad_code = setting.url+item.ad_code
       })
       that.setData({
         banner:tempArr,
         storeBusiness:res.data.result.store_business
       })
      }
    });
  },

  showDialog(){
    this.setData({
      dialog:true
    })
  },

    // 去商品详情
    goDetail(e){
      let item = e.currentTarget.dataset;
      wx.navigateTo({
        url: '/pages/goods/goodsInfo/goodsInfo?store_id='+item.store_id+'&goods_id='+item.goods_id,
      })
    },

    // 店铺详情
    goStore(e){
      wx.navigateTo({
        url: '/pages/store/index/index?store_id='+e.currentTarget.dataset.store_id,
      })
    },

  // 下一页
  next(e){
    let that = this;
    let tempArr = that.data.list;
    tempArr.forEach(item=>{
      if(item.store_id== e.currentTarget.dataset.id){
        item.current++;
        if(item.current == item.goods_list.length){
          item.current = 0;
        }
      }
    })
    that.setData({
      list:tempArr
    })
  },
  // 上一页
  before(e){
    let that = this;
    let tempArr = that.data.list;
    tempArr.forEach(item=>{
      if(item.store_id== e.currentTarget.dataset.id){
        if(item.current == 0){
          item.current = item.goods_list.length
        }
        item.current--;
      }
    })
    that.setData({
      list:tempArr
    })
  },

  // 轮播切换
  swiperChange(e){
    let that = this;
    let tempArr = that.data.list;
    tempArr.forEach(item=>{
      if(item.store_id== e.currentTarget.dataset.id){
        item.current = e.detail.current
      }
    })
    that.setData({
      list:tempArr
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      pageIndex:1,
      list: []
    });
    this.getList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let temp = this.data.pageIndex;
    temp++;
    this.setData({
      pageIndex:temp,
    });

    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
     /** 返回顶部 */
     doScrollTop: function() {
      wx.pageScrollTo({
        scrollTop: 0
      });
    },
})