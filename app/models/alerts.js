// Get the functions in the db.js file to use
const db = require('../services/db');

class Alerts {
    // Module code
    id;

    message; 
    // Module name
    sender;

    constructor(sender,message) {
        this.sender = sender;
        this.message = message;
    }

    async getAlerts() {
        if (typeof this.name !== 'string') {
            var sql = "SELECT * from Alerts where code = ?"
            const results = await db.query(sql, [this.id]);
            this.mName = results[0].name;
            this.code = results[0].code;
        }
    }

    
    async postAlerts(message, senderId) {
        try{
            var sql = "INSERT INTO alerts (message, sender) VALUES (?, ?)";
            const result = await db.query(sql, [message, senderId]);
            this.message = message;
            console.log(results)
            return this.message;
        }catch{
            console.log('problem here')
        }
    }
    
}

module.exports = {
    Alerts
}