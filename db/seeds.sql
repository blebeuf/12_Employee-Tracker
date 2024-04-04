INSERT INTO b_departments (id, name) VALUES
(1, 'Engineering'),
(2, 'Finance'),
(3, 'Legal'),
(4, 'Sales'),
(5, 'Service');

INSERT INTO b_roles (id, title, salary, department_id) VALUES
(1, 'Software Engineer', 80000, 1),
(2, 'HR Manager', 70000, 2),
(3, 'Marketing Coordinator', 65000, 3),
(4, 'Signage Person', 55000, 4);

INSERT INTO b_employees (first_name, last_name, role_id, manager_id) VALUES
('Granny', 'Smooth', 1, NULL),
('Cool', 'Guy', 2, 1),
('Susan', 'Jones', 3, 2);

