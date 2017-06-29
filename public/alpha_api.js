var stockArray = [];

$("#stock-submit").on("click", function() {

  event.preventDefault();

  var apiKey = "&apikey=MOU4Y0ZQ72U6K0JF"
  var tickerSymbol = $("#stock_name").val().trim()
  var queryURL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + tickerSymbol + apiKey;

  var object = "Realtime Global Securities Quote";
  var symbol = "01. Symbol";
  var exchange = "02. Exchange Name";
  var latest_price = "03. Latest Price";
  var open_price = "04. Open (Current Trading Day)";
  var high_price = "05. High (Current Trading Day)";

  var quantity = $('#quantity').val().trim();

  $.ajax({
    url: queryURL,
    method: "GET"
  })


  .done(function(response) {


    // console.log(response[object][symbol]);
    // console.log(response[object][exchange]);
    // console.log(response[object][latest_price]);
    // console.log(response[object][open_price]);
    // console.log(response[object][high_price]);

    var price = response[object][latest_price];
    var open = response[object][open_price];
    var high = response[object][high_price];

    price = parseFloat(price);
    open = parseFloat(open);
    high = parseFloat(high);

    var newStock = {
      symbol: response[object][symbol],
      price: price,
      quantity: quantity,
      boughtorsold: false,
    };

    console.log(newStock.symbol);

    // Send an AJAX POST-request with jQuery



    stockArray.push(newStock);

    $.post("api/posts", newStock)
      .done(function() {
        var row = $("<div>");
        row.addClass("symbol");

        row.append("<p>Stock: " + newStock.symbol + " </p>");
        row.append("<p>Price: " + newStock.price + "</p>");

        $("#stock-area").prepend(row);


      });

    // Empty each input box by replacing the value with an empty string
        $("#stock_name").val("");
        $("#quantity").val("");
  });


});

$.get("/api/posts", function(data) {

  if (data.length !== 0) {

    for (var i = 0; i < data.length; i++) {

      var row = $("<div>");

      row.append("<p>Stock: " + data[i].symbol + "</p>");
      row.append("<p>Price: " + data[i].price + "</p>");


      $("#stock-area").prepend(row);

    }

  }

});
