<template>
	<view>
		<page-meta :scroll-top="pageMetaScrollTop"></page-meta>

		<view class="goodsTitle">
			<view class="titleTips"><text class="fll fw600">商品标题</text><text
					class="flr">{{ goodsTitle.length }}/60</text></view>
			<input placeholder-class="titlePlace" v-model="goodsTitle" placeholder="请输入 例如:新款女童冬季加厚中长款手塞棉衣外套"
				@input="goodsTitleInput"></input>
		</view>
		<view class="mainImg">
			<view class="titleTips titleTips2 rela borderT">
				<text class="fll">商品主图</text>
				<text v-if="listData.length > 0" class="flr col18" space="emsp"
					style="font-size:24rpx;">（点击可编辑图片、长按可拖拽排序） </text>
			</view>
		</view>

		<!-- 拖拽图片 -->
		<view style="background-color:#fff;padding:0 16px;">
			<drag id="drag" @click="itemClick" @change="change" @sortend="sortEnd" @scroll="scroll"
				:extra-nodes="extraNodes" :list-data="listData" :columns="size" scroll-top="scrollTop" top-size="110"
				@del="delItem" @changeImg="changeImg" @pTu="pTu" delx isMain :bottom-size="isIphoneX ? 380 : 300">
				<view slot="plus" class="plus-wrap" @tap="add">
					<view class="plus"></view>
					<view class="imageNumtips">{{ listData.length }}/{{ 10 }}</view>
				</view>
			</drag>
		</view>

		<!-- 视频上传 -->
		<view class="mainImg">
			<view class="titleTips rela"><text class="fll fw600">商品视频</text><text class="fll fs24 col999">(非必选)</text>
			</view>
			<view class="rela uploadVideo" :class="{hasVideo: videoLocalSrc || videoOnLineSrc}">
				<image v-if="!videoLocalSrc && !videoOnLineSrc" @tap.stop="uploadVideo" :src="loadingSrc"></image>
				<video style="height:250rpx;width:250rpx;" v-if="videoLocalSrc || videoOnLineSrc"
					:src="videoLocalSrc || videoOnLineSrc"></video>
				<text v-if="videoLocalSrc || videoOnLineSrc" @tap.stop="uploadVideo" class="abs changeVideo">更换</text>
				<text v-if="videoLocalSrc || videoOnLineSrc" @tap.stop="delVideo" class="abs changeVideo2">删除</text>
			</view>
		</view>

		<van-cell title="商品分类" is-link
			:value="step == 1 ? (categoryValue ? categoryValue : multiArray[2][multiIndex[2]]) : '请选择'"
			:custom-class="cat_id1 == 0 ? '' : 'selectAttr'" @tap.stop="setCategory"></van-cell>

		<view class="mainImg" style="margin:15rpx 0;">
			<view class="titleTips titleTips2 rela">
				<text class="fll">商品详情图</text>
				<text v-if="listData2.length > 0" class="flr col18" space="emsp"
					style="font-size:24rpx;">（点击可编辑图片、长按可拖拽排序） </text>
			</view>
		</view>
		<!-- 拖拽图片 -->
		<view style="background-color:#fff;padding:0 16px;">
			<drag id="drag2" @click="itemClick" @change="change" @sortend="sortEnd2" @scroll="scroll"
				:extra-nodes="extraNodes" :list-data="listData2" :columns="size" :scroll-top="scrollTop" top-size="110"
				@del="delItem" @changeImg="changeImg" @pTu="pTu" delx :bottom-size="isIphoneX ? 380 : 300">
				<view slot="plus" class="plus-wrap" @tap="add2">
					<view class="plus"></view>
					<view class="imageNumtips">{{ listData2.length }}/{{ 50 }}</view>
				</view>
			</drag>
		</view>

		<!-- 商品属性部分 -->
		<view class="goodsAttr">
			<view class="attrTitle co555 fw600">商品属性</view>
			<van-cell title="适用性别" is-link :value="attr_1 || '请选择'" :custom-class="attr_1 == '' ? '' : 'selectAttr'"
				@tap.stop="ongenderShow"></van-cell>
			<van-action-sheet title="适用性别" :show="showGender" :actions="genderActions" @close="ongenderClose"
				@select="ongenderSelect" overlay />
			<van-cell title="适用年龄" is-link :value="attr_2 || '请选择'" :custom-class="attr_2 == '' ? '' : 'selectAttr'"
				@tap.stop="onAgeShow"></van-cell>
			<van-action-sheet title="适用年龄" :show="showAge" :actions="ageActions" @close="onageClose"
				@select="onageSelect" overlay />
			<view class="proposalAge col323233">
				<view class="rela">
					<text class="fll">建议年龄<text class="fs24 col999">（非必填）</text></text>
					<input placeholder-class="agePlaceClass" class="proposalAgeInput1" @blur="proposalAgeBlur"
						@input="proposalAgeInput" data-type="min" type="number" :value="ageRange.min" placeholder="输入">
					</input><text class="mr120 col000">岁 <text style="font-size: 40rpx;font-weight: 600;">~</text>
					</text>
					<input placeholder-class="agePlaceClass" type="number" class="proposalAgeInput2"
						@blur="proposalAgeBlur" @input="proposalAgeInput" data-type="max" :value="ageRange.max"
						placeholder="输入"></input>
					<text class="col000">岁</text>
				</view>
			</view>
			<view class="proposalAge">
				<view class="rela borderT"><text class="fll">每手重量</text>
					<input style="right:74rpx;top:17rpx;" v-model="goodsWeight" type="digit" class="proposalAgeInput3"
						placeholder="输入"></input>
					<text class="col000">kg/手</text>
				</view>
			</view>
			<view class="proposalAge goodsColor rela col999">
				<view class="borderT" @tap="editSpec" data-from="normal">
					<text class="fll col000 lh110">货号颜色</text>
					<text class="lh110 col969799 rela" space="ensp" style="padding-right:8px;">点击编辑 <text
							class="rightArr1"></text></text>
				</view>
				<view class="goodsColorItem abs" @tap="editSpec" data-from="normal">
					<view class="col18" v-if="specInfo.spec_item_color.price_text">
						<text style="margin-right:10rpx;">{{ specInfo.spec_item_color.price_text }}</text>
						<text>库存:{{ specInfo.spec_item_color.store_count > 5000 ? '5000+' : specInfo.spec_item_color.store_count }}</text>
					</view>
					<text class="col18"
						v-if="specInfo.spec_item_color.price_text">{{ specInfo.spec_item_color.price_ms_text }}</text>
				</view>
			</view>
			<view class="goodsColor2 rela col999">
				<view class="borderT" @tap="editSpec" data-from="bottom">
					<text class="fll col323233" style="line-height:80rpx;">每手几件</text>
					<text class="col969799 rela" space="ensp"
						style="float:right;line-height:80rpx;padding-right:15px;">点击编辑<text
							class="rightArr1"></text></text>
				</view>
				<view class="goodsColorItem abs" style="line-height:80rpx;">
					<view class="col18" @tap="editSpec" data-from="bottom" v-if="specInfo.spec_item_ms">
						{{ specInfo.spec_item_ms }}件
					</view>
				</view>
			</view>

			<view class="publicBox rela" v-if="is_A == 1">
				<view class="flx isPublicCheckTop borderT borderB">
					<text class="col323233 fs28">展示方式</text>
					<van-radio-group custom-class="vipRadio" :value="isPublic" @change="onIsPublicChange">
						<view class="flx isPublicCheck">
							<van-radio style="margin-right:20rpx;" name="1" checked-color="#18c2ba" checked="true">全网展示
							</van-radio>
							<van-radio name="2" checked-color="#18c2ba">{{ is_A == 1 ? '仅本店VIP客户查看' : '指定客户查看' }}
							</van-radio>
						</view>
					</van-radio-group>
				</view>
				<view class="vipLSist borderB rela" v-if="isPublic == 2">
					<navigator class="toVipNavigator" url="/pages/distribut0/vipList/vipList">VIP客户列表</navigator>
					<text class="mr240">多少天后全网展示</text>
					<input v-if="submitParams.vipDate == ''" class="vipInput" placeholder="请输入" type="number"
						:value="submitParams.vipDate" disabled="true" @tap="onTimePickerShow"></input>
					<input v-if="submitParams.vipDate != ''" class="vipInput" placeholder="请输入" type="number"
						:value="submitParams.vipDate + '后'" disabled="true" @tap="onTimePickerShow"></input>
					<text class="vipPlacehoderAbs"></text>
				</view>
			</view>
			<!-- 时间选择 -->
			<van-calendar :show="showTimePicker" title="选择公开展示时间" :maxDate="maxDate" :minDate="minDate"
				@close="onTimePickerClose" @confirm="onTimePickerConfirm" />

			<view class="publicBox rela">
				<view class="flx isPublicCheckTop borderT borderB">
					<text class="col323233 fs14">是否包邮</text>
					<van-radio-group custom-class="vipRadio" :value="isFreeShipping" @change="isFreeShippingChange">
						<view class="flx isPublicCheck">
							<van-radio style="margin-right:23rpx;" name="1" checked-color="#18c2ba" checked="true">是
							</van-radio>
							<van-radio name="2" checked-color="#18c2ba">否</van-radio>
						</view>
					</van-radio-group>
				</view>
			</view>

			<van-cell v-if="isFreeShipping == 2" title="运费模板" is-link
				:value="freightTemplateTxt ? freightTemplateTxt : '请选择'"
				:custom-class="freightTemplateTxt == '' ? '' : 'selectAttr'" @tap.stop="onFreightTemplateShow">
			</van-cell>
			<van-action-sheet title="运费模板" :show="showFreightTemplate" :actions="specInfo.freight_template"
				@close="onFreightTemplateClose" @select="onFreightTemplateSelect" />

		</view>

		<!-- 底部提交 -->
		<view class="subBox fw600" :style="'padding-bottom:' + isiphoneX? '25rpx' : '15rpx'">
			<view class="sureSub" @tap.stop="sureSubmit" data-type="add">发 布 商 品</view>
			<view class="sureSub" @tap.stop="sureSubmit" data-type="draft">保存为草稿</view>
		</view>

	</view>
