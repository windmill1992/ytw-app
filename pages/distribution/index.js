// pages/distribution/index.js
var request = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataLength: 0,
    isAllChecked: false,
    chengkOneState:[],
    goods: [],
    pramas: [],
    mapGoods: [],
    inputAllValue:1,
    oldPrice: [],
    goods_id:'',
    imageShow: false,
    imgSrc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const that = this
    this.setData({
      goods_id:options.good_id,
      storeId:options.store_id
    })

    request.get('/api/Distribut/getGoodsPriceInfo', {
      data: {
        goods_id: options.good_id,
      },
      failRollback: true,
      success: function(res) {
        // console.log(res)
        const { result } = res.data
        const length = result.length
        const oldPrice = result.map((item)=>{
          return item.price
        })
        const chengkOneState = result.map(()=>{return false})
        const spec_item = result.map((item)=>{
          return item.spec_item
        })
        var mapGoods1 = [...result]
        var mapGoods = mapGoods1.map((item)=>{
          item.isChecked = true
          item.newPrice = Number(item.each_hand_unit_price)
          item.price = Number(item.each_hand_unit_price)
          item.value = Number(item.each_hand_unit_price)
          if(item.spec_item[0].s_name == "货号颜色"){
            item.spec_item = item.spec_item.reverse()
          }
          // item.spec_item[1].item = Number(item.spec_item[1].item)
          return item
        })
        that.setData({
          allGoods: res.data.result,
          goods: result,
          pramas: spec_item,
          dataLength: length,
          chengkOneState:chengkOneState,
          mapGoods: mapGoods,
          oldPrice: oldPrice
        })
      }
    });

  },

// 单选全选不全选处理
checkAll: function(){
  this.setData({
    isAllChecked: !this.data.isAllChecked
  })
  var arr2 = this.data.chengkOneState.map(()=> this.data.isAllChecked)
  this.setData({
    chengkOneState: arr2
  })
},
checkItem: function(e){
  console.log(this.data.mapGoods)
  var current = e.currentTarget.dataset.index
  var arr3 = this.data.chengkOneState.map((item,index)=>{
    return index == current? !item:item
  })
  var map1 = [...this.data.mapGoods]
  map1[current].isChecked = !map1[current].isChecked
  this.setData({
    chengkOneState: arr3,
    mapGoods: map1
  })
  if(arr3.filter((item)=>{return item == true}).length === this.data.dataLength ){
    this.setData({
      isAllChecked: true
    })
  }
  this.data.chengkOneState.forEach((item)=>{
    if (!item) {
      this.setData({
        isAllChecked: false
      })
    }
  })
},
// 点击全部加减部分处理
subAll: function(){
  var subMapGoods1 = [...this.data.mapGoods]
  subMapGoods1.forEach((item)=>{
    if (item.price > item.newPrice) {
      return wx.showToast({
        title: '分销价格，不能低于拿货价格',
        icon: 'none',
        duration: 1500
      })
    }
    item.newPrice = (item.newPrice - Number(this.data.inputAllValue)).toFixed(2)
  })
  this.setData({
    mapGoods: subMapGoods1
  })
},
addAll:function(){
  var subMapGoods2 = [...this.data.mapGoods]
  subMapGoods2.forEach((item)=>{
    item.newPrice = (item.newPrice - 0 + Number(this.data.inputAllValue)).toFixed(2)
  })
  this.setData({
    mapGoods: subMapGoods2
  })
},
inputAll:function(e){
  this.setData({
    inputAllValue: e.detail.value
  })
},
subOne:function(e){
  var index = e.currentTarget.dataset.index
  if (this.data.mapGoods[index].newPrice < this.data.mapGoods[index].price) {
    wx.showToast({
      title: '分销价格，不能低于拿货价格',
      icon: "none",
      duration: 1500
    })
    return
  }
  var subMapGoods3 = [...this.data.mapGoods]
  subMapGoods3[index].newPrice = subMapGoods3[index].newPrice -  1
  this.setData({
    mapGoods: subMapGoods3
  })
  // console.log(this.data.mapGoods)
},
addOne:function(e){
  var index = e.currentTarget.dataset.index
  var subMapGoods3 = [...this.data.mapGoods]
  subMapGoods3[index].newPrice = Number(subMapGoods3[index].newPrice) + 1
  this.setData({
    mapGoods: subMapGoods3
  })
},
inputOne:function(e){
  var index = e.currentTarget.dataset.index
  var subMapGoods4 = [...this.data.mapGoods]
  subMapGoods4[index].newPrice = e.detail.value
  this.setData({
    mapGoods: subMapGoods4
  })
},
submitGoods: function(){
  const that = this
  var isC = 0
  var params = []
  // this.data.mapGoods.forEach((item)=>{
  //   if (item.isChecked) {
  //     isC += 1
  //   }
  // })
  this.data.mapGoods.forEach((item,index)=>{
    if (item.newPrice < item.price) {
      return wx.showToast({
        title: '销售价必须大于拿货价',
        duration:1000,
        icon:"none"
      })
    }
  })
    this.data.mapGoods.forEach((item,index)=>{
      console.log(item)
      params.push({
        item_id: item.id,
        cost: item.price,
        price: item.newPrice * item.spec_item[0].item,
        add_price: item.newPrice - item.price
      })
    })
    
    // console.log(params)
    // console.log(this.data.mapGoods)
    // return
    request.post('/api/Distribut/add_goods', {
      data: { 
          goods_ids: that.data.goods_id,
          terminal: "miniapp",
          item_id: JSON.stringify(params)
      },
      success: function (res) {
        if ( res.data.status ==1 ) {
          wx.showToast({
            title: '分销成功，已展示到您的店铺，快去查看吧！',
            mask: true,
            duration: 1500,
            icon: "success"
          })
         wx.showModal({
            title: '分销成功',
            confirmText: '前往店铺',
            cancelText: '返回',
            content: '已展示到您的店铺，快去查看吧！',
            success (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/distribut0/shop/shop',
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '分销失败！',
            mask: true,
            duration: 1500,
            icon: "none"
          })
        }
      }
  });
  
},
back1:function(){
  wx.navigateBack({
    delta: 1,
  })
},
preImg:function(e){
  var src = e.currentTarget.dataset.src
  this.setData({
    imgSrc: src,
    imageShow: true
  },function(){

  })
},
onImageClose:function(){
  this.setData({
    imageShow: false
  })
},
  /**
   * 
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})




