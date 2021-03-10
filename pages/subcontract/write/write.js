
const request = require('../../../utils/request')
const app = getApp()
var setting = app.globalData.setting;
import Dialog from '../../../dist/dialog/dialog';
var ffllaagg = true

var timeNow = new Date()
console.log(new Date((timeNow/1000+86400)*1000).getDate())
var nowYear = timeNow.getFullYear()
var month = timeNow.getMonth() + 1
var nowHours = timeNow.getHours()
var nowDay = timeNow.getDate()
var days = [
  nowDay,
  new Date((timeNow/1000+86400)*1000).getDate(),
  new Date((timeNow/1000+86400+86400)*1000).getDate()
]
var timeSS = {}
for (let t = 0; t < 3; t++) {
  var arr = []
  if ( t == 0 ) {
    if ( nowHours < 12 ) {
      for (let h1 = 12; h1 < 24; h1++) {
        arr.push(h1 + '时')
      }
    } else {
      for (let h2 = nowHours + 1; h2 < 24; h2++) {
        arr.push(h2 + '时')
      }
    }
  } else {
    for (let h3 = 0; h3 < 24; h3++) {
      arr.push(h3 + '时')
      
    }
  }
  timeSS[days[t] + '日'] = arr
}

var columns4 = []
for (let l = 1; l < 11; l++) {
  columns4.push({name: (l + '个'),par:l})
}
columns4.push({name:'10个以上',par: 11})

