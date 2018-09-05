const app = require('tcb-admin-node');
const pay = require('./lib/pay');
const {
  mpAppId,
  KEY
} = require('./config/index');
const {
  WXPayConstants
} = require('wx-js-utils');
const Res = require('./lib/res');
const cryptoRandomString = require('crypto-random-string');
const {
  signMiniPay
} = require('./lib/utils');
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
    case 'unifiedorder':
      // 统一下单
      const { goodId } = data;

      let goods = await goodCollection.doc(goodId).get();
      
      if (!goods.data.length) {
        return new Res({
          code: 1,
          message: '找不到商品'
        });
      }

      let good = goods.data[0];

      const curTime = Date.now();
      const tradeNo = `${goodId}-${curTime}`;
      const body = good.name;
      const spbill_create_ip = ip.address() || '127.0.0.1';
      const notify_url = 'http://www.qq.com'; //'127.0.0.1';
      const total_fee = good.price;
      const time_stamp = '' + Math.ceil(Date.now() / 1000);
      const out_trade_no = `${tradeNo}`;
      const sign_type = WXPayConstants.SIGN_TYPE_MD5;
      
      let orderParam = {
        body,
        spbill_create_ip,
        notify_url,
        out_trade_no,
        total_fee,
        openid,
        trade_type: 'JSAPI',
        timeStamp: time_stamp,
      };

      const {
        return_code,
        ...restData 
      } = await pay.unifiedOrder(orderParam);

      let order_id = null;

      if (return_code === 'SUCCESS'
          && restData.result_code === 'SUCCESS') {
        const {
          prepay_id, 
          nonce_str
        } = restData;

        // 下面是进行微信小程序支付的
        const sign = signMiniPay({
          mpAppId,
          KEY,
          nonce_str,
          prepay_id,
          time_stamp
        });
        
        let orderData = {
          out_trade_no,
          time_stamp,
          nonce_str,
          sign,
          sign_type,
          body,
          total_fee,
          prepay_id,
          sign,
          status: 0, // 0表示刚创建订单
          _openid: openid,
        };

        let order = await orderCollection.add(orderData);

        order_id = order.id;
      }

      return new Res({
        code: return_code === 'SUCCESS' ? 0 : 1,
        data: { out_trade_no, time_stamp, order_id, ...restData }
      });
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
    case 'payorder': {
      const {
        out_trade_no,
        prepay_id,
        body,
        total_fee
      } = data;

      const { return_code, ...restData } = await pay.orderQuery({
        out_trade_no
      });

      if (restData.trade_state === 'SUCCESS') {
        let result = await orderCollection
          .where({ out_trade_no })
          .update({
            status: 1,
            trade_state: restData.trade_state,
            trade_state_desc: restData.trade_state_desc
          });

        console.log('======restData======');
        console.log(restData);
        
        let curDate = new Date();
        let time = `${curDate.getFullYear()}-${curDate.getMonth() +
          1}-${curDate.getDate()} ${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`;

        let messageResult = await app.callFunction({
          name: 'wxmessage',
          data: {
            formId: prepay_id,
            openId: userInfo.openId,
            appId: userInfo.appId,
            page: `/pages/result/index?id=${out_trade_no}`,
            data: {
              keyword1: {
                value: out_trade_no // 订单号
              },
              keyword2: {
                value: body // 物品名称
              },
              keyword3: {
                value: time// 支付时间
              },
              keyword4: {
                value: (total_fee / 100) + "元" // 支付金额
              }
            }
          }
        });
      }

      return new Res({
        code: return_code === 'SUCCESS' ? 0 : 1,
        data: restData
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
