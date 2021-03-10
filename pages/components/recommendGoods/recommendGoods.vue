<template>
	<view>
		<view class="goodsTypeTitle">为你推荐</view>
		<view class="pBox">
		  <view class="goodsItem" @tap.stop="clickItem" v-for="(item, index) in data1" :key="'data1' + index" 
				data-url="/pages/goods/goodsInfo/goodsInfo?goods_id=5">
		    <image :src="item.original_img" @tap.stop="toGoodsInfo" :data-id="item.goods_id" mode="aspectFit"></image>
		    <view class="goodsName">{{ item.goods_name }}</view>
		    <view class="goodsPrice">￥{{ item.shop_price }}</view>
		    <view class="storeName" @tap.stop="toStore" :data-id="item.store_id">{{ item.store_name }}></view>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data1: {type: Array, value: [1,2,3,4,5]}
		},
		data() {
			return {
				
			}
		},
		methods: {
			clickItem(e){
			  // console.log(e)
			},
			toGoodsInfo(e){
			  var id = e.currentTarget.dataset.id
			  if (!id) return
			  uni.navigateTo({
			    url: `/pages/goods/goodsInfo/goodsInfo?goods_id=${id}`,
			  })
			},
			toStore(e){
			  var id = e.currentTarget.dataset.id
			  if (!id) return
			  uni.navigateTo({
			    url: `/pages/store/index/index?store_id=${id}`,
			  })
			},
		}
	}
</script>

<style scoped src="./recommendGoods.css">

</style>
