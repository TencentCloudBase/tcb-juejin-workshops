// 购买商品
const regeneratorRuntime = require("../../lib/runtime");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getGoodsList();
  },

  /**
   * 获取商品列表
   */
  async getGoodsList() {
    
  },

  /**
   * 发起订单
   */
  async makeOrder(e) {
    
  }
})