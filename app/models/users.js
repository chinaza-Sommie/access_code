const db = require("../services/db");
const bcrypt = require("bcryptjs");

class User {

    // Id of the user
    User_ID;

    // Email of the user
    Email_Address;

    Password;

    constructor(Email_Address) {
        this.email = Email_Address;
    }
    
    // Get an existing user id from an email address, or return false if not found
    // Checks to see if the submitted email address exists in the Users table
    async getIdFromEmail() {
        var sql = "SELECT User_ID FROM user_table WHERE user_table.Email_Address = ?";
        const result = await db.query(sql, [this.email]);
        
        if (JSON.stringify(result) != '[]') {
            
            this.id = result[0].User_ID;
            return this.id;
        }
        else {
            return false; 
        }
    }

    // login functions
    async authenticate(submitted) {
        // Get the stored, hashed password for the user
        var sql = "SELECT password FROM user_table WHERE User_ID = ?";
        const result = await db.query(sql, [this.id]);
        const match = await bcrypt.compare(submitted, result[0].password);
        if (match == true) {
            return true;
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
    

    


}

module.exports  = {
    User
}
