<template>
	<view>
		<!-- ========================新做我的小店顶部============================ -->
		<view class="banner">
			<view class="hhome" @tap="backToHome" v-if="false">
				<image src="../../../static/images/home-image.png"></image>
			</view>
			<view class="bannerBg">
				<image :src="store.store_img ? store.store_img : store_img"></image>
			</view>
			<view class="bannerStoreName">{{ store.store_name }}</view>
			<view class="bannerStoreAddress" style="font-size:22rpx;">
				<uni-icons name="location-o" size="50rpx" color="#666" style="float:left;" />{{ store.store_address }}
			</view>
			<view class="bannerGuanzhuSum">
				<view>{{ store.store_collect }}</view>
				<view>个关注</view>
			</view>
			<view class="bannerShare" @tap.stop="catchShare">
				<image src="../../../static/images/icon-share.png"></image>
			</view>

		</view>
		<view class="bannerScreen">
			<text data-type="1" :class="type == 1 ? 'bannerCurr' : 'col7c'" @tap="chooseSize"
				v-if="store.is_A == 0">分销商品<text class="titleGoodsSum"><text v-if="store.type_num">(<text
							class="col18c">{{ store.type_num[0] }}</text>)</text></text></text>
			<text data-type="2" :class="type == 2 ? 'bannerCurr' : 'col7c'" @tap="chooseSize"
				v-if="store.is_A == 0">自有商品<text class="titleGoodsSum"><text v-if="store.type_num">(<text
							class="col18c">{{ store.type_num[1] }}</text>)</text></text></text>
			<text data-type="1" :class="type == 1 ? 'bannerCurr' : 'col7c'" @tap="chooseSize"
				v-if="store.is_A == 1">普通商品<text class="titleGoodsSum"><text v-if="store.type_num">(<text
							class="col18c">{{ store.type_num[0] }}</text>)</text></text></text>
			<text data-type="2" :class="type == 2 ? 'bannerCurr' : 'col7c'" @tap="chooseSize"
				v-if="store.is_A == 1">私密商品<text class="titleGoodsSum"><text v-if="store.type_num">(<text
							class="col18c">{{ store.type_num[1] }}</text>)</text></text></text>
			<text data-type="3" :class="type == 3 ? 'bannerCurr' : 'col7c'" @tap="chooseSize">已下架<text
					class="titleGoodsSum"><text v-if="store.type_num">(<text
							class="col18c">{{ store.type_num[2] }}</text>)</text></text></text>
			<text data-type="4" :class="type == 4 ? 'bannerCurr' : 'col7c'" @tap="chooseSize">草稿箱<text
					class="titleGoodsSum"><text v-if="store.type_num">(<text
							class="col18c">{{ store.type_num[3] }}</text>)</text></text></text>
		</view>
		<!-- ======================================结束======================================== -->

		<!-- 商品信息开始 -->
		<view class='product_info clearfix'>
			<template v-for="(item, index) in list" :key="'list' + index">
				<view class='product_list' style="height:494rpx;" @tap.stop="toGoodsInfo"
					:data-url="'/pages/goods/goodsInfo/goodsInfo?goods_id=' + item.goods_id">
					<view class='product_image'>
						<image
							:src="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id + '&width=400&height=400&random=' + time.randomImg()">
						</image>
					</view>
					<view class="delGoods" :data-id="item.goods_id" @tap.stop="showProup2" :data-index="index"
						:data-fx="item.is_fx">操作</view>
					<view class="delGoods2" @tap.stop="shareGoods" :data-id="item.goods_id" :data-tit="item.goods_name"
						:data-img="url + '/api/goods/goodsThumImages?goods_id=' + item.goods_id + '&width=400&height=400'">
						分享</view>
					<view class='product_list_title'>{{item.goods_name}}</view>
					<view class='activities clearfix'>
						<view class='activity' v-if="item.label_id != ''">{{item.label_id}}</view>
					</view>
					<view class='product_data flex spa'>
						<view class='price'>￥<view>{{item.shop_price}}</view>
						</view>
						<view class='amount'>浏览数:{{item.click_count}}</view>
					</view>
				</view>
			</template>

			<!-- 无商品提示 -->
			<view v-if="list.length == 0 && type != 2 && store.is_A == 0  && type != 4 && type != 3" class="allInfo">
				您的店铺还没有商品，您可以将厂家的商品加入分销至您的个人店铺，然后将您的店铺私密分享给下级（下级不会看到任何有关厂家的信息，只展示您的信息），下级在您的店铺下单后，您可以请平台代发，让您可以做到无需进货也能卖货啦！
			</view>
			<view v-if="list.length == 0 && type == 3" class="allInfo">
				您目前没有下架的商品~~
			</view>
			<view v-if="list.length == 0 && type == 4" class="allInfo">
				您目前没有编辑中的商品哦~~如需编辑商品，可以点击下方的'发布新品'发布您的商品！
			</view>
			<view v-if="list.length == 0 && type == 2 && store.is_A == 1" class="allInfo">
				您还没有发布过{{ type == 2 ? '私密' : '' }}商品，您可以点击下方发布新品发布商品，或前往电脑端发布商品。 电脑端登录地址：<text
					class="storePcUrl">https://www.yitongwang.com/seller</text><text class="copyUrl"
					@tap.stop="copyUrl">复制网址</text>
			</view>
			<view v-if="list.length == 0 && type == 2 && store.is_A == 0" class="selfInfo">
				您还没有发布过自有商品，您可以点击下方发布新品发布商品，或前往电脑端发布商品。。 电脑端登录地址：<text
					class="storePcUrl">https://www.yitongwang.com/seller</text><text class="copyUrl"
					@tap.stop="copyUrl">复制网址</text>
			</view>
		</view>
		<!-- 商品信息结束 -->

		<!-- 店铺分享 -->
		<action-sheet :hidden="actionSheetHidden" @change="listenerActionSheet">
			<action-sheet-item>
				<button v-if="userInfo.is_B != 1" class='action-sheet-btn' open-type="share">分享给微信好友</button>
			</action-sheet-item>
			<action-sheet-item v-if="userInfo.is_B == 1" @tap.stop="getSharePic" data-type="3">
				<view>私密分享给下级采购商</view>
				<view>（对方看不到壹童网信息）</view>
			</action-sheet-item>
			<action-sheet-item v-if="userInfo.is_B != 1" @tap.stop="getSharePic" data-type="0">分享至朋友圈
			</action-sheet-item>
			<action-sheet-cancel>取消</action-sheet-cancel>
		</action-sheet>

		<!-- 商品的单独分享 -->
		<action-sheet :hidden="actionSheetHidden2" @change="listenerActionSheet">
			<action-sheet-item>
				<button v-if="userInfo.is_B != 1" class='action-sheet-btn' open-type="share">分享给微信好友</button>
			</action-sheet-item>
			<action-sheet-item v-if="userInfo.is_B == 1" @tap.stop="toTongHang">
				<view>发送给同行</view>
			</action-sheet-item>
			<action-sheet-item v-if="userInfo.is_B == 1" @tap.stop="share2" data-type="3">
				<view>私密分享给下级采购商</view>
				<view>（对方看不到壹童网信息）</view>
			</action-sheet-item>
			<action-sheet-item v-if="userInfo.is_B != 1" @tap.stop="share2" data-type="0">分享至朋友圈</action-sheet-item>
			<action-sheet-cancel>取消</action-sheet-cancel>
		</action-sheet>

		<!-- 放海报的 -->
		<view v-if='share_btn'>
			<view class="prom-model">
				<icon type="cancel" color="gray" size="22" class="modal-close" @tap="closeShareModal" />
				<view class="prom-title">{{ shareTxt }}</view>
				<view class='share-pic'>
					<image @tap.stop='previewSharePic' style='width:100%;height:100%' :src='share_pic'></image>
				</view>
				<view class="share-save-btns">
					<view class="share-save-btn" @tap.stop="saveSharePic">保存海报</view>
				</view>
			</view>
		</view>

		<!-- 回首页遮罩层 -->
		<view class="tips-mask" :hidden="tipsmask || store.store_state == 0" @touchmove.stop="true">
			<image style="right:2%;top:1%;width:350rpx;" class="tipsImg"
				src="https://www.yitongwang.com/public/static/images/minniapp/tipsToShare.png"></image>
			<view class="txt" @tap.stop="closeMask">我知道了</view>
			<view class="txt2">该提示6次后不再出现，当前已提示{{ pastSum }}次</view>
		</view>

		<!-- 店铺被关闭时提示信息 -->
		<uni-popup overlay-style="background-color:rgba(0,0,0,.7);" :show="beClose === 0" @close="onImageClose"
			@click-overlay="onImageClose">
			<view class="closeBox" @tap="true" @touchmove.stop="true">
				<view class="closeTitle">店铺已关闭</view>
				<view class="closeTitle2">关闭原因：</view>
				<view class="closeInfo">{{ store.store_close_info }}</view>
				<view class="callMe">如对店铺关闭有疑惑，请致电 <text class="colblue" @tap.stop="callMe">400-008-6336</text></view>
				<text class="closeBack" @tap.stop="closeBack">返回首页</text>
			</view>
		</uni-popup>

		<!-- 删除商品，并复制网址 -->
		<uni-popup round="true" :show="showDelGoods" @close="closeDel">
			<view class="closeBox">
				<view class="delTips">
					<text style="color:#000;">删除后的商品将无法找到!</text>
				</view>
				<view class="delbtns">
					<view @tap.stop="closeDel">取消删除</view>
					<view class="col18c" @tap.stop="delGoods">确认删除</view>
				</view>
			</view>
		</uni-popup>

		<!-- 针对大B的额外提示 -->
		<!-- 正常提示 -->
		<uni-popup :show="exclusive_B" @close="onInfoClose" z-index="8" custom-class="warningPopup">
			<view class="warningBox">
				<image class="warningImg"
					src="https://www.yitongwang.com/public/static/images/minniapp/subcontract-info-input.png"></image>
				<view class="warningTxt">友情提醒</view>
				<view class="warningTxt">
					壹童网为保护批发商利益，专门打造的私密分享功能横空出世，批发商向下级童装店推广自己个人店铺的时候，通过右上角私密分享功能就能规避货源信息泄漏的风险，对方只能看到您的店铺，并不会出现任何货源信息，您可以放心大胆的向下级推广您的店铺。
				</view>
				<view class="warningTxt" style="color:#000;font-size:26rpx;">切实保护批发商的利益，壹童网责无旁贷。</view>
				<view class="warningBtn2" @tap.stop="onInfoClose">好 的</view>
				<view class="infoPopupCancel" @tap.stop="onInfoClose">
					<van-icon name="close" size="30px" />
				</view>
			</view>
		</uni-popup>

		<!-- 操作弹出的选项 -->
		<view class="operationMask" @tap.stop="true" @touchmove.stop="true" v-if="showOperationMask">
			<view class="operationItemBox">
				<view class="operationItem" v-for="(item, index) in operationItems" :key="'ope' + index"
					@tap.stop="operationGoods" :data-type="item.index">
					<view class="operationImg">
						<image :src="item.img"></image>
					</view>
					<view class="operationTxt">
						<view class="operationTitle">{{ item.title }}</view>
						<view class="operationTips">{{ item.info }}</view>
					</view>
				</view>
				<view class="closeOperationMask">
					<text class="closeOperationMaskX" @tap.stop="closeOperationMask">X</text>
					<text class="closeOperationMaskTxt" @tap.stop="closeOperationMask">关闭</text>
				</view>
			</view>
		</view>


		<uni-popup-dialog id="van-dialog" />
		<!-- 底部菜单  -->
		<!-- <import src="../../index/publics/publics.wxml"/>
		<template is="distributMenu" data="{{page:page,isiphoneX:isiphoneX,is_A:store.is_A,isGoodsList: true}}" />
		<import src="../../index/publicPage/publicPage.wxml"/>
		<template is="operations" data="{{operaList,current:'',isiphoneX:isiphoneX}}" v-if="{{shouldOperationsShow}}" />
		<template is="proposal" data="{{proposalData,isProposalDone}}" v-if="{{shouldProposalShow}}" /> -->

	</view>
