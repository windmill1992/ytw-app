<template>
	<view>
		<!-- 团队信息开始 -->
		<view class="container">
			<view class='team_info'>
				<view class='team_tab clearfix'>
					<view class="team_tab_list" :class="{active: currentTab == 1}" data-current="1" @tap="clickTab">
						一级（{{one}}）</view>
					<view class="team_tab_list" :class="{active: currentTab == 2}" data-current="2" @tap="clickTab">
						二级（{{two}}）</view>
					<view class="team_tab_list" :class="{active: currentTab == 3}" data-current="3" @tap="clickTab">
						三级（{{three}}）</view>
				</view>
				<view class='prompt'>
					<image src='../../../static/images/distribut/crown@2x.png'></image>
					皇冠标志表示该用户为高级会员
				</view>
				<view class="team_details">
					<block v-for="(item, index) in teamList.lists" :key="'t' + index">
						<view class='team_details_list wrap' v-if="item.user_level.type == 1">
							<image :src='item.head_pic' class='header_image'></image>
							<view class='user_info'>
								<view class='user_name'>{{item.nickname}}
									<image src='../../../static/images/distribut/crown@2x.png'></image>
								</view>
								<view class='join_time'>加入时间：{{item.reg_time}}</view>
							</view>
							<view class='user_data'>
								<view class='consume'><text>获佣: + {{item.distribut_money}}</text></view>
								<view class='number'>{{item.user_type_data}} 位成员</view>
							</view>
						</view>

						<view class='team_details_list wrap' wx:else>
							<image :src='item.head_pic' class='header_image'></image>
							<view class='user_info'>
								<view class='user_name'>{{item.nickname}}
									<image src='../../images/distribut/team_header3@2x.png'></image>
								</view>
								<view class='join_time'>加入时间：{{item.reg_time}}</view>
							</view>
							<view class='user_data'>
								<view class='consume'>消费：<text>￥{{item.user_order.total_amount}}</text></view>
								<view class='consume'>献佣：<text>￥{{item.user_order.commission}}</text></view>
								<view class='number'>{{item.user_order.count}}笔订单</view>
							</view>
						</view>

					</block>
				</view>

			</view>
		</view>
		<!-- 团队信息结束 -->

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
	import LoadMore from '../../../static/utils/LoadMore.js';
	var load = new LoadMore;
	export default {
		components: { publics },
		data() {
			return {
				currentTab: 1,
				page: 1,
				one: 0,
				two: 0,
				three: 0,
				currentPage: 1,
				teamList: null,
			}
		},
		onLoad: function() {
			load.init(this, 'lists', 'teamList');
			this.getTeamList(this.currentTab);
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.getTeamList(this.currentTab);
			}
		},
		onPullDownRefresh: function(e) {
			this.resetData();
			this.getTeamList(this.currentTab);
		},
		methods: {
			getTeamList: function(level) {
				var that = this;
				load.request('/api/Distribut/lower_list/level/' + level + '?p=' + that.currentPage, function(res) {
					that.currentPage++;
					that.one = res.data.result.fcount;
					that.two = res.data.result.scount;
					that.three = res.data.result.tcount;
					if (res.data.result.lists) {
						res.data.result.lists.forEach(function(val, index, arr) {
							val.reg_time = util.format(val.reg_time, 'yyyy-M-d');
							val.head_pic = common.getFullUrl(val.head_pic)
						});
					}
				});
			},
			//事件处理函数
			clickTab: function(e) {
				var that = this;
				if (that.currentTab != e.target.dataset.current) {
					that.currentTab = e.target.dataset.current;
					that.resetData();
					that.getTeamList(e.target.dataset.current);
				}
			},
			distributTopages: function(e) {
				common.todistribut(e.currentTarget.dataset.idx, this.page);
			},
			//重置数据
			resetData: function() {
				load.resetConfig();
				this.teamList = null;
				this.currentPage = 1;
			},
		}
	}
</script>

<style scoped src="./team_list.css">

</style>
