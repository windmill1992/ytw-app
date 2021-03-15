<template>
	<view>
		<custom  />
		<!-- 底部菜单 -->
		<!-- <import src="../../index/publics/publics.wxml"/>
		<block wx:if="{{menu_model.length > 0}}">
		         <template is="model" data="{{page:menu_index,menu_model:menu_model,url:url,defaultMenu:defaultMenu}}" />
		</block>
		<block wx:else>
		        <template is="model"   data="{{page:0,menu_model:[],url:url,defaultMenu:defaultMenu}}" />
		</block> -->
		<footbar :page="4" :menu_model="menu_model" :url="url" :defaultMenu="defaultMenu" :is_store_member="is_store_member" 
			:isiphoneX="isiphoneX" @topages="topages"></footbar>
		<!-- 选择地址弹框  -->
		<!-- <import src="../../../utils/regions/regions.wxml"/>
		<template is="regions" :data="regions"/> -->
	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	var common = require('../../../static/utils/common.js');
	import Regions from '../../../static/utils/regions/Regions.js';
	export default {
		data() {
			return {
				url: setting.url,
				menu_model: app.globalData.menu_model,
				menu_index: 0,//菜单索引
				defaultMenu: false,  //默认底部菜单显示状态
				is_store_member: false,
				isiphoneX: uni.getStorageSync('isiphoneX') || false,
			}
		},
		methods: {
			/** 默认菜单 */
			topages: function (e) {
			    var idx = e.currentTarget.dataset.idx;
			    app.globalData.menu_index = idx;
			    common.defaultTotabar(idx, 0);
			},
		}
	}
</script>

<style>

</style>
