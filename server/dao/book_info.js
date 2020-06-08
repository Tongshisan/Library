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

let query = function (sql, values) {
    // 返回一个 Promise
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}

let returnObj = {
    getBookCategoryAndCount: async (ctx) => {

        consola.info('检测用户名是否存在')
        let data = ctx.request.body
        let row = await query($sql.getBookCategoryAndCount(data))
        ctx.body = {
            code: 0,
            body: {
                data: row
            }
        }
    },
}

module.exports = returnObj