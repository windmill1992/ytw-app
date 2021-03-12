<template>
	<view>
		<view class="head">
			<view class="img_status">
				<image class="statusImg" :src="m1.setImg(list[0].seller_order_status_detail)"></image>
				<text class="statusTxt" space="ensp"> {{ list[0].seller_order_status_detail }}</text>
			</view>
			<!-- 已发货的  转物流信息   查看收货人信息  <navigator url="/pages/user/express/express?order_id={{list[0].order_id}}">dljhfsdjsdklfsf</navigator> -->
			<view class="expressInfo"
				v-if="(list[0].seller_order_status_detail == '已发货' || list[0].seller_order_status_detail == '已完成') && express.code == 200">
				<view class="expressIcon">
					<view class="absAddressIcon">
						<van-icon name="logistics" size="50rpx" />
					</view>
				</view>
				<view class="expressTxt">
					<view class="flex2">{{ express.code == 200 ? express.data[0].context : '' }}</view>
					<view class="flex1">{{ express.code == 200 ? express.data[0].time : '' }}</view>
				</view>
				<view style="width:70rpx;" :data-id="list[0].order_id">{{ ' ' }}</view>
			</view>
			<!-- 收货人信息 -->
			<view class="address"
				v-if="list[0].seller_order_status_detail != '已取消' && list[0].seller_order_status_detail != '已取消(已退款)' && list[0].seller_order_status_detail != '待支付'">
				<view class="absAddressIcon">
					<van-icon name="location-o" size="50rpx" />
				</view>
				<view>
					<text class="inlinebox name">{{ m1.noPassByName(list[0].consignee,eyeFlag.a) }}</text>
					<text class="inlinebox mobile">{{m1.noPassByMobile(list[0].mobile,eyeFlag.b)}}</text>
				</view>
				<view><text>{{list[0].user_address}}{{ '****' }}</text></view>
			</view>
		</view>

		<!-- 商品 -->
		<view class="detailGoods">
			<order-item :url="url" isDetail @operationOrder="operationOrder" @clickItem="clickItem" :data1="list">
			</order-item>
		</view>

		<!-- 备注  -->
		<view class="remarks">
			<view class="remarkHead1"><text class="remarkTxt1">备注</text><text class="remarkTxt2">（备注信息仅商家与平台可见）</text>
			</view>
			<view class="remarkItem" v-if="orderLog.admin_note">
				<view class="remarkTime">
					<text class="absTime">{{orderLog.time2}}
						<text class="smallTime">{{orderLog.time1}}</text>
					</text>
				</view>
				<view class="remarkContent">{{ orderLog.admin_note }}</view>
				<view class="remarkOperation">
					<view
						v-if="list[0].seller_order_status_detail == '待发货' || list[0].seller_order_status_detail == '待支付'}}">
						<van-icon name="records" custom-class="remarkIcon" @tap.stop="modifyRemark" color="#18c2ba"
							size="50rpx" />
					</view>
				</view>
			</view>
			<view class="noRemark" v-if="!orderLog.admin_note">
				该订单没有备注！
			</view>
		</view>
		<!-- 订单信息部分 -->
		<view class="orderParams">
			<view class="params inlinerela">订单编号：{{ list[0].order_sn }} <text class="absCopy" @tap="copyOrderCode"
					:data-code="list[0].order_sn">{{ ' ' }}</text></view>
			<view class="params">下单时间：{{ list[0].time1 }}</view>
			<view class="params" v-if="list[0].seller_order_status_detail != '待支付'">付款时间：{{ list[0].time2 }}</view>
			<view class="params"
				v-if="list[0].seller_order_status_detail != '待支付' && list[0].seller_order_status_detail != '已取消' && list[0].seller_order_status_detail != '已取消(已退款)'">
				成交时间：{{ list[0].time3 }}</view>
		</view>

		<!-- 弹出备注 showRemarkPopup -->
		<van-popup :show="showRemarkPopup" overlay round @close="onPopupClose" @click-overlay="onPopupClose">
			<view class="remarkBox">
				<view class="remarkHead">编辑备注</view>
				<textarea :style="'color:' + remarkVal.length == 0 ? '#ccc' : '#555'" class="remarkArea"
					v-model="remarkVal" maxlength="100" placeholder-class="remarkPlace"
					placeholder="请输入备注，仅商家和平台可见"></textarea>
				<text class="absRemarkSum">{{ remarkVal.length }}/100</text>
				<view class="remarkBtn" @tap.stop="savreRemark">保 存</view>
			</view>
		</van-popup>

	</view>
