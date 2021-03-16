<template>
	<view>
		<view class="top1">
			<view class="topTitle">管理我的vip客户</view>
			<van-sticky>
				<view style="padding:10rpx 0;">
					<input class="addInput" placeholder-class="phClass" v-model="inputValue" placeholder="请输入姓名或手机号" />
					<text class="addButton" @tap="addMember">添加VIP客户</text>
				</view>
			</van-sticky>
		</view>
		<van-tabs color="#18c2ba" :active="active1" @change="onNavChange" custom-class="navrootclass">
			<van-tab title="我的VIP客户">
				<van-row custom-class="passtitle">
					<van-col span="11">手机号</van-col>
					<van-col span="5">通过日期</van-col>
					<van-col span="8">操作</van-col>
				</van-row>
				<view>
					<van-row custom-class="memberItem" style="height:80rpx;" v-for="(item, index) in passList"
						:key="'pass' + index">
						<van-col span="11" :style="'height: 80rpx; line-height:' + item.remark ? '' : '80rpx'">
							<view class="myviptxt">{{ item.phone }}</view>
							<view class="myviptxt">{{ item.remark }}</view>
						</van-col>
						<van-col span="5" style="height:80rpx;line-height:80rpx;"><text
								style="font-size:28rpx;">{{ item.add_time }}</text></van-col>
						<van-col span="8" style="height:80rpx;">
							<view class="passClass" @tap="editName" :data-remark="item.remark" :data-id="item.id"
								:data-tel="item.phone">备注名字</view>
							<view class="refuseClass" @tap="ask" :data-id="item.id" :data-tel="item.phone"
								:data-remark="item.remark" data-type="delStoreMember">取消VIP资格</view>
						</van-col>
					</van-row>
				</view>
			</van-tab>
			<van-tab title="待审核" :info="audit_count > 0 ? audit_count : ''">
				<van-row custom-class="passtitle">
					<van-col span="11">手机号</van-col>
					<van-col span="5">申请日期</van-col>
					<van-col span="8">操作</van-col>
				</van-row>
				<view>
					<van-row custom-class="memberItem" v-for="(item, index) in unPassList" :key="'unpass' + index">
						<van-col span="9" style="height:80rpx;line-height:80rpx;">{{ item.phone }}</van-col>
						<van-col span="7" style="height:80rpx;line-height:80rpx;"><text
								style="font-size:28rpx;">{{ item.add_time }}</text></van-col>
						<van-col span="8" style="height:80rpx;">
							<view class="passClass" :data-id="item.id" :data-tel="item.phone"
								data-type="auditStoreMember" data-type2="pass" @tap="ask">通过</view>
							<view class="refuseClass" :data-id="item.id" :data-tel="item.phone"
								data-type="auditStoreMember" data-type2="refuse" @tap="ask">拒绝</view>
						</van-col>
					</van-row>
				</view>
			</van-tab>
		</van-tabs>

		<!-- showAddPopup -->
		<van-popup :show="showAddPopup" @close="onPopupClose" round>
			<view class="addNewMemberBox">
				<view class="addNewMemberTtile">添加VIP客户</view>
				<view class="addNewMemberInputs">
					<input placeholder-style="font-size:24rpx;" v-model="addNew.phone" maxlength="11"
						class="addNewMemberInput" type="number" placeholder="输入手机号(壹童网注册手机号)"></input>
					<input placeholder-style="font-size:24rpx;" v-model="addNew.remark" type="text"
						class="addNewMemberInput" placeholder="备注姓名"></input>
				</view>
				<view class="addNewMemberBtns">
					<text class="borderR" @tap.stop="onPopupClose">取消</text>
					<text class="coltheme" @tap.stop="submitNew">确定</text>
				</view>
			</view>
		</van-popup>

		<!-- 添加新会员弹窗 -->

		<!-- 修改备注 -->
		<van-dialog use-slot id="van-dialog">
			<input :hidden="!showInput" placeholder-style="color: #fff;text-align: center;" class="editInput"
				focus="true" v-model="editName" @input="editInputChange" placeholder="请输入备注"></input>
		</van-dialog>

		<!-- 底部菜单 -->
		<!-- <import src="../../index/publics/publics.wxml"/>
		<import src="../publicPage/publicPage.wxml"/>
		<template is="distributMenu" data="{{page:page,isiphoneX:isiphoneX,is_A:1}}" />
		<template is="operations" data="{{operaList,current:'',isiphoneX:isiphoneX}}" wx:if="{{shouldOperationsShow}}" />
		<template is="proposal" data="{{proposalData,isProposalDone}}" wx:if="{{shouldProposalShow}}" /> -->
	</view>
