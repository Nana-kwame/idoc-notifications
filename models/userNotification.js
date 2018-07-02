var mongoose = require('mongoose');

var databaseConfig= require('../config/database');

mongoose.connect(databaseConfig.url);

var mongoSchema = mongoose.Schema;

var userNotifcationSchema = {
    "hospitalName":String,
    "patName":String,
    "hosID":String,
    "message":String,
    "deleted":Boolean
}

module.exports = mongoose.model('notification',userNotifcationSchema)