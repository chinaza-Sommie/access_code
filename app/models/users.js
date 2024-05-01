const db = require("../services/db");
const { User } = require("./alerts");
const bcrypt = require("bcryptjs");

class User {

    // Id of the user
    User_ID;

    // Email of the user
    email;

    Password;

    constructor(email) {
        this.email = email;
    }
    
    // Get an existing user id from an email address, or return false if not found
    async getIdFromEmail() {
        var sql = "SELECT id FROM user_table WHERE user_table = ?";
        const result = await db.query(sql, [this.email]);
        // TODO LOTS OF ERROR CHECKS HERE..
        if (JSON.stringify(result) != '[]') {
            this.id = result[0].id;
            return this.id;
        }
        else {
            return false;
        }
    }

    async setUserPassword(Password) {
        const pw = await bcrypt.hash(Password, 10);
        this.id = 3
        try{
            var sql = "UPDATE user_table SET Password = ? WHERE user_table.User_ID = 3"
            const result = await db.query(sql, [pw]);
            this.Password = Password;
            return result;
        }catch{
            console.log('problem here')
        }
    }
    

    // Test a submitted password against a stored password
    async authenticate(submitted) {
        // Get the stored, hashed password for the user
        var sql = "SELECT password FROM Users WHERE id = ?";
        const result = await db.query(sql, [this.id]);
        const match = await bcrypt.compare(submitted, result[0].password);
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
