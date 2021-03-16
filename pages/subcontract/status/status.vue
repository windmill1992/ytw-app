<template>
	<view>
		<image :src="url + '/public/static/images/minniapp/pinbao-arg-banner.png'" class="banner"></image>
		<view class="container">
			<view v-if="isOk">
				<image src="https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/success.png" class="img1"></image>
				<view class="orige">恭喜您，{{ mode == '' ? '预约' : '操作' }}成功！</view>
				<view class="btn" @tap="navBack2">好的</view>
			</view>
		</view>

	</view>
</template>

<script>
	const app = getApp();
	var setting = app.globalData.setting;
	const request = require('../../../static/utils/request');
	export default {
		data() {
			return {
				url: setting.url,
				isOk: false,
				store_id: 0,
				mode: ''
			}
		},
		onLoad: function(options) {
			if (options.status == 1) {
				this.isOk = true
				this.mode = options.mode
			}
		},
		methods: {
			navBack2: function() {
				uni.navigateBack({
					delta: 1,
				})
			},
			navBack3: function() {
				uni.navigateBack({
					delta: 2,
				})
			},
		}
	}
</script>

<style scoped src="./status.css">

</style>
