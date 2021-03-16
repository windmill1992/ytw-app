<template>
	<view>
		<view class="top"></view>
		<image class="switchBanner"
			src="https://www.yitongwang.com/public/static/images/minniapp/pinbao-enter-banner.png"></image>
		<text class="headerTxt">
			您好，
			欢迎进入拼包中心
			请选择心仪的拼包公司
		</text>

		<!-- 4个块 -->
		<view class="baoItem rela" v-for="(item, index) in coreInfo" :key="'core' + index" :data-id="item.seller_id"
			:data-status="item.status" @tap="toWrite" :data-name="item.name">
			<image class="abs" :src="item.bgm_img"></image>
			<view class="abs Title">{{ item.name }}<text
					:style="'color:#eaeaea;margin-left:20rpx;font-size:' + item.warehouse_name ? 26 : 30 + 'rpx;'">{{ item.warehouse_name || '拼包中心' }}</text>
			</view>
			<view class="abs defTxt2">
				<view v-for="(item2, index2) in item.phone" :key="'phone' + index + index2" style="width:250rpx;">
					{{ item2 }}
					<van-icon style="float:right;" name="phone-o" :data-tel="item2" @tap.stop="callTel" size="45rpx" />
				</view>
			</view>
			<view class="abs address">{{ item.address }}</view>
			<view class="abs state">{{ item.status == 1 ? '营业中' : '洽谈中...' }}</view>
			<view class="abs score">
				<view v-for="(item3, index3) in item.score" :key="'score' + index + index3">
					{{ item3.key }}：{{ item3.name }}</view>
			</view>
		</view>

		<view class="baoItem rela">
			<image class="abs" src="https://www.yitongwang.com/public/static/images/minniapp/pinbao-building.png">
			</image>
			<view class="abs address">敬请期待...</view>
		</view>

		<van-dialog id="van-dialog" />
	</view>
</template>

<script>
	var app = getApp();
	var request = require("../../../static/utils/request");
	var setting = app.globalData.setting;
	export default {
		data() {
			return {
				url: setting.url,
				coreInfo: [],
				userStatus: -999
			}
		},
		onLoad: function(options) {
			this.getCoreInfo()
			this.userStatus = options.status
		},
		methods: {
			getCoreInfo: function() {
				var that = this
				request.get(that.url + '/api/pinbao/getSellerList', {
					success: function(res) {
						if (res.data.status == 1) {
							that.coreInfo = res.data.result
						}
					}
				})
			},
			toWrite: function(e) {
				var id = e.currentTarget.dataset.id
				var status = e.currentTarget.dataset.status
				var name = e.currentTarget.dataset.name
				if (status == 0) {
					return uni.showToast({
						title: '洽谈中，相信很快就可以使用啦``',
						icon: 'none'
					})
				}
				if (id) {
					if (this.userStatus != 2) {
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
						return
					}
					uni.navigateTo({
						url: '/pages/subcontract/write/write?seller_id=' + id + '&seller_name=' + name,
					})
				}
			},
			callTel: function(e) {
				uni.makePhoneCall({
					phoneNumber: e.currentTarget.dataset.tel,
				})
			},
		}
	}
</script>

<style scoped src="./switchCore.css">

</style>
