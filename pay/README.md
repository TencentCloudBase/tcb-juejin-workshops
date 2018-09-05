## 支付组件结合模板消息实践

#### 目录结构说明

```
|- client 小程序客户端代码
    |- components
        |- pay 支付组件
    |- pages
        |-  queryorder   展示当前用户的所有订单信息
        |-  result       查询订单详细信息后的展示页
        |-  unifiedorder 发起统一下单信息页
    |- config
        |- 配置项
|- cloud 云端代码
    |- database 数据库
    |- functions 云函数代码
        |- pay   登录后调用的verifyIdentity并读取数据库的相应的用户信息
            |- lib          一些工具函数
                |- db.js    数据库初始化
                |- res.js   响应数据构造函数
                |- utils.js 支付用到的一些工具函数
                |- pay.js   初始化支付对象
            |- index.js 云函数入口
            |- config
                |- index.js   配置项
                |- example.js 配置样例项
            |- package.json   依赖项
        |- wxmessage   处理登录注册注销
            |- index.js 云函数入口
            |- config
                |- index.js   配置项
                |- example.js 配置样例项
            |- package.json   依赖项
```

#### 配置

- 云函数配置

根据config/example.js去配置/cloud/functions/*/config/index.js下的内容

- 客户端配置

根据client/config/example.js 去配置client/config/index.js，指定使用的云端环境

#### 注意问题

1、 wxpay.js默认初始化必需证书，没有证书会报错。本例中无需证书，解决办法，在wxpay.js模块下的index.js将证书判断项去除

2、 模板消息在小程序真机调试下才会真正发送模板消息

#### 效果图

![1](./img/1.png) ![2](./img/2.png) ![3](./img/3.png) ![4](./img/4.png)