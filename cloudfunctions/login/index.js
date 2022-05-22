// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    const db = cloud.database()

    // 在数据库中寻找该微信账户是否已经注册过
    let res = await db.collection("Account_Info").where({
        nickName: event.nickName,
    }).get()

    // 还未注册，向数据库中添加账户信息
    if (res.data.length === 0) {
        await db.collection("Account_Info").add({
            data: {
                openid: openid,
                nickName: event.nickName,
                avatarUrl: event.avatarUrl
            }
        })
    }

    // 向页面返回用户信息
    var accountInfo = {
        openid: openid,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl
    }
    return accountInfo
}