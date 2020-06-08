const userInfoDao = require('../dao/user_info')

let returnObj = {
    userReg: async (ctx) => {
        await userInfoDao.userReg(ctx)
    },
    checkUser: async (ctx) => {
        await userInfoDao.checkUser(ctx)
    },
    userLogin: async (ctx) => {
        await userInfoDao.userLogin(ctx)
    },
    checkLogin: async (ctx) => {
        consola.info('检测用户登录状态')
        if(ctx.session.user) {
            ctx.body = {
                code: 0,
                is_login: true
            }
        } else {
            ctx.body = {
                code: 0,
                is_login: false
            }
        }
    }
}

module.exports = returnObj