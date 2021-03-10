// account.js
var app = getApp();
import LoadMore from '../../../utils/LoadMore.js'
var load = new LoadMore;
var util = require('../../../utils/util.js');
var common = require('../../../utils/common.js');
var request = require('../../../utils/request')
Page({
  data: {
    url: app.globalData.setting.url,
    resourceUrl: app.globalData.setting.resourceUrl,
    userInfo: null,
    page: 2,
    categories: [                //切换
      { name: "全部", type: 'all' },
      { name: "收入", type: 'plus' },
      { name: "支出", type: 'minus' }
    ],
    switch: [                //切换
      { name: "余额明细", number: '1' },
      { name: "充值记录", number: '2' },
      { name: "提现记录", number: '3' }
    ],
    activeType: 'all',      //余额选中全部时
    accounts: null,
    currentPage: 1,
    show: 1,             //余额明细、充值记录、提现记录切换
    recharges: null,    //请求的充值记录
    withdrawals: null, //请求的充值记录
    type: 0,
    isiphoneX: wx.getStorageSync('isiphoneX')||false,
    is_A: false
  },
  onLoad: function (options) {
    const that = this
    if (options && options.type) {
      this.setData({ type: options.type })
    }
    // 余额明细
    var type = typeof options.type == 'undefined' ? this.data.activeType : options.type;
    load.init(this, '', 'accounts');
    this.requestAccountList(type);
    // // 充值记录


  },
  onShow: function () {
    var that = this;

    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      },function(){
        if (this.data.userInfo) {
          if (userInfo.store_id >0 && userInfo.is_B != 1 ) {
            this.setData({
                is_A: true
            })
        }
        }
      });
    }, true, false);
    
  },
  //余额明细全部，赚取，消费切换
  changeTab: function (e) {
    //重置为未加载完成，数据的重置需要手动重置
    load.resetConfig();
    this.data.accounts = null;
    this.data.currentPage = 1;
    this.requestAccountList(e.currentTarget.id);
  },
  //余额明细，充值记录，提现记录切换
  switch: function (e) {
    this.setData({
      show: e.currentTarget.id
    })
    if (this.data.show == 1) {
      this.data.accounts = null;
      this.data.currentPage = 1;
      load.init(this, '', 'accounts');
    }
    if (this.data.show == 2) {
      this.data.recharges = null;
      this.data.currentPage = 1;
      load.init(this, '', 'recharges');
      this.requestChangeList();
    }
    if (this.data.show == 3) {
      this.data.withdrawals = null;
      this.data.currentPage = 1;
      load.init(this, '', 'withdrawals');
      this.requestWithdrawalsList();
    }
  },

  //底部菜单
  distributTopages: function (e) {
    if (this.data.is_A == 0 && e.currentTarget.dataset.idx == 5) {
      return wx.showToast({
        title: '开发中~',
        icon: 'none'
      })
    }
    common.todistribut(e.currentTarget.dataset.idx, this.data.page);
  },

  //请求余额信息
  requestAccountList: function (type) {
    var that = this;
    var requestUrl = '/api/user/account_list/type/' + type + '?p=' + that.data.currentPage;
    this.setData({ activeType: type });
    load.request(requestUrl, function (res) {
      that.data.currentPage++;
      res.data.result.forEach(function (val, index, arr) {
        val.changeTimeFommat = util.format(val.change_time, 'yyyy-MM-dd  hh:mm');
      });
      wx.stopPullDownRefresh();
    });
  },
  // 请求充值记录
  requestChangeList: function () {
    var that = this;
    var requestUrl = '/api/user/recharge_list/' + '?p=' + that.data.currentPage;
    load.request(requestUrl, function (res) {
      that.data.currentPage++;
      res.data.result.forEach(function (val, index, arr) {
        val.cTimeFommat = util.format(val.ctime, 'yyyy-MM-dd');
      });
      wx.stopPullDownRefresh();
    });
  },
  // 提现记录
  requestWithdrawalsList: function () {
    var that = this;
    var requestUrl = '/api/user/withdrawals_list/type/' + that.data.type + '?p=' + that.data.currentPage;
    load.request(requestUrl, function (res) {
      that.data.currentPage++;
      res.data.result.forEach(function (val, index, arr) {
        val.createTimeFommat = util.format(val.create_time, 'yyyy-MM-dd');
      });
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom: function () {
    if (load.canloadMore()) {
      if (this.data.show == 1) {
        // 余额明细
        this.requestAccountList(this.data.activeType);
      } else if (this.data.show == 2) {
        // 充值记录
        this.requestChangeList();
      } else if (this.data.show == 3) {
        //提现记录
        this.requestWithdrawalsList();
      } 
    }
  },
  onPullDownRefresh: function (e) {
    this.data.currentPage = 1;
    load.resetConfig();
    // 余额明细
    this.data.accounts = null;
    this.requestAccountList(this.data.activeType);
    // 充值记录
    this.data.recharges = null;
    this.requestChangeList();
    //提现记录
    this.data.withdrawals = null;
    this.requestWithdrawalsList();
  }
})