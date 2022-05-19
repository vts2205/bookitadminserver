// import package

// import modal
import Admin from "../models/Subadmin";
import Settings from "../models/settings";
import EmailTemplate from "../models/emailTemplate";
import manual_bookings from "../models/manual_bookings";
import { sendEmail } from "../config/emailGateway";
import bcrypt from "bcrypt";
import config from "../config/config";
import db from "../config/connectdb";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";

/**
 * User Login
 * URL : /api/login
 * METHOD: POST
 * BODY : email, phoneNo, phoneCode, loginType (1-mobile, 2-email), password
 */

export const userLogin = async (req, res) => {
  try {
    let { email, password } = req.body,
      checkUser;

    db.query('SELECT * FROM subadmin WHERE email = ?', [email.toLowerCase()], async (error, results) => {
      // console.log(results[0].password,password);
      if (!results.length || !(await bcrypt.compareSync(password, results[0].password))) {
        res.status(401).json({ success: false, message: "Email or password is incorrect" });
      } else {
        const id = results[0].id;
        let payloadData = {
          id: results[0].id,
        };
        let token = Admin.generateJWT(payloadData);
        let result = {
          id: results[0].id,
          email: results[0].email,
          name: results[0].name,
        };

        return res
          .status(200)
          .json({ success: true, message: "Login successfully", token, result });
      }

    })


  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};


/**
 * Check Forgot Password
 * METHOD : POST
 * URL : /api/forgotPassword
 * BODY : email
 */
export const checkForgotPassword = (req, res) => {
  let reqBody = req.body;
  Admin.findOne(
    {
      email: reqBody.email,
    },
    (err, userData) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, errors: { messages: "Error on server" } });
      }
      if (!userData) {
        return res
          .status(400)
          .json({ success: false, errors: { email: "Email is not exists" } });
      }

      let content = {
        name: userData.name,
        confirmMailUrl: `${config.siteUrl}/change-password/${userData._id}`,
      };
      // console.log("User_forgot", userData.email, content);
      mailTemplate("User_forgot", userData.email, content);
      return res.status(200).json({ success: true });
    }
  );
};

var storagekyc = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({
  storage: storagekyc,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([{ name: "photo", maxCount: 1 }]);

function checkFileType(file, cb) {
  const fileType = /jpeg|jpg|png|gif/;
  const extname = fileType.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = fileType.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb("Allow image  only");
  }
}

export const updateProfile = (req, res, next) => {
  //console.log(req.user.id,"-----------------------------------------------------------");
  const errors = {};
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      errors.photo = err;
      res.status(400).json({ success: false, errors: errors });
    } else {
      return next();
    }
  });
};

export const getuserdata = async (req, res) => {

  Admin.findById(req.user.id, (err, userData) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    delete userData[0].password;
    return res.status(200).json(userData[0]);
  });
};

