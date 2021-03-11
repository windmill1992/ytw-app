<template>
	<view>
		<view class="orderBox">
			<order-item :url="url" isDetail noOperations @operationOrder="operationOrder" @clickItem="clickItem"
				:data="list"></order-item>
		</view>
		<view class="change">
			<view class="absTitle">改价</view>
			<view class="aaa">
				<text class="abst2">商品总额</text>
				<view class="op2">
					<text @tap.stop="changeType" data-type1="a" data-type2="a1" class="op2Item"
						:class="{op2Current: typeA}">减价</text>
					<text @tap.stop="changeType" data-type1="a" data-type2="a2" class="op2Item"
						:class="{op2Current: !typeA}">打折</text>
				</view>
				<view class="discount" v-if="!typeA">
					<!-- 打折 -->
					<view class="handelDiscount">
						<view @tap.stop="doDiscount" data-type="sub"
							:style="'background-color:' + curDiscountIndex == 19 ? '#ccc' : '#f17a7f'"
							hover-class="hoverSubAdd" class="inlineblock sub">-</view>
						<view class="inlineblock countTxt">{{mapDiscount[curDiscountIndex]}}</view>
						<view @tap.stop="doDiscount" data-type="add"
							:style="'background-color:' + curDiscountIndex == 0 ? '#ccc' : '#f17a7f'"
							class="inlineblock add" hover-class="hoverSubAdd">+</view>
					</view>
					<view class="goodsPrice">￥{{ newP }}</view>
				</view>
				<view class="bySelf" v-if="typeA">
					<!-- 减价 -->
					<view class="pxxStyle">
						<text class="prePrice">￥{{ originalP }}-</text>
						<input class="priceInput" @blur="priceBlur" v-model="goodprice" type="digit"></input>
						<text class="fainalPrice">= {{newP}}<text style="font-size:22rpx;">(减价后)</text></text>
					</view>
				</view>
			</view>
			<view class="bbb">
				<text class="abst2">运费</text>
				<view class="op2">
					<text @tap.stop="changeType" data-type1="b" data-type2="b1" class="op2Item"
						:class="{op2Current: typeB}">减邮费</text>
					<text @tap.stop="changeType" data-type1="b" data-type2="b2" class="op2Item"
						:class="{op2Current: !typeB}">免邮</text>
				</view>
				<view style="height:120rpx;">
					<view class="pxxStyle" v-if="typeB">
						<text class="prePrice">￥{{ originalPostage }}-</text>
						<input class="priceInput" @blur="newPostageBlur" v-model="postprice" type="digit"></input>
						<text class="fainalPrice">= {{newPostage}}<text style="font-size:22rpx;">(减价后)</text></text>
					</view>
					<view class="freeExpress" v-if="!typeB">
						<text>￥{{ originalPostage }}</text>
						<text>￥0.00</text>
					</view>
				</view>
			</view>
			<view class="total">
				<text class="totalcol1" space="emsp">含运费￥{{ newPostage }} </text>
				总价:<text class="totalcol2">￥{{ (newP - 0) + (newPostage - 0) }}</text>
			</view>
		</view>

		<view class="sureChange" @tap.stop="sureChange">确 认 改 价</view>
	</view>
</template>

