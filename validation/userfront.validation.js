// import package
import mongoose from "mongoose";

// import helpers
import isEmpty from "../config/isEmpty";

/**
 * User Login
 * URL : /api/login
 * METHOD: POST
 * BODY : email, phoneNo, phoneCode, loginType (1-mobile, 2-email), password
 */
export const userLoginValidation = (req, res, next) => {
  let errors = {},
    reqBody = req.body;
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
  let mobileRegex = /^\d+$/;

  if (isEmpty(reqBody.password)) {
    errors.password = "password field is required";
  }

  if (isEmpty(reqBody.email)) {
    errors.email = "Email field is required";
  } else if (!emailRegex.test(reqBody.email)) {
    errors.email = "Email is invalid";
  }

  if (!isEmpty(errors)) {
    return res.status(400).json({ errors: errors });
  }

  return next();
};

/**
 * Check Forgot Password
 * METHOD : POST
 * URL : /api/forgotPassword
 * BODY : email
 */
export const checkForgotPwdValidation = (req, res, next) => {
  let errors = {},
    reqBody = req.body;
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;

  if (isEmpty(reqBody.email)) {
    errors.email = "Email field is required";
  } else if (!emailRegex.test(reqBody.email)) {
    errors.email = "Email is invalid";
  }

  if (!isEmpty(errors)) {
    return res.status(400).json({ errors: errors });
  }

  return next();
};

/**
 * Change Password Validation
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
 */
export const changeForgotPwdValidation = (req, res, next) => {
  let errors = {},
    reqBody = req.body,
    //  passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{6,18}/g;
    passwordRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );

  if (!mongoose.Types.ObjectId.isValid(reqBody.userId)) {
    errors.messages = "Invalid URL";
  }

  if (isEmpty(reqBody.password)) {
    errors.password = "Password field is required";
  } else if (!passwordRegex.test(reqBody.password)) {
    errors.password =
      "Your password must contain atleast 8 character and small & capital letters, special character and number";
  }

  if (isEmpty(reqBody.confirmPassword)) {
    errors.confirmPassword = "Confirm password field is required";
  }

  if (
    !isEmpty(reqBody.password) &&
    !isEmpty(reqBody.confirmPassword) &&
    reqBody.password != reqBody.confirmPassword
  ) {
    errors.confirmPassword = "Passwords must match";
  }

  if (!isEmpty(errors)) {
    return res.status(400).json({ errors: errors });
  }

  return next();
};

/**
 * Change Password Validation
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
 */
export const updatepassword = (req, res, next) => {
  let errors = {},
    reqBody = req.body,
    passwordRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );

  console.log(reqBody, "reqBodyreqBody");
  if (isEmpty(reqBody.oldpassword)) {
    errors.oldpassword = "old password field is required";
  }

  if (isEmpty(reqBody.newpassword)) {
    errors.newpassword = "new password field is required";
  } else if (!passwordRegex.test(reqBody.newpassword)) {
    errors.newpassword =
      "Your password must contain atleast 8 character and small & capital letters, special character and number";
  }

  if (isEmpty(reqBody.confirmpassword)) {
    errors.confirmpassword = "Confirm password field is required";
  } else if (!passwordRegex.test(reqBody.confirmpassword)) {
    errors.confirmpassword =
      "Your password must contain atleast 8 character and small & capital letters, special character and number";
  }

  if (
    !isEmpty(reqBody.newpassword) &&
    !isEmpty(reqBody.confirmpassword) &&
    reqBody.newpassword != reqBody.confirmpassword
  ) {
    errors.confirmpassword = "Passwords must match";
  }
  console.log(errors, "errorserrorserrorserrors");
  if (!isEmpty(errors)) {
    return res.status(400).json({ errors: errors });
  }

  return next();
};

/**
 * Change Password Validation
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
 */
export const profilevalidation = (req, res, next) => {
  //console.log("2222222222222222222222222222222222222222222222222222222222222222222222222222")
  let errors = {},
    reqBody = req.body;
  console.log("reqbody", reqBody);
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
  let nameRegex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
  let mobileRegex = /^[7-9][0-9]{9}$/;
  // console.log(req.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

  if (isEmpty(reqBody.name)) {
    errors.name = "Name field is required";
  } else if (!nameRegex.test(reqBody.name)) {
    errors.name = "Please Enter Only Characters";
  } else if (reqBody.name.length < 5 || reqBody.name.length > 30) {
    errors.name = "Your Character must be 5 to 15 Character";
  }

  if (isEmpty(reqBody.email)) {
    errors.email = "Email field is required";
  } else if (!emailRegex.test(reqBody.email)) {
    errors.email = "Email is invalid";
  }

  if (isEmpty(reqBody.phonenumber)) {
    errors.phonenumber = "Mobile Number is required";
  } else if (!mobileRegex.test(reqBody.phonenumber)) {
    errors.phonenumber = "please Enter Valid Mobile Number";
  }

  // if (isEmpty(reqBody.designation)) {
  //   errors.designation = "Designation is required";
  // }

  // if (isEmpty(reqBody.detail)) {
  //   errors.detail = "Details is required";
  // }
  // console.log(errors,"++++++++++++++++++++++++++++++++++++++++++++++++++++");
  if (!isEmpty(errors)) {
    return res.status(400).json({ errors: errors });
  }

  return next();
};

/**
 * Change Password Validation
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
 */
