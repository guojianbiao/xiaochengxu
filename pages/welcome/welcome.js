Page({
  onTap:function() {
    // wx.redirectTo({
    //   url: "../posts/post"
    // });
    wx.switchTab({
      url: "../posts/post",
    })
  }
})