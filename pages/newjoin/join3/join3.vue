<template>
	<view>
		<view class="container">
			<newjoin :step="3"></newjoin>
			<view class="pic-list pd-bg-fff">
				<view class="redword">需要上传在有效期内的营业执照，且为原件照片</view>
				<view class="share-pic">
					<image class="wh100" :src="filePath ? filePath : defaultPhoto" @tap="selectPhotos"></image>
				</view>
				<view class="bottomword">需上传原件照片</view>
			</view>
			<form class="formbox" @submit="submitInfo">
				<view class="item">
					<view class="item-name">长期有效</view>
					<switch type="switch" class="item-right" color="#ff3b3b" :checked="isLongValid"
						@change="setLongValid" />
				</view>
				<picker class="item" mode="date" @change="bindStartDate" v-if="!isLongValid">
					<view class="item-name">有效期开始时间:</view>
					<view class="item-input">{{startDate}}</view>
					<view class="item-right">
						请选择 <image class='next_icon' src="../../../static/images/xr_3.png"></image>
					</view>
				</picker>
				<picker class="item" mode="date" @change="bindEndDate" v-if="!isLongValid">
					<view class="item-name">有效期结束时间:</view>
					<view class="item-input">{{endDate}}</view>
					<view class="item-right">
						请选择 <image class='next_icon' src="../../../static/images/xr_3.png"></image>
					</view>
				</picker>
				<view class="item">
					<view class="item-name">营业执照号:</view>
					<input class="item-input" name="business_licence_number" value="" placeholder="请与营业执照上保持一致" />
					<view class="item-desc">请按照营业执照上的信息填写，仅支持数字、字母和汉字。如：410998000018866(1-1)，请输入：410998000018866</view>
				</view>
				<view class="item last">
					<view class="item-name">字号名称（法人）:</view>
					<input class="item-input" name="legal_person" value="" placeholder="请填写营业执照上的字号" />
					<view class="item-desc">如果个体户营业执照没有名称，名称中请填写营业者姓名。企业执照请填写法人代表、个体户执照请填写经营者姓名。</view>
				</view>
				<button class="next-btn" form-type="submit">提 交</button>
			</form>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	var setting = app.globalData.setting;
	var request = app.request;
	var select = require('../../../static/utils/selectFiles.js');
	export default {
		data() {
			return {
				url: setting.url,
				defaultPhoto: setting.resourceUrl + '/static/images/camera.png',
				filePath: '', //本地图片的路径
				uploadPath: '', //上传图片的路径
				isLongValid: false,
				startDate: '',
				endDate: '',
				form: {},
			}
		},
		methods: {
			/** 选择照片 */
			selectPhotos: function(e) {
				var that = this;
				wx.chooseImage({
					count: 1, //最多1张图片
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera', 'album'], //可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						that.filePath = res.tempFilePaths[0]
					}
				});
			},
			/** 上传图片 */
			uploadPhotos: function(call, pathIdx) {
				if (!this.filePath) {
					return app.showWarning('请上传营业执照');
				}
				var that = this;
				request.uploadFile('/api/newjoin/uploadBusinessCertificate', {
					filePath: that.filePath,
					name: 'business_licence_cert',
					success: function(res) {
						that.uploadPath = res.data.result;
						that.submitData();
					}
				});
			},
			submitInfo: function(e) {
				var data = e.detail.value;
				if (!data.business_licence_number || !data.legal_person ||
					!(this.isLongValid || (!this.isLongValid && this.startDate && this.endDate))) {
					return app.showWarning('请先填完信息');
				}
				this.form = data;
				this.uploadPhotos();
			},
			submitData: function() {
				var that = this;
				request.post('/api/newjoin/remark', {
					data: Object.assign({}, this.form, {
						business_date_start: this.startDate,
						business_date_end: this.endDate,
						business_permanent: this.isLongValid ? 1 : 0,
						business_img: that.uploadPath,
					}),
					success: function(res) {
						wx.redirectTo({
							url: '/pages/newjoin/join4/join4'
						});
					}
				});
			},
			setLongValid: function(e) {
				this.isLongValid = e.detail.value
			},
			bindStartDate: function(e) {
				this.startDate = e.detail.value 
			},
			bindEndDate: function(e) {
				this.endDate = e.detail.value
			},
		}
	}
</script>

<style scoped src="./join3.css">

</style>
