// Import express.js
const express = require("express");
var session = require("express-session");

const { User } = require("./models/users");
const { Alerts } = require("./models/alerts");
const { Codes } = require("./models/codes");

// Create express app
var app = express();

// accept form input
app.use(express.urlencoded({ extended: true }));

// Sessions to login

app.use(
  session({
    secret: "secretkeysdfjsflyoifasd",
    resave: true,
    saveUninitialized: false,
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

// Route for login page
app.get("/login", function (req, res) {
  
  if (req.session.uid && (req.session.userrole == "Resident")) {
    res.redirect("/resident/generate-code");
  } else if(req.session.uid && (req.session.userrole == "Security")) {
    res.redirect("/security/register-resident");
  }else{
    res.render("login");
    res.end();
  }
});

// ------ RESIDENT ROUTES ----

// Route for Generating code
app.get("/resident/generate-code", function (req, res) {
  if (req.session.uid && (req.session.userrole == "Resident")) {
    res.render("residentPages/codeGenerator");
  } else {
    res.redirect("/login");
    res.end();
  }
  
});

// Route for Checking History logs
app.get("/resident/accesslogs", function (req, res) {

  if (req.session.uid && (req.session.userrole == "Resident")) {

    var resLog = req.session.uid;
    var accesssql =
      "SELECT ct.Code_ID as codeId, ct.Code_Value as code, ct.Visitors_Name as visitors, ct.Code_Status as status, ut.User_Name as name from codes_table ct JOIN user_table ut on ut.User_ID = ct.User_ID WHERE ct.User_ID = ?";

    db.query(accesssql, [resLog]).then((results) => {
      res.render("residentPages/access-logs", { data: results });
    });
    
  } else {
    res.redirect("/login");
    res.end();
  }
  
  
});


app.get("/profile", function (req, res) {
  var resProfile = req.session.uid;

  var residentSql = "SELECT * FROM user_table WHERE User_ID = ?";

  db.query(residentSql, [resProfile]).then((results) => {
    console.log(results[0]);
    if (results[0].User_role == "Resident") {
      
      res.render("residentPages/resident-profile", { data: results[0] });
    } else {
      res.render("securityPages/profile-security", { data: results[0] });
    }
  });
});

app.get("/resident/notifications", function (req, res) {

  if (req.session.uid && (req.session.userrole == "Resident")) {
    var alerts = "SELECT * FROM alerts";
    db.query(alerts).then((results) => {
      res.render("residentPages/resident_notifications", { data: results });
      
    });
  } else {
    res.redirect("/login");
    res.end();
  }
 
});


// ---- SECURITY ROUTES ----

// Route for registering residents
app.get("/security/register-resident", function (req, res) {
  
  if (req.session.uid && (req.session.userrole == "Security")) {

    res.render("securityPages/registerResident");

  } else {

    res.redirect("/login");
    res.end();

  }
  
});

// Route for verifying residents codes
app.get("/security/verify-code", function (req, res) {
  if (req.session.uid && (req.session.userrole == "Security")) {
    res.render("securityPages/verify-code");
  } else {
    res.redirect("/login");
    res.end();
  }
  
});



// Route for send alert
app.get("/security/alert", function (req, res) {
  
  if (req.session.uid && (req.session.userrole == "Security")) {
    res.render("securityPages/alert");
  } else {
    res.redirect("/login");
    res.end();
  }
});

// RESIDENT LIST
app.get("/security/resident-list", function (req, res) {

  
  if (req.session.uid && (req.session.userrole == "Security")) {

    var userTableSql = "SELECT * FROM user_table WHERE User_role = 'Resident'";
    db.query(userTableSql).then((results) => {
      res.render("securityPages/resident_list", { data: results });
    });

  } else {
    res.redirect("/login");
    res.end();
  }
});

// VISITORS LOG PAGE (SECURITY)
app.get("/security/visitors-log", function (req, res) {
  if (req.session.uid && (req.session.userrole == "Security")) {

    var sql =
    "SELECT ct.Code_Value as code, ct.Visitors_Name as visitors, ct.Code_Status as status, ut.User_Name as name from codes_table ct JOIN user_table ut on ut.User_ID = ct.User_ID";

    db.query(sql).then((results) => {
      res.render("securityPages/visitors-log", { data: results });
      
    });
    
  } else {
    res.redirect("/login");
    res.end();
  }
  
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


//  ------  POST REQUESTS ------

// Logout function
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/login');
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
      res.render('securityPages/verify-code', { resultSuccess: result[0], updateResult });
    } else {
      // 没有找到匹配的验证码
      res.render('securityPages/verify-code', { resultError: null});
    }
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).send('Error verifying code');
  }
});

// ALERTS SENT FROM THE SECURITY
app.post("/send-alert", async function (req, res) {
  params = req.body;
  if (params.message == "") {
    res.render("securityPages/alert", {
      errorMessage: "Oops!! This field cannot be empty. Try again.",
    });
  } else {
    try {
      params = req.body;

      senderId = req.session.uid;
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

// LOGIN AUTHENTICATION
app.post("/login-auth", async function (req, res) {
  params = req.body;
  var user = new User(params.email);

  try {
    uId = await user.getIdFromEmail();
    console.log(uId);
    if (uId) { 
      match = await user.authenticate(params.password);

      if (match) {
        userRole = await user.getAllUserDetails();
        
        req.session.uid = uId;
        req.session.loggedIn = true;
        req.session.userrole = userRole;
        
        if(req.session.userrole == "Resident"){
          res.redirect("/resident/generate-code");
        }else if(req.session.userrole == "Security"){
          res.redirect("/security/register-resident");
        }else{
          res.redirect("/login");
        }
        
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

// ADD RESIDENT
app.post('/add-resident', async function (req, res) {
  try {
    const { name, location, email, mobile, dob, password } = req.body;
    var user = new User(email);
    const uId = await user.getIdFromEmail(); // Declared uId variable using const
    
    if (uId) {
      // If a valid, existing user is found, set the password and redirect to the users page
      await user.setUserPassword(password); 
      res.send('Password set successfully');
    } else {
      // If no existing user is found, add a new one
      const newId = await user.addUser(name, location, mobile, dob, password); // Added all user data
      res.redirect('/security/register-resident');
    }
  } catch (err) {
    console.error(`Error while adding password:`, err.message); // Improved error message with more details
    res.status(500).send('Error occurred while processing your request'); // Added error status code and response
  }
});


// CODE GENERATION
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


// DELETE ACCESS LOG
app.post('/delete-log/:id', async function(req, res) {
  
  params = req.params; // extract the data passed through the http request

  console.log(params); 
  try{
    var codeId = params.id;
    const userId = req.session.uid;
    const codes = new Codes(userId);
   
    codeResult = await codes.deleteCode(codeId);

    res.redirect('/resident/accesslogs');
   
    
  }
  catch (error){
    console.log(error);
  }
});

// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});