
var rawlist = wx.getStorageSync('PocketLists') || []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temptitle:'',
    tempindex:'',
    showmodal:true,
    showmodal1:true,
    PocketList:rawlist

  },
  add: function () {
    this.setData({
        showmodal:!this.data.showmodal
      })
  },
  settitle:function(e){
    //console.log(e);
    this.setData({
      temptitle:e.detail.value
    })
  },
  modalBindconfirm:function(e){
    if(this.data.temptitle=='')
    wx.showToast({
      title: '请输入内容'
    })
    else{
    var templist = this.data.PocketList
    templist.push({
      title: this.data.temptitle,
      cardnum:0,
      cardlists: []
    })
    // rawlist.push({
    //   title: this.data.temptitle,
    //   cardnum:0,
    //   cardlists: []
    // })
    this.setData({
      showmodal: !this.data.showmodal,
      temptitle: '',
      PocketList: templist
    })
    rawlist=templist
    wx.setStorageSync('PocketLists', rawlist)
  }
  },
  modalBindcancel:function(){
    this.setData(
      {
        showmodal:!this.data.showmodal
      }
    )
  },
  del:function(e){
   // console.log(e)
   var index=e.currentTarget.dataset.index
   this.data.PocketList[index].title=''
   this.setData({
    PocketList: this.data.PocketList
  })
  rawlist[index].title=''
  wx.setStorageSync('PocketLists', rawlist)
  wx.showToast({
    title: '成功',
    icon: 'success',
    duration: 2000
  })
  },
  rename:function(e){
    //console.log(e)
    this.setData({
      showmodal1:!this.data.showmodal1
    })
    this.setData({
      tempindex:e.currentTarget.dataset.index
    })
   },
   modalBindconfirm1:function(){
     if(this.data.temptitle=='')
     wx.showToast({
       title: '请输入内容'
     })
     else{
        var templist = this.data.PocketList
    var index=this.data.tempindex
    templist[index].title=this.data.temptitle
    rawlist[index].title=this.data.temptitle
    this.setData({
      PocketList:templist,
      showmodal1:!this.data.showmodal1,
      tempindex:'',
      temptitle:''
    })
    wx.setStorageSync('PocketLists', rawlist)
    }
   
   },
   modalBindcancel1:function(){
    this.setData({
      showmodal1:!this.data.showmodal1
    })
   },
   delall:function(){
    wx.removeStorageSync('PocketLists')
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    rawlist = wx.getStorageSync('PocketLists') || []
    this.setData({
      PocketList:rawlist
    })
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