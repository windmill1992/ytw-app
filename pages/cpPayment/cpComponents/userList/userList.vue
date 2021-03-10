<template>
	<view>
		<view class="zindex10 fixedTop" id="fixedTop">
			<!-- 顶部搜索&新增 -->
			<view class="search">
				<input type="text" class="searchInput" :value="searchVal" @input="getSearchVal"
					@confirm="confirmSearch"></input>
				<view class="addNewUser ba18c" hover-class="hoverAdd" @tap.stop="clickAdd">
					{{ type == 'b' ? '新增客户' : '新增供应商' }}</view>
			</view>
			<!-- 筛选头部 -->
			<view class="screenHead">
				<view v-for="(item, index) in screenItems" :key="'scr' + index" class="screenItem"
					:class="{currentScreen: curScreenIndex == index}" :data-p="item.p" :data-index="item.index"
					@tap.stop="clickTableHead">
					<text class="screenItemTxt" :class="{currentTxt: curScreenIndex == index}">{{ item.txt }}</text>
					<image class="screenItemImage" :class="{curScreenImg: curScreenIndex == index}"
						src="../../../../static/images/my.png"></image>
				</view>
			</view>
		</view>
		<!-- 两个筛选 -->
		<!-- 供应商列表筛选 -->
		<view class="screenA" :style="'top:' + (height + 16) + 'px;right: ' + screenARight" v-if="type == 'a'">
			<view @tap.stop="clickScreenB" data-index="0" data-url="all" class="screenAItem selectedScreenA">全 部</view>
			<view @tap.stop="clickScreenB" data-index="1" data-url="yfk" class="screenAItem">应付款</view>
			<view @tap.stop="clickScreenB" data-index="2" data-url="yye" class="screenAItem">有余额</view>
			<view @tap.stop="clickScreenB" data-index="3" data-url="wfh" class="screenAItem">未发货</view>
			<view @tap.stop="clickScreenB" data-index="4" data-url="tygys" class="screenAItem">停用供应商</view>
		</view>
		<view class="screenB" :style="'padding-top:' + (height + 25) + 'px;right:' +  screenBRight" v-if="type == 'b'"
			@tap.stop="true" @touchmove.stop="true">
			<view class="screenB_1">
				<view class="screenBLabel">按状态查看</view>
				<view class="screenB_1_items">
					<view @tap.stop="clickScreenA" data-type="a1" class="screenB_1_item"
						:class="{selectedScreenB_1: index == selectedScreen1index}"
						:style="index == 5 ? 'font-size:22rpx;' : ''" v-for="(item, index) in screenA1"
						:key="'scr_a1' + index" :data-index="index">{{ item.txt }}</view>
				</view>
			</view>
			<view class="screenB_2">
				<view class="screenBLabel">按等级查看</view>
				<view class="screenB_2_items">
					<view @tap.stop="clickScreenA" data-type="a2" class="screenB_2_item"
						:class="{selectedScreenB_2: index == selectedScreen2index}" v-for="(item, index) in screenA2"
						:key="'scr_a2' + index" :data-index="index">{{ item.txt }}</view>
				</view>
			</view>
			<view class="screenB_btns">
				<text class="screenB_btn1" @tap.stop="resetScreen">重置</text>
				<text class="screenB_btn2">确定</text>
			</view>
		</view>
		<!-- 蒙层 z-index 3 -->
		<view class="overLay" @touchmove.stop="true" @tap.stop="clickOverLay" v-if="showOverlay"></view>

		<!-- <view :style="'margin-top:' + height + 'px;background-color:#fff;'">
		  <uni-index-bar :sticky-offset-top="height" z-index="6">
		    <view class="indexIIi" v-for="(item, index) in userList" :key="'u' + index">
		      <uni-index-anchor :index="item.letter" />
					<view class="userItem" v-for="(item1, index1) in 20" :key="'n' + index + index1">
						<view class="userItemL">
							<view>我是名字</view>
							<view>我是备注</view>
							<view>15045457778</view>
						</view>
						<view class="userItemR">
							<view class="colfe1919">应付款：￥{{ '45132' }}</view>
							<view class="coltheme">未发货：￥{{ '41' }}件</view>
						</view>
					</view>
				</view>
		  </uni-index-bar>
		</view> -->

	</view>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				value: ''
			}, //a 批发商视角 b厂家视角
			screenItems: {
				type: Array,
				value: []
			},
			userList: {
				type: Array,
				value: []
			}
		},
		data() {
			return {
				screenA1: [ // A 类筛选 1
					{
						txt: '全部',
						index: 0,
						url: 'all'
					},
					{
						txt: '欠款客户',
						index: 1,
						url: 'qkkh'
					},
					{
						txt: '结余客户',
						index: 2,
						url: 'jykh'
					},
					{
						txt: '待发货客户',
						index: 3,
						url: 'dfhkh'
					},
					{
						txt: '停用客户',
						index: 4,
						url: 'tykh'
					},
					{
						txt: '可看私密商品客户',
						index: 5,
						url: 'smkh'
					},
				],
				screenA2: [ // A 类筛选 2
					{
						txt: '全部',
						index: 0,
						url: 'all'
					},
					{
						txt: '大客',
						index: 1,
						url: 'dk'
					},
					{
						txt: '小客',
						index: 2,
						url: 'xk'
					},
					{
						txt: '散客',
						index: 3,
						url: 'sk'
					}
				],
				selectedScreen1index: 0, //选中的 A 类筛选index 1 默认全部0
				selectedScreen2index: 0, //选中的 A 类筛选index 2 默认全部0
				height: 0, //到索引位置 顶部高度
				screenBRight: '-1200rpx', //筛选B 弹出框 right值
				screenARight: '-600rpx', //筛选A 弹出框 right值
				showOverlay: false, //是否 显示遮罩
				searchVal: '', //搜索框内容
				curScreenIndex: 0, //当前选中高亮的表头索引
				paramsB: { //批发商视角 参数
					a: 'user', //表头选择项
					asc: 'asc', //排序
					sc1: 'all', //筛选项1
					sc2: 'all', //筛选项2
				},
				paramsA: { //厂家视角 参数
					a: 'user', //表头选择项
					asc: 'asc', //排序
					sc1: 'all', //筛选项1
				},
			}
		},
		onLoad: function() {
			var that = this
			uni.createSelectorQuery().in(this).select('#fixedTop').boundingClientRect(function(rect) {
				that.height = rect.height;
			}).exec()
		},
		methods: {
			getSearchVal: function(e) {
				this.$emit('handleInput', e.detail.value);
			},
			clickTableHead: function(e) { //设置显示 筛选A  筛选B
				if (this.showOverlay) {
					return
				}
				var index = e.currentTarget.dataset.index
				var sort = this.screenItems[index].sort
				if (index != '4') {
					if (this.type == 'a') { //当前是批发商视角
						this.curScreenIndex = index;
						this[`paramsA.a`] = this.screenItems[index].url;
						this[`paramsA.asc`] = this.screenItems[index].sort;
						this[`screenItems[${index}].sort`] = sort == 'asc' ? 'desc' : 'asc';
						this.$emit("triggerReq", this.paramsA);
					} else { //当前是 厂家 视角
						this.curScreenIndex = index;
						this[`paramsB.a`] = this.screenItems[index].url;
						this[`paramsB.asc`] = this.screenItems[index].sort;
						this[`screenItems[${index}].sort`] = sort == 'asc' ? 'desc' : 'asc';
						this.$emit("triggerReq", this.paramsB)
					}
				} else {
					if (this.type == 'b') {
						this.screenBRight = 0;
						this.screenARight = '-600rpx';
						this.showOverlay = true;
					} else {
						this.screenARight = 0;
						this.screenBRight = '-1200rpx';
						this.showOverlay = true;
					}
				}
			},
			clickOverLay: function() { //点击遮罩
				this.screenBRight = '-1200rpx';
				this.screenARight = '-600rpx';
				this.showOverlay = false;
			},
			confirmSearch: function(e) { //确定搜索框
				this.$emit('confirmSearch', {
					search: e.detail.value
				})
			},
			clickAdd: function() { //点击add按钮
				this.$emit('clickAdd', {})
				return
				if (this.type == 'a') {
					this.$emit('clickAddA', {})
				} else if (this.type == 'b') {
					this.$emit('clickAddB', {})
				}
			},
			clickScreenA: function(e) { //点击 厂家视角 筛选选项
				var index = e.currentTarget.dataset.index;
				var type = e.currentTarget.dataset.type;
				if (type == 'a1') {
					this.selectedScreen1index = index;
					this[`paramsB.sc1`] = this.screenA1[index].url;
				} else {
					this.selectedScreen2index = index;
					this[`paramsB.sc2`] = this.screenA2[index].url;
				}
				this.$emit("triggerReq", this.paramsB);
			},
			clickScreenB: function(e) { //点击 批发商视角 筛选选项
				var index = e.currentTarget.dataset.index;
				var url = e.currentTarget.dataset.url;
				this.selectedScreen2index = index;
				this[`paramsA.sc1`] = url;
				this.$emit("triggerReq", this.paramsA);
			},
			resetScreen: function() { //重置筛选选项
				this.selectedScreen1index = 0;
				this.selectedScreen2index = 0;
				this[`paramsB.sc1`] = 'all';
				this[`paramsB.sc2`] = 'all';
				this.$emit("triggerReq", this.paramsB);
			},
		}
	}
</script>

<style scoped src="./userList.css">

</style>
