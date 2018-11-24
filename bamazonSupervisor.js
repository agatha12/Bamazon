var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

 

 

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "bamazon"
});
Menu()
function Menu(){

    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View products sales by department",
          "Add a new department"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View products sales by department":
          productSales();
          break;
  
        case "Add a new department":
          newDepartment();
          break;
  
    
        }
      });
  }


function productSales(){



    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM products INNER JOIN departments ON department=department_name GROUP BY department";
    connection.query(query, function(err, res) {

     table = new Table({
    head: ["Department Id", "Name", "Overhead", "Sales", "Profit"],
    });


        for(i=0;i<res.length;i++){
            var profit = res[i].product_sales-res[i].over_head_costs
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, profit])
        }
        console.log(table.toString());

        
        connection.end();
      
})
}



  function newDepartment(){
    inquirer
      .prompt([

      {
        name: "name",
        type: "input",
        message: "Department name:", 
      },
      {
        name: "over",
        type: "input",
        message: "Department's overhead cost:", 
      }
    
    ])
      .then(function(answer) {
        
    var query = connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: answer.name,
          over_head_costs: answer.over
        },
        function(err, res) {
          console.log(res.affectedRows + " new department inserted!\n");
        }
      );
  
      connection.end();

      });
  }