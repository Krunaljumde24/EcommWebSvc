const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const { AuthRouter } = require("./router/AuthRouter");
const mongoConnect = require("./database/mongooseConnection.js");
const session = require("express-session");

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "my secret string",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 60000 * 2,
    },
  })
);

app.use(cors({ origin: "http://localhost:5173" }));
app.use("/auth/api", AuthRouter);

app.get("/test", (req, res) => {
  console.log("test api");
  res.send("test api");
});

app.listen(8080, () => {
  mongoConnect();
  console.log("Server running on 8080 port");
});
