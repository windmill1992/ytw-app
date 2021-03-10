const app = getApp()
var request = require("../../../utils/request")
var setting = app.globalData.setting;
var isNumber = false
var screenItems = [{
    name: '未送货',
    i: 0,
  },
  {
    name: '送货中',
    i: 1,
  },
  {
    name: '部分已打包/待拉',
    i: 2,
  },
  {
    name: '已打包/待拉',
    i: 3,
  },
  {
    name: '部分已拉包',
    i: 4,
  },
  {
    name: '已完成',
    i: 5,
  }

]
var loadFlag = true
Page({
  data: {
    url: setting.url,
    screenItems: screenItems,
    dataNow: + new Date(),
    active: 0,
    ffooccuuss:false,
    ffooccuuss2:false,
    index: 'a', //用于长按忽略
    isShowMsg: false, //忽略弹窗
    // 单独厂家收货 s
    seeLogFlag: false,
    showRecodeSlot: false,
    slotType: false,
    receiveSlotFocus:false,
    receiveSlotInputVal: '',
    receiveSlotInputVal2: '',
    factoryLogInfo: null,
    addFacRemark: '',
    showAddFacRemark: false,
    curModifyNewFacIndex: -1,
    modifyFacNameFlag: false,
    modifyFacName: '',
    addFacRemarkFocus: false,
    // 单独厂家收货 e
    //仓位列表
    p: 1,
    size: -999,
    showInfo: [], //用来展示的
    cangInFo: [],
    seeScreen: false, //筛选的选项是否可见
    searchTxt: '', //确认码
    type: 1, //当前的列表类型
    orderType: -99, //当前的筛选类型
    otherCssRight: '-999rpx',
    curId: '',
    curIndex: '',//当前操作的 order index
    curFacIndex: '',//当前操作的 厂家 index
    curLogIndex: 'none',//当前操作的log index
    showReceive: false,
    orderAuditCount: 0,
    isFirst: true,
    icons: [
      {
        normal: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-today-off.png',
        active: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-today-on.png'
      },
      {
        normal: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-his-off.png',
        active: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-his-on.png'
      },
      {
        normal: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-shenhe-off.png',
        active: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-shenhe-on.png'
      },
      {
        normal: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-done-off.png',
        active: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-done-on.png'
      },
      {
        normal: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-other-off.png',
        active: setting.url + '/public/static/images/minniapp/subcontract-admin-tabbar-other-on.png'
      },
    ],
    receiveFactory: false,
    receiveFactoryNew: {
      manufactor_name: '',
      num: ''
    },
    receiveFactoryList: [],//收货时临时存放的厂家 数量
    orderReceiveLog: {
      factory: [],
      auth_code: '',
      name: '',
      receipt_address: ''
    },//弹出记录条木框数据
    showReceiveOneFac: false,
    curFacName: '',//当前操作收货的厂家名字
    searchInputType: 'text',
    receBtnClicked: false
  },
  getOrderAuditCount:function(){
    var that = this
    request.get(that.data.url + '/api/pinbao/getOrderAuditCount',{
      data:{},
      success:function(res){
        that.setData({
          orderAuditCount: res.data.result
        })
      }
    })
  },
  onLoad: function (options) {
    console.log(this.data.dataNow)
    this.getInfo(1, 1, -999)
    // this.getOrderAuditCount()
  },
  //获取仓位可用信息
  getCangInfo: function () {
    const that = this
    request.get(that.data.url + '/api/pinbao/getPositionList', {
      success: function (res) {
        that.setData({
          cangInFo: res.data.result.position,
        })
        var sum = 0
        that.data.cangInFo.forEach((item) => {
          sum = Number(item.used_number) + Number(sum)
        })
        that.setData({
          sum: sum,
          otherCssRight: '-999rpx'
        })
      }
    })
  },
  // 获取所有订单信息
  getInfo: function (p, type, orderType) {
    this.getOrderAuditCount()
    var navigationText = ['','当日未完成','历史未完成','待审核','已完成','','已取消','已关闭',]
    wx.setNavigationBarTitle({
      title: navigationText[type],
    })
    if (loadFlag == false) {
      return
    }
    loadFlag = false
    // console.log('getInfo')
    const that = this
    request.get(that.data.url + '/api/Pinbao/getAdminOrderList', {
      data: {
        p: p,
        type: type,
        order_type: orderType,
      },
      success: function (res) {
        that.setData({
          showInfo: that.data.showInfo.concat(res.data.result),
          seeScreen: false,
          otherCssRight: '-999rpx'
        })
        wx.stopPullDownRefresh()
        loadFlag = true
      }
    })
  },
  resetParams: function () { // 重置 P showInfo数组 
    this.setData({
      p: 1,
      showInfo: [],
      orderType: -99,
    })
    // this.getOrderAuditCount()
  },
  todetail: function (e) { // 前往详情
    var id = e.currentTarget.dataset.id
    var type = this.data.type
    wx.navigateTo({
      url: '/pages/subcontract/detail/detail?order_id=' + id + '&ordertype=' + type,
    })
  },
  showRecord:function(e){//显示记录
    // if (this.data.isShowPack) {
    //   return
    // }
    var id = e.currentTarget.dataset.id
    var slotType = true //是否要显示插槽
      if (e.currentTarget.dataset.status == 6 || e.currentTarget.dataset.status == 7 || this.data.showInfo[this.data.curIndex].position_is_null == 1) {
        slotType = false
      }
    this.setData({
      showRecodeSlot: slotType,
      slotType: slotType ,
      curFacIndex: e.currentTarget.dataset.index,
      receiveSlotInputVal: e.currentTarget.dataset.num < 0 ? '' : e.currentTarget.dataset.num,
      
    })
    this.getFactoryLog(id)
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
  clickSlotBtn1:function(){//插槽点击左按钮
    var that = this
      this.setData({
        seeLogFlag: false
      })
  },
  clickSlotBtn2:function(){//插槽点击右按钮
    var id = this.data.orderReceiveLog.factory[this.data.curFacIndex].id
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
        // that.getFactoryLog(id)
        that.req('getReceiveLog',{order_id: that.data.showInfo[that.data.curIndex].order_id},function(res){
          that.setData({
            orderReceiveLog: res.data.result,
            receBtnClicked: true,
            seeLogFlag: false,
          })
        })
      })
    
  },
  closeLog(){
    this.setData({
      seeLogFlag: false
    })
  },
  onPullDownRefresh: function () {
    this.setData({
      p: 1,
      showInfo: [],
      dataNow: + new Date()
    })
    loadFlag = true
    this.getInfo(1,this.data.type, this.data.orderType)
  },

  onReachBottom: function () {
    var p = this.data.p + 1
    this.getInfo(p, this.data.type, this.data.orderType)
    this.setData({
      p: p,
      otherCssRight: '-999rpx'
    })
  },
  onShareAppMessage: function () {

  },

  onShow: function () {
    if (this.data.isFirst) {
      this.setData({
        isFirst: false
      })
    } else {
      this.setData({
        p: 1,
        showInfo: [],
        dataNow: + new Date()
      },function(){
        this.getInfo(1,this.data.type, this.data.orderType)
      })
      
    }
  },
  receiveSlotbindblur(e){ //单独厂家收货的输入框变化
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
  // ============================================================ 2 版本
  showScreen: function () { //切换显示筛选规则
    this.setData({
      seeScreen: !this.data.seeScreen
    })
  },
  onPageScroll(e) {
    if (this.data.index != 'a') {
      var index = this.data.index
      this.setData({
        seeScreen: false,
        [`showInfo[${index}].lj`]: '0',
        index: 'a',
        otherCssRight: '-999rpx',
      })
    } else {
      this.setData({
        seeScreen: false,
        otherCssRight: '-999rpx',
      })
    }
  },
  searchInput: function (e) { //搜索框
    var txt = e.detail.value
    this.setData({
      searchTxt: txt
    }, function () {
      if (this.data.searchTxt.length == 5 && isNumber) {
        this.searchOrder()
      }
    })

  },
  searchOrder: function () { //按校验码查询
    var txt = this.data.searchTxt
    var exp = /^\d{5}$/
    if (!exp.test(txt) && this.data.searchInputType == 'number') {
      return wx.showToast({
        title: '请正确填写校验码（5位数字）',
        icon: 'none',
      })
    }
    this.resetParams()
    const that = this
    var data = {
      p: 1,
      type: that.data.type,
      order_type: that.data.orderType,
    }
    if (this.data.searchInputType == 'text') {
      data.search = txt
    } else {
      data.auth_code = txt
    }
    request.get(that.data.url + '/api/Pinbao/getAdminOrderList', {
      data,
      success: function (res) {
        that.setData({
          showInfo: res.data.result,
          seeScreen: false,
          otherCssRight: '-999rpx',
          ffooccuuss: false,
          searchInputType: 'text'
        },function(){//如果有搜索到结果 继续请求 弹出收货界面
          if (res.data.result.length == 1) {
            that.req('getReceiveLog',{order_id: res.data.result[0].order_id},function(res){
              that.setData({
                orderReceiveLog: res.data.result
              })
            })
            that.setData({
              curIndex: 0,
              showReceive: true
            })
          }
        })
      }
    })
  },
  isNumberNo(){
    isNumber = false
  },
  clickScreenItem: function (e) { //点击筛选item
    var index = e.currentTarget.dataset.index
    this.resetParams()
    this.getInfo(1, this.data.type, index)
    // this.getOrderAuditCount()
    this.setData({
      orderType: index
    })
  },
  clickTab: function (e) { //点击底部Tab
    var index = e.currentTarget.dataset.index
    if (index == 5) { //其他
      this.setData({
        otherCssRight: this.data.otherCssRight == '-999rpx' ? '35rpx' : '-999rpx',
      })
    } else {
      this.setData({
        type: index,
        orderType: -99,
        showInfo: []
      })
      this.resetParams()
      this.getInfo(1, index, -99)
    }
  },
  clickOtherOpera: function (e) {
    var index = e.currentTarget.dataset.index
    if (index == 1) { //点击的是仓位情况
      //====----====----====----====----====----
      // this.getCangInfo()
      wx.navigateTo({
        url: '/pages/subcontract/WarehouseSum/WarehouseSum',
      })
      return
    }
    this.resetParams()
    
    this.setData({
      type: index
    },function(){
      this.getInfo(1, this.data.type, index)
    })
  },

  ignoreItem: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      curId: id,
      isShowMsg: true
    })
  },
  sureIgnoreItem: function () { //确定忽略
    var that = this
    console.log(this.data.curId)
    request.get(that.data.url + '/api/pinbao/ignoreOrder', {
      data: {
        order_id: this.data.curId
      },
      success: function (res) {
        console.log(res)
        that.setData({
          isShowMsg: false,
          showInfo: [],
          p: 1
        })
        that.getInfo(1, that.data.type, that.data.orderType)
      }
    })
  },
  onTabBarChange(event) { //TabBar 切换
    var that = this
    this.setData({ active: event.detail });
    // console.log(event.detail)
    // return
    var index = event.detail + 1
    if (index == 5) { //其他
      this.setData({
        otherCssRight: this.data.otherCssRight == '-999rpx' ? '35rpx' : '-999rpx',
      })
    } else {
      this.setData({
        type: index,
        orderType: -99,
        showInfo: []
      },function(){
        this.resetParams()
        this.getInfo(1, index, -99)
      })
      
    }
  },
  receiveByOrder(e){
    var that = this
    var index = e.currentTarget.dataset.index
    this.req('getReceiveLog',{order_id: this.data.showInfo[index].order_id},function(res){
      console.log(res)
      // var list = []
      // for (const key of res.data.result) {
      //   list.push(res.data.result[key])
      // }
      that.setData({
        orderReceiveLog: res.data.result,
        receBtnClicked: true
      })
    })
    this.setData({
      curIndex: index,
      showReceive: true
    })
  }, 
  PopupAddNewFac(e){
    if (this.data.showInfo[this.data.curIndex].position_is_null == 1) {
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
  receiveFactoryInput(e){
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
  receiveFactoryInput2(e){
    var type = e.currentTarget.dataset.type
    var val = e.detail.value
    if (type == 'name') {
      this.setData({
        [`receiveFactoryNew.manufactor_name`]: val
      })
    } else if (type == 'sum'){
      this.setData({
        [`receiveFactoryNew.num`]: val
      })
    } else {
      this.setData({
        [`receiveFactoryNew.receive_remark`]: val
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
  operationReceiveBtn(e){//新增厂家底下按钮操作 //多个厂家的
    var type = e.currentTarget.dataset.type
    var list = this.data.receiveFactoryList
    var that = this
    if (type == 'confirm') { //点击 新增收货的确定
      // var sendList = []
      // var nameReg = /[`~!@#$^&*()=|{}':;',\[\].<>\?~！@#￥……&*（）——|{}【】‘；：”“""'。，、？]/
      // var s = /^[\u4E00-\u9FA5A-Za-z]+$/
      var regRule = /^[\u4E00-\u9FA5A-Za-z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F\s/]+$/
      var sumReg = /^\d{1,5}$/
      var indexErr = 'none'
      var indexErr2 = 'none'
      list.forEach((item,index)=>{
        item.receive_remark = item.receive_remark || ''
        if (item.manufactor_name.trim() == '' || !sumReg.test(item.num)) {
          indexErr = index
        }
        if ( item.receive_remark && !regRule.test(item.receive_remark)) {
          indexErr2 = index
        }
      })
      console.log(indexErr,indexErr2)
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
      this.req('addFactoryReceiveLog',{manufactor: JSON.stringify(list),order_id: this.data.showInfo[this.data.curIndex].order_id},function(res){
        wx.showToast({
          title: '收货成功',
        })
        that.setData({
          receiveFactory: false,
          receiveFactoryNew: {manufactor_name: '', num: ''},
          receiveFactoryList: []
        })
        setTimeout(()=>{
          that.resetParams()
          that.getInfo(1,that.data.type,that.data.orderType)
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
  operationReceiveBtn2(e){//单个厂家的收货
    var that = this
    var nameReg = /[`~!@#$^&*()=|{}':;',\[\].<>\?~！@#￥……&*（）——|{}【】‘；：”“""'。，、？]/
    var sumReg = /^-?\d+$/
    var id = this.data.orderReceiveLog.factory[this.data.curFacIndex].id
    var manufactor_name = this.data.receiveFactoryNew.manufactor_name
    var num = this.data.receiveFactoryNew.num
    if (nameReg.test(manufactor_name) || !sumReg.test(num)) {
      return wx.showToast({
        title: '请填写正确格式的厂名和数量',
        icon: 'none'
      })
    }
    // return
    if (this.data.curLogIndex != 'none') { //有 curLogIndex 说明是改记录
      this.req('editOperateLog',{num: this.data.receiveFactoryNew.num,id: this.data.orderReceiveLog.factory[this.data.curFacIndex].log[this.data.curLogIndex].log_id},function(res){
        that.setData({
          showReceiveOneFac: false,
          curLogIndex: 'none',
          receiveFactoryNew: {
            manufactor_name: '',
            num: ''
          }
        })
        that.req('getReceiveLog',{order_id: that.data.showInfo[that.data.curIndex].order_id},function(res){
          that.setData({
            orderReceiveLog: res.data.result
          })
        })
        
        // 获取列表
      })
      return
    }
    this.req('addReceiveLog',{num: this.data.receiveFactoryNew.num,manufactor_id: this.data.orderReceiveLog.factory[this.data.curFacIndex].id},function(res){
      that.setData({
        showReceiveOneFac: false,
        receiveFactoryNew: {
          manufactor_name: '',
          num: ''
        }
      })
      that.req('getReceiveLog',{order_id: that.data.showInfo[that.data.curIndex].order_id},function(res){
        that.setData({
          orderReceiveLog: res.data.result
        })
      })
      // 获取列表
    })
  },
  modifyReceiveLog(e){ //修改收货的记录
    if (this.data.showInfo[this.data.curIndex].position_is_null == 1) {
      return wx.showToast({
        title: '当前状态订单无法继续操作',
        icon: 'none'
      })
    }
    var index = e.currentTarget.dataset.index
    var ind = e.currentTarget.dataset.ind
    this.setData({
      curLogIndex: index,
      curFacIndex: ind,
      showReceiveOneFac: true,
      curFacName: this.data.orderReceiveLog.factory[ind].manufactor_name,
      receiveFactoryNew: {
        manufactor_name: this.data.orderReceiveLog.factory[ind].manufactor_name,
        num: ''
      },
    })
  },
  receiveFactoryDel(e){//从增加收货里面删除一行
    var index = e.currentTarget.dataset.index
    var list = this.data.receiveFactoryList
    list.splice(index,1)
    this.setData({
      receiveFactoryList: list
    })
  },
  
  receiveOneFac(e){ //点击的 +-收货
    var index = e.currentTarget.dataset.index
    // || this.data.orderReceiveLog.factory[index]
    if (this.data.showInfo[this.data.curIndex].position_is_null == 1) {
      return wx.showToast({
        title: '当前状态订单无法继续操作',
        icon: 'none'
      })
    }
    if (this.data.orderReceiveLog.factory[index].status > 5) {
      return wx.showToast({
        title: '厂家已被取消或关闭，无法继续收货',
        icon: 'none'
      })
    }
    this.setData({
      curFacIndex: index,
      curFacName: this.data.orderReceiveLog.factory[index].manufactor_name,
      showReceiveOneFac: true,
      [`receiveFactoryNew.manufactor_name`]: this.data.orderReceiveLog.factory[index].manufactor_name,
      [`receiveFactoryNew.num`]: this.data.orderReceiveLog.factory[index].goods_number > 0 ? this.data.orderReceiveLog.factory[index].goods_number : '',
      curLogIndex: 'none',
      ffooccuuss2: true
    })
  },
  modifyFacName:function(e){
    var index = this.data.curFacIndex
    this.setData({
      modifyFacNameFlag: true,
      modifyFacName: this.data.orderReceiveLog.factory[index].manufactor_name
    })
  },
  confirmModifyName(){//确定改名字
    var name = this.data.modifyFacName + ''
    var that = this
    var id = this.data.orderReceiveLog.factory[this.data.curFacIndex].id
    if (name == '' || name.trim() == '' ) {
      return wx.showToast({
        title: '名字不能为空',
        icon: 'none'
      })
    }
    if (name.trim() == this.data.orderReceiveLog.factory[this.data.curFacIndex].manufactor_name) {
      return
    }
    // console.log(this.data.curId,name)
    this.req('editFactoryNameAdmin',{manufactor_id: id, manufactor_name: name },function(res){
      wx.showToast({
        title: '修改成功',
      })
      setTimeout(()=>{
        that.getFactoryLog(id)
        that.req('getReceiveLog',{order_id: that.data.showInfo[that.data.curIndex].order_id},function(res){
          that.setData({
            orderReceiveLog: res.data.result,
            receBtnClicked: true
          })
        })
      },800)
    })
  },
  comfirmSearch(e){ //收货中的搜索
    var val = e.detail.value
    var list = this.data.orderReceiveLog.factory
    var index = list.findIndex(function(item){
      return item.manufactor_name.indexOf(val) != -1
    })
    if (index != -1) {
      var shift = list.splice(index,1)
      list = [...shift,...list]
      this.setData({
        [`orderReceiveLog.factory`]: list
      })
    }
  },
  makeCall(e){
    var tel = e.currentTarget.dataset.tel + ''
    if (tel == '' || tel == 0) {
      return
    } else {
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    }
  },
  seeDetailFac(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      [`orderReceiveLog.factory[${index}].lj`]: !this.data.orderReceiveLog.factory[index].lj
    })
  },
  collectedRecord(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      [`orderReceiveLog.factory[${index}].lj`]: false
    })
  },
  closeModifyPopup(){
    this.setData({
      showReceive: false,
      showAddFacRemark: false,
      receiveFactory: false,
      addFacRemark: ''
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
  showAddFacRemark(e){
    this.setData({
      showAddFacRemark: true,
      curModifyNewFacIndex: e.currentTarget.dataset.index,
      addFacRemark: this.data.receiveFactoryList[e.currentTarget.dataset.index].receive_remark || '',
      addFacRemarkFocus: true,
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
    ffocusInput(){
      var that = this
      isNumber = true
      this.setData({
        searchInputType: 'number',
        ffooccuuss: true,
      })
    },
  keyboardheightchange(e){
    if (e.detail.height == 0) {
      this.setData({
        searchInputType: 'text'
      })
    }
  }
})