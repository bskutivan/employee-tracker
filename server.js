const inquirer = require('inquirer');
const mysql = require('mysql12');
const express = require('express');
const db = require('./db/index');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.connect(err => {
    if(err) {
        throw err;
    } console.log('connected as id' + db.threadId);
});