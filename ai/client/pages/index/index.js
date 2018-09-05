//获取应用实例
const app = getApp();
const mapping = require('../common/mapping.js');

Page({
  data: {
    hasUserInfo: false,
    fileID: null,
    coverImage: '',
    formData: []
  },

  /**
   * 上传文件
   */
  uploadFile: function () {
    
  },

  /**
   * 获取图片链接
   */
  getTempFileURL: function () {
    
  },

  /**
   * 调用接口解析名片
   */
  parseNameCard() {
    wx.showLoading({
      title: '解析名片',
    });
    wx.cloud.callFunction({
      name: 'parseNameCard',
      data: {
        url: this.data.coverImage
      }
    }).then(res => {
      // console.log(res);
      if (res.code && res.result && res.result.data) {
        wx.showToast({
          title: '解析失败，请重试',
          icon: 'none'
        });
        wx.hideLoading();
        return;
      }
      
      let data = this.transformMapping(res.result.data);
      console.log(data);
      this.setData({
        formData: data
      });

      wx.hideLoading();
    }).catch(err => {
      console.error('解析失败，请重试。', err);
      wx.showToast({
        title: '解析失败，请重试',
        icon: 'none'
      });
      wx.hideLoading();
    });
  },

  transformMapping(data) {
    let record = {};
    let returnData = [];

    data.map((item) => {
      let name = null;
      if (mapping.hasOwnProperty(item.item)) {
        name = mapping[item.item];
        item.name = name;
      }

      return item;
    });

    data.forEach((item) => {
      if (!record.hasOwnProperty(item.item)) {
        returnData.push(item);
        record[item.item] = true;
      }
    });

    return returnData;
  },

  /**
   * 上传名片
   */
  addNameCard: function (e) {
    const data = this.data
    const formData = e.detail.value;
    console.log(formData);

    wx.showLoading({
      title: '添加中'
    });

    formData.cover = this.data.fileID;

    const db = wx.cloud.database();
    db.collection('namecard').add({
      data: formData
    }).then((res) => {
      console.log(res);
      wx.hideLoading();

      app.globalData.namecard.id = res._id;

      wx.navigateTo({
        url: '../detail/index'
      });

      // 重置数据
      this.setData({
        coverImage: null,
        fileID: null,
        formData: []
      });
      
    }).catch((e) => {
      wx.hideLoading();
      wx.showToast({
        title: '添加失败，请重试',
        icon: 'none'
      });
    });
  }
})
