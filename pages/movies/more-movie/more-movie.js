// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: '',
    movies: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 这里的options是movies.js中onMoreTap函数里url地址后面跟着的参数
    // 如： url: 'more-movie/more-movie?category=' + category,  options={category: category}
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = '';
    switch (category) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case '豆瓣Top250':
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData)
  },
  onReachBottom : function(event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onPullDownRefresh: function(event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    util.http(refreshUrl, this.processDoubanData);
    // wx.showNavigationBarLoading();
  },
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length >= 6) {
        title = title.substring(0, 6) + '...'
      }
      var temp = {
        title: title,
        stars: util.convertToStarArray(subject.rating.stars),
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp)
    }
    // 下拉加载更多数据
    var totalMovies = {};
    if(!this.data.isEmpty) {
      // 之前的数据与新的数据合并，形成总的数据
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    })
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.data.totalCount += 20;
  },
  onReady: function(event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  }
})