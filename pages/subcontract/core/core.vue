<template>
	<view>
		<view class="fixedUnderground"></view>
		<view class="mainOperationBox rela" style="overflow:unset;">
			<view class="screenSearch">
				<text class="showScreen abs bg18c" @tap.stop="showScreen" v-if="type == 1 || type == 2">筛选</text>
				<view class="screenSearchItemBox abs" v-if="seeScreen">
					<view class="screenSearchItem" v-for="(item, index) in screenItems" hover-class="hoverScreenItem"
						:key="'sc' + index" :data-index="item.i" @tap.stop="clickScreenItem">{{ item.name }}</view>
				</view>
				<view class="searchBox">
					<input :hidden="searchInputType == 'number'" placeholder="确认码/预约人" class="PopupInput"
						@confirm="searchOrder" type="text" @focus="isNumberNo" confirm-type="search"
						@input="searchInput" :value="searchTxt" :maxlength="searchInputType == 'number' ? 5 : 12"
						style="left:35rpx;text-align:left;border: none;background: #efefef;width:400rpx;">
					<view class="quickReceive" @tap="ffocusInput">+</view></input>
					<input :hidden="searchInputType == 'text'" placeholder="确认码/预约人" class="PopupInput"
						@confirm="searchOrder" type="number" confirm-type="search" @input="searchInput"
						@keyboardheightchange="keyboardheightchange" :focus="ffooccuuss" :value="searchTxt"
						:maxlength="searchInputType == 'number' ? 5 : 12"
						style="left:35rpx;text-align:left;border: none;background: #efefef;width:400rpx;">
					<view class="quickReceive" @tap="ffocusInput">+</view></input>
				</view>
			</view>
		</view>

		<view class="orderListBox">
			<view class="orderItem rela"
				:style="'padding-top:' + item.is_urge == 1 ? '30rpx' : '' + ';background-color:#fff;overflow:unset;'"
				v-for="(item, index) in showInfo" :key="'show' + index" @tap="todetail" :data-id="item.order_id"
				:data-index="index">
				<!-- 暂时不启用 -->
				<view class="coreSize abs">{{ item.order_position_name }}</view>
				<view class="hasExamine abs" v-if="item.audit_count > 0 && item.order_status < 6">{{ '待审核' }}
				</view>
				<view class="orderTime abs" v-if="type < 4" :style="'color:' + m1.setTimeOutColor(item.count_down)">
					<text
						style="color:#333;">{{ ((item.appointment_time * 10) < dataNow) ? '封包倒计时：' : '已过封包时间：' }}</text>{{ item.count_down }}
				</view>
				<view class="orderInfo">
					<view class="orderInfoL">
						<view>确认码：<text>{{ item.auth_code }}</text></view>
						<view>预约人：<text style="color:#e94141;" space="emsp">{{ item.name + ' ' }}</text>
							<van-icon @tap.stop="makeCall" :data-tel="item.mobile" name="phone" size="48rpx"
								color="#18c2ba" style="vertical-align:middle;" />
						</view>
						<view>收货地：<text>{{ m1.setAddress(item.site) }}</text></view>
					</view>
					<view class="orderInfoR">
						<view style="height:10rpx;">{{ ' ' }}</view>
						<view class="core_receiveBtn" @tap.stop="receiveByOrder" :data-index="index"
							:style="item.position_is_null == 1 ? 'background-color:#ddd;color:#555;' : ''">收货</view>
						<view><text style="color:#454545;">{{ item.status }}</text></view>
					</view>
				</view>
				<view class="hasUrge abs"
					v-if="item.is_urge == 1 && item.order_status < 6 && item.position_is_null == 0">催促打包</view>
			</view>
		</view>

		<view class="otherOpera" :style="'right:' + otherCssRight">
			<view class="otherOpItem" @tap.stop="clickOtherOpera" data-index="6">
				<van-icon name="failure" color="#fff" size="45rpx"
					style="vertical-align:text-bottom;margin-right:20rpx;" /> 已取消
			</view>
			<view @tap.stop="clickOtherOpera" class="otherOpItem borderTB" data-index="7">
				<van-icon name="close" size="45rpx" color="#fff"
					style="vertical-align:text-bottom;margin-right:20rpx;" /> 已关闭
			</view>
			<view class="otherOpItem" @tap.stop="clickOtherOpera" data-index="1">
				<van-icon name="todo-list-o" color="#fff" size="45rpx"
					style="vertical-align:text-bottom;margin-right:20rpx;" /> 可预约仓位
			</view>
		</view>
		<van-empty v-if="showInfo.length == 0" image="search" description="空空如也哦" />
		<show-msg :status="false" msg1="确定忽略该订单吗？忽略后，将不在列表中展示" showBtn1 showBtn2 inlineBtn @btnClick2="sureIgnoreItem"
			:isShow="isShowMsg"></show-msg>

		<!-- 底部TabBar -->
		<van-tabbar :active="active" active-color="#18c2ba" z-index="3" inactive-color="#666" @change="onTabBarChange"
			placeholder>
			<van-tabbar-item>
				<image slot="icon" :src="icons[0].normal" mode="aspectFit" style="width: 30px; height: 18px;" />
				<image slot="icon-active" :src="icons[0].active" mode="aspectFit" style="width: 30px; height: 18px;" />
				当日未完成
			</van-tabbar-item>
			<van-tabbar-item>
				<image slot="icon" :src="icons[1].normal" mode="aspectFit" style="width: 30px; height: 18px;" />
				<image slot="icon-active" :src="icons[1].active" mode="aspectFit" style="width: 30px; height: 18px;" />
				历史未完成
			</van-tabbar-item>
			<van-tabbar-item :info="orderAuditCount">
				<image slot="icon" :src="icons[2].normal" mode="aspectFit" style="width: 30px; height: 18px;" />
				<image slot="icon-active" :src="icons[2].active" mode="aspectFit" style="width: 30px; height: 18px;" />
				待审核
			</van-tabbar-item>
			<van-tabbar-item>
				<image slot="icon" :src="icons[3].normal" mode="aspectFit" style="width: 30px; height: 18px;" />
				<image slot="icon-active" :src="icons[3].active" mode="aspectFit" style="width: 30px; height: 18px;" />
				已完成
			</van-tabbar-item>
			<van-tabbar-item>
				<image slot="icon" :src="icons[4].normal" mode="aspectFit" style="width: 30px; height: 18px;" />
				<image slot="icon-active" :src="icons[4].active" mode="aspectFit" style="width: 30px; height: 18px;" />
				其他
			</van-tabbar-item>
		</van-tabbar>

		<!-- 记录 收货  单独一个厂家的 -->
		<see-recode @closeLog="closeLog" @modify="modifyRecode" @modifyFacName="modifyFacName" v-if="seeLogFlag" admin
			:isNormal="true" :slots="showRecodeSlot" :data1="factoryLogInfo">
			<view class="receiveSlot" slot="receiveSlot">
				<view class="receiveSlotBox" v-if="slotType">
					<view class="flex flex_r assd">
						<view style="line-height:50rpx;">此次收货数量：</view>
						<input placeholder-class="receiveSlotInputPlac" :style="'color:' + receiveSlotInputValCol"
							:focus="receiveSlotFocus" placeholder-style="font-size:24rpx;padding-left:50rpx;"
							:model:value="receiveSlotInputVal" @blur="receiveSlotbindblur" class="receiveSlotInput"
							type="text"></input>
						<text class="absPlace">(预约者调走的可输入负数)</text>
					</view>
					<view class="flex flex_r">
						<view style="line-height:50rpx;">备注:</view>
						<input placeholder-class="receiveSlotInputPlac" placeholder="请输入"
							:model:value="receiveSlotInputVal2" class="receiveSlotInput" type="text"
							style="width:525rpx;" maxlength="20"></input>
					</view>
				</view>
				<view class="slotBtns">
					<text class="slotTypeb" @tap.stop="clickSlotBtn1">取消</text>
					<text class="slotTypea" @tap.stop="clickSlotBtn2">确定</text>
				</view>
			</view>
		</see-recode>

		<van-dialog use-slot id="van-dialog" :show="modifyFacNameFlag" show-cancel-button @confirm="confirmModifyName">
			<input class="editInput" :model:value="facName" placeholder="输入厂名"></input>
		</van-dialog>

		<!-- 查看收货记录的  showReceive -->
		<view class="modifyPopupcustom" @touchmove.stop="true" :hidden="!showReceive" @tap.stop="closeModifyPopup">
			<view class="modifyPopup" style="height:90vh;margin-top:6%;" @tap.stop="true">
				<view class="modifyRecordTitle">订单收货记录<text
						style="font-size:24rpx;">(合计:{{orderReceiveLog.order_total_num}}手)</text></view>
				<view class="popupInputBox"><input placeholder="输入厂家" class="PopupInput" @confirm="comfirmSearch"
						type="text" :focus="receBtnClicked"></input>
					<view class="PopupAddNewFac flr" :style="type == 4 ? 'background-color:#ddd;color:#555;' : ''"
						@tap.stop="PopupAddNewFac">新增厂家</view>
				</view>
				<view class="popupHeadTxt">预约码:{{orderReceiveLog.auth_code}}<text space="emsp"> </text>
					预约人:{{orderReceiveLog.name}} {{'收货地:' + orderReceiveLog.receipt_address}}</view>
				<scroll-view scroll-y class="modifyPopupscroll">
					<view class="modifyRecordContent">
						<view class="modifyRecordHead flx flx_r">
							<text>厂名</text>
							<text style="flex:.4;">收货总数</text>
							<text style="flex:.5;">明细</text>
							<text style="flex:.4;">操作</text>
						</view>
						<view v-for="(item, index) in orderReceiveLog.factory" :key="'fac' + index"
							style="margin:5px 0;border-radius: 30rpx;overflow: hidden;">
							<view class="modifyRecordItem flx flx_r"
								style="font-weight:550;border-bottom: 1px dotted #fff;">
								<view class="lh65">{{item.manufactor_name}}</view>
								<view style="flex:.4" class="lh65">{{ item.receive_num }}手</view>
								<view style="flex:.5;" class="lh65" @tap.stop="seeDetailFac" :data-index="index">
									<text class="absAfterArrow" space="ensp">查看<text
											style="color:#cfe0df;">展开</text></text>
								</view>
								<view style="flex:.4;position:relative;" @tap.stop="showRecord" :data-id="item.id"
									:data-status="item.status" data-num="" :data-index="index">
									<text class="popupOperaFac"
										:style="(type == 4 || item.status > 5) ? 'background-color:#ddd;color:#fff;' : ''">±收货</text>
								</view>
							</view>
							<view>
								<view class="modifyRecordItem flx flx_r" v-for="(item2, index2) in item.log"
									:key="'log' + index + index2" v-if="item.lj"
									style="position:relative;display:flex;text-align:center;color:#999;">
									<view style="">
										<view>{{ m1.brTime( item2.create_date,'a' ) }}</view>
										<view>{{ m1.brTime( item2.create_date,'b' ) }}</view>
									</view>
									<view style="flex:.4;">
										<view><text
												:style="'color:' + (item2.receive_type == 2 || item2.receive_type == 3) ? '#f10215' : '' + ';line-height:' + item2.admin_name ? '' : '65rpx'">{{(item2.receive_type == 2 || item2.receive_type == 3) ? '-' : '+'}}{{ item2.num }}</text>
										</view>
										<view>{{ item2.admin_name }}</view>
									</view>
									<text :style="'flex:.5;color:' + m1.setReceiveColor(item2.receive_type)"
										class="lh65">{{item2.text || '收货中'}}</text>
									<text class="lh65" style="flex:.4;position:relative;" @tap.stop="modifyReceiveLog"
										:data-ind="index" :data-index="index2"><text v-if="item2.text != '历史结余'"
											class="popupOperaFac popupOperaFac2">{{' '}}</text><text
											v-if="item2.text == '历史结余'"> </text></text>
								</view>
								<view class="labaorecord modifyRecordItem flx flx_r" v-if="item.lj"
									style="text-align:center;">
									<text class="lh65">{{ '  ' }}</text>
									<text class="lh65">{{ ' ' }}</text>
									<text class="lh65" style="text-align:left;" @tap.stop="collectedRecord"
										:data-index="index"><text class="shouqia">{{ '收起' }}</text><text
											class="absAfterArrow2">1呦</text></text>
								</view>
							</view>
						</view>
					</view>
					<view style="height:150rpx;"></view>
				</scroll-view>
				<view class="modifyPopupBtns flx flx_r" @touchmove.stop="true">
					<text @tap.stop="closeModifyPopup" class="roundX">X</text>
				</view>
			</view>
		</view>

		<!-- 新增厂家收货  receiveFactory-->
		<van-popup :show="receiveFactory" @close="closeModifyPopup" round>
			<view class="receiveFactoryBox">
				<view style="background-color:##e7f9f8;border-radius:35rpx 35rpx 0 0;">
					<view class="receiveFactoryTitle">新增厂家收货</view>
					<view class="receiveFactoryHead"><text style="flex:1;">厂名</text><text style="flex:1;">数量</text><text
							space="emsp" style="flex:.5;">{{'备注'}}</text></view>
					<scroll-view scroll-y class="receiveFactoryScroll">
						<view v-for="(item, index) in receiveFactoryList" :key="'rec' + index"
							class="receiveFactoryItem">
							<input class="receiveFactoryInput" :data-index="index" :value="item.manufactor_name"
								data-type="name" @input="receiveFactoryInput" placeholder="厂名" type="text"></input>
							<input class="receiveFactoryInput receiveFactoryInput2" :data-index="index"
								:value="item.num" data-type="sum" @input="receiveFactoryInput" placeholder="数量"
								type="number"></input>
							<text class="absRemark" @tap.stop="_showAddFacRemark"
								:data-index="index">{{item.receive_remark || '备注'}}</text>
							<text class="receiveFactoryDel" @tap.stop="receiveFactoryDel" :data-index="index">X</text>
						</view>
						<view class="receiveFactoryItem">
							<input class="receiveFactoryInput" :value="receiveFactoryNew.manufactor_name"
								data-type="name" @blur="checkBlur" @input="receiveFactoryInput2"
								:placeholder="'厂名' + (receiveFactoryList.length + 1)" type="text"></input>
							<input class="receiveFactoryInput receiveFactoryInput2" :value="receiveFactoryNew.num"
								data-type="sum" @blur="checkBlur" @input="receiveFactoryInput2" placeholder="数量"
								type="number"></input>
							<text class="absRemark" :value="receiveFactoryNew.receive_remark" data-type="remark"
								@input="receiveFactoryInput2" placeholder="备注" type="text"></text>
						</view>
					</scroll-view>
				</view>
				<view class="receiveFactoryBtns">
					<text @tap.stop="operationReceiveBtn" data-type="cancel" style="flex:1;" class="borderR">取消</text>
					<text @tap.stop="operationReceiveBtn" data-type="confirm" data-receive="more"
						style="flex:1;">确定</text>
				</view>
			</view>
		</van-popup>

		<van-popup :show="showReceiveOneFac" @close="closeModifyPopup" round>
			<view class="receiveFactoryBox" style="height:220rpx;">
				<view style="background-color:#e7f9f8;">
					<view class="receiveFactoryTitle">厂名：{{ curFacName }}</view>
					<view class="receiveFactoryItem">
						<input class="receiveFactoryInput" :value="receiveFactoryNew.manufactor_name" data-type="name"
							@input="receiveFactoryInput2" disabled placeholder="厂名" type="text"></input>
						<input class="receiveFactoryInput receiveFactoryInput2" :value="receiveFactoryNew.num"
							:focus="ffooccuuss2" data-type="sum" @input="receiveFactoryInput2" placeholder="数量"
							type="number"></input>
					</view>
				</view>
				<view class="receiveFactoryBtns">
					<text @tap.stop="operationReceiveBtn" data-type="cancel" style="flex:1;" class="borderR">取消</text>
					<text @tap.stop="operationReceiveBtn2" data-type="confirm" data-receive="one"
						style="flex:1;">确定</text>
				</view>
			</view>
		</van-popup>

		<!-- 修改新增厂家收货 备注 -->
		<van-popup :show="showAddFacRemark" @close="closeModifyPopup" round @click-overlay="true">
			<view class="receiveFactoryBox" style="height:220rpx;">
				<view style="background-color:#e7f9f8;">
					<view class="receiveFactoryTitle">备注</view>
					<view class="receiveFactoryItem">
						<input class="facRemarkVal" :model:value="addFacRemark" @input="addFacRemarkInput"
							:focus="addFacRemarkFocus" placeholder="备注" type="text" maxlength="20"></input>
					</view>
				</view>
				<view class="receiveFactoryBtns">
					<text @tap.stop="closeModifyPopup" style="flex:1;" class="borderR">取消</text>
					<text @tap.stop="confirmAddFacRemark" style="flex:1;">确定</text>
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script lang="wxs" module="m1">
	var brTime = function(t, type) {
		var t = t.split(' ')
		return type == 'a' ? t[0] : t[1]
	}
	var setAddress = function(t) {
		return t.substring(0, 12)
	}
	var setReceiveColor = function(i) {
		if (i == 0 || i == 1) {
			return "#999"
		} else if (i == 2) {
			return "#fb1717"
		} else if (i == 3) {
			return "#fb1717"
		} else if (i == 4) {
			return "#fb1717"
		}
	}
	var setTimeOutColor = function(t) {
		if (t.indexOf('已') != -1) {
			return '#c956f0'
		} else {
			return '#fb1717'
		}
	}
	module.exports = {
		setAddress,
		brTime,
		setReceiveColor,
		setTimeOutColor
	}
