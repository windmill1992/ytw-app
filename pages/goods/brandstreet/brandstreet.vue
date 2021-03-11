<template>
	<view>
		<view class="container">
			<navigator class="copyright" url="#">
				<image class="wh100" :src="resourceUrl + '/static/images/func_02.jpg'"></image>
			</navigator>
			<view>
				<swiper class="swiper_box" indicator-dots autoplay interval="3000" duration="1000">
					<template v-for="(item2, index2) in requestData.hot_list">
						<template v-if="index2 % 3 == 0">
							<swiper-item :key="'hot2' + index2">
								<template v-for="(item, index) in requestData.hot_list">
									<template v-if="index >= index2 && index <= index2 + 2">
										<navigator class="slide-item"
											:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id"
											:key="'hot' + index + index2">
											<view class="image-wrap">
												<image class="wh100"
													:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id + '&width=200&height=200'">
												</image>
											</view>
											<view class="current-price">￥{{item.shop_price}}</view>
											<view class="market-price">￥{{item.market_price}}</view>
										</navigator>
									</template>
								</template>
							</swiper-item>
						</template>
					</template>
				</swiper>
			</view>
			<view class="recommend">
				<view class="re-title">推荐大牌</view>
				<view class="tab-list">
					<template v-for="(item, index) in requestData.brand_list">
						<navigator class="brand-item" :url="'/pages/goods/search/search?brand_id=' + item.id"
							:key="'brand' + index">
							<image :src="url + item.logo"></image>
						</navigator>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	import LoadMore from '../../../static/utils/LoadMore.js';
	var load = new LoadMore;
	export default {
		data() {
			return {
				url: app.globalData.setting.url,
				resourceUrl: app.globalData.setting.resourceUrl,
				requestData: null,
				brandCurrentPage: 1
			}
		},
		onLoad: function() {
			load.init(this, 'brand_list', 'requestData');
			this.requestBrandStreet();
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.requestBrandStreet();
			}
		}
		methods: {
			requestBrandStreet: function() {
				var that = this;
				var requestUrl = '/api/index/brand_street' + '?p=' + that.brandCurrentPage;
				load.request(requestUrl, function() {
					that.brandCurrentPage++;
				});
			},
		}
	}
</script>

<style scoped src="./brandstreet.css">

</style>
