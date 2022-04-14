const express = require('express');
const path = require('path');
const artTemplate = require('art-template');
const express_template = require('express-art-template');
const session = require('express-session')
// 导入路由中间件
const router = require('./router/router.js');
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// 托管静态资源
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
    name: 'sessionID',
    secret: "TRF$#%^&%^12",
    cookie: {
        path: "/",
        httpOnly: true,
        maxAge: 60000 * 40,
    }
}))
// 设置中间件,对session用户信息进行检查判断,后台页面路由都需要判断,后台页面之外的路由都要放行
app.use((req, res, next) => {
    let reqPath = req.path.toLowerCase();
    // 放行的权限
    const notAuth = ['/register', '/request', '/userlogin', '/userLogout'];
    if (notAuth.includes(reqPath)) {
        next();
    } else {
        // 不在就判断session,是登录状态,就有session信息
        if (req.session.userInfo) {
            // 有session
            next();
        } else {
            // 没有session或者session过期还有翻墙
            res.redirect('/register');
            return;
        }
    }
})
app.use(router)
app.listen(3000, () => {
    console.log('server is running at port 3306');
})   