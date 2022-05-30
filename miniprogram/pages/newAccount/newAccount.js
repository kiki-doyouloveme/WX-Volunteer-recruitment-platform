// pages/newAccount/newAccount.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        items: [{
                value: 'volunteer',
                name: '我是志愿者'
            },
            {
                value: 'community',
                name: '我是乡村社区'
            },
        ],
        sex: [{
                value: '男',
                name: '我是男生',
                checked: true
            },
            {
                value: '女',
                name: '我是女生'
            },
        ],
        identity: '',
        volunteer: {
            name: '',
            age: '',
            sex: '男',
            phoneNumber: ''
        },
        canVolunteerSubmit: {
            name: false,
            age: false,
            phoneNumber: false
        },
        community: {
            name: '',
            contact: '',
            phoneNumber: '',
            authentication: ''
        },
        canCommunitySubmit: {
            name: false,
            contact: false,
            phoneNumber: false,
            authentication: false
        },
        fileName: '',
        filePath: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        if (wx.canIUse('hideHomeButton')) {
            wx.hideHomeButton()
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    radioChange(e) {
        let that = this
        const items = that.data.items
        // 获取身份选项
        for (let i = 0, len = items.length; i < len; ++i) {
            items[i].checked = items[i].value === e.detail.value
        }
        that.setData({
            items
        })
        that.setData({
            identity: e.detail.value
        })
        console.log(that.data.identity === "volunteer")
    },

    sexChange(e) {
        let that = this
        const items = that.data.items
        // 获取身份选项
        for (let i = 0, len = items.length; i < len; ++i) {
            items[i].checked = items[i].value === e.detail.value
        }
        that.setData({
            items
        })
        that.setData({
            ['volunteer.sex']: e.detail.value
        })
    },

    inputVolunteerName(e) {
        let that = this
        let name = e.detail.value
        if (name === "") {
            wx.showToast({
                title: '请输入姓名',
                duration: 2000,
                icon: 'none'
            })
        } else {
            that.setData({
                ['volunteer.name']: name
            })
            that.data.canVolunteerSubmit.name = true
        }
    },

    inputVolunteerAge(e) {
        let that = this
        let age = e.detail.value
        if (age === "") {
            wx.showToast({
                title: '请输入年龄',
                duration: 2000,
                icon: 'none'
            })
        } else {
            that.setData({
                ['volunteer.age']: age
            })
            that.data.canVolunteerSubmit.age = true
        }
    },

    inputVolunteerPhoneNumber(e) {
        let that = this
        let phoneNumber = e.detail.value
        if (!(/^1[345789]\d{9}$/.test(phoneNumber))) {
            wx.showToast({
                title: '手机号码有误',
                duration: 2000,
                icon: 'none'
            })
            return false
        } else {
            that.setData({
                ['volunteer.phoneNumber']: phoneNumber
            })
            that.data.canVolunteerSubmit.phoneNumber = true
        }
    },

    volunteerCommit() {
        let that = this
        let canVolunteerSubmit = that.data.canVolunteerSubmit
        if (! (canVolunteerSubmit.name && canVolunteerSubmit.age && canVolunteerSubmit.phoneNumber)) {
            wx.showToast({
                title: '请确认输入无误后再提交',
                duration: 2000,
                icon: 'none'
            })
        } else {
            wx.showModal({
                title: '确认要提交信息吗',
                cancelText: '取消',
                confirmText: '确认',
                success: res => {
                    wx.cloud.callFunction({
                        name: 'information',
                        data: {
                            identity: that.data.identity,
                            data: that.data.volunteer
                        },
                        success: res => {
                            wx.redirectTo({
                                url: '/pages/volunteer/home/home',
                            })
                        }
                    })
                }
            })
        }
    },

    inputCommunityName(e) {
        let that = this
        let name = e.detail.value
        if (name === "") {
            wx.showToast({
                title: '请输入社区名',
                duration: 2000,
                icon: 'none'
            })
        } else {
            that.setData({
                ['community.name']: name
            })
            that.data.canCommunitySubmit.name = true
        }
    },

    inputCommunityContact(e) {
        let that = this
        let contact = e.detail.value
        if (contact === "") {
            wx.showToast({
                title: '请输入社区联系人姓名',
                duration: 2000,
                icon: 'none'
            })
        } else {
            that.setData({
                ['community.contact']: contact
            })
            that.data.canCommunitySubmit.contact = true
        }
    },

    inputCommunityPhoneNumber(e) {
        let that = this
        let phoneNumber = e.detail.value
        if (!(/^1[345789]\d{9}$/.test(phoneNumber))) {
            wx.showToast({
                title: '手机号码有误',
                duration: 2000,
                icon: 'none'
            })
            return false
        } else {
            that.setData({
                ['community.phoneNumber']: phoneNumber
            })
            that.data.canCommunitySubmit.phoneNumber = true
        }
    },

    async chooseFile() {
        let that = this
        let res = await wx.chooseMessageFile({
            count: 1,
            type: 'file',
        })
        let accountInfo = await wx.getStorage({
            key: "accountInfo",
        })
        console.log(accountInfo)
        let fileInfo = await wx.cloud.uploadFile({
            cloudPath: accountInfo.data.openid + "/" + res.tempFiles[0].name,
            filePath: res.tempFiles[0].path
        })
        that.data.community.authentication = fileInfo.fileID
        that.data.canCommunitySubmit.authentication = true
        that.setData({
            fileName: res.tempFiles[0].name,
            filePath: res.tempFiles[0].path
        })
        wx.showToast({
            title: '上传成功',
            type: 'success'
        })
        console.log(that.data.community.authentication)
    },

    communityCommit() {
        let that = this
        let canCommunitySubmit = that.data.canCommunitySubmit
        if (! (canCommunitySubmit.name && canCommunitySubmit.phoneNumber && canCommunitySubmit.contact && canCommunitySubmit.authentication)) {
            wx.showToast({
                title: '请确认输入无误后再提交',
                duration: 2000,
                icon: 'none'
            })
        } else {
            wx.showModal({
                title: '确认要提交信息吗',
                cancelText: '取消',
                confirmText: '确认',
                success: res => {
                    wx.cloud.callFunction({
                        name: 'information',
                        data: {
                            identity: that.data.identity,
                            data: that.data.community
                        },
                        success: res => {
                            wx.redirectTo({
                                url: '/pages/community/home/home',
                            })
                        }
                    })
                }
            })
        }
    }
})