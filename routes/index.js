var express = require('express');
var router = express();
const fs = require('fs');
var ejs = require('ejs');
var mailer = require('nodemailer');
const path = require('path');
const Nexmo = require('nexmo');
const crypto = require("crypto");

router.set('views', path.join(__dirname, 'views'));
router.set('view engine', 'ejs');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://ragini:gaurav@entry-management-55ksw.mongodb.net/test?retryWrites=true&w=majority";

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/visitor', function(req, res) {
    res.render('visitor');
});

router.get('/host', function(req, res) {
    res.render('host');
});

router.get('/in', function(req, res) {
    res.render('in');
});

router.get('/out', function(req, res) {
    res.render('out');
});

router.post('/in',function(req,res){
    var date = new Date();
    // console.log(req.body);
    var na = req.body.name;
    var em= req.body.email;
    var ph = req.body.phone;
    var cdate = date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();
    var ctime = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    MongoClient.connect(url,function(err,db){
        if(err) res.json({submit:"false"});
        var dbo = db.db('entry-management');
        dbo.collection("visitor").insertOne({
            name : na,
            email : em,
            phone : ph,
            check_in_date : cdate,
            check_in_time : ctime,
            check_out_date : "",
            check_out_time : "",
            hostId : ""
        }, function(err, result) {
            if (err) res.json({submit:"false"});
                dbo.collection("host").findOne({free:"true"},function(error2,result2){
                    if(error2) throw error2;
                    if(result2==null)
                      { 
                        dbo.collection("visitor").deleteOne({phone:ph},function(er5,re5){
                            res.json({submit:"not"});
                        })  
                    }
                    else
                     dbo.collection("visitor").updateOne({phone:ph},{$set: {hostId:result2.hostid}},function(error3,result3){
                        if(error3) throw error3;
                        dbo.collection("host").updateOne({hostid:result2.hostid},{$set: {free:"false"}},function(error4,result4){
                         if(error4) throw error4;
                         let transporter = mailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                // should be replaced with real sender's account
                                user: 'hosth914@gmail.com',
                                pass: 'helloworld@123'
                            }
                        }); 
                        let mailOptions = {
                            // should be replaced with real recipient's account
                            to: result2.email,
                            subject: "Visitor Detail's",
                            html: ejs.render( fs.readFileSync('routes/views/detail.ejs', 'utf-8') , {name : na , email:em,phone:ph})
                        };
                        transporter.sendMail(mailOptions, (error, info) => {    
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                        }); 
                        const nexmo = new Nexmo({
                            apiKey: '1c2727d4',
                            apiSecret: 'pEQT4nem1XzUMmfG',
                          });
                        const from = 'Nexmo';
                        const to = '+91'+result2.phone;
                        console.log(result2.phone);
                        const text = 'Visitor Details are \nName:- '+na+"\nEmail:- "+em+"\nPhone:- "+ph;

                        nexmo.message.sendSms(from, to, text);

                           res.json({submit:"true"});

                        });
                     });
                });
        });
    });
});

router.post('/out',function(req,res){
    var date = new Date();
    var ph = req.body.phone;
    var cdate = date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();
    var ctime = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    MongoClient.connect(url,function(err,db){
        if(err) res.json({submit:"false"});
        var dbo = db.db('entry-management');
        dbo.collection("visitor").findOne({phone:ph},function(er10,res10){
       if(er10) throw er10;

       if(res10===null)
       res.json({submit:false});
       else 
        dbo.collection("visitor").updateOne({phone:ph},{$set: {check_out_date:cdate,check_out_time:ctime}}, function(err, result) {
            if (err) throw err;
            dbo.collection("visitor").findOne({phone:ph},function(error2,result2){
                 if(error2) throw error2;
                 dbo.collection("visitor").deleteOne({phone:ph},function(er8,res8){
                   if(error2) throw er8;
                  dbo.collection("host").updateOne({hostid:result2.hostId},{$set: {free:"true"}},function(error4,result4){
                    if(error4) throw error4;
                    dbo.collection("host").findOne({hostid:result2.hostId},function(error3,result3){
                        if(error3) throw error3;
                        let transporter = mailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                // should be replaced with real sender's account
                                user: 'hosth914@gmail.com',
                                pass: 'helloworld@123'
                            }
                        });
                        let mailOptions = {
                            // should be replaced with real recipient's account
                            to: result2.email,
                            subject: "Visit Detail's",
                            html: ejs.render( fs.readFileSync('routes/views/check.ejs', 'utf-8') , {
                                name :result2.name,
                                phone:result2.phone,
                                check_in_date:result2.check_in_date,
                                check_in_time:result2.check_in_time,
                                check_out_date:result2.check_out_date,
                                check_out_time:result2.check_out_time,
                                hostname:result3.name
                            })
                        };
                        transporter.sendMail(mailOptions, (error, info) => {    
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                        }); 

                        res.json({submit:"true"});
                    });
                  }); 
                 });
            });
        });
    });
});
});





router.post('/host',function(req,res){
    console.log(req.body);
    var na = req.body.name;
    var em = req.body.email;
    var ph = req.body.phone;
    var fr = "true";
    const id = crypto.randomBytes(16).toString("hex");
    console.log(id);
    var hostid = id;
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db('entry-management');
        dbo.collection("host").insertOne({name:na,email:em,phone:ph,hostid:id,free:fr}, function(err, result) {
            if (err) throw err;
                res.json({submit:"true"});
        });
    });
});

module.exports = router;
