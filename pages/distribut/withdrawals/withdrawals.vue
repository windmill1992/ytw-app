<template>
	<view>
		<view class='withdraw_container'>
			<view class="withdraw-header-wrap">
				<view class="can_money_tit"><text>￥</text><text>可提现佣金总金额</text></view>
				<view class="can_money_con"><text>￥</text><text>{{distribut_money}}</text></view>
			</view>
			<view class='withdraw_style'>
				<view class='withdraw_stna'>提现方式</view>
				<view class='withdraw_stcon'>
					<image src="../../../static/images/withdraw-weix.png"></image>
					<text class='wh_user_account' @tap='bindWechat'>{{cashConfig.openid?'已绑定微信':'还未绑定微信'}}</text>
				</view>
			</view>
			<view class="withdraw-cont-wrap">
				<view class="withdraw-cont-p1">提现金额</view>
				<view class="withdraw-money">
					<text>￥</text>
					<input type='digit' name="money" id="money" v-model="money" @input="withdrawMoney"></input>
				</view>
				<view class="withdraw-allmoney">
					<text>手续费:{{withdrawFee}}</text>
					<button class='wh_allmony' @tap='allWithdraw'>全部提现</button>
				</view>
			</view>
			<view class="withdraw-cont-wrap">
				<view class='withdraw-cont-p2'>
					<text>支付密码：</text>
					<input name="paypwd" id="paypwd" type="password" v-model="pwd" placeholder="请填写支付密码"></input>
				</view>
				<view class="wh_setpsd">
					<view @tap.stop="userinfoEdit" data-url='/pages/user/userinfo_edit/userinfo_edit?type=paypwd'>
						前往设置或修改交易密码</view>
				</view>
				<view class="withdraw-sub-btn">
					<button form-type="submit" @tap='submit'>提交申请</button>
				</view>
			</view>
			<view class="withdraw-foot-wrap">
				<text>温馨提示：</text>
				<text>1.提现金额须大于{{distribut_config}}元，小于{{cashConfig.max_cash}}元</text>
				<text>2.提现收取{{cashConfig.service_ratio}}%的手续费，每笔最低元手续费</text>
				<text>3.手续费在到账金额中扣除</text>
				<text>4.提现审核一般3 - 5个工作日到账</text>
			</view>
		</view>

	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var md5 = require('../../../static/utils/md5.js');
	export default {
		data() {
			return {
				url: app.globalData.setting.url,
				cashConfig: null,
				money: '',
				withdrawFee: 0.00,
				pwd: '',
				distribut_money: 0,
				distribut_config: 0,
			}
		},
		onLoad: function() {
			this.getCashDistribut();
			this.getCashConfig();
		},
		methods: {
			//提现配置
			getCashConfig: function() {
				var that = this;
				request.post('/api/user/cash_config', {
					success: function(res) {
						that.cashConfig = Object.assign({}, res.data.result);
					}
				});
			},
			//分销
			getCashDistribut: function() {
				var that = this;
				request.get('/api/distribut/withdrawals', {
					success: function(res) {
						that.distribut_money = res.data.result.distribut_money;
						that.distribut_config = res.data.result.distribut_config.distribut_withdrawals_money;
					}
				});
			},
			userinfoEdit: function(e) {
				if (!app.globalData.userInfo.mobile) {
					app.showTextWarining('请先设置手机号码', function() {
						uni.setStorageSync('withdrawals_pay', true);
						uni.navigateTo({
							url: '/pages/user/userinfo_edit/userinfo_edit?type=mobile',
						})
					});
				} else {
					uni.navigateTo({
						url: e.currentTarget.dataset.url,
					})
				}
			},
			bindWechat: function() {
				var that = this;
				if (that.cashConfig.openid == '') {
					return app.showTextWarining("请打开电脑端扫码绑定微信");
				}
			},
			withdrawMoney: function(e) {
				var money = e.detail.value;
				var m = 0,
					s1 = money.toString(),
					s2 = (this.cashConfig.service_ratio * 0.01).toString();
				try {
					m += s1.split(".")[1].length
				} catch (e) {}
				try {
					m += s2.split(".")[1].length
				} catch (e) {}
				var fee = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
				if (!this.cashConfig.service_ratio) {
					this.withdrawFee = 0.00;
				} else {
					if (fee < this.cashConfig.min_service_money) {
						this.withdrawFee = this.cashConfig.min_service_money;
					} else if (fee > this.cashConfig.max_service_money) {
						if (this.cashConfig.max_service_money > 0) {
							this.withdrawFee = this.cashConfig.max_service_money;
						} else {
							this.withdrawFee = fee;
						}
					} else {
						this.withdrawFee = fee;
					}
				}
			},
			allWithdraw: function() {
				this.money = this.data.distribut_money;
				var m = 0,
					s1 = this.distribut_money.toString(),
					s2 = (this.cashConfig.service_ratio * 0.01).toString();
				try {
					m += s1.split(".")[1].length
				} catch (e) {}
				try {
					m += s2.split(".")[1].length
				} catch (e) {}
				var fee = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
				if (!this.cashConfig.service_ratio) {
					this.withdrawFee = 0.00;
				} else {
					if (fee < this.cashConfig.min_service_money) {
						this.withdrawFee = this.cashConfig.min_service_money;
					} else if (fee > this.cashConfig.max_service_money) {
						if (this.cashConfig.max_service_money > 0) {
							this.withdrawFee = this.cashConfig.max_service_money;
						} else {
							this.withdrawFee = fee;
						}
					} else {
						this.withdrawFee = fee;
					}
				}
			},
			submit: function() {
				var that = this;
				if (that.cashConfig.openid == '') {
					return app.showTextWarining("请打开电脑端扫码绑定微信");
				}

				if (that.money == '') {
					return app.showTextWarining("请输入金额");
				}
				if (that.money <= 0) {
					return app.showTextWarining("请输入正确的金额");
				}
				if (that.pwd == '') {
					return app.showTextWarining("请输入支付密码");
				}
				request.post('/api/distribut/withdrawals', {
					data: {
						bank_name: '微信',
						bank_card: '',
						money: that.money,
						paypwd: md5('TPSHOP' + that.pwd),
						distribut_money: that.distribut_money,
					},
					success: function(res) {
						app.showSuccess('申请成功', function() {
							uni.navigateBack({
								delta: 1
							})
						})
					}
				});
			},
		}
	}
</script>

<style scoped src="./withdrawals.css">

</style>
