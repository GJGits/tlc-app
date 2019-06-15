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
                    if (!err)
                        console.log('saved reading into db', reading);
                });
    }

    getLastReading(sensorID, res) {
        this.connection
            .query('select avg(temp) as temp, avg(hum) as hum, time from (select temp, hum, concat(extract(day from timestamp), "-" ,extract(hour from timestamp)) as time from  readings where timestamp between DATE_ADD(NOW(), INTERVAL -1 DAY) and NOW() and sensor_id = ?) as subTab group by time', [sensorID] ,(err, result) => {
                if (!err) {
                    console.log(result);
                    return res.status(200).send(result);
                } else {
                    console.log(err);
                }

            });
    }

}

module.exports = new MySqlClient();
