const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { AuthRouter } = require("./router/AuthRouter");
const UserRouter = require("./router/UserRouter.js");
const ProductRouter = require("./router/ProductRouter.js");
const mongoConnect = require("./database/mongooseConnection.js");

const app = express();
dotenv.config();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(cors());

app.use("/auth/api", AuthRouter);
app.use("/user/api", UserRouter);
app.use("/product/api", ProductRouter);

app.get("/test", (req, res) => {
  console.log("test api");
  res.send("test api");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  mongoConnect();
  console.log(`Server running on ${port} port`);
});
