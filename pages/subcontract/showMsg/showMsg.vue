<template>
	<view>
		<view class="showMsgComponent" @tap.stop="true" @touchmove.stop="true" v-if="isShow">
			<view class="showMsgContent" :style="'color:' + status ? 'green' : '#f17a7f' + ';min-height:' + minh">
				<image class="showMsgRoundImg"
					:src="status ? 'https://www.yitongwang.com/public/static/images/minniapp/msg-ok-1.png' : 'https://www.yitongwang.com/public/static/images/minniapp/msg-err-1.png'">
				</image>
				<image class="showMsgBgImg"
					:src="status ? 'https://www.yitongwang.com/public/static/images/minniapp/msg-ok-2.png' : 'https://www.yitongwang.com/public/static/images/minniapp/msg-err-2.png'">
				</image>
				<!-- 标题 -->
				<view class="facName" v-if="facName != ''">{{facName}}</view>
				<view v-if="showTitle" class="showMsgTitle" :style="'color:' + titleColor">{{ title }}</view>
				<!-- 中间文字内容 需要显示的文案 -->
				<view v-if="msg1" :style="msgStyle">{{ msg1 }}</view>
				<view v-if="msg2" :style="msgStyle">{{ msg2 }}</view>
				<view v-if="msg3" :style="msgStyle">{{ msg3 }}</view>
				<view v-if="msg4" :style="msgStyle">{{ msg4 }}</view>
				<slot class="showMsgSloat1" name="slot1"></slot>
				<slot class="showMsgSloat2" name="slot2"></slot>
				<slot class="showMsgSloat3" name="slot3"></slot>
				<!-- 底部按钮 -->
				<view class="showMsgBtns" :class="{inlineBtn: inlineBtn}">
					<view v-if="showBtn1" class="showMsgBtn2" :style="'width:' + inlineBtn? '250rpx' : '80%'"
						@tap.stop="btnClick1">{{ btnTxt1 }}</view>
					<view v-if="showBtn2" class="showMsgBtn1" :style="'width:' + inlineBtn? '250rpx' : '80%'"
						@tap.stop="btnClick2">{{ btnTxt2 }}</view>
				</view>
				<view class="closeShowMsg" @tap.stop="closeShowMsg">X</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			status: {
				type: Boolean,
				value: true
			},
			msg1: {
				type: String,
				value: ''
			},
			msg2: {
				type: String,
				value: ''
			},
			msg3: {
				type: String,
				value: ''
			},
			msg4: {
				type: String,
				value: ''
			},
			title: {
				type: String,
				value: '提醒'
			},
			facName: {
				type: String,
				value: ''
			},
			showTitle: {
				type: Boolean,
				value: true
			},
			showBtn1: {
				type: Boolean,
				value: false
			},
			showBtn2: {
				type: Boolean,
				value: false
			},
			btnTxt2: {
				type: String,
				value: '确定'
			},
			btnTxt1: {
				type: String,
				value: '取消'
			},
			isShow: {
				type: Boolean,
				value: true
			},
			titleColor: {
				type: String,
				value: '#444'
			},
			inlineBtn: {
				type: Boolean,
				value: false
			},
			msgStyle: {
				type: String,
				value: ''
			},
			minh: {
				type: String,
				value: '48vh'
			}
		},
		data() {
			return {

			}
		},
		methods: {
			btnClick1: function(e) {
				this.isShow = false
				this.$emit("btnClick1", {})
			},
			btnClick2: function(e) {
				this.isShow = false
				this.$emit("btnClick2", {})
			},
			closeShowMsg: function() {
				this.isShow = false
			}
		}
	}
</script>

<style scoped src="./showMsg.css">

</style>
