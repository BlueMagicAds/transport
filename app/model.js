// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var bcrypt = require('bcrypt');
const saltRounds = 10;

// Creates a User Schema. This will be the basis of how user data is stored in the db
var UserSchema = new Schema({
    userID: {type: String}, //Uniquely identify users
    username: {type: String, required: true, unique: true, trim: true}, //registered username
    email: {type: String, unique: true, required: true, trim: true},
    password: {type: String, required: true},
    gender: {type: String, required: true},
    age: {type: Number, required: true},
    address: {type: [Number], required: true}, // [Long, Lat],
    kidID: {type: [mongoose.Schema.Types.Mixed]},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

//Driver Schema
//------------------------------------------------------
var DriverSchema = new Schema({
    driverID: {type: String},
    driverName: {type: String, required: true},
    contactNumber: {type: Number, required: true},
    numberOfTrips: {type: Number},
    active: {type: Boolean},
    language: {type: String, required: true}, //Language spoken by the driver.
    ratings: {type: Number, min: 1, max: 5},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

//Vehicle Schema
//------------------------------------------------------
var VehicleSchema = new Schema({
    vehicleID: {tyep: String}, //colour+
    registrationNumber: {type: String, required: true},
    make: {type: String, required: true},
    model: {type: String, required: true},
    assignedDriver: {type: String},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

//Track user Schema
//--------------------------------------------------------
var TrackUser = new Schema({
    trackID: {type: String},
    userID: {type: mongoose.Schema.Types.Mixed},
    vehicleID: {type: mongoose.Schema.Types.Mixed},
    enroute: {type: Boolean},
    currentLocation: {tyspe: [Number]},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if(err) {
            return next(err);
        }

        user.password = hash;
        var now = new Date();
        this.updated_at = now;
        if(!this.created_at) {
            this.created_at = now
        }

        next();
    });
});

DriverSchema.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now;
    }
    next();
});

VehicleSchema.pre('save', function (next) {
    var now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now;
    }
    next();
});

TrackUser.pre('save', function(next) {
    var now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now;
    }
});

// Indexes this schema in geoJSON format (critical for running proximity searches)
UserSchema.index({location: '2dsphere'});

var driverSchema = mongoose.model('driverSchema', DriverSchema);
var userSchema = mongoose.model('userSchema', UserSchema);
var vehicleSchema = mongoose.model('vehicleSchema', VehicleSchema);
var trackSchema = mongoose.model('trackSchema', TrackUser);

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "bmagic-user"
module.exports = {
	driverSchema: driverSchema,
	userSchema: userSchema,
	vehicleSchema: vehicleSchema,
    trackSchema: trackSchema
};

