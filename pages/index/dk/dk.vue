<template>
	<view>
		<swiper v-if="mode == '' && is_apply != 1" class="swiper" indicator-dots autoplay
			indicator-active-color="#ffffff">
			<swiper-item v-for="(item, index) in banner" :key="'banner' + index">
				<image class="banner" :src="item.ad_code"></image>
			</swiper-item>
		</swiper>

		<view class="list" :style="'min-height:' + mode ? '100vh' : '80vh' + ';padding-bottom:20rpx;'">
			<view v-if="mode == ''" @tap.stop="showDialog" class="shaixuan">
				<image src="../../../static/images/xx.png"></image>
				筛选厂家
			</view>
			<view class="emptyStore" v-if="list.length == 0">
				<van-empty image="https://www.yitongwang.com/public/static/images/minniapp/empty-image-default.png"
					description="未搜索到相关信息" />
			</view>
			<view class="item" v-for="(item, index) in list" :key="'list' + index">
				<view class="item-title" :data-store_id="item.store_id" @tap.stop="goStore">{{item.store_name}}</view>
				<view class="item-label color64">店铺商品：<text class="themecolor">{{item.store_goods_sale}}个</text></view>
				<view class="item-label color64">店铺等级：<image class="zszszs"
						src="https://www.yitongwang.com/template/pc/rainbow/static/images/level/zs.png"
						v-for="(item1, index1) in item.store_level" :key="'store' + index + index2"></image>
				</view>
				<view class="item-label color-c2">最新上传：<text>{{item.sale_goods_date}}</text></view>
				<view class="item-label color-c2">档口地址：<text>{{item.store_address}}</text>
					<image src="../../../static/images/call.png" v-if="item.mobile" class="call"></image>
				</view>
				<view class="banner1" v-if="item.goods_list.length > 0">
					<image src="https://www.yitongwang.com/template/pc/rainbow/static/images/swr.png"
						:data-id="item.store_id" @tap.stop="next" class="next"></image>
					<image src="https://www.yitongwang.com/template/pc/rainbow/static/images/swl.png"
						:data-id="item.store_id" @tap.stop="before" class="before"></image>
					<swiper class="swiper1" circular :data-id="item.store_id" @change="swiperChange"
						:current="item.current" display-multiple-items="3">
						<swiper-item v-for="(item1, idx) in item.goods_list" :data-store_id="{{item.store_id}}"
							:data-goods_id="item1.goods_id" @tap.stop="goDetail" :key="'goods' + index + idx">
							<image class="img1" v-if="item1.original_img" :src="item1.original_img"></image>
						</swiper-item>
						<swiper-item v-if="item.goods_list.length == 1" :data-store_id="item.goods_list[0].store_id"
							:data-goods_id="item.goods_list[0].goods_id">
							<image class="img1" src=""></image>
						</swiper-item>
					</swiper>
				</view>
			</view>

		</view>
		<!-- 返回顶部按钮  -->
		<view class="toTop" @tap="doScrollTop" v-if="supportPageScroll">
			<image class="wh100" src="../../../static/images/topup.png"></image>
		</view>

		<van-divider v-if="list" contentPosition="center">我是有底线的</van-divider>
		<view class="mask" v-if="dialog" @tap.stop="close" @touchmove.stop="true"></view>
		<view class="business" v-if="dialog">
			<view class="business-title" @tap.stop="setall">显示全部商圈</view>
			<view class="t1">商圈</view>
			<view class="business-list">
				<view class="business-item" :class="{active: businessId == item.id}"
					v-for="(item, index) in storeBusiness" :data-id="item.id" @tap.stop="setItem" :key="'bus' + index">
					{{item.store_business}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	const request = app.request;
	const setting = app.globalData.setting;
	export default {
		data() {
			return {
				banner: [], //轮播图
				list: [], //店铺列表
				dialog: false, //弹窗
				businessId: 0, //商圈Id
				pageIndex: 1, //页码数
				pageSize: 10, //请求条数
				storeBusiness: [], //商圈
				isDone: false, //默认没有加载完
				mode: '',
				is_apply: 0, //默认不是
				supportPageScroll: false,
			}
		},
		onLoad: function(options) {
			if (options.key_word) {
				this.mode = options.key_word
			} else {
				this.getBanner()
			}
			this.getList();
			if (uni.pageScrollTo) {
				this.supportPageScroll = true
			}
		},
		onPullDownRefresh: function() {
			this.pageIndex = 1
			this.list = []
			this.getList();
		},
		onReachBottom: function() {
			this.pageIndex++
			this.getList();
		},
		methods: {
			getList: function() {
				let that = this;
				if (this.isDone) {
					uni.showToast({
						title: '已加载全部',
						icon: 'none',
					})
					return
				}
				var defaultData = {
					store_business: that.businessId,
					page: that.pageIndex,
					pageSize: that.pageSize,
				}
				var searchData = {
					page: that.pageIndex,
					pageSize: that.pageSize,
					key_word: that.mode
				}
				request.get('/api/Activity/notchRanking', {
					data: that.mode ? searchData : defaultData,
					success: function(res) {
						if (res.data.status == 1) {
							if (res.data.result.length > 0) {
								var tempArr = res.data.result;
								var list = that.list
								tempArr.forEach(item => {
									item.current = 0
								})
								list = list.concat(tempArr)
								that.list = [...list]
							} else {
								uni.showToast({
									title: '已加载全部',
									icon: 'none',
								})
								that.isDone = true
							}
						}
					}
				});
			},
			setall: function() {
				this.businessId = 0
				this.getList();
				this.close();
			},
			setItem: function(e) {
				this.businessId = e.currentTarget.dataset.id;
				this.list = [];
				this.isDone = false;
				this.pageIndex = 1;
				this.getList();
				this.close();
			},
			close: function() {
				this.dialog = false
			},
			getBanner: function() {
				let that = this;
				request.get('/api/Activity/business', {
					data: {},
					success: function(res) {
						let tempArr = res.data.result.ad;
						tempArr.forEach(item => {
							item.ad_code = setting.url + item.ad_code
						})
						that.banner = [...tempArr]
						that.storeBusiness = [...res.data.result.store_business]
					}
				});
			},
			showDialog: function() {
				this.dialog = true
			},
			// 去商品详情
			goDetail: function(e) {
				let item = e.currentTarget.dataset;
				uni.navigateTo({
					url: '/pages/goods/goodsInfo/goodsInfo?store_id=' + item.store_id + '&goods_id=' + item.goods_id,
				})
			},
			// 店铺详情
			goStore: function(e) {
				uni.navigateTo({
					url: '/pages/store/index/index?store_id=' + e.currentTarget.dataset.store_id,
				})
			},
			// 下一页
			next: function(e) {
				let tempArr = this.list;
				tempArr.forEach(item => {
					if (item.store_id == e.currentTarget.dataset.id) {
						item.current++;
						if (item.current == item.goods_list.length) {
							item.current = 0;
						}
					}
				})
				this.list = [...tempArr]
			},
			// 上一页
			before: function(e) {
				let tempArr = this.list;
				tempArr.forEach(item => {
					if (item.store_id == e.currentTarget.dataset.id) {
						if (item.current == 0) {
							item.current = item.goods_list.length
						}
						item.current--;
					}
				})
				this.list = [...tempArr]
			},
			// 轮播切换
			swiperChange: function(e) {
				let tempArr = this.list;
				tempArr.forEach(item => {
					if (item.store_id == e.currentTarget.dataset.id) {
						item.current = e.detail.current
					}
				})
				this.list = [...tempArr]
			},
			doScrollTop: function() {
				uni.pageScrollTo({
					scrollTop: 0
				});
			},
		}
	}
</script>

<style scoped src="./dk.css">

</style>
