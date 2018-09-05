const crypto = require('crypto');
const {
  mpAppId,
  KEY,
  MCHID
} = require('../config/index');

/**
 * 加密字串
 * @param {String} str
 */
const signPay = function (str) {
  let md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex').toUpperCase();
  return str;
};

const signMiniPay = function(options) {
  let {
    mpAppId,
    KEY,
    nonce_str,
    time_stamp,
    prepay_id
  } = options;
  let str = `appId=${mpAppId}&nonceStr=${nonce_str}&package=prepay_id=${prepay_id}&signType=MD5&timeStamp=${time_stamp}&key=${KEY}`;

  return signPay(str);
};

module.exports = {
  signMiniPay
};
