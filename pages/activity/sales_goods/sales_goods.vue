<template>
	<view>
		<view class="container">
			<view class="choice_box">
				<navigator v-for="(item, index) in requestData" :key="'sale' + index"
					:url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id + '&item_id=' + item.item_id">
					<view class='content'>
						<image
							:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id + '&width=400&height=400'">
						</image>
						<view>
							<text class='name'>{{item.goods_name}}</text>
							<view class='price'>￥{{item.shop_price}}元
								<text>{{item.comment_count}}条评价</text>
							</view>
						</view>
					</view>
				</navigator>
			</view>
			<view class="no-data" v-if="!requestData || requestData.length == 0">
				<image src="../../../static/images/cart-null.png" class="cart-image" />
				<view class="no-data-title">没有找到相关的记录</view>
				<navigator url="/pages/index/index/index" class="lookat" open-type="switchTab"> 去逛逛 </navigator>
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
				requestData: null,
			}
		},
		onLoad: function(options) {
			this.requestGroupBuy(options.id);
		},
		methods: {
			// 请求商品数据
			requestGroupBuy: function(id) {
				var that = this;
				request.post('/api/Activity/promote_list', {
					data: {
						id: id,
					},
					success: function(res) {
						if (res.data.result && res.data.result.length > 0) {
							this.requestData = [...res.data.result];
						} else {
							this.requestData = [];
						}
					}
				});
			},
		}
	}
</script>

<style scoped src="./sales_goods.css">

</style>
