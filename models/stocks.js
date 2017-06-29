module.exports = function(sequelize, DataTypes) {
  var Stock = sequelize.define("Stock", {
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    boughtorsold: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  });
  return Stock;
}
