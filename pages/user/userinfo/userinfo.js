var app = getApp();
var setting = app.globalData.setting;
var request = app.request;
var common = require("../../../utils/common.js");
import Dialog from '../../../dist/dialog/dialog'
Page({
    data: {
        url: setting.url,
        resourceUrl: setting.resourceUrl,
        defaultAvatar: "https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/user68.jpg",
        user: null
    },

    onLoad: function () {
        var that = this;
        app.getUserInfo(function (userInfo) {
            that.setData({
                user: userInfo
            });
        }, true);
    },

    editUserInfo: function (e) {
        var type = e.currentTarget.dataset.type;
        if ((type == 'password' || type == 'paypwd') && !this.data.user.mobile) {
            return app.showWarning('请先绑定手机号码');
        }
        if (type && this.data.user) {
            wx.navigateTo({
                url: `/pages/user/userinfo_edit/userinfo_edit?type=${type}`,
            });
        }
    },

    changeAvatar: function () {
        var that =this;
        wx.chooseImage({
            count: 1, //最多1张图片,默认9
            sizeType: ['compressed', 'original'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera', 'album'], //可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                request.uploadFile(that.data.url + '/api/user/upload_headpic', {
                    filePath: res.tempFilePaths[0],
                    name: 'head_pic',
                    success: function (res) {
                        var headPic = common.getFullUrl(res.data.result);
                        that.setData({
                            ['user.head_pic']: headPic
                        });
                        app.globalData.userInfo.head_pic = headPic;
                        app.showSuccess("设置头像成功");
                    }
                });
            }
        });
    },
    editUserInfo2:function(){
        Dialog.confirm({
            message: '手机号是您登录的账号，请谨慎修改，\n 如需继续修改，请致电客服热线 \n 400-008-6336',
            confirmButtonText: '立即拨打',
            cancelButtonText: '取消'
          })
            .then(() => {
                wx.makePhoneCall({
                  phoneNumber: '400-008-6336',
                })
              Dialog.close()
            })
            .catch(() => {
                Dialog.close()
            });
    },
    removeBindBiniapp:function(){
        var that = this
        wx.showModal({
            title: '提醒',
            content: '确认解除当前手机号绑定吗？解除后，可以在“我的”中重新绑定手机号。',
            success (res) {
              if (res.confirm) {
                app.getUserInfo(function (userInfo) {
                    request.post( that.data.url + '/api/User/remove_bind_miniapp',{
                        data:{
                            user_id: wx.getStorageSync('app:userInfo').user_id
                        },
                        success:function(res){
                        
                           if (res.data.status == 1) {
                            wx.showToast({
                                title: '已解除微信绑定',
                                icon: 'none'
                              })
                              wx.removeStorageSync('app:userInfo')
                              wx.removeStorageSync('wx_user_info')
                              wx.setStorageSync('isAuth', false)
                              wx.setStorageSync('bind_third_login', false)
                              app.auth.clearAuth()
                              wx.reLaunch({
                                url: '/pages/index/index/index',
                              })
                           }
                        }
                    } )
                }, true, false);
              } else if (res.cancel) {
              }
            }
          })
        
    },

})