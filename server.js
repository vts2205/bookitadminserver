// import packages
import express from "express";
import cors from "cors";
import https from "https";
import http from "http";
import bodyParser from "body-parser";
// import mongoose from "mongoose";
import morgan from "morgan";
import passport from "passport";
import path from "path";
import mysql from "mysql";

// import routes
import admin from "./routes/admin";
import subadmin from "./routes/subadmin";

// config
import config from "./config/config";

const app = express();
const server = http.createServer(app);

// compress responses
app.use(morgan("dev"));
app.options("*", cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());
// include passport stratagy
require("./config/passport").subadminAuth(passport);
require("./config/passport").adminAuth(passport);

app.use("/", express.static(path.join(__dirname, "public")));

// Database connection
const db = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.databasename
});

db.connect((error) => {
  if (error) {
    console.log(error)
  } else {
    console.log("MYSQL Connected...")
  }
})

app.use("/admin", admin);
app.use("/subadmin", subadmin);


app.get("/", (req, res) => {
  return res.send("User Service Working");
});

server.listen(config.port, function () {
  console.log(`server is running on port ${config.port}`);
});