</template>

<script>
	var request = require("../../../static/utils/request");
	var app = getApp();
	var setting = app.globalData.setting;
	let listData = [];
	export default {
		data() {
			return {
				url: setting.url,
				size: 4,
				listData: [],
				listData2: [],
				isiphoneX: uni.getStorageSync('isiphoneX') || false,
				extraNodes: [{
					type: "after",
					dragId: "plus",
					slot: "plus",
					fixed: true
				}],
				pageMetaScrollTop: 0,
				scrollTop: 0,
				goodsTitle: '', //商品标题
				videoLocalSrc: '', //商品本地路径
				videoOnLineSrc: '',
				loadingSrc: '../../../static/images/drag_video.png',
				loadingVideo: false, //是否正在上传视频
				showGender: false,
				showAge: false,
				showFreightTemplate: false,
				isPublic: '1',
				isFreeShipping: '2',
				uploadFlag: true,
				ageRange: { //建议年龄
					min: '',
					max: ''
				},
				specInfo: {
					spec_item_ms: '',
					spec_item_color: {
						price_text: '',
						price_ms_text: '',
						store_count: 0
					},
					freight_template: []
				},
				goodsWeight: '', //商品重量
				genderActions: [],
				ageActions: [],
				attr_1: '',
				attr_2: '',
				cat_id1: '',
				cat_id2: '',
				cat_id3: '',
				template_id: 0, //运费模板id
				freightTemplateTxt: '',
				is_A: false,
				sortTxt: '排序',
				showSortTipsTxt: false,
				categoryValue: '',
				pId: 0, //获取分类时的父id  默认0  一级分类
				multiArray: [], // 三维数组数据
				multiIndex: [0, 0, 0], // 默认的下标
				getcate: [0, 0, 0],
				step: 0, // 默认显示请选择
				goods_id: 0,
				isFirstIn: true, //是否是首次进入
				isFirstIn2: true, //是否是首次进入
				isFirstIn3: true, //是否是首次init
				submitParams: {
					vipDate: ''
				}, //要提交是数据
				maxDate: new Date(2023, 2, 31).getTime(),
				minDate: +new Date() + 86400000,
				showTimePicker: false, //是否展示时间选择
				imgType: 'a', //上传图片的类型
				detailValue: '', //商品详情描述
				isCopy: '', //是否是copy进来的
				curId: 0, //操作的id
				curId2: 0, //操作的id
			}
		},
		onLoad: function(options) {
			this.drag = this.selectComponent('#drag');
			this.drag2 = this.selectComponent('#drag2');
			this.goods_id = options.goods_id ? options.goods_id : 0;
			this.is_A = options.is_A;
			this.isCopy = options.isCopy || '';

			//如果是商品编辑  需要换地方
			this.getAttrSelect(options.goods_id || 0)
			this.addEditGoods(options.goods_id || 0, false)
			if (options.goods_id == 0) { //不是编辑  请求分类
				this.getCategoryList()
			}
		},
		onShow: function() {
			if (this.isFirstIn) {
				this.isFirstIn = false
			} else {
				this.addEditGoods(this.goods_id, false)
			}
			if (this.loadingVideo) {
				uni.showLoading({
					title: '正在上传...',
					mask: true
				})
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			sortEnd: function(e) {
				this.listData = [...e.detail.listData]
			},
			sortEnd2: function(e) {
				this.listData2 = [...e.detail.listData]
			},
			change: function(e) { },
			itemClick: function(e) { },
			toggleFixed: function(e) {
				let key = e.currentTarget.dataset.key;
				let listData = this.listData;
				listData[key].fixed = !listData[key].fixed;
				this.listData = [...listData];
				this.drag.init();
				this.drag2.init();
			},
			add: function(e) {
				let listData = this.listData;
				var that = this;
				if (e) {
					if (listData.length >= 10 || !this.uploadFlag) {
						return uni.showToast({
							title: '商品主图最多可选10张',
							icon: 'none'
						})
					}
				}
				this.imgType = 'a';
				var reg = /\.(jpeg|png|jpg)$/;
				uni.showActionSheet({
					itemList: ['相册选取', '拍照'],
					success: function(res) {
						var i = res.tapIndex;
						if (i === 0) {
							uni.chooseImage({ //相册
								count: 10 - that.listData.length,
								sizeType: 'compressed',
								sourceType: ['album'],
								success: function(res) {
									for (let i = 0; i < res.tempFilePaths.length; i++) {
										if (reg.test(res.tempFilePaths[i])) {
											that.uploadFile(res.tempFilePaths[i])
										}
									}
								}
							})
						} else {
							uni.chooseImage({ //相机
								count: 1,
								sizeType: "compressed",
								sourceType: ['camera'],
								success: function(res) {
									if (reg.test(res.tempFilePaths[0])) {
										that.uploadFile(res.tempFilePaths[0])
									}
								}
							})
						}
					}
				})
			},
			add2: function(e) {
				let listData2 = this.listData2;
				var that = this;
				if (e) {
					if (listData2.length >= 50 || !this.uploadFlag) {
						return uni.showToast({
							title: '商品详情图最多可选50张',
							icon: 'none'
						})
					}
				}
				this.imgType = 'b';
				var reg = /\.(jpeg|png|jpg)$/;
				uni.showActionSheet({
					itemList: ['相册选取', '拍照'],
					success: function(res) {
						var i = res.tapIndex
						if (i === 0) {
							uni.chooseImage({ //相册
								count: 50 - that.listData2.length,
								sizeType: 'compressed',
								sourceType: ['album'],
								success: function(res) {
									console.log(res)
									for (let i = 0; i < res.tempFilePaths.length; i++) {
										if (reg.test(res.tempFilePaths[i])) {
											that.uploadFile(res.tempFilePaths[i])
										}
									}
								}
							})
						} else {
							uni.chooseImage({ //相机
								count: 1,
								sizeType: "compressed",
								sourceType: ['camera'],
								success: function(res) {
									if (reg.test(res.tempFilePaths[0])) {
										that.uploadFile(res.tempFilePaths[0])
									}
								}
							})
						}
					}
				})
			},
			scroll: function(e) {
				this.pageMetaScrollTop = e.detail.scrollTop
			},
			uploadFile: function(src) {
				const that = this
				this.uploadFlag = false
				uni.uploadFile({
					filePath: src,
					name: 'qinzi_imgs',
					url: that.url + '/api/newjoin/upload_qianzi_img',
					success: function(res) {
						if (res.statusCode !== 200) {
							return
						}
						var result = JSON.parse(res.data)
						if (that.curId2 != 0) {
							if (that.imgType == 'a') {
								let listData = that.listData
								var index = listData.findIndex((item) => {
									return item.dragId == that.curId2
								})
								if (index == -1) {
									return
								}
								listData[index].spec_img = result.result
								that.listData = [...listData]
								that.uploadFlag = true
								that.curId2 = 0
								that.drag.init();
							} else {
								let listData2 = that.listData2
								var index = listData2.findIndex((item) => {
									return item.dragId == that.curId2
								})
								if (index == -1) {
									return
								}
								listData2[index].spec_img = result.result
								that.listData2 = [...listData2]
								that.uploadFlag = true
								that.curId2 = 0
								that.drag2.init();
							}
						} else { //不是换图
							if (that.imgType == 'a') {
								let listData = that.listData;
								listData.push({
									dragId: Math.random() + '',
									spec_img: result.result,
									fixed: false,
									isSpec: false,
									imgType: 'a'
								});
								that.listData = [...listData]
								that.uploadFlag = true
								that.drag.init();
							} else {
								let listData2 = that.listData2;
								listData2.push({
									dragId: Math.random() + '',
									spec_img: result.result,
									fixed: false,
									isSpec: false,
									imgType: 'b'
								});
								that.listData2 = [...listData2]
								that.uploadFlag = true
								that.drag2.init();
							}
						}
					}
				})
			},
			// 上传视频
			uploadVideo: function() {
				var that = this
				uni.chooseVideo({
					compressed: false,
					success: function(res) {
						if (res.size / 1024 / 1024 > 90) {
							return uni.showToast({
								title: '视频最大不能超过90M',
								icon: 'none'
							})
						}
						that.videoLocalSrc = res.tempFilePath
						that.loadingVideo = true	//request.js 封装了hidde loading  onshow有请求  所以使用 true false 标识
						that.uploadvideoRequest(res.tempFilePath)
					}
				})
			},
			delVideo: function() {
				this.videoLocalSrc = ''
				this.videoOnLineSrc = ''
			},
			uploadvideoRequest: function(src) {
				uni.showLoading({
					title: '正在上传...',
					mask: true
				})
				var that = this
				uni.uploadFile({
					url: that.url + '/api/Store/videoUp?token=' + uni.getStorageSync("app:userInfo").token,
					method: 'POST',
					filePath: src,
					header: {
						'content-type': 'multipart/form-data'
					},
					name: 'file', //服务器定义的Key值
					success: function(res) {
						var result = JSON.parse(res.data)
						that.videoOnLineSrc = result.url
						that.loadingVideo = false
						that.$nextTick(function(){
							uni.hideLoading()
						})
					},
					fail: function() {
						that.videoLocalSrc = ''
						that.loadingVideo = false
						that.$nextTick(function(){
							that.myToast('商品上传失败')
							uni.hideLoading()
						})
					},
					complete: function() { }
				})
			},
			delItem: function(e) { //删除
				if (e.detail.img == 'a') {
					let listData = this.listData
					var index = listData.findIndex((item) => {
						return item.dragId == e.detail.id
					})
					listData.splice(index, 1)
					this.listData = [...listData]
					this.drag.init();
				} else {
					let listData2 = this.listData2
					var index = listData2.findIndex((item) => {
						return item.dragId == e.detail.id
					})
					listData2.splice(index, 1)
					this.listData2 = [...listData2]
					this.drag2.init();
				}
			},
			changeImg: function(e) { //修改图片操作
				var params = e.detail
				if (params.type) {
					this.curId2 = params.id
					this.add()
				} else {
					this.curId2 = params.id
					this.add2()
				}
			},
			setCategory: function() {
				uni.navigateTo({
					url: '/pages/goods/setAttr/setAttr?id1=' + this.getcate[0] + '&id2=' + this.getcate[1] + '&id3=' + this.getcate[2],
				})
			},
			ongenderSelect: function(e) { //选择gender
				this.attr_1 = e.detail.name
			},
			onageSelect: function(e) { //选择age
				this.attr_2 = e.detail.name
			},
			onIsPublicChange: function(e) { //全网展示与否
				this.isPublic = e.detail
			},
			isFreeShippingChange: function(e) { //是否包邮
				this.isFreeShipping = e.detail
			},
			onFreightTemplateSelect: function(e) { //选择运费模板
				this.template_id = e.detail.template_id
				this.freightTemplateTxt = e.detail.template_name
			},
			sortImg: function() { //排序开关
				if (this.listData.length == 0) {
					return
				}
				this.showSortTipsTxt = this.sortTxt == '排序' ? true : false
				this.sortTxt = this.sortTxt == '排序' ? '完成' : '排序'
			},
			goodsTitleInput: function(e) { //商品标题输入
				var v = e.detail.value
				if (v == '' || v.trim() == '') {
					v = ''
				} else {
					v = v.trim()
				}
				if (v.length > 60) {
					uni.showToast({
						title: '商品标题最多可以输入60个字',
						icon: 'none'
					})
				}
				this.goodsTitle = v.substring(0, 60)
			},
			proposalAgeInput: function(e) { //建议年龄段输入框
				var type = e.currentTarget.dataset.type
				var v = e.detail.value
				if (v != '') {
					if (v < 0 || v > 20) {
						uni.showToast({
							title: '年龄在0~20之间数字',
							icon: 'none'
						})
						v = type == 'min' ? 0 : 20
					}
				}
				if (type == 'min') {
					this.ageRange = {
						min: v,
						max: this.ageRange.max
					}
				} else {
					this.ageRange = {
						min: this.data.ageRange.min,
						max: v
					}
				}
				this.ageRange = Object.assign({}, this.ageRange)
			},
			proposalAgeBlur: function(e) { },
			goodsWeightInput: function(e) { //商品重量输入
				var v = e.detail.value
				this.goodsWeight = v
			},
			onTimePickerConfirm: function(e) {
				var d = new Date(e.detail);
				var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
				this.showTimePicker = false;
				this.submitParams.vipDate = datetime;
				this.submitParams = Object.assign({}, this.submitParams)
			},
			sureSubmit: function(e) { //最终提交
				var that = this
				var list2 = this.listData2
				var str = '<p>' + this.detailValue.trim() + '</p>'
				for (let i = 0; i < list2.length; i++) {
					str += '<p><img src=\'' + list2[i].spec_img + '\' ></p>'
				}
				var type = e.currentTarget.dataset.type
				let {
					goodsTitle,
					listData,
					step,
					attr_1,
					attr_2,
					goodsWeight,
					specInfo,
					isFreeShipping,
					template_id,
					isPublic,
					cat_id1,
					cat_id2,
					cat_id3
				} = this
				if (goodsTitle == '' || goodsTitle.trim() == '') {
					this.myToast('请填写商品标题')
					return
				} else if (listData.length == 0) {
					this.myToast('商品主图至少上传一张')
					return
				} else if (cat_id1 == '' || cat_id2 == '' || cat_id3 == '') {
					this.myToast('请选择商品分类')
					return
				} else if (attr_1 == '') {
					this.myToast('请选择适用性别')
					return
				} else if (attr_2 == '') {
					this.myToast('请选择适用年龄')
					return
				} else if (goodsWeight == '' || goodsWeight < 0) {
					this.myToast('请正确填写每手重量')
					return
				} else if (specInfo.spec_item_color.price_text == '') {
					this.myToast('请添加商品规格')
					return
				} else if (isPublic == -99) {
					this.myToast('请选择是否公开展示')
					return
				} else if (isPublic == 2) {
					if (this.submitParams.vipDate == '') {
						this.myToast('请正确填写多少天后商品全网展示')
						return
					}
				} else if (isFreeShipping == 2) {
					if (template_id == 0) {
						this.myToast('请选择运费模板')
						return
					}
				}
				if (this.ageRange.min >= 0 && this.ageRange.max >= 0) {
					if ((this.ageRange.min - 0) > (this.ageRange.max - 0)) {
						return uni.showToast({
							title: '建议年龄必须从小到大(0-20)',
							icon: 'none'
						})
					}
				}
				var min = this.ageRange.min
				var max = this.ageRange.max
				if (this.ageRange.min == '' || this.ageRange.max == '') {
					min = ''
					max = ''
				}
				var imgs = []
				this.listData.forEach((item) => {
					imgs.push(item.spec_img)
				})
				var imgStr = imgs.join(',')
				let params = {
					goods_name: this.goodsTitle,
					goods_id: this.goods_id,
					cat_id1: this.cat_id1,
					cat_id2: this.cat_id2,
					cat_id3: this.cat_id3,
					is_public_sell: this.isPublic,
					public_sell_time: this.submitParams.vipDate,
					goods_images: imgStr,
					video: this.videoOnLineSrc,
					weight: this.goodsWeight,
					is_free_shipping: this.isFreeShipping,
					template_id: this.template_id,
					attr_1: this.attr_1,
					attr_2: this.attr_2,
					sub_type: type == 'add' ? 1 : 2,
					goods_content: str,
					suggest_age_start: min - 0,
					suggest_age_end: max - 0
				}
				console.log(params)
				if (this.isFreeShipping == '1') {
					uni.showModal({
						content: '当前您选择的是"包邮"发布商品，是否确定？',
						success: function(res) {
							if (res.confirm) {
								that.submitRequest(params)
							} else if (res.cancel) {

							}
						}
					})
				} else {
					that.submitRequest(params)
				}
			},
			submitRequest: function(params) {
				var that = this
				request.post(that.url + '/api/Store/goodsSave', {
					data: params,
					success: function(res) {
						if (res.data.status == 1) {
							uni.showToast({
								title: '操作成功！',
							})
							setTimeout(() => {
								uni.navigateBack({
									delta: 1,
								})
							}, 1000)
						}
					}
				})
			},
			myToast: function(t) { //提示封装，避免代码一长串
				uni.showToast({
					title: t,
					icon: 'none'
				})
			},
			editSpec: function(e) { //前往规格编辑
				var from = e.currentTarget.dataset.from
				uni.navigateTo({
					url: '/pages/goods/specSize/index?goods_id=' + this.goods_id + '&from=' + from,
				})
			},
			// 控件开关
			ongenderClose: function() {
				this.showGender = false
			},
			ongenderShow: function() {
				this.showGender = true
			},
			onageClose: function() {
				this.showAge = false
			},
			onAgeShow: function() {
				this.showAge = true
			},
			onFreightTemplateClose: function() {
				this.showFreightTemplate = false
			},
			onFreightTemplateShow: function() {
				this.showFreightTemplate = true
			},
			onTimePickerClose: function() {
				this.showTimePicker = false
			},
			onTimePickerShow: function() {
				this.showTimePicker = true
			},
			// 请求类目 三级分类
			getCategoryList: function() { // 获取1级
				var that = this
				request.get(that.url + '/api/Store/addStepOne', {
					data: {
						parent_id: 0
					},
					success: function(res) {
						var provinceList = [...res.data.data]
						var selectedId1 = ''
						var selectedIndex1 = ''
						var provinceArr = res.data.data.map((item, index) => {
							if (item.id == that.getcate[0]) {
								selectedId1 = item.id
								selectedIndex1 = index
							}
							return item.name
						})
						that.multiArray = [provinceArr, [], []]
						that.provinceList = [...provinceList]
						that.provinceArr = [...provinceArr]
						that.multiIndex[0] = selectedIndex1
						that.multiArray = [...that.multiArray]
						var defaultCode = selectedId1 ? selectedId1 : that.provinceList[0].id // 使用第一项当作参数获取2级数据
						if (defaultCode) {
							that.currnetProvinceKey = defaultCode	// 保存在当前的1级key
							that.getCategoryList2(defaultCode) // 获取2级数据
						}
					}
				})
			},
			getCategoryList2: function(code) { // 获取2级数据
				var that = this
				this.currentProvinceKey = code	// 保存当前选择的2级code
				request.get(that.url + '/api/Store/addStepOne', {
					data: {
						parent_id: code
					},
					success: function(res) {
						var selectedId2 = ''
						var selectedIndex2 = 0
						var cityArr = res.data.data.map((item, index) => {
							if (item.id == that.getcate[1] && that.isFirstIn2) {
								selectedId2 = item.id
								selectedIndex2 = index
							}
							return item.name
						})
						var cityList = [...res.data.data]
						that.multiArray = [that.provinceArr, cityArr,[]]
						that.cityList = [...cityList]
						that.cityArr = [...cityArr]
						that.multiIndex[1] = selectedIndex2
						that.multiArray = [...that.multiArray]
						var defaultCode = selectedId2 ? selectedId2 : that.cityList[0].id // 用第一个获取3数据
						if (defaultCode) {
							that.currnetCityKey = defaultCode
							that.getCategoryList3(defaultCode) // 获取3级数据
						}
					}
				})
			},
			getCategoryList3: function(code) { //获取3级
				var that = this
				this.currnetCityKey = code
				request.get(that.url + '/api/Store/addStepOne', {
					data: {
						parent_id: code
					},
					success: function(res) {
						var selectedIndex3 = 0
						var storeList = [...res.data.data]
						var storeArr = res.data.data.map((item, index) => {
							if (item.id == that.getcate[2] && that.isFirstIn2) {
								selectedIndex3 = index
							}
							return item.name
						})
						that.multiArray = [that.provinceArr, that.cityArr, storeArr]
						that.storeList = [...storeList]
						that.storeArr = [...storeArr]
						that.multiIndex[2] = selectedIndex3
						that.isFirstIn2 = false
						that.step = that.getcate[2] > 0 ? 1 : 0
						that.multiArray = [...that.multiArray]
					}
				})
			},
			columnchange: function(e) { // 滚动选择器 触发的事件
				var column = e.detail.column // 当前改变的列
				var data = {
					multiIndex: JSON.parse(JSON.stringify(this.multiIndex)),
					multiArray: JSON.parse(JSON.stringify(this.multiArray))
				}
				data.multiIndex[column] = e.detail.value; // 第几列改变了就是对应multiIndex的第几个，更新它
				switch (column) { // 处理不同的逻辑
					case 0: // 第一列更改 就是1级的更改
						var currentProvinceKey = this.provinceList[e.detail.value].id
						if (currentProvinceKey != this.currnetProvinceKey) { // 判断当前的key是不是真正的更新了
							this.getCategoryList2(currentProvinceKey) // 获取当前key下面的市级数据
						}
						data.multiIndex[1] = 0 // 将2级默认选择第一个
						break;
					case 1: // 2级发生变化
						var currentCitykey = this.cityList[e.detail.value].id
						if (currentCitykey != this.currnetCityKey) { // 同样判断
							this.getCategoryList3(currentCitykey) // 获取3级
						}
						data.multiIndex[2] = 0 // 3级默认为第一个
						break;
				}
				this.multiIndex = data.multiIndex
				this.multiArray = [...data.multiArray]
			},
			pickchange: function(e) {
				this.step = 1
				this.multiIndex = e.detail.value
			},
			getAttrSelect: function(id) {
				var that = this
				request.get(that.url + '/api/Store/getAttrSelect', {
					data: {
						goods_id: id
					},
					success: function(res) {
						var genderActions = res.data.data[0].attr_value.map((item) => {
							return {
								name: item,
								id: 2
							}
						})
						var ageActions = res.data.data[1].attr_value.map((item) => {
							return {
								name: item
							}
						})
						that.genderActions = [...genderActions]
						that.ageActions = [...ageActions]
					}
				})
			},
			addEditGoods: function(id, hascb) {
				var that = this
				request.get(that.url + '/api/Store/addEditGoods', {
					data: {
						goods_id: id
					},
					success: function(res) {
						let srcArr = []
						var data = res.data.data
						data.freight_template.forEach((item) => {
							item.name = item.template_name
						})
						if (data.freight_template.length == 0) {
							data.freight_template.push({
								name: '暂无运费模板，可前往电脑端添加',
								template_id: 0
							})
						}
						var imgs = []
						if (data.goodsImages) {
							data.goodsImages.forEach((item, index) => {
								imgs.push({
									dragId: Math.random() + '',
									spec_img: item.image_url,
									fixed: false,
									isSpec: false,
									imgType: 'a'
								})
							})
						}
						if (that.goods_id > 0 && that.isFirstIn3) {
							if (data.goodsInfo) {
								var xiao = '&lt;'
								var da = '&gt;'
								var content = data.goodsInfo.goods_content.replace(new RegExp(xiao, 'g'), '<').replace(new RegExp(da, 'g'), '>')
								let imgReg = /<img.*?(?:>|\/>)/gi
								let srcReg = /src=[\'\']?([^\'\']*)[\'\']?/i
								let arr = content.match(imgReg)
								if (arr) {
									for (let i = 0; i < arr.length; i++) {
										let src = arr[i].match(srcReg)
										// 获取图片地址 src[1]
										srcArr.push({
											dragId: Math.random() + '',
											spec_img: src[1],
											fixed: false,
											isSpec: false,
											imgType: 'b'
										})
									}
								}
							}
							that.specInfo = Object.assign({}, data)
							that.goodsTitle = data.goodsInfo.goods_name
							that.listData = [...imgs]
							that.listData2 = [...srcArr]
							that.videoOnLineSrc = data.goodsInfo.video
							that.getcate = [data.goodsInfo.cat_id1, data.goodsInfo.cat_id2, data.goodsInfo.cat_id3]
							that.getcate = [...that.getcate]
							that.cat_id1 = data.goodsInfo.cat_id1
							that.cat_id2 = data.goodsInfo.cat_id2
							that.cat_id3 = data.goodsInfo.cat_id3
							that.goodsWeight = data.goodsInfo.weight
							that.ageRange.min = data.goodsInfo.suggest_age_start
							that.ageRange.max = data.goodsInfo.suggest_age_end
							that.template_id = data.goodsInfo.template_id || data.freight_template[0].template_id
							that.freightTemplateTxt = data.freight_template ? data.freight_template[0].template_name : ''
							that.isPublic = that.isCopy == 'copyA' ? '-99' : 
								(data.goodsInfo.is_public_sell == 0 ? '2' : data.goodsInfo.is_public_sell + '')
							that.submitParams.vipDate = data.goodsInfo.public_sell_time ? data.goodsInfo.public_sell_time : ''
							that.isFreeShipping = data.goodsInfo.is_free_shipping == 1 ? '1' : '2'
							that.freightTemplateTxt = data.goodsInfo.is_free_shipping == 1 ? '' :
								data.freight_template[0].template_name || ''
							that.attr_1 = data.goods_attr[0] ? data.goods_attr[0].attr_value : ''
							that.attr_2 = data.goods_attr[1] ? data.goods_attr[1].attr_value : ''
							that.isFirstIn3 = false
							that.curId = 0
							that.ageRange = Object.assign({}, that.ageRange)
							that.submitParams = Object.assign({}, that.submitParams)
							that.getCategoryList()
							if (imgs.length > 0 || srcArr.length > 0) {
								setTimeout(() => {
									that.drag.init()
									that.drag2.init()
								}, 500)
							}
						} else {
							that.specInfo = Object.assign({}, data)
							that.freightTemplateTxt = data.freight_template[0].template_name || ''
							that.curId = 0
							that.template_id = data.freight_template[0].template_id
							that.drag.init()
							that.drag2.init()
						}
						if (that.loadingVideo) {
							uni.showLoading({
								title: '正在上传...',
								mask: true
							})
						}
					}
				})
			},
			pTu: function(e) { //p图
				this.curId = e.detail.dragId
				var src = e.detail.spec_img
				if (src.indexOf('http:') != -1) {
					src = src.replace("http:", 'https:')
				}
				uni.navigateTo({
					url: '/pages/goods/tailoring/tailoring?src=' + src + '&img_type=' + e.detail.imgType,
				})
			}
		}
	}
</script>

<style lang="scss" src="./index.scss"></style>
<style scoped src="./index.css">

</style>
