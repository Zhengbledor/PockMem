// pages/mem/mem.js
var app = getApp()
var rawlist = wx.getStorageSync('PocketLists') || []
var signUp = wx.getStorageSync('signUp') || []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    target:'',
    target_init:'',
    target_progress:'',
    mainindex: '',
    op: '',
    title: '',
    tempindex: '',
    temptitle: '',
    tempvalue: '',
    cardlists: '',
    min: 0,
    max: '',  
    MaxGetNum: 0,
    showmodal:true,
    collect_src:"../../icon/_collect.png",
    signUp:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    rawlist = wx.getStorageSync('PocketLists') || []
    signUp = wx.getStorageSync('signUp') || []
    var op = params.op
    var target = params.target
    var mainindex = params.index
    var cardlists = rawlist[mainindex].cardlists
    var prog = Math.floor(100-100*target/this.data.target_init)
    this.setData({
      target:target,
      target_init:target,
      target_progress:prog,
      mainindex: mainindex,
      op: op,
      title: rawlist[params.index].title,
      cardlists: cardlists,
      max: cardlists.length,
      signUp:signUp
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    if (op == 1) {
      var n = 0
      while (cardlists[n].title == '') {
        n++
      }
      var collect_src = (this.data.cardlists[n].collect==true)?"../../icon/collect.png":"../../icon/_collect.png"
      this.setData({
        tempindex: n,
        temptitle: cardlists[n].title,
        tempvalue: cardlists[n].value,
        collect_src: collect_src
      })
    } else if (op == 2) {
      var n = Math.floor(Math.random() * (this.data.max))
      while (cardlists[n].title == '') {
        n = Math.floor(Math.random() * (this.data.max))
      }
      var collect_src = (this.data.cardlists[n].collect==true)?"../../icon/collect.png":"../../icon/_collect.png"
      this.setData({
        tempindex: n,
        temptitle: cardlists[n].title,
        tempvalue: cardlists[n].value,
        collect_src: collect_src
      })
    } else if (op == 3) {
      this.refreshscore()
    }
  },
  refreshscore: function () {
    var n = 0
    var templist = this.data.cardlists
    var MaxGetNum = this.data.MaxGetNum
    var date = new Date()


    var today = Math.floor(date.getTime() / 86400000)
    while (n < templist.length) { //找到最大的
     // console.log(n)
      if (templist[n].title == '') {
        n++
        continue
      } else if (MaxGetNum < templist[n].getnum) {
        MaxGetNum = templist[n].getnum
        n++
      } else
        n++
    }
    this.setData({
      MaxGetNum: MaxGetNum
    })
    n = 0
    while (n < templist.length) {
      if (templist[n].title == '') {
        n++
        continue
      }
      
      templist[n].score = (templist[n].level + 3 * (this.data.MaxGetNum - templist[n].getnum)) * (1 + (today - templist[n].lastmem) / 3) * (templist[n].forget ? 3 : 1)
      n++
    }
    this.setData({
      cardlists: templist
    })
    rawlist[this.data.mainindex].cardlists = templist
    wx.setStorageSync('PocketLists', rawlist)
    n++
    var Maxscore = 0
    var Maxindex = 0
    while (n < templist.length) { //找到最大的
    
      if (templist[n].title == '') {
        n++
        continue
      } else if (Maxscore < templist[n].score) {
        Maxscore = templist[n].score
        Maxindex = n
        n++
      } else
        n++
    }  
    if(templist[Maxindex].forget==false&&templist[Maxindex].lastmem-today<1)//没啥改变的 陷入死循环
    {
      this.setData({
      op:2//随即起来吧
    })
    this.ramnext()
    }
    else{      
      var collect_src = (this.data.cardlists[Maxindex].collect==true)?"../../icon/collect.png":"../../icon/_collect.png"
      this.setData({
        tempindex:Maxindex,
        temptitle:templist[Maxindex].title,
        tempvalue:templist[Maxindex].value,
        collect_src: collect_src
      })
    }

  },
  remember: function () {
    var cardlists = this.data.cardlists
    var date = new Date()
    var target = this.data.target-1
    var prog = Math.floor(100-100*target/this.data.target_init)
    cardlists[this.data.tempindex].getnum += 1
    cardlists[this.data.tempindex].forget = false
    cardlists[this.data.tempindex].lastmem = Math.floor(date.getTime() / 86400000)
    this.setData({
      cardlists: cardlists,
      target:target,
      target_progress:prog
    })
    var year=date.getFullYear()
    var month=date.getMonth()+1
    var day=date.getDate()
    var signUp = this.data.signUp
    var days=signUp[signUp.length-1]
    if(signUp.length==0|| days.year!=year || days.month!=month || days.day!=day)
    signUp.push({
      year: year,
      month:month,
      day:day
    })
    this.setData({
      signUp:signUp
    })
    wx.setStorageSync('signUp', signUp)
    rawlist[this.data.mainindex].cardlists = cardlists
    wx.setStorageSync('PocketLists', rawlist)

    if(this.data.target == 0){
      this.setData ({
        showmodal:false
      })
    }
    if (this.data.op == 1) {
      this.seqnext()
    } else if (this.data.op == 2) {
      this.ramnext()
    } else if(this.data.op==3){
      this.refreshscore()
    }

  },
  modalBind:function(){
    wx.reLaunch({
      url: "../lists/lists"
    })
  },
  seqnext: function () { //顺序
    var n = (this.data.tempindex + 1) % (this.data.cardlists.length)
    while (this.data.cardlists[n].title == '') {
      n++
      if (n == this.data.cardlists.length)
        n = 0
    }    
    var collect_src = (this.data.cardlists[n].collect==true)?"../../icon/collect.png":"../../icon/_collect.png"
    this.setData({
      tempindex: n,
      temptitle: this.data.cardlists[n].title,
      tempvalue: this.data.cardlists[n].value,
      collect_src: collect_src
    })
  },
  ramnext: function () {
    var n = Math.floor(Math.random() * (this.data.max))
    while (this.data.cardlists[n].title == '') {
      n = Math.floor(Math.random() * (this.data.max))
    }
    var collect_src = (this.data.cardlists[n].collect==true)?"../../icon/collect.png":"../../icon/_collect.png"
    this.setData({
      tempindex: n,
      temptitle: this.data.cardlists[n].title,
      tempvalue: this.data.cardlists[n].value,
      collect_src: collect_src
    })
  },
  forget: function () {
    var cardlists = this.data.cardlists
    cardlists[this.data.tempindex].forget = true
    var target = this.data.target-1
    var prog = Math.floor(100-100*target/this.data.target_init)
    this.setData({
      cardlists: cardlists,
      target:target,
      target_progress:prog
    })
    rawlist[this.data.mainindex].cardlists = cardlists
    wx.setStorageSync('PocketLists', rawlist)    
    if(this.data.target == 0){
      this.setData ({
        showmodal:false
      })
    }
    if (this.data.op == 1)
      this.seqnext()
    else if (this.data.op == 2)
      this.ramnext()
      else if (this.data.op == 3)
      this.refreshscore()
  },
  changecollect: function () {
    var cardlists = this.data.cardlists
    cardlists[this.data.tempindex].collect = !this.data.cardlists[this.data.tempindex].collect
    var collect_src = this.data.cardlists[this.data.tempindex].collect==true?"../../icon/collect.png":"../../icon/_collect.png"
    this.setData({
      cardlists: cardlists,
      collect_src: collect_src
    })
    rawlist[this.data.mainindex].cardlists = cardlists
    wx.setStorageSync('PocketLists', rawlist)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    rawlist = wx.getStorageSync('PocketLists') || []
    this.setData({
      cardlists: rawlist[this.data.mainindex].cardlists
    })
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