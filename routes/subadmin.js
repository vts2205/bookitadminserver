//  import packages
import express from "express";
import passport from "passport";

// import controllers
import * as adminCtrl from "../controllers/subadmin.controller";

//validations
import * as userValidation from "../validation/userfront.validation";

const router = express();
const passportAuth = passport.authenticate("subadminAuth", { session: false });
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

router.route("/manualbookings")
  .get(passportAuth, adminCtrl.getmanualbookingslist)
  .post(passportAuth,
    userValidation.manualbookingsvalidation,
    adminCtrl.createmanualbookings);

router.route("/progressrides")
  .get(passportAuth, adminCtrl.getprogressrides);

router.route("/successrides")
  .get(passportAuth, adminCtrl.getSuccessrides);

router.route("/cancelledrides")
  .get(passportAuth, adminCtrl.getCancelledrides);

router.route("/ridebooked")
  .get(passportAuth, adminCtrl.getridebooked);



router
  .route("/updateSettings")
  .post(userValidation.updateSettings, adminCtrl.updateSettings);

router
  .route("/forgotPassword")
  .post(userValidation.checkForgotPwdValidation, adminCtrl.checkForgotPassword)
  .put(
    userValidation.changeForgotPwdValidation,
    adminCtrl.changeForgotPassword
  );

router
  .route("/updatepassword")
  .post(passportAuth, userValidation.updatepassword, adminCtrl.updatepassword);


export default router;
