-- Drop existing tables if they exist to avoid conflicts
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

\c employees_db;

-- Create departments table
CREATE TABLE b_departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Create roles table
CREATE TABLE b_roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES b_departments(id) ON DELETE CASCADE
);

-- Create employees table
CREATE TABLE b_employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES b_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES b_employees(id) ON DELETE SET NULL
);
