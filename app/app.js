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
  // res.render("resident-layout");
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

// ---- SECURITY ROUTES ----

// Route for registering residents
app.get("/security/register-resident", function (req, res) {
  res.render("securityPages/registerResident");
});

// Route for verifying residents codes
app.get("/security/verify-code", function (req, res) {
  res.render("securityPages/verifycode");
});

app.get("/security/profile", function (req, res) {
  res.render("securityPages/profile-security");
});

// ACCESS LOGS PAGE (SECURITY)----
app.get("/security/access-logs", function (req, res) {
  res.render("securityPages/access-logs");
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
  
// Create a route for testing the db
app.get("/db_test", function (req, res) {
  // Assumes a table called test_table exists in your database
  sql = "select * from test_table";
  db.query(sql).then((results) => {
    console.log(results);
    res.send(results);
  });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function (req, res) {
  res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function (req, res) {
  // req.params contains any parameters in the request
  // We can examine it in the console for debugging purposes
  console.log(req.params);
  //  Retrieve the 'name' parameter and use it in a dynamically generated page
  res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});
