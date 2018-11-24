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
          "View products for sale",
          "View low inventory",
          "Add to inventory",
          "Add a new product"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View products for sale":
          showInventory();
          break;
  
        case "View low inventory":
          lowInventory();
          break;
  
        case "Add to inventory":
          addInventory();
          break;
  
        case "Add a new product":
          addProduct();
          break;
        }
      });
  }


  function showInventory(){

    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {

     table = new Table({
    head: ["Item Number", "Name", "Department", "Price", "Stock"],
    });


        for(i=0;i<res.length;i++){
            table.push([res[i].item_id, res[i].product_name, res[i].department, res[i].price, res[i].stock_quantity])
        }
        console.log(table.toString());
        connection.end();
        

      
})
}

function lowInventory(){
    var query = "SELECT * FROM products WHERE stock_quantity<100";
    connection.query(query, function(err, res) {

     table = new Table({
    head: ["Item Number", "Name", "Department", "Price", "Stock"],
    });


        for(i=0;i<res.length;i++){
            table.push([res[i].item_id, res[i].product_name, res[i].department, res[i].price, res[i].stock_quantity])
        }
        console.log(table.toString());
        connection.end();
        

      
})


}

function addInventory(){
    inquirer
    .prompt([

    {
      name: "id",
      type: "input",
      message: "Item Id:", 
    },
    {
      name: "add",
      type: "input",
      message: "How many are you adding to the inventory?", 
    }

  ])
    .then(function(answer) {
    
    var id = answer.id
    var newq = answer.add
    var query = "SELECT stock_quantity FROM products WHERE ?";
    connection.query(query, {item_id: id}, function(err, res) {
        var stock = res[0].stock_quantity
        update(id, stock, newq)
      
})
     
})
}
function update(id, stock, add){
    var newq = (parseInt(stock)+parseInt(add))
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: +newq
        },
        {
          item_id: id
        }
      ],
      function(err, res) {
        
        console.log(res.affectedRows + " products updated!\n");
        connection.end();
      }
    );
    }


    


function addProduct(){
    inquirer
      .prompt([

      {
        name: "name",
        type: "input",
        message: "Product name:", 
      },
      {
        name: "department",
        type: "input",
        message: "Department:", 
      },
      {
        name: "price",
        type: "input",
        message: "Price", 
      },
      {
        name: "quantity",
        type: "input",
        message: "Quantitiy in stock:", 
      }
    ])
      .then(function(answer) {


          console.log("Inserting a new product...\n");
          var query = connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: answer.name,
              department: answer.department,
              price: answer.price,
              stock_quantity: answer.quantity,
              product_sales: 0
            },
            function(err, res) {
              console.log(res.affectedRows + " product inserted!\n");

            }
          );
     
          connection.end();
        })
      }
