<template>
	<view>
		<userpage @timeSelected="timeSelected" @navChange="navChange" :navType="navType" :minDate="minDate"
			:maxDate="maxDate" :dateRange2="dateRange2"></userpage>
	</view>
</template>

<script>
	import userpage from '../cpComponents/userPageComponent/userPageComponent'
	export default {
		components: {
			userpage
		},
		data() {
			return {
				navType: 'a',
				dateRange2: [], //需要传递的时间范围 默认的
				minDate: 0,
				maxDate: 0,
			}
		},
		onLoad: function(options) {
			//日历范围默认选择最近90天
			// 日历假定起始时间为2020-08-08  1596868239000
			var minTime = ((+new Date()) - (86400000 * 90))
			minTime = minTime < 1596868239000 ? minTime : 1596868239000
			var maxTime = +new Date()
			var dataRange1 = minTime < (maxTime - (86400000 * 6)) ? (maxTime - (86400000 * 6)) : minTime
			this.minDate = minTime;
			this.maxDate = maxTime;
			this.dateRange2 = [dataRange1, maxTime];
		},
		methods: {
			timeSelected(e) { //时间选择了
				console.log(e.detail)
			},
			navChange(e) {
				this.navType = e.detail.type;
			},
		}
	}
</script>

<style scoped src="./dealerPage.css">

</style>
