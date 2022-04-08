const path = require('path');
const Controller = {};
const viewsDir = path.join(path.dirname(__dirname), 'views');
const query = require('../model/query.js');
Controller.index = (req,res) => {
    res.sendFile(`${viewsDir}/index.html`)
}
Controller.login = (req,res) => {
    res.sendFile(`${viewsDir}/login.html`)
}
Controller.register = (req,res) => {
    res.sendFile(`${viewsDir}/register.html`)
}
module.exports = Controller;  