<template>
	<view>
		<!-- 累计佣金模块开始 -->
		<view class='accumulative'>
			<view class="a_left">
				<view class='accumulative_content'>分销佣金</view>
				<view class='accumulative_number'>{{user.distribut_money|| '0.00'}}元</view>
			</view>
			<navigator url="/pages/user/withdrawals_list/withdrawals_list?type=1"
				class='accumulative_content w-details'>提现明细</navigator>
		</view>
		<!-- 累计佣金模块结束 -->
		<!-- 列表模块开始 -->
		<view class='commission'>
			<view class='withdrawable wrap'>
				<view class='commission_list'>
					<view class='commission_list_title'>可提现佣金</view>
					<view class='commission_list_data red'>{{user.withdraw|| '0.00'}}元</view>
				</view>
			</view>
			<view class='using_commission wrap'>
				<view class='commission_list'>
					<view class='commission_list_title'>已提现佣金</view>
					<view class='commission_list_data'>{{user.distribut_withdrawals_money|| '0.00'}}元</view>
				</view>
				<view class='commission_list'>
					<view class='commission_list_title'>待打款佣金</view>
					<view class='commission_list_data'>{{user.wait|| '0.00'}}元</view>
				</view>
			</view>

			<view class='other_commission wrap'>
				<view class='commission_list' bindtap="changeTab">
					<view class='commission_list_title'>用户须知</view>
					<image v-if="index_img==1" class="index_r" data-id='2' class="index_r"
						src="../../../static/images/xr_3.png"></image>
					<image v-if="index_img==2" class="index_r index_img" data-id='1' class="index_r"
						src="../../../static/images/xr_3.png"></image>
				</view>
				<view v-if="index_img==2" class="user_know">
					<view class='apply_description'>1.买家确认收货（
						<text>{{shopping.auto_service_date||0}}天</text>）后，佣金才可提现。结算期内，买家如退 货，佣金将自动扣除；
					</view>
					<view class='apply_description'>2.可用佣金满
						<text>{{distribut.distribut_withdrawals_money||0}}</text>元 才可申请提现。
					</view>
				</view>
			</view>
		</view>
		<!-- 列表模块结束 -->
		<!-- 申请提现功能模块开始 -->
		<view class='apply_cash wrap'>
			<navigator class='apply_btn' url="/pages/distribut/withdrawals/withdrawals">提现</navigator>
		</view>
		<!-- 申请提现功能模块结束 -->
	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	export default {
		data() {
			return {
				user: {},
				distribut: {},
				shopping: {},
				index_img: 1, // 须知
			}
		},
		onShow: function() {
			this.commission();
		},
		methods: {
			// 用户须知
			changeTab: function(e) {
				var index_img = this.index_img;
				if (index_img == 1) {
					this.index_img = 2;
				} else {
					this.index_img = 1;
				}
			},
			commission: function() {
				var that = this;
				request.post('/api/Distribut/distribut_detail', {
					successReload: true,
					success: function(res) {
						if (res.data.result) {
							that.shopping = Object.assign({}, res.data.result.shopping);
							that.distribut = Object.assign({}, res.data.result.distribut);
							that.user = Object.assign({}, res.data.result.user);
						}
					}
				});
			},
		}
	}
</script>

<style scoped src="./team_commission.css">

</style>