export const uservalidation = (req, res, next) => {
  // console.log("2222222222222222222222222222222222222222222222222222222222222222222222222222")
  let errors = {},
    reqBody = req.body,
    nameRegex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/,
    emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/,
    phonenumberRegex = /^[7-9][0-9]{9}$/;
  // console.log(req.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

  if (isEmpty(reqBody.name)) {
    errors.name = "Name field is required";
  } else if (!nameRegex.test(reqBody.name)) {
    errors.name = "Please Enter Only Characters";
  } else if (reqBody.name.length < 5 || reqBody.name.length > 15) {
    errors.name = "Your Character must be 5 to 15 Character";
  }

  if (isEmpty(reqBody.email)) {
    errors.email = "Email field is required";
  } else if (!emailRegex.test(reqBody.email)) {
    errors.email = "Email is invalid";
  }

  if (isEmpty(reqBody.phonenumber)) {
    errors.phonenumber = "Mobile Number is required";
  } else if (!phonenumberRegex.test(reqBody.phonenumber)) {
    errors.phonenumber = "please Enter Valid Mobile Number";
  }

  if (isEmpty(reqBody.address1)) {
    errors.address1 = "Address is required";
  }

  if (isEmpty(reqBody.address2)) {
    errors.address2 = "State is required";
  }

  if (isEmpty(reqBody.pincode)) {
    errors.pincode = "Pincode is required";
  }

  if (isEmpty(reqBody.city)) {
    errors.city = "City is required";
  }

  if (isEmpty(reqBody.country)) {
    errors.country = "Country is required";
  }

  if (isEmpty(reqBody.company)) {
    errors.company = "Company is required";
  }

  if (isEmpty(reqBody.password) && reqBody.userId == undefined) {
    errors.password = "password is required";
  }

  // console.log(errors,"++++++++++++++++++++++++++++++++++++++++++++++++++++");
  if (!isEmpty(errors)) {
    return res.status(400).json({ errors: errors });
  }

  return next();
};

/**
 * Change Password Validation
 * METHOD : PUT
 * URL : /api/forgotPassword
 * BODY : password, confirmPassword, userId
 */
export const updateSettings = (req, res, next) => {
  let errors = {},
    reqBody = req.body,
    url =
      /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
    fees = /^\d*\.?\d*$/;

  console.log(reqBody);
  if (isEmpty(reqBody.facebook)) {
    errors.facebook = "This is required";
  }
  // else if(!(url.test(reqBody.facebook))){
  //     errors.facebook = "Please enter valid url";
  // }

  if (isEmpty(reqBody.twitter)) {
    errors.twitter = "This is required";
  }
  // else if(!(url.test(reqBody.twitter))){
  //     errors.twitter = "Please enter valid url";
  // }

  if (isEmpty(reqBody.telegram)) {
    errors.telegram = "This is required";
  }
  //  else if(!(url.test(reqBody.telegram))){
  //     errors.telegram = "Please enter valid url";
  // }

  if (isEmpty(reqBody.fees)) {
    errors.fees = "This is required";
  }

  if (isEmpty(reqBody.feesPlan)) {
    errors.feesPlan = "This is required";
  }
  // else if(!(fees.test(reqBody.fees))){
  //     errors.fees = "Please enter valid fees";
  // }

  console.log(errors, "++++++++++++++++++++++++++++++++++++++++++++++++++++");
  if (!isEmpty(errors)) {
    return res.status(400).json({ errors: errors });
  }

  return next();
};


export const manualbookingsvalidation = (req, res, next) => {
  //console.log("2222222222222222222222222222222222222222222222222222222222222222222222222222")
  let errors = {},
    reqBody = req.body;
  console.log("reqbody", reqBody);
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
  let nameRegex = /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
  let mobileRegex = /^[7-9][0-9]{9}$/;
  // console.log(req.body,"bodyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

  if (isEmpty(reqBody.name)) {
    errors.name = "Name field is required";
  } else if (!nameRegex.test(reqBody.name)) {
    errors.name = "Please Enter Only Characters";
  } else if (reqBody.name.length > 35) {
    errors.name = "Your Character must be 5 to 15 Character";
  }

  if (isEmpty(reqBody.phonenumber)) {
    errors.phonenumber = "Mobile Number is required";
  } else if (!mobileRegex.test(reqBody.phonenumber)) {
    errors.phonenumber = "please Enter Valid Mobile Number";
  }
  if (isEmpty(reqBody.pickup_location)) {
    errors.pickup_location = "Pickup Location is required";
  }

  if (isEmpty(reqBody.pickup_date)) {
    errors.pickup_date = "Pickup Date is required";
  }
  // if (isEmpty(reqBody.drop_location)) {
  //   errors.drop_location = "Pickup Location is required";
  // }
  // if (isEmpty(reqBody.drop_date)) {
  //   errors.drop_date = "Pickup Location is required";
  // }
  if (!isEmpty(reqBody.package) && (reqBody.package == "Rental")) {
    if (isEmpty(reqBody.rentalhour)) {
      errors.rentalhour = "Rental Hour is required";
    }
  }


  //   if (isEmpty(reqBody.password)) {
  //   errors.phonenumber = "Mobile Number is required";
  // } 
  // console.log(errors,"++++++++++++++++++++++++++++++++++++++++++++++++++++");
  if (!isEmpty(errors)) {
    return res.status(400).json({ errors: errors });
  }

  return next();
};