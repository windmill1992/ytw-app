<template>
	<view>
		<rich-text :nodes="arrNodes"></rich-text>
	</view>
</template>

<script>
	var app = getApp()
	var request = require('../../../static/utils/request');
	var setting = app.globalData.setting;
	export default {
		data() {
			return {
				url: setting.url,
				arrNodes: '',
				from: ''
			}
		},
		onLoad: function(options) {
			this.from = options.from;
			var url = options.from == 'shop' ? this.url + '/api/Message/getSystemArticle' : this.url + ''
			this.getAgreement(this.url + '/api/User/getSystemArticle')
		},
		methods: {
			getAgreement: function(url) {
				var that = this
				request.get(url, {
					success: function(res) {
						
					}
				})
			},
		}
	}
</script>

<style scoped src="./agreement.css">

</style>
