<template>
	<view>
		<view class="container" :hidden="!showPage">
			<newjoin :step="1"></newjoin>
			<view v-if="{{showCont}}" class="notice">
				<view class="content">
					<image @tap="closeCont" src="../../../static/images/close_note.png" class="close"></image>
					<view class="title">入驻须知：</view>
					<view>1.认真填好个人信息。</view>
					<view>2.以下信息都为必填信息。</view>
					<view>3.姓名、号码具有真实性。</view>
				</view>
			</view>

			<form class="formbox" @submit="submitInfo">
				<view class="item">
					<view class="item-name">店主姓名:</view>
					<input class="item-input" placeholder-style="color:#999" placeholder="请填写姓名" name="contacts_name" />
				</view>
				<view class="item">
					<view class="item-name">手机号:</view>
					<input class="item-input" placeholder-style="color:#999" placeholder="请填写手机号"
						name="contacts_mobile" />
				</view>
				<view class="item" data-id='0' @tap="openRegionsModal">
					<view class="item-name">所在地区:</view>
					<view class="item-input">{{!address.province_name?'请选择您的地址':''}}{{address.province_name}}
						{{address.city_name}} {{address.district_name}}
					</view>
					<view class="item-img">
						<image class='next_icon' src="../../../static/images/xr_3.png"></image>
					</view>
				</view>
				<view class="item">
					<view class="item-name">详细地址:</view>
					<input class="item-input" maxlength="40" placeholder-style="color:#999" placeholder="长度请限制在6-40字"
						name="company_address" />
				</view>
				<view class="item last">
					<view class="item-name foot">
						<view @tap="setAgree" class="choosebox">
							<image v-if="isAgree" src="../../../static/images/ischeck.png"></image>
							<image v-if="!isAgree" src="../../../static/images/nocheck.png"></image>
						</view>
						我已阅读《<navigator class="guide" url="">入驻协议</navigator>》同意签署在线协议！
					</view>
				</view>
				<button class="next-btn" form-type="submit">下一步</button>
			</form>
		</view>

		<!-- 选择地址弹框  -->
		<!-- <template is="regions" data="{{regions}}" /> -->

	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	import Regions from '../../../static/utils/regions/Regions.js';
	export default {
		data() {
			return {
				url: setting.url,
				address: {}, //地址信息
				isAgree: true,
				showPage: false,
				showCont: true
			}
		},
		onLoad: function(options) {
			if (options.status == 2) {
				
			} else {
				this.getApplyInfo();
			}
			this.initRegions();
		},
		methods: {
			/** 初始化区域弹框相关 */
			initRegions: function() {
				var that = this;
				new Regions(this, 'regions', {
					endAreaLevel: 3,
					endAreaLevelCall: function(parentId, regionName, address) {
						that.address = address
					}
				});
			},
			getApplyInfo: function() {
				var that = this;
				request.get('/api/newjoin/getApply', {
					fallRollBack: true,
					success: function(res) {
						var step = res.data.result.status;
						if (step > 1 && step <= 3) {
							uni.redirectTo({
								url: '/pages/newjoin/join' + step + '/join' + step
							});
						} else if (step == 4) {
							uni.redirectTo({
								url: '/pages/newjoin/join4/join4?status=' + res.data.result.apply_state
							});
						} else {
							that.showPage = true;
						}
					}
				});
			},
			submitInfo: function(e) {
				if (!this.isAgree) {
					return app.showWarning('请先同意协议');
				}
				var data = e.detail.value;
				var address = this.address;
				if (!address.province || !address.city || !address.district || !data.contacts_name || 
					!data.contacts_mobile || !data.company_address) {
					return app.showWarning('请先填完信息');
				}
				Object.assign(data, {
					company_province: address.province,
					company_city: address.city,
					company_district: address.district,
				});
				request.post('/api/newjoin/basicInfo', {
					data: data,
					success: function(res) {
						uni.redirectTo({
							url: '/pages/newjoin/join2/join2'
						});
					}
				});
			},
			setAgree: function(e) {
				this.isAgree = !this.isAgree;
			},
			closeCont: function(e) {
				this.showCont = false
			}
		}
	}
</script>

<style scoped src="./join1.css">

</style>
