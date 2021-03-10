<template>
	<view>
		<view class="componentSwiperBox">
		  <swiper class="componentSwiper">
		    <swiper-item v-for="(item, index) in data1" class="componentSwiperItem" :key="'data1' + index" 
					:data-url="item.ad_link" @tap.stop="navigatePage">
		      <image :src="url + item.ad_code"></image>
		    </swiper-item>
		  </swiper>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data1:{type: Array, value: [1,2,3,4,5]},
			url: {type: String, value: 'https://test.yitongwang.com'}
		},
		data() {
			return {
				
			}
		},
		methods: {
			navigatePage(e){
			  var url = e.currentTarget.dataset.url
			  if (url.indexOf('/pages/') == -1) {
			    return 
			  }
			  uni.navigateTo({ url: url });
			}
		}
	}
</script>

<style scoped src="./recommendSwiperGoods.css">

</style>
