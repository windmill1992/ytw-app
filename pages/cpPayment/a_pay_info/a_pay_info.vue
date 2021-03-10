<template>
	<view>
		<!-- 客户付款信息 -->
		<!-- 主体 -->
		
		<!-- 弹框 -->
		<popupmsg :defBtns="false" showHead :showPopup="true">
		  <view slot="head" class="headBox">
		    <view>客户付款信息</view>
		    <view>{{ '张三' }}<text space="emsp" class="arrowR">  </text></view>
		    <view>{{ '+45642.22' }}元 <text space="emsp">  {{ '已到账' }}</text></view>
		    <view class="close"></view>
		  </view>
		  <view class="applyInfoBox" slot="content">
		    <view class="applyInfoItem">
		      <text class="applyLabel">付款方式： <text>{{ '线上支付' }}</text></text>
		      <text class="applyLabel">付款方式： <text>{{ '线上支付' }}</text></text>
		      <text class="applyLabel">付款方式： <text>{{ '线上支付' }}</text></text>
		      <text class="applyLabel">付款方式： <text>{{ '线上支付' }}</text></text>
		      <text class="applyLabel">资金状态： <text>{{ '已到账' }}</text><text class="arrowR"></text></text>
		      <text class="applyLabel">客户结算记录： <text class="arrowR"></text></text>
		      <text class="applyLabel">投诉/建议： <text class="arrowR"></text></text>
		    </view>
		  </view>
		</popupmsg>
	</view>
</template>

<script>
	import popupmsg from "../cpComponents/popupMsg/popupMsg";
	export default {
		comments: { popupmsg },
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped src="./a_pay_info.css">

</style>
