// pages/posts/post-detail/post-detail.js
var postsData = require('../../../data/posts-data.js'); // postsData是一个对象
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options) {id:0}
    var postId = options.id;  // 获取的是post.js文件中 (url: './post-detail/post-detail?id=' + postId) 的id值
    this.data.currentPostId = postId;
    var post_data = postsData.postList[postId]; // 页面详情页的数据 
    this.setData({
      postData:post_data
    });
    // 使用缓存实现收藏功能
    // var postsCollected={
    //   1:true,
    //   2:false,
    //   3:true
    // }
    var postsCollected=wx.getStorageSync("posts_collected"); // 获取到所有的缓存状态
    if(postsCollected){
      var postCollected=postsCollected[postId]; // 取到其中一个状态,进行数据绑定
      this.setData({
        collected: postCollected
      })
    }else{
      var postsCollected={};
      postsCollected[postId]=false;
      wx.setStorageSync("posts_collected", postsCollected);
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayMusic: true
      })
    }
    this.setMusicMonitor();
  },

  setMusicMonitor: function () {
    var self = this;
    // wx.onBackgroundAudioPlay(function() { 
    //   self.setData({
    //     isPlayMusic: true
    //   })
    //   app.globalData.g_isPlayingMusic = true;
    //   app.globalData.g_currentMusicPostId = self.data.currentPostId;
    // });
    // wx.onBackgroundAudioPause(function () {
    //   self.setData({
    //     isPlayMusic: false
    //   })
    //   app.globalData.g_isPlayingMusic = false;
    //   app.globalData.g_currentMusicPostId = null;
    // });
    var BackgroundAudioManager = wx.getBackgroundAudioManager() // 1.20版本
    BackgroundAudioManager.onPlay(function () {
      self.setData({
        isPlayMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = self.data.currentPostId;
    });
    BackgroundAudioManager.onPause(function () {
      self.setData({
        isPlayMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },

  onColletionTap:function(event){
    /**
     * 假如都没点击收藏的情况下，经过上面的代码逻辑判断得到
     * posts_collected={0:false},所以获取缓存得到postsCollected={0:false}，0为postsCollected的属性,
     * 其值为false，所以postCollected=false,经过取反得到postCollected=true，
     * 最后得到postsCollected={0:true}，所以posts_collected={0:true}，再把postCollected传给collected
     */
    this.getPostsCollectedSync();
    // this.getPostsCollectedAsy();
  },

  getPostsCollectedAsy: function() { // 异步
    var self = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function(res) {
        // console.log(res)
        var postsCollected = res.data;
        var postCollected = postsCollected[self.data.currentPostId];// 当前文章是不是被收藏
        // 收藏变成未收藏， 未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[self.data.currentPostId] = postCollected; //更新缓存

        // this.showModal(postsCollected, postCollected); // 显示模态对话框
        self.showToast(postsCollected, postCollected); // 显示消息提示框
      },
    })
  },

  getPostsCollectedSync: function () { // 同步
    var postsCollected = wx.getStorageSync("posts_collected"); // 获取到所有的缓存状态
    var postCollected = postsCollected[this.data.currentPostId];// 当前文章是不是被收藏
    // 收藏变成未收藏， 未收藏变成收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected; //更新缓存

    // this.showModal(postsCollected, postCollected); // 显示模态对话框
    this.showToast(postsCollected, postCollected); // 显示消息提示框
  },

  showModal: function (postsCollected, postCollected) {
    var self = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章?' : '取消收藏该文章？',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success(res) {
        if (res.confirm) {
          wx.setStorageSync("posts_collected", postsCollected);
          // 更新数据绑定变量，从而实现切换图片
          self.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  showToast: function (postsCollected, postCollected) {
    wx.setStorageSync("posts_collected", postsCollected);
    // 更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      icon: 'success',
      duration: 1000
    })
  },

  onShareTap: function (event) {
    var itemList = [
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博",
      "分享给好友"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function(res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex]
        })
      }
    })
  },

  onMusicTap: function (event) {
    var isPlay = this.data.isPlayMusic;
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    if (isPlay) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayMusic: false
      })
    } else{
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({
        isPlayMusic: true
      })
    }
  }
})