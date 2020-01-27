var express = require('express');
var router = express.Router();
var User = require('../models/user')
var middleware = require('../modules/middlewares')
var Schedule = require('../models/schedule');
var moment = require("moment")
var dateFormat = require("dateformat")

// format the current date
var now = moment();
var currentDate = now.format("MMM DD YYYY")
//twilio
const accountSid = 'ACc84ba5d98aa5306edc0da205a29040eb';
const authToken = '001abfe664430f257bac6416170aedc0';
const client = require('twilio')(accountSid, authToken);

/* GET home page. */

//check booking form
router.get('/',middleware.isAuthenticated, function(req, res, next) {
  var inchargeMsg = req.flash('Incharge')[0]||null
  var msg = req.flash('info')[0] || null;
  var timeMsg = req.flash('time')[0]||null
  // var ext = req.flash('Extname')[0]||null
  // console.log(msg)
  var past = req.flash('past')[0] || null;
  var user = req.user ;
  var id = req.session.userId?req.session.userId:'' ;
  Schedule.find()
  .sort('bookingDate')
  .populate('userId')
  .exec((err,schedule)=>{
    if(err) return next(err)
    res.render('index',{user,schedule,id,msg,timeMsg,inchargeMsg,past})
  })
});

// redirect
// delete schedule by the user
// router.post('/redirect/:id', function(req, res, next){
//   Schedule.findByIdAndDelete(req.params.id,(err,data)=>{
//     if(err) return next(err);
//     res.redirect('/')
    
//   })
// })

//changing isComplete to true for displaying history
router.post("/redirect/:id", function(req, res, next){
  Schedule.findByIdAndUpdate(req.params.id,{ $set: { isComplete : true }},(err,data)=>{
    if(err) return next(err)
    res.redirect('/')
  })
})


//book booking
router.post('/',middleware.checkUserLogged,middleware.validDate,middleware.validTime,(req,res,next) => {
  req.body.userId = req.session.userId;

 
  Schedule.create(req.body,(err,createdSchedule) => {
    if(err) return next(err);
    Schedule.find()
    .populate('userId','number')
    .exec((err,schedule)=>{
      client.messages
      .create({
         body: `Your slot of ${createdSchedule.time} on date${createdSchedule.bookingDate} is confirmed`,
         from: '+13312001283',
         to: '+918118840567'
       })
      .then(message => console.log(message.sid));
      res.redirect('/');
    })
  })
})


//register
router.get('/register',(req,res,next)=> {
  res.render('register')
})

router.post('/register',(req,res,next) => {
  User.create(req.body,(err,createdUser)=> {
    if(err) return next(err);
    // console.log(createdUser)
    res.redirect('/login')
  })
})


//login
router.get('/login',(req,res,next) => {
  var msg = req.flash('info')[0] || null
  var blockedMsg = req.flash('blocked')[0] || null
  res.render('login',{msg,blockedMsg})
})

router.post('/login',middleware.isBlocked,(req,res,next) => {
  User.findOne({email:req.body.email}, (err,user)=> {
    if(err) return next(err);
    if(!user){
      // return res.send()
      req.flash('info', 'email isn\'t registered');
      return res.redirect('/login');
    } 
    // console.log(user.verifyPassword(user.password))
    if(!user.verifyPassword(req.body.password)){
      req.flash('info', 'password is wrong');
      return res.redirect('/login');
    }
    req.session.userId = user.id
    res.redirect('/');
  })
})

//logout 
router.get('/logout',(req,res,err) => {
  req.session.destroy((err => {
    if(err) return next(err);
    res.redirect('/')
  }))
})



module.exports = router;
