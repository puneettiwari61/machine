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
      req.body = user
      // console.log(user)
      next()
    })
  }
  else{
    // req.flash('info', 'You need to login first');
    var user = '';
    var id ='';
    Schedule.find()
    .populate('userId','name')
    .exec((err,schedule)=>{
      res.render('index',{user,schedule,id})
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
    next();
  }
}