</template>

<script>
	var common = require('../../../static/utils/common.js');
	var {
		operaList
	} = require('../../../static/utils/util2.js');
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	export default {
		data() {
			return {
				url: setting.url,
				page: 5,
				is_A: true,
				isiphoneX: uni.getStorageSync('isiphoneX') || false,
				active1: 0, //当前Nav
				addMemberDialog: false, //增加新的会员显示
				inputValue: '', //输入框的值
				hasMore: true,
				status: 1,
				p: 1,
				editName: '',
				audit_count: 0,
				passList: [], //已通过列表
				unPassList: [], //未通过列表
				showInput: false, //备注的input框
				showAddPopup: false,
				addNew: {
					phone: '',
					remark: ''
				},
				shouldOperationsShow: false,
				shouldProposalShow: false,
				operaList: operaList,
				proposalData: { //反馈 相关
					img: [],
					proposalArea: ''
				},
				isProposalDone: false, //反馈是否完成展示成功的界面
			}
		},
		onLoad: function(options) {
			this.getMember(1, 1);
			this.is_A = uni.getStorageSync('app:userInfo').is_B == 1 ? false : true;
		},
		onReachBottom: function() {
			if (!this.hasMore) {
				return uni.showToast({
					title: '已经加载完全部',
					icon: 'none'
				})
			}
			var p = this.p
			this.getMember(this.status, p - 0 + 1)
			this.p = p - 0 + 1;
		},
		methods: {
			getMember: function(status, p) { //获取会员列表数据
				var that = this
				request.get(that.url + '/api/Store/getStoreMember', {
					data: {
						status: status,
						p: p
					},
					success: function(res) {
						if (res.data.status == 1) {
							if (res.data.result.list.length == 0) {
								uni.showToast({
									title: '已加载完全部',
									icon: 'none'
								})
								that.hasMore = false;
							}
							if (that.status == 1) {
								that.audit_count = res.data.result.audit_count;
								that.passList = [...that.passList, ...res.data.result.list];
							} else {
								that.audit_count = res.data.result.audit_count;
								that.unPassList = [...that.unPassList, ...res.data.result.list];
							}
						}
					}
				})
			},
			onNavChange: function(e) {
				var curNav = e.detail.name;
				this.status = curNav == 0 ? 1 : 2;
				this.p = 1;
				this.passList = [];
				this.unPassList = [];
				this.hasMore = true;
				this.getMember(this.status, 1)
			},
			addMember: function() { //添加会员
				var that = this
				if (this.inputValue == '') {
					return
				}
				if (!(/^1[3456789]\d{9}$/.test(this.inputValue))) {
					return uni.showToast({
						title: '手机号输入有误，请填写正确手机号',
						icon: 'none'
					})
				} else {
					that.passList = []
					that.unPassList = []
					uni.showModal({
						title: '提示',
						content: '确定添加' + that.inputValue + '成为您的VIP客户吗？添加后对方将能看到您的私密商品',
						success(res) {
							if (res.confirm) {
								that.p = 1
								that.addRequest()
							} else if (res.cancel) {}
						}
					})
				}
			},
			submitNew: function() {
				if (this.addNew.phone == '') {
					return
				}
				if (!(/^1[3456789]\d{9}$/.test(this.addNew.phone))) {
					return uni.showToast({
						title: '手机号输入有误，请填写正确手机号',
						icon: 'none'
					})
				}
			},
			addRequest: function() { //添加会员请求
				var that = this
				request.post(that.url + '/api/Store/addStoreMember', {
					data: {
						phone: that.inputValue
					},
					success: function(res) {
						if (res.data.status == 1) {
							uni.showToast({
								title: '添加成功，会员已添加至您的会员列表中',
								duration: 2000
							})
							// 再次获取会员列表
							that.getMember(1, 1)
						} else {
							if (res.data.status == 2) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
								setTimeout(function() {
									that.getMember(that.status, 1)
								}, 1500)
							}
						}
					}
				})
			},
			onPopupClose: function() {
				this.showAddPopup = false;
			},
			doMember: function(id, type, status) { //会员操作
				var that = this
				var data = {
					id: id
				}
				if (status == 'refuse') {
					data = {
						id: id,
						status: 0
					}
				} else if (status == 'pass') {
					data = {
						id: id,
						status: 1,
						remark: that.editName
					}
				}
				request.post(that.url + '/api/Store/' + type, {
					data,
					success: function(res) {
						if (res.data.status == 1) {
							that.passList = []
							that.unPassList = []
							that.p = 1
							uni.showToast({
								title: '操作成功',
							})
							that.getMember(that.status, 1)
						}
					}
				})
			},
			ask: function(e) { //删除会员询问
				var id = e.currentTarget.dataset.id
				var tel = e.currentTarget.dataset.tel
				var type = e.currentTarget.dataset.type
				var str = ''
				var status = 'ok'
				var that = this
				this.showInput = false
				this.editName = '';
				if (type == 'delStoreMember') {
					str = '确定删除VIP-' + e.currentTarget.dataset.remark + '-'
				} else if (type == 'auditStoreMember') {
					if (e.currentTarget.dataset.type2 == 'pass') {
						str = '确定通过VIP-'
						status = 'pass'
						this.showInput = true
					} else {
						str = '确定拒绝VIP-'
						status = 'refuse'
					}
				}
				var that = this
				uni.showModal({
					title: str + tel + '-吗？',
					success: res => {
						if (res.confirm) {
							that.doMember(id, type, status)
						}
					}
				})
			},
			distributTopages: function(e) {
				var index = e.currentTarget.dataset.idx
				if ((index == 5 || index == 3) && !this.is_A) {
					return uni.showToast({
						title: '开发中~~',
						icon: 'none'
					})
				}
				if (index == 2) { //点击的店铺操作
					if (this.shouldProposalShow) {
						return
					}
					this.shouldOperationsShow = !this.shouldOperationsShow;
					return
				}
				common.todistribut(index, this.page);
			},
			onAddClose: function() {
				this.addMemberDialog = false;
			},
			editInputChange: function(e) { //修改备注
				if (e.detail.value) {
					if (e.detail.value.trim().length > 8) {
						uni.showToast({
							title: '备注名称不能超过8个字',
							icon: 'none'
						})
						this.editName = e.detail.value.slice(0, 8)
						return
					}
				}
			},
			editName: function(e) { //修改备注
				var id = e.currentTarget.dataset.id
				var that = this
				this.showInput = true
				this.editName = e.currentTarget.dataset.remark
				uni.showModal({
					title: '修改备注(0-8个字)',
					success: res => {
						request.post(that.url + '/api/Store/updateStoreMemberRemark', {
							data: {
								id: id,
								remark: that.editName
							},
							success: function(res) {
								if (res.data.msg == '添加成功') {
									uni.showToast({
										title: res.data.msg,
										icon: 'none'
									})
									that.passList = []
									that.unPassList = []
									that.p = 1
									that.getMember(that.status, 1)
								} else {
									uni.showToast({
										title: res.data.msg,
										icon: 'none'
									})
								}
							}
						})
					}
				})
			},
			addNewGoods: function() {
				uni.navigateTo({
					url: '/pages/goods/addGoods/index?goods_id=0&is_A=1',
				})
			},
			// =======================================  以下为新增加店铺设置 以及底部导航
			closeOperations: function() { //关闭店铺管理的操作选项
				this.shouldOperationsShow = false;
				this.shouldProposalShow = false;
			},
			addNewGoods: function() {
				uni.navigateTo({
					url: '/pages/goods/addGoods/index?goods_id=0&is_A=1'
				})
			},
			clickTelmpleteOpera: function(e) {
				var index = e.currentTarget.dataset.index + ''
				var that = this
				var pages = getCurrentPages()
				var historyArr = []
				for (let i = 0; i < pages.length; i++) {
					historyArr.push(pages[i].route)
				}
				that.shouldOperationsShow = false
				switch (index) {
					case '0':
						var index = historyArr.indexOf("pages/user/account_b/account_b")
						if (index != -1) {
							uni.navigateBack({
								delta: historyArr.length - index - 1,
							})
							return
						}
						uni.navigateTo({
							url: '/pages/user/account_b/account_b',
						})
						break;
					case '1':
						var index = historyArr.indexOf("/pages/distribut0/DIYshop/DIYshop")
						if (index != -1) {
							uni.navigateBack({
								delta: historyArr.length - index - 1,
							})
							return
						}
						uni.navigateTo({
							url: '/pages/distribut0/DIYshop/DIYshop',
						})
						break;
					case '2':
						that.shouldProposalShow = true
						that.isProposalDone = false
						break;
					case '3':
						var index = historyArr.indexOf("/pages/distribut0/DIYshopPoster/DIYshopPoster")
						if (index != -1) {
							uni.navigateBack({
								delta: historyArr.length - index - 1,
							})
							return
						}
						uni.navigateTo({
							url: '/pages/distribut0/DIYshopPoster/DIYshopPoster',
						})
						break;
					default:
						break;
				}
			},
			callService: function() {
				uni.makePhoneCall({
					phoneNumber: '400-008-6336',
				})
			},
			proposalAddImg: function() { //增加投诉建议的图片
				var that = this
				if (that.proposalData.img.length >= 5) {
					return
				}
				uni.chooseImage({
					count: 5 - this.proposalData.img,
					sourceType: ['album'],
					success: function(res) {
						res.tempFilePaths.forEach((item) => {
							that.uploadFile(item)
						})
					}
				})
			},
			delProposalImg: function(e) { //删除投诉建议的图片
				var index = e.currentTarget.dataset.index;
				var imgs = this.proposalData.img;
				imgs.splice(index, 1);
				this.proposalData.img = imgs;
				this.proposalData = Object.assign({}, this.proposalData);
			},
			uploadFile: function(src) { //上传图片
				if (this.proposalData.img.length >= 5) {
					return
				}
				uni.showLoading({
					title: '上传中...',
					mask: true
				})
				const that = this
				uni.uploadFile({
					filePath: src,
					name: 'qinzi_imgs',
					url: that.url + '/api/newjoin/upload_qianzi_img',
					success: function(res) {
						if (res.statusCode !== 200) {
							return
						}
						var result = JSON.parse(res.data)
						that.proposalData.img = [...that.proposalData.img, ...[result.result]]
						that.proposalData = Object.assign({}, that.proposalData)
						uni.hideLoading()
					}
				})
			},
			proposalAreaInput: function(e) { //input值变化
				this.proposalData.proposalArea = e.detail.value
				this.proposalData = Object.assign({}, this.proposalData)
			},
			proposalSubmit: function() { //提交
				var complaint_content = this.proposalData.proposalArea + ''
				var img = this.proposalData.img
				complaint_content = complaint_content.replace(' ', '')
				if (complaint_content.length <= 5) {
					return uni.showToast({
						title: '请输入至少5个字以上的问题描述~',
						icon: 'none'
					})
				}
				if (img.length == 0) {
					return uni.showToast({
						title: '请至少上传一张问题描述图片~',
						icon: 'none'
					})
				}
				var complaint_img = img.join(',')
				var that = this
				request.post(that.url + '/api/StoreBusiness/complaint', {
					data: {
						store_id: uni.getStorageSync('app:userInfo').store_id || 0,
						user_id: uni.getStorageSync('app:userInfo').user_id || 0,
						complaint_content,
						complaint_img
					},
					success: function(res) {
						that.proposalData = {
							img: [],
							proposalArea: ''
						}
						that.isProposalDone = true
					}
				})
			}
		}
	}
</script>

<style scoped src="./vipList.css">

</style>
