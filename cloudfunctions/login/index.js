// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    const db = cloud.database()

    // 在数据库中寻找该微信账户是否已经注册过
    var account = await db.collection("Account_Info").where({
        _id : openid
    }).get()

    // 还未注册，向数据库中添加账户信息
    if (account.data.length === 0) {
        var data = {
            nickName : event.loginInfo.nickName,
            avatarUrl : event.loginInfo.avatarUrl,
            identity : 'newAccount'
        }
        await db.collection("Account_Info").add({
            data: {
                _id: openid,
                data: data
            }
        })
        return data
    } else {
        // 向页面返回用户信息
        return {
            openid : openid,
            nickName : account.data[0].data.nickName,
            avatarUrl : account.data[0].data.avatarUrl,
            identity : account.data[0].data.identity
        }
    }
}