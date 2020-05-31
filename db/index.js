const mysql = require('mysql2');

const db = mysql.Connection.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'LVM128@!bpq',
    database: 'employee_tracker,db'
});

module.exports = db;