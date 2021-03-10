
var request = require("../../../utils/request")
var app = getApp()
var setting = app.globalData.setting;
var util = require('../../../utils/util')
import Dialog from '../../../dist/dialog/dialog';
var can1 = function(s){
  if ( s < 6 ) {
    return true
  } else {
    return false
  }
}
var can2 = function(s){
  if (s >= 2 && s <=6) {
    return true
  } else {
    return false
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: '',
    type:'',
    url: setting.url,
    res: {},
    filePath: '',
    flag:true,
    showInput: false,//是否展示收货框
    goodsSum: '',//当前编辑的数量
    curId: 0,//当前编辑的id
    curModifyId:'',//当前修改记录的id
    recipientType: 1,//收货类型 1 正常收货 2 超时收货
    recipientTitle: '确认收货数量',
    imgSrc: [],//一般图片
    uploadSrc:[],
    fileList: [{url:'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg'},{url:'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3892521478,1695688217&fm=26&gp=0.jpg'},{url:'https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3238317745,514710292&fm=26&gp=0.jpg'}],//取消订单图片
    isHidden: true,
    isShowQm: true,
    sureNext: false,
    finalButton: true,
    changeFlag: true,
    shouldDisplay: false,
    isFistIn: true,
    seeLogFlag: false,
    factoryLogInfo: {},
    editInputNum: 0,//修改货物数量的显示
    is_type_b: 1,//默认是大B身份
    showFirstFlag: true,//用于判别是不是继续添加厂家返回的  做数据刷新处理
    cancelFlag: false,//是否显示删除订单签名
    // 新版部分
    showCheck: false,//是否展示checkbox
    showRecordFixed: false,//是否展示记录层
    slotTxt1:'取消',//插槽按钮文字
    slotTxt2:'确认',//插槽按钮文字
    slotType: true,//true为收货 false审核
    receiveGoodsType:'1',//1正常收货 2超时收货
    receiveSlotInputVal: '',//收货时的输入框
    showRecodeSlot: false,//是否需要插槽
    seeNew: false,//是否显示 新增厂家审核
    operationGoodsType: true,//底部 true打包 false拉包操作类型
    submitColor: '#18c2ba',//底部确定按钮背景色
    modifyType: '',//修改记录的类型
    AddFactoryList: {},//新增审核 历史 + 新的
    msg1: '',//提示内文案
    msg2: '',//提示内文案
    btnTxt1:'',//按钮1文案
    btnTxt2:'',//按钮2文案
    showErrMsg: false,//是否显示msg组件
    showErrMsg2: false,//是否显示msg 2组件
    showErrMsg3: false,//是否显示msg 3组件
    errMsgTitle: '',//msg title
    oldTimeMsg: '',//原本的时间
    newTimeMsg: '',//要改成的时间
    cancelFacBtn1: '',
    cancelFacBtn2: '',
    cancelFacMsg1: '',
    curIndex: '',//当前操作的厂家索引
    shenheInfo:{},
    searchVal: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      order_id: options.order_id,
      type: options.type?options.type:'admin'
    })
    this.getInfo()
  },
  getInfo:function(){
    const that = this
    request.get(that.data.url + '/api/pinbao/getAdminOrderDetails',{
      data: {
        order_id: that.data.order_id
      },
      success:function(res){
        // console.log(res)
        if (res.data.status === 1) {
          var tempList = res.data.result
          var flag = false
          if (tempList.order.order_status == 3) {
            flag = true
          }
          if (tempList.order.order_status != 3 && that.data.isFistIn == true) {
            that.setData({
              isFistIn: false,
              shouldDisplay: true
            })
          }
          tempList.factory.forEach((item)=>{
            item.preNum1 = item.num1
            item.packNum = item.num1
            item.MaxPackNum = item.num1
            item.preNum3 = item.num3
            item.goNum = item.num3
            item.maxGoNum = item.num3
            item.canPack = item.num1>0 && can1(item.status)
            item.canGo = item.num3>0 && can2(item.status)
          })
          that.setData({
            res: tempList,
            isShowQm:flag,
            imgSrc: res.data.result.order.order_img || []
            // imgSrc: []
          },function(){
            console.log(tempList)
          })
        }
        wx.stopPullDownRefresh()
      }
    })
  },
  back1:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  afterRead:function(e){
    console.log(e.detail.file.path)
    this.uploadFile(e.detail.file.path)
  },
  delUploadImg:function(e){
    var imgs = this.data.uploadSrc
    imgs.splice(e.detail.index,1)
    this.setData({
      uploadSrc: imgs
    })
  },
  uploadFile:function(src){
    wx.showLoading({
      title: '上传中...',
      mask:true
    })
    const that = this
    const token = request.getToken()
    const unique_id = request.getUniqueId()
    // console.log(that.data.filePath)
    wx.uploadFile({
      filePath: src,
      name: 'qinzi_imgs',
      url: that.data.url + '/api/newjoin/upload_qianzi_img',
      success:function(res){
        if(res.statusCode !== 200){
          return
        }
        var result = JSON.parse(res.data)
        // var imgs = that.data.uploadSrc
        // imgs.push({url: result.result})
        that.setData({
          uploadSrc: that.data.uploadSrc.concat({url: result.result})
        },function(){console.log(that.data.uploadSrc)})
      }
    })
},
delImg:function(e){
  var that = this
  var index = e.currentTarget.dataset.index
  var imgSrc = this.data.imgSrc
  imgSrc.splice(index,1)
  request.post(that.data.url + '/api/pinbao/uploadOrderImage',{//图片上传
    data:{
      order_id: that.data.order_id,
      file_image: imgSrc,
    },
    success:function(res){
      console.log(res)
      that.setData({
        imgSrc: imgSrc
      })
      that.getInfo()
    } 
  })
},
preUploadImg:function(e){
  var img = e.currentTarget.dataset.img
  wx.previewImage({
    urls: this.data.imgSrc,
    current: img
  })
},
changeState:function(){//最后一步更改状态
  const that = this
  const order_id = this.data.order_id
  const order_status = this.data.res.order_status
  var url = order_status == 2 ? "/api/pinbao/takeAway" : "/api/pinbao/packaged"
  // if (!this.data.changeFlag) {
  //   return
  // }
  request.post(that.data.url + url,{//已打包
    data:{
      order_id: order_id,
    },
    success:function(res){
      console.log(res)
      if (res.data.status==1) {
        wx.showToast({
          title: '订单状态修改成功',
        })
        that.getInfo()
        that.setData({
          finalButton: false
        })
      }else {
        wx.showToast({
          title: '操作失败，请稍后重试',
          icon: 'none'
        })
      }
    } 
  })

},
nextState:function(e){//对应厂家的更改状态
  const that = this
  var num = e.currentTarget.dataset.num
  const tempRes = JSON.parse(JSON.stringify(this.data.res))
  // const requestUrl = this.data.type=="b"?"/api/pinbao/change_order_user_manufactor":"/api/pinbao/change_order_admin_manufactor"
  const id = e.currentTarget.dataset.id
  const type2 = e.currentTarget.dataset.type2
  if (this.data.type == "admin") {//如果是管理员
    that.setData({
      showInput: true,
      goodsSum: num,
      curId: id,
      recipientType: type2,
      
    })
  }
},
changee:function(manufactor_id,requestUrl,content,type){//状态更改抽离
  const that = this

},
// 确定签名之后
imgok:function(){

  const that = this
  var i = this.data.res.order_status - 0 + 1
  var nextStatusTxt = ''
  if (i==0) {
    nextStatusTxt = "未送齐"
} else if(i==1){
    nextStatusTxt = "待打包"
}else if(i==2){
    nextStatusTxt = "待拉包"
} else  if(i==3){
    nextStatusTxt = "已拉走"
}

  if ( that.data.imgSrc.length ) {
    return wx.showToast({
      title: '请上传电子照片',
      icon: 'none'
    })
  }

  wx.showModal({
    title: '提示',
    content: "是否更改订单状态为" + nextStatusTxt + '?该操作无法撤回！！！',
    success(res){
      if(res.confirm){
        that.changeState()
        // if (that.data.res.order_status == 1) {
        //   that.changeState()
        //   return
        // }
        // if (that.data.res.order_status == 2) {
        //   that.changeState()
        // }
      }else if (res.cancel){
        return false
      }
    }
  })
},

