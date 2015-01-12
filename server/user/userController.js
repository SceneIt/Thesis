var db = require('../DB/db.js');

module.exports = {

  signUp: function(req, res, next){
    if(req.isAuthenticated()){
      var userID = "";
      console.log('Signup success');
      db.User.find({
        where: {
          userName: req.body.username
        }
      }).then(function(user){
        userID = user.id;
        res.cookie('user', user.id, { httpOnly: false } );
        res.status(200).send({username: req.body.username});
        next();
      })
    } else{
      console.log('Should send 403')
      res.sendStatus(403);
      next();
    }
  },

  signIn: function(req, res, next){
   if(req.isAuthenticated()){
      var userID = "";
      console.log('Signin success');
      db.User.find({
        where: {
          userName: req.body.username
        }
      }).then(function(user){
        console.log(user);
        userID = user.id;
        res.cookie('userID', userID, { httpOnly: false } );
        res.status(200).send({username: req.body.username});
        next();
      })
    } else{
      res.sendStatus(401);
      next();
    }
  },

  logOut: function(req, res, next){
    req.logout();  
    res.clearCookie('userID');
    delete req.session.user;
    req.session.authenticated = false;
    res.clearCookie('connect.sid');
    res.sendStatus(200);
    console.log('Logout success');
  },


  isAuthenticated: function(req, res, next){ 
    if (!req.isAuthenticated()){  
      res.sendStatus(401); 
    }
    else {
      next();
    } 
  }
}
