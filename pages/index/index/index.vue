<template>
	<view>
		<view v-if="is_block==0">
			<view class="container">
				<!--搜索栏-->
				<view class="search-box" :class="{'search-fixed': scrollTop > 10}">
					<view class="search-inner">
						<view class="search-img">
							<image class="wh100" src="../../../static/images/search.png"></image>
						</view>
						<input class="search-cont" placeholder="请输入您所搜索的商品" type="text" disabled
							@tap.stop="jumpSearch" />
					</view>
				</view>
				<!--轮播图-->
				<view class="banners">
					<view class="finde_man"></view>
					<swiper class="swiper_box" indicator-dots autoplay interval="4000" duration="1000"
						:current="randomSwiper">
						<template v-for="(item, index) in homeData.banner">
							<swiper-item :key="'banner' + index">
								<navigator :url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.ad_link"
									hover-class="none">
									<image :src="item.ad_code" class="slide-image" mode="aspectFit" />
								</navigator>
							</swiper-item>
						</template>
					</swiper>
				</view>
				<!--导航列表-->
				<view class="venues_list">
					<view class="venues_item">
						<navigator url="/pages/goods/goodsList/goodsList?type=1" hover-class="none">
							<image :src="url + '/public/static/images/minniapp/index-mrxk.png'" />
							<view>每日新款</view>
						</navigator>
					</view>
					<view class="venues_item">
						<navigator url="/pages/goods/goodsList/goodsList?type=2" hover-class="none">
							<image :src="url + '/public/static/images/minniapp/index-bkbd.png'" />
							<view>爆款榜单</view>
						</navigator>
					</view>
					<view class="venues_item" v-if="false">
						<navigator url="/pages/goods/goodsList/goodsList" hover-class="none">
							<image :src="url + '/public/static/images/minniapp/index-mrxk.png'" />
							<view>当季热卖</view>
						</navigator>
					</view>
					<view class="venues_item">
						<navigator url="/pages/index/dk/dk" hover-class="none">
							<image :src="url + '/public/static/images/minniapp/index-dkph.png'" />
							<view>档口排行</view>
						</navigator>
					</view>
					<view class="venues_item">
						<navigator url="/pages/index/dk/dk" hover-class="none">
							<image :src="url + '/public/static/images/minniapp/index-slsj.png'" />
							<view>实力商家</view>
						</navigator>
					</view>
					<view class="venues_item">
						<navigator url="/pages/goods/goodsList/goodsList?type=2" hover-class="none">
							<image :src="url + '/public/static/images/minniapp/index-flxh.png'" />
							<view>分类选货</view>
						</navigator>
					</view>
					<view class="venues_item" :hidden="false">
						<navigator url="/pages/weBusiness/index/index" hover-class="none">
							<image :src="url + '/public/static/images/minniapp/index-wszq.png'" />
							<view>微商专区</view>
						</navigator>
					</view>
					<view class="venues_item">
						<view style="margin-top:0;" @tap.stop="topages" data-idx="2" data-type="store"
							:data-url="is_store_member ? '/pages/distribut0/shop/shop' : '/pages/newjoin/join4/join4'">
							<image
								:src="is_store_member ? url + '/public/static/images/minniapp/index-wdxd.png' : url + '/public/static/images/minniapp/index-wykd.png'" />
							<view>{{ is_store_member ? '我的小店' : '免费开店' }}</view>
						</view>
					</view>

					<view class="venues_item">
						<navigator url="/pages/infoservice/index/index" hover-class="none">
							<image :src="url + '/public/static/images/minniapp/index-xxfw.png'" />
							<view>信息服务</view>
						</navigator>
					</view>
					<view class="venues_item">
						<view @tap.stop="toDestine" hover-class="none" style="margin-top:0;">
							<image :src="url + '/public/static/images/minniapp/index-pbzx.png'" />
							<view>拼包平台</view>
						</view>
					</view>
					<view class="venues_item">
						<navigator url="/pages/team/helpCore/helpCore" hover-class="none">
							<image src="https://test.yitongwang.com/public/static/images/minniapp/help-core.png" />
							<view>帮助中心</view>
						</navigator>
					</view>
				</view>
				<view class="container1">
					<navigator class="container1-item" v-for="(item, index) in listArr" :key="'list' + index"
						:url="formatUrl.url(item.title)" style="position:relative;">
						<image class="logo-img" :data-title="item.title" :data-indexx="index" :src="item.title_img">
						</image>
						<view class="item-content">
							<view class="item-content-view" v-for="(item1, idx1) in item.arr"
								:data-store_id="item1.store_id" :data-indexx="index" :data-goods_id="item1.goods_id"
								:key="'list1' + index + idx1">
								<image class="item-content-img" :src="item1.original_img"></image>
								<view class="item-content-txt"><text class="money1">¥{{item1.shop_price}}</text></view>
							</view>
						</view>
					</navigator>
				</view>

				<view id="scroll"></view>
				<!--空元素 用于点击NAV时 页面滚动到此位置-->
				<van-sticky :offset-top="stickyHeight - 2">
					<!--防止出现计算偏差  多减2  -->
					<van-tabs z-index="7777" line-width="25" custom-class="recommendGoodsNav" @click="chooseNav">
						<van-tab title="为你推荐"></van-tab>
						<van-tab title="人气"></van-tab>
						<van-tab title="最新"></van-tab>
						<van-tab title="" disabled></van-tab>
					</van-tabs>
				</van-sticky>

				<view style="width:750rpx;">

					<view class="choice_list">
						<view class="listitem" v-for="(item, index) in listGoods" :key="'goods' + index"
							:style="'padding-bottom:' + item.is_recommend > 0 ? '30rpx' : '0'">
							<view class="choice_item" hover-class="none">
								<view class="img-wrap" @tap.stop="listGoodsToDetail" :data-id="item.goods_id"
									style="position:relative;">
									<image :src="item.original_img" mode="aspectFit"></image>
								</view>
								<view class="item-cont">
									<view class="title2">{{item.goods_name}}</view>
									<view class="price">
										<view class="reddd">￥{{item.shop_price}}</view>
									</view>
									<view class="title1" @tap.stop="listGoodsToStore" :data-store_id="item.store_id"
										:data-goods_id="item.goods_id">{{item.store_name + ' >'}}</view>
								</view>
							</view>
							<view class="videoo" v-if="video.length > 0">▶</view>
						</view>
					</view>
				</view>
				<view style="text-align:center;" :hidden="!loadingShow">
					<image class="loading" src="https://www.yitongwang.com/public/static/images/ajaxLoader.gif"></image>
				</view>
				<van-divider v-if="!loadingShow" :custom-style="'margin-bottom: ' + isiphoneX ? '15rpx' : '-20rpx'"
					contentPosition="center">我是有底线的
				</van-divider>
			</view>
		</view>

		<!-- 自定义页面 -->
		<!-- <view :style="'background-color: #f5f5f5;margin-top:' + search.length > 0 ? 100 : 0 + 'rpx;margin-bottom:120rpx;'" v-else>
			<block v-if="block_model">
				<import src="../../index/custom/custom.wxml" />
				<template is="custom"
					data="{{block_model:block_model,url:url,countDownList:countDownList,search:search,scrollTop:scrollTop,wap_home_logo:wap_home_logo,iflogin:iflogin,content:content,goods_show:goods_show,goods_show_fid:goods_show_fid,video:video,shop_list:shop_list,ad:ad,address:address,custom_skill_status:custom_skill_status,intelligence_date,from_address,marginBottom:marginBottom}}" />
			</block>
		</view> -->

		<!-- 新人专享好礼 -->
		<view class='newcomers' @touchmove.stop="return" v-if="newcomers">
			<view class='newcomers-tec'>
				<image class='new-img' src='https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/hongbao-1.png'>
				</image>
				<view class='newcomers-text'>
					<view class='text-auto'>
						<view v-for="(item, index) in xinrengit" class='text-an' :key="'xin' + index">
							<text :data-id="item.id" class='text-an2'>￥<text
									class='text-an3'>{{item.money}}</text>元新人红包</text>
						</view>
					</view>
					<image @tap='newdax' class='new-img3'
						src='https://www.yitongwang.com/public/static/images/button-1.png'></image>
				</view>
				<image class='dax-1' @tap='daxhide' src='../../../static/images/dax-1.png'></image>
			</view>
		</view>

		<!-- 消息提醒  提醒当日新增件数-->
		<view class="goodsTipsBox" :hidden="goodsTips" @touchmove.stop="true">
			<view class="goodsTips">
				<image :src="url + '/public/static/images/minniapp/tipsBanner-ld.png'" class="tipsBackground">
				</image>
				<view class="tipsTitle">消息提醒</view>
				<view class="tipsTxt">
					<image class="tipsTxt-img" :src="url + '/public/static/images/minniapp/tipsBanner1.png'">
					</image>
					<view class="tipsTxt-txt">昨日新增商品<text class="tips-red"> {{ randomSum }} </text>件</view>
				</view>
				<view @tap.stop="closeGoodsTips" class="tipsSure">{{ '确 认' }}</view>
			</view>
		</view>


		<!-- 返回顶部按钮  -->
		<view class="toTop" @tap="doScrollTop" v-if="supportPageScroll">
			<image class="wh100" src="../../../static/images/topup.png"></image>
		</view>

		<!-- 底部菜单 -->
		<!-- <import src="../../index/publics/publics.wxml"/>
		<block v-if="{{menu_model.length > 0}}">
		    <template is="model" data="{{page:menu_index,menu_model:menu_model,url:url,defaultMenu:defaultMenu,is_store_member:is_store_member,is_apply:is_apply,isiphoneX:isiphoneX}}" />
		</block>
		
		<block v-else>
		    <template is="model" data="{{page:0,menu_model:[],url:url,defaultMenu:defaultMenu,is_store_member:is_store_member,is_apply:is_apply,isiphoneX:isiphoneX}}" />
		</block> -->
		<footbar :page="page" :menu_model="menu_model" :url="url" :defaultMenu="defaultMenu"
			:is_store_member="is_store_member" :isiphoneX="isiphoneX" @topages="topages"></footbar>
		<!-- 底部菜单 -->

		<van-dialog id="van-dialog" />
		<!-- 选择地址弹框  -->
		<!-- <import src="../../../utils/regions/regions.wxml" />
		<template is="regions" data="{{regions}}" /> -->
	</view>
