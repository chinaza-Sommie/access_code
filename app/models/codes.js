const db = require("../services/db");

class Codes {

    // Id of the code
    Code_ID;

    // Title of the code
    Code_Value;

    // Description of the code
    Visitors_Name;

    // Title of the code
    Code_Status;

    // Description of the code
    User_ID;

    timeExpired;

    constructor(User_ID) {
        
        this.User_ID = User_ID;
        // this.User_ID = User_ID;
    }
    
    // Get an existing code id from a title, or return false if not found
    async getIdFromTitle() { 
        var sql = "SELECT Code_ID FROM codes_table WHERE codes_table.Title = ?";
        const result = await db.query(sql, [this.title]);
        
        if (result.length > 0) {
            this.id = result[0].Code_ID;
            return this.id;
        } else {
            return false;
        }
    }

    // Add a new code to the code_table
    async addCode(Code_Value, Visitors_Name, Code_Status, timeExpired) {
        var sql = "INSERT INTO codes_table (Code_Value, Visitors_Name, Code_Status, User_ID, timeExpired) VALUES (?, ?, ?, ?, ?)";
        const result = await db.query(sql, [Code_Value, Visitors_Name, "Used", this.User_ID, timeExpired]);
        // console.log(result[0].Code_ID)
        this.Code_Value = Code_Value;
        this.Visitors_Name = Visitors_Name;
        this.Code_Status = Code_Status;
        // this.User_ID = User_ID;
        this.timeExpired = timeExpired;
        return result;
    }

    // Update an existing code in the code_table
    async updateCode() {
        var sql = "UPDATE codes_table SET Description = ? WHERE Code_ID = ?";
        const result = await db.query(sql, [this.description, this.id]);
        return result;
    }

    // Delete an existing code from the code_table
    async deleteCode() {
        var sql = "DELETE FROM codes_table WHERE Code_ID = ?";
        const result = await db.query(sql, [this.id]);
        return result;
    }


    // Generate Codes
    async generateCode() {
        return 'GENERATE CODE';
    }

    async getCodeValue(codeValue) { 
    var sql = "SELECT Code_Value FROM codes_table WHERE Code_Value = ?";
    const result = await db.query(sql, [codeValue]);
    
    if (result.length > 0) {
        return result[0].Code_Value;
    } else {
        throw new Error("Code not found");
    }
    
    }}
    

module.exports = {
    Codes
};
