var mysql = require("mysql");
var inquirer = require("inquirer");
var item =  0;
var id = 0;
var quantity = 0;
var stock = 0;
var updatedQuan = 0;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;

        connection.query("SELECT * FROM products", function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                console.log(
                    "Product ID: " +
                    result[i].item_id +
                    " || Product Name: " +
                    result[i].product_name +
                    " || Price: " +
                    result[i].price
                );
            }
            getID();
        });
});

function getID(){

    inquirer
        .prompt({
            name:"id",
            type: "input",
            message: "Type the Product ID of the product you would you like to purchase."
        }).then(function(answer) {
        connection.query("SELECT * FROM products", function (err, result) {
            for (var i = 0; i < result.length; i++) {

                if (answer.id == result[i].item_id){
                    item = result[i].product_name;
                    id = result[i].item_id;
                    stock = result[i].stock_quantity;
                    console.log(item + " is available.")
                    getQuan(i);
                    break;
                }
                if (i == 9 && answer != result[i].item_id) {
                    console.log("Item not available.")
                    break;
                }
            }

        });
    });
}

function getQuan(i) {
    inquirer
        .prompt({
            name:"quan",
            type: "input",
            message: "How many would you like to purchase?"
        }).then(function(answer) {
        connection.query("SELECT * FROM products", function (err, result) {
                if (answer.quan <=  result[i].stock_quantity){
                        quantity = answer.quan;
                        console.log(result[i].product_name + " in stock.");
                        processOrder(result,answer,i);

                } else {
                    console.log("Insufficient quantity!");
                }
        });
    });
}

function processOrder(result,answer,i) {


    updatedQuan = result[i].stock_quantity - answer.quan;
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: updatedQuan
            },
            {
                item_id: id
            }
        ],
        function(err,res) {
            if (err) throw err;
            console.log("")
            console.log("--------     Receipt     --------");
            console.log("---------------------------------")
            console.log("Product ID: " + result[i].item_id);
            console.log("Product Name: " + result[i].product_name)
            console.log("Price: " + new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'USD'
            }).format(result[i].price));
            console.log("Quantity: " + quantity);
            console.log("Total Cost: " + new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'USD'
            }).format(result[i].price * quantity));
            console.log("")
            console.log("-------- End of Receipt --------");
            console.log("")
            console.log("")
            console.log("")
            console.log(res);
        }
    );



}