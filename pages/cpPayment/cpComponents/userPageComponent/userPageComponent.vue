<template>
	<view>
		<view class="userPage">
			<view class="userPageHead">
				<text class="u_name">Andy</text>
				<text class="u_user_level">散客</text>
				<image class="u_edit_user"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontract-icon-write.png"></image>
				<text class="u_mobile">18978787878</text>
				<image class="u_make_phone"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontract-icon-write.png"></image>
			</view>
			<view class="u_line"></view>
			<view class="userPageDot">
				<view class="u_d_item u_d_item_after_border">
					<view class="u_d_item_t">￥6545</view>
					<view class="u_d_item_b">总交易额</view>
				</view>
				<view class="u_d_item u_d_item_after_border">
					<view class="u_d_item_t">￥7878</view>
					<view class="u_d_item_b">总欠款</view>
				</view>
				<view class="u_d_item u_d_item_after_border">
					<view class="u_d_item_t">654件</view>
					<view class="u_d_item_b">总销量</view>
				</view>
				<view class="u_d_item">
					<view class="u_d_item_t">65件</view>
					<view class="u_d_item_b">待发货</view>
				</view>
			</view>
			<view class="userPageNavs">
				<view data-type="a" @tap.stop="switchNav" class="u_nav" :class="{u_nav_current: navType == 'a'}">采购记录
				</view>
				<view data-type="b" @tap.stop="switchNav" class="u_nav borderLR"
					:class="{u_nav_current: navType == 'b'}">结算记录</view>
				<view data-type="c" @tap.stop="switchNav" class="u_nav" :class="{u_nav_current: navType == 'c'}">发货记录
				</view>
			</view>
			<view class="userPageTime">
				<view class="o_time_select" @tap.stop="chooseCalendar" :hidden="dateRange.length > 0">
					<image class="u_t_image1" src="../../../../static/images/qr-code.png"></image>
					<text>请选择日期</text>
					<image class="u_t_image2" src="https://www.yitongwang.com/public/static/images/ddn.png"></image>
				</view>
				<view class="u_time_selected" @tap.stop="chooseCalendar" :hidden="dateRange.length == 0">
					<text>{{dateRange[0]}}</text>
					<text> -- </text>
					<text>{{dateRange[1]}}</text>
				</view>
			</view>
			<view class="navT1" :hidden="navType != 'a'">
				<!-- 采购/ 交易 记录 -->
				<view class="navItem1" v-for="(item, index) in 5" :key="'n1' + index">
					<view class="u_time_day p_b">2015-12-36</view>
					<view class="u_order" v-for="(item1, index2) in 2" :key="'n2' + index + index2">
						<view class="u_time_hour" :style="'border-top:' + index > 0 ? '1px solid #eee;' : 'none'">
							<text style="flex:.8;">15:59</text>
							<text style="flex:2.5;">订单编号:65654564654654654658</text>
							<text class="absArrow" style="flex:.2;"></text>
						</view>
						<view class="u_order_nums p_b letter_spacing2">
							<view class="u_order_nums_l">
								<text class="col3b">本单金额：<text class="col4n">￥454</text></text>
								<text class="col3b">本单已付：<text class="col4n">￥454</text></text>
								<text class="col3b">本单欠款：<text class="fd626a"
										style="font-weight: normal;">￥454</text></text>
							</view>
							<view class="u_order_nums_r">
								<text class="col3b"><text class="bgorange">下单数量：<text
											class="col4n">24件</text></text></text>
								<text class="col3b"><text class="bgorange">商家发货：<text
											class="col4n">24件</text></text></text>
								<text class="col3b"><text class="bgorange">商家未发：<text
											class="col4n">24件</text></text></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="navT2" :hidden="navType != 'b'">
				<view class="navItem2 p_b" v-for="(item, index) in 6" :key="'n3' + index">
					<text style="flex:1;">2015-78-89 15:15</text>
					<text style="flex:.8;" class="u_nav2_2">{{ '付款' }} {{'￥456'}}</text>
					<text class="absArrow" style="flex:.2;"></text>
				</view>
			</view>
			<view class="navT3 letter_spacing2" hidden="{{ navType != 'c' }}">
				<view class="navItem3">
					<view class="navItem1" v-for="(item, index) in 5" :key="'n4' + index">
						<view class="u_time_day p_b">2015-12-36</view>
						<view class="u_order" wx:for="{{2}}" wx:key="index">
							<view class="u_time_hour" :style="'border-top:' + index > 0 ? '1px solid #eee;' : 'none'">
								<text style="flex: 1;">15:59</text>
								<text style="flex:1;"></text>
								<text style="flex:1;text-align: right;font-weight: bold;" class="colpurple">发货凭证</text>
							</view>
							<view class="u_nav3_good_item" :class="{u_nav3_good_item_border: index > 0}"
								v-for="(item, index) in 3" :key="'n5' + index">
								<image class="u_nav3_good_item_image"
									src="http://yitongwanghuabei3.oss-cn-zhangjiakou.aliyuncs.com/public/upload/b6012f4c73994aaef1fe0a0856932e7b.png">
								</image>
								<view class="u_nav3_good_item_l">
									<text>564-A-J</text>
									<text>下单数:26件</text>
									<text>本次发:26件</text>
								</view>
								<view class="u_nav3_good_item_r">
									<text class="coltheme">查看订单</text>
									<text>累计:{{ '45' }}件</text>
								</view>
							</view>

						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 日历 组件 showCalendar -->
		<uni-calendar @touchmove.stop="true" :show="showCalendar" type="range" color="#18c2ba" position="bottom"
			row-height="56" allow-same-day :min-date="minDate" :max-date="maxDate" :default-date="dateRange2"
			title="选择查看范围" @close="onCalendarClose" @confirm="onCalendarConfirm" />
	</view>
</template>

<script>
	export default {
		props: {
			navType: {
				type: String,
				value: 'a'
			},
			minDate: {
				type: Number,
				value: 0
			}, //默认时间最小
			maxDate: {
				type: Number,
				value: 0
			}, //默认时间最大
			dateRange2: {
				type: Array,
				value: []
			}, //默认时间最大
		},
		data() {
			return {
				showCalendar: false,
				dateRange: [],
			}
		},
		methods: {
			onCalendarConfirm(e) { //确定日历选择 //时间处理看接口再弄
				var t1 = +new Date(e.detail[0])
				var t2 = +new Date(e.detail[1])
				var tr1 = util.format(t1 / 1000, 'yyyy-M-d')
				var tr2 = util.format(t2 / 1000, 'yyyy-M-d')
				this.dateRange = [tr1, tr2]; //显示的时间
				this.showCalendar = false;
				this.$emit('timeSelected', {
					tr1,
					tr2
				})
			},
			switchNav(e) {
				var type = e.currentTarget.dataset.type
				if (this.navType == type) {
					return
				}
				this.$emit('navChange', {
					type
				}) //把最新的传递回页面
			},
			chooseCalendar() { // 打开日历选择
				this.showCalendar = true;
			},
			onCalendarClose() { //关闭日历选择
				this.showCalendar = false;
			},
		}
	}
</script>

<style scoped src="./userPageComponent.css">

</style>
