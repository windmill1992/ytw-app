<template>
	<view>
		<view class="order-list pd-bg-fff">
			<view class="order-price">
				<view>订单金额</view>
				<view class="co-red">￥{{order.order_amount}}</view>
			</view>
			<view class="order-id">
				<view>订单编号</view>
				<view class="id">{{order.master_order_sn ? order.master_order_sn : order.order_sn}}</view>
			</view>
		</view>
		<view class="pay-way pd-bg-fff">
			<view class="title">支付方式</view>

			<view class="pay-item" v-for="(item, index) in pay_method" :key="'pm' + index" :data-method="item.method"
				@tap="checkPayWay">
				<label>
					<view>
						<radio class='ico-check' :value="index" :data-code="item.pay_code"
							:checked="item.method == checkMethod"></radio>
					</view>
				</label>
				<view class="pay-img">
					<image class="wh100" :src="item.img"></image>
				</view>
				<view style="display: flex;">
					<view>{{item.name}}</view>
					<view class="balace" v-if="index == 0">( 余额：¥ {{userInfo.user_money}} )</view>
				</view>
			</view>
			<view class="pay-now" @tap="payment">立即支付</view>
		</view>
		<!-- 输入密码弹窗 -->
		<view class='show1' :hidden="!isShowBalanceBox">
			<view>
				<view class='use'>输入支付密码
					<view class='close' @tap='close_coupons'>
						<image src='../../../static/images/close.png'></image>
					</view>
				</view>
				<view class='bot'>
					<input unselectable="on" color="#fff" class='input' cursor-spacing="56" confirm-hold="true"
						maxlength="6" @input="getBalancePwd" :value="balance_pwd" type='number' :focus="focus" />
					<view class='password'>
						<input v-model='input[0]' type='password' maxlength="1" readonly="" />
						<input v-model='input[1]' type='password' maxlength="1" readonly="" />
						<input v-model='input[2]' type='password' maxlength="1" readonly="" />
						<input v-model='input[3]' type='password' maxlength="1" readonly="" />
						<input v-model='input[4]' type='password' maxlength="1" readonly="" />
						<input v-model='input[5]' type='password' maxlength="1" readonly=""
							style='border-right:none;' />
					</view>
				</view>
				<navigator class="forget" url="/pages/user/userinfo/userinfo">忘记密码？</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var pay = require('../../../static/utils/pay.js');
	var util = require('../../../static/utils/util.js');
	var md5 = require('../../../static/utils/md5.js');
	export default {
		data() {
			return {
				url: app.globalData.setting.url,
				resourceUrl: app.globalData.setting.resourceUrl,
				order: {},
				userInfo: {
					user_money: 0
				},
				pay_type: [{
						'name': '余额支付',
						'checked': true,
						'logo': '../../../images/balace_pay.png',
						'pay_code': ''
					},
					{
						'name': '微信支付',
						'checked': false,
						'logo': 'https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/wx-pay.png',
						'pay_code': ''
					}
				],
				pay_method: [{ //支付方式列表
					'name': '余额支付',
					'checked': true,
					'method': 'balance_pay',
					'img': '../../../static/images/balance.png',
					'pay_code': ''
				}, {
					'name': '微信支付',
					'method': 'wx_pay',
					'checked': false,
					'img': 'https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/wx-pay.png',
					'pay_code': ''
				}, ],
				checkMethod: 'balance_pay', //当前选中的支付方式，默认为余额支付
				balance_pwd: '', //余额支付密码
				isShowBalanceBox: false, //是否显示余额密码框
				focus: false, //是否获得焦点
				input: ['', '', '', '', '', ''] //6个密码框的值
			}
		},
		onLoad: function(options) {
			var that = this;
			app.getUserInfo(function(userInfo) {
				that.userInfo = Object.assign({}, userInfo);
			}, true, false);
			if (!options.master_order_sn || options.master_order_sn == 'undefined') {
				options.master_order_sn = 0
			}
			if (!options.order_sn || options.order_sn == 'undefined') {
				options.order_sn = 0
			}
			this.order.is_virtual = options.is_virtual;
			if (options.master_order_sn) {
				request.get('/api/cart/cart4', {
					data: {
						master_order_sn: options.master_order_sn
					},
					failRollback: true,
					success: function(res) {
						var order_amount = res.data.result;
						if (parseFloat(order_amount) < 0.01) {
							that.jumpSuccess();
						}
						that.order = Object.assign({}, that.order, {
							master_order_sn: options.master_order_sn,
							order_sn: options.order_sn,
							order_amount: order_amount
						});
					}
				});
			} else {
				if (parseFloat(options.order_amount) < 0.01) {
					this.jumpSuccess();
				}
				this.order = options;
			}
		},
		methods: {
			checkPayWay: function(e) {
				this.checkMethod = e.currentTarget.dataset.method;
			},
			payment: function() {
				var that = this;
				if (this.order && parseFloat(this.order.order_amount) < 0.01) {
					this.jumpSuccess();
					return;
				}
				if (that.checkMethod == 'wx_pay') {
					//微信支付
					pay.pay(this.order.order_sn != 0 ? this.order.order_sn : this.order.master_order_sn,
						function() {
							that.jumpPaymentPage();
						});
				} else if (that.checkMethod == 'balance_pay') {
					//余额支付 1弹出输入密码框  2 带参请求API
					if (that.userInfo.user_money - that.order.order_amount < 0) {
						return app.showTextWarining('余额不足,请充值!');
					} else {
						that.isShowBalanceBox = true;
						that.focus = true;
					}
					return;
				} else if (that.checkMethod == 'credit') {
					// 赊账
					if (that.userInfo.user_money - that.order.order_amount < 0) {
						return app.showTextWarining('余额不足,请充值!');
					} else {
						that.isShowBalanceBox = true;
						that.focus = true;
					}
					return;
				} else if (that.checkMethod == 'pre_payments') {
					//预付款付款
					if (that.userInfo.user_money - that.order.order_amount < 0) {
						return app.showTextWarining('余额不足,请充值!');
					} else {
						that.isShowBalanceBox = true;
						that.focus = true;
					}
					return;
				}
			},
			jumpSuccess: function() {
				var that = this;
				app.showSuccess('下单成功', function() {
					var pages = getCurrentPages();
					if (that.order.is_virtual) {
						if (pages[pages.length - 2].route == 'pages/goods/goodsInfo/goodsInfo') {
							//前一个页面是商品详情页，则跳到待发货页
							uni.redirectTo({
								url: '/pages/virtual/virtual_list/virtual_list?type=2'
							});
						} else {
							uni.setStorageSync('virtual:virtual_list:update', true);
							uni.setStorageSync('order:order_detail:update', true);
							uni.navigateBack();
						}
					} else {
						if (pages[pages.length - 2].route == 'pages/cart/cart/cart') {
							//前一个页面是购物车页，则跳到待发货页
							uni.redirectTo({
								url: '/pages/user/order_list/order_list?type=2'
							});
						} else {
							uni.setStorageSync('order:order_list:update', true);
							uni.setStorageSync('order:order_detail:update', true);
							uni.navigateBack();
						}
					}
				});
			},
			jumpPaymentPage: function() {
				uni.setStorageSync('order:order_list:update', true);
				uni.redirectTo({
					url: '/pages/payment/payment/payment?order_sn=' + this.order.order_sn +
						'&order_amount=' + this.order.order_amount + '&master_order_sn=' + this.order.master_order_sn
				});
			},
			//获取支付密码
			getBalancePwd: function(e) {
				this.balance_pwd = e.detail.value;
				var balance_pwd = this.balance_pwd;
				var input = e.detail.value.split(''); // 转对象
				this.input = Object.assign({}, input);
				if (balance_pwd.length == 6) {
					this.BalancePay();
					this.focus = false;
				}
			},
			//关闭输入密码框
			close_coupons: function(e) {
				this.isShowBalanceBox = false;
				this.focus = false;
			},
			//余额支付请求
			BalancePay: function() {
				var that = this;
				request.post('/api/Payment/balancePay', {
					data: {
						order_sn: that.order.order_sn,
						master_order_sn: that.order.master_order_sn,
						password: that.balance_pwd ? md5('TPSHOP' + that.balance_pwd) : ''
					},
					success: function(res) {
						if (res.data.status == 2) {
							that.isShowBalanceBox = false;
							that.focus = false;
							app.showTextWarining(res.data.msg, function() {
								uni.navigateTo({
									url: '/pages/user/userinfo_edit/userinfo_edit?type=paypwd',
								})
							});
							return
						}
						that.jumpPaymentPage();
						that.isShowBalanceBox = false;
					},
					fail: function(res) {
						that.balance_pwd = '';
						that.input = '';
					},
				});
				that.balance_pwd = '';
				that.input = '';
				that.focus = true;
			},
		}
	}
</script>

<style scoped src="./cart4.css">

</style>
