<template>
	<view>
		<view class="operaMask" @touchmove.stop="true" @tap.stop="closeOperations">
			<view class="shopOperas" :style="'bottom:' + isiphoneX ? '175rpx' : '135rpx'">
				<view v-for="(item, index) in operaList" :key="'op' + index" class="templeteOperationItem"
					@tap.stop="clickTelmpleteOpera" :data-index="item.index">
					<image class="operationsImg" :src="item.src" alt=""></image>
					<text class="lineBox"
						:style="'color:' + item.name == current ? '#18c2ba' : '#666' + ';border-bottom:' + index == (operaList.length - 1) ? '' : '1rpx solid #ccc'">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			isiphoneX: {
				type: Boolean,
				value: false
			},
			operaList: {
				type: Array,
				value: []
			},
		},
		data() {
			return {

			}
		},
		methods: {
			closeOperations: function() {},
			clickTelmpleteOpera: function() {},
		}
	}
</script>

<style>

</style>
