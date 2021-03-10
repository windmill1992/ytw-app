<template>
	<view>
		<view class="container" v-if="carts.storeList.length > 0">
			<view class="login-in">
				<view class="store-list" v-for="(item, sidx) in carts.storeList" :key="'store' + sidx">
					<view class="store-mes">
						<view class="go-store">
							<view @tap="selectStore" :data-sidx='sidx' class="choosebox storebox">
								<image v-if="item.selected" src="../../../static/images/ischeck.png"></image>
								<image v-else src="../../../static/images/nocheck.png"></image>
							</view>
							<view class="store-ico">
								<image class="wh100" src="../../../static/images/carnew.png"></image>
							</view>
							<navigator class="store-name" :url="'/pages/store/index/index?store_id=' + item.store_id">
								{{item.store_name}}
							</navigator>
						</view>
					</view>
					<view class="order-item" v-for="(item1, cidx) in item.cartList" :key="'cart' + cidx">
						<view class="goods-ico" @tap="selectGoods" data-check="item.selected" :data-sidx="sidx"
							:data-cidx="cidx">
							<view @tap="selectGoods" :data-cidx="cidx" class="choosebox storebox">
								<image v-if="item.selected" src="../../../static/images/ischeck.png"></image>
								<image v-else src="../../../static/images/nocheck.png"></image>
							</view>
						</view>
						<navigator class="goods-img"
							:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id">
							<image class="wh100"
								:src="url + '/api/goods/goodsThumImagesForCart?goods_id=' + item.goods_id + '&width=200&height=200&item_id=' + item.item_id">
							</image>
						</navigator>
						<view class="goods-cont">
							<navigator class="goods-name ellipsis-2"
								:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id">{{item.goods_name}}
							</navigator>
							<view class="goods-attribute">{{m1.brSpec(item.spec_key_name,'a')}}</view>
							<view class="goods-attribute">{{m1.brSpec(item.spec_key_name,'b')}}</view>
							<view class="goods-price"><text class="co-red">￥{{item.member_goods_price}}</text><text
									class="market">￥{{item.market_price}}</text></view>
							<view class="btn-del" @tap="deleteItem" :data-sidx="sidx" :data-cidx="cidx">
								<image class="wh100" src="../../../static/images/dele.png"></image>
							</view>
							<view class="count">
								<view class="sub" @tap="subNum" :data-sidx="sidx" :data-cidx="cidx">一</view>
								<input type="number" :value="item.goods_num" :data-sidx="sidx" :data-cidx="cidx"
									@blur="valueToNum" />
								<view class="add" @tap="addNum" :data-sidx="sidx" :data-cidx="cidx">+</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="pay-for" :style="'bottom:' + isiphoneX == true ? '147rpx' : '100rpx'">
				<label class="checkbox" @tap="selectAll">
					<view class="choosebox allbox">
						<image v-if="checkAllToggle" src="../../../static/images/ischeck.png"></image>
						<image v-else src="../../../static/images/nocheck.png"></image>
					</view>
					全选
				</label>
				<button class="pay-btn" @tap="checkout">立即购买</button>
				<view class="consumer">
					<view class="total">总计 : <text class="co-red">{{carts.total_price.total_fee}}</text></view>
					<text class="tips">不包含运费</text>
				</view>
			</view>
		</view>

		<view class="no-data" v-else>

			<image src="https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/cart-null_1.png"
				class="shopcar-image" />
			<view class="no-word">你的购物车空空如也~</view>
			<view class="lookbtn" @tap.stop="gohome"> 去逛逛 </view>
		</view>

		<!-- 底部菜单 -->
		<footbar :page="menu_index" :menu_model="menu_model" :url="url" :defaultMenu="defaultMenu"
			:is_store_member="is_store_member" :isiphoneX="isiphoneX" :topages="topages"></footbar>
	</view>
</template>

<script lang="wxs" module="m1">
	var brSpec = function(str, t) {
		var str = str + ''
		if (t == 'a') {
			return str.split(' ')[0] || ''
		} else {
			return str.split(' ')[1] || ''
		}
	}
	module.exports.brSpec = brSpec
