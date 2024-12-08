const mysql=require('mysql2')

const pool=mysql.createPool({
    hostname:'localhost',
    port:3306,
    user:'D1_86836_Bhavesh',
    password:'manager',
    database:'Todo_db',

})

module.exports={pool}