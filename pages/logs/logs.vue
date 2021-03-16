<template>
	<view>
		<view class="asd">
			<image src="https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/success.png" class="img1"></image>
			<view class="orige">开发中！</view>
		</view>
	</view>
</template>

<script>
	const util = require('../../static/utils/util.js');
	export default {
		data() {
			return {
				logs: []
			}
		},
		onLoad: function() {
			this.logs = (uni.getStorageSync('logs') || []).map(log => {
				return util.formatTime(new Date(log))
			})
		}
		methods: {

		}
	}
</script>

<style scoped src="./logs.css">

</style>
