var Sequelize = require("sequelize");
var connectionUri = process.env.DATABASE_URL || "postgres://root@localhost:5432/shopping";
var sequelize = new Sequelize(connectionUri, {
  define: {
    timestamps: false // true by default
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });