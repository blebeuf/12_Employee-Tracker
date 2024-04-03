INSERT INTO departments (name) VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales'),
('Service');

INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 80000, 1),
('HR Manager', 70000, 2),
('Marketing Coordinator', 65000, 3),
('Signage Person', 55000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Granny', 'Smooth', 1, NULL),
('Cool', 'Guy', 2, 1,),
('Susan', 'Jones', 3, 1);

