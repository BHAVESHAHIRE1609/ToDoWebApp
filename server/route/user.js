const express=require('express')

const db=require('../db')
const utils=require('../util')
const cryptojs=require('crypto-js')
const jwb=require('jsonwebtoken')
const config=require('../config')
const emailer=require('../emailer')
const route=express.Router()

route.post("/register",(req,res)=>{
    const {firstname,lastname,email,phone,password} = req.body;
   

    const statement=`insert into user(firstName,lastName,email,phone,password) values(?,?,?,?,?,)`

    const extractedpassword=String(cryptojs.MD5(password))
    db.pool.execute(statement,[firstname,lastname,email,phone,extractedpassword],(err,data)=>{
        if(!err){
            emailer.sendEmail(email,'Your Registration was Successfull',
                `<div>
                    <h3>Thank You For loging in Our To do App</h3>
                </div>`,()=>{res.send(utils.createResult(err,data))})
                //res.send(utils.createResult(err,data))
            
        }
        else{
                res.send(utils.createError(err))
        }
    })
})



route.post("/login",(req,res)=>{
    const {email,password}=req.body;
    const statement='select id,firstname,lastname,phone,IsActive  from user where email=? and password=?'
    const encryptedpassowrd=String(cryptojs.MD5(password))
    db.pool.query(statement,[email,encryptedpassowrd],(err,user)=>{
        if(err){
            res.send(utils.createError("Error Has Occured"))
        }
        else{
            if(user.length==0){
                res.send(utils.createError("User Does Not Exist"))
            }
            else{
                const {id,firstname,lastname,phone,IsActive} = user[0]
                if(IsActive)
                {
                const payload={id,firstname,lastname,phone}
                const token=jwb.sign(payload,config.secret)
                res.send(utils.createSuccess({token,firstname,lastname}))
                }
                else{
                     res.send(utils.createError('Your status is not Active'))
                }
            }
        }
        
    })
})

route.patch("/verify",(req,res)=>{
    const {email,otp}=req.body;
    const statement=`select id from user where email=? and verificationOTP=?`
    db.pool.query(statement,[email,otp],(err,user)=>{
        if(err){
            res.send(utils.createError(err))
        }
        else
        {
            if(user.length==0){
                req.send(utils.createError("User not found"))
            }
            else
            {
                const {id}=user[0]
                const statement=`update user set isActive=1 where id=?`
                db.pool.execute(statement,[id],(err,data)=>{
                    res.send(utils.createResult(err,data))
                })
            }
        }
    })
})

route.get("/",(req,res)=>{
    const statement=`select id,firstname,lastname,email,phone from user where id=?`

    db.pool.query(statement,[req.user['id']],(err,data)=>{
        if(err){
            res.send(utils.createError(err))
        }
        else{
            if(data.length==0){
                res.send(utils.createError('user Not Found'))
            }
            else{
                res.send(utils.createSuccess(data[0]))
            }
        }
    })
})

route.get("/all-User",(req,res)=>{
    const statement=`select id,firstname,lastname,email,phone,isActive from user`

    db.pool.query(statement,(err,users)=>{
        res.send(utils.createResult(err,users))
    })
})

route.post("/update-profile",(req,res)=>{
    const {firstname,lastname,email,phone}=req.body;
    const id=req.user['id']
    const statement=`Update user set firstname=?,lastname=?,email=?,phone=? where id=?`
    db.pool.execute(statement,[firstname,lastname,email,phone,id],(err,data)=>{
        res.send(utils.createResult(err,data))
    })
})

route.put("/update-password",(req,res)=>{
    const {password}=req.body;
    const Modifiedpassword=String(cryptojs.MD5(password))
    const id=req.user['id']
    const statement=`Update user set password=? where id=?`
    db.pool.execute(statement,[Modifiedpassword,id],(err,data)=>{
        res.send(utils.createResult(err,data))
    })
})

route.patch("/make-Inactivie/:id",(req,res)=>{
    const {id} =req.params;
    const statement=`update user set isActive=0 where id=?`
    db.pool.execute(statement,[id],(err,data)=>{
        res.send(utils.createResult(err,data))
    })
})

route.patch("/make-Active/:id",(req,res)=>{
    const {id}=req.params
    const statement=`update user set isActive=1 where id=?`
    db.pool.execute(statement,[id],(err,data)=>{
        res.send(utils.createResult(err,data))
    })
})
module.exports=route