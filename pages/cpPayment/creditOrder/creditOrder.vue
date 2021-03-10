<template>
	<view>

		<button catchtap="showChange">show</button>
		<button catchtap="showPopup">sssssssssssssssssss</button>
		<changeprice type="all" :oldPrice="oldPrice" :isShow="showChangePrice__2"
			@confirmChangePrice="confirmChangePrice">
			<view slot="head" class="changeSlotHead">
				<view class="slotTxt1">{{ 'sdljiihsdlkfj' }}</view>
				<view class="slotTxt2">{{ '0198309182' }}</view>
			</view>
		</changeprice>
		<changeprice type="all" :isShow="showChangePrice" :oldPrice="oldPrice" @confirmChangePrice="confirmChangePrice">
			<view slot="head" class="changeSlotHead">
				<view class="slotTxt1">{{ 'sdljiihsdlkfj' }}</view>
				<view class="slotTxt3">{{ '0198309182' }}</view>
			</view>
		</changeprice>

		<popupmsg :showPopup="true" :showHead="false" :defBtns="false">
			<view slot="head" class="changeSlotHead">headheadhead</view>
			<view slot="content">sldkfjlksdjfkjsdf</view>
		</popupmsg>
	</view>
</template>

<script>
	import changeprice from '../cpComponents/changeAllPrice/changeAllPrice';
	import popupmsg from '../cpComponents/popupMsg/popupMsg';
	export default {
		components: {
			changeprice,
			popupmsg
		},
		data() {
			return {
				showChangePrice: false,
				oldPrice: '123',
			}
		},
		methods: {
			showChange() { //显示改价格框
				this.showChangePrice = true;
			},
			confirmChangePrice(e) { //确定了改价格
				var val = e.detail.price
			},
		}
	}
</script>

<style scoped src="./creditOrder.css">

</style>
