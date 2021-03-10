<template>
	<view>
		<view class="container">
			<image v-if='requestData.ad.ad_code' class="group-purchase" :src="url + requestData.ad.ad_code" />
			<view class="nav">
				<view :class="tabType == 'default' ? 'nav-item red' : 'nav-item'" @tap="changeTab" id='tab_default'>默认
				</view>
				<view :class="tabType == 'new' ? 'nav-item red' : 'nav-item'" @tap="changeTab" id='tab_new'>最新<view
						class="ico-dg">
						<image class="wh100" src="../../../static/images/dg.png"></image>
					</view>
				</view>
				<view :class="tabType == 'comment' ? 'nav-item red' : 'nav-item'" @tap="changeTab" id='tab_comment'>评论数
					<view class="ico-dg">
						<image class="wh100" src="../../../static/images/dg.png"></image>
					</view>
				</view>
			</view>
			<view class="choice_box">
				<navigator v-for="(item, index) in requestData.groups" class="choice_item"
					:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id + '&item_id=' + item.item_id"
					:key="'group' + index">
					<view class="img-wrap">
						<image
							:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id + '&width=400&height=400'">
						</image>
						<view class="discount">距离结束:{{item.remainTime }}</view>
					</view>
					<view class="title">{{item.title}}</view>
					<view class="involved">{{item.virtual_num + item.buy_num}}人参与</view>
					<view class="price">￥{{item.price}}</view>
					<view class="count-down">
						{{item.rebate}}折
					</view>
				</navigator>
			</view>
			<view class="no-data" v-if="!requestData.groups || requestData.groups.length == 0">
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
				tabType: 'default',
				goodsCurrentPage: 1,
				timer: null,
			}
		},
		onLoad: function(options) {
			load.init(this, 'groups', 'requestData');
			this.requestGroupBuy();
			this.createTimer();
		},
		onUnload: function() {
			clearInterval(this.timer);
		},
		onPullDownRefresh: function() {
			this.reloadGoodList();
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.requestGroupBuy();
			}
		},
		methods: {
			changeTab: function(event) {
				var tabType = '';
				if (event.target.id == 'tab_new') {
					tabType = 'new';
				} else if (event.target.id == 'tab_comment') {
					tabType = 'comment';
				} else if (event.target.id == 'tab_default') {
					tabType = 'default';
				}
				this.tabType = tabType;
				this.reloadGoodList();
			},
			requestGroupBuy: function() {
				var that = this;
				var requestUrl = that.url + '/api/activity/group_list/type/' + this.tabType;
				requestUrl = requestUrl + '?p=' + that.goodsCurrentPage;
				load.request(requestUrl, function() {
					that.goodsCurrentPage++;
					uni.stopPullDownRefresh();
				});
			},
			//重置数据
			reloadGoodList: function() {
				load.resetConfig();
				this.requestData = null;
				this.goodsCurrentPage = 1;
				this.requestGroupBuy();
				clearInterval(this.timer);
				this.createTimer();
			},
			createTimer: function() {
				var that = this;
				var startTime = (new Date()).getTime();
				this.timer = setInterval(function() {
					if (!that.requestData || !that.requestData.groups) {
						return;
					}
					var remainTime = 0;
					var groups = that.requestData.groups;
					for (var i = 0; i < groups.length; i++) {
						var diffTime = startTime - groups[0].server_time * 1000;
						groups[i].remainTime = util.remainTime(groups[i].end_time * 1000 - (new Date())
							.getTime() + diffTime);
					}
					that.requestData.groups = groups;
					that.requestData = Object.assign({}, that.requestData);
				}, 1000);
			},
		}
	}
</script>

<style scoped src="./group_list.css">

</style>
