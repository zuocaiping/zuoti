//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js')
var request = require('../../utils/request.js');
Page({
  data: {
    img:'images/banner.jpg',
    amount:'images/ic_number_default.png',
    correct:'images/ic_correct_rate_default.png',
    arr:[],
    collectcount:0, //收藏集数量
    errorcount: 0,  //错题集数量
    
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  onLoad: function () {   
    var getAppCode = app.globalData.code;
    var getAppOpenId = app.globalData.openid;
    var _deta = this.deta;
    var _this = this;
    _this.login_fun(_this.getHomeData);

    return false; 
  },
  onShow: function () {
    var _this = this;
    _this.login_fun(_this.getHomeData);
  },
  getHomeData(code,openid){    
    var _deta = this.deta;
    var _this = this;
    //获取首页的数据

    request.get('ShakeSydw.getSydwIndex', {
      code: code,
      openid: openid,
      method: 'ShakeSydw.getSydwIndex',
      appkey: 'aucf581cdedsnhcd40e37a320a8fe492',
      appid: 4, }, function (res){
        if (res.status == 200) {
          var arr = res.result[0].qtypelist;  //首页列表          
          var collectcount = res.result[0].collectcount;  //收藏集数量
          var errorcount = res.result[0].errorcount; //错题集数量
          app.globalData.collectcount = collectcount;//收藏集数量储存到公用
          app.globalData.errorcount = res.result[0].errorcount//错题集数量储存到公用
          for (var i = 0; i < arr.length; i++) {
            var _correct = Number(arr[i].complete / arr[i].count * 100);
            var _number = _correct.toFixed(1)
            console.log(_number);
            arr[i]._correct = _number
          }
        }else{
         
        }
        
        _this.setData({
          'arr': arr,
          collectcount: app.globalData.collectcount,
          errorcount: app.globalData.errorcount,
        })
        console.log(_this.data.arr)
        //app.globalData.collectcount = collectcount
        app.globalData.errorcount = errorcount
    //  }
    })
  },
  // 登录
  login_fun: function (callback){
   // console.log(3333333);
    wx.login({
      success: res => {
        var _this = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId        
        var code = res.code
        app.globalData.code = res.code;        
        if (code) {
          wx.request({
            url: 'https://api.yaotia.com',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              code: code,
              item: 'gwykslnzt',
              method: 'ShakeSydw.getOpenid',
              appkey: 'aucf581cdedsnhcd40e37a320a8fe492',
              appid: 4,
            }, success(res) {
              app.globalData.openid = res.data.result[0].openid;
              var openid = res.data.result[0].openid;
              if(typeof callback == 'function'){
                callback(code,openid);
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！')
        }
      }
    })
  },
  primary:function(e){
    var qtypeid = parseInt(e.currentTarget.dataset.index);

    app.globalData.qtypeid = qtypeid;
   // console.log(qtypeid);
    wx.navigateTo({
      url: '../paper/paper'
    })
  },
  getUserInfo: function(e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },//收藏
  collection: function () {
    wx.navigateTo({
      url: '../collection/collection'
    })
  },//错题
  error: function () {
    wx.navigateTo({
      url: '../error/error'
    })
  }
})
