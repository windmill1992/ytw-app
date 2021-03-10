<template>
	<view>
		<form @submit="submitForm">
			<view class="container">
				<view class="user-mes" @tap="enterAddressPage">
					<view class="user-contact">
						{{order?order.addressList.consignee : '' +' '+ order ? order.addressList.mobile : ''}}
					</view>
					<view class="location">
						<view class="address">{{order ? order.addressList.total_address : ''}}</view>
						<view class="pos-icon"></view>
					</view>
					<view class="border-img">
						<image class="wh100" src="https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/tt.png" />
					</view>
					<view class="update-logistics">
					</view>
				</view>
				<!-- 商品列表 -->
				<view class="order-meg">
					<view class="store-list" v-for="(item, index) in order.storeShippingCartList" :key="'ssc' + index">
						<view class="store_name">
							<image src="../../../static/images/carnew.png"></image>{{item.store_name}}
						</view>
						<view class="order-detail" v-for="(item2, index2) in item.cartList"
							:key="'ssc_c' + index + index2">
							<view class="goods-img">
								<image class="wh100"
									:src="url + '/api/goods/goodsThumImagesForCart?goods_id=' + item2.goods_id + '&width=100&height=100&item_id=' + item2.item_id">
								</image>
							</view>
							<navigator class="order-cont"
								:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item2.goods_id">
								<view class="goods-name ellipsis-2">{{item2.goods_name}}</view>
								<view class="goods-color ellipsis-1">{{item2.spec_key_name}}</view>
							</navigator>
							<view v-if="item.qitian != 1" class='information1'></view>
							<view v-else class='information1'>支持七天无理由退货</view>
							<view class="order-num">
								<view class="co-red">
									<text class='goods_price'>￥</text>{{item2.member_goods_price}}
									<view class='goods_num'><text>x</text>{{item2.goods_num}}</view>
								</view>
							</view>
						</view>
						<view class='distribution'>配送方式</view>
						<view class="set-mes">
							<view class="use-item selfsubmit" v-if="item.cartList[0]['goods']['is_virtual'] !=2">
								<radio-group class="radio-group" @change="radioChange">
									<block v-for="(item3, index3) in items" :key="'items' + index + index3">
										<label class="radio">
											<view>
												<text
													style='margin-top:10rpx;display:inline-block;'>{{item3.name}}</text>
												<radio :value="index3" color="#18c2ba" :checked="item3.checked" />
											</view>
										</label>
										<view class="selfsubmit-view line"><text>{{item3.value}}</text></view>
									</block>
								</radio-group>
							</view>

							<view class="use-item set-item line" style="height:0;font-size:0;"
								v-if="item.cartList[0]['goods']['is_virtual'] !=2 && submit">
								<view>自提时间</view>
								<view @tap.stop='showdate' style='width:376rpx;'>
									<text>{{checkTime}}{{submit_datas.submit_text}}</text>
									<image class="arrow-rigth" src="../../../static/images/icon-arrowdown2.png"></image>
								</view>
							</view>

							<view class="use-item set-item line" @tap.stop='getSubmitAddress'
								:data-storeId="item.store_id"
								v-if="item.cartList[0]['goods']['is_virtual'] !=2 && submit">
								<view>自提地点</view>
								<text style='padding-right:40rpx'>{{submit_datas.submit_address}}</text>
								<image class="arrow-rigth" src="../../../static/images/icon-arrowdown2.png"></image>
							</view>
							<view class="set-item line" @tap="useCoupon" :data-idx='index' v-if="false">
								<view class="coupon">
									<view>优惠券</view>
									<view class="coupon-num">
										{{order.couponNum[item.store_id] ? order.couponNum[item.store_id] : 0}}张可用
									</view>
								</view>
								<view class="set-btn">
									<view v-if="order.couponNum[item.store_id] ? order.couponNum[item.store_id] : 0">
										{{item.useCouponListId?item.useCouponName:'未使用'}}
									</view>
									<view v-else>无可用</view>
									<image class="arrow-rigth" src="../../../static/images/icon-arrowdown2.png"></image>
								</view>
							</view>
							<view @tap="showInvoice" class="set-item line" v-if="false">
								<view class="coupon">
									<view>发票信息</view>
								</view>
								<view class="set-btn">
									<view>{{text}}</view>
									<image class="arrow-rigth" src="../../../static/images/icon-arrowdown2.png"></image>
								</view>
							</view>

							<view class="set-item">
								<view>买家留言</view>
								<textarea :name="'user_note' + item.store_id" class="word-box" maxlength="30"
									placeholder-style='color:#999;' placeholder="选填：对本次交易的说明"
									@input="keyUpChangeNum"></textarea>
							</view>
						</view>
					</view>
				</view>
				<!-- 使用其他支付 -->
				<view class="set-mes" hidden="true">
					<view v-if="order.store_prom">
						<icon type="info" size="16" color="#ff3b3b" />{{order.store_prom}}
					</view>
					<view class="use-item line" :hidden="true">
						<view>使用积分</view>
						<view class='jf' style=''>可用积分：{{order.userInfo.pay_points}}({{rate}}积分兑换1元)</view>
						<radio class="use-points" @tap='usePoints' color="#18c2ba" :checked="formData.pay_points">
						</radio>
					</view>
					<view @tap='coupons' class="use-item" :hidden="true">
						<view>优惠劵码</view>
						<image class="arrow-rigth" src="../../../static/images/icon-arrowdown2.png"></image>
					</view>

					<view class="use-item" :style="'display:' + payWithUserMoney && payWithPoints ? 'none' : 'flex'">
						<view>支付密码 : </view>
						<input type="text" name="paypwd" password placeholder="请输入密码" maxlength="20" />
					</view>
				</view>
				<!-- 价格栏 -->
				<view class="information">
					<view class="item">
						<view>商品总额</view>
						<view class="co-red">￥{{order.storeCartTotalPrice}}元</view>
					</view>
					<view v-if="orderPrices.shipping_price" class="item">
						<view>配送费用</view>
						<view class="co-red">￥{{orderPrices.shipping_price}}元</view>
					</view>
					<view v-else class="item">
						<view>配送费用</view>
						<view class="co-red">{{!submit ? (orderPrices.shipping_price == 0 ? '包邮' : '') : '自提'}}</view>
					</view>
					<view v-if="orderPrices.coupon_price" class="item" :hidden="true">
						<view>使用优惠券</view>
						<view class="co-red">-￥{{orderPrices.coupon_price}}元</view>
					</view>
					<view v-if="orderPrices.integral_money" class="item" :hidden="true">
						<view>使用积分</view>
						<view class="co-red">-￥ {{orderPrices.integral_money}}元</view>
					</view>
					<view v-if="orderPrices.user_money" class="item">
						<view>使用余额</view>
						<view class="co-red">-￥ {{orderPrices.user_money}}元</view>
					</view>
					<view v-if="orderPrices.order_prom_amount" class="item" :hidden="true">
						<view>优惠活动</view>
						<view class="co-red">-￥ {{orderPrices.order_prom_amount}}元</view>
					</view>
				</view>
				<cover-view class="btn-wrap">
					<button form-type="submit" class="tips-btn" id='submitOrder'>提交订单</button>
					<view class="pay-amount">
						<view class="payable">合计：</view>
						<view class="co-red">￥{{orderPrices.order_amount}}元</view>
					</view>
					<view class='num'>共 {{orderPrices.total_num}} 件商品</view>
				</cover-view>
			</view>
			<view class='show1 coupons' :hidden="true">
				<view :hidden="true">
					<view class='use'>优惠券码
						<view @tap='close_coupons'>
							<image src='../../../static/images/close.png'></image>
						</view>
					</view>
					<view class='input'>
						输入优惠券码 :
						<input type="text" v-model="couponCode" />
					</view>
					<button @tap='addCouponCode'>确定</button>
				</view>
			</view>
		</form>

		<!-- 日期 -->
		<modal @touchmove.stop='catchtouchmove' class="modal" :hidden="flag" no-cancel @confirm="getTime"
			confirmText="确定">
			<view class="modal-content">
				<view class="time_screens">
					<view style="text-align:center;color:#45BCE8">{{year}}-{{month}}-{{day}} {{hour}}:{{minute}}</view>
					<view style="border-top:1px solid #45BCE8;height:25px;font-size:14px;">
						<view class="time-title">年</view>
						<view class="time-title">月</view>
						<view class="time-title">日</view>
						<view class="time-title">时</view>
						<view class="time-title">分</view>
					</view>
					<picker-view indicator-style="height: 50px;" style="width: 100%; height: 300px;" :value="value"
						@change="bindChange">
						<picker-view-column class="picker-text">
							<view v-for="(item, index) in years" :key="'y' + index" style="line-height: 50px">{{item}}
							</view>
						</picker-view-column>
						<picker-view-column class="picker-text">
							<view v-for="(item, index) in months" :key="'m' + index" style="line-height: 50px">{{item}}
							</view>
						</picker-view-column>
						<picker-view-column class="picker-text">
							<view v-for="(item, index) in days" :key="'d' + index" style="line-height: 50px">{{item}}
							</view>
						</picker-view-column>
						<picker-view-column class="picker-text">
							<view v-for="(item, index) in hours" :key="'h' + index" style="line-height: 50px">{{item}}
							</view>
						</picker-view-column>
						<picker-view-column class="picker-text">
							<view v-for="(item, index) in minutes" :key="'min' + index" style="line-height: 50px">
								{{item}}</view>
						</picker-view-column>
					</picker-view>
				</view>
			</view>
		</modal>
	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var common = require('../../../static/utils/common.js');
	var util = require('../../../static/utils/util.js');
	var md5 = require('../../../static/utils/md5.js');
	const date = new Date()
	const years = []
	const months = []
	const days = []
	const hours = []
	const minutes = []
	var thisMon = date.getMonth();
	var thisDay = date.getDate() + 1;
	var thisHours = date.getHours();
	var thisMinutes = date.getMinutes();
	for (let i = 2017; i <= date.getFullYear() + 1; i++) {
		years.push(i)
	}
	for (let i = date.getMonth(); i <= 11; i++) {
		var k = i;
		if (0 <= i && i < 9) {
			k = "0" + (i + 1);
		} else {
			k = (i + 1);
		}
		months.push(k)
	}
	if (0 <= thisMon && thisMon < 9) {
		thisMon = "0" + (thisMon + 1);
	} else {
		thisMon = (thisMon + 1);
	}
	if (0 <= thisDay && thisDay < 10) {
		thisDay = "0" + thisDay;
	}

	if (thisMinutes < 10) {
		thisMinutes = "0" + thisMinutes;
	}

	var totalDay = mGetDate(date.getFullYear(), thisMon);
	for (let i = 1; i <= 31; i++) {
		var k = i;
		if (0 <= i && i < 10) {
			k = "0" + i
		}
		days.push(k)
	}

	for (let i = 0; i <= 23; i++) {
		var k = i;
		if (0 <= i && i < 10) {
			k = "0" + i
		}
		hours.push(k)
	}
	for (let i = 0; i <= 59; i++) {
		var k = i;
		if (0 <= i && i < 10) {
			k = "0" + i
		}
		minutes.push(k)
	}

	function mGetDate(year, month) {
		var d = new Date(year, month, 0);
		return d.getDate();
	}
	export default {
		data() {
			return {
				is_broadcast: 0,
				rate: "",
				url: app.globalData.setting.url,
				resourceUrl: app.globalData.setting.resourceUrl,
				goods: null, //立即购买商品参数
				order: null, //请求的订单数据
				orderPrices: null, //请求的订单价格数据
				payWithUserMoney: true, //是否使用余额支付
				payWithPoints: true, //是否使用积分支付
				maxWord: 0,
				enterAddressPage: false,
				firstEnter: true, //是否第一次进入页面
				storeClick: 0, //点击哪家店(下标)
				couponCode: '', //优惠券码
				invoice_desc: '不开发票',
				text: '不开发票',
				items: [{
					name: '快速配送',
					value: '工作日、双休日与节假日均可送货',
					checked: 'true',
				}, ],
				invoice: {
					is_use: false, //是否开发票
					is_person: true, //是否是个人
					contents: ['明细', '耗材', '办公用品', '电脑配件', '食品酒水', '服饰鞋帽', '日用品', '电器数码', '家具建材', '钟表珠宝', '日化用品'],
					content_idx: 0, //发票内容下标
				},
				formData: {
					invoice_title: '',
					pay_points: '',
					user_money: '',
					paypwd: '',
					user_note: '',
				},
				submit: false,
				submit_heigth_css: 240,
				submit_datas: {
					shop_id: '', //自提id
					submit_text: '', //页面展示自提时间
					submit_address: '', //页面展示自提地点
					name: '', //自提人
					mobile: '', //自提联系方式
					time: '', //自提时间
				},
				weekDay: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
				checkTime: date.getFullYear() + "-" + thisMon + "-" + thisDay + " " + thisHours + ":" + thisMinutes,
				//---时间控件参数
				flag: true,
				is_set: false,
				selected: 0,
				years: years,
				year: date.getFullYear(),
				months: months,
				month: thisMon,
				days: days,
				day: thisDay,
				value: [1, 0, thisDay - 1, thisHours, thisMinutes],
				hours: hours,
				hour: thisHours,
				minutes: minutes,
				minute: thisMinutes,
				show1: true, //优惠券码弹出控制
				click_use_points: false, //是否是点击使用积分按钮
				shouldRaising: 'yes', //对从购物车 进货单页面进来 控制是否显示自提
				store_id2: 0, //对从购物车 进货单页面进来 的store_id
			}
		},
		onLoad: function(options) {
			var that = this;
			var date = this.year + "/" + this.month + "/" + this.day;
			var d = new Date(date);
			var weekDay = this.weekDay;
			var day = weekDay[d.getDay()];
			this.goods = Object.assign({}, options);
			this.submit_datas.submit_text = ' 【' + day + '】';
			this.submit_datas.time = this.year + '-' + this.month + '-' + this.day + ' ' + this.hour + ':' + this.minute;
			this.submit_datas = Object.assign({}, this.submit_datas);
			if (options.store_id2) {
				this.store_id2 = options.store_id2;
				this.shouldRaising = options.shouldRaising;
			}
			that.requestCart2(0);
			that.requestInvoice();
		},
		//重新加载数据
		onShow: function() {
			var that = this
			app.getConfig(function(config) {
				let rate = 1;
				for (let i = 0; i < config.length; i++) {
					if (config[i]['name'] == 'point_rate') {
						rate = config[i]['value']
					}
				}
				that.order = Object.assign({}, that.order);
				that.rate = rate;
			});
			if (this.enterAddressPage) {
				this.enterAddressPage = false;
				var addressId = uni.getStorageSync('cart:cart2:address_id');
				if (addressId !== '') {
					uni.removeStorageSync('cart:cart2:address_id');
				} else {
					addressId = (!this.order || this.order.addressList == null) ? 0 : this.order.addressList
					.address_id;
				}
				this.requestCart2(addressId); //改变地址要重新请求数据
			} else if (!this.firstEnter && this.checkAddressList()) {
				var conponUse = uni.getStorageSync('cart:cart2:cid');
				if (conponUse !== '') {
					uni.removeStorageSync('cart:cart2:cid');
					if (this.order.storeShippingCartList) {
						var stores = this.order.storeShippingCartList;
					}
					for (var i = 0; i < stores.length; i++) {
						if (stores[i].store_id == conponUse.storeId) {
							stores[i].useCouponListId = conponUse.useCouponListId;
							stores[i].useCouponName = conponUse.useCouponName;
							this.order.storeShippingCartList = stores;
							this.calculatePrice();
							break;
						}
					}
					this.order = Object.assign({}, this.order);
				}
			}
			this.firstEnter = false;
		},
		methods: {
			requestCart2: function(addressId) {
				var that = this;
				var data;
				if (this.goods.action) { //商品立即购买跳转
					data = {
						address_id: addressId,
						store_id: this.store_id,
						goods_id: this.goods.goods_id,
						item_id: this.goods.item_id,
						goods_num: this.goods.goods_num,
						action: this.goods.action,
					};
				} else { //商品购物车跳转
					data = {
						store_id: that.goods.store_id,
						address_id: addressId,
					};
				}
				request.get('/api/cart/cart2', {
					failRollback: true,
					data: data,
					success: function(res) {
						var order = res.data.result;
						if (res.data.status == 1) {
							that.order = Object.assign({}, that.order);
						}
						if (that.checkAddressList()) {
							that.getShopList();
							that.calculatePrice();
						}
					},
					failStatus: function(res) {
						if (res.data.status == 0) {
							uni.showModal({
								title: res.data.msg,
								showCancel: false,
								success: function(res) {
									if (res.confirm) {
										uni.navigateBack();
									}
								}
							});
						} else if (res.data.status == -11) {
							that.order = null;
							that.checkAddressList();
						}
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
			/** 发票 */
			requestInvoice: function() {
				var that = this;
				request.get('/api/cart/invoice', {
					failRollback: false,
					successReload: true,
					success: function(res) {
						if (res.data.result.invoice_title) {
							var text = res.data.result.invoice_desc == '不开发票' ? '不开发票' : 
								'纸质 ( ' + res.data.result.invoice_title + '-' + res.data.result.invoice_desc + ' )';
							that.text = text;
							that.invoice_title = res.data.result.invoice_title;
							that.invoice_desc = res.data.result.invoice_desc;
							that.taxpayer = res.data.result.taxpayer;
						}
					}
				});
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
			getInvoiceData: function(form) { //发票处理
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
			keyUpChangePay2: function(e) {
				this.payWithPoints = e.detail.value.length > 0 ? false : true;
			},
			keyUpChangeNum: function(e) {
				this.maxWord = e.detail.value.length;
			},
			/** 请求计算价格，无入参则使用已保存的参数 */
			calculatePrice: function(formData, submitOrder) {
				var that = this;
				if (typeof formData == 'undefined' || formData == '') {
					formData = that.formData;
				} else {
					that.formData = Object.assign({}, formData);
				}
				var storeData = {
					user_note: {},
					coupon_id: {},
				};
				if (that.order.storeShippingCartList) {
					var stores = that.order.storeShippingCartList;
				}
				for (var i = 0; i < stores.length; i++) {
					var s = stores[i];
					storeData.user_note[s.store_id] = formData['user_note' + s.store_id];
					storeData.coupon_id[s.store_id] = s.useCouponListId ? s.useCouponListId : '0';
				}
				var pwd = formData.paypwd ? md5('TPSHOP' + formData.paypwd) : '';
				var postData;
				var submitTime = '';
				if (this.submit_datas.time != '') {
					submitTime = this.submit_datas.time.replace(/-/g, '/');
					submitTime = Date.parse(new Date(submitTime)) / 1000
				}
				if (this.goods.action) {
					postData = {
						store_id: that.goods.store_id,
						address_id: that.order.addressList.address_id,
						invoice_title: formData.invoice_title ? formData.invoice_title : '',
						invoice_desc: that.invoice_desc ? that.invoice_desc : '',
						pay_points: formData.pay_points ? formData.pay_points : 0,
						user_money: formData.user_money ? formData.user_money : 0,
						pwd: pwd,
						pay_pwd: pwd,
						act: submitOrder ? 'submit_order' : 'order_price',
						cart_form_data: escape(JSON.stringify(storeData)),
						goods_id: this.goods.goods_id,
						item_id: this.goods.item_id,
						goods_num: this.goods.goods_num,
						action: this.goods.action,
						is_broadcast: this.goods.is_broadcast,
						shop_id: this.submit ? this.submit_datas.shop_id : '',
						consignee: this.submit ? this.submit_datas.name : '',
						mobile: this.submit ? this.submit_datas.mobile : '',
						take_time: submitTime + 6 * 24 * 60 * 60,
					};
				} else {
					postData = {
						is_broadcast: that.goods.is_broadcast,
						store_id: that.goods.store_id,
						address_id: that.order.addressList.address_id,
						invoice_title: formData.invoice_title ? formData.invoice_title : '',
						invoice_desc: that.invoice_desc ? that.invoice_desc : '',
						pay_points: formData.pay_points ? formData.pay_points : 0,
						user_money: formData.user_money ? formData.user_money : 0,
						pwd: pwd,
						pay_pwd: pwd,
						act: submitOrder ? 'submit_order' : 'order_price',
						cart_form_data: escape(JSON.stringify(storeData)),
						shop_id: this.submit ? this.submit_datas.shop_id : '',
						consignee: this.submit ? this.submit_datas.name : '',
						mobile: this.submit ? this.submit_datas.mobile : '',
						store_id: this.goods.store_id ? this.goods.store_id : 0,
						take_time: submitTime + 6 * 24 * 60 * 60,
					};
				}
				postData = Object.assign(postData, that.getInvoiceData(formData));
				request.post('/api/cart/cart3', {
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
							master_order_sn: res.data.result
						}, 1);
					},
					failStatus: function(res) {
						if (that.click_use_points == true) {
							that.formData.pay_points = 0;
							that.click_use_points = false;
							that.formData = Object.assign({}, that.formData);
						}
					}
				});
			},
			/** 提交订单 */
			submitForm: function(e) {
				var submitOrder = (e.detail.target.id == 'submitOrder') ? true : false;
				var formData = {}
				for (const key in e.detail.value) {
					formData[key] = e.detail.value[key]
				}
				this.calculatePrice(formData, submitOrder);
			},
			/** 使用优惠券 */
			useCoupon: function(e) {
				if (this.order.storeShippingCartList) {
					var store = this.order.storeShippingCartList[e.currentTarget.dataset.idx];
				}
				var num = this.order.couponNum[store.store_id] ? this.order.couponNum[store.store_id] : 0;
				if (num <= 0) {
					return app.showWarning("无可用优惠券");
				}
				var params;
				if (this.goods.action) {
					params = {
						lid: store.useCouponListId,
						store_id: store.store_id,
						money: store.store_total_price,
						goods_id: this.goods.goods_id,
						item_id: this.goods.item_id,
						goods_num: this.goods.goods_num,
						action: this.goods.action,
					}
				} else {
					params = {
						lid: store.useCouponListId,
						store_id: store.store_id,
						money: store.store_total_price,
					}
				}
				uni.navigateTo({
					url: '/pages/user/checkcoupon/checkcoupon?' + util.Obj2Str(params)
				});
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
			},
			//判断获取预约门店还是获取自提点
			getShopList: function() {
				var that = this;
				uni.authorize({
					scope: 'scope.userLocation',
					success: function(res) {
						uni.getLocation({
							type: 'wgs84',
							success(res2) {
								if (that.order.storeShippingCartList) {
									that.order.storeShippingCartList[0]['cartList'][0]['goods']['is_virtual'] == 2 ? that.requestShopList(res2) : that.getSubmitAddressDatas(res2);
								}
							}
						})
					}
				})
			},
			getSubmitAddressDatas: function(res) {
				var that = this;
				var datas = that.order.addressList;
				request.post('/Home/Api/shop', {
					data: {
						province_id: datas.province,
						store_id: that.goods.store_id || that.goods.store_id2 || 0,
						city_id: datas.city,
						district_id: datas.district,
						shop_address: '', //datas.address
						longitude: res.longitude,
						latitude: res.latitude
					},
					successReload: true,
					success: function(res) {
						var data = res.data.result ? res.data.result : res.data;
						if (data.length > 0 && that.shouldRaising == 'yes') {
							var items = [{
								name: '快速配送',
								value: '工作日、双休日与节假日均可送货',
								checked: 'true'
							}, {
								name: '上门自提',
								value: '选择自提上门点并支付订单>到自提点提货'
							}]
							var items2 = [{
								name: '快速配送',
								value: '工作日、双休日与节假日均可送货',
								checked: 'true'
							}]
							that.items = that.shouldRaising == 'yes' ? items : items2;
							that.items = [...that.items];
							that.submit_datas.shop_id = data[0].shop_id;
							that.submit_datas.submit_address = data[0].shop_name;
							that.submit_datas.name = datas.consignee;
							that.submit_datas.mobile = datas.mobile;
							that.submit_heigth_css = 240;
							that.submit_datas = Object.assign({}, that.submit_datas);
						} else {
							that.items = [{
								name: '快速配送',
								value: '工作日、双休日与节假日均可送货',
								checked: 'true'
							}];
							that.submit_heigth_css = 120;
							that.submit = false;
						}
					}
				});
			},
			radioChange: function(e) {
				if (parseInt(e.detail.value) == 1) {
					this.submit = true;
					this.calculatePrice();
				} else {
					this.submit = false;
					this.calculatePrice();
				}
			},
			//使用积分
			usePoints: function() {
				let formPoints = this.formData.pay_points;
				if (formPoints > 0) { //取消使用积分
					this.formData.pay_points = 0;
					this.click_use_points = true;
				} else {
					this.formData.pay_points = this.order.userInfo.pay_points;
					this.click_use_points = true;
				}
				this.formData = Object.assign({}, this.formData);
				this.calculatePrice();
			},
			showdate: function() {
				this.flag = false;
			},
			getSubmitAddress(e) {
				var store_id = e.currentTarget.dataset.storeid
				uni.navigateTo({
					url: "../../cart/submit_address/submit_address?store_id=" + store_id + "&selected=" + this.selected + '&datas=' + JSON.stringify(this.order.addressList),
				})
			},
			/** 日期插件s */
			showModel: function(e) {
				this.flag = false;
			},
			getTime: function(e) {
				var times = this.year + "-" + this.month + "-" + this.day
				var date_time_picker_mask = times;
				var date = date_time_picker_mask.replace(/-/g, '/');
				var d = new Date(date);
				var weekDay = this.weekDay;
				var day = weekDay[d.getDay()];
				this.flag = true;
				this.checkTime = times + " " + this.hour + ":" + this.minute;
				this.submit_datas.submit_text = ' 【' + day + '】';
				this.submit_datas.time = times + " " + this.hour + ":" + this.minute;
				this.submit_datas = Object.assign({}, this.submit_datas);
			},
			bindChange: function(e) {
				const val = e.detail.value;
				this.year = this.years[val[0]];
				this.month = this.months[val[1]];
				this.day = this.days[val[2]];
				this.hour = this.hours[val[3]];
				this.minute = this.minutes[val[4]];
				var totalDay = mGetDate(this.year, this.month);
				var changeDate = [];
				for (let i = 1; i <= totalDay; i++) {
					var k = i;
					if (0 <= i && i < 10) {
						k = "0" + i
					}
					changeDate.push(k)
				}
				this.days = [...changeDate];
			},
			/** 日期插件e */
			//   使用优惠券码
			coupons: function(e) {
				this.show1 = false;
			},
			close_coupons: function(e) {
				this.show1 = true;
			},
			/** 显示发票信息 */
			showInvoice: function() {
				uni.navigateTo({
					url: '../../cart/invoice/invoice',
				})
			}
		}
	}
</script>

<style scoped src="./cart2.css">

</style>
