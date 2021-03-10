<template>
	<view>
		<!-- clickAdd 先不区分 A B 后面要区分开 -->
		<!-- type="a" screenItems="{{screenItems}}"  批发商视角 -->
		<!-- type="b" screenItems="{{screenItems2}}" 厂 家 视角 -->
		<user type="b" @confirmSearch="confirmSearch" @clickAdd="clickAdd" @getSearchVal="getSearchVal"
			:userList="userList" :screenItems="screenItems2" @triggerReq="triggerReq"></user>

		<!-- 底部的菜单项  不放在组件中 -->
		<view class="facBottom">
			<view class="box">
				<view class="bottomItemTxt">
					<view class="BottomItem">供应商 {{ '150' }}个</view>
					<view class="BottomItem colfe1919">总欠款 ￥{{'45840045'}}</view>
					<view class="BottomItem colTheme">待发货 {{ '90' }}件</view>
				</view>
				<view class="bottomDotted">
					<uni-icons name="more-o" @tap.stop="showDotted" size="50rpx" color="#18c2ba"
						style="position:absolute;left:50%;top:50%;transform: translate(-50%,-50%)" />
				</view>
			</view>
		</view>
		<view class="dottedOperations colTheme" v-if="showOverlay2">
			<view @tap.stop="clickDottedOpera" data-type="a" class="dottedOperation operaAfterLine">待您确认<text
					class="colfe1919">(2)</text></view>
			<view @tap.stop="clickDottedOpera" data-type="b" class="dottedOperation operaAfterLine">供应商审核中<text
					class="colfe1919">(2)</text></view>
			<view @tap.stop="clickDottedOpera" data-type="c" class="dottedOperation">供应商退款信息<text
					class="colfe1919">(2)</text></view>
		</view>

		<!-- 遮罩 -->
		<view class="overlay2" @touchmove.stop="true" @tap.stop="closeOverlay2" v-if="showOverlay2"></view>
	</view>
</template>

<script>
	import user from '../cpComponents/userList/userList';
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	export default {
		data() {
			return {
				url: setting.url,
				screenItems2: [{
						sort: 'asc',
						index: 0,
						url: 'a',
						txt: '客户'
					},
					{
						sort: 'asc',
						index: 1,
						url: 'b',
						txt: '欠款'
					},
					{
						sort: 'asc',
						index: 2,
						url: 'c',
						txt: '结余'
					},
					{
						sort: 'asc',
						index: 3,
						url: 'd',
						txt: '待发货'
					},
					{
						sort: 'asc',
						index: 4,
						url: 'e',
						txt: '筛选'
					},

				],
				screenItems: [{
						sort: 'asc',
						index: 0,
						url: 'a',
						txt: '供应商'
					},
					{
						sort: 'asc',
						index: 1,
						url: 'b',
						txt: '应付'
					},
					{
						sort: 'asc',
						index: 2,
						url: 'c',
						txt: '余额'
					},
					{
						sort: 'asc',
						index: 3,
						url: 'd',
						txt: '未发货'
					},
					{
						sort: 'asc',
						index: 4,
						url: 'e',
						txt: '筛选'
					},

				],
				showOverlay2: false,
				userList: [], //存放用户列表
			}
		},
		onLoad: function(options) {
			var that = this
			request.get(that.url + '/api/Supplier/buyerList', {
				data: { },
				success: function(res) {
					that.userList = res.data.result;
				}
			})
		},
		methods: {
			confirmSearch: function(e) { //搜索的确定
				console.log(e)
			},
			clickAdd: function(e) { //点击新增按钮 //后面要区分 A B

			},
			triggerReq: function(e) { //发起 组件内 触发的请求
				console.log(e.detail)
			},
			showDotted: function() { //显示遮罩
				this.showOverlay2 = true;
			},
			closeOverlay2: function() { //触发关闭遮罩
				this.showOverlay2 = false;
			},
			clickDottedOpera: function(e) {
				var type = e.currentTarget.dataset.type
				if (type == 'a') {

				} else if (type == 'b') {

				} else if (type == 'c') {

				}
			},
		}
	}
</script>

<style scoped src="./fac_user.css">

</style>
