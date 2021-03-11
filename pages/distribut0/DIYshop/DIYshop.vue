<template>
	<view>
		<view class="topBg">
			<image class="bgImg"
				src="https://test.yitongwang.com/public/static/images/minniapp/DIYshop_shop_banner.png"></image>
		</view>

		<!-- 店铺信息设置部分 -->
		<view class="setContent">
			<view class="setTit pdlr theme s30 fw600">店铺信息</view>
			<view class="setItem pdlr afterLine">
				<text class="">店铺名称</text>
				<text class="flx1">{{ subParams.store_name }}</text>
				<image @tap.stop="modifyItem" data-type="name" class="setModifyImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontract-icon-write.png"></image>
			</view>
			<view class="setItem pdlr afterLine">
				<text class="">店铺地址</text>
				<text v-if="!isModifyAddress" class="flx1">{{ subParams.store_re_address || '' }}</text>
				<text v-else class="flx1">{{ (address.province_name ? (address.province_name + ' / ') : '') + (address.city_name ? (address.city_name + ' / ') : '') + (address.district_name ? (address.twon_name ? (address.district_name  + ' / ') : address.district_name ) : '') + (address.twon_name || '') }}</text>
				<image @tap.stop="openRegionsModal" class="setModifyImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontract-icon-write.png"></image>
			</view>
			<view class="setItem pdlr afterLine">
				<text class="">详细地址</text>
				<input class="detailAddress" type="text" @blur="detailAddressBlur" @confirm="detailAddressBlur" v-model="subParams.store_info_address"
					placeholder="如:富康西路168号"></input>
			</view>
			<view class="setItem pdlr">
				<text class="">联系方式</text>
				<text class="flx1">{{ subParams.store_phone }}</text>
				<image @tap.stop="modifyItem" data-type="tel" class="setModifyImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontract-icon-write.png"></image>
			</view>

			<view class="radioBox pdlr">
				<text class="fw600 theme">分享海报是否显示价格</text>
				<view class="setRadio">
					<view class="radioL" @tap.stop="change_share_poster_is_show_price" data-type="a">
						<text class="radioRound"
							:class="{radioRoundCurrent: subParams.share_poster_is_show_price == 1}"></text>
						<text :style="'color:' + subParams.share_poster_is_show_price == 1 ? '#18c2ba' : ''">是</text>
					</view>
					<view class="radioR" @tap.stop="change_share_poster_is_show_price" data-type="b">
						<text class="radioRound"
							:class="{radioRoundCurrent: subParams.share_poster_is_show_price == 0}"></text>
						<text :style="'color:' + subParams.share_poster_is_show_price == 0 ? '#18c2ba' : ''">否</text>
					</view>
				</view>
			</view>

		</view>
		<!-- showPopup -->
		<uni-popup :show="showPopup" @close="onPopupClose" round @click-overlay="onPopupClose">
			<view class="modifyPopup">
				<view class="modifyT">{{ changeText }}</view>
				<input v-model="subParams.store_name" :hidden="modifyType == 'tel'" class="modifyInput" type="text"
					placeholder="请输入新的店铺名称"></input>
				<input v-model="subParams.store_phone" :hidden="modifyType == 'name'" class="modifyInput" type="number"
					placeholder="请输入新的手机号码"></input>
				<view class="modifyBtns">
					<text class="borderL" @tap.stop="onPopupClose">取消</text>
					<text class="borderR" @tap.stop="sureChange">确定</text>
				</view>
			</view>
		</uni-popup>

		<!-- <regions :regions='regions'></regions>
		<publics :page='2' :isiphoneX='isiphoneX' :is_A='store.is_A' :isGoodsList='true'></publics>
		<operations :operaList='operaList' current='店铺设置' :isiphoneX='isiphoneX' v-if="{{shouldOperationsShow}}">
		</operations>
		<proposal :proposalData='proposalData' :isProposalDone='isProposalDone' v-if="{{shouldProposalShow}}">
		</proposal> -->
	</view>
</template>

