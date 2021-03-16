<template>
	<view>
		<view class="nav2 rela">
			<view class="navItem1 abs" :class="{curItem: navType == 'order'}" @tap.stop="switchNav" data-type="order"
				:data-url="getOrderList">订单列表</view>
			<view class="navItem2 abs" :class="{curItem: navType == 'lj'}" @tap.stop="switchNav" data-type="lj"
				:data-url="getRecycleList">回 收 站</view>
		</view>
		<!-- 横线 -->
		<view class="dividingLine"></view>

		<!-- 回收站额外公告 -->
		<view class="recycleTips" :hidden="curState == 'getOrderList'">公告：回收站仅保留最近三个月的信息</view>
		<!-- 全部  按订单区分展示 -->
		<view class="allBox">
			<view class="all_item rela" v-for="(item, index) in orderInfo" :key="'oinfo' + index"
				@tap.stop="requsstDetail" :data-index="index" :data-id="item.order_id" style="border-color:#18c2ba;">
				<image class="abs centerBg"
					src="https://www.yitongwang.com/public/static/images/minniapp/pinbao-all-2.png"></image>
				<view class="abs centerName">{{ item.seller_name }}</view>
				<view class="orderCode col555">预约 单号:<text class="orderCodeTxt col999">{{ item.order_code }}</text>
				</view>
				<view class="orderTime col555">预约 日期:<text class="col999">{{ item.appointment_date }}
						<text>(最晚封包时间)</text></text></view>
				<view class="orderOther">
					<view style="width:39%;" class="orderVerification col555">送货确认码:<text>{{ item.auth_code }}</text>
					</view>
					<view style="width:61%;" class="orderNum col555">仓位编号:<text
							class="col999">{{ item.order_position_name }}</text></view>
				</view>
				<view class="allCalcelOrder abs"
					:style="item.status == '被关闭的' ? 'background-color:#f84545;color:#fff;' : item.status_css">
					{{ item.status }}
				</view>
				<view class="operationBox">
					<text @tap.stop="operationBtn" v-if="item.order_status <= 5 && item.position_is_null != 1"
						data-type="txsh" :data-index="index" class="allOperationItem bgblue">提醒送货</text>
					<text @tap.stop="operationBtn" v-if="item.apply_status != 1 && item.order_status == 0"
						data-type="qxyy" :data-index="index" class="allOperationItem bgpink">取消预约</text>
					<text @tap.stop="operationBtn" v-if="item.order_status == 2 || item.order_status == 3"
						data-type="dbjl" :data-index="index" class="allOperationItem bgfff">打包记录</text>
					<text @tap.stop="operationBtn" v-if="item.order_status == 1" data-type="ccdb" :data-index="index"
						class="allOperationItem bgfff">{{ item.is_urge == 0 ? '催促打包' : '已催促打包'}}</text>
					<text @tap.stop="operationBtn" v-if="(item.order_status >= 2 && item.order_status <= 5)"
						data-type="lbdh" :data-index="index" class="allOperationItem bg18c">拉包电话</text>
					<text @tap.stop="operationBtn" v-if="(item.order_status == 4 || item.order_status == 5)"
						data-type="lbmx" :data-index="index" class="allOperationItem bg18c">拉包明细</text>
					<text @tap.stop="operationBtn"
						v-if="item.order_status == 7 && item.cancel_code > 0 && curState == 'getOrderList'"
						data-type="gbdd-code" :data-index="index"
						class="allOperationItem bgorangeLarge">关闭订单确认码:{{item.cancel_code}}</text>
				</view>
				<view class="showAllDetail abs" v-if="item.order_status > 5 && curState == 'getOrderList'"
					@tap.stop="delOrderToRecycle" :data-index="index" :data-id="item.order_id"
					:data-url="delOrderToRecycle">
					<van-icon name="delete" />
				</view>
				<view class="showAllDetail abs" :class="'queryClass' + index" style="border:none;"
					v-if="item.order_status <= 5" @tap.stop="doOperation" :data-index="index" :data-id="item.order_id">

					<template v-if="item.apply_status == 1 || item.is_exclamation_point == 1">
						<van-icon name="more-o" color="#ff5656" info="1" size="55rpx" />
					</template>
					<template v-else>
						<van-icon name="more-o" color="#18c2ba" size="55rpx" />
					</template>
				</view>
			</view>
		</view>
		<view :class="isbottom ? 'orderOperationItemBox2' : 'orderOperationItemBox'" v-if="showMask2"
			:style="'top:' + orderOperationTop">
			<view class="orderOperationItem" v-for="(item, index) in orderOperations" :key="'op' + index"
				:style="item.css ? 'background-color:#fcc755;color:#333;border-radius:10rpx;font-size:24rpx;' : ''"
				@tap.stop="clickRoundDoted" :data-type="item.index">{{item.name}} <text
					v-if="item.name == '重要信息' || item.name == '关闭订单/审核中'" class="absOrderOperaDoted">1</text>
			</view>
		</view>
		<view class="mask2" v-if="showMask2" @tap.stop="closeMask2" @touchmove.stop="true" style="z-index:4;">
		</view>

		<!-- 弹窗  提示 小组件部分 -->
		<!-- 警告提示 -->
		<van-popup :show="showWarning" @close="onWarningClose" z-index="8" custom-class="warningPopup">
			<view class="warningBox">
				<image class="warningImg"
					:src="'https://www.yitongwang.com/public/static/images/minniapp/' + editImg + '.png'"></image>
				<view class="warningTxt">{{ editTxt }}</view>
				<view class="warningTxt2" v-if="showKuohao">（回收站仅保留近三个月信息）</view>
				<view class="warningBtn1" @tap.stop="overlookFactory">{{ btnTxt1 }}</view>
				<view class="warningBtn2" @tap.stop="onWarningClose">{{ btnTxt2 }}</view>
			</view>
		</van-popup>
		<!-- 正常提示 -->
		<van-popup :show="showInfo" @close="onInfoClose" z-index="8" custom-class="warningPopup">
			<view class="warningBox">
				<image class="warningImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontract-info-input.png"></image>
				<view class="warningTxt">{{ curManufactorName }}</view>
				<input class="editTelInput" v-model="curTel" placeholder-class="editTelplaceholdeInput"
					placeholder="请输入厂家电话" maxlength="11"></input>
				<view class="warningTxt">老厂家建议添加号码，下次</view>
				<view class="warningTxt">可直接拨打，无需翻通讯录</view>
				<view class="warningBtn2" @tap.stop="eidtTelAndCall">立即添加并拨打</view>
				<view class="infoPopupCancel" @tap.stop="onInfoClose">
					<van-icon name="close" size="40px" />
				</view>
			</view>
		</van-popup>
		<!-- 送齐，拉走，提示 -->
		<van-popup :show="false" @close="onOtherClose" z-index="8" custom-class="warningPopup">
			<view class="warningBox">
				<image class="warningImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontranct-err.png"></image>
				<view class="warningTxt">{{ editTxt }}</view>
				<view class="warningBtn1" @tap.stop="callAdmin">立 即 拨 打</view>
				<view class="warningBtn2" @tap.stop="onOtherClose">取 消</view>
			</view>
		</van-popup>

		<!-- 放海报的 -->
		<view v-if='share_btn'>
			<view class="prom-model">
				<icon type="cancel" color="gray" size="22" class="modal-close" @tap="closeShareModal" />
				<view class="prom-title">
					<view>打开微信，按以下步骤群发给厂家，提醒厂家送货</view>
					<view>{{ '我 → 设置 → 通用 → 辅助功能 → 群发助手' }}</view>
				</view>
				<view class='share-pic'>
					<image @tap.stop='previewSharePic' style='width:100%;height:100%' :src='share_pic'></image>
				</view>
				<view class="share-save-btns">
					<view class="share-save-btn" @tap.stop="saveSharePic">保存海报</view>
				</view>
			</view>
		</view>

		<!-- 取消预约 -->
		<show-msg :status="false" :isShow="showMsgCancel" :msg1="showMsgTxt1" :showTitle="false"
			msgStyle="padding:0rpx 50rpx;" minh="380rpx" showBtn1 showBtn2 :btnTxt1="btnTxt1" inlineBtn
			@btnClick2="calcelOrderClick1" @btnClick1="calcelOrderClick2" :btnTxt2="btnTxt2">
		</show-msg>
		<!-- 发送取消订单申请 -->
		<show-msg :status="false" :isShow="sendCancelOrderApplyFlag" :msg1="sendCancelOrderApplyTxt" showBtn2 showBtn1
			inlineBtn btnTxt1="确定取消" btnTxt2="我点错了" @btnClick1="sendCancelOrderApply">
		</show-msg>
		<!-- 取消协议 -->
		<van-popup z-index="100" :show="showCancelXieyi" @close="onWarningClose" z-index="8"
			custom-class="warningPopup">
			<view class="warningBox2">
				<image class="warningImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontranct-err.png"></image>
				<view class="headWord">请谨慎操作，强制取消后，系统将无法跟踪货物记录，如您仍需继续强制取消服务，请仔细阅读以下协议：</view>
				<view class="headWord2">“关于已收货物的取消服务协议”</view>
				<scroll-view scroll-y class="xieyiScroll">
					<view class="contentWord contentWord1">取消服务后，系统将不能跟踪货物信息，请尽快处置取消服务的货物，您可以取回货物或重新预约拼包。</view>
					<view class="contentWord contentWord2">如您选择重新预约拼包，需办理<text
							class="coltheme">“关于已取消服务货物的重新预约拼包协议”</text>，如您本人或您指定的人员前往仓库取回货物时，需出具“取消厂家确认码”或“关闭订单确认码”，仓库人员核实后才能办理货物出库手续。
					</view>
					<view class="contentWord contentWord3">暂未发包的货物，我们为您提供免费保管三天的服务，三天后将收取相应的保管费用，<text
							class="col215">最长保管期限为30天，超过30天我们有权自行处置货物</text>。</view>
					<view class="contentWord contentWord4">在保管期内，货物的保管义务由我们承担，不可抗拒的因素除外。</view>
					<view class="contentWord contentWord5">若您强制取消服务次数过多，我们有权终止您的预约拼包功能。</view>
				</scroll-view>

				<view class="warningBtn2" @tap.stop="agreeAgreement">本人同意以上协议并提交申请</view>
				<view class="warningBtn1" @tap.stop="onWarningClose">取 消</view>
			</view>
		</van-popup>
		<!-- 记录 -->
		<see-recode @closeLog="closeLog" v-if="seeLogFlag" :data="factoryLogInfo"></see-recode>
		<!-- 评价的框 showEvaluate -->
		<show-msg :status="true" :isShow="showEvaluate" :showTitle="false" showBtn2 btnTxt2="提交评价"
			@btnClick2="doEvaluate">
			<view slot="slot1">
				<view class="ttitle">您的评价让我们做的的更好</view>
				<view class="emmmm">请为我们打分</view>
				<view class="lineStar">服务
					<van-rate :value="evaluateV1" size="58rpx" color="#fed04d" void-color="#eee" void-icon="star"
						data-index="1" @change="onEvaluateChange1" />
				</view>
				<view class="lineStar">时效
					<van-rate :value="evaluateV2" size="58rpx" color="#fed04d" void-color="#eee" void-icon="star"
						data-index="2" @change="onEvaluateChange1" />
				</view>
				<view class="lineStar">精准
					<van-rate :value="evaluateV3" size="58rpx" color="#fed04d" void-color="#eee" void-icon="star"
						data-index="3" @change="onEvaluateChange1" />
				</view>
			</view>
		</show-msg>
		<!-- 查看拉包记录的 -->
		<view class="modifyPopupcustom" @touchmove.stop="true" v-if="shouldVoucherShow">
			<view class="modifyPopup" style="height:75vh;margin-top:15%;">
				<scroll-view scroll-y class="modifyPopupscroll">
					<view class="modifyRecordTitle">{{shouldVoucherShowType}}<text
							style="font-size:24rpx;">(合计:{{voucherInfo[0].order_total_num}}手)</text></view>
					<view class="modifyRecordContent">
						<view class="modifyRecordHead flx flx_r">
							<text style="flex:.5;">时间</text>
							<text>厂名</text>
							<text style="flex:.4;">数量</text>
							<text style="flex:.3;">{{shouldVoucherShowType == '打包记录' ? '操作' : '凭证'}}</text>
						</view>
						<view v-for="(item, index) in voucherInfo" :key="'vou' + index" v-if="item.total_num > 0"
							style="margin:5px 0;">
							<view class="modifyRecordItem flx flx_r">
								<view style="flex:.5;">
									<view>{{ m1.brTime( item.create_date,'a' ) }}</view>
									<view>{{ m1.brTime( item.create_date,'b' ) }}</view>
								</view>
								<view class="lh65" @tap.stop="seeDetailFac" :data-index="index"><text
										class="absAfterArrow" space="ensp">明细 </text></view>
								<view style="flex:.4" class="lh65">{{ item.total_num }}手</view>
								<view style="flex:.3;position:relative;">
									<van-icon v-if="shouldVoucherShowType == '拉包明细'" class="seeImgIcon"
										@tap.stop="seeOrderDetailImgs" :data-index="index" name="photo" color="#18c2ba"
										size="40rpx" />
									<text v-if="shouldVoucherShowType == '打包记录'" @tap.stop="seeDetailFac"
										:data-index="index" :data-pid="item.pid" class="lh65">展开 <text
											style="color:#cfe0df;" class="absAfterArrow">{{ '哟' }}</text></text>
								</view>
							</view>
							<view>
								<view class="modifyRecordItem flx flx_r" v-for="(item2, index2) in item.log "
									:key="'log' + index + index2" v-if="item.lj && item2.num > 0"
									style="position:relative;display:flex;text-align:center;color:#999;">
									<view style="flex:.5;">
										<view>{{ m1.brTime( item.create_date,'a' ) }}</view>
										<view>{{ m1.brTime( item.create_date,'b' ) }}</view>
									</view>
									<text style="flex:1;" class="lh65">{{item2.manufactor_name}}</text>
									<text style="flex:.4;" class="lh65">{{ item2.num }}手</text>
									<text style="flex:.3;">{{ ' ' }}</text>
								</view>
								<view class="labaorecord modifyRecordItem flx flx_r" v-if="item.lj"
									style="text-align:center;">
									<text>{{' '}}</text>
									<text>{{ ' ' }}</text>
									<text class="lh65" style="text-align:left;" @tap.stop="collectedRecord"
										:data-index="index"><text class="shouqia">{{ '收起' }}</text><text
											style="color:#cfe0df;position:relative;"
											class="absAfterArrow2">1呦</text></text>
								</view>
							</view>
						</view>
					</view>
					<view style="height:150rpx;"></view>
				</scroll-view>
				<view class="modifyPopupBtns flx flx_r" @touchmove.stop="true">
					<text @tap.stop="closeModifyPopup">X</text>
				</view>
			</view>
		</view>
		<!-- 啥也没有的时候 -->
		<van-empty v-if="orderInfo.length == 0" image="search" description="空空如也哦" />
		<!-- 审核中的时候的提示信息 showUndeReview ============================?????????????????????????-->
		<van-popup :show="false" @close="onInfoClose" z-index="8" custom-class="warningPopup">
			<view class="warningBox">
				<image class="warningImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontract-info-input.png"></image>
				<view class="warningTxt" style="color:#18c2ba;">{{ '您的修改申请' }}</view>
				<view class="warningTxt" style="color:#18c2ba;">正在审核中，如需加急处理请致电拼包中心{{underReciveTel}}</view>
				<view class="warningBtn2" @tap.stop="onInfoClose">确 定</view>
				<view class="infoPopupCancel" @tap.stop="onInfoClose">
					<van-icon name="close" size="40px" />
				</view>
			</view>
		</van-popup>

		<show-btns :show="showBtns" @clickBtnItem="clickBtnItem"></show-btns>
	</view>
