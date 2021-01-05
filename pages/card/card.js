// pages/card/card.js
var app = getApp()
var rawlist = wx.getStorageSync('PocketLists') || []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardnum:'',
    mainindex:'',
    title:'',
    cardlists:[],
    showmodal:true,
    showmodal1:true,
    showmodal2:true,
    target:'',
    memMode:'',
    temptitle:'',
    tempvalue:'',
    tempindex:'',
    level:3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    rawlist = wx.getStorageSync('PocketLists') || []
    var target = rawlist[params.index].cardnum
    this.setData({
      mainindex: params.index,
      title: rawlist[params.index].title,
      cardnum:rawlist[params.index].cardnum,
      target: target
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  settitle:function(e){
    this.setData({
      temptitle:e.detail.value
    })
  },
  setvalue:function(e){
    this.setData({
      tempvalue:e.detail.value
    })
  },
  addcard:function(){
    this.setData({
      showmodal:!this.data.showmodal,
      temptitle:'',
      tempvalue:''
    })
  },
  modalBindconfirm:function(e){
    if(this.data.temptitle==''||this.data.tempvalue=='')
    wx.showToast({
      title: '请输入内容',
      icon:'none'
    })
    else{
      /**
      * 珊瑚文本内容安全
      */

      wx.serviceMarket.invokeService({
      service: 'wxee446d7507c68b11',
      api: 'msgSecCheck',
      data: {
        "Action": "TextApproval",
        "Text": this.data.temptitle+this.data.tempvalue
      },
    }).then(res => {
      if(res.data.Response.EvilTokens.length!=0){
        wx.showToast({
          title: '请修改内容',
          icon:'none'
        })
      }
      else{
    var templist=rawlist
    var date=new Date()

    templist[this.data.mainindex].cardnum+=1
    templist[this.data.mainindex].cardlists.push({
      title: this.data.temptitle,
      value: this.data.tempvalue,
      level: this.data.level,
      getnum:0,//被记住次数
      forget:false,//表示没被忘
      lastmem:date.getTime()/86400000,//距1970 年 1 月 1 日多少天
      scrore:'',
      collect:false
    })
    this.setData({
      showmodal: !this.data.showmodal,
      temptitle:'',
      tempvalue:'',
      templist:templist,
      cardlists:templist[this.data.mainindex].cardlists,
      target:this.data.cardnum+1,
      cardnum:this.data.cardnum+1,
      level:3
    })
    rawlist=templist
    wx.setStorageSync('PocketLists', rawlist)
  }
})
}
},
  del:function(e){
    var index=e.currentTarget.dataset.index
    var templist=rawlist

   templist[this.data.mainindex].cardnum-=1
   templist[this.data.mainindex].cardlists[index].title=''    
   this.setData({
     cardlists: templist[this.data.mainindex].cardlists,
     cardnum:this.data.cardnum-1,
     temptitle:'',
     tempvalue:'',
     level:3
   })
   rawlist=templist
   wx.setStorageSync('PocketLists', rawlist)
   wx.showToast({
     duration: 2000
   })
  },
  modalBindcancel:function(){
    this.setData({
      showmodal:!this.data.showmodal,
      temptitle:'',
      tempvalue:'',
      level:3
    })
  },
  edi:function(e){
    var index=e.currentTarget.dataset.index

    this.setData({
      temptitle:this.data.cardlists[index].title,
      tempvalue:this.data.cardlists[index].value,
      showmodal1:!this.data.showmodal1,
      tempindex:index,
      level:this.data.cardlists[index].level
    })
  },
  modalBindconfirm1:function(e){
    if(this.data.temptitle==''||this.data.tempvalue=='')
    wx.showToast({
      title: '请输入内容',
      icon:'none'
    })
    else{
            /**
      * 珊瑚文本内容安全
      */

     wx.serviceMarket.invokeService({
      service: 'wxee446d7507c68b11',
      api: 'msgSecCheck',
      data: {
        "Action": "TextApproval",
        "Text": this.data.temptitle+this.data.tempvalue
      },
    }).then(res => {
      if(res.data.Response.EvilTokens.length!=0){
        wx.showToast({
          title: '请修改内容',
          icon:'none'
        })
      }
      else{
    
        var templist=rawlist
        var date=new Date()
        templist[this.data.mainindex].cardlists[this.data.tempindex].value=this.data.tempvalue
        templist[this.data.mainindex].cardlists[this.data.tempindex].title=this.data.temptitle
        templist[this.data.mainindex].cardlists[this.data.tempindex].getnum=0
        templist[this.data.mainindex].cardlists[this.data.tempindex].level=this.data.level
        templist[this.data.mainindex].cardlists[this.data.tempindex].lastmem=date.getTime()/86400000
        this.setData({
          showmodal1: !this.data.showmodal1,
          temptitle:'',
          tempvalue:'',
          level:3,
          templist:templist,
          cardlists:templist[this.data.mainindex].cardlists
        })
        rawlist=templist
        wx.setStorageSync('PocketLists', rawlist)
  }
})
}
},
  modalBindcancel1:function(){
    this.setData({
      showmodal1:!this.data.showmodal1,
      level:3,
      temptitle:'',
      tempvalue:'',
    })
  },
  setTarget:function(e){
    var target=e.detail.value
    this.setData({
      target:target
    })
  },
  modalBindMem:function(){
    wx.reLaunch({
      url: "../mem/mem?index="+this.data.mainindex+"&op="+this.data.memMode+"&target="+this.data.target
    })
  },
  mem:function(e){
    var index=e.currentTarget.dataset.index
    this.setData({
      memMode:index
    })
    if(this.data.cardnum==0)
    {
      wx.showToast({
        title: '请添加卡片',
        duration: 2000,
        icon:'none'
      })
    }
    else if(index==1)
    {
      wx.reLaunch({
        url: "../mem/mem?index="+this.data.mainindex+"&op="+index+"&target="+this.data.cardnum,
      })
    }
    else{
      this.setData({
        showmodal2 :!this.data.showmodal2
      })
    }
  },
  setlevel:function(e){
    var level=e.detail.value
    this.setData({
      level:level
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
    // 生命周期函数--监听页面显示
    rawlist = wx.getStorageSync('PocketLists') || []
    var cardlists = rawlist[this.data.mainindex].cardlists
    this.setData({
      cardlists: cardlists
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