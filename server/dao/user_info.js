const mysql = require('mysql')
const config = require('../config.json')
const consola = require('consola')
const $sql = require('./sql')
const pool = mysql.createPool({
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password,
    database: config.mysqlConfig.database
})

// 接收一个sql语句 以及所需的values
// 这里接收第二参数values的原因是可以使用mysql的占位符 '?'
// 比如 query(`select * from my_database where id = ?`, [1])

let query = function( sql, values ) {
    // 返回一个 Promise
    return new Promise(( resolve, reject ) => {
      pool.getConnection(function(err, connection) {
        if (err) {
          reject( err )
        } else {
          connection.query(sql, values, ( err, rows) => {
  
            if ( err ) {
              reject( err )
            } else {
              resolve( rows )
            }
            // 结束会话
            connection.release()
          })
        }
      })
    })
  }

let returnObj = {
    checkUser: async (ctx) => {

        consola.info('检测用户名是否存在')
        let data = ctx.request.body
        let row = await query($sql.checkUser(data))
        if(!row.length) {
           ctx.body = {
               code: 0
           }
        } else {
            ctx.body = {
                code: 1,
                msg: 'User Exist'
            }
        }
    },
    userReg: async (ctx) => {
        consola.info('用户出册')
        let data = ctx.request.body
        let row = await query($sql.userReg(data))
        if(row) {
            ctx.body = {
                code: 0
            }
        }
    },
    userLogin: async (ctx) => {
        consola.ready('用户登录')
        let data = ctx.request.body
        // 判断用户名是否存在
        let checkUsername = await query($sql.checkUser(data))
        if(!checkUsername.length) {
            ctx.body = {
                code: 2,
                msg: '用户名不存在'
            }
        } else {
            // 判断密码是否正确
            if(checkUsername[0].password === ctx.request.body.body.password) {
                ctx.body = {
                    code: 0
                }
            } else {
                ctx.body = {
                    code: 3,
                    msg: '用户名或密码错误'
                }
            }
        }
    }
}

module.exports = returnObj