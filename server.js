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

        promptInitialChoices();
    })
};

//Show all roles

showAllRoles = () => {
    console.log('Showing all roles!');

    const sql = `SELECT role.title, role.salary, role.id, department.name AS department FROM role
                LEFT JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();
    })
};

//Show all employees

showAllEmpl = () => {
    console.log('Showing all employees!');

    const sql = `SELECT e.id, 
                        e.first_name, 
                        e.last_name, 
                        role.title, 
                        department.name AS department, 
                        role.salary, 
                        CONCAT(emp_manager.first_name, " ",  emp_manager.last_name) AS manager 
                FROM employee e 
                        LEFT JOIN employee emp_manager ON e.manager_id = emp_manager.id 
                        LEFT JOIN role ON e.role_id = role.id 
                        LEFT JOIN department ON role.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if(err) throw err;
        console.table(rows);

        promptInitialChoices();
    })
}


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
        if(initialChoices === "View all employees") {
            showAllEmpl();
        }
    })
}