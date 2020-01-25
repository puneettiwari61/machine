var User = require('../models/user')
var Schedule = require('../models/schedule')
var dateFormat = require("dateformat")
var moment = require("moment")
// format the current date
var now = moment();
var currentDate = now.format("MMM DD YYYY")


exports.checkUserLogged = (req,res,next) => {
  if(req.session && req.session.userId){
    next();
  }
  else {
    req.flash('info', 'You need to login first');
    res.redirect('/login');
  }
}


exports.isBlocked = (req,res,next) => {
  var email =  req.body.email
  User.findOne({email: email},(err,blockedUser) =>{
    // console.log(blockedUser)
    if(err) return next(err)
    if(blockedUser == null) return next();
    if(blockedUser.blocked == true){
    req.flash('blocked', 'OOPS, Your account has been blocked by Admin');
    res.redirect('/login');
    }
    else return next()
  })
}



exports.isAuthenticated = (req,res,next) => {
  if(req.session && req.session.userId){
    User.findById(req.session.userId,(err,user) => {
      if(err) return next(err);
      req.user = user
      res.locals.profileUser = user;
      // console.log(user)
      next()
    })
  }
  else{
    // req.flash('info', 'You need to login first');
    var user = '';
    var id ='';
    var msg = null;
    var timeMsg = null;
    var inchargeMsg = req.flash('Incharge')[0]||null
    Schedule.find()
    .populate('userId','name')
    .exec((err,schedule)=>{
      res.render('index',{user,schedule,id,msg,timeMsg,inchargeMsg})
    })
  }
}

exports.dateFormat = (req,res,next) =>  {
  res.locals.dateFormat = dateFormat
  next();
}

exports.validDate = (req,res,next) => {
  if(req.body.bookingDate && !moment(req.body.bookingDate).isSameOrAfter(currentDate)) {
    // res.locals.invalidDate = 'Please select a valid Date';
    req.flash('info', 'Please select a valid Date');
    res.redirect('/');
  }
  else{
    var fd = dateFormat(req.body.bookingDate,'mm dd yy')
    Schedule.find({bookingDate: fd},(err,sd)=>{
      if(err) return next(err);
      // console.log(sd)
      var tOrf = sd.every(s => {
        let diff = moment(req.body.time, 'HH:mm A').diff(moment(s.time, 'HH:mm A'))
        // console.log(req.body.time,s.time)
        let d = moment.duration(diff).asMinutes(); 
        if(120 > Math.abs(d)){
          // console.log('v hgbjktfvtygbvdytbcgyudsgbcyud########', d)
          return false;
        }
        else {
          return true
        }
      })
      if(!tOrf) {
        req.flash('time', 'Its clashing with other bookings');
        res.redirect('/');
      }
      else{
          next()
      }
    })
  }
}



exports.isIncharge = (req,res,next) => {
  User.findById(req.session.userId,(err,admin) => {
    if(admin.email == 'sahil@altcampus.io'){
      next();
    }
  else {
    req.flash('Incharge','You aren\'t Incharge')
    res.redirect('/')
  }
})
}

exports.isAdmin = (req,res,next) => {
  User.findById(req.session.userId,(err,admin) => {
    res.admin = admin
    if(admin.email == 'surajsir@altcampus.io'){
      next();
    }
    else {
      req.flash('Incharge','You aren\'t Admin')
      res.redirect('/')
    }
  })
}