<script>
	import orderItem from "../../components/orderGoodsItem/orderItem";
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	var util = require('../../../static/utils/util.js');
	export default {
		components: {
			orderItem
		},
		data() {
			return {
				url: setting.url,
				discountStep: '8折',
				currentValue: 456,
				mapDiscount: ['无折扣', '9.5折', '9.0折', '8.5折', '8.0折', '7.5折', '7.0折', '6.5折', '6.0折', '5.5折', '5.0折',
					'4.5折', '4.0折', '3.5折', '3.0折', '2.5折', '2.0折', '1.5折', '1.0折', '0.5折'
				],
				curDiscountIndex: 0,
				typeA: true, //false 是打折 true 减价
				typeB: true, //false 是免邮 true 减运费
				list: [],
				originalP: '9999.45', //原本的价格
				newP: '', //改了后的价格
				originalPostage: '5.00', // 原邮费
				newPostage: '', // 现在的邮费
				total: '', //总价
				minPrice: '',
				goodprice: '',
				postprice: '',
			}
		},
		onLoad: function(options) {
			var that = this
			request.get(that.url + '/api/StoreOrder/storeOrderDetails', {
				data: {
					store_id: options.store_id,
					order_id: options.order_id,
					order_sn: options.order_sn,
				},
				success: function(res) {
					var list = res.data.result
					list.time1 = list.add_time == 0 ? '- - - -' : util.format(list.add_time, 'yyyy-MM-dd hh:mm')
					list.time2 = list.pay_time == 0 ? '- - - -' : util.format(list.pay_time, 'yyyy-MM-dd hh:mm')
					list.time3 = list.confirm_time == 0 ? '- - - -' : util.format(list.confirm_time, 'yyyy-MM-dd hh:mm')
					that.list = [list]
					that.originalP = ((list.goods_price - 0) + (list.discount - 0)).toFixed(2)
					that.newP = ((list.goods_price - 0) + (list.discount - 0)).toFixed(2)
					that.originalPostage = (list.shipping_price - 0).toFixed(2)
					that.newPostage = (list.shipping_price - 0).toFixed(2)
					that.total = (list.total_amount - 0).toFixed(2)
					that.typeB = (list.shipping_price - 0) == 0 ? false : true
				}
			})
		},
		methods: {
			changeType: function(e) {
				var t = e.currentTarget.dataset.type1
				var t2 = e.currentTarget.dataset.type2
				if (t == 'a') {
					this.typeA = t2 == 'a1' ? true : false
					if (t2 == 'a2') {
						this.curDiscountIndex = 0
						this.newP = this.originalP
					} else {
						this.curDiscountIndex = 0
						this.newP = this.originalP - (this.goodprice - 0)
					}
				} else {
					if ((this.originalPostage - 0) == 0) {
						return
					}
					if (t2 == 'b2') {
						this.newPostage = 0.00
						this.typeB = t2 == 'b1' ? true : false
					} else {
						this.newPostage = this.originalPostage
						this.typeB = t2 == 'b1' ? true : false
					}
				}
			},
			onDrag: function(event) {
				this.newP = event.detail.value.toFixed(2)
				this.curDiscountIndex = 0
			},
			doDiscount: function(e) { //折扣 加减 + -
				var type = e.currentTarget.dataset.type
				var curIndex = this.curDiscountIndex
				if (type == 'sub') {
					if (curIndex == 19) {
						return
					}
					this.curDiscountIndex = curIndex == 19 ? 19 : ((curIndex - 0) + 1)
					this.newP = (this.originalP - ((curIndex - 0 + 1) * 5 * this.originalP) / 100).toFixed(2)
				} else {
					if (curIndex == 0) {
						return
					}
					this.curDiscountIndex = curIndex == 0 ? 0 : (curIndex - 1)
					this.newP = (this.originalP - ((curIndex - 1) * 5 * this.originalP) / 100).toFixed(2)
				}
			},
			priceBlur: function(e) { //新价格 input
				var p = e.detail.value - 0
				if (!p) {
					p = 0
				}
				var reg = /(^[1-9][0-9]{0,7}$)|(^((0\.0[1-9]$)|(^0\.[1-9]\d?)$)|(^[1-9][0-9]{0,7}\.\d{1,2})$)/
				if (!reg.test(p)) {
					p = 0
				}
				if (p < 0) {
					p = 0
					uni.showToast({
						title: '商品减价不能为负数哦',
						icon: 'none'
					})
				}
				if (p > this.originalP) {
					p = this.originalP
					uni.showToast({
						title: '商品减价不能高于原商品价格哦',
						icon: 'none'
					})
				}
				if (p > (this.originalP * 0.95)) {
					uni.showToast({
						title: '商品减价至多减去原价的95%',
						icon: 'none'
					})
					p = this.originalP * 0.95
				}
				if ((this.originalP - p).toFixed(2) <= 0.01) {
					uni.showToast({
						title: '商品价格最低为0.02',
						icon: 'none'
					})
					p = this.originalP - 0.02
				}
				this.newP = (this.originalP - p).toFixed(2)
				this.goodprice = p
			},
			newPostageBlur: function(e) { //邮费input
				var p = e.detail.value - 0
				if (!p) {
					p = 0
				}
				var reg = /(^[1-9][0-9]{0,7}$)|(^((0\.0[1-9]$)|(^0\.[1-9]\d?)$)|(^[1-9][0-9]{0,7}\.\d{1,2})$)/
				if (!reg.test(p)) {
					p = 0
				}
				if (p < 0) {
					p = 0
					return uni.showToast({
						title: '邮费减价不能小于0哦',
						icon: 'none'
					})
				}
				if (p > this.originalPostage) {
					p = this.originalPostage
					uni.showToast({
						title: `邮费减价不能高于${this.originalPostage}`,
						icon: 'none'
					})
				}
				this.newPostage = (this.originalPostage - p).toFixed(2)
				this.postprice = p
			},
			sureChange: function() { //最终提交
				var {
					goodprice,
					postprice,
					originalP,
					originalPostage
				} = this
				if ((goodprice - 0) > (originalP - 0)) {
					return uni.showToast({
						title: '商品减价不能大于商品原价',
						icon: 'none'
					})
				}
				if ((postprice - 0) > (originalPostage - 0)) {
					return uni.showToast({
						title: '邮费减价不能大于原邮费',
						icon: 'none'
					})
				}
				if (this.newPostage == originalPostage && this.newP == originalP) {
					return uni.showToast({
						title: '价格没有变化~',
						icon: 'none'
					})
				}
				var shipping_price = this.newPostage
				var discount = this.newP - this.originalP
				discount = (discount + '') ? discount : 0
				discount = discount + +((this.list[0].discount + '') - 0)
				var that = this
				var data = {
					order_id: this.list[0].order_id,
					store_id: this.list[0].store_id,
					shipping_price,
					discount
				}
				request.post(that.url + '/api/StoreOrder/editOrderPrice', {
					data,
					success: function(res) {
						if (res.data.status == 1) {
							uni.showToast({
								title: '改价成功',
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						}
					}
				})
			},
		}
	}
</script>

<style scoped src="./changeGoodsPrice.css">

</style>
