
var request = require("../../../utils/request")
var app = getApp()
var setting = app.globalData.setting;
var can1 = function(s){
  if ( s < 6 ) {
    return true
  } else {
    return false
  }
}
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

  /**
   * 页面的初始数据
   */
  data: {
    bottomPosition: 0,
    order_id: '',
    type:'',
    operations,
    url: setting.url,
    res: {},
    factory:[],
    flag:true,
    showInput: false,//是否展示收货框
    goodsSum: '',//当前编辑的数量
    curId: 0,//当前编辑的id
    curModifyId:'',//当前修改记录的id
    recipientTitle: '确认收货数量',
    uploadSrc:[],
    isFistIn: true,
    seeLogFlag: false,
    factoryLogInfo: {},
    orderLog: [],
    receiveSlotInputValCol: '#444',
    showFirstFlag: true,//用于判别是不是继续添加厂家返回的  做数据刷新处理
    slotType: true,//true为收货 false审核
    receiveSlotInputVal: '',//收货时的输入框
    receiveSlotInputVal2: '',//收货时的备注
    showRecodeSlot: false,//是否需要插槽
    modifyType: '',//修改记录的类型
    modifyIndex: -1,
    modifyFacNameFlag: false,
    modifyFacName: '',
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
    showReceive: false, //看打包记录
    showModifyLog: false,//修改记录弹框
    modifyData: {//编辑改数据的输入框
      beforeNum: '',
      num: ''
    },
    logId: '',//当前操作的logid
    curIndex1: '',
    curIndex2: '',
    showPackRadio: false,//拉包的radio显示
    curFacName: '',//当前操作的厂家名字
    newRemarkMore: false,
    // ====================4.5代新增 过往需要有时间了替换/删除
    showType: 0,
    sortType:[false,false,false,false],
    isShowPack: false,//是否显示拉包的input和checkbox
    bottomTipBox: '',//控制底部菜单弹出选项
    logType: '',//显示记录的类型  打包记录 拉包记录 拉包操作
    goDetailOperaIndex: '-9',//控制拉包记录的操作按键显示
    deletable: true,//默认上传的图片是可以删除的 未拉包的 设置为false
    disabledUpload: false, //是否禁用上传
    showUploadImg: false,//默认不展示上传图片的  操作查看的时候显示
    curLogIndex: -1,//预先留下当前的记录索引
    receiveFactory: false,//是否显示新增厂家收货
    receiveFactoryList: [],//收货时临时存放的厂家 数量
    receiveFactoryNew: { //新增收货时 临时的 未添加进数组的
      manufactor_name: '',
      num: ''
    },
    applyItemList: [],//审核的几个 动态显示
    showScreen: false,//遮罩
    showScreen2: false,//遮罩
    totalPackNum: 0,//总共本次打包数量
    receiveSlotFocus: false,
    calculation_receive_num: 0,//计算得出的收货数
    calculation_take_num: 0,//计算得出的拉走数
    hasInherit: false,//是否包含结余
    // 针对备注
    addFacRemark: '',
    showAddFacRemark: false,
    curModifyNewFacIndex: -1,
    addFacRemarkFocus: false,
    // 上面是针对备注
    },

  onLoad: function (options) {
    // console.log(options)
    this.setData({
      order_id: options.order_id,
      type: options.type?options.type:'admin',
      bottomPosition: wx.getStorageSync('isiphoneX') ? 'bottom:6rpx;' : ''
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
        if (res.data.status === 1) {
          var tempList = res.data.result
          var flag = false
          if (tempList.order.order_status == 3) {
            flag = true
          }
          if (tempList.order.order_status != 3 && that.data.isFistIn == true) {
            that.setData({
              isFistIn: false,
            })
          }
          tempList.factory.forEach((item)=>{
            item.packNum = item.num2
            item.MaxPackNum = item.num2
            item.canPack = item.num2 > 0 && can1(item.status)
          })
          that.setData({
            res: tempList,
            factory: that.doSwitch(0,tempList.factory),
          })
        }
        wx.stopPullDownRefresh()
      }
    })
  },
  chooseImg(){
    var that = this
    wx.chooseImage({
      count: 3,
      success(res){
        console.log(res)
        res.tempFilePaths.forEach((item)=>{
          that.uploadFile(item)
        })
      }
    })
  },
  afterRead:function(e){
    console.log(e.detail.file.path)
    this.uploadFile(e.detail.file.path)
  },
  delUploadImg:function(e){//删除上传的图片
    var imgs = this.data.orderLog[this.data.curLogIndex].img
    imgs.splice(e.detail.index,1)
    this.setData({
      [`orderLog[${this.data.curLogIndex}].img`]: imgs
    })
  },
  uploadFile:function(src){
    var index = this.data.curLogIndex
    if (this.data.orderLog[index].img >= 3) {
      return
    }
    wx.showLoading({
      title: '上传中...',
      mask:true
    })
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
        that.setData({
          [`orderLog[${that.data.curLogIndex}].img`]: [...that.data.orderLog[that.data.curLogIndex].img,...[{url: result.result}]]
        })
        wx.hideLoading()
      }
    })
},

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
  onPageScroll(){
    this.setData({
      bottomTipBox: '-2'
    })
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
    var tel = e.currentTarget.dataset.tel
    var telReg = /^[1][3,4,5,7,8,9][0-9]{9}$/
    if (!telReg.test(tel)) {
      return
    }
    wx.makePhoneCall({
      phoneNumber: tel,
    })

  },

  showRecord:function(e){//显示记录
    if (this.data.isShowPack) {
      return
    }
    var id = e.currentTarget.dataset.id
    var slotType = true //是否要显示插槽
      if (e.currentTarget.dataset.status == 6 || e.currentTarget.dataset.status == 7 || this.data.res.order.position_is_null == 1) {
        slotType = false
      }
    this.setData({
      showRecodeSlot: slotType,
      slotType: slotType ,
      curId: id,
      receiveSlotInputVal: e.currentTarget.dataset.num < 0 ? '' : e.currentTarget.dataset.num,
      modifyIndex: e.currentTarget.dataset.index
    })
    this.getFactoryLog(id)
  },

  closeLog:function(){ //关闭记录
    this.setData({
      seeLogFlag: false,
    })
  },
  getFactoryLog:function(id){//获取厂家记录====================
    var that = this
    request.get( that.data.url + '/api/pinbao/getFactoryLog',{
      data:{ manufactor_id: id },
      success:function(res){
        that.setData({
          seeLogFlag: true,
          factoryLogInfo: res.data.result,
          receiveSlotFocus: true,
          receiveSlotInputVal2: res.data.result.receive_remark || '',
        })
      }
    })
  },

  receiveSlotbindblur(e){
    var val = e.detail.value
    if (val) {
      if (val.charAt(0) == '-') {
        this.setData({
          receiveSlotInputValCol: '#f10215'
        })
      } else {
        this.setData({
          receiveSlotInputValCol: '#444'
        })
      }
    }
  },

  clickSlotBtn1:function(){//插槽点击左按钮
    var that = this
      this.setData({
        seeLogFlag: false
      })
  },
  clickSlotBtn2:function(){//插槽点击右按钮
    var id = this.data.curId
    var sum = this.data.receiveSlotInputVal + ''
    var remark = this.data.receiveSlotInputVal2
    var regRule = /^[\u4E00-\u9FA5A-Za-z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F\s/]+$/
    var that = this
      if (sum.trim() == '' || sum.trim() == 0) {
        return wx.showToast({
          title: '请输入收货数量',
          icon: 'none'
        })
      }
      if (remark.trim() != '' && !regRule.test(remark)) {
        return wx.showToast({
          title: '备注只能输入汉字 + 符号',
          icon: 'none'
        })
      }
      this.req('addReceiveLog',{
        type:'1',
        num:sum,
        remark: remark,
        manufactor_id: id
      },function(res){
        // console.log(res)
        that.setData({
          seeLogFlag:false,
        })
        that.getInfo()
      })
    
  },

  modifyRecode:function(e){//编辑记录
    if (this.data.res.order.position_is_null == 1) {
      return wx.showToast({
        title: '当前状态订单无法继续操作',
        icon: 'none'
      })
    }
    console.log(e)
    var type = e.detail.type
    var info = e.detail.info
    this.setData({
      showInput: true,
      recipientTitle: '请输入',
      goodsSum: '',
      curModifyId: info.id,
      modifyType: type
    })
  },
  modifyFacName:function(e){
    var index = this.data.modifyIndex
    this.setData({
      modifyFacNameFlag: true,
      modifyFacName: this.data.factory[index].manufactor_name
    })
  },
  confirmModifyName(){//确定改名字
    var name = this.data.modifyFacName + ''
    var that = this
    if (name == '' || name.trim() == '' ) {
      return wx.showToast({
        title: '名字不能为空',
        icon: 'none'
      })
    }
    if (name.trim() == this.data.factory[this.data.modifyIndex].manufactor_name) {
      return
    }
    console.log(this.data.curId,name)
    this.req('editFactoryNameAdmin',{manufactor_id:this.data.curId, manufactor_name: name },function(res){
      wx.showToast({
        title: '修改成功',
      })
      setTimeout(()=>{that.getFactoryLog(that.data.curId)},800)
    })
  },
  clickOperaBtn2:function(){ //拒绝取消订单
    var that = this
    this.req('auditOrder',{order_id: this.data.order_id, type: 1,status: 2},function(res){
      wx.showToast({
        title: '已拒绝',
        icon: 'none'
      })
      setTimeout(()=>{
        that.getInfo()
        that.setData({
          msg1: '',
          msg2: '',
          btnTxt1: '',
          btnTxt2: '',
          title: '',
          showErrMsg: false
        })
      },800)
    })
  },
  clickOperaBtn1:function(){//同意取消订单
    var that = this
    this.req('auditOrder',{order_id: this.data.order_id, type: 1,status: 1},function(res){
      wx.showToast({
        title: '操作成功',
        icon: 'none'
      })
      setTimeout(()=>{
        that.getInfo()
        that.setData({
          msg1: '',
          msg2: '',
          btnTxt1: '',
          btnTxt2: '',
          title: '',
          showErrMsg: false
        })
      },800)
    })
  },

  passUpdateTime:function(){//同意改日期
    var that = this
    this.req('auditOrder',{order_id: this.data.order_id, type: 2,status: 1},function(res){
      wx.showToast({
        title: '操作成功',
      })
      setTimeout(()=>{
        that.getInfo()
        that.setData({
          showErrMsg2: false
        })
      },800)
    })
  },
  refuseUpdateTime:function(){//拒绝改日期
    var that = this
    this.req('auditOrder',{order_id: this.data.order_id, type: 2,status: 2},function(res){
      wx.showToast({
        title: '已拒绝',
        icon: 'none'
      })
      setTimeout(()=>{
        that.getInfo()
        that.setData({
          showErrMsg2: false
        })
      },800)
    })
  },

  clickCancelFac1:function(){// 拒绝取消厂家
    var that = this
    this.req('auditOrder',{order_id: this.data.order_id, type: 3,status: 2, manufactor_id: this.data.curId},function(res){
      wx.showToast({
        title: '已拒绝',
        icon: 'none'
      })
      setTimeout(()=>{
        that.getInfo()
        that.setData({
          msg1: '',
          msg2: '',
          btnTxt1: '',
          btnTxt2: '',
          title: '',
          showErrMsg3: false
        })
      },800)
    })
  },
  clickCancelFac2:function(){// 同意取消厂家
    var that = this
    this.req('auditOrder',{order_id: this.data.order_id, type: 3,status: 1, manufactor_id: this.data.curId},function(res){
      wx.showToast({
        title: '操作成功',
        icon: 'none'
      })
      setTimeout(()=>{
        that.getInfo()
        that.setData({
          msg1: '',
          msg2: '',
          btnTxt1: '',
          btnTxt2: '',
          title: '',
          showErrMsg3: false
        })
      },800)
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
  // ====================================================第四代
  seeRecodeLG(e){//拉包记录 打包记录
    var type = e.currentTarget.dataset.type
    var that = this
    if (type == 'da') { //显示打包记录
      that.req('getPackLogAdmin',{order_id: this.data.order_id},function(res){
        if (res.data.result) {
          if (res.data.result.length == 0) {
            return wx.showToast({
              title: '该订单暂无相关记录',
              icon: 'none'
            })
          } else {
            that.setData({
              orderLog: res.data.result || [],
              showReceive: true,
              logType: '打包记录'
            })
          }
        }
      })
    } else { //getTakePackLog
      that.req('getTakePackLog',{order_id: this.data.order_id},function(res){
        if (res.data.result) {
          if (res.data.result.length == 0) {
            wx.showToast({
              title: '该订单暂无相关记录',
              icon: 'none'
            })
          } else {
            that.setData({
              orderLog: res.data.result || [],
              showReceive: true,
              logType: '拉包明细',
              disabledUpload: false
            })
          }
        }
        
      })
    }
  },
  showGoOpera(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      goDetailOperaIndex: this.data.goDetailOperaIndex == index ? -4 : index
    })
  },
  modifyLog(e){//跳出修改数量的框
    if (this.data.res.order.position_is_null == 1) {
      return wx.showToast({
        title: '当前状态订单无法继续操作',
        icon: 'none'
      })
    }
    var id = e.currentTarget.dataset.logid
    var num = e.currentTarget.dataset.num
    var index1 = e.currentTarget.dataset.index1
    var index2 = e.currentTarget.dataset.index2

    this.setData({
      logId: id,
      showModifyLog: true,
      curIndex1: index1,
      curIndex2: index2,
      [`modifyData.beforeNum`]: num,
      curFacName: this.data.orderLog[index1].log[index2].manufactor_name
    })

  },
  operationReceiveBtn2(e){//新增厂家底下按钮操作 //多个厂家的
    var type = e.currentTarget.dataset.type
    var list = this.data.receiveFactoryList
    var that = this
    if (type == 'confirm') { //点击 新增收货的确定
      // var sendList = []
      // var nameReg = /[`~!@#$^&*()=|{}':;',\[\].<>\?~！@#￥……&*（）——|{}【】‘；：”“""'。，、？]/
      var s = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
      var regRule = /^[\u4E00-\u9FA5A-Za-z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F\s/]+$/
      var sumReg = /^\d{1,5}$/
      var indexErr = 'none'
      var indexErr2 = 'none'
      list.forEach((item,index)=>{
        item.receive_remark = item.receive_remark || ''
        if (!s.test(item.manufactor_name) || item.manufactor_name.trim() == '' || !sumReg.test(item.num)) {
          indexErr = index
        }
        // 
        if ( item.receive_remark && !regRule.test(item.receive_remark)) {
          indexErr2 = index
        }
      })
      if (indexErr != 'none') {
        return wx.showToast({
          title: `厂名"${list[indexErr].manufactor_name}"填写格式不正确`,
          icon: 'none'
        })
      }
      if (indexErr2 != 'none') {
        return wx.showToast({
          title: `厂名"${list[indexErr2].manufactor_name}"备注请填写中文+符号`,
          icon: 'none'
        })
      }
      if (list.length== 0) {
        return wx.showToast({
          title: '请填写完整厂名及数量',
          icon: 'none'
        })
      }

      // console.log({manufactor: JSON.stringify(list),order_id: this.data.showInfo[this.data.curIndex].order_id})
      // return
      this.req('addFactoryReceiveLog',{manufactor: JSON.stringify(list),order_id: this.data.order_id},function(res){
        wx.showToast({
          title: '收货成功',
        })
        that.setData({
          receiveFactory: false,
          receiveFactoryNew: {manufactor_name: '', num: ''},
          receiveFactoryList: []
        })
        setTimeout(()=>{
          that.getInfo()
        },1500)
      })
    } else {
      this.setData({
        receiveFactory: false,
        showReceiveOneFac: false,
        receiveFactoryNew: {manufactor_name: '', num: ''},
        curLogIndex: 'none'
      })
    }
  },
  operationReceiveBtn(e){//记录中的更改
    var type = e.currentTarget.dataset.type
    var that = this
    // var nameReg = /[`~!@#$^&*()=|{}':;',\[\].<>\?~！@#￥……&*（）——|{}【】‘；：”“""'。，、？]/
    var sumReg = /^\d{1,5}$/
    var num = this.data.modifyData.num
    
    if (type == 'confirm') { //点击 新增收货的确定
      if (!sumReg.test(num)) {
        return wx.showToast({
          title: '请正确填写数量',
          icon: 'none'
        })
      }
      this.req('editOperateLog',{id: that.data.logId, num: num},function(res){
        wx.showToast({
          title: '操作成功',
        })
        that.setData({
          logId: '',
          modifyData: {
            beforeNum: '',
            num: ''
          },
          curIndex1: '',
          curIndex2: '', 
          showModifyLog: false,
        })
        
        setTimeout(()=>{
          that.getInfo()
          that.req('getPackLogAdmin',{order_id: that.data.order_id},function(res){
            that.setData({
              orderLog: res.data.result || []
            })
          })
        },800)
      })
    } else {
      this.setData({
        showModifyLog: false,
        modifyData: {
          beforeNum: '',
          num: ''
        },
        curIndex1: '',
        curIndex2: '',
      })
    }
  },
  receiveFactoryDel(e){//从增加收货里面删除一行
    var index = e.currentTarget.dataset.index
    var list = this.data.receiveFactoryList
    list.splice(index,1)
    this.setData({
      receiveFactoryList: list
    })
  },
  receiveFactoryInput(e){ //新增厂家收货的
    var index = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type
    var val = e.detail.value
    if (type == 'name') {
      this.setData({
        [`receiveFactoryList[${index}].manufactor_name`]: val
      })
    } else {
      this.setData({
        [`receiveFactoryList[${index}].num`]: val
      })
    }
    this.setData({
      
    })
  },
  receiveFactoryInput3(e){
    var type = e.currentTarget.dataset.type
    var val = e.detail.value
    if (type == 'name') {
      this.setData({
        [`receiveFactoryNew.manufactor_name`]: val
      })
    } else {
      this.setData({
        [`receiveFactoryNew.num`]: val
      })
    }
  },
  receiveFactoryInput2(e){ //
    var type = e.currentTarget.dataset.type
    var val = e.detail.value
    if (type == 'name') {
      this.setData({
        [`modifyData.beforeNum`]: val
      })
    } else if(type == 'sum') {
      this.setData({
        [`modifyData.num`]: val
      })
    } else {
      this.setData({
        [`modifyData.receive_remark`]: val
      })
    }
  },
  checkBlur(){ //失去焦点判断并增加
    var { manufactor_name, num } = this.data.receiveFactoryNew
    if ( manufactor_name != '' && num != '' ) {
      this.setData({
        receiveFactoryList: [...this.data.receiveFactoryList,{manufactor_name: manufactor_name,num: num}],
        receiveFactoryNew: {manufactor_name: '', num: ''}
      })
    }
  },
  choosePack(e){//切换勾选包
    if (this.data.res.order.position_is_null == 1) {
      return wx.showToast({
        title: '当前状态订单无法继续操作',
        icon: 'none'
      })
    }
    var index = e.currentTarget.dataset.index
    var pid = e.currentTarget.dataset.pid

    if (pid > 0) {
      this.setData({
        [`orderLog[${index}].lj1`]: false
      })
      return wx.showToast({
        title: '该包裹已拉走',
        icon: 'none'
      })
    }
    this.setData({
      [`orderLog[${index}].lj1`]: !this.data.orderLog[index].lj1
    })
  },
  revokeGo(e){//撤销拉包
    if (this.data.res.order.position_is_null == 1) {
      return wx.showToast({
        title: '当前状态订单无法继续操作',
        icon: 'none'
      })
    }
    var id = e.currentTarget.dataset.id
    var that = this
    // return
    wx.showModal({
      content: '是否撤销本包裹的拉包?撤销后，厂家货物状态将回到 -打好包未拉- 的状态。',
      confirmColor: '#18c2ba',
      success (res) {
        if (res.confirm) {
          that.req('cancelTakePack',{order_id: that.data.order_id, pack_log_id: id}, function(res){
            wx.showToast({
              title: '操作成功',
            })
            setTimeout(()=>{
              that.setData({
                showReceive: false
              })
              that.getInfo()
            },800)
          })
        } else if (res.cancel) {}
      }
    })
    
  },
  showPackRadio(e){//显示拉包的radio
    var type = e.currentTarget.dataset.type
    if (this.data.res.order.order_status >= 5 ) {
      return 
    }
    if (type == 'show') {
      if (this.data.uploadSrc.length == 0) { //先判断有没有图片
        return wx.showToast({
          title: '拉包之前必须上传拉包凭证(拍照)',
          icon: 'none'
        })
      }
    }
    this.setData({
      showPackRadio: type == 'show'
    })
  },
  shreLaBao(){//确定拉包
    var that = this
    var list = this.data.orderLog.filter((item)=>{
      return item.pid <= 0 && item.img.length > 0
    })
    if (list.length == 0) {
      return wx.showToast({
        title: '请上传图片，选择要拉包的包裹后再拉包~',
        icon: 'none'
      })
    }

    var params = {
      order_id: this.data.order_id,
      pack_data: []
    }
    list.forEach((item)=>{
      var imgs = []
      item.img.forEach((item2)=>{
        imgs.push(item2.url)
      })
      params.pack_data.push({
        pack_log_id: item.id,
        img: imgs.join(',')
      })
    })
    
    params.pack_data = JSON.stringify(params.pack_data)
    console.log(params)
  //  return
    this.req('takeAway',params, function(res){
      wx.showToast({
        title: '操作成功',
      })
      setTimeout(()=>{
        that.getInfo()
        that.setData({
          showReceive: false,
          showUploadImg: false
        })
      },800)

    })
  },
  seeDetailFac(e){
    var index = e.currentTarget.dataset.index
    wx.showLoading()
    this.setData({
      [`orderLog[${index}].lj`]: !this.data.orderLog[index].lj
    })
    setTimeout(()=>{wx.hideLoading()},300)
  },
  collectedRecord(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      [`orderLog[${index}].lj`]: !this.data.orderLog[index].lj
    })
  },
  closeModifyPopup(){
    this.setData({
      showReceive: false,
      receiveFactory: false,
      goDetailOperaIndex: -99,
      showAddFacRemark: false
    })
  },
  newRemarkMore(){//查看更多备注
    this.setData({
      newRemarkMore: true
    })
  },
  showScreen(){ //显示筛选
    this.setData({
      showScreen: true,
      bottomTipBox: '-2',
      showScreen2: false
    })
  },
  switchFac(e){ //筛选操作
    var index = e.currentTarget.dataset.index
    this.setData({
      factory: this.doSwitch(index,this.data.res.factory),
      showType: index
    }) 
  },
  doSwitch(i,fac){ //筛选的操作抽离  多处使用
    wx.showLoading()
    var list = []
    if (!fac || fac.length == 0) {
      wx.hideLoading()
      this.setData({
        showScreen: false
      })
      return list
    }
    var i = i + ''
    switch (i) {
      case '0'://默认
      list = fac.filter((item)=>{
        return item.status <= 5
      })
        break;
      case '1'://已送齐
        list = fac.filter((item)=>{
          return (((item.receive_num >= item.goods_number) && item.goods_number > 0) || (item.goods_number == 0 && item.receive_num > 0)) && item.status < 6
        })
        break;
      case '2'://未送齐
      list = fac.filter((item)=>{
        // return (((item.receive_num > 0 && item.goods_number > item.receive_num) || (item.receive_num == 0 && item.goods_number == 0) || (item.goods_number > 0 && item.receive_num == 0) )) && item.status < 6
        return (item.goods_number > item.receive_num || (item.goods_number == 0 && item.receive_num == 0) ) && item.status < 6
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
    } else if (type == 'num1' || type == 'receive_num' || type == 'num4') {
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
  searchInput(e){ //顶部搜索厂家
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
  clickBottomItem(e){//4.5代 点击底部菜单选项
    var that = this
    var type = e.currentTarget.dataset.type
    switch (type) {
      case 'pack'://点击的打包
        this.judgePack()
        this.setData({
          bottomTipBox: '',
          showScreen2: false
        })
        break;
      case 'go'://点击的拉包
        that.req('getPackLogAdmin',{order_id: this.data.order_id},function(res){
          if (res.data.result) {
            if (res.data.result.length == 0) {
              wx.showToast({
                title: '该订单可拉包数为0',
                icon: 'none'
              })
            } else {
              that.setData({
                orderLog: res.data.result || [],
                showReceive: true,
                bottomTipBox: '',
                logType: '拉包操作',
                showScreen2: false
              })
            }
          }
          
        })
        break;
      case 'tel'://点击的电话
        that.setData({
          bottomTipBox: that.data.bottomTipBox == 'tel' ? '-9' : 'tel',
          showScreen2: that.data.bottomTipBox == 'tel' ? false : true
        })
        break;
      case 'log'://点击的明细
      that.setData({
        bottomTipBox: that.data.bottomTipBox == 'log' ? '-9' : 'log',
        showScreen2: that.data.bottomTipBox == 'log' ? false : true
      })
        break;
      default:
        break;
    }
  },
  closeBottomTips(){ //关闭底部弹起的选项框
    this.setData({
      bottomTipBox: ''
    })
  },
  clickDotted(){ //点击的底部圆点
    var that = this
    var arr = []
    if (that.data.bottomTipBox == 'dotted') {
      that.setData({
        bottomTipBox: '-99',
        showScreen2: false
      })
      return
    }
    this.req('getOrderAuditData',{order_id: this.data.order_id},function(res){
      var result = res.data.result
      if (!result || result.length == 0) {
        arr = []
      } 
      result.forEach((item)=>{
        if (item.type == 1) {
          arr.push({
            name: '关闭订单/待审核',
            msg1: '请谨慎审核，关闭订单通过后，系统将无法跟踪记录，请务必办理好货物的交接手续，无论是被预约者取回或预约者指定人员取回，都必须办理货物交接手续，切记！',
            msg2: '',
            btnTxt1: '通过',
            btnTxt2: '拒绝',
            errMsgTitle: '用户申请关闭订单',
            showErrMsg: true,
            type: 'dd'
          })
        }
        if (item.type == 2) {
          arr.push({
            name: '变更打包日期/待审核',
            oldTimeMsg: that.data.res.order.appointment_date,
            newTimeMsg: item.appointment_time,
            showErrMsg2: true,
            type: 'rq'
          })
        }
        if (item.type == 3) {
          arr.push({
            name: '取消厂家/待审核',
            showErrMsg3: true,
            cancelFacBtn1: '通过',
            cancelFacBtn2: '拒绝',
            cancelFacMsg1: '请谨慎审核，取消厂家后，系统将无法跟踪记录，请务必办理好该厂家货物的交接手续，无论是被预约者取回或预约者指定人员取回，都必须办理货物交接手续，切记！',
            curId: item.manufactor_id,
            curFacName: item.manufactor_name,
            type: 'fac'
          })
        }
      })
      console.log(arr)
      if (that.data.res.order.order_status && that.data.res.order.cancel_code > 0 ) {
        arr.push({
          name: `取消厂家确认码:${that.data.res.order.cancel_code}`,
          type: 'cancel'
        })
      }
      that.setData({
        bottomTipBox: that.data.bottomTipBox == 'dotted' ? '-9' : 'dotted',
        applyItemList: arr,
        showScreen2: true
      })
    })

  },
  clickDottedItem(e){ //点击的圆点的弹出框
    var that = this
    var type = e.currentTarget.dataset.type
    if (type == 'yyxx') {
      this.setData({
        bottomTipBox: 'yyxx',
      })
    } else {
    var index = e.currentTarget.dataset.index
      var obj = that.data.applyItemList[index]
      for (const key in obj) {
        if (key != 'name' && key != 'type') {
          that.setData({
            [`${key}`]: obj[key]
          })
        }
      }
      that.setData({
        bottomTipBox: '-9'
      })
    }
    that.setData({
      showScreen2: false
    })
  },
  judgePack(){ //点击打包 判断是否可以打包
    var that = this
    
    that.setData({
      showType: 0,
      factory: that.doSwitch(0,JSON.parse(JSON.stringify(that.data.res.factory))) //注意指向问题，取消打包还原时候用到
    },function(){
      var canSum = 0
      var num = 0
      var list = that.data.res.factory
      list.forEach((item)=>{
        if (item.canPack) {
          canSum++
        }
        if (item.canPack && item.lj) {
          num += parseInt(item.packNum)
        }
      })
      if (canSum == 0) {
        return wx.showToast({
          title: '抱歉，当前订单没有厂家可以操作打包，请先收货后再操作打包~',
          icon: 'none'
        })
      } else {
        that.setData({
          isShowPack: true,
          totalPackNum: num
        })
      }
    })
  },
  packInputChange(e){ //打包时数量变化
    var index = e.currentTarget.dataset.index
    var val = e.detail.value
    this.setData({
      [`factory[${index}].packNum`]: val
    })
  },
  packInputBlur(e){
    var index = e.currentTarget.dataset.index
    var val = e.detail.value
    var numReg = /^\d{1,5}$/
    var fac = this.data.factory
    var num = 0
    if (!numReg.test(val)) {
      this.setData({
        [`factory[${index}].packNum`]: 0
      })
      wx.showToast({
        title: `厂名"${fac[index].manufactor_name}"数量填写不正确`,
        icon: 'none'
      })
    }
    fac.forEach((item)=>{
      if (item.canPack && item.lj) {
        num += parseInt(item.packNum)
      }
    })
    this.setData({
      totalPackNum: num
    })
  },
  choosePackFac(e){ //选择要打包的厂家
    var index = e.currentTarget.dataset.index
    var fac = this.data.factory
    var num = 0
    this.setData({
      [`factory[${index}].lj`]: !fac[index].lj
    },function(){
      this.data.factory.forEach((item)=>{
        if (item.canPack && item.lj) {
          num += parseInt(item.packNum)
        }
      })
      this.setData({
        totalPackNum: num
      })
    })

  },
  confirmPack(){//确定打包
    var that = this
    var facs = this.data.factory
    var packFac = facs.filter((item)=>{
      return item.canPack && item.lj
    })
    if (packFac.length == 0) {
      return wx.showToast({
        title: '没有打包的厂家',
        icon: 'none'
      })
    }
    var nameA = 'none'
    var nameB = 'none'
    var maxSum = ''
    var numReg = /^\d{1,5}$/
    var params = []
    packFac.forEach((item,index)=>{
      if (!numReg.test(item.packNum) || item.packNum == 0 || item.packNum == '') {
        nameA = item.manufactor_name
      }
      if (item.packNum > item.MaxPackNum) {
        nameB = item.manufactor_name
        maxSum = item.MaxPackNum
      }
      params.push({
        manufactor_id: item.manufactor_id,
        num: item.packNum
      })
    })
    if (nameA != 'none') {
      return wx.showToast({
        title: `"${nameA}"数量填写错误`,
        icon: 'none'
      })
    }
    if (nameB != 'none') {
      return wx.showToast({
        title: `"${nameB}"打包数不能高于收货未打包数"${maxSum}手"`,
        icon: 'none'
      })
    }
    var data = {order_id: this.data.order_id}
    data.data = JSON.stringify(params)
    console.log(data)
    // return
    this.req('packaged',data,function(res){ //提交处理
      console.log(res)
      that.setData({
        isShowPack: false
      })
      that.getInfo()
    })
  },
  unPack(){//取消打包了,还原数据
    this.setData({
      isShowPack: false,
      factory: this.doSwitch(0,this.data.res.factory)
    })
  },
  closeScreen(){//关闭筛选
    this.setData({
      showScreen: false,
    })
  },
  closeScreen2(){//关闭筛选
    this.setData({
      showScreen2: false,
      bottomTipBox: '-999'
    })
  },
  seeUploadBox(e){ //打开上传图片的框
    var index = e.currentTarget.dataset.index
    var log = this.data.orderLog[index]
    if (log.img.length == 0) {
      this.setData({
        curLogIndex: index,
      })
      this.chooseImg()
      return
    }
    this.setData({
      curLogIndex: index,
      showUploadImg: true,
      deletable: log.pid == 0,
      disabledUpload: log.pid > 0 || this.data.logType == '拉包明细'
    })
  },
  absCloseUpload(){//关闭图片显示
    this.setData({
      showUploadImg: false
    })
  },
  reChooseGoPack(e){//选中不选中 要拉包的包
    var index = e.currentTarget.dataset.index
    var log = this.data.orderLog[index]
    if (log.img.length == 0) {
      return wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      })
    }
    if (log.pid > 0) {
      return false
    }
    this.setData({
      [`orderLog[${index}].lj1`]: !this.data.orderLog[index].lj1
    })
  },
  PopupAddNewFac(e){ //新增厂家收货
    if (this.data.res.order.position_is_null == 1) {
      return wx.showToast({
        title: '当前状态订单无法继续操作',
        icon: 'none'
      })
    }
    this.setData({
      showReceive: false,
      receiveFactory: true
    })
  },
  // 针对备注新增加的
  showAddFacRemark(e){
    this.setData({
      showAddFacRemark: true,
      curModifyNewFacIndex: e.currentTarget.dataset.index,
      addFacRemark: this.data.receiveFactoryList[e.currentTarget.dataset.index].receive_remark || '',
      addFacRemarkFocus: true,
    })
  },
  addFacRemarkInput(e){
    this.setData({
      addFacRemark: e.detail.value
    })
  },
  confirmAddFacRemark(){
    this.setData({
      [`receiveFactoryList[${this.data.curModifyNewFacIndex}].receive_remark`]: this.data.addFacRemark,
      addFacRemark: '',
      showAddFacRemark: false
    })
  },
})