</script>
<script>
	const app = getApp();
	var request = require("../../../static/utils/request");
	var setting = app.globalData.setting;
	var isNumber = false;
	var screenItems = [{
			name: '未送货',
			i: 0,
		},
		{
			name: '送货中',
			i: 1,
		},
		{
			name: '部分已打包/待拉',
			i: 2,
		},
		{
			name: '已打包/待拉',
			i: 3,
		},
		{
			name: '部分已拉包',
			i: 4,
		},
		{
			name: '已完成',
			i: 5,
		}
	];
	var loadFlag = true;
	export default {
		data() {
			return {
				url: setting.url,
				screenItems: screenItems,
				dataNow: +new Date(),
				active: 0,
				ffooccuuss: false,
				ffooccuuss2: false,
				index: 'a', //用于长按忽略
				isShowMsg: false, //忽略弹窗
				// 单独厂家收货 s
				seeLogFlag: false,
				showRecodeSlot: false,
				slotType: false,
				receiveSlotFocus: false,
				receiveSlotInputVal: '',
				receiveSlotInputVal2: '',
				factoryLogInfo: null,
				addFacRemark: '',
				showAddFacRemark: false,
				curModifyNewFacIndex: -1,
				modifyFacNameFlag: false,
				facName: '',
				addFacRemarkFocus: false,
				// 单独厂家收货 e
				//仓位列表
				p: 1,
				size: -999,
				showInfo: [], //用来展示的
				cangInFo: [],
				seeScreen: false, //筛选的选项是否可见
				searchTxt: '', //确认码
				type: 1, //当前的列表类型
				orderType: -99, //当前的筛选类型
				otherCssRight: '-999rpx',
				curId: '',
				curIndex: '', //当前操作的 order index
				curFacIndex: '', //当前操作的 厂家 index
				curLogIndex: 'none', //当前操作的log index
				showReceive: false,
				orderAuditCount: 0,
				isFirst: true,
				icons: [{
						normal: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-today-off.png',
						active: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-today-on.png'
					},
					{
						normal: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-his-off.png',
						active: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-his-on.png'
					},
					{
						normal: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-shenhe-off.png',
						active: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-shenhe-on.png'
					},
					{
						normal: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-done-off.png',
						active: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-done-on.png'
					},
					{
						normal: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-other-off.png',
						active: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-other-on.png'
					},
				],
				receiveFactory: false,
				receiveFactoryNew: {
					manufactor_name: '',
					num: ''
				},
				receiveFactoryList: [], //收货时临时存放的厂家 数量
				orderReceiveLog: {
					factory: [],
					auth_code: '',
					name: '',
					receipt_address: ''
				}, //弹出记录条木框数据
				showReceiveOneFac: false,
				curFacName: '', //当前操作收货的厂家名字
				searchInputType: 'text',
				receBtnClicked: false
			}
		},
		onLoad: function(options) {
			this.getInfo(1, 1, -999)
		},
		onPullDownRefresh: function() {
			this.p = 1
			this.showInfo = []
			this.dataNow = +new Date()
			loadFlag = true
			this.getInfo(1, this.type, this.orderType)
		},
		onReachBottom: function() {
			var p = this.p + 1
			this.getInfo(p, this.type, this.orderType)
			this.p = p
			this.otherCssRight = '-999rpx'
		},
		onShow: function() {
			if (this.isFirst) {
				this.isFirst = false
			} else {
				this.p = 1
				this.showInfo = []
				this.dataNow = +new Date()
				this.getInfo(1, this.type, this.orderType)
			}
		},
		onPageScroll: function(e) {
			if (this.index != 'a') {
				var index = this.index
				this.seeScreen = false
				this[`showInfo[${index}].lj`] = 0
				this.index = 'a'
				this.otherCssRight = '-999rpx'
				this.showInfo = [...this.showInfo]
			} else {
				this.seeScreen = false
				this.otherCssRight = '-999rpx'
			}
		},
		methods: {
			getOrderAuditCount: function() {
				var that = this
				request.get(that.url + '/api/pinbao/getOrderAuditCount', {
					data: {},
					success: function(res) {
						that.orderAuditCount = res.data.result
					}
				})
			},
			//获取仓位可用信息
			getCangInfo: function() {
				const that = this
				request.get(that.url + '/api/pinbao/getPositionList', {
					success: function(res) {
						that.cangInFo = [...res.data.result.position]
						var sum = 0
						that.cangInFo.forEach((item) => {
							sum = Number(item.used_number) + Number(sum)
						})
						that.sum = sum
						that.otherCssRight = '-999rpx'
					}
				})
			},
			// 获取所有订单信息
			getInfo: function(p, type, orderType) {
				this.getOrderAuditCount()
				var navigationText = ['', '当日未完成', '历史未完成', '待审核', '已完成', '', '已取消', '已关闭', ]
				uni.setNavigationBarTitle({
					title: navigationText[type],
				})
				if (loadFlag == false) {
					return
				}
				loadFlag = false
				const that = this
				request.get(that.url + '/api/Pinbao/getAdminOrderList', {
					data: {
						p: p,
						type: type,
						order_type: orderType,
					},
					success: function(res) {
						that.showInfo = [...that.showInfo, ...res.data.result]
						that.seeScreen = false
						that.otherCssRight = '-999rpx'
						uni.stopPullDownRefresh()
						loadFlag = true
					}
				})
			},
			resetParams: function() { // 重置 P showInfo数组 
				this.p = 1
				this.showInfo = []
				this.orderType = -99
			},
			todetail: function(e) { // 前往详情
				var id = e.currentTarget.dataset.id
				var type = this.type
				uni.navigateTo({
					url: '/pages/subcontract/detail/detail?order_id=' + id + '&ordertype=' + type,
				})
			},
			showRecord: function(e) { //显示记录
				var id = e.currentTarget.dataset.id
				var slotType = true //是否要显示插槽
				if (e.currentTarget.dataset.status == 6 || e.currentTarget.dataset.status == 7 || 
					this.showInfo[this.curIndex].position_is_null == 1) {
					slotType = false
				}
				this.showRecodeSlot = slotType
				this.slotType = slotType
				this.curFacIndex = e.currentTarget.dataset.index
				this.receiveSlotInputVal = e.currentTarget.dataset.num < 0 ? '' : e.currentTarget.dataset.num
				this.getFactoryLog(id)
			},
			getFactoryLog: function(id) { //获取厂家记录====================
				var that = this
				request.get(that.url + '/api/pinbao/getFactoryLog', {
					data: {
						manufactor_id: id
					},
					success: function(res) {
						that.seeLogFlag = true
						that.factoryLogInfo = res.data.result
						that.receiveSlotFocus = true
						that.receiveSlotInputVal2 = res.data.result.receive_remark || ''
					}
				})
			},
			clickSlotBtn1: function() { //插槽点击左按钮
				var that = this
				this.seeLogFlag = false
			},
			clickSlotBtn2: function() { //插槽点击右按钮
				var id = this.orderReceiveLog.factory[this.curFacIndex].id
				var sum = this.receiveSlotInputVal + ''
				var remark = this.receiveSlotInputVal2
				var regRule =
					/^[\u4E00-\u9FA5A-Za-z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F\s/]+$/
				var that = this
				if (sum.trim() == '' || sum.trim() == 0) {
					return uni.showToast({
						title: '请输入收货数量',
						icon: 'none'
					})
				}
				if (remark.trim() != '' && !regRule.test(remark)) {
					return uni.showToast({
						title: '备注只能输入汉字 + 符号',
						icon: 'none'
					})
				}
				this.req('addReceiveLog', {
					type: '1',
					num: sum,
					remark: remark,
					manufactor_id: id
				}, function(res) {
					that.req('getReceiveLog', {
						order_id: that.showInfo[that.curIndex].order_id
					}, function(res) {
						that.orderReceiveLog = res.data.result
						that.receBtnClicked = true
						that.seeLogFlag = false
					})
				})
			},
			closeLog: function() {
				this.seeLogFlag = false
			},
			receiveSlotbindblur: function(e) { //单独厂家收货的输入框变化
				var val = e.detail.value
				if (val) {
					if (val.charAt(0) == '-') {
						this.receiveSlotInputValCol = '#f10215'
					} else {
						this.receiveSlotInputValCol = '#444'
					}
				}
			},
			// ============================================================ 2 版本
			showScreen: function() { //切换显示筛选规则
				this.seeScreen = !this.seeScreen
			},
			searchInput: function(e) { //搜索框
				var txt = e.detail.value
				this.searchTxt = txt
				if (this.searchTxt.length == 5 && isNumber) {
					this.searchOrder()
				}
			},
			searchOrder: function() { //按校验码查询
				var txt = this.searchTxt
				var exp = /^\d{5}$/
				if (!exp.test(txt) && this.searchInputType == 'number') {
					return uni.showToast({
						title: '请正确填写校验码（5位数字）',
						icon: 'none',
					})
				}
				this.resetParams()
				const that = this
				var data = {
					p: 1,
					type: that.type,
					order_type: that.orderType,
				}
				if (this.searchInputType == 'text') {
					data.search = txt
				} else {
					data.auth_code = txt
				}
				request.get(that.url + '/api/Pinbao/getAdminOrderList', {
					data,
					success: function(res) {
						that.setData({
							showInfo: res.data.result,
							seeScreen: false,
							otherCssRight: '-999rpx',
							ffooccuuss: false,
							searchInputType: 'text'
						}, function() { //如果有搜索到结果 继续请求 弹出收货界面
							if (res.data.result.length == 1) {
								that.req('getReceiveLog', {
									order_id: res.data.result[0].order_id
								}, function(res) {
									that.orderReceiveLog = res.data.result
								})
								that.curIndex = 0
								that.showReceive = true
							}
						})
					}
				})
			},
			isNumberNo: function() {
				isNumber = false
			},
			clickScreenItem: function(e) { //点击筛选item
				var index = e.currentTarget.dataset.index
				this.resetParams()
				this.getInfo(1, this.type, index)
				this.orderType = index
			},
			clickTab: function(e) { //点击底部Tab
				var index = e.currentTarget.dataset.index
				if (index == 5) { //其他
					this.otherCssRight = this.otherCssRight == '-999rpx' ? '35rpx' : '-999rpx'
				} else {
					this.type = index
					this.orderType = -99
					this.showInfo = []
					this.resetParams()
					this.getInfo(1, index, -99)
				}
			},
			clickOtherOpera: function(e) {
				var index = e.currentTarget.dataset.index
				if (index == 1) { //点击的是仓位情况
					uni.navigateTo({
						url: '/pages/subcontract/WarehouseSum/WarehouseSum',
					})
					return
				}
				this.resetParams()
				this.type = index
				this.getInfo(1, this.type, index)
			},
			ignoreItem: function(e) {
				var id = e.currentTarget.dataset.id
				this.curId = id
				this.isShowMsg = true
			},
			sureIgnoreItem: function() { //确定忽略
				var that = this
				request.get(that.url + '/api/pinbao/ignoreOrder', {
					data: {
						order_id: this.curId
					},
					success: function(res) {
						that.isShowMsg = false
						that.showInfo = []
						that.p = 1
						that.getInfo(1, that.type, that.orderType)
					}
				})
			},
			onTabBarChange: function(event) { //TabBar 切换
				var that = this
				this.active = event.detail
				var index = event.detail + 1
				if (index == 5) { //其他
					this.otherCssRight = this.otherCssRight == '-999rpx' ? '35rpx' : '-999rpx'
				} else {
					this.type = index
					this.orderType = -99
					this.showInfo = []
					this.resetParams()
					this.getInfo(1, index, -99)
				}
			},
			receiveByOrder: function(e) {
				var that = this
				var index = e.currentTarget.dataset.index
				this.req('getReceiveLog', {
					order_id: this.showInfo[index].order_id
				}, function(res) {
					that.orderReceiveLog = res.data.result
					that.receBtnClicked = true
				})
				this.curIndex = index
				this.showReceive = true
			},
			PopupAddNewFac: function(e) {
				if (this.showInfo[this.curIndex].position_is_null == 1) {
					return uni.showToast({
						title: '当前状态订单无法继续操作',
						icon: 'none'
					})
				}
				this.showReceive = false
				this.receiveFactory = true
			},
			receiveFactoryInput: function(e) {
				var index = e.currentTarget.dataset.index
				var type = e.currentTarget.dataset.type
				var val = e.detail.value
				if (type == 'name') {
					this[`receiveFactoryList[${index}].manufactor_name`] = val
				} else {
					this[`receiveFactoryList[${index}].num`] = val
				}
				this.receiveFactoryList = [...this.receiveFactoryList]
			},
			receiveFactoryInput2: function(e) {
				var type = e.currentTarget.dataset.type
				var val = e.detail.value
				if (type == 'name') {
					this[`receiveFactoryNew.manufactor_name`] = val
				} else if (type == 'sum') {
					this[`receiveFactoryNew.num`] = val
				} else {
					this[`receiveFactoryNew.receive_remark`] = val
				}
				this.receiveFactoryNew = Object.assign({}, this.receiveFactoryNew)
			},
			checkBlur: function() { //失去焦点判断并增加
				var {
					manufactor_name,
					num
				} = this.receiveFactoryNew
				if (manufactor_name != '' && num != '') {
					this.receiveFactoryList = [...this.receiveFactoryList, {
						manufactor_name: manufactor_name,
						num: num
					}]
					this.receiveFactoryNew = {
						manufactor_name: '',
						num: '
					}
				}
			},
			operationReceiveBtn: function(e) { //新增厂家底下按钮操作 //多个厂家的
				var type = e.currentTarget.dataset.type
				var list = this.receiveFactoryList
				var that = this
				if (type == 'confirm') { //点击 新增收货的确定
					var regRule =
						/^[\u4E00-\u9FA5A-Za-z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F\s/]+$/
					var sumReg = /^\d{1,5}$/
					var indexErr = 'none'
					var indexErr2 = 'none'
					list.forEach((item, index) => {
						item.receive_remark = item.receive_remark || ''
						if (item.manufactor_name.trim() == '' || !sumReg.test(item.num)) {
							indexErr = index
						}
						if (item.receive_remark && !regRule.test(item.receive_remark)) {
							indexErr2 = index
						}
					})
					if (indexErr != 'none') {
						return uni.showToast({
							title: `厂名"${list[indexErr].manufactor_name}"填写格式不正确`,
							icon: 'none'
						})
					}
					if (indexErr2 != 'none') {
						return uni.showToast({
							title: `厂名"${list[indexErr2].manufactor_name}"备注请填写中文+符号`,
							icon: 'none'
						})
					}
					if (list.length == 0) {
						return uni.showToast({
							title: '请填写完整厂名及数量',
							icon: 'none'
						})
					}
					this.req('addFactoryReceiveLog', {
						manufactor: JSON.stringify(list),
						order_id: this.showInfo[this.curIndex].order_id
					}, function(res) {
						uni.showToast({
							title: '收货成功',
						})
						that.receiveFactory = false
						that.receiveFactoryNew = {
							manufactor_name: '',
							num: ''
						}
						that.receiveFactoryList = []
						setTimeout(() => {
							that.resetParams()
							that.getInfo(1, that.type, that.orderType)
						}, 1500)
					})
				} else {
					this.receiveFactory = false
					this.showReceiveOneFac = false
					this.receiveFactoryNew = {
						manufactor_name: '',
						num: ''
					}
					this.curLogIndex = 'none'
				}
			},
			operationReceiveBtn2: function(e) { //单个厂家的收货
				var that = this
				var nameReg = /[`~!@#$^&*()=|{}':;',\[\].<>\?~！@#￥……&*（）——|{}【】‘；：”“""'。，、？]/
				var sumReg = /^-?\d+$/
				var id = this.orderReceiveLog.factory[this.curFacIndex].id
				var manufactor_name = this.receiveFactoryNew.manufactor_name
				var num = this.receiveFactoryNew.num
				if (nameReg.test(manufactor_name) || !sumReg.test(num)) {
					return uni.showToast({
						title: '请填写正确格式的厂名和数量',
						icon: 'none'
					})
				}
				if (this.curLogIndex != 'none') { //有 curLogIndex 说明是改记录
					this.req('editOperateLog', {
						num: this.receiveFactoryNew.num,
						id: this.orderReceiveLog.factory[this.curFacIndex].log[this.curLogIndex].log_id
					}, function(res) {
						that.showReceiveOneFac = false
						that,curLogIndex = 'none'
						that.receiveFactoryNew = {
							manufactor_name: '',
							num: ''
						}
						that.req('getReceiveLog', {
							order_id: that.showInfo[that.curIndex].order_id
						}, function(res) {
							that.orderReceiveLog = res.data.result
						})
					})
					return
				}
				this.req('addReceiveLog', {
					num: this.receiveFactoryNew.num,
					manufactor_id: this.orderReceiveLog.factory[this.curFacIndex].id
				}, function(res) {
					that.showReceiveOneFac = false
					that.receiveFactoryNew = {
						manufactor_name: '',
						num: ''
					}
					that.req('getReceiveLog', {
						order_id: that.showInfo[that.curIndex].order_id
					}, function(res) {
						that.orderReceiveLog = res.data.result
					})
				})
			},
			modifyReceiveLog: function(e) { //修改收货的记录
				if (this.showInfo[this.curIndex].position_is_null == 1) {
					return uni.showToast({
						title: '当前状态订单无法继续操作',
						icon: 'none'
					})
				}
				var index = e.currentTarget.dataset.index
				var ind = e.currentTarget.dataset.ind
				this.curLogIndex = index
				this.curFacIndex = ind
				this.showReceiveOneFac = true
				this.curFacName = this.orderReceiveLog.factory[ind].manufactor_name
				this.receiveFactoryNew = {
					manufactor_name: this.orderReceiveLog.factory[ind].manufactor_name,
					num: ''
				}
			},
			receiveFactoryDel: function(e) { //从增加收货里面删除一行
				var index = e.currentTarget.dataset.index
				var list = this.receiveFactoryList
				list.splice(index, 1)
				this.receiveFactoryList = [...list]
			},
			receiveOneFac: function(e) { //点击的 +-收货
				var index = e.currentTarget.dataset.index
				if (this.showInfo[this.curIndex].position_is_null == 1) {
					return uni.showToast({
						title: '当前状态订单无法继续操作',
						icon: 'none'
					})
				}
				if (this.orderReceiveLog.factory[index].status > 5) {
					return uni.showToast({
						title: '厂家已被取消或关闭，无法继续收货',
						icon: 'none'
					})
				}
				this.curFacIndex = index
				this.curFacName = this.orderReceiveLog.factory[index].manufactor_name
				this.showReceiveOneFac = true
				this[`receiveFactoryNew.manufactor_name`]: this.orderReceiveLog.factory[index].manufactor_name
				this[`receiveFactoryNew.num`]: this.orderReceiveLog.factory[index].goods_number > 0 ? 
					this.orderReceiveLog.factory[index].goods_number : ''
				this.curLogIndex = 'none'
				this.ffooccuuss2 = true
				this.receiveFactoryNew = Object.assign({}, this.receiveFactoryNew)
			},
			modifyFacName: function(e) {
				var index = this.curFacIndex
				this.modifyFacNameFlag = true
				this.facName = this.orderReceiveLog.factory[index].manufactor_name
			},
			confirmModifyName: function() { //确定改名字
				var name = this.facName + ''
				var that = this
				var id = this.orderReceiveLog.factory[this.curFacIndex].id
				if (name == '' || name.trim() == '') {
					return uni.showToast({
						title: '名字不能为空',
						icon: 'none'
					})
				}
				if (name.trim() == this.orderReceiveLog.factory[this.curFacIndex].manufactor_name) {
					return
				}
				this.req('editFactoryNameAdmin', {
					manufactor_id: id,
					manufactor_name: name
				}, function(res) {
					uni.showToast({
						title: '修改成功',
					})
					setTimeout(() => {
						that.getFactoryLog(id)
						that.req('getReceiveLog', {
							order_id: that.showInfo[that.curIndex].order_id
						}, function(res) {
							that.orderReceiveLog = res.data.result
							that.receBtnClicked = true
						})
					}, 800)
				})
			},
			comfirmSearch: function(e) { //收货中的搜索
				var val = e.detail.value
				var list = this.orderReceiveLog.factory
				var index = list.findIndex(function(item) {
					return item.manufactor_name.indexOf(val) != -1
				})
				if (index != -1) {
					var shift = list.splice(index, 1)
					list = [...shift, ...list]
					this.orderReceiveLog.factory = list
					this.orderReceiveLog = Object.assign({}, this.orderReceiveLog)
				}
			},
			makeCall: function(e) {
				var tel = e.currentTarget.dataset.tel + ''
				if (tel == '' || tel == 0) {
					return
				} else {
					uni.makePhoneCall({
						phoneNumber: tel,
					})
				}
			},
			seeDetailFac: function(e) {
				var index = e.currentTarget.dataset.index
				this.orderReceiveLog.factory[index].lj = !this.orderReceiveLog.factory[index].lj
				this.orderReceiveLog = Object.assign({}, this.orderReceiveLog)
			},
			collectedRecord: function(e) {
				var index = e.currentTarget.dataset.index
				this.orderReceiveLog.factory[index].lj = false
				this.orderReceiveLog = Object.assign({}, this.orderReceiveLog)
			},
			closeModifyPopup: function() {
				this.showReceive = false
				this.showAddFacRemark = false
				this.receiveFactory = false
				this.addFacRemark = ''
			},
			addFacRemarkInput: function(e) {
				this.addFacRemark = e.detail.value
			},
			confirmAddFacRemark: function() {
				this.receiveFactoryList[this.curModifyNewFacIndex].receive_remark = this.addFacRemark
				this.addFacRemark = ''
				this.showAddFacRemark = false
				this.receiveFactoryList = [...this.receiveFactoryList]
			},
			_showAddFacRemark: function(e) {
				this.showAddFacRemark = true
				this.curModifyNewFacIndex = e.currentTarget.dataset.index
				this.addFacRemark = this.receiveFactoryList[e.currentTarget.dataset.index].receive_remark || ''
				this.addFacRemarkFocus = true
			},
			// 请求 函数
			req: function(url, params, cb) {
				request.get('/api/pinbao/' + url, {
					data: params,
					success: function(res) {
						cb && cb(res)
					}
				})
			},
			ffocusInput: function() {
				var that = this
				isNumber = true
				this.searchInputType = 'number'
				this.ffooccuuss = true
			},
			keyboardheightchange: function(e) {
				if (e.detail.height == 0) {
					this.searchInputType = 'text'
				}
			}
		}
	}
</script>

<style scoped src="./core.css">

</style>
