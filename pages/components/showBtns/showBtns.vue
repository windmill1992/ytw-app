<template>
	<view>
		<view class="mask" @tap.stop="true" @touchmove.stop="true" v-if="show">
		  <view class="btnsContent">
		    <view class="btnsTitle">{{title}}</view>
		    <button v-for="(item, index) in btnList" :key="'btn' + index" class="btnItem" 
					:style="item.style" :open-type="item.openType" @tap.stop="clickBtnItem" 
					:data-type="item.type" :data-index="index">{{item.name}}</button>
		    <view class="cancelBtns" @tap="cancelBtns">取消</view>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {type: Boolean, value: false},
			title: {type: String, value: '提醒送货'},
			btnList: {type: Object, value: [
			    {name: '一对一提醒', style: 'background-color:#18c2ba;color:#fff;',openType: 'share',type: 'share'},
			    {name: '批量提醒', style: 'background-color:#fff;color:#18c2ba;border:1rpx solid #18c2ba;',openType: '', type: 'poster'}
			  ]
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			cancelBtns(e){
				this.show = false;
			},
			clickBtnItem(e){
			  var index = e.currentTarget.dataset.index
			  var type = e.currentTarget.dataset.type
			  this.$emit('clickBtnItem', {index, type})
			}
		}
	}
</script>

<style scoped src="./showBtns.css">

</style>
