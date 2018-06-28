var mongoose = require("mongoose");
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var mongoOp = require("./models/mongo");
var mongoUser = require("./models/userNotification")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));

app.use(function (req, res, next) {

    res.header("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})


router.get("/", function (req, res) {
    res.json({ "error": false, "message": "Hello World!" });
});

//GET ALL NOTIIFCATIONS

router.route("/notifications")
    .get(function (req, res) {
        var response = {};
        mongoOp.find({}, function (err, data) {

            if (err) {
                response = { 'error': true, 'message': 'Error fetching data' }
            } else {
                response = { 'error': false, 'message': data }
            }

            res.json(response);
        })
    })

    //ADD A NEW NOTIFICATION
    .post(function (req, res) {
        var db = new mongoOp();
        var response = {};

        db.patName = req.body.patName
        db.hospitalName = req.body.hospitalName;
        db.hosID = req.body.hosID;
        db.specialist = req.body.specialist;
        db.diagnosis = req.body.diagnosis
        db.date = req.body.date;

        db.save(function (err) {

            if (err) {
                response = { "error": true, "message": "Error adding data" };
                console.log(err);
            } else {
                response = { "error": false, "message": "Data added" };
            }
            res.json(response);
        })
    })

//EDITING BASED ON HOSPITALNAME

router.route('/notifications')
    .put(function (req, res, next) {

        var response = {}

        mongoOp.findOne({ hospitalName: req.params.hospitalName }).select("patName hospitalName hosID specialist diagnosis")
            .exec((err, notifcation) => {
                if (err) {
                    return next(err);
                }

                if (!notification) {
                    res.json({ success: false, "message": "No notifications have been sent to you" })
                } else {

                    if (req.body.approved !== undefined) {
                        notifcation.approved = req.body.approved
                    }

                    notifcation.save(function (err) {
                        if (err) {
                            response = { 'error': true, 'message': "Error updating data" }
                        } else {
                            response = { "error": false, "message": "Data is updated for " + req.params.hospitalName };
                        }
                        res.json(response);
                    })
                }

            })
    })


    

    

app.use('/', router);


app.get('/notification/:hospitalName', (req,res,next)=>{
    mongoOp.find({hospitalName:req.params.hospitalName}).select("patName diagnosis hosID specialist date hospitalName")
    .exec((err,notifcation)=> {
        if(err){
            return next(err);
            console.log(err);
        }

         if(!notifcation){
            res.json({success:false, message: "notification not found"});
        }else{
            res.json({success:true, message: notifcation});
        }     
        
    });
});



//USER NOTIFICATIONS
app.get("/userNotifications",(req,res)=> {
    var response = {};

    mongoUser.find({}, function(err,data){
        if(err){
            response = {"error":true,"message":"Error fetching data"}
        }else {
            response = {"error":false,"message":data}
        }
        res.json(response)
    })
})

app.post("/userNotifications",function (req,res){
    var db = new mongoUser();
    var response = {};

    db.hospitalName = req.body.hospitalName;
    db.patName = req.body.patName;
    db.hosID = req.body.hosID;
    db.message = req.body.message;

    db.save(function(err) {

        if(err){
            response = {"error":true, "message":"Error adding the data"}
        } else {
            response = {"error":false, "message":"Data added"}
        }
    })
})

app.get("/userNotifications/:hosID", (req,res,next) => {
    mongoUser.find({hosID:req.params.hosID}).select("hospitalName patName message hosID")
    .exec((err,notifcation) => {
        if(err){
            return next(err)
        }
        if(!notifcation){
            res.json({success:false, message: "notification not found"});
        }else{
            res.json({success:true, message: notifcation});
        }     
    })
})

app.delete("/userNotfications/:id", function(req,res){
    monogoUser.findByIdAndRemove({_id:req.params._id},function(err,res){
        if(err){
            res.send({'error':'An error has ocurred'})
        }else {
            res.send('Notfications deleted')
        }
    })
})







app.listen(process.env.PORT || 3030);
console.log('Server is running on port 3030');