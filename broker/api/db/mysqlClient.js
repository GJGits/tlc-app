const mysql = require("mysql");

class MySqlClient {

    // in password 1 could be l
    constructor() {
        this.connection = mysql.createConnection({
            host: 'remotemysql.com',
            user: 'FEqsYSBCev',
            password: 'EJTREY1Zqa',
            database: 'FEqsYSBCev'
        });
        this.connect();
        this.testTables();
    }

    connect() {
        this.connection.connect((err) => {
            if (err) throw err;
            console.log('connected');
        });
    }

    testTables() {
        this.connection.query("SELECT COUNT(*) FROM readings", (err, result) => {
            if (err) throw err;
            console.log(result);
        });
    }

    insertReading(reading) {
        this.connection
            .query("INSERT INTO readings(sensor_id, temp ,hum, index_factor) VALUES(?,?,?,?)",
                [reading.id, reading.temp, reading.hum, reading.index],
                (err, result) => {
                    if (err) throw err;
                    console.log(result);
                });
    }

}

module.exports = new MySqlClient();
