//index.js
var app = getApp();
var request = app.request;

Page({
  data: {
      user: {},
      distribut:{},
    shopping:{},
    index_img: 1,// 须知
  },
    onShow: function () {
            this.commission();     
    },
  // 用户须知
  changeTab: function (e) {
    var index_img = this.data.index_img;
    if (index_img == 1) {
      this.setData({ index_img: 2 });
    } else {
      this.setData({ index_img: 1 });
    }
  },
    commission: function () {
        var that = this;
        request.post('/api/Distribut/distribut_detail', {
            successReload: true,
            success: function (res) {
                if (res.data.result) {
                  that.setData({ shopping: res.data.result.shopping,distribut: res.data.result.distribut, user: res.data.result.user})
                }
            }
        });
    },
})
