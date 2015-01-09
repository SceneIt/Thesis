  var db = require('../DB/db.js');

  module.exports = {
  	getComments: function(req,res){
      //grabs all photo entries and stores them in an array
      db.Comment.findAll({where:{PhotoId: req.query.id}}).then(function(comments){
        res.json(comments);
      })
  	},
    postComment: function(req,res){
      var comment = req.body;
      console.log()
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
