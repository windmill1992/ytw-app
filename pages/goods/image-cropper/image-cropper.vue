<template>
	<view>
		<view class='image-cropper' @touchmove.stop='_preventTouchMove'>
			<view class='main' @touchend="_cutTouchEnd" @touchstart="_cutTouchStart" @touchmove="_cutTouchMove"
				@tap="_click">
				<view class='content'>
					<view class='content_top bg_gray' :class="{bg_black: _flag_bright}"
						:style="'height:' + cut_top + 'px;transition-property:' + _cut_animation ? '' : 'background'">
					</view>
					<view class='content_middle' :style="'height:' + height + 'px;'">
						<view class='content_middle_left bg_gray' :class="{bg_black: _flag_bright}"
							:style="'width:' + cut_left + 'px;transition-property:' + _cut_animation ? '' : 'background'">
						</view>
						<view class='content_middle_middle'
							:style="'width:' + width + 'px;height:' + height + 'px;transition-duration: .3s;transition-property:' + _cut_animation ? '' : 'background'">
							<view class="border border-top-left"></view>
							<view class="border border-top-right"></view>
							<view class="border border-right-top"></view>
							<view class="border border-right-bottom"></view>
							<view class="border border-bottom-right"></view>
							<view class="border border-bottom-left"></view>
							<view class="border border-left-bottom"></view>
							<view class="border border-left-top"></view>
						</view>
						<view class='content_middle_right bg_gray' :class="{bg_black: _flag_bright}"
							:style="'transition-property:' + _cut_animation ? '' : 'background'"></view>
					</view>
					<view class='content_bottom bg_gray' :class="{bg_black: _flag_bright}"
						:style="'transition-property:' + _cut_animation ? '' : 'background'"></view>
				</view>
				<view class="cropperTips">
					<view> 可旋转，放大，拖拽，切图</view>
				</view>
				<view @tap.stop="cancelImg1" class="cancelImg">取消</view>
				<view @tap.stop="resetImgPos" class="resetImgPos">复原</view>
				<view @tap.stop="saveImg1" class="saveImg1">保存</view>
				<image @load="imageLoad" @touchstart="_start" @touchmove="_move" @touchend="_end"
					:style="'width:' + img_width ? img_width + 'px' : 'auto' + ';height:' + img_height ? img_height + 'px' : 'auto' + ';transform:translate3d(' + _img_left-img_width/2 + 'px,' + _img_top-img_height/2 + 'px,0) scale(' + scale + ') rotate(' + angle + 'deg);transition-duration:' + _cut_animation ? .4 : 0 + 's;'"
					class='img' :src='imgSrc'></image>
			</view>
			<canvas canvas-id='image-cropper' disable-scroll="true"
				:style="'width:' + _canvas_width * export_scale + 'px;height:' + _canvas_height * export_scale + 'px;left:' + canvas_left + 'px;top:' + canvas_top + 'px'"
				class='image-cropper-canvas'></canvas>
		</view>

	</view>
</template>

