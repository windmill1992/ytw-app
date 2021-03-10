var app = getApp();
var request = app.request;
var setting = app.globalData.setting;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: setting.url,
    sort: 'collect_sum',//type 默认人气
    sort_asc: 'asc',//默认正序
    showList:[],//需要展示出来的
    openSpecModal: false, //是否打开规格弹窗
    requestData: null,//获取筛选的数据  只是放放而已
    flall: false,
    sqall: false,
    flall: false,
    tipsmask: false,
    requestUrl: '',
    filterData: {},
    urlObj: {
      id:'id/0',
      store_business:'store_business/0',
      dong: [] 
  },
    p: 1,
    showDownLoad: false,//是否展示下载图片进度
    cur: 0,//当前下载
    sum: 0,//总共数量
    countsum: 0,//百分比
    adv_url: '',//广告链接
    adv_images: '',//顶部图片
    showTips: false,//提示信息展示
    searchTxt: '',//搜索请求时的
    doSearchTxt: '',//搜索
    searchButtonTxt: '搜索',//默认搜索框后面是搜索文字
    isShowLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo('collect_sum','',1,'','')//默认进来加载人气
    this.getSpec()
  },
  reSearch:function(e){//切换选择
    console.log(e.currentTarget.dataset.type)
    //return
   
    var type = e.currentTarget.dataset.type
    if (type == 'keyWord') {
        if( this.data.doSearchTxt == '' ){
          wx.showToast({
            title: '请输入厂家名关键字',
            icon: 'none'
          })
          return
        }
        this.resetP()
        this.setData({
          searchTxt: this.data.doSearchTxt,
          isShowLoading: true
        },function(){
          this.getInfo('collect_sum',this.data.sort_asc,1,'',this.data.searchTxt)
        })
        return
    }
     this.resetP()
    this.setData({
      sort: type,
      isShowLoading: true
    },function(){
      this.getInfo(type,'asc',1,'',this.data.searchTxt)
    })
  },
  getInfo:function(sort,sort_asc,p,url,store_name){ // 调取数据
    var that = this
    request.get( that.data.url + '/api/WeChatMerchants/goodsListDetail' + url,{
      data:{
        sort,
        sort_asc,
        p,
        store_name: store_name
      },
      success:function(res){
        // console.log(res)
        if (res.data.status == 1) {
          that.setData({
            showList: that.data.showList.concat(res.data.result.goods_list),
            adv_url: res.data.result.adv_url,
            adv_images: res.data.result.adv_images,
            isShowLoading: false
          })
        }
      }
    } )
  },
  resetP:function(){ //重置数据
    this.setData({
      p: 1,
      showList: [],
      requestUrl: ''
    })
  },
  getSpec:function(){
    var that = this
    request.get( that.data.url + '/api/goods/goodsList',{
      data:{
        type: 1
      },
      success:function(res){
        // console.log(res)
        if (res.data.status == 1) {

          // ===抽离出属性信息 增加是否选中的flag===
    
            var oobj = {}
          oobj.sex = res.data.result.filter_attr[0].item.map((item,index)=>{
              item.check = false
              return item
          })
          oobj.sex.unshift({
            name: '全部',
            href: 'empty1',
            check: false
        })
        oobj.age = res.data.result.filter_attr[1].item.map((item,index)=>{
            item.check = false
            return item
        })
        oobj.age.unshift({
          name: '全部',
          href: 'empty2',
          check: false
      })
        that.setData({
            filterData: oobj,
            isFirst: false
        })



          that.setData({
            requestData: res.data.result
          })
        }
      }
    } )
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
    // var requestUrl = this.data.requestUrl ? this.data.requestUrl : ''
        switch (this.data.sort) {
        case 'collect_sum':
          this.setData({
            p: this.data.p - 0 + 1,
            isShowLoading: true
          },function(){
            this.getInfo('collect_sum',this.data.sort_asc,this.data.p,this.data.requestUrl,this.data.searchTxt)
          })
          break;
      
        case 'sales_sum':
          this.setData({
            p: this.data.p - 0 + 1,
            isShowLoading: true
          },function(){
            this.getInfo('sales_sum',this.data.sort_asc,this.data.p,this.data.requestUrl,this.data.searchTxt)
          })
          break;
        case 'shop_price':
          this.setData({
            p: this.data.p - 0 + 1,
            isShowLoading: true
          },function(){
            this.getInfo('shop_price',this.data.sort_asc,this.data.p,this.data.requestUrl,this.data.searchTxt)
          })
          break;
        case 'is_new':
          this.setData({
            p: this.data.p - 0 + 1,
            isShowLoading: true
          },function(){
            this.getInfo('is_new',this.data.sort_asc,this.data.p,this.data.requestUrl)
          })
          break;
      }
  },
  shareGoods:function(e){ //下载图片
    if (!wx.getStorageSync('wx_user_info')) {
      app.getUserInfo(function (userInfo) {
        that.setData({ userInfo: userInfo, click :false });
      }, true, false);
      return false;
  }
    
    var info =  e.currentTarget.dataset.info
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 接口调用询问  
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveImg(info)
            },
            fail() {
              // 用户拒绝了授权  
              wx.showModal({
                title: '保存图片',
                content: '保存图片需要您授权',
                showCancel: false,
                confirmText: '确定',
                success: function (res) {
                  if (res.confirm) {
                    // 打开设置页面  
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting['scope.writePhotosAlbum']) {
                          that.saveImg(info)
                        } else {
                          console.log("授权失败");
                        }
                      },
                      fail: function (data) {
                        console.log("openSetting: fail");
                      }
                    });
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        } else {
          that.saveImg(info)
        }
      },
      fail(res) {
        console.log(res);
      }
    })
 
    return
  },
  saveImg:function(info){//
    var that = this
    // console.log(info)
    this.setData({
      showDownLoad: true,
      cur: 1,
      sum: info.goods_images.length
    })
    for (let i = 0; i < info.goods_images.length; i++) {
      let fileName = new Date().valueOf();
      let filePath = wx.env.USER_DATA_PATH + '/' + fileName + '.jpg'
        wx.downloadFile({//下载图片 
          url: 'https://' + info.goods_images[i].split('//')[1],
          filePath: filePath,
          success:function(res){
            // console.log(filePath)
            wx.saveImageToPhotosAlbum({ //保存到手机
              filePath: filePath,
              success:function(res2){
                console.log(res2)
                let fileMgr = wx.getFileSystemManager()
                fileMgr.unlink({
                  filePath: filePath,
                  success(){
                  }
                })
                console.log('ok')
                that.setData({ 
                  cur: i + 1,
                  countsum: parseInt((i + 1) / info.goods_images.length * 100)
                })
                if (i + 1 == info.goods_images.length) { //都保存完之后 设置粘贴板内容
                  var copyTxt = info.goods_name + '\n' + '【'+ info.goods_attr[0].attr_name +'】：' + info.goods_attr[0].attr_value + '\n' + '【'+ info.goods_attr[1].attr_name +'】：' + info.goods_attr[1].attr_value + '\n' + '【货号颜色】：多款多色'
                  
                  wx.setClipboardData({ //设置粘贴板内容
                    data: copyTxt,
                    success (res) {
                      wx.hideToast();
                      wx.showModal({
                        title: '提示',
                        content: '图片已下载到手机，文案也复制成功，您可以到朋友圈发布商品啦~~',
                        success (res) {
                          console.log(res,'ok')
                        }
                      })
                      // wx.getClipboardData({
                      //   success: (option) => {
                          
                      //   },
                      // })
                      that.setData({
                        showDownLoad: false
                      })
                    }
                  })
                }
              },
              fail:function(saveFail){
                console.log(saveFail)
              }
            })
          },
          fail:function(resfail){
            console.log(resfail)
          }
        })

    }
  },
  toGoodsList:function(e){ //查看详情
    var goods_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + goods_id,
    })
  },
  toStore:function(e){//前往店铺
    var store_id = e.currentTarget.dataset.storeid
    wx.navigateTo({
      url: '/pages/store/index/index?store_id=' + store_id,
    })
  },
  showImage:function(e){//点击图片预览当前商品图片
    var imgs = e.currentTarget.dataset.img
    var current = e.currentTarget.dataset.current
    // console.log(current,imgs)
    wx.previewImage({
      current: current,
      urls: imgs,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  closeFilterModal: function () {
    this.setData({ openFilterModal: false });
},
    /** 商品筛选 */
    filterGoods: function (e) {
      var href = e.currentTarget.dataset.href
      var type = e.currentTarget.dataset.type
      var filterData1 = this.data.filterData

      var obj = this.data.urlObj
      if (type == 'jing1') {//判断点击的筛选项目 做不同处理
          if (e.currentTarget.dataset.sq == 2) {
              this.setData({
                  flall: true
              })
          } else {
              if ( href == obj.id ) {
                  obj.id = 'id/0'
                  this.setData({
                      urlObj: obj,
                      flall: true 
                  })
                  return
              }
              this.setData({
                  flall: false
              })
          }
          obj.id = href
          this.setData({
              urlObj: obj 
          })
      } else if (type == 'jing2') {
          if (e.currentTarget.dataset.sq == 2) {
              this.setData({
                  sqall: true
              })
          } else {
              if ( href == obj.store_business ) {
                  obj.store_business = 'store_business/0'
                  this.setData({
                      urlObj: obj,
                      sqall: true 
                  })
                  return
              }
              this.setData({
                  sqall: false
              })
          }
          obj.store_business = href
          this.setData({
              urlObj: obj 
          })
      }else {
        var index = obj.dong.indexOf(href)
        var index2 = e.currentTarget.dataset.index
        if (type == 'dong1') {
            if (href == 'empty1') {
                if (!filterData1.sex[0].check) {
                    obj.dong = obj.dong.filter((item,index2)=>{
                        if (item[0]!=1) {
                            return item
                        }
                    })
                    for (let i = 0; i < filterData1.sex.length; i++) {
                        filterData1.sex[i].check = false
                    }
                    filterData1.sex[0].check = true
                }
            } else {
                if (index == -1) {
                    obj.dong.push(href)
                } else {
                    
                    obj.dong.splice(index,1)
                }
                filterData1.sex[0].check = false
                filterData1.sex[index2].check = !filterData1.sex[index2].check
            }
            
        } else {
            if (href == 'empty2') {
                if (!filterData1.age[0].check) {
                    obj.dong = obj.dong.filter((item,index2)=>{
                        if (item[0]!=2) {
                            return item
                        }
                    })
                    for (let i = 0; i < filterData1.age.length; i++) {
                        filterData1.age[i].check = false
                    }
                    filterData1.age[0].check = true
                }
            } else {
                if (index == -1) {
                    obj.dong.push(href)
                } else {
                    
                    obj.dong.splice(index,1)
                }
                filterData1.age[0].check = false
                filterData1.age[index2].check = !filterData1.age[index2].check
            }
            
        }
        

        this.setData({
            urlObj: obj,
            filterData: filterData1,
        })
      }
      return
  },
  // 重置筛选
  resetSearch:function(){
    var filterData = this.data.filterData
    filterData.sex = filterData.sex.map((item,index)=>{
        item.check = false
        return item
    })
    filterData.age = filterData.age.map((item,index)=>{
        item.check = false
        return item
    })
    this.setData({
        urlObj: {
            id:'id/0',
            store_business:'store_business/0',
            dong: [ ]
        },
        filterData: filterData
    })
},
searchGoods:function(){
  var urlObj = this.data.urlObj
  var requestUrl = '/'
  requestUrl += urlObj.id + '/' + urlObj.store_business
  if (urlObj.dong.length>0) {
      requestUrl += '/attr/'
      requestUrl += urlObj.dong.join('@')
  }
  console.log(requestUrl)
 
  this.resetP();
  this.setData({
    requestUrl: requestUrl,
    isShowLoading: true
  })
  this.getInfo(this.data.sort,this.data.sort_asc,1,requestUrl,this.data.searchTxt)
  this.setData({ openFilterModal: false });
},
openFilterModal: function () {
  this.setData({ openFilterModal: true });
},

closeFilterModal: function () {
  this.setData({ openFilterModal: false });
},
// 回到顶部
toTop:function(){
  wx.pageScrollTo({
    scrollTop: 0
  });
},
toAddGoodsOrStore:function(e){
  if (e.currentTarget.dataset.url == '' || e.currentTarget.dataset.url == 'tips') {
    this.setData({ showTips: true });
    return
  }
  wx.navigateTo({
    url: e.currentTarget.dataset.url,
  })
},
showTips:function(){
  this.setData({
    showTips: true
  })
},
onClickHide() {
  this.setData({ showTips: false });
},
searchTxtChange:function(e){
  this.setData({
    doSearchTxt: e.detail
  })
},
clearSearch:function(){
  this.setData({
    searchTxt: '',
    isShowLoading: true
  },function(){
    this.resetP()
    this.getInfo('collect_sum','asc',1,'','')
  })
}
})