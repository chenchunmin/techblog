const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    dest: './uploads/'
});
const Controller = require('../controller/controller.js');
// 主页面
router.get('/', Controller.index);
// 后台首页
router.get('/main', Controller.main);
// 分类列表
router.get('/catelist', Controller.catelist);
// 分类列表数据接口
router.get('/cateData', Controller.cateData);
// 编辑分类的接口          
router.post('/updCateData', Controller.updCateData);
// 删除
router.post('/delCateData', Controller.delCateData);
// 添加
router.post('/addcate', Controller.addcate);
// 标题页面
router.get('/headline', Controller.headline);
// 标题
router.post('/ensure', Controller.ensure);
// 注册页面
router.get('/register', Controller.register);
// 用户注册
router.post('/request', Controller.request);
// 用户登录
router.post('/userlogin', Controller.userlogin);
// 退出登录
router.post('/userLogout', Controller.userLogout);
// 文章列表页面
router.get('/articlelists', Controller.articlelists);
// 修改密码页面
router.get('/alter', Controller.alter);
// 修改密码
router.post('/amend', Controller.amend);
// 文章列表
router.get('/artData', Controller.artData);
// 添加文章页面
router.get('/addarticle', Controller.addarticle);
// 添加文章
router.post('/addArtData', upload.single('pic'), Controller.addArtData);
// 删除文章
router.post('/delArtData', Controller.delArtData);
// 更新用户信息
router.post('/updUserInfo', Controller.updUserInfo)
// 更新用户头像
router.post('/avatar', upload.single('file'), Controller.avatar)
module.exports = router;