</template>

<script lang="wxs" module="m1">
	var noPassByMobile = function(str, flag) {
		var str = (str ? str : '') + ''
		if (null != str && str != undefined) {
			if (flag) {
				return str
			} else {
				return str.substring(0, 2) + "*********" + str.substring(9, str.length)
			}
		} else {
			return "";
		}
	}
	var noPassByName = function(str, flag) {
		var str = (str ? str : '') + ''
		if (null != str && str != undefined) {
			if (flag == true) {
				return str
			}
			if (str.length <= 3) {
				return str.substring(0, 1) + (str.length == 2 ? "*" : "**");
			} else if (str.length > 3 && str.length <= 6) {
				return "**" + str.substring(2, str.length);
			} else if (str.length > 6) {
				return str.substring(0, 2) + "****" + str.substring(6, str.length)
			}
		} else {
			return "";
		}
	}
	var setImg = function(s) {
		if (!s) {
			return 'grey'
		}
		if (s == '未知' || (s.indexOf('取消') != -1) || (s.indexOf('关闭') != -1)) {
			return '/images/order_status_grey.png'
		} else if ((s.indexOf('待发货') != -1) || s == '待支付' || s == '待自提') {
			return '/images/order_status_orange.png'
		} else {
			return '/images/order_status_theme.png'
		}

	}
	module.exports = {
		noPassByMobile,
		noPassByName,
		setImg
	}
