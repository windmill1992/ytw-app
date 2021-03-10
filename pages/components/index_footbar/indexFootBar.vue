<template>
	<view>
		<view class="pos_fixed">
			<view class="tpd-footer tpd-footer1" v-if="defaultMenu" :style="'padding-bottom:' + isiphoneX ? '40rpx' : '0'">
				<view hover-class="none" @tap.stop='topages' data-idx="0" :class="{'tpd-footer-select': page == 0}">
					<image
						:src="page == 0 ? 
						'https://test.yitongwang.com/public/static/images/minniapp/homepage_click@2x.png' :
						'https://test.yitongwang.com/public/static/images/minniapp/homepage_noclick@2x.png'">
					</image>
					<text>首页</text>
				</view>
				<view hover-class="none" @tap.stop='topages' data-idx="1" :class="{'tpd-footer-select': page == 1}">
					<image
						:src="page == 1 ?
						'https://test.yitongwang.com/public/static/images/minniapp/classification_click@2x.png' :
						'https://test.yitongwang.com/public/static/images/minniapp/classification_noclick@2x.png'">
					</image>
					<text>分类</text>
				</view>
				<view hover-class="none" @tap.stop='topages' data-idx="2" :class="{'tpd-footer-select': page == 2}">
					<image
						:src="page == 2 ?
						'https://test.yitongwang.com/public/static/images/minniapp/myshop_click@2x.png' :
						'https://test.yitongwang.com/public/static/images/minniapp/myshop_noclick@2x.png'">
					</image>
					<text>{{ is_store_member ? '我的小店' : '免费开店' }}</text>
				</view>
				<view hover-class="none" @tap.stop='topages' data-idx="3" :class="{'tpd-footer-select': page == 3}">
					<image
						:src="page == 3 ?
						'https://test.yitongwang.com/public/static/images/minniapp/shoppingcart_click@2x.png' :
						'https://test.yitongwang.com/public/static/images/minniapp/shoppingcart_noclick@2x.png'">
					</image><text>购物车</text>
				</view>
				<view hover-class="none" @tap.stop='topages' data-idx="4" :class="{'tpd-footer-select': page == 4}">
					<image
						:src="page == 4 ?
						'https://test.yitongwang.com/public/static/images/minniapp/my_click@2x.png' :
						'https://test.yitongwang.com/public/static/images/minniapp/my_noclick@2x.png'">
					</image><text>我的</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			defaultMenu: {type: Boolean, value: false},
			page: {type: String, value: ''},
			menu_model: {type: Array,value: []},
			url: {type: String, value: 'www.test.yitongwang.com'},
			is_store_member: {type: Boolean, value: false},
			isiphoneX: {type: Boolean, value: false}
		},
		data() {
			return {

			}
		},
		methods: {
			topages(e){
			  this.$emit('topages', {idx: e.currentTarget.dataset.idx});
			}
		}
	}
</script>

<style scoped src="./indexFootBar.css">

</style>
