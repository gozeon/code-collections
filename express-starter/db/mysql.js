// const mysql = require('mysql2')

// const pool = mysql.createPool({
//     host: config.get('DB_HOST'),
//     port: config.get('DB_PORT'),
//     user: config.get('DB_USERNAME'),
//     password: config.get('DB_PASSWORD'),
//     database: config.get('DB_DATABASE'),
// })

// module.exports = pool

module.exports = require('knex')({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || '3306',
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE ,
        charset: 'utf8'
    },
    useNullAsDefault: true,
})
