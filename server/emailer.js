const emailer = require('nodemailer')
const config=require('./config')

const transporter=emailer.createTransport({
    service:'gmail',
    auth:{
        user:config.email.user,
        pass:config.email.password
    }
})

async function sendEmail(email,subject,body,callback){
    const result= await transporter.sendMail({
                    to:email,
                    subject,
                    html:body,
                })
        console.log(result)
        callback()
}

// const otp=Math.floor((Math.random()*10000))
// sendEmail(`bhaveshaahire1609@gmail.com`,'sended Mail',
//     `<h1>${otp}</h1>`,()=>{
//     console.log("Email is sent")
// })

module.exports={sendEmail}