</script>
<script>
	import orderItem from "../../components/orderGoodsItem/orderItem";
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	var util = require('../../../static/utils/util.js');
	export default {
		components: {
			orderItem
		},
		data() {
			return {
				url: setting.url, //
				store_id: '', //
				order_id: '', //
				order_sn: '', //
				userInfo: app.globalData.userInfo,
				eyeFlag: { //控制**显示
					a: false,
					b: false
				},
				list: [], //订单相关数据
				showRemarkPopup: false, //展示备注框
				isModify: false, //是添加备注还修改  false 添加
				curIndex: '', //当前操作的数据
				orderLog: {},
				remarkVal: '', //备注
				express: {
					code: 0
				}, //快递信息
			}
		},
		onLoad: function(options) {
			this.store_id = options.store_id;
			this.order_id = options.order_id;
			this.order_sn = options.order_sn;
			this.getDetail()
			this.getOrderLogList()
		},
		methods: {
			getDetail: function() {
				var that = this
				request.get(that.url + '/api/StoreOrder/storeOrderDetails', {
					data: {
						store_id: that.store_id,
						order_id: that.order_id,
						order_sn: that.order_sn,
					},
					success: function(res) {
						var list = res.data.result
						list.time1 = res.data.result.add_time == 0 ? '- - - -' : 
							util.format(res.data.result.add_time, 'yyyy-MM-dd hh:mm')
						list.time2 = res.data.result.pay_time == 0 ? '- - - -' : 
							util.format(res.data.result.pay_time, 'yyyy-MM-dd hh:mm')
						list.time3 = res.data.result.confirm_time == 0 ? '- - - -' : 
							util.format(res.data.result.confirm_time, 'yyyy-MM-dd hh:mm')
						that.list = [list]
						if (res.data.result.shipping_code && res.data.result.invoice_no) {
							that.requestExpress({
								shipping_code: res.data.result.shipping_code,
								invoice_no: res.data.result.invoice_no
							})
						}
					}
				})
			},
			operationOrder: function(e) { //下面的按钮操作
				var that = this
				var type = e.detail.type
				var id = e.detail.id
				var index = e.detail.index
				this.curIndex = index;
				if (type == 'zf') { //自发
					uni.navigateTo({
						url: '/pages/goods/deliverGoods/deliverGoods?index=0',
					})
				} else if (type == 'bz') { //备注
					this.showRemarkPopup = true;
				} else if (type == 'df') { //代发
					uni.showModal({
						content: '请平台代发后，您将不能自己发货，且该订单的款项将划拨给平台，由平台工作人员上门现金拿货代发出去，谢谢您的配合',
						confirmColor: '#18c2ba',
						cancelText: '不需要了',
						confirmText: '申请代发',
						success(res) {
							if (res.confirm) {
								request.post(that.url + '/api/StoreOrder/platformSend', {
									data: {
										store_id: that.list[0].store_id,
										order_id: that.list[0].order_id,
									},
									success: function(res) {
										if (res.data.status == 1) {
											uni.showToast({
												title: '代发成功',
											})
											that.resetData()
											that.getInfo()
										}
									}
								})
							} else if (res.cancel) {}
						}
					})
				}
			},
			copyOrderCode: function(e) { //拷贝订单号
				uni.setClipboardData({
					data: e.currentTarget.dataset.code,
					success: function() {
						uni.getClipboardData({
							success: (option) => {
								uni.showToast({
									title: '订单号复制成功',
									icon: 'none'
								})
							},
						})
					}
				})
			},
			clickItem: function(e) {

			},
			onPopupClose: function() {
				this.showRemarkPopup = false
			},
			savreRemark: function() { //保存备注
				var that = this
				var remark = that.remarkVal + ''
				if (remark.trim() == '') {
					return
				}
				var data = {
					type: that.list[0].seller_order_status_detail == '待发货' ? 'WAITSEND' : 'WAITPAY',
					order_id: that.list[0].order_id,
					store_id: that.list[0].store_id,
					order_status: that.list[0].order_status,
					pay_status: that.list[0].pay_status,
					shipping_status: that.list[0].shipping_status,
					user_id: that.userInfo.user_id,
					note: remark
				}
				if (that.isModify) {
					data.action_id = that.orderLog.action_id
				}
				request.post(that.url + '/api/StoreOrder/orderLogAdd', {
					data,
					success: function(res) {
						uni.showToast({
							title: '保存成功',
						})
						that.showRemarkPopup = false
						that.remarkVal = ''
						that.getOrderLogList()
					}
				})
			},
			modifyRemark: function(e) { //编辑备注
				this.showRemarkPopup = true
				this.isModify = true
			},
			toExpressPage: function(e) { //前往物流信息页面
				uni.navigateTo({
					url: `/pages/user/express/express?order_id=${e.currentTarget.dataset.id}`,
				})
			},
			modifyAddress: function() { //修改
				uni.navigateTo({
					url: '/pages/user/address_list/address_list?operate=deliver&order_id=' + this.store_id,
				})
			},
			looklook: function(e) { //查看
				var type = e.currentTarget.dataset.type
				if (type == 'a') {
					this.eyeFlag.a = !this.eyeFlag.a
				} else {
					this.eyeFlag.b = !this.eyeFlag.a
				}
				this.eyeFlag = Object.assign({}, this.eyeFlag)
			},
			getOrderLogList: function() { //获取备注列表
				var that = this
				request.get(that.url + '/api/StoreOrder/orderLogList', {
					data: {
						order_id: that.order_id
					},
					success: function(res) {
						var log = res.data.result
						if (log.admin_note_time) {
							log.time1 = log.admin_note_time.split(' ')[0]
							log.time2 = log.admin_note_time.split(' ')[1]
						}
						that.orderLog = Object.assign({}, log)
					}
				})
			},
			requestExpress: function(data) {
				var that = this;
				uni.request({
					url: this.url + '/home/api/queryExpress',
					data,
					success: function(res) {
						that.express = Object.assign({}, res.data)
					},
					fail: function(res) {
						app.showWarning('请求失败');
					}
				});
			},
		}
	}
</script>

<style scoped src="./orderDetail.css">

</style>
