// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    const db = cloud.database()

    // 在数据库中寻找该微信账户是否已经注册过
    var account = await db.collection("Account_Info").where({
        openid : openid
    }).get()

    // 还未注册，向数据库中添加账户信息
    if (account.data.length === 0) {
        var data = {
            openid : openid,
                nickName : event.loginInfo.nickName,
                avatarUrl : event.loginInfo.avatarUrl,
                identity : 'newAccount'
        }
        await db.collection("Account_Info").add({
            data: data
        })
        return data
    } else {
        // 向页面返回用户信息
        return {
            openid : account.data[0].openid,
            nickName : account.data[0].nickName,
            avatarUrl : account.data[0].avatarUrl,
            identity : account.data[0].identity
        }
    }
}