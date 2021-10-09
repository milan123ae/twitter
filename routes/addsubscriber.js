var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result){
	console.log('addsubscriber: cassandra connected');
});

/* GET users listing. */
router.get('/',isLoggedIn, function(req, res) {
	res.render('addsubscriber');
});



/* POST add Subscriber */

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
	client.execute(upsertSubscriber, [req.body.email, req.body.pasword, req.body.first_name, req.body.last_name] , 
	function(err, result){
		if(err){
			res.status(404).send({msg: err});
		} else{
			console.log('Subscriber Added');
			res.redirect('/');
		}
	});
});