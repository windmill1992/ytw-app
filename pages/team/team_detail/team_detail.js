// team_detail.js
var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var util = require('../../../utils/util.js');
import LoadMore from '../../../utils/LoadMore.js'
var load = new LoadMore;

Page({
  data: {
    url: setting.url,
    openSpecModal: false, //是否打开规格弹窗
    foundId: 0,
    order_id: 0,
    team: null,
    teamFollow: null,
    teamFound: null,
    serverTime: 0,
    teamGoods: null,
    teamMsg: {
      msg: '',
      btnTxt: '',
    },
    btn_status:0,
    timer: null,
    goodsInputNum: 1,
    currentPage: 1,
  },

  onLoad: function(options) {
      //以前有登录过，则直接登录
      if (app.auth.hadAuth()) {
          app.getUserInfo();
      }
    load.init(this, '', 'teamGoods');
    var foundId = typeof options.foundId == 'undefined' ? 0 : options.foundId;
    var order_sn = typeof options.order_sn == 'undefined' ? 0 : options.order_sn;
    this.setData({
      foundId: foundId,
      order_sn: order_sn
    });
    this.getTeamGoods();
    this.getTeamGoodlist();
  },

  getTeamGoods: function() {
    var that = this;
    request.get('/api/Team/found', {
      data: {
        id: that.data.foundId,
        order_sn: that.data.order_sn,
      },
      failRollback: true,
      success: function(res) {
        var result = res.data.result;
        //遍历头像
        if (result.teamFollow.length >0){
          for (let i in result.teamFollow){
            if (result.teamFollow[i].follow_user_head_pic.indexOf('http') < 0 && result.teamFollow[i].follow_user_head_pic.indexOf('https') < 0) {
              result.teamFollow[i].follow_user_head_pic = that.data.url + result.teamFollow[i].follow_user_head_pic;
            }
          }
          
        }
        if (result.teamFound) {
          if (result.teamFound.head_pic.indexOf('http') < 0 && result.teamFound.head_pic.indexOf('https') < 0) {
            result.teamFound.head_pic = that.data.url + result.teamFound.head_pic;
            }
        }
        that.setData({
          serverTime: result.server_time,
          team: result.team,
          teamFollow: result.teamFollow,
          teamFound: result.teamFound,
        });
        let uid = app.globalData.userInfo?  app.globalData.userInfo.user_id:0;
        if (result.teamFound.status == 0) {
          that.setData({
            'teamMsg.msg': "待开团",
            'teamMsg.btnTxt': "一键发起拼单",
            btn_status:0,
          });
        } else if (result.teamFound.status == 1) {
          if (uid == that.data.teamFound.user_id) { //团长进入拼单页面
            that.setData({
              'teamMsg.msg': '',
              'teamMsg.btnTxt': "邀请好友拼单",
              btn_status: 1,
            });
          } else { //好友进入
            var status = false;
            for (var i = 0; i < that.data.teamFollow.length; i++) {
              if (that.data.teamFollow[i].follow_user_id == uid) {
                status = true;
              }
            }
            if (status == true) {
              that.setData({
                'teamMsg.msg': '',
                'teamMsg.btnTxt': "已参与拼单",
                btn_status: 2,
              });
            } else {
              that.setData({
                'teamMsg.msg': '参与拼单',
                'teamMsg.btnTxt': "一键参与拼单",
                btn_status: 3,
              });
            }
          }

          that.createTimer();
        } else if (result.teamFound.status == 2) {
          that.setData({
            'teamMsg.msg': "拼单已满",
            'teamMsg.btnTxt': "一键发起拼单",
            btn_status: 4,
          });
        } else {
          that.setData({
            'teamMsg.msg': "拼单失败",
            'teamMsg.btnTxt': "一键发起拼单",
            btn_status: 5,
          });
        }
        //初始化选择的规格
        that.initSpecsPrice();
      }
    });
  },
  /** 检查购买的数量 */
  checkCartNum: function (num) {
    var stock = this.data.team.goods.store_count;
    if (this.data.team.goods.spec_goods_price.length > 0) {
      stock = this.data.team.goods.spec_goods_price[this.data.specSelect].store_count;
    }
    if (num > stock || stock == 0) {
      num = stock;
    } else if (num < 1) {
      num = 1;
    }
    this.setData({
      goodsInputNum: num
    });
  },
  createTimer: function () {
    var that = this;
    var startTime = (new Date()).getTime();
    this.data.timer = setInterval(function() {
      var teamFound = that.data.teamFound;
      var diffTime = startTime - that.data.serverTime * 1000;
      teamFound.remainTime = util.transTime(teamFound.found_end_time * 1000 - (new Date()).getTime() + diffTime);
      if (teamFound.remainTime.hour <= 0 && teamFound.remainTime.minute <= 0 && teamFound.remainTime.second <= 0) {
        clearInterval(that.data.timer);
        that.getTeamGoods();
      }
      that.setData({
        teamFound: teamFound
      });
    }, 1000);
  },

  onUnload: function() {
    clearInterval(this.data.timer);
  },

  onShareAppMessage: function (options){
    let that = this;
    let title = that.data.team.act_name;
    let img = that.data.url + that.data.team.share_img;
    // let path = '/pages/detail/detailpages/team/team_detail/team_detail?foundId=' + that.data.foundId;
    let path = '/pages/team/team_detail/team_detail?foundId=' + that.data.foundId;
    if (options.from == 'button') {
      return {
        title: title,
        path: path,
        imageUrl: img,
      }
    }
  },

  getTeamGoodlist: function() {
    var that = this;
    var requestUrl = '/api/Team/ajaxGetMore?p=' + that.data.currentPage;
    load.request(requestUrl, function(res) {
      that.data.currentPage++;
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.reloadGoodList();
  },

  //重置数据
  reloadGoodList: function() {
    load.resetConfig();
    this.data.teamGoods = null;
    this.data.currentPage = 1;
    this.getTeamGoodlist();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (load.canloadMore()) {
      this.getTeamGoodlist();
    }
  },

  /** 关闭规格弹窗 */
  closeSpecModal: function() {
    this.setData({
      openSpecModal: false
    });
  },

  /** 打开规格弹窗 */
  openSpecModel: function() {
    this.setData({
      openSpecModal: true
    });
  },

  /** 增加购买的商品数量 */
  addCartNum: function(e) {
    var num = this.data.goodsInputNum + 1;
    this.setData({
      goodsInputNum: num
    });
  },

  /** 减少购买的商品数量 */
  subCartNum: function(e) {
    var num = this.data.goodsInputNum - 1;
    if (num < 1) {
      num = 1;
    }
    this.setData({
      goodsInputNum: num
    });
  },

  /** 输入购买的数量 */
  inputCartNum: function(e) {
    var num = Number(e.detail.value);
    this.setData({
      goodsInputNum: num
    });
  },
    onShow: function () {
        if (wx.getStorageSync('team_info_login')) {
            wx.removeStorageSync('team_info_login');
            clearInterval(this.data.timer);
            this.getTeamGoods();
        }
    },

  /** 立即购买 */
  buyNow: function() {
      //检查用户是否登录方可操作立即购买
      if (!app.auth.isAuth()) {
          this.setData({
              openSpecModal: !this.data.openSpecModal
          });
          wx.setStorageSync('team_info_login', true);
          app.showLoading(null, 1500);
          app.getUserInfo();
          return;
      }
    var that = this;
    var data = that.data.team;
    var data = {
      // team_id: that.data.team.team_id,
      // goods_num: that.data.goodsInputNum,
      // found_id: that.data.teamFound.status == 1 ? that.data.foundId : '',
      item_id: data.goods.spec_goods_price.length > 0 ? data.goods.spec_goods_price[that.data.specSelect].item_id : '',
      goods_id: data.goods.goods_id,
      goods_num: that.data.goodsInputNum,
      found_id: that.data.teamFound.status == 1 ? that.data.foundId : '',
    };
    request.get('/api/Team/addOrder', {
      data: data,
      success: function(res) {
        var result = res.data.result;
        wx.navigateTo({
          url: '/pages/team/team_confirm/team_confirm?orderSn=' + res.data.result.order_sn
        });
      }
    });
  },

  /** 初始化所有规格 */
  initSpecsPrice: function() {
    var specSelect = 0; //初始化选中第一个规格
    var specs = this.data.team.goods.spec_goods_price;
    var team_activity = this.data.team;

    if (specs.length == 0) { //没有规格
      this.setData({
        'select.prom_id': team_activity.team_goods_item[0].team_id,
        'select.teamPrice': team_activity.team_goods_item[0].team_price,
        'select.price': team_activity.team_goods_item[0].price ? team_activity.team_goods_item[0].price : team_activity.goods.shop_price,
        'select.stock': team_activity.team_goods_item[0].store_count ? team_activity.team_goods_item.store_count : team_activity.goods.store_count,
        'select.needer': team_activity.needer,
      });
      return;
    }
    if (this.data.optionItemId) { //指定规格
      for (var i = 0; i < specs.length; i++) {
        if (specs[i].item_id == this.data.optionItemId) {
          specSelect = i;
          break;
        }
      }
    }
    //生成子规格组(spec)的各自选中项
    var specIds = specs[specSelect].key.split("_");
    var list = team_activity.goods.spec;
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].spec_item.length; j++) {
        if (util.inArray(list[i].spec_item[j].id, specIds)) {
          list[i].selectItemId = list[i].spec_item[j].id;
          break;
        }
      }
    }

    this.setData({
      specSelect: specSelect,
      'team.goods.spec': list,
      'team.goods.spec_goods_price': specs,
      'select.prom_id': specs[specSelect].prom_id,
      'select.teamPrice': this.data.team.team_goods_item[0].team_price,
      'select.price': specs[specSelect].price,
      'select.stock': specs[specSelect].store_count,
      'select.needer': team_activity.needer,
    });
  },


  /** 点击规格按钮的回调函数 */
  selectSpec: function(e) {
    //对商品数量进行判断，对库存进行判断
    var itemId = e.currentTarget.dataset.itemid;
    var listIdx = e.currentTarget.dataset.listidx;
    var list = this.data.team.goods.spec;
    var team_activity = this.data.team;

    if (list[listIdx].selectItemId == itemId) {
      return;
    }
    list[listIdx].selectItemId = itemId;
    var newSpecKeys = [];
    for (var i = 0; i < list.length; i++) {
      newSpecKeys[i] = list[i].selectItemId;
    }
    //item排序,生成key
    var newSpecKeys = util.sortSize(newSpecKeys).join('_');
    var newSpecSelect = 0;
    var specs = this.data.team.goods.spec_goods_price;
    for (var i = 0; i < specs.length; i++) {
      if (specs[i].key == newSpecKeys) {
        newSpecSelect = i;
        break;
      }
    }

    this.setData({
      specSelect: newSpecSelect,
      'team.goods.spec': list,
      'team.goods.spec_goods_price': specs,
      'select.prom_id': specs[newSpecSelect].prom_id,
      'select.teamPrice': this.data.team.team_goods_item[0].team_price,
      'select.price': specs[newSpecSelect].price,
      'select.stock': specs[newSpecSelect].store_count,
      'select.needer': team_activity.needer,
    });
    this.checkCartNum(this.data.goodsInputNum);
  },
})