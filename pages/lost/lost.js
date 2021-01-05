// pages/lost/lost.js
var rawlist = wx.getStorageSync('PocketLists') || []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lostlist:[],
    n:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    rawlist = wx.getStorageSync('PocketLists') || []
    var lostlist=[]
    var n = 0;
    while(n < rawlist.length){
      if(rawlist[n].title != ''){
        var m = 0;
        var templist = rawlist[n].cardlists
        while(m < templist.length){
          if(templist[m].title!=''&&templist[m].collect!=false){
            lostlist.push({
              card:templist[m],
            n:n,
          m:m})
          }
          m = m+1
        }
      } 
      n = n+1     
    }    
    this.setData({
      lostlist:lostlist,
      n:n
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})