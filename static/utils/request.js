var util = require('util.js');
var isShow = false;
module.exports = {
	uniqueId: '',

	/**
	 * 全局请求函数
	 * 1、加入错误提醒
	 * 2、options加入 failStatus 回调函数，在successs函数中status不为0时回调，函数返回false不自动提醒错误
	 * 3、options加入 successReload 布尔值，true则success完全掉原有success函数
	 * 4、options加入 failRollback 布尔值，true则发生错误时回退到页面栈中的前一个页面
	 * 5、options加入 notAuthParam 布尔值，true则url不加入身份验证参数
	 * 6、options加入 baseUrl 字符串，false则完整路径，不写并且url不以http开头则默认使用setting.url
	 * 7、options加入 isShowLoading 布尔值，是否显示加载提醒框,默认true
	 */
	request: function(method, url, options) {
		var that = this;
		//设置默认头部
		var header = options.header ? options.header : {
			"content-type": "application/x-www-form-urlencoded"
		};
		//设置请求方式并做相应处理
		method = method.toUpperCase();
		var data = (method != 'GET' && options.data) ? util.json2Form(options.data) : options.data;
		//处理请求url
		url = this.modifyUrl(url, options);
		//是否显示加载图标
		options.isShowLoading = typeof options.isShowLoading == 'undefined' ? true : options.isShowLoading;
		options.isShowLoading && this.showLoading();
		uni.request(Object.assign({}, options, {
			url: url,
			method: method,
			data: data,
			header: header,
			success: function(res) {
				options.isShowLoading && that.hideLoading();
				that.doSuccess(options, res);
			},
			fail: function(res) {
				options.isShowLoading && that.hideLoading();
				that.doFail(options, res);
			}
		}));
	},

	/** get请求,说明同request() */
	get: function(url, options) {
		this.request('GET', url, options);
	},

	/** post请求,说明同request() */
	post: function(url, options) {
		this.request('POST', url, options);
	},

	/** 上传文件,说明同request(),在formData中附加参数,详看uni.uploadFile文档 */
	uploadFile: function(url, options) {
		var that = this
		url = this.modifyUrl(url, options);
		options.isShowLoading = typeof options.isShowLoading == 'undefined' ? true : options.isShowLoading;
		options.isShowLoading && this.showLoading();
		uni.uploadFile(Object.assign({}, options, {
			url: url,
			filePath: options.filePath,
			name: options.name,
			success: function(res) {
				that.hideLoading();
				res.data = JSON.parse(that.filterJsonData(res.data));
				that.doSuccess(options, res);
			},
			fail: function(res) {
				that.hideLoading();
				that.doFail(options, res);
			}
		}));
	},

	/******* 以下是内部函数 *******/

	/** 请求成功的处理函数 */
	doSuccess: function(options, res) {
		if (options.successReload == true) {
			typeof options.success == 'function' && options.success(res);
			return;
		}
		if (res.statusCode != 200) {
			// debugger;
			if (504 == res.statusCode || 503 == res.statusCode) {
				this.showError('网络繁忙，请重试[' + res.statusCode + ']', options);
				return false;
			}
			//    this.showError('请求异常，请重试[' + res.statusCode + ']', options);
			this.showError('开发完善中...', options);
			return false;
		}
		if (res.data.status != 1) {
			if (res.data.msg == '开发完善中') { //拼包没有完全开放之前 后面删掉
				uni.showToast({
					title: '开发完善中',
					icon: 'none',
					mask: true
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 800)
				return
			}
			if (typeof options.failStatus == 'function') {
				if (options.failStatus(res) == false) {
					return false;
				}
			}
			if (res.data.status == 9) {
				options.success(res)
				return
			}
			/** token异常 */
			if (res.data.status == -100 || res.data.status == -101 || res.data.status == -102) {
				var app = getApp();
				app.auth.clearAuth();

				uni.login({
					success: function(res) {
						app.globalData.code = res.code
					}
				});

				uni.showToast({
					title: '正在重新登录',
					icon: 'none'
				})
				uni.navigateTo({
					url: '/pages/user/get_user_info/get_user_info',
				})
				return false;
			}
			if (res.data.status == -11) {
				return false;
			}

			//单独针对支付密码请求被拦截的情况做处理
			if (res.data.status == 2 && res.data.msg == "请先设置支付密码") {
				options.success(res)
				return
			}
			//单独针对进入拼包时，身份拦截的处理
			if (res.data.status == 2 && res.data.msg == "只有批发商才有权限使用拼包哦！") {
				options.success(res)
				return
			}
			if (res.data.status == 0 && res.data.msg == '请先登录') { //针对未设置密码的 重新处理
				uni.navigateTo({
					url: '/pages/user/get_user_info/get_user_info',
				})
				return
			}
			if (res.data.status == 0 && res.data.msg.indexOf("小程序账号") != -1) { //针对注册时单独处理  
				uni.showModal({
					title: '提示',
					content: res.data.msg + '如需解除绑定，请联系客服 400-008-6336',
					confirmText: '立即拨打',
					success(res) {
						if (res.confirm) {
							uni.makePhoneCall({
								phoneNumber: '400-008-6336',
							})
						} else if (res.cancel) {}
					}
				})

				return
			}
			if (res.data.status == 0 && res.data.msg == '请添加该商品为分销商品再分享给下级') { //针对注册时单独处理  
				uni.showModal({
					title: '提示',
					content: '请添加该商品为分销商品再分享给下级',
					showCancel: false,
					confirmText: '好的',
					success(res) {
						if (res.confirm) {
							console.log('用户点击确定')
						}
					}
				})
				return
			}
			if (res.data.status == 2) {
				options.success(res)
			}
			var showMsg = (typeof res.data.msg == 'string') ? res.data.msg : '数据格式错误';
			uni.showToast({
				title: res.data.msg,
				icon: "none",
				mask: true,
				duration: 2000
			})
			return false;
		}
		typeof options.success == 'function' && options.success(res);
	},

	/** 请求失败的处理函数 */
	doFail: function(options, res) {
		if (typeof options.fail == 'function') {
			if (options.fail(res) == false) {
				return false;
			}
		}
		// debugger;
		this.showError('请求失败', options);
	},

	/** 过滤一些莫名其妙产生的奇葩字符 */
	filterJsonData: function(data) {
		var tmp = data;
		for (var i = 0; i < data.length; i++) {
			tmp = data.substr(i);
			if (data.charAt(i) == '{') {
				break;
			}
		}
		return tmp;
	},

	/** 加基地址,附加鉴权参数 */
	modifyUrl: function(url, options) {
		typeof options == 'undefined' && (options = {});
		if (url.indexOf('http') != 0) {
			if (typeof options.baseUrl == 'string') {
				url = options.baseUrl + url;
			} else if (typeof options.baseUrl == 'undefined') {
				var app = getApp();
				url = app.globalData.setting.url + url;
			}
		}
		if (typeof options.notAuthParam == 'boolean' && options.notAuthParam == true) {
			return url;
		}
		var params = 'is_json=1' + '&unique_id=' + this.getUniqueId() + '&token=' + this.getToken();
		url += ((url.indexOf('?') > 0) ? '&' : '?') + params;
		return url;
	},

	/** 获取token */
	getToken: function() {
		var app = getApp();
		if (app) {
			if (app.globalData.userInfo == null) {
				return '';
			}
			return app.globalData.userInfo.token;
		}
	},

	/** 获取uniqueid，作用相当于sessionid */
	getUniqueId: function() {
		if (uni.getStorageSync('unique_id')) {
			return uni.getStorageSync('unique_id');
		} else {
			if (this.uniqueId) {
				return this.uniqueId;
			}
			this.uniqueId = 'miniapp' + util.randomString(17);
			return this.uniqueId;
		}
	},

	/** 检查uniqueid状态 */
	checkUniqueId: function() {
		//未授权登录添加的商品,缓存unique_id，方便用户未授权下次用此该身份，授权登录后就清空
		if (!this.getToken()) {
			uni.setStorageSync('unique_id', this.getUniqueId())
		}
	},

	showLoading: function() {
		uni.showLoading({
			title: '加载中',
		});
		isShow = false;
	},

	hideLoading: function() {
		if (!isShow) {
			uni.hideLoading();
		}
		isShow = true;
	},

	showError: function(msg, options) {
		uni.showModal({
			title: msg,
			showCancel: false,
			complete: function() {
				options.failRollback == true && uni.navigateBack();
			}
		});
	}

};
