<template>
	<view>
		<view class="container" v-if="is_store ==1 && status == 0">
			<view class="content" :style="'min-height:' + screenHeight + 'px'">
				<view class="status">{{status==0?'未审核':''}}{{status==1?'通过':''}}{{status==2?'审核失败':''}}</view>
				<view class="desc" v-if="status==0||status==2">平台加急审核中,</view>
				<view class="desc" v-if="status==0||status==2">请耐心等待</view>
				<image class="status-img" src="https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/status-ok.jpg"
					v-if="status==0||status==1"></image>
				<view class="btn-home" @tap='goBack'>返回上一页</view>
			</view>
		</view>
		<view class="container" :style="'min-height:' + screenHeight + 'px;position:relative;'" v-else>
			<image class="bgbgbg bg11" src="https://www.yitongwang.com/public/static/images/minniapp/join4-bg1.png">
			</image>
			<image class="bgbgbg bg22" src="https://www.yitongwang.com/public/static/images/minniapp/join4-bg2.png">
			</image>
			<view class="form">
				<view class="formTitle">店铺信息</view>
				<view class="formTitleAfter"></view>
				<view class="form-item">
					<view class="form-label">店铺类型:</view>
					<view class="picker">
						<picker mode="selector" :range="group" :value="index" @change="pickChange">
							<view :class="{col18c2ba: group[index]}">{{group[index]?group[index]:'点击选择店铺类型'}}
							</view>
						</picker>
					</view>
				</view>
				<view class="form-item">
					<view class="form-label">店铺名称:</view>
					<input type="text" class="form-input" v-model="name" placeholder="请输入店铺名称"></input>
				</view>
				<view class="form-item" data-id='0' @tap="openRegionsModal">
					<view class="form-label">店铺地址:</view>
					<view v-if="address.province_name" class="item-input">{{address.province_name}}
						{{address.city_name}} {{address.district_name}} {{address.twon_name}}
					</view>
					<view v-else class="item-input col18c2ba">点击选择所在区域</view>
					<view class="item-img"></view>
				</view>
				<view class="form-item">
					<view class="form-label">详细地址:</view>
					<input type="text" class="form-input" v-model="detailAdress" placeholder="如:织里镇富康路168号"></input>
				</view>
				<view class="form-item" v-if="index == 0">
					<view class="form-label">
						<view>微信二维码名片:</view>
						<view style="font-size:26rpx;text-align:center;">(非必填)</view>
					</view>
					<image class="chooseImg" :src="img" @tap="chooseImg" v-if="img"></image>
					<view @tap="chooseImg" class="chooseImg" v-else>+</view>
				</view>

				<view class="form-btn" @tap="send">{{ storeInfo.apply_state == 2 ? '再次申请' : '同意并注册' }}</view>
				<view class="agreement">
					<checkbox :checked="checked==true" style="font-size:24rpx;" @tap="changeChebox" class="">
						我已阅读并同意</checkbox>
					<navigator class="col18c2ba" style="font-size:24rpx;display:inline-block;" @tap="showAgreement">
						《平台服务协议与隐私保护政策》</navigator>
				</view>
			</view>
		</view>

		<!-- 用户协议弹出层 -->

		<!-- 店铺类型选择 -->
		<van-action-sheet :show="typeShow" :actions="actions1" @close="onClose1" @select="onSelect1" />

		<!-- 选择地址弹框  -->
		<!-- <template is="regions" data="{{regions}}" /> -->
		<!-- 失败的弹窗 -->
		<van-dialog id="van-dialog" />

	</view>
</template>

