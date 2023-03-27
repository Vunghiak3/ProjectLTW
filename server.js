const app = require("./app");
const dotenv = require("dotenv");
// const sql = require('mssql')
dotenv.config({
  path: "./config.env",
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
