var express = require('express');
var router = express.Router();
var User = require('../models/user')
var middleware = require('../modules/middlewares')
var Schedule = require('../models/schedule');
/* GET home page. */

//check booking form
router.get('/',middleware.isAuthenticated, function(req, res, next) {
  var user = req.body
  Schedule.find()
  .populate('userId','name')
  .exec((err,schedule)=>{
    console.log(schedule)
    res.render('index',{user,schedule})
  })
});



//book booking
router.post('/',middleware.checkUserLogged,(req,res,next) => {
  req.body.userId = req.session.userId;
  Schedule.create(req.body,(err,schedule) => {
    if(err) return next(err);
    res.redirect('/')
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
  var msg = req.flash('info')[0];
  res.render('login',{msg})
})

router.post('/login',(req,res,next) => {
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
