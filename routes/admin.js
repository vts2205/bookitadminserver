//  import packages
import express from "express";
import passport from "passport";

// import controllers
import * as adminCtrl from "./../controllers/admin.controller";

//validations
import * as userValidation from "./../validation/user.validation";

const router = express();
const passportAuth = passport.authenticate("adminAuth", { session: false });
// Admin Repot
router
  .route("/login")
  .post(userValidation.userLoginValidation, adminCtrl.userLogin);
router.route("/getmyprofiledata").get(passportAuth, adminCtrl.getuserdata);
router
  .route("/updateProfile")
  .put(
    passportAuth,
    userValidation.profilevalidation,
    adminCtrl.profileupdate
  );


router
  .route("/forgotPassword")
  .post(userValidation.checkForgotPwdValidation, adminCtrl.checkForgotPassword)
  .put(
    userValidation.changeForgotPwdValidation,
    adminCtrl.changeForgotPassword
  );

router
  .route("/uploadfile")
  .post(adminCtrl.adduser, adminCtrl.uploadfile)

//Sub admin add,list
router.route("/subadmin")
  .get(passportAuth, adminCtrl.getsubadminlist)
  .post(passportAuth,
    userValidation.subadminprofilevalidation,
    adminCtrl.createsubadmin);
// router.route("/getuser/:id").get(passportAuth,adminCtrl.getuser);
// router.route("/deleteuser/:id").put(passportAuth,adminCtrl.deleteuser);

//Driver add,list

router.route("/driver")
  .get(passportAuth, adminCtrl.getdriverslist)
  .post(passportAuth,
    userValidation.driverprofilevalidation,
    adminCtrl.createdriver);




// router
//   .route("/addsubadmin")
//   .put(
//     passportAuth,
//     userValidation.subadminprofilevalidation,
//     adminCtrl.profileupdate
//   );



router
  .route("/updateuser")
  .post(
    passportAuth,
    adminCtrl.adduser,
    userValidation.uservalidation,
    adminCtrl.updateuser
  );
router
  .route("/updateSettings")
  .post(userValidation.updateSettings, adminCtrl.updateSettings);
router
  .route("/adduser")
  .post(
    passportAuth,
    adminCtrl.adduser,
    userValidation.uservalidation,
    adminCtrl.useradd
  );


router
  .route("/updatepassword")
  .post(passportAuth, userValidation.updatepassword, adminCtrl.updatepassword);

router.route("/progressrides")
  .get(passportAuth, adminCtrl.getprogressrides);

router.route("/successrides")
  .get(passportAuth, adminCtrl.getSuccessrides);

router.route("/cancelledrides")
  .get(passportAuth, adminCtrl.getCancelledrides);


router.route("/ridehistory")
  .get(passportAuth, adminCtrl.getridehistory);


export default router;
