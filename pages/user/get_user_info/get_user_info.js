var app = getApp();
var request = app.request;

Page({
    data: {
        url: app.globalData.setting.url,
        resourceUrl: app.globalData.setting.resourceUrl,
        requestData: null,
    },

    onLoad: function () {
        var that = this;
      wx.getSystemInfo({
        success(res) {
          that.setData({
            windowWidth: res.windowWidth,
            windowHeight: res.windowHeight,
          })

        }
      })
    },
    
    //返回的时候也可以刷新
    onShow: function () {
    },

    navigate:function(){
        var pages = getCurrentPages();
        var data = pages[pages.length  - 2];
        if (data.route == 'pages/index/index/index'){
            wx.navigateBack({
                delta:2
            })
        }else{
            wx.reLaunch({
                url: '/pages/index/index/index',
            })
        }                   
    },
     
    bindGetUserinfo:function(res){
        var that = this;
        if (res.detail.userInfo != undefined){
            try {
                wx.setStorageSync('wx_user_info', res.detail);
                if (res.detail.userInfo != undefined) {
                    app.globalData.wechatUser = res.detail.userInfo;
                  app.auth.checkLogin(app.globalData.code, res.detail, function (loginData) {
                        // console.log("showSuccess...");
                        // console.log(loginData);
                        app.showSuccess('登录成功', function () {
                            wx.removeStorageSync('first_leader');
                            wx.removeStorageSync('unique_id');
                            wx.navigateBack();
                        });
                    });
                } else {
                    // console.log('bindGetUserinfo fail 2. data is null');
                }
            } catch (e) {
                // console.log(e);
            }
        }else{
            // console.log('bindGetUserinfo fail 1 . data is null');
        }
    },
    //暂不登录
    temporaryUnLogin:function(){
        var pages = getCurrentPages()
        var historys = pages.map((item)=>{
            return item.route
        })
        if (historys.indexOf('pages/newjoin/join4/join4')!= -1) {
            wx.reLaunch({
              url: '/pages/index/index/index',
            })
            return
        }
        // app.setUnLoad(-1)
        wx.navigateBack({
          delta: 1,
        })
    }

});