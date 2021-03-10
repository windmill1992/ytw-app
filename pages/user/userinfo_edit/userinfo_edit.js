var app = getApp();
var setting = app.globalData.setting;
var request = app.request;
var md5 = require('../../../utils/md5.js');
var common = require('../../../utils/common.js');

Page({
  data: {
    url: setting.url,
    resourceUrl: setting.resourceUrl,
    user: null,
    type: '',
    canGetCode: false, //是否能获取验证码
    timer: '', //定时器名字
    countDownNum: '180', //倒计时初始值
    is_send: false,
    isShowForget: true, //是否显示忘记密码按钮
    forget_pwd_sms_enable: 0,//是否需要忘记密码验证码
    regis_sms_enable: 0,//是否需要支付验证码
  },

  onLoad: function(options) {
    var that = this;
    var forget_pwd_sms_enable = common.getConfigByName(app.globalData.config, "forget_pwd_sms_enable", 'sms');
    var regis_sms_enable = common.getConfigByName(app.globalData.config, "regis_sms_enable", 'sms');
    this.setBarTitle(options.type);
    app.getUserInfo(function(userInfo) {
      that.setData({
        user: userInfo,
        type: options.type,
        countDownNum: userInfo.time_out,
        forget_pwd_sms_enable: forget_pwd_sms_enable,
        regis_sms_enable: regis_sms_enable,
      });
    });
  },

  setBarTitle: function(type) {
    var title = '修改个人信息';
    if (type == 'nickname') {
      title = '修改昵称';
    } else if (type == 'mobile') {
      title = '修改手机';
    } else if (type == 'email') {
      title = '修改邮箱';
    } else if (type == 'password') {
      title = '修改密码';
      this.setData({
        isShowForget: false
      })
    } else if (type == 'paypwd') {
      title = '修改支付密码';
    } else if (type == 'sex') {
      title = '修改性别';
    }
    wx.setNavigationBarTitle({
      title: title
    });
  },

  formSubmit: function(e) {
    var type = this.data.type;
    if (!type) {
      return;
    }
    var values = e.detail.value;
    console.log(e.detail.value)
    console.log(type)
    if (type == 'nickname') {
      this.submitNickname(values);
    } else if (type == 'mobile') {
      this.submitMobile(values);
    } else if (type == 'email') {
      this.submitEmail(values);
    } else if (type == 'password') {
      this.submitPassword(values);
    } else if (type == 'paypwd') {
      this.submitPaypwd(values);
    } else if (type == 'sex') {
      this.submitSex(values);
    } else {
      app.confirmBox("处理类型出错:" + type);
    }
  },

  submitNickname: function(values) {
    if (!values.nickname) {
      app.showWarning("昵称不能为空！");
      return false;
    }
    this.requestUpdateUser({
      nickname: values.nickname
    });
  },

  submitMobile: function(values) {
    if (!(values.mobile)) {
      app.showWarning("手机不能为空！");
      return false;
    }
    if (values.regis_sms_enable && !(values.mobile_code)) {
      app.showWarning("输入不能为空！");
      return false;
    }
    this.updateUserMobile({
      mobile: values.mobile,
      check_code: values.mobile_code,
      scene: 1,
    });
  },

  submitEmail: function(values) {
    if (values.email.indexOf('@') < 0) {
      app.showWarning("邮箱格式不正确");
      return false;
    }
    this.requestUpdateUser({
      email: values.email
    });
  },

  submitPassword: function(values) {
    var hasPw = this.data.user.password;
    if (!((!hasPw || (hasPw && values.old_password || this.data.isShowForget)) && values.new_password && values.confirm_password)) {
      app.showWarning("输入不能为空！");
      return false;
    }
    if (this.data.isShowForget && this.data.forget_pwd_sms_enable==1) {
      if (values.password_code.length < 0) {
        app.showWarning("请输入短信码!");
        return false;
      }
    }
    if (values.new_password !== values.confirm_password) {
      app.showWarning("新密码两次输入不一致");
      return false;
    }
    if (values.new_password.length < 6) {
      app.showWarning("密码长度不能小于6位");
      return false;
    }
    let mobile = this.data.user.mobile;
    let check_code = typeof values.password_code == 'undefined' ? '' : values.password_code;
    //忘记密码和修改密码
    if (!this.data.isShowForget) {
      //忘记密码
      var url = "/api/user/password";
    } else {
      //修改密码
      var url = "/api/user/forgetPassword";
    }
    request.post(url, {
      data: {
        old_password: md5('TPSHOP' + values.old_password),
        new_password: md5('TPSHOP' + values.new_password),
        mobile: mobile,
        check_code: check_code
      },
      success: function(res) {
        app.showSuccess('修改成功', function() {
          wx.navigateBack();
        });
      }
    });
  },

  submitPaypwd: function(values) {
    if (!(values.paypwd && values.paypwd_confirm)) {
      app.showWarning("输入不能为空！");
      return false;
    }
    if (this.data.regis_sms_enable ==1 && !values.paypwd_code ) {
      app.showWarning("验证码不能为空！");
      return false;
    }
    if (values.paypwd !== values.paypwd_confirm) {
      app.showWarning("新密码两次输入不一致");
      return false;
    }
    if (values.paypwd.length < 6) {
      app.showWarning("密码长度不能小于6位");
      return false;
    }
    var mobile = this.data.user.mobile;

    request.post('/api/user/paypwd', {
      data: {
        new_password: md5('TPSHOP' + values.paypwd),
        mobile: mobile,
        paypwd_code: values.paypwd_code
      },
      success: function(res) {
        app.showSuccess('修改成功', function() {
          wx.navigateBack();
        });
      }
    });
  },

  submitSex: function(values) {
    if (this.data.user.sex == 0) {
      app.showWarning("请先选择性别");
      return false;
    }
    this.requestUpdateUser({
      sex: this.data.user.sex
    });
  },

  changeGender: function(e) {
    var gender = e.currentTarget.dataset.gender;
    var sexNum = (gender == 'boy') ? 1 : 2;
    this.setData({
      'user.sex': sexNum
    });
  },

  updateUserMobile: function(data) {
    var that = this;
    request.post('/api/user/change_mobile', {
      data: data,
      success: function(res) {
        wx.navigateBack();
      }
    });
  },

  requestUpdateUser: function(data) {
    request.post('/api/user/updateUserInfo', {
      data: data,
      success: function(res) {
        wx.navigateBack();
      }
    });
  },

  setMobile: function(e) {
    this.data.user.mobile = e.detail.value;
  },

  getCode: function(e) {
    //发送验证码类型
    // if (!this.checkPhone1()) {
    //   return wx.showToast({
    //     title: '手机号格式不正确',
    //     icon: 'none'
    //   })
    // }
    var id = e.currentTarget.dataset.id;
    let that = this
    common.sendSmsCode(that.data.user.mobile, id, function(res) {
      if (res.data.status == 1) {
        that.setData({
          is_send: true
        });
        that.countDown();
      }
    });
  },
  countDown: function() {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.setData({
      timer: setInterval(function() {
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
  //切换忘记密码显示短信验证框
  changeForgetPassword: function() {
    this.setData({
      isShowForget: true
    })
  },
  checkPhone1:function(str){
    var reg = /^1[0-9]{10}$/;
        if (reg.test(str)) {
            return true;
        }else{
            return false;
        };
}

})