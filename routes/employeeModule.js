//---------------------------------------------------------------------------------
// Author   : Chris Harris
// Class    : BU CS 601
// Assn     : 3
// File     : employeeModule.js
// Purpose  : This code is invoked when a user interacts with the UI and it's responsible for rendering views
//            as well as interacting with the mongo database for lookups, edits, and deletes
//
//---------------------------------------------------------------------------------

const _ = require("underscore");
const DB = require('./dbConnection.js');
const Employee = DB.getModel();


// Invoked to render the view to add a new employee
module.exports.addEmployee =
    (req , res , next) => {

        res.render('addEmployeeView',
            {title:"Add an Employee"});
    };

// Used to get the full list of all current employees
module.exports.displayEmployees =
    (req, res, next) => {

        Employee.find({}, (err, employees) => {
            if (err)
                console.log("Error : %s ", err);

            let results = employees.map((employee) => {
                    return {
                        id: employee._id,
                        firstName: employee.firstName,
                        lastName: employee.lastName
                    }
                }
            );

            res.render('displayEmployeesView',
                {title: "List of Employees", data:results });
        });

    };

// Invoked for the removal from an employee in the DB
module.exports.deleteEmployee =
    (req , res , next) => {

        let id = req.params.id;

        Employee.findById(id,  (err, employee) => {
            if(err)
                console.log("Error Selecting : %s ", err);
            if (!employee)
                return res.render('404');

            employee.remove( (err) => {
                if (err)
                    console.log("Error deleting : %s ",err );
                res.redirect('/employees');
            });
        });
    };

// Retrieves the first and last name so that a user can edit an existing employee
module.exports.editEmployee =
    (req , res , next) => {

        let id = req.params.id;

        Employee.findById(id, (err, employee) => {
            if(err)
                console.log("Error Selecting : %s ", err);
            if (!employee)
                return res.render('404');

            res.render('editEmployeeView',
                {title:"Edit Employee",
                    data: {id: employee._id,
                        firstName: employee.firstName,
                        lastName: employee.lastName}
                });
        });
    };

// Adding a brand new employee
module.exports.saveEmployee =
    (req , res , next) => {

        let employee = new Employee({
            firstName:     req.body.firstName,
            lastName:       req.body.lastName
        });

        employee.save((err) => {
            if(err)
                console.log("Error : %s ",err);
            res.redirect('/employees');
        });

    };

// Invoked when an employee's name is being edited and the original needs to be modified in the DB
module.exports.saveAfterEdit =
    (req , res , next) => {

        let id = req.params.id;

        Employee.findById(id, (err, employee) => {
            if(err)
                console.log("Error Selecting : %s ", err);
            if (!employee)
                return res.render('404');

            employee.firstName = req.body.firstName;
            employee.lastName = req.body.lastName;


            employee.save((err) => {
                if (err)
                    console.log("Error updating : %s ",err );
                res.redirect('/employees');
            });
        });
    };
