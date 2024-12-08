const express=require('express')
const utils=require('./util')
const jwb=require('jsonwebtoken')
const config=require('./config')
const cors=require('cors')

const app=express()

const userroute=require('./route/user')
const todoroute=require('./route/todo')
const adminroute=require('./route/admin')

app.use(cors())

app.use(express.json())

app.use((req,res,next)=>{
    if(req.url=='/user/register' || req.url=='/user/login' || req.url=='/user/verify' || req.url=='/admin'){
        next()
    }
    else{
        const {token}=req.headers
        if(!token){
            res.send(utils.createError("Missing Token"))
        }
        else{
            try{
                    const payload=jwb.verify(token,config.secret)
                    req.user=payload
                    next()
            }catch(ex){
                res.send(utils.createError("Invalid Token"))
            }
        }
    }
})
app.use('/user',userroute)
app.use('/todo',todoroute)
app.use('/admin',adminroute)


app.listen(4000,'0.0.0.0',()=>{
    console.log("serever is on")
})