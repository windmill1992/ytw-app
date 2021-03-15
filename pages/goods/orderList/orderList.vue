<template>
	<view>
		<van-tabs :active="active" @change="onNavChange" animated color="#18c2ba">
			<van-tab title="待支付">
				<order-item :url="url" @operationOrder="operationOrder" @clickItem="clickItem" :data1="list">
				</order-item>
			</van-tab>
			<van-tab title="待发货">
				<order-item :url="url" @operationOrder="operationOrder" @clickItem="clickItem" :data1="list">
				</order-item>
			</van-tab>
			<van-tab title="已发货">
				<order-item :url="url" @operationOrder="operationOrder" @clickItem="clickItem" :data1="list">
				</order-item>
			</van-tab>
			<van-tab title="全部">
				<order-item :url="url" @operationOrder="operationOrder" @clickItem="clickItem" :data1="list">
				</order-item>
			</van-tab>
		</van-tabs>
		<view v-if="list.length == 0">
			<van-empty class="custom-image" image="../../../static/images/custom-empty-image.png"
				description="暂时没有相关订单哦~" />
		</view>
		<!-- 弹出备注   showRemarkPopup -->
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
		<!-- 底部菜单 -->
		<!-- 	<import src="../../index/publics/publics.wxml"/>
		<import src="../../index/publicPage/publicPage.wxml"/>
		<template is="distributMenu" data="{{page:3,isiphoneX:isiphoneX,is_A:is_A}}" />
		<template is="operations" data="{{operaList,current:'',isiphoneX:isiphoneX}}" wx:if="{{shouldOperationsShow}}" />
		<template is="proposal" data="{{proposalData,isProposalDone}}" wx:if="{{shouldProposalShow}}" /> -->
	</view>
</template>

