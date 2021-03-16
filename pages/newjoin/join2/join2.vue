<template>
	<view>
		<view class="container">
			<newjoin :step="2"></newjoin>
			<form class="formbox" @submit="submitInfo">
				<view class="item">
					<view class="item-name">店铺名称:</view>
					<input class="item-input" placeholder="请填写店铺名称" name="store_name" />
				</view>
				<view class="item">
					<view class="item-name">店铺登录名:</view>
					<input class="item-input" placeholder="请填写店铺登录名" name="seller_name" />
				</view>
				<picker class="item" @change="selectStoreType" :value="index" :range="storeTypes" range-key="name">
					<view class="item-name">店铺类型:</view>
					<view class="item-input">{{storeTypes[storeType].name}}</view>
					<view class="item-img">
						<image class='next_icon' src="../../../static/images/xr_3.png"></image>
					</view>
				</picker>
				<view class="item" @tap="openCategoryModal">
					<view class="item-name">经营类目:</view>
					<view class="item-input">{{categorydata.category3_name}}</view>
					<view class="item-img">
						<image class='next_icon' src="../../../static/images/xr_3.png"></image>
					</view>
				</view>
				<picker class="item last" @change="selectStoreCat" :value="index" :range="storeCats"
					range-key="sc_name">
					<view class="item-name">店铺分类:</view>
					<view class="item-input">{{storeCats[storeCat].sc_name}}</view>
					<view class="item-img">
						<image class='next_icon' src="../../../static/images/xr_3.png"></image>
					</view>
				</picker>
				<button class="next-btn" form-type="submit">下一步</button>
			</form>
		</view>

		<!-- 经营类目弹框  -->
		<category :data="categories" @openCategoryModal="openCategoryModal" @closeCategoryModal="closeCategoryModal"
			@categoryCheckboxChange="categoryCheckboxChange"></category>
	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	import Category from '../../components/category/Category.js';
	export default {
		data() {
			return {
				url: setting.url,
				categorydata: null,
				storeTypes: [{
						id: 1,
						name: '旗舰店'
					},
					{
						id: 2,
						name: '专卖店'
					},
					{
						id: 3,
						name: '专营店'
					}
				],
				storeType: -1,
				storeCats: null,
				storeCat: -1,
			}
		},
		onLoad: function(options) {
			this.getApplyInfo();
			this.initCategory();
		},
		methods: {
			getApplyInfo: function() {
				var that = this;
				request.get('/api/newjoin/getApply', {
					fallRollBack: true,
					success: function(res) {
						that.storeCats = res.data.result.store_class
					}
				});
			},
			/** 初始化经营类目弹框相关 */
			initCategory: function() {
				var that = this;
				new Category(this, 'categories', {
					endCall: function(categories) {
						that.categorydata = categories
					}
				});
			},
			submitInfo: function(e) {
				if (this.storeType == -1) {
					app.showWarning('请选择店铺类型');
					return;
				}
				if (this.categorydata == null) {
					app.showWarning('请选择经营类目');
					return;
				}
				if (this.storeCat == -1) {
					app.showWarning('请选择店铺分类');
					return;
				}
				var data = e.detail.value;
				Object.assign(data, {
					store_type: this.storeTypes[this.storeType].id,
					'store_class_ids[]': this.categorydata.category3,
					sc_id: this.storeCats[this.storeCat].sc_id,
					sc_name: this.storeCats[this.storeCat].sc_name,
				});
				request.post('/api/newjoin/storeInfo', {
					data: data,
					success: function(res) {
						wx.redirectTo({
							url: '/pages/newjoin/join3/join3'
						});
					}
				});
			},
			selectStoreType: function(e) {
				this.storeType = e.detail.value;
			},

			selectStoreCat: function(e) {
				this.storeCat = e.detail.value
			}
		}
	}
</script>

<style scoped src="./join2.css">

</style>
