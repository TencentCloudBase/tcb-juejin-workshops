//index.js
//获取应用实例
const app = getApp();
const mapping = require('../common/reversemapping.js');

Page({
  data: {
    cover: '',
    title: '',
    content: '',
  },

  onLoad: function () {
    this.getNameCardDetail();
  },

  /**
   * 获取名片详情
   */
  getNameCardDetail() {
    // 初始化db
    const db = wx.cloud.database({});
    let ncId = app.globalData.namecard.id;
    db.collection('namecard').doc(ncId).get().then(res => {
      console.log('db读取成功', res.data);
      let data = res.data;

      let namecard = [];
      Object.keys(data).forEach((item) => {
        if (item === 'cover' || item === '_id' 
            || item === '_openid') {
          return;
        }
        namecard.push({
          name: mapping[item],
          value: data[item]
        });
      });

      this.setData({
        cover: data.cover,
        namecard: namecard
      });
    })
    .catch(e => {
      wx.showToast({
        title: 'db读取失败',
        icon: 'none'
      });
    });
  },

  /**   
   * 预览图片  
   */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [this.data.cover] // 需要预览的图片http链接列表  
    });
  } 
})
