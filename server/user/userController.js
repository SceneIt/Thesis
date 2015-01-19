var db = require('../DB/db.js')

module.exports = {

  // Setup response data if signup/signin is successful
  // Set cookies for userid and username
  // Send 200 status and username in res body
  // If unsuccessful, send 403
  signIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      var userID = "";
      console.log('Signin success');
      db.User.find({
        where: {
          userName: req.body.username
        }
      }).then(function(user) {
        console.log(user);
        userID = user.id;
        res.cookie('userID', userID, {
          httpOnly: false
        });
        res.cookie('username', user.userName, {
          httpOnly: false
        });
        res.status(200).send({
          username: req.body.username,
          userid: userID
        });
        next();
      })
    } else {
      res.sendStatus(401);
      next();
    }
  },

  //  Log out and send response
  // Clear cookies - userid, username, passport
  logOut: function(req, res, next) {
    req.logout();
    delete req.session.user;
    req.session.authenticated = false;
    res.clearCookie('connect.sid');
    res.clearCookie('userID');
    res.clearCookie('username');
    res.sendStatus(200);
    console.log('Logout success');
  },

  // Verify user is still authenticated on server side
  isAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      res.sendStatus(401);
    } else {
      next();
    }
  }
}
