var User = require('../models/user')
var Schedule = require('../models/schedule')
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
    Schedule.find()
    .populate('userId','name')
    .exec((err,schedule)=>{
      console.log(schedule)
      res.render('index',{user,schedule})
    })
  }
}