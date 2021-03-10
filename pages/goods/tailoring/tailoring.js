var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:setting.url,
		src:'',
		width:250,//宽度
    height: 250,//高度
    type: '',
    disable_ratio: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.img_type)
		this.cropper = this.selectComponent("#image-cropper");
    this.setData({
      src: options.src,
      type: options.img_type || 'c',
      disable_ratio: options.img_type == 'b' ? false : true
    })
    console.log(this.data.type)
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

  },
  	// 裁剪
	showCropper:function(){
		this.setData({
			showCropper: true
		})
		this.cropper._initCanvas()
	},
	cropperload(e){
			console.log("cropper初始化完成");
	},
	loadimage(e){
			console.log("图片加载完成",e.detail);
			//重置图片角度、缩放、位置
			this.cropper.imgReset();
	},
	clickcut(e) {
			console.log(e.detail);
			//点击裁剪框阅览图片
			wx.previewImage({
					current: e.detail.url, // 当前显示图片的http链接
					urls: [e.detail.url] // 需要预览的图片http链接列表
			})
	},

	getImg() {
    wx.showLoading({
      title: '正在生成...',
      mask: true
    })
		var that = this
    this.cropper.getImg(res => {
			wx.uploadFile({
				filePath: res.url,
				name: 'qinzi_imgs',
				url: that.data.url + '/api/newjoin/upload_qianzi_img',
				success:function(res){
					var result = JSON.parse(res.data)
          // console.log(result.result)
          that.savePreData(result.result)
				}
			})
    })
	},
	saveImg(){
    console.log('saveImg')
    this.getImg()
  },
  cancelImg(){
    wx.navigateBack()
  },
  savePreData:function(src){
    if (this.data.type == 'a' || this.data.type == 'c') {
        var prevPage = null
        let pages = getCurrentPages();
        if (pages.length >= 2) {
          prevPage = pages[pages.length - 2]; //上一个页面
        } else {return}
        var preListData = prevPage.data.listData
        var index =	preListData.findIndex((item)=>{
          return item.dragId == prevPage.data.curId
        })
        if (index == -1) {
          return
        }
        preListData[index].spec_img = src
        prevPage.setData({
          listData: preListData,
          curId: 0,
          uploadFlag: true
        })
        wx.hideLoading({
          success: (res) => {},
        })
        setTimeout(()=>{wx.navigateBack()},0)//延迟异步执行
        console.log("a c 结束")
      } else {
        var prevPage = null
        let pages = getCurrentPages();
        if (pages.length >= 2) {
          prevPage = pages[pages.length - 2]; //上一个页面
        } else {return}
        var preListData = prevPage.data.listData2
        var index =	preListData.findIndex((item)=>{
          return item.dragId == prevPage.data.curId
        })
        if (index == -1) {
          return
        }
        preListData[index].spec_img = src
        prevPage.setData({
          listData2: preListData,
          curId: 0,
          uploadFlag: true
        })
        wx.hideLoading({
          success: (res) => {},
        })
        setTimeout(()=>{wx.navigateBack()},0)//延迟异步执行
        console.log("b 结束")
      }
  },
  reset(){
    this.cropper.imgReset()
  }

})