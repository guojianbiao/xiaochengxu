// 公共方法

// 评分星星方法
function convertToStarArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for(var i = 1; i <= 5; i++) {
    if(i <= num) {
      array.push(1)
    } else {
      array.push(0)
    }
  }
  return array
}

// 发送请求获取数据
function http(url, callBack) { // callBack回调函数，获取数据后执行的操作，主要处理数据
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": ""
    },
    success: function (res) {
      callBack(res.data)
    },
    fail: function () {
      console.log("fail")
    }
  })
}

module.exports = {
  convertToStarArray: convertToStarArray,
  http: http
}