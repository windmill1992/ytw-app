<template>
	<view>
		<form @submit="submitForm">
			<view class="container">
				<view class="user-mes" @tap="enterAddressPage">
					<view class="user-contact">{{order.addressList.consignee+'　　'+order.addressList.mobile}}</view>
					<view class="location">
						<view class="address">{{order.addressList.total_address}}</view>
						<view class="pos-icon">
							<image class="wh100" src="../../../static/images/iconfont-shouhuodizhi.png" />
						</view>
					</view>
					<view class="border-img">
						<image class="wh100" src="https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/tt.png" />
					</view>
					<view class="update-logistics">
						<image class="arrow-rigth" src="../../../static/images/icon-arrowdown.png"></image>
					</view>
				</view>
				<!-- 商品列表 -->
				<view class="order-meg">
					<view class="store-list" v-for="(item, index) in order.cartList" :key="'cart' + index">
						<view class="store-mes">
							<view class="store-ico">
								<image class="wh100"
									src="http://demo6.tp-shop.cn/template/mobile/default/static/images/s.png"></image>
							</view>
							<view class="store-name">{{item.store.store_name}}</view>
						</view>
						<view class="order-detail">
							<view class="goods-img">
								<image class="wh100"
									:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id + '&width=100&height=100'">
								</image>
							</view>
							<navigator class="order-cont"
								:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id">
								<view class="goods-name ellipsis-2">{{item.goods_name}}</view>
								<view class="goods-color ellipsis-1">{{item.spec_key_name}}</view>
							</navigator>
							<view class="order-num">
								<view class="co-red">￥{{item.shop_price}}</view>
								<view class="goods-num">x{{item.goods_num}}</view>
							</view>
						</view>
						<view class="set-mes">
							<view class="delivery set-item">
								<view>运费：
									{{orderPrices.store_list_pay_info[item.store_id].shipping_price > 0 ? '￥'+ orderPrices.store_list_pay_info[item.store_id].shipping_price : '包邮'}}
								</view>
								<view class="set-btn">
									<view></view>
								</view>
							</view>
							<view class="set-item">
								<view>备注：</view>
								<textarea name="user_note" class="word-box" maxlength="30" placeholder="选填,最多30个字"
									@input="keyUpChangeNum"></textarea>
							</view>
						</view>
					</view>
				</view>
				<!-- 使用其他支付 -->
				<view class="set-mes">
					<view v-if="order.store_prom">
						<icon type="info" size="16" color="#ff3b3b" />{{order.store_prom}}
					</view>
				</view>
				<!-- 发票 -->
				<view class="set-mes invoice-wrap">
					<view class="invoice set-item">
						<view>发票信息</view>
						<view class="set-btn">
							<switch type="switch" color="#ff3b3b" @change="setInvoice" />
						</view>
					</view>
					<view class="invoice-remarks" v-if="invoice.is_use">
						<radio-group class="radio-group" @change="isPersonChange">
							<radio color="#ff3b3b" value="person" :checked="invoice.is_person" />个人
							<radio color="#ff3b3b" value="company" :checked="!invoice.is_person" />单位
						</radio-group>
					</view>
					<view class="invoice-remarks" v-if="invoice.is_use && !invoice.is_person">
						<view>发票抬头： </view> <input type="text" name="invoice_title" placeholder="公司名称" />
					</view>
					<view class="invoice-remarks" v-if="invoice.is_use && !invoice.is_person">
						<view>纳税人识别号： </view> <input type="text" name="taxpayer" />
					</view>
					<view class="set-item" v-if="invoice.is_use">
						<picker @change="selectInvoiceContent" :value="invoice.content_idx" :range="invoice.contents">
							<view>发票内容： {{invoice.contents[invoice.content_idx]}}</view>
						</picker>
						<view class="set-btn">
							<image class="arrow-rigth" src="../../../static/images/icon-arrowdown.png"></image>
						</view>
					</view>
				</view>
				<!-- 价格栏 -->
				<view class="information">
					<view class="item">
						<view>商品金额</view>
						<view class="co-red">￥ {{orderPrices.goods_price}}元</view>
					</view>
					<view class="item">
						<view>配送费用</view>
						<view class="co-red">￥ {{orderPrices.shipping_price}}元</view>
					</view>
					<view class="item">
						<view>已使用积分</view>
						<view class="co-red">{{orderPrices.pay_points}}</view>
					</view>
					<view class="item">
						<view>使用余额</view>
						<view class="co-red">- ￥ {{orderPrices.user_money}}元</view>
					</view>
				</view>
				<view class="btn-wrap">
					<button form-type="submit" class="tips-btn" id='submitOrder'>提交订单</button>
					<view class="pay-amount">
						<view class="payable">应付金额 : </view>
						<view class="co-red">￥ {{orderPrices.order_amount}}元</view>
					</view>
				</view>
			</view>
		</form>

	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var common = require('../../../static/utils/common.js');
	var md5 = require('../../../static/utils/md5.js');
	export default {
		data() {
			return {
				url: app.globalData.setting.url,
				goods: null,
				order: null, //请求的订单数据
				orderPrices: null, //请求的订单价格数据
				payWithUserMoney: true, //是否使用余额支付
				maxWord: 0,
				enterAddressPage: false,
				invoice: {
					is_use: false, //是否开发票
					is_person: true, //是否是个人
					contents: ['明细', '耗材', '办公用品', '电脑配件', '食品酒水', '服饰鞋帽', '日用品', '电器数码', '家具建材', '钟表珠宝', '日化用品'],
					content_idx: 0, //发票内容下标
				},
				formData: {
					invoice_title: '',
					user_money: '',
					paypwd: '',
					user_note: '',
				}
			}
		},
		onLoad: function(options) {
			this.goods = options;
			this.requestCart2(0);
		},
		//重新加载数据
		onShow: function() {
			this.order = Object.assign({}, this.order);
			if (this.enterAddressPage) {
				this.enterAddressPage = false;
				var addressId = uni.getStorageSync('cart:cart2:address_id');
				if (addressId !== '') {
					uni.removeStorageSync('cart:cart2:address_id');
				} else {
					addressId = (!this.order || this.order.addressList == null) ? 0 : this.order.addressList.address_id;
				}
				this.requestCart2(addressId); //改变地址要重新请求数据
			}
		},
		methods: {
			requestCart2: function(addressId) {
				var that = this;
				request.post('/api/cart/integral', {
					failRollback: true,
					data: {
						address_id: addressId,
						goods_id: this.goods.goods_id,
						item_id: this.goods.item_id,
						goods_num: this.goods.goods_num,
					},
					success: function(res) {
						that.order = res.data.result;
						that.order.addressList = res.data.result.userAddress;
						that.order.cartList = [res.data.result.goods];
						res.data.result.goods.goods_num = res.data.result.goods_num;
						res.data.result.goods.goods_price = res.data.result.goods_price;
						that.order = Object.assign({}, that.order);
						if (that.checkAddressList()) {
							that.calculatePrice();
						}
					},
					failStatus: function(res) {
						if (res.data.status == -1) {
							that.order = null;
							that.checkAddressList();
						}
						return false;
					}
				});
			},
			/** 检查是否已经选了地址 */
			checkAddressList: function() {
				var that = this;
				if (!this.order || this.order.addressList == null) {
					uni.showModal({
						title: '请先填写或选择收货地址~',
						success: function(res) {
							if (res.confirm) {
								that.enterAddressPage();
							} else {
								uni.navigateBack();
							}
						},
						fail: function() {
							uni.navigateBack();
						}
					});
					return false;
				}
				return true;
			},
			/** 显示发票信息 */
			setInvoice: function(e) {
				this.invoice.is_use = e.detail.value;
				this.invoice = Object.assign({}, this.invoice);
			},
			isPersonChange: function(e) {
				if (e.detail.value == 'person') {} else {}
				this.invoice.is_person = e.detail.value == 'person';
				this.invoice = Object.assign({}, this.invoice);
			},
			selectInvoiceContent: function(e) {
				this.invoice.content_idx = e.detail.value;
				this.invoice = Object.assign({}, this.invoice);
			},
			getInvoiceData: function(form) {
				var invoice = this.invoice;
				if (!invoice.is_use) {
					return {};
				}
				return {
					invoice_title: invoice.is_person ? '个人' : form.invoice_title,
					taxpayer: invoice.is_person ? '' : form.taxpayer,
					invoice_desc: invoice.contents[invoice.content_idx],
				};
			},
			keyUpChangePay1: function(e) {
				this.payWithUserMoney = e.detail.value.length > 0 ? false : true;
			},
			keyUpChangeNum: function(e) {
				this.maxWord = e.detail.value.length;
			},
			/** 请求计算价格，无入参则使用已保存的参数 */
			calculatePrice: function(formData, submitOrder) {
				var that = this;
				if (typeof formData == 'undefined') {
					formData = that.formData;
				} else {
					that.formData = formData;
				}
				var pwd = formData.paypwd ? md5('TPSHOP' + formData.paypwd) : '';
				var postData = {
					address_id: that.order.addressList.address_id,
					invoice_title: formData.invoice_title ? formData.invoice_title : '',
					user_money: formData.user_money ? formData.user_money : 0,
					pwd: pwd,
					pay_pwd: pwd,
					act: submitOrder ? 'submit_order' : '',
					goods_id: this.goods.goods_id,
					item_id: this.goods.item_id,
					goods_num: this.goods.goods_num,
					user_note: formData.user_note ? formData.user_note : '',
				};
				postData = Object.assign(postData, that.getInvoiceData(formData));
				request.post('/api/cart/integral2', {
					data: postData,
					success: function(res) {
						if (!submitOrder) {
							that.orderPrices = Object.assign({}, res.data.result);
							return;
						}
						if (that.orderPrices.order_amount <= 0) {
							uni.setStorageSync('order:order_list:update', true);
							uni.redirectTo({
								url: '/pages/payment/payment/payment?master_order_sn=' + res.data.result + '&order_amount=' + that.orderPrices.total_amount
							});
							return;
						}
						common.jumpToCart4({
							master_order_sn: res.data.result,
						}, 1);
					},
					failStatus: function(res) {
						if (res.data.status == 0) {
							uni.navigateBack();
						} else if (res.data.status == -1) {
							uni.showModal({
								title: '请先设置支付密码',
								success: function(res) {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/user/userinfo/userinfo'
										});
									} else {
										uni.navigateBack();
									}
								},
								fail: function() {
									uni.navigateBack();
								}
							});
						}
					}
				});
			},
			/** 提交订单 */
			submitForm: function(e) {
				var submitOrder = (e.detail.target.id == 'submitOrder') ? true : false;
				this.calculatePrice(e.detail.value, submitOrder);
			},
			enterAddressPage: function() {
				this.enterAddressPage = true;
				uni.navigateTo({
					url: '/pages/user/address_list/address_list?operate=select'
				});
			},
			addCouponCode: function() {
				var that = this;
				request.post('/api/cart/coupon_exchange', {
					data: {
						coupon_code: this.couponCode
					},
					success: function(res) {
						that.requestCart2(that.order.addressList.address_id);
						app.confirmBox('兑换成功，限用于' + res.data.result.coupon.limit_store);
					}
				});
			}
		}
	}
</script>

<style scoped src="./integral.css">

</style>
