<template>
	<view>
		<van-search :value="value" placeholder="请输入厂家关键词" use-action-slot @change="search" focus>
			<view slot="action" @tap="submitOther">确定</view>
		</van-search>


		<view class="search-item">
			<view :focus="false" @tap="chooseCompany" class="item" :data-text="item" v-for="(item, index) in result"
				:key="'res' + index">{{item.store_name}}</view>
		</view>
		<van-dialog use-slot id="van-dialog">
			<input type="number" class="editInput" focus="true" v-model="editInputNum"></input>
		</van-dialog>
	</view>
</template>

<script>
	const app = getApp()
	var setting = app.globalData.setting;
	const request = require("../../../static/utils/request");
	export default {
		data() {
			return {
				url: setting.url,
				value: '',
				flag: true,
				result: [], //搜过得到的厂家名字
				from: '', //默认从预约仓位进入
				editInputNum: 1, //默认增加0件
				order_id: 0,
				paramsArr: [], //存放从预约仓位页面传递过来的已选择厂家名字
			}
		},
		onLoad: function(options) {
			var paramsArr = []
			var from = ''
			for (const key in options) {
				if (key == 'from') {
					from = options[key]
				}
				paramsArr.push(options[key])
			}
			this.paramsArr = paramsArr;
			this.from = from;
			if (options.order_id) {
				this.order_id = options.order_id;
			}
		},
		methods: {
			search: function(e) {
				const that = this
				var val = e.detail
				this.value = val
				if (val === '') {
					return
				}
				if (this.flag) {
					this.flag = false
					request.get(that.url + '/api/pinbao/storeAInfo', {
						data: {
							name: val
						},
						success: function(res) {
							if (res.data.status === 1) {
								that.result = res.data.result.store_info
								that.flag = true
							}
						}
					})
				}
			},
			chooseCompany: function(e) { //选择了某一个厂家之后
				var store_name = e.currentTarget.dataset.text.store_name
				if (this.paramsArr.indexOf(store_name) != -1) {
					uni.showToast({
						title: '当前厂家您已选择，请勿重复添加，您可以返回上一页，增加货物数量!',
						icon: 'none'
					})
					return
				}
				const pages = getCurrentPages()
				var i = pages.length - 2
				if (this.from == 'tions') {
					const info = [...pages[i].addFactoryTempList]
					info.push({
						manufactor_name: store_name,
						goods_number: '',
						phone: ''
					})
					pages[i].addFactoryTempList = [...info]
				} else {
					const info = [...pages[i].showChangjia]
					info.push({
						name: e.currentTarget.dataset.text.store_name,
						ischecked: true,
						number: '',
						store_phone: e.currentTarget.dataset.text.store_phone,
						store_id: e.currentTarget.dataset.text.store_id
					})
					pages[i].showChangjia = [...info]
				}
				uni.navigateBack({
					delta: 1,
				})
			},
			submitOther: function() { //自己搜索厂家时，不是联想返回的数据
				if (!this.value) {
					return uni.showToast({
						title: '厂家名字不能为空',
						icon: 'none'
					})
				}
				if (/[`~!@#$^&*()=|{}':;',\[\].<>\?~！@#￥……&*（）——|_{}【】‘；：”“""'。，、？]/.test(this.value)) {
					return uni.showToast({
						title: '请正确填写厂家名',
						icon: 'none'
					})
				}
				if (this.paramsArr.indexOf(this.value) != -1) {
					uni.showToast({
						title: '当前厂家您已选择，请勿重复添加，您可以返回上一页，增加货物数量!',
						icon: 'none'
					})
					return
				}
				const name = this.value
				const pages = getCurrentPages()
				var i = pages.length - 2
				if (this.from == 'tions') {
					let info = [...pages[i].addFactoryTempList]
					info.push({
						manufactor_name: name,
						num: 1,
						store_phone: ''
					})
					pages[i].addFactoryTempList = [...info]
				} else {
					const info = [...pages[i].showChangjia]
					info.push({
						name: name,
						ischecked: true,
						number: '',
						store_phone: 0,
						store_id: 0
					})
					pages[i]..showChangjia = [...info]
				}
				uni.navigateBack({
					delta: 1,
				})
			},
		}
	}
</script>

<style scoped src="./index.css">

</style>