</template>

<script lang="wxs" module="formatUrl">
	var url = function(title) {
		var url = ''
		switch (title) {
			case "档口排行":
				url = "/pages/index/dk/dk";
				break;
			case "每日新款":
				url = "/pages/goods/goodsList/goodsList?type=1";
				break;
			case "爆款榜单":
				url = "/pages/goods/goodsList/goodsList?type=2";
				break;
			case "当季热卖":
				url = "/pages/goods/goodsList/goodsList?type=3";
				break;
		}
		return url
	}
	var openType = function(title) {
		var type = ''
		switch (title) {
			case "档口排行":
				type = "navigate";
				break;
			case "每日新款":
				type = "switchTab";
				break;
			case "爆款榜单":
				type = "switchTab";
				break;
			case "当季热卖":
				type = "switchTab";
				break;
		}
		return type
	}
	module.exports = {
		url,
		openType
	}
</script>
<script>
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	var bmap = require('../../../static/libs/bmap-uni.min.js');
	var util = require('../../../static/utils/util.js');
	var common = require('../../../static/utils/common.js');
	var WxParse = require('../../../static/utils/wxParse/wxParse.js');
	import LoadMore from '../../../static/utils/LoadMore.js';
	var load = new LoadMore;
	var timeSum = new Date();
	var riqi = timeSum.getDate();
	var timer1 = '';
	export default {
		data() {
			return {
				url: setting.url,
				logo: setting.appLogo,
				stickyHeight: uni.getSystemInfoSync().screenWidth * 88 / 750,
				randomSwiper: Math.ceil(Math.random() * 4),
				homeData: null, //首页轮播和广告
				saleGoods: null, //秒杀商品
				marginBottom: uni.getStorageSync('marginBottom') || 0,
				sale: {
					countTime: {
						hour: '00',
						minute: '00',
						second: '00',
					},
					diffTime: 0,
					good: null,
				},
				timer: null, //活动倒计时定时器
				shopList: [], //门店列表
				recommend: null, //推荐商品
				teamActivityHome: null, //拼团列表
				scrollTop: 0,
				currentPage: 1,
				wap_home_logo: '',
				latitude: 0,
				longitude: 0,
				region_id: 0,
				currentCity: "",
				isChangeRegion: false, //是否切换地址
				countDownList: {
					day: '00',
					hou: '00',
					min: '00',
					sec: '00',
				}, //秒杀结束初始化时间
				webUrl: '',
				is_block: 1,
				defaultMenu: false, //默认底部菜单显示状态
				infologin: false,
				newcomers: false, //新人好礼专享
				xinrengit: [], //新人好礼专享数据
				coupon_id: "",
				custom_skill_status: false,
				from_address: {},
				menu_index: 0, //菜单索引
				goods_show: 0,
				address: '', //当前地址
				end_time: '', //秒杀结束时间
				search: [],
				ak: 'fZksmKUsUDqqYs2FHWv6CHHBIF3cR5qK', //百度地图key
				is_apply: 0,
				listArr: [], //获取到的首页数据
				is_store_member: false,
				goodsTips: true,
				randomSum: 0,
				isiphoneX: uni.getStorageSync('isiphoneX') || false,
				recommendGoodsNavIndex: 0, //默认为你推荐是第一项 下标0
				listP: 1, //商品模块page
				listType: 1,
				listGoods: [],
				supportPageScroll: false,
				loadingShow: true,
				sc: false
			}
		},
		onLoad: function(options) {
			uni.hideShareMenu()
			var that = this;
			if (options.first_leader) {
				uni.setStorageSync('first_leader', options.first_leader);
			}
			//预加载自定义缓存页面
			if (uni.getStorageSync('custom_data')) {
				that.customRendering(uni.getStorageSync('custom_data'));
			}
			uni.setNavigationBarTitle({
				title: setting.appName,
			});

			//以前有登录过，则直接登录
			if (app.auth.hadAuth()) {
				app.getUserInfo(function(userInfo) {
					that.userInfo = Object.assign({}, userInfo)
				});
			}
			load.init(this, '', 'recommend');
			this.requestHomePage();
			//首页logo
			request.get('/api/Index/getConfig', {
				failRollback: true,
				successReload: true,
				success: function(res) {
					var data = res.data.result.config;
					app.globalData.config = data;
					var is_block = common.getConfigByName(data, 'is_block_index');
					var wap_home_logo = '';
					for (let i = 0; i < data.length; i++) {
						if (data[i]['name'] == 'wap_home_logo') {
							wap_home_logo = data[i]['value']
						}
						if (data[i]['name'] == 'hot_keywords') {
							var lemd = data[i]['value'].split('|')
							uni.setStorageSync('hot_keywords', lemd);
						}
					}

					//is_block = 0
					that.is_block = is_block
					that.wap_home_logo = setting.url + wap_home_logo

					if (is_block == 0) {
						uni.removeStorageSync('custom_data');
						that.defaultMenu = true
						that.menu_model = []
						app.globalData.menu_model = [];
						app.globalData.defaultMenu = true;
						load.init(this, '', 'shopList');
						//第一次加载默认读取该页面自定义控件，有良好体验，通过点击菜单是一个跳转到自定义页面customPage        
						that.checklogin();
						that.getAutoData();
					}
				}
			});
			this.hasActive();
			this.getListGoods(1, 1)
			if (uni.pageScrollTo) {
				this.supportPageScroll = true
			}
		},
		onShow: function() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#3abdb7'
			})
			var is_store_member = uni.getStorageSync('app:userInfo').is_store_member || 0
			if (is_store_member > 0) {
				this.is_store_member = true
			}
			if (this.isChangeRegion) {
				this.currentPage = 1
				this.shopList = null
				load.resetConfig()
			}
			if (this.infologin) {
				this.infologin = false
				this.checklogin()
			}
		},
		onReachBottom: function() {
			this.listP = this.listP - 0 + 1
			this.getListGoods(this.listType, this.listP, '')
		},
		onPullDownRefresh: function(e) {
			if (this.is_block == 0) {
				this.recommend = null;
				this.currentPage = 1;
				load.resetConfig();
				this.requestHomePage(); //首页数据
			} else {
				this.getAutoData();
				uni.stopPullDownRefresh();
			}
		},
		onUnload: function() {
			this.destroyActivityTimer();
		},
		onShareAppMessage: function(res) {
			return setting.share;
		},
		onPageScroll: function(res) {
			if (res.scrollTop > 1930) {
				this.sc = true
			} else {
				this.sc = false
			}
		},
		methods: {
			// 获取活动列表
			hasActive: function() {
				let that = this;
				request.get('/api/Activity/dayNotch', {
					data: {},
					success: function(res) {
						let tempArr = res.data.result;
						tempArr.forEach(item => {
							item.title_img = setting.url + item.title_img;
						})
						that.listArr = [...tempArr]
					}
				});
			},
			// 去商品详情
			goDetail: function(e) {
				let item = e.currentTarget.dataset;
				uni.navigateTo({
					url: '/pages/goods/goodsInfo/goodsInfo?store_id=' + item.store_id + '&goods_id=' + item.goods_id,
				})
			},
			//新人专享好礼数据
			newtect: function() {
				let that = this;
				request.get(app.globalData.setting.url + '/api/index/get_noob', {
					successReload: true,
					success: function(res) {
						if (res.data.status == 1) {
							that.newcomers = true
							that.xinrengit = res.data.noob_gift
							var comId = "";
							that.xinrengit.forEach(function(ele, index) {
								if (index === 0) {
									comId = ele.id
								} else {
									comId += '_' + ele.id
								}
							})
							that.coupon_id = comId
						}
					}
				})
			},
			//领取新人好礼
			newdax: function() {
				var that = this;
				this.newcomers = false
				request.get(app.globalData.setting.url + '/api/index/get_noob_coupon', {
					successReload: true,
					data: {
						coupon_id: that.coupon_id
					}
				})
			},
			//关闭新人好礼
			daxhide: function() {
				this.newcomers = false
			},
			initLocation: function() {
				//获取当前定位
				var that = this
				uni.authorize({
					scope: 'scope.userLocation',
					success: function(res) {
						uni.getLocation({
							success: function(res) {
								that.latitude = res.latitude
								that.longitude = res.longitude
							},
						})
					},
					fail: function(res) {
						uni.showModal({
							title: '用户未授权',
							content: '未授权获取位置信息将不能体验小程序完整功能，前往个人中心页底部->授权管理',
							success: (res) => {
								if (res.confirm) {
									uni.reLaunch({
										url: '/pages/user0/index/index',
									})
								}
							}
						})
					}
				})
			},
			//   特色推荐
			requestRecommend: function() {
				var that = this;
				var requestUrl = '/api/index/recommend?p=' + that.currentPage;
				load.request(requestUrl, function() {
					that.currentPage++;
				});
			},
			// 拼团列表
			requestTeamActivityHome: function() {
				var that = this;
				request.get('/api/team/teamActivityHome', {
					success: function(res) {
						var res = res.data;
						if (res.status == 1) {
							for (var i in res.result) {
								res.result[i].team_price_new = res.result[i].team_price.split('.');
							}
							that.teamActivityHome = [...res.result]
						}
					}
				});
			},
			requestShopList: function() {
				var that = this;
				//设置点击的城市
				var search = that.search;
				search.currentCity = that.currentCity
				that.search = Object.assign({}, search)
				var requestUrl = '/api/index/shopList?p=' + that.currentPage + '&latitude=' + that.latitude +
					'&longitude=' + that.longitude + '&city_id=' + that.region_id;
				load.request(requestUrl, function(res) {
					that.region_id == 0;
					that.shop_list = [...res.data.result]
					that.currentPage++;
				});
			},
			requestHomePage: function() {
				var that = this;
				request.get('/api/index/homePage?new_ad=1', {
					success: function(res) {
						var result = {};
						var banners = res.data.result.banner || [];
						for (var i = 0; i < banners.length; i++) {
							banners[i].ad_code = common.getFullUrl(banners[i].ad_code);
							if (banners[i].media_type == 3) {
								banners[i].media_link = '/pages/goods/goodsInfo/goodsInfo?goods_id=' +
									banners[i].ad_link;
							} else if (banners[i].media_type == 4) {
								banners[i].media_link = '/pages/goods/goodsList/goodsList?cat_id=' +
									banners[i].ad_link;
							}
						}
						var ad = res.data.result.ad
						var ads = {}
						for (var i = 0; i < ad.length; i++) {
							ad[i].ad_link = that.parseAdUrl(ad[i].media_type, ad[i].ad_link);
							ad[i].ad_code = common.getFullUrl(ad[i].ad_code);
							ads['ad_' + ad[i].pid] = ad[i]
						}
						res.data.result.ad = ads
						var sale_goods = res.data.result.flash_sale_goods;
						if (sale_goods.length > 0) {
							that.setSaleTime(res.data.result);
						}
						if (sale_goods.length > 0 && sale_goods.length < 3) {
							that.saleGoods = [...sale_goods]
						} else if (sale_goods.length >= 3) {
							var goods = [];
							for (var j = 0; j <= 3; j++) {
								goods[j] = sale_goods[j];
							}
							that.saleGoods = [...goods]
						}
						that.homeData = Object.assign({}, res.data.result)
						uni.stopPullDownRefresh();
						if (uni.getStorageSync('riqi') != riqi || !uni.getStorageSync('riqi')) {
							timer1 = setTimeout(function() {
								that.goodsTips = false
								that.randomSum = res.data.result.yesterday_add_goods_num
								clearTimeout(timer1)
							}, 1500)
							uni.setStorageSync('riqi', riqi)
						}
					}
				});
			},
			parseAdUrl: function(type, link) {
				var $url
				switch (type) {
					case 3:
						$url = '/pages/goods/goodsInfo/goodsInfo?goods_id=' + link
						break;
					case 4:
						$url = '/pages/goods/goodsList/goodsList?id=' + link
						break;
					default:
						$url = link
						break;
				}
				return $url;
			},
			setSaleTime: function(result) {
				if (!result.diffTime) {
					result.diffTime = (new Date()).getTime() - result.server_time * 1000;
				}
				if (!result.diffTime) {
					result.diffTime = (new Date()).getTime() - result.server_time * 1000;
				}
				var hour = util.format(result.server_time, 'h');
				var flash_now_time = 0;
				if (hour % 2 == 0) {
					flash_now_time = hour;
				} else {
					flash_now_time = hour - 1;
				}
				if (hour.length == 1) {
					flash_now_time = '0' + flash_now_time
				}
				this.flash_now_time = flash_now_time
				this.sale.diffTime = result.diffTime
				this.sale.good = result.flash_sale_goods[0]
				this.sale = Object.assign({}, this.sale)
				this.destroyActivityTimer();
			},
			/** 创建活动倒计时定时器 */
			createActivityTimer: function() {
				var sale = this.sale;
				var that = this;
				this.timer = setInterval(function() {
					var time = sale.good.end_time * 1000 - (new Date()).getTime() + sale.diffTime;
					var remainTime = util.transTime(time);
					if (time <= 0) {
						that.requestHomePage(); //首页数据
						return;
					}
					that.sale.countTime = remainTime
					that.sale = Object.assign({}, that.sale)
				}, 1000);
			},
			/** 销毁活动倒计时定时器 */
			destroyActivityTimer: function() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			jumpSearch: function() {
				uni.navigateTo({
					url: '/pages/goods/search/search'
				});
			},
			//   跳转到店铺详情
			goShopIndex: function(e) {
				uni.navigateTo({
					url: '/pages/shopIndex/shopIndex?store_id=' + e.currentTarget.dataset.item.store_id,
				})
			},
			/****************************** 自定义 start ********************************/
			//获取自定义首页数据
			getAutoData: function(id) {
				var that = this;
				var url = !id ? '/api/Index/block_index' : '/api/Index/block_index/id/' + id
				request.get(url, {
					failRollback: true,
					successReload: true,
					success: function(res) {
						if (res.data.status == 1) {
							uni.setStorageSync('custom_data', res.data.result.blocks)
							that.customRendering(res.data.result.blocks)
						}
					}
				});
			},
			/** 自定义组件渲染 */
			customRendering: function(custom) {
				var that = this;
				var data = custom; //模块集合
				var skill = []; //秒杀
				var block_model = []; //其他模块集合
				var shop = []; //多门店集合
				var content = []; //富文本集合
				var menu_model = []; //菜单集合
				var video = []; //视频集合
				var search = []; //搜索
				var ids = [];

				for (let z = 0; z < data.length; z++) {
					if (data[z]['block_type'] == '6') {
						skill = data[z];
					}

					if (data[z]['block_type'] == '14') {
						data[z]['video_url'] = data[z]['video_url'].indexOf('http') == -1 ? 
							setting.url + data[z]['video_url'] : data[z]['video_url'];
						video = data[z];
					}

					if (data[z]['block_type'] != '8' && data[z]['block_type'] != '9' && data[z]['block_type'] != '11') {
						if (data[z]['block_type'] == '13') {
							let goodslist = data[z]['goods_list'];

							for (let gl = 0; gl < goodslist.length; gl++) {

								if (goodslist[gl].original_img.indexOf('http') < 0 && goodslist[gl].original_img.indexOf('https') < 0) {

									goodslist[gl].original_img = that.url + goodslist[gl].original_img;
								}
							}

							data[z]['goods_list'] = goodslist;
						}
						if (data[z]['block_type'] == '3') {
							let goodslist = data[z]['nav'][0]['goods_list'];
							for (let gl = 0; gl < goodslist.length; gl++) {
								if (goodslist[gl].original_img.indexOf('http') < 0 && goodslist[gl].original_img.indexOf('https') < 0) {
									goodslist[gl].original_img = that.url + goodslist[gl].original_img;
								}
							}
							data[z]['list'] = goodslist;
						}
						block_model.push(data[z]);
						ids.push(data[z]['div_order'])
					}
					if (data[z]['block_type'] == '8') {
						search = data[z];
					}

					if (data[z]['block_type'] == '18') {
						shop = data[z];
					}

					if (data[z]['block_type'] == '16') {
						content = data[z];
					}

					if (data[z]['block_type'] == '11') {
						menu_model = data[z];
					}

					if (data[z]['block_type'] == '19') {
						for (let i = 0; i < data[z]['nav'].length; i++) {
							if (data[z]['nav'][i]['type'] == 4) {
								var len = data[z]['nav'][i]['option_name'].length;
								var arrs = [];
								for (let ii = 0; ii < len; ii++) {
									let obj = {
										name: data[z]['nav'][i]['option_name'][ii],
										selected: -1
									}
									arrs.push(obj)
								}
								data[z]['nav'][i]['option_name'] = arrs
							}

							if (data[z]['nav'][i]['type'] == 5) {
								var len = data[z]['nav'][i]['option_name'].length;
								var arrs = [];
								for (let ii = 0; ii < len; ii++) {
									let obj = {
										name: data[z]['nav'][i]['option_name'][ii],
										selected: -1
									}
									arrs.push(obj)
								}
								data[z]['nav'][i]['option_name'] = arrs
							}
						}
						that.initRegions();
					}
				}

				var array = [];
				if (ids.length > 0) {
					for (let y = 1; y <= ids.length; y++) {
						array.push(y);
					}
				}

				if (skill != '' && skill.activity_type == 1) {
					that.end_time = skill.end_time
					that.destroyActivityTimer();
					that.timer = setInterval(function() {
						that.secondKill();
					}, 1000);
				}

				if (shop == '') {
					uni.getLocation({
						type: 'wgs84',
						altitude: true,
						success: function(res) {
							that.getUserLatitudeLongitude(shop, res);
						},
						fail(e) {
							// app.confirmBox('如需正常使用小程序门店自提点功能，请在【我的】页面中点击授权按钮，勾选用户信息并点击确定。');
						}
					})
				}
				block_model = that.returnModelArr(block_model, array);
				app.globalData.menu_model = menu_model.nav;
				that.video = video;
				that.search = search;
				that.menu_model = menu_model.nav ? menu_model.nav : [];
				that.models = data;
				that.block_model = block_model;
			},
			/** 获取授权用户经纬度 */
			getUserLatitudeLongitude: function(result, res) {
				var that = this;
				//根据用户当前经纬度获取相应的附近门店
				request.post('/api/Index/shopList', {
					data: {
						lng: res.longitude,
						lat: res.latitude,
						province: '',
						search_radius: result.search_radius,
					},
					failRollback: true,
					successReload: true,
					success: function(res) {
						var ad = res.data.result.length > 0 ? false : true;
						that.shop_list = [...res.data.result]
						that.ad = ad
					}
				});
				//用户当前经纬度地址位置
				var BMap = new bmap.BMapWX({
					ak: that.ak,
				});
				var fail = function(data) {};
				var success = function(data) {
					var originalData = data.originalData;
					var search = that.search;
					search.currentCity = originalData.result.addressComponent.city;
					that.address = originalData.result.formatted_address;
					that.search = Object.assign({}, search);
				}
				BMap.regeocoding({
					location: res.latitude + ',' + res.longitude, //22.622572 + ',' + 114.077780, // 22.71991 + ',' + 114.24779, 
					fail: fail,
					success: success,
				});
			},
			shop_page: function(e) {
				uni.navigateTo({
					url: '/pages/cart/cart2/shopDetail/shopDetail?datas=' + JSON.stringify(e.currentTarget.dataset.item)
				});
			},
			/** 自定义模板秒杀接口时间数据 */
			secondKill: function() {
				// 获取当前时间
				let newTime = new Date().getTime();
				let countDownArr = null;
				// 对结束时间进行处理渲染到页面    
				let endTime = this.data.end_time * 1000; //活动结束时间       
				let obj = null;
				// 如果活动未结束，对时间进行处理
				if (endTime - newTime > 0) {
					let time = (endTime - newTime) / 1000;
					// 获取天、时、分、秒
					let day = parseInt(time / (60 * 60 * 24));
					let hou = parseInt(time % (60 * 60 * 24) / 3600);
					let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
					let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
					obj = {
						day: this.timeFormat(day),
						hou: this.timeFormat(hou),
						min: this.timeFormat(min),
						sec: this.timeFormat(sec)
					}
				} else { //活动已结束，全部设置为'00'
					this.destroyActivityTimer();
					this.custom_skill_status = false
					this.getAutoData(); //首页数据
					return;
				}
				countDownArr = obj;
				this.countDownList = [...countDownArr];
				this.custom_skill_status = true;
			},
			timeFormat: function(param) { //小于10的格式化函数
				return param < 10 ? '0' + param : param;
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
						for (var i in that.coupons) {
							if (that.coupons[i].id == coupon_id) {
								that.coupons.splice(i, 1);
								that.coupons = [...that.coupons];
								break;
							}
						}
					}
				});
			},
			/** 跳转模式 自定义页面 || 自定义菜单 || 自定义控件控件*/
			topage: function(e) {
				//自定义控件控件
				var obj = e.currentTarget.dataset.obj ? e.currentTarget.dataset.obj : '';
				var url = e.currentTarget.dataset.url;
				var page_type = e.currentTarget.dataset.type;
				var id = e.currentTarget.dataset.id;
				if (obj == 'custom') {
					//底部自定义菜单
					var idx = e.currentTarget.dataset.idx;
					app.globalData.menu_index = idx;
					page_type = this.menu_model[idx].url_type
					id = this.menu_model[idx].app_url
				}
				//判断跳转的类型  1 = 小程序页面，2 = 分类商品，3 = 商品详情 ，4 = 自定义页面 , 5 = 外部网址链接,
				if (page_type == 1) {
					if (obj == 'custom') {
						//要访问的页面idx，当前页面menu_index
						common.totabar(idx, this.menu_index, this.menu_model);

					} else {
						var url = common.meunCheck(e.currentTarget.dataset.url);
						uni.navigateTo({
							url: url,
						});
					}
				} else if (page_type == 2) {
					uni.navigateTo({
						url: '/pages/goods/goodsList/goodsList?cat_id=' + id
					});
				} else if (page_type == 3) {
					uni.navigateTo({
						url: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + id
					});
				} else if (page_type == 5 || page_type == 0) {
					if (url == "") {
						return false;
					}
					this.webUrl = url ? url : id;
					uni.navigateTo({
						url: '/pages/index/webview/webview'
					});
				} else {
					//自定义页面      
					if (obj == 'custom') {
						uni.reLaunch({
							url: '../../index/customPage/customPage?id=' + this.menu_model[idx].app_url,
						})
					} else {
						uni.navigateTo({
							url: '../../index/customPage/customPage?id=' + id + '&types=-1',
						})
					}
				}
			},
			/** 默认菜单 */
			topages: function(e) {
				var idx = e.detail.idx;
				var that = this;
				if (idx == 2) {
					if (!uni.getStorageSync('app:userInfo')) {
						app.getUserInfo(function(userInfo) {
							that.userInfo = Object.assign({}, userInfo);
							that.click = false
						}, true, false);
						return false;
					}
				}
				if (e.currentTarget.dataset.type && e.currentTarget.dataset.type == 'store') {
					uni.navigateTo({
						url: e.currentTarget.dataset.url,
					})
					return
				}
				app.globalData.menu_index = idx;
				common.defaultTotabar(idx, 0);
			},
			//新闻详情
			goNewsDetail: function(e) {
				var id = e.currentTarget.dataset.id;
				var link = e.currentTarget.dataset.link;
				var webUrl;
				if (link != '') {
					webUrl = link;
				} else {
					webUrl = "/api/news/news_detail?news_id=" + id;
				}
				this.webUrl = webUrl;
				uni.navigateTo({
					url: '/pages/index/webview/webview'
				});
			},
			changeGoodsShow: function(e) {
				var index = e.currentTarget.dataset.index;
				var fid = e.currentTarget.dataset.fid;
				this.block_model[fid]['list'] = this.block_model[fid]['nav'][index]['goods_list']
				this.block_model[fid]['title_selected'] = index
				this.goods_show = index
				this.goods_show_fid = fid
				this.block_model = [...this.block_model]
			},
			returnModelArr: function(data, ids) {
				var arr = [];
				for (let i = 0; i < ids.length; i++) {
					for (let l = 0; l < data.length; l++) {
						if (ids[i] == data[l]['div_order']) {
							arr.push(data[l]);
						}
					}
				}
				return arr;
			},
			tologin: function() {
				if (!app.auth.isAuth()) {
					app.showLoading(null, 1500);
					app.getUserInfo();
					this.infologin = true;
				}
			},
			checklogin: function() {
				this.infologin = app.auth.hadAuth()
			},
			bindTimeChange: function(e) {
				var that = this;
				let fid = e.currentTarget.dataset.fid;
				let idx = e.currentTarget.dataset.idx;
				let datas = that.block_model;
				datas[fid]['nav'][idx]['val'] = e.detail.value;
				this.intelligence_date = e.detail.value;
				this.block_model = [...datas];
			},
			/** 初始化区域弹框相关 */
			initRegions: function(e) {
				var that = this;
				new Regions(this, 'regions', {
					endAreaLevelCall: function(parentId, regionName, address) {
						Object.assign(that.from_address, address);
						that.from_address = Object.assign({}, that.from_address);
					},
					setFromRegionsVal: function(selected, address) {
						let fid = selected.fid;
						let idx = selected.idx;
						let datas = that.block_model;
						datas[fid]['nav'][idx]['val'] = address.province_name + address.city_name + address.district_name + address.twon_name;
						that.block_model = [...datas];
					}
				});
			},
			radioChange: function(e) {
				var that = this;
				let fid = e.currentTarget.dataset.fid;
				let idx = e.currentTarget.dataset.idx;
				let idxs = e.currentTarget.dataset.idxs;
				let datas = that.block_model;
				for (let i = 0; i < datas[fid]['nav'][idx]['option_name'].length; i++) {
					datas[fid]['nav'][idx]['option_name'][i]['selected'] = -1
					datas[fid]['nav'][idx]['val'] = ''
				}
				datas[fid]['nav'][idx]['option_name'][idxs]['selected'] = idxs
				datas[fid]['nav'][idx]['val'] = datas[fid]['nav'][idx]['option_name'][idxs]['name']
				that.block_model = [...datas]
			},
			checkboxChange: function(e) {
				var that = this;
				let fid = e.currentTarget.dataset.fid;
				let idx = e.currentTarget.dataset.idx;
				let idxs = e.currentTarget.dataset.idxs;
				let datas = that.block_model;

				if (datas[fid]['nav'][idx]['option_name'][idxs]['selected'] == idxs) {
					datas[fid]['nav'][idx]['option_name'][idxs]['selected'] = -1
				} else {
					datas[fid]['nav'][idx]['option_name'][idxs]['selected'] = idxs
				}
				let val = '';
				if (datas[fid]['nav'][idx]['option_name'].length > 0) {
					for (let i = 0; i < datas[fid]['nav'][idx]['option_name'].length; i++) {
						if (datas[fid]['nav'][idx]['option_name'][i]['selected'] >= 0) {
							if (val) {
								val += ',' + datas[fid]['nav'][idx]['option_name'][i]['name']
							} else {
								val += datas[fid]['nav'][idx]['option_name'][i]['name']
							}
						}
					}
				}
				datas[fid]['nav'][idx]['val'] = val;
				that.block_model = [...datas];
			},
			checkFromType: function(e) {
				var that = this;
				let fid = e.currentTarget.dataset.fid;
				let idx = e.currentTarget.dataset.idx;
				let datas = that.block_model;
				datas[fid]['nav'][idx]['val'] = e.detail.value;
				that.block_model = [...datas];
			},
			fromSubmit: function(e) {
				var that = this;
				let datas = that.block_model;
				let fid = e.currentTarget.dataset.fid;
				var data = '';
				for (let j = 0; j < datas[fid]['nav'].length; j++) {
					if (datas[fid]['nav'][j]['required'] == 1 && !datas[fid]['nav'][j]['val'] && 
						(datas[fid]['nav'][j]['type'] == 0 || datas[fid]['nav'][j]['type'] == 1)) {
						return app.showTextWarining("请填写" + datas[fid]['nav'][j]['title']);
					}

					if (datas[fid]['nav'][j]['type'] == 0 && datas[fid]['nav'][j]['verify_type'] == 1) {
						if (!app.validatemobile(datas[fid]['nav'][j]['val'])) {
							return;
						}
					}

					if (datas[fid]['nav'][j]['type'] == 0 && datas[fid]['nav'][j]['verify_type'] == 2) {
						if (!common.checkEmail(datas[fid]['nav'][j]['val'])) {
							return app.showTextWarining("请填写" + datas[fid]['nav'][j]['title'] + '正确的格式');
						}
					}

					if (datas[fid]['nav'][j]['required'] == 1 && !datas[fid]['nav'][j]['val'] && 
						(datas[fid]['nav'][j]['type'] == 2 || datas[fid]['nav'][j]['type'] == 3 || 
						datas[fid]['nav'][j]['type'] == 5 || datas[fid]['nav'][j]['type'] == 4)) {
						return app.showTextWarining("请选择" + datas[fid]['nav'][j]['title']);
					}
					let text = datas[fid]['nav'][j]['val'] ? datas[fid]['nav'][j]['val'] : '';
					data += '&name' + j + '=' + text
				}

				//验证之后清空数据
				for (let i = 0; i < datas[fid]['nav'].length; i++) {
					datas[fid]['nav'][i]['val'] = '';
					if (datas[fid]['nav'][i]['type'] == 4) {
						for (let y = 0; y < datas[fid]['nav'][i]['option_name'].length; y++) {
							datas[fid]['nav'][i]['option_name'][y]['selected'] = -1;
						}
					}

					if (datas[fid]['nav'][i]['type'] == 5) {
						for (let u = 0; u < datas[fid]['nav'][i]['option_name'].length; u++) {
							datas[fid]['nav'][i]['option_name'][u]['selected'] = -1;
						}
					}
				}

				var from_datas = '?timeid=' + datas[fid]['timeid'] + '&form_name=' + datas[fid]['form_name'] + data
				request.get('/Api/Index/save_form' + from_datas, {
					data: data,
					failRollback: true,
					success: function(res) {
						app.showTextWarining(datas[fid]['result'] || '提交成功', function() {
							that.block_model = [...datas]
						});
					}
				});
			},
			toDestine: function() { // 针对进入拼包，做的单独判断
				var that = this
				if (!uni.getStorageSync('app:userInfo')) {
					app.getUserInfo(function(userInfo) {
						that.userInfo = Object.assign({}, userInfo)
						that.click = false
					}, true, false);
					return false;
				}
				uni.navigateTo({
					url: '/pages/subcontract/unPublicPage/unPublic',
				})
			},
			hidetabbar: function() { //隐藏默认tab
				uni.hideTabBar({
					fail: function() {
						setTimeout(function() { // 做了个延时重试一次，作为保底。
							uni.hideTabBar()
						}, 500)
					}
				});
			},
			closeGoodsTips: function() {
				this.goodsTips = true
			},
			/****************************** 自定义 end ********************************/
			chooseNav: function(e) {
				var curNav = e.detail.index
				this.listType = curNav - 0 + 1
				this.sc ? this.getListGoods(curNav - 0 + 1, 1, 'a') : this.getListGoods(curNav - 0 + 1, 1, 's')
			},
			resetListGoods: function(cb) {
				this.listP = 1
				this.listGoods = []
			},
			getListGoods: function(type, p, scroll) {
				this.loadingShow = true
				var that = this
				request.get(that.url + '/api/Activity/recommendGoods', {
					data: {
						type: type,
						page: p
					},
					success: function(res) {
						that.loadingShow = false
						if (res.data.status == 1) {
							if (scroll == 'a') {
								that.resetListGoods()
								that.listGoods = [...that.listGoods, ...res.data.result]
								uni.pageScrollTo({
									scrollTop: 1950,
									duration: 100
								})
								return
							} else if (scroll == 's') {
								that.resetListGoods()
								that.listGoods = [...that.listGoods, ...res.data.result]
								return
							}
							that.listGoods = [...that.listGoods, ...res.data.result]
						}
					}
				})
			},
			listGoodsToDetail: function(e) {
				var that = this
				if (that.listType == 1) {
					request.post(that.url + '/api/Activity/addClickCount', {
						data: {
							goods_id: e.currentTarget.dataset.id
						},
						success: function() {}
					})
				}
				uni.navigateTo({
					url: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + e.currentTarget.dataset.id,
				})
			},
			listGoodsToStore: function(e) {
				var that = this
				if (that.listType == 1) {
					request.post(that.url + '/api/Activity/addClickCount', {
						data: {
							goods_id: e.currentTarget.dataset.goods_id
						},
						success: function() {}
					})
				}
				uni.navigateTo({
					url: '/pages/store/index/index?store_id=' + e.currentTarget.dataset.store_id,
				})
			},
			/** 返回顶部 */
			doScrollTop: function() {
				uni.pageScrollTo({
					scrollTop: 0
				});
			},
		}
	}
</script>

<style scoped src="./index.css">

</style>
