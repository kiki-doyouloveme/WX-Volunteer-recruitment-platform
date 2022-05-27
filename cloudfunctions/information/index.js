// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const openid = cloud.getWXContext().OPENID
    const db = cloud.database();

    await db.collection("Account_Info").where({
        _id: openid
    }).update({
        data: {
            ['data.identity']: event.identity
        }
    })

    if (event.identity === "volunteer") {
        await db.collection("Volunteer_Info").add({
            data: {
                _id: openid,
                personalInfo: event.data,
                integral: 0,
                grade: 0
            }
        })
    } else if (event.identity === "community") {
        await db.collection("Community_Info").add({
            data: {
                _id: openid,
                communityInfo: event.data
            }
        })
    }
}