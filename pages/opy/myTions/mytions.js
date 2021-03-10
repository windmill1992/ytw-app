var app = getApp();
var common = require('../../../utils/common.js');
var request = require("../../../utils/request")
var setting = app.globalData.setting;
var ooo = [
  {
    t: '2020-12-08 12:11',
    asd: false,
    sum: 5
  },
  {
    t: '2020-12-08 12:11',
    asd: false,
    sum: 15
  },
  {
    t: '2020-12-08 12:11',
    asd: false,
    sum: 52
  }
]
Page({

  data: {
    ooo: ooo,
    url: setting.url,
    isFirst: true,
    curState: 'getOrderList', //状态 默认全部
    p: 1, //翻页
    countSum: [],
    orderInfo: [], //数据
    showShare: false, //是否展示分享面板
    isShowCheck: false, //是否展示checkbox
    allDetailIndex: 0, //全部中展开的当前索引
    coreInfo: [],
    doType: '', //操作的类型 00000000000000000000000000000000000000000000000000
    isShowAllDetail: false,
    orderDetail: {}, //订单展开
    timeOutCancelFlag: false, //取消按钮显示控制 0000000000000000000000000000000
    showWarning: false, //警告框
    showInfo: false, //信息框
    editUrl: '', //编辑的请求url
    editData: {}, //编辑的数据id
    editImg: 'subcontranct-err', //编辑的图片背景
    editTxt: '确认取消预约吗？',
    btnTxt1: '立即取消', //弹框按钮文字1
    btnTxt2: '我点错了', //弹框按钮文字2
    showKuohao: false,
    modifyPopupFlag: false, //是否显示 记录+修改的弹框
    curTel: '', //当前操作的厂家电话
    curManufactorName: '', //当前编辑的厂家名字
    curId: '', //当前操作的Id
    curOrderId: '',
    showEditPopup: false, //是否显示修正框
    correctData: { //修正时临时存储的信息
      manufactor_id: '',
      goods_num: '',
      manufactor_name: '',
      phone: ''
    },
    correctData2: { //修正时临时存储的信息映射,便于提示使用
      goods_num: '货物数量',
      manufactor_name: '厂家名字',
      phone: '电话号码'
    },
    correctNum: '', //修正的已收到数量
    solvePlaceZindexFlag: true, //WXplaceholderBug
    showOtherTxt: false, //其他类提示,拉走 打包了 送齐
    del_type: '1', //垃圾桶数据类型
    ljtType: true,
    shareMsgInfo: {},
    posterId: 0, //要做海报的id
    share_pic: '', //海报路径
    share_btn: false, //海报显示与否
    preData: [], //存储需要重新预约的数据
    modifyRecordInfo: {}, //修改的记录数据
    modifyPlaceholderTxt: '厂家名字(非必填)', //修改窗口的厂家名占位符
    modifyNameDisabled: false, //修改窗口 厂家名是否禁用
    titleName: '', //弹框顶部厂名
    showMsgUrge: false, //控制显示消息提示
    showMsgCancel: false, //取消预约控制器
    showMsgTxt1: '', //设置消息提示的文案
    btnTxt1: '取消', //组件按钮1文案
    btnTxt2: '确定', //组件按钮2文案
    isOkMsg: true, //是否是绿色正常提示
    msgParams: {}, //展示信息提示的配置
    successTxt: '', //成功时候的提示文案专用
    successMsgFlag: false, //成功
    errTxt: '', //失败时候的提示文案专用
    showErrMsgBtn1: '', //err按钮1显示控制
    errMsgBtnTxt1: '', //err按钮1 文案
    errMsgFlag: false, //失败
    cancelFanufactorMsgFlag: false, //取消厂家
    seeLogFlag: false, //是否显示记录框
    factoryLogInfo: {}, //存放查看的记录数据
    showAddFactory: false, //是否显示增加厂家的弹窗
    openAddInfo: {}, //打开增加厂家存放的数据
    addFactoryTempList: [], //增加厂家临时存放数组
    showEvaluate: false, //评价
    evaluateV1: 5, //评价星星
    evaluateV2: 5,
    evaluateV3: 5,
    showCancelXieyi: false, //是否显示取消协议
    sendCancelOrderApplyTxt: '', //发送取消预约订单 txt
    sendCancelOrderApplyFlag: false, //发送取消预约订单
    refresherTriggered: true,//下拉刷新scroll阀
    shouldVoucherShow: false,
    voucherInfo: [],
    showUndeReview: false,//审核中的提示
    underReciveTel: ''
  },

  onLoad: function (options) {
    wx.hideShareMenu({
      success: (res) => {},
    })
    this.getCore()
    this.getCount()
    this.getMytions(1, 'getOrderList')
  },
  chooseTab: function (e) { //选择不同状态
    var url = e.currentTarget.dataset.url
    this.setData({
      curState: e.currentTarget.dataset.url
    }, function () {
      this.resetDate()
      this.getMytions(1, url)
    })

  },
  getMytions: function (p, url) { //=======================
    var that = this
    request.get(that.data.url + '/api/pinbao/' + url, {
      data: {
        p: p,
        type: that.data.del_type
      },
      success: function (res) {
        wx.stopPullDownRefresh()
        if (res.data.status == 1) {
          if (that.data.curState == 'pppp4') {
            var tempInfo = res.data.result.map((item) => {
              item.checked = false
              return item
            })
            that.setData({
              orderInfo: that.data.orderInfo.concat(tempInfo)
            })
          } else {
            that.setData({
              orderInfo: that.data.orderInfo.concat(res.data.result)
            })
          }
        }
      }
    })
  },
  resetDate: function () { //重置数据
    this.getCount()
    this.setData({
      p: 1,
      orderInfo: [],
      isShowCheck: false
    })
  },
  refreshDetail:function(){
    this.setData({
      refresherTriggered: true
    })
    this.reqDetail(this.data.curOrderId,this.data.allDetailIndex)
  },
  onShareAppMessage: function (res) { //分享
    console.log(res)
    return {
      title: `您的送货确认码为:${this.data.shareMsgInfo.code}最晚封包时间:${this.data.shareMsgInfo.time}`,
      path: '/pages/index/pinbaoMsg/pinbaoMsg?order_id=' + this.data.posterId,
      imageUrl: this.data.url + '/public/static/images/minniapp/share-default-pinbao.png'
    }
  },
  getCount: function () { //获取tips数量=====================
    var that = this
    request.get(that.data.url + '/api/pinbao/getOrderStatusCount', {
      success: function (res) {
        if (res.data.status == 1) {
          // console.log(res)
          that.setData({
            countSum: res.data.result
          })
        }
      }
    })
  },
  getCore: function () { //获取所有拼包中心的信息======================
    var that = this
    request.get(that.data.url + '/api/pinbao/getSellerList', {
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            coreInfo: res.data.result
          })
        }
      }
    })
  },
  requsstDetail: function (e) { //请求 订单展开的======================
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    this.setData({
      curOrderId: id
    })
    this.reqDetail(id, index)
  },
  reqDetail: function (id, index) {
    var that = this
    request.get(that.data.url + '/api/pinbao/getOrderDetails', {
      data: {
        order_id: id
      },
      success: function (res) {
        // console.log(res)
        if (res.data.status == 1) {
          that.setData({
            orderDetail: res.data.result,
            isShowAllDetail: true,
            allDetailIndex: index,
            refresherTriggered: false
          })
        }
      }
    })
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
          factoryLogInfo: res.data.result
        })
      }
    })
  },
  callKuaidi: function (e) {
    if (e.currentTarget.dataset.tel != '') {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel,
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
  },
  switchLajiType: function (e) { //垃圾桶  订单 或者厂家选择
    var type = e.currentTarget.dataset.type
    this.setData({
      del_type: type,
      ljtType: type == '2' ? false : true
    }, function () {
      this.resetDate()
      this.getMytions(1, this.data.curState)
    })
  },
  allDetailClose: function () { //关闭打开的全部
    this.setData({
      isShowAllDetail: false
    })
  },
  callTel: function (e) { //电话联系厂家
    var tel = e.currentTarget.dataset.tel
    var id = e.currentTarget.dataset.id
    // console.log(tel,id,'tttt')
    this.setData({
      editData: {
        manufactor_id: id,
        curTel: tel
      }
    })
    this.makeCall(tel)
  },
  onInfoClose: function () {
    this.setData({
      showInfo: false,
      showUndeReview: false
    })
  },
  onCoreListClose: function () {
    this.setData({
      showCoreList: false
    })
  },
  cancelAllOrder: function (e) { //全部中  取消预约
    // console.log(e)
    var {
      order_id,
      cancel_num,
    } = e.currentTarget.dataset.info
    this.setData({
      showMsgCancel: true,
      // showMsgTxt1: `此次为您第${cancel_num + 1}次取消预约，取消次数过多的话，可能会被限制预约服务，如果信息填写错误，您可以在订单详情页修改`,
      showMsgTxt1: `取消次数过多的话，可能会被限制预约服务，如果信息填写错误，您可以在订单详情页修改`,
      btnTxt1: '取消预约',
      btnTxt2: '返回修改',
      curId: order_id,
      editUrl: e.currentTarget.dataset.url
    })
  },
  cancelTimeOutOrder: function (e) { //忽略单个超时订单
    var id = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    var that = this
    if (num > 0) {
      return wx.showToast({
        title: '该厂家已有部分货物送到，无法取消！',
        icon: 'none'
      })
    } else {
      this.setData({
        curId: id,
        showWarning: true,
        editTxt: '确定忽略吗？取消后，可以在回收站中查看！',
        showKuohao: true,
        btnTxt1: '确 定 取 消',
        btnTxt2: '再 看 看'
      })
    }
  },
  overlookFactory: function () { //忽略 与 取消中的 删除
    var that = this
    if (this.data.curState == 'getCancelFactoryList') { //在已取消页面的删除
      this.req('delFactoryToRecycle', {
        manufactor_id: this.data.curId
      }, function (res) {
        that.setData({
          showWarning: false,
          curId: ''
        })
        that.resetDate()
        that.getCount()
        that.getMytions(1, that.data.curState)
      })
    } else if (this.data.curState == 'getTimeOutFactory') { //超时页面的 忽略
      this.req('overlookFactory', {
        manufactor_id: this.data.curId
      }, function (res) {
        that.setData({
          showWarning: false,
          curId: ''
        })
        that.resetDate()
        that.getCount()
        that.getMytions(1, that.data.curState)
      })
    } else if (this.data.curState == 'getOrderList') { //在全部 删除到垃圾桶
      this.req('delOrderToRecycle', {
        order_id: this.data.curId
      }, function (res) {
        console.log(res)
        that.resetDate()
        that.getCount()
        that.getMytions(1, that.data.curState)
        that.setData({
          showWarning: false,
          curId: '',
        })
      })
    }

  },
  reEditOrder: function () { //重新编辑订单
    // this.req('getEditOrder',{order_id:this.data.orderDetail.order.order_id},function(res){
    //   console.log(res)
    // })
    // return
    var that = this
    var allNum = 0
    var laNum = 0
    this.data.orderDetail.factory.forEach((item) => {
      allNum = allNum + (item.num1 - 0) + (item.num3 - 0) + (item.num4 - 0)
      laNum = laNum + (item.num4 - 0)
    })
    if (allNum == 0) {
      wx.showModal({
        title: '提示',
        content: '是否前往重新编辑',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/subcontract/write/write?reEdit=a&seller_id=' + that.data.orderDetail.order.seller_id + '&orderid=' + that.data.orderDetail.order.order_id,
            })
          } else if (res.cancel) {}
        }
      })
    } else if (allNum > 0 && laNum == 0) {
      let reEditType = 'b'
      wx.showModal({
        title: '提示',
        content: '是否前往重新编辑',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/subcontract/write/write?reEdit=b&seller_id=' + that.data.orderDetail.order.seller_id + '&orderid=' + that.data.orderDetail.order.order_id,
            })
          } else if (res.cancel) {}
        }
      })
    } else if (allNum > 0 && laNum > 0) {
      return wx.showToast({
        title: '已有货物拉走，无法更改订单信息了',
        icon: 'none'
      })
    }
  },
  reOrderCoreOk: function (e) { //前往预约页面
    var id = e.currentTarget.dataset.sellerid
    wx.navigateTo({
      url: '/pages/subcontract/write/write?seller_id=' + id + '&from=re',
    }) 
  },
  reOrderMore: function () { //批量重新预约
    //收集需要的信息 保存在本页  下一页面使用
    if (!this.data.isShowCheck) {
      this.setData({
        isShowCheck: true
      })
      return
    }
    var data = this.data.orderInfo
    var checkArr = []
    data.forEach((item) => {
      if (item.checked) {
        item.name = item.manufactor_name
        item.number = item.goods_number - item.receive_num
        item.id = item.manufactor_id
        checkArr.push(item)
      }
      
    })
    var indexArr = []
    checkArr.forEach((item,index)=>{ //去重 合并 id
      for (let i = (index + 1); i < checkArr.length; i++) {
        if (item.name == checkArr[i].name) {
          item.id = item.id + ',' + checkArr[i].id
          item.number = (item.number - 0) + (checkArr[i].number - 0)
          indexArr.unshift(i)
        }
      }
    })
    for (let j = 0; j < indexArr.length; j++) {
      checkArr.splice(indexArr[j],1)
    }
    if (checkArr.length == 0) {
      return wx.showToast({
        title: '您还没有选择需要重新预约的厂家',
        icon: 'none'
      })
    } else {
      this.setData({
        showCoreList: true,
        preData: checkArr,
        editTxt: '选择心仪的拼包中心'
      })
    }

  },
  cancelMore: function () { //批量取消
    if (!this.data.isShowCheck) {
      this.setData({
        isShowCheck: true
      })
      return
    }
    var data = this.data.orderInfo
    var checkArrIds = []
    var checkArr = []
    data.forEach((item) => {
      if (item.checked) {
        checkArrIds.push(item.manufactor_id)
        checkArr.push(item)
      }
    })
    if (checkArrIds.length == 0) {
      return wx.showToast({
        title: '请至少选择一个需要取消的厂家',
        icon: 'none'
      })
    } else {
      var flag = true
      checkArr.forEach((item) => {
        if (item.receive_num > 0) {
          wx.showToast({
            title: '已发货了的厂家，无法取消！',
            icon: 'none'
          })
          flag = false
        }
      })
      if (flag) {
        this.setData({
          editUrl: 'delOrder',
          curId: checkArrIds.join(','),
          showWarning: true,
          editTxt: '确定批量忽略吗？批量忽略后，可以在回收站中查看！',
          showKuohao: true,
          btnTxt1: '确 定 忽 略',
          btnTxt2: '再 看 看'
        })
      }
    }
  },
  timeOutCancel: function () { // 取消多选
    this.setData({
      isShowCheck: false,
      timeOutCancelFlag: false
    })
  },
  timeOutSelectAll: function () { //批量操作 确定 按钮
    this.setData({
      isShowCheck: true,
      timeOutCancelFlag: true
    })
  },
  delCancelOrder: function (e) { //取消中的删除
    var id = e.currentTarget.dataset.id
    this.setData({
      showWarning: true,
      editImg: 'subcontranct-err',
      editTxt: '删除后无法恢复，但您可在回收站内查看',
      showKuohao: true,
      btnTxt1: '确 认 删 除',
      btnTxt2: '取 消',
      editUrl: 'delFactoryToRecycle',
      curId: id
    })
  },
  onWarningClose: function () {
    this.setData({
      showWarning: false,
      showKuohao: false,
      showCancelXieyi: false
    })
  },
  onTimeOutOrderInputChange: function (e) { // 单选框变化
    var num = e.currentTarget.dataset.num
    if (num > 0) {
      return wx.showToast({
        title: '该厂家已有部分货物送到，无法取消！',
        icon: 'none'
      })
    }
    var index = e.currentTarget.dataset.index
    this.setData({
      [`orderInfo[${index}].checked`]: e.detail
    })
  },
  sharePoster: function (e) { //分享成海报
    wx.showLoading({
      title: '正在生成...',
    })
    var that = this
    wx.getImageInfo({
      src: that.data.url + '/api/pinbao/getRemindPoster?order_id=' + that.data.posterId + '&token=' + wx.getStorageSync('app:userInfo').token,
      isShowLoading: false,
      success: function (res) {
        console.log(res)
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
  eidtTelAndCall: function () { //拨打电话并添加
    var tel = this.data.curTel
    var that = this1
    if (/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(tel)) { //手机号码ok请求
      request.post(that.data.url + '/api/pinbao/addFactoryPhone', {
        data: {
          manufactor_id: that.data.editData.manufactor_id,
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
  // 组件弹窗 打开 关闭 部分
  openShare: function (e) {
    let orderInfo = this.data.orderInfo
    let {
      id,
      index
    } = e.currentTarget.dataset
    this.setData({
      showShare: true,
      posterId: id,
      shareMsgInfo: {
        time: orderInfo[index].appointment_date,
        code: orderInfo[index].auth_code,
      }
    })
  },
  closeShare: function () {
    this.setData({
      showShare: false
    })
  },
  editTel: function (e) { //编辑电话输入变化
    this.setData({
      curTel: e.detail.value
    })
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
  callAdminAll: function (e) {
    this.makeCall(e.currentTarget.dataset.tel)
  },
  urgeCore: function (e) { //催促打包
    let {
      is_urge,
      order_status
    } = e.currentTarget.dataset.info
    var that = this
    if (is_urge == 1 && order_status == 1) {
      that.setData({
        showMsgUrge: true,
        showMsgTxt1: '拼包中心已收到您的催促，会安排人员优先给您打包!',
        isOkMsg: false,
        btnTxt1: '知道了'
      })
      return
    }
    var id = e.currentTarget.dataset.info.order_id
    request.post(that.data.url + '/api/pinbao/urgeOrder', {
      data: {
        order_id: id
      },
      success: function (res) {
        console.log(res)
        if (res.data.state != 1) {
          that.setData({
            showMsgUrge: true,
            showMsgTxt1: res.data.msg,
            isOkMsg: false,
            btnTxt1: '知道了'
          })
        } else if (res.data.state == 1) {
          that.setData({
            showMsgUrge: true,
            showMsgTxt1: res.data.msg,
            isOkMsg: false,
            btnTxt1: '知道了'
          })
        }
      }
    })
  },
  closeModifyPopup: function () { //关闭修改的弹窗
    this.setData({
      modifyPopupFlag: false,
      showAddFactory: false,
      shouldVoucherShow: false,
      voucherInfo: []
    })
  },
  showModifyPopupFlag: function (e) { //显示修改的弹窗
    var status = e.currentTarget.dataset.status
    if (status == 6 || status == 7) {
      return wx.showToast({
        title: '当前状态无法修改厂家信息',
        icon: 'none'
      })
    }
    this.setData({
      curId: e.currentTarget.dataset.id,
      curManufactorName: e.currentTarget.dataset.correctNum > 0 ? e.currentTarget.dataset.name : '',
      modifyNameDisabled: e.currentTarget.dataset.correctNum > 0 ? true : false
    })
    this.requestModifyPopup(e.currentTarget.dataset.id)
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
          curManufactorName: res.data.result.manufactor_name,
          correctNum: res.data.result.goods_number,
        })

      }
    })
  },
  showSolvePlaceZindexFlag: function (e) {
    this.setData({
      solvePlaceZindexFlag: false,
      modifyFocus1: e.currentTarget.dataset.t == 'a' ? true : false,
      modifyFocus2: e.currentTarget.dataset.t == 'b' ? true : false,
    })
  },
  modifyScroll: function () { //修改的弹窗滚动
    this.setData({
      solvePlaceZindexFlag: true
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
    } else {
      this.setData({
        correctNum: e.detail.value
      })
    }
  },
  confirmModify: function () { //提交修改的请求
    var that = this
    var nameReg = /[`~!@#$^&*()=|{}':;',\[\].<>\?~！@#￥……&*（）——_|{}【】‘；：”“""'。，、？]/
    if (nameReg.test(that.data.curManufactorName)) {
      return wx.showToast({
        title: '请正确填写厂家名',
        icon:'none'
      })
    }
    this.req('editFactory', {
      manufactor_id: that.data.curId,
      goods_num: that.data.correctNum,
      manufactor_name: that.data.curManufactorName,
    }, function (res) {
      console.log(res)
      if (that.data.curState == 'getOrderList') { //从订单展开里面点击的修改 或者超时
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
          that.requestModifyPopup(that.data.curId)
          that.reqDetail(that.data.curOrderId, that.data.allDetailIndex)
        },1000)
      } else if (that.data.curState == 'getIncompleteFactory') { //从未送齐点击的修改
        that.setData({
          solvePlaceZindexFlag: true,
          curManufactorName: '',
          correctNum: ''
        })
        that.resetDate()
        that.getCount()
        that.getMytions(1, that.data.curState)
        that.requestModifyPopup(that.data.curId)
      } else if (that.data.curState == 'getTimeOutFactory') {
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
          that.resetDate()
          that.getMytions(1,that.data.curState)
        },1000)
      }
    })

  },
  seeRecord: function (e) { //查看记录
    var id = e.currentTarget.dataset.id
    this.getFactoryLog(id)
  },
  closeLog: function () {
    this.setData({
      seeLogFlag: false
    })
  },
  cancelOrder: function (e) {
    var status = e.currentTarget.dataset.status
    var id = e.currentTarget.dataset.id
    if (status == 1) {
      this.setData({
        editData: {
          order_id: id
        },
        editUrl: 'applyCancelOrder',
        showCancelXieyi: true
      })
    } else if (status == 2) {
      wx.showToast({
        title: '拼包中心审核中',
        icon: 'none'
      })
    }
  },
  sendCancelOrderApply: function () { //发送订单取消申请的确定

  },
  cancelOrderFanufactor: function (e) { //取消厂家
    // apply_status 0无申请 1管理员发送取消申请 2用户申请取消 3同意取消 4拒绝取消
    var {
      id,
      url,
      info,
      state
    } = e.currentTarget.dataset
    var that = this
    var state = state + ''
    console.log(state)
    switch (state) {
      case '0':
        if ((info.num1 + info.num3 + info.num4) == 0) {
          this.setData({
            cancelFanufactorMsgFlag: true,
            showMsgTxt1: '确定取消该厂家的货物配送吗？',
            curId: id,
            editUrl: url
          })
        } else {
          this.setData({
            errMsgFlag: true,
            errTxt: `已收货的厂家不能取消，特殊情况请致电${this.data.orderDetail.order.seller_phone}`
          })
        }
        break;
      case '1':
        this.setData({
          showCancelXieyi: true,
          editUrl: 'applyCancelFactory',
          editData: {
            manufactor_id: id
          }
        })
        break;
      case '2':
        this.setData({
          showUndeReview: true,
          underReciveTel: e.currentTarget.dataset.tel || ''
        })
        break;
      case '4':
        this.setData({
          errMsgFlag: true,
          errTxt: '您之前的申请已被拒绝，请勿频繁申请取消厂家了'
        })
        break;
      default:
        break;
    }
  },
  cancelFactory: function () { //取消厂家
    var that = this
    this.req(this.data.editUrl, {
      manufactor_id: this.data.curId
    }, function (res) {
      if (that.data.curState == 'getOrderList') {
        wx.showToast({
          title: '提交成功',
          mask: true
        })
        setTimeout(()=>{
          that.reqDetail(that.data.curOrderId, that.data.allDetailIndex)
        },1000)
      } else if (that.data.curState == 'getIncompleteFactory') {
        wx.showToast({
          title: '提交成功',
          mask: true
        })
        setTimeout(()=>{
          that.resetDate()
          that.getCount()
          that.getMytions(1, that.data.curState)
        },1000)
      }
    })
  },
  cancelWeiOrder: function (e) { //未送齐 点击取消
    if (e.currentTarget.dataset.sent > 0) {
      // 已收到过货物的 未送齐
      this.setData({
        errMsgFlag: true,
        errTxt: `已收货的厂家不能取消，特殊情况请致电${e.currentTarget.dataset.tel}`,
        showErrMsgBtn1: true,
        errMsgBtnTxt1: '拨打',
        editUrl: e.currentTarget.dataset.url,
        curId: e.currentTarget.dataset.id
      })
    } else {
      // 没收到货物的 未送齐
      this.setData({
        cancelFanufactorMsgFlag: true,
        showMsgTxt1: '确定取消该厂家吗？',
        editUrl: e.currentTarget.dataset.url,
        curId: e.currentTarget.dataset.id
      })
    }
  },
  clickErrMsg1: function () { //点击 errMsg 按钮1

  },
  delFromAddTempList: function (e) { //从增加新厂家列表移除
    var index = e.currentTarget.dataset.index
    let tArr = this.data.addFactoryTempList
    tArr.splice(index, 1)
    this.setData({
      addFactoryTempList: tArr
    })
  },
  // 组件信息提醒触发事件
  showMsgClose1: function () { //点击左边的按钮/第一个按钮
    this.setData({
      showMsgUrge: false
    })
  },
  showMsgClose2: function (e) { //点击右边/第二个按钮
    this.setData({
      showMsgUrge: false
    })
  },
  delOrderToRecycle: function (e) { //删除至回收站
    var id = e.currentTarget.dataset.id
    var that = this
    this.setData({
      showWarning: true,
      editImg: 'subcontranct-err',
      editTxt: '删除后无法恢复，但您可在回收站内查看',
      showKuohao: true,
      btnTxt1: '确 认 删 除',
      btnTxt2: '取 消',
      editUrl: 'delOrderToRecycle',
      curId: id
    })

  },
  calcelOrderClick1: function () { //取消订单 点击取消
    // console.log(this.data.curId,this.data.editUrl)
    var that = this
    this.req(this.data.editUrl, {
      order_id: this.data.curId
    }, function (res) {
      wx.showToast({
        title: '已取消预约',
      })
      that.setData({
        isShowAllDetail: false
      })
      that.resetDate()
      that.getCount()
      that.getMytions(1, that.data.curState)
    })
  },
  calcelOrderClick2: function () { //取消订单 点击返回修改
    console.log('点击修改的')
  },
  addManufactor: function (e) { //打开增加厂家
    var that = this
    var order_id = e.currentTarget.dataset.info.order_id
    var status = e.currentTarget.dataset.info.order_status
    if (status >= 5) {
      return wx.showToast({
        title: '当前订单状态无法添加新厂家',
        icon: 'none'
      })
    }
    this.req('getAddFactory', {
      order_id
    }, function (res) {
      console.log(res)
      that.setData({
        openAddInfo: res.data.result,
        showAddFactory: true,
        curOrderId: order_id
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
  // 改变新增厂家输入框的值的时候
  addFactoryInput: function (e) {
    let {
      type,
      index
    } = e.currentTarget.dataset
    let val = e.detail.value
    console.log(`addFactoryTempList[${index}].${type}`)
    // return
    this.setData({
      [`addFactoryTempList[${index}].${type}`]: val
    })
  },
  confirmAddFactory: function () { //提交 添加厂家
    var that = this
    let params = {
      order_id: this.data.curOrderId,
      manufactor: JSON.stringify(this.data.addFactoryTempList)
    }
    this.req('addFactory', params, function (res) {
      if (res.data.is_audit == 1) {
        that.req('getAddFactory', {
          order_id: that.data.curOrderId
        }, function (res) {
          console.log(res)
          that.setData({
            openAddInfo: res.data.result,
            showAddFactory: true,
            addFactoryTempList: [],
            curManufactorName: ''
          })
        })
      } else if (res.data.is_audit == 0) {
        that.setData({
          openAddInfo: {},
          showAddFactory: false,
          addFactoryTempList: [],
          curManufactorName: ''
        }, function () {
          that.reqDetail(that.data.curOrderId, that.data.allDetailIndex)
        })
      }
    })
  },
  openEvaluateOrder: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      curOrderId: id,
      showEvaluate: true,
      allDetailIndex: e.currentTarget.dataset.index
    })
  },
  doEvaluate: function () { //评价的提交操作
    var that = this
    const {
      curOrderId,
      evaluateV1,
      evaluateV2,
      evaluateV3
    } = this.data
    this.req('addOrderEvaluate', {
      order_id: curOrderId,
      service: evaluateV1,
      efficiency: evaluateV2,
      accuracy: evaluateV3
    }, function (res) {
      that.setData({
        showEvaluate: false,
        [`orderInfo[${that.data.allDetailIndex}].is_evaluate`]: 1,
        evaluateV1:5,
        evaluateV2:5,
        evaluateV3:5,
      })
      wx.showModal({
        content: '提交成功，感谢您的支持！祝您生活愉快！',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    })
  },
  onEvaluateChange1: function (e) {
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
  agreeAgreement: function () { //同意协议
    var that = this
    this.req(this.data.editUrl, this.data.editData, function (res) {
      wx.showToast({
        title: '已向拼包中心发送取消申请',
        duration: 2000,
        icon: 'none',
        mask: 'true'
      })
      setTimeout(()=>{
        if (that.data.editData.manufactor_id) {
          that.reqDetail(that.data.curOrderId, that.data.allDetailIndex)
        }
        that.setData({
          showCancelXieyi: false,
          editData: {}
        })
        that.getMytions(1,that.data.curState)
      },2000)
    })

  },
  seeCredentials: function (e) { //查看凭证
    var id = e.currentTarget.dataset.id
    var that = this
    this.req('getTakeawayLog',{order_id: id},function(res){
      if (res.data.result.length > 0) {
        that.setData({
          voucherInfo: res.data.result,
          shouldVoucherShow: true
        })
      } else {
        wx.showToast({
          title: '当前订单暂时没有拉包记录',
          icon: 'none'
        })
      }
      
    })
  },
  seeOrderDetailImgs:function(e){ //查看拉包明细中的图片
    var index = e.currentTarget.dataset.index
    wx.previewImage({
      urls: this.data.voucherInfo[index].img,
    })
  },
  // 重新对所有的操作 弹窗 请求做封装
  // 请求 函数
  req: function (url, params, cb) {
    request.get('/api/pinbao/' + url, {
      data: params,
      success: function (res) {
        cb && cb(res)
      }
    })
  },

  onShow: function () { //页面再次展示，重新再获取最新数据
    if (this.data.isFirst) {
      this.setData({
        isFirst: false
      })
    } else {
      if (this.data.shouldVoucherShow) {
        return
      }
      this.resetDate()
      this.getCount()
      this.getMytions(1, this.data.curState)
    }
  },
  onReachBottom: function () {
    var p = this.data.p - 0 + 1
    this.getMytions(p, this.data.curState)
    this.setData({
      p: p
    })
  },
  onPullDownRefresh:function(){
    this.resetDate()
    this.getMytions(1,this.data.curState)
  },
  seeDetailFac:function(e){ //展开
    var index = e.currentTarget.dataset.index
    this.setData({
      [`voucherInfo[${index}].lj`]: true
    })
  },
  collectedRecord:function(e){ //收起
    var index = e.currentTarget.dataset.index
    this.setData({
      [`voucherInfo[${index}].lj`]: false
    })
  },
})