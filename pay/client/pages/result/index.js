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
    }, () => {

      this.getOrder();

      wx.hideLoading();
    });
  },

  /**
   * 发起支付
   */
  pay() {
    let orderQuery = this.data.order;
    let out_trade_no = this.data.out_trade_no;
    let _this = this;

    const {
      time_stamp,
      nonce_str,
      sign,
      sign_type,
      prepay_id,
      body,
      total_fee
    } = orderQuery;

    wx.requestPayment({
      timeStamp: time_stamp,
      nonceStr: nonce_str,
      package: `prepay_id=${prepay_id}`,
      signType: 'MD5',
      paySign: sign,
      async success(res) {
        wx.showLoading({
          title: '正在支付',
        });

        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
          async success() {
            _this.getOrder();

            await wx.cloud.callFunction({
              name: 'pay',
              data: {
                type: 'payorder',
                data: {
                  body,
                  prepay_id,
                  out_trade_no,
                  total_fee
                }
              }
            });
            wx.hideLoading();
          }
        });
      },
      fail: function (res) { }
    })
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