var minute = []
for (let k = 0; k < 60; k++) {
  minute.push(k + '分')
}
var hisFlg = true
Page({
  data: {
    url:setting.url,
    seller_id: 0,//拼包中心id
    showCangwei: false,
    isShowTime: false,
    textareaValue: '',
    previewFlag: false, 
    checkTime: {
      time: '',
      val: 0
    },
    sendParams: {},
    textAreaFlag: true,
    // name: '',
    // mobile: '',
    store_id: '',
    wuliu: '',
    wuliuRadio: 'a',
    wuliuFieldTxt: '物流公司',
    wuliuFieldType: '',
    // params: {
    //   name: '',
    //   mobile:'',
    //   position_spec_id:1,
    //   appointment_time:18,
    //   receipt_name:'李四',
    //   receipt_mobile:'15000000000',
    //   address:'湖州的哪里哪里的',
    //   shipping_name:"百世快递",
    // },
    // cangwei_actions: [
    //   {
    //     name: '大仓',
    //     id: 3
    //   },
    //   {
    //     name: '中仓',
    //     id: 2
    //   },
    //   {
    //     name: '小仓',
    //     id: 1
    //   },
    // ],
    currentCangwei:'',
    pack_num: '',
    currentCangweitxt: '',
    columns2: [
      {
        values: Object.keys(timeSS),
        className: 'column1',
        defaultIndex: 0
      },
      {
        values: timeSS[nowDay + '日'],
        className: 'column2',
        defaultIndex: 0,
      },
      {
        values: minute,
        className: 'column3',
        defaultIndex: 0,
      }
    ],
    columns: [],
    historyCompany:[
    ],
    historySheet: false,
    add: {},//在地址页面选择到的地址
    changjiaList: [
    ] ,//选择了的厂家
    showChangjia: [],//厂家信息列表
    defaultInfo:{}, 
    editTelNum: '',//默认编辑的号码0
    editTelId: 0,//默认编辑号码的id0
    showEidtTel: false,//默认不展示编辑厂家电话弹窗
    editIndex: 0,//默认的编辑的那个索引
    exclusive_B: false,//是否显示操作提醒
    ableToEdit: '',//用于用户重新编辑订单 控制 能否编辑/显示
    editId: '',
    ytwAction: false,//控制自定义组件action
    ytwHeight: '0',
    p:1,
    shouldLoad: true,
    showAddUsed: false,//显示添加常用
    addName: '',
    showBtn: false,
    mask9: false
    },
  nameChange:function(v){
    this.setData({
      [`defaultInfo.name`]: v.detail
    })
  },
  mobileChange:function(v){
    this.setData({
      [`defaultInfo.mobile`]: v.detail
    })
  },
  showCangwei:function(){
    this.setData({
      showCangwei: true,
      textAreaFlag: false,
      isShowTime: false,
      historySheet: false,
      mask9: true
    })
  },
  onCangClose() {
    this.setData({ showCangwei: false,textAreaFlag: true, mask9: false });
  },
  onCangChoose(event) {//
    console.log(event.detail);
    var par = event.detail.value
    // return
    this.setData({
      showCangwei: false,
      currentCangwei: par[0].id,
      currentCangweitxt:  par[0].name +  par[1].name,
      pack_num: par[1].par,
      mask9: false
    })
  },
  showTime:function(){//时间展示框
    var that = this
    wx.showModal({
      title: '选择最晚封包时间',
      content: '超过最晚封包时间，无论厂家货物是否送齐，拼包中心都将对货物进行打包，请谨慎设置!',
      confirmColor: '#18c2ba',
      success (res) {
        if (res.confirm) {
          that.setData({
            isShowTime: true,
            textAreaFlag: false,
            showCangwei:false,
            historySheet: false,
            mask9: true
          })
        } else if (res.cancel) {
        }
      }
    })
    
  },
  onCancelTime:function(){//时间取消选择
    this.setData({
      isShowTime: false,
      textAreaFlag: true,
      mask9: false
    })
  },
  onwuliuRadioChange:function(event){
    this.setData({
      wuliuRadio: event.detail,
      wuliuFieldTxt: event.detail == 'a' ? '物流公司' : '拉包电话',
      wuliuFieldType: event.detail == 'a' ? '' : 'number',
      wuliu: ''
      // wuliuFieldPlaceholder: ''
    });
  },
  toAddress:function(){//前往选择地址
    this.setData({
      localInfo:{}
    })
    wx.navigateTo({
      url: '/pages/subcontract/destine_address_list/address_list',
    })
  },
  historyCompanyChange:function(e){
    var index = e.currentTarget.dataset.index
      this.setData({
        [`historyCompany[${index}].ischecked`]: !this.data.historyCompany[index].ischecked,
        textAreaFlag: true
      })

  },
  cancelHistory:function(){//取消历史厂家选择
    this.setData({
      historySheet: false,
      textAreaFlag: false
    })
  },
  reqHistory:function(){//展示历史厂家
    if (!this.data.shouldLoad) {
      return
    }
    const that = this
    request.get(that.data.url + "/api/pinbao/getHistoryList",{
      data:{p:that.data.p},
      success:function(res){
        if(res.data.result.length>0){
          that.setData({
            historyCompany: that.data.historyCompany.concat(res.data.result),
          })
        } else {
          that.setData({
            shouldLoad: false
          })
        }
      }
    })
    
  },
  chooseHistory:function(e){//选择历史厂家
    if ( !hisFlg ) {
      return
    }
    hisFlg = false
    this.setData({
      textAreaFlag: true,
      ytwAction: false
    })
    wx.showLoading()
    var sshowChangjia = this.data.showChangjia
    var historyCompany1 = this.data.historyCompany.filter((item1)=>{ 
      var name = item1.name
      var index2 = sshowChangjia.findIndex(function(item,index){
        return name == item.name
      })
      if (item1.ischecked && index2 == -1) {
        item1.number = ''
        return item1
      }
    })
    if (historyCompany1.length > 0) {
      var showChangjia1 = [...this.data.showChangjia]
      showChangjia1 = showChangjia1.concat(historyCompany1)
      this.setData({
        showChangjia: showChangjia1,
        historySheet: false
      },function(){
        console.log(this.data.showChangjia)
        setTimeout(()=>{hisFlg = true},0)
        wx.hideLoading()
      })
    } else {
      hisFlg = true
      wx.hideLoading()
    }
  },
  editTel:function(e){ // 修改历史厂家的电话
    var id = e.currentTarget.dataset.id
    var tel = e.currentTarget.dataset.tel
    var index = e.currentTarget.dataset.index
    this.setData({
      showEidtTel: true,
      editTelNum: tel,
      editTelId: id,
      editIndex: index
    })

  },
  hisTelChange:function(e){ //厂家电话输入框变化
    this.setData({
      editTelNum: e.detail.value
    })
  },
  onCloseEidtTel:function(){ //关闭厂家电话编辑
    this.setData({
      showEidtTel: false,
    })
  },
  onConfirmEidtTel:function(){ //提交厂家电话编辑
    var that = this
    var reg = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
    if (!reg.test(that.data.editTelNum)) {
      return wx.showToast({
        title: '请正确填写11位手机号码',
        icon: 'none'
      })
    }
    request.post( that.data.url + '/api/pinbao/addFactoryPhone',{
      data:{
        id: that.data.editTelId,
        phone: that.data.editTelNum
      },
      success:function(res){
        console.log(res)
        if (res.data.status == 1) {
          that.setData({
            [`historyCompany[${that.data.editIndex}].phone`]: that.data.editTelNum
          })
        }
      }
    } )
  },
  textareaChange:function(e){//备注
    this.setData({
      textareaValue: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const that = this
    if (options.seller_name) {
      wx.setNavigationBarTitle({
        title: options.seller_name + '预约',
      })
    }
    request.get(that.data.url + '/api/pinbao/getSizeList',{
      success:function(res){
        that.setData({
          columns: [
            {values: res.data.result,className: 'column3'},
            {values: columns4,className: 'column4'},
          ]
        })
      }
    })
    this.setData({
      seller_id: options.seller_id
    })
    this.reqHistory()
    if (options.reEdit) {
      this.getEditInfo(options.reEdit,options.orderid)
      this.setData({
        editId: options.orderid
      })
    } else {
      this.getOrderDefaultData()
      this.setData({
        showBtn: true,
        ableToEdit: 'a0'
      })
    }
  },
  modifyOrderShow(){
    this.setData({
      showBtn: true
    })
  },
  getEditInfo:function(type,id){
    var that = this
    request.get(that.data.url + '/api/pinbao/getEditOrder',{
      data:{order_id:id},
      success:function(res){
        console.log(res)
        // return
        // const pages = getCurrentPages()
        // const i = pages.length-2
        // var preData = pages[i].data
        var list = res.data.result.factory.map((item)=>{
          return {
            name: item.manufactor_name,
            number: item.goods_number,
            id: item.manufactor_id
          }
        })
        if (type == 'a') {
          that.setData({
            currentCangwei: res.data.result.order.position_spec_id,
            currentCangweitxt: `${res.data.result.order.position_name} (${res.data.result.order.pack_num > 10 ? '10个以上' : (res.data.result.order.pack_num + '个')})` ,
            wuliuRadio: res.data.result.order.receipt_type == 1 ? 'a' : 'b',
            wuliu: res.data.result.order.receipt_type == 1 ? res.data.result.order.logistics_company : res.data.result.order.logistics_phone,
            wuliuFieldType: res.data.result.order.receipt_type == 1 ? 'text' : 'number',
            checkTime:{
              time:res.data.result.order.appointment_time,
              val:[]
            },
            ableToEdit: 'a',
            defaultInfo:res.data.result.order,
            showChangjia: list,
            pack_num: res.data.result.order.pack_num,
            textareaValue: res.data.result.order.order_remark
          })
        } else if (type == 'b') {
          that.setData({
            currentCangwei: res.data.result.order.position_spec_id,
            currentCangweitxt: `${res.data.result.order.position_name} (${res.data.result.order.pack_num > 10 ? '10个以上' : (res.data.result.order.pack_num + '个')})` ,
            wuliuRadio: res.data.result.order.receipt_type == 1 ? 'a' : 'b',
            wuliu: res.data.result.order.receipt_type == 1 ? res.data.result.order.logistics_company : res.data.result.order.logistics_phone,
            checkTime:{
              time:res.data.result.order.appointment_time,
              val:[]
            },
            ableToEdit: 'b',
            defaultInfo:res.data.result.order,
            pack_num: res.data.result.order.pack_num,
            showChangjia: list,
            textareaValue: res.data.result.order.order_remark
          })
        } else if (type == 'c') {
          that.setData({
            currentCangwei: res.data.result.order.position_spec_id,
            currentCangweitxt: `${res.data.result.order.position_name} (${res.data.result.order.pack_num > 10 ? '10个以上' : (res.data.result.order.pack_num + '个')})` ,
            wuliuRadio: res.data.result.order.receipt_type == 1 ? 'a' : 'b',
            wuliu: res.data.result.order.receipt_type == 1 ? res.data.result.order.logistics_company : res.data.result.order.logistics_phone,
            checkTime:{
              time:res.data.result.order.appointment_time,
              val:[]
            },
            ableToEdit: 'c',
            defaultInfo:res.data.result.order,
            pack_num: res.data.result.order.pack_num,
            showChangjia: list,
            textareaValue: res.data.result.order.order_remark
          })
        }
            
      }
    })
      
  },
  onShow:function(){//
    // var add = app.globalData.selectedAddress
    // if(add){
    //   this.setData({
    //     add: add
    //   })
    // }
  },
  
  send:function(){//申请预约，发送请求
    const that = this
    wx.showLoading({
      title: '正在提交...',
      mask: true
    })
    wx.hideLoading()
    // 有无数据的判断
    var reg = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
    // var nameReg = /^[\u4E00-\u9FA5A-Za-z]+$/ //名字先不做限制
    if (!this.data.defaultInfo.name || !this.data.defaultInfo.mobile || !this.data.defaultInfo.receipt_name || !this.data.defaultInfo.receipt_mobile || !this.data.defaultInfo.receipt_address) {
      wx.hideLoading()
      return wx.showToast({
        title: '请填写完整预约信息',
        icon:'none'
      }) 
    }
    if (this.data.defaultInfo.name.trim() == '') {
      wx.hideLoading()
      return wx.showToast({
        title: '请正确填写预约人姓名',
        icon:'none'
      })
    }
    if (this.data.defaultInfo.mobile.trim() == '' ) {
      wx.hideLoading()
      return wx.showToast({
        title: '请填写预约人电话',
        icon:'none'
      })
    }
    if (!reg.test(this.data.defaultInfo.mobile)) {
      wx.hideLoading()
      return wx.showToast({
        title: '请填写11位手机号码',
        icon:'none'
      })
    }
    if (this.data.currentCangwei == '') {
      wx.hideLoading()
      return wx.showToast({
        title: '请选择仓位大小',
        icon:'none'
      })
    }
    if (this.data.wuliuRadio == 'b') {
      
      if (!reg.test(this.data.wuliu)) {
        wx.hideLoading()
        return wx.showToast({
          title: '请正确填写物流电话',
          icon:'none'
        })
      } else if (((this.data.wuliu == this.data.defaultInfo.mobile) || (this.data.wuliu == this.data.defaultInfo.receipt_mobile)) ) {
        wx.hideLoading()
        return wx.showToast({
          title: '预约电话与拉包电话不能重复',
          icon:'none'
        })
      }
    }
    if (this.data.checkTime.val == 0 && this.data.ableToEdit == '') {
      wx.hideLoading()
      return wx.showToast({
        title: '请选择打包时间',
        icon:'none'
      })
    }
  var nameReg2 = /^[\u4E00-\u9FA5A-Za-z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F\s/]+$/
    // if (this.data.textareaValue != '') {
    //   if (!nameReg2.test(this.data.textareaValue)) {
    //     return wx.showToast({
    //       title: '备注请勿填写',
    //       icon: 'none'
    //     })
    //   }
    // }
    var date = new Date()
    var mou = date.getMonth() - 0 + 1
    mou =  (days[this.data.checkTime.val[0]] - 0) >= (nowDay - 0) ? mou : (mou - 0 + 1)
    
    var ttt = this.data.checkTime.val.length > 0 ? nowYear + '-' +  mou + '-' + days[this.data.checkTime.val[0]] + ' ' + timeSS[days[this.data.checkTime.val[0]] + '日'][this.data.checkTime.val[1]].split("时")[0] + (this.data.checkTime.val[2] > 9 ? (':' + this.data.checkTime.val[2]) : (':0' + this.data.checkTime.val[2])) : this.data.checkTime.time
    
    // return 
    var  obj = {}
    obj.name = this.data.defaultInfo.name
    obj.mobile = this.data.defaultInfo.mobile
    obj.position_spec_id = this.data.currentCangwei
    obj.pack_num = this.data.pack_num
    obj.appointment_time = ttt
    obj.receipt_name = this.data.defaultInfo.receipt_name
    obj.receipt_mobile = this.data.defaultInfo.receipt_mobile
    obj.address = this.data.defaultInfo.receipt_address
    obj.remark = this.data.textareaValue
    obj.seller_id = this.data.seller_id
    obj.receipt_type = this.data.wuliuRadio == 'a' ? 1 : 2
    obj.logistics_company = this.data.wuliu
    obj.logistics_phone = this.data.wuliu
    var ob = []
    this.data.showChangjia.forEach((item)=>{
      ob.push({
        manufactor_name: item.name ||'',
        goods_number: item.number || '',
        manufactor_id: this.data.ableToEdit == 'a' ? item.id : ''
      })
    })
    if (this.data.ableToEdit != 'b' && this.data.ableToEdit != 'c') {
      obj.manufactor = JSON.stringify(ob)
    }
    if (this.data.ableToEdit != 'a0') {
      obj.order_id = this.data.editId
    }
    console.log(obj)
    // return
    this.setData({
      sendParams: obj
    })
    this.postAdd()
  },
  postAdd:function(){
    wx.showLoading({
      title: '',
      mask: true 
    })
    var that = this
    request.post( that.data.url + "/api/pinbao/" + (that.data.ableToEdit == 'a0' ? 'add_order' : 'editOrder'),{
      data:that.data.sendParams,
      success:function(res){
        console.log(res)
        if (res.data.status === 1) {
          wx.hideLoading({
            success: (res) => {},
          })
          if (that.data.ableToEdit != '') {
            wx.redirectTo({
              url: '/pages/subcontract/status/status?status=1&mode=' + that.data.ableToEdit,
            })
          } else {
            wx.redirectTo({
              url: '/pages/subcontract/status/status?status=1&mode=' + that.data.ableToEdit
            })
            return
          }
         
        } else if (res.data.status == 9) {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
        } 
        wx.hideLoading()
      }
    })
  },
  onShareAppMessage: function () {
      
  },
  delCompany:function(event){//删除选择了的厂家
    if (this.data.ableToEdit == 'b' || this.data.ableToEdit == 'c') {
      return wx.showModal({
        content: '请前往预约详情页面修改厂',
        showCancel: false,
        success (res) {
          if (res.confirm) {
          } else if (res.cancel) {
          }
        }
      })
    }
    const ind = event.currentTarget.dataset.index
    console.log(this.data.showChangjia)
    Dialog.confirm({
      message: '删除该厂家吗？',
    }).then(() => {
      var newShowChangjia = [...this.data.showChangjia]
      newShowChangjia.splice(ind,1)
      this.setData({
        showChangjia: newShowChangjia
      })
      Dialog.close();
    });
  },
  toSearch:function(){//前往搜索页面
    var str = ''
    this.data.showChangjia.forEach((item,index)=>{
      str += 'name' + index + '=' + item.name + '&' //把选择了的厂家名字拼接成url参数 传递
    })
    wx.navigateTo({
      url: '/pages/subcontract/companysearch/index?' + str,
    })
  },
  wuliuChange:function(e){
    this.setData({
      wuliu: e.detail
    })
  },
  sumChange:function(e){
    this.setData({
      [`showChangjia[${e.currentTarget.dataset.index}].number`]: e.detail.value
    })
  },
  facNameChange:function(e){
    this.setData({
      [`showChangjia[${e.currentTarget.dataset.index}].name`]: e.detail.value
    })
  },
  // 时间选择部分重做
  chooseTimer:function(e){
    console.log(e)
  },
  timeConfirm:function(e){
    // console.log(e.detail)
    this.setData({
      checkTime:{
        time: e.detail.value.join(''),
        val: e.detail.index
      },
      isShowTime: false,
      textAreaFlag: true,
      mask9: false
    })
  },
  onTimeChange:function(event){
    const { picker, value } = event.detail;
    picker.setColumnValues(1, timeSS[value[0]]);
  },
  onInfoClose:function(){
    this.setData({
      exclusive_B: false
    })
  },
  showhsi:function(){
    this.setData({
      ytwAction: true,
      ytwHeight: '70vh'
    })
    // this.showHistory()
  },
  ytwActionConfirm(){
    console.log('ytwActionConfirm')
  },
  ytwActionScrollEnd(){
    console.log('end')
    this.setData({
      p: this.data.p + 1
    },function(){
      this.reqHistory()
    })
  },
  onClickAdd:function(){ //点击 +++ 
    this.setData({
      showAddUsed: true
    })
  },
  delFromUsed:function(e){//移除常用 delOftenHistory id
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this
    wx.showModal({
      content: '是否将该厂家从常用厂家列表中移除',
      success (res) {
        if (res.confirm) {
          request.post(that.data.url + '/api/pinbao/delOftenHistory', {
            data: {
              id: id
            },
            success: function(res){
              var his = that.data.historyCompany
              his.splice(index,1)
              that.setData({
                historyCompany: his
              })
              wx.showToast({
                title: '移除成功',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  sellectAllFactory:function(){//点击全选
    var his = this.data.historyCompany
    wx.showLoading()
    his.forEach((item)=>{
      item.ischecked = ffllaagg
    })
    this.setData({
      historyCompany: his
    },function(){wx.hideLoading()})
    ffllaagg = !ffllaagg
  },
  addNameChange:function(e){
    this.setData({
      addName: e.detail.value
    })
  },
  onCloseAddUsed:function(){
    this.setData({
      showAddUsed: false
    })
  },
  onConfirmAddUsed:function(){
    var name = this.data.addName + ''
    var tel = this.data.editTelNum
    console.log(name,tel)
    var reg = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
    if (name.trim() == '') {
      return wx.showToast({
        title: '请正确填写厂家名',
        icon: 'none'
      })
    } else if (tel) {
      if (!reg.test(tel)) {
        return wx.showToast({
          title: '请正确填写厂家手机号',
          icon: 'none'
        })
      } else {
        this.reqAdd(name,tel)
      }
    } else {
      this.reqAdd(name,tel)
    }
    this.setData({
      showAddUsed: false
    })
  },
  reqAdd:function(name,tel){
    var that = this
    request.post(that.data.url + '/api/pinbao/addOftenHistory',{
      data: {
        name: name,
        phone: tel
      },
      success:function(res){
        that.setData({
          historyCompany: that.data.historyCompany.concat({
            history_id: res.data.result,
            ischecked: false,
            name: name,
            phone: tel,
            number: '',
          })
        })
      }
    })
  },
  getOrderDefaultData(){ //第四代 获取默认信息
    var that = this
    request.get(that.data.url + '/api/pinbao/getOrderDefaultData', {
      data: {
        seller_id: that.data.seller_id
      },
      success:function(res) {
        var receipt_type = res.data.result ? res.data.result.receipt_type : ''
        var wuliu = ''
        var radio = 'a'
        if (receipt_type) {
          wuliu = receipt_type == 1 ? res.data.result.logistics_company : res.data.result.logistics_phone
          radio = receipt_type == 1 ? 'a' : 'b'
        }
        that.setData({
          defaultInfo: res.data.result || {},
          wuliuRadio: radio,
          wuliu
        })
      }
    })
  },
  closeMask(){
    this.setData({
      mask9: false,
      showCangwei: false,
      isShowTime: false
    })
  }
})
   