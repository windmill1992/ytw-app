<template>
	<view>
		<view class="progress-bar">
			<view class="progress-item" v-for="(item, index) in 4" :key="'step' + index">
				<view class="line" :class="{'em-back': step >= index + 1}"></view>
				<view class="circle" :class="{'em-back': step >= index + 1}">{{index + 1}}</view>
				<view class="title" :class="{'em-front': step >= index + 1}">{{titles[index]}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			step: {type: Number, value: 1},
		},
		data() {
			return {
				titles: ['入驻商家信息', '入驻商家信息', '入驻商家信息', '审核/完成'],
			}
		},
		methods: {

		}
	}
</script>

<style scoped src="./newjoin.css">

</style>
