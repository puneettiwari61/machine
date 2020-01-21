var express = require('express');
var router = express.Router();
var User = require('../models/user')
var middleware = require('../modules/middlewares')

/* GET home page. */

//check booking form
router.get('/', function(req, res, next) {
  res.render('index');
});

;

//book booking
router.post('/',middleware.checkUserLogged,(req,res,next) => {
  console.log(req.body);
  res.send('booked')
})


//register
router.get('/register',(req,res,next)=> {
  res.render('register')
})

router.post('/register',(req,res,next) => {
  User.create(req.body,(err,createdUser)=> {
    if(err) return next(err);
    console.log(createdUser)
    res.send('you are registered');
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
    console.log(user.verifyPassword(user.password))
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
