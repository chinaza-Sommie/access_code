// Import express.js
const express = require("express");
const { User } = require("./models/user");

const { Alerts } = require("./models/alerts");
// Create express app
var app = express();

<<<<<<< HEAD
// accept form input
app.use(express.urlencoded({ extended: true }));
=======
// Set the sesssions
var session = require('express-session');
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
>>>>>>> nisenro

// views connection
app.set("view engine", "pug");
app.set("views", "./app/views");

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require("./services/db");
app.use(express.urlencoded({ extended: true}))


// Create a route for root - /
app.get("/", function (req, res) {
  // res.render("login");
  res.render("residentPages/codeGenerator");
});

// Create a route for root - /
app.get("/", function(req, res) {
  console.log(req.session);
  if (req.session.uid) {
  res.send('Welcome back, ' + req.session.uid + '!');
} else {
  res.send('Please login to view this page!');
}
res.end();
});

// Route for login page
app.get("/login", function (req, res) {
  res.render("login");
});

// Route for landing page
app.get("/landing_page", function (req, res) {
  res.render("landingpage");
});

// ------ RESIDENT ROUTES ----

// Route for Generating code
app.get("/resident/generate-code", function (req, res) {
  res.render("residentPages/codeGenerator");
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
        
        if (results[0].User_role == 'Resident'){
            res.render("residentPages/resident-profile", { data: results[0] });
        }else{
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

// app.get("/security/profile", function (req, res) {
//   res.render("securityPages/profile-security");
// });

app.get("/security/resident-list", function (req, res) {
    var userTableSql = 
    "SELECT * FROM user_table WHERE User_role = 'Resident'";
    db.query(userTableSql).then((results) => {
        res.render("securityPages/resident_list", { data: results });

    });
    // res.render("securityPages/resident_list");
});



// VISITORS LOG PAGE (SECURITY)
app.get("/security/visitors-log", function (req, res){
  var sql = 
    "SELECT ct.Code_Value as code, ct.Visitors_Name as visitors, ct.Code_Status as status, ut.User_Name as name from codes_table ct JOIN user_table ut on ut.User_ID = ct.User_ID";

  db.query(sql).then((results) => {
      res.render("securityPages/visitors-log", { data: results });
      // console.log(results)
  });
<<<<<<< HEAD
  
app.post("/send-alert", async function (req, res) {
  params = req.body
  if (params.message == ''){
    res.render("securityPages/alert", {errorMessage: 'Oops!! This field cannot be empty. Try again.' });
  }else{
    try {
      params = req.body
      
      
      senderId = 1
      alerts = new Alerts(senderId)
      await alerts.postAlerts(params.message, senderId)
      console.log(alerts);
      res.render("securityPages/alert", {successMessage: 'Alert message has been sent successfuly!' });
    } catch (err) {
        
        res.render("securityPages/alert", {errorMessage: err.message });
    }
  }
 
});
=======
});

// Logout
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/login');
});

app.post('/add-register', async function (req, res) {
  params = req.body;
  var user = new User(params.email);
  try {
      uId = await user.getIdFromEmail();
      if (uId) {
          // If a valid, existing user is found, set the password and redirect to the users single-student page
          await user.setUserPassword(params.password);
          console.log(req.session.id);
          res.send('Password set successfully');
      }
      else {
          // If no existing user is found, add a new one
          newId = await user.addUser(params.email);
          res.send('Perhaps a page where a new user sets a programme would be good here');
      }
  } catch (err) {
      console.error(`Error while adding password `, err.message);
  }
});

// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
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
              res.redirect('/student-single/' + uId);
          }
          else {
              // TODO improve the user journey here
              res.send('invalid password');
          }
      }
      else {
          res.send('invalid email');
      }
  } catch (err) {
      console.error(`Error while comparing `, err.message);
  }
});

>>>>>>> nisenro


// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
