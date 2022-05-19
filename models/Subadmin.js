'use strict';
// var dbConn = require('./../config/connectdb');
import dbConn from "../config/connectdb";
import jwt from "jsonwebtoken";

// import lib
import config from "../config/config";
//subadmin object create
var subadmin = function (subadmin) {
    this.name = subadmin.name;
    this.email = subadmin.email;
    this.phonenumber = subadmin.phonenumber;
    this.designation = subadmin.designation;
    this.image = subadmin.image;
    this.password = subadmin.password;
    this.password_text = subadmin.password_text;
    this.createdAt = new Date();
};
subadmin.create = function (newEmp, result) {
    dbConn.query("INSERT INTO subadmin set ?", newEmp, function (err, res) {
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
subadmin.findById = function (id, result) {
    dbConn.query("Select * from subadmin where id = ? AND status = 1", id, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
subadmin.findAll = function (result) {
    dbConn.query("Select * from subadmin where status = 1", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('subadmin : ', res);
            result(null, res);
        }
    });
};
subadmin.update = function (id, subadmin, result) {
    dbConn.query("UPDATE subadmin SET name=?,email=?,phonenumber=?,designation=? WHERE id = ?", [subadmin.name, subadmin.email, subadmin.phonenumber, subadmin.designation, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};

subadmin.updatewithpassword = function (id, subadmin, result) {
    dbConn.query("UPDATE subadmin SET name=?,email=?,phonenumber=?,password=?,designation=? WHERE id = ?", [subadmin.name, subadmin.email, subadmin.phonenumber, subadmin.password, subadmin.designation, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
subadmin.delete = function (id, result) {
    dbConn.query("DELETE FROM subadmin WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};

subadmin.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
};

module.exports = subadmin;


