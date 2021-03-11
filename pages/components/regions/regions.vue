<template>
	<view>
		<!-- 选择地址弹框  -->
		<view :hidden="!regions.showRegionsModal">
			<view class="cover-layer" @tap="closeRegionsModal"></view>
			<view class="regions" v-if="regions.regions">
				<view class="region" v-for="(item, index) in regions.regions" :key="'re' + index" :data-id="item.id"
					:data-name="item.name" @tap="openRegionsModal">{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			regions: {type: Object, value: {}}
		},
		data() {
			return {

			}
		},
		methods: {
			openRegionsModal: function() {
				
			},
			closeRegionsModal: function() {},
		}
	}
</script>

<style scoped src="./regions.css">

</style>
