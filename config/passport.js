//import npm package
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

//import function
import config from "./config";

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretOrKey;

//import model
import Admin from "../models/admin";
import Subadmin from "../models/Subadmin";

export const subadminAuth = (passport) => {
  passport.use(
    "subadminAuth",
    new JwtStrategy(opts, async function (jwt_payload, done) {
      Subadmin.findById(jwt_payload.id, function (err, user) {
        if (err) {
          return done(err, false);
        } else if (user) {
          let data = {
            id: user[0].id,
            name: user[0].name,
          };
          return done(null, data);
        }
        return done(null, false);
      });
    })
  );
};

export const adminAuth = (passport) => {
  passport.use(
    "adminAuth",
    new JwtStrategy(opts, async function (jwt_payload, done) {
      Admin.findById(jwt_payload.id, function (err, user) {
        if (err) {
          return done(err, false);
        } else if (user) {
          let data = {
            id: user[0].id,
            name: user[0].name,
          };
          return done(null, data);
        }
        return done(null, false);
      });
    })
  );
};
