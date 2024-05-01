// Import express.js
const express = require("express");

const { User } = require("./models/users");
const { Alerts } = require("./models/alerts");
const { Codes } = require("./models/codes");

// Create express app
var app = express();

// accept form input
app.use(express.urlencoded({ extended: true }));

// Sessions to login
var session = require("express-session");
app.use(
  session({
    secret: "secretkeysdfjsflyoifasd",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// views connection
app.set("view engine", "pug");
app.set("views", "./app/views");

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require("./services/db");

// Create a route for root - /
app.get("/", function (req, res) {
  res.render("landingpage");
});

// code generation
app.get("/code_generator", function (req, res) {
  res.render("residentPages/codeGenerator");
});

// Route for login page
app.get("/login", function (req, res) {
  console.log(req.session);
  if (req.session.uid) {
    res.redirect("/resident/generate-code");
  } else {
    res.render("login");
    res.end();
  }
});

// Route for landing page
app.get("/landing_page", function (req, res) {
  res.render("landingpage");
});

// ------ RESIDENT ROUTES ----

// Route for Generating code
app.get("/resident/generate-code", function (req, res) {
  res.render("residentPages/codeGenerator");

  // console.log(req.session);
  // if (req.session.uid) {
  // 	res.render("residentPages/codeGenerator");
  // } else {
  // 	res.render("login", {errorMessage: 'Please Login to view that page' });
  //   res.end();
  // }
});

// Route for Checking History logs
app.get("/resident/accesslogs/:id", function (req, res) {
  var resLog = req.params.id;
  var accesssql =
    "SELECT ct.Code_Value as code, ct.Visitors_Name as visitors, ct.Code_Status as status, ut.User_Name as name from codes_table ct JOIN user_table ut on ut.User_ID = ct.User_ID WHERE ct.User_ID = ?";

  db.query(accesssql, [resLog]).then((results) => {
    res.render("residentPages/access-logs", { data: results });
  });
});

// Route for Resident profile
app.get("/profile/:id", function (req, res) {
  var resProfile = req.params.id;

  var residentSql = "SELECT * FROM user_table WHERE User_ID = ?";

  db.query(residentSql, [resProfile]).then((results) => {
    if (results[0].User_role == "Resident") {
      res.render("residentPages/resident-profile", { data: results[0] });
    } else {
      res.render("securityPages/profile-security", { data: results[0] });
    }
  });
});

// ---- SECURITY ROUTES ----

// Route for registering residents
app.get("/security/register-resident", function (req, res) {
  res.render("securityPages/registerResident");
});

// Route for verifying residents codes
app.get("/security/verify-code", function (req, res) {
  res.render("securityPages/verifycode");
});

// Route for send alert
app.get("/security/alert", function (req, res) {
  res.render("securityPages/alert");
});

app.get("/security/resident-list", function (req, res) {
  var userTableSql = "SELECT * FROM user_table WHERE User_role = 'Resident'";
  db.query(userTableSql).then((results) => {
    res.render("securityPages/resident_list", { data: results });
  });
  // res.render("securityPages/resident_list");
});

// VISITORS LOG PAGE (SECURITY)
app.get("/security/visitors-log", function (req, res) {
  var sql =
    "SELECT ct.Code_Value as code, ct.Visitors_Name as visitors, ct.Code_Status as status, ut.User_Name as name from codes_table ct JOIN user_table ut on ut.User_ID = ct.User_ID";

  db.query(sql).then((results) => {
    res.render("securityPages/visitors-log", { data: results });
    // console.log(results)
  });
});

app.post("/send-alert", async function (req, res) {
  params = req.body;
  if (params.message == "") {
    res.render("securityPages/alert", {
      errorMessage: "Oops!! This field cannot be empty. Try again.",
    });
  } else {
    try {
      params = req.body;

      senderId = 1;
      alerts = new Alerts(senderId);
      await alerts.postAlerts(params.message, senderId);
      console.log(alerts);
      res.render("securityPages/alert", {
        successMessage: "Alert message has been sent successfuly!",
      });
    } catch (err) {
      res.render("securityPages/alert", { errorMessage: err.message });
    }
  }
});

app.post("/login-auth", async function (req, res) {
  params = req.body;
  var user = new User(params.email);
  try {
    uId = await user.getIdFromEmail();

    if (uId) {
      match = await user.authenticate(params.password);

      if (match) {
        req.session.uid = uId;
        req.session.loggedIn = true;
        console.log(req.session.id);
        res.redirect("/resident/generate-code");
      } else {
        res.render("login", {
          errorMessage: "Oops!! Invalid Email/Password. Try again.",
        });
      }
    } else {
      res.render("login", {
        errorMessage: "Oops!! Invalid Email/Password. Try again.",
      });
    }
  } catch (err) {
    console.error(`Error while comparing `, err.message);
  }
});

app.post("/access-code-generator", async function (req, res) {
  params = req.body;
  var visitorsName = params.name;
  var purpose = params.purpose;
  var location = params.location;
  var timeExpired = params.timeExpired;
  var codeStatus = "Used";
  var codeValue = 5000;
  // Assuming you have session information to retrieve user ID
  const userId = req.session.uid;

  try {
    // Create a new instance of Code
    const codes = new Codes(userId);
    console.log(timeExpired);
    // Add the code to the database
    const result = await codes.addCode(
      codeValue,
      visitorsName,
      codeStatus,
      timeExpired
    );
    var codex = await codes.generateCode();
    console.log;
    if (result) {
      res.render("residentPages/codeGenerator", {
        successMessage: "Code generated successfully.",
      });
    } else {
      res.render("residentPages/codeGenerator", {
        errorMessage: "Failed to generate code. Please try again.",
      });
    }
  } catch (err) {
    console.error(`Error while generating code: `, err.message);
    res.render("residentPages/codeGenerator", {
      errorMessage:
        "An error occurred while generating the code. Please try again later.",
    });
  }  
});


app.post("/verification", async function (req, res) {
  const params = req.body;
  const codeValue = params.name; // Assuming the input field name is 'name'

  // Regular expression pattern to match 6 digits with no spaces
  const codePattern = /^\d{6}$/;

  try {
      // Check if the codeValue matches the pattern
      if (codePattern.test(codeValue)) {
          // Create an instance of the Codes class
        const codes = new Codes();

      // Call getCodeValue to verify the code
        const verifiedCodeValue = await codes.getCodeValue(codeValue);

      // If code is found, render a success message or redirect
        res.render("securityPages/verifycode", { successMessage: "Code verified successfully" });
      } else {
        res.render("securityPages/verifycode", { errorMessage: err.message });
      }
 
  } catch (err) {
      // If code is not found, or there's an error, render an error message or redirect
      res.render("securityPages/verifycode", { errorMessage: err.message });
  }
});



// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
