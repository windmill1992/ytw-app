var app = getApp();
var request = app.request;
var common = require('../../../utils/common.js');

Page({
    data: {
        url: app.globalData.setting.url,
        userMoney: 0,
        capacheUrl: '',
        store_id: 0,
    },

    onLoad: function (options) {
        this.setData({ 
            userMoney: options.money,
            store_id: options.store_id ? options.store_id : 0
         });
        this.getCapache();
    },

    submitWithdrawals: function (e) {
        var val = e.detail.value;
        if (this.checkFormData(val) !== true) {
            return;
        }
        var data1 = {
            account_bank: val.account_bank, //银行卡号
            account_name: val.account_name, //账户名称
            bank_name: val.bank_name,       //银行名称
            money: val.money,
            verify_code: val.verify_code,
            paypwd: val.paypwd
        }
        var data = {
            bank_card: val.account_bank, //银行卡号
            realname: val.account_name, //账户名称
            bank_name: val.bank_name,    //银行名称
            money: val.money,
            store_id: this.data.store_id,
        }
        var url = this.data.store_id ? '/api/store/storeTakeMoney' : '/api/user/withdrawals'
        var that = this;
        request.post(that.data.url + url, {
            data: that.data.store_id ? data : data1,
            success: function () {
                wx.showToast({
                    title: '已提交申请',
                    mask: true,
                    complete: function () {
                        setTimeout(function () {
                            wx.navigateBack();
                        }, 1000);
                    }
                });
            },
            failStatus: function () {
                that.getCapache();
            }
        });
    },

    /** 表单检查 */
    checkFormData: function (val) {
        console.log(val);
        var money = parseFloat(val.money);
        if (isNaN(money)) {
            return app.showWarning('请填写合法的提现金额');
        }
        if (money < 0.01) {
            return app.showWarning('请填写大于等于1分的提现金额');
        }
        if (money > this.data.userMoney) {
            return app.showWarning('可提现最大金额是 ' + this.data.userMoney + ' 元');
        }
        if (val.bank_name.length < 2) {
            return app.showWarning('请填写正确的银行名称');
        }
        if (this.data.store_id != 0 ) {
            if ( val.bank_name != '支付宝' ) {
                return app.showWarning('请填写正确的银行名称');
            }
        }
        if (isNaN(parseInt(val.account_bank)) || val.account_bank == '') {
            return app.showWarning('请填写正确的收款账号');
        }
        if (val.account_name == '') {
            return app.showWarning('请填写正确的开户号');
        }
        if (this.data.store_id == 0 ) {
            if ( val.paypwd.length == '') {
                return app.showWarning('支付密码不能为空');
            }
        }
        if (val.verify_code == '') {
            return app.showWarning('请先输入验证码');
        }
        return true;
    },

    getCapache: function () {
        this.setData({ capacheUrl: common.getCapache() });
    }

});