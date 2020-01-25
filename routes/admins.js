var express = require('express');
var router = express.Router();
var User = require('../models/user')
var middleware = require('../modules/middlewares')
var Schedule = require('../models/schedule')

router.get('/' ,middleware.checkUserLogged,middleware.isAdmin,(req,res,next) => {
  Schedule.find()
  .populate('userId')
  .exec((err,schedules) => {
    if(err) next(err);
    req.schedules = schedules;

  schedules = req.schedules || null;
  User.find()
  .populate('payment','paymentDate')
  .exec((err,users)=>{
    if(err) return next(err);
    var adminData = res.admin;
    res.render('admin',{users, schedules, adminData})
  })
})})

router.get('/:id/delete',(req,res,next) =>{
  Schedule.findByIdAndDelete(req.params.id,(err, deleted)=>{
    if(err) next(err);
    res.redirect('/admins');
  })
})


// blockuser
router.get('/:id/block',(req,res,next) => {
  userId = req.params.id
    User.findByIdAndUpdate(req.params.id,   { "blocked": true },(err,blocked)=>{
      res.redirect('/admins')
    })
  })

// unblock user
router.get('/:id/unblock',(req,res,next) => {
  userId = req.params.id
    User.findByIdAndUpdate(req.params.id,   { "blocked": false },(err,blocked)=>{
      res.redirect('/admins')
    })
  })

module.exports =  router;