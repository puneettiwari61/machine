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

exports.isAuthenticated = (req,res,next) => {
  if(req.session && req.session.userId){
    User.findById(req.session.userId,(err,user) => {
      if(err) return next(err);
      req.user = user
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
      console.log(sd)
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
  if(req.session.userId == '5e2a8958bd01b908b4df51f4'){
    next()
  }
  else {
    req.flash('Incharge','You aren\'t Incharge')
    res.redirect('/')
  }
}

exports.isAdmin = (req,res,next) => {
  if(req.session.userId == '5e2ad6eaf9a3a41a245329d3'){
    Schedule.find()
    .populate('userId')
    .exec((err,schedules) => {
      if(err) next(err);
      req.schedules = schedules;
      next();
    } )
  }
  else {
    req.flash('Incharge','You aren\'t Admin')
    res.redirect('/')
  }
}
