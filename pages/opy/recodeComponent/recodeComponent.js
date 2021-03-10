// pages/recommendGoods.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {type: Object, value: {}},
    isNormal:{type: Boolean, value: true},
    receive: {type: Boolean,value: false},
    edit: {type: Boolean,value: false},
    admin: {type: Boolean,value:false},
    showRecodeCom: {type: Boolean,value:true},
    slots: {type: Boolean,value:false},
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
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
    clickItem(e){
      console.log(e)
    },
    closeRecodeCom(){
      this.triggerEvent('closeLog',{},{})
    },
    clickNewAudit(e){
      this.triggerEvent('clickAudit',{info:e.currentTarget.dataset.info,index:e.currentTarget.dataset.index},{})
    },
    modifyItem(e){
      var par = {
        type: e.currentTarget.dataset.type,
        info: e.currentTarget.dataset.info
      }
      this.triggerEvent('modify',par,{})
    }
  }
})
