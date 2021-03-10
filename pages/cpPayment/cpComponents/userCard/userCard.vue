<template>
	<view>
		<template name="usercard">
		  <view class="userCarc">
		    <view class="Leftname">{{ type == 'a' ? '客户名称' : '批发商名称' }}</view>
		    <view class="userCarcInfo">
		      <view class="userCarcInfoT">
		        <text class="userName">{{ '张四' }}</text>
		        <text class="userLever">{{ '散客' }}</text>
		        <text class="userTel">{{ '18978788787' }}</text>
		        <uni-icons name="more-o" size="50rpx" color="#18c2ba" />
		      </view>
		      <view class="userCarcInfoB">
		        <text class="preSurplus">{{ '之前结余' }}:￥{{6565}}</text>
		        <text class="preBuyTime">上次下单:{{ '3天前' }}</text>
		      </view>
		    </view>
		    <view class="RightOpera">
		      <text>{{'已认证'}}</text>
		      <text>{{' '}}</text>
		    </view>
		  </view>
		</template>
		
		<template name="goods">
		  <view class="goodsContent">
		    <view class="goodsLabel">订单明细</view>
		    <view class="goodsItem{{index > 0 ? ' goodsBorder' : '' }}" v-for="(item, index) in 4" :key="index" >
		      <image class="goodsImage" src="http://yitongwanghuabei3.oss-cn-zhangjiakou.aliyuncs.com/public/upload/store/1270/goods_album/5221101ad502a60a95060d55aa1a8b3a.jpg?x-oss-process=image/resize,m_pad,h_240,w_240"></image>
		      <view class="goodsL">
		        <view><text class="fs32">货号:</text>{{ '878-asd' }}</view>
		        <view><text style="font-weight:bold;color:#444;">规格:</text><text class="col666">{{ '5件/手' }}</text></view>
		        <view class="col666">{{'12.3'}}元X{{'45'}}件={{'123123'}}元</view>
		      </view>
		      <view class="changesinglePrice">改单价</view>
		    </view>
		  </view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped src="./userCard.css">

</style>
