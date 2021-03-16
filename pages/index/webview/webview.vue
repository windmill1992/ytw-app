<template>
	<view>
		<web-view src="{{webUrl}}"></web-view>
		<!-- 功能未全做好之前展示 -->
		<view class="defaultPage">
			<image src="https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/success.png" class="img1"></image>
			<view class="orige">功能开发中！</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	var util = require('../../../static/utils/util.js');
	var common = require('../../../static/utils/common.js');
	export default {
		data() {
			return {
				webUrl: '',
			}
		},
		onLoad: function(options) {
			if (options.oauth) {
				var url = request.modifyUrl(options._url);
				delete options._url;
				var params = util.Obj2Str(options); //剩下的参数拼成get参数
				this.webUrl = url + '&' + params;
				app.showLoading(null, 1500);
			} else {
				var pages = getCurrentPages();
				var prevPage = pages[pages.length - 2]; //上一个页面
				var url = prevPage.webUrl; //取上页data里的数据
				url = request.modifyUrl(url);
				//处理webview业务域名需要添加https
				url = common.checkRequestIsHttps(url);
				this.webUrl = url + '#wechat_redirect';
				app.showLoading(null, 1500);
			}
		},
		methods: {

		}
	}
</script>

<style scoped>
	page {
		color: red;
	}

	.defaultPage {
		text-align: center;
		padding-top: 100rpx;
	}
</style>
