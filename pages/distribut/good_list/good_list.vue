<template>
	<view>
		<view class='container'>
			<view class="search-bar">
				<form @submit="submitSearch">
					<input class="search-input" :value='keyword' placeholder="输入商品名称" name="word" auto-focus></input>
					<button class="search-btn" form-type="submit">
						<image class="wh100 search-img" src="../../../static/images/sea.png"></image>
					</button>
				</form>
			</view>
			<view class="nav">
				<view :class="sort == 'goods_id' || sort == '' ? 'nav-item red' : 'nav-item'" @tap="changeTab"
					data-type="1">综合</view>
				<view :class="sort == 'is_new' ? 'nav-item red' : 'nav-item'" @tap="changeTab" data-type="2">新品</view>
				<view :class="sort == 'sales_sum' ? 'nav-item red' : 'nav-item'" @tap="changeTab" data-type="3">销量
				</view>
				<view :class="sort == 'distribut' ? 'nav-item red' : 'nav-item'" @tap="changeTab" data-type="4">佣金
					<view :class="'ico-dir ' + sort != 'distribut' ? '' : (desc == 'asc' ? 'ico-dir-up' : 'ico-dir-dn')"
						:style="'background-image: url(' + resourceUrl + '/static/images/sxjt.png)'"></view>
				</view>
				<view class="nav-item" @tap="openFilterModal">筛选<view class="ico-filter">
						<image class="wh100" src="../../../static/images/xx.png"></image>
					</view>
				</view>
			</view>
			<view class='disgoods-list'>
				<view class="choice_item" v-for="(item, index) in goods" :key="'goods' + index">
					<view class='goods-check'>
						<checkbox :checked='item.selected' @tap='selectGoods' :data-id='item.goods_id'></checkbox>
					</view>
					<view class="img-wrap">
						<image @tap='goodsDetail' :data-id='item.goods_id'
							:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id +'&width=200&height=200'">
						</image>
					</view>
					<view class="item-cont">
						<view class="title" @tap='goodsDetail' :data-id='item.goods_id'>{{item.goods_name}}</view>
						<view class="price">分成金额：{{item.distribut}}</view>
						<view class="comment">￥{{item.shop_price}}</view>
					</view>
				</view>
			</view>
			<view class="no-data" v-if="!goods || goods.length == 0">
				<image src="../../../static/images/cart-null.png" class="cart-image" />
				<view class="no-data-title">没有相关的数据</view>
			</view>
			<view class='distri-bot'>
				<view class='bot-left'>
					<checkbox class='check-all' :checked='checkAllToggle' @tap='checkAll'></checkbox>
					<label>全选</label>
				</view>
				<view class='bot-right' @tap='addGoods'>
					<button>添加</button>
				</view>
			</view>
		</view>

		<!-- 筛选弹框  -->
		<view>
			<view class="cover-layer" @tap="closeFilterModal" :hidden='!openFilter'></view>
			<view class="filter-modal" :hidden='!openFilter'>
				<icon type="cancel" color="gray" size="22" class="modal-close" @tap="closeFilterModal" />
				<view class='all-classification'>
					<view class='allcla-btn' @tap='categoryTap'>全部分类</view>
					<view :hidden='!categoryShow' class='claitem-box' v-for="(item, index) in categoryList"
						:key="'cat' + index">
						<view class='cla-item' @tap='checkCategory' :data-id='item.id'>{{item.name}}</view>
					</view>
				</view>
				<view class='all-brand'>
					<view class='allbra-btn' @tap='brandTap'>全部品牌</view>
					<view :hidden='!brandShow' class='braitem-box' v-for="(item, index) in brandList"
						:key="'brand' + index">
						<view class='bra-item' @tap='checkBrand' :data-id='item.id'>{{item.name}}</view>
					</view>
				</view>
			</view>
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
				resourceUrl: app.globalData.setting.resourceUrl,
				currentPage: 1,
				openFilter: false, //是否打开筛选弹框
				baseUrl: '/api/Distribut/goods_list', //基地址
				requestUrl: '', //请求的链接
				desc: 'asc', //佣金排序
				goods: null,
				checkAllToggle: false, //全选标志
				hasshop: true, //是否已经开店
				brandList: null, //全部品牌
				categoryList: null, //全部分类
				categoryShow: false,
				brandShow: false,
				keyword: '',
				sort: '',
			}
		},
		onLoad: function(options) {
			load.init(this, '', 'goods');
			var requestUrl = this.baseUrl + '?sort=goods_id';
			this.requestGoodsList(requestUrl);
			this.requestCat();
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.requestGoodsList(this.requestUrl);
				this.dealGoods();
				this.checkAllToggle = false;
			}
		},
		onPullDownRefresh: function() {
			this.resetData();
			this.requestGoodsList(this.requestUrl);
			this.checkAllToggle = false;
		},
		methods: {
			requestCat: function() {
				var that = this;
				request.get('/api/Distribut/goods_types', {
					success: function(res) {
						that.brandList = [...res.data.result.brandList];
						that.categoryList = [...res.data.result.categoryList];
					}
				});
			},
			categoryTap: function() {
				this.categoryShow = !this.categoryShow;
			},
			brandTap: function() {
				this.brandShow = !this.brandShow;
			},
			checkCategory: function(e) {
				var id = e.currentTarget.dataset.id;
				var url = this.baseUrl + '?cat_id=' + id;
				this.resetData();
				this.requestGoodsList(url);
				this.closeFilterModal();
			},
			checkBrand: function(e) {
				var id = e.currentTarget.dataset.id;
				var url = this.baseUrl + '?brand_id=' + id;
				this.resetData();
				this.requestGoodsList(url);
				this.closeFilterModal();
			},
			changeTab: function(e) {
				var type = e.currentTarget.dataset.type;
				var url;
				var sort;
				if (type == 1) { //综合
					sort = 'goods_id';
					this.sort = sort;
					url = this.baseUrl + '?sort=' + sort;
				} else if (type == 2) { //新品
					sort = 'is_new';
					this.sort = sort;
					url = this.baseUrl + '?sort=' + sort;
				} else if (type == 3) { //销量
					sort = 'sales_sum';
					this.sort = sort;
					url = this.baseUrl + '?sort=' + sort;
				} else { //佣金
					sort = 'distribut';
					this.sort = sort;
					if (this.desc == 'asc') {
						this.desc = 'desc';
						url = this.baseUrl + '?sort=' + sort + '&sort_asc=' + this.desc;
					} else {
						this.desc = 'asc';
						url = this.baseUrl + '?sort=' + sort + '&sort_asc=' + this.desc;
					}
				}
				this.keyword = '';
				this.resetData();
				this.requestGoodsList(url);
			},
			requestGoodsList: function(requestUrl) {
				var that = this;
				this.requestUrl = requestUrl;
				requestUrl += (requestUrl.indexOf('?') > 0 ? '&' : '?') + 'p=' + that.currentPage;
				load.request(requestUrl, function(res) {
					that.currentPage++;
					wx.stopPullDownRefresh();
				});
			},
			/** 提交搜索事件 */
			submitSearch: function(e) {
				var word = e.detail.value.word;
				if (typeof word != 'string' || word == '') {
					return app.showWarning('请输入关键词');
				}
				this.keyword = word;
				this.resetData();
				var url = this.baseUrl + '?key_word=' + word;
				this.requestGoodsList(url);
			},
			openFilterModal: function() {
				this.openFilter = true;
			},
			closeFilterModal: function() {
				this.openFilter = false;
			},
			/** 商品筛选 */
			filterGoods: function(e) {
				this.resetData();
				this.requestGoodsList(e.currentTarget.dataset.href);
				this.closeFilterModal();
			},
			/** 重置数据 */
			resetData: function() {
				load.resetConfig();
				this.goods = null;
				this.currentPage = 1;
			},
			dealGoods: function() {
				var goodList = [];
				var goods = this.goods;
				for (var i = 0; i < goods.length; i++) {
					goodList.push({
						goods_id: goods[i].goods_id,
						goods_name: goods[i].goods_name,
						selected: false,
						distribut: goods[i].distribut,
						shop_price: goods[i].shop_price,
					})
				}
				this.goods = [...goodList];
			},
			//全选
			checkAll: function() {
				var checkAll = !this.checkAllToggle;
				var goodList = [];
				var goods = this.goods;
				if (goods == null || goods.length <= 0) {
					return;
				}
				for (var i = 0; i < goods.length; i++) {
					goodList.push({
						goods_id: goods[i].goods_id,
						goods_name: goods[i].goods_name,
						selected: checkAll,
						distribut: goods[i].distribut,
						shop_price: goods[i].shop_price,
					})
				}
				this.goods = [...goodList];
				this.checkAllToggle = checkAll;
			},
			/** 选择单一商品 */
			selectGoods: function(e) {
				var id = e.currentTarget.dataset.id;
				var goodList = this.goods;
				for (var i = 0; i < goodList.length; i++) {
					if (id == goodList[i].goods_id) {
						goodList[i].selected = !goodList[i].selected;
					}
				}
				var checkAll = true;
				for (var j = 0; j < goodList.length; j++) {
					if (!goodList[j].selected) {
						checkAll = false;
					}
				}
				this.checkAllToggle = checkAll;
				this.goods = [...goodList];
			},
			addGoods: function() {
				var that = this;
				var ids = [];
				var goodList = this.goods;
				for (var i = 0; i < goodList.length; i++) {
					if (goodList[i].selected) {
						ids.push(goodList[i].goods_id);
					}
				}
				if (!that.hasshop) {
					app.showWarning("您还没有开店!");
					return;
				}
				if (ids.length <= 0) {
					app.showWarning("没有选中商品");
					return;
				}
				request.post('/api/Distribut/add_goods', {
					data: {
						goods_ids: ids,
						terminal: "app"
					},
					success: function(res) {
						that.onPullDownRefresh();
					}
				});
			},
			goodsDetail: function(e) {
				var goodsId = e.currentTarget.dataset.id;
				wx.navigateTo({
					url: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + goodsId,
				});
			},
		}
	}
</script>

<style scoped src="./good_list.css">

</style>