<script>
	import orderItem from "../../components/orderGoodsItem/orderItem";
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	var mapType = ['WAITPAY', 'WAITSEND', 'WAITRECEIVE', ''];
	var check = false;
	var common = require('../../../static/utils/common.js');
	var {
		operaList
	} = require('../../../static/utils/util2.js');
	export default {
		components: { orderItem },
		data() {
			return {
				shouldOperationsShow: false,
				shouldProposalShow: false,
				operaList: operaList,
				isiphoneX: uni.getStorageSync('isiphoneX') || false,
				is_A: true,
				url: setting.url,
				active: 0,
				userInfo: app.globalData.userInfo,
				p: 1,
				page: 3,
				curType: 'WAITPAY', //请求类型
				list: [], //存放数据
				showRemarkPopup: false, //展示备注框
				remarkVal: '',
				curIndex: {}, //当前操作的数据
				isFirst: true,
				load: true,
				showEmpty: false,
				proposalData: { //反馈 相关
					img: [],
					proposalArea: ''
				},
				isProposalDone: false, //反馈是否完成展示成功的界面
			}
		},
		onLoad: function(options) {
			this.userInfo = Object.assign({}, app.globalData.userInfo);
			this.is_A = app.globalData.userInfo.is_B == 0 && app.globalData.userInfo.store_id > 0;
			this.getInfo();
		},
		onShow: function() {
			if (this.isFirst) {
				this.isFirst = false
				return
			} else {
				this.resetData()
				this.getInfo()
			}
		},
		onPullDownRefresh: function() {
			this.resetData()
			this.getInfo()
		},
		onReachBottom: function() {
			this.p = this.p - 0 + 1;
			this.getInfo();
		},
		methods: {
			getInfo: function() {
				var that = this
				if (!this.load) {
					return
				}
				request.get(that.url + '/api/StoreOrder/storeOrderList', {
					data: {
						type: that.curType,
						store_id: that.userInfo.store_id,
						p: that.p
					},
					success: function(res) {
						if (check) {
							check = false;
							that.load = true;
							that.list = [...res.data.result];
							that.$nextTick(function(){
								that.load = !(res.data.result.length < 10)
							})
							return
						}
						that.list = [...that.list, ...res.data.result];
						that.load = !(res.data.result.length == 0);
					},
					complete: function() {
						uni.stopPullDownRefresh()
					},
				})
			},
			resetData: function() { //重置部分数据
				this.p = 1;
				this.list = [];
				this.load = true;
			},
			onNavChange: function(e) { //切换Nav
				check = true;
				this.curType = mapType[e.detail.index];
				this.load = true;
				this.p = 1;
				this.getInfo();
			},
			clickItem: function(e) { //点击订单中的商品
				var index = e.detail.index
				uni.navigateTo({
					url: `/pages/goods/orderDetail/orderDetail?order_id=${this.list[index].order_id}&store_id=${this.list[index].store_id}&order_sn=${this.list[index].order_sn}`
				})
			},
			operationOrder: function(e) { //下面的按钮操作
				var that = this
				var type = e.detail.type
				var id = e.detail.id
				var index = e.detail.index
				this.curIndex = index
				if (type == 'zf') { //自发
					if (that.list[index].is_delivery == 1) {
						return uni.showToast({
							title: '该订单已申请平台代发！请等待平台代发~',
							icon: 'none'
						})
					}
					uni.navigateTo({
						url: '/pages/goods/deliverGoods/deliverGoods?index=' + index,
					})
				} else if (type == 'bz') { //备注
					this.showRemarkPopup = true
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
										store_id: that.list[index].store_id,
										order_id: that.list[index].order_id,
									},
									success: function(res) {
										if (res.data.status == 1) {
											uni.showToast({
												title: '代发成功',
											})
											setTimeout(() => {
												that.resetData()
												that.getInfo()
											}, 1000)
										}
									}
								})
							} else if (res.cancel) {}
						}
					})
				} else if (type == 'gj') {
					uni.navigateTo({
						url: `/pages/goods/changeGoodsPrice/changeGoodsPrice?order_id=${this.list[index].order_id}&store_id=${this.list[index].store_id}&order_sn=${this.list[index].order_sn}`
					})
				} else if (type == 'pj') {

				}
			},
			onPopupClose: function() {
				this.showRemarkPopup = false
			},
			savreRemark: function() { //保存备注
				var that = this
				var Val = that.remarkVal
				if (Val.trim() == '') {
					return
				}
				var order = that.list[that.curIndex]
				request.post(that.url + '/api/StoreOrder/orderLogAdd', {
					data: {
						type: order.seller_order_status_detail == '待发货' ? 'WAITSEND' : 'WAITPAY',
						order_id: order.order_id,
						store_id: order.store_id,
						order_status: order.order_status,
						pay_status: order.pay_status,
						shipping_status: order.shipping_status,
						user_id: that.userInfo.user_id,
						note: Val
					},
					success: function(res) {
						uni.showToast({
							title: '保存成功',
						})
						that.showRemarkPopup = false
						that.remarkVal = ''
					}
				})
			},
			closeOperations: function() { //关闭店铺管理的操作选项
				this.shouldOperationsShow = false
				tis.shouldProposalShow = false
			},
			distributTopages: function(e) {
				var index = e.currentTarget.dataset.idx
				var is_A = (this.userInfo.is_B == 0 && this.userInfo.store_id > 0)
				if (is_A == 0 && (e.currentTarget.dataset.idx == 5 || e.currentTarget.dataset.idx == 3)) {
					return uni.showToast({
						title: '开发中~',
						icon: 'none'
					})
				}
				if (index == 2) { //点击的店铺操作
					if (this.shouldProposalShow) {
						return
					}
					this.shouldOperationsShow = !this.shouldOperationsShow
					return
				}
				common.todistribut(e.currentTarget.dataset.idx, this.page);
			},
			addNewGoods: function() {
				uni.navigateTo({
					url: '/pages/goods/addGoods/index?goods_id=0&is_A=' + (this.userInfo.is_B == 1 ? 0 :
						1),
				})
			},
			clickTelmpleteOpera: function(e) {
				var index = e.currentTarget.dataset.index + ''
				var that = this
				var pages = getCurrentPages()
				var historyArr = []
				for (let i = 0; i < pages.length; i++) {
					historyArr.push(pages[i].route)
				}
				that.shouldOperationsShow = false
				switch (index) {
					case '0':
						var index = historyArr.indexOf("pages/user/account_b/account_b")
						if (index != -1) {
							uni.navigateBack({
								delta: historyArr.length - index - 1,
							})
							return
						}
						uni.navigateTo({
							url: '/pages/user/account_b/account_b',
						})
						break;
					case '1':
						var index = historyArr.indexOf("/pages/distribut0/DIYshop/DIYshop")
						if (index != -1) {
							uni.navigateBack({
								delta: historyArr.length - index - 1,
							})
							return
						}
						uni.navigateTo({
							url: '/pages/distribut0/DIYshop/DIYshop',
						})
						break;
					case '2':
						that.shouldProposalShow = true
						break;
					case '3':
						var index = historyArr.indexOf("/pages/distribut0/DIYshopPoster/DIYshopPoster")
						if (index != -1) {
							uni.navigateBack({
								delta: historyArr.length - index - 1,
							})
							return
						}
						uni.navigateTo({
							url: '/pages/distribut0/DIYshopPoster/DIYshopPoster',
						})
						break;
					default:
						break;
				}
			},
			proposalAddImg: function() { //增加投诉建议的图片
				var that = this
				if (that.proposalData.img.length >= 5) {
					return
				}
				uni.chooseImage({
					count: 5 - this.proposalData.img,
					sourceType: ['album'],
					success: function(res) {
						res.tempFilePaths.forEach((item) => {
							that.uploadFile(item)
						})
					}
				})
			},
			delProposalImg: function(e) { //删除投诉建议的图片
				var index = e.currentTarget.dataset.index
				var imgs = this.proposalData.img
				imgs.splice(index, 1)
				this.proposalData.img = imgs
				this.proposalData = Object.assign({}, this.proposalData)
			},
			uploadFile: function(src) { //上传图片
				if (this.proposalData.img.length >= 5) {
					return
				}
				uni.showLoading({
					title: '上传中...',
					mask: true
				})
				const that = this
				uni.uploadFile({
					filePath: src,
					name: 'qinzi_imgs',
					url: that.url + '/api/newjoin/upload_qianzi_img',
					success: function(res) {
						if (res.statusCode !== 200) {
							return
						}
						var result = JSON.parse(res.data)
						that.proposalData.img = [...that.proposalData.img, ...[result.result]]
						that.proposalData = Object.assign({}, that.proposalData)
						uni.hideLoading()
					}
				})
			},
			proposalAreaInput: function(e) { //input值变化
				this.proposalData.proposalArea = e.detail.value
				this.proposalData = Object.assign({}, this.proposalData)
			},
			proposalSubmit: function() { //提交
				var complaint_content = this.proposalData.proposalArea + ''
				var img = this.proposalData.img
				complaint_content = complaint_content.replace(' ', '')
				if (complaint_content.length <= 5) {
					return uni.showToast({
						title: '请输入至少5个字以上的问题描述~',
						icon: 'none'
					})
				}
				if (img.length == 0) {
					return uni.showToast({
						title: '请至少上传一张问题描述图片~',
						icon: 'none'
					})
				}
				var complaint_img = img.join(',')
				var that = this
				request.post(that.url + '/api/StoreBusiness/complaint', {
					data: {
						store_id: uni.getStorageSync('app:userInfo').store_id || 0,
						user_id: uni.getStorageSync('app:userInfo').user_id || 0,
						complaint_content,
						complaint_img
					},
					success: function(res) {
						that.proposalData = {
							img: [],
							proposalArea: ''
						}
						that.isProposalDone = true
					}
				})
			}

		}
	}
</script>

<style scoped src="./orderList.css">

</style>
