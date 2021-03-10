<template>
	<view>
		<view class="kill-time">
			<block v-for="(item, index) in killtime" :key="'kill' + index">
				<view :class="{timeac: index == timeac}" :data-index="index" @tap="changeTimeAc">
					<view>{{item.font}}</view>
					<view v-if="index == 0">秒杀中</view>
					<view v-else>即将秒杀</view>
				</view>
			</block>
		</view>
		<view class="kill-list">
			<block v-for="(item, index) in goodlist" :key="'goods' + index">
				<view class="kill-item">
					<navigator class="kill-pic"
						:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id + '&item_id=' + item.item_id">
						<image class="wh100"
							:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id + '&width=400&height=400'">
						</image>
					</navigator>
					<view class="kill-cont">
						<navigator class="goods-name ellipsis-2"
							:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id + '&item_id=' + item.item_id">
							{{item.goods_name}}
						</navigator>
						<view class="goods-num">
							<view>
								<view class="co-red">￥{{item.price}}</view>
								<view class="underline">￥{{item.shop_price}}</view>
							</view>
							<view class="kill-btn">
								<navigator v-if="timeac == 0 && item.percent != 100"
									:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id + '&item_id=' + item.item_id">
									去抢购</navigator>
								<navigator class="gray" v-else
									:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id">去购买</navigator>
								<view v-if="item.percent == 100" class="gray">已售罄</view>
								<view class="classname">已抢{{item.percent}}%</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<view class="no-more">没有更多</view>
	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	import LoadMore from '../../../static/utils/LoadMore.js';
	var load = new LoadMore;
	export default {
		data() {
			return {
				url: setting.url,
				killtime: null,
				currentPage: 1,
				timeac: 0,
				goodlist: null,
			}
		},
		onLoad: function(options) {
			load.init(this, '', 'goodlist');
			this.requestTime();
		},
		onPullDownRefresh: function() {
			this.reloadGoodList();
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.requestSalelist(this.killtime[this.timeac]);
			}
		},
		methods: {
			changeTimeAc: function(e) {
				this.timeac = e.currentTarget.dataset.index;
				this.reloadGoodList();
			},
			requestTime: function() {
				var that = this;
				request.post('/api/activity/flash_sale_time', {
					success: function(res) {
						var time = res.data.result.time;
						that.killtime = time;
						that.requestSalelist(that.killtime[that.timeac]);
					}
				});
			},
			requestSalelist: function(time) {
				var that = this;
				var requestUrl = '/api/activity/flash_sale_list?p=' + that.currentPage + '&start_time=' + time.start_time + '&end_time=' + time.end_time;
				load.request(requestUrl, function(res) {
					that.currentPage++;
					uni.stopPullDownRefresh();
				});
			},
			reloadGoodList: function() {
				load.resetConfig();
				this.goodlist = null;
				this.currentPage = 1;
				this.requestSalelist(this.killtime[this.timeac]);
			},
		}
	}
</script>

<style scoped src="./seckill_list.css">

</style>
