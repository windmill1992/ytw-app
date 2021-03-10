var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var util = require('../../../utils/util.js');
var common = require('../../../utils/common.js');

Page({
    data: {
        webUrl: '',
    },

    onLoad: function (options) {
      if (options.oauth) {
        console.log(11111)
        var url = request.modifyUrl(options._url);
        delete options._url;
        var params = util.Obj2Str(options); //剩下的参数拼成get参数
        this.setData({ webUrl: url + '&' + params });
        app.showLoading(null, 1500);
      } else {
        console.log(22222)
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        var url = prevPage.data.webUrl; //取上页data里的数据
        url = request.modifyUrl(url);
        //处理webview业务域名需要添加https
        url = common.checkRequestIsHttps(url);
        this.setData({ webUrl: url + '#wechat_redirect' });
        app.showLoading(null, 1500);
      }
      console.log(33333)
       
    },
    
})