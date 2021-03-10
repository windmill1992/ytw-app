var request = require("../../../utils/request")
var app = getApp()
var setting = app.globalData.setting;
let listData = [
];
Page({
	data: {
		url: setting.url,
		size: 4,
		listData: [],
		listData2: [],
		isiphoneX: wx.getStorageSync('isiphoneX') || false,
		extraNodes: [
			{
				type: "after",
				dragId: "plus",
				slot: "plus",
				fixed: true
			}
		],
		pageMetaScrollTop: 0,
		scrollTop: 0,
		goodsTitle: '',//商品标题
		videoLocalSrc: '',//商品本地路径
		videoOnLineSrc: '',
		loadingSrc: '../../../images/drag_video.png',
		loadingVideo: false,//是否正在上传视频
		showGender: false,
		showAge: false,
		showFreightTemplate: false,
		isPublic: '1',
		isFreeShipping: '2',
		uploadFlag: true,
		ageRange:{ //建议年龄
			min: '',
			max: ''
		},
		specInfo:{
			spec_item_ms: '',
			spec_item_color:{
				price_text: '',
				price_ms_text: '',
				store_count: 0
			},
			freight_template:[]
		},
		goodsWeight: '',//商品重量
		genderActions: [
		],
		ageActions: [
		],
		attr_1: '',
		attr_2: '',
		cat_id1: '',
		cat_id2: '',
		cat_id3: '',
		template_id: 0,//运费模板id
		freightTemplateTxt: '',
		is_A: false,
		sortTxt: '排序',
		showSortTipsTxt: false,
		categoryValue: '',
		pId: 0,//获取分类时的父id  默认0  一级分类
		multiArray:[],  // 三维数组数据
		multiIndex:[0, 0, 0], // 默认的下标
		getcate: [0,0,0],
		step:0, // 默认显示请选择
		goods_id: 0,
		isFirstIn: true,//是否是首次进入
		isFirstIn2: true,//是否是首次进入
		isFirstIn3: true,//是否是首次init
		submitParams:{
			vipDate: ''
		},//要提交是数据
		maxDate: new Date(2023, 2, 31).getTime(),
		minDate: + new Date() + 86400000,
		showTimePicker: false,//是否展示时间选择
		imgType: 'a',//上传图片的类型
		detailValue: '',//商品详情描述
		isCopy: '',//是否是copy进来的
		curId: 0,//操作的id
		curId2: 0,//操作的id
	},
	onLoad(options) {
		this.drag = this.selectComponent('#drag');
		this.drag2 = this.selectComponent('#drag2');
		this.setData({
			goods_id: options.goods_id ? options.goods_id : 0,
			is_A: options.is_A,
			isCopy: options.isCopy || ''
		});

		 //如果是商品编辑  需要换地方
		this.getAttrSelect( options.goods_id || 0 )
		this.addEditGoods( options.goods_id || 0 ,false)
		if (options.goods_id == 0) { //不是编辑  请求分类
			this.getCategoryList()
		}
	},
	onShow:function(){
		if (this.data.isFirstIn) {
			this.setData({
				isFirstIn: false
			})
		} else {
			this.addEditGoods(this.data.goods_id,false)
		}
		if (this.data.loadingVideo) {
			wx.showLoading({
				title: '正在上传...',
				mask: true
			})
		}
	},
	sortEnd(e) {
		// console.log("sortEnd", e.detail.listData)
		this.setData({
			listData: e.detail.listData
		});
	},
	sortEnd2(e) {
		// console.log("sortEnd", e.detail.listData)
		this.setData({
			listData2: e.detail.listData
		});
	},
	change(e) {
		// console.log("change", e.detail.listData)
	},
	itemClick(e) {
		console.log(e);
	},
	toggleFixed(e) {
		let key = e.currentTarget.dataset.key;

		let {listData} = this.data;

		listData[key].fixed = !listData[key].fixed

		this.setData({
			listData: listData
		});

		this.drag.init();
		this.drag2.init();
	},
	add(e) {
		let listData = this.data.listData;
		var that = this
		if (e) {
			if (listData.length >= 10 || !this.data.uploadFlag) {
				return wx.showToast({
					title: '商品主图最多可选10张',
					icon: 'none'
				})
			}
		}
		this.setData({
			imgType: 'a'
		})
		var reg = /\.(jpeg|png|jpg)$/;
		wx.showActionSheet({
      itemList:['相册选取','拍照'],
      success:function(res){
        var i = res.tapIndex
        if (i===0) {
          wx.chooseImage({ //相册
            count: 10 - that.data.listData.length,
            sizeType:'compressed',
            sourceType:['album'],
            success:function(res){
              for (let i = 0; i < res.tempFilePaths.length; i++) {
								if (reg.test(res.tempFilePaths[i])) {
									that.uploadFile(res.tempFilePaths[i])
								}
								// wx.getImageInfo({
								// 	src: res.tempFilePaths[i],
								// 	success (res) {
								// 		console.log(res.width / res.height)
								// 		console.log(res)
								// 	}
								// })
              }
            }
          })
        } else {
          wx.chooseImage({//相机
            count:1,
            sizeType:"compressed",
            sourceType:['camera'],
            success:function(res){
              if (reg.test(res.tempFilePaths[0])) {
								that.uploadFile(res.tempFilePaths[0])
							}
            }
          })
        }
      }
		}) 

	},
	add2(e) {
		let listData2 = this.data.listData2;
		var that = this
		if (e) {
			if (listData2.length >= 50 || !this.data.uploadFlag) {
				return wx.showToast({
					title: '商品详情图最多可选50张',
					icon: 'none'
				})
			}
		}
		this.setData({
			imgType: 'b'
		})
		var reg = /\.(jpeg|png|jpg)$/;
		wx.showActionSheet({
      itemList:['相册选取','拍照'],
      success:function(res){
        var i = res.tapIndex
        if (i===0) {
          wx.chooseImage({ //相册
            count: 50 - that.data.listData2.length,
            sizeType:'compressed',
            sourceType:['album'],
            success:function(res){
							console.log(res)
              for (let i = 0; i < res.tempFilePaths.length; i++) {
								if (reg.test(res.tempFilePaths[i])) {
									that.uploadFile(res.tempFilePaths[i])
								}
              }
            }
          })
        } else {
          wx.chooseImage({//相机
            count:1,
            sizeType:"compressed",
            sourceType:['camera'],
            success:function(res){
              if (reg.test(res.tempFilePaths[0])) {
								that.uploadFile(res.tempFilePaths[0])
							}
            }
          })
        }
      }
		}) 
		

	},
	scroll(e) {
		this.setData({
			pageMetaScrollTop: e.detail.scrollTop
		})
	},
	// 页面滚动
	onPageScroll(e) {
		this.setData({
			scrollTop: e.scrollTop 
		});
	},
	uploadFile:function(src){
    const that = this
		that.setData({
			uploadFlag: false
		})
    wx.uploadFile({
      filePath: src,
      name: 'qinzi_imgs',
      url: that.data.url + '/api/newjoin/upload_qianzi_img',
      success:function(res){
        if(res.statusCode !== 200){
          return
        }
				var result = JSON.parse(res.data)
				console.log(result)
				if (that.data.curId2 != 0) {
					console.log(that.data.curId2)
					if (that.data.imgType == 'a') {
						let listData = that.data.listData
						var index =	listData.findIndex((item)=>{
							return item.dragId == that.data.curId2
						})
						if (index == -1) {
							return
						}
						listData[index].spec_img = result.result
						that.setData({
							listData: listData,
							uploadFlag: true,
							curId2: 0//操作完，清掉ID
						});
						that.drag.init();
					} else {
						let listData2 = that.data.listData2
						var index =	listData2.findIndex((item)=>{
							return item.dragId == that.data.curId2
						})
						if (index == -1) {
							return
						}
						listData2[index].spec_img = result.result
						that.setData({
							listData2: listData2,
							uploadFlag:true,
							curId2: 0//操作完，清掉ID
						});
						that.drag2.init();
					}
				
				} else { //不是换图
					if (that.data.imgType == 'a') {
						let listData = that.data.listData;
						listData.push({
							dragId: Math.random() + '',
							spec_img: result.result,
							fixed: false,
							isSpec: false,
							imgType: 'a'
						});
						that.setData({
							listData,
							uploadFlag: true
						});
						that.drag.init();
					} else {
						let listData2 = that.data.listData2;
						listData2.push({
							dragId: Math.random() + '',
							spec_img: result.result,
							fixed: false,
							isSpec: false,
							imgType: 'b'
						});
						that.setData({
							listData2,
							uploadFlag: true
						});
						that.drag2.init();
					}
				}

      }
    })
	},
	// 上传视频
	uploadVideo: function() {
		var that = this
    var that = this
    wx.chooseVideo({
			compressed: false,
      success: function(res) {
				if (res.size / 1024 / 1024 > 90) {
					return wx.showToast({
						title: '视频最大不能超过90M',
						icon: 'none'
					})
				}
        that.setData({
					videoLocalSrc: res.tempFilePath,
					loadingVideo: true //request.js 封装了hidde loading  onshow有请求  所以使用 true false 标识
				})
				that.uploadvideoRequest(res.tempFilePath)
      }
    })
	},
	delVideo:function(){
		this.setData({
			videoLocalSrc: '',
			videoOnLineSrc: '',
		})
	},
	uploadvideoRequest: function(src) {
		wx.showLoading({
			title: '正在上传...',
			mask: true
		})
		var that = this
    // var uploadPress = wx.uploadFile({
		wx.uploadFile({
      url: that.data.url + '/api/Store/videoUp?token=' + wx.getStorageSync("app:userInfo").token,
      method: 'POST',
			filePath: src,
      header: {
        'content-type': 'multipart/form-data'
      },
      name: 'file',//服务器定义的Key值
      success: function(res) {
				var result = JSON.parse(res.data)
				that.setData({
					videoOnLineSrc: result.url,
					loadingVideo: false
				},function(){
					wx.hideLoading()
				})
      },
      fail: function() {
				
				that.setData({
					videoLocalSrc: '',
					loadingVideo: false
				},function(){
					that.myToast('商品上传失败')
					wx.hideLoading()
				})
			},
			complete:function(){
				
			}
		})
		// uploadPress.onProgressUpdate(function(res){
		// 	console.log(res)
		// })
	},
	delItem:function(e){ //删除
		console.log(e.detail)
		if (e.detail.img == 'a') {
			let listData = this.data.listData
			var index =	listData.findIndex((item)=>{
				return item.dragId == e.detail.id
			})
			listData.splice(index,1)
			this.setData({
				listData: listData
			});
			this.drag.init();
		} else {
			let listData2 = this.data.listData2
			var index =	listData2.findIndex((item)=>{
				return item.dragId == e.detail.id
			})
			listData2.splice(index,1)
			this.setData({
				listData2: listData2
			});
			this.drag2.init();
		}
	},
	changeImg:function(e){ //修改图片操作
		var params = e.detail
		if (params.type) {
			this.setData({
				curId2: params.id
			},function(){this.add()})
		} else {
			this.setData({
				curId2: params.id
			},function(){this.add2()})
		}
	},
	setCategory:function(){
		wx.navigateTo({
			url: '/pages/goods/setAttr/setAttr?id1=' + this.data.getcate[0] + '&id2=' + this.data.getcate[1] + '&id3=' + this.data.getcate[2],
		})
	},
	ongenderSelect:function(e){//选择gender
		// console.log(e)
		this.setData({
			attr_1: e.detail.name
		})
	},
	onageSelect:function(e){//选择age
		console.log(e)
		this.setData({
			attr_2: e.detail.name
		})
	},
	onIsPublicChange:function(e){//全网展示与否
		// if (this.data.is_A == 0) {
		// 	return wx.showToast({
		// 		title: '功能研发中,敬请期待~~~',
		// 		icon: 'none'
		// 	})
		// }
		this.setData({
			isPublic: e.detail
		})
	},
	isFreeShippingChange:function(e){//是否包邮
		this.setData({
			isFreeShipping: e.detail
		})
	},
	onFreightTemplateSelect:function(e){//选择运费模板
		console.log(e)
		this.setData({
			template_id: e.detail.template_id,
			freightTemplateTxt: e.detail.template_name
		})
	},
	sortImg:function(){ //排序开关
		var listData = this.data.listData
		if (listData.length == 0) {
			return
		}
		// listData.forEach((item)=>{
		// 	item.fixed = !item.fixed
		// })
		this.setData({
			// listData,
			showSortTipsTxt: this.data.sortTxt == '排序' ? true : false,
			sortTxt: this.data.sortTxt == '排序' ? '完成' : '排序'
		})
	},
	goodsTitleInput:function(e){//商品标题输入
		var v = e.detail.value
		if ( v == '' || v.trim() == '' ) {
			v = ''
		} else {
			v = v.trim()
		}
		if (v.length > 60) {
			wx.showToast({
				title: '商品标题最多可以输入60个字',
				icon: 'none'
			})
		}
		this.setData({
			goodsTitle: v.substring(0,60)
		})
	},
	detailValueInput:function(e){
		this.setData({
			detailValue: e.detail.value
		})
	},
	proposalAgeInput:function(e){//建议年龄段输入框
		var type = e.currentTarget.dataset.type
		var v = e.detail.value
		console.log(e.detail.value)
		if (v != '') {
			if (v < 0 || v > 20 ) {
				wx.showToast({
					title: '年龄在0~20之间数字',
					icon: 'none'
				})
				v = type == 'min' ? 0 : 20
			}
			
		}
		if (type == 'min') {
			this.setData({
				ageRange: {
					min: v,
					max: this.data.ageRange.max
				}
			})
		} else {
			this.setData({
				ageRange: {
					min: this.data.ageRange.min,
					max: v
				}
			})
		}
	},
	proposalAgeBlur:function(e){
		// var that = this
		// var type = e.currentTarget.dataset.type
		// switch (type) {
		// 	case 'min':
		// 		if (that.data.ageRange.min >= that.data.ageRange.max && that.data.ageRange.max > 0) {
		// 			that.setData({
		// 				[`ageRange.min`]: 0
		// 			})
		// 		}
		// 		break;
		// 	case 'max':
		// 		if (that.data.ageRange.max <= that.data.ageRange.min && that.data.ageRange.min >0) {
		// 			that.setData({
		// 				[`ageRange.max`]: 20
		// 			})
		// 		}
		// 		break;
		// 	default:
		// 		break;
		// }
	},
	goodsWeightInput:function(e){ //商品重量输入

		var v = e.detail.value
		this.setData({
			goodsWeight: v
		})
	},
	onTimePickerConfirm:function(e){
		console.log(e.detail)
		var d = new Date(e.detail);
		var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		this.setData({
			showTimePicker: false,
			[`submitParams.vipDate`]: datetime
		})
	},
	sureSubmit:function(e){ //最终提交
		var that = this
		var list2 = this.data.listData2
		var str = '<p>'+ this.data.detailValue.trim() +'</p>'
		for (let i = 0; i < list2.length; i++) {
			str+= '<p><img src=\'' + list2[i].spec_img + '\' ></p>'
		}
		var type = e.currentTarget.dataset.type
		let { goodsTitle, listData, step, attr_1, attr_2, goodsWeight, specInfo,isFreeShipping , template_id, isPublic,cat_id1, cat_id2, cat_id3  } = this.data
		if (goodsTitle == '' || goodsTitle.trim() == '') {
			this.myToast('请填写商品标题')
			return
		} else if ( listData.length == 0 ) {
			this.myToast('商品主图至少上传一张')
			return
		} else if ( cat_id1 == '' || cat_id2 == '' || cat_id3 == '' ) {
			this.myToast('请选择商品分类')
			return
		} else if (attr_1 == '') {
			this.myToast('请选择适用性别')
			return
		} else if ( attr_2 == '' ) {
			this.myToast('请选择适用年龄')
			return
		} else if ( goodsWeight == '' || goodsWeight < 0 ) {
			this.myToast('请正确填写每手重量')
			return
		} else if ( specInfo.spec_item_color.price_text == '' ) {
			this.myToast('请添加商品规格')
			return
		}else if ( isPublic == -99 ) {
			this.myToast('请选择是否公开展示')
			return
		} else if (isPublic == 2) {
			if ( this.data.submitParams.vipDate == '' ) {
				this.myToast('请正确填写多少天后商品全网展示')
				return	
			}
		} else if ( isFreeShipping == 2 ) {
			if ( template_id == 0 ) {
				this.myToast('请选择运费模板')
				return	
			}
		}
		if (this.data.ageRange.min >= 0 && this.data.ageRange.max >= 0) {
			if ((this.data.ageRange.min - 0) > (this.data.ageRange.max - 0)) {
				console.log(this.data.ageRange.min,this.data.ageRange.max)
				return wx.showToast({
					title: '建议年龄必须从小到大(0-20)',
					icon: 'none'
				})
			}
		}
		var min = this.data.ageRange.min
		var max = this.data.ageRange.max
		if (this.data.ageRange.min == '' || this.data.ageRange.max == '') {
			min = ''
			max = ''
		}
		// var imgs = this.data.listData.map((item)=>{return item.spec_img})
		var imgs = []
		this.data.listData.forEach((item)=>{imgs.push(item.spec_img)})
		var imgStr = imgs.join(',')
		let params = {
			goods_name: this.data.goodsTitle,
			goods_id: this.data.goods_id,
			cat_id1: this.data.cat_id1,
			cat_id2: this.data.cat_id2,
			cat_id3: this.data.cat_id3,
			is_public_sell: this.data.isPublic,
			public_sell_time: this.data.submitParams.vipDate,
			goods_images:imgStr,
			video: this.data.videoOnLineSrc,
			weight: this.data.goodsWeight,
			is_free_shipping: this.data.isFreeShipping,
			template_id: this.data.template_id,
			attr_1: this.data.attr_1,
			attr_2: this.data.attr_2,
			sub_type: type == 'add' ? 1 : 2,
			goods_content: str,
			suggest_age_start: min - 0,
			suggest_age_end: max - 0
		}
		console.log(params)
		if (this.data.isFreeShipping == '1') {
			wx.showModal({
				content:'当前您选择的是"包邮"发布商品，是否确定？',
				success:function(res){
					if (res.confirm) {
						that.submitRequest(params)
					} else if (res.cancel) {
						
					}
				}
			})
		} else {
			that.submitRequest(params)
		}
		// return
		
	},
	submitRequest:function(params){
		var that = this
		request.post( that.data.url + '/api/Store/goodsSave',{
			data:params,
			success:function(res){
				console.log(res)
				if (res.data.status == 1) {
					wx.showToast({
						title: '操作成功！',
					})
					setTimeout(()=>{
						wx.navigateBack({
							delta: 1,
						})
					},1000)
				}
			}
		} )
	},
	myToast:function(t){//提示封装，避免代码一长串
		wx.showToast({
			title: t,
			icon: 'none'
		})
	},
	editSpec:function(e){//前往规格编辑
		var from = e.currentTarget.dataset.from
		wx.navigateTo({
			url: '/pages/goods/specSize/index?goods_id=' + this.data.goods_id + '&from=' + from,
		})
	},
	// 控件开关
	ongenderClose:function(){
		this.setData({ showGender: false })
	},
	ongenderShow:function(){
		this.setData({ showGender: true })
	},
	onageClose:function(){
		this.setData({ showAge: false })
	},
	onAgeShow:function(){
		this.setData({ showAge: true })
	},
	onFreightTemplateClose:function(){
		this.setData({ showFreightTemplate: false })
	},
	onFreightTemplateShow:function(){
		this.setData({ showFreightTemplate: true })
	},
	onTimePickerClose:function(){
		this.setData({ showTimePicker: false })
	},
	onTimePickerShow:function(){
		this.setData({
			showTimePicker: true
		})
	},
// 请求类目 三级分类
getCategoryList(){ // 获取1级
		var that = this
    request.get(that.data.url + '/api/Store/addStepOne',{
			data: {
				parent_id: 0
			},
			success:function(res){
				var provinceList = [...res.data.data]
				// console.log(res.data)
				var selectedId1 = ''
				var selectedIndex1 = ''
				var provinceArr = res.data.data.map((item,index) => { 
					if (item.id == that.data.getcate[0]) {
						selectedId1 = item.id
						selectedIndex1 = index
					}
					return item.name
				 }) 
				that.setData({
					multiArray: [provinceArr, [], []], // 更新三维数组 [['a', 'b'],[],[]]
					provinceList,   // 原始数据
					provinceArr,    // 所有的名称
					[`multiIndex[0]`] : selectedIndex1
				})
				var defaultCode = selectedId1 ? selectedId1 : that.data.provinceList[0].id  // 使用第一项当作参数获取2级数据
				if (defaultCode){
					that.setData({
						currnetProvinceKey: defaultCode  // 保存在当前的1级key
					})
					that.getCategoryList2(defaultCode)  // 获取2级数据
				}
			}
		})
  },
	getCategoryList2(code){ // 获取2级数据
		var that = this
    this.setData({
      currnetProvinceKey: code  // 保存当前选择的2级code
    })
    request.get(that.data.url + '/api/Store/addStepOne',{
			data:{
				parent_id: code
			},
			success:function(res){
				var selectedId2 = ''
				var selectedIndex2 = 0
				var cityArr = res.data.data.map((item,index) => { 
					if (item.id == that.data.getcate[1] && that.data.isFirstIn2 ) {
						selectedId2 = item.id
						selectedIndex2 = index
					}
					return item.name
				 })
				var cityList = [...res.data.data]
				that.setData({
					multiArray: [that.data.provinceArr, cityArr, []],  // 更新三维数组 更新后长这样 [['a', 'b'], ['aa'], []]
					cityList,  // 保存下2级原始数据
					cityArr,  // 2级所有的名称
					[`multiIndex[1]`] : selectedIndex2
				})
				var defaultCode = selectedId2 ? selectedId2 : that.data.cityList[0].id  // 用第一个获取3数据
				if (defaultCode){
					that.setData({
						currnetCityKey: defaultCode  // 存下当前选择的2级KEY
					})
					that.getCategoryList3(defaultCode) // 获取3级数据
				}
			}
		})
  },
  getCategoryList3(code){ //获取3级
		var that = this
    this.setData({
      currnetCityKey: code // 更新当前选择的2级key
    })
    request.get(that.data.url + '/api/Store/addStepOne',{
			data:{
				parent_id: code
			},
			success:function(res){
				var selectedIndex3 = 0
				var storeList = [...res.data.data]
				var storeArr = res.data.data.map((item,index) => { 
					if (item.id == that.data.getcate[2] && that.data.isFirstIn2 ) {
						selectedIndex3 = index
					}
					return item.name
				})
				that.setData({
					multiArray: [that.data.provinceArr, that.data.cityArr, storeArr],  // 重新赋值三级数组 此时的数组大概是这样 [['a', 'b'], ['aa'], ['aaa','bbb']]
					storeList,  // 保存下3级原始数据
					storeArr,    // 保存3级名称，可以不保存
					[`multiIndex[2]`] : selectedIndex3,
					isFirstIn2: false,
					step: that.data.getcate[2] > 0 ? 1 : 0
				})
			}
		})
  },
  columnchange(e){  // 滚动选择器 触发的事件
    var column = e.detail.column  // 当前改变的列
    var data = {  
      multiIndex: JSON.parse(JSON.stringify(this.data.multiIndex)),
      multiArray: JSON.parse(JSON.stringify(this.data.multiArray))
    }
    data.multiIndex[column] = e.detail.value;  // 第几列改变了就是对应multiIndex的第几个，更新它
    switch(column){ // 处理不同的逻辑
      case 0:   // 第一列更改 就是1级的更改
        var currentProvinceKey = this.data.provinceList[e.detail.value].id  
        if (currentProvinceKey != this.data.currnetProvinceKey){  // 判断当前的key是不是真正的更新了
          this.getCategoryList2(currentProvinceKey)  // 获取当前key下面的市级数据
        }
        
        data.multiIndex[1] = 0  // 将2级默认选择第一个
        break;
      
      case 1:  // 2级发生变化
        var currentCitykey = this.data.cityList[e.detail.value].id
        if (currentCitykey != this.data.currnetCityKey){  // 同样判断
          this.getCategoryList3(currentCitykey)   // 获取3级
        }
        data.multiIndex[2] = 0  // 3级默认为第一个
        break;
    }
    this.setData(data)  // 更新数据
  },
  pickchange(e){  
    this.setData({
      step: 1,  // 更新，用来选择用户选中的3级分类
      multiIndex: e.detail.value  // 更新下标字段
    })
  },
	// =======
	getAttrSelect:function(id){
		var that = this
		request.get( that.data.url + '/api/Store/getAttrSelect', {
			data: {
				goods_id: id
			},
			success:function(res){
				console.log(res)
				var genderActions = res.data.data[0].attr_value.map((item)=>{
					return {
						name: item,
						id: 2
					}
				})
				var ageActions = res.data.data[1].attr_value.map((item)=>{
					return {
						name: item
					}
				})
				that.setData({
					genderActions,
					ageActions
				})
			}
		} )
	},
	addEditGoods:function(id,hascb){
	
		var that = this
		request.get( that.data.url + '/api/Store/addEditGoods', {
			data: {
				goods_id: id
			},
			success:function(res){
				let srcArr = []
				var data = res.data.data

				data.freight_template.forEach((item)=>{
					item.name = item.template_name
				})
				if (data.freight_template.length == 0 ) {
						data.freight_template.push({
							name: '暂无运费模板，可前往电脑端添加',
							template_id: 0
					})
				}
				var imgs = []
				if (data.goodsImages) {
					data.goodsImages.forEach((item,index)=>{
						imgs.push({
							dragId: Math.random() + '',
							spec_img: item.image_url,
							fixed: false,
							isSpec: false,
							imgType: 'a'
						})
					})
				}
				if (that.data.goods_id > 0 && that.data.isFirstIn3) {
					if (data.goodsInfo) {
						var xiao = '&lt;'
						var da = '&gt;'
						var content = data.goodsInfo.goods_content.replace(new RegExp(xiao,'g'),'<').replace(new RegExp(da,'g'),'>')
						let imgReg = /<img.*?(?:>|\/>)/gi 
						let srcReg = /src=[\'\']?([^\'\']*)[\'\']?/i 
						let arr = content.match(imgReg)
						if (arr) {
							for (let i = 0; i < arr.length; i++) {
								let src = arr[i].match(srcReg)
								// 获取图片地址 src[1]
								srcArr.push({
									dragId: Math.random() + '',
									spec_img: src[1],
									fixed: false,
									isSpec: false,
									imgType: 'b'
								})
							}
						}
					}
					that.setData({
						specInfo: data,
						goodsTitle: data.goodsInfo.goods_name,
						listData: imgs,
						listData2: srcArr,
						videoOnLineSrc: data.goodsInfo.video,
						getcate: [data.goodsInfo.cat_id1,data.goodsInfo.cat_id2,data.goodsInfo.cat_id3],
						cat_id1: data.goodsInfo.cat_id1,
						cat_id2: data.goodsInfo.cat_id2,
						cat_id3: data.goodsInfo.cat_id3,
						goodsWeight:data.goodsInfo.weight,
						[`ageRange.min`]:data.goodsInfo.suggest_age_start,
						[`ageRange.max`]:data.goodsInfo.suggest_age_end,
						template_id:data.goodsInfo.template_id || data.freight_template[0].template_id,
						freightTemplateTxt: data.freight_template ? data.freight_template[0].template_name : '',
						isPublic: that.data.isCopy == 'copyA' ? '-99' :( data.goodsInfo.is_public_sell == 0 ? '2' : data.goodsInfo.is_public_sell + ''),
						[`submitParams.vipDate`]: data.goodsInfo.public_sell_time  ? data.goodsInfo.public_sell_time : '',
						isFreeShipping: data.goodsInfo.is_free_shipping == 1 ?  '1' : '2',
						freightTemplateTxt: data.goodsInfo.is_free_shipping == 1 ? '' : data.freight_template[0].template_name || '',
						attr_1: data.goods_attr[0] ? data.goods_attr[0].attr_value : '',
						attr_2: data.goods_attr[1] ? data.goods_attr[1].attr_value : '',
						isFirstIn3: false,
						curId: 0
					})
					that.getCategoryList()
					if (imgs.length > 0 || srcArr.length > 0) {
						setTimeout(()=>{
							that.drag.init()
							that.drag2.init()
						},500)
					}
				} else { 
					that.setData({
						specInfo: data,
						freightTemplateTxt: data.freight_template[0].template_name || '',
						curId: 0,
						template_id: data.freight_template[0].template_id
					})
					that.drag.init()
					that.drag2.init()
				}
				if (that.data.loadingVideo) {
					wx.showLoading({
						title: '正在上传...',
						mask: true
					})
				}
				 
			}

		} )
	},
	pTu:function(e){//p图
		this.setData({
			curId: e.detail.dragId
		})
		var src = e.detail.spec_img
		if (src.indexOf('http:')!= -1) {
			src = src.replace("http:",'https:')
		}
		wx.navigateTo({
			url: '/pages/goods/tailoring/tailoring?src=' + src + '&img_type=' + e.detail.imgType,
		})
	}

})
