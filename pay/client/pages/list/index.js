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

  async getGoodsList() {
    const db = wx.cloud.database();
    const result = await db.collection('goods').get();

    let data = result.data || [];

    this.setData({
      goods: data
    });
  },

  async makeOrder(e) {

    wx.showLoading({
      title: '正在下单',
    });

    let id = e.target.dataset.goodid;
    const { result } = await wx.cloud.callFunction({
      name: 'pay',
      data: {
        type: 'unifiedorder',
        data: {
          goodId: id
        }
      }
    });

    const data = result.data;

    wx.hideLoading();

    wx.navigateTo({
      url: `/pages/result/index?id=${data.out_trade_no}`
    });
  }
})