<script>
	/**
	 * 属性	类型	缺省值	取值	描述	必填
	 *imgSrc	String	无	无限制	图片地址(如果是网络图片需配置安全域名)	否
	 *disable_rotate	Boolean	false	true/false	禁止用户旋转(为false时建议同时设置limit_move为false)	否
	 *limit_move	Boolean	false	true/false	限制图片移动范围(裁剪框始终在图片内)(为true时建议同时设置disable_rotate为true)	否
	 *width	Number	200	超过屏幕宽度自动转为屏幕宽度	裁剪框宽度	否
	 *height	Number	200	超过屏幕高度自动转为屏幕高度	裁剪框高度	否
	 *max_width	Number	300	裁剪框最大宽度	裁剪框最大宽度	否
	 *max_height	Number	300	裁剪框最大高度	裁剪框最大高度	否 
	 *min_width	Number	100	裁剪框最小宽度	裁剪框最小宽度	否
	 *min_height	Number	100	裁剪框最小高度	裁剪框最小高度	否
	 *disable_width	Boolean	false	true/false	锁定裁剪框宽度	否
	 *disable_height	Boolean	false	true/false	锁定裁剪框高度	否
	 *disable_ratio	Boolean	false	true/false	锁定裁剪框比例	否
	 *export_scale	Number	3	无限制	输出图片的比例(相对于裁剪框尺寸)	否
	 *quality	Number	1	0-1	生成的图片质量	否
	 *cut_top	Number	居中	始终在屏幕内	裁剪框上边距	否
	 *cut_left	Number	居中	始终在屏幕内	裁剪框左边距	否
	 *img_width	Number	宽高都不设置，最小边填满裁剪框	支持%(不加单位为px)(只设置宽度，高度自适应)	图片宽度	否
	 *img_height	Number	宽高都不设置，最小边填满裁剪框	支持%(不加单位为px)(只设置高度，宽度自适应)	图片高度	否
	 *scale	Number	1	无限制	图片的缩放比	否
	 *angle	Number	0	(limit_move=true时angle=n*90)	图片的旋转角度	否
	 *min_scale	Number	0.5	无限制	图片的最小缩放比	否
	 *max_scale	Number	2	无限制	图片的最大缩放比	否
	 *bindload	Function	null	函数名称	cropper初始化完成	否
	 *bindimageload	Function	null	函数名称	图片加载完成,返回值Object{width,height,path,type等}	否
	 *bindtapcut	Function	null	函数名称	点击中间裁剪框,返回值Object{src,width,height}	否
	 *函数说明
	 *函数名	参数	返回值	描述	参数必填
	 *upload	无	无	调起wx上传图片接口并开始剪裁	否
	 *pushImg	src	无	开始裁剪图片	是
	 *getImg	Function(回调函数)	Object{src,width,height}	获取裁剪之后的图片(图片尺寸 = 图片宽高 * export_scale)	是
	 *setCutXY	X、Y	无	设置裁剪框位置	是
	 *setCutSize	width、height	无	设置裁剪框大小	是
	 *setCutCenter	无	无	设置裁剪框居中	否
	 *setScale	scale	无	设置图片缩放比例（不受min_scale、max_scale影响）	是
	 *setAngle	deg	无	设置图片旋转角度（带过渡效果）	是
	 *setTransform	{x,y,angle,scale,cutX,cutY}	无	图片在原有基础上的变化(scale受min_scale、max_scale影响)	根据需要传参
	 *imgReset	无	无	重置图片的角度、缩放、位置(可以在onloadImage回调里使用) 否   
	 * **/
	export default {
		props: {
			/**
			 * 图片路径
			 */
			'imgSrc': {
				type: String
			},
			/**
			 * 裁剪框高度
			 */
			'height': {
				type: Number,
				value: 200
			},
			/**
			 * 裁剪框宽度
			 */
			'width': {
				type: Number,
				value: 200
			},
			/**
			 * 裁剪框最小尺寸
			 */
			'min_width': {
				type: Number,
				value: 100
			},
			'min_height': {
				type: Number,
				value: 100
			},
			/**
			 * 裁剪框最大尺寸
			 */
			'max_width': {
				type: Number,
				value: 300
			},
			'max_height': {
				type: Number,
				value: 300
			},
			/**
			 * 裁剪框禁止拖动
			 */
			'disable_width': {
				type: Boolean,
				value: false
			},
			'disable_height': {
				type: Boolean,
				value: false
			},
			/**
			 * 锁定裁剪框比例
			 */
			'disable_ratio': {
				type: Boolean,
				value: false
			},
			/**
			 * 生成的图片尺寸相对剪裁框的比例
			 */
			'export_scale': {
				type: Number,
				value: 3
			},
			/**
			 * 生成的图片质量0-1
			 */
			'quality': {
				type: Number,
				value: 1
			},
			'cut_top': {
				type: Number,
				value: null
			},
			'cut_left': {
				type: Number,
				value: null
			},
			/**
			 * canvas上边距（不设置默认不显示）
			 */
			'canvas_top': {
				type: Number,
				value: null
			},
			/**
			 * canvas左边距（不设置默认不显示）
			 */
			'canvas_left': {
				type: Number,
				value: null
			},
			/**
			 * 图片宽度
			 */
			'img_width': {
				type: null,
				value: null
			},
			/**
			 * 图片高度
			 */
			'img_height': {
				type: null,
				value: null
			},
			/**
			 * 图片缩放比
			 */
			'scale': {
				type: Number,
				value: 1
			},
			/**
			 * 图片旋转角度
			 */
			'angle': {
				type: Number,
				value: 0
			},
			/**
			 * 最小缩放比
			 */
			'min_scale': {
				type: Number,
				value: 0.5
			},
			/**
			 * 最大缩放比
			 */
			'max_scale': {
				type: Number,
				value: 2
			},
			/**
			 * 是否禁用旋转
			 */
			'disable_rotate': {
				type: Boolean,
				value: false
			},
			/**
			 * 是否限制移动范围(剪裁框只能在图片内)
			 */
			'limit_move': {
				type: Boolean,
				value: false
			}
		},
		data() {
			return {
				el: 'image-cropper', //暂时无用
				info: uni.getSystemInfoSync(),
				MOVE_THROTTLE: null, //触摸移动节流settimeout
				MOVE_THROTTLE_FLAG: true, //节流标识
				INIT_IMGWIDTH: 0, //图片设置尺寸,此值不变（记录最初设定的尺寸）
				INIT_IMGHEIGHT: 0, //图片设置尺寸,此值不变（记录最初设定的尺寸）
				TIME_BG: null, //背景变暗延时函数
				TIME_CUT_CENTER: null,
				_touch_img_relative: [{
					x: 0,
					y: 0
				}], //鼠标和图片中心的相对位置
				_flag_cut_touch: false, //是否是拖动裁剪框
				_hypotenuse_length: 0, //双指触摸时斜边长度
				_flag_img_endtouch: false, //是否结束触摸
				_flag_bright: true, //背景是否亮
				_canvas_overflow: true, //canvas缩略图是否在屏幕外面
				_canvas_width: 200,
				_canvas_height: 200,
				origin_x: 0.5, //图片旋转中心
				origin_y: 0.5, //图片旋转中心
				_cut_animation: false, //是否开启图片和裁剪框过渡
				_img_top: uni.getSystemInfoSync().windowHeight / 2, //图片上边距
				_img_left: uni.getSystemInfoSync().windowWidth / 2, //图片左边距
			}
		},
		watch: {
			//监听截取框宽高变化
			width(value, that) {
				if (value < that.min_width) {
					that.width = that.min_width
				}
				that._computeCutSize();
			},
			height(value, that) {
				if (value < that.min_height) {
					that.height = that.min_height
				}
				that._computeCutSize();
			},
			angle(value, that) {
				//停止居中裁剪框，继续修改图片位置
				that._moveStop();
				if (that.limit_move) {
					if (that.angle % 90) {
						that.angle = Math.round(that.angle / 90) * 90
						return;
					}
				}
			},
			_cut_animation(value, that) {
				//开启过渡300毫秒之后自动关闭
				clearTimeout(that._cut_animation_time);
				if (value) {
					that._cut_animation_time = setTimeout(() => {
						that._cut_animation = false
					}, 300)
				}
			},
			limit_move(value, that) {
				if (value) {
					if (that.angle % 90) {
						that.angle = Math.round(that.angle / 90) * 90
					}
					that._imgMarginDetectionScale();
					!that._canvas_overflow && that._draw();
				}
			},
			canvas_top(value, that) {
				that._canvasDetectionPosition();
			},
			canvas_left(value, that) {
				that._canvasDetectionPosition();
			},
			imgSrc(value, that) {
				that.pushImg();
			},
			cut_top(value, that) {
				that._cutDetectionPosition();
				if (that.limit_move) {
					!that._canvas_overflow && that._draw();
				}
			},
			cut_left(value, that) {
				that._cutDetectionPosition();
				if (that.limit_move) {
					!that._canvas_overflow && that._draw();
				}
			}
		},
		created: function() {
			this.info = uni.getSystemInfoSync();
			//启用数据监听
			this._watcher();
			this.INIT_IMGWIDTH = this.img_width;
			this.INIT_IMGHEIGHT = this.img_height;
			this._canvas_height = this.height;
			this._canvas_width = this.width;
			this._initCanvas();
			this.imgSrc && (this.imgSrc = this.imgSrc);
			//根据开发者设置的图片目标尺寸计算实际尺寸
			this._initImageSize();
			//设置裁剪框大小>设置图片尺寸>绘制canvas
			this._computeCutSize();
			//检查裁剪框是否在范围内
			this._cutDetectionPosition();
			//检查canvas是否在范围内
			this._canvasDetectionPosition();
			//初始化完成
			this.$emit('load', {
				cropper: this
			});
		},
		methods: {
			/**
			 * 上传图片
			 */
			upload: function() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success(res) {
						const tempFilePaths = res.tempFilePaths[0];
						that.pushImg(tempFilePaths);
						uni.showLoading({
							title: '加载中...'
						})
					}
				})
			},
			/**
			 * 返回图片信息
			 */
			getImg: function(getCallback) {
				this._draw(() => {
					uni.canvasToTempFilePath({
						width: this.width * this.export_scale,
						height: Math.round(this.height * this.export_scale),
						destWidth: this.width * this.export_scale,
						destHeight: Math.round(this.height) * this.export_scale,
						fileType: 'png',
						quality: this.quality,
						canvasId: this.el,
						success: (res) => {
							getCallback({
								url: res.tempFilePath,
								width: this.width * this.export_scale,
								height: this.height * this.export_scale
							});
						}
					}, this)
				});
			},
			/**
			 * 设置图片动画
			 * {
			 *    x:10,//图片在原有基础上向下移动10px
			 *    y:10,//图片在原有基础上向右移动10px
			 *    angle:10,//图片在原有基础上旋转10deg
			 *    scale:0.5,//图片在原有基础上增加0.5倍
			 * }
			 */
			setTransform: function(transform) {
				if (!transform) return;
				if (!this.disable_rotate) {
					this.angle = transform.angle ? this.angle + transform.angle : this.angle
				}
				var scale = this.scale;
				if (transform.scale) {
					scale = this.scale + transform.scale;
					scale = scale <= this.min_scale ? this.min_scale : scale;
					scale = scale >= this.max_scale ? this.max_scale : scale;
				}
				this.scale = scale;
				let cutX = this.cut_left;
				let cutY = this.cut_top;
				if (transform.cutX) {
					this.cut_left = cutX + transform.cutX;
					this.watch.cut_left(null, this);
				}
				if (transform.cutY) {
					this.cut_top = cutY + transform.cutY;
					this.watch.cut_top(null, this);
				}
				this._img_top = transform.y ? this._img_top + transform.y : this._img_top;
				this._img_left = transform.x ? this._img_left + transform.x : this._img_left;
				//图像边缘检测,防止截取到空白
				this._imgMarginDetectionScale();
				//停止居中裁剪框，继续修改图片位置
				this._moveDuring();
				!this._canvas_overflow && this._draw();
				//可以居中裁剪框了
				this._moveStop(); //结束操作
			},
			/**
			 * 设置剪裁框位置
			 */
			setCutXY: function(x, y) {
				this.cut_top = y;
				this.cut_left = x;
			},
			/**
			 * 设置剪裁框尺寸
			 */
			setCutSize: function(w, h) {
				this.width = w;
				this.height = h;
				this._computeCutSize();
			},
			/**
			 * 设置剪裁框和图片居中
			 */
			setCutCenter: function() {
				let cut_top = (this.info.windowHeight - this.height) * 0.5;
				let cut_left = (this.info.windowWidth - this.width) * 0.5;
				//顺序不能变
				this._img_top = this._img_top - this.cut_top + cut_top;
				this.cut_top = cut_top; //截取的框上边距
				this._img_left = this._img_left - this.cut_left + cut_left;
				this.cut_left = cut_left;	//截取的框左边距
			},
			_setCutCenter: function() {
				let cut_top = (this.info.windowHeight - this.height) * 0.5;
				let cut_left = (this.info.windowWidth - this.width) * 0.5;
				this.cut_top = cut_top;	//截取的框上边距
				this.cut_left = cut_left;	//截取的框左边距
			},
			/**
			 * 设置剪裁框宽度-即将废弃
			 */
			setWidth: function(width) {
				this.width = width;
				this._computeCutSize();
			},
			/**
			 * 设置剪裁框高度-即将废弃
			 */
			setHeight: function(height) {
				this.height = height;
				this._computeCutSize();
			},
			/**
			 * 是否锁定旋转
			 */
			setDisableRotate: function(value) {
				this.disable_rotate = value;
			},
			/**
			 * 是否限制移动
			 */
			setLimitMove: function(value) {
				this._cut_animation = true;
				this.limit_move = !!value;
			},
			/**
			 * 初始化图片，包括位置、大小、旋转角度
			 */
			imgReset: function() {
				this.scale = 1;
				this.angle = 0;
				this._img_top = uni.getSystemInfoSync().windowHeight / 2;
				this._img_left = uni.getSystemInfoSync().windowWidth / 2;
			},
			/**
			 * 加载（更换）图片
			 */
			pushImg: function(src) {
				if (src) {
					this.imgSrc = src;
					//发现是手动赋值直接返回，交给watch处理
					return;
				}
				// getImageInfo接口传入 src: '' 会导致内存泄漏
				if (!this.imgSrc) return;
				uni.getImageInfo({
					src: this.imgSrc,
					success: (res) => {
						this.imageObject = res;
						//图片非本地路径需要换成本地路径
						if (this.imgSrc.search(/tmp/) == -1) {
							this.imgSrc = res.path;
						}
						//计算最后图片尺寸
						this._imgComputeSize();
						if (this.limit_move) {
							//限制移动，不留空白处理
							this._imgMarginDetectionScale();
						}
						this._draw();
					},
					fail: (err) => {
						this.imgSrc = '';
					}
				});
			},
			imageLoad: function(e) {
				setTimeout(() => {
					this.$emit('imageload', this.imageObject);
				}, 1000)
			},
			/**
			 * 设置图片放大缩小
			 */
			setScale: function(scale) {
				if (!scale) return;
				this.scale = scale;
				!this._canvas_overflow && this._draw();
			},
			/**
			 * 设置图片旋转角度
			 */
			setAngle: function(angle) {
				if (!angle) return;
				this._cut_animation = true;
				this.angle = angle;
				this._imgMarginDetectionScale();
				!this._canvas_overflow && this._draw();
			},
			_initCanvas: function() {
				//初始化canvas
				if (!this.ctx) {
					this.ctx = uni.createCanvasContext("image-cropper", this);
				}
			},
			/**
			 * 根据开发者设置的图片目标尺寸计算实际尺寸
			 */
			_initImageSize: function() {
				//处理宽高特殊单位 %>px
				if (this.INIT_IMGWIDTH && typeof this.INIT_IMGWIDTH == "string" && this.INIT_IMGWIDTH.indexOf("%") != -1) {
					let width = this.INIT_IMGWIDTH.replace("%", "");
					this.INIT_IMGWIDTH = this.img_width = this.info.windowWidth / 100 * width;
				}
				if (this.INIT_IMGHEIGHT && typeof this.INIT_IMGHEIGHT == "string" && this.INIT_IMGHEIGHT.indexOf("%") != -1) {
					let height = this.img_height.replace("%", "");
					this.INIT_IMGHEIGHT = this.img_height = this.info.windowHeight / 100 * height;
				}
			},
			/**
			 * 检测剪裁框位置是否在允许的范围内(屏幕内)
			 */
			_cutDetectionPosition: function() {
				let _cutDetectionPositionTop = () => {
						//检测上边距是否在范围内
						if (this.cut_top < 0) {
							this.cut_top = 0;
						}
						if (this.cut_top > this.info.windowHeight - this.height) {
							this.cut_top = this.info.windowHeight - this.height;
						}
					},
					_cutDetectionPositionLeft = () => {
						//检测左边距是否在范围内
						if (this.cut_left < 0) {
							this.cut_left = 0;
						}
						if (this.cut_left > this.info.windowWidth - this.width) {
							this.cut_left = this.info.windowWidth - this.width;
						}
					};
				//裁剪框坐标处理（如果只写一个参数则另一个默认为0，都不写默认居中）
				if (this.cut_top == null && this.cut_left == null) {
					this._setCutCenter();
				} else if (this.cut_top != null && this.cut_left != null) {
					_cutDetectionPositionTop();
					_cutDetectionPositionLeft();
				} else if (this.cut_top != null && this.cut_left == null) {
					_cutDetectionPositionTop();
					this.cut_left = (this.info.windowWidth - this.width) / 2;
				} else if (this.cut_top == null && this.cut_left != null) {
					_cutDetectionPositionLeft();
					this.cut_top = (this.info.windowHeight - this.height) / 2;
				}
			},
			/**
			 * 检测canvas位置是否在允许的范围内(屏幕内)如果在屏幕外则不开启实时渲染
			 * 如果只写一个参数则另一个默认为0，都不写默认超出屏幕外
			 */
			_canvasDetectionPosition: function() {
				if (this.canvas_top == null && this.canvas_left == null) {
					this._canvas_overflow = false;
					this.canvas_top = -5000;
					this.canvas_left = -5000;
				} else if (this.canvas_top != null && this.canvas_left != null) {
					if (this.canvas_top < -this.height || this.canvas_top > this.info.windowHeight) {
						this._canvas_overflow = true;
					} else {
						this._canvas_overflow = false;
					}
				} else if (this.canvas_top != null && this.canvas_left == null) {
					this.canvas_left = 0;
				} else if (this.canvas_top == null && this.canvas_left != null) {
					this.canvas_top = 0;
					if (this.canvas_left < -this.width || this.canvas_left > this.info.windowWidth) {
						this._canvas_overflow = true;
					} else {
						this._canvas_overflow = false;
					}
				}
			},
			/**
			 * 图片边缘检测-位置
			 */
			_imgMarginDetectionPosition: function(scale) {
				if (!this.limit_move) return;
				let left = this._img_left;
				let top = this._img_top;
				var scale = scale || this.scale;
				let img_width = this.img_width;
				let img_height = this.img_height;
				if (this.angle / 90 % 2) {
					img_width = this.img_height;
					img_height = this.img_width;
				}
				left = this.cut_left + img_width * scale / 2 >= left ? left : this.cut_left + img_width * scale / 2;
				left = this.cut_left + this.width - img_width * scale / 2 <= left ? left : this.cut_left +
					this.width - img_width * scale / 2;
				top = this.cut_top + img_height * scale / 2 >= top ? top : this.cut_top + img_height * scale / 2;
				top = this.cut_top + this.height - img_height * scale / 2 <= top ? top : this.cut_top + this.height - img_height * scale / 2;
				this._img_left = left;
				this._img_top = top;
				this.scale = scale;
			},
			/**
			 * 图片边缘检测-缩放
			 */
			_imgMarginDetectionScale: function() {
				if (!this.limit_move) return;
				let scale = this.scale;
				let img_width = this.img_width;
				let img_height = this.img_height;
				if (this.angle / 90 % 2) {
					img_width = this.img_height;
					img_height = this.img_width;
				}
				if (img_width * scale < this.width) {
					scale = this.width / img_width;
				}
				if (img_height * scale < this.height) {
					scale = Math.max(scale, this.height / img_height);
				}
				this._imgMarginDetectionPosition(scale);
			},
			/**
			 * 计算图片尺寸
			 */
			_imgComputeSize: function() {
				let img_width = this.img_width,
					img_height = this.img_height;
				if (!this.INIT_IMGHEIGHT && !this.INIT_IMGWIDTH) {
					//默认按图片最小边 = 对应裁剪框尺寸
					img_width = this.imageObject.width;
					img_height = this.imageObject.height;
					if (img_width / img_height > this.width / this.height) {
						img_height = this.height;
						img_width = this.imageObject.width / this.imageObject.height * img_height;
					} else {
						img_width = this.width;
						img_height = this.imageObject.height / this.imageObject.width * img_width;
					}
				} else if (this.INIT_IMGHEIGHT && !this.INIT_IMGWIDTH) {
					img_width = this.imageObject.width / this.imageObject.height * this.INIT_IMGHEIGHT;
				} else if (!this.INIT_IMGHEIGHT && this.INIT_IMGWIDTH) {
					img_height = this.imageObject.height / this.imageObject.width * this.INIT_IMGWIDTH;
				}
				this.img_width = img_width;
				this.img_height = img_height;
			},
			//改变截取框大小
			_computeCutSize: function() {
				if (this.width > this.info.windowWidth) {
					this.width = this.info.windowWidth
				} else if (this.width + this.cut_left > this.info.windowWidth) {
					this.cut_left = this.info.windowWidth - this.cut_left;
				};
				if (this.height > this.info.windowHeight) {
					this.height = this.info.windowHeight;
				} else if (this.height + this.cut_top > this.info.windowHeight) {
					this.cut_top = this.info.windowHeight - this.cut_top;
				}
				!this._canvas_overflow && this._draw();
			},
			//开始触摸
			_start: function(event) {
				this._flag_img_endtouch = false;
				if (event.touches.length == 1) {
					//单指拖动
					this._touch_img_relative[0] = {
						x: (event.touches[0].clientX - this._img_left),
						y: (event.touches[0].clientY - this._img_top)
					}
				} else {
					//双指放大
					let width = Math.abs(event.touches[0].clientX - event.touches[1].clientX);
					let height = Math.abs(event.touches[0].clientY - event.touches[1].clientY);
					this._touch_img_relative = [{
						x: (event.touches[0].clientX - this._img_left),
						y: (event.touches[0].clientY - this._img_top)
					}, {
						x: (event.touches[1].clientX - this._img_left),
						y: (event.touches[1].clientY - this._img_top)
					}];
					this._hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
				}
				!this._canvas_overflow && this._draw();
			},
			_move_throttle: function() {
				//安卓需要节流
				if (this.info.platform == 'android') {
					clearTimeout(this.MOVE_THROTTLE);
					this.MOVE_THROTTLE = setTimeout(() => {
						this.MOVE_THROTTLE_FLAG = true;
					}, 1000 / 40)
					return this.MOVE_THROTTLE_FLAG;
				} else {
					this.MOVE_THROTTLE_FLAG = true;
				}
			},
			_move: function(event) {
				if (this._flag_img_endtouch || !this.MOVE_THROTTLE_FLAG) return;
				this.MOVE_THROTTLE_FLAG = false;
				this._move_throttle();
				this._moveDuring();
				if (event.touches.length == 1) {
					//单指拖动
					let left = (event.touches[0].clientX - this._touch_img_relative[0].x),
						top = (event.touches[0].clientY - this._touch_img_relative[0].y);
					//图像边缘检测,防止截取到空白
					this._img_left = left;
					this._img_top = top;
					this._imgMarginDetectionPosition();
				} else {
					//双指放大
					let width = (Math.abs(event.touches[0].clientX - event.touches[1].clientX)),
						height = (Math.abs(event.touches[0].clientY - event.touches[1].clientY)),
						hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)),
						scale = this.scale * (hypotenuse / this._hypotenuse_length),
						current_deg = 0;
					scale = scale <= this.min_scale ? this.min_scale : scale;
					scale = scale >= this.max_scale ? this.max_scale : scale;
					//图像边缘检测,防止截取到空白
					this.scale = scale;
					this._imgMarginDetectionScale();
					//双指旋转(如果没禁用旋转)
					let _touch_img_relative = [{
						x: (event.touches[0].clientX - this._img_left),
						y: (event.touches[0].clientY - this._img_top)
					}, {
						x: (event.touches[1].clientX - this._img_left),
						y: (event.touches[1].clientY - this._img_top)
					}];
					if (!this.disable_rotate) {
						let first_atan = 180 / Math.PI * Math.atan2(_touch_img_relative[0].y, _touch_img_relative[0].x);
						let first_atan_old = 180 / Math.PI * Math.atan2(this._touch_img_relative[0].y, this._touch_img_relative[0].x);
						let second_atan = 180 / Math.PI * Math.atan2(_touch_img_relative[1].y, _touch_img_relative[1].x);
						let second_atan_old = 180 / Math.PI * Math.atan2(this._touch_img_relative[1].y, this._touch_img_relative[1].x);
						//当前旋转的角度
						let first_deg = first_atan - first_atan_old,
							second_deg = second_atan - second_atan_old;
						if (first_deg != 0) {
							current_deg = first_deg;
						} else if (second_deg != 0) {
							current_deg = second_deg;
						}
					}
					this._touch_img_relative = _touch_img_relative;
					this._hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
					//更新视图
					this.angle = this.angle + current_deg;
				}
				!this._canvas_overflow && this._draw();
			},
			//结束操作
			_end: function(event) {
				this._flag_img_endtouch = true;
				this._moveStop();
			},
			//点击中间剪裁框处理
			_click: function(event) {
				if (!this.imgSrc) {
					//调起上传
					this.upload();
					return;
				}
				this._draw(() => {
					let x = event.detail ? event.detail.x : event.touches[0].clientX;
					let y = event.detail ? event.detail.y : event.touches[0].clientY;
					if ((x >= this.cut_left && x <= (this.cut_left + this.width)) && (y >= this.cut_top && y <= (this.cut_top + this.height))) {
						//生成图片并回调
						uni.canvasToTempFilePath({
							width: this.width * this.export_scale,
							height: Math.round(this.height * this.export_scale),
							destWidth: this.width * this.export_scale,
							destHeight: Math.round(this.height) * this.export_scale,
							fileType: 'png',
							quality: this.quality,
							canvasId: this.el,
							success: (res) => {
								this.$emit('tapcut', {
									url: res.tempFilePath,
									width: this.width * this.export_scale,
									height: this.height * this.export_scale
								});
							}
						}, this)
					}
				});
			},
			//渲染
			_draw: function(callback) {
				if (!this.imgSrc) return;
				let draw = () => {
					//图片实际大小
					let img_width = this.img_width * this.scale * this.export_scale;
					let img_height = this.img_height * this.scale * this.export_scale;
					//canvas和图片的相对距离
					var xpos = this._img_left - this.cut_left;
					var ypos = this._img_top - this.cut_top;
					//旋转画布
					this.ctx.translate(xpos * this.export_scale, ypos * this.export_scale);
					this.ctx.rotate(this.angle * Math.PI / 180);
					this.ctx.drawImage(this.imgSrc, -img_width / 2, -img_height / 2, img_width, img_height);
					this.ctx.draw(false, () => {
						callback && callback();
					});
				}
				if (this.ctx.width != this.width || this.ctx.height != this.height) {
					//优化拖动裁剪框，所以必须把宽高设置放在离用户触发渲染最近的地方
					this._canvas_height = this.height;
					this._canvas_width = this.width;
					this.$nextTick(function(){
						setTimeout(() => {
							draw();
						}, 40);
					})
				} else {
					draw();
				}
			},
			//裁剪框处理
			_cutTouchMove: function(e) {
				if (this._flag_cut_touch && this.MOVE_THROTTLE_FLAG) {
					if (this.disable_ratio && (this.disable_width || this.disable_height)) return;
					//节流
					this.MOVE_THROTTLE_FLAG = false;
					this._move_throttle();
					let width = this.width,
						height = this.height,
						cut_top = this.cut_top,
						cut_left = this.cut_left,
						size_correct = () => {
							width = width <= this.max_width ? width >= this.min_width ? width : this.min_width : this.max_width;
							height = height <= this.max_height ? height >= this.min_height ? height : this.min_height : this.max_height;
						},
						size_inspect = () => {
							if ((width > this.max_width || width < this.min_width || height > this.max_height || height < this.min_height) && 
								this.disable_ratio) {
								size_correct();
								return false;
							} else {
								size_correct();
								return true;
							}
						};
					height = this.CUT_START.height + ((this.CUT_START.corner > 1 && this.CUT_START.corner < 4 ? 1 : -1) * (this.CUT_START.y - e.touches[0].clientY));
					switch (this.CUT_START.corner) {
						case 1:
							width = this.CUT_START.width + this.CUT_START.x - e.touches[0].clientX;
							if (this.disable_ratio) {
								height = width / (this.width / this.height)
							}
							if (!size_inspect()) return;
							cut_left = this.CUT_START.cut_left - (width - this.CUT_START.width);
							break
						case 2:
							width = this.CUT_START.width + this.CUT_START.x - e.touches[0].clientX;
							if (this.disable_ratio) {
								height = width / (this.width / this.height)
							}
							if (!size_inspect()) return;
							cut_top = this.CUT_START.cut_top - (height - this.CUT_START.height)
							cut_left = this.CUT_START.cut_left - (width - this.CUT_START.width)
							break
						case 3:
							width = this.CUT_START.width - this.CUT_START.x + e.touches[0].clientX;
							if (this.disable_ratio) {
								height = width / (this.width / this.height)
							}
							if (!size_inspect()) return;
							cut_top = this.CUT_START.cut_top - (height - this.CUT_START.height);
							break
						case 4:
							width = this.CUT_START.width - this.CUT_START.x + e.touches[0].clientX;
							if (this.disable_ratio) {
								height = width / (this.width / this.height)
							}
							if (!size_inspect()) return;
							break
					}
					if (!this.disable_width && !this.disable_height) {
						this.width = width;
						this.cut_left = cut_left;
						this.height = height;
						this.cut_top = cut_top;
					} else if (!this.disable_width) {
						this.width = width;
						this.cut_left = cut_left;
					} else if (!this.disable_height) {
						this.height = height;
						this.cut_top = cut_top;
					}
					this._imgMarginDetectionScale();
				}
			},
			_cutTouchStart: function(e) {
				let currentX = e.touches[0].clientX;
				let currentY = e.touches[0].clientY;
				let cutbox_top4 = this.cut_top + this.height - 30;
				let cutbox_bottom4 = this.cut_top + this.height + 20;
				let cutbox_left4 = this.cut_left + this.width - 30;
				let cutbox_right4 = this.cut_left + this.width + 30;

				let cutbox_top3 = this.cut_top - 30;
				let cutbox_bottom3 = this.cut_top + 30;
				let cutbox_left3 = this.cut_left + this.width - 30;
				let cutbox_right3 = this.cut_left + this.width + 30;

				let cutbox_top2 = this.cut_top - 30;
				let cutbox_bottom2 = this.cut_top + 30;
				let cutbox_left2 = this.cut_left - 30;
				let cutbox_right2 = this.cut_left + 30;

				let cutbox_top1 = this.cut_top + this.height - 30;
				let cutbox_bottom1 = this.cut_top + this.height + 30;
				let cutbox_left1 = this.cut_left - 30;
				let cutbox_right1 = this.cut_left + 30;
				if (currentX > cutbox_left4 && currentX < cutbox_right4 && currentY > cutbox_top4 && currentY < cutbox_bottom4) {
					this._moveDuring();
					this._flag_cut_touch = true;
					this._flag_img_endtouch = true;
					this.CUT_START = {
						width: this.width,
						height: this.height,
						x: currentX,
						y: currentY,
						corner: 4
					}
				} else if (currentX > cutbox_left3 && currentX < cutbox_right3 && currentY > cutbox_top3 && currentY < cutbox_bottom3) {
					this._moveDuring();
					this._flag_cut_touch = true;
					this._flag_img_endtouch = true;
					this.CUT_START = {
						width: this.width,
						height: this.height,
						x: currentX,
						y: currentY,
						cut_top: this.cut_top,
						cut_left: this.cut_left,
						corner: 3
					}
				} else if (currentX > cutbox_left2 && currentX < cutbox_right2 && currentY > cutbox_top2 && currentY < cutbox_bottom2) {
					this._moveDuring();
					this._flag_cut_touch = true;
					this._flag_img_endtouch = true;
					this.CUT_START = {
						width: this.width,
						height: this.height,
						cut_top: this.cut_top,
						cut_left: this.cut_left,
						x: currentX,
						y: currentY,
						corner: 2
					}
				} else if (currentX > cutbox_left1 && currentX < cutbox_right1 && currentY > cutbox_top1 && currentY < cutbox_bottom1) {
					this._moveDuring();
					this._flag_cut_touch = true;
					this._flag_img_endtouch = true;
					this.CUT_START = {
						width: this.width,
						height: this.height,
						cut_top: this.cut_top,
						cut_left: this.cut_left,
						x: currentX,
						y: currentY,
						corner: 1
					}
				}
			},
			_cutTouchEnd: function(e) {
				this._moveStop();
				this._flag_cut_touch = false;
			},
			//停止移动时需要做的操作
			_moveStop: function() {
				//清空之前的自动居中延迟函数并添加最新的
				clearTimeout(this.TIME_CUT_CENTER);
				this.TIME_CUT_CENTER = setTimeout(() => {
					//动画启动
					if (!this._cut_animation) {
						this._cut_animation = true;
					}
					this.setCutCenter();
				}, 1000)
				//清空之前的背景变化延迟函数并添加最新的
				clearTimeout(this.TIME_BG);
				this.TIME_BG = setTimeout(() => {
					if (this._flag_bright) {
						this._flag_bright = false;
					}
				}, 2000)
			},
			//移动中
			_moveDuring: function() {
				//清空之前的自动居中延迟函数
				clearTimeout(this.TIME_CUT_CENTER);
				//清空之前的背景变化延迟函数
				clearTimeout(this.TIME_BG);
				//高亮背景
				if (!this._flag_bright) {
					this._flag_bright = true;
				}
			},
			//监听器
			_watcher: function() {
				Object.keys(this).forEach(v => {
					this._observe(this, v, this.watch[v]);
				})
			},
			_observe: function(obj, key, watchFun) {
				var val = obj[key];
				Object.defineProperty(obj, key, {
					configurable: true,
					enumerable: true,
					set: (value) => {
						val = value;
						watchFun && watchFun(val, this);
					},
					get() {
						if (val &&
							'_img_top|img_left||width|height|min_width|max_width|min_height|max_height|export_scale|cut_top|cut_left|canvas_top|canvas_left|img_width|img_height|scale|angle|min_scale|max_scale'
							.indexOf(key) != -1) {
							let ret = parseFloat(parseFloat(val).toFixed(3));
							if (typeof val == "string" && val.indexOf("%") != -1) {
								ret += '%';
							}
							return ret;
						}
						return val;
					}
				})
			},
			_preventTouchMove: function() {},
			saveImg1: function(e) {
				this.$emit("saveImg", {})
			},
			cancelImg1: function(e) {
				this.$emit('cancelImg1', {})
			},
			resetImgPos: function() {
				this.$emit('resetImgPos', {})
			}
		}
	}
</script>

<style scoped src="./image-cropper.css">

</style>
