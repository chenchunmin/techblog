const express = require('express');
const path = require('path');
// 导入路由中间件
const router = require('./router/router.js'); 
const app = express();
// 托管静态资源
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use(router)
app.listen(3000, () => { 
    console.log('server is running at port 3306');
})     