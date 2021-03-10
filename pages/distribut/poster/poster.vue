<template>
	<view>

	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	export default {
		data() {
			return {
				look: false,
			}
		},
		onLoad: function(options) {
			var that = this;
			request.get('/api/user/getUserPoster', {
				success: function(res) {
					if (res.data.result.status == 1 && res.data.result.result == -1) {
						app.showTextWarining(res.data.result.msg, function() {
							uni.navigateBack({
								delta: 1
							})
						})
					} else {
						that.getHttpImages(res.data);
					}
				}
			});
		},
		onShow: function() {
			if (this.look) {
				this.look = false,
					uni.navigateBack({
						delta: 1
					})
			}
			methods: {
				getHttpImages: function(data) {
					this.look = true;
					uni.getImageInfo({
						src: setting.url + data.result,
						success: function(res) {
							uni.previewImage({
								urls: [res.path],
							})
						}
					})
				},
			}
		}
</script>

<style scoped src="./poster.css">

</style>
