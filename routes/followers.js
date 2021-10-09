var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result){
	console.log('followers: cassandra connected');
});

var getAllFollowers = 'SELECT followers FROM people.subscribers where email=?';
var result1;
result2 = "1,2,3";
console.log(result2);
result1 = "1,2,3".split(","); 
console.log(result1);
/* GET home page. */
router.get('/:email',isLoggedIn, function(req, res) {
   client.execute(getAllFollowers,[req.params.email],{ prepare : true },function(err,result){
	  if(err){
		  res.status(404).send({msg: err});
	  } 
	  else
		  {
			  console.log(result.rows);
			res.render('followers',{
				subscribers: result.rows
		 }) 
	  }
  });
});

function isLoggedIn(req, res, next){
    sess=req.session;
    if(sess.email){
        next();
    }else {
        res.redirect('/');
    }
}
module.exports = router;