<template>
	<view>
		<image class="bgbgbg" src="https://test.yitongwang.com/public/static/images/minniapp/share_img_head.png">
		</image>
		<image class="bgbgbg2" src="https://test.yitongwang.com/public/static/images/minniapp/share_img_footer.png">
		</image>
		<view class="title abs tlc">尊敬的厂家</view>
		<view class="middle abs tlc">
			<view>您的送货确认码为:{{info.auth_code}} 最晚封包时间为:{{info.appointment_date}}</view>
			<view>超过这个时间，您的货物可能装不了包</view>
			<view>为了更好的服务客户，请在规定的时间</view>
			<view>内送到以下地址拼包</view>
		</view>
		<view class="aboutCore abs">
			<view>名称:{{info.name}}</view>
			<view>地址:{{info.address}}</view>
			<view>电话:{{info.phone}}</view>
		</view>
		<view class="toIndex tlc" @tap="reIndex" hover-class="hover">回到首页</view>
	</view>
</template>

<script>
	const app = getApp();
	const request = app.request;
	const setting = app.globalData.setting;
	export default {
		data() {
			return {
				url: setting.url,
				info: {},
			}
		},
		onLoad: function(options) {
			var id = options.order_id
			this.getInfo(id)
		},
		methods: {
			getInfo: function(id) {
				var that = this
				request.get(that.url + '/api/pinbao/getFactoryOrderDetails', {
					data: {
						order_id: id
					},
					success: function(res) {
						that.info = res.data.result
					}
				})
			},
			reIndex: function() {
				uni.reLaunch({
					url: '/pages/index/index/index',
				})
			},
		}
	}
</script>

<style scoped src="./pinbaoMsg.css">

</style>
