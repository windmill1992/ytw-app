<template>
	<view>
		<view class="container">
			<view class="nav">
				<view class="nav-item" :class="{'red-on': requestUrl == requestData.orderby_default}" @tap="changeTab"
					:data-href="requestData.orderby_default">人气<view class="ico-dg">
						<image class="wh100" src="../../../static/images/dg.png"></image>
					</view>
				</view>
				<view class="nav-item" :class="{'red-on': requestUrl == requestData.orderby_sales_sum}" @tap="changeTab"
					:data-href='requestData.orderby_sales_sum'>销量</view>
				<view class="nav-item" @tap="changeTab" @tap="openFilterModal">筛选<view class="ico-filter">
						<image class="wh100" src="../../../static/images/xx.png"></image>
					</view>
				</view>
				<view class="nav-item" @tap="changeTab" @tap="toSearchPage">搜索<view class="ico-filter">
						<image class="wh100" src="../../../static/images/search.png"></image>
					</view>
				</view>
			</view>

			<view class="choice_list">
				<!-- 防止商品正在继续上架，导致分页出现重复  待测试 -->
				<view class="listitem" v-for="(item, index) in requestData.goods_list" :key="'goods' + index"
					:style="'padding-bottom:' + item.is_recommend > 0 ? '30rpx' : '0'">
					<navigator class="choice_item" hover-class="none"
						:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id + '&store_id=' + item.store_id">
						<view class="img-wrap">
							<image :src="item.original_img" mode="scaleToFill"></image>
							<text :hidden="!item.activity.prom_title"
								class="Seconds_kill">{{item.activity.prom_title}}</text>
						</view>
						<view class="item-cont">
							<view class="title1">{{item.store_name}}</view>
							<view class="title2">{{item.goods_name}}</view>
							<view class="price">
								<view class="reddd">￥{{item.shop_price}}</view>
								<view><text class="reddd fs23">★</text><text
										class="fs23">浏览数:{{item.click_count}}</text></view>
							</view>
						</view>
						<view class="tuijian" v-if="item.is_recommend > 0">推荐</view>
					</navigator>
					<view class="videoo" v-if="video.length > 0">▶</view>
				</view>

			</view>
			<view style="text-align:center;"
				:hidden="!loadingShow || requestData.goods_list.length == 0 || !requestData">
				<image class="loading" src="https://www.yitongwang.com/public/static/images/ajaxLoader.gif"></image>
			</view>
			<van-divider v-if="!loadingShow" custom-style="margin-bottom: 5rpx;" contentPosition="center">我是有底线的
			</van-divider>
			<view class="no-data" v-if="!requestData.goods_list || requestData.goods_list.length == 0">
				<image src="../../../static/images/cart-null.png" class="cart-image" />
				<view class="no-data-title">没有相关的数据</view>
				<navigator url="/pages/index/index/index" class="lookat" open-type="switchTab"> 去逛逛 </navigator>
			</view>
		</view>
		<!-- 规格弹框  -->
		<view :hidden="!openSpecModalShow">
			<view class="cover-layer" @tap="closeSpecModal"></view>
			<view class="spec-model">
				<icon type="cancel" color="gray" size="22" class="modal-close" @tap="closeSpecModal" />
				<view class="spec-goods">
					<image mode="aspectFill" class="wh100 spec-img"
						:src="url + '/api/goods/goodsThumImages?goods_id=' + data.goods.goods_id + '&width=200&height=200'">
					</image>
					<view class="spec-goods-info">
						<view class="spec-goods-name">{{data.goods.goods_name}}</view>
						<view class="spec-goods-price">
							<text>￥</text>{{select.price[0]}}.<text>{{select.price[1]}}</text>
							<view class="spec-goods-stock">剩余库存:{{select.stock}}</view>
						</view>
					</view>
				</view>
				<block v-for="(item, listIdx) in data.goods_spec_list" :key="'gspec' + listIdx">
					<view class="spec-name">{{item.spec_name}}</view>
					<view class='spec_types'>
						<view v-for="(spec, index) in item.spec_list" :key="'spec' + listIdx + index" class="spec-btn"
							:class="{'spec-btn-click': item.selectItemId == spec.item_id}" @tap="selectSpec"
							:data-listidx="listIdx" :data-itemid="spec.item_id">{{spec.item}}
						</view>
					</view>
				</block>
				<view class='spec-box'>
					<view class="spec-name">数量</view>
					<view class="count">
						<view class="sub" @tap="subCartNum">-</view>
						<input type="number" v-model="goodsInputNum" @blur="inputCartNum" />
						<view class="add" @tap="addCartNum">+</view>
					</view>
				</view>
				<block>
					<<view :class="{'spec-cart-disable': select.stock <= 0 || shippingCost < 0 || !hasSpec}"
						class="spec-cart-btn spec-buy" data-action='buy' @tap="addCart">确定
			</view>
			</block>
		</view>
	</view>
	<!-- 筛选弹框  -->
	<view :hidden="!openFilterModalShow" @touchmove.stop="true">
		<view class="cover-layer" @tap.stop="closeFilterModal" @touchmove.stop="true"></view>
		<scroll-view scroll-y class="filter-modal" @touchmove.stop="true">
			<view class="filter-box">
				<view class="filter-name">分类筛选</view>
				<view class="filter-items">
					<view style="line-height:70rpx;" :class="flall ? 'filter-item2' : 'filter-item'" data-type="jing1"
						data-sq="2" :data-href="'id/0'" @tap="filterGoods">全部</view>
					<view
						:style="'line-height:' + item.name.length > 6 ? '32rpx' : '70rpx' + ';font-size:' + item.name.length > 11 ? '18rpx' : '26rpx'"
						:class="urlObj.id == 'id/' + item.id ? 'filter-item2' : 'filter-item'"
						v-for="(item, index) in requestData.goods_category" :key="'gcat' + index" data-type="jing1"
						:data-href="'id/' + item.id" @tap="filterGoods">
						{{item.name}}
					</view>
				</view>
			</view>

			<view class="filter-box">
				<view class="filter-name">商圈</view>
				<view class="filter-items">
					<view style="line-height:70rpx;" :class="sqall ? 'filter-item2' : 'filter-item'" data-type="jing2"
						data-sq="2" :data-href="'store_business/0'" @tap="filterGoods">全部
					</view>
					<view :style="'line-height:' + item.store_business.length > 6 ? '30rpx' : '70rpx'"
						:class="urlObj.store_business == 'store_business/' + item.id ? 'filter-item2' : 'filter-item'"
						v-for="(item,index) in requestData.business" :key="'bus' + index" data-type="jing2"
						:data-href="'store_business/' + item.id" @tap="filterGoods">
						{{item.store_business}}
					</view>
				</view>
			</view>
			<view class="filter-box">
				<view class="filter-name">适用性别</view>
				<view class="filter-items">
					<view :class="item.check ? 'filter-item2' : 'filter-item'" v-for="(item, index) in filterData.sex"
						:key="'sex' + index" :data-index="index" data-type="dong1" :data-href="item.href"
						@tap="filterGoods">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="filter-box">
				<view class="filter-name">适用年龄</view>
				<view class="filter-items">
					<view :class="item.check ? 'filter-item2' : 'filter-item'" v-for="(item, index) in filterData.age"
						:data-index="index" :key="'age' + index" data-type="dong2" :data-href="item.href"
						@tap="filterGoods">
						{{item.name}}
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="subBox">
			<view class="bbtn bbtn1" @tap="resetSearch">重置</view>
			<view class="bbtn bbtn2" @tap="searchGoods">确定</view>
		</view>
	</view>

	<!-- 返回顶部按钮  -->
	<view class="toTop" @tap="doScrollTop" v-if="supportPageScroll">
		<image class="wh100" src="../../../static/images/topup.png"></image>
	</view>

	<!-- 筛选提示遮罩层 -->
	<view class="tips-mask" :hidden="tipsmask" @touchmove.stop="true">
		<image :src="url + '/public/static/images/minniapp/goodsListMask.png'"></image>
		<view class="txt" @tap.stop="closeMask">我知道了</view>
		<view class="txt2">该提示6次后不再出现，当前已提示{{ pastSum }}次</view>
	</view>
	</view>
