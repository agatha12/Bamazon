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

connection.connect(function(err) {
  if (err) throw err;
  showInventory();
});


function showInventory(){

    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {

     table = new Table({
    head: ["Item Number", "Name", "Price"],
    });


        for(i=0;i<res.length;i++){
            table.push([res[i].item_id, res[i].product_name, res[i].price])
        }
        console.log(table.toString());
        placeOrder()
        

      
})
}

function placeOrder() {
    inquirer
      .prompt([
          {
        name: "id",
        type: "input",
        message: "Enter the item number of the product you would like to purchase?",
        
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?", 
      }
    ])
      .then(function(answer) {
        
         id = answer.id
         quantity = parseInt(answer.quantity)


       checkStock(id, quantity)

      });
  }

 function checkStock(id, quantity){


    var query = "SELECT stock_quantity, price, product_sales FROM products WHERE ?";
    connection.query(query, {item_id: id}, function(err, res) {

      var stock = res[0].stock_quantity
      var price = res[0].price
      var ps = res[0].product_sales

      if(stock < quantity){

          console.log("Insufficient stock. We only have "+stock+" of your chosen item in stock.")
      }
      else{
          
          processOrder(id, quantity, stock, price, ps)
      }


  connection.end();
      
})
 }

 function processOrder(id, quantity, stock, price, ps){
    var newq = (stock-quantity)
    var cost = (price*quantity)
    var newps = (cost+ps)

        var query = connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: newq,
              product_sales: newps

            },
            {
              item_id: id
            }
          ],

          function(err, res) {
          

            console.log("Your order has been placed. Your outstanding balance is $"+cost)

            
          }
        );
      
      }

