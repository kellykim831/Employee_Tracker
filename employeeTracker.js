const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employeeTracker_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  //connection.end();
  // run the start function after the connection is made to prompt the user
  startPrompt();
});

// function which prompts the user for what action they should take
function startPrompt() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Role",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Delete an Employee",
        "End"]
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmp();
          break;

        case "View All Employees By Department":
          viewAllEmpByDept();
          break;

        case "View All Employees By Role":
          viewAllRoles();
          break;

        case "Add Department":
          addDept();
          break;

        case "Add Employee":
          addEmp();
          break;

        case "Add Role":
          addRole();
          break;

        case "Update Employee Role":
          updateEmpRole();
          break;

        case "Delete an Employee":
          deleteEmp();
          break;

        case "End":
          connection.end();
          break;
      }
    });
}

//View All Employees
function viewAllEmp() {
  console.log("Viewing All Employees\n");
  //Query to view All Employees
  let query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id LEFT JOIN employee m ON m.id = e.manager_id`
  // Query from connection
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("All Employees viewed\n");

    startPrompt();
  });
}
function viewAllRoles() {
  console.log("Viewing All Roles\n");
  //Query to view All Roles
  let query = `SELECT e.id, e.first_name, e.last_name, r.title, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id LEFT JOIN employee m ON m.id = e.manager_id`
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("All roles viewed\n");

    startPrompt();
  });
}

// Make a department array
function viewAllEmpByDept() {
  console.log("Viewing employees by department\n");

  let query = `SELECT d.id, d.name, r.salary AS budget FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id GROUP BY d.id, d.name`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const deptChoices = res.map(data => ({
      value: data.id, name: data.name
    }));

    console.table(res);
    console.log("All Departments Viewed\n");

    deptPrompt(deptChoices);
  });

}

function deptPrompt(deptChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department would you like to choose?",
        choices: deptChoices
      }
    ])
    .then(function (answer) {
      console.log("answer ", answer.departmentId);

      let query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id WHERE d.id = ?`

      connection.query(query, answer.departmentId, function (err, res) {
        if (err) throw err;

        console.table("response ", res);
        startPrompt();
      });
    });
}

//Create employee array
function addEmp() {
  console.log("Adding new employee")

  let query = `SELECT role.id, role.title, role.salary FROM role`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    console.log("Insert Role");

    addPrompt(roleChoices);
  });
}
function addPrompt(roleChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {
      console.log(answer);

      let query = `INSERT INTO employee SET ?`
      // Insert new item into table with info
      connection.query(query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId,
          
        },
        function (err, res) {
          if (err) throw err;

          console.table("response ", res);
          console.log("New Employee Inserted Successfully!\n");

          startPrompt();
        });
    });
}

//Create role array
function addRole() {

  let query = `SELECT d.id, d.name, r.salary AS budget FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id GROUP BY d.id, d.name`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const deptChoices = res.map(({ id, name }) => ({
      value: id, name: `${id} ${name}`
    }));

    console.table(res);
    console.log("Please answer the following:");

    addRolePrompt(deptChoices);
  });
}

function addRolePrompt(deptChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "What is the Role Title of the Employee?"
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Insert Role Salary"
      },
      {
        type: "list",
        name: "departmentId",
        message: "Which Department does your Employee Belong to?",
        choices: deptChoices
      },
    ])
    .then(function (answer) {

      let query = `INSERT INTO role SET ?`

      connection.query(query, {
        title: answer.roleTitle,
        salary: answer.roleSalary,
        department_id: answer.departmentId
      },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("New Role Inserted!");

          startPrompt();
        });

    });
}

//Create department array
function addDept() {

  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "What Department would you like to add?"
    }
  ]).then(function (res) {
    var query = connection.query(
      "INSERT INTO department SET ? ",
      {
        name: res.name

      },
      function (err) {
        if (err) throw err
        console.table(res);
        console.log("New Department Added!")
        startPrompt();
      }
    )
  })
}

//Create update employee function
function updateEmpRole() {
  empArray();

}

function empArray() {
  console.log("Updating an employee");

  let query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id LEFT JOIN employee m ON m.id = e.manager_id`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const empChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("Please answer the following:\n")

    roleArray(empChoices);
  });
}

function roleArray(empChoices) {
  console.log("Updating role");

  let query = `SELECT r.id, r.title, r.salary FROM role r`
  let roleChoices;

  connection.query(query, function (err, res) {
    if (err) throw err;

    roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    console.log("Updating role\n")

    empRolePrompt(empChoices, roleChoices);
  });
}

function empRolePrompt(empChoices, roleChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee would you like to update?",
        choices: empChoices
      },
      {
        type: "list",
        name: "roleId",
        message: "What role do you want to update?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {

      let query = `UPDATE employee SET role_id = ? WHERE id = ?`
      connection.query(query,
        [answer.roleId,
        answer.employeeId
        ],
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Employee Has Been Updated Successfully!");

          startPrompt();
        });
    });
}

//delete employee
function deleteEmp() {
  console.log("Deleting an employee");

  let query = `SELECT e.id, e.first_name, e.last_name FROM employee e`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const deleteEmpChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("Deleting employee\n");

    promptDelete(deleteEmpChoices);
  });
}

//Chose which employee to delete

function promptDelete(deleteEmpChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: deleteEmpChoices
      }
    ])
    .then(function (answer) {

      let query = `DELETE FROM employee WHERE ?`;
      connection.query(query, { id: answer.employeeId }, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(res.affectedRows + "Deleted!\n");

        startPrompt();
      });
    });
}
