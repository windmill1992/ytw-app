<template>
	<view>
		<view class="titleBox rela">
			<view class="titleName">
				<view :style="'color:' + curLevel ==1 ? '#18c2ba' : ''" @tap="chooseTitle" data-type="1">
					{{ name1 || '一级分类' }}</view>
				<view :style="'color:' + curLevel ==2 ? '#18c2ba' : ''" @tap="chooseTitle" data-type="2">
					{{ name2 || (curLevel ==2 ? (name2 || '二级分类') : '') }}</view>
				<view :style="'color:' + curLevel ==3 ? '#18c2ba' : ''" @tap="chooseTitle" data-type="3">
					{{ name3 || (curLevel ==3 ? (name3 || '三级分类') : '') }}</view>
			</view>
			<view class="titleBorder abs" :style="'left:' + borderLeft">
				<view></view>
			</view>
		</view>
		<view class="categoryBox">
			<van-cell :title="item.name" is-link @click="chooseCate" v-for="(item, idnex) in CategoryList1"
				:key="'cat' + index" :data-level="item.level" :data-id="item.id" :data-name="item.name" />
		</view>
	</view>
</template>

<script>
	var request = require("../../../static/utils/request");
	var app = getApp();
	var setting = app.globalData.setting;
	export default {
		data() {
			return {
				url: setting.url,
				borderLeft: 0,
				CategoryList1: [],
				pId1: 0,
				pId2: 0,
				pId3: 0,
				name1: '',
				name2: '',
				name3: '',
				curLevel: 1
			}
		},
		onLoad: function(options) {
			var id = options.id3
			if (id != 0) { //不是

			}
			this.getCategoryList(this.pId1)
		},
		methods: {
			chooseTitle: function(e) {
				var type = e.currentTarget.dataset.type
				if (type > this.curLevel) {
					return
				}
				var left = (type - 1) * 33.33 + '%'
				if (this.borderLeft == left) {
					return
				}
				this.borderLeft = left
				if (type == 1) {
					this.name1 = ''
					this.name2 = ''
					this.name3 = ''
					this.curLevel = 1
					this.pId2 = 0
					this.pId3 = 0
					this.getCategoryList(0)
				} else if (type == 2 && this.pId1 != 0) {
					this.name3 = ''
					this.curLevel = 2
					this.pId3 = 0
					this.getCategoryList(this.pId1)
				}
			},
			chooseCate: function(e) {
				var id = e.currentTarget.dataset.id
				var level = e.currentTarget.dataset.level
				var name = e.currentTarget.dataset.name
				if (level == 1) {
					this.borderLeft = level * 33.33 + '%'
					this.pId1 = id
					this.name1 = name
					this.curLevel = 2
					this.getCategoryList(id)
				} else if (level == 2) {
					this.borderLeft = level * 33.33 + '%'
					this.pId2 = id
					this.name2 = name
					this.curLevel = 3
					this.getCategoryList(id)
				} else if (level == 3) {
					this.name3 = name
					this.pId3 = id
					var prevPage = null
					let pages = getCurrentPages();
					if (pages.length >= 2) {
						prevPage = pages[pages.length - 2];
					} else {
						return
					}
					prevPage.cat_id1 = this.pId1
					prevPage.cat_id2 = this.pId2
					prevPage.cat_id3 = id
					prevPage.step = 1
					prevPage.categoryValue = name
					uni.navigateBack()
				}
			},
			getCategoryList: function(id) { // 获取1级
				var that = this
				request.get(that.url + '/api/Store/addStepOne', {
					data: {
						parent_id: id
					},
					success: function(res) {
						that.CategoryList1 = [...res.data.data]
					}
				})
			},
		}
	}
</script>

<style scoped src="./setAttr.css">

</style>
