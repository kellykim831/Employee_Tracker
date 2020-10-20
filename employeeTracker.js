const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee Role",
        "Update Employee Role",
        "Update Employee Manager"
      ]
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmp();
          break;

        case "View All Employees By Department":
          viewAllEmpByDept();
          break;

        case "Add Employee":
          addEmp();
          break;

        case "Remove Employee Role":
          removeEmpRole();
          break;

        case "Update Employee Manager":
          updateEmpMgr();
          break;
      }
    });
}

//View All Employees
function viewAllEmp() {
  //Query to view All Employees
  let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";

  // Query from connection
  connection.query(query, function (err, res) {
    if (err) return err;
    console.log("\n");
    console.table(res);


    startPrompt();
  });

}



