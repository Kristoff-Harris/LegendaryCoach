const mongoose = require('mongoose');
const credentials = require("../credentials.js");

const dbUrl = 'mongodb://' + credentials.host + ':27017/' + credentials.database;
let connection = null;
let model = null;

const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;


// Defining the schema for employees - ID is omitted because the DB has its own unique ID
const employeeSchema = new Schema({
    firstName: String,
    lastName: String
});

const playerSchema = new Schema({
    summonerName: String,
    currentDivision: String,
});

const playerBenchmark = new Schema({
    division: String,
    csAt10: String,
    csAt20: String,
    wardScore: String,
    kdaScore: String,
    damageScore: String

});

const playerGame = new Schema({
    gameSequence: String,
    summonerName: String,
    summonerDivisionDuringGame: String,
    role: String,
    gameUUID: String,
    gameDuration: String,
    csAt10: String,
    csAt20: String,
    wardScore: String,
    kdaScore: String,
    damageScore: String
});


// Retrieving the Employee model and initially populating the database with dataset from Assn 1 & 2
module.exports.getModel =
    () => {
    if (connection == null) {
        console.log("Creating connection and model...");
        connection = mongoose.createConnection(dbUrl);

        // When the initial connection to the database is established, write 3 employees to the DB
        connection.on("open", function() {
            Employee = connection.model("EmployeeModel",
                employeeSchema);

            var employee;

            employee = new Employee({
                firstName: 'John',
                lastName: 'Smith'
            });
            employee.save();

            employee = new Employee({
                firstName: 'Jane',
                lastName: 'Smith'
            });
            employee.save();

            employee = new Employee({
                firstName: 'John',
                lastName: 'Doe'
            });
            employee.save();

            console.log("Initial Employee Write Finished");
        });

        model = connection.model("EmployeeModel",
            employeeSchema);
    };

    return model;
};
