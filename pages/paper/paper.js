//logs.js
var util = require('../../utils/util.js')
var app = getApp();
var request = require('../../utils/request.js');
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;
Page({
  data: {
    selected: true, //答题背题模式切换
    selected1: false,//答题背题模式切换
  //  collectcount: app.globalData.collectcount,//收藏
    errorcount: app.globalData.errorcount,//错题
    collectcount_state: '',//收藏状态
   // collection_img:'',//收藏图片
    defaultSize: 'default',
    _null: '',
    answer_index: 0,  //正确答案索引
    me_answer: '',
    title: '第1题-常识判断',
    index: 0,
    loading: false,
    url: '../result/result',
    //arr_class: [],   //选项class名字
    arr_list: [], //选项列表
    e: 0,
    show: 'none',
    challengeid: '',
    issubscribe: '', //判断是否关注公众号，显示解析
    analysis: '',
    passnum: 0, //用户做对题数
    seeResult: '', //查看结果跳到失败页或地图页
    prompt: 0,//转发活动3次提示机会，默认为0
    promptDisplay: 0,//分享按钮是否隐藏
    shareTickets: '',//分享转发成功后返回唯一票据id
    isForward: 1,//判断是否转发
    qid:'',
   // issubscribe: '',//取消关注
    box: 0,//关注弹框
  },
  onLoad: function () {
    var _data = this.data;
    var _this = this;
    var getAppOpenId = app.globalData.openid;
    var qtypeid = app.globalData.qtypeid;
    _this.setData({
     // collectcount: app.globalData.collectcount,
      errorcount: app.globalData.errorcount,

    })
   
    request.get('ShakeSydw.getQuestions', {
      openid: getAppOpenId,
      qtypeid: qtypeid,
      appkey: 'aucf581cdedsnhcd40e37a320a8fe492',
      appid: 4,
    }, function (res){
      if (res.status == 200) {
        console.log(res)        
        var arr_list = res.result[0]; 
        
        for (var i = 0; i < arr_list.length;i++){
          var str = arr_list[i].body[0].content;
          str.replace(/<br>/g, '\n');
          console.log(str)

          if (arr_list[i].iscollect == 0){
            arr_list[i].collection_img = 'images/collection.png'
            _this.setData({
               collectcount_state:0
            })
          } else{
            arr_list[i].collection_img = 'images/collection1.png'
            _this.setData({
              collectcount_state: 1
            })
          }
          
        }

        _this.setData({
          arr_list: arr_list,
        })
        app.globalData.qid = _data.arr_list[_data.e].qid;
        
        
      }
    })
    
  },
  onShow: function () {
    var _data = this.data;
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
    
  },
  
  _paperList:function(){
    var getAppOpenId = app.globalData.openid;
    var qtypeid = app.globalData.qtypeid;
    _this.setData({
      // collectcount: app.globalData.collectcount,
      errorcount: app.globalData.errorcount,

    })
    request.get('ShakeSydw.getQuestions', {
      openid: getAppOpenId,
      qtypeid: qtypeid,
      method: 'ShakeSydw.getQuestions',
      appkey: 'aucf581cdedsnhcd40e37a320a8fe492',
      appid: 4,
    }, function (res){
      if (res.status == 200) {
        var arr_list = res.result[0];
        for (var i = 0; i < arr_list.length; i++) {
          if (arr_list[i].iscollect == 0) {
            arr_list[i].collection_img = 'images/collection.png'
            _this.setData({
              collectcount_state: 0
            })
          } else {
            arr_list[i].collection_img = 'images/collection1.png'
            _this.setData({
              collectcount_state: 1
            })
          }
        }
       

        _this.setData({
          arr_list: arr_list,
        })
        app.globalData.qid = _data.arr_list[_data.e].qid;


      }
    })
  },
  //答题背题模式切换
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
    if (this.data.selected1 == false) {
      this.setData({
        show: 'none',
        display: 'block',
        analysis: '',
        _null: '',        
      })
    }
  },
  selected1: function (e) {
    var _this = this.data;
    this.setData({
      selected: false,
      selected1: true
    })

    if (this.data.selected1 == true){
      var arr_list = _this.arr_list;//10道题
      var answer = arr_list[_this.e].answer;

      this.setData({
        show: 'block',
        display: 'none',
        analysis: 1,
        _null: 1,
      })
    }
  },
  option: function (e) {
    var _this = this.data;
    var _that = this;
    var arr_list = _this.arr_list;//10道题
    arr_list[_this.e].push = 1;
    if (_this._null == '') {
      var option = e.currentTarget.dataset.option;  //选中的答案 A B C D
      //console.log('选择答案'+option);
      var answer = e.currentTarget.dataset.answer;  //正确答案 固定
      // console.log('答案' +answer);
      var index = e.currentTarget.dataset.int;  //索引

      arr_list[_this.e].arr_class = [{ name: 'class_noselect', option: 'A' }, { name: 'class_noselect', option: 'B' }, { name: 'class_noselect', option: 'C' }, { name: 'class_noselect', option: 'D' },];
      if (answer == option) {
        arr_list[_this.e].arr_class[index].name = 'class_select';
        
        _that.setData({
          answer_index: index,
          arr_list: arr_list
        })

      } else {
        arr_list[_this.e].arr_class[index].name = 'class_answer';
        for (var i = 0; i < arr_list[_this.e].arr_class.length; i++) {
          if (arr_list[_this.e].arr_class[i].option == answer) {
            arr_list[_this.e].arr_class[i].name = 'class_select';
          }
        }
        _that.setData({
          //arr_class: arr_list[_this.e].arr_class,
          arr_list: arr_list,
          errorcount: _this.errorcount+1
        })
       // console.log('错题'+_this.errorcount)
        app.globalData.errorcount = _this.errorcount //错题数量存到公用js
      }
      //把错题id和answer做错的答案传给后台，
      var getAppOpenId = app.globalData.openid;
    //  var getAppQid = app.globalData.qid = qid;
      var qid = arr_list[_this.e].qid;
      request.get('ShakeSydw.setwxTi', {
        openid: getAppOpenId,
        qid: qid,
        answer: option,
        appkey: 'aucf581cdedsnhcd40e37a320a8fe492',
        appid: 4,
      }, function (res){
      })
      _that.setData({
        show: 'block',
        display: 'none',
        analysis: 1,
        _null: 1,
        me_answer: option
      })      

     // console.log('qid----!' + app.globalData.qid)
    }
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
    console.log('起点：'+touchDot)
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var _data = this.data;
    var _that = this;

    var touchMove = e.changedTouches[0].pageX;
    console.log('终点：' + touchMove)
    console.log(touchMove - touchDot)
    // 向右滑动
    if (touchMove - touchDot <= -80 && flag_hd == true) {
      // flag_hd = false;
      //执行切换页面的方法
     // console.log("向右滑动");
      var _number = _data.e + 1;
      if (_data.e == 9) {
        _that.setData({
          box: 1
        })
        return false;
      } else {
        _that.setData({
          e: _number
        })
      }

     
    }
    // 向左滑动
    if (touchMove - touchDot >= 80 && flag_hd == true) {
      //  flag_hd = false;
      //执行切换页面的方法
     // console.log("向左滑动");
      var _number = _data.e - 1;
      if (_data.e == 0) {
        return false;
      } else {
        _that.setData({
          e: _number
        })
      }
    
    }    
   
    clearInterval(interval); // 清除setInterval
    time = 0;
    if (_data.arr_list[_data.e].push == 1 && _data.selected1 == true) {
      _that.setData({
        show: 'block',
        display: 'none',
        analysis: 1,
        _null: 1,
      })
    } else if (_data.arr_list[_data.e].push == undefined && _data.selected1 == false) {
      _that.setData({
        show: 'none',
        display: 'none',
        analysis: '',
        _null: '',
      })
    }
  }, 
  error:function(){
    wx.redirectTo({
      url: '../error/error'
    })
  },
  //点击游戏规则关闭
  clickClose: function () {
    var that = this;
    var _that = this.data;
    that.setData({
      box: 0
    })
  },//收藏
  collection: function () {
    var _this = this.data;
    var _that = this;
    var arr_list = _this.arr_list;//10道题
    var qid = arr_list[_this.e].qid;
    console.log(qid)
    var getAppOpenId = app.globalData.openid;
   
    console.log(arr_list[_this.e])
    //判断当前题目没有收藏时：点击收藏数字+1， 图片为collection1，collectcount_state：0
    if (arr_list[_this.e].iscollect == 0) {
      request.get('ShakeSydw.setCollect', {
        openid: getAppOpenId,
        qid: qid,
        method: 'ShakeSydw.setCollect',
        appkey: 'aucf581cdedsnhcd40e37a320a8fe492',
        appid: 4,
      }, function (res){
          console.log(res)
      })
      arr_list[_this.e].iscollect = 1;
      arr_list[_this.e].collection_img = "images/collection1.png";
       _that.setData({
         arr_list: arr_list,
       })
    } else if (arr_list[_this.e].iscollect == 1){
      request.get('ShakeSydw.delCollect', {
        openid: getAppOpenId,
        qid: qid,
        method: 'ShakeSydw.delCollect',
        appkey: 'aucf581cdedsnhcd40e37a320a8fe492',
        appid: 4,
      }, function (res){        
          console.log(res)
      })
      arr_list[_this.e].iscollect = 0;
      arr_list[_this.e].collection_img = "images/collection.png";
      _that.setData({
        arr_list: arr_list,
      })
    }

  }
})
