<template>
	<view>
		<view class="container">
			<view class="nav">
				<view class="nav-item" :class="{'red-on': rankType == ''}" @tap="changeTab" id='rank_default'>默认</view>
				<view class="nav-item" :class="{'red-on': rankType == 'num'}" @tap="changeTab" id='rank_num'>兑换量<view
						class="ico-dg">
						<image class="wh100" src="../../../static/images/dg.png"></image>
					</view>
				</view>
				<view class="nav-item" :class="{'red-on': rankType == 'integral'}" @tap="changeTab" id='rank_integral'>
					积分值<view class="ico-dg">
						<image class="wh100" src="../../../static/images/dg.png"></image>
					</view>
				</view>
			</view>
			<view class="choice_list">
				<block v-for="(item, index) in requestData.goods_list" :key="'goods' + index">
					<navigator class="choice_item" :url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id">
						<view class="img-wrap">
							<image
								:src="url + '/apisource/goods/goodsThumImages?goods_id=' + item.goods_id + '&width=400&height=400'">
							</image>
						</view>
						<view class="item-cont">
							<view class="title">{{item.goods_name}}</view>
							<view class="price">
								<view class="discount-price">
									￥{{item.calPoint}}</view>+{{item.exchange_integral}}积分
							</view>
							<view class="market-price">市场价 ￥ {{item.market_price}}</view>
						</view>
						<button class="exchange-btn">立即兑换</button>
					</navigator>
				</block>
			</view>
			<view class="no-data" v-if="!requestData.goods_list || requestData.goods_list.length == 0">
				<image src="../../../static/images/cart-null.png" class="cart-image" />
				<view class="no-data-title">没有找到相关的记录</view>
				<navigator url="/pages/index/index/index" class="lookat" open-type="switchTab"> 去逛逛 </navigator>
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
				requestData: null,
				rankType: '',
				goodsCurrentPage: 1
			}
		},
		onLoad: function() {
			load.init(this, 'goods_list', 'requestData');
			this.requestIntegralMall();
		},
		onPullDownRefresh: function() {
			this.reloadGoodList();
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.requestIntegralMall(this.rankType);
			}
		},
		methods: {
			changeTab: function(event) {
				var rank = '';
				if (event.target.id == 'rank_num') {
					rank = 'num';
				} else if (event.target.id == 'rank_integral') {
					rank = 'integral';
				}
				this.rankType = rank;
				this.reloadGoodList();
			},
			requestIntegralMall: function() {
				var that = this;
				var requestUrl = '/apisource/goods/integralMall/rank/' + this.rankType;
				requestUrl = requestUrl + '?p=' + that.goodsCurrentPage;
				load.request(requestUrl, function(res) {
					that.goodsCurrentPage++;
					res.data.result.goods_list.forEach(function(val) {
						val.calPoint = (val.shop_price - val.exchange_integral / res.data.result.point_rate).toFixed(2);
					});
					uni.stopPullDownRefresh();
				});
			},
			//重置数据
			reloadGoodList: function() {
				load.resetConfig();
				this.requestData = null;
				this.goodsCurrentPage = 1;
				this.requestIntegralMall();
			},
		}
	}
</script>

<style scoped src="./integralMall.css">

</style>
