var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result){
	console.log('editsubscriber: cassandra connected');
});

var getSubscriberByemail = 'SELECT * FROM people.subscribers WHERE email = ?';

/* GET users listing. */
router.get('/:email',isLoggedIn, function(req, res) {
	client.execute(getSubscriberByemail,[req.params.email], { prepare : true }, function(err, result){
		if(err){
			console.log(result.rows[0].email);
		  res.status(404).send({msg: err});
	  } 
	  else
		  {
			res.render('editsubscriber',{
				email: result.rows[0].email,
				pasword: result.rows[0].pasword,
				first_name: result.rows[0].first_name,
				last_name: result.rows[0].last_name,
		 }) 
	  }
	});
});

/* POST Edit Subscriber */

function isLoggedIn(req, res, next){
    sess=req.session;
    if(sess.email){
        next();
    }else {
        res.redirect('/');
    }
}

module.exports = router;

router.post('/',function(req, res){
	var upsertSubscriber = 'INSERT INTO people.subscribers(email, pasword, first_name, last_name) VALUES(?,?,?,?)';  
	client.execute(upsertSubscriber, [req.body.email, req.body.pasword
	, req.body.first_name, req.body.last_name] , 
	function(err, result){
		if(err){
			res.status(404).send({msg: err});
		} else{
			console.log('Subscriber Added');
			res.redirect('/');
		}
	});
});