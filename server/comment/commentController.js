  var db = require('../DB/db.js');

  module.exports = {
  	getComments: function(req,res){
      //grabs all photo entries and stores them in an array
      db.Comment.findAll({
        where:{PhotoId: req.query.id},
        include: [{ model: db.User, attributes: ['id','userName']}]
      }).then(function(comments){
        console.log("commentssdfasdfdsa", comments);
        res.json(comments);
      })
  	},
    postComment: function(req,res){
      var comment = req.body;
      var newComment = db.Comment.create({
         comment: req.body.comment,
         commentScore: 0,
         UserId: req.body.userid,
         PhotoId: req.body.photoid
      }).then(function(data){
        res.json(data.values);
      });
    }
  }
