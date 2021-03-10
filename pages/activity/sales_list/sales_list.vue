<template>
	<view>
		<view class="container">
			<view class="nav">
				<view class="nav-item" :class="{choose: tabType == 0}" @tap="changeTab" data-type='0'>限时折扣<text></text>
				</view>
				<view class="nav-item" :class="{choose: tabType == 1}" @tap="changeTab" data-type='1'>限时优惠<text></text>
				</view>
				<view class="nav-item" :class="{choose: tabType == 2}" @tap="changeTab" data-type='2'>限时促销<text></text>
				</view>
				<view class="nav-item" :class="{choose: tabType == 3}" @tap="changeTab" data-type='3'>买就送<text></text>
				</view>
			</view>
			<view class='content' v-for="(item, index) in requestData" :key="'sale' + index">
				<navigator :url="'/pages/activity/sales_goods/sales_goods?id=' + item.id">
					<image mode='aspectFill' :src="url + item.prom_img"></image>
					<view class='bottom'>
						<view class='title'><text></text>{{item.title}}</view>
						<view class='time'>时间：{{item.starttime}} 至 {{item.endtime}}</view>
					</view>
				</navigator>
			</view>
			<view class="no-data" v-if="!requestData || requestData.length == 0">
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
	var util = require('../../../static/utils/util.js');
	export default {
		data() {
			return {
				url: app.globalData.setting.url,
				requestData: null,
				tabType: 0,
				goodsCurrentPage: 1,
			}
		},
		onLoad: function() {
			load.init(this, '', 'requestData');
			this.requestGroupBuy(this.tabType);
		},
		onReachBottom: function(e) {
			this.requestGroupBuy(this.tabType);
		},
		methods: {
			//导航切换
			changeTab: function(event) {
				var that = this;
				var tabType = event.currentTarget.dataset.type;
				//重置数据
				load.resetConfig();
				this.tabType = tabType;
				this.requestData = null;
				this.goodsCurrentPage = 1;
				this.requestGroupBuy(tabType);
			},
			requestGroupBuy: function(tabType) {
				var that = this;
				var requestUrl = that.url + '/api/activity/promote_goods';
				requestUrl += '/type/' + tabType;
				requestUrl = requestUrl + '?p=' + that.goodsCurrentPage;

				//时间格式转换
				load.request(requestUrl, function(res) {
					res.data.result.forEach(function(val, index, arr) {
						val.starttime = util.formatTime(val.start_time, false);
						val.endtime = util.formatTime(val.end_time, false);
					});
				});
				that.goodsCurrentPage++;
			},
		}
	}
</script>

<style scoped src="./sales_list.css">

</style>
