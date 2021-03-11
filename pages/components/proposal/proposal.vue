<template>
	<view>
		<view class="proposalMask" @touchmove.stop="true" @tap.stop="closeOperations">
		  <view class="proposalContent" @tap.stop="true" v-if="!isProposalDone">
		    <view class="proposalTit">请描述使用问题</view>
		    <view class="closeProposal" @tap.stop="closeOperations">+</view>
		    <textarea class="proposalArea" cols="30" rows="10" placeholder-class="proposalAreaplaceholder" 
					placeholder="某个功能无法使用、页面白屏/卡顿/闪退、或其他产品建议。(5个字以上)" @input="proposalAreaInput"></textarea>
		    <view class="proposalImgBox">
		      <view class="proposalImgB" v-for="(item, index) in proposalData.img" v-if="index < 5" :key="'img' + index">
		        <image class="proposalImg" :src="item"></image>
		        <view class="delProposalImg" @tap.stop="delProposalImg" :data-index="index">+</view>
		      </view>
		      <view class="proposalImgB proposalAddImg" v-if="proposalData.img.length < 5" hover-class="proposalPlusHover" @tap.stop="proposalAddImg">
		        <view class="plushao">+</view>
		        <view class="proposalImgTips">可上传{{proposalData.img.length}}/5张图片</view>
		      </view>
		    </view>
		    <view class="proposalHotLine">
					<text space="emsp">客服热线：400-008-6336 </text>
					<image class="callImg" @tap.stop="callService" src="../../../static/images/call.png"></image></view>
		    <view class="proposalSubmit" @tap.stop="proposalSubmit">提 交</view>
		  </view>
		  <view class="proposalDone" v-if="isProposalDone">
		    <image class="proposalDoneImg" src="https://test.yitongwang.com/public/static/images/minniapp/DIYshiop_proposalDone.png"></image>
		    <view class="proposalDoneTitle">提 交 成 功</view>
		    <view class="proposalDoneTips">感 谢 您 提 交 的 反 馈</view>
		    <view class="proposalDoneTips">工 作 人 员 会 尽 快 核 实 并 回 复 您</view>
		    <view class="proposalDoneTips">祝 您 生 活 愉 快 !</view>
		    <view class="proposalDoneBtn" @tap.stop="closeOperations">好 的</view>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			isiphoneX: {type: Boolean, value: false},
			is_A: {type: Boolean, value: false},
			isGoodsList: {type: Boolean, value: false},
		},
		data() {
			return {
				
			}
		},
		methods: {
			closeOperations: function() {},
			delProposalImg: function() {},
			proposalAddImg: function() {},
			proposalSubmit: function() {},
		}
	}
</script>

<style>

</style>
