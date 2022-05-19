'use strict';
// var dbConn = require('./../config/connectdb');
import dbConn from "../config/connectdb";
import jwt from "jsonwebtoken";

// import lib
import config from "../config/config";
//driver object create
var driver = function (driver) {
    this.name = driver.name;
    this.email = driver.email;
    this.phonenumber = driver.phonenumber;
    this.location = driver.location;
    this.createdAt = new Date();
};
driver.create = function (newEmp, result) {
    dbConn.query("INSERT INTO driver set ?", newEmp, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};
driver.findById = function (id, result) {
    dbConn.query("Select * from driver where id = ? AND status = 1", id, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
driver.findAll = function (result) {
    dbConn.query("Select * from driver where status = 1", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('driver : ', res);
            result(null, res);
        }
    });
};
driver.update = function (id, driver, result) {
    dbConn.query("UPDATE driver SET name=?,email=?,phonenumber=?,location=? WHERE id = ?", [driver.name, driver.email, driver.phonenumber, driver.location, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
driver.delete = function (id, result) {
    dbConn.query("DELETE FROM driver WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};

driver.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
};

module.exports = driver;


