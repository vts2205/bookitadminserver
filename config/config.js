let key = {};

if (process.env.NODE_ENV === "production") {
  key = {
    secretOrKey: "test",
    host: "localhost",
    username: "root",
    password: "bookit123$%^",
    databasename: "bookit_admin",
    port: 8800,
    siteUrl: "",

    // Email Gateway
    emailGateway: {
      fromMail: "",
      nodemailer: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "", // generated ethereal user
          pass: "", // generated ethereal password
        },
      },
    },
  };
} else {
  console.log("Set Development Config");
  key = {
    secretOrKey: "test",
    host: "localhost",
    username: "root",
    password: "bookit123$%^",
    databasename: "bookit_admin",
    port: 2076,
    siteUrl: "http://localhost:3000",
    // Email Gateway
    emailGateway: {
      fromMail: "testingdemo543@gmail.com",
      nodemailer: {
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "testingdemo543@gmail.com", // generated ethereal user
          pass: "Testing@1234", // generated ethereal password
        },
      },
    },
  };
}

export default key;
