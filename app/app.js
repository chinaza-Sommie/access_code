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
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
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
    // res.render("login");
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
  if (req.session.uid) {
    res.render("residentPages/codeGenerator");
  } else {
    res.render("login");
    res.end();
  }
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
    "SELECT ct.Code_ID as codeId, ct.Code_Value as code, ct.Visitors_Name as visitors, ct.Code_Status as status, ut.User_Name as name from codes_table ct JOIN user_table ut on ut.User_ID = ct.User_ID WHERE ct.User_ID = ?";

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
  res.render("securityPages/verify-code");
});

// Route for verifying codes
app.post('/security/verify-code', async (req, res) => {
  const { code } = req.body;

  try {
    const sql = `
      SELECT Code_Value as code, Visitors_Name as visitors, Code_Status as status
      FROM codes_table
      WHERE Code_Value = ?;
    `;
    const result = await db.query(sql, [code]);

    if (result.length > 0) {
      // 找到匹配的验证码，准备更新代码状态为 "Used"
      const codes = new Codes(); // 创建 Codes 类实例

      // 异步更新代码状态
      const updateResult = codes.updateCodeStatus(code, 'Used');

      // 渲染页面并将查询结果和更新结果传递给模板
      res.render('securityPages/verify-code', { result: result[0], updateResult });
    } else {
      // 没有找到匹配的验证码
      res.render('securityPages/verify-code', { result: null });
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).send('Error verifying code');
  }
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


// Express search
app.get("/security/visitors-log/search", async function (req, res) {
  const searchTerm = req.query.searchTerm;

  try {
      const sql = `
          SELECT ct.Code_Value as code, ct.Visitors_Name as visitors, ct.Code_Status as status, ut.User_Name as name
          FROM codes_table ct
          JOIN user_table ut ON ut.User_ID = ct.User_ID
          WHERE ct.Visitors_Name LIKE ? OR ct.Code_Value LIKE ?
      `;
      const results = await db.query(sql, [`%${searchTerm}%`, `%${searchTerm}%`]);

      res.render("securityPages/visitors-log", { data: results });
  } catch (error) {
      console.error("Error searching visitors log:", error);
      res.status(500).send("Error searching visitors log");
  }
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
        // res.redirect("/resident/generate-code");
        res.redirect("/resident/accesslogs/1");
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
    var codex = await codes.generateCode(); // this generates the access codes
    var newCodeType = codex.toString(); // code converted to strting
    var codeArray = await codes.changeCodetoArray(newCodeType); // code converted to an array
    
    // Add the code to the database
    const result = await codes.addCode(codex,visitorsName,codeStatus,timeExpired);
    console.log(codes);
    
    
    if (result) {
      res.render("residentPages/codeGenerator", {successMessage: "Code generated successfully.", codegenerated:codeArray});
      // await codes.showModal();
      
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

app.post('/delete-log', async function(req, res) {
  params = req.body;


  try{
    var codeId = params.codeId;
    const userId = req.session.uid;
    const codes = new Codes(userId);
    console.log(codes);
    console.log(codeId);
    codeResult = await codes.deleteCode(codeId);

    res.redirect('/resident/accesslogs/'+userId);
   
    
  }
  catch (error){
    console.log(error);
  }
});

// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
