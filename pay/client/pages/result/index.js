// 订单详情

const app = getApp();
const regeneratorRuntime  =  require("../../lib/runtime");

Page({
  data: {
    order: {}
  },

  onLoad({ id }) {
    wx.showLoading({
      title: '正在加载',
    });

    this.setData({
      out_trade_no: id
    }, async () => {

      await this.getOrder();

      wx.hideLoading();
    });
  },

  /**
   * 发起支付
   */
  pay() {
    
  },

  /**
   * 关闭订单
   */
  async close() {

    wx.showLoading({
      title: '正在关闭',
    });

    let out_trade_no = this.data.out_trade_no;

    let result = await wx.cloud.callFunction({
      name: 'pay',
      data: {
        type: 'closeorder',
        data: {
          out_trade_no
        }
      }
    });

    console.log(result);

    this.getOrder();

    wx.hideLoading();
  },

  /**
   * 获取订单详情
   */
  getOrder: async function() {
    
    const { result } = await wx.cloud.callFunction({
      name: 'pay',
      data: {
        type: 'orderquery',
        data: {
          out_trade_no: this.data.out_trade_no
        }
      }
    });

    let data = result.data || {};

    console.log(data);

    this.setData({
      order: data
    });
  }
})