// 重新选择照片
imgReTake:function(){
  this.uploadImage()
},
looklook:function(){
  this.setData({
    isHidden: true,
    isShowQm: true
  })
},
cancelOrder:function(e){//点击取消订单时，先提醒
  this.setData({
    cancelFlag: true
  })
  wx.showModal({
    content: '取消客户订单，必须上传取消凭证！！！',
    showCancel: false,
    success (res) {
    }
  })
},
delCancelOrderImg:function(e){//删除取消订单图片中的图片
  var index = e.detail.index
  var img = this.data.fileList
  img.splice(index,1)
  this.setData({
    fileList: img
  })
},
uploadCancelOrderImg:function(e){//取消订单上传图片
  var that = this
  // console.log(e)
  var img = e.detail.file.path
  wx.uploadFile({
    filePath: img,
    name: 'qinzi_imgs',
    url: that.data.url + '/api/newjoin/upload_qianzi_img',
    success:function(res){
      // console.log(res)
     var result = JSON.parse(res.data)
     var tempArr = [{url:result.result}]
     that.setData({
       fileList: that.data.fileList.concat(tempArr)
     })
    }
  })
},
sureCancelOrder:function(){//最后 确定要取消订单
  var that = this
  if (that.data.fileList.length == 0) {
    return wx.showToast({
      title: '取消订单，必须上传取消凭证!!!',
      icon: 'none'
    })
  }
  wx.showModal({
    title:'提醒',
    content: '真的要取消客户订单吗？？？',
    cancelText: '算了',
    confirmText: '确定取消',
    success:function(res){
      if (res.confirm) {
        // console.log("真的取消")
        var imgs = that.data.fileList.map((item)=>{
          return item.url
        })
        // return
        request.post( that.data.url + '/api/pinbao/cancelOrderAdmin',{
          data:{
            order_id: that.data.res.id,
            cancel_img: imgs
          },
          success:function(res){
            console.log(res)
            if (res.data.status == 1) {
              that.getInfo()
            }
          }
        } )
      } else if (res.cancel) {
      }
    }
  })
},
unSureCancelOrder:function(){//又不想取消了
  this.setData({
    fileList: [],
    cancelFlag: false
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
    if (this.data.showFirstFlag) {
      this.setData({
        showFirstFlag: false
      })
      return
    }
    this.getInfo()
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
    
    this.getInfo()
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

  },
  receivedSumChange:function(e){
    this.setData({
      goodsSum: e.detail.value
    })
  },
  onCloseInput: function(){
    this.setData({
      showInput: false
    })
  },
  onConfirmInput:function(){
    var that = this
    this.req('editOperateLog',{
      id: this.data.curModifyId,
      num: this.data.goodsSum
    },function(res){
      that.getFactoryLog(that.data.curId)
      that.getInfo()
      that.setData({
        goodsSum: ''
      })

    })
  },
  // ============================================新版本部分 上面根据情况删除
  makeCall:function(e){//打电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  showCheck:function(e){//显示复选框 //通过点击的选项 控制显示checkbox状况
    var color = '#18c2ba'
    var canSum = 0
    if (e.currentTarget.dataset.type == 'pack') {
      var list = this.data.res.factory
      list.forEach((item)=>{
        if (!item.canPack) {
        item.packNum = item.preNum1
        } else {
          item.num1 = 0
          canSum++
        }
      })
    } else {
      if (this.data.uploadSrc.length == 0) { //先判断有没有图片
        return wx.showToast({
          title: '拉包之前必须上传拉包凭证(拍照)',
          icon: 'none'
        })
      }
      var list = this.data.res.factory
      list.forEach((item)=>{
        if (!item.canGo) {
          item.goNum = item.preNum3
        } else {
          item.num3 = 0
          canSum++
        }
      })
    }
    if (canSum == 0) {
      color = '#ccc'
    }
    this.setData({
      [`res.factory`]: list,
      showCheck: true,
      operationGoodsType: e.currentTarget.dataset.type == 'pack' ? false : true,
      submitColor: color
    })
  },
  onCheckBoxChange:function(e){//复选框的状态变化
    var index = e.currentTarget.dataset.index
    this.setData({
      [`res.factory[${index}].lj`]: e.detail
    })
    index = null
  },
  clickFactoryItem:function(e){
    var index = e.currentTarget.dataset.index
    
  },
  hideCelect:function(){ //取消选择
    this.setData({
      showCheck: false
    })
    this.getInfo()
  },
  sureSub:function(){//确定 打包 或 拉包
    var that = this
    if (this.data.submitColor == '#ccc') { //按钮变灰 说明没有可操作的厂家
      return
    }
    var subParams = []
    var data = {}
    var imgs = this.data.uploadSrc.map((item)=>{return item.url})
        data.img = imgs.join(',')
    if (this.data.operationGoodsType) { //拉包
      var fName = ''
      var selectList = this.data.res.factory.filter((item)=>{
        return item.canGo && item.lj
      })
      if (selectList.length == 0) {
        return wx.showToast({
          title: '请至少选择一个要打包的厂家，并填写打包数量',
          icon: 'none'
        })
      }
      selectList.forEach((item)=>{
        if (item.goNum == 0) {
          fName = item.manufactor_name
        }
        subParams.push({
          manufactor_id: item.manufactor_id,
          num: item.goNum
        })
      })
      if (fName != '') {
        return wx.showToast({
          title: fName + '此次打包数量必须大于0',
          icon: 'none',
          duration: 2000,
          mask: false
        })
      }
      data.data = JSON.stringify(subParams)
    } else {//打包
      
      var fName = ''
      var selectList = this.data.res.factory.filter((item)=>{
        return item.canPack && item.lj
      })
      if (selectList.length == 0) {
        return wx.showToast({
          title: '请至少选择一个要打包的厂家，并填写打包数量',
          icon: 'none'
        })
      }
      selectList.forEach((item)=>{
        if (item.packNum == 0) {
          fName = item.manufactor_name
        }
        subParams.push({
          manufactor_id: item.manufactor_id,
          num: item.packNum
        })
      })
      if (fName != '') {
        return wx.showToast({
          title: fName + '此次打包数量必须大于0',
          icon: 'none',
          duration: 2000,
          mask: false
        })
      }
      data.data = JSON.stringify(subParams)
    } //
    console.log(data)
    // return
    this.req(this.data.operationGoodsType ? 'takeAway' : 'packaged',data,function(res){ //提交处理
      console.log(res)
      that.setData({
        showCheck: false,
        uploadSrc: []
      })
      that.getInfo()
    })
  },
  factoryItemInput:function(e){
    var { index, type } = e.currentTarget.dataset
    var sum = e.detail.value
    if (type == 'pack') {//点击的打包
      if (sum > this.data.res.factory[index].MaxPackNum) {
        sum = this.data.res.factory[index].MaxPackNum
      }
      this.setData({
        [`res.factory[${index}].num1`] : this.data.res.factory[index].preNum1 - sum,
        [`res.factory[${index}].packNum`]: sum
      })
    } else {
      if (sum > this.data.res.factory[index].maxGoNum) {
        sum = this.data.res.factory[index].maxGoNum
      }
      this.setData({
        [`res.factory[${index}].num3`] : this.data.res.factory[index].preNum3 - sum,
        [`res.factory[${index}].goNum`]: sum
      })
    }
  },
  showRecord:function(e){//显示记录
    var id = e.currentTarget.dataset.id
    if (e.currentTarget.dataset.type == 'recive') {
      if (e.currentTarget.dataset.status == 6 || e.currentTarget.dataset.status == 7) {
        return wx.showToast({
          title: '当前厂家状态无法收货',
          icon: 'none'
        })
      }
    }
    this.setData({
      showRecodeSlot: e.currentTarget.dataset.type == 'recode' ? false : true,
      slotType: e.currentTarget.dataset.type == 'recive' ? true : false,
      curId: id,
      receiveSlotInputVal: e.currentTarget.dataset.num < 0 ? 0 : e.currentTarget.dataset.num,
      slotType: true,
      slotTxt1:'取消',
      slotTxt1: '确定'
    })
    this.getFactoryLog(id)
    
  },
  closeFixed: function(){//关闭记录层
    this.setData({
      showRecordFixed: false
    })
  },
  closeLog:function(){
    this.setData({
      seeLogFlag: false,
      seeNew: false
    })
  },
  getFactoryLog:function(id){//获取厂家记录====================
    var that = this
    request.get( that.data.url + '/api/pinbao/getFactoryLog',{
      data:{ manufactor_id: id },
      success:function(res){
        that.setData({
          seeLogFlag: true,
          factoryLogInfo: res.data.result
        })
      }
    } )
  },
  receiveGoodsTypeChange:function(e){ //切换变化正常/超时收货
    this.setData({
      receiveGoodsType: this.data.receiveGoodsType == '1' ? '2' : '1'
    })
  },
  receiveSlotInput:function(e){ //收货输入框数量变化
    this.setData({
      receiveSlotInputVal: e.detail.value
    })
  },
  clickSlotBtn1:function(){//插槽点击左按钮
    var that = this
    if (this.data.shenheInfo.audit_function) {
      this.req(this.data.shenheInfo.audit_function,{manufactor_id: this.data.curId,status:2},function(res){
        wx.showToast({
          title: '操作成功',
        })
        that.setData({
          seeLogFlag: false
        })
      })
    } else {
      this.setData({
        seeLogFlag: false
      })
    }
    
  },
  clickSlotBtn2:function(){//插槽点击右按钮
    var type = this.data.receiveGoodsType
    var id = this.data.curId
    var sum = this.data.receiveSlotInputVal
    var that = this
    if (this.data.shenheInfo.audit_function) {
      this.req(this.data.shenheInfo.audit_function,{manufactor_id: this.data.curId,status:1},function(res){
        wx.showToast({
          title: '操作成功',
        })
        that.setData({
          seeLogFlag: false
        })
      })
    } else {
      if (sum <= 0) {
        return wx.showToast({
          title: '收货数量必须大于1',
          icon: 'none'
        })
      }
      this.req('addReceiveLog',{
        type:type,
        num:sum,
        manufactor_id: id
      },function(res){
  
        console.log(res)
        that.setData({
          seeLogFlag:false,
        })
        that.getInfo()
      })
    }
  },
  seeNewFactory:function(){
    var that = this
    this.req('getAddFactoryList',{order_id:this.data.order_id},function(res){
      that.setData({
        seeNew: true,
        AddFactoryList: res.data.result
      })
    })
  },
  modifyRecode:function(e){//编辑记录
    console.log(e)
    var type = e.detail.type
    var info = e.detail.info
    this.setData({
      showInput: true,
      recipientTitle: '请输入',
      goodsSum: 0,
      curModifyId: info.id,
      modifyType: type
    })
  },
  clickAudit:function(e){//点击了新增厂家审核的每个厂家项
    var index = e.detail.index
    this.setData({
      [`AddFactoryList.audit[${index}].lj`]: !this.data.AddFactoryList.audit[index].lj
    })
    console.log(e)
  },
  refuseNewADD:function(){//拒绝新增厂家
    var that = this
    var refuseList = this.data.AddFactoryList.audit.filter((item)=>{
      return item.lj
    })
    if (refuseList.length == 0) {
      return wx.showToast({
        title: '您还没有选择厂家',
        icon: 'none'
      })
    }
    var ids = []
    refuseList.forEach((item)=>{
      ids.push(item.id)
    })

    this.req('auditAddFactory',{status: 2, ids: ids.join(',')},function(res){
      wx.showToast({
        title: '操作成功',
        icon: 'none'
      })
      that.setData({
        seeNew: false
      })
      that.getInfo()
    })
  },
  passNewAdd:function(){//同意新增厂家
    var that = this
    var passList = this.data.AddFactoryList.audit.filter((item)=>{
      return item.lj
    })
    if (passList.length == 0) {
      return wx.showToast({
        title: '您还没有选择厂家',
        icon: 'none'
      })
    }
    var ids = []
    passList.forEach((item)=>{
      ids.push(item.id)
    })
    this.req('auditAddFactory',{status: 1, ids: ids.join(',')},function(res){
      wx.showToast({
        title: '操作成功',
        icon: 'none'
      })
      that.setData({
        seeNew: false
      })
      that.getInfo()
    })
  },
  doApplyOperation:function(e){
    var status = e.currentTarget.dataset.status + ''
    if (status!=0&&status!=2) {
      return
    }
    var msg1 = ''
    var msg2 = ''
    var title = ''
    var btnTxt1 = ''
    var btnTxt2 = ''
    switch (status) {
      case '0':
        msg1 = '请确认向预约者发送"关闭订单"的申请吗?'
        msg2 = '发送后预约者手机端将出现"申请关闭订单"的申请按钮'
        btnTxt1 = '取消'
        btnTxt2 = '发送'
        break;
      case '2':
        msg1 = '请谨慎审核，关闭订单通过后，系统将无法跟踪记录，请务必办理好货物的交接手续，无论是被预约者取回或预约者指定人员取回或重新预约拼包，都必须办理货物交接手续，切记！'
        title = '关闭订单申请'
        btnTxt1 = '拒绝'
        btnTxt2 = '通过'
        break;
    }

    this.setData({
      msg1: msg1,
      msg2: msg2,
      btnTxt1,
      btnTxt2,
      title: title,
      showErrMsg: true
    })
  },
  clickOperaBtn2:function(){
    var that = this
    if (this.data.res.order.apply_status == 0) { //发送关闭
      this.req('sendCancelOrder',{order_id:this.data.order_id},function(res){
        that.setData({
          showErrMsg: false
        })
      })
    } else if (this.data.res.order.apply_status == 2) { //同意关闭
      this.req('auditCancelOrder',{order_id:this.data.order_id,status:1},function(res){
        that.setData({
          showErrMsg: false
        })
      })
    }
  },
  clickOperaBtn1:function(){
    if (this.data.res.order.apply_status == 2) { //拒绝关闭的
      this.req('auditCancelOrder',{order_id:this.data.order_id,status:2},function(res){
        that.setData({
          showErrMsg: false
        })
      })
    }
  },
  handleUpdateTime:function(){//点击日期申请申请
    // this.req('',{},function(res){})
    this.setData({
      oldTimeMsg: this.data.res.order.appointment_date,
      newTimeMsg:this.data.res.order.appointment_date_audit,
      showErrMsg2: true
    })
  },
  passUpdateTime:function(){//同意改日期
    var that = this
    this.req('auditEditOrder',{order_id: this.data.res.order.id,status: 1},function(res){
      wx.showToast({
        title: '操作成功',
      })
      that.setData({
        showErrMsg2: false
      })
      setTimeout(()=>{that.getInfo()},1500)
    })
  },
  refuseUpdateTime:function(){//拒绝改日期
    var that = this
    this.req('auditEditOrder',{order_id: this.data.res.order.id,status: 2},function(res){
      wx.showToast({
        title: '已拒绝',
        icon: 'none'
      })
      that.setData({
        showErrMsg2: false
      })
    })
  },
  sendCancelFac:function(e){
    var index = e.currentTarget.dataset.index
    var apply = e.currentTarget.dataset.apply
    // this.req('getFactoryAudit',{manufactor_id: this.data.res.factory[index].manufactor_id},function(res){
    //   console.log(res)
    // })
    if (apply == 0) {
      this.setData({
        cancelFacBtn1: '取消',
        cancelFacBtn2: '发送',
        cancelFacMsg1: '确认向预约者发送"取消厂家"的申请吗？发送后预约者手机端将出现"申请取消厂家"的申请按钮',
        showErrMsg3: true,
        curIndex: index
      })
    } else if (apply == 2) {
      this.setData({
        cancelFacBtn1: '拒绝',
        cancelFacBtn2: '通过',
        cancelFacMsg1: '请谨慎审核，取消厂家申请通过后，系统将无法跟踪记录，请务必办理好该厂家货物的交接手续，无论是被预约中取回或预约者指定人员取回或重新预约拼包，都必须办理货物交接手续，切记！',
        showErrMsg3: true,
        curIndex: index
      })
    }
    
  },
  clickCancelFac1:function(){// 取消厂家别扭2
    var that = this
    var apply = this.data.res.factory[this.data.curIndex].apply_status
    if (apply == 0) {
      this.req('sendCancelFactory',{manufactor_id: this.data.res.factory[this.data.curIndex].manufactor_id},function(res){
        that.getInfo()
      })
    } else if (apply == 2) { //同意取消
      this.req('auditCancelFactory',{manufactor_id: this.data.res.factory[this.data.curIndex].manufactor_id,status: 1},function(res){
        that.getInfo()
      })
    }
  },
  clickCancelFac2:function(){//取消厂家按扭1（拒绝）
    var that = this
    var apply = this.data.res.factory[this.data.curIndex].apply_status
    if (apply == 2) {
      this.req('auditCancelFactory',{manufactor_id: this.data.res.factory[this.data.curIndex].manufactor_id,status: 2},function(res){
        that.getInfo()
      })
    }
    
  },
  getAuditInfo:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    this.getFactoryLog(id)
    this.req('getFactoryAudit',{manufactor_id:id},function(res){
      console.log(res)
      if (res.data.result.audit_data) {
        that.setData({
          seeLogFlag: true,
          slotType: false,
          curId: id,
          shenheInfo: res.data.result,
          showRecodeSlot: true,
          slotTxt1: '拒绝',
          slotTxt1: '同意',
        })
      }
    })
  },
  searchValInput:function(e){
    this.setData({
      searchVal: e.detail.value
    })
  },
  searchSomeFac:function(){//搜某个厂家
    var txt = this.data.searchVal
    if (txt == '') {
      return
    }
    var index = this.data.res.factory.findIndex(function(item){
      return item.manufactor_name.indexOf(txt) != -1
    })
    wx.pageScrollTo({
      duration: 300,
      selector: `#fac${index}`
    })
  },
  req:function(url,params,cb){
    request.post('/api/pinbao/' + url,{
      data:params,
      success:function(res){
        cb&&cb(res)
      }
    })
  },
  // delImg:function(e){
//   var that = this
//   var index = e.currentTarget.dataset.index
//   var imgSrc = this.data.imgSrc
//   imgSrc.splice(index,1)
//   request.post(that.data.url + '/api/pinbao/uploadOrderImage',{//图片上传
//     data:{
//       order_id: that.data.order_id,
//       file_image: imgSrc,
//     },
//     success:function(res){
//       console.log(res)
//       that.setData({
//         imgSrc: imgSrc
//       })
//       that.getInfo()
//     } 
//   })
// },

// preUploadImg:function(e){
//   var img = e.currentTarget.dataset.img
//   wx.previewImage({
//     urls: this.data.imgSrc,
//     current: img
//   })
// },
// changeState:function(){//最后一步更改状态
//   const that = this
//   const order_id = this.data.order_id
//   const order_status = this.data.res.order_status
//   var url = order_status == 2 ? "/api/pinbao/takeAway" : "/api/pinbao/packaged"
//   // if (!this.data.changeFlag) {
//   //   return
//   // }
//   request.post(that.data.url + url,{//已打包
//     data:{
//       order_id: order_id,
//     },
//     success:function(res){
//       console.log(res)
//       if (res.data.status==1) {
//         wx.showToast({
//           title: '订单状态修改成功',
//         })
//         that.getInfo()
//         that.setData({
//           finalButton: false
//         })
//       }else {
//         wx.showToast({
//           title: '操作失败，请稍后重试',
//           icon: 'none'
//         })
//       }
//     } 
//   })

// },
// nextState:function(e){//对应厂家的更改状态
//   const that = this
//   var num = e.currentTarget.dataset.num
//   const tempRes = JSON.parse(JSON.stringify(this.data.res))
//   // const requestUrl = this.data.type=="b"?"/api/pinbao/change_order_user_manufactor":"/api/pinbao/change_order_admin_manufactor"
//   const id = e.currentTarget.dataset.id
//   const type2 = e.currentTarget.dataset.type2
//   if (this.data.type == "admin") {//如果是管理员
//     that.setData({
//       showInput: true,
//       goodsSum: num,
//       curId: id,
//       recipientType: type2,
      
//     })
//   }
// },
// changee:function(manufactor_id,requestUrl,content,type){//状态更改抽离
//   const that = this

// },
// 确定签名之后
// imgok:function(){

//   const that = this
//   var i = this.data.res.order_status - 0 + 1
//   var nextStatusTxt = ''
//   if (i==0) {
//     nextStatusTxt = "未送齐"
// } else if(i==1){
//     nextStatusTxt = "待打包"
// }else if(i==2){
//     nextStatusTxt = "待拉包"
// } else  if(i==3){
//     nextStatusTxt = "已拉走"
// }

//   if ( that.data.imgSrc.length ) {
//     return wx.showToast({
//       title: '请上传电子照片',
//       icon: 'none'
//     })
//   }

//   wx.showModal({
//     title: '提示',
//     content: "是否更改订单状态为" + nextStatusTxt + '?该操作无法撤回！！！',
//     success(res){
//       if(res.confirm){
//         that.changeState()
//         // if (that.data.res.order_status == 1) {
//         //   that.changeState()
//         //   return
//         // }
//         // if (that.data.res.order_status == 2) {
//         //   that.changeState()
//         // }
//       }else if (res.cancel){
//         return false
//       }
//     }
//   })
// },

// 重新选择照片
// imgReTake:function(){
//   this.uploadImage()
// },
// looklook:function(){
//   this.setData({
//     isHidden: true,
//     isShowQm: true
//   })
// },
// delCancelOrderImg:function(e){//删除取消订单图片中的图片
//   var index = e.detail.index
//   var img = this.data.fileList
//   img.splice(index,1)
//   this.setData({
//     fileList: img
//   })
// },
// uploadCancelOrderImg:function(e){//取消订单上传图片
//   var that = this
//   // console.log(e)
//   var img = e.detail.file.path
//   wx.uploadFile({
//     filePath: img,
//     name: 'qinzi_imgs',
//     url: that.data.url + '/api/newjoin/upload_qianzi_img',
//     success:function(res){
//       // console.log(res)
//      var result = JSON.parse(res.data)
//      var tempArr = [{url:result.result}]
//      that.setData({
//        fileList: that.data.fileList.concat(tempArr)
//      })
//     }
//   })
// },

})