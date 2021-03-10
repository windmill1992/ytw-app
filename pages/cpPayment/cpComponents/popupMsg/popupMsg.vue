<template>
	<view>
		<view class="popupMask" :style="'z-index:' + zIndex || 5" v-if="showPopup" @touchmove.stop="true" @tap.stop="closePopup">
		  <view class="popupContent">
		    <view class="changePriceHead" v-if="showHead">
		      <!-- 头部不一样 页面自己传 -->
		      <slot name="head"></slot>
		    </view>
		    <slot name="content"></slot>
		    <view class="popupBtns" v-if="defBtns">
		      <view class="popupBtn1" :style="'color:' + btn1col">{{btnTxt1}}</view>
		      <view class="popupBtn2">{{btnTxt2}}</view>
		    </view>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			defBtns: {type: Boolean, value: true},
			showHead: {type: Boolean, value: false},
			btnTxt1: {type: String, value: '取消'},
			btnTxt2: {type: String, value: '确定'},
			btn1col: {type: String, value: '#444'},
			showPopup: {type: Boolean, value: false}
		},
		data() {
			return {
				
			}
		},
		methods: {
			closePopup(){
				this.showPopup = false;
			},
		}
	}
</script>

<style>

</style>
