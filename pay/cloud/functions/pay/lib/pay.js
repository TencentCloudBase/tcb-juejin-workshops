const {
  mpAppId,
  MCHID,
  KEY,
  TIMEOUT,
} = require('../config/index');
const {
  WXPayConstants,
  WXPay
} = require('wx-js-utils');

const wxpay = new WXPay({
  appId: mpAppId,
  mchId: MCHID,
  key: KEY,
  timeout: TIMEOUT,
  signType: WXPayConstants.SIGN_TYPE_MD5,
  useSandbox: false // 不使用沙箱环境
})

module.exports = wxpay