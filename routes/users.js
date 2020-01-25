var express = require('express');
var router = express.Router();
var User = require('../models/user')
var Payment = require('../models/payment')
var middleware = require('../modules/middlewares')
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './public/uploads/');
   },
  filename: function (req, file, cb) {
      cb(null , file.originalname);
  }
});
var upload = multer({ storage: storage })
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user')
});

router.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  try {
    res.send(req.file);
  }catch(err) {
    res.send(400);
  }
})


router.get('/incharge',(middleware.isIncharge),(req,res,next) => {
  User.find()
  .populate('payment','paymentDate')
  .exec((err,users)=>{
    if(err) return next(err);
    res.render('incharge',{users})
  })
  })

router.get('/incharge/:id/payment',(req,res,next) => {
  userId = req.params.id
  Payment.create({userId:userId},(err,payment)=>{
    if(err) return next(err);
    User.findByIdAndUpdate(req.params.id,  { $push: { "payment": payment.id }},(err,updatedUser)=>{
      console.log(updatedUser);
      res.redirect('/users/incharge')
    })
  })
})



module.exports = router;
