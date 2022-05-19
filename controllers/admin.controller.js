// import package

// import modal
import Admin from "../models/admin";
import subadmin from "../models/Subadmin";
import drivers from "../models/driver";
import Settings from "../models/settings";
import EmailTemplate from "../models/emailTemplate";
import { sendEmail } from "../config/emailGateway";
import bcrypt from "bcrypt";
import config from "../config/config";
import db from "../config/connectdb";
import multer from "multer";
import path from "path";
// import mongoose from "mongoose";

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

    db.query('SELECT * FROM admin WHERE email = ?', [email.toLowerCase()], async (error, results) => {
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

  db.query('SELECT * FROM admin WHERE email = ?', [reqBody.email.toLowerCase()], async (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    if (!results[0]) {
      return res
        .status(400)
        .json({ success: false, errors: { email: "Email is not exists" } });
    }

    let content = {
      name: results[0].name,
      confirmMailUrl: `${config.siteUrl}/change-password/${results[0]._id}`,
    };
    // console.log("User_forgot", userData.email, content);
    mailTemplate("User_forgot", results[0].email, content);
    return res.status(200).json({ success: true });

  })

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
var storagekyc1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/user");
  },
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});

var upload1 = multer({
  storage: storagekyc1,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([{ name: "Photofile", maxCount: 1 }]);

export const adduser = (req, res, next) => {
  //console.log(req.user.id,"-----------------------------------------------------------");
  const errors = {};
  upload1(req, res, (err) => {
    if (err) {
      console.log("err", err);
      errors.photo = err;
      res.status(400).json({ success: false, errors: errors });
    } else {
      return next();
    }
  });
};

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

export const getuser = async (req, res) => {
  subadmin.findOne({ _id: req.params.id, status: 1 }, (err, userData) => {
    if (err) {
      return res
        .status(200)
        .json({ success: false, errors: { messages: "Error on server" } });
    }

    return res.status(200).json({ success: true, userValue: userData });
  });
};


export const getprogressrides = async (req, res) => {


  db.query("Select * from car_shifts where trip_status = ?", ["Inprogress"], function (err, result) {
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

export const getSuccessrides = async (req, res) => {


  db.query("Select * from car_shifts where trip_status = ?", ["Success"], function (err, result) {
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


  db.query("Select * from car_shifts where trip_status = ?", ["Cancelled"], function (err, result) {
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

export const getridehistory = async (req, res) => {


  db.query("Select * from car_shifts", function (err, result) {
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

export const getuerslist = async (req, res) => {


  db.query("Select * from users", function (err, result) {
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
export const getsubadminlist = async (req, res) => {

  subadmin.findAll(function (err, userData) {
    if (err) {
      console.log(err);
      return res
        .status(200)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    delete userData[0].password;
    // delete userData[0].password_text;
    return res.status(200).json({ success: true, userValue: userData });
  });

};

export const createsubadmin = async (req, res) => {
  try {
    // var reqBody = req.body;
    db.query('SELECT * FROM subadmin WHERE email = ?', [req.body.email.toLowerCase()], async (error, results) => {
      if (results[0]) {
        return res
          .status(400)
          .json({ success: false, errors: { email: "Email is already exists" } });
      }

      req.body.password_text = req.body.password;
      let salt = bcrypt.genSaltSync(10);

      let newhash = bcrypt.hashSync(req.body.password, salt);
      req.body.password = newhash;

      const new_subadmin = new subadmin(req.body);

      subadmin.create(new_subadmin, function (err, subadmin) {
        return res
          .status(200)
          .json({ success: true, message: "Subadmin Created Successfully" });
      });
    });

  } catch (err) {
    // console.log("----err", err)
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const uploadfile = async (req, res) => {
  try {

    // const file = req.file
    if (!(req.files && req.files.Photofile)) {
      console.log("no file")
      return res
        .status(400)
        .json({ success: false, errors: 'Please upload a file' });
    }


    req.body.image =
      req.files && req.files.Photofile
        ? req.files.Photofile[0].filename
        : "";


    return res
      .status(200)
      .json({ success: true, fileUrl: req.body.image });


  } catch (err) {
    console.log("----err", err)
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};



export const getdriverslist = async (req, res) => {

  drivers.findAll(function (err, userData) {
    if (err) {
      console.log(err);
      return res
        .status(200)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    // delete userData[0].password;
    // delete userData[0].password_text;
    return res.status(200).json({ success: true, userValue: userData });
  });

};

export const createdriver = async (req, res) => {
  try {
    // var reqBody = req.body;
    db.query('SELECT * FROM drivers WHERE email = ?', [req.body.email.toLowerCase()], async (error, results) => {
      if (results) {
        return res
          .status(400)
          .json({ success: false, errors: { email: "Email is already exists" } });
      }


      //     let salt = bcrypt.genSaltSync(10);
      // req.body.passwordtext=req.body.password;
      //     let newhash = bcrypt.hashSync(req.body.password, salt);
      //     req.body.password=newhash;
      const new_drivers = new drivers(req.body);

      drivers.create(new_drivers, function (err, drivers) {
        return res
          .status(200)
          .json({ success: true, message: "drivers Created Successfully" });
      });
    });

  } catch (err) {
    // console.log("----err", err)
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const dashboardRidesCounts = async (req, res) => {
  try {
    // var reqBody = req.body;

    // var reqBody = req.body;
    db.query('SELECT count(*) as total FROM cab_shifts WHERE email = ?', [req.body.email.toLowerCase()], async (error, results) => {
      if (results[0]) {
        return res
          .status(400)
          .json({ success: false, errors: { email: "Email is already exists" } });
      }


      //     let salt = bcrypt.genSaltSync(10);
      // req.body.passwordtext=req.body.password;
      //     let newhash = bcrypt.hashSync(req.body.password, salt);
      //     req.body.password=newhash;
      const new_drivers = new drivers(req.body);

      drivers.create(new_drivers, function (err, drivers) {
        return res
          .status(200)
          .json({ success: true, message: "drivers Created Successfully" });
      });
    });


  } catch (err) {
    // console.log("----err", err)
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const deleteuser = async (req, res) => {
  try {
    let deleteuser = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { status: 0 },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Profile Updated Successfully" });
  } catch (err) {
    console.log("----err", err);
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const updateuser = async (req, res) => {
  try {
    var reqBody = req.body;
    // console.log(req.body,"fghfghfghfghfghfghfghfghfghfghfghfghfghfghfgh");
    let checkUser = await User.findOne({
      email: reqBody.email,
      deleted: 1,
      _id: { $ne: new mongoose.Types.ObjectId(reqBody.userId) },
    });
    let checkphoneNumber = await User.findOne({
      phonenumber: reqBody.phonenumber,
      deleted: 1,
      _id: { $ne: new mongoose.Types.ObjectId(reqBody.userId) },
    });
    if (checkUser) {
      if (checkUser.email == reqBody.email) {
        return res
          .status(400)
          .json({ success: false, errors: { email: "Email already exists" } });
      }
    }
    if (checkphoneNumber) {
      if (checkphoneNumber.phonenumber == reqBody.phonenumber) {
        return res.status(400).json({
          success: false,
          errors: { phonenumber: "Phone Number already exists" },
        });
      }
    }

    let checkUser1 = await User.findOne({
      _id: new mongoose.Types.ObjectId(reqBody.userId),
    });

    let salt = bcrypt.genSaltSync(10);

    let newhash = bcrypt.hashSync(req.body.password, salt);

    console.log(checkUser1);
    var test = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(reqBody.userId) },
      {
        name: reqBody.name,
        email: reqBody.email,
        phonenumber: reqBody.phonenumber,
        address1: reqBody.address1,
        address2: reqBody.address2,
        pincode: reqBody.pincode,
        city: reqBody.city,
        country: reqBody.country,
        password: req.body.password ? newhash : checkUser1.password,
        company: reqBody.company,
        Photofile:
          req.files && req.files.Photofile
            ? req.files.Photofile[0].filename
            : checkUser1.Photofile,
      }
    );
    return res
      .status(200)
      .json({ success: true, message: "Profile Updated Successfully" });
  } catch (err) {
    console.log("----err", err);
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
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
    var { name, email, phonenumber } = req.body;

    db.query('SELECT * FROM admin WHERE email = ? AND id != ?', [email.toLowerCase(), req.user.id], async (error, results) => {
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
          password: newhash,
          password_text: req.body.password
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

export const useradd = async (req, res) => {
  console.log(req.body, "kkkkkkkkkkkkkkkkkk");
  try {
    let salt = bcrypt.genSaltSync(10);

    let newhash = bcrypt.hashSync(req.body.password, salt);

    var reqBody = req.body;
    let checkUser = await User.findOne({ email: reqBody.email, deleted: 1 });
    let checkphoneNumber = await User.findOne({
      phonenumber: reqBody.phonenumber,
      deleted: 1,
    });
    if (checkUser) {
      if (checkUser.email == reqBody.email) {
        return res
          .status(400)
          .json({ success: false, errors: { email: "Email already exists" } });
      }
    }
    if (checkphoneNumber) {
      if (checkphoneNumber.phonenumber == reqBody.phonenumber) {
        return res.status(400).json({
          success: false,
          errors: { phonenumber: "Phone Number already exists" },
        });
      }
    }

    if (reqBody.Photofile == "") {
      let newUserData = new User({
        name: reqBody.name,
        email: reqBody.email,
        phonenumber: reqBody.phonenumber,
        address1: reqBody.address1,
        address2: reqBody.address2,
        pincode: reqBody.pincode,
        city: reqBody.city,
        country: reqBody.country,
        Photofile: reqBody.Photofile,
        password: newhash,
        company: reqBody.company,
      });

      let newDoc = await newUserData.save();
    } else {
      let newUserData = new User({
        name: reqBody.name,
        email: reqBody.email,
        phonenumber: reqBody.phonenumber,
        address1: reqBody.address1,
        address2: reqBody.address2,
        pincode: reqBody.pincode,
        city: reqBody.city,
        country: reqBody.country,
        password: reqBody.password ? newhash : checkUser.password,
        company: reqBody.company,
        Photofile: req.files.Photofile
          ? req.files.Photofile[0].filename
          : checkUser.Photofile,
      });

      let newDoc = await newUserData.save();
    }
    return res
      .status(200)
      .json({ success: true, message: "Profile Updated Successfully" });
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

    db.query('SELECT * FROM email_templates WHERE identifier = ?', [identifier], async (error, results) => {

      if (!results[0]) {
        return false;
      }
      const emailTemplateData = results[0];


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



    });



  } catch (err) {
    console.log(err);
    return false;
  }
};
