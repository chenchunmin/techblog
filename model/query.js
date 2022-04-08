const res = require('express/lib/response');
const mysql = require('mysql');
// 数据库参数配置
const dbConfig = require('../config/dbconfig.js');
const connection = mysql.createConnection(dbConfig);
connection.connect(function (err) {
    if (err) { throw err }; 
    console.log('connect mysql success');
})

function query(sql) {
    return new promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}
module.exports = query;
