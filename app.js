App({

  globalData: { // 记录全局数据
    g_isPlayingMusic: false, // 记录音乐播放状态
    g_currentMusicPostId: null, // 记录当前页面音乐播放状态
    doubanBase: "http://t.yushu.im" //豆掰url根地址
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
