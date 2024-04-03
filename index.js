const inquirer = require('inquirer');
const { Pool } = require('pg');
// const consoleTable = require('console.table')

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'employees_db',
    password: '666',
    port: 3001,
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
]
   
