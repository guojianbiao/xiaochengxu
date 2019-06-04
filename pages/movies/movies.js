// pages/movies/movies.js
var util = require('../../utils/utils.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(event) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },

  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": ""
      },
      success: function(res) {
        console.log(res)
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function() {
        console.log("fail")
      }
    })
    // util.http(url, processDoubanData)
  },

  onCanelTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false
    })
  },
  onBindFocus: function() {
    // 数据绑定得用setData,不能用this.data
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  onBindChange: function(event) {
    console.log(event.detail.value)
  },

  processDoubanData: function(moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        stars: util.convertToStarArray(subject.rating.stars),
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }
    var readyData = {};
    // js动态语言，动态创建一个处理完的movies对象
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    // console.log(readyData[settedKey])
    // 因为调用三次所以得到
    // readyData = {
    //   inTheaters: {movies:[{}, {}, {}]}
    // }
    // readyData = {
    //   comingSoon: {movies:[{}, {}, {}]}
    // }
    // readyData = {
    //   top250: {movies:[{}, {}, {}]}
    // }
    this.setData(readyData)
    // 这一步使的 上面data: {}中变为
    // data: {
    //   inTheaters: {movies:[{}, {}, {}]},
    //   comingSoon: {movies:[{}, {}, {}]},
    //   top250: {movies:[{}, {}, {}]}
    // }
  }
})