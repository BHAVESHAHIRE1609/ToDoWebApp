const express=require('express')
const db=require('../db')
const utils=require('../util')
const jwb=require('jsonwebtoken')
const config=require('../config')

const route=express.Router()



route.post('/',(req,res)=>{
            const id=req.user['id']
            const {title,details}=req.body
            const statement=`insert into todoitem(title,details,userId) values(?,?,?)`
            db.pool.execute(statement,[title,details,id],(err,data)=>{
                res.send(utils.createResult(err,data))
            })
        
})

route.get('/public',(req,res)=>{
    const id=req.user['id']
    const statement=`select id from user where id=?`
    db.pool.query(statement,[id],(err,user)=>{
        if(err){
            res.send(utils.createError(err))
        }
        else
        {
            if(user.length==0)
            {
                res.send(utils.createError('User Not found'))
            }
            else{
                const statement=`select title,details,createdTimestamp from todoitem where isPublic=1`  
                db.pool.query(statement,(err,data)=>{
                    res.send(utils.createResult(err,data))
                }) 
            }
        }
    })
})

route.get('/my',(req,res)=>{
            const statement=`select id,title,details,createdTimestamp,isPublic from todoitem where userId=?`
            db.pool.query(statement,[req.user['id']],(err,items)=>{
                res.send(utils.createResult(err,items))
            })
})

route.get('/:id',(req,res)=>{
    const id=req.params['id']
    const statement=`select id,title,details,createdTimestamp,isPublic from todoitem where id=?`
    db.pool.query(statement,[id],(err,items)=>{
        res.send(utils.createResult(err,items[0]))
    })
})

route.patch('/make-public/:id',(req,res)=>{
    const {id}=req.params
    const statement=`update todoitem set isPublic=1 where id=? and userId=?`
    const userId=req.user['id']
    db.pool.execute(statement,[id,userId],(err,data)=>{
        res.send(utils.createResult(err,data))
    })

})

route.put('/update',(req,res)=>{
    const {id,title,details}=req.body
    const statement=`update todoitem set title=?,details=? where id=?`
    db.pool.execute(statement,[title,details,id],(err,data)=>{
        res.send(utils.createResult(err,data))
    })
})


route.delete('/:id',(req,res)=>{
    const {id}=req.params;
    const statement=`delete from todoitem where id=?`
    db.pool.execute(statement,[id],(err,data)=>{
        res.send(utils.createResult(err,data))
    })
})

route.patch('/make-private/:id',(req,res)=>{
    const {id}=req.params
    const statement=`update todoitem set isPublic=0 where id=? and userId=?`
    const userId=req.user['id']
    db.pool.execute(statement,[id,userId],(err,data)=>{
        res.send(utils.createResult(err,data))
    })
})
route.delete('/',(req,res)=>{
    const {id}=req.user
    const statement=`Delete from todoitem where useriId=?`
    db.pool.execute(statement,id,(err,data)=>{
        res.send(utils.createResult(err,data))
    })
})


module.exports=route