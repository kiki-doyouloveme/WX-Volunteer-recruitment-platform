// pages/community/create/create.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sponsor: '',
        subject:'',
        location:'',
        startTime:'',
        endTime:'',
        startDate:'',
        endDate:'',
        discription:'',
        requirement:'',
        phoneNumber:'',
        email:'',
        // show: false,
        // currentDate: '12:00',
        // minHour: 0,
        // maxHour: 23,
        
        // minDate: new Date().getTime(),
        // formatter(type, value) {
        //   if (type === 'year') {
        //     return `${value}年`;
        //   }
        //   if (type === 'month') {
        //     return `${value}月`;
        //   }
        //   return value;
        // },
        img:[],
        ifimg:"添加海报"
    },
    //提交数据
    async submit_postInfo(){
        let that=this
        let img=that.data.img
        let timestamp=new Date().getTime()
        wx.showLoading({
          title: '上传中',
        })
        await wx.cloud.uploadFile({
            cloudPath: 'post_img/'+timestamp+'.png',
            filePath: img[0], // 文件路径
          }).then(async res => {
            // get resource ID
            console.log("res.fileid:",res.fileID)
            img[0]=res.fileID
            let img_detail=img[0]
            wx.cloud.callFunction({
                name:"submit_postinfo",
                data:{
                    sponsor: that.data.sponsor,
                    subject:that.data.subject,
                    poster:that.data.poster,
                    location:that.data.location,
                    startTime:that.data.startTime,
                    endTime:that.data.endTime,
                    startDate:that.data.startDate,
                    endDate:that.data.endDate,
                    discription:that.data.discription,
                    requirement:that.data.requirement,
                    phoneNumber:that.data.phoneNumber,
                    email:that.data.email,
                    img:img_detail
                }
            }).then(res=>{
                wx.hideLoading()
                console.log("res:",res)
                console.log("data:",this.data)
            }).catch(e=>{
                console.log(e)
                console.log("上传失败")
            })
          }).catch(error => {
            // handle error
            console.log(error)
            wx.hideLoading()
          })
    },
    //添加海报
    add_img(){
        let that=this
        let img=that.data.img
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success (res) {
              // tempFilePath可以作为 img 标签的 src 属性显示图片
              const tempFilePaths = res.tempFilePaths
              img=tempFilePaths
              if(img!="")
              {
                  that.setData({ifimg:"切换海报"})
              }
              that.setData({
                  img:img
              })
            }
          })
    },
    //删除海报
    delete_img(e){
        let that=this
        let img=that.data.img
        wx.showModal({
            title: '提示',
            content: '确定要删除此图片吗？',
            success: function (res) {
              if (res.confirm) {
                console.log('点击确定了');
              } else if (res.cancel) {
                console.log('点击取消了');
                return false;
              }
              that.setData({
                img:"",
                ifimg:"添加海报"
              });
            }
          })
    },
    //返回主页面
    onClickLeft(){
        var toUrl = ''
        toUrl = '/pages/community/home/home'
        wx.redirectTo({
          url: toUrl,
        })
    },
      showPopup() {
        this.setData({ show: true });
      },
      onClose() {
        this.setData({ show: false });
        console.log(this.data.currentDate)
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

    }
})