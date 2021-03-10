<template>
	<view>
		<view class="changePriceMask" :hidden="!isShow" @touchmove.stop="true" @tap.stop="cancelChange">
			<view class="changePrice" @touchmove.stop="true" @tap.stop="true">
				<view class="changePriceHead">
					<!-- 头部不一样 页面自己传 -->
					<slot name="head"></slot>
				</view>
				<view class="changePriceContent">
					<view class="cpht">直接改价</view>
					<input class="changePriceInput" type="digit" v-model="priceVal"
						:placeholder="type == 'all' ? '请输入新的总价' : '请输入新的单价'"></input>
					<view class="cpht">或打折</view>
					<view class="discountBox">
						<view @tap.stop="doDiscount" data-type="sub"
							:style="'background-color:' + priceVal ? '#ccc' : '#18c2ba'" class="m_0_5 dis_sub"></view>
						<view class="flexR" style="flex: 1;">
							<view style="flex:1;" class="m_0_5 dis_num" :hidden="curDiscount != 100">1</view>
							<view style="flex:1;" class="m_0_5 dis_num">{{ m1.setNum(curDiscount,'a') }}</view>
							<view style="flex:.3;" class="dis_point"></view>
							<view style="flex:1;" class="m_0_5 dis_num">{{ m1.setNum(curDiscount,'b') }}</view>
							<view style="flex:1;" class="m_0_5 dis_txt">折</view>
						</view>
						<view @tap.stop="doDiscount" data-type="add"
							:style="'background-color:' + priceVal ? '#ccc' : '#18c2ba'" class="m_0_5 dis_add"></view>
					</view>
				</view>
				<view class="changePriceTips">注:以上两种改价方式选择一种即可</view>
				<view class="changePriceConfirm" @tap.stop="confirmChangePrice">确定</view>
				<view class="closeChange" @tap.stop="cancelChange"></view>
			</view>
		</view>

	</view>
</template>

<script lang="wxs" module="m1">
	var setNum = function(n, t) {
		var n = n + ''
		if (n == '100') {
			return 0
		} else {
			if (n > 5) {
				if (t == 'a') {
					return n.charAt(0)
				} else {
					return n.charAt(1)
				}
			} else {
				if (t == 'a') {
					return 0
				} else {
					return 5
				}
			}
		}
	}
	module.exports.setNum = setNum
</script>
<script>
	export default {
		props: {
			type: {
				type: String,
				value: ''
			},
			isShow: {
				type: Boolean,
				value: false
			},
			oldPrice: {
				type: String,
				value: ''
			} //原价
		},
		data() {
			return {
				curDiscount: 100, //当前的折扣点数
				priceVal: '', //当前输入的价格
			}
		},
		methods: {
			cancelChange() {
				this.isShow = false;
			},
			confirmChangePrice: function() { //确定改价格
				if (this.priceVal) {
					var priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
					if (!priceReg.test(this.priceVal)) {
						return uni.showToast({
							title: '请输入正确的产品价格:整数或者保留两位小数',
							icon: 'none'
						})
					}
					if (this.priceVal <= 0) {
						return uni.showToast({
							title: '修改价格不能小于等于0',
							icon: 'none'
						})
					}

					if (this.priceVal.trim() == this.oldPrice.trim()) {
						return uni.showToast({
							title: '您输入的价格与原价相同，没有任何修改',
							icon: 'none'
						})
					}
					if (this.priceVal > this.oldPrice) {
						return uni.showToast({
							title: '修改价格不能高于原价',
							icon: 'none'
						})
					}
					this.$emit('confirmChangePrice', {
						price: this.priceVal
					})
				} else {
					if (this.curDiscount == 100) {
						return uni.showToast({
							title: '并没有折扣，无需改价',
						})
					}
					this.$emit('confirmChangePrice', {
						curDiscount: this.curDiscount
					})
				}
			},
			doDiscount(e) { //打折 + -  5 -- 100 之间
				if (this.priceVal != '') {
					return
				}
				var type = e.currentTarget.dataset.type
				if (type == 'sub') { // ---
					this.curDiscount = this.curDiscount > 5 ? (this.curDiscount - 5) : 5;
				} else if (type == 'add') { // ++
					this.curDiscount = this.curDiscount < 100 ? ((this.curDiscount - 0) + 5) : 100;
				}
			},
		}
	}
</script>

<style scoped src="./changeAllPrice.css">

</style>
