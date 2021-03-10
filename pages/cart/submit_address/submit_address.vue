<template>
	<view>
		<view class="container">
			<radio-group class="radio-group" @change="radioChange">
				<view class="address-box" v-for="(item,index) in addresses" :key="'addr' + index">
					<view class="address-user">
						<label class="radio">
							<radio :value="index" :checked="index == selected ? true : false" />
						</label>
					</view>
					<view class="address-info" @tap="selectAddress" :data-item="item">
						<view class="mobile flex">
							<view><text>{{item.shop_name}}</text></view>
							<text v-if="index == 0" class="text-center">离我最近</text>
							<text class="float">{{item.distance_text}}</text>
						</view>

						<view class="address text">{{item.shop_address}}
							<image class="float" @tap.stop='shop_page' :data-id="item.shop_id"
								:data-name="item.shop_name" :data-longitude="item.longitude"
								:data-latitude="item.latitude" src="../../../static/images/iconfont-shouhuodizhi.png">
							</image>
						</view>
						<view class="mobile text">{{item.phone}}</view>
					</view>
				</view>
			</radio-group>
		</view>

		<view class="set-mes">
			<view class="use-item set-item " @tap.stop='getUser'>
				<view class="text-overflow">提货人 : <text class="text">{{name}}</text> </view>
				<view class="text-overflow">电话 : <text class="text">{{mobile}}</text> </view>
				<view>
					<image hidden="true" class="arrow-rigth" src="../../../static/images/icon-arrowdown.png"
						@tap.stop='getUser'></image>
				</view>
			</view>
		</view>

		<navigator class="address-create" url="/pages/user/add_address/add_address">
			<view class="create-btn" @tap.stop='formSubmit'>确定</view>
		</navigator>

	</view>
</template>

<script>
	var app = getApp();
	var request = require('../../../static/utils/request.js');
	export default {
		data() {
			return {
				url: app.globalData.setting.url,
				addresses: null, //请求的地址列表
				name: '',
				mobile: '',
				datas: null,
				is_set: false,
				selected: 0,
				store_id: 0
			}
		},
		onLoad: function(options) {
			var datas = JSON.parse(options.datas);
			this.requestAddressList(datas);
			if (options.datas) {
				this.name = datas.consignee;
				this.mobile = datas.mobile;
				this.datas = options.datas;
				this.selected = options.selected;
				this.store_id = options.store_id;
			}
		},
		onShow: function() {
			if (this.is_set) {
				let datas = JSON.parse(this.datas);
				datas.consignee = this.name;
				datas.mobile = this.mobile;
				this.datas = JSON.stringify(datas);
			}
		},
		onPullDownRefresh: function() {
			this.requestAddressList();
		},
		methods: {
			shop_page: function(e) {
				var name = e.currentTarget.dataset.name || '';
				var longitude = e.currentTarget.dataset.longitude - 0;
				var latitude = e.currentTarget.dataset.latitude - 0;
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					name: name
				})
			},
			/** 请求自提点地址列表数据 */
			requestAddressList: function(datas) {
				var that = this;
				uni.authorize({
					scope: 'scope.userLocation',
					success: function(res) {
						uni.getLocation({
							type: 'wgs84',
							success(res2) {
								request.post('/Home/Api/shop', {
									data: {
										province_id: datas.province,
										city_id: datas.city,
										district_id: datas.district,
										shop_address: '', //datas.address
										longitude: res2.longitude,
										latitude: res2.latitude,
										store_id: that.data.store_id
									},
									successReload: true,
									success: function(res) {
										if (res.data.result && res.data.result.length > 0) {
											that.addresses = [...res.data.result];
										} else {
											that.addresses = [];
										}
										uni.stopPullDownRefresh();
									}
								});
							}
						})
					}
				})
			},
			radioChange: function(e) {
				this.selected = e.detail.value;
			},
			getUser: function() {
				uni.navigateTo({
					url: '../../cart/submit_people/submit_people?datas=' + this.datas,
				})
			},
			formSubmit: function() {
				let data = this.addresses[this.selected];
				let user = JSON.parse(this.datas);
				let pages = getCurrentPages(); //当前页面
				let prevPage = pages[pages.length - 2]; //上一页面
				//直接给上移页面赋值 
				prevPage.is_set = true;
				prevPage.submit_datas.shop_id = data.shop_id;
				prevPage.submit_datas.submit_address = data.shop_name;
				prevPage.submit_datas.name = user.consignee;
				prevPage.submit_datas.mobile = user.mobile;
				prevPage.selected = this.selected;
				prevPage.submit_datas = Object.assign({}, prevPage.submit_datas);
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style scoped src="./submit_address.css">

</style>
