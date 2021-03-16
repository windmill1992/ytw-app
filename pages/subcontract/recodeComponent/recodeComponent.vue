<template>
	<view>
		<view class="recodeComMask" @tap.stop="true" @touchmove.stop="true" v-if="showRecodeCom">
			<view class="recodeComBox"
				:style="'padding-bottom:' + slots == true ? '250rpx' : '80rpx' + ';padding-top:' + isNormal ? '50' : '15rpx'">
				<view class="recodeTop" v-if="isNormal">
					<view class="recodeComTitle">{{data1.manufactor_name}}
						<van-icon name="edit" style="vertical-align:middle;margin-left:2px;" color="#fff" size="50rpx"
							v-if="admin" @tap.stop="modifyFacName" />
					</view>
				</view>
				<scroll-view scroll-y class="recodeScroll">
					<view class="ecodeComAppoint" v-if="isNormal">
						<!--预约记录-->
						<view class="recodeItemTitle" style="color:#18c2ba;">预约记录</view>
						<view class="recodeItemHead">
							<text>时间</text>
							<text>厂名</text>
							<text>预约数量</text>
						</view>
						<view class="recodeItemBody" v-for="(item, index) in data1.reservation" :key="'res' + index">
							<view>
								<view class="recodeTimeAbs">{{ m1.brTime(item.create_time,'a') }}</view>
								<view>{{ m1.brTime(item.create_time,'b') }}</view>
							</view>
							<view
								:style="'color:' + (index>0&&(item.manufactor_name!=data.reservation[index-1].manufactor_name)) ? '#f10215' : '#555'">
								{{ (index>0&&(item.manufactor_name!=data1.reservation[index-1].manufactor_name) ) ? '改为' : '' }}{{ item.manufactor_name }}
							</view>
							<view
								:style="'color:' + (index>0&&(item.num!=data.reservation[index-1].num)) ? '#f10215' : '#555' + ';font-size:' + item.num == '拼包中心添加' ? '20rpx' : '28rpx' + ';line-height:65rpx;'">
								{{ (index>0&&(item.num!=data1.reservation[index-1].num) && item.num != '拼包中心添加') ? '改为' : '' }}{{ item.num }}{{ (item.num == '拼包中心添加' || item.num == '未填') ? '' : '手' }}
							</view>
						</view>
						<view class="recodeEmpty" v-if="data1.reservation.length == 0">暂无相关记录~</view>
					</view>
					<view class="ecodeComAppoint" v-if="isNormal && data1.receiving.length > 0"
						style="background-color:#e7f9f8;">
						<!--收货记录-->
						<view class="recodeItemTitle" style="color:#b5b9f9;">收货记录</view>
						<view class="recodeItemHead">
							<text>时间</text>
							<text>收货方式</text>
							<text>收货数量</text>
						</view>
						<view class="recodeItemBody" v-for="(item, index) in data1.receiving" :key="'rec' + index"
							v-if="item.num > 0">
							<view>
								<view class="recodeTimeAbs">{{ m1.brTime(item.create_time,'a') }}</view>
								<view>{{ m1.brTime(item.create_time,'b') }}</view>
							</view>
							<view style="color:{{ item.type == 1 ? '#999' : 'f10215' }};">
								<view><text
										:style="'color:' + m1.setReceiveColor(item.receive_type)">{{ item.text || '正常收货' }}</text>
								</view>
								<view><text space="ensp" class="adminName">{{ item.admin_name + ' ' }}</text></view>
							</view>
							<view style="line-height:65rpx;"><text
									:style="'color:' + (item.receive_type == 2 || item.receive_type == 3) ? '#f10260' : ''">{{ (item.receive_type == 2 || item.receive_type == 3) ? '-' : '+' }}{{ item.num }}手</text>
								<van-icon name="edit" style="vertical-align:middle;" color="#18c2ba" size="50rpx"
									v-if="admin && item.receive_type != 3 && item.receive_type != 4"
									@tap.stop="modifyItem" :data-info="item" data-type="receiving" />
							</view>
						</view>
						<view v-if="data1.receiving.length > 0">
							<view></view>
							<view></view>
							<view class="recodeAllSum">合计：{{ data1.receive_num }}手</view>
						</view>
						<view class="recodeEmpty" v-if="data1.receiving.length == 0">暂无相关记录~</view>
					</view>
					<view class="ecodeComAppoint" v-if="isNormal && data1.packing.length > 0"
						style="background-color:#e7f9f8;">
						<!--打包记录-->
						<view class="recodeItemTitle" style="color:#f9c174;">打包记录</view>
						<view class="recodeItemHead">
							<text>时间</text>
							<text>操作员</text>
							<text>打包数量</text>
						</view>
						<view class="recodeItemBody" v-for="(item, index) in data1.packing" :key="'pack' + index"
							v-if="item.num > 0">
							<view>
								<view class="recodeTimeAbs">{{ m1.brTime(item.create_time,'a') }}</view>
								<view>{{ m1.brTime(item.create_time,'b') }}</view>
							</view>
							<view>{{ item.admin_name }}</view>
							<view style="line-height:65rpx;">{{ item.num }}手
								<van-icon name="edit" color="#18c2ba" size="50rpx" v-if="admin"
									style="vertical-align:middle;" @tap.stop="modifyItem" :data-info="item"
									data-type="packing" />
							</view>
						</view>
						<view v-if="data1.packing.length > 0">
							<view></view>
							<view></view>
							<view class="recodeAllSum">合计：{{ data1.packing_num }}手</view>
						</view>
						<view class="recodeEmpty" v-if="data1.packing.length == 0">暂无相关记录~</view>
					</view>
					<view class="ecodeComAppoint" v-if="isNormal && data1.take_away.length > 0"
						style="background-color:#e7f9f8;">
						<!--拉包 记录-->
						<view class="recodeItemTitle" style="color:#6eb6ff;">拉包明细</view>
						<view class="recodeItemHead">
							<text>时间</text>
							<text>操作员</text>
							<text>拉包数量</text>
						</view>
						<view class="recodeItemBody" v-for="(item, index) in data1.take_away" :key="'take' + index"
							v-if="item.num > 0">
							<view>
								<view class="recodeTimeAbs">{{ m1.brTime(item.create_date,'a') }}</view>
								<view>{{ m1.brTime(item.create_date,'b') }}</view>
							</view>
							<view>{{ item.admin_name }}</view>
							<view style="line-height:65rpx;">{{ item.num }}手
								<van-icon size="50rpx" name="edit" color="#18c2ba" style="vertical-align:middle;"
									v-if="{{ false }}" @tap.stop="modifyItem" :data-info="item" data-type="take_away" />
							</view>
						</view>
						<view v-if="data1.take_away.length > 0">
							<view></view>
							<view></view>
							<view class="recodeAllSum">合计：{{ data1.take_away_num }}手</view>
						</view>
						<view class="recodeEmpty" v-if="data1.take_away.length == 0">暂无相关记录~</view>
					</view>
					<view v-if="!isNormal">
						<view class="historyAuditCom">
							<view class="col18c">历史审核记录</view>
							<view class="historyAuditComHead">
								<text>时间</text>
								<text>厂名</text>
								<text>数量</text>
								<text>状态</text>
							</view>
							<view class="historyAuditComBody" v-for="(item, index) in data1.history"
								:key="'his' + index">
								<view style="line-height:30rpx;">
									<view>{{m1.brTime(item.date,'a')}}</view>
									<view>{{m1.brTime(item.date,'b')}}</view>
								</view>
								<view>{{item.manufactor_name}}</view>
								<view>{{item.num}}手</view>
								<view>
									<van-radio-group v-if="item.status == 1" value="1">
										<van-radio custom-class="absRadio" checked-color="#18c2ba" name="1"></van-radio>
									</van-radio-group>
									<van-icon v-if="item.status == 2" color="#f10215" style="margin-top:10rpx;"
										name="clear" size="38rpx" />
								</view>
							</view>
							<view class="recodeEmpty" v-if="data1.history.length == 0">暂无相关记录~</view>
						</view>
						<view class="newAuditCom">
							<view class="col18c">新增厂家待审核</view>
							<view class="colee9397">最晚封包时间：{{ data1.appointment_time }}</view>
							<view class="historyAuditComBody" v-for="(item, index) in data1.audit" :key="'aud' + index"
								:style="'background-color:' + item.lj ? '#18c2ba' : '#fff' + ';color:' + item.lj ? '#fff' : '#333'"
								@tap.stop="clickNewAudit" :data-index="index" :data-info="item">
								<view style="line-height:30rpx;">
									<view>{{m1.brTime(item.create_date,'a')}}</view>
									<view>{{m1.brTime(item.create_date,'b')}}</view>
								</view>
								<view>{{item.manufactor_name}}</view>
								<view>{{item.num}}手</view>
								<view>
									<van-radio-group v-if="item.lj" value="1">
										<van-radio custom-class="absRadio" checked-color="#18c2ba" name="1"></van-radio>
									</van-radio-group>
									<van-radio-group v-if="!item.lj" value="1">
										<van-radio custom-class="absRadio" checked-color="#ccc" name="1"></van-radio>
									</van-radio-group>
								</view>
							</view>
							<view class="recodeEmpty" v-if="data1.audit.length == 0">暂无新增待审核~</view>
						</view>
					</view>
				</scroll-view>
				<slot name="receiveSlot" v-if="slots"></slot>
				<slot name="auditSlot"></slot>
			</view>
			<view class="closeRecodeCom" @tap.stop="closeRecodeCom">X</view>
		</view>
	</view>
