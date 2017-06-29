 var table = [];

 //Database Functions
 //Create the initial database:
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



 transactionTableInit();

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
                 { data: "createdAt" },
                 { data: "boughtorsold",
                     render: function(data, type, row) {
                         if(data){
                         	return "Sold";
                         } else {
                         	return "Bought";
                         }
                     } },
                 { data: "symbol" },
                 { data: "quantity" }, {
                     data: "price",
                     render: function(data, type, row) {
                         return '$' + data;
                     }
                 }, {
                     "mData": function(data, type, dataToSet) {
                       return "$" +  data.quantity * data.price;
                     }
                 },

             ]
         })
     });





 };

 transactionTableLoad();
