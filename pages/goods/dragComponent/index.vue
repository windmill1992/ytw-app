<template>
	<view>
		<view class="item-wrap" :style="'height:' + temWrapHeight + 'px;'">
			<view
				:class="'item' + cur == index ? ' cur' : '' + curZ == index ? ' zIndex' : '' + itemTransition && index !== cur ? ' itemTransition' : '' + item.fixed ? ' fixed' : ''"
				v-for="(item, index) in list" :key="id" :data-key="item.sortKey" :data-index="index"
				:style="'transform: translate3d(' + index === cur ? tranX + 'px' : item.tranX + ',' + index === cur ? tranY + 'px' : item.tranY + ',' + '0);width: ' + 100 / columns + '%'"
				@tap="itemClick" @longpress="longPress" @touchmove.stop="dragging ? 'touchMove' : ''"
				@touchend.stop="dragging ? 'touchEnd' : ''">

				<view v-if="columns > 1 && item.extraNode" class="info">
					<view class="info__item">
						<slot :name="item.slot"></slot>
					</view>
				</view>
				<view v-else-if="columns > 1 && !item.extraNode" class="info">
					<view class="info__item"
						:style="'border:' + (spec || item.extraNode) ? 'none' : '1px solid #18c2ba'">
						<image class="image" :src="item.data.spec_img"
							:style="'border:' + spec ? '1px solid #18c2ba' : 'none'" @tap.stop="pTu" :data-info="item"
							mode="aspectFit"></image>
					</view>
				</view>
				<view class="iinnppuutt" v-if="spec && !item.extraNode"
					style="box-sizing: border-box;padding: 0 10rpx;">
					<input class="itemInput" placeholder="请输入 货号-颜色" placeholder-class="specNamePlace" :data-info="item"
						:value="item.data.spec_name" @blur="editSpec" maxlength="10"></input>
				</view>
				<view v-if="!item.extraNode"
					:style="'margin-top:' + spec? '' : '13rpx' + ';width:' + spec ? '216rpx' : '156rpx'" @tap.stop="del"
					:data-info="item" :class="spec ? 'delItem' : 'delItem2'">
					删除
				</view>
				<view v-if="!item.extraNode" class="changeImg" :data-info="item"
					:style="'top:' + spec? '5rpx' : '-2rpx' + ';right:' + spec ? '-1rpx' : '-2rpx'"
					@tap.stop="changeImg">换</view>
			</view>
		</view>

	</view>
</template>

