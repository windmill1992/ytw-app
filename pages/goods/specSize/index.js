
var request = require("../../../utils/request")
var app = getApp() 
var setting = app.globalData.setting;
let listData = [
];

Page({
	data: {
		url: setting.url,
		isiphoneX: wx.getStorageSync('isiphoneX') || false,
		size: 3,
		listData: [],
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
		curId: 0,//编辑换图的id
		btnTxt: '排序',//排序按钮文字
		showSortTipsTxt: false,
		specSize: '',//每手几件
		goods_id: 0,//默认操作的商品id是0
		isFirst: true,
	},

	sortEnd(e) {
		console.log("sortEnd", e.detail.listData)
		this.setData({
			listData: e.detail.listData
		});
	},
	change(e) {
		// console.log("change", e.detail.listData)
	},
	sizeChange(e) {
		wx.pageScrollTo({scrollTop: 0})
		this.setData({
			size: e.detail.value
		});
		this.drag.init();
	},
	itemClick(e) {
		// console.log(e);
	},
	toggleFixed(e) {
		let key = e.currentTarget.dataset.key;

		let {listData} = this.data;

		listData[key].fixed = !listData[key].fixed

		this.setData({
			listData: listData
		});

		this.drag.init();
	},
	add(e) {
		console.log(e)
		if (e) {
			this.setData({
				curId: ''
			})
			if (this.data.listData.length >= 120) {
				return wx.showToast({
					title: '商品规格最多添加120种',
					icon: 'none'
				})
			}
		}
		
		var that = this
		wx.showActionSheet({
      itemList:['相册选取','拍照'],
      success:function(res){
        var i = res.tapIndex
        if (i===0) {
          wx.chooseImage({ //相册
            count: 120 - that.data.listData.length,
            sizeType:'compressed',
            sourceType:['album'],
            success:function(res){
              console.log(res)
              for (let i = 0; i < res.tempFilePaths.length; i++) {
                that.uploadFile(res.tempFilePaths[i])
              }
              
            }
          })
        } else {
          wx.chooseImage({//相机
            count:1,
            sizeType:"compressed",
            sourceType:['camera'],
            success:function(res){
              that.uploadFile(res.tempFilePaths[0])
            }
          })
        }
      }
    })

	},
	uploadFile:function(src){//向服务器传图
    const that = this
    wx.uploadFile({
      filePath: src,
      name: 'qinzi_imgs',
      url: that.data.url + '/api/newjoin/upload_qianzi_img',
      success:function(res){
        if(res.statusCode !== 200){
          return
        }
        var result = JSON.parse(res.data)
				// console.log(result.result)
				if (that.data.curId != 0) { // 有id 则是换图
					let listData = that.data.listData
					var index =	listData.findIndex((item)=>{
						return item.dragId == that.data.curId
					})
					if (index == -1) {
						return
					}
					listData[index].spec_img = result.result
					that.setData({
						listData: listData,
						curId: 0//操作完，清掉ID
					});
					that.drag.init();
					return
				}
				let listData = that.data.listData;
				listData.push({
						dragId: Math.random() + '',
						spec_name: "",
						spec_img: result.result,
						fixed: false,
						hasGoods: true,
						store_count: 500, 
						price: '',
						isSpec: true,
						imgType: 'a'
				});
				that.setData({
					listData,
				},()=>{that.drag.init();});
				
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
	onLoad(options) {
		this.drag = this.selectComponent('#drag');
			this.setData({
				// listData: listData,
				goods_id: options.goods_id ? options.goods_id : 0
			},()=>{this.getSpecItem()});//根据id获取规格信息
			// this.drag.init();
		
	},
	delItem:function(e){ //删除
		// console.log(e.detail)
		let listData = this.data.listData
	  var index =	listData.findIndex((item)=>{
			return item.dragId == e.detail.id
		})
		// console.log(index)
		listData.splice(index,1)
		this.setData({
			listData: listData
		});
		this.drag.init();
	},
	editSpec:function(e){ //编辑规格
		// console.log(e.detail)
		var v = e.detail.value.trim()
		var id = e.detail.id
		let listData = this.data.listData
		var num = 0
		var index =	listData.findIndex((item)=>{
			return item.dragId == id
		})
		listData.forEach((item,index2)=>{
			if (item.spec_name == v && index != index2) {
				num++
			}
		})
		if (num > 0) {
			v = ''
			wx.showToast({
				title: '规格名称不能重复!',
				icon: 'none'
			})
		}

		listData[index].spec_name = v
		this.setData({
			listData: listData
		});
		this.drag.init();
	},
	changeImg:function(e){//换图
		// console.log(e)

		var id
		if (e.currentTarget.dataset.from) { //判断是从上面点击的换图还是下面点击的
			id = e.currentTarget.dataset.id
		} else {
			id = e.detail
		}
		console.log(id)
		this.setData({
			curId: id
		},function(){
			this.add()
		})
		// wx.previewImage({
		// 	urls: [ e.currentTarget.dataset.img ],
		// })
	},
	changeImg2:function(e){//
		wx.previewImage({
			urls: [ e.currentTarget.dataset.img ],
		})
	},
	onHasGoodsChange:function(e){ //更改是否有货
		console.log(e)
		var id = e.currentTarget.dataset.id
		let listData = this.data.listData
		var index =	listData.findIndex((item)=>{
			return item.dragId == id
		})
		listData[index].hasGoods = !listData[index].hasGoods
		listData[index].store_count = listData[index].hasGoods ? listData[index].store_count : 0
		this.setData({
			listData: listData,
			// [`listData[${index}].store_count`]: ''
		}); 
	},
	editItemInputChange:function(e){//编辑库存 价格
		var id = e.currentTarget.dataset.id
		var type = e.currentTarget.dataset.type
		let listData = this.data.listData
		console.log(e.detail.value)
		
		var index =	listData.findIndex((item)=>{
			return item.dragId == id
		})
		if (type == 'sum') {
			if (e.detail.value < 0 && listData[index].hasGoods) {
				 wx.showToast({
					title: '有货的商品，库存至少为1',
					icon: 'none'
				})
				listData[index].store_count = 1
			} else {
				listData[index].store_count = e.detail.value
			}
		} else {
			if (e.detail.value < 0) {
				 wx.showToast({
					title: '商品价格不能低于0',
					icon: 'none'
				})
				listData[index].price = 0
			} else {
				listData[index].price = e.detail.value
			}
		}
		this.setData({
			listData: listData
		})
	},
	sureSubmit:function(){ //确定提交
		var listData = this.data.listData
		var indexA = ''
		var flag = true
		listData.forEach((item,index)=>{
			if (item.store_count == '') {
				item.store_count = 0
			}
			if ( item.price == '' || item.spec_img == '' || item.spec_name == '' || item.spec_img.trim() == '' || item.spec_name.trim() == '') {
				indexA = index
				flag = false
			}
			if (item.store_count - 0 == 0 && item.hasGoods) {
				flag = false
				indexA = index
			}
		})
		if (!flag) {
			return wx.showToast({
				title: '请将第' + (indexA - 0 + 1) + '项商品规格填写完整',
				// title: '请将商品规格填写完整',
				icon: 'none'
			})
		} else {
			// 根据需求  整理需要提交的数据
			if (this.data.specSize == '' || this.data.specSize > 12 || this.data.specSize < 1 ) {
				return wx.showToast({
					title: '请正确填写每手几件 1~12之间',
					icon: 'none'
				})
			}
			// console.log(JSON.stringify(listData))
			// return
			this.addSpecItem(JSON.stringify(listData))

		}

	},
	// 提交确定的请求额外抽离出来
	addSpecItem:function(spec_data){
		var that = this
		request.post( that.data.url + '/api/Store/addSpecItem', {
			data:{
				spec_data: spec_data,
				goods_id: that.data.goods_id,
				spec_ms: that.data.specSize
			},
			success:function(res){
				console.log(res)
				if (res.data.status == 1) {
					wx.navigateBack({
						delta: 1,
					})
				}
			}
		} )
	},
	triggleSort:function(){//排序/完成切换
		var listData = this.data.listData
		if (listData.length < 1) {
			return
		}
		this.setData({
			showSortTipsTxt: this.data.btnTxt == '排序' ? true : false,
			btnTxt: this.data.btnTxt == '排序' ? '完成' : '排序'
		})
	},
	specSizeInput:function(e){//每手几件
		var num = e.detail.value
		if (num == '') {
			this.setData({
				specSize: num
			})
			return
		}
		if (isNaN(num)) {
			wx.showToast({
				title: '每手几件必须为正整数1~12之间',
				icon: 'none'
			})
			num = 1
		}
		if ( num<0 ) {
			num = 1
			wx.showToast({
				title: '每手几件最低为1',
				icon: 'none'
			})
		} else if( num > 12 ) {
			num = 12
			wx.showToast({
				title: '每手几件最大为12',
				icon: 'none'
			})
		}
		this.setData({
			specSize: Math.ceil(num)
		})
	},
	getSpecItem:function(){ //获取已有的规格数据
		// return
		var that = this
		request.get( that.data.url + '/api/Store/getSpecItem', {
			data:{
				goods_id: that.data.goods_id
			},
			success:function(res){
				var listData = res.data.data.color || []
				listData.forEach((item,index)=>{
					item.dragId = Math.random() + ''
					console.log(item.dragId)
					item.isSpec = true
					item.fixed = false
					item.hasGoods = item.store_count > 0 ? true : false
					// item.store_count = item.store_count > 0 ? item.store_count : 9999
					item.spec_name = item.item_value
				})
				// console.log(listData)
				// return
				that.setData({
					listData: listData,
					specSize: res.data.data.msjj || ''
				},function(){that.drag.init()})
			}
		} )
	},
	pTu:function(e){//p图
		console.log(e)
		this.setData({
			curId: e.detail.dragId
		})
		var src = e.detail.spec_img
		if (src.indexOf('http:')!= -1) {
			src = src.replace("http:",'https:')
		}
		wx.navigateTo({
			url: '/pages/goods/tailoring/tailoring?src=' + src + '&img_type=c',
		})
	},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		if (this.data.isFirst == true) {
			this.setData({
				isFirst: false
			})
		} else {
			this.drag.init()
		}
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
		 
  }
})