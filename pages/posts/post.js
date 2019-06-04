// pages/posts/post.js
var postsData = require('../../data/posts-data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      post_key: postsData.postList // postList是posts-data.js文件暴露出的数据对象的名称
    });
  },
  onPostTap: function(event) {
    var postId = event.currentTarget.dataset.postid;  // 点击的时候获取当前的Id值
    // console.log(postId)
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId,
    })
  },
  onSwiperTap: function(event) {
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: './post-detail/post-detail?id=' + postId,
    })
  }
})