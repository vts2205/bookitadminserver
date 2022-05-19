// import package
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// import lib
import config from "../config/config";

const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
  fees: {
    type: Number,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  feesPlan: {
    type: Number,
    default: "",
  },
  twitter: {
    type: String,
    default: "",
  },
  telegram: {
    type: String,
    default: "",
  },
  facebook: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

SettingsSchema.methods.generateJWT = function (payload) {
  var token = jwt.sign(payload, config.secretOrKey);
  return `Bearer ${token}`;
};

const Settings = mongoose.model("settings", SettingsSchema, "settings");

export default Settings;
