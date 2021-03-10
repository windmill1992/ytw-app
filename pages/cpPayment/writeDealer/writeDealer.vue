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
		<view class="inputItem borderBN">
			<view class="itemLabel"><text>客户等级</text></view>
			<view class="dealerLevelTips"><text space="emsp" class="col999">(等级不同,价格不同 <text
						class="ff5050">介绍></text>)</text></view>
		</view>
		<view class="dealerLevelSections">
			<view @tap.stop="chooseLevel" data-type="1" class="DLS" :class="{selectedDLS: formDate.dealerLevel == 1}">大客
			</view>
			<view @tap.stop="chooseLevel" data-type="2" class="DLS" :class="{selectedDLS: formDate.dealerLevel == 2}">小客
			</view>
			<view @tap.stop="chooseLevel" data-type="3" class="DLS" :class="{selectedDLS: formDate.dealerLevel == 3}">散客
			</view>
		</view>
		<view class="inputItem">
			<view class="itemLabel"><text>客户地址</text></view>
			<input class="itemInput" type="text" placeholder-class="itemInputPlace" placeholder="请输入客户地址"
				v-model="formDate.dealerAddress"></input>
		</view>
		<view class="inputItem">
			<view class="itemLabel"><text space="emsp">备 注</text></view>
			<input class="itemInput" type="text" placeholder-class="itemInputPlace" placeholder="选填"
				v-model="formDate.remark"></input>
		</view>
		<view class="inputItem borderBN">
			<view class="itemLabel requiredInput"><text space="emsp">是否允许查看本店私密商品</text></view>
		</view>
		<view class="isVip">
			<view @tap.stop="changeIsVip" data-type="1" class="isVipItem"><text class="leftRound"
					:class="{checkedIsVip: formDate.isVip == 1}"></text>允许</view>
			<view @tap.stop="changeIsVip" data-type="0" class="isVipItem"><text class="leftRound"
					:class="{checkedIsVip: formDate.isVip == 0}"></text>不允许</view>
		</view>
		<view class="inputItem borderBN">
			<view class="itemLabel requiredInput"><text space="emsp">客户状态</text></view>
		</view>
		<view class="isVip" style="border-bottom:none;">
			<view @tap.stop="changeState" data-type="1" class="isVipItem"><text class="leftRound"
					:class="{checkedIsVip: formDate.state == 1}"></text>继续合作</view>
			<view @tap.stop="changeState" data-type="0" class="isVipItem"><text class="leftRound"
					:class="{checkedIsVip: formDate.state == 0}"></text>终止合作</view>
		</view>
		<button @tap="confirmSub" class="confirmSub ba18c">保 存</button>
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
					dealerLevel: 1,
					dealerAddress: '',
					remark: '',
					state: 0,
					isVip: 1
				}
			}
		},
		methods: {
			chooseLevel: function(e) { //客户等级变化
				var type = e.currentTarget.dataset.type;
				this.formDate.dealerLevel = type;
				this.formDate = Object.assign({}, this.formDate);
			},
			changeIsVip: function(e) { //是否可见VIP商品
				var type = e.currentTarget.dataset.type;
				this.formDate.isVip = type;
				this.formDate = Object.assign({}, this.formDate);
			},
			changeState: function(e) { //合作状态
				var type = e.currentTarget.dataset.type
				this.formDate.state = type;
				this.formDate = Object.assign({}, this.formDate);
			},
			confirmSub: function() {
				const { name, mobile, isVip, state } = this.formDate;
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
				if (isVip != 0 && isVip != 1) {
					return uni.showToast({
						title: '请设置用户是否可查看您的“私密商品”',
						icon: 'none'
					})
				}
				if (this.isModify) {
					if (state != 0 && state != 1) {
						return uni.showToast({
							title: '请设置用户合作状态',
							icon: 'none'
						})
					}
				}
				// 到这里  验证完毕 可以请求了
			},
		}
	}
</script>

<style scoped src="./writeDealer.css">

</style>
