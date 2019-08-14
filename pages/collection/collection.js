//logs.js
var request = require('../../utils/request.js');
var config = require('../../config.js');
var util = require('../../utils/util.js');
var app = getApp();
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;
Page({
  data: {
    _ishide:false,
    selected: true,
    selected1: false,
    errorcount:'' ,//错题的数据
    defaultSize: 'default',
    _null: '',
    answer_index: 0,  //正确答案索引
    me_answer: '',
    title: '第1题-常识判断',
    index: 0,
    loading: false,
    url: '../result/result',
    collection_img: 'images/collection1.png',//收藏图片
    count:0,//收藏数量
    arr_list: [], //选项列表
    e: 0,
    starting_position: 0,//分页起始值
    display_number: 10,//分页每次加载10条   
    show: 'none',
    challengeid: '',
    issubscribe: '', //判断是否关注公众号，显示解析
    analysis: '',
    passnum: 0, //用户做对题数
    seeResult: '', //查看结果跳到失败页或地图页
    promptDisplay: 0,//分享按钮是否隐藏
    shareTickets: '',//分享转发成功后返回唯一票据id
    isForward: 1,//判断是否转发
    box: 0,//关注弹框
    _number1:0
  },
  onLoad: function () {
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;    
    this._pagingfun();  
    this.setData({
      errorcount: app.globalData.errorcount
    })
    
  },
  onShow: function () {
    if (this.data._ishide == false) {
      wx.showLoading({
        title: 'loading',
      })
    }
    this._pagingfun();
  },
  //分页函数
  _pagingfun: function () {
    var _data = this.data;
    var _this = this;
    var getAppOpenId = app.globalData.openid;
    var getAppQid = app.globalData.qid;
    request.get('ShakeSydw.collectList', {
      openid: getAppOpenId,
      offset: _data.starting_position,////分页起始值
      limit: _data.display_number,//分页每次加载10条
      method: 'ShakeSydw.collectList',
      appkey: 'aucf581cdedsnhcd40e37a320a8fe492',
      appid: 4,
    }, function (res){
      if (res.status == 200) {       
        console.log(res)
        _this.data.count = res.result[0].count;
        var list = res.result[0].list;
        
        for (var i = 0; i < list.length; i++) {
          _this.data.arr_list.push(list[i]);
          if (list[i].iscollect == 0) {
            list[i].collection_img = 'images/collection.png'
            _this.setData({
              collectcount_state: 0
            })
          } else {
            list[i].collection_img = 'images/collection1.png'
            _this.setData({
              collectcount_state: 1
            })
          }
        }
        _this.data.starting_position += list.length;
        var setData = {};
        if (_this.data.arr_list.length>0){
          _this.data._ishide =true;
        }
        setData._ishide = _this.data._ishide; 
        setData.e = _this.data.e;
        setData.arr_list = _this.data.arr_list;
        setData.count = _this.data.count;
        setData.starting_position = _this.data.starting_position;
        _this.setData(setData);
        wx.hideLoading();
        

      }
    })

  },//答题背题模式切换
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
        
        //me_answer: option
      })
    }
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })

    if (this.data.selected1 == true){
      this.setData({
        show: 'block',
        display: 'none',
        analysis: 1,
        _null: 1,
        //me_answer: option
      })
    }
  },
  option: function (e) {
    var _this = this.data;
    var _that = this;
    var arr_list = _this.arr_list;//10道题
    console.log(arr_list)
    arr_list[_this.e].push = 1;
    if (_this._null == '') {
      var option = e.currentTarget.dataset.option;  //选项 A B C D
      //console.log('选择答案'+option);
      var answer = e.currentTarget.dataset.answer;  //正确答案 固定
      // console.log('答案' +answer);
      var index = e.currentTarget.dataset.int;  //索引

      arr_list[_this.e].arr_class = [{ name: 'class_noselect', option: 'A' }, { name: 'class_noselect', option: 'B' }, { name: 'class_noselect', option: 'C' }, { name: 'class_noselect', option: 'D' },];
      if (answer == option) {
        arr_list[_this.e].arr_class[index].name = 'class_select';
        
        // console.log('正确答案索引：' + _this.index)
        _that.setData({
         // arr_class: arr_list[_this.e].arr_class,
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
          arr_list: arr_list
        })
      }
      
      _that.setData({
        show: 'block',
        display: 'none',
        analysis: 1,
        _null: 1,
        me_answer: option
      })
      
    //  return arr_class;
    }
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);    
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var _data = this.data;
    var _that = this;

    var touchMove = e.changedTouches[0].pageX;
   
    // 向you滑动   
    if (touchMove - touchDot <= -80 && flag_hd == true) {      
      
      if (_that.data.e >= _that.data.count -1){ 
        _that.setData({
          box: 1
        })       
        return false;
      }      
      _that.data.e += 1;
      if (_that.data.e >= _that.data.arr_list.length){
        
        
        wx.showLoading({
          title: 'loading',
        })
        _that._pagingfun();
        console.log(_data.arr_list)
      }else{        
        _data.arr_list[_data.e].collection_img = "images/collection1.png";
        _that.setData({ 
          e: _that.data.e,
          arr_list: _that.data.arr_list
         });
        console.log(_data.arr_list)
      }
      
    }
    // 向zuo滑动   
    if (touchMove - touchDot >= 80 && flag_hd == true) {
      console.log('left');
      if(_that.data.e>=1){
        _that.data.e-=1;
        _that.setData({
          e: _that.data.e
        });
      }
    }    

    clearInterval(interval); // 清除setInterval
    time = 0;
    if (_that.data.arr_list[_that.data.e].push == 1 && _that.data.selected1 == true) {
      _that.setData({
        show: 'block',
        display: 'none',
        analysis: 1,
        _null: 1,
      })
    } else if (_that.data.arr_list[_that.data.e].push == undefined && _that.data.selected1 == false) {
      _that.setData({
        show: 'none',
        display: 'none',
        analysis: '',
        _null: '',
      })
    }
  },  //点击游戏规则关闭
  clickClose: function () {
    var that = this;
    var _that = this.data;
    that.setData({
      box: 0
    })
  },
  //取消收藏
  collection: function () {
    var _this = this.data;
    var _that = this;
    var arr_list = _this.arr_list;//10道题

    var qid = _this.arr_list[_this.e].qid;  //题目的qid
    var getAppOpenId = app.globalData.openid;

    console.log(qid)
    //判断当前题目没有收藏时：点击收藏数字+1， 图片为collection1，collectcount_state：0
    if (arr_list[_this.e].iscollect == 0) {
      request.get('ShakeSydw.setCollect', {
        openid: getAppOpenId,
        qid: qid,
        appkey: 'aucf581cdedsnhcd40e37a320a8fe492',
        appid: 4,
      }, function (res){
         
      })
      arr_list[_this.e].iscollect = 1;
      arr_list[_this.e].collection_img = "images/collection1.png";
      _that.setData({
        arr_list: arr_list,
      })
    } else if (arr_list[_this.e].iscollect == 1) {
      request.get('ShakeSydw.delCollect', {
        openid: getAppOpenId,
        qid: qid,
        appkey: 'aucf581cdedsnhcd40e37a320a8fe492',
        appid: 4,
      }, function (res){
        
      })
      arr_list[_this.e].iscollect = 0;
      arr_list[_this.e].collection_img = "images/collection.png";
      _that.setData({
        arr_list: arr_list,
      })
    }
  
  },//错题
  error: function () {
    wx.redirectTo({
      url: '../error/error'
    })
  }
})