<script>
	import regions from '../../components/regions/regions';
	import publics from '../../components/publics/publics';
	import operations from '../../components/operations/operations';
	import proposal from '../../components/proposal/proposal';
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	var common = require('../../../static/utils/common.js');
	var {
		operaList
	} = require('../../../static/utils/util2.js');
	import Regions from '../../../static/utils/regions/Regions.js';
	export default {
		components: {
			regions,
			publics,
			operations,
			proposal
		},
		data() {
			return {
				store_id: 0,
				shouldOperationsShow: false,
				shouldProposalShow: false,
				changeText: '',
				operaList: operaList,
				url: setting.url,
				page: 99,
				isiphoneX: uni.getStorageSync('isiphoneX') || false,
				is_A: true,
				address: {}, //收货地址信息
				subParams: {
					store_id: 48,
					store_name: '毛毛虫',
					province_id: '',
					city_id: '',
					district: '',
					store_info_address: '',
					store_phone: '',
					share_poster_is_show_price: 0,
					store_re_address: ''
				},
				isModifyAddress: false, //有无修改过地址
				showPopup: false,
				modifyType: 'none', //修改的类型  name tel
				proposalData: {
					img: [],
					proposalArea: ''
				},
				isProposalDone: false, //反馈是否完成展示成功的界面
			}
		},
		onLoad: function(options) {
			var that = this;
			var id = uni.getStorageSync('app:userInfo').store_id;
			this.initRegions();
			this.getDefaultInfo(id);
			this.store_id = id;
			this.is_A = uni.getStorageSync('app:userInfo').is_B == 1 ? false : true;
		},
		methods: {
			getDefaultInfo: function(id) {
				var that = this;
				request.get(that.url + '/api/StoreBusiness/getStoreInfo', {
					data: {
						store_id: id
					},
					success: function(res) {
						that.subParams.share_poster_is_show_price = res.data.result.share_poster_is_show_price;
						that.subParams.store_name = res.data.result.store_name;
						that.subParams.store_phone = res.data.result.store_phone;
						that.subParams.store_info_address = res.data.result.store_info_address;
						that.subParams.store_re_address = res.data.result.store_re_address;
						that.subParams = Object.assign({}, that.subParams);
					}
				})
			},
			change_share_poster_is_show_price: function(e) {
				var type = e.currentTarget.dataset.type;
				this.subParams.share_poster_is_show_price = type == 'a' ? 1 : 0;
				this.subParams = Object.assign({}, that.subParams);
				this.req({
					store_id: this.store_id,
					share_poster_is_show_price: type == 'a' ? 1 : 0
				})
			},
			clickTelmpleteOpera: function(e) {
				var index = e.currentTarget.dataset.index + '';
				var that = this;
				var pages = getCurrentPages();
				var historyArr = [];
				for (let i = 0; i < pages.length; i++) {
					historyArr.push(pages[i].route)
				}
				that.shouldOperationsShow = false;
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
						var index = historyArr.indexOf("pages/distribut0/DIYshop/DIYshop")
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
						that.shouldProposalShow = true;
						that.isProposalDone = false;
						break;
					case '3':
						var index = historyArr.indexOf("pages/distribut0/DIYshopPoster/DIYshopPoster")
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
			initRegions: function() {
				var that = this;
				new Regions(this, 'regions', {
					endAreaLevelCall: function(parentId, regionName, address) {
						that.address.province_name = that.address.province_name;
						that.address.city_name = that.address.city_name;
						that.address.district_name = that.address.district_name;
						that.address.twon_name = that.address.twon_name;
						Object.assign(that.address, address);
						that.isModifyAddress = true;
						that.req({
							store_id: that.store_id,
							province_id: that.address.province,
							city_id: that.address.city,
							district: that.address.district
						})
					}
				});
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
			modifyItem: function(e) {
				var type = e.currentTarget.dataset.type;
				this.showPopup = true;
				this.modifyType = type;
				this.changeText = type == 'name' ? '店铺名称' : '联系方式';
			},
			closeOperations: function() { //关闭店铺管理的操作选项
				this.shouldOperationsShow = false;
				this.shouldProposalShow = false;
			},
			onPopupClose: function() {
				this.showPopup = false;
			},
			detailAddressBlur: function(e) { //详细地址提交
				this.req({
					store_id: this.store_id,
					store_address: this.subParams.store_info_address
				})
			},
			openRegionsModal: function() {
				
			},
			sureChange: function() { //改名字 手机号的确定
				var type = this.modifyType
				if (type == 'name') {
					this.req({
						store_id: this.store_id,
						store_name: this.subParams.store_name
					})
					this.showPopup = false;
				} else if (type == 'tel') {
					var reg = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
					if (!reg.test(this.subParams.store_phone)) {
						return uni.showToast({
							title: '手机号码格式不正确',
							icon: 'noen'
						})
					}
					this.req({
						store_id: this.store_id,
						store_phone: this.subParams.store_phone
					})
					this.showPopup = false;
				}
			},
			req: function(params) { //提交修改
				var that = this
				request.post(that.url + '/api/StoreBusiness/editStore', {
					data: params,
					success: function(res) {
						uni.showToast({
							title: '修改成功',
						})
					}
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
				this.proposalData.img = [...imgs];
				this.proposalData = Object.assign({}, this.proposalData);
			},
			uploadFile: function(src) { //上传图片
				if (this.proposalData.img >= 5) {
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
						var result = JSON.parse(res.data);
						that.proposalData.img = [...that.proposalData.img, ...[result.result]];
						that.proposalData = Object.assign({}, that.proposalData);
						uni.hideLoading()
					}
				})
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
						that.proposalData.img = [];
						that.proposalData = Object.assign({}, {
							img: [],
							proposalArea: ''
						})
						that.isProposalDone = true;
					}
				})
			},
		}
	}
</script>

<style scoped src="./DIYshop.css">

</style>
