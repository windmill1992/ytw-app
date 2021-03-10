
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
var minute = []
for (let k = 0; k < 60; k++) {
  minute.push(k + '分')
}
var hisFlg = true
Page({
  data: {
    sendDisabled: false,
    url:setting.url,
    seller_id: 0,//拼包中心id
    showCangwei: false,
    isShowTime: false,
    textareaValue: '',
    previewFlag: false, 
    checkTime: {
      time: '选择打包时间',
      val: 0
    },
    sendParams: {},
    textAreaFlag: true,
    name: '',
    mobile: '',
    store_id: '',
    wuliu: '',
    wuliuRadio: '1',
    wuliuFieldTxt: '物流公司名',
    wuliuFieldType: '',
    params: {
      name: '',
      mobile:'',
      position_spec_id:1,
      appointment_time:18,
      receipt_name:'李四',
      receipt_mobile:'15000000000',
      address:'湖州的哪里哪里的',
      shipping_name:"百世快递",
    },
    cangwei_actions: [
      {
        name: '大仓',
        id: 3
      },
      {
        name: '中仓',
        id: 2
      },
      {
        name: '小仓',
        id: 1
      },
    ],
    currentCangwei:'',
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
    historyCompany:[
    ],
    historySheet: false,
    add: {},//在地址页面选择到的地址
    changjiaList: [
    ] ,//选择了的厂家
    showChangjia: [],//厂家信息列表
    defaultInfo:{
      address:[
        {
          name:'',
          mobile:'',
          address:'请选择地址'
        }
      ],
      store_info:{
        store_id: 0,
        store_name: '',
        store_phone: ''
      }
    }, 
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
    addName: ''
    },
  nameChange:function(v){
    this.setData({
      name: v.detail
    })
  },
  mobileChange:function(v){
    this.setData({
      mobile: v.detail
    })
  },
  showCangwei:function(){
    this.setData({
      showCangwei: true,
      textAreaFlag: false,
      isShowTime: false,
      historySheet: false
    })
  },
  onCangClose() {
    this.setData({ showCangwei: false,textAreaFlag: true });
  },
  onCangChoose(event) {//关闭仓位选择
    console.log(event.detail);
    var currentCangwei = 0
    var currentCangweitxt = ''
    this.data.cangwei_actions.forEach((item,index)=>{
      if (item.name == event.detail.name ) {
        currentCangwei = item.id
        currentCangweitxt = item.name
      }
    })
    this.setData({
      showCangwei: false,
      currentCangwei: currentCangwei,
      currentCangweitxt: currentCangweitxt,
      textAreaFlag: true
    })
  },
  showTime:function(){//时间展示框
    var that = this
    wx.showModal({
      content: '超过最晚封包时间，无论厂家货物是否送齐，拼包中心都将对货物进行打包，请谨慎设置!',
      confirmColor: '#18c2ba',
      success (res) {
        if (res.confirm) {
          that.setData({
            isShowTime: true,
            textAreaFlag: false,
            showCangwei:false,
            historySheet: false
          })
        } else if (res.cancel) {
        }
      }
    })
    
  },
  onCancelTime:function(){//时间取消选择
    this.setData({
      isShowTime: false,
      textAreaFlag: true
    })
  },
  onwuliuRadioChange:function(event){
    this.setData({
      wuliuRadio: event.detail,
      wuliuFieldTxt: event.detail == 1 ? '物流公司名' : '拉包电话',
      wuliuFieldType: event.detail == 1 ? '' : 'number',
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
    // var cName = this.data.historyCompany[index].name
    // var index2 = this.data.showChangjia.findIndex(function(item,index){
    //   return item.name == cName
    // })
    // if (index2 == -1) {
      this.setData({
        [`historyCompany[${index}].ischecked`]: !this.data.historyCompany[index].ischecked,
        textAreaFlag: true
      })
    // } else {
    //   wx.showToast({
    //     title: '您已经选择了该厂家',
    //     icon: 'none'
    //   })
    // }

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
    // console.log(timeSS)
    const that = this
    if (options.seller_name) {
      wx.setNavigationBarTitle({
        title: options.seller_name + '预约',
      })
    }
    request.get(that.data.url + '/api/pinbao/getSizeList',{
      success:function(res){
        // console.log(res)
        that.setData({
          cangwei_actions: res.data.result
        })
      }
    })
    this.setData({
      seller_id: options.seller_id
    })
    if (options.from) {
      console.log(options)
      const pages = getCurrentPages()
      const i = pages.length-2
      var preData = pages[i].data
      // console.log(preData)
      this.setData({
        showChangjia: preData.preData
      })
      this.reqAddress()
    } else if (options.reEdit) {
      
      if (options.reEdit == 'a') { //未收到货 都可以编辑
       this.getEditInfo('a',options.orderid)
       this.setData({
         editId: options.orderid
       })
      } else { //有货收到 但是没有拉走
        this.getEditInfo('b',options.orderid)
        this.setData({
          editId: options.orderid
        })
      }
    } else {
      this.reqAddress()
    }
    this.reqHistory()
  },
  reqAddress:function(){
    var that = this
    request.get(that.data.url + '/api/pinbao/storeInfoAddress',{
      success:function(res){
        // console.log(res)
        if (res.data.status === 1) {
          that.setData({
            defaultInfo: res.data.result,
            name:res.data.result.address.consignee || '',
            mobile: res.data.result.address.mobile || '',
            store_id: res.data.result.store_info.store_id || 0,
          })
        }
      }
    })
  },
  getEditInfo:function(type,id){
    var that = this
    request.get(that.data.url + '/api/pinbao/getEditOrder',{
      data:{order_id:id},
      success:function(res){
        // const pages = getCurrentPages()
        // const i = pages.length-2
        // var preData = pages[i].data
        if (type == 'a') {
          var list = res.data.result.factory.map((item)=>{
            return {
              name: item.manufactor_name,
              number: item.goods_number,
              id: item.manufactor_id
            }
          })
          that.setData({
            name: res.data.result.order.name,
            mobile:res.data.result.order.mobile,
            currentCangwei: res.data.result.order.position_spec_id,
            currentCangweitxt: res.data.result.order.position_spec_name,
            wuliuRadio: res.data.result.order.receipt_type + '',
            wuliu: res.data.result.order.receipt_type == 1 ? res.data.result.order.logistics_company : res.data.result.order.logistics_phone,
            wuliuFieldType: res.data.result.order.receipt_type == 1 ? 'text' : 'number',
            checkTime:{
              time:res.data.result.order.appointment_time,
              val:[]
            },
            ableToEdit: 'a',
            defaultInfo:{
              store_info:{
                store_name:'',
                store_phone: '',
                store_id: ''
              },
              address:{
                consignee: res.data.result.order.receipt_name,
                mobile: res.data.result.order.receipt_mobile,
                address: '',
                user_address: res.data.result.order.receipt_address
              }
            },
            showChangjia: list
          })
        } else {
          that.setData({
            name: res.data.result.order.name,
            mobile:res.data.result.order.mobile,
            currentCangwei: res.data.result.order.position_spec_id,
            currentCangweitxt: res.data.result.order.position_spec_name,
            wuliuRadio: res.data.result.order.receipt_type,
            wuliu: res.data.result.order.receipt_type == 1 ? res.data.result.order.logistics_company : res.data.result.order.logistics_phone,
            checkTime:{
              time:res.data.result.order.appointment_time,
              val:[]
            },
            ableToEdit: 'b',
            defaultInfo:{
              store_info:{
                store_name:'',
                store_phone: '',
                store_id: ''
              },
              address:{
                consignee: res.data.result.order.receipt_name,
                mobile: res.data.result.order.receipt_mobile,
                address: '',
                user_address: res.data.result.order.receipt_address
              }
            }
          })
        }
      }
    })
      
  },
  onShow:function(){//
    var add = app.globalData.selectedAddress
    if(add){
      this.setData({
        add: add
      })
    }
    // console.log(this.data.add)
  },
  
  send:function(){//申请预约，发送请求
    const that = this

    // 有无数据的判断
    var nameReg = /[`~!@#$^&*()=|{}':;',\[\].<>\?~！@#￥……&*（）——|{}【】‘；：”“""'。，、？]/
    if (this.data.name.trim() == '' || nameReg.test(this.data.name)) {
      return wx.showToast({
        title: '请正确填写预约人姓名',
        icon:'none'
      })
    }
    if (this.data.mobile.trim() == '') {
      return wx.showToast({
        title: '请填写预约人电话',
        icon:'none'
      })
    }
    if (this.data.currentCangwei == '') {
      return wx.showToast({
        title: '请选择仓位大小',
        icon:'none'
      })
    }
    if (this.data.wuliuRadio == 1) {
      // if (this.data.wuliu.trim() == '') {
      //   return wx.showToast({
      //     title: '请正确填写物流公司名字',
      //     icon:'none'
      //   })
      // }
    } else {
      var reg = /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/;
      if (!reg.test(this.data.wuliu)) {
        return wx.showToast({
          title: '请正确填写物流电话',
          icon:'none'
        })
      } else if (((this.data.wuliu == this.data.mobile) || (this.data.wuliu == this.data.defaultInfo.address.mobile)) && this.data.wuliu) {
        return wx.showToast({
          title: '预约人电话与拉包电话不能重复',
          icon:'none'
        })
      }
    }
    if (this.data.checkTime.val == 0 && this.data.ableToEdit == '') {
      return wx.showToast({
        title: '请选择打包时间',
        icon:'none'
      })
    }
    if (this.data.showChangjia.length == 0 && this.data.ableToEdit != 'b') {
      return wx.showToast({
        title: '请至少选择一个厂家',
        icon:'none'
      })
    }
    var date = new Date()
    var mou = date.getMonth() - 0 + 1
    mou =  (days[this.data.checkTime.val[0]] - 0) >= (nowDay - 0) ? mou : (mou - 0 + 1)
    
    var ttt = this.data.checkTime.val.length > 0 ? nowYear + '-' +  mou + '-' + days[this.data.checkTime.val[0]] + ' ' + timeSS[days[this.data.checkTime.val[0]] + '日'][this.data.checkTime.val[1]].split("时")[0] + (this.data.checkTime.val[2] > 9 ? (':' + this.data.checkTime.val[2]) : (':0' + this.data.checkTime.val[2])) : this.data.checkTime.time
    
    // console.log(mou)
    // console.log(ttt)
    // return
    var  obj = {}
    var v = true
    obj.name = this.data.name
    obj.mobile = this.data.mobile
    obj.position_spec_id = this.data.currentCangwei
    obj.appointment_time = ttt
    obj.receipt_name = this.data.defaultInfo.address.consignee
    obj.receipt_mobile = this.data.defaultInfo.address.mobile
    obj.address = this.data.defaultInfo.address.user_address
    obj.remark = this.data.textareaValue
    obj.seller_id = this.data.seller_id
    obj.receipt_type = this.data.wuliuRadio
    obj.logistics_company = this.data.wuliu
    obj.logistics_phone = this.data.wuliu
    var ob = []
    // obj.manufactor = this.data.showChangjia
    this.data.showChangjia.forEach((item)=>{
      if (item.number-0 == 0) {
        v = false
        return wx.showToast({
          title: '请填写预约数量',
          icon: "none"
        })
      }
      ob.push({
        manufactor_name: item.name||'',
        goods_number: item.number|| 0,
        parent_id: item.id ? item.id : 0,
        manufactor_id: this.data.ableToEdit == 'a' ? item.id : ''
      })
    })
    if (this.data.ableToEdit != 'b') {
      obj.manufactor = JSON.stringify(ob)
    }
    if (this.data.ableToEdit != '') {
      obj.order_id = this.data.editId
    }
    console.log(obj)
    // return
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 200,
    })
    this.setData({
      // previewFlag: true,
      sendParams: obj
    })
    wx.showLoading({
      title: '正在提交...',
      mask: true
    })
    this.postAdd()
  },
  postAdd:function(){
    wx.showLoading({
      title: '',
      mask: true 
    })
    var that = this
    request.post( that.data.url + "/api/pinbao/" + (that.data.ableToEdit == '' ? 'add_order' : 'editOrder'),{
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
          that.setData({
            sendDisabled: false
          })
        } 
        wx.hideLoading()
      }
    })
  },
  onShareAppMessage: function () {
      
  },
  delCompany:function(event){//删除选择了的厂家
    if (this.data.ableToEdit != '') {
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
    // console.log(event.currentTarget.dataset.index,'aaa')
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
    console.log(e,this)
    this.setData({
      wuliu: e.detail
    })
  },
  sumChange:function(e){
    const arr = [...this.data.showChangjia]
    arr[e.currentTarget.dataset.index].number = e.detail
    this.setData({
      showChangjia: arr
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
      textAreaFlag: true
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
    // if (this.data.historyCompany.length == 0) {
    //   return wx.showToast({
    //     title: '您没有预约历史记录',
    //     icon: 'none'
    //   })
    // }
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
  }
})
   