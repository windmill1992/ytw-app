<template>
	<view>
		<!-- 分销订单模块开始 -->
		<view class='retail_order'>
			<view class='order_tab clearfix'>
				<view class="order_tab_list" :class="{active: currentTab == 0}" data-current="0" @tap='clickTab'>全部订单
				</view>
				<view class="order_tab_list" :class="{active: currentTab == 1}" data-current="1" @tap='clickTab'>未付款
				</view>
				<view class="order_tab_list" :class="{active: currentTab == 2}" data-current="2" @tap='clickTab'>已付款
				</view>
				<view class="order_tab_list" :class="{active: currentTab == 3}" data-current="3" @tap='clickTab'>已完成
				</view>
			</view>
			<view class="order_content">
				<template v-for="(item, index) in teamOrder">
					<view class='order_content_list' :key="'to' + index">
						<view class='header clearfix wrap'>
							<navigator hover-class="none" :url="'/pages/store/index/index?store_id=' + item.store_id">
								<view class='buy_name'>
									<image src="../../../static/images/carnew.png" class="store-logo"></image>
									{{item.store_name}}
								</view>
							</navigator>
							<view class='is_pay' v-if="item.status == 0">未付款</view>
							<view class='is_pay' v-if="item.status == 1">已付款</view>
							<view class='is_pay' v-if="item.status == 2">等待分成(已收货)</view>
							<view class='is_pay' v-if="item.status == 3">已分成</view>
							<view class='is_pay' v-if="item.status == 4">已取消</view>
						</view>
						<view class='details'>
							<template v-if="item.goods_list.length > 1">
								<view class='product_info clearfix wrap'>
									<image
										:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_list[0].goods_id + '&width=400&height=400'"
										class='product_image'></image>
									<image
										:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_list[1].goods_id + '&width=400&height=400'"
										class='product_image'></image>
									<view>...</view>

									<view class='' style="float:right;">
										<view class='product_content_title'>共{{item.goods_list.length}}种商品 <image
												class="next_icon" src='../../../static/images/distribut/qian@2x.png'>
											</image>
										</view>
									</view>
								</view>
							</template>
							<template v-else>
								<view class='product_info clearfix wrap' v-for="(goods, index1) in item.goods_list"
									:key="'goods' + index + index1">
									<image
										:src="url + '/api/goods/goodsThumImages?goods_id=' + goods.goods_id +'&width=400&height=400'"
										class='product_image'></image>
									<view class='product_content'>
										<view class="top">
											<view class="left">{{goods.goods_name}}</view>
											<view class="right">
												<view class="price">￥{{goods.member_goods_price}}</view>
												<view class="num">x{{goods.goods_num}}</view>
											</view>
										</view>
										<view class="bottom">
											规格：{{goods.spec_key_name == "" || goods.spec_key_name == undefined ? "--" : goods.spec_key_name}}
										</view>
									</view>
								</view>
							</template>

							<view class='product_detail wrap'>
								<view class="line">
									<view class="left">订单号：</view>
									<view class="right">{{item.order_sn}}</view>
								</view>
								<view class="line" :hidden="true">
									<view class="left" :hidden="true">分销等级：</view>
									<view class="right" :hidden="true">{{item.level_name}}级分销商</view>
								</view>
								<view class="line">
									<view class="left">下单时间：</view>
									<view class="right">{{item.create_time}}</view>
								</view>
								<view class="line bottom" v-if="store_type == 0">
									<text>共{{item.num}}件商品 实付款：</text>￥{{item.cost_price}}
								</view>
								<view class="line bottom" style="height: 88rpx;" v-if="store_type == 1">
									<text>共{{item.num}}件商品 实付款：</text>￥{{item.goods_price}}
									<view><text>自己发货可结算</text>￥{{item.goods_price}}<text>平台发货可结算
										</text>￥{{item.goods_list[0].fx_price}}</view>
								</view>
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>
		<!-- 分销订单模块结束 -->

		<!-- 底部菜单 -->
		<publics :page='page' :isiphoneX='isiphoneX' :is_A="is_A"></publics>

	</view>
</template>

<script>
	import publics from '../../index/publics/publics';
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	var common = require('../../../static/utils/common.js');
	var util = require('../../../static/utils/util.js');
	import LoadMore from '../../../static/utils/LoadMore.js';
	var load = new LoadMore;
	export default {
		components: {
			publics
		},
		data() {
			return {
				currentTab: 0,
				currentPage: 1,
				teamOrder: null,
				page: 3,
				url: setting.url,
				store_type: '',
				isiphoneX: uni.getStorageSync('isiphoneX') || false,
				is_A: false
			}
		},
		onLoad: function() {
			load.init(this, '', 'teamOrder');
			this.getTeamOrder(this.currentTab);
			var userInfo = uni.getStorageSync('app:userInfo');
			if (userInfo) {
				if (userInfo.store_id > 0 && userInfo.is_B != 1) {
					this.is_A = true;
				}
			}
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.getTeamOrder(this.currentTab);
			}
		},
		onPullDownRefresh: function(e) {
			this.resetData();
			this.getTeamOrder(this.currentTab);
		},
		methods: {
			getTeamOrder: function(status) {
				var that = this;
				var where = '';
				if (status == 1) {
					where = 0
				} else if (status == 2) {
					where = '1,2'
				} else if (status == 3) {
					where = 3;
				}
				load.request('/api/Distribut/order_list?status=' + where + '&p=' + that.currentPage, function(res) {
					this.store_type = res.data.store_type;
					that.currentPage++;
					if (res.data.result) {
						res.data.result.forEach(function(val, index, arr) {
							val.create_time = util.format(val.create_time, 'yyyy-M-d');
						});
					}
				})
			},
			//事件处理函数
			clickTab: function(e) {
				var that = this;
				if (that.currentTab != e.target.dataset.current) {
					this.currentTab = e.target.dataset.current;
					that.resetData();
					that.getTeamOrder(e.target.dataset.current);
				}
			},
			distributTopages: function(e) {
				if (this.is_A == 0 && e.currentTarget.dataset.idx == 5) {
					return uni.showToast({
						title: '开发中~',
						icon: 'none'
					})
				}
				common.todistribut(e.currentTarget.dataset.idx, this.page);
			},
			//重置数据
			resetData: function() {
				load.resetConfig();
				this.teamOrder = null;
				this.currentPage = 1;
			},
			addNewGoods: function() {
				uni.navigateTo({
					url: '/pages/goods/addGoods/index?goods_id=0&is_A=' + (this.is_A == true ? 1 : 0),
				})
			}
		}
	}
</script>

<style scoped src="./retail_order.css">

</style>
