var app = getApp();
var common = require('../../../utils/common.js');
var request = require("../../../utils/request")
var setting = app.globalData.setting;
var operations = [
  {
    name: '默认',
    index: '0'
  },
  {
    name: '已送齐',
    index: '1'
  },
  {
    name: '未送齐',
    index: '2'
  },
  {
    name: '全部打包',
    index:6
  },
  {
    name: '部分打包',
    index: 7
  },
  {
    name: '全部拉包',
    index: '3'
  },
  {
    name: '部分拉包',
    index: '4'
  },
  {
    name: '已取消',
    index: '5'
  },
]

Page({ 
  data: {
    bottomPosition: 'bottom:0rpx;',
    url: setting.url,
    order_id: '',
    operations,
    factory: [],
    orderDetail: {factory: []},
    curIndex: '',//当前被操作的厂家的索引 
    showMsgCancel: false,
    showMsgTxt1: '',
    editParams:{},//操作对应需要提交的参数
    btnTxt1: '取消预约',
    btnTxt2: '返回修改',
    editUrl: 'cancelOrder',
    showCancelXieyi: false,
    voucherInfo: null,
    shouldVoucherShow: false,
    showBtns: false,//白底的按钮
    showBtns2: false,//白底的按钮
    shareMsgInfo: null,//分享时的数据收集
    share_btn: false,
    showShare: false,
    share_pic: '',
    evaluateV1: 5, //评价星星
    evaluateV2: 5,
    evaluateV3: 5,
    showEvaluate: false,
    showAddFactory: false,
    showAddFactory: null,
    addFactoryTempList: [],
    isFirst: true,
    seeLogFlag: false,
    factoryLogInfo: null,
    modifyPopupFlag: false,
    modifyRecordInfo: null,
    curManufactorName: '',
    correctNum: '',
    modifyNameDisabled: false,//修改厂名的禁用与否
    btnList: [
      {name: '微信催促', style: 'background-color:#18c2ba;color:#fff;',openType: 'share',type: 'share'},
      {name: '电话催促', style: 'background-color:#fff;color:#18c2ba;border:1rpx solid #18c2ba;',openType: '', type: 'call'}
    ],
    curTel: '',
    showInfo: false,
    sortType:[false,false,false,false],
    showMask2: false,
    showMask3: false,
    showScreen: false,
    showScreen2: false,
    showType: 0,
    cancelItemTxt: '取消该厂家',
    centerFacName: '',
    posterId: '',
    inherit_num: '',
    facRemark: '',
    orderOperations: [
      {
        name:'预约信息',
        css: '',
        index: 'yyxx'
      },
      {
        name: '联系拼包中心',
        css: '',
        index: 'call'
      },
    ],
    shouldVoucherShowType: '',
    calculation_receive_num: 0,//计算得出的收货数
    calculation_take_num: 0,//计算得出的拉走数
    hasInherit: false,//是否有结余的
  },
  onLoad: function (options) {
    this.setData({
      order_id: options.order_id,
      bottomPosition: wx.getStorageSync('isiphoneX') ? 'bottom:12rpx;' : 'bottom:0rpx;'
    },function(){this.getDetail()})

  },
  getDetail(){ //获取详情
    var that = this
    request.get(that.data.url + '/api/pinbao/getOrderDetails', {
      data: {
        order_id: that.data.order_id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var s = res.data.result.order.order_status > 5 ? 9 : 0
          that.setData({
            orderDetail: res.data.result,
            factory: that.doSwitch(s,res.data.result.factory),
            showType: s == 9 ? 5 : 0
          })
        }
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  operationBtn(e){ //下部分厂家按钮操作
    var index = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type
    var fac = this.data.orderDetail.factory[index]
    var that = this
    this.setData({
      curIndex: index
    })
    switch (type) {
      case 'qx'://评价 //取消厂家  cancelFactory
      if (fac.receive_num <= 0) { //未收到货 可直接取消厂家
        wx.showModal({
          content: '请确认取消该厂家吗？',
          confirmText: '确定取消',
          cancelText: '我再想想',
          success (res) {
            if (res.confirm) {
              that.req('cancelFactory',{manufactor_id: fac.manufactor_id},function(res){
                wx.showToast({
                  title: '取消成功',
                })
                that.getDetail()
              })
            } else if (res.cancel) {}
          }
        })
      } else {
        wx.showModal({
          content: '拼包中心已收货的厂家，取消后系统将不能跟踪货物状态，是否继续？',
          confirmText: '继续取消',
          cancelText: '我再想想',
          success (res) {
            if (res.confirm) {
              that.setData({
                editUrl: 'applyCancelFactory',
                showCancelXieyi: true,
                editParams: {
                  manufactor_id: fac.manufactor_id
                }
              })
            } else if (res.cancel) {}
          }
        })
      }
        break;
      case 'jl'://记录
      this.getFactoryLog(fac.manufactor_id)
        break;
      case 'xg'://修改
        var status = this.data.orderDetail.order.order_status
        if (status == 6 || status == 7) {
          return wx.showToast({
            title: '当前状态无法修改厂家信息',
            icon: 'none'
          })
        }
        this.setData({
          curManufactorName: '',
          modifyPlaceholderTxt: '厂家名字(非必填)',
          modifyNameDisabled: this.data.orderDetail.factory[this.data.curIndex].receive_num > 0 ? true : false
        })
        this.requestModifyPopup(fac.manufactor_id)
        break;
      case 'qxcj_shz'://取消审核中
        wx.showToast({
          title: '拼包中心审核中',
          icon: 'none'
        })
        break;
      case 'qxcj_code'://取消码
      
        break;
      default:
        break;
    }
  },
  operationBtnOrder(e){ //上部分订单按钮操作
    var type = e.currentTarget.dataset.type
    var data = this.data.orderDetail.order
    var that = this
    switch (type) {
      case 'pj'://评价
        if (data.order_status != 4 && data.order_status != 5) {
          return
        } else {
          this.setData({
            showEvaluate: true,
          })
        }
        break;
      case 'qxyy'://取消预约
        if (data.order_status != 0) {
          return
        } else {
          this.setData({
            showMsgCancel: true,
            showMsgTxt1: `取消次数过多的话，可能会被限制预约服务，如果信息填写错误，您可以返回修改`,
            btnTxt1: '返回修改',
            btnTxt2: '取消预约',
            editUrl: 'cancelOrder'
          })
        }
        break;
      case 'gbdd'://关闭订单
      if (data.order_status != 1 && data.order_status != 2 && data.order_status != 3) {
        return
      } else {
        wx.showModal({
          content: '拼包中心已收货的订单，取消后系统将不能跟踪货物状态，是否继续？',
          confirmText: '继续取消',
          cancelText: '我再想想',
          success (res) {
            if (res.confirm) {
              that.setData({
                editUrl: 'applyCancelOrder',
                showCancelXieyi: true,
                editParams: {
                  order_id: that.data.orderDetail.order.order_id
                }
              })
            } else if (res.cancel) {}
          }
        })
      }
        break;
      case 'txsh'://提醒送货
        if (data.order_status > 5) {
          return
        } else {
          this.setData({
            showBtns: true,
            shareMsgInfo: {
              time: data.appointment_date,
              code: data.auth_code,
            },
            posterId: data.order_id
          })
        }
        break;
      case 'lbdh'://拉包电话
          if (data.logistics_phone != '') {
            wx.makePhoneCall({
              phoneNumber: e.currentTarget.dataset.tel + '',
            })
          } else {
            wx.showModal({
              content: '您预约的拉包方式为拼包中心代拉，由拼包中心负责通知拉包人员，谢谢您的支持！',
              showCancel: false,
              success(res) {
                if (res.confirm) {}
              }
            })
          }
  
        break;
      case 'lbmx'://拉包明细
        if (data.order_status != 4 && data.order_status != 5) {
          return
        } else {
          var that = this
          this.req('getTakeawayLog',{order_id: data.order_id},function(res){
            if (res.data.result.length > 0) {
              that.setData({
                voucherInfo: res.data.result,
                shouldVoucherShow: true,
                shouldVoucherShowType: '拉包明细'
              })
            } else {
              wx.showToast({
                title: '当前订单暂时没有拉包记录',
                icon: 'none'
              })
            }
          })
        }
        break;
      case 'gbdd-code'://关闭-确认码
      
        break;
      case 'gbdd-shz'://关闭订单审核中
        wx.showToast({
          title: '拼包中心审核中',
          icon: 'none'
        })
        break;
      case 'ccdb':
        this.urgeCore(that.data.orderDetail.order.is_urge, that.data.orderDetail.order.order_status)
        break
      case 'dbjl' ://打包记录
        if (data.order_status == 2 || data.order_status == 3) {
          that.req('getPackLog',{order_id: data.order_id},function(res){
            if (res.data.result) {
              if (res.data.result.length == 0) {
                return wx.showToast({
                  title: '该订单暂无相关记录',
                  icon: 'none'
                })
              } else {
                that.setData({
                  voucherInfo: res.data.result,
                  shouldVoucherShow: true,
                  shouldVoucherShowType: '打包记录'
                })
              }
            }
          })
        }
        break;
        default:
        break;
    }
  },
  urgeCore: function (is_urge,order_status) { //催促打包= e.currentTarget.dataset.info
    var that = this
    if (order_status != 1) {
      return
    }
    if (is_urge == 1 && order_status == 1) {
      wx.showModal({
        content: `拼包中心已收到您的催促打包，如需加急请致电'${this.data.orderDetail.order.seller_phone}'`,
        showCancel: false,
        success (res) {
        if (res.confirm) {
        } else if (res.cancel) {
        }
        }
        })
      return
    }
    var id = that.data.orderDetail.order.order_id
    wx.showModal({
      content: '请核对您的货物是否已送齐，如果送齐了，请立即催促打包，催促后会优先给您打包。',
      confirmText: '立即催促',
      cancelText: '我再想想',
      confirmColor: '#18c2ba',
      success(res){
        request.post(that.data.url + '/api/pinbao/urgeOrder', {
          data: {
            order_id: id
          },
          success: function (res) {
            wx.showModal({
              content: '催促成功',
              showCancel: false,
            })
            that.setData({
              // showMsgUrge: true,
              // showMsgTxt1: res.data.msg,
              // isOkMsg: false,
              // btnTxt1: '知道了',
              [`orderDetail.order.is_urge`]: 1
            })
          }
        })
      }
    })
  },
  calcelOrderClick1: function () { //取消订单 点击取消
    var that = this
    this.req(this.data.editUrl, {
      order_id: this.data.orderDetail.order.order_id
    }, function (res) {
      wx.showToast({
        title: '已取消预约',
      })
      that.setData({
        showCancelXieyi: false
      })
      that.getDetail()
    })
  },
  agreeAgreement: function () { //同意协议
    var that = this
    this.req(this.data.editUrl, that.data.editParams, function (res) {
      wx.showToast({
        title: '已向拼包中心发送取消申请',
        duration: 2000,
        icon: 'none',
        mask: 'true'
      })
      setTimeout(()=>{
        that.setData({
          showCancelXieyi: false,
          editParams: {},
          showMask2: false
        })
        that.getDetail()
      },2000)
    })
  },
  seeDetailFac:function(e){ //展开
    var index = e.currentTarget.dataset.index
    this.setData({
      [`voucherInfo[${index}].lj`]: !this.data.voucherInfo[index].lj
    })
  },
  collectedRecord:function(e){ //收起
    var index = e.currentTarget.dataset.index
    this.setData({
      [`voucherInfo[${index}].lj`]: !this.data.voucherInfo[index].lj
    })
  },
  clickBtnItem(e){//白底按钮点击了item
    console.log(e)
    if (e.detail.type == 'poster') {
      this.sharePoster()
    } else if (e.detail.type == 'call') { //电话催促
      if (this.data.orderDetail.factory[this.data.curIndex].factory_phone != 0) {
        wx.makePhoneCall({
          phoneNumber: this.data.orderDetail.factory[this.data.curIndex].factory_phone,
        })
      } else {
        this.setData({
          showInfo: true
        })
      }
    }
    this.setData({
      showBtns: false,
      showBtns2: false
    })
  },
  seeOrderDetailImgs:function(e){ //查看拉包明细中的图片
    var index = e.currentTarget.dataset.index
    wx.previewImage({
      urls: this.data.voucherInfo[index].img,
    })
  },
  doEvaluate: function () { //评价的提交操作
    var that = this
    const {
      evaluateV1,
      evaluateV2,
      evaluateV3
    } = this.data
    this.req('addOrderEvaluate', {
      order_id: that.data.orderDetail.order.order_id,
      service: evaluateV1,
      efficiency: evaluateV2,
      accuracy: evaluateV3
    }, function (res) {
      that.setData({
        showEvaluate: false,
        [`orderDetail.order.is_evaluate`]: 1,
        evaluateV1:5,
        evaluateV2:5,
        evaluateV3:5,
      })
      wx.showModal({
        content: '提交成功，感谢您的支持！祝您生活愉快！',
        showCancel: false,
        success(res) {
          if (res.confirm) {}
        }
      })
    })
  },
  addManufactor: function (e) { //打开增加厂家
    var phpT = this.data.orderDetail.order.appointment_time * 1000
    var jsT = + new Date()
    var that = this
    var order_id = this.data.orderDetail.order.order_id
    var status = this.data.orderDetail.order.order_status
    if (status > 4 ) {
      return wx.showToast({
        title: '当前订单状态无法添加新厂家！',
        icon: 'none'
      })
    }
    if (jsT > phpT) {
      return wx.showToast({
        title: '已过最晚封包时间，不能添加厂家！',
        icon: 'none'
      })
    }
    that.setData({
      showAddFactory: true,
    })
  },
  confirmAddFactory: function () { //提交 添加厂家
    var that = this
    let params = {
      order_id: this.data.orderDetail.order.order_id,
      manufactor: JSON.stringify(this.data.addFactoryTempList)
    }
    this.req('addFactory', params, function (res) {
      that.setData({
        showAddFactory: false,
        addFactoryTempList: [],
        curManufactorName: ''
      }, function () {
        that.getDetail()
      })
    })
  },
  toAddPage: function () { //前往搜索厂家 增加页面
    var str = ''
    let arr = [...this.data.orderDetail.factory].concat(this.data.addFactoryTempList)
    arr.forEach((item, index) => {
      str += 'name' + index + '=' + item.manufactor_name + '&' //把选择了的厂家名字拼接成url参数 传递
    })
    wx.navigateTo({
      url: '/pages/subcontract/companysearch/index?from=tions&' + str,
    })
  },
  addFactoryInput: function (e) {  // 改变新增厂家输入框的值的时候
    let {
      type,
      index
    } = e.currentTarget.dataset
    let val = e.detail.value
    this.setData({
      [`addFactoryTempList[${index}].${type}`]: val
    })
  },
  delFromAddTempList: function (e) { //从增加新厂家列表移除
    var index = e.currentTarget.dataset.index
    let tArr = this.data.addFactoryTempList
    tArr.splice(index, 1)
    this.setData({
      addFactoryTempList: tArr
    })
  },
  seeFacLog(e){
    var index = e.currentTarget.dataset.index
    var id = this.data.factory[index].manufactor_id
    this.getFactoryLog(id)
  },
  getFactoryLog: function (id) { //获取厂家记录====================
    var that = this
    request.get(that.data.url + '/api/pinbao/getFactoryLog', {
      data: {
        manufactor_id: id
      },
      success: function (res) {
        // console.log(res)
        that.setData({
          seeLogFlag: true,
          factoryLogInfo: res.data.result,
          showMask2: false
        })
      }
    })
  },
  requestModifyPopup: function (id) { //获取修改详情请求
    var that = this
    request.get(that.data.url + '/api/pinbao/getEditFactory', {
      data: {
        manufactor_id: id
      },
      success: function (res) {
        that.setData({
          modifyRecordInfo: res.data.result,
          modifyPopupFlag: true,
          // curManufactorName: res.data.result.manufactor_name,
          modifyPlaceholderTxt: '厂家名字(非必填)',
          curManufactorName: '',
          // correctNum: res.data.result.goods_number,
          correctNum: '',
          showMask2: false
        })

      }
    })
  },
  curManufactorNameInput: function (e) { //修改厂名
    this.setData({
      curManufactorName: e.detail.value
    })
  },
  correctNumInput: function (e) { //修改厂数量
    var reg = /^\d{1,6}$/
    if (!reg.test(e.detail.value) && e.detail.value != '') {
      wx.showToast({
        title: '请正确填写货物数量',
        icon: 'none'
      })
      this.setData({
        correctNum: ''
      })
    }else {
      this.setData({
        correctNum: e.detail.value
      })
    }
  },
  confirmModify: function () { //提交修改的请求
    var that = this
    var nameReg = /[`~!#$^&*()=|{}':;',\[\].<>\?~！￥……&*（）——_|{}【】‘；：”“""'。，、？]/
    if (!this.data.modifyNameDisabled && nameReg.test(that.data.curManufactorName)) {
      return wx.showToast({
        title: '请正确填写厂家名',
        icon:'none' 
      })
    }
    // if (that.data.correctNum == that.data.orderDetail.factory[that.data.curIndex].num1) {
    //   return
    // }
    if (that.data.correctNum == '' && that.data.curManufactorName == '') {
      return
    }
    this.req('editFactory', {
      manufactor_id: that.data.orderDetail.factory[that.data.curIndex].manufactor_id,
      goods_num: that.data.correctNum,
      manufactor_name: that.data.curManufactorName,
    }, function (res) {
      console.log(res)
        wx.showToast({
          title: '修改成功',
          mask: true
        })
        that.setData({
          solvePlaceZindexFlag: true,
          curManufactorName: '',
          correctNum: ''
        })
        setTimeout(()=>{
          that.requestModifyPopup(that.data.orderDetail.factory[that.data.curIndex].manufactor_id)
          that.getDetail()
        },1000)
    })
  },
  callAdminAll: function (e) { //联系拼包中心
    this.makeCall(e.currentTarget.dataset.tel)
  },

  makeCall: function (tel) {
    if (tel == '' || tel.trim() == '') {
      this.setData({
        showInfo: true,
        curTel: ''
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    }
  },
  eidtTelAndCall: function () { //拨打电话并添加
    var tel = this.data.curTel
    var that = this
    if (/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(tel)) { //手机号码ok请求
      request.post(that.data.url + '/api/pinbao/addFactoryPhone', {
        data: {
          manufactor_id: that.data.orderDetail.factory[that.data.curIndex].manufactor_id,
          phone: that.data.curTel
        },
        success: function (res) {
          console.log(res)
          if (res.data.status == 1) {
            that.makeCall(tel)
          }
          that.setData({
            showInfo: false
          })
        }
      })
    } else {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'none'
      })
    }

  },
  editTel: function (e) { //编辑电话输入变化
    this.setData({
      curTel: e.detail.value
    })
  },
  onEvaluateChange1: function (e) { //评分
    var index = e.currentTarget.dataset.index
    var val = e.detail
    switch (index) {
      case '1':
        this.setData({
          evaluateV1: val
        })
        break;
      case '2':
        this.setData({
          evaluateV2: val
        })
        break;
      case '3':
        this.setData({
          evaluateV3: val
        })
        break;
      default:
        break;
    }
  },
  sharePoster: function (e) { //分享成海报
    wx.showLoading({
      title: '正在生成...',
    })
    var that = this
    wx.getImageInfo({
      src: that.data.url + '/api/pinbao/getRemindPoster?order_id=' + that.data.orderDetail.order.order_id + '&token=' + wx.getStorageSync('app:userInfo').token,
      isShowLoading: false,
      success: function (res) {
        that.setData({
          share_btn: true,
          showShare: false,
          share_pic: res.path
        })
        wx.hideLoading()
      },
      complete: function (res) {} 
    })
  },
  closeShareModal: function () { // 关闭海报
    this.setData({
      share_btn: false
    })
  },
  saveSharePic: function () { //保存海报
    var that = this
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: that.data.share_pic,
          success: function (res) {
            that.setData({
              share_btn: false
            })
            wx.showToast({
              title: '保存成功',
              duration: 2000
            })
          }
        })
      },
      fail: function (res) {
        common.checkAuthorize('scope.writePhotosAlbum')
      }
    })

  },
  previewSharePic: function () { //海报预览
    wx.previewImage({
      urls: [this.data.share_pic],
    })
  },
  // 按钮的 关闭 / 打开
  onWarningClose: function () {
    this.setData({
      showWarning: false,
      showKuohao: false,
      showCancelXieyi: false
    })
  },
  closeModifyPopup: function () { //关闭修改的弹窗
    this.setData({
      modifyPopupFlag: false,
      showAddFactory: false,
      shouldVoucherShow: false,
      voucherInfo: [],
      curManufactorName: '',
      correctNum: ''
    })
  },
  closeLog: function () {
    this.setData({
      seeLogFlag: false
    })
  },
  onInfoClose(){
    this.setData({
      showInfo: false
    })
  },
  onReady: function () {

  },
  onShow: function () {
    if (this.data.isFirst) {
      this.setData({
        isFirst: false
      })
    } else {
      this.getDetail()
    }
  },
  onPullDownRefresh: function () {
    this.setData({
      sortType:[false,false,false,false]
    })
    this.getDetail()
  },
  onPageScroll(){
    this.setData({
      showMask3: false
    })
  },
  onShareAppMessage: function () {
    console.log(this.data.shareMsgInfo.code)
    console.log(this.data.shareMsgInfo.time)
    console.log(this.data.posterId)
    return {
      title: `您的送货确认码为:${this.data.shareMsgInfo.code}最晚封包时间:${this.data.shareMsgInfo.time}`,
      path: '/pages/index/pinbaoMsg/pinbaoMsg?order_id=' + this.data.posterId,
      imageUrl: this.data.url + '/public/static/images/minniapp/share-default-pinbao.png'
    }
  },
  //2020 11 24 新版的详情 
  clickFacOpera(e){  // 操作厂家的按钮
    
    var type = e.currentTarget.dataset.type
    var orderTtatus = this.data.orderDetail.order.order_status
    var orderApply = this.data.orderDetail.order.apply_status
    var that = this
    var fac = this.data.factory[this.data.curIndex]
    if (type == 'log') {
      this.getFactoryLog(fac.manufactor_id)
    } else if (type == 'modify') {
      if (orderTtatus > 5 || orderApply == 1 || orderApply == 2 || fac.apply_status == 1 || fac.apply_status == 2) {
        return wx.showToast({
          title: '暂时无法修改厂家信息',
          icon: 'none'
        })
      } else {
        this.setData({
          // curManufactorName: fac.manufactor_name,
          modifyPlaceholderTxt: '厂家名字(非必填)',
          modifyNameDisabled: fac.receive_num > 0 ? true : false
        })
        this.requestModifyPopup(fac.manufactor_id)
      }
    } else if (type == 'cancel') {
      if (fac.status > 5) {
        return wx.showToast({
          title: '已取消的厂家无法继续取消了哦~',
          icon: 'none'
        })
      }
      if (fac.apply_status == 1) {
        return wx.showToast({
          title: '拼包中心审核处理中，请勿重复操作~',
          icon: 'none'
        })
      }
      if (fac.receive_num <= 0) { //未收到货 可直接取消厂家
        wx.showModal({
          content: '请确认取消该厂家吗？',
          confirmText: '确定取消',
          cancelText: '我再想想',
          success (res) {
            if (res.confirm) {
              that.req('cancelFactory',{manufactor_id: fac.manufactor_id},function(res){
                wx.showToast({
                  title: '取消成功',
                })
                that.getDetail()
                that.setData({
                  showMask2: false
                })
              })
            } else if (res.cancel) {}
          }
        })
      } else {
        wx.showModal({
          content: '拼包中心已收货的厂家，取消后系统将不能跟踪货物状态，是否继续？',
          confirmText: '继续取消',
          cancelText: '我再想想',
          success (res) {
            if (res.confirm) {
              that.setData({
                editUrl: 'applyCancelFactory',
                showCancelXieyi: true,
                editParams: {
                  manufactor_id: fac.manufactor_id
                },
                showMask3: false
              })
            } else if (res.cancel) {}
          }
        })
      }
    } else if (type == 'urge') {
      if (fac.status > 5) {
        return wx.showToast({
          title: '厂家已被取消~',
          icon: 'none'
        })
      }
      if (fac.apply_status == 1) {
        return wx.showToast({
          title: '请在拼包中心审核处理完后再操作哦~',
          icon: 'none'
        })
      }
      this.setData({
        showBtns2: true,
        shareMsgInfo: {
          time: this.data.orderDetail.order.appointment_date,
          code: this.data.orderDetail.order.auth_code,
        },
        showMask2: false,
        posterId: this.data.orderDetail.order.order_id
      })
    } else if (type == 'tips') {}
    if (type == 'back') {
      this.setData({
        showMask2: false
      })
    }
  },
  sortFac(e){//排序
    var that = this
    var type = e.currentTarget.dataset.type
    var index = e.currentTarget.dataset.index
    var facList = this.data.factory
    if (facList.length <= 1) {
      return
    }
    if (type == 'manufactor_name') { //名字排序
      facList.sort(function(a,b){
        if (that.data.sortType[index]) {
          return a.manufactor_name.localeCompare(b.manufactor_name,'zh')
        } else {
          return b.manufactor_name.localeCompare(a.manufactor_name,'zh')
        }
      })
    } else if (type == 'num1' || type == 'num2' || type == 'num3' || type == 'num4') {
      facList.sort(function(a,b){
        var num1 = a[type] == '未填' ? 0 : a[type]
        var num2 = b[type] == '未填' ? 0 : b[type]
        if (that.data.sortType[index]) {
          return num1 - num2
        } else {
          return num2 - num1
        }
      })
    }
    this.setData({
      factory: facList,
      [`sortType[${index}]`]: !that.data.sortType[index]
    })
  },
  doOperation(e){//显示遮罩操作
    var index = e.currentTarget.dataset.index
    var fac = this.data.factory[index]
    if (fac.apply_status == 1) {
      this.setData({ 
        cancelItemTxt: '取消厂家/待审核'
      })
    } else if (fac.status > 5) {
      if (fac.apply_status == 2) {
        this.setData({
          cancelItemTxt: '厂家已取消:' + fac.cancel_code
        })
      } else {
        this.setData({
          cancelItemTxt: '厂家已取消'
        })
      }
      
    } else {
      this.setData({
        cancelItemTxt: '取消该厂家'
      })
    }
    this.setData({
      showMask2: true,
      curIndex: index,
      centerFacName: fac.manufactor_name,
      inherit_num: fac.inherit_num,
      showMask3: false,
      facRemark: fac.receive_remark.substring(0,20)
    })
  },
  switchFac(e){ //筛选
    var index = e.currentTarget.dataset.index
    this.setData({
      factory: this.doSwitch(index,this.data.orderDetail.factory),
      showType: index
    }) 
  },
  doSwitch(i,fac){ //筛选的操作抽离  多处使用
    console.log(i)
    wx.showLoading()
    var list = []
    if (!fac || fac.length == 0) {
      wx.hideLoading()
      return list
    }
    var i = i + ''
    switch (i) {
      case '0'://默认
      list = fac.filter((item)=>{
        return item.status < 6
      })
        break;
      case '1'://已送齐
        list = fac.filter((item)=>{
          return (((item.receive_num >= item.goods_number) && item.goods_number > 0) || (item.goods_number == 0 && item.receive_num > 0)) && item.status < 6
        })
        break;
      case '2'://未送货
      list = fac.filter((item)=>{
        return ((item.receive_num > 0 && item.goods_number > item.receive_num) || (item.receive_num == 0 && item.goods_number == 0)) && item.status < 6
      })
        break;
      case '3'://已全部拉包
      list = fac.filter((item)=>{
        return item.status == 5
      })
        break;
      case '4'://已部分拉包
      list = fac.filter((item)=>{
        return item.status == 4
      })
        break;
      case '5'://已取消
      list = fac.filter((item)=>{
        return item.status > 5
      })
        break;
      case '6'://全部打包
        list = fac.filter((item)=>{
          return (item.receive_num > 0 && item.packing_num == item.receive_num)
        })
        break;
      case '7'://部分打包
        list = fac.filter((item)=>{
          return (item.receive_num > item.packing_num && item.packing_num >0)
        })
        break;
      case '9'://部分打包
        list = fac.filter((item)=>{
          return item.status > 5
        })
        break;
      default:
        break;
    }
    var calculation_receive_num = 0
    var calculation_take_num = 0
    var hasInherit = false
    list.forEach((item)=>{
      calculation_receive_num += (item.receive_num - 0)
      calculation_take_num += (item.num4 - 0)
      if (item.inherit_num > 0) {
        hasInherit = true
      }
      item.dotted = ((item.inherit_num > 0 ? 1 : '') - 0) + (((item.apply_status == 1 || item.apply_status == 2) ? 1 : '') - 0) + ((item.receive_remark ? 1 : '') - 0)
      item.dotted = item.dotted > 0 ? item.dotted : -1
    })
    this.setData({
      showScreen: false,
      calculation_receive_num,
      calculation_take_num,
      hasInherit
    })
    wx.hideLoading()
    return list
  },
  searchInput(e){
    var val = e.detail.value
    var index = this.data.factory.findIndex(function(item){
      return item.manufactor_name.indexOf(val) != -1
    })
    // console.log(index)
    if (index != -1) {
      var list = this.data.factory
      var l = list.splice(index,1)
      // console.log(list,l)
      this.setData({
        factory: [...l,...list]
      })
    }
  },
  showScreen(){
    this.setData({
      showScreen: true,
      showMask3: false
    })
  },
  closeScreen(){
    this.setData({
      showScreen: false,
      showScreen2: false,
      showMask3: false
    })
  },
  clickRoundDoted(e){ //点击圆点内部的选项
    var type = e.currentTarget.dataset.type
    var status = this.data.orderDetail.order.order_status
    var orderid = this.data.orderDetail.order.order_id
    var sellerid = this.data.orderDetail.order.seller_id
    var receNum = this.data.orderDetail.order.receiving_num
    var goNum = this.data.orderDetail.order.take_away_num || 0
    var tel = this.data.orderDetail.order.seller_phone + ''
    var that = this
    that.setData({
      showMask2: false,
      showScreen2: false,
      showMask3: false
    })
    switch (type) {
      case 'yyxx':
        console.log(goNum,receNum)
      var s = 'a'
      if (receNum == 0) {
        s = 'a'
      } else if (receNum > 0 && goNum == 0) {
        s = 'b'
      } else {
        s = 'c'
      }
        wx.navigateTo({
          url: '/pages/subcontract/write/write?reEdit='+ s +'&seller_id=' + sellerid + '&orderid=' + orderid,
        })
        break;
      case 'call':
      wx.makePhoneCall({
        phoneNumber: tel,
      })
        break;
      case 'gbdd':
        if (status != 1 && status != 2 && status != 3) {
          return
        } else {
          wx.showModal({
            content: '拼包中心已收货的订单，关闭后系统将不能跟踪货物状态，是否继续？',
            confirmText: '继续关闭',
            cancelText: '我再想想',
            success (res) {
              if (res.confirm) {
                that.setData({
                  editParams: {
                    order_id: that.data.orderDetail.order.order_id
                  },
                  editUrl: 'applyCancelOrder',
                  curOrderId: orderid,
                  showCancelXieyi: true
                })
              } else if (res.cancel) {}
            }
          })
        }
        break;
      case 'gbddshz':
        wx.showToast({
          title: '拼包中心审核中，请耐心等待，或联系拼包中心加急处理~',
          icon: 'none',
          duration: 2000
        })
        break;
      case 'ljpj':
        if (that.data.orderDetail.order.is_evaluate == 1) {
          return wx.showToast({
            title: '订单已评价，无需重复评价，感谢您的评价~',
            icon: 'none'
          })
        }
        that.setData({
          curOrderId: orderid,
          showEvaluate: true,
        })
        break;
      case 'yrhsz':
        that.setData({
          showWarning: true,
          editImg: 'subcontranct-err',
          editTxt: '删除后无法恢复，但您可在回收站内查看',
          showKuohao: true,
          btnTxt1: '确 认 删 除',
          btnTxt2: '取 消',
          editUrl: 'delOrderToRecycle',
          curId: orderid
        })
        break;
      case 'zyxx':
        wx.showModal({
          content: '您还有货物在拼包中心未打包或未拉包，请注意跟踪记录!',
          showCancel: false
        })
        break;
      default:
        break;
    }
    
  },
  closeMask2(){
    this.setData({
      showMask2: false,
      showMask3: false
    })
  },
  doOperation2(e){//显示遮罩操作
    var that = this
    var apply = this.data.orderDetail.order.apply_status + ''
    var status = this.data.orderDetail.order.order_status + ''
    if (that.data.showMask3) {
      this.setData({
        showMask3: false,
        showScreen2: false
      })
      return
    }
    var lis = [
      {
        name:'预约信息',
        css: '',
        index: 'yyxx'
      },
      {
        name: '联系拼包中心',
        css: '',
        index: 'call'
      },
    ]
    // 根据状态值  设置框内的内容
    switch (status) {
      case '0':
        break;
      case '1':
        if (apply == 0 || apply == 3) {
          lis.unshift({
            name: '关闭订单',
            css: '',
            index: 'gbdd'
          })
        } else if (apply == 1) {
          lis.unshift({
            name: '关闭订单/审核中',
            css: true,
            index: 'gbddshz'
          })
        }
        break;
      case '2':
        if (apply == 0 || apply == 3) {
          lis.unshift({
            name: '关闭订单',
            css: '',
            index: 'gbdd'
          })
        } else if (apply == 1) {
          lis.unshift({
            name: '关闭订单/审核中',
            css: true,
            index: 'gbddshz'
          })
        }
        break;
      case '3':
        if (apply == 0 || apply == 3) {
          lis.unshift({
            name: '关闭订单',
            css: '',
            index: 'gbdd'
          })
        } else if (apply == 1) {
          lis.unshift({
            name: '关闭订单/审核中',
            css: true,
            index: 'gbddshz'
          })
        }
        break;
      case '4':
        lis.unshift({
          name: '立即评价',
          css: '',
          index: 'ljpj'
        },
        {
          name: '重要信息',
          css: true,
          index: 'zyxx'
        })
        
        break;
      case '5':
        lis.unshift({
          name: '立即评价',
          css: '',
          index: 'ljpj'
        },
        {
          name: '移入回收站',
          css: '',
          index: 'yrhsz'
        })
        break;
      case '6':
        if (this.data.orderDetail.order.cancel_code > 0) {
          lis.unshift({
            name: `关闭订单确认码:${this.data.orderDetail.order.cancel_code}`,
            css: true,
            index: ''
          })
        }
        break;
      case '7':
        if (this.data.orderDetail.order.cancel_code > 0) {
          lis.unshift({
            name: `关闭订单确认码:${this.data.orderDetail.order.cancel_code}`,
            css: true,
            index: ''
          })
        }
        break;
      default:
        break;
    }
    that.setData({
      showMask3: true,
      orderOperations: lis,
      showScreen2: true
    })
    
  },
  // 请求 函数
  req: function (url, params, cb) {
    request.get('/api/pinbao/' + url, {
      data: params,
      success: function (res) {
        cb && cb(res)
      }
    })
  },
})