// pages/login/login.js
Page({
    /**
     * 页面的初始数据
     */
    data: {},
    /** 
     * 登录按钮触发的事件
     */
    login() {
        let that = this
        //调用微信小程序的获取用户信息的接口
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途
            lang: 'zh_CN',
            success(info) {
                console.log(info)
                // 云登录
                wx.cloud.callFunction({
                    name: 'login',
                    data: {
                        nickName: info.userInfo.nickName,
                        avatarUrl: info.userInfo.avatarUrl
                    },
                    success : res => {
                        // 将用户信息存储到本地缓存中
                        wx.setStorage({
                            key : "accountInfo",
                            data : res.result
                        })
                        that.navigateToHost()
                    }
                })
            },
            fail(e) {
                console.log('获取用户信息失败', e)
            }
        })
    },

    navigateToHost(){
        wx.navigateTo({
          url: '/pages/index/index',
        })
      },
})