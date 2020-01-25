var express = require('express');
var router = express.Router();
var User = require('../models/user')
var Payment = require('../models/payment')
var middleware = require('../modules/middlewares')
var multer  = require('multer')
var path = require('path')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, req.params.id + path.extname(file.originalname))
  }
});
var upload = multer({ storage: storage })


/* GET users listing. */
router.get('/',function(req, res, next) {
  res.render('user')
});

// router.post('/profile/:id', upload.single('avatar'), function (req, res, next) {
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
//   try {
//     res.send(req.file);
//   }catch(err) {
//     res.send(400);
//   }
// })


router.post('/profile/:id', function (req, res, next) {
  var idname = req.params.id;
  var storage = multer.diskStorage({

    destination: "./public/uploads/",
    filename: (req, file, cb) => {
      cb(null, idname + path.extname(file.originalname))
    }
  });
  var upload = multer({
    storage: storage
  }).single('profile_pic')

  upload(req, res, (err)=>{
    console.log("upload ", idname ,req.file)
      if(err){
        return console.log(err,"err 1")
      }else{
        User.findByIdAndUpdate(idname,req.body,(err,userUpdate)=>{
          if(err) {
            console.log("user update err")
          }
          // req.flash('Extname',`.${req.file.filename.split('.')[1]}`)
          res.redirect('/')
        })
      }
  })
})


router.get('/incharge',(middleware.checkUserLogged),(middleware.isIncharge),(req,res,next) => {
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


//edit user
router.get('/profile/:id',middleware.isAuthenticated, (req, res) => {
  var userID= req.params.id
  res.render("user",{userID});
})

// YOUR profile --Ayus
router.get('/profile',middleware.checkUserLogged,(req, res)=>{
  var user = ""
  res.render('user',{user})  
})
module.exports = router;