</script>
<script>
	import footbar from '../../components/index_footbar/indexFootBar';
	var app = getApp();
	var request = app.request;
	var common = require('../../../static/utils/common.js');
	export default {
		comments: {
			footbar
		},
		data() {
			return {
				url: app.globalData.setting.url,
				carts: null,
				checkAllToggle: false, //全选标志
				defaultMenu: false, //默认底部菜单显示状态
				isiphoneX: uni.getStorageSync('isiphoneX') || false,
				is_store_member: false
			}
		},
		onLoad: function() {
			var is_store_member = uni.getStorageSync('app:userInfo').is_store_member || 0
			if (is_store_member > 0) {
				this.is_store_member = true;
			}
		}
		/** 返回的时候刷新 */
		onShow: function() {
			this.getCardList();
			if (app.globalData.menu_model.length == 0) {
				app.globalData.menu_index = 3
			} else {
				//遍历自定义底部，该页面在哪个位置
				for (var i in app.globalData.menu_model) {
					if (app.globalData.menu_model[i].app_url.indexOf('Cart') != -1) {
						app.globalData.menu_index = i;
					}
				}
			}
			this.defaultMenu = app.globalData.defaultMenu;
			this.menu_index = app.globalData.menu_index;
			this.menu_model = [...app.globalData.menu_model];
		},
		onPullDownRefresh: function(e) {
			this.getCardList();
		},
		methods: {
			gohome: function() {
				uni.switchTab({
					url: '/pages/index/index/index',
				})
			},
			/** 跳转模式 自定义页面 || 自定义菜单 || 自定义控件控件*/
			topage: function(e) {
				//自定义菜单
				var idx = e.currentTarget.dataset.idx;
				app.globalData.menu_index = idx;
				var page_type = this.menu_model[idx].url_type
				var id = this.menu_model[idx].app_url
				//判断跳转的类型  0 = 外部网址,1 = 小程序页面，2 = 分类商品，3 = 商品详情 ，4 = 自定义页面
				if (page_type == 1) {
					//要访问的页面idx，当前页面menu_index
					common.totabar(idx, this.menu_index, this.menu_model);
				} else if (page_type == 2) {
					uni.navigateTo({
						url: '/pages/goods/goodsList/goodsList?cat_id=' + id
					});
				} else if (page_type == 3) {
					uni.navigateTo({
						url: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + id
					});
				} else if (page_type == 0) {
					this.webUrl = id;
					uni.navigateTo({
						url: '/pages/index/webview/webview'
					});
				} else {
					uni.reLaunch({
						url: '../../index/customPage/customPage?id=' + this.menu_model[idx].app_url,
					})
				}
			},
			/** 默认菜单 */
			topages: function(e) {
				var idx = e.detail.idx;
				if (idx == 2) {
					if (!uni.getStorageSync('wx_user_info')) {
						app.getUserInfo(function(userInfo) {
							that.userInfo = Object.assign({}, userInfo);
							that.click = false;
						}, true, false);
						return false;
					}
				}
				app.globalData.menu_index = idx;
				common.defaultTotabar(idx, 3);
			},
			/** 删除一商品 */
			deleteItem: function(e) {
				var that = this;
				uni.showModal({
					title: '确定删除',
					success: function(res) {
						if (!res.confirm) {
							return;
						}
						var sidx = e.currentTarget.dataset.sidx;
						var cidx = e.currentTarget.dataset.cidx;
						var id = that.carts.storeList[sidx].cartList[cidx].id;
						request.post('/api/cart/delCart?ids=' + id, {
							success: function(res) {
								that.getCardList();
							}
						});
					}
				})
			},
			/** 输入购买数量 */
			valueToNum: function(e) {
				var goodsNum;
				var sidx = e.currentTarget.dataset.sidx;
				var cidx = e.currentTarget.dataset.cidx;
				var cart = this.carts.storeList[sidx].cartList[cidx];
				if (isNaN(e.detail.value) || e.detail.value < 1) {
					goodsNum = 1;
				} else {
					goodsNum = parseInt(e.detail.value);
				}
				if (goodsNum > cart.store_count) {
					goodsNum = cart.store_count;
				}
				if (cart.goods_num == goodsNum) {
					return;
				}
				var postData = JSON.stringify([{
					goodsNum: goodsNum,
					selected: cart.selected,
					cartID: cart.id,
				}]);
				this.postCardList(postData);
			},
			/** 数量加1 */
			addNum: function(e) {
				var sidx = e.currentTarget.dataset.sidx;
				var cidx = e.currentTarget.dataset.cidx;
				var cart = this.carts.storeList[sidx].cartList[cidx];
				if (cart.goods_num >= cart.store_count) {
					return;
				}
				var postData = JSON.stringify([{
					goodsNum: cart.goods_num + 1,
					selected: cart.selected,
					cartID: cart.id,
				}]);
				this.postCardList(postData);
			},
			/** 数量减1 */
			subNum: function(e) {
				var sidx = e.currentTarget.dataset.sidx;
				var cidx = e.currentTarget.dataset.cidx;
				var cart = this.carts.storeList[sidx].cartList[cidx];
				if (cart.goods_num == 1) {
					return;
				}
				var postData = JSON.stringify([{
					goodsNum: cart.goods_num - 1,
					selected: cart.selected,
					cartID: cart.id,
				}]);
				this.postCardList(postData);
			},
			/** 选择所有商品 */
			selectAll: function() {
				var checkAll = !this.checkAllToggle;
				var postCardList = [];
				var storeList = this.carts.storeList;
				for (var i = 0; i < storeList.length; i++) {
					for (var j = 0; j < storeList[i].cartList.length; j++) {
						postCardList.push({
							goodsNum: storeList[i].cartList[j].goods_num,
							selected: checkAll,
							cartID: storeList[i].cartList[j].id,
						})
					}
				}
				var postData = JSON.stringify(postCardList);
				this.postCardList(postData);
			},
			/** 选择单一商品 */
			selectGoods: function(e) {
				var sidx = e.currentTarget.dataset.sidx;
				var cidx = e.currentTarget.dataset.cidx;
				var cart = this.carts.storeList[sidx].cartList[cidx];
				var postData = JSON.stringify([{
					goodsNum: cart.goods_num,
					selected: Number(!cart.selected),
					cartID: cart.id,
				}]);
				this.postCardList(postData);
			},
			/** 选择一店铺下所有商品 */
			selectStore: function(e) {
				var sidx = e.currentTarget.dataset.sidx;
				var store = this.data.carts.storeList[sidx];
				var postData = [];
				for (var i = 0; i < store.cartList.length; i++) {
					postData.push({
						goodsNum: store.cartList[i].goods_num,
						selected: Number(!store.selected),
						cartID: store.cartList[i].id,
					});
				}
				this.postCardList(JSON.stringify(postData));
			},
			/** 对获取的数据进行选择检查 */
			doCheckAll: function(data) {
				var storeList = data.storeList;
				if (!storeList || !storeList.length) {
					this.carts = null;
					this.checkAllToggle = false;
					return;
				}
				var checkAllToggle = true;
				for (var i = 0; i < storeList.length; i++) {
					storeList[i].selected = true;
					for (var j = 0; j < storeList[i].cartList.length; j++) {
						if (!storeList[i].cartList[j].selected) {
							storeList[i].selected = false;
							checkAllToggle = false;
							break;
						}
					};
				}
				this.carts = Object.assign({}, data);
				this.checkAllToggle = checkAllToggle;
			},
			/** 提交购物车数据 */
			postCardList: function(postData) {
				var that = this;
				request.post('/api/cart/cartList', {
					data: {
						cart_form_data: postData
					},
					success: function(res) {
						that.doCheckAll(res.data.result);
					}
				});
			},
			/** 获取购物车列表 */
			getCardList: function() {
				var that = this;
				request.get('/api/cart/cartList', {
					success: function(res) {
						that.doCheckAll(res.data.result);
						uni.stopPullDownRefresh();
					}
				});
			},
			/** 去结算 */
			checkout: function() {
				var hasAnySelected = false;
				var storeList = this.carts.storeList;
				var storeArr = []
				var urlStore = ''
				for (var i = 0; i < storeList.length; i++) {
					for (var j = 0; j < storeList[i].cartList.length; j++) {
						if (storeList[i].cartList[j].selected) {
							urlStore = '?store_id2=' + storeList[i].cartList[j].store_id
							storeArr.push(storeList[i].cartList[j].store_id)
							hasAnySelected = true;
							break;
						}
					}
				}
				if (!hasAnySelected) {
					app.showWarning('还没有选中商品');
					return;
				}
				var shouldRaising = 'no'
				if (this.isAllEqual(storeArr)) {
					shouldRaising = 'yes'
				}
				var str = '/pages/cart/cart2/cart2' + urlStore + '&shouldRaising=' + shouldRaising
				uni.navigateTo({
					url: str
				});
			},
			isAllEqual: function(array) {
				if (array.length > 0) {
					return !array.some(function(value, index) {
						return value !== array[0];
					});
				} else {
					return true;
				}
			},
		}
	}
</script>

<style scoped src="./cart.css">

</style>
