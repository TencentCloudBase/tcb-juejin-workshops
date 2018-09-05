const fs = require('fs');

module.exports = {
  mpAppId: 'xxxxxxxx', // 小程序appid
  envName: 'xxxxxx-xxxxxx', // TCB环境ID
  MCHID: 'xxxxxxxxx',//商户id
  KEY: 'xxxxxx',
  //   CERT_FILE_CONTENT: fs.readFileSync('/path/to/apiclient_cert.p12'),
  //   CA_FILE_CONTENT: fs.readFileSync('/path/to/rootca.pem'),
  TIMEOUT: 10000 // 毫秒
};