'use strict';
// var dbConn = require('./../config/connectdb');
import dbConn from "../config/connectdb";
import jwt from "jsonwebtoken";

// import lib
import config from "../config/config";
//admin object create
var admin = function (admin) {
    this.name = admin.name;
    this.email = admin.email;
    this.phonenumber = admin.phonenumber;
    this.password = admin.password;
    this.password_text = admin.password_text;
    this.createdAt = new Date();

};
admin.create = function (newEmp, result) {
    dbConn.query("INSERT INTO admin set ?", newEmp, function (err, res) {
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
admin.findById = function (id, result) {
    dbConn.query("Select * from admin where id = ? ", id, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
admin.findAll = function (result) {
    dbConn.query("Select * from admin", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('admin : ', res);
            result(null, res);
        }
    });
};
admin.update = function (id, admin, result) {
    dbConn.query("UPDATE admin SET name=?,email=?,phonenumber=? WHERE id = ?", [admin.name, admin.email, admin.phonenumber, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
admin.updatewithpassword = function (id, admin, result) {
    dbConn.query("UPDATE admin SET name=?,email=?,phonenumber=?,password=? WHERE id = ?", [admin.name, admin.email, admin.phonenumber, admin.password, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
admin.delete = function (id, result) {
    dbConn.query("DELETE FROM admin WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};

admin.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
};

module.exports = admin;


