const db = require("../services/db");
const bcrypt = require("bcryptjs");

class User {
      // Id of the user
      User_ID;

      // Name of the user
      User_Name;
  
      // Home Address of the user
      House_Address;
  
      // Email of the user
      Email_Address;
  
      //Phone number of the user
      Phone_Number;
  
      // User's Date of birth
      Date_Of_Birth;
  
      // Is the user a resident or security?
      User_role;
  
      // Password of the user
      Password;

      constructor(Email_Address) {
        this.email = Email_Address;
    }

    async getIdFromEmail() {
        try {
            const sql = "SELECT User_ID FROM user_table WHERE Email_Address = ?";
            const result = await db.query(sql, [this.email]);
            return result.length > 0 ? result[0].User_ID : false;
        } catch (error) {
            console.error("Error in getIdByEmail:", error.message);
            throw error;
        }
    }

    async setUserPassword(password) {
        try {
            const pw = await bcrypt.hash(password, 10);
            const userId = this.id || (await this.getIdByEmail());
            const sql = "UPDATE user_table SET Password = ? WHERE User_ID = ?";
            await db.query(sql, [pw, userId]);
            return true;
        } catch (error) {
            console.error("Error in setUserPassword:", error.message);
            throw error;
        }
    }

    async addUser(User_Name, House_Address, Phone_Number, Date_Of_Birth, Password) {
        
        try {
            const pw = await bcrypt.hash(Password, 10);
            const sql = "INSERT INTO user_table (User_Name, House_Address, Email_Address, Phone_Number, Date_Of_Birth, Password) VALUES (?, ? , ? , ? , ? , ?)";
            const result = await db.query(sql, [User_Name, House_Address, this.email, Phone_Number, Date_Of_Birth, pw]);
            this.User_ID = result.insertId
            return true;
        } catch (error) {
            console.error("Error in addUser:", error.message);
            throw error;
        }
    }

    async authenticate(submitted) {
        try {
            const userId = this.id || (await this.getIdByEmail());
            const sql = "SELECT Password FROM user_table WHERE User_ID = ?";
            const result = await db.query(sql, [userId]);
            if (result.length > 0) {
                const match = await bcrypt.compare(submitted, result[0].Password);
                return match;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error in authenticate:", error.message);
            throw error;
        }
    }
}

module.exports = {
    User
};
