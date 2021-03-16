<script>
	var setting = require('setting.js');
	var auth = require('./static/utils/auth.js');
	var request = require('./static/utils/request.js');
	var common = require('./static/utils/common.js');
	export default {
		onLaunch: function() {
			console.log('App Launch')
			const updateManager = uni.getUpdateManager()
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				// console.log(res.hasUpdate)
			})

			updateManager.onUpdateReady(function() {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否立即体验？',
					success: function(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate()
						}
					}
				})
			})

			updateManager.onUpdateFailed(function() {
				// 新版本下载失败
			})


			this.initExt();
			// this.hidetabbar();
			var setting = this.globalData.setting;
			setting.resourceUrl = setting.url + '/template/mobile/default';
			var logs = uni.getStorageSync('logs') || []
			logs.unshift(Date.now())
			uni.setStorageSync('logs', logs)
			// this.getIsApply()
			uni.getSystemInfo({
				success(res) {
					uni.setStorageSync('telsystem', res.system)
					if (res.model.search('iPhone X') != -1 || res.model.search('iPhone 1') != -1) {
						uni.setStorageSync('isiphoneX', true)
					}
				}
			})
			// ==========
			// 获取用户信息
			uni.getSetting({
				success: res => {
					if (res.authSetting['scope.userInfo']) {
						// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
						uni.getUserInfo({
							success: res => {
								// 可以将 res 发送给后台解码出 unionId
								this.globalData.userInfo = res.userInfo

								// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
								// 所以此处加入 callback 以防止这种情况
								if (this.userInfoReadyCallback) {
									this.userInfoReadyCallback(res)
								}
							}
						})
					}
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			setting: setting, //用户可配置项
			wechatUser: null, //微信的用户信息
			userInfo: uni.getStorageSync('app:userInfo') || null, //商城的用户信息 //先从本地获取
			config: null, //app系统配置
			code: null, //微信登录code
			menu_index: 0, //自定义菜单索引
			menu_model: [], //自定义菜单模型
			defaultMenu: false, //自定义菜单状态 
			is_apply: 0, //是否在审核阶段
			his: {},
			selectedAddress: {},
			notLogin: false,
		},
		/** 授权对象 */
		auth: auth,
		/** 全局请求对象，涉及业务的请求，请使用此接口 */
		request: request,
		initExt: function() {
			var ext = uni.getExtConfigSync();
			var setting = this.globalData.setting;
			if (ext.store_name) {
				setting.appName = ext.store_name;
				setting.appLogo = ext.store_logo;
				setting.saas_app = ext.saas_app;
				if (ext.is_refactor) {
					setting.url = ext.request_url + '/saas/' + setting.saas_app;
				} else {
					setting.url = ext.request_url;
				}
				setting.ext_on = 1; //第三方配置开启
			} else {
				setting.saas_app = '';
				setting.ext_on = 0;
			}
		},
		/** 
		 * 获取用户信息（包括微信用户），有授权作用
		 * cb：成功回调函数，入参:cb(userInfo,wechatUser)
		 * force：是否强制更新数据（发出请求）
		 */
		getUserInfo: function(cb, force, isShowLoading) {
			var that = this;
			if (auth.isAuth() && !force) {
				typeof cb == "function" && cb(that.globalData.userInfo, that.globalData.wechatUser);
			} else {
				if (!auth.isAuth()) {
					return auth.auth(cb); //授权操作
				}
				request.get('/api/user/userInfo', {
					isShowLoading: typeof isShowLoading == 'undefined' ? true : isShowLoading,
					success: function(res) {
						if (res.data.result['head_pic'].indexOf("http") == -1) {
							res.data.result['head_pic'] = setting.url + res.data.result['head_pic'];
						}
						that.globalData.userInfo = res.data.result;
						uni.setStorageSync('app:userInfo', res.data.result);
						that.globalData.userInfo.head_pic = common.getFullUrl(that.globalData.userInfo
							.head_pic);
						typeof cb == "function" && cb(that.globalData.userInfo, that.globalData
							.wechatUser);
					}
				});
			}
		},
		/** 获取app系统配置 */
		getConfig: function(cb, force) {
			var that = this;
			if (this.globalData.config && !force) {
				typeof cb == "function" && cb(this.globalData.config);
			} else {
				request.get('/api/index/getConfig', {
					success: function(res) {
						that.globalData.config = res.data.result;
						typeof cb == "function" && cb(that.globalData.config);
					}
				});
			}
		},
		/** 获取前index页的数据，默认前一页 */
		getPrevPageData: function(index) {
			if (typeof index == 'undefined') {
				index = 1;
			}
			var pages = getCurrentPages();
			return pages[pages.length - index - 1].data;
		},
		/** 加载提醒 */
		showLoading: function(func, time) {
			typeof time == 'undefined' && (time = 1500);
			uni.showToast({
				title: '加载中',
				icon: 'loading',
				duration: time,
				mask: true,
				complete: function() {
					if (typeof func == 'function') {
						setTimeout(func, time);
					}
				}
			});
		},
		showSuccess: function(msg, func, time) {
			typeof time == 'undefined' && (time = 1000);
			uni.showToast({
				title: msg,
				icon: 'none',
				duration: time,
				mask: true,
				complete: function() {
					if (typeof func == 'function') {
						setTimeout(func, time);
					}
				}
			});
		},
		showWarning: function(msg, func, time, mask) {
			!time && (time = 1500);
			typeof mask == 'undefined' && (mask = true);
			uni.showToast({
				title: msg,
				mask: mask,
				duration: time,
				icon: 'none',
				// image: '/images/gt.png',
				complete: function() {
					if (typeof func == 'function') {
						setTimeout(func, time);
					}
				}
			});
		},
		showTextWarining: function(msg, func, time, mask) {
			!time && (time = 2000);
			typeof mask == 'undefined' && (mask = true);
			uni.showToast({
				title: msg,
				mask: mask,
				duration: time,
				icon: 'none',
				complete: function() {
					if (typeof func == 'function') {
						setTimeout(func, time);
					}
				}
			});
		},
		confirmBox: function(msg, func) {
			uni.showModal({
				title: msg,
				showCancel: false,
				complete: function() {
					typeof func == 'function' && func();
				}
			});
		},
		// 修改当前是否是拼包页面内
		changeSelectedAddress: function(address) {
			this.globalData.selectedAddress = address
		},
		setUnLoad: function(v) {
			this.globalData.notLogin = v == -1 ? true : false
		},
	}
</script>

<style>
	@import url("./static/utils/common.css");
	@import url("/wxcomponents/vant/dist/common/index.wxss");
</style>
