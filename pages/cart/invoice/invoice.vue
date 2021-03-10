<template>
	<view>
		<view class='receipt-category'>
			<view class='type'>发票类型</view>
			<view class='invoice'>
				<text>普通发票</text>
			</view>
			<view class='prompt'>1.开票金额不包括优惠劵和积分支付部分；</view>
			<view class='prompt'>2.开单位抬头发票时，请准确填写对应的纳税人识别号，以免影响您的发票报销；</view>
		</view>
		<view class="set-mes">
			<view class="invoice-remarks one" :style="'display:' + invoiceToggle ? 'none' : 'block'">
				<view style='display:inline-block;'>发票抬头</view>
				<radio-group class="radio-group" @change="radioTypeChange">
					<label class="radio" v-for="(item, index) in invoicesType" :key="'inv' + index">
						<radio color="#ff3636" :value="index" :checked="item.checked" />{{item.name}}
					</label>
				</radio-group>
			</view>
			<view class="invoice-remarks two" :style="'display:' + Company ? 'none' : 'block'">
				<view class="tit">单位名称</view>
				<view>
					<input type="text" @input='nameInfo' v-model="name" placeholder="请填写单位名称" />
				</view>
			</view>
			<view class="invoice-remarks three" :style="'display:' + Company ? 'none' : 'block'">
				<view class="tit">纳税人识别号</view>
				<view><input type="text" @input='numberInfo' v-model="taxpayer" placeholder="请填写纳税人识别号" /></view>
			</view>

			<view class="invoice-remarks four" :style="'display:' + invoiceToggles ? 'none' : 'block'">
				<view class="tit">发票内容</view>
				<view class='bottom'>
					<radio-group class="radio-group" @change="radioContentChange">
						<label class="radio" v-for="(item, index) in invoicesContent" :key="'ic' + index">
							<radio color="#ff3636" :value="index" :checked="item.checked" />{{item.name}}
						</label>
					</radio-group>
				</view>
			</view>
		</view>
		<button class="use-btn" @tap='submit'>确认</button>

	</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var common = require('../../../static/utils/common.js');
	export default {
		data() {
			return {
				invoicesType: [{
						name: '个人',
						checked: true
					},
					{
						name: '单位',
						checked: false
					}
				],
				invoicesContent: [{
						name: '商品明细',
						checked: false
					},
					{
						name: '商品类别',
						checked: false
					},
					{
						name: '不开发票',
						checked: true
					}
				],
				invoicesVlue: 0,
				invoicesVlues: 0,
				Company: true,
				invoiceToggle: false, //写发票抬头开关
				invoiceToggles: false, //发票内容开关
				invoice_title: '',
				taxpayer: '',
				status: false,
			}
		},
		onLoad: function(options) {
			let pages = getCurrentPages(); //当前页面
			let prevPage = pages[pages.length - 2]; //上一页面
			if (prevPage.invoice_title !== '个人') {
				this.invoicesVlue = 1;
				this.invoicesType[0].checked = false;
				this.invoicesType[1].checked = true;
				this.Company = false;
				this.invoicesType = [...this.invoicesType];
			} else {
				this.invoicesVlue = 0;
			}

			if (prevPage.invoice_desc == '商品明细') {
				this.invoicesContent[0].checked = true;
				this.invoicesContent[1].checked = false;
				this.invoicesContent[2].checked = false;
				this.invoicesVlues = 0;
			} else if (prevPage.invoice_desc == '商品类别') {
				this.invoicesContent[0].checked = false;
				this.invoicesContent[1].checked = true;
				this.invoicesContent[2].checked = false;
				this.invoicesVlues = 1;
			} else if (prevPage.invoice_desc == '不开发票') {
				this.invoicesContent[0].checked = false;
				this.invoicesContent[1].checked = false;
				this.invoicesContent[2].checked = true;
				this.invoiceToggle = true;
				this.Company = true;
				this.invoicesVlues = 2;
			}
			this.name = prevPage.invoice_title != '个人' ? prevPage.invoice_title : '';
			this.invoice_title = prevPage.invoice_title != '个人' ? prevPage.invoice_title : '';
			this.taxpayer = prevPage.taxpayer;
		},
		methods: {
			radioTypeChange: function(e) {
				this.invoicesVlue = e.detail.value;
				this.status = true;
				if (e.detail.value == 1) {
					this.Company = false;
				} else {
					this.Company = true;
				}
			},
			radioContentChange: function(e) {
				this.invoicesVlues = e.detail.value;
				this.status = true;
				if (e.detail.value == 2) {
					this.invoiceToggle = true;
					this.Company = true;
				} else {
					this.invoiceToggle = false;
					this.invoicesVlue == 1 && this.Company = false;
				}
			},
			nameInfo: function(e) {
				this.status = true;
			},
			numberInfo: function(e) {
				this.status = true;
			},
			submit: function() {
				var that = this;
				var invoice_desc = '';
				var title = that.invoicesVlue == 1 ? that.invoice_title : '个人';
				if (!that.status) {
					uni.navigateBack({
						delta: 1
					})
					return;
				}

				if (that.invoicesVlue == 1 && that.invoicesVlues != 2) {
					if (!that.invoice_title) {
						app.confirmBox('请输入单位名称');
						return false;
					}
					if (!that.taxpayer) {
						app.confirmBox('请输入纳税人识别号');
						return false;
					}

					var orgCode = that.taxpayer.substring(6, 9);
					var check = common.orgcodevalidate(orgCode);
					if (!check) {
						app.confirmBox('请输入正确的纳税人识别号');
						return false;
					}

					if ((that.taxpayer.length == 15) || (that.taxpayer.length == 18) || (that.taxpayer.length == 20)) {
						
					} else {
						app.confirmBox('请输入正确的纳税人识别号');
						return false;
					}
				}

				if (that.invoicesVlues == 0) {
					invoice_desc = '商品明细';
				} else if (that.invoicesVlues == 1) {
					invoice_desc = '商品类别';
				} else {
					invoice_desc = '不开发票';
				}

				var postData = {
					invoice_title: title,
					taxpayer: that.taxpayer,
					invoice_desc: invoice_desc
				}
				request.post('/api/cart/save_invoice', {
					data: postData,
					successReload: true,
					success: function(res) {
						if (invoice_desc == '不开发票') {
							var text = invoice_desc;
						} else {
							var text = '纸质 ( ' + title + '-' + invoice_desc + ' )';
						}

						let pages = getCurrentPages(); //当前页面
						let prevPage = pages[pages.length - 2]; //上一页面
						//直接给上移页面赋值 
						prevPage.text = text;
						prevPage.invoice_title = title;
						prevPage.taxpayer = that.taxpayer;
						prevPage.invoice_desc = invoice_desc;
						uni.navigateBack({
							delta: 1
						})
					},
				});
			},
		}
	}
</script>

<style scoped src="./invoice.css">

</style>
