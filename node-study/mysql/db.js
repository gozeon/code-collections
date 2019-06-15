const mysql = require('mysql2');

// create the connection to database
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dd'
});

// var mysql = require("mysql");
// var pool = mysql.createPool({
//     host: '127.0.0.1',
//     user: 'root',
//     password: '',
//     port: '3306',
//     database: 'test'
// })
// var db = {};
// db.con = function (callback) {   //callback是回调函数，连接建立后的connection作为其参数
//     pool.getConnection(function (err, connection) {
//         console.log("connect start...")
//         if (err) {      //对异常进行处理
//             throw err;  //抛出异常
//         } else {
//             callback(connection);   //如果正常的话，执行回调函数（即请求）
//         }
//         connection.release();   //释放连接
//         console.log("connect end...")
//     })
// }
// module.exports = db;

// var db = require('../db')
// db.con(function (connect) {
//     connect.query('SELECT * FROM bloguser WHERE username = ?', [username], function (err, result) {
//         if (err) {
//             console.log("select username:" + username + " error, the err information is " + err);
//             return callback(err);
//         }
//             console.log(result);
//     })
// })


pool.getConnection(function (err, connection) {
    console.log("connect start...")
    if (err) {
        throw err;
    } else {
        // callback(connection);
        connection.query('select * from ttt', function(err, result, fields){
            console.log(result)
        })
    }
    pool.releaseConnection(connection);
    console.log("connect end...")
})

// pool.query('select * from ttt', function(err, result, fields){
//     console.log(err)
//     console.log(result)
//     console.log({data: result})
//     console.log(fields)
// })
