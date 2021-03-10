<template>
	<view>
		<view class="order-title">
			<view v-for="(item, index) in statuses" :key="'st' + index" class="order-status"
				:class="{active: item.status==activeStatus}" :data-status="item.status" @tap='changeTab'>{{item.name}}
			</view>
		</view>

		<view class="order-li" v-for="(order, index) in orders" :key="'order' + index">
			<view class="order-header">
				<view class="order-seller ellipsis-1">买家：{{order.nickname}}</view>
				<view class="order-status-name">
					{{order.status==0?'未付款':''}}{{order.status==1?'已付款':''}}{{order.status==2?'等待分成(已收货)':''}}
					{{order.status==3?'已分成':''}}{{order.status==4?'已取消':''}}
				</view>
			</view>
			<view class="order-sn">订单号：{{order.order_sn}}</view>
			<view class="order-time">{{order.createTimeFormat}}</view>

			<view class="order-goodimg" v-for="(item, index) in order.goods_list" :key="'order_goods' + index">
				<image class="order-img"
					:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id +'&width=200&height=200'">
				</image>
				<view class="order-content">
					<view class="goods-name ellipsis-1">{{item.goods_name}}</view>
					<view style="color:red;">￥{{item.member_goods_price}}</view>
					<view class="ellipsis-1" style="color:#7f7f7f;">{{item.spec_key_name}}</view>
				</view>
			</view>

			<view class="order-total">
				<text style="color:#7f7f7f;">获得佣金：</text><text style="color:red;">￥{{order.money}}</text>
			</view>
		</view>

		<view class="no-data" v-if="!orders || orders.length == 0">
			<image src="../../../static/images/cart-null.png" class="cart-image" />
			<view class="no-data-title">没有找到相关的记录</view>
			<navigator url="/pages/index/index/index" class="lookat" open-type="switchTab"> 去逛逛 </navigator>
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
				statuses: [{
						name: "未付款",
						status: '0'
					},
					{
						name: "已付款",
						status: '1,2'
					},
					{
						name: "已完成",
						status: '3'
					}
				],
				activeStatus: '0',
				orders: null,
				currentPage: 1
			}
		},
		onLoad: function(options) {
			var status = typeof options.status == 'undefined' ? this.activeStatus : options.status;
			load.init(this, '', 'orders');
			this.requestOrders(status);
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.requestOrders(this.activeStatus);
			}
		},
		onPullDownRefresh: function(e) {
			this.resetData();
			this.requestOrders(this.activeStatus);
		},
		methods: {
			changeTab: function(e) {
				this.resetData();
				this.requestOrders(e.currentTarget.dataset.status);
			},
			requestOrders: function(status) {
				var that = this;
				var requestUrl = '/api/distribut/order_list?status=' + status + '&p=' + that.currentPage;
				this.activeStatus = status;
				load.request(requestUrl, function(res) {
					that.currentPage++;
					res.data.result.forEach(function(val, index, arr) {
						val.createTimeFormat = util.formatTime(val.create_time);
						val.goods_list.forEach(function(val2, index2, arr2) {
							val2.distributRatio = (val2.commission / val2.goods_price * 100).toFixed(1);
						});
					});
					uni.stopPullDownRefresh();
				});
			},
			/** 重置数据 */
			resetData: function() {
				this.orders = null;
				this.currentPage = 1;
				load.resetConfig();
			},
		}
	}
</script>

<style scoped src="./order.css">

</style>
