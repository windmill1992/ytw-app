<template>
	<view>
		<!-- 用户信息开始 -->
		<view class="container">
			<view class='user_info'>
				<image src='https://www.yitongwang.com/public/static/images/minniapp/my-banner02.png'></image>
				<view class="index-right">
					<navigator url='/pages/distribut/set_store/set_store'>
						<image class="index-set" src="../../../static/images/s_1.png"></image>
					</navigator>
				</view>
				<view class='wrap'>
					<view class='user_info_header'>
						<image :src='data.user.head_pic ? data.user.head_pic:defaultAvatar'></image>
						<view class='details'>
							<view class='details_title'>{{data.user.nickname}}</view>
							<view class='details_content'>{{data.distribut_level}}</view>
							<view class='details_time' v-if="store">开店时间：{{store.store_time}}</view>
							<navigator class='details_time' v-else url="/pages/distribut/set_store/set_store">创建店铺
							</navigator>
						</view>
					</view>
					<view class='info_data'>
						<view class='commission'>
							<view class='sum'>{{data.user.distribut_money|| '0.00'}}</view>
							<view class='writing'>累计佣金</view>
						</view>
						<view class='income'>
							<view class='sum'>{{data.money.today_money|| '0.00'}}</view>
							<view class='writing'>今日收入</view>
						</view>
						<view class='total'>
							<view class='sum'>{{data.user.user_team_order.total_amount|| '0.00'}}</view>
							<view class='writing'>总销售额</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 用户信息结束 -->
			<!-- 提现金额模块开始 -->
			<view class='withdraw wrap'>
				<view class='brokerage_able'>
					<view class='brokerage_able_data'>
						<view class='data_sum'>{{data.user.withdraw || '0.00'}}</view>
						<view class='data_content'>可提现佣金（元）</view>
					</view>
					<navigator class='btn' url="/pages/distribut/team_commission/team_commission">申请提现</navigator>
				</view>
				<view class='brokerage_success'>
					<view class='data_sum'>{{data.user.withdrawing|| '0.00'}}</view>
					<view class='data_content'>提现中（元）</view>
				</view>
				<view class='brokerage_success'>
					<view class='data_sum'>{{data.user.distribut_withdrawals_money}}</view>
					<view class='data_content'>成功提现金额（元）</view>
				</view>
			</view>
			<!-- 提现金额模块结束 -->
			<!-- 导航模块开始 -->
			<view class='nav wrap clearfix'>
				<view catchtap='distributTopages' data-idx="3" class='nav_list'>
					<view class='image_box' style='background-color: #ff3d3d'>
						<image src='../../../static/images/distribut/retail_order@2x.png' class='nav_icon1'></image>
					</view>
					<view class='nav_detail'>
						<view class='nav_detail_content'>团队订单</view>
						<view class='nav_detail_sum'>{{data.user.user_team_order.order_count||0}} 笔 </view>
					</view>
				</view>

				<navigator class='nav_detail' url="/pages/distribut/team_commission/team_commission">
					<view class='nav_list' style="border-right:0rpx">
						<view class='image_box' style='background-color: #f6a60c'>
							<image src='../../../static/images/distribut/retail_brokerage@2x.png' class='nav_icon2'>
							</image>
						</view>
						<view class='nav_detail'>
							<view class='nav_detail_content'>团队佣金</view>
							<view style='color:ff3939;' class='nav_detail_sum'>￥{{data.user.rebate_money||0}}</view>
						</view>
					</view>
				</navigator>

				<view catchtap='distributTopages' data-idx="1" class='nav_list'>
					<view class='image_box' style='background-color: #3db4ff'>
						<image src='../../../static/images/distribut/retail_control@2x.png' class='nav_icon3'></image>
					</view>
					<view class='nav_detail'>
						<view class='nav_detail_content'>我的下线</view>
						<view class='nav_detail_sum'>{{data.user.user_team_order.user_count||0}} 人</view>
					</view>
				</view>

				<navigator class='nav_detail' url="/pages/user/withdrawals_list/withdrawals_list?type=1">
					<view class='nav_list' style="border-right:0rpx;border-bottom:0rpx;">
						<view class='image_box' style='background-color: #3ed126'>
							<image src='../../../static/images/distribut/retail_withdraw@2x.png' class='nav_icon4'>
							</image>
						</view>
						<view class='nav_detail'>
							<view class='nav_detail_content'>提现明细</view>
							<view class='nav_detail_sum'>{{data.user.rebate_log||0}} 笔</view>
						</view>
					</view>
				</navigator>
			</view>
			<!-- 导航模块结束 -->
			<!-- 其他信息模块开始 -->
			<view class='others wrap'>
				<view class='others_function' @tap.stop='distributSee'>
					<image src='../../../static/images/distribut/retail_help@2x.png' class='function_icon'
						style='width:33rpx;height:37rpx'></image>
					<view class='others_content'>新手必看</view>
					<image src='../../../static/images/xr_3.png' class='next_icon'></image>
				</view>
				<navigator :hidden="true" class='others_function' url='../poster/poster'>
					<image src='../../../static/images/distribut/retail_cardd@2x.png' class='function_icon'
						style='width:37rpx;height:32rpx'></image>
					<view class='others_content'>推广海报</view>
					<image src='../../../static/images/xr_3.png' class='next_icon'></image>
				</navigator>
			</view>
			<!-- 其他信息模块结束 -->
		</view>

		<!-- 底部菜单 -->
		<publics :page='page'></publics>

	</view>
</template>

<script>
	import publics from '../../index/publics/publics';
	var app = getApp();
	var request = app.request;
	var common = require('../../../static/utils/common.js');
	var util = require('../../../static/utils/util.js');
	export default {
		components: { publics },
		data() {
			return {
				data: null,
				defaultAvatar: "https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/user68.jpg",
				webUrl: '',
				page: 0,
				store: null,
			}
		},
		onShow: function() {
			this.getDistribut();
			this.getStore();
		},
		methods: {
			getStore: function() {
				var that = this;
				request.post('/api/Distribut/get_store', {
					successReload: true,
					success: function(res) {
						if (res.data.result) {
							res.data.result.store_time = util.format(res.data.result.store_time, 'yyyy-MM-dd');
							this.store = Object.assign({}, res.data.result);
						}
					}
				});
			},
			getDistribut: function() {
				var that = this;
				request.post('/api/Distribut/index', {
					successReload: true,
					success: function(res) {
						if (res.data.status == 1) {
							res.data.result.user.head_pic = common.getFullUrl(res.data.result.user.head_pic);
							this.data = Object.assign({}, res.data.result);
						}
					}
				});
			},
			/** 新手必看 */
			distributSee: function() {
				this.webUrl = "/api/Article/agreement?doc_code=create_circle";
				uni.navigateTo({
					url: '/pages/index/webview/webview'
				});
			},
			distributTopages: function(e) {
				common.todistribut(e.currentTarget.dataset.idx, this.page);
			}
		}
	}
</script>

<style scoped src="./index.css">

</style>
