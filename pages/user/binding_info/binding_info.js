// pages/user/binding_info/binding_info.js
var app = getApp();
var request = app.request;
var setting = app.globalData.setting;
var common = require('../../../utils/common.js');

Page({
  data: {
    url: setting.url,
    appName: setting.appName,
    nickName: '',
    userHeadPic: '',
    isRegist: true,
    bindMobile: '',
    bindCode: '',
    regMobile: '',
    regCode: '',
    regPwd: '',
    isAgree: false,
    canGetCode: false, //是否能获取验证码
    timer: '', //定时器名字
    countDownNum: '120', //倒计时初始值
    is_send: false,
    tipsmask: false,
    loginType: '',//登录 还是注册类型
  },

  onLoad: function(options) {
      wx.setStorageSync('bind_third_login', true);
      let userInfo = wx.getStorageSync('wx_user_info').userInfo;
    this.getName(options.nickName);
    this.setData({
      userHeadPic: options.userHeadPic?options.userHeadPic:userInfo.avatarUrl,
      nickName:options.nickName?options.nickName:userInfo.nickName
    });
    const query = wx.createSelectorQuery()                // 创建节点查询器 query
    query.selectAll('.pageBox').boundingClientRect()    // 这段代码的意思是选择Id=productServe的节点，获取节点位置信息的查询请求
    query.selectViewport().scrollOffset()                 // 这段代码的意思是获取页面滑动位置的查询请求
    query.exec((res) => {
      console.log(res)
    })
  },
  //去掉特殊字符的昵称
  getName: function(nickname) {
    var that = this;
    request.get(that.data.url + '/api/user/getname?nickname=' + nickname, {
      success: function(res) {
        that.setData({
          nickName: res.data.result.nickname
        });
      }
    })

  },

  account: function() {
    this.setData({
      isRegist: false
    });
  },

  regist: function() {
    this.setData({
      isRegist: true
    });
  },

  setMobile: function(e) {
    this.data.bindMobile = e.detail.value;
  },

  setCode: function(e) {
    this.data.bindCode = e.detail.value;
  },

  //获取验证码前检查注册账号的合法性
  getCode: function(e) {
    if (this.data.bindMobile == '') {
      app.showWarning("请输入手机号码");
      return;
    }
    var that = this;
    request.post('/Home/Api/checkBindMobile', {
      data: {
        mobile: this.data.bindMobile
      },
      success: function(res) {
        console.log(res)
        // common.sendBindSmsCode(that.data.bindMobile, function (res) {
        //   if (res.data.status == 1) {
        //     that.setData({
        //       is_send: true
        //     });
        //     that.countDown();
        //   }
        // }); 
        
        if (res.data.status != 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          return
        }
        wx.showToast({
          title: '发送成功',
        })
        request.post( that.data.url +  '/home/api/send_validate_code', {
          data: {
              mobile: that.data.bindMobile,
              scene: '1',
              type: 'user_reg',
          },
          success: function (res) {
              if (res.data.status == 1) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
                that.setData({
                  is_send: true
                });
                that.countDown();
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
          }
      });
      }
    });
  },

  setRegMobile: function(e) {
    this.data.regMobile = e.detail.value;
  },

  setRegPwd: function(e) {
    this.data.regPwd = e.detail.value;
  },

  setRegCode: function(e) {
    this.data.regCode = e.detail.value;
  },

  //获取验证码前检查注册账号的合法性  check
  getRegCode: function(e) {
    if (this.data.regMobile == '') {
      app.showWarning("请输入手机号码");
      return;
    }
    var that = this;
    request.post('/Home/Api/checkRegMobile', {
      data: {
        mobile: this.data.regMobile
      },
      success: function(res) {
        common.sendBindSmsCode(that.data.regMobile, function (res) {
          if (res.data.status == 1) {
            that.setData({
              is_send: true
            });
            that.countDown();
          }
        });
      }
    });
  },

  check: function() {
    this.setData({
      isAgree: !this.data.isAgree
    });
  },

  //绑定已有账号
  bindAccount: function() {
    // return
    var that = this;
    if (this.data.regMobile == '') {
      app.showWarning("请输入手机号码");
      return;
    }
    if (this.data.regCode == '') {
      app.showWarning("请输入验证码");
      return;
    } 
    if (!this.data.isAgree) {
      app.showWarning("请同意协议");
      return;
    }
    request.post('/api/user/bind_account', {
      data: {
        mobile: that.data.regMobile,
        verify_code: that.data.regCode,
      },
      success: function(res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.showToast({
            title: '绑定成功', 
            icon: 'none'
          })
          wx.setStorageSync('isAuth', true);
          app.globalData.userInfo = res.data.result.user;
          wx.setStorageSync('app:userInfo', res.data.result.user);
          app.globalData.userInfo.head_pic = common.getFullUrl(app.globalData.userInfo.head_pic);
          if (wx.getStorageSync('scene_store_id') > 0) { // 判断是不是扫码进来的
            wx.removeStorageSync('scene_store_id')
            wx.navigateBack({
              delta: 2,
            })
            return
          }
          wx.reLaunch({
            url: '/pages/index/index/index'
          });
          
        }
        if (res.data.status == 0) {
          app.showTextWarining(res.data.msg);
        }
        // typeof cb == "function" && cb(app.globalData.userInfo, app.globalData.wechatUser);
        // app.showSuccess('绑定成功', function() {
        //     wx.removeStorageSync('bind_third_login');
        //     wx.reLaunch({
        //       url: 'pages/newjoin/join1/join1',
        //     })
        // });
      }
    });
  },
  onUnload: function() {
      if (wx.getStorageSync('bind_third_login')) {
          app.auth.clearAuth();
      }
  },
  //注册并绑定
  bindReg: function() {
    var that = this;
    if (this.data.regMobile == '') {
      app.showWarning("请输入手机号码");
      return;
    }
    // if (this.data.regPwd == '') {
    //   app.showWarning("请输入密码");
    //   return;
    // }
    // if (this.data.regPwd.length < 6 || this.data.regPwd.length > 18) {
    //   app.showWarning("密码长度不合法");
    //   return;
    // }
    if (this.data.regCode == '') {
      app.showWarning("请输入验证码");
      return;
    }
    if (!this.data.isAgree) {
      app.showWarning("请同意协议");
      return;
    }
    request.post('/api/user/bind_reg', {
      data: {
        mobile: that.data.regMobile,
        verify_code: that.data.regCode,
        password: that.data.regMobile.substr(-6,6), 
        nickname: that.data.nickName,
      },
      success: function(res) {
        wx.setStorageSync('isAuth', true);
        app.globalData.userInfo = res.data.result.user;
        wx.setStorageSync('app:userInfo', res.data.result.user);
        app.globalData.userInfo.head_pic = common.getFullUrl(app.globalData.userInfo.head_pic);
        typeof cb == "function" && cb(app.globalData.userInfo, app.globalData.wechatUser);
        app.showSuccess('绑定成功', function() {
            wx.removeStorageSync('bind_third_login');
            if (wx.getStorageSync('scene_store_id') > 0) {
              wx.removeStorageSync('scene_store_id')
              wx.navigateBack({
                delta: 2,
              })
              return
            }
            wx.navigateBack({
                delta: 1
            })
        });
      } 
    });
  },
  //注册协议
  agreement: function (e) {
    var webUrl = "/api/Article/service_agreement/doc_code/agreement";
    this.setData({ webUrl: webUrl });
    wx.navigateTo({ url: '/pages/index/webview/webview' });
  },
  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.setData({
      timer: setInterval(function () {
        if (countDownNum == 0) {
          clearInterval(that.data.timer);
          that.setData({
            is_send: false,
            countDownNum: 60
          });
          return;
        } else {
          countDownNum--;
          that.setData({
            countDownNum: countDownNum
          })
        }
      }, 1000)
    })
  },
  checkCode(){
    var that = this
    if (this.data.regMobile == '') {
      app.showWarning("请输入手机号码");
      return;
    }
    var reg = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
    if (!reg.test(this.data.regMobile)) {
      app.showWarning("手机号格式填写不正确");
      return;
    }
    request.post('/home/api/checkMobile',{
      data: {
        mobile: this.data.regMobile
      },
      success(res){
        console.log(res)
        if (res.data.status == 1) {
          that.setData({
            loginType: res.data.result.request
          })
          request.post( that.data.url +  '/home/api/send_validate_code', {
            data: {
                mobile: that.data.regMobile,
                scene: '1',
                type: 'user_reg',
            },
            success: function (res) {
                if (res.data.status == 1) {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                  that.setData({
                    is_send: true
                  });
                  that.countDown();
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }
              }
          });
        }
      }
    })
  },
  loginSubmit(){
    if (this.data.loginType == 'login') {
      this.bindAccount()
    } else {
      this.bindReg()
    }
  },
  closeMask: function(){ // 提示信息
    this.setData({
        tipsmask: false
    })
   
  },
  callServer(){
    wx.makePhoneCall({
      phoneNumber: '400-008-6336',
    })
  },
})