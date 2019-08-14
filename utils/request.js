var config = require('../config.js');
function get(method, data = {}, success) {
    data.method = method;
    data.appid = config.appId;
    data.appkey = config.appkey;
    
    wx.request({
      url: config.apiUrl,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (typeof success == 'function') {
          success(res.data);
        }
      }
    })
}

module.exports = {
  get: get  
}