export const updateSettings = async (req, res) => {
  try {
    var reqBody = req.body;
    console.log(reqBody);

    var test = await Settings.findOneAndUpdate(
      {},
      {
        address: reqBody.address,
        fees: reqBody.fees,
        twitter: reqBody.twitter,
        facebook: reqBody.facebook,
        telegram: reqBody.telegram,
        feesPlan: reqBody.feesPlan,
      }
    );
    return res
      .status(200)
      .json({ success: true, message: "Settings Updated Successfully" });
  } catch (err) {
    // console.log("----err", err)
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const profileupdate = async (req, res) => {
  try {
    var { name, email, phonenumber, designation } = req.body;
    db.query('SELECT * FROM subadmin WHERE email = ? AND id != ?', [email.toLowerCase(), req.user.id], async (error, results) => {
      console.log(results);
      if (results[0]) {
        return res
          .status(400)
          .json({ success: false, errors: { email: "Email is already exists" } });
      }

      if (!req.body.password) {
        let inputvalues = {
          name: name,
          email: email,
          phonenumber: phonenumber,
          designation: designation
        };


        Admin.update(req.user.id, new Admin(inputvalues), function (err, employee) {

          Admin.findById(req.user.id, (err, userData) => {
            if (err) {
              return res
                .status(200)
                .json({ success: false, errors: { messages: "Error on server" } });
            }
            delete userData[0].password;

            return res
              .status(200)
              .json({ success: true, message: "Profile Updated Successfully", values: userData[0] });
          });


        });
      } else {
        let salt = bcrypt.genSaltSync(10);

        let newhash = bcrypt.hashSync(req.body.password, salt);
        let inputvalues = {
          name: name,
          email: email,
          phonenumber: phonenumber,
          designation: designation,
          password: newhash
        };


        Admin.updatewithpassword(req.user.id, new Admin(inputvalues), function (err, employee) {
          Admin.findById(req.user.id, (err, userData) => {
            if (err) {
              return res
                .status(200)
                .json({ success: false, errors: { messages: "Error on server" } });
            }
            delete userData[0].password;

            return res
              .status(200)
              .json({ success: true, message: "Profile Updated Successfully", values: userData[0] });
          });

        });
      }
    });

  } catch (err) {
    console.log("----err", err);
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

/**
 * Change Password
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
 */
export const changeForgotPassword = async (req, res) => {
  console.log(req.body, "sdfdsfdsfsdfdsfdsfsd");
  try {
    let reqBody = req.body;

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(reqBody.password, salt);
    console.log(hash);
    if (!hash) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }

    let userData = await Admin.findOne({ _id: reqBody.userId });
    if (!userData) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "User not found" } });
    }

    userData.password = hash;
    await userData.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

/**
 * Change Password
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
 */
export const updatepassword = async (req, res) => {
  console.log(req.body, "sdfdsfdsfsdfdsfdsfsd");
  try {
    let reqBody = req.body;

    let userData = await Admin.findOne({ _id: req.user.id });

    var passwordStatus = bcrypt.compareSync(
      reqBody.oldpassword,
      userData.password
    );

    if (!passwordStatus) {
      return res
        .status(400)
        .json({ success: false, errors: { password: "Invalid Password" } });
    }

    let salt = bcrypt.genSaltSync(10);

    let newhash = bcrypt.hashSync(reqBody.newpassword, salt);
    if (!newhash) {
      return res
        .status(500)
        .json({ success: false, errors: { oldpassword: "Error on server" } });
    }

    userData.password = newhash;
    await userData.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const mailTemplate = async (identifier, email, contentData = {}) => {
  try {
    let emailTemplateData = await EmailTemplate.findOne({
      identifier: identifier,
    });
    if (!emailTemplateData) {
      return false;
    }

    let mailContent = {};
    mailContent["subject"] = emailTemplateData.subject;
    switch (identifier) {
      case "activate_register_user":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         * ##DATE## --> date
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_url##", contentData.confirmMailUrl)
          .replace("##DATE##", contentData.date);

        break;

      case "User_forgot":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_url##", contentData.confirmMailUrl);

        break;

      case "Withdraw_Reject":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_url##", contentData.confirmMailUrl);

        break;

      case "change_register_email":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_url##", contentData.confirmMailUrl);

        break;

      case "verify_new_email":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##templateInfo_url##", contentData.confirmMailUrl);

        break;
      case "Welcome_User":
        /**
         * ##templateInfo_name## --> name
         * ##templateInfo_url## --> confirmMailUrl
         */
        mailContent["template"] = emailTemplateData.content
          .replace("##templateInfo_name##", contentData.name)
          .replace("##message##", contentData.message);

        break;
    }

    sendEmail(email, mailContent);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};


export const getmanualbookingslist = async (req, res) => {

  manual_bookings.findAll(function (err, userData) {
    if (err) {
      console.log(err);
      return res
        .status(200)
        .json({ success: false, errors: { messages: "Error on server" } });
    }

    // delete userData[0].km;
    // delete userData[0].price;
    // delete userData[0].driver_name;
    // delete userData[0].start_otp;
    // delete userData[0].end_otp;
    // delete userData[0].cancelled_by;
    // delete userData[0].cancelled_reason;

    return res.status(200).json({ success: true, userValue: userData });
  });

};

export const createmanualbookings = async (req, res) => {
  try {
    // var reqBody = req.body;


    const newBookins = new manual_bookings(
      {
        name: req.body.name,
        phonenumber: req.body.phonenumber,
        pickup_location: req.body.pickup_location,
        pickup_date: req.body.pickup_date,
        drop_date: req.body.drop_date ? req.body.drop_date : null,
        package: req.body.package,
        rentalhour: req.body.rentalhour,
        cab: req.body.cab,
        subadmin_id: req.user.id
      }
    );

    await manual_bookings.create(newBookins, function (err, drivers) {

      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ success: false, errors: { messages: "Error on server" } });
      }
      if (req.body.drop_location.length) {
        var values = req.body.drop_location.map(e => {
          const d = [drivers, e];
          return d;
        })

        console.log(values);
        db.query("INSERT INTO manualbooking_droplocations (booking_id, drop_location) VALUES ?", [values], function (err) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ success: false, errors: { messages: "Error on server" } });
          }
          // return true;
        });
      }

      return res
        .status(200)
        .json({ success: true, message: "Booking Created Successfully" });
    });






  } catch (err) {
    // console.log("----err", err)
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};


export const getprogressrides = async (req, res) => {


  db.query("Select id,name,phonenumber,pickup_location,pickup_date,drop_location,drop_date,package,rentalhour,cab,driver_name,start_otp,end_otp from manual_bookings where trip_status = ?", ["Inprogress"], function (err, result) {
    if (err) {
      return res
        .status(200)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    else {
      // delete userData[0].km;
      // delete userData[0].price;
      // delete userData[0].driver_name;
      // delete userData[0].start_otp;
      // delete userData[0].end_otp;
      // delete userData[0].cancelled_by;
      // delete userData[0].cancelled_reason;
      return res.status(200).json({ success: true, userValue: result });
    }
  });

};

export const getSuccessrides = async (req, res) => {


  db.query("Select id,name,phonenumber,pickup_location,pickup_date,drop_location,drop_date,package,rentalhour,trip_status,cab,driver_name,price from manual_bookings where trip_status = ?", ["Success"], function (err, result) {
    if (err) {
      return res
        .status(200)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    else {

      return res.status(200).json({ success: true, userValue: result });
    }
  });

};

export const getCancelledrides = async (req, res) => {


  db.query("Select id,name,phonenumber,pickup_location,pickup_date,drop_location,drop_date,package,trip_status,rentalhour,cab,driver_name,cancelled_by,cancelled_reason from manual_bookings where trip_status = ?", ["Cancelled"], function (err, result) {
    if (err) {
      console.log(err)
      return res
        .status(200)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    else {

      return res.status(200).json({ success: true, userValue: result });
    }
  });

};

export const getridebooked = async (req, res) => {


  db.query("Select id,name,phonenumber,pickup_location,pickup_date,drop_location,drop_date,package,rentalhour,trip_status,cab,km,price from manual_bookings", function (err, result) {
    if (err) {
      return res
        .status(200)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    else {

      return res.status(200).json({ success: true, userValue: result });
    }
  });

};
