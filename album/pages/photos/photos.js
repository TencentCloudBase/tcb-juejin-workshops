// pages/photos/photos.js
const regeneratorRuntime = require('../common/regenerator-runtime.js')
const app= getApp()

Page({

    // 相册 ID
    albumId: undefined,

    // 页面的初始数据
    data: {
        albumIndex: '',
        photos: []
    },

    onLoad (options) {
        this.albumId = options.id
    },

    onShow () {
        this.getPhotos()
    },

    // 获取相册中的数据
    async getPhotos () {
        // 初始化数据库
        const db = wx.cloud.database({})
        const userinfo = await db.collection('user').doc(app.globalData.id).get()
        const albums = userinfo.data.albums
        const photos = albums[this.albumId].photos

        // 设置全局变量
        app.globalData.allData.albums[this.albumId].photos = photos

        this.setData({
            albumIndex: this.albumId,
            photos
        })
    },

    // 预览图片
    async previewImage (e) {
        const currentIndex = e.currentTarget.dataset.index
        const photos = this.data.photos.map(photo => photo.fileID)
        const realUrlsRes = await wx.cloud.getTempFileURL({ fileList: photos })
        const realUrls = realUrlsRes.fileList.map(file => file.tempFileURL)
        const currentUrl = realUrls[currentIndex]

        wx.previewImage({
            current: currentUrl,
            urls: realUrls
        })
    }
})