<script>
	var app = getApp();
	import Regions from '../../../static/utils/regions/Regions.js';
	var request = app.request;
	var setting = app.globalData.setting;
	var isEor = false;
	export default {
		data() {
			return {
				url: setting.url,
				status: 0,
				userInfo: uni.getStorageSync('app:userInfo'),
				address: {}, //地址
				area: {}, //传递到后台的数值
				img: '', //图片本地地址
				detailAdress: '', //详细地址
				name: '', //店铺名称
				group: [
					'实体货源厂家',
					'批发商/连锁门店采购商'
				],
				store_type: [],
				typeShow: false,
				actions1: [],
				index: -1,
				checked: false, //
				user: {},
				uploadPath: '',
				is_store: 2, //1已开店 2未开店
				status: '',
				storeInfo: null,
				screenHeight: 0, //屏幕高度
			}
		},
		onLoad: function(options) {
			//检查用户是否登录方可操作立即购买
			var screenHeight = uni.getSystemInfoSync().windowHeight
			this.screenHeight = screenHeight
		},
		onShow: function() {
			this.initRegions();
			let user = uni.getStorageSync('app:userInfo');
			this.user = Object.assign({}, user);
			this.hasStatus();
		},
		methods: {
			/** 初始化区域弹框相关 */
			initRegions: function() {
				var that = this;
				isEor = false;
				new Regions(this, 'regions', {
					endAreaLevelCall: function(parentId, regionName, address) {
						Object.assign(that.address, address);
						Object.assign(that.area, {
							company_province: address.province,
							company_city: address.city,
							company_district: address.district,
						});
						that.address = Object.assign({}, that.address);
						isEor = true;
					}
				});
			},
			goBack: function() {
				uni.navigateBack({
					delta: 1,
				})
			},
			//选择图片
			chooseImg: function() {
				let that = this;
				uni.chooseImage({
					count: 1,
					success(res) {
						uni.uploadFile({
							filePath: res.tempFilePaths[0],
							name: 'wechat_head_img',
							header: {
								"Content-Type": "multipart/form-data", //记得设置
								'channelCode': 'wechat',
								'appVersion': '1.0.1',
							},
							url: that.url + '/index.php/api/Newjoin/wechatImg',
							success(res1) {
								that.img = that.url + JSON.parse(res1.data).img
							}
						})
					}
				})
			},
			//切换店铺类型
			pickChange: function(e) {
				this.index = e.detail.value
			},
			changeChebox: function() {
				this.checked = !this.checked
			},
			//同意并注册 
			send: function() {
				let that = this;
				if (that.index == -1) {
					uni.showToast({
						title: '请选择店铺类型',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				if (!that.name) {
					uni.showToast({
						title: '请输入店铺名称',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				if (!isEor) {
					uni.showToast({
						title: '请选择店铺地址',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				if (!that.detailAdress) {
					uni.showToast({
						title: '请输入店铺详细地址',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				if (!that.checked) {
					uni.showToast({
						title: '请勾选服务协议',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				var detailAddressArr = that.detailAdress.split("")
				var detailAddressStr = ''
				for (let i = 0; i < detailAddressArr.length; i++) { // 去除店铺名字中的空格
					if (detailAddressArr[i] != ' ') {
						detailAddressStr += detailAddressArr[i]
					}
				}
				request.post('/api/newjoin/addStoreApply', {
					data: {
						store_name: that.name,
						user_id: that.user.user_id,
						mobile: parseFloat(that.user.mobile),
						company_province: that.area.company_province,
						company_city: that.area.company_city,
						company_district: that.area.company_district,
						store_address: detailAddressStr,
						sc_class: that.store_type[that.index].key,
					},
					success: function(res) {
						//返回审核状态
						that.hasStatus();
					}
				});
			},
			hasStatus: function() {
				let that = this;
				request.get('/api/Newjoin/storeStatus', {
					data: {
						user_id: that.user.user_id,
					},
					success: function(res1) {
						if (res1.data.status != 1) {
							return
						}
						var group = res1.data.result.store_type.map((item) => {
							return item.name
						})
						if (res1.data.result.store && res1.data.result.store.apply_state == 1) { //判断有没有店，有，则重定向到我的小店
							uni.redirectTo({
								url: '/pages/distribut0/shop/shop',
							})
							return
						}
						that.status = res1.data.result.store ? res1.data.result.store.apply_state : -99
						that.is_store = res1.data.result.is_store
						that.storeInfo = res1.data.result.store || null
						that.group = [...group];
						that.store_type = res1.data.result.store_type
						if (res1.data.result.store && res1.data.result.store.apply_state == 2) {
							that.detailAdress = res1.data.result.store.company_address
							that.index = res1.data.result.store.sc_name == '实体货源厂家' ? 0 : 1
							that.name = res1.data.result.store.store_name
							that.img = res1.data.result.store.wechat_head_img || ''
							uni.showModal({
								title: '审核状态:未通过',
								content: '原因：' + res1.data.result.store.review_msg,
								showCancel:: false,
							})
						}
					}
				});
			},
			// 展示协议
			showAgreement: function() {
				var webUrl = "/api/Article/service_agreement/doc_code/agreement";
				this.webUrl = webUrl;
				uni.navigateTo({
					url: '/pages/index/webview/webview'
				});
			},
			onClose1: function() {},
			onSelect1: function() {

			},
		}
	}
</script>

<style scoped src="./join4.css">

</style>