</template>

<script lang="wxs" module="time">
	var randomImg = function() {
		return Math.random() + ''
	}
	module.exports.randomImg = randomImg;
</script>
<script>
	var app = getApp();
	var request = app.request;
	var setting = app.globalData.setting;
	var {
		operaList
	} = require('../../../static/utils/util2.js');
	import LoadMore from '../../../static/utils/LoadMore.js';
	var load = new LoadMore;

	function returnNotFx(t) {
		return [{
				img: setting.url + '/public/static/images/minniapp/operation-edit.png',
				title: '编辑',
				info: '可以修改商品的所有信息',
				index: 0
			},
			{
				img: setting.url + '/public/static/images/minniapp/operation-num.png',
				title: '改库存',
				info: '增减库存或下架某个颜色',
				index: 1
			},
			{
				img: setting.url + '/public/static/images/minniapp/operation-copy.png',
				title: '复制',
				info: '相似商品复制模板，更换主图，快速上款',
				index: 2
			},
			t,
			{
				img: setting.url + '/public/static/images/minniapp/opera-del.png',
				title: '删除',
				info: '请谨慎操作，删除后将无法找回',
				index: 4
			},
			{
				img: setting.url + '/public/static/images/minniapp/operation-share.png',
				title: '分享',
				info: '让更多的人知道您的商品',
				index: 5
			},
		]
	}
	export default {
		data() {
			return {
				shouldOperationsShow: false,
				shouldProposalShow: false,
				operaList: operaList,
				page: 4,
				currentPage: 1,
				list: null,
				url: setting.url,
				userInfo: null,
				store: null,
				store_id: 0,
				goods: null, //待上架商品
				total_goods_num: 0, //商品总数
				store_img: 'https://yitongwang.oss-cn-hangzhou.aliyuncs.com/miniapp/shopbanner.jpg', //默认的店铺背景图片
				type: '1', //当前浏览的商品类型
				p0: 1,
				p1: 1,
				p2: 1, //每个类目分页
				p3: 1, //每个类目分页
				p4: 1, //每个类目分页
				actionSheetHidden: true, //控制分享的展示与否
				actionSheetHidden2: true, //控制分享的展示与否
				shareTogether2: false, //是否展示大B二次确认
				share_btn: false,
				share_pic: '',
				shareTogether: false,
				isiphoneX: uni.getStorageSync('isiphoneX') || false,
				is_first: true, //默认是第一次进来
				shouldShareStore: true, //默认可以分享店铺
				shareTxt: '分享到朋友圈', //默认分享到朋友圈
				tipsmask: true,
				pastSum: 1,
				firstLoad: true,
				fx: true,
				beClose: false, //默认店铺没有被关闭
				showDelGoods: false,
				curId: 0, //要操作的商品id存储
				exclusive_B: false, //针对大B 额外的提示
				operationItems: [ //操作的选项
				],
				showOperationMask: false, //是否显示操作选项
				isFxGoods: false,
				shareType: '', //分享的类型  店铺  商品
				goodsTit: '', //点击被分享操作的商品名字
				shareImg: '', //分享的图片
				isProposalDone: false,
				proposalData: {
					img: [],
					proposalArea: ''
				},
			}
		},
		onLoad: function(options) {
			if (!uni.getStorageSync('maskSum9')) {
				uni.setStorageSync('maskSum9', 7);
				this.tipsmask = false;
			} else {
				if (uni.getStorageSync('maskSum9') == 1) {
					this.tipsmask = true;
				} else {
					this.tipsmask = false;
					this.pastSum = 6 - uni.getStorageSync('maskSum9') + 2
				}
			}
		},
		onShow: function() {
			var that = this;
			var userInfo = uni.getStorageSync('app:userInfo');
			that.userInfo = Object.assign({}, userInfo);
			load.init(this, '', 'list');
			that.resetData();
			that.getGoodsList();
			that.getStore();
		},
		onReachBottom: function() {
			if (load.canloadMore()) {
				this.getGoodsList();
			}
		},
		onPullDownRefresh: function(e) {
			this.resetData();
			this.getGoodsList();
		},
		onShareAppMessage: function() {
			var sId = this.store.store_id || uni.getStorageSync('app:userInfo').store_id;
			var path = this.shareType == 'store' ? '/pages/store/index/index?store_id=' + sId :
				'/pages/goods/goodsInfo/goodsInfo?goods_id=' + this.curId;
			var title = this.shareType == 'store' ? '我发现一间好店@' + this.store.store_name + '，推荐给你！' : 
				this.userInfo.nickname + '超值推荐-' + this.goodsTit;
			var img = this.shareImg || ''
			this.shareImg = '';
			return {
				title: title,
				path: path,
				imageUrl: img
			}
		},
		methods: {
			// 请求待上架商品
			requestGoodsList: function(e) {
				var that = this;
				request.get('/api/Distribut/goods_list', {
					success: function(res) {
						var arr = res.data.result;
						if (that.firstLoad && arr.length == 0) {
							that.fx = false;
						}
						that.firstLoad = false;
						that.goods = [...arr];
					}
				});
			},
			getStore: function() { //获取店铺基本信息
				var that = this;
				request.post('/api/Distribut/get_store', {
					successReload: true,
					success: function(res) {
						if (res.data.result) {
							that.store = Object.assign({}, res.data.result);
							that.total_goods_num = res.data.result.total_goods_num;
							that.beClose = res.data.result.store_state;
							if (res.data.result.store_img) {
								that.store_img = res.data.result.store_img
							}
						}
					}
				});
			},
			getGoodsList: function() { //请求店铺商品
				var that = this;
				var type = that.type;
				var p = 1
				switch (type) {
					case '0':
						p = that.p0
						break;
					case '1':
						p = that.p1
						break;
					case '2':
						p = that.p2
						break;
					case '3':
						p = that.p3
						break;
					case '4':
						p = that.p4
						break;
				}
				load.request('/api/Distribut/my_store?p=' + p + '&type=' + type, function(res) {
					switch (type) {
						case '0':
							that.p0++;
							break;
						case '1':
							that.p1++;
							break;
						case '2':
							p = that.p2++;
							break;
						case '3':
							p = that.p3++;
							break;
						case '4':
							p = that.p4++;
							break;
					}
					that.currentPage++;
					if (that.is_first) {
						if (res.data.result.length == 0) {
							that.is_first = false;
							that.shouldShareStore = false;
						}
					}
				});
			},
			distributTopages: function(e) {
				var index = e.currentTarget.dataset.idx
				if (this.page == index) {
					return
				}
				if ((index == 5 || index == 3) && this.store.is_A != 1) {
					return uni.showToast({
						title: '开发中~',
						icon: 'none'
					})
				}
				if (index == 2) { //点击的店铺操作
					if (this.shouldProposalShow) {
						return
					}
					this.shouldOperationsShow = !this.shouldOperationsShow
					return
				}
				common.todistribut(index, this.page);
			},
			//重置数据
			resetData: function() {
				load.resetConfig();
				this.p0 = 1;
				this.p1 = 1;
				this.p2 = 1;
				this.p3 = 1;
				this.p4 = 1;
				this.list = null;
				this.currentPage = 1;
			},
			chooseSize: function(e) { //选择不同类型的商品
				var type = e.currentTarget.dataset.type + '' //转为字符串
				if (type == this.type) {
					return
				}
				this.type = type;
				this.resetData();
				this.getGoodsList();
			},
			catchShare: function() { //分享
				this.actionSheetHidden = false;
				this.shareType = 'store';
			},
			closeShare: function() { //关闭分享
				this.showShareButton = false;
			},
			listenerActionSheet: function() {
				this.actionSheetHidden = true;
				this.actionSheetHidden2 = true;
			},
			backToHome: function() {
				uni.reLaunch({
					url: '/pages/index/index/index',
				})
			},
			getSharePic: function(e) { //分享海报朋友圈
				var type = e.currentTarget.dataset.type || 0
				var store_id = this.store.store_id || uni.getStorageSync('app:userInfo').store_id
				var is_B = this.userInfo.is_B || 0
				var that = this

				if (is_B == 0) { // 大A 
					if (type == 3) { //分享下级 没有这种操作 驳回
						return
					}
					if (that.fx) {
						this.haibao(store_id, type)
					}
				}

				if (is_B == 1) { // 大B 下级分享
					// 最终生成的是大B自己的store_id码
					this.shareTxt = '为保护您的商业机密，请保存海报后，通过微信发送给下级'
					if (type == 0) { //大B普通分享
						uni.showModal({
							title: '提示',
							content: '本次分享，对方将知晓壹童网信息，是否继续',
							cancelText: '返回',
							messageAlign: 'left',
							confirmText: '继续',
							success(res) {
								if (res.confirm) {
									that.shareTogether2 = true;
								} else if (res.cancel) {
									// console.log('啥也不用干1')
								}
							}
						})
						return
					} else if (type == 3) {
						var sId = this.store.store_id || uni.getStorageSync('app:userInfo').store_id
						that.haibao(sId, type)
					}
				}
				var that = this
				that.actionSheetHidden = !this.actionSheetHidden;
			},
			//同行的分享
			shareTogether: function() {
				var that = this
				var store_id = this.userInfo.store_id || 0
				var is_B = this.userInfo.is_B || 0
				if (!this.userInfo) { //未登录
					uni.showToast({
						title: '您还没有登录，无法分享',
					})
				} else { //已登录
					if (is_B == 1) { //大B
						uni.showModal({
							title: '提示',
							content: '本次分享，对方将知晓壹童网信息，是否继续',
							cancelText: '返回',
							messageAlign: 'left',
							confirmText: '继续',
							success(res) {
								if (res.confirm) {
									that.shareTogether = true;
								} else if (res.cancel) {
									console.log('啥也不用干1')
								}
							}
						})
					}
				}
			},
			shareTogetherClose: function() {
				this.shareTogether = false;
			},
			// 生成海报
			haibao: function(store_id, type) {
				var that = this
				var type = type || 0
				request.get(that.url + '/api/Goods/isStoreSharePoster', {
					data: {
						store_id: store_id,
						type: type
					},
					success: function(res2) {
						if (res2.data.status == 1) {
							uni.showLoading({
								title: '正在生成',
								mask: true,
							})
							uni.getImageInfo({
								src: that.url + '/api/goods/storeSharePoster?store_id=' +
									store_id + '&type=' + type + '&token=' + uni.getStorageSync('app:userInfo').token,
								isShowLoading: false,
								success: function(res) {
									that.share_btn = true;
									that.share_pic = res.path;
									that.actionSheetHidden = true;
								},
								complete: function(res) {
									uni.hideLoading()
								}
							})
						}
					}
				})
			},
			haibaoB: function() { //大B二次确认海报
				this.shareTogetherClose2()
				var sId = this.store.store_id || uni.getStorageSync('app:userInfo').store_id
				this.haibao(sId, 3)
			},
			// 关闭二次弹窗
			shareTogetherClose2: function() {
				this.shareTogether2 = false;
			},
			// 关闭海报
			closeShareModal: function() {
				this.share_btn = false;
			},
			// 展示海报
			previewSharePic: function() {
				uni.previewImage({
					urls: [this.share_pic],
				})
			},
			// 保存海报
			saveSharePic: function() {
				var that = this
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success: function(res) {
						uni.saveImageToPhotosAlbum({
							filePath: that.share_pic,
							success: function(res) {
								that.share_btn = false;
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
			/** 关闭优惠信息弹窗 */
			closePromModal: function() {
				this.openPromModal = false;
			},
			copyUrl: function() { //复制url
				uni.setClipboardData({ //设置粘贴板内容
					data: 'https://www.yitongwang.com/seller',
					success(res) { }
				})
			},
			closeMask: function() { //关闭提示
			this.tipsmask = true;
				if (uni.getStorageSync('maskSum9')) { //判断本地有无数量设置过
					var maskSum = uni.getStorageSync('maskSum9') - 1
					uni.setStorageSync('maskSum9', maskSum)
				} else {
					uni.setStorageSync('maskSum9', 5)
				}
				if (this.store.is_A == 0 && this.store.store_state == 1) {
					this.exclusive_B = true;
				}
			},
			delGoods: function() {
				var that = this
				this.showDelGoods = false;
				var url = that.isFxGoods ? '/api/Distribut/delFxGoods' : '/api/Goods/delGoods'
				request.post(that.url + url, {
					data: {
						goods_id: that.curId
					},
					success: function(res) {
						if (res.data.status == 1) {
							that.list = [];
							that.p0 = 1;
							that.p1 = 1;
							that.p2 = 1;
							that.p3 = 1;
							that.p4 = 1;
							that.getGoodsList();
							that.getStore();
						}
					}
				})
				that.isFxGoods = false;
			},
			toGoodsInfo: function(e) { //前往店铺详情
				if (this.type != 1 && this.type != 2) {
					return
				}
				uni.navigateTo({
					url: e.currentTarget.dataset.url,
				})
			},
			closeBack: function() { //店铺被关闭
				uni.reLaunch({
					url: '/pages/index/index/index',
				})
			},
			closeDel: function() {
				this.showDelGoods = false;
			},
			showProup2: function(e) {
				var curId = e.currentTarget.dataset.id;
				var fx = e.currentTarget.dataset.fx == 1;
				var obj = {
					img: setting.url + '/public/static/images/minniapp/operation-sellerdown.png',
					title: (this.type == 3 || this.type == 4) ? '上架' : '下架',
					info: (this.type == 3 || this.type == 4) ? '将已下架的商品，上架出售' : '缺货中/补货中的商品，可以先下架再上架',
					index: 3
				}
				this.showOperationMask = true;
				this.curId = curId;
				this.operationItems = [...returnNotFx(obj)];
				this.isFxGoods = fx;
				this.goodsTit = this.list[e.currentTarget.dataset.index].goods_name;
			},
			callMe: function() {
				uni.makePhoneCall({
					phoneNumber: '400-008-6336',
				})
			},
			onInfoClose: function() {
				this.exclusive_B = false;
			},
			//10.15 发布新品
			addNewGoods: function() {
				uni.navigateTo({
					url: '/pages/goods/addGoods/index?goods_id=0&is_A=' + this.store.is_A,
				})
			},
			operationGoods: function(e) { //操作
				var type = e.currentTarget.dataset.type
				const that = this
				this.showOperationMask = false
				switch (type) {
					case 0: //编辑
						if (this.type == 1 && this.store.is_A == 0) {
							return uni.showToast({
								title: '分销商品无法编辑哦~~',
								icon: 'none'
							})
						}
						var copy = 'none'
						if (this.type == 4 && this.store.is_A == 1) {
							copy = 'copyA'
						}
						uni.navigateTo({
							url: '/pages/goods/addGoods/index?goods_id=' + this.curId + '&is_A=' + this.store.is_A + '&isCopy=' + copy,
						})
						break;
					case 1: //改库存
						if (this.type == 1 && this.store.is_A == 0) {
							return uni.showToast({
								title: '分销商品无法修改库存哦~~',
								icon: 'none'
							})
						}
						uni.navigateTo({
							url: '/pages/goods/specSize/index?goods_id=' + this.curId + '&from=shop',
						})
						break;
					case 2: //复制
						if (this.type == 1 && this.store.is_A == 0) {
							return uni.showToast({
								title: '分销商品无法复制哦~~',
								icon: 'none'
							})
						}
						uni.showModal({
							message: '复制商品后，您可以在您的草稿箱中查看商品，修改主图，快捷上架更多商品~~',
							confirmButtonText: '复制',
							cancelButtonText: '取消',
							success: res => {
								if (res.confirm) {
									that.copyOrOffGoods('copyGoods', {
										goods_id: that.curId
									}, '商品复制成功，已添加至您的草稿箱中')
								}
							}
						})
						break;
					case 3: //下架  上架
						if (this.type == 1 && this.store.is_A == 0) {
							return uni.showToast({
								title: '分销商品无法下架哦~~',
								icon: 'none'
							})
						}
						if (this.type == 4) {
							return uni.showToast({
								title: '草稿箱中的商品，需要编辑后才可以发布哦~~',
								icon: 'none'
							})
						}
						uni.showModal({
							message: (this.type == 3 || this.type == 4) ?
								'商品上架后，将展示在您的店铺中，如需再次下架，可重新进行商品操作' :
								'商品下架后，将暂时存放在您的"已下架"商品列表中，下架后，如需重新上架，可以在"已下架"列表中重新编辑上架',
							confirmButtonText: (this.type == 3 || this.type == 4) ? "上架" : "下架",
							cancelButtonText: '取消',
							success: res => {
								that.copyOrOffGoods('changeGoodsStatus', {
									field: 'is_on_sale',
									value: that.type == 3 ? 1 : 0,
									goods_id: that.curId
								}, '商品' + that.type == 3 ? "上架" : "下架" + '成功')
							}
						})
						break;
					case 4: //删除的操作
						this.showDelGoods = true;
						break;
					case 5: //分享的操作
						if (this.type == 3 || this.type == 4) {
							return uni.showToast({
								title: '未发布的商品，无法进行分享哦~~',
								icon: 'none'
							})
						}
						this.actionSheetHidden2 = false;
						this.shareImg = this.url + '/api/goods/goodsThumImages?goods_id=' + this.curId + '&width=400&height=400'
						break;
					default:
						break;
				}
			},
			closeOperationMask: function() { //关闭操作
				this.showOperationMask = false;
			},
			shareGoods: function(e) { //商品item分享
				this.curId = e.currentTarget.dataset.id;
				this.actionSheetHidden2 = false;
				this.shareType = 'goods';
				this.goodsTit = e.currentTarget.dataset.tit;
				this.shareImg = e.currentTarget.dataset.img;
			},
			copyOrOffGoods: function(url, data, msg) {
				var that = this;
				request.post(that.url + '/api/store/' + url, {
					data,
					success: function(res) {
						uni.showToast({
							title: msg,
							duration: 2000
						})
						//刷新页面
						that.list = [];
						that.p0 = 1;
						that.p1 = 1;
						that.p2 = 1;
						that.p3 = 1;
						that.p4 = 1;
						that.getGoodsList();
						that.getStore();
					}
				})
			},
			shareHaiBao: function() {
				uni.showLoading()
				var that = this
				var type = that.store.is_A == 1 ? 0 : 3
				uni.getImageInfo({
					src: that.url + '/api/goods/goodsSharePoster?id=' + that.curId +
						'&token=' + that.userInfo.token +
						'&type=' + type + '&leader_id=' + uni.getStorageSync('app:userInfo')['user_id'],
					isShowLoading: false,
					success: function(res) {
						that.share_btn = true;
						that.share_pic = res.path;
					},
					complete: function(res) {
						uni.hideLoading()
					}
				})
			},
			toTongHang: function(e) { //点击商品的分享给同行
				this.actionSheetHidden = true;
				this.actionSheetHidden2 = true;
				uni.showModal({
					message: '此操作，对方将会知晓壹童网，请确认，您将要分享的是同行吗？',
					confirmButtonText: '确定分享',
					cancelButtonText: '取消',
					confirmButtonOpenType: 'share'
				})
			},
			share2: function(e) {
				this.shareTxt = this.store.is_A == 1 ? '分享至朋友圈' : '私密分享给下级';
				this.actionSheetHidden = true;
				this.actionSheetHidden2 = true;
				this.shareHaiBao();
			},
			closeOperations: function() { //关闭店铺管理的操作选项
				this.shouldOperationsShow = false;
				this.shouldProposalShow = false;
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
							url: '/pages/user/account_b/account_b?is_A=' + that.store.is_A,
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
							url: '/pages/distribut0/DIYshop/DIYshop?is_A=' + that.store.is_A,
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
							url: '/pages/distribut0/DIYshopPoster/DIYshopPoster?is_A=' + that.store.is_A,
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
				var index = e.currentTarget.dataset.index
				var imgs = this.proposalData.img
				imgs.splice(index, 1)
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
						store_id: this.store.store_id || uni.getStorageSync('app:userInfo').store_id,
						user_id: this.store.user_id || uni.getStorageSync('app:userInfo').store_id,
						complaint_content,
						complaint_img
					},
					success: function(res) {
						that.proposalData = {
							img: [],
							proposalArea: ''
						}
						that.isProposalDone = true;
					}
				})
			},
		}
	}
</script>

<style scoped src="./shop.css">

</style>
