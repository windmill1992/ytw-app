var app = getApp();
var common = require('../../../utils/common.js');
var request = require("../../../utils/request")
var setting = app.globalData.setting;
var isCall = false
Page({

  data: {
    url: setting.url,
    isFirst: true,
    curState: 'getOrderList', //状态 默认全部
    p: 1, //翻页
    orderInfo: [], //数据
    allDetailIndex: 0, //全部中展开的当前索引
    showWarning: false, //警告框
    showInfo: false, //信息框
    editUrl: '', //编辑的请求url
    editData: {}, //编辑的数据id
    editImg: 'subcontranct-err', //编辑的图片背景
    editTxt: '确认取消预约吗？',
    btnTxt1: '立即取消', //弹框按钮文字1
    btnTxt2: '我点错了', //弹框按钮文字2
    showKuohao: false,
    curTel: '', //当前操作的厂家电话
    curId: '', //当前操作的Id
    curOrderId: '',
    del_type: '1', //垃圾桶数据类型
    shareMsgInfo: {},
    posterId: 0, //要做海报的id
    share_pic: '', //海报路径
    share_btn: false, //海报显示与否
    preData: [], //存储需要重新预约的数据
    showMsgCancel: false, //取消预约控制器
    showMsgTxt1: '', //设置消息提示的文案
    btnTxt1: '取消', //组件按钮1文案
    btnTxt2: '确定', //组件按钮2文案
    errTxt: '', //失败时候的提示文案专用
    showErrMsgBtn1: '', //err按钮1显示控制
    errMsgBtnTxt1: '', //err按钮1 文案
    seeLogFlag: false, //是否显示记录框
    factoryLogInfo: {}, //存放查看的记录数据
    showEvaluate: false, //评价
    evaluateV1: 5, //评价星星
    evaluateV2: 5,
    evaluateV3: 5,
    showCancelXieyi: false, //是否显示取消协议
    shouldVoucherShow: false,
    shouldVoucherShowType: '',
    voucherInfo: [],
    // =============================
    navType: 'order',
    n_currentIndex: '',//被操作的当前的数据索引
    showMask2: false,
    orderOperationTop: '0',
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
    isbottom: false
  },
  switchNav(e){ //切换nav  
    var type = e.currentTarget.dataset.type
    if (e.currentTarget.dataset.url == this.data.curState) {
      return
    }
    this.setData({
      navType: type,
      curState: e.currentTarget.dataset.url
    },function(){
      this.resetDate()
      this.getMytions(1,e.currentTarget.dataset.url)
    })
  },
  operationBtn(e){ //下面的操作按钮点击
    var index = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type
    var data = this.data.orderInfo[index]
    var that = this 
    this.setData({
      n_currentIndex: index
    })
    switch (type) {
      case 'pj'://评价
        if (data.order_status != 4 && data.order_status != 5) {
          return
        } else {
          this.setData({
            curOrderId: data.order_id,
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
            showMsgTxt1: `取消次数过多的话，可能会被限制预约服务，如果信息填写错误，您可以在预约信息页修改`,
            btnTxt1: '返回修改',
            btnTxt2: '取消预约',
            curId: data.order_id,
            curOrderId: data.order_id,
            editUrl: 'cancelOrder'
          })
        }
        break;
      case 'gbdd'://关闭订单
      if (data.order_status != 1 && data.order_status != 2 && data.order_status != 3) {
        return
      } else {
        wx.showModal({
          content: '拼包中心已收货的厂家，关闭后系统将不能跟踪货物状态，是否继续？',
          confirmText: '继续关闭',
          cancelText: '我再想想',
          success (res) {
            if (res.confirm) {
              that.setData({
                editData: {
                  order_id: data.order_id
                },
                editUrl: 'applyCancelOrder',
                curOrderId: data.order_id,
                showCancelXieyi: true
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
            posterId: data.order_id,
            shareMsgInfo: {
              time: data.appointment_date,
              code: data.auth_code,
            }
          })
        }
        break;
      case 'lbdh'://拉包电话
        if (data.order_status != 2 && data.order_status != 3 && data.order_status != 4 && data.order_status != 5) {
          return
        } else {
          if (data.logistics_phone != '') {
            isCall = true
            wx.makePhoneCall({
              phoneNumber: data.logistics_phone,
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
        }
        break;
      case 'lbmx'://拉包明细
        if (data.order_status != 4 && data.order_status != 5) {
          return
        } else {
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
      case 'ccdb': //催促打包
        this.urgeCore(that.data.orderInfo[this.data.n_currentIndex].is_urge, that.data.orderInfo[this.data.n_currentIndex].order_status)
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
  clickBtnItem(e){
    console.log(e)
    if (e.detail.type == 'poster') {
      this.sharePoster()
    }
    this.setData({
      showBtns: false
    })
  },
  // ===================
  onLoad: function (options) {
    wx.hideShareMenu()
    this.getMytions(1, 'getOrderList')
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
    this.setData({
      p: 1,
      orderInfo: [],
    })
  },
  onShareAppMessage: function (res) { //分享
    
    return {
      title: `您的送货确认码为:${this.data.shareMsgInfo.code}最晚封包时间:${this.data.shareMsgInfo.time}`,
      path: '/pages/index/pinbaoMsg/pinbaoMsg?order_id=' + this.data.posterId,
      imageUrl: this.data.url + '/public/static/images/minniapp/share-default-pinbao.png'
    }
  },

  requsstDetail: function (e) { //请求 订单展开的======================
    wx.navigateTo({
      url: '/pages/subcontract/tionDetail/tionDetail?order_id=' + e.currentTarget.dataset.id,
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
      isCall = true
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

  allDetailClose: function () { //关闭打开的全部
    this.setData({
      isShowAllDetail: false
    })
  },
  callTel: function (e) { //电话联系厂家
    var tel = e.currentTarget.dataset.tel
    var id = e.currentTarget.dataset.id
    this.setData({
      editData: {
        manufactor_id: id,
        curTel: tel
      }
    })
    isCall = true
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

  
  reOrderCoreOk: function (e) { //前往预约页面
    var id = e.currentTarget.dataset.sellerid
    wx.navigateTo({
      url: '/pages/subcontract/write/write?seller_id=' + id + '&from=re',
    }) 
  },
  onWarningClose: function () {
    this.setData({
      showWarning: false,
      showKuohao: false,
      showCancelXieyi: false
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
              isCall = true
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
  urgeCore: function (is_urge,order_status) { //催促打包= e.currentTarget.dataset.info
    var that = this
    if (is_urge == 1 && order_status == 1) {
      wx.showModal({
        content: `拼包中心已收到您的催促打包，如需加急请致电'${this.data.orderInfo[0].seller_phone}'`,
        showCancel: false,
        success (res) {
        if (res.confirm) {
        console.log('用户点击确定')
        }
        }
        })
      return
    }
    wx.showModal({
      title: '催促打包',
      content: '请核对您的货物是否已送齐，如果送齐了，请立即催促打包，催促后会优先给您打包',
      confirmText: '立即催促',
      cancelText: '我再想想',
      confirmColor: '#18c2ba',
      success (res) {
      if (res.confirm) {
        var id = that.data.orderInfo[that.data.n_currentIndex].order_id
          request.post(that.data.url + '/api/pinbao/urgeOrder', {
            data: {
              order_id: id
            },
            success: function (res) {
              wx.showModal({
                content: '催促成功',
                showCancel: false,
                success (res) {
                if (res.confirm) {
                  that.setData({
                    [`orderInfo[${that.data.n_currentIndex}].is_urge`]: 1
                  })
                } else if (res.cancel) {
                }
                }
                })
            }
          })
      } else if (res.cancel) {
      console.log('用户点击取消')
      }
      }
      })
    
  },
  closeModifyPopup: function () { //关闭修改的弹窗
    this.setData({
      shouldVoucherShow: false,
      voucherInfo: []
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
      that.getMytions(1, that.data.curState)
    })
  },
  calcelOrderClick2: function () { //取消订单 点击返回修改
    console.log('点击修改的')
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
        [`orderInfo[${that.data.n_currentIndex}].is_evaluate`]: 1,
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
        title: '已向拼包中心发送关闭申请',
        duration: 1500,
        icon: 'none',
        mask: 'true'
      })
      setTimeout(()=>{
        that.setData({
          showCancelXieyi: false,
          editData: {}
        })
        that.getMytions(1,that.data.curState)
      },2000)
    })

  },
  
  seeOrderDetailImgs:function(e){ //查看拉包明细中的图片
    var index = e.currentTarget.dataset.index
    wx.previewImage({
      urls: this.data.voucherInfo[index].img,
      current: this.data.voucherInfo[index].img[0]
    })
  },
  overlookFactory(){ //删除到回收站
    var that = this
    this.req('delOrderToRecycle', {
      order_id: this.data.curId
    }, function (res) {
      that.setData({
        showWarning: false,
        curId: ''
      })
      that.resetDate()
      that.getMytions(1, that.data.curState)
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
    if (this.data.isFirst || isCall) {
      this.setData({
        isFirst: false
      })
    } else {
      if (this.data.shouldVoucherShow) {
        return
      }
      this.resetDate()
      this.getMytions(1, this.data.curState)
    }
    isCall = false
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
      [`voucherInfo[${index}].lj`]: !this.data.voucherInfo[index].lj
    })
  },
  collectedRecord:function(e){ //收起
    var index = e.currentTarget.dataset.index
    this.setData({
      [`voucherInfo[${index}].lj`]: false
    })
  },
  doOperation(e){//显示遮罩操作
    var that = this
    var index = e.currentTarget.dataset.index
    var apply = this.data.orderInfo[index].apply_status + ''
    var status = this.data.orderInfo[index].order_status + ''
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
    var h = 0

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
        
        if (that.data.curState == 'getOrderList') {
          if (this.data.orderInfo[index].is_evaluate == 0) {
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
          } else {
            lis.unshift(
            {
              name: '移入回收站',
              css: '',
              index: 'yrhsz'
            })
          }
          
        } else {
          if (this.data.orderInfo[index].is_evaluate == 0) {
            lis.unshift({
              name: '立即评价',
              css: '',
              index: 'ljpj'
            })
          }
          
        }
        break;
      case '6':
      
        break;
      case '7':
        
        break;
      default:
        break;
    }
    //动态设置框的位置
    wx.createSelectorQuery().select(`.queryClass${index}`).boundingClientRect(function (rect) {
      var isbottom = true
      if (rect.top > 180) {
        isbottom = false
        h = (rect.top - (lis.length * 27) - 60)
      } else {
        isbottom = true
        h = rect.top
      }
      that.setData({
        showMask2: true,
        n_currentIndex: index,
        orderOperationTop: h + 'px',
        orderOperations: lis,
        isbottom
      })
  }).exec() 
    
  },
  clickRoundDoted(e){ //点击圆点内部的选项
    var type = e.currentTarget.dataset.type
    var index = this.data.n_currentIndex
    var status = this.data.orderInfo[index].order_status
    var orderid = this.data.orderInfo[index].order_id
    var sellerid = this.data.orderInfo[index].seller_id
    var receNum = this.data.orderInfo[index].receiving_num
    var goNum = this.data.orderInfo[index].take_away_num || 0
    var tel = this.data.orderInfo[index].seller_phone + ''
    var that = this
    that.setData({
      showMask2: false
    })
    switch (type) {
      case 'yyxx':
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
        isCall = true
      wx.makePhoneCall({
        phoneNumber: tel,
      })
        break;
      case 'gbdd':
        if (status != 1 && status != 2 && status != 3) {
          return
        } else {
          wx.showModal({
            content: '拼包中心已收货的厂家，关闭后系统将不能跟踪货物状态，是否继续？',
            confirmText: '继续关闭',
            cancelText: '我再想想',
            success (res) {
              if (res.confirm) {
                that.setData({
                  editData: {
                    order_id: orderid
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
        if (that.data.orderInfo[index].is_evaluate == 1) {
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
      showMask2: false
    })
  },
})