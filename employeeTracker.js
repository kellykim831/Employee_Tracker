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
        "Exit"]
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

        case "Exit":
          connection.exit();
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
        console.log(res.affectedRows + "Employees are viewed!\n");

        startPrompt();
      });
    });
}

//Create employee array
function addEmp() {
  console.log("Adding new employee")

  let query = `SELECT r.id, r.title, r.salary FROM role r`

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
          manager_id: answer.managerId,
        },
        function (err, res) {
          if (err) throw err;

          console.table("response ", res);
          console.log("New Employee Inserted Successfully!\n");

          startPrompt();
        });
    });
}



