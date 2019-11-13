var express = require('express');
var router = express.Router();
var User = require("../models/user.model");
var i = 0;
const { check, validationResult} = require('express-validator');

router.get('/', function(req, res) {
    res.render('home');
});

router.get('/home', function(req, res) {
  res.render('home',{email : req.session.email});
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/checklogin', function(req, res){
  if(i > 4){
        User.update({email : req.body.email},{$set : {attemptStatus : true}},function(err,reg){
          console.log("Your account has been blocked after 5 times login attempts");
          redirect('/register');
      })
  } else{
      User.findOne({ email: req.body.email, password: req.body.password, attemptStatus : false }, (err, user) => {
          if (user) {
              var dateNow = new Date();
              var createdDate1 = new Date(user.createdDate);
              const diffTime = Math.abs(dateNow - createdDate1);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if(diffDays == 14){
                  res.redirect('/changePassword');
              } else {
                  req.session.email = req.body.email;
                  res.redirect('/home');
              }
          }
          else {
              i++;
              res.redirect('/login');
          }
      })

  }
})

router.get('/register', function(req, res) {
    res.render('register',{ success: req.session.success, errors: req.session.errors });
});

router.post('/register', [
      check('name','Name is required Atleast one uppercase !').matches(/(?=.*[a-z])(?=.*[A-Z])/),
      check('email',' Email is not valid!').isEmail({ min: 8 }),
      check("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
      ], function(req, res){

          const errors = validationResult(req);
          if (errors.isEmpty()) {
            
              var us= new User();
              us.name=req.body.name;
              us.email=req.body.email;
              us.password=req.body.password;
              us.oldPassword=req.body.password;
              var done = us.save();

              if(done){
                res.redirect('/login');
              } else {
                res.redirect('/register');
              }
              
            
          } else {
            console.log(errors);
            res.render('register', { errors: errors.array() });
          }
      }
);

router.get('/changePassword', function(req, res) {
    res.render('changePassword');
});

router.post('/checkChangePassword', function (req, res){
      var dateNow = new Date();
      User.find({}, function(err, user){

          var arrPassword = user[0].oldPassword;
          var updatePass = true;
          
          for(var i = 0 ; i <= arrPassword.length; i++){
              if(req.body.newpassword == arrPassword[i]){
                  updatePass = false;
              } 
          }

          if(updatePass == true){
              if(arrPassword.length < 5){
                  arrPassword.push(req.body.newpassword);
      
                  User.update({email : req.body.email},{$set : {password : req.body.newpassword,oldPassword : arrPassword, createdDate : dateNow}},function(err,reg){
                    req.session.destroy(function(){
                      res.redirect('/login')
                    })
                  })
              } else{
                  arrPassword.shift();
                  arrPassword.push(req.body.newpassword);
      
                  User.update({email : req.body.email},{$set : {password : req.body.newpassword,oldPassword : arrPassword, createdDate : dateNow}},function(err,reg){
                    req.session.destroy(function(){
                      res.redirect('/login')
                    })
                  })
              }
          } else {
              console.info("update is not true so try again with new password");
              res.redirect('/changePassword')
          }
      })
      
})

router.get('/logout', function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login')
  })
});

router.post('/checklogin',function(req,res){
    if(req.body.email=='admin@gmail.com' && req.body.pass=='12345'){
      req.session.email = req.body.email;
      res.redirect('/home')
    }
})

module.exports = router;