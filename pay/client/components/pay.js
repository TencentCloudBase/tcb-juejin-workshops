const app = getApp()
const regeneratorRuntime  = require("../lib/runtime")
const show = message => {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}
Component({
  properties: {
    type: String, // unifiedorder orderquery closeorder 提供三种类型支付相关操作
    sendData: {
      type: Object,
      value: {}
    },
    text: {
      type: String,
      value: '提交'
    }
  },
  data: {},
  methods: {
    async requestFn () {
      const { type } = this.properties
      const { result } = await wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'pay',
        // 传递给云函数的参数
        data: {
          // 数据
          data: this.properties.sendData,
          // 支付的类型
          type
        }
      })
      const { code, data } = result
      if (code === 'SUCCESS' && data.result_code === 'SUCCESS') {
        // 分情况展示
        switch (type) {
          case 'unifiedorder':
            // data.prepay_id
            console.log(data);
            const { prepay_id } = data
            wx.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonce_str,
              package: `prepay_id=${prepay_id}`,
              signType: 'MD5',
              paySign: data.sign,
              async success (res) {
                show('下单成功')
                const {result} = await wx.cloud.callFunction({
                  name: 'pay',
                  data: {
                    type: 'payorder',
                    prepay_id
                  }
                })
                const {body,out_trade_no,total_fee} = result.data
               await wx.cloud.callFunction({
                  name: 'wxmessage',
                  data: {
                    formId: prepay_id,
                    data: {
                      keyword1: {
                        value:out_trade_no // 订单号
                      },
                      keyword2: {
                        value: body // 物品名称
                      },
                      keyword3: {
                        value: new Date().toLocaleTimeString() // 支付时间
                      },
                      keyword4: {
                        value: total_fee / 100 + "元" // 支付金额
                      }
                    }
                  }
                })
              },
              fail: function (res) {
                console.log(res)
              }
            })

            break
          case 'orderquery':
            show('查询成功')
            break
          case 'closeorder':
            show('关闭订单成功')
            wx.navigateBack()
            break
          default:
            show('客户端错误')
        }
      } else {
        show(data.err_code_des || data.return_msg)
      }
    }
  }
})
