<template>
	<view>
		<!-- 底部菜单 -->
		<view  class="pos_fixed" >
		    <!-- 我的分销底部导航 -->
		    <view class="tpd-footer tpd-footer1" :style="'padding-bottom:' + isiphoneX ? '40rpx' : '0'">
		        <view hover-class="none" @tap.stop='distributTopages'  data-idx="4" :class="page == 4 ? 'tpd-footer-select sopFooterItem' : 'sopFooterItem'">
							<image :src="page == 4 ? 'https://test.yitongwang.com/public/static/images/minniapp/productlis_click@2x.png' : 'https://test.yitongwang.com/public/static/images/minniapp/productlis_noclick@2x.png'"></image>
							<text>商品列表</text>
						</view>
		        <view hover-class="none" @tap.stop='distributTopages'  data-idx="3" :class="page == 3 ? 'tpd-footer-select sopFooterItem' : 'sopFooterItem'">
							<image :src="page == 3 ? 'https://test.yitongwang.com/public/static/images/minniapp/orderlist_click@3x.png' : 'https://test.yitongwang.com/public/static/images/minniapp/orderlist_noclick@2x.png'"></image>
							<text>订单管理</text>
						</view>
		        <view class="addNewGoods none sopFooterItem" @tap.stop="addNewGoods"><view class="addNewGoodsImg">+</view><text>发布新品</text></view>
		        <view hover-class="none" @tap.stop='distributTopages'  data-idx="5" :class="page == 5 ? 'tpd-footer-select sopFooterItem' : 'sopFooterItem'">
							<image :src="page == 5 ? 'https://test.yitongwang.com/public/static/images/minniapp/myclients_click@2x.png' : 'https://test.yitongwang.com/public/static/images/minniapp/myclients_noclick@2x.png'}}"></image>
							<text>{{ is_A == 1 ? 'VIP客户' : '我的客户' }}</text>
						</view>
		        <view  hover-class="none" @tap.stop='distributTopages'  data-idx="2" :class="page == 2 ? 'tpd-footer-select sopFooterItem':'sopFooterItem'">
							<image :src="page == 2 ? 'https://test.yitongwang.com/public/static/images/minniapp/capitalaccount_click@2x.png' : 'https://test.yitongwang.com/public/static/images/minniapp/capitalaccount_noclick@2x.png'}}"></image>
							<text>店铺管理</text>
						</view>
		    </view>
		  </view>
		</template>
	</view>
</template>

<script>
	var app = getApp();
	var setting = app.globalData.setting;
	export default {
		props: {
			page: {type: Number, value: 4},
			isiphoneX: {type: Boolean, value: false},
			is_A: {type: Boolean, value: false},
			isGoodsList: {type: Boolean, value: false},
			menu_model: {type: Array, value: []},
			url: {type: String, value: ''},
			defaultMenu: {type: Boolean, value: ''},
		},
		data() {
			return {
				url: setting.url
			}
		},
		methods: {
			distributTopages: function() {
				
			},
			addNewGoods: function() {},
		}
	}
</script>

<style>

</style>
