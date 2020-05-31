const inquirer = require('inquirer');
const consoleTable = require('console.table');
const db = require('./db/connection');

db.connect(err => {
    if(err) {
        throw err;
    } 
    console.log('connected as id' + db.threadId);
    promptInitialChoices();
});


//Show all depts

showAllDept = () => {
    console.log('Showing all departments!');

    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
    })
};

showAllRoles = () => {
    console.log('Showing all roles!');

    const sql = `SELECT role.title, role.salary, role.id, department.name AS department FROM role
                LEFT JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);
    })
};

showAllEmpl 


const promptInitialChoices = function() {
    inquirer.prompt([
        {
            type: "list",
            name: "initialChoices",
            message: "what would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role"
            ],
            validate: choice => {
                if (choice) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then((answers) => {
        const {initialChoices} = answers;

        if(initialChoices === "View all departments") {
            showAllDept();
        }
        if(initialChoices === "View all roles") {
            showAllRoles();
        }
    })
}