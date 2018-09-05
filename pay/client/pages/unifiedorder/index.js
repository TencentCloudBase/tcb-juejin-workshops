const { unifiedorder } = require('./template.js')
Page({
  data: {
    unifiedorder: {}
  },
  onLoad () {
    this.setData({
      unifiedorder
    })
  },
  bindinput (e) {
    const unifiedorder = this.data.unifiedorder
    this.setData({
      unifiedorder: Object.assign({}, unifiedorder, {
        [e.target.dataset.name]: e.detail.value
      })
    })
  }
})
