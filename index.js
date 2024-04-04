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
            'view all employees',
            'Add employee',
            'view all roles',
            'Add role',
            'view all departments',
            'add department',
            'Exit'
        ]
    }
];

async function promptMain() {
    const answers = await inquirer.prompt(mainMenu);
    switch (answers.action) {
        case 'view all employees':
            await viewAllEmployees();
            break;
        case 'Add employee':
            await addEmployee();
            break;
        case 'view all roles':
            await viewAllRoles();
            break;
        case 'Add role':
            await addRole();
            break;
        case 'view all departments':
            await viewAllDepartments();
            break;
        case 'add department':
            await addDepartment();
            break;
        case 'Exit':
            exit();
            break;
        default:
            console.log('Invalid action!');
            await promptMain(); // Re-prompt if invalid action
    }
}


async function viewAllDepartments() {
    const query = 'SELECT id, name FROM b_departments ORDER BY id';
    const res = await pool.query(query);
    console.table(res.rows);
    await promptMain();
}
    
async function addEmployee() {
    const roles = await pool.query('SELECT id, title FROM b_roles');
    const managers = await pool.query('SELECT id, first_name, last_name FROM b_employees');

    const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));
    const managerChoices = managers.rows.map(manager => ({ name: manager.first_name + ' ' + manager.last_name, value: manager.id }));
    managerChoices.unshift({ name: 'None', value: null });

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "Employee's first name:"
        },
        {
            type: 'input',
            name: 'last_name',
            message: "Employee's last name:"
        },
        {
            type: 'list',
            name: 'role_id',
            message: "Employee's role:",
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager_id',
            message: "Employee's manager:",
            choices: managerChoices
        }
    ]);

    await pool.query('INSERT INTO b_employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id || null]);
    console.log("Employee added successfully.");
    await promptMain();
}

    
    async function viewAllRoles() {
        const query = `
            SELECT b_roles.id, b_roles.title, b_departments.name AS department, b_roles.salary
            FROM b_roles
            JOIN b_departments ON b_roles.department_id = b_departments.id
            ORDER BY b_roles.id`;
        const res = await pool.query(query);
        console.table(res.rows);
        await promptMain();
    }

    async function addRole() {
        const departments = await pool.query('SELECT id, name FROM b_departments');
        const departmentChoices = departments.rows.map(dept => ({ name: dept.name, value: dept.id }));
    
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: "Role's title:"
            },
            {
                type: 'input',
                name: 'salary',
                message: "Role's salary:"
            },
            {
                type: 'list',
                name: 'department_id',
                message: "Role's department:",
                choices: departmentChoices
            }
        ]);
    
        await pool.query('INSERT INTO b_roles (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id]);
        console.log("Role added successfully.");
        await promptMain();
    }
    
    async function viewAllEmployees() {
        const query = `
            SELECT b_employees.id, b_employees.first_name, b_employees.last_name, 
                   b_roles.title AS role, b_departments.name AS department, b_roles.salary, 
                   CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM b_employees
            LEFT JOIN b_employees manager ON b_employees.manager_id = manager.id
            JOIN b_roles ON b_employees.role_id = b_roles.id
            JOIN b_departments ON b_roles.department_id = b_departments.id
            ORDER BY b_employees.id`;
        const res = await pool.query(query);
        console.table(res.rows);
        await promptMain();
    }
    
   async function addDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "Department's name:"
        }
    ]);
    await pool.query('INSERT INTO b_departments (name) VALUES ($1)', [answers.name]);
    console.log("Department added successfully.");
    await promptMain();
}

function exit() {
    console.log("Goodbye!");
    pool.end().then(() => process.exit());
}

// Correctly start the application by displaying the main menu
promptMain().catch(err => {
    console.error('An error occurred:', err);
    pool.end();
});