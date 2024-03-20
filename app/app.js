// Import express.js
const express = require("express");

// Create express app
var app = express();

// views connection
app.set("view engine", "pug");
app.set("views", "./app/views");

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require("./services/db");

// Create a route for root - /
app.get("/", function (req, res) {
  // res.render("login");
  res.render("residentPages/codeGenerator");
});

// Route for login page
app.get("/login", function (req, res) {
  res.render("login");
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
app.get("/security/visitors-log", function (req, res) {
    var sql = 
    "SELECT ct.Code_Value as code, ct.Visitors_Name as visitors, ct.Code_Status as status, ut.User_Name as name from codes_table ct JOIN user_table ut on ut.User_ID = ct.User_ID";

    db.query(sql).then((results) => {
        res.render("securityPages/visitors-log", { data: results });
        // console.log(results)
    });
  });
  


// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
