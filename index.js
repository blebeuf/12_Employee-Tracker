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
            'update employee role',
            'view all departments',
            'add department',
            'Exit'
        ]
    }
];

// async fuction, switch and case was assisted with NW tutor
async function promptMain() {
    const answers = await inquirer.prompt(mainMenu);
    switch (answers.action) {
// Call the appropriate function based on user choice
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
        case 'update employee role':
                await updateEmployeeRole();
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

    // this portion was done with NW tutor and this information:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));
    const managerChoices = managers.rows.map(manager => ({ name: manager.first_name + ' ' + manager.last_name, value: manager.id }));
    // notes here : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
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

    // https://stackoverflow.com/questions/4448340/postgresql-duplicate-key-violates-unique-constraint
    // information for duplicate key
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

    async function updateEmployeeRole() {
        // Fetch the list of employees
        const employeesRes = await pool.query('SELECT id, first_name, last_name FROM b_employees');
        const employeeChoices = employeesRes.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }));
    
        // Ask the user to select an employee
        const { employeeId } = await inquirer.prompt({
            type: 'list',
            name: 'employeeId',
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
        });
    
        // Fetch the list of roles
        const rolesRes = await pool.query('SELECT id, title FROM b_roles');
        const roleChoices = rolesRes.rows.map(role => ({
            name: role.title,
            value: role.id
        }));
    
        // Ask the user to select the new role for the employee
        const { roleId } = await inquirer.prompt({
            type: 'list',
            name: 'roleId',
            message: "What's the new role for the employee?",
            choices: roleChoices
        });
    
        // Update the employee's role in the database
        await pool.query('UPDATE b_employees SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
        console.log("Employee's role updated successfully.");
    
        await promptMain();
    }
    
    async function viewAllEmployees() {
        // notes on JOIN: https://www.postgresql.org/docs/current/tutorial-join.html
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
    
    // https://stackoverflow.com/questions/4448340/postgresql-duplicate-key-violates-unique-constraint
    // information for duplicate key
    async function addDepartment() {
        const { name } = await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: "Department's name:"
        });
    
        try {
            await pool.query('INSERT INTO b_departments (name) VALUES ($1)', [name]);
            console.log("Department added successfully.");
        } catch (error) {
            console.error('An error occurred while adding the department:', error.message);
        }
        await promptMain();
    }


// Exit function to cleanly close the application, made in collaboration with NW bootcamp tutors.
function exit() {
    console.log("Goodbye!");
    pool.end().then(() => process.exit());
}

// Correctly start the application by displaying the main menu
promptMain().catch(err => {
    console.error('An error occurred:', err);
    pool.end();
});