<template>
	<view>
		<view class="container">
			<view class="address-box" v-for="(item, index) in addresses" :key="'addr' + index">
				<view @tap.stop="selectAddress" :data-item="item" class="topbox">
					<view class="address-user">
						<view class="user-name">{{item.consignee}}</view>
					</view>
					<view class="address-info">
						<view class="mobile">{{item.mobile}}</view>
					</view>
					<view class="address">{{item.province_name}} {{item.city_name}} {{item.district_name}}
						{{item.twon_name}} {{item.address}}
					</view>
				</view>
				<view class="footbox">
					<view class="leftbox" :hidden="true">
						<view @tap="setDefault" :data-obj="item" class="choosebox">
							<image v-if="item.is_default" src="../../../static/images/ischeck.png"></image>
							<image v-else src="../../../static/images/nocheck.png"></image>
						</view>设为默认
					</view>
					<view @tap="editAddress" :data-id="item.address_id" class="rightbox">
						<image class="editimg" src="../../../static/images/address_edit.png"></image>
						编辑
					</view>
				</view>
			</view>
			<navigator class="address-create" url="/pages/user/add_address/add_address">
				<view class="create-btn">+新建地址</view>
			</navigator>
		</view>

	</view>
</template>

<script>
	var app = getApp();
	var request = require('../../../static/utils/request');
	export default {
		data() {
			return {
				url: app.globalData.setting.url,
				addresses: null, //请求的地址列表
				operate: null, //操作类型，select：订单选择地址操作，其他：普通展示
			}
		},
		onLoad: function(options) {
			this.operate = options.operate;
		},
		onShow: function() {
			this.requestAddressList();
		},
		onPullDownRefresh: function() {
			this.requestAddressList();
		},
		methods: {
			requestAddressList: function() {
				var that = this;
				request.get(that.url + '/api/user/getAddressList', {
					success: function(res) {
						that.addresses = res.data.result;
						uni.stopPullDownRefresh();
					}
				});
			},
			/** 修改地址 */
			editAddress: function(e) {
				var address = this.getAddressData(e.currentTarget.dataset.id);
				var params = '';
				for (var item in address) {
					params += (params.length != 0 ? '&' : '?') + (item + '=' + address[item]);
				}
				params && uni.navigateTo({
					url: "/pages/user/add_address/add_address" + params
				});
			},
			/** 填写订单(商品详情)的时候可触发选择地址 */
			selectAddress: function(e) { //选择了地址后  进行处理  返回上一页
				console.log(e.currentTarget.dataset.item)
				var d = e.currentTarget.dataset.item
				const pages = getCurrentPages()
				const i = pages.length - 2
				pages[i].defaultInfo.receipt_name = d.consignee
				pages[i].defaultInfo.receipt_mobile = d.mobile
				pages[i].defaultInfo.receipt_address = `${d.province_name} ${d.city_name} ${d.district_name} ${d.address}`
				pages[i].defaultInfo = Object.assign({}, pages[i].defaultInfo)
				uni.navigateBack({
					delta: 1
				})
			},
			/** 由addressId获取地址数据 */
			getAddressData: function(addressId) {
				var addresses = this.addresses;
				for (var idx in addresses) {
					if (addresses[idx].address_id == addressId) {
						break;
					}
				}
				if (!idx) {
					return {};
				}
				return addresses[idx];
			},
			setDefault: function(e) {
				var that = this
				var address = e.currentTarget.dataset.obj
				var id = address.address_id
				address.is_default = !address.is_default
				var is_default = address.is_default
				address.is_default = Number(address.is_default);
				request.post('/api/user/addAddress', {
					data: address,
					success: function(res) {
						that.addresses.forEach(function(item, index) {
							item.is_default = 0
						})
						that.addresses.forEach(function(item, index) {
							if (item.address_id == id) {
								item.is_default = is_default
							}
						})
						that.addresses = [...this.addresses]
					}
				});
			}
		}
	}
</script>

<style scoped src="./address_list.css">

</style>
