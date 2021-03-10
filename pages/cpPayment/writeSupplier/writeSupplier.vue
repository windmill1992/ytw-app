<template>
	<view>
		<view class="inputItem">
			<view class="itemLabel requiredInput"><text space="emsp">姓 名</text></view>
			<input class="itemInput" type="text" placeholder-class="itemInputPlace" placeholder="输入批发商姓名"
				v-model="formDate.name"></input>
		</view>
		<view class="inputItem">
			<view class="itemLabel requiredInput"><text space="ensp">手 机 号</text></view>
			<input class="itemInput" type="number" placeholder-class="itemInputPlace" placeholder="必须是壹童网注册手机号"
				v-model="formDate.mobile"></input>
		</view>
		<view class="inputItem">
			<view class="itemLabel"><text>供应商地址</text></view>
			<input class="itemInput" style="padding-left: 22rpx;" type="text" placeholder-class="itemInputPlace"
				placeholder="请输入供应商地址" v-model="formDate.dealerAddress"></input>
		</view>
		<view class="inputItem">
			<view class="itemLabel"><text space="emsp">备 注</text></view>
			<input class="itemInput" type="text" placeholder-class="itemInputPlace" placeholder="选填"
				v-model="formDate.remark"></input>
		</view>

		<view class="inputItem borderBN">
			<view class="itemLabel requiredInput"><text space="emsp">合作状态</text></view>
		</view>
		<view class="isVip" style="border-bottom:none;">
			<view @tap.stop="changeState" data-type="1" class="isVipItem"><text class="leftRound"
					:class="{checkedIsVip: formDate.state == 1}"></text>继续合作</view>
			<view @tap.stop="changeState" data-type="0" class="isVipItem"><text class="leftRound"
					:class="{checkedIsVip: formDate.state == 0}"></text>终止合作</view>
		</view>
		<button bindtap="confirmSub" class="confirmSub ba18c">保 存</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isModify: true,
				formDate: {
					name: '',
					mobile: '',
					dealerAddress: '',
					remark: '',
					state: 0
				}
			}
		},
		methods: {
			changeState: function(e) { //合作状态
				var type = e.currentTarget.dataset.type;
				this.formDate.state = type;
				this.formDate = Object.assign({}, this.formDate);
			},
			confirmSub: function() {
				const { name, mobile, state } = this.formDate;
				var nameReg = /^[\u4e00-\u9fa5]+$/
				var mobileReg = /^[1][3,4,5,7,8,9][0-9]{9}$/
				if (name.trim() == '') {
					return uni.showToast({
						title: '请填写姓名',
						icon: 'none'
					})
				}
				if (!nameReg.test(name.trim())) {
					return uni.showToast({
						title: '姓名只能是中文',
						icon: 'none'
					})
				}
				if (!mobileReg.test(mobile)) {
					return uni.showToast({
						title: '请正确填写11位手机号',
						icon: 'none'
					})
				}
				if (this.isModify) {
					if (state != 0 && state != 1) {
						return uni.showToast({
							title: '请设置合作状态',
							icon: 'none'
						})
					}
				}
				// 到这里  验证完毕 可以请求了
			},
		}
	}
</script>

<style scoped src="./writeSupplier.css">

</style>
