/**
 * 系统配置 
 */
module.exports = {
	appName: '壹童网',
	appLogo: 'https://www.yitongwang.com/public/static/images/logo/seller_login_logo_defaults.png', //建议24*24，本地图片或网络图片
	versionCode: '1.0.0', //小程序软件版本
	//    url: 'https://test.yitongwang.com', 
	url: 'https://www.yitongwang.com',
	share: {
		title: '', //自定义转发标题
		path: '/pages/index/index/index?first_leader=' + uni.getStorageSync('app:userInfo')['user_id']
	}
};