</template>

<script lang="wxs" module="m1">
	var brTime = function(t, type) {
		var t = t.split(' ')
		return type == 'a' ? t[0] : t[1]
	}

	module.exports.brTime = brTime;
</script>
<script>
	var app = getApp();
	var common = require('../../../static/utils/common.js');
	var request = require("../../../static/utils/request");
	var setting = app.globalData.setting;
	var isCall = false;
	export default {
		data() {
			return {
				url: setting.url,
				isFirst: true,
				curState: 'getOrderList', //状态 默认全部
				p: 1, //翻页
				orderInfo: [], //数据
				allDetailIndex: 0, //全部中展开的当前索引
				showWarning: false, //警告框
				showInfo: false, //信息框
				editUrl: '', //编辑的请求url
				editData: {}, //编辑的数据id
				editImg: 'subcontranct-err', //编辑的图片背景
				editTxt: '确认取消预约吗？',
				btnTxt1: '立即取消', //弹框按钮文字1
				btnTxt2: '我点错了', //弹框按钮文字2
				showKuohao: false,
				curTel: '', //当前操作的厂家电话
				curId: '', //当前操作的Id
				curOrderId: '',
				del_type: '1', //垃圾桶数据类型
				shareMsgInfo: {},
				posterId: 0, //要做海报的id
				share_pic: '', //海报路径
				share_btn: false, //海报显示与否
				preData: [], //存储需要重新预约的数据
				showMsgCancel: false, //取消预约控制器
				showMsgTxt1: '', //设置消息提示的文案
				btnTxt1: '取消', //组件按钮1文案
				btnTxt2: '确定', //组件按钮2文案
				errTxt: '', //失败时候的提示文案专用
				showErrMsgBtn1: '', //err按钮1显示控制
				errMsgBtnTxt1: '', //err按钮1 文案
				seeLogFlag: false, //是否显示记录框
				factoryLogInfo: {}, //存放查看的记录数据
				showEvaluate: false, //评价
				evaluateV1: 5, //评价星星
				evaluateV2: 5,
				evaluateV3: 5,
				showCancelXieyi: false, //是否显示取消协议
				shouldVoucherShow: false,
				shouldVoucherShowType: '',
				voucherInfo: [],
				// =============================
				navType: 'order',
				n_currentIndex: '', //被操作的当前的数据索引
				showMask2: false,
				orderOperationTop: '0',
				orderOperations: [{
						name: '预约信息',
						css: '',
						index: 'yyxx'
					},
					{
						name: '联系拼包中心',
						css: '',
						index: 'call'
					},
				],
				isbottom: false
			}
		},
		onLoad: function(options) {
			uni.hideShareMenu()
			this.getMytions(1, 'getOrderList')
		},
		onShareAppMessage: function(res) { //分享
			return {
				title: `您的送货确认码为:${this.shareMsgInfo.code}最晚封包时间:${this.shareMsgInfo.time}`,
				path: '/pages/index/pinbaoMsg/pinbaoMsg?order_id=' + this.posterId,
				imageUrl: this.url + '/public/static/images/minniapp/share-default-pinbao.png'
			}
		},
		onShow: function() { //页面再次展示，重新再获取最新数据
			if (this.isFirst || isCall) {
				this.isFirst = false
			} else {
				if (this.shouldVoucherShow) {
					return
				}
				this.resetDate()
				this.getMytions(1, this.curState)
			}
			isCall = false
		},
		onReachBottom: function() {
			var p = this.p - 0 + 1
			this.getMytions(p, this.curState)
			this.p = p
		},
		onPullDownRefresh: function() {
			this.resetDate()
			this.getMytions(1, this.curState)
		},
		methods: {
			switchNav: function(e) { //切换nav
				var type = e.currentTarget.dataset.type
				if (e.currentTarget.dataset.url == this.curState) {
					return
				}
				this.navType = type
				this.curState = e.currentTarget.dataset.url
				this.resetDate()
				this.getMytions(1, e.currentTarget.dataset.url)
			},
			operationBtn: function(e) { //下面的操作按钮点击
				var index = e.currentTarget.dataset.index
				var type = e.currentTarget.dataset.type
				var data = this.orderInfo[index]
				var that = this
				this.n_currentIndex = index
				switch (type) {
					case 'pj': //评价
						if (data.order_status != 4 && data.order_status != 5) {
							return
						} else {
							this.curOrderId = data.order_id
							this.showEvaluate = true
						}
						break;
					case 'qxyy': //取消预约
						if (data.order_status != 0) {
							return
						} else {
							this.showMsgCancel = true
							this.showMsgTxt1 = `取消次数过多的话，可能会被限制预约服务，如果信息填写错误，您可以在预约信息页修改`
							this.btnTxt1 = '返回修改'
							this.btnTxt2 = '取消预约'
							this.curId = data.order_id
							this.curOrderId = data.order_id
							this.editUrl = 'cancelOrder'
						}
						break;
					case 'gbdd': //关闭订单
						if (data.order_status != 1 && data.order_status != 2 && data.order_status != 3) {
							return
						} else {
							uni.showModal({
								content: '拼包中心已收货的厂家，关闭后系统将不能跟踪货物状态，是否继续？',
								confirmText: '继续关闭',
								cancelText: '我再想想',
								success(res) {
									if (res.confirm) {
										that.editData = {
											order_id: data.order_id
										}
										that.editUrl = 'applyCancelOrder'
										that.curOrderId = data.order_id
										that.showCancelXieyi = true
									} else if (res.cancel) {}
								}
							})
						}
						break;
					case 'txsh': //提醒送货
						if (data.order_status > 5) {
							return
						} else {
							this.showBtns = true
							this.posterId = data.order_id
							this.shareMsgInfo = {
								time: data.appointment_date,
								code: data.auth_code,
							}
						}
						break;
					case 'lbdh': //拉包电话
						if (data.order_status != 2 && data.order_status != 3 && data.order_status != 4 && data.order_status != 5) {
							return
						} else {
							if (data.logistics_phone != '') {
								isCall = true
								uni.makePhoneCall({
									phoneNumber: data.logistics_phone,
								})
							} else {
								uni.showModal({
									content: '您预约的拉包方式为拼包中心代拉，由拼包中心负责通知拉包人员，谢谢您的支持！',
									showCancel: false,
									success(res) {
										if (res.confirm) {}
									}
								})
							}
						}
						break;
					case 'lbmx': //拉包明细
						if (data.order_status != 4 && data.order_status != 5) {
							return
						} else {
							this.req('getTakeawayLog', {
								order_id: data.order_id
							}, function(res) {
								if (res.data.result.length > 0) {
									that.voucherInfo = [...res.data.result]
									that.shouldVoucherShow = true
									that.shouldVoucherShowType = '拉包明细'
								} else {
									uni.showToast({
										title: '当前订单暂时没有拉包记录',
										icon: 'none'
									})
								}
							})
						}
						break;
					case 'gbdd-code': //关闭-确认码
						break;
					case 'gbdd-shz': //关闭订单审核中
						uni.showToast({
							title: '拼包中心审核中',
							icon: 'none'
						})
						break;
					case 'ccdb': //催促打包
						this.urgeCore(that.orderInfo[this.n_currentIndex].is_urge, that.orderInfo[this.n_currentIndex].order_status)
						break
					case 'dbjl': //打包记录
						if (data.order_status == 2 || data.order_status == 3) {
							that.req('getPackLog', {
								order_id: data.order_id
							}, function(res) {
								if (res.data.result) {
									if (res.data.result.length == 0) {
										return uni.showToast({
											title: '该订单暂无相关记录',
											icon: 'none'
										})
									} else {
										that.voucherInfo = [...res.data.result]
										that.shouldVoucherShow = true
										that.shouldVoucherShowType = '打包记录'
									}
								}
							})
						}
						break;
					default:
						break;
				}
			},
			clickBtnItem: function(e) {
				if (e.detail.type == 'poster') {
					this.sharePoster()
				}
				this.showBtns = false
			},
			getMytions: function(p, url) { //=======================
				var that = this
				request.get(that.url + '/api/pinbao/' + url, {
					data: {
						p: p,
						type: that.del_type
					},
					success: function(res) {
						uni.stopPullDownRefresh()
						if (res.data.status == 1) {
							if (that.curState == 'pppp4') {
								var tempInfo = res.data.result.map((item) => {
									item.checked = false
									return item
								})
								that.orderInfo = [...that.orderInfo, ...tempInfo]
							} else {
								that.orderInfo = [...that.orderInfo, ...res.data.result]
							}
						}
					}
				})
			},
			resetDate: function() { //重置数据
				this.p = 1
				this.orderInfo = []
			},
			requsstDetail: function(e) { //请求 订单展开的======================
				uni.navigateTo({
					url: '/pages/subcontract/tionDetail/tionDetail?order_id=' + e.currentTarget.dataset.id,
				})
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
					}
				})
			},
			callKuaidi: function(e) {
				if (e.currentTarget.dataset.tel != '') {
					isCall = true
					uni.makePhoneCall({
						phoneNumber: e.currentTarget.dataset.tel,
					})
				} else {
					uni.showModal({
						content: '您预约的拉包方式为拼包中心代拉，由拼包中心负责通知拉包人员，谢谢您的支持！',
						showCancel: false,
						success(res) {
							if (res.confirm) {}
						}
					})
				}
			},
			allDetailClose: function() { //关闭打开的全部
			this.isShowAllDetail = false
			},
			callTel: function(e) { //电话联系厂家
				var tel = e.currentTarget.dataset.tel
				var id = e.currentTarget.dataset.id
				this.editData = {
					manufactor_id: id,
					curTel: tel
				}
				isCall = true
				this.makeCall(tel)
			},
			onInfoClose: function() {
				this.showInfo = false
				this.showUndeReview = false
			},
			onCoreListClose: function() {
				this.showCoreList = false
			},
			reOrderCoreOk: function(e) { //前往预约页面
				var id = e.currentTarget.dataset.sellerid
				uni.navigateTo({
					url: '/pages/subcontract/write/write?seller_id=' + id + '&from=re',
				})
			},
			onWarningClose: function() {
				this.showWarning = false
				this.showKuohao = false
				this.showCancelXieyi = false
			},
			sharePoster: function(e) { //分享成海报
				uni.showLoading({
					title: '正在生成...',
				})
				var that = this
				uni.getImageInfo({
					src: that.url + '/api/pinbao/getRemindPoster?order_id=' + that.posterId +
						'&token=' + uni.getStorageSync('app:userInfo').token,
					isShowLoading: false,
					success: function(res) {
						that.share_btn = true
						that.share_pic = res.path
						uni.hideLoading()
					},
					complete: function(res) {}
				})
			},
			eidtTelAndCall: function() { //拨打电话并添加
				var tel = this.curTel
				var that = this1
				if (/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(tel)) { //手机号码ok请求
					request.post(that.url + '/api/pinbao/addFactoryPhone', {
						data: {
							manufactor_id: that.editData.manufactor_id,
							phone: that.curTel
						},
						success: function(res) {
							if (res.data.status == 1) {
								isCall = true
								that.makeCall(tel)
							}
							that.showInfo = false
						}
					})
				} else {
					uni.showToast({
						title: '手机号码格式不正确',
						icon: 'none'
					})
				}
			},
			closeShareModal: function() { // 关闭海报
				this.share_btn = false
			},
			saveSharePic: function() { //保存海报
				var that = this
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success: function(res) {
						uni.saveImageToPhotosAlbum({
							filePath: that.share_pic,
							success: function(res) {
								that.share_btn = false
								uni.showToast({
									title: '保存成功',
									duration: 2000
								})
							}
						})
					},
					fail: function(res) {
						common.checkAuthorize('scope.writePhotosAlbum')
					}
				})
			},
			previewSharePic: function() { //海报预览
				uni.previewImage({
					urls: [this.share_pic],
				})
			},
			urgeCore: function(is_urge, order_status) { //催促打包= e.currentTarget.dataset.info
				var that = this
				if (is_urge == 1 && order_status == 1) {
					uni.showModal({
						content: `拼包中心已收到您的催促打包，如需加急请致电'${this.orderInfo[0].seller_phone}'`,
						showCancel: false,
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定')
							}
						}
					})
					return
				}
				uni.showModal({
					title: '催促打包',
					content: '请核对您的货物是否已送齐，如果送齐了，请立即催促打包，催促后会优先给您打包',
					confirmText: '立即催促',
					cancelText: '我再想想',
					confirmColor: '#18c2ba',
					success(res) {
						if (res.confirm) {
							var id = that.orderInfo[that.n_currentIndex].order_id
							request.post(that.url + '/api/pinbao/urgeOrder', {
								data: {
									order_id: id
								},
								success: function(res) {
									uni.showModal({
										content: '催促成功',
										showCancel: false,
										success(res) {
											if (res.confirm) {
												that.orderInfo[that.n_currentIndex].is_urge = 1
												that.orderInfo = [...that.orderInfo]
											} else if (res.cancel) {}
										}
									})
								}
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			closeModifyPopup: function() { //关闭修改的弹窗
				this.shouldVoucherShow = false
				this.voucherInfo = []
			},
			seeRecord: function(e) { //查看记录
				var id = e.currentTarget.dataset.id
				this.getFactoryLog(id)
			},
			closeLog: function() {
				this.seeLogFlag = false
			},
			delOrderToRecycle: function(e) { //删除至回收站
				var id = e.currentTarget.dataset.id
				var that = this
				this.showWarning = true
				this.editImg = 'subcontranct-err'
				this.editTxt = '删除后无法恢复，但您可在回收站内查看'
				this.showKuohao = true
				this.btnTxt1 = '确 认 删 除'
				this.btnTxt2 = '取 消'
				this.editUrl = 'delOrderToRecycle'
				this.curId = id
			},
			calcelOrderClick1: function() { //取消订单 点击取消
				var that = this
				this.req(this.editUrl, {
					order_id: this.curId
				}, function(res) {
					uni.showToast({
						title: '已取消预约',
					})
					that.isShowAllDetail = false
					that.resetDate()
					that.getMytions(1, that.curState)
				})
			},
			calcelOrderClick2: function() { //取消订单 点击返回修改
				console.log('点击修改的')
			},
			doEvaluate: function() { //评价的提交操作
				var that = this
				this.req('addOrderEvaluate', {
					order_id: that.curOrderId,
					service: that.evaluateV1,
					efficiency: that.evaluateV2,
					accuracy: that.evaluateV3
				}, function(res) {
					that.showEvaluate = false
					that.orderInfo[that.n_currentIndex].is_evaluate = 1
					that.evaluateV1 = 5
					that.evaluateV2 = 5
					that.evaluateV3 = 5
					that.orderInfo = [...that.orderInfo]
					uni.showModal({
						content: '提交成功，感谢您的支持！祝您生活愉快！',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								console.log('用户点击确定')
							}
						}
					})
				})
			},
			onEvaluateChange1: function(e) {
				var index = e.currentTarget.dataset.index
				var val = e.detail
				switch (index) {
					case '1':
						this.evaluateV1 = val
						break;
					case '2':
						this.evaluateV2 = val
						break;
					case '3':
						this.evaluateV3 = val
						break;
					default:
						break;
				}
			},
			agreeAgreement: function() { //同意协议
				var that = this
				this.req(this.editUrl, this.editData, function(res) {
					uni.showToast({
						title: '已向拼包中心发送关闭申请',
						duration: 1500,
						icon: 'none',
						mask: 'true'
					})
					setTimeout(() => {
						that.showCancelXieyi = false
						that.editData = {}
						that.getMytions(1, that.curState)
					}, 2000)
				})
			},
			seeOrderDetailImgs: function(e) { //查看拉包明细中的图片
				var index = e.currentTarget.dataset.index
				uni.previewImage({
					urls: this.voucherInfo[index].img,
					current: this.voucherInfo[index].img[0]
				})
			},
			overlookFactory: function() { //删除到回收站
				var that = this
				this.req('delOrderToRecycle', {
					order_id: this.curId
				}, function(res) {
					that.showWarning = false
					that.curId = ''
					that.resetDate()
					that.getMytions(1, that.curState)
				})
			},
			// 重新对所有的操作 弹窗 请求做封装
			// 请求 函数
			req: function(url, params, cb) {
				request.get('/api/pinbao/' + url, {
					data: params,
					success: function(res) {
						cb && cb(res)
					}
				})
			},
			seeDetailFac: function(e) { //展开
				var index = e.currentTarget.dataset.index
				this.voucherInfo[index].lj = !this.voucherInfo[index].lj
				this.voucherInfo = [...this.voucherInfo]
			},
			collectedRecord: function(e) { //收起
				var index = e.currentTarget.dataset.index
				this.voucherInfo[index].lj = false
				this.voucherInfo = [...this.voucherInfo]
			},
			doOperation: function(e) { //显示遮罩操作
				var that = this
				var index = e.currentTarget.dataset.index
				var apply = this.orderInfo[index].apply_status + ''
				var status = this.orderInfo[index].order_status + ''
				var lis = [{
						name: '预约信息',
						css: '',
						index: 'yyxx'
					},
					{
						name: '联系拼包中心',
						css: '',
						index: 'call'
					},
				]
				var h = 0

				// 根据状态值  设置框内的内容
				switch (status) {
					case '0':
						break;
					case '1':
						if (apply == 0 || apply == 3) {
							lis.unshift({
								name: '关闭订单',
								css: '',
								index: 'gbdd'
							})
						} else if (apply == 1) {
							lis.unshift({
								name: '关闭订单/审核中',
								css: true,
								index: 'gbddshz'
							})
						}
						break;
					case '2':
						if (apply == 0 || apply == 3) {
							lis.unshift({
								name: '关闭订单',
								css: '',
								index: 'gbdd'
							})
						} else if (apply == 1) {
							lis.unshift({
								name: '关闭订单/审核中',
								css: true,
								index: 'gbddshz'
							})
						}
						break;
					case '3':
						if (apply == 0 || apply == 3) {
							lis.unshift({
								name: '关闭订单',
								css: '',
								index: 'gbdd'
							})
						} else if (apply == 1) {
							lis.unshift({
								name: '关闭订单/审核中',
								css: true,
								index: 'gbddshz'
							})
						}
						break;
					case '4':
						lis.unshift({
							name: '立即评价',
							css: '',
							index: 'ljpj'
						}, {
							name: '重要信息',
							css: true,
							index: 'zyxx'
						})

						break;
					case '5':
						if (that.curState == 'getOrderList') {
							if (this.orderInfo[index].is_evaluate == 0) {
								lis.unshift({
									name: '立即评价',
									css: '',
									index: 'ljpj'
								}, {
									name: '移入回收站',
									css: '',
									index: 'yrhsz'
								})
							} else {
								lis.unshift({
									name: '移入回收站',
									css: '',
									index: 'yrhsz'
								})
							}
						} else {
							if (this.orderInfo[index].is_evaluate == 0) {
								lis.unshift({
									name: '立即评价',
									css: '',
									index: 'ljpj'
								})
							}
						}
						break;
					case '6':

						break;
					case '7':

						break;
					default:
						break;
				}
				//动态设置框的位置
				uni.createSelectorQuery().select(`.queryClass${index}`).boundingClientRect(function(rect) {
					var isbottom = true
					if (rect.top > 180) {
						isbottom = false
						h = (rect.top - (lis.length * 27) - 60)
					} else {
						isbottom = true
						h = rect.top
					}
					that.showMask2 = true
					that.n_currentIndex = index
					that.orderOperationTop = h + 'px'
					that.orderOperations = [...lis]
					that.isbottom = isbottom
				}).exec()
			},
			clickRoundDoted: function(e) { //点击圆点内部的选项
				var type = e.currentTarget.dataset.type
				var index = this.n_currentIndex
				var status = this.orderInfo[index].order_status
				var orderid = this.orderInfo[index].order_id
				var sellerid = this.orderInfo[index].seller_id
				var receNum = this.orderInfo[index].receiving_num
				var goNum = this.orderInfo[index].take_away_num || 0
				var tel = this.orderInfo[index].seller_phone + ''
				var that = this
				this.showMask2 = false
				switch (type) {
					case 'yyxx':
						var s = 'a'
						if (receNum == 0) {
							s = 'a'
						} else if (receNum > 0 && goNum == 0) {
							s = 'b'
						} else {
							s = 'c'
						}
						uni.navigateTo({
							url: '/pages/subcontract/write/write?reEdit=' + s + '&seller_id=' + sellerid +
								'&orderid=' + orderid,
						})
						break;
					case 'call':
						isCall = true
						uni.makePhoneCall({
							phoneNumber: tel,
						})
						break;
					case 'gbdd':
						if (status != 1 && status != 2 && status != 3) {
							return
						} else {
							uni.showModal({
								content: '拼包中心已收货的厂家，关闭后系统将不能跟踪货物状态，是否继续？',
								confirmText: '继续关闭',
								cancelText: '我再想想',
								success(res) {
									if (res.confirm) {
										that.editData = {
											order_id: orderid
										}
										that.editUrl = 'applyCancelOrder'
										that.curOrderId = orderid
										that.showCancelXieyi = true
									} else if (res.cancel) {}
								}
							})
						}
						break;
					case 'gbddshz':
						uni.showToast({
							title: '拼包中心审核中，请耐心等待，或联系拼包中心加急处理~',
							icon: 'none',
							duration: 2000
						})
						break;
					case 'ljpj':
						if (that.orderInfo[index].is_evaluate == 1) {
							return uni.showToast({
								title: '订单已评价，无需重复评价，感谢您的评价~',
								icon: 'none'
							})
						}
						that.curOrderId = orderid
						that.showEvaluate = true
						break;
					case 'yrhsz':
						that.showWarning = true
						that.editImg = 'subcontranct-err'
						that.editTxt = '删除后无法恢复，但您可在回收站内查看'
						that.showKuohao = true
						that.btnTxt1 = '确 认 删 除'
						that.btnTxt2 = '取 消'
						that.editUrl = 'delOrderToRecycle'
						that.curId = orderid
						break;
					case 'zyxx':
						uni.showModal({
							content: '您还有货物在拼包中心未打包或未拉包，请注意跟踪记录!',
							showCancel: false
						})
						break;
					default:
						break;
				}
			},
			closeMask2: function() {
				this.showMask2 = false
			},
		}
	}
</script>

<style scoped src="./mytions.css">

</style>
