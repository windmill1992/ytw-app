<template>
	<view>
		<form @submit='submitStore'>
			<view class="store-info">
				<view class="store-name">
					<view class="store-title">店铺名称：</view>
					<input class="store-input" name='store_name' :value='store.store_name' />
				</view>
				<view class="store-name">
					<view class="store-title">真实姓名：</view>
					<input class="store-input" name='true_name' :value="store.true_name" />
				</view>
				<view class="store-name">
					<view class="store-title">手机号：</view>
					<input class="store-input" name='mobile' :value="store.mobile" />
				</view>
				<view class="store-name">
					<view class="store-title">QQ：</view>
					<input class="store-input" name="qq" :value="store.qq" />
				</view>
			</view>
			<view class="store-logo">
				<view class="store-title">店铺图片</view>
				<image class="store-img" :src="url + store.store_img" @tap='changeStoreImg'></image>
				<button class="store-btn" form-type='submit'>确认修改</button>
			</view>
		</form>

	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	export default {
		data() {
			return {
				url: setting.url,
				store: {},
			}
		},
		onLoad: function() {
			this.requestMyStore();
		},
		methods: {
			requestMyStore: function() {
				var that = this;
				request.get('/api/distribut/store', {
					success: function(res) {
						that.store = Object.assign({}, res.data.result);
					},
					failStatus: function(res) {
						return false;
					}
				});
			},
			submitStore: function(e) {
				var that = this;
				var data = Object.assign(e.detail.value, {
					store_img: this.store.store_img
				});
				if (data.store_name.replace(/\s+/g, '') == "") {
					return app.showWarning("请输入店铺名称");
				} else if (data.true_name.replace(/\s+/g, '') == "") {
					return app.showWarning("请输入真实姓名");
				} else if (data.mobile.replace(/\s+/g, '') == "") {
					return app.showWarning("请输入手机号");
				}
				request.post('/api/distribut/store', {
					data: data,
					success: function(res) {
						app.showSuccess(res.data.msg);
						that.store = Object.assign({}, res.data.result);
						uni.navigateBack();
					}
				});
			},
			changeStoreImg: function() {
				var that = this;
				uni.chooseImage({
					count: 1, //最多1张图片,默认9
					sizeType: ['compressed', 'original'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						request.uploadFile('/api/distribut/upload_store_img', {
							filePath: res.tempFilePaths[0],
							name: 'store_img',
							success: function(res) {
								that.store.store_img = res.data.result;
								that.store = Object.assign({}, that.store);
							}
						});
					}
				});
			}
		}
	}
</script>

<style scoped src="./set_store.css">

</style>
