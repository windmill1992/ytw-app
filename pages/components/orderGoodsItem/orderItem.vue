<template>
	<view>
		<view class="orderItem" :class="{detailItem: isDetail}" v-for="(item, index) in data1" :key="'data1' + index">
			<view class="orderTop">
				<view class="orderOwner">
					<image class="avatorImg" :src="m1.setHeadPic(url,item.user.head_pic)"></image>
					<text space="emsp"> {{ m1.noPassByName(item.user.nickname) }}</text>
				</view>
				<view class="orderStatus" :style="m1.setStatusCol(item.seller_order_status_detail)">
					{{item.seller_order_status_detail}}</view>
			</view>
			<view class="goodsItem" :class="{afterLine: index2 > 0}" v-for="(item2, index2) in item.order_goods}}"
				:key="'order_goods' + index + index2" :data-index="index" @tap.stop="clickItem">
				<view style="margin-right:20rpx;">
					<image class="img"
						:src="url + '/api/goods/goodsThumImagesForCart?goods_id=' + item2.goods_id + '&width=200&height=200&item_id=' + item2.item_id">
					</image>
				</view>
				<view class="contentTxt" :style="'width:' + isDetail ? '490rpx' : '460rpx'">
					<view class="contentTxtTop">
						<view class="nameSide">
							<view>
								<view class="goodsName">{{ m1.setName(item2.goods_name,'a') }}</view>
								<view class="goodsName goodsName2">{{ m1.setName(item2.goods_name,'b') }}</view>
							</view>
							<view class="goodsSpec">
								<view>{{ m1.brSpec(item2.spec_key_name,'a') }}</view>
								<view>{{ m1.brSpec(item2.spec_key_name,'b') }}</view>
							</view>
						</view>
						<view class="goodsPrice colhui"><text class="rela" space="emsp"> ￥{{item2.goods_price}}<text
									class="absGoodsSum">x{{item2.goods_num}}</text></text></view>
					</view>
				</view>
			</view>
			<view class="goodsTotal">
				<text class="colhui">共 {{ item.order_goods.length }} 件商品</text>
				<text space="ensp" class="fw600"> 运费:<text class="colhui">￥{{item.shipping_price}}</text></text>
				<text space="ensp" class="fw600"> 商品:<text
						class="colhui">￥{{ m1.setProce(item.goods_price,item.discount) }}</text></text>
			</view>
			<view class="goodsAllprice">
				{{item.seller_order_status_detail == '待支付' ? '合计' : '实收款'}}:<text>￥{{item.total_amount}}</text></view>
			<view class="orderBtns"
				:style="'justify-content:' + item.seller_order_status_detail == '已发货' ? 'flex-end' : 'space-around'"
				v-if="m1.shouldBtnsShow(item.seller_order_status_detail) && !noOperations">
				<text @tap.stop="operationOrder" data-type="bz" :data-index="index" :data-id="item.order_id"
					class="colcccc"
					v-if="item.seller_order_status_detail == '待发货' || item.seller_order_status_detail == '待支付' || item.seller_order_status_detail == '待自提' || item.seller_order_status_detail == '已发货' }}">备注</text>
				<text @tap.stop="operationOrder" data-type="df" :data-index="index" :data-id="item.order_id"
					v-if="item.seller_order_status_detail == '待发货'">平台代发</text>
				<text @tap.stop="operationOrder" data-type="zf" :data-index="index" :data-id="item.order_id"
					v-if="item.seller_order_status_detail == '待发货'">本店自发</text>
				<text @tap.stop="operationOrder" data-type="zf" :data-index="index" :data-id="item.order_id"
					v-if="item.seller_order_status_detail == '待自提'">发 货</text>
				<text @tap.stop="operationOrder" data-type="gj" :data-index="index" :data-id="item.order_id"
					v-if="item.seller_order_status_detail == '待支付'">改 价</text>
			</view>
		</view>
	</view>
</template>

<script module="m1" lang="wxs">
	var brSpec = function(str, type) {
		var arr = str.split(' ')
		if (type == 'a') {
			return arr[0]
		} else {
			return arr[1] || ''
		}
	}
	var setName = function(name, type) {
		var a = name.substring(0, 12)
		var b = name.substring(12, 20)
		if (type == 'a') {
			return a
		} else {
			return b ? (b + '...') : ''
		}
	}
	var shouldBtnsShow = function(txt) {
		return (txt != '待发货' && txt != '待支付' && txt != '已发货' && txt != '已签收' && txt != '已完成' && txt != '待自提') ? false :
			true
	}
	var noPassByName = function(str, flag) {
		var str = (str ? str : '') + ''
		if (null != str && str != undefined) {
			if (flag == true) {
				return str
			}
			if (str.length <= 3) {
				return str.substring(0, 1) + (str.length == 2 ? "*" : "**");
			} else if (str.length > 3 && str.length <= 6) {
				return "**" + str.substring(2, str.length);
			} else if (str.length > 6) {
				return str.substring(0, 2) + "****" + str.substring(6, str.length)
			}
		} else {
			return "";
		}
	}
	var setProce = function(p, d) {
		var p = p + ''
		var d = d + ''
		return ((p - 0) + (d - 0)).toFixed(2)
	}
	var setHeadPic = function(url, img) {
		if (!img || img == '') {
			return 'https://www.yitongwang.com/public/static/images/minniapp/user68.jpg'
		}
		if (img.indexOf('http') == -1) {
			return url + img
		}
		return img
	}
	var setStatusCol = function(s) {
		if (s == '待支付' || s == '已完成' || s == '已签收') {
			return 'color:#18c2ba;'
		}
		if (s == '已发货') {
			return 'color:#777;'
		}
		if (s == '待发货' || s == '待自提') {
			return ''
		}
		if (s == '已取消' || s == '已取消(已退款)') {
			return 'color:#ff3131;'
		}
	}
	module.exports = {
		brSpec,
		setName,
		shouldBtnsShow,
		noPassByName,
		setProce,
		setHeadPic,
		setStatusCol
	}
</script>
<script>
	export default {
		props: {
			data1: {
				type: Object,
				value: []
			},
			url: {
				type: String,
				value: 'https://www.yitongwang.com'
			},
			isDetail: {
				type: Boolean,
				value: false
			},
			noOperations: {
				type: Boolean,
				value: false
			}
		},
		data() {
			return {

			}
		},
		methods: {
			clickItem(e) {
				var index = e.currentTarget.dataset.index
				this.$emit("clickItem", {
					index: index
				});
			},
			operationOrder(e) {
				var type = e.currentTarget.dataset.type
				var id = e.currentTarget.dataset.id
				var index = e.currentTarget.dataset.index
				this.$emit('operationOrder', {
					type: type,
					id: id,
					index: index
				})
			}
		}
	}
</script>

<style scoped src="./orderItem.css">

</style>
