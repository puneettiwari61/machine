exports.checkUserLogged = (req,res,next) => {
  if(req.session && req.session.userId){
    next();
  }
  else {
    req.flash('info', 'You need to login first');
    res.redirect('/login');
  }
}

