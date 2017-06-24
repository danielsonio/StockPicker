var db = require("../models");

module.exports = function(app) {

  app.get("/api/posts", function(req, res) {

    db.Stock.findAll({}).then(function(dbStock) {
      res.json(dbStock);
    });
  });


  app.post("/api/posts", function(req, res) {

    console.log("Stock Data: ");
    console.log(req.body);

    db.Stock.create({
      symbol: req.body.symbol,
      price: req.body.price,
      open: req.body.open,
      high: req.body.high,
      quantity: req.body.quantity
    }).then(function(dbStock) {
      res.json(dbStock);
    });
  });

};
