var createOrderNumber = function () {
    var order = []
    for (var i = 0; i < 4; i++) {
      order = order.concat(Math.random().toString(36).slice(2).split(''))
    }
    return order.slice(0, 22).join('')
  }
  module.exports = {
    unifiedorder: {
      // 统一下单生成数据模板，实际使用根据场景
      out_trade_no: createOrderNumber(), // 商户订单号
      body: 'react开发者大会门票', // 商品描述
      detail: '2018年开发者大会尊贵票',
      total_fee: 1, // 标价金额
      spbill_create_ip: '127.0.0.1', // 终端IP
      notify_url: 'https://www.tencent.com', // 通知地址
      trade_type: 'JSAPI' // 交易类型
    }
  }
  