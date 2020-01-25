var express = require('express');
var router = express.Router();
var User = require('../models/user')
var middleware = require('../modules/middlewares')
var Schedule = require('../models/schedule')

router.get('/',(req,res,next) => {
  schedules = req.schedules || null;
  User.find()
  .populate('payment','paymentDate')
  .exec((err,users)=>{
    if(err) return next(err);
    res.render('admin',{users, schedules})
  })
})

router.get('/:id/delete',(req,res,next) =>{
  console.log(req.params.id)
  Schedule.findById(req.params.id,(err, deleted)=>{
    if(err) next(err);
    console.log(deleted)
    res.redirect('/admins');
  })
})


module.exports =  router;