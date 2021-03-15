<template>
	<view>
		<view class="container">
			<view class="nav">
				<view class="nav-item" :class="{'red-on': requestUrl == requestData.orderby_default}" @tap="changeTab"
					:data-href="requestData.orderby_default">综合<view class="ico-dg">
						<image class="wh100" src="../../../static/images/dg.png"></image>
					</view>
				</view>
				<view class="nav-item" :class="{'red-on': requestUrl == requestData.orderby_sales_sum}" @tap="changeTab"
					:data-href='requestData.orderby_sales_sum'>销量</view>
				<view class="nav-item" :class="{'red-on': requestData.sort!='shop_price'}" @tap="changeTab"
					:data-href='requestData.orderby_price'>价格
					<view
						:class="'ico-dir' + requestData.sort != 'shop_price' ? '' : (requestData.sort_asc == 'asc' ? ' ico-dir-up' : ' ico-dir-dn')}}"
						:style="'background-image: url(' + resourceUrl+'/static/images/sxjt.png)'"></view>
				</view>
				<view class="nav-item" @tap="changeTab" @tap="openFilterModal">筛选<view class="ico-filter">
						<image class="wh100" src="../../../static/images/xx.png"></image>
					</view>
				</view>
				<view class="nav-item nav-search" @tap="openSearchModal">
					<image class="wh100 search-img"
						src="https://www.yitongwang.com/template/pc/rainbow/static/images/store_search_fdj.png"></image>
				</view>
			</view>

			<view class="choice_list">
				<view class="listitem" v-for="(item, index)in requestData.goods_list" :key="'glist' + index"
					:style="'padding-bottom:' + item.is_recommend > 0 ? '30rpx' : '0'">
					<navigator class="choice_item" :url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id"
						hover-class="none">
						<view class="img-wrap">
							<image
								:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id + '&width=400&height=400'"
								mode="scaleToFill"></image>
							<text :hidden="!item.activity.prom_title"
								class="Seconds_kill">{{item.activity.prom_title}}</text>
						</view>
						<view class="item-cont">
							<view class="title2">{{item.goods_name}}</view>
							<view class="price">
								<view class="reddd">￥{{item.shop_price}}</view>
								<view class="addToFavirate" :data-id="item.goods_id" @tap.stop="addToFavirate"><text
										class="reddd fs23"><text style="font-size:22rpx;"
											class="icon iconfont icon-icon-"></text></text><text
										class="fs23">评论{{item.comment_count}}
										销量{{(item.sales_sum * 1 + item.virtual_sales_sum)>0?(item.sales_sum * 1 + item.virtual_sales_sum):0}}</text>
								</view>
							</view>
						</view>
					</navigator>
					<view class="videoo" v-if="video.length > 0">▶</view>
				</view>
			</view>

			<view class="no-data" v-if="!requestData.goods_list || requestData.goods_list.length == 0">
				<image src="../../../static/images/cart-null.png" class="cart-image" />
				<view class="no-data-title">没有相关的数据</view>
				<navigator url="/pages/index/index/index" class="lookat" open-type="switchTab"> 去逛逛 </navigator>
			</view>
		</view>
		<!-- 规格弹框  -->
		<view :hidden="!openSpecModal">
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
				<block v-for="{{data.goods_spec_list}}" wx:key="index" v-for-index="listIdx">
					<view class="spec-name">{{item.spec_name}}</view>
					<view class='spec_types'>
						<view v-for="{{item.spec_list}}" v-for-item='spec' wx:key="index"
							class="spec-btn {{item.selectItemId==spec.item_id?'spec-btn-click':''}}" @tap="selectSpec"
							data-listidx="{{listIdx}}" data-itemid="{{spec.item_id}}">{{spec.item}}</view>
					</view>
				</block>
				<view class='spec-box'>
					<view class="spec-name">数量</view>
					<view class="count">
						<view class="sub" @tap="subCartNum">-</view>
						<input type="number" value="{{goodsInputNum}}" bindblur="inputCartNum" />
						<view class="add" @tap="addCartNum">+</view>
					</view>
				</view>

				<block>
					<view
						class="spec-cart-btn spec-buy {{select.stock<=0||shippingCost<0||!hasSpec?'spec-cart-disable':''}}"
						data-action='buy' @tap="addCart">确定</view>
				</block>
			</view>
		</view>
		<!-- 筛选弹框  -->
		<view hidden="{{!openFilterModalShow}}">
			<view class="cover-layer" @tap="closeFilterModal"></view>
			<view class="filter-modal">
				<icon type="cancel" color="gray" size="22" class="modal-close" @tap="closeFilterModal" />
				<button class="viewall-btn" @tap="restoreData">显示全部分类</button>
				<view class="filter-box" v-for="{{requestData.filter_spec}}" :key="'spec' + index">
					<view class="filter-name">{{item.name}}</view>
					<view class="filter-items">
						<view class="filter-item" v-for="{{item.item}}" wx:key="index" data-href="{{item.href}}"
							@tap="filterGoods">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="filter-box" v-for="(item, index) in requestData.filter_attr" :key="'attr' + index">
					<view class="filter-name">{{item.name}}</view>
					<view class="filter-items">
						<view class="filter-item" v-for="(item1, index1) in item.item}}" :key="'item' + index + index1"
							:data-href="item1.href" @tap="filterGoods">
							{{item1.name}}
						</view>
					</view>
				</view>
				<view class="filter-box" v-if="requestData.filter_brand.length > 0">
					<view class="filter-name">相关品牌</view>
					<view class="filter-items">
						<view class="filter-item" v-for="(item, index) in requestData.filter_brand"
							:key="'brand' + index" :data-href="item.href" @tap="filterGoods">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="filter-box" v-if="requestData.filter_price.length > 0">
					<view class="filter-name">价格区间</view>
					<view class="filter-items">
						<view class="filter-item" v-for="(item, index) in requestData.filter_price"
							:key="'price' + index" :data-href="item.href" @tap="filterGoods">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 搜索弹框 -->
		<view v-if="openSearchModalShow">
			<view class="search-modal">
				<view class="search-type-box">
					<text @tap.stop="searchGoods" :class="{searchCurrent: placehoderTxt=='搜索商品', }">搜索商品</text>
					<text v-if="is_apply!=1" @tap.stop="searchStore"
						:class="{searchCurrent: placehoderTxt=='搜索店铺'}">搜索店铺</text>
				</view>
				<view class="search-bar">
					<view class='fdj'>
						<image src='../../../static/images/search.png'></image>
					</view>
					<input class="search-input" :placeholder="placehoderTxt" v-model="searchValue" name="word"
						auto-focus></input>
					<button class="search-btn" @tap.stop="search">
						搜索
					</button>
					<!-- </form> -->
				</view>
				<view class="search-hot">
					<view class="hot-title">
						<image src="https://www.yitongwang.com/public/static/images/minniapp/search-hot.png"></image>
					</view>
					<view class="hot-row">
						<view class="hot-item" v-for="(item, index) in hotWords" :key="'hot' + index"
							@tap="searchHotWord" :data-word="item" v-if="item">{{item}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	import LoadMore from '../../../static/utils/LoadMore.js';
	const util = require('../../../static/utils/util.js');
	var load = new LoadMore;
	var request = app.request;
	export default {
		data() {
			return {
				is_apply: app.globalData.is_apply,
				url: app.globalData.setting.url,
				resourceUrl: app.globalData.setting.resourceUrl,
				currentPage: 1,
				requestData: null, //请求的数据
				allData: null, //第一次请求到的所有数据，用于恢复筛选数据
				openFilterModalShow: false, //打开筛选弹框
				openSearchModalShow: false, //打开搜索界面
				hotWords: ['手机', '小米', 'iphone', '三星', '华为', '冰箱'], //搜索热词
				baseUrl: '/api/goods/search', //基地址
				requestUrl: '', //请求的链接
				goodsInputNum: 1, //选中的商品件数
				openSpecModal: false, //是否打开规格弹窗
				specSelect: 0, //选中的组合规格数组spec_goods_price下标
				data: null, //请求的商品详情数据
				select: { //选择的(规格)商品的参数，用于显示
					price: 0,
					stock: 0,
					spec_img: '',
					specName: '',
					activity: null
				},
				placehoderTxt: "搜索商品",
				is_apply: 0, //是否在审核
				searchValue: '',
			}
		},
		onLoad: function(options) {
			var that = this;
			this.hotWords = uni.getStorageSync('hot_keywords');
			this.is_apply = app.globalData.is_apply;
			load.init(this, 'goods_list', 'requestData');
			if (typeof options.brand_id != 'undefined') {
				return this.requestSearch(this.baseUrl + '?brand_id=' + options.brand_id);
			}
			this.openSearchModal();
		},
		onReachBottom: function() {
			if (this.openSearchModalShow) {
				return;
			}
			if (load.canloadMore()) {
				this.requestSearch(this.requestUrl);
			}
		},
		methods: {
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
				this.data.goods_spec_list = list
				this.data.spec_goods_price = specs
				this.data = Object.assign({}, this.data)
				this.initSelectSpecGoods();
			},
			/** 关闭规格弹窗 */
			closeSpecModal: function(e) {
				this.openSpecModal = false
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
						that.openSpecModal = true
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
				} else if (specs.length > 0) {
					price = specs[specSelect].price;
					stock = specs[specSelect].store_count;
				} else {
					price = goods.shop_price;
					stock = goods.store_count;
				}
				price = price.toString().split('.');
				this.select.price = price;
				this.select = stock = stock;
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
				this.data.goods_spec_list = list;
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
						!this.isBragain ? activity.priceName = '砍价享' : activity.priceName = ''!this.isBragain ? 
							activity.countName = '砍价活动' : activity.countName = ''
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
					that.select.activity.countTime = remainTime;
					that.select = Object.assign({}, that.select);
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
			//删除搜索记录
			deleteSearch: function(e) {
				var that = this;
				request.post('/api/goods/deleteSearch', {
					success: function(res) {
						that.searchlist = [...res.data.result]
					}
				});
			},
			changeTab: function(e) {
				this.resetData();
				this.requestSearch(e.currentTarget.dataset.href);
			},
			requestSearch: function(requestUrl) {
				var that = this;
				this.requestUrl = requestUrl; //保存链接
				requestUrl += (requestUrl.indexOf('?') > 0 ? '&' : '?') + 'p=' + that.currentPage;
				load.request(requestUrl, function(res) {
					that.currentPage++;
					if (that.allData == null) {
						that.allData = Object.assign({}, res.data.result);
					}
					that.closeSearchModal();
				});
			},
			openFilterModal: function() {
				this.openFilterModalShow = true;
			},
			closeFilterModal: function() {
				this.openFilterModalShow = false
			},
			/** 商品筛选 */
			filterGoods: function(e) {
				this.resetData();
				this.requestSearch(e.currentTarget.dataset.href);
				this.closeFilterModal();
			},
			/** 重置数据 */
			resetData: function() {
				load.resetConfig();
				this.requestData = null;
				this.currentPage = 1;
			},
			/** 恢复数据 */
			restoreData: function() {
				this.requestData = Object.assign({}, this.allData);
			},
			openSearchModal: function() {
				this.openSearchModalShow = true
			},
			closeSearchModal: function() {
				this.openSearchModalShow = false
			},
			/** 提交搜索事件 */
			submitSearch: function(e) {
				this.search(e.detail.value.word);
			},
			/** 点击搜索热词事件 */
			searchHotWord: function(e) {
				this.searchValue = e.currentTarget.dataset.word;
				this.search(e.currentTarget.dataset.word);
			},
			/** 对搜索词进行搜索 */
			search: function(word) {
				if (this.placehoderTxt == '搜索店铺') {
					if (this.searchValue.trim() == '') {
						return uni.showToast({
							title: '请输入有效搜索关键字',
							icon: 'none'
						})
					}
					uni.navigateTo({
						url: '/pages/index/dk/dk?key_word=' + this.searchValue.trim(),
					})
					return
				}
				if (typeof this.searchValue != 'string' || this.searchValue == '') {
					return app.showWarning('请输入搜索关键词');
				}
				this.resetData();
				this.requestSearch(this.baseUrl + '?q=' + this.searchValue + '&is_addsearch=' + 1);
			},
			searchGoods: function() {
				this.placehoderTxt = "搜索商品"
			},
			searchStore: function() {
				this.placehoderTxt = "搜索店铺"
			},
			/** 请求店铺数据 */
			requrstStores: function() {
				// var that = this;
				// var params = util.Obj2Str({
				//     page: 1,
				//     pageSize: 15,
				//     key_word: '06'
				// });
				// load.request('/api/index/store_street?' + params, function (res) {
				//     console.log(res)
				// });
			},
		}
	}
</script>

<style scoped src="./search.css">

</style>
