var app = getApp();
import Regions from '../../../utils/regions/Regions.js';
var request = app.request; 
var setting = app.globalData.setting;
var isEor = false;
import Dialog from '../../../dist/dialog/dialog'
Page({
    data: {
        url: setting.url, 
        status: 0,
        userInfo: wx.getStorageSync('app:userInfo'),
        address: {}, //地址
        area:{},//传递到后台的数值
        img:'',//图片本地地址
        detailAdress:'',//详细地址
        name:'',//店铺名称
        group:[
            '实体货源厂家',
            '批发商/连锁门店采购商'
        ],
        store_type: [],
        typeShow: false,
        actions1: [],
        index:-1,
        checked:false,//
        user:{},
        uploadPath:'',
        is_store:2,//1已开店 2未开店
        status: '',
        storeInfo: null,
        screenHeight: 0,//屏幕高度
    },

    onLoad: function (options) {
            //检查用户是否登录方可操作立即购买
        var screenHeight = wx.getSystemInfoSync().windowHeight
        // console.log(screenHeight)
        this.setData({
            screenHeight: screenHeight
        })
    },
    onShow(){
        let that = this;
        that.initRegions();
        let user = wx.getStorageSync('app:userInfo');
        that.setData({
            user:user
        })
        that.hasStatus();
    },
    /** 初始化区域弹框相关 */
    initRegions: function () {
        var that = this;
        isEor = false;
        new Regions(this, 'regions', {
            endAreaLevelCall: function (parentId, regionName, address) {
                Object.assign(that.data.address, address);
                Object.assign(that.data.area, {
                    company_province: address.province,
                    company_city: address.city,
                    company_district: address.district,
                });
                console.log(that.data.area)
                that.setData({
                    'address.province_name': that.data.address.province_name,
                    'address.city_name': that.data.address.city_name,
                    'address.district_name': that.data.address.district_name,
                    'address.twon_name': that.data.address.twon_name,
                });
                isEor = true;
            }
        });
    },

    goBack: function(){
        wx.navigateBack({
          delta: 1,
        })
    },
    //选择图片
    chooseImg(){
        let that = this;
        wx.chooseImage({
            count:1,
            success(res){

                wx.uploadFile({
                  filePath: res.tempFilePaths[0],
                  name: 'wechat_head_img',
                  header: {
                    "Content-Type": "multipart/form-data", //记得设置
                    'channelCode': 'wechat',
                    'appVersion': '1.0.1',
                  },
                  url: that.data.url+'/index.php/api/Newjoin/wechatImg',
                  success(res1){
                      console.log(JSON.parse(res1.data))
                      that.setData({
                          img:that.data.url+JSON.parse(res1.data).img
                      })
                  }
                })
            }
        })
    },
    //获取店铺详细地址
    hasDetail(e){
        this.setData({
            detailAdress:e.detail.value
        })
    },
    //切换店铺类型
    pickChange(e){
        this.setData({
            index: e.detail.value
        })
    },
    changeChebox(){
        this.setData({
            checked:!this.data.checked
        })
    },
    //获取店铺名称
    hasName(e){
        this.setData({
            name:e.detail.value
        })
    },
    //同意并注册 
    send(){
        let that = this;

        if(that.data.index == -1){
            wx.showToast({
              title: '请选择店铺类型',
              icon:'none',
              duration:2000
            })
            return false;
        }
        if(!that.data.name){
            wx.showToast({
              title: '请输入店铺名称',
              icon:'none',
              duration:2000
            })
            return false;
        }
        if(!isEor){
            wx.showToast({
              title: '请选择店铺地址',
              icon:'none',
              duration:2000
            })
            return false;
        }
        if(!that.data.detailAdress){
            wx.showToast({
              title: '请输入店铺详细地址',
              icon:'none',
              duration:2000
            })
            return false;
        }
        if(!that.data.checked){
            wx.showToast({
              title: '请勾选服务协议',
              icon:'none',
              duration:2000
            })
            return false;
        }
        var detailAddressArr = that.data.detailAdress.split("")
        var detailAddressStr = ''
        for (let i = 0; i < detailAddressArr.length; i++) { // 去除店铺名字中的空格
            if (detailAddressArr[i]!=' ') {
                detailAddressStr += detailAddressArr[i]
            }
        }
        // console.log(that.data.store_type[that.data.index].key)
        // return
        request.post('/api/newjoin/addStoreApply', {
            data: {
                store_name:that.data.name,
                user_id:that.data.user.user_id,
                mobile:parseFloat(that.data.user.mobile),
                company_province:that.data.area.company_province,
                company_city:that.data.area.company_city,
                company_district:that.data.area.company_district,
                store_address:detailAddressStr, 
                sc_class: that.data.store_type[that.data.index].key,
            },
            success: function (res) {
                console.log(res)
                //返回审核状态
                that.hasStatus();
            }
        });
    },
    hasStatus(){
        let that = this;
        console.log(that.data.user.user_id)
        request.get('/api/Newjoin/storeStatus', {
            data: {
                user_id:that.data.user.user_id,
            },
            success: function (res1) {
                if (res1.data.status != 1) {
                    return
                }
                var group = res1.data.result.store_type.map((item)=>{
                    return item.name
                })
                if (res1.data.result.store && res1.data.result.store.apply_state == 1 ) { //判断有没有店，有，则重定向到我的小店
                    wx.redirectTo({
                      url: '/pages/distribut0/shop/shop',
                    })
                    return
                }
                that.setData({
                    status : res1.data.result.store ? res1.data.result.store.apply_state : -99,
                    is_store:res1.data.result.is_store,
                    storeInfo: res1.data.result.store || null,
                    group: group,
                    store_type: res1.data.result.store_type
                })
                if (res1.data.result.store && res1.data.result.store.apply_state == 2) {
                    that.setData({
                        detailAdress: res1.data.result.store.company_address,
                        index: res1.data.result.store.sc_name == '实体货源厂家' ? 0 : 1,
                        name: res1.data.result.store.store_name,
                        img: res1.data.result.store.wechat_head_img || '',
                    })
                    Dialog.alert({
                        title: '审核状态:未通过',
                        message: '原因：' + res1.data.result.store.review_msg,
                      }).then(() => {
                        Dialog.close()
                      });
                }
            }
        }); 
    },
    // 展示协议
    showAgreement:function(){
        var webUrl = "/api/Article/service_agreement/doc_code/agreement";
        this.setData({ webUrl: webUrl });
        wx.navigateTo({ url: '/pages/index/webview/webview' });
    },
    onClose1:function(){},
    onSelect1:function(){
        
    },
})