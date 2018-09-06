const { ImageClient } = require('image-node-sdk');
const {
  AppId,
  SecretId,
  SecretKey
} = require('./config/index.js');

const imgClient = new ImageClient({
  AppId,
  SecretId,
  SecretKey,
});

exports.main = async (event) => {
  const idCardImageUrl = event.url;
  const result = await imgClient.ocrBizCard({
    data: {
      url_list: [idCardImageUrl],
    },
  });
  console.log(result.body);

  let body = JSON.parse(result.body);
  return body.result_list ? body.result_list[0] : { code: 1 };
};