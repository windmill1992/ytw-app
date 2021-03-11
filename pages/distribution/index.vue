<template>
	<view>
		<view :hidden="dataLength == 0" class="distribution-content">
			<view class="control-all">
				<checkbox-group>
					<label>
						<checkbox @tap="checkAll" :checked="isAllChecked" :hidden="true"></checkbox>
						<text> </text>
					</label>
				</checkbox-group>
				<text class="aaalll" :hidden="true">全选</text>
				<text>批量加价:</text>
				<view class="inputBoxA" style="margin-left: 200rpx;">
					<text class="jiajian ml400" @tap="subAll">-</text>
					<input type="digit" v-model="inputAllValue"></input>
					<text class="jiajian" @tap="addAll">+</text>
				</view>
				<text space="ensp" class="jiajianIntro"> 元/件</text>
			</view>

			<view class="distribution-item" v-for="(item, index) in mapGoods" :key="'mg' + index">
				<view class="choose-single">
					<label>
						<checkbox :checked="chengkOneState[index]" @tap="checkItem" :data-index="index" :hidden="true">
						</checkbox>
					</label>
				</view>
				<view class="item-img">
					<image @tap.stop="preImg" :data-src="item.image" :src="item.image"></image>
					<image @tap.stop="preImg" :data-src="item.image" src="../../static/images/preImage.png"
						class="fangda"></image>
				</view>
				<view class="txt">
					<view><text>{{item.spec_item[1].s_name}}:</text><text
							class="color333">{{item.spec_item[1].item}}</text></view>
					<view><text>拿货价格:</text><text class="color333">{{item.each_hand_unit_price}}</text></view>
					<view><text>{{pramas[index][0].s_name}}:</text><text
							class="color333">{{pramas[index][0].item}}</text></view>
					<view class="ctrl">
						<view class="inputBoxA">
							<text class="jiajian" @tap="subOne" :data-index="index">-</text>
							<input type="digit" @input="inputOne" v-model="item.newPrice"></input>
							<text class="jiajian" @tap="addOne" data-index="{{index}}">+</text>
						</view>
						<text class="item-price-intro" space="ensp"> 元/件</text>
					</view>
				</view>
			</view>
			<button hover-class="none" class="makesure" @tap.stop="submitGoods"><text space="ensp">确 定</text></button>
		</view>

		<van-popup :show="imageShow" @close="onImageClose" @click-overlay="onImageClose">
			<image style="width:750rpx;height:750rpx;" :src="imgSrc"></image>
		</van-popup>
	</view>
</template>

