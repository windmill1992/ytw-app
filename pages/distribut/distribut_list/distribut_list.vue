<template>
	<view>
		<view class='container'>
			<view class='disgoods-list'>
				<view class="choice_item" v-for="(item, index) in goods" :key="'goods' + index">
					<view class='goods-check'>
						<checkbox :checked='item.selected' @tap='selectGoods' :data-id='item.goods_id'></checkbox>
					</view>
					<view class="img-wrap">
						<image @tap='goodsDetail' :data-id='item.goods_id'
							:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id + '&width=200&height=200'">
						</image>
					</view>
					<view class="item-cont">
						<view class="title" @tap='goodsDetail' :data-id='item.goods_id'>{{item.goods_name}}</view>
						<view class="price">分成金额：{{item.distribut}}</view>
						<view class="comment">￥{{item.shop_price}}</view>
					</view>
				</view>
			</view>
			<view class="lastChild"></view>
			<view class="no-data" v-if="!goods || goods.length == 0">
				<image src="../../../static/images/cart-null.png" class="cart-image" />
				<view class="no-data-title">没有相关的数据</view>
			</view>
			<view class='distri-bot'>
				<view class='bot-left'>
					<checkbox class='check-all' :checked='checkAllToggle' @tap='checkAll'></checkbox>
					<label>全选</label>
				</view>
				<view class='bot-right' @tap='delGoods'>
					<button>删除</button>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	export default {
		data() {
			return {
				url: app.globalData.setting.url,
				requestUrl: '', //请求的链接
				goods: null,
				checkAllToggle: false, //全选标志
			}
		},
		onLoad: function(options) {
			this.requestGoodsList();
		},
		methods: {
			requestGoodsList: function() {
				var that = this;
				request.get('/api/Distribut/distribution_list', {
					success: function(res) {
						that.goods = res.data.result;
					}
				});
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
			delGoods: function() {
				var that = this;
				var ids = [];
				var goodList = this.goods;
				for (var i = 0; i < goodList.length; i++) {
					if (goodList[i].selected) {
						ids.push(goodList[i].goods_id);
					}
				}
				if (ids.length <= 0) {
					app.showWarning("没有选中商品");
					return;
				}
				request.post('/api/Distribut/delete', {
					data: {
						goods_ids: ids
					},
					success: function(res) {
						that.checkAllToggle = false;
						that.requestGoodsList();
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

<style scoped src="./distribut_list.css">

</style>