</template>

<script lang="wxs" module="m1">
	var brTime = function(t, type) {
		var t = t.split(' ')
		return type == 'a' ? t[0] : t[1]
	}
	var getSum = function(data) {
		if (data.length > 0) {
			if (data.length == 1) {
				return data[0].num
			} else {
				var num = 0
				data.forEach(function(item) {
					num += (item.num - 0)
				})
				return num
			}
		}
	}
	var setReceiveColor = function(i) {
		if (i == 0 || i == 1) {
			return "#999"
		} else if (i == 2) {
			return "#f10260"
		} else if (i == 3) {
			return "#f10260"
		} else if (i == 4) {
			return "#f10260"
		}
	}
	module.exports = {
		brTime,
		getSum,
		setReceiveColor
	}
</script>
<script>
	import vanIcon
	from "@/wxcomponents/vant/dist/icon/index";
	import vanRadio
	from "@/wxcomponents/vant/dist/radio/index";
	import vanRadioGroup
	from "@/wxcomponents/vant/dist/radio-group/index";
	export default {
		components: {
			vanIcon,
			vanRadio,
			vanRadioGroup
		},
		props: {
			data1: {
				type: Object,
				value: {}
			},
			isNormal: {
				type: Boolean,
				value: true
			},
			receive: {
				type: Boolean,
				value: false
			},
			edit: {
				type: Boolean,
				value: false
			},
			admin: {
				type: Boolean,
				value: false
			},
			showRecodeCom: {
				type: Boolean,
				value: true
			},
			slots: {
				type: Boolean,
				value: false
			},
		},
		data() {
			return {

			}
		},
		methods: {
			clickItem: function(e) {
				console.log(e)
			},
			closeRecodeCom: function() {
				this.$emit('closeLog', {})
			},
			clickNewAudit: function(e) {
				this.$emit('clickAudit', {
					info: e.currentTarget.dataset.info,
					index: e.currentTarget.dataset.index
				})
			},
			modifyItem: function(e) {
				var par = {
					type: e.currentTarget.dataset.type,
					info: e.currentTarget.dataset.info
				}
				this.$emit('modify', par)
			},
			modifyFacName: function(e) {
				this.$emit('modifyFacName', '')
			}
		}
	}
</script>

<style scoped src="./recodeComponent.css">

</style>
