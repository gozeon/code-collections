// Copyright 2016 李秋帅 (383217112@qq.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

var express = require('express');
var app = express();
var router = require("./controller/router.js");
// 使用session
var session = require('express-session');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// template
app.set("view engine", "ejs");

// static
app.use(express.static('./public'));

// route
app.get('/', router.showIndex);

// 404
app.use(function (req, res) {
    res.render("404");
});

app.listen(6666);