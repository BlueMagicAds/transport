// Dependencies
var mongoose        = require('mongoose');
var User            = require('./model.js');
var Vehicle         = require('./model.js');
var Driver          = require('./model.js');
var storePass       = require('./users.js');


// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all users in the db
    app.get('/users', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = User.find({});
        query.exec(function(err, users){
            if(err) {
                res.send(err);
            } else {
                // If no errors are found, it responds with a JSON of all users
                res.json(users);
            }
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/users', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        if(req.body.userName && req.body.email && req.body.password && req.body.gender && req.body.age && req.body.address) {
            var userData = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                gender: req.body.gender,
                age: req.body.age,
                address: req.body.address
            }
        }

        // New User is saved in the db.
        User.create(userData, function(err, user){
            if(err)
                return next(err);
            else
                // If no errors are found, it responds with a JSON of the new user
                res.json(req.body); //Register Kids
        });
    });

    // Retrieves JSON records for all users who meet a certain set of query conditions
    app.post('/query/', function(req, res){

        // Grab all of the query parameters from the body.
        var lat             = req.body.latitude;
        var long            = req.body.longitude;
        var distance        = req.body.distance;
        var male            = req.body.male;
        var female          = req.body.female;
        var other           = req.body.other;
        var minAge          = req.body.minAge;
        var maxAge          = req.body.maxAge;
        var favLang         = req.body.favlang;
        var reqVerified     = req.body.reqVerified;

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = User.find({});

        // ...include filter by Max Distance (converting miles to meters)
        if(distance){

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1609.34, spherical: true});

        }

        // ...include filter by Gender (all options)
        if(male || female || other){
            query.or([{ 'gender': male }, { 'gender': female }, {'gender': other}]);
        }

        // ...include filter by Min Age
        if(minAge){
            query = query.where('age').gte(minAge);
        }

        // ...include filter by Max Age
        if(maxAge){
            query = query.where('age').lte(maxAge);
        }

        // ...include filter by Favorite Language
        if(favLang){
            query = query.where('favlang').equals(favLang);
        }

        // ...include filter for HTML5 Verified Locations
        if(reqVerified){
            query = query.where('htmlverified').equals("Yep (Thanks for giving us real data!)");
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, users){
            if(err)
                res.send(err);
            else
                // If no errors, respond with a JSON of all users that meet the criteria
                res.json(users);
        });
    });

    // DELETE Routes (Dev Only)
    // --------------------------------------------------------
    // Delete a User off the Map based on objID
    app.delete('/users/:objID', function(req, res){
        var objID = req.params.objID;
        var update = req.body;

        User.findByIdAndRemove(objID, update, function(err, user){
            if(err)
                res.send(err);
            else
                res.json(req.body);
        });
    });

    //Driver queries
    //----------------------------------------------------------
    //Create a new driver;
    app.post('/newDriver', function(req, res) {
        var newDriver = new Driver(req.body);

        newDriver.save(function(err) {
            if(err) {
                res.status(403).send(err);
            }

            else {
                res.status(200).json(req.body);
            }
        });
    });

    app.get('/driverInfo/:driverID', function(req, res) {
        var driverID = req.params.driverID;

        Driver.findByID(driverID, function(err, driver) {
            if(err) {
                res.send(err);
            }

            else {
                res.status(200).json(driver);
            }
        });
    });

    //Vehicle queries
    //----------------------------------------------------------
    //Add new vehicle
    app.post('/newVehicle', function(req, res) {
        var newVehicle = new Vehicle(req.body);

        newVehicle.save(function(err) {
            if(err) {
                res.send(err);
            }

            else {
                res,send(req.body);
            }
        });
    });


};
