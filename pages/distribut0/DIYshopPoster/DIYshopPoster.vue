<template>
	<view>
		<view class="topBg">
			<image class="bgImg"
				src="https://test.yitongwang.com/public/static/images/minniapp/DIYshop_sell_banner.png"></image>
		</view>

		<view class="setContent">
			<!-- 群发海报 -->
			<view class="insatiableItem">
				<image class="leftIcon"
					src="https://test.yitongwang.com/public/static/images/minniapp/DIYshop_poster_1.png"></image>
				<view class="rightTxt" @tap.stop="getPic">群发海报</view>
			</view>

			<view class="insatiableMore">
				<image class="leftIcon"
					src="https://test.yitongwang.com/public/static/images/minniapp/DIYshop_poster_2.png"></image>
				<view class="rightTxt">更多功能正在开发中，敬请期待...</view>
			</view>
		</view>

		<!-- 放海报的 -->
		<view v-if='share_btn'>
			<view class="prom-model">
				<icon type="cancel" color="gray" size="22" class="modal-close" @tap="closeShareModal" />
				<view class="prom-title">{{ shareTxt }}</view>
				<view class='share-pic'>
					<image @tap.stop='previewSharePic' style='width:100%;height:100%' :src='share_pic'></image>
				</view>
				<view class="share-save-btns">
					<view class="share-save-btn" @tap.stop="saveSharePic">保存海报</view>
				</view>
			</view>
		</view>

		<!-- <publics :page='2' :isiphoneX='isiphoneX' :is_A='store.is_A' :isGoodsList='true'></publics>
		<operations :operaList='operaList' current='营销管理' :isiphoneX='isiphoneX' v-if='shouldOperationsShow'></operations>
		<proposal :proposalData='proposalData' :isProposalDone='isProposalDone' v-if='shouldProposalShow'></proposal> -->
	</view>
</template>

<script>
	import publics from '../../components/publics/publics';
	import operations from '../../components/operations/operations';
	import proposal from '../../components/publics/proposal';
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	var common = require('../../../static/utils/common.js');
	var { operaList } = require('../../../static/utils/util2.js');
	export default {
		components: {
			publics,
			operations,
			proposal
		},
		data() {
			return {
				url: setting.url,
				operaList: operaList,
				shouldOperationsShow: false,
				shouldProposalShow: false,
				page: 2,
				isiphoneX: uni.getStorageSync('isiphoneX') || false,
				is_A: true,
				share_btn: false, //海报
				proposalData: {
					img: [],
					proposalArea: ''
				},
				isProposalDone: false, //反馈是否完成展示成功的界面
			}
		},
		onLoad: function(options) {
			this.is_A = uni.getStorageSync('app:userInfo').is_B == 1 ? false : true;
		},
		methods: {
			getPic: function() {
				var that = this
				uni.showModal({
					content: '是否立即生成店铺海报并群发',
					confirmColor: '#18c2ba',
					cancelColor: '#777',
					success: function(res) {
						if (res.confirm) {
							that.haibao()
						}
					}
				})
			},
			haibao: function(store_id) {
				var that = this
				request.get(that.data.url + '/api/Goods/isStoreSharePoster', {
					data: {
						store_id: uni.getStorageSync('app:userInfo').store_id,
						type: 0
					},
					success: function(res2) {
						if (res2.data.status == 1) {
							uni.showLoading({
								title: '正在生成',
								mask: true,
							})
							var store_id = uni.getStorageSync('app:userInfo').store_id;
							var token = uni.getStorageSync('app:userInfo').token;
							uni.getImageInfo({
								src: that.url + '/api/goods/storeSharePoster?store_id=' + store_id + '&type=0&token=' + token,
								isShowLoading: false,
								success: function(res) {
									that.share_btn = true;
									that.share_pic = res.path;
									that.actionSheetHidden = true;
								},
								complete: function(res) {
									uni.hideLoading()
								}
							})
						}
					}
				})
			},
			// 展示海报
			previewSharePic: function() {
				uni.previewImage({
					urls: [this.share_pic],
				})
			},
			// 关闭海报
			closeShareModal: function() {
				this.share_btn = false;
			},
			// 保存海报
			saveSharePic: function() {
				var that = this
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success: function(res) {
						uni.saveImageToPhotosAlbum({
							filePath: that.share_pic,
							success: function(res) {
								that.share_btn = false;
								uni.showToast({
									title: '保存成功',
									duration: 2000
								})
							}
						})
					},
					fail: function(res) {
						common.checkAuthorize('scope.writePhotosAlbum')
					}
				})
			},
			distributTopages: function(e) {
				var index = e.currentTarget.dataset.idx
				if ((index == 5 || index == 3) && !this.is_A) {
					return uni.showToast({
						title: '开发中~~',
						icon: 'none'
					})
				}
				if (index == 2) { //点击的店铺操作
					this.shouldOperationsShow = true;
					return
				}
				common.todistribut(index, this.page);
			},
			closeOperations() { //关闭店铺管理的操作选项
				this.shouldOperationsShow = false;
				this.shouldProposalShow = false;
			},
			clickTelmpleteOpera(e) {
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
						var index = historyArr.indexOf("pages/distribut0/DIYshop/DIYshop")
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
						that.isProposalDone = false
						break;
					case '3':
						var index = historyArr.indexOf("pages/distribut0/DIYshopPoster/DIYshopPoster")
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
			callService() {
				uni.makePhoneCall({
					phoneNumber: '400-008-6336',
				})
			},
			proposalAddImg() { //增加投诉建议的图片
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
			delProposalImg(e) { //删除投诉建议的图片
				var index = e.currentTarget.dataset.index
				var imgs = this.proposalData.img
				imgs.splice(index, 1)
				this.proposalData.img = imgs;
				this.proposalData = Object.assign({}, this.proposalData);
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
					url: that.data.url + '/api/newjoin/upload_qianzi_img',
					success: function(res) {
						if (res.statusCode !== 200) {
							return
						}
						var result = JSON.parse(res.data)
						that.proposalData.img = [...that.data.proposalData.img, ...[result.result]];
						that.proposalData = Object.assign({}, that.proposalData);
						uni.hideLoading()
					}
				})
			},
			proposalAreaInput(e) { //input值变化
				this.proposalData.proposalArea = e.detail.value
				this.proposalData = Object.assign({}, this.proposalData);
			},
			proposalSubmit() { //提交
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
						that.isProposalDone = true;
					}
				})
			}
		}
	}
</script>

<style scoped src="./DIYshopPoster.css">

</style>
