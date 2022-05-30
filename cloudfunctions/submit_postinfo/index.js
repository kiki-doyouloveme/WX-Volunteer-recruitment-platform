// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    return await db.collection('Volunteer_Recruitment_Info').add({
        data:{
            time:db.serverDate(),
            sponsor: event.sponsor,
            subject:event.subject,
            location:event.location,
            startTime:event.startTime,
            endTime:event.endTime,
            startDate:event.startDate,
            endDate:event.endDate,
            discription:event.discription,
            requirement:event.requirement,
            phoneNumber:event.phoneNumber,
            email:event.email,
            img:event.img
        }
    })
}