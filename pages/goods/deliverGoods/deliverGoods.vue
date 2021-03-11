<template>
	<view>
		<view class="address">
			<view class="addressTop borderB">
				<van-icon custom-class="absIcon" size="35rpx" name="map-marked" color="#18c2ba" />发货地址
			</view>
			<view class="addressContent" @tap.stop="chooseAddress">
				<view v-if="defAddress.address">
					<view class="addressHead">
						<text class="">发货人：</text>
						<text class="col666">{{defAddress.consignee || ''}}</text>
						<text space="ensp"> 联系方式：</text>
						<text class="col666">{{defAddress.mobile || ''}}</text>
					</view>
					<view class="addressDetail col666 fs24">
						{{defAddress.province_name || ''}}{{defAddress.city_name || ''}}{{defAddress.district_name || ''}}{{defAddress.address || ''}}
					</view>
				</view>
				<view v-if="!defAddress.address">
					<text style="float:right;margin-right: 20rpx;">请选择</text>
				</view>
				<text class="arrAddress"></text>
			</view>
		</view>
		<view class="orderInfo">
			<view class="orderTop">
				<van-icon custom-class="absIcon" size="35rpx" name="orders-o" color="#18c2ba" />
				{{ orderType == 'a' ? '发货快递信息' : '该订单为自提订单，请向下单者索要提货码'}}
			</view>
			<van-cell-group style="position:relative;" v-if="orderType == 'a'">
				<van-field :model:value="value1" label="快递单号" placeholder="请输入快递单号" @click-icon="getImg"
					right-icon="scan" />
			</van-cell-group>
			<van-cell-group v-if="orderType == 'a'">
				<van-field :model:value="curExpress.shipping_name" label="快递公司" placeholder="请选择快递公司" right-icon="arrow"
					readonly @click-icon="setKuaidi" :border="false" />
			</van-cell-group>
			<van-cell-group v-if="orderType == 'b'">
				<van-field label="提 货 码" :model:value="receiveCode" placeholder="请输入提货码(由下单者提供)" :border="false"
					type="number" />
			</van-cell-group>
		</view>
		<button class="subBtn" @tap="sureDeliver">确 认 发 货</button>

		<!-- 快递 公 司 选择 -->
		<van-picker v-if="showExpressPicker" overlay :columns="shipping_list" @cancel="calcelPicker"
			value-key="shipping_name" show-toolbar @confirm="onWuliuChange" />
	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	export default {
		data() {
			return {
				url: setting.url,
				value1: '',
				id: '', //订单的ID
				store_id: '', //店铺ID
				shopId: '',
				orderSn: '',
				shipping_list: [], //快递
				address: [], //地址列表
				defAddress: {}, //默认地址
				curExpress: {
					shipping_code: '',
					shipping_name: ''
				},
				showExpressPicker: false,
				isFirst: true,
				receiveCode: '', //提货码
				orderType: '', // a 普通发货 b 自提发货
				preIndex: '', //上一页面过来时  列表数据的索引
			}
		},
		onLoad: function(options) {
			if (options.index == '' || options.index == 'undefined') {
				uni.navigateBack()
				return
			}
			const pages = getCurrentPages()
			var i = pages.length - 2
			var index = options.index
			var preData = pages[i].list[index] //拿到上一页 被点击操作的订单数据
			this.id = preData.order_id
			this.store_id = preData.storeId
			this.orderType = preData.seller_order_status_detail == '待自提' ? 'b' : 'a'
			this.shopId = preDatas.shop_id
			this.orderSn = preData.order_sn
		},
		methods: {
			getImg: function() { //获取图片
				var that = this
				uni.scanCode({
					success(res) {
						that.value1 = res.result
					}
				})
				return
				//百度AI获取图片内的信息
				uni.chooseImage({
					count: 1,
					success: function(res) {
						uni.request({
							method: 'POST',
							url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=FXI2TYpyEw2PDhmeGEsFeH8v&client_secret=GEEGoGhsg9Xtm5414krWbQDjQQq2DQYj',
							success: function(tokenRes) {
								var base64 = uni.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
								uni.request({
									method: 'POST',
									url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=' +
										tokenRes.data.access_token,
									header: {
										'Content-Type': 'application/x-www-form-urlencoded',
									},
									data: {
										image: base64
									},
									success: function(result) {
										console.log(result)
									}
								})
							}
						})
					}
				})
			},
			setKuaidi: function() {
				this.showExpressPicker = true
			},
			chooseAddress: function() { //重新选地址
				uni.navigateTo({
					url: '/pages/user/address_list/address_list?operate=deliver&order_id=' + this.store_id,
				})
			},
			getAddress: function() {
				var that = this
				request.get(that.url + '/api/StoreOrder/pushShipping', {
					data: {
						store_id: that.store_id
					},
					success(res) {
						if (res.data.result) {
							var defAddress = res.data.result.deliver_address.filter((item) => {
								return item.is_default == 1
							})
						}
						that.address = res.data.result.deliver_address
						that.shipping_list = res.data.result.shipping_list
						that.defAddress = defAddress[0] || {}
					}
				})
			},
			onWuliuChange: function(e) {
				var express = e.detail.value
				this.curExpress = express
				this.showExpressPicker = false
			},
			sureDeliver: function() {
				var that = this
				var address_id = ''
				var codeReg = /^[0-9]*$/
				if (!this.defAddress.address_id) {
					return uni.showToast({
						title: '您还未设置发货地址',
						icon: 'none'
					})
				} else {
					address_id = this.defAddress.address_id
				}
				if (this.orderType == 'a') {
					if (this.value1 == '') {
						return uni.showToast({
							title: '您还未填写快递单号',
							icon: 'none'
						})
					}
					if (this.curExpress.shipping_code == '') {
						return uni.showToast({
							title: '您还没有选择快递公司',
							icon: 'none'
						})
					}
					// 请求快递 判断用户选的快递公司 跟真实的是否一致 
					request.post(`${this.url}/api/StoreOrder/orderNumFindKd`, {
						data: {
							kd_num: this.value1
						},
						success: function(res) {
							if (res.data.result[0]) {
								if (res.data.result[0].comCode != that.curExpress.shipping_code) {
									uni.showToast({
										title: '快递单号与快递公司名不符',
										icon: 'none'
									})
								} else {
									var params = {}
									var postUrl = ''
									// 走到这里  可以收集数据提交了
									if (that.orderType == 'a') {
										postUrl = 'deliveryHandleMini'
										params.store_id = that.store_id
										params.order_id = that.id
										params.shipping = 0
										params.shipping_name = that.curExpress.shipping_name
										params.shipping_code = that.curExpress.shipping_code
										params.send_type = 0
										params.invoice_no = that.value1
										params.store_address_id = address_id
										params.note = '订单发货'
										const pages = getCurrentPages()
										var i = pages.length - 2
										params.goods = pages[i].list[pages[i].curIndex].order_goods.map((item) => {
												return item.goods_id
											})
										params.goods = params.goods.join(',')
									}
									request.post((that.url + '/api/StoreOrder/' + postUrl), {
										data: params,
										success: function(res) {
											if (res.data.status == 1) {
												uni.showToast({
													title: '发货成功',
												})
												setTimeout(() => {
													uni.navigateBack()
												}, 1500)
											}
										}
									})
								}
							} else {
								uni.showToast({
									title: '请仔细检查您填写的快递单号是否正确',
									icon: 'none'
								})
							}
						}
					})
					return
				} else {
					if (this.receiveCode == '' || !codeReg.test(this.receiveCode)) {
						return uni.showToast({
							title: '请填写正确的提货码!由数字组成!',
							icon: 'none'
						})
					} else {
						var params = {}
						var postUrl = 'writeOff'
						params.bar_code = that.receiveCode
						params.order_id = that.id
						params.order_sn = that.orderSn
						params.shop_id = that.shopId
						request.post((that.url + '/api/StoreOrder/' + postUrl), {
							data: params,
							success: function(res) {
								if (res.data.status == 1) {
									uni.showToast({
										title: '发货成功',
									})
									setTimeout(() => {
										uni.navigateBack()
									}, 1500)
								}
							}
						})
					}
				}
			},
			calcelPicker: function() {
				this.showExpressPicker = false
			},
		}
	}
</script>

<style scoped src="./deliverGoods.css">

</style>
