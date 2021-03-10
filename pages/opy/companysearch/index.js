
const app = getApp()
var setting = app.globalData.setting;
const request = require("../../../utils/request")
import Dialog from '../../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:setting.url,
    value: '',
    flag: true,
    result: [],//搜过得到的厂家名字
    from: '',//默认从预约仓位进入
    editInputNum: 1, //默认增加0件
    order_id: 0,
    paramsArr: [],//存放从预约仓位页面传递过来的已选择厂家名字
  },
// 请求数据  联想展示
  search:function(e){
    const that = this
    var val = e.detail
    this.setData({
      value: val
    })
    console.log(e)
    if (val === '') {
      return
    }
    if (this.data.flag) {
      this.setData({
        flag: false
      })
      console.log(that.data.url)
      request.get(that.data.url + '/api/pinbao/storeAInfo',{
        data: {
          name: val
        },
        success:function(res){
          console.log(res)
          if (res.data.status===1) {
            that.setData({
              result: res.data.result.store_info,
              flag: true
            })
          }
        }
      })
    }
  },
  chooseCompany: function(e){//选择了某一个厂家之后
    console.log(e.currentTarget.dataset.text)
    var store_name = e.currentTarget.dataset.text.store_name
    if (this.data.paramsArr.indexOf(store_name) != -1) {
      wx.showToast({
        title: '当前厂家您已选择，请勿重复添加，您可以返回上一页，增加货物数量!',
        icon: 'none'
      })
      return
    }
    const pages = getCurrentPages()
    var i = pages.length - 2
    if (this.data.from == 'tions') {
      const info = [...pages[i].data.addFactoryTempList]
      info.push({
        manufactor_name:store_name,
        goods_number:'',
        phone: ''
      })
      pages[i].setData({
        addFactoryTempList: info
      })
    } else {
      const info = [...pages[i].data.showChangjia]
      info.push({
        name:e.currentTarget.dataset.text.store_name,
        ischecked: true,
        number: '',
        store_phone: e.currentTarget.dataset.text.store_phone,
        store_id: e.currentTarget.dataset.text.store_id
      })
      pages[i].setData({
        showChangjia: info
      })
    }
    wx.navigateBack({
      delta: 1,
    })
  },
  submitOther:function(){//自己搜索厂家时，不是联想返回的数据
    if (!this.data.value) {
      return wx.showToast({
        title: '厂家名字不能为空',
        icon: 'none'
      })
    }
    if (/[`~!@#$^&*()=|{}':;',\[\].<>\?~！@#￥……&*（）——|_{}【】‘；：”“""'。，、？]/.test(this.data.value)) {
      return wx.showToast({
        title: '请正确填写厂家名',
        icon: 'none'
      })
    }
    if (this.data.paramsArr.indexOf(this.data.value) != -1) {
      wx.showToast({
        title: '当前厂家您已选择，请勿重复添加，您可以返回上一页，增加货物数量!',
        icon: 'none'
      })
      return
    }
    const name = this.data.value
    const pages = getCurrentPages()
    console.log(pages)
    var i = pages.length - 2
    console.log(pages[i].data)
    if (this.data.from == 'tions') {
      let info = [...pages[i].data.addFactoryTempList]
      info.push({
        manufactor_name:name,
        num:1,
        store_phone: ''
      })
      pages[i].setData({
        addFactoryTempList: info
      })
    } else {
      const info = [...pages[i].data.showChangjia]
      info.push({
        name: name,
        ischecked: true,
        number: '',
        store_phone: 0,
        store_id: 0
      })
      pages[i].setData({
        showChangjia: info
      })
    }

    wx.navigateBack({
      delta: 1,
    })
  },
  // showDialog:function(title,store_name){
  //   var that = this
  //   Dialog.confirm({
  //     title: title,
  //     asyncClose: true
  //   }).then(() => {
  //     if ( typeof parseInt(that.data.editInputNum) != 'number' || that.data.editInputNum <= 0 || that.data.editInputNum%1 != 0) {
  //       wx.showToast({
  //         title: '请正确填写货物数量，货物数量必须为正整数',
  //         icon: 'none'
  //       })
  //       // console.log(title)
  //       Dialog.close();
  //       that.showDialog(title,store_name)
  //       return
  //     }
  //     request.post( that.data.url + '/api/pinbao/add_manufactor',{//发起请求
  //       data:{
  //         order_id: that.data.order_id,
  //         manufactor:JSON.stringify([{
  //           goods_number: parseInt(that.data.editInputNum),
  //           manufactor_name: store_name
  //         }]),
  //       },
        
  //       success:function(res){
  //         // console.log(res)
  //         if (res.data.status == 1) {//如果请求成功
  //           if (res.data.msg == '操作成功') {//添加成功的操作
  //             wx.showToast({
  //               title: '添加成功',
  //             })
  //             if(that.data.from == 'edit'){//如果是edit界面
  //               setTimeout(function(){
  //                 wx.navigateBack({
  //                   delta: 1,
  //                 })
  //               },300)
  //             }
  //           }else {//添加失败的情况
  //             wx.showToast({
  //               title: res.data.msg,
  //               icon: 'none'
  //             })
  //             Dialog.close()
  //           }
  //         } 
  //       }
  //     } )
  //     }).catch(() => {
  //       Dialog.close();
  //     });
  // },
  // editInputChange:function(e){//修改货物input数值变化
  //   this.setData({
  //     editInputNum: e.detail.value
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

      var paramsArr = []
      var from = ''
      for (const key in options) {
        console.log(key)
        if (key == 'from') {
          from = options[key]
        }
        paramsArr.push(options[key])
      }
      this.setData({
        paramsArr: paramsArr,
        from: from
      })
      // console.log(paramsArr)
    if (options.order_id) {
      this.setData({
        order_id: options.order_id
      })
    }

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})