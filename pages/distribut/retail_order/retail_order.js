//index.js
var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var common = require('../../../utils/common.js');
var util = require('../../../utils/util.js');
import LoadMore from '../../../utils/LoadMore.js'
var load = new LoadMore;

Page({
  data: {
    currentTab: 0,
    currentPage:1,
    teamOrder:null,
    page:3,
    url: setting.url,
    store_type: '',
    isiphoneX: wx.getStorageSync('isiphoneX')||false,
    is_A: false
  },
    onLoad: function () {
        load.init(this, '', 'teamOrder');
        this.getTeamOrder(this.data.currentTab);
        var userInfo = wx.getStorageSync('app:userInfo');
        if (userInfo) {
            if (userInfo.store_id >0 && userInfo.is_B != 1 ) {
                this.setData({
                    is_A: true
                })
            }
        }
    },
    getTeamOrder: function (status){
        var that = this;
        var where = '';
        if (status == 1){
            where = 0
        } else if (status == 2){
            where = '1,2'
        } else if (status == 3){
            where = 3;
        }
        load.request('/api/Distribut/order_list?status=' + where + '&p=' + that.data.currentPage, function (res) {
            console.log(res.data.store_type)
            that.setData({
                store_type: res.data.store_type
            },function(){
                console.log(that.data.store_type)
            })
            that.data.currentPage++;
            if (res.data.result) {
                res.data.result.forEach(function (val, index, arr) {
                    val.create_time = util.format(val.create_time, 'yyyy-M-d');
                });
            }  
        })
    },
  //事件处理函数
  clickTab: function(e){
    var that = this;
      if (that.data.currentTab != e.target.dataset.current) {    
      that.setData({
        currentTab: e.target.dataset.current,
      })
        that.resetData();
          that.getTeamOrder(e.target.dataset.current);
    }
  },

    distributTopages: function (e) {
        if (this.data.is_A == 0 && e.currentTarget.dataset.idx == 5) {
            return wx.showToast({
              title: '开发中~',
              icon: 'none'
            })
          }
        common.todistribut(e.currentTarget.dataset.idx, this.data.page);
    },
    //重置数据
    resetData: function () {
        load.resetConfig();
        this.data.teamOrder = null;
        this.data.currentPage = 1;
    },

    onReachBottom: function () {
        if (load.canloadMore()) {
            this.getTeamOrder(this.data.currentTab);
        }
    },

    onPullDownRefresh: function (e) {
        this.resetData();
        this.getTeamOrder(this.data.currentTab);
    },
    onShow:function(){
       
    },
    addNewGoods:function(){
      wx.navigateTo({
        url: '/pages/goods/addGoods/index?goods_id=0&is_A=' + (this.data.is_A == true ? 1 : 0),
      })
    }
})
