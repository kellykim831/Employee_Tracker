/* Seeds for SQL table. We haven't discussed this type of file yet */
USE employeeTracker_DB;

/* Insert 3 Rows into your new table */
INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 190000, 4);

INSERT INTO employee (name)
VALUES ("John", "Doe", "Sales Lead", 1, 3);
INSERT INTO employee (name)
VALUES ("Mike", "Chan", "Salesperson", 2, 1);
INSERT INTO employee (name)
VALUES ("Ashley", "Rodriguez", "Lead Engineer", 3, null);
INSERT INTO employee (name)
VALUES ("Kevin", "Tupik", "Software Engineer", 4, 3);
INSERT INTO employee (name)
VALUES ("Malia", "Brown", "Accountant", 5, null);
INSERT INTO employee (name)
VALUES ("Sarah", "Lourd", "Legal Team Lead", 6, null);
INSERT INTO employee (name)
VALUES ("Tom", "Allen", "Lawyer", 7, 6);
INSERT INTO employee (name)
VALUES ("Tammer", "Galal", "Software Engineer", 8, 4);


