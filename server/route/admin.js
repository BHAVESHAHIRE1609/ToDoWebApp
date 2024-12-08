const express=require('express')
const cryptojs=require('crypto-js')
const route=express.Router()
const db=require('../db')
const jwt=require('jsonwebtoken')
const utils = require('../util')
const config = require('../config')


route.post('/',(req,res)=>{
    const {email,password}=req.body
    const statement=`select id,firstName,lastname,email,phone,isAdmin from user where isAdmin=? and email =? and password=?`
    const encryptedpass=String (cryptojs.MD5(password))
    db.pool.query(statement,[1,email,encryptedpass],(err,admin)=>{
        if(err){
            res.send((utils.createError(err)))
        }
        else{
            if(admin.length==0){
                res.send((utils.createError('User Not Found')))
            }
            else{
                const {id,firstName,lastname,email,phone,isAdmin} = admin[0]
                const payload={id,firstName,lastname,email,phone,isAdmin}
                const token= jwt.sign(payload,config.secret)
                res.send(utils.createSuccess(token))
            }
        }
    })
})



module.exports=route