'use strict';
// var dbConn = require('./../config/connectdb');
import dbConn from "../config/connectdb";
import jwt from "jsonwebtoken";

// import lib
import config from "../config/config";
//manual_bookings object create
var manual_bookings = function (manual_bookings) {
    this.name = manual_bookings.name;
    this.phonenumber = manual_bookings.phonenumber;
    this.pickup_location = manual_bookings.pickup_location;
    this.pickup_date = manual_bookings.pickup_date;
    this.drop_location = manual_bookings.drop_location;
    this.drop_date = manual_bookings.drop_date;
    this.package = manual_bookings.package;
    this.rentalhour = manual_bookings.rentalhour;
    this.cab = manual_bookings.cab;
    this.subadmin_id = manual_bookings.subadmin_id;
};
manual_bookings.create = function (newEmp, result) {
    dbConn.query("INSERT INTO manual_bookings set ?", newEmp, function (err, res) {
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
manual_bookings.findById = function (id, result) {
    dbConn.query("Select * from manual_bookings where id = ? AND status = 1", id, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};
manual_bookings.findAll = function (result) {
    dbConn.query("Select * from manual_bookings where status = 1", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            console.log('manual_bookings : ', res);
            result(null, res);
        }
    });
};
manual_bookings.update = function (id, manual_bookings, result) {
    dbConn.query("UPDATE manual_bookings SET name=?,phonenumber=?,pickup_location=?,pickup_date=?,drop_location=?,drop_date=? WHERE id = ?", [manual_bookings.name, manual_bookings.phonenumber, manual_bookings.pickup_location, manual_bookings.pickup_date, manual_bookings.drop_location, manual_bookings.drop_date, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
manual_bookings.delete = function (id, result) {
    dbConn.query("DELETE FROM manual_bookings WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};

manual_bookings.generateJWT = function (payload) {
    var token = jwt.sign(payload, config.secretOrKey);
    return `Bearer ${token}`;
};

module.exports = manual_bookings;


