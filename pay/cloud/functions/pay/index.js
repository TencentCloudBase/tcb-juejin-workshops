const app = require('tcb-admin-node');
const pay = require('./lib/pay');
const {
  mpAppId,
  KEY
} = require('./config/index');
const {
  WXPayConstants,
  WXPayUtil
} = require('wx-js-utils');
const Res = require('./lib/res');
const ip = require('ip');

/**
 *
 * @param {obj} event
 * @param {string} event.type 功能类型
 * @param {} userInfo.openId 用户的openid
 */
exports.main = async function (event) {
  const { type, data, userInfo } = event;
  const openid = userInfo.openId;

  app.init();
  const db = app.database();
  const goodCollection = db.collection('goods');
  const orderCollection = db.collection('order');

  // 订单文档的status 0 未支付 1 已支付 2 已关闭
  switch (type) {
    // [在此处放置 unifiedorder 的相关代码]

    // [在此处放置 payorder 的相关代码]

    case 'orderquery': {
      const { transaction_id, out_trade_no } = data;
      // 查询订单

      const { data: dbData } = await orderCollection
        .where({ out_trade_no })
        .get();

      const { return_code, ...restData } = await pay.orderQuery({
        transaction_id,
        out_trade_no
      });

      return new Res({
        code: return_code === 'SUCCESS' ? 0 : 1,
        data: { ...restData, ...dbData[0] }
      });
    }

    case 'closeorder': {
      // 关闭订单
      const { out_trade_no } = data;
      const { return_code, ...restData } = await pay.closeOrder({
        out_trade_no
      });
      if (return_code === 'SUCCESS'
        && restData.result_code === 'SUCCESS') {
        await orderCollection
          .where({ out_trade_no })
          .update({ 
            status: 2,
            trade_state: 'CLOSED',
            trade_state_desc: '订单已关闭'
          });
      }

      return new Res({
        code: return_code === 'SUCCESS' ? 0 : 1,
        data: restData
      });
    }
  }
}
