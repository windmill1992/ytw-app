<template>
	<view>
		<view class="container" v-if="false">
			<view class="nav">
				<view class="nav-item" :class="{red: typeId == 1}" @tap="changeTab" data-id='1'>默认</view>
				<view class="nav-item" :class="{red: typeId == 2}" @tap="changeTab" data-id='2'>
					即将过期
				</view>
				<view class="nav-item" :class="{red: typeId == 3}" @tap="changeTab" data-id='3'>
					面值最大
				</view>
			</view>

			<view class="coupon_list" v-for="(item, index) in data" :key="'cp' + index" :data-index='index'>
				<image class="coupon_bg" src="../../../static/images/coupon_bg.png"></image>
				<image v-if="item.isget == 1" class="coupon_already" src="../../../static/images/already.png"></image>
				<view class="main_box">
					<image class="coupon_mode"
						:src="item.coupon_img ? item.coupon_img : '../../../static/images/coupon_mode.jpg'"></image>
					<view class="right_main">
						<view class="topbox">{{item.title}}</view>
						<view class="footbox">
							<view class="leftbox">
								<view class="price">
									￥<text class="note">{{item.round}}</text>.{{item.point}}
								</view>
								<view class="full">
									满{{item.condition}}可用
								</view>
							</view>
							<view v-if="item.isget == 1" class="btn_2">已领取</view>
							<view v-else @tap="getCoupon" :data-cid="item.id" class="btn_1">立即领取</view>
						</view>
					</view>
				</view>
			</view>

			<view class="no-data" v-if="!data || data.length == 0">
				<image src="../../../static/images/cart-null.png" class="cart-image" />
				<view class="no-data-title">没有相关的数据</view>
				<navigator url="/pages/index/index/index" class="lookat" open-type="switchTab"> 去逛逛 </navigator>
			</view>
		</view>
		<view class="defaultPage">
			<image src="https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/success.png" class="img1"></image>
			<view class="orige">功能开发中！</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	import LoadMore from '../../../static/utils/LoadMore.js';
	var load = new LoadMore;
	export default {
		data() {
			return {
				url: app.globalData.setting.url,
				data: null,
				typeId: 1,
				currentPage: 1
			}
		},
		onLoad: function(options) {
			var that = this;
			load.init(this, 'this.data', 'data');
			this.requestCouponList(this.typeId);
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.requestCouponList(this.typeId);
			}
		},
		onPullDownRefresh: function() {
			this.reloadCouponList(this.typeId);
		},
		methods: {
			changeTab: function(e) {
				this.reloadCouponList(e.currentTarget.dataset.id);
				uni.pageScrollTo({
					scrollTop: 0
				})
			},
			requestCouponList: function(typeId) {
				var that = this;
				this.typeId = typeId;
				var requestUrl = '/api/activity/coupon_center?type=' + typeId + '&p=' + that.currentPage;
				load.request(requestUrl, function(res) {
					that.currentPage++;
					for (var i = 0; i < res.data.result.length; i++) {
						var val = res.data.result[i];
						val.round = val.money.split(".")[0];
						val.point = val.money.split(".")[1];
						val.percent = val.createnum > 0 ? Math.ceil(val.send_num / val.createnum * 100) : 0;
						if (val.isget == 1) {
							continue;
						}
					}
					that.getCouponRate(res.data.result);
					uni.stopPullDownRefresh();
				});
			},
			//重置数据
			reloadCouponList: function(typeId) {
				load.resetConfig();
				this.data = null;
				this.currentPage = 1;
				this.requestCouponList(typeId);
			},
			/** 领券 */
			getCoupon: function(e) {
				var that = this;
				var coupon_id = e.currentTarget.dataset.cid;
				request.post('/api/activity/get_coupon', {
					data: {
						coupon_id: coupon_id
					},
					success: function(res) {
						app.showSuccess(res.data.msg);
						setTimeout(function() {
							load.init(that, 'that.data', 'data');
							that.reloadCouponList(1);
						}, 1200);
					}
				});
			},
			/** 获取所有优惠券领券进度 */
			getCouponRate: function(coupons) {
				for (var i in coupons) {
					var id = coupons[i].id;
					var rate = (coupons[i].percent) / 100;
					this.createCircle(id, rate);
				}
			},
			/** 画领取进度 */
			createCircle: function(id, rate) {
				var context = uni.createCanvasContext(id);
				context.beginPath();
				context.setStrokeStyle("#8e8e8e");
				context.setLineWidth(3);
				context.setLineCap('round');
				context.arc(38, 35, 31, 0.75 * Math.PI, 2.25 * Math.PI, false);
				context.stroke();
				if (rate > 0) {
					context.beginPath();
					context.setLineWidth(3);
					context.setStrokeStyle("#ffffff");
					context.setLineCap('round');
					context.arc(38, 35, 31, 0.75 * Math.PI, (rate * 1.5 + 0.75) * Math.PI, false);
					context.stroke();
				}
				context.draw();
			},
		},
	}
</script>

<style scoped src="./coupon_list.css">
</style>