</template>
<script lang="wxs" module="subStr1">
	var str15 = function(str) {
		return str.substring(0, 12)
	}
	module.exports.str15 = str15
</script>
<script>
	var app = getApp();
	var request = app.request;
	import LoadMore from '../../../static/utils/LoadMore.js';
	var load = new LoadMore;
	const util = require('../../../static/utils/util.js');
	export default {
		data() {
			return {
				url: app.globalData.setting.url,
				currentPage: 1,
				requestData: null, //请求的数据
				allData: null, //第一次请求到的所有数据，用于恢复筛选数据
				openFilterModalShow: false, //打开筛选弹框
				baseUrl: '/api/goods/goodsList', //基地址
				requestUrl: '', //请求的链接
				goodsInputNum: 1, //选中的商品件数
				openSpecModalShow: false, //是否打开规格弹窗
				specSelect: 0, //选中的组合规格数组spec_goods_price下标
				data: null, //请求的商品详情数据
				supportPageScroll: false,
				select: { //选择的(规格)商品的参数，用于显示
					price: 0,
					stock: 0,
					spec_img: '',
					specName: '',
					activity: null
				},
				filterData: {},
				urlObj: {
					id: 'id/0',
					store_business: 'store_business/0',
					dong: []
				},
				isFirst: true,
				sqall: false,
				flall: false,
				tipsmask: true,
				showFavirate: false,
				pastSum: 1,
				sexAll: true,
				ageAll: true,
			}
		},
		onLoad: function(options) {
			uni.hideShareMenu()
			load.init(this, 'goods_list', 'requestData');
			var requestUrl
			if (options.cat_id) {
				requestUrl = this.baseUrl + (typeof options.cat_id != 'undefined' ? '?id=' + options.cat_id : '');
			} else {
				requestUrl = this.baseUrl + (typeof options.type != 'undefined' ? '?type=' + options.type : '');
			}
			this.requestGoodsList(requestUrl);
			if (!uni.getStorageSync('maskSum')) {
				uni.setStorageSync('maskSum', 7)
				this.tipsmask = false
			} else {
				if (uni.getStorageSync('maskSum') == 1) {
					this.tipsmask = true
				} else {
					this.tipsmask = false
					this.pastSum = 6 - uni.getStorageSync('maskSum') + 2
				}
			}
			if (uni.pageScrollTo) {
				this.supportPageScroll = true
			}
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.requestGoodsList(this.requestUrl);
			}
		},
		onPullDownRefresh: function() {
			this.resetData();
			this.requestGoodsList(this.requestUrl);
		},
		methods: {
			changeTab: function(e) {
				this.resetData();
				this.requestGoodsList(e.currentTarget.dataset.href);
			},
			requestGoodsList: function(requestUrl) {
				var that = this;
				var requestUrl = requestUrl || ''
				this.requestUrl = requestUrl
				this.loadingShow = true
				requestUrl += (requestUrl.indexOf('?') > 0 ? '&' : '?') + 'p=' + that.currentPage;
				load.request(requestUrl, function(res) {
					that.currentPage++;
					if (that.allData == null) {
						that.allData = Object.assign({}, res.data.result);
					}
					// ===抽离出属性信息 增加是否选中的flag===
					if (that.isFirst) {
						var oobj = {}
						oobj.sex = res.data.result.filter_attr[0].item.map((item, index) => {
							item.check = false
							return item
						})
						oobj.sex.unshift({
							name: '全部',
							href: 'empty1',
							check: false
						})
						oobj.age = res.data.result.filter_attr[1].item.map((item, index) => {
							item.check = false
							return item
						})
						oobj.age.unshift({
							name: '全部',
							href: 'empty2',
							check: false
						})
						that.filterData = Object.assign({}, oobj)
						that.isFirst = false
						that.loadingShow = false
					}
					uni.stopPullDownRefresh();
				});
			},
			openFilterModal: function() {
				this.openFilterModalShow = true
			},
			closeFilterModal: function() {
				this.openFilterModalShow = false
			},
			/** 商品筛选 */
			filterGoods: function(e) {
				var href = e.currentTarget.dataset.href
				var type = e.currentTarget.dataset.type
				var filterData1 = this.filterData

				var obj = this.urlObj
				if (type == 'jing1') { //判断点击的筛选项目 做不同处理
					if (e.currentTarget.dataset.sq == 2) {
						this.flall = true
					} else {
						if (href == obj.id) {
							obj.id = 'id/0'
							this.urlObj = Object.assign({}, obj)
							this.flall = true
							return
						}
						this.flall = false
					}
					obj.id = href
					this.urlObj = Object.assign({}, obj)
				} else if (type == 'jing2') {
					if (e.currentTarget.dataset.sq == 2) {
						this.sqall = true
					} else {
						if (href == obj.store_business) {
							obj.store_business = 'store_business/0'
							this.urlObj = Object.assign({}, obj)
							this.sqall = true
							return
						}
						this.sqall = false
					}
					obj.store_business = href
					this.urlObj = Object.assign({}, obj)
				} else {
					var index = obj.dong.indexOf(href)
					var index2 = e.currentTarget.dataset.index
					if (type == 'dong1') {
						if (href == 'empty1') {
							if (!filterData1.sex[0].check) {
								obj.dong = obj.dong.filter((item, index2) => {
									if (item[0] != 1) {
										return item
									}
								})
								for (let i = 0; i < filterData1.sex.length; i++) {
									filterData1.sex[i].check = false
								}
								filterData1.sex[0].check = true
							}
						} else {
							if (index == -1) {
								obj.dong.push(href)
							} else {

								obj.dong.splice(index, 1)
							}
							filterData1.sex[0].check = false
							filterData1.sex[index2].check = !filterData1.sex[index2].check
						}
					} else {
						if (href == 'empty2') {
							if (!filterData1.age[0].check) {
								obj.dong = obj.dong.filter((item, index2) => {
									if (item[0] != 2) {
										return item
									}
								})
								for (let i = 0; i < filterData1.age.length; i++) {
									filterData1.age[i].check = false
								}
								filterData1.age[0].check = true
							}
						} else {
							if (index == -1) {
								obj.dong.push(href)
							} else {

								obj.dong.splice(index, 1)
							}
							filterData1.age[0].check = false
							filterData1.age[index2].check = !filterData1.age[index2].check
						}
					}
					this.urlObj = Object.assign({}, obj)
					this.filterData = Object.assign({}, filterData1)
				}
				return
				this.resetData();
				this.requestGoodsList(e.currentTarget.dataset.href);
				this.closeFilterModal();
			},
			toSearchPage: function() {
				uni.redirectTo({
					url: '/pages/goods/search/search',
				})
			},
			resetSearch: function() {
				var filterData = this.filterData
				filterData.sex = filterData.sex.map((item, index) => {
					item.check = false
					return item
				})
				filterData.age = filterData.age.map((item, index) => {
					item.check = false
					return item
				})
				this.urlObj = Object.assign({}, {
					id: 'id/0',
					store_business: 'store_business/0',
					dong: []
				})
				this.filterData = Object.assign({}, filterData)
			},
			searchGoods: function() {
				var urlObj = this.urlObj
				var requestUrl = this.baseUrl + '/'
				requestUrl += urlObj.id + '/' + urlObj.store_business
				if (urlObj.dong.length > 0) {
					requestUrl += '/attr/'
					requestUrl += urlObj.dong.join('@')
				}
				this.resetData();
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				this.requestGoodsList(requestUrl);
				this.closeFilterModal();
			},
			/** 重置数据 */
			resetData: function() {
				load.resetConfig();
				this.requestData = null;
				this.currentPage = 1;
			},
			restoreData: function() {
				this.requestData = Object.assign({}, this.allData)
			},
			/** 初始化数据，注意顺序 */
			initData: function(data) {
				//检查商品
				this.initCheckGoods(data);
				//检查一下购物的数量，可能无库存
				this.checkCartNum(this.goodsInputNum);
			},
			/** 检查商品 */
			initCheckGoods: function(data) {
				var that = this;
				var item_id = data.spec_goods_price.length > 0 ? data.spec_goods_price[0]['item_id'] : '';
				if (that.optionItemId) {
					item_id = that.optionItemId;
				}
				request.get('/api/goods/activity', {
					data: {
						goods_id: data.goods.goods_id,
						item_id: item_id,
					},
					success: function(res) {
						//初始化规格
						if (res.data.result.goods.activity_is_on == 1) {
							data.activity = res.data.result.goods
							that.initSpecsPrice(data);
						} else {
							data.goods.prom_type = 0;
							that.initSpecsPrice(data);
						}
					}
				});
			},
			/** 初始化所有规格 */
			initSpecsPrice: function(data) {
				var specSelect = 0; //初始化选中第一个规格
				var specs = data.spec_goods_price;
				if (specs.length == 0) { //没有规格
					this.initActivity(data.activity);
					return;
				}
				//第一次请求的总数据中的activity默认是第一种规格的,可减少一次请求
				specs[0].activity = data.activity;
				if (this.optionItemId) { //指定规格
					for (var i = 0; i < specs.length; i++) {
						if (specs[i].item_id == this.optionItemId) {
							specSelect = i;
							break;
						}
					}
				} else { //初始化选库存不为0的规格
					for (var i = 0; i < specs.length; i++) {
						if (specs[i].store_count <= 0) {
							continue;
						}
						specSelect = i;
						break;
					}
				}
				//生成子规格组(goods_spec_list)的各自选中项
				var specIds = specs[specSelect].key.split("_");
				var list = data.goods_spec_list;
				for (var i = 0; i < list.length; i++) {
					for (var j = 0; j < list[i].spec_list.length; j++) {
						if (util.inArray(list[i].spec_list[j].item_id, specIds)) {
							list[i].selectItemId = list[i].spec_list[j].item_id;
							break;
						}
					}
				}
				this.specSelect = specSelect
				this.data.goods_spec_list = [...list]
				this.data.spec_goods_price = [...specs]
				this.initSelectSpecGoods();
			},
			/** 关闭规格弹窗 */
			closeSpecModal: function(e) {
				this.openSpecModalShow = false
			},
			/** 打开规格弹窗 */
			openSpecModel: function(e) {
				var that = this;
				request.get('/api/goods/goodsInfo', {
					data: {
						id: e.currentTarget.dataset.goods_id
					},
					failRollback: true,
					success: function(res) {
						that.data = Object.assign({}, res.data.result)
						that.openSpecModalShow = true
						that.isSeparate = true
						that.initData(res.data.result);
					}
				});
			},
			/** 减少购买的商品数量 */
			subCartNum: function(e) {
				this.checkCartNum(this.goodsInputNum - 1);
			},
			/** 增加购买的商品数量 */
			addCartNum: function(e) {
				this.checkCartNum(this.goodsInputNum + 1);
			},
			/** 输入购买的数量 */
			inputCartNum: function(e) {
				this.checkCartNum(Number(e.detail.value));
			},
			/** 检查购买的数量 */
			checkCartNum: function(num) {
				var stock = this.select.stock;
				if (this.data.spec_goods_price.length > 0) {
					stock = this.data.spec_goods_price[this.specSelect].store_count;
				}
				if (num > stock || stock == 0) {
					num = stock;
				} else if (num < 1) {
					num = 1;
				}
				this.goodsInputNum = num
			},
			/** 初始化选中的规格商品 */
			initSelectSpecGoods: function() {
				var specSelect = this.specSelect;
				var specs = this.data.spec_goods_price;
				var itemId = specs[specSelect].item_id;
				if (specs[specSelect].prom_type == 0) {
					var noActivity = {
						prom_type: 0
					};
					specs[specSelect].activity = noActivity;
					this.initActivity(noActivity);
				} else if (typeof specs[specSelect].activity != 'undefined') {
					this.initActivity(specs[specSelect].activity);
				} else {
					this.requestSpecInfo(specSelect);
				}
			},
			/** 请求规格商品的活动信息 */
			requestSpecInfo: function(specSelect) {
				var that = this;
				var specs = that.data.spec_goods_price;
				request.get('/api/goods/activity', {
					data: {
						goods_id: that.data.goods.goods_id,
						item_id: specs.length > 0 ? specs[specSelect].item_id : '',
					},
					success: function(res) {
						if (res.data.result.goods.activity_is_on == 1) {
							that.initActivity(res.data.result.goods);
						}
					}
				});
			},
			/** 初始化选中的（规格）商品的显示参数 */
			initSelectedData: function() {
				var goods = this.data.goods;
				var activity = this.select.activity;
				var specs = this.data.spec_goods_price;
				var specSelect = this.specSelect;
				var stock = 0;
				var price = 0;
				if (activity.prom_type == 1 || activity.prom_type == 2) {
					price = activity.shop_price;
					stock = activity.store_count;
				} else if (activity.prom_type == 3) {
					price = activity.shop_price;
					stock = activity.store_count;
				} else if (activity.prom_type == 4) {
					price = activity.shop_price;
					stock = activity.store_count;
				} else if (activity.prom_type == 8 && !this.isBragain) {
					price = activity.end_price ? activity.end_price : activity.shop_price;
					stock = activity.store_count;
					this.select.bargain_price = price;
					this.select = Object.assign({}, this.select);
				} else if (specs.length > 0) {
					price = specs[specSelect].price;
					stock = specs[specSelect].store_count;
				} else {
					price = goods.shop_price;
					stock = goods.store_count;
				}
				price = price.toString().split('.');
				this.select.price = price;
				this.select.stock = stock;
				this.select.specName = specs.length > 0 ? specs[specSelect].key_name : '';
				this.select = Object.assign({}, this.select);
				if (this.isBragain) {
					this.isBragain = false
				}
			},
			/** 点击规格按钮的回调函数 */
			selectSpec: function(e) {
				//对商品数量进行判断，对库存进行判断
				var itemId = e.currentTarget.dataset.itemid;
				var listIdx = e.currentTarget.dataset.listidx;
				var list = this.data.goods_spec_list;
				if (list[listIdx].selectItemId == itemId) {
					return;
				}
				list[listIdx].selectItemId = itemId;
				var newSpecKeys = [];
				for (var i = 0; i < list.length; i++) {
					newSpecKeys[i] = list[i].selectItemId;
				}
				//item排序,生成key
				var newSpecKeys = util.sortSize(newSpecKeys).join('_');
				var newSpecSelect = 0;
				var specs = this.data.spec_goods_price;
				for (var i = 0; i < specs.length; i++) {
					if (specs[i].key == newSpecKeys) {
						newSpecSelect = i;
						break;
					}
				}
				this.specSelect = newSpecSelect;
				this.data.goods_spec_list = [...list];
				this.data = Object.assign({}, this.data);
				this.initSelectSpecGoods();
				this.checkCartNum(this.goodsInputNum);
			},
			/** 初始化显示的活动信息 */
			initActivity: function(activity) {
				if (activity.prom_type && activity.prom_type != 6) {
					var startTime = (new Date()).getTime();
					if (activity.prom_type == 1) { //抢购
						activity.priceName = '抢购价';
						activity.countName = '限时抢购';
					} else if (activity.prom_type == 2) { //团购
						activity.priceName = '团购价';
						activity.countName = '限时团购';
					} else if (activity.prom_type == 3) { //促销
						activity.countName = '优惠促销';
					} else if (activity.prom_type == 4) { //预售
						activity.priceName = '预售价';
						activity.countName = '预售商品';
					} else if (activity.prom_type == 8) { //砍价
						!this.isBragain ? activity.priceName = '砍价享' : activity.priceName = '' 
						!this.isBragain ? activity.countName = '砍价活动' : activity.countName = ''
					}
					activity.countTime = '--天--时--分--秒';
					if (!activity.diffTime) {
						activity.diffTime = (new Date()).getTime() - activity.on_time * 1000;
					}
				} else if (activity.prom_type == 6) {
					activity.countName = '该商品正在参与拼团';
					activity.goods_id = activity.goods_id;
					activity.team_id = activity.prom_id ? activity.prom_id : 0;
					activity.item_id = activity.item_id ? activity.item_id : 0;
				}
				this.select.activity = activity;
				this.select = Object.assign({}, this.select);
				this.destroyActivityTimer();
				this.createActivityTimer();
				this.initSelectedData();
			},

			/** 检查是否倒计时是否结束 */
			checkActivityTime: function() {
				var that = this;
				var activity = that.select.activity;
				var remainTime = activity.end_time * 1000 - (new Date()).getTime() + activity.diffTime;
				if (remainTime > 0) {
					remainTime = util.remainTime(remainTime);
					this.select.activity.countTime = remainTime;
					this.select = Object.assign({}, this.select);
				} else {
					that.requestSpecInfo(that.specSelect);
					return;
				}
			},
			/** 创建活动倒计时定时器 */
			createActivityTimer: function() {
				var that = this;
				var activity = that.select.activity;
				if (!activity.prom_type || activity.prom_type == 6 || that.isBragain) {
					return;
				}
				that.timer = setInterval(function() {
					that.checkActivityTime();
				}, 1000);
			},
			/** 销毁活动倒计时定时器 */
			destroyActivityTimer: function() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			/** 购买虚拟商品 */
			buyVirtualGoods: function(data) {
				//检查用户是否登录方可操作立即购买
				if (!app.auth.isAuth()) {
					app.showLoading(null, 1500);
					app.getUserInfo();
					return;
				}
				Object.assign(data, {
					goods_name: this.data.goods.goods_name,
					spec_name: this.select.specName,
					price: this.select.price,
				});
				uni.navigateTo({
					url: '/pages/virtual/buy_step/buy_step?' + util.Obj2Str(data)
				});
			},
			/** 加入购物车 */
			addCart: function(e) {
				var that = this;
				var itemId = 0;
				var specs = this.data.spec_goods_price;
				//区分有规格和无规格
				if (specs.length > 0) {
					if (specs[this.specSelect].store_count <= 0) {
						return app.showWarning("库存已为空！");
					}
					itemId = specs[this.specSelect].item_id;
				} else {
					if (this.data.goods.store_count <= 0) {
						return app.showWarning("库存已为空！");
					}
				}
				if (this.goodsInputNum <= 0) {
					return app.showWarning("商品数量不能为0");
				}
				var data = {
					goods_id: this.data.goods.goods_id,
					goods_num: this.goodsInputNum,
					item_id: itemId,
					form: 1
				};
				if (this.data.goods.is_virtual) {
					return this.buyVirtualGoods(data);
				}
				//检查用户是否登录方可操作立即购买
				if (!app.auth.isAuth()) {
					app.showLoading(null, 1500);
					app.getUserInfo();
					return;
				}
				if (e.currentTarget.dataset.action == 'add') { //加入购物车
					if (this.shippingCost < 0 || this.select.stock <= 0) {
						return;
					}
					request.post('/api/cart/addCart', {
						data: data,
						success: function(res) {
							uni.showModal({
								title: '添加成功！',
								cancelText: '去购物车',
								confirmText: '再逛逛',
								success: function(res) {
									if (res.cancel) {
										uni.reLaunch({
											url: '/pages/cart/cart/cart'
										});
									} else {
										that.requestCardNum();
									}
								}
							});
						}
					});
				} else if (e.currentTarget.dataset.action == 'exchange') { //立即兑换
					this.exchange(data);
				} else { //立即购买
					this.buyNow(data);
				}
			},
			/** 立即购买 */
			buyNow: function(data) {
				//检查用户是否登录方可操作立即购买
				if (!app.auth.isAuth()) {
					app.showLoading(null, 1500);
					app.getUserInfo();
					return;
				}
				if (this.shippingCost < 0 || this.select.stock <= 0) {
					return;
				}
				Object.assign(data, {
					action: 'buy_now',
				});
				uni.navigateTo({
					url: '/pages/cart/cart2/cart2?' + util.Obj2Str(data)
				});
			},
			closeMask: function() {
				this.tipsmask = true
				if (uni.getStorageSync('maskSum')) { //判断本地有无数量设置过
					var maskSum = uni.getStorageSync('maskSum') - 1
					uni.setStorageSync('maskSum', maskSum)
				} else {
					uni.setStorageSync('maskSum', 5)
				}
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

<style scoped src="./goodsList.css">

</style>
