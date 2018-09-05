// 订单列表
const regeneratorRuntime  = require("../../lib/runtime");
Page({
  data: {
    historyorders: []
  },

  /**
   * 查询订单，跳转至订单详情
   */
  async queryorder (e) {
    wx.navigateTo({
      url: `/pages/result/index?id=${e.currentTarget.dataset.order}`
    });
  },

  async onShow () {
    this.getHistoryOrder();
  },

  /**
   * 获取历史的所有订单
   */
  getHistoryOrder: async function() {
    wx.showLoading({ title: '数据获取中...' });

    const db = wx.cloud.database();
    let result = await db.collection('order').get();
    let data = result.data || [];         
    this.setData({
      historyorders: data
    });
    wx.hideLoading();
  }
})
