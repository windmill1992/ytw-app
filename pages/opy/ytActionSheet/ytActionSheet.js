// pages/recommendGoods.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    cancelTxt: {type: String, value: '全选'},
    cancelStyle: {type: String, value: ''},
    confirmTxt: {type: String, value: '添加'},
    confirmStyle: {type: String, value: ''},
    height: {type: String, value: '70vh'},
    title: {type: String, value: ''},
    round: {type: Boolean, value: true},
    show: {type: Boolean, value: true}
  },
  props:{
  },
  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCalcel(e){
      console.log(e.target)
      if (e.target.id == 'cancel' || e.target.id == 'mask') {
        var that = this
        this.setData({
          height: '0'
        })
        setTimeout(()=>{
          that.setData({
            show: false
          })
        },300)
      }
    },
    onConfirm(){
      this.triggerEvent('onConfirm',{},{})
    },
    onClickAdd(){
      this.triggerEvent('onClickAdd',{},{})
    },
    scrollEnd(){
      this.triggerEvent('scrollEnd',{},{})
    },
    sellectAllFactory(){
      this.triggerEvent('sellectAllFactory',{},{})
    },
  },
  attached: function() {
    this.setData({
      height: '56vh'
    })
  },
})
