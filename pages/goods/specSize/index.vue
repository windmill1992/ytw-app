<template>
	<view>

		<view class="sortBtnBox">
			<text space="ensp" class="fll col888">货号颜色 <text v-if="showSortTipsTxt" class="col18">长按拖拽排序</text></text>
			<text class="sortBtn flr" @tap.stop="triggleSort">{{ btnTxt }}</text>
		</view>
		<view class="dragTips">
			<text class="dragTipsInfo"></text>
		</view>
		<drag id="drag" @click="itemClick" @change="change" @sortend="sortEnd" @scroll="scroll"
			:extra-nodes="extraNodes" :list-data="listData" :columns="size" :scroll-top="scrollTop" :top-size="110"
			@del="delItem" @editSpec="editSpec" @changeImg="changeImg" @pTu="pTu" spec del change
			:bottom-size="isIphoneX ? 380 : 300">
			<view slot="plus" class="plus-wrap" @tap="add">
				<view class="plus"></view>
				<view class="imageNumtips">添加规格</view>
			</view>
		</drag>

		<view class="sortBtnBox" style="margin-top:30rpx;">
			<text space="ensp" class="fll col888">每手几件</text>
		</view>
		<view class="num2InputBox rela" style="height:75rpx;line-height:75rpx;">
			<input class="num2Input" type="number" :value="specSize" @input="specSizeInput" placeholder="请输入"></input>
			<text style="margin-left:170rpx;color:#000;">件/手</text>
		</view>
		<!-- 映射部分 -->
		<view class="attrTitle col888">价格及库存</view>

		<view class="priceSum">
			<view class="priceSumItem" v-for="(item, index) in listData" :key="'data'+ index">
				<view
					:style="'color:' + item.spec_name ? '#000' : 'red' +';text-align: center;font-weight:' + item.spec_name ? '600' : '300'">
					{{ item.spec_name || '未填写' }}
				</view>
				<view class="itemInfoBox">
					<view class="preImgTips" style="color:#555;">图片预览</view>
					<view class="priceSumItemImg">
						<image :src="item.spec_img" :data-img="item.spec_img" @tap.stop="changeImg2" data-from="map">
						</image>
					</view>
					<view class="xianxianxian rela" style="color:#555;"></view>
					<view class="switch">
						<view class="switchHasGoods">
							<view style="color:#555;">有货
								<van-icon name="checked" v-if="item.hasGoods" color="#18c2ba" />
							</view>
							<van-switch size="25" :checked="item.hasGoods" active-color="#18c2ba"
								@change="onHasGoodsChange" :data-id="item.dragId" />
						</view>
						<view class="switchHasGoods">
							<view style="color:#555;">无货
								<van-icon name="checked" v-if="!item.hasGoods" color="#eb4079" />
							</view>
							<van-switch size="25" :checked="!item.hasGoods" active-color="#eb4079"
								@change="onHasGoodsChange" :data-id="item.dragId" />
						</view>
					</view>
				</view>
				<view class="priceSumInputs">
					<view class="rela" style="flex:1.8;">当前库存 <input class="abs mapSpecInput inputAfter"
							placeholder="请输入" maxlength="4" placeholder-style="color:#999;" :disabled="!item.hasGoods"
							type="number" :value="item.store_count" @input="editItemInputChange" data-type="sum"
							:data-id="item.dragId"></input>
					</view>
					<view class="xianxianxian2 rela" style="flex:0.4;color:#eaeaea;"></view>
					<view class="rela" style="flex:1.5;">每件价格
						<text class="colf10215" style="margin-left:29rpx;">￥</text>
						<input
							style="right:-40rpx;width:105rpx;right: -22px;padding:0;padding-left: 10rpx;text-align: left;"
							class="abs mapSpecInput" maxlength="6" type="digit" placeholder-style="color:#999;"
							placeholder="请输入" :value="item.price" @input="editItemInputChange" data-type="price"
							:data-id="item.dragId"></input>
					</view>
				</view>
			</view>
		</view>

		<!-- 确定 -->
		<view class="sureSub" @tap.stop="sureSubmit" :style="'margin-bottom:' + isiphoneX ? '25rpx' : '15rpx'">确 定
		</view>


		<!-- 空标签 -->
		<view id="j_page" style="height:1rpx;"></view>
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
				isiphoneX: uni.getStorageSync('isiphoneX') || false,
				size: 3,
				listData: [],
				extraNodes: [{
					type: "after",
					dragId: "plus",
					slot: "plus",
					fixed: true
				}],
				pageMetaScrollTop: 0,
				scrollTop: 0,
				curId: 0, //编辑换图的id
				btnTxt: '排序', //排序按钮文字
				showSortTipsTxt: false,
				specSize: '', //每手几件
				goods_id: 0, //默认操作的商品id是0
				isFirst: true,
			}
		},
		onPageScroll: function(e) {
			this.scrollTop = e.scrollTop
		},
		onLoad: function(options) {
			this.drag = this.selectComponent('#drag');
			this.goods_id = options.goods_id ? options.goods_id : 0;
			this.getSpecItem();
		},
		onShow: function() {
			if (this.isFirst == true) {
				this.isFirst = false
			} else {
				this.drag.init()
			}
		},
		methods: {
			sortEnd: function(e) {
				this.listData = [...e.detail.listData]
			},
			change: function(e) {
				// console.log("change", e.detail.listData)
			},
			sizeChange: function(e) {
				uni.pageScrollTo({
					scrollTop: 0
				})
				this.size = e.detail.value;
				this.drag.init();
			},
			itemClick: function(e) {
				// console.log(e);
			},
			toggleFixed: function(e) {
				let key = e.currentTarget.dataset.key;
				this.listData[key].fixed = !this.listData[key].fixed;
				this.listData = [...listData];
				this.drag.init();
			},
			add: function(e) {
				if (e) {
					this.curId = '';
					if (this.listData.length >= 120) {
						return uni.showToast({
							title: '商品规格最多添加120种',
							icon: 'none'
						})
					}
				}
				var that = this
				uni.showActionSheet({
					itemList: ['相册选取', '拍照'],
					success: function(res) {
						var i = res.tapIndex
						if (i === 0) {
							uni.chooseImage({ //相册
								count: 120 - that.listData.length,
								sizeType: 'compressed',
								sourceType: ['album'],
								success: function(res) {
									for (let i = 0; i < res.tempFilePaths.length; i++) {
										that.uploadFile(res.tempFilePaths[i])
									}
								}
							})
						} else {
							uni.chooseImage({ //相机
								count: 1,
								sizeType: "compressed",
								sourceType: ['camera'],
								success: function(res) {
									that.uploadFile(res.tempFilePaths[0])
								}
							})
						}
					}
				})
			},
			uploadFile: function(src) { //向服务器传图
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
						if (that.curId != 0) { // 有id 则是换图
							let listData = that.listData
							var index = listData.findIndex((item) => {
								return item.dragId == that.curId
							})
							if (index == -1) {
								return
							}
							listData[index].spec_img = result.result
							that.listData = [...listData]
							that.curId = 0
							that.drag.init();
							return
						}
						let listData = that.listData;
						listData.push({
							dragId: Math.random() + '',
							spec_name: "",
							spec_img: result.result,
							fixed: false,
							hasGoods: true,
							store_count: 500,
							price: '',
							isSpec: true,
							imgType: 'a'
						});
						that.listData = [...listData]
						that.$nextTick(function(){
							that.drag.init();
						})
					}
				})
			},
			scroll: function(e) {
				this.pageMetaScrollTop = e.detail.scrollTop
			},
			delItem: function(e) { //删除
				let listData = this.listData
				var index = listData.findIndex((item) => {
					return item.dragId == e.detail.id
				})
				listData.splice(index, 1)
				this.listData = [...listData]
				this.drag.init();
			},
			editSpec: function(e) { //编辑规格
				var v = e.detail.value.trim()
				var id = e.detail.id
				let listData = this.listData
				var num = 0
				var index = listData.findIndex((item) => {
					return item.dragId == id
				})
				listData.forEach((item, index2) => {
					if (item.spec_name == v && index != index2) {
						num++
					}
				})
				if (num > 0) {
					v = ''
					uni.showToast({
						title: '规格名称不能重复!',
						icon: 'none'
					})
				}
				listData[index].spec_name = v
				this.listData = [...listData]
				this.drag.init();
			},
			changeImg: function(e) { //换图
				var id
				if (e.currentTarget.dataset.from) { //判断是从上面点击的换图还是下面点击的
					id = e.currentTarget.dataset.id
				} else {
					id = e.detail
				}
				this.curId = id
				this.add()
			},
			changeImg2: function(e) { //
				uni.previewImage({
					urls: [e.currentTarget.dataset.img],
				})
			},
			onHasGoodsChange: function(e) { //更改是否有货
				var id = e.currentTarget.dataset.id
				let listData = this.listData
				var index = listData.findIndex((item) => {
					return item.dragId == id
				})
				listData[index].hasGoods = !listData[index].hasGoods
				listData[index].store_count = listData[index].hasGoods ? listData[index].store_count : 0
				this.listData = [...listData]
			},
			editItemInputChange: function(e) { //编辑库存 价格
				var id = e.currentTarget.dataset.id
				var type = e.currentTarget.dataset.type
				let listData = this.listData
				var index = listData.findIndex((item) => {
					return item.dragId == id
				})
				if (type == 'sum') {
					if (e.detail.value < 0 && listData[index].hasGoods) {
						uni.showToast({
							title: '有货的商品，库存至少为1',
							icon: 'none'
						})
						listData[index].store_count = 1
					} else {
						listData[index].store_count = e.detail.value
					}
				} else {
					if (e.detail.value < 0) {
						uni.showToast({
							title: '商品价格不能低于0',
							icon: 'none'
						})
						listData[index].price = 0
					} else {
						listData[index].price = e.detail.value
					}
				}
				this.listData = [...listData]
			},
			sureSubmit: function() { //确定提交
				var listData = this.listData
				var indexA = ''
				var flag = true
				listData.forEach((item, index) => {
					if (item.store_count == '') {
						item.store_count = 0
					}
					if (item.price == '' || item.spec_img == '' || item.spec_name == '' || item.spec_img.trim() == '' || item.spec_name.trim() == '') {
						indexA = index
						flag = false
					}
					if (item.store_count - 0 == 0 && item.hasGoods) {
						flag = false
						indexA = index
					}
				})
				if (!flag) {
					return uni.showToast({
						title: '请将第' + (indexA - 0 + 1) + '项商品规格填写完整',
						// title: '请将商品规格填写完整',
						icon: 'none'
					})
				} else {
					// 根据需求  整理需要提交的数据
					if (this.specSize == '' || this.specSize > 12 || this.specSize < 1) {
						return uni.showToast({
							title: '请正确填写每手几件 1~12之间',
							icon: 'none'
						})
					}
					this.addSpecItem(JSON.stringify(listData))
				}
			},
			// 提交确定的请求额外抽离出来
			addSpecItem: function(spec_data) {
				var that = this
				request.post(that.url + '/api/Store/addSpecItem', {
					data: {
						spec_data: spec_data,
						goods_id: that.goods_id,
						spec_ms: that.specSize
					},
					success: function(res) {
						if (res.data.status == 1) {
							uni.navigateBack({
								delta: 1,
							})
						}
					}
				})
			},
			triggleSort: function() { //排序/完成切换
				var listData = this.listData
				if (listData.length < 1) {
					return
				}
				this.showSortTipsTxt = this.btnTxt == '排序' ? true : false
				this.btnTxt = this.btnTxt == '排序' ? '完成' : '排序'
			},
			specSizeInput: function(e) { //每手几件
				var num = e.detail.value
				if (num == '') {
					this.specSize = num
					return
				}
				if (isNaN(num)) {
					uni.showToast({
						title: '每手几件必须为正整数1~12之间',
						icon: 'none'
					})
					num = 1
				}
				if (num < 0) {
					num = 1
					uni.showToast({
						title: '每手几件最低为1',
						icon: 'none'
					})
				} else if (num > 12) {
					num = 12
					uni.showToast({
						title: '每手几件最大为12',
						icon: 'none'
					})
				}
				this.specSize = Math.ceil(num)
			},
			getSpecItem: function() { //获取已有的规格数据
				var that = this
				request.get(that.url + '/api/Store/getSpecItem', {
					data: {
						goods_id: that.goods_id
					},
					success: function(res) {
						var listData = res.data.data.color || []
						listData.forEach((item, index) => {
							item.dragId = Math.random() + ''
							item.isSpec = true
							item.fixed = false
							item.hasGoods = item.store_count > 0 ? true : false
							item.spec_name = item.item_value
						})
						that.listData = [...listData]
						that.specSize = res.data.data.msjj || ''
						that.$nextTick(function(){
							that.drag.init()
						})
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
					url: '/pages/goods/tailoring/tailoring?src=' + src + '&img_type=c',
				})
			},
		}
	}
</script>

<style scoped src="./index.css">

</style>
