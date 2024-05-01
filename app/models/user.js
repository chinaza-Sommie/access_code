// Get the functions in the db.js file to use
const db = require('../services/db');

class User {

    // Id of the user
    User_ID;

    // Email of the user
    Email_Address;

    // Password of user
    Password;

    constructor(Email_Address) {
        this.email = Email_Address;
    }
    
    // Get an existing user id from an email address, or return false if not found
    async getIdFromEmail() {
        var sql = "SELECT User_ID FROM user_table WHERE user_table.Email_Address = ?";
        const result = await db.query(sql, [this.email]);
        // TODO LOTS OF ERROR CHECKS HERE..
        if (JSON.stringify(result) != '[]') {
            this.id = result[0].User_ID;
            return this.id;
        }
        else {
            return false;
        }
    }


    // Add a password to an existing user
    async setUserPassword(password) {
        const pw = await bcrypt.hash(password, 10);
        var sql = "UPDATE User_ID SET password = ? WHERE user_table.User_ID = ?"
        const result = await db.query(sql, [pw, this.id]);
        return true;
    }

    
    // Add a new record to the users table    
    async addUser(password) {
        const pw = await bcrypt.hash(password, 10);
        var sql = "INSERT INTO user_table (Email_Address, Password) VALUES (? , ?)";
        const result = await db.query(sql, [this.email, pw]);
        console.log(result.User_ID);
        this.id = result.User_ID;
        return true;
    }

    // Test a submitted password against a stored password
    async authenticate(submitted) {
        // Get the stored, hashed password for the user
        var sql = "SELECT Password FROM user_table WHERE User_ID = ?";
        const result = await db.query(sql, [this.id]);
        const match = await bcrypt.compare(submitted, result[0].Password);
        if (match == true) {
            return true;
        }
        else {
            return false;
        }
    }
}

module.exports  = {
    User
}