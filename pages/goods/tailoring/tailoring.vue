<template>
	<view>
		<image-cropper @saveImg="saveImg" @cancelImg1="cancelImg" @resetImgPos="reset"
			:hidden="!cropperShow" id="image-cropper" :limit_move="false" :disable_ratio="disable_ratio"
			:disable_rotate="false" :width="width" :height="height" :imgSrc="src" @load="cropperload"
			@imageload="loadimage" @tapcut="clickcut"></image-cropper>
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
				src: '',
				width: 250, //宽度
				height: 250, //高度
				type: '',
				disable_ratio: true,
				cropperShow: false,
			}
		},
		onLoad: function(options) {
			this.cropper = this.selectComponent("#image-cropper");
			this.src = options.src;
			this.type = options.img_type || 'c';
			this.disable_ratio = options.img_type == 'b' ? false : true
		},
		methods: {
			showCropper: function() {
				this.cropperShow = true;
				this.cropper._initCanvas()
			},
			cropperload: function(e) {
				console.log("cropper初始化完成");
			},
			loadimage: function(e) {
				console.log("图片加载完成", e.detail);
				//重置图片角度、缩放、位置
				this.cropper.imgReset();
			},
			clickcut: function(e) {
				//点击裁剪框阅览图片
				uni.previewImage({
					current: e.detail.url, // 当前显示图片的http链接
					urls: [e.detail.url] // 需要预览的图片http链接列表
				})
			},
			getImg: function() {
				uni.showLoading({
					title: '正在生成...',
					mask: true
				})
				var that = this
				this.cropper.getImg(res => {
					uni.uploadFile({
						filePath: res.url,
						name: 'qinzi_imgs',
						url: that.url + '/api/newjoin/upload_qianzi_img',
						success: function(res) {
							var result = JSON.parse(res.data)
							that.savePreData(result.result)
						}
					})
				})
			},
			saveImg: function() {
				this.getImg()
			},
			cancelImg: function() {
				uni.navigateBack()
			},
			savePreData: function(src) {
				if (this.type == 'a' || this.type == 'c') {
					var prevPage = null
					let pages = getCurrentPages();
					if (pages.length >= 2) {
						prevPage = pages[pages.length - 2]; //上一个页面
					} else {
						return
					}
					var preListData = prevPage.listData
					var index = preListData.findIndex((item) => {
						return item.dragId == prevPage.curId
					})
					if (index == -1) {
						return
					}
					preListData[index].spec_img = src
					prevPage.listData = [...preListData]
					prevPage.curId = 0
					prevPage.uploadFlag = true
					uni.hideLoading({
						success: (res) => {},
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 0) //延迟异步执行
				} else {
					var prevPage = null
					let pages = getCurrentPages();
					if (pages.length >= 2) {
						prevPage = pages[pages.length - 2]; //上一个页面
					} else {
						return
					}
					var preListData = prevPage.listData2
					var index = preListData.findIndex((item) => {
						return item.dragId == prevPage.curId
					})
					if (index == -1) {
						return
					}
					preListData[index].spec_img = src
					prevPage.listData2 = [...preListData2]
					prevPage.curId = 0
					prevPage.uploadFlag = true
					uni.hideLoading({
						success: (res) => {},
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 0) //延迟异步执行
				}
			},
			reset: function() {
				this.cropper.imgReset()
			}
		}
	}
</script>

<style scoped src="./tailoring.css">

</style>
