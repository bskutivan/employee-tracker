const inquirer = require('inquirer');
const consoleTable = require('console.table');
const db = require('./db/connection');

db.connect(err => {
    if(err) {
        throw err;
    } 
    console.log(
        `
    ========================================================
    ========================================================
    ****                EMPLOYEE TRACKER                ****
    ========================================================
    ========================================================
         `       
    );

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

//Add new department

addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "what department do you want to add?",
            name: "addDepartment",
            validate: departmentInput => {
                if(!departmentInput) {
                    console.log("Please input the name of the department");
                    return false;
                } else {
                    return true;
                }
            } 
        }
    ]).then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES(?)`;
        db.query(sql, answer.addDepartment, (err) => {
            if(err) throw(err);
            console.log("Added Department: " + answer.addDepartment);

            showAllDept();
        })
    })
}

//Add role

addRole = () => {
    const deptQuery = `SELECT name, id FROM department`;

    db.query(deptQuery, (err, rows) => {
        if(err) throw err;

        const deptChoices = rows.map(dept => {
            const deptChoice = {name: dept.name, value: dept.id};
            return deptChoice;
        })

        inquirer.prompt([
            {
                type: "input",
                message: "What role would you like to add?",
                name: "addRoleTitle",
                validate: roleTitleInput => {
                    if(!roleTitleInput) {
                        console.log('Please enter the title of the role!')
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                type: "input",
                message: "What is the salary for this role?",
                name: "addRoleSal",
                validate: salaryInput => {
                    if(!salaryInput === Number) {
                        console.log('Please input the salary in numbers');
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                type: "list",
                message: "What department is this role in?",
                name: "addRoleId",
                choices: deptChoices
            }

        ]).then(answer => {
            const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES (?,?,?)`;
            const params = [answer.addRoleTitle, answer.addRoleSal, answer.addRoleId]
            db.query(sql, params, (err, rows) => {
                if(err) throw err;
                console.log("Added Role: " + answer.addRoleTitle);

                showAllRoles();
            });
        });
    })
}

//Add employee

addEmployee = () => {
    const managerQuery = `SELECT
                            emp.manager_id,
                            emp.first_name,
                            emp.last_name,
                            mgr.first_name,
                            mgr.last_name,
                            mgr.id
                        FROM employee mgr
                        LEFT JOIN employee emp ON emp.manager_id = mgr.id
                        WHERE emp.manager_id IS NOT NULL`;

    const rolesQuery = `SELECT id, title FROM role`;

    db.query(managerQuery, (err, managerChoices) => {
        if(err) throw err;

        db.query(rolesQuery, (err, roleChoices) => {
            if(err) throw err;

            const roles = roleChoices.map(role => {
                const roles = {name: role.title, value: role.id};
                return roles;
            });

            const managers = managerChoices.map(mngr => {
                const managers = {name: mngr.first_name + " " + mngr.last_name, value: mngr.id};
                return managers;
            });

            console.log(roles);
            console.log(managers);

            inquirer.prompt([
                {
                    type: "input",
                    message: "What is their first name?",
                    name: "empFirstName",
                    validate: firstNameInput => {
                        if(!firstNameInput)  {
                            console.log('Please include all fields of the employees data.');
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                {
                    type: "input",
                    message: "What is their last name?",
                    name: "empLastName",
                    validate: lastNameInput => {
                        if(!lastNameInput)  {
                            console.log('Please include all fields of the employees data.');
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                {
                    type: "list",
                    message: "What is the employees role?",
                    name: "roleSelection",
                    choices: roles
                },
                {
                    type: "list",
                    message: "Who is their manager?",
                    name: "managerSelection",
                    choices: managers
                }
            ])
            .then(answer => {
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?)`;
                const params = [answer.empFirstName, answer.empLastName, answer.roleSelection, answer.managerSelection]
                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Added employee " + answer.empFirstName + " " + answer.empLastName);

                    showAllEmpl();
                })
            })
        })
    });
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
        if(initialChoices === "Add a department") {
            addDepartment();
        }
        if(initialChoices === "Add a role") {
            addRole();
        }
        if(initialChoices === "Add an employee") {
            addEmployee();
        }
    })
}