<script>
	const IsOutRange = (x1, y1, x2, y2, x3, y3) => {
		return x1 < 0 || x1 >= y1 || x2 < 0 || x2 >= y2 || x3 < 0 || x3 >= y3
	};

	/**
	 * 版本号比较
	 */
	const compareVersion = (v1, v2) => {
		v1 = v1.split('.')
		v2 = v2.split('.')
		const len = Math.max(v1.length, v2.length)

		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}

		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])

			if (num1 > num2) {
				return 1
			} else if (num1 < num2) {
				return -1
			}
		}

		return 0
	}
	export default {
		props: {
			extraNodes: {
				type: Array,
				value: []
			}, // 额外节点
			listData: {
				type: Array,
				value: []
			}, // 数据源
			columns: {
				type: Number,
				value: 1
			}, // 列数
			topSize: {
				type: Number,
				value: 0
			}, // 顶部高度
			bottomSize: {
				type: Number,
				value: 0
			}, // 底部高度
			spec: {
				type: Boolean,
				value: false
			}, // 是否是规格页面
			del: {
				type: Boolean,
				value: false
			}, // 是否显示删除
			delx: {
				type: Boolean,
				value: false
			}, // 是否展示右上角删除  X
			change: {
				type: Boolean,
				value: false
			}, // 是否显示换图文字  换
			scrollTop: {
				type: Number,
				value: 0
			}, // 页面滚动高度
			isMain: {
				type: Boolean,
				value: false
			} // 页面滚动高度
		},
		data() {
			return {
				/* 未渲染数据 */
				pageMetaSupport: false, // 当前版本是否支持 page-meta 标签
				windowHeight: 0, // 视窗高度
				platform: '', // 平台信息
				realTopSize: 0, // 计算后顶部固定高度实际值
				realBottomSize: 0, // 计算后底部固定高度实际值
				rows: 0, // 行数
				itemDom: {
					width: 0,
					height: 0,
					left: 0,
					top: 0
				}, // 每一项 item 的 dom 信息, 由于大小一样所以只存储一个
				itemWrapDom: {
					width: 0,
					height: 0,
					left: 0,
					top: 0
				}, // 整个拖拽区域的 dom 信息
				startId: 0, // 初始触摸点 identifier
				preStartKey: -1, // 前一次排序时候的起始 sortKey 值

				/* 渲染数据 */
				list: [], // 渲染数据列
				cur: -1, // 当前激活的元素
				curZ: -1, // 当前激活的元素, 用于控制激活元素z轴显示
				tranX: 0, // 当前激活元素的 X轴 偏移量
				tranY: 0, // 当前激活元素的 Y轴 偏移量
				itemWrapHeight: 0, // 动态计算父级元素高度
				dragging: false, // 是否在拖拽中
				itemTransition: false, // item 变换是否需要过渡动画, 首次渲染不需要
				itemOperation: true, //是否可以操作换图 删除 编辑规格
			}
		},
		onLoad: function() {
			this.init()
		},
		methods: {
			/**
			 * 长按触发移动排序
			 */
			longPress: function(e) {
				// 获取触摸点信息
				let startTouch = e.changedTouches[0];
				if (!startTouch) return;
				// 固定项则返回
				let index = e.currentTarget.dataset.index;
				if (this.isFixed(index)) return;

				// 防止多指触发 drag 动作, 如果已经在 drag 中则返回, touchstart 事件中有效果
				if (this.dragging) return;
				this.dragging = true

				let {
					platform,
					itemDom,
					itemWrapDom
				} = this, {
					pageX: startPageX,
					pageY: startPageY,
					identifier: startId
				} = startTouch;

				// 计算X,Y轴初始位移, 使 item 中心移动到点击处
				let tranX = startPageX - itemDom.width / 2 - itemWrapDom.left,
					tranY = startPageY - itemDom.height / 2 - itemWrapDom.top;
				// 单列时候X轴初始不做位移
				if (this.columns === 1) tranX = 0;

				this.startId = startId;
				this.cur = index
				this.curZ = index
				this.tranX = tranX
				this.tranY = tranY
				if (platform !== "devtools") uni.vibrateShort();
			},
			touchMove: function(e) {
				// 获取触摸点信息
				let currentTouch = e.changedTouches[0];
				if (!currentTouch) return;

				if (!this.dragging) return;

				let {
					pageMetaSupport,
					windowHeight,
					realTopSize,
					realBottomSize,
					itemDom,
					itemWrapDom,
					preStartKey,
					columns,
					rows
				} = this, {
					pageX: currentPageX,
					pageY: currentPageY,
					identifier: currentId,
					clientY: currentClientY
				} = currentTouch;

				// 如果不是同一个触发点则返回
				if (this.startId !== currentId) return;

				// 通过 当前坐标点, 初始坐标点, 初始偏移量 来计算当前偏移量
				let tranX = currentPageX - itemDom.width / 2 - itemWrapDom.left,
					tranY = currentPageY - itemDom.height / 2 - itemWrapDom.top;
				// 单列时候X轴初始不做位移
				if (columns === 1) tranX = 0;

				// 到顶到底自动滑动
				if (currentClientY > windowHeight - itemDom.height - realBottomSize) {
					// 当前触摸点pageY + item高度 - (屏幕高度 - 底部固定区域高度)

					if (pageMetaSupport) {
						this.$emit("scroll", {
							scrollTop: currentPageY + itemDom.height - (windowHeight - realBottomSize)
						});
					} else {
						uni.pageScrollTo({
							scrollTop: currentPageY + itemDom.height - (windowHeight - realBottomSize),
							duration: 300
						});
					}
				} else if (currentClientY < itemDom.height + realTopSize) {
					// 当前触摸点pageY - item高度 - 顶部固定区域高度

					if (pageMetaSupport) {
						this.$emit("scroll", {
							scrollTop: currentPageY - itemDom.height - realTopSize
						});
					} else {
						uni.pageScrollTo({
							scrollTop: currentPageY - itemDom.height - realTopSize,
							duration: 300
						});
					}
				}

				// 设置当前激活元素偏移量
				this.tranX = tranX
				this.tranY = tranY

				// 获取 startKey 和 endKey
				let startKey = parseInt(e.currentTarget.dataset.key);
				let curX = Math.round(tranX / itemDom.width),
					curY = Math.round(tranY / itemDom.height);
				let endKey = curX + columns * curY;

				// 遇到固定项和超出范围则返回
				if (this.isFixed(endKey) || IsOutRange(curX, columns, curY, rows, endKey, this.list.length)) return;

				// 防止拖拽过程中发生乱序问题
				if (startKey === endKey || startKey === preStartKey) return;
				this.preStartKey = startKey;

				// 触发排序
				this.sort(startKey, endKey);
			},
			touchEnd: function() {
				if (!this.dragging) return;
				this.triggerCustomEvent(this.list, 'sortend')
				this.clearData();
			},
			/**
			 * 根据 startKey 和 endKey 去重新计算每一项 sortKey
			 */
			sort: function(startKey, endKey) {
				this.itemTransition = true
				let list = this.list.map((item) => {
					if (item.fixed) return item;
					if (startKey < endKey) { // 正序拖动
						if (item.sortKey > startKey && item.sortKey <= endKey) {
							item.sortKey = this.excludeFix(item.sortKey - 1, startKey, 'reduce');
						} else if (item.sortKey === startKey) {
							item.sortKey = endKey;
						}
						return item;
					} else if (startKey > endKey) { // 倒序拖动
						if (item.sortKey >= endKey && item.sortKey < startKey) {
							item.sortKey = this.excludeFix(item.sortKey + 1, startKey, 'add');
						} else if (item.sortKey === startKey) {
							item.sortKey = endKey;
						}
						return item;
					}
				});
				this.updateList(list);
			},
			/**
			 * 排除固定项得到最终 sortKey
			 */
			excludeFix: function(sortKey, startKey, type) {
				if (sortKey === startKey) return startKey;
				if (this.data.list[sortKey].fixed) {
					let _sortKey = type === 'reduce' ? sortKey - 1 : sortKey + 1;
					return this.excludeFix(_sortKey, startKey, type);
				} else {
					return sortKey;
				}
			},
			/**
			 * 根据排序后 list 数据进行位移计算
			 */
			updateList: function(data, vibrate = true) {
				let {
					platform
				} = this;
				var spec = false
				let list = data.map((item, index) => {
					if (item.data.isSpec) {
						spec = true
					}
					if (data.length >= 4 && item.slot == 'plus') {
						item.tranX = `${(item.sortKey % this.columns ) * 100}%`;
						if (spec) {
							item.tranY =
								`${(Math.floor(item.sortKey / this.columns) - 0 + Math.ceil(data.length / 3 - 1) * 0.358 ) * 100}%`;
						} else {
							item.tranY =
								`${(Math.floor(item.sortKey / this.columns) - 0 + Math.ceil(data.length / 4 - 1) * 0.32 ) * 100}%`;
						}
					} else {
						item.tranX = `${(item.sortKey % this.columns) * 100}%`;
						item.tranY = `${Math.floor(item.sortKey / this.columns) * 100}%`;
					}

					return item;
				});
				this.list = [...list]

				if (!vibrate) return;
				if (platform !== "devtools") uni.vibrateShort();
				this.triggerCustomEvent(list, 'change')
			},
			/**
			 * 判断是否是固定的 item
			 */
			isFixed: function(index) {
				let list = this.list;
				if (list && list[index] && list[index].fixed) return 1;
				return 0;
			},
			/**
			 * 清除参数
			 */
			clearData: function() {
				this.preStartKey = -1
				this.dragging = false
				this.cur = -1
				this.tranX = 0
				this.tranY = 0
				// 延迟清空
				setTimeout(() => {
					this.curZ = -1
				}, 300)
			},
			/**
			 * 点击每一项后触发事件
			 */
			itemClick: function(e) {
				let {
					index,
					key
				} = e.currentTarget.dataset;
				let list = this.list;
				let currentItem = list[index];

				if (!currentItem.extraNode) {
					let _list = [];

					list.forEach((item) => {
						_list[item.sortKey] = item;
					});

					let currentKey = -1;

					for (let i = 0, len = _list.length; i < len; i++) {
						let item = _list[i];
						if (!item.extraNode) {
							currentKey++;
						}
						if (item.sortKey === currentItem.sortKey) {
							break;
						}
					}

					this.$emit('click', {
						key: currentKey,
						data: currentItem.data
					});
				}
			},
			/**
			 * 封装自定义事件
			 * @param list 当前渲染的数据
			 * @param type 事件类型
			 */
			triggerCustomEvent: function(list, type) {
				let _list = [],
					listData = [];

				list.forEach((item) => {
					_list[item.sortKey] = item;
				});

				_list.forEach((item) => {
					if (!item.extraNode) {
						listData.push(item.data);
					}
				});

				this.$emit(type, {
					listData: listData
				});
			},
			/**
			 *  初始化获取 dom 信息
			 */
			initDom: function() {
				let {
					windowWidth,
					windowHeight,
					platform,
					SDKVersion
				} = uni.getSystemInfoSync();

				this.pageMetaSupport = compareVersion(SDKVersion, '2.9.0') >= 0;

				let remScale = (windowWidth || 375) / 375,
					realTopSize = this.topSize * remScale / 2,
					realBottomSize = this.bottomSize * remScale / 2;

				this.windowHeight = windowHeight;
				this.platform = platform;
				this.realTopSize = realTopSize;
				this.realBottomSize = realBottomSize;

				this.createSelectorQuery().select(".item").boundingClientRect((res) => {
					let rows = Math.ceil(this.list.length / this.columns);

					this.rows = rows;
					this.itemDom = res;
					this.itemWrapHeight = rows * res.height;

					this.createSelectorQuery().select(".item-wrap").boundingClientRect((res) => {
						this.itemWrapDom = res;
						this.itemWrapDom.top += this.scrollTop
					}).exec();
				}).exec();
			},
			/**
			 *  初始化函数
			 *  {listData, columns, topSize, bottomSize} 参数改变需要重新调用初始化方法
			 */
			init: function() {
				this.clearData();
				this.itemTransition = false

				let delItem = (item, extraNode) => ({
					id: item.dragId,
					slot: item.slot,
					fixed: item.fixed,
					extraNode: extraNode,
					tranX: "0%",
					tranY: "0%",
					data: item
				});

				let {
					listData,
					extraNodes
				} = this;
				let _list = [],
					_before = [],
					_after = [],
					destBefore = [],
					destAfter = [];

				extraNodes.forEach((item, index) => {
					if (item.type === "before") {
						_before.push(delItem(item, true));
					} else if (item.type === "after") {
						_after.push(delItem(item, true));
					} else if (item.type === "destBefore") {
						destBefore.push(delItem(item, true));
					} else if (item.type === "destAfter") {
						destAfter.push(delItem(item, true));
					}
				});

				// 遍历数据源增加扩展项, 以用作排序使用
				listData.forEach((item, index) => {
					destBefore.forEach((i) => {
						if (i.data.destKey === index) _list.push(i);
					});
					_list.push(delItem(item, false));
					destAfter.forEach((i) => {
						if (i.data.destKey === index) _list.push(i);
					});
				});
				// console.log(_list,_before,_after)
				let list = _before.concat(_list, _after).map((item, index) => {
					item.sortKey = index; // 初始化 sortKey 为当前项索引值
					item.tranX = `${(item.sortKey % this.columns) * 100}%`;
					item.tranY = `${Math.floor(item.sortKey / this.columns) * 100}%`;
					return item;
				});

				if (list.length === 0) {
					this.itemWrapHeight = 0
					return;
				}

				this.updateList(list, false);
				// 异步加载数据时候, 延迟执行 initDom 方法, 防止基础库 2.7.1 版本及以下无法正确获取 dom 信息
				setTimeout(() => this.initDom(), 0);
			},
			del: function(e) {
				var obj = {
					id: e.currentTarget.dataset.info.data.dragId,
					img: e.currentTarget.dataset.info.data.imgType
				}
				this.$emit('del', obj)
			},
			editSpec: function(e) {
				var obj = {
					value: e.detail.value,
					id: e.currentTarget.dataset.info.data.dragId
				}
				if (e.detail.value != '') {
					this.$emit('editSpec', obj)
				}
			},
			changeImg: function(e) {
				var params = null
				if (this.spec) {
					params = e.currentTarget.dataset.info.data.dragId
				} else {
					params = {
						id: e.currentTarget.dataset.info.data.dragId,
						type: this.isMain
					}
				}
				this.$emit('changeImg', params)
			},
			pTu: function(e) { //p图
				this.$emit('pTu', e.currentTarget.dataset.info.data)
			}
		}
	}
</script>

<style scoped src="./index.css">

</style>
