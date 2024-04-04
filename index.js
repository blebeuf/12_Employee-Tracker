const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: '666',
    database: 'employees_db',
    port: 5432
});

const mainMenu = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'view all employee',
            'Add employee',
            'view all roles',
            'Add role',
            'view all departments',
            'add department',
            'Exit'
        ]
    }
].then((answers) => {
    switch(answers.action) {
        case 'view all employee':
            viewAllEmployees();
            break;
        case 'Add employee':
            addEmployee();
            break;
        case 'view all roles':
            viewAllRoles();
            break;
        case 'add role':
            addRole();
            break;
        case 'view all departments':
            viewAllDepartments();
            break;
        case 'add department':
            addDepartment();
            break;
        default:
            exit();
    }
})
