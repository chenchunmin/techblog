const path = require('path');
const fs = require('fs');
const moment = require('moment');
const { promisify } = require('util');
const Controller = {};
const md5 = require('md5');
const minte = moment().format('YYYY-MM-DD-HH:mm:ss');
const viewsDir = path.join(path.dirname(__dirname), 'views');
const query = require('../model/query.js');
let { password_secret } = require('../config/config.js');
const rename = promisify(fs.rename);
Controller.index = (req, res) => {
    res.sendFile(`${viewsDir}/index.html`)
}
Controller.addarticle = (req, res) => {
    res.sendFile(`${viewsDir}/addarticle.html`)
}
Controller.addArtData = async (req, res) => {
    const { title, cate_id, status, content } = req.body;
    const add_date = moment().format('YYYY-MM-DD HH:mm:ss')
    const author = req.session.userInfo.id;
    let pic = '';
    // 上传文件得到路径
    if (req.file) {
        let { originalname, filename } = req.file;
        let extName = originalname.substring(originalname.lastIndexOf('.'))
        let uploadDir = './uploads'
        let oldName = path.join(uploadDir, filename);
        let newName = path.join(uploadDir, filename) + extName;
        try {
            const result = await rename(oldName, newName)
            pic = `uploads/${filename}${extName}`
        } catch (err) {
            console.log(err)
        }
    }
    let sql = `insert into article(title,cate_id,status,content,add_date,author,pic) 
            values('${title}','${cate_id}','${status}','${content}','${add_date}','${author}','${pic}')`
    const {
        affectedRows
    } = await query(sql)
    if (affectedRows > 0) {
        res.json({
            code: 0,
            message: '添加文章成功'
        })
    } else {
        res.json({
            code: -7,
            message: '添加文章失败'
        })
    }
}
Controller.register = (req, res) => {
    res.sendFile(`${viewsDir}/register.html`)
}
Controller.request = async (req, res) => {
    // console.log(req.body);
    let { username, email, password } = req.body;
    password = md5(`${password}${password_secret}`)
    const sq = `SELECT * FROM users WHERE username ='${username}'`
    const user = await query(sq)
    if (user.length > 0) {
        return res.json({
            code: 1000,
            message: '用户已被占用'
        })
    }
    // console.log(user);
    const sql = `insert into users (username, email, password,date_time) values ('${username}','${email}','${password}','${minte}')`;
    await query(sql).then(data => {
        return res.json({
            code: 2000,
            message: '注册成功'
        })
    }).catch(err => {
        return res.json({
            code: 2001,
            message: '注册失败'
        })
    })
}
Controller.userlogin = async (req, res) => {
    // console.log(req.body);
    let { name, pwd } = req.body;
    pwd = md5(`${pwd}${password_secret}`)
    const sql = `select * from users where username = '${name}' and password = '${pwd}'`
    const result = await query(sql)
    if (result.length > 0) {
        req.session.userInfo = result[0];
        res.cookie('userInfo', JSON.stringify(result[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        res.json({
            code: 0,
            message: "登录成功"
        })
    } else {
        res.json({
            code: 1,
            message: "请输入正确的用户名和密码"
        })
    }
}
Controller.amend = async (req, res) => {
    let { original, password, repassword } = req.body;
    let id = req.session.userInfo.user_id
    original = md5(`${original}${password_secret}`)
    const sql = `select * from users where password = '${original}'`
    const result = await query(sql);
    if (result.length > 0) {
        req.session.userInfo = result[0];
        res.cookie('userInfo', JSON.stringify(result[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
    } else {
        res.json({
            code: 1,
            message: "原密码错误"
        })
    }
    password = md5(`${password}${password_secret}`)
    const sq = `update users set password= '${password}' where user_id = ${id}`;
    const { affectedRows } = await query(sq)
    if (affectedRows > 0) {
        return res.json({
            code: 0,
            message: '修改成功'
        })
    } else {
        return res.json({
            code: 2,
            message: '修改失败'
        })
    }
}
Controller.userLogout = async (req, res) => {
    // 清除session
    req.session.destroy(function (err) {
        if (err) {
            throw err;
        }
    })
    res.json({
        code: 0,
        message: "退出登录"
    })
}
Controller.main = (req, res) => {
    res.sendFile(`${viewsDir}/lyear_main.html`)
}
Controller.catelist = (req, res) => {
    res.sendFile(`${viewsDir}/catelist.html`)
}
Controller.articlelists = (req, res) => {
    res.sendFile(`${viewsDir}/articlelists.html`)
}
Controller.headline = (req, res) => {
    res.sendFile(`${viewsDir}/headline.html`)
}
Controller.ensure = async (req, res) => {
    console.log(req.body);
    let { title } = req.body;
    const sql = `insert into headline (title) values ('${title}')`;
    await query(sql).then(data => {
        return res.json({
            errcode: 10000,
            message: '标题设置成功',
        })
    })
}
Controller.cateData = async (req, res) => {
    // sql查询数据
    const sql = 'select * from category where isdel = 0 ';
    const data = await query(sql)
    // 返回json数据给前端
    const responseData = {
        data,
        code: 0,
        msg: "success"
    }
    res.json(responseData)
}
Controller.updCateData = async (req, res) => {
    // 接收post参数
    const {
        cate_id,
        cate_name,
        orderBy
    } = req.body;
    // 编写sql语句，执行，返回json结果
    const sql = `update category set cate_name = '${cate_name}',orderBy = '${orderBy}' where cate_id = ${cate_id}`;
    const {
        affectedRows
    } = await query(sql)
    if (affectedRows > 0) {
        return res.json({
            code: 0,
            message: '编辑成功'
        })
    } else {
        return res.json({
            code: 1,
            message: '编辑失败'
        })
    }
}
Controller.delCateData = async (req, res) => {
    let { cate_id } = req.body;
    const sql = `update category set isdel =1 where cate_id ='${cate_id}'`
    const date = await query(sql);
    console.log('date', date);
    const { affectedRows } = date;
    if (affectedRows > 0) {
        return res.json({
            code: 2000,
            msg: '删除成功',
        })
    }
}
Controller.addcate = async (req, res) => {
    console.log(req.body);
    let { name, text } = req.body;
    const sql = `insert into category (cate_name,orderBy) values ('${name}','${text}')`;
    await query(sql).then(data => {
        return res.json({
            errcode: 20000,
            message: '添加成功',
        })
    }).catch(err => {
        console.log(err);
    })
}
Controller.alter = async (req, res) => {
    res.sendFile(`${viewsDir}/alter.html`)
}
Controller.artData = async (req, res) => {
    const {
        page,
        limit
    } = req.query;
    const sql1 = 'select count(id) as count from article'
    const result = await query(sql1)
    const {
        count
    } = result[0]
    // 根据page和limit获取指定页码的数据
    const offset = (page - 1) * limit;
    const sql2 = `select t1.*,t2.cate_name,t3.username from article t1 
        left join category t2 on t1.cate_id = t2.cate_id 
        left join users t3 on t1.author = t3.user_id
        limit ${offset},${limit}`
    let data = await query(sql2)
    data = data.map((item) => {
        const {
            add_date,
            status,
            cate_name,
            username
        } = item;
        item.statusText = status == 1 ? '审核通过' : "审核中"
        item.cate_name = cate_name || '未分类'
        item.username = username || '匿名者'
        item.add_date = moment(add_date).format('YYYY-mm-DD HH:MM:SS')
        return item;
    })
    res.json({
        count,
        data,
        code: 0,
        msg: "sucess"
    })
}
Controller.delArtData = async (req, res) => {
    const {
        id
    } = req.body;
    const sql = `delete from article where id = ${id}`
    const {
        affectedRows
    } = await query(sql)
    // 删除文章的封面图，自行完成
    if (affectedRows > 0) {
        res.json({
            code: 0,
            message: "删除成功"
        })
    } else {
        res.json({
            code: -7,
            message: "删除失败"
        })
    }
}
Controller.updUserInfo = async (req, res) => {
    const { user_id, intro } = req.body;
    const sql = `update users set intro = '${intro}' where user_id = ${user_id}`;
    const { affectedRows } = await query(sql);
    const successData = {
        code: 0,
        message: "update user success"
    }
    const failData = {
        code: -5,
        message: "update user fail"
    }
    if (affectedRows > 0) {
        // 取出用户信息，再同步session和cookie中的用户信息
        const sql = `select * from users where user_id = ${user_id}`
        const result = await query(sql)
        // 将信息记录到session或cookie
        req.session.userInfo = result[0];
        res.cookie('userInfo', JSON.stringify(result[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        res.json(successData)
    } else {
        res.json(failData)
    }
}
Controller.avatar = async (req, res) => {
    // 获取用户在session中的信息
    const { user_id } = req.session.userInfo;
    // 文件上传
    let pic = ''
    if (req.file) {
        // 上传文件得到路径
        let { originalname, filename } = req.file;
        let extName = originalname.substring(originalname.lastIndexOf('.'))
        let uploadDir = './uploads'
        let oldName = path.join(uploadDir, filename);
        let newName = path.join(uploadDir, filename) + extName;
        try {
            const result = await rename(oldName, newName)
            pic = `uploads/${filename}${extName}`
            // 删除原图,必须得到旧图路径(从session获取)
            let oldAvatar = req.session.userInfo.avatar;
            oldAvatar = path.join(path.dirname(__dirname), oldAvatar)
            fs.unlink(oldAvatar, (err) => { })
        } catch (err) {
            console.log('上传失败')
        }
        // 上传成功，把路径写到sql语句中，更新到数据库中
        const sql = `update users set avatar = '${pic}' where user_id = ${user_id}`
        const result1 = await query(sql)
        console.log(result1);
        // 取出用户信息，再同步session和cookie中的用户信息
        const sql2 = `select * from users where user_id = ${user_id}`
        const result = await query(sql2)
        // 将信息记录到session或cookie
        req.session.userInfo = result[0];
        res.cookie('userInfo', JSON.stringify(result[0]), {
            expires: new Date(Date.now() + 1 * 3600000),
        })
        res.json({
            code: 0,
            message: "upload success"
        })
    } else {
        res.json({
            code: -6,
            message: "upload fail",
        })
    }
}
module.exports = Controller;  