<template>
	<view>
		<view class="defaultPage">
			<!-- 开发中 -->
			<image src="https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/success.png" class="img1"></image>
			<view class="orige">功能开发中！</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var common = require('../../../static/utils/common.js');
	var util = require('../../../static/utils/util.js');
	import LoadMore from '../../../static/utils/LoadMore.js';
	var load = new LoadMore;
	var firstEnterPage = true;
	export default {
		data() {
			return {
				url: app.globalData.setting.url,
				stores: null,
				currentPage: 1,
				selectScId: 0,
				saleOrder: 0,
				address: {}, //地址信息
				activeNavId: -1,
				activeCategoryId: -1,
				showCategoryModal: false,
				longitude: 0, //经度
				latitude: 0, //纬度
				isGetLocation: false,
			}
		},
		onLoad: function() {
			load.init(this, 'store_list', 'stores');
			this.initRegions();
		},
		onShow: function() {
			this.resetData();
			this.requrstStoresByGps();
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.requrstStoresByGps();
			}
		},
		onPullDownRefresh: function(e) {
			this.resetData();
			this.requrstStoresByGps();
		},
		methods: {
			/** 请求店铺数据 */
			requrstStores: function() {
				var that = this;
				var params = util.Obj2Str({
					p: that.currentPage,
					sc_id: that.selectScId,
					sale_order: that.saleOrder,
					province_id: (that.address.province ? that.address.province : 0),
					city_id: (that.address.city ? that.address.city : 0),
					lng: that.longitude,
					lat: that.latitude,
				});
				load.request('/api/index/store_street?' + params, function(res) {
					for (var i = 0; i < res.data.result.store_list.length; i++) {
						var s = res.data.result.store_list[i];
						s.descScoreDesc = common.getStoreScoreDecs(s.store_desccredit);
						s.serviceScoreDesc = common.getStoreScoreDecs(s.store_servicecredit);
						s.deliveryScoreDesc = common.getStoreScoreDecs(s.store_deliverycredit);
					}
					that.currentPage++;
					uni.stopPullDownRefresh();
				});
			},
			resetData: function() {
				this.stores = null;
				this.currentPage = 1;
				load.resetConfig();
			},
			changeTab: function(e) {
				var activeNavId = e.currentTarget.dataset.i;
				this.selectScId = 0;
				this.address = {};
				this.saleOrder = Number(!this.saleOrder);
				this.resetData();
				this.requrstStoresByGps();
				this.activeCategoryId = -1;
				this.activeNavId = activeNavId;
			},
			selectCategory: function(e) {
				this.selectScId = e.currentTarget.dataset.scid;
				this.saleOrder = 0;
				this.address = {};
				this.resetData();
				this.requrstStoresByGps();
				this.activeCategoryId = e.currentTarget.dataset.i;
				this.showCategoryModal = false;
			},
			openCategoryModal: function(e) {
				this.activeNavId = e.currentTarget.dataset.i;
				this.showCategoryModal = true;
			},

			closeCategoryModal: function() {
				this.setData({
					showCategoryModal: false
				});
			},
			/** 关注店铺 */
			focusStore: function(e) {
				var that = this;
				var idx = e.currentTarget.dataset.idx;
				var store = that.stores.store_list[idx];
				request.post('/api/store/collectStoreOrNo', {
					data: {
						store_id: store.store_id
					},
					success: function() {
						if (!store.is_collect) {
							app.showSuccess('关注成功');
						}
						var num = store.store_collect;
						store.is_collect = !store.is_collect;
						store.store_collect = store.is_collect ? (num + 1) : (num - 1);
						that.stores.store_list[idx] = store;
						that.stores = Object.assign({}, that.stores);
					}
				});
			},
			/** 打开获取地理位置授权 */
			requrstStoresByGps: function(call) {
				var that = this;
				uni.getSetting({
					success: function(res) {
						if (res.authSetting["scope.userLocation"]) {
							that.anthLocation();
						} else if (firstEnterPage) {
							firstEnterPage = false;
							uni.showModal({
								title: '是否获取店家的距离？',
								success: function(res) {
									if (res.confirm) {
										that.anthLocation();
									} else {
										that.requrstStores();
									}
								}
							});
						} else {
							that.requrstStores();
						}
					},
					fail: function() {
						that.requrstStores();
					}
				});
			},
			anthLocation: function() {
				var that = this;
				uni.authorize({
					scope: 'scope.userLocation',
					success: function() {
						that.getLocationData();
					},
					fail: function() {
						uni.openSetting({
							success: function(res) {
								if (res.authSetting["scope.userLocation"]) {
									that.getLocationData();
								}
							}
						});
					}
				});
			},
			getLocationData: function() {
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						that.isGetLocation = true;
						that.requrstStores();
					}
				});
			},
		}
	}
</script>

<style scoped src="./street.css">

</style>
