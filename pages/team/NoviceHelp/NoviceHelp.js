
var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var Video = {stop:()=>{},seek:()=>{}}
var num = -1
Page({
  data: {
    url: setting.url,
    public: true,
    type: 'a',
    video: {factory:[],buyer: []},
    vviiddeeoo: ''
  },
  onLoad: function (options) {
    var isB = wx.getStorageSync('app:userInfo').is_B || 0
    this.setData({
      type: isB == 1 ? 'b' : 'a'
    })
    this.getVideo()
    Video = wx.createVideoContext('video', this)
  },
  seeVideo(e){
    var index = e.currentTarget.dataset.index
    if (this.data.type == 'a') {
      this.setData({
        vviiddeeoo: this.data.video.factory[index].video_path
      })
    } else {
      this.setData({
        vviiddeeoo: this.data.video.buyer[index].video_path
      })
    }
    Video.requestFullScreen()
    Video.play()
  },
  switchType(e){
    var type = e.currentTarget.dataset.type
    this.setData({
      type
    })
    Video.stop()
  },
  fullscreenchange(e){
    var isFullScreen = e.detail.fullScreen || e.detail.fullscreen
    if (isFullScreen) {return
    } else {
      Video.stop()
      Video.seek(0)
    }
  },
  getVideo(){
    var that = this
    request.get(that.data.url + '/api/Help/videoCurseList',{
      data:{},
      success: (res)=>{
        that.setData({
          video: res.data.result
        })
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

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})