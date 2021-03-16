<template>
	<view>
		<!-- 选择地址弹框  -->
		<view :hidden="!data.showCategoryModal">
				<view class="cover-layer" @tap="closeCategoryModal"></view>
				<view class="categories">
						<template v-if="data.currentArea < 2">
								<view class="category" v-for="(item, index) in data.categories" :key="'cat' + index" :data-id="item.id" 
										:data-name="item.mobile_name" @tap="openCategoryModal">{{item.mobile_name}}</view>
						</template>
						<template v-if="data.currentArea == 2">
								<button class="confirm-btn" @tap="openCategoryModal" data-type='confirm'>确定</button>
								<checkbox-group @change="categoryCheckboxChange">
										<view class="category" v-for="(item, index) in data.categories" :key="'cat2' + index" 
											:data-id="item.id" :data-name="item.mobile_name">
												<checkbox color="#ff3b3b" :value="item.id + ',' + item.mobile_name"/>{{item.mobile_name}}
										</view>
								</checkbox-group>
						</template>
				</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			data: {type: Object, value: {}},
		},
		data() {
			return {
				
			}
		},
		methods: {
			openCategoryModal: function() {
				this.$emit('openCategoryModal');
			},
			closeCategoryModal: function() {
				this.$emit('closeCategoryModal');
			},
			categoryCheckboxChange: function(e) {
				this.$emit('categoryCheckboxChange', e);
			},
		}
	}
</script>

<style scoped src="./category.css">

</style>
