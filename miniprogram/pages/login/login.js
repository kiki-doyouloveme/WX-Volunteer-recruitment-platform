// pages/login/login.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loginInfo: {
            code: '',
            nickName: '',
            avatarUrl: ''
        }
    },
    /** 
     * 登录按钮触发的事件
     */
    login() {
        let that = this
        //调用微信小程序的获取用户信息的接口
        wx.login({
            success: res => {
                //拿到的code存储在data中
                that.data.loginInfo.code = res.code
                console.log(res.code)
                wx.showModal({
                    title: '温馨提示',
                    content: '授权登录后才能正常使用小程序功能',
                    cancelText: '拒绝',
                    confirmText: '同意',
                    success(sucessInfo) {
                        //调用微信小程序的获取用户信息的接口
                        wx.getUserProfile({
                            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途
                            lang: 'zh_CN',
                            success(info) {
                                console.log("info:",info)
                                that.data.loginInfo.nickName = info.userInfo.nickName
                                that.data.loginInfo.avatarUrl = info.userInfo.avatarUrl
                                // 显示一个图标
                                wx.showToast({
                                    title: '登录中',
                                    icon: 'loading'
                                })
                                // 调用云函数登录
                                wx.cloud.callFunction({
                                    name: 'login',
                                    data: {
                                        loginInfo: that.data.loginInfo
                                    },
                                    success: res => {
                                        // 将用户信息存储到本地缓存中
                                        wx.setStorage({
                                            key: "accountInfo",
                                            data: res.result
                                        })
                                        that.navigateToHost(res.result.identity)
                                    }
                                })
                            },
                            fail(e) {
                                console.log('获取用户信息失败', e)
                            }
                        })
                    },
                    fail() {},
                    complete() {}
                })
            },
            fail: err => {
                console.log('fail', e)
                wx.showToast({
                    title: '网络异常',
                    duration: 2000
                })
                return
            }
        })
    },

    navigateToHost(identity) {
        console.log(identity)
        var toUrl = ''
        if (identity === 'volunteer') {
            toUrl = '/pages/volunteer/home/home'
        } else if (identity === 'community') {
            toUrl = '/pages/community/home/home'
        } else {
            toUrl = '/pages/newAccount/newAccount'
        }
        wx.redirectTo({
          url: toUrl
        })
    },

})