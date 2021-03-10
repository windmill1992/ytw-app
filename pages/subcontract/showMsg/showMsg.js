// pages/recommendGoods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status:{type:Boolean,value:true},
    msg1:{type:String,value:''},
    msg2:{type:String,value:''},
    msg3:{type:String,value:''},
    msg4:{type:String,value:''},
    title:{type:String,value:'提醒'},
    facName:{type:String,value:''},
    showTitle:{type:Boolean,value:true},
    showBtn1:{type:Boolean,value: false},
    showBtn2:{type:Boolean,value: false},
    btnTxt2:{type:String,value: '确定'},
    btnTxt1:{type:String,value: '取消'},
    isShow:{type:Boolean,value: true},
    titleColor:{type:String,value: '#444'},
    inlineBtn:{type:Boolean,value: false},
    msgStyle:{type: String,value:''},
    minh: {type: String, value: '48vh'}
  },
  props: {},
  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    btnClick1(e){
      this.setData({
        isShow: false
      })
      this.triggerEvent("btnClick1",{},{})
    },
    btnClick2(e){
      this.setData({
        isShow: false
      })
      this.triggerEvent("btnClick2",{},{})
    },
    closeShowMsg(){
      // console.log(this)
      this.setData({
        isShow: false
      })
    }
  },
options: {
  multipleSlots: true 
},
})
