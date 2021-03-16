<template>
	<view>
		<view>
			<good-swiper :data1="list" :url="url"></good-swiper>
		</view>
		<image :src="url + '/public/static/images/minniapp/pinbao-index-banner.png'" class="banner"></image>
		<view class="container13">
			<view class="list">
				<navigator :url="'/pages/subcontract/switchCore/switchCore?status=' + isAdministratorsStatus"
					hover-class="none">
					<view class="item" v-if="isAdministratorsStatus != 1">
						<image src="https://test.yitongwang.com/public/static/images/minniapp/pinbao_list_new.png"
							class="itemImg"></image>
						<view class="item-text">预约仓位</view>
					</view>
				</navigator>
				<view class="item" @tap="toMytions" v-if="isAdministratorsStatus != 1">
					<image src="https://test.yitongwang.com/public/static/images/minniapp/pinbao_list_nmy.png"
						class="itemImg"></image>
					<view class="item-text">我预约的仓位</view>
				</view>
				<view class="item" v-if="isAdministratorsStatus == 1" hover-class="none" @tap="toCore">
					<image src="https://test.yitongwang.com/public/static/images/minniapp/pinbao_list_list.png"
						class="itemImg"></image>
					<view class="item-text">仓位列表</view>
				</view>
			</view>
		</view>

		<!-- 为你推荐 -->
		<good-component :data1="goodsList"></good-component>

		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	const app = getApp();
	const request = require('../../../static/utils/request');
	var setting = app.globalData.setting;
	var flag = true; //true 可以加载推荐商品 false 加载完了
	export default {
		data() {
			return {
				userImg: 'https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/avator.png',
				url: setting.url,
				isAdministratorsStatus: -999,
				list: [],
				goodsList: [], //推荐商品
				p: 1, //推荐商品翻页
			}
		},
		onLoad: function(options) {
			if (!uni.getStorageSync('app:userInfo')) {
				app.getUserInfo(function(userInfo) {
					that.userInfo = Object.assign({}, userInfo)
					that.click = false
				}, true, false);
				return false;
			}
			var img = app.globalData.userInfo.head_pic || ""
			const that = this
			request.get(that.url + "/api/pinbao/getUserIdentity", {
				success: function(res) {
					var result = res.data.result.ad || []
					that.isAdministratorsStatus = res.data.result.is_check_user
					that.userImg = img
					that.list = result.reverse()
				}
			})
			this.getRecomendGoods()
		},
		onReachBottom: function() {
			this.p = (this.p - 0) + 1
			this.getRecomendGoods()
		},
		methods: {
			toMytions: function() {
				if (this.isAdministratorsStatus != 2) {
					if (!uni.getStorageSync('app:userInfo')) {
						app.getUserInfo(function(userInfo) {
							that.userInfo = Object.assign({}, userInfo)
							that.click = false
						}, true, false);
						return false;
					} else {
						if (uni.getStorageSync('app:userInfo').store_id == 0) {
							uni.showModal({
								content: '您还没有店铺，无法使用拼包功能。是否前往免费开店？',
								confirmText: '免费开店',
								cancelText: '再看看',
								success: res => {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/newjoin/join4/join4',
										})
									}
								}
							})
							return
						} else {
							uni.showModal({
								content: '该功能目前只针对批发商开放~~',
								confirmText: '知道了',
								showCancel: false
							})
							return
						}
					}
				}
				uni.navigateTo({
					url: '/pages/subcontract/myTions/mytions',
				})
			},
			toCore: function() {
				uni.navigateTo({
					url: '/pages/subcontract/core/core',
				})
			},
			back1: function() {
				uni.navigateBack({
					delta: 1,
				})
			},
			getRecomendGoods: function() { //获取推荐商品
				if (!flag) {
					return
				}
				var that = this
				request.get(that.url + '/api/Activity/recommendGoods', {
					data: {
						type: 1,
						p: that.p
					},
					success: function(res) {
						that.goodsList = [...that.goodsList, ...res.data.result]
						if (res.data.result.length < 10) {
							flag = false
						}
					}
				})
			},
		}
	}
</script>

<style scoped src="./destine.css">

</style>
