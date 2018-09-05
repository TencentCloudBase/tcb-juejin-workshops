const {
  WXMINIUser,
  WXMINIMessage,
} = require('wx-js-utils');

module.exports = async function ({
  appId,
  secret,
  templateId,
  code,
  formId,
  data,
  page,
  openId
}) {

  const wxMiniUser = new WXMINIUser({ appId, secret });
  const access_token = await wxMiniUser.getAccessToken();

  // 在小程序云开发的云函数中，可以不用传小程序的登陆 code
  if (!openId) {
    const { openId } = await wxMiniUser.codeToSession(code);
  }

  const wxMiniMessage = new WXMINIMessage({ openId, formId, templateId });

  return wxMiniMessage.sendMessage({
    access_token,
    data,
    page
  });
};