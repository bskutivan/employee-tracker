INSERT INTO department(id, name)
VALUES
    (1, 'Marketing'),
    (2, 'Sales'),
    (3, 'HR'),
    (4, 'Engineering'),
    (5, 'Finance'),
    (6, 'Legal');

INSERT INTO role(title, salary, department_id)
VALUES
    ('Marketing Lead', 125000, 1),
    ('Marketing Associate', 85000, 1),
    ('Sales Lead', 115000, 2),
    ('Sale Specialist', 80000, 2),
    ('Employee Experience Manager', 85000, 3),
    ('Employee Experience Associate', 65000, 3),
    ('Lead Engineer', 155000, 4),
    ('Software Engineer', 120000, 4),
    ('Accounts Manager', 125000, 5),
    ('Accounts Associate', 85000, 5),
    ('Legal Team Lead', 180000, 6),
    ('Lawyer', 165000, 6);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('Clark', 'Kent', 1, NULL),
    ('Diana', 'Ross', 2, 1),
    ('Gene', 'Simmons', 3, NULL),
    ('Stacy', 'Stars', 4, 3),
    ('Missy', 'Elliot', 5, NULL),
    ('Cardi', 'B', 6, 5),
    ('Jack', 'Johnson', 7, NULL),
    ('Richard', 'Kennedy', 8, 7),
    ('Chrissy', 'Teegan', 9, NULL),
    ('Barbara', 'Streisand', 10, 9),
    ('Eric', 'Garner', 11, NULL),
    ('Lil', 'Uzi-Vert', 12, 11);