<script>
	export default {
		var request = require('../../static/utils/request');
		data() {
			return {
				dataLength: 0,
				isAllChecked: false,
				chengkOneState: [],
				pramas: [],
				mapGoods: [],
				inputAllValue: 1,
				oldPrice: [],
				goods_id: '',
				imageShow: false,
				imgSrc: '',
			}
		},
		onLoad: function(options) {
			const that = this
			this.goods_id = options.good_id
			this.storeId = options.store_id
			request.get('/api/Distribut/getGoodsPriceInfo', {
				data: {
					goods_id: options.good_id,
				},
				failRollback: true,
				success: function(res) {
					const {
						result
					} = res.data
					const length = result.length
					const oldPrice = result.map((item) => {
						return item.price
					})
					const chengkOneState = result.map(() => {
						return false
					})
					const spec_item = result.map((item) => {
						return item.spec_item
					})
					var mapGoods1 = [...result]
					var mapGoods = mapGoods1.map((item) => {
						item.isChecked = true
						item.newPrice = Number(item.each_hand_unit_price)
						item.price = Number(item.each_hand_unit_price)
						item.value = Number(item.each_hand_unit_price)
						if (item.spec_item[0].s_name == "货号颜色") {
							item.spec_item = item.spec_item.reverse()
						}
						return item
					})
					that.pramas = spec_item
					that.dataLength = length
					that.chengkOneState = chengkOneState
					that.mapGoods = mapGoods
					that.oldPrice = oldPrice
				}
			});
		},
		methods: {
			checkAll: function() {
				this.isAllChecked = !this.isAllChecked
				var arr2 = this.chengkOneState.map(() => this.isAllChecked)
				this.chengkOneState = [...arr2]
			},
			checkItem: function(e) {
				var current = e.currentTarget.dataset.index
				var arr3 = this.chengkOneState.map((item, index) => {
					return index == current ? !item : item
				})
				var map1 = [...this.mapGoods]
				map1[current].isChecked = !map1[current].isChecked
				this.chengkOneState = [...arr3]
				this.mapGoods = [...map1]
				if (arr3.filter((item) => {
						return item == true
					}).length === this.dataLength) {
					this.isAllChecked = true
				}
				this.chengkOneState.forEach((item) => {
					if (!item) {
						this.isAllChecked = false
					}
				})
			},
			// 点击全部加减部分处理
			subAll: function() {
				var subMapGoods1 = [...this.mapGoods]
				subMapGoods1.forEach((item) => {
					if (item.price > item.newPrice) {
						return uni.showToast({
							title: '分销价格，不能低于拿货价格',
							icon: 'none',
							duration: 1500
						})
					}
					item.newPrice = (item.newPrice - Number(this.inputAllValue)).toFixed(2)
				})
				this.mapGoods = [...subMapGoods1]
			},
			addAll: function() {
				var subMapGoods2 = [...this.mapGoods]
				subMapGoods2.forEach((item) => {
					item.newPrice = (item.newPrice - 0 + Number(this.inputAllValue)).toFixed(2)
				})
				this.mapGoods = [...subMapGoods2]
			},
			subOne: function(e) {
				var index = e.currentTarget.dataset.index
				if (this.mapGoods[index].newPrice < this.mapGoods[index].price) {
					uni.showToast({
						title: '分销价格，不能低于拿货价格',
						icon: "none",
						duration: 1500
					})
					return
				}
				var subMapGoods3 = [...this.mapGoods]
				subMapGoods3[index].newPrice = subMapGoods3[index].newPrice - 1
				this.mapGoods = [...subMapGoods3]
			},
			addOne: function(e) {
				var index = e.currentTarget.dataset.index
				var subMapGoods3 = [...this.mapGoods]
				subMapGoods3[index].newPrice = Number(subMapGoods3[index].newPrice) + 1
				this.mapGoods = [...subMapGoods3]
			},
			inputOne: function(e) {
				this.mapGoods = [...mapGoods]
			},
			submitGoods: function() {
				const that = this
				var isC = 0
				var params = []
				this.mapGoods.forEach((item, index) => {
					if (item.newPrice < item.price) {
						return uni.showToast({
							title: '销售价必须大于拿货价',
							duration: 1000,
							icon: "none"
						})
					}
				})
				this.mapGoods.forEach((item, index) => {
					params.push({
						item_id: item.id,
						cost: item.price,
						price: item.newPrice * item.spec_item[0].item,
						add_price: item.newPrice - item.price
					})
				})

				request.post('/api/Distribut/add_goods', {
					data: {
						goods_ids: that.goods_id,
						terminal: "miniapp",
						item_id: JSON.stringify(params)
					},
					success: function(res) {
						if (res.data.status == 1) {
							uni.showToast({
								title: '分销成功，已展示到您的店铺，快去查看吧！',
								mask: true,
								duration: 1500,
								icon: "success"
							})
							uni.showModal({
								title: '分销成功',
								confirmText: '前往店铺',
								cancelText: '返回',
								content: '已展示到您的店铺，快去查看吧！',
								success(res) {
									if (res.confirm) {
										uni.redirectTo({
											url: '/pages/distribut0/shop/shop',
										})
									} else if (res.cancel) {
										uni.navigateBack({
											delta: 1,
										})
									}
								}
							})
						} else {
							uni.showToast({
								title: '分销失败！',
								mask: true,
								duration: 1500,
								icon: "none"
							})
						}
					}
				});
			},
			back1: function() {
				uni.navigateBack({
					delta: 1,
				})
			},
			preImg: function(e) {
				var src = e.currentTarget.dataset.src
				this.imgSrc = src
				this.imageShow = true
			},
			onImageClose: function() {
				this.imageShow = false
			},
		}
	}
</script>

<style scoped src="./index.css">

</style>
