var mongoose = require('mongoose');
var databaseConfig= require('../config/database');

mongoose.connect(databaseConfig.url);

var mongoSchema = mongoose.Schema;

var notificationSchema ={
    "patName":String,
    "hospitalName":String,
    "hosID":String,
    "specialist":String,
    "diagnosis":String,
    "date":String
}

module.exports = mongoose.model('appointmentBooking',notificationSchema)

