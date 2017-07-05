 var table = [];

 //Database Functions
 //Create the initial transaction datatable:
 var transactionTableInit = function() {
     $('#myTable').DataTable({
         responsive: true,
         "searching": false,
         data: table,
         columns: [
             { title: "DATE" },
             { title: "BOUGHT // SOLD" },
             { title: "STOCK NAME" },
             { title: "QUANTITY" },
             { title: "PRICE PER STOCK" },
             { title: "TOTAL TRANSACTION VALUE" },
         ]
     });

 };

 //Create the initial portfolio datatable:
 var portfolioTableInit = function() {
     $('#myPort').DataTable({
         responsive: true,
         "searching": false,
         data: table,
         columns: [
             { title: "STOCK NAME" },
             { title: "QUANTITY" },
             { title: "PRICE PER STOCK" },
             { title: "TOTAL STOCK VALUE" },
             { title: "SELL" },
         ],
         "columnDefs": [{
             "targets": -1,
             "data": null,
             "defaultContent": "<button>Sell</button>"
         }]
     });

 };


 transactionTableInit();
 portfolioTableInit();

 //fetch the transaction table for the user and place it inot the transaction table, destroy allows for a reload button to be created
 var transactionTableLoad = function() {
     var transactionTable = $('#myTable').DataTable();
     transactionTable.destroy();


     $.get("/api/transactions", function(data) {
         // findAll returns all entries for a table when used with no options

         // We have access to the todos as an argument inside of the callback function
         $('#myTable').DataTable({
             responsive: true,
             "searching": false,
             data: data,
             columns: [
                 { data: "createdAt" }, {
                     data: "boughtorsold",
                     render: function(data, type, row) {
                         if (data) {
                             return "Sold";
                         } else {
                             return "Bought";
                         }
                     }
                 },
                 { data: "symbol" },
                 { data: "quantity" }, {
                     data: "price",
                     render: function(data, type, row) {
                         return '$' + data;
                     }
                 }, {
                     "mData": function(data, type, dataToSet) {
                         return "$" + data.quantity * data.price;
                     }
                 },

             ]
         })
     });





 };

 transactionTableLoad();


 //fetch the transaction table for the user, find all the different stocks they have bought and add them into an object
 //then subtract from it items they have sold, destroy allows for a reload button to be created
 var portfolioTableLoad = function() {
     var portfolioTable = $('#myPort').DataTable();
     portfolioTable.destroy();
     var portfolio = ["test"];

     $.get("/api/transactions", function(data) {
         // findAll returns all entries for a table when used with no options

         // We have access to the todos as an argument inside of the callback function
         console.log(data);
         console.log(data[0].boughtorsold);


         for (var i = 0; i < data.length; i++) {
             //go though the response and take all the buy orders, insert them into a portfolio holder, check if a stock of the same name was purchased
             //add the quantities together if so.

             if (data[i].boughtorsold === false) {
                 //check if the portfolio already contains a stock with the same name
                 if (portfolio[0] === "test") {
                     portfolio.shift();
                     var myStock = { symbol: data[i].symbol, quantity: data[i].quantity };
                     portfolio.push(myStock);
                 } else {
                     for (var j = 0; j < portfolio.length; j++) {
                         if (data[i].symbol == portfolio[j].symbol) {
                             portfolio[j].quantity += data[i].quantity;
                             break;
                         }
                         if (j + 1 == portfolio.length) {
                             var myStock = { symbol: data[i].symbol, quantity: data[i].quantity };
                             portfolio.push(myStock);
                             break;
                         }
                     }

                 }
             } else {
                 for (var j = 0; j < portfolio.length; j++) {
                     if (data[i].symbol == portfolio[j].symbol) {
                         portfolio[j].quantity -= data[i].quantity;
                         break;
                     }
                 }
             }
         }
         
     }).then(function() {
        ;
             for (var i = 0; i < portfolio.length; i++) {
                 var apiKey = "&apikey=MOU4Y0ZQ72U6K0JF"
                 var tickerSymbol = portfolio[i].symbol;
                 var queryURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + tickerSymbol + apiKey;
                 var object = "Realtime Global Securities Quote";
                 var latest_price = "03. Latest Price";

                 $.ajax({
                     url: queryURL,
                     method: "GET",
                 }).done(function(response) {
                    portfolio[i].price = response[object][latest_price];
                     console.log (response[object][latest_price]);
                 })

             }
             console.log(portfolio);
         }).then(function() {
         $('#myPort').DataTable({
             responsive: true,
             "searching": false,
             data: portfolio,
             columns: [
                 { data: "symbol" },
                 { data: "quantity" },
                 { data: "quantity" },
                 { data: "quantity" },
                 { title: "SELL" },
             ],
             "columnDefs": [{
                 "targets": -1,
                 "data": null,
                 "defaultContent": "<button>Sell</button>"
             }]
         });
     })
 };



 portfolioTableLoad();
