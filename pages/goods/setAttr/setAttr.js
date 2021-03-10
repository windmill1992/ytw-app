// pages/goods/setAttr/setAttr.js
var request = require("../../../utils/request")
var app = getApp()
var setting = app.globalData.setting;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: setting.url,
    borderLeft: 0,
    CategoryList1:[],
    pId1:0,
    pId2:0,
    pId3:0,
    name1: '',
    name2: '',
    name3: '',
    curLevel: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id3
    if (id != 0) {//不是
      
    }
    this.getCategoryList(this.data.pId1)
  },
  chooseTitle(e){
    var type = e.currentTarget.dataset.type
    if (type > this.data.curLevel) {
      return
    }
    var left = (type - 1) * 33.33 + '%'
    if (this.data.borderLeft == left) {
      return
    }
    this.setData({
      borderLeft: left
    })
    if (type == 1) {
      this.setData({
        name1: '',
        name2: '',
        name3: '',
        curLevel: 1,
        pId2: 0,
        pId3: 0
      })
      this.getCategoryList(0)
    } else if (type == 2 && this.data.pId1 != 0) {
      this.setData({
        name3: '',
        curLevel: 2,
        pId3: 0
      })
      this.getCategoryList(this.data.pId1)
    }
  },
  chooseCate:function(e){
    var id = e.currentTarget.dataset.id
    var level = e.currentTarget.dataset.level
    var name = e.currentTarget.dataset.name
    if (level == 1) {
        this.setData({
          borderLeft: level * 33.33 + '%',
          pId1: id,
          name1: name,
          curLevel: 2
        },function(){
          this.getCategoryList(id)
        })

    } else if(level == 2) {
      this.setData({
        borderLeft: level * 33.33 + '%',
        pId2: id,
        name2: name,
        curLevel: 3
      },function(){
        this.getCategoryList(id)
      })
    } else if (level == 3) {
      this.setData({
        name3: name,
        pId3: id
      },()=>{
        var prevPage = null
        let pages = getCurrentPages();
        if (pages.length >= 2) {
          prevPage = pages[pages.length - 2];
        } else {return}
        prevPage.setData({
          cat_id1: this.data.pId1,
          cat_id2: this.data.pId2,
          cat_id3: id,
          step: 1,
          categoryValue: name
        })
        wx.navigateBack()
      })
    }
    

  },
  getCategoryList(id){ // 获取1级
		var that = this
    request.get(that.data.url + '/api/Store/addStepOne',{
			data: {
				parent_id: id
			},
			success:function(res){
				that.setData({
          CategoryList1: res.data.data
        })
			}
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})