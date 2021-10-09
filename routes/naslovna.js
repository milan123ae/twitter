var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var session = require('express-session');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result){
	console.log('naslovna: cassandra connected');
});

var getAllTweet = 'SELECT * FROM people.timeline';
router.get('/',isLoggedIn, function(req, res) {
    sess = req.session;
	client.execute(getAllTweet,[], function(err, result){
        console.log(result);
		if(err){
            console.log(getAllTweet);
		  res.status(404).send({msg: err});
	  } 
	  else
		  {
			res.render('naslovna',{
                session: sess.email,
                data: result.rows,
				email: result.rows[0].email,
				time: result.rows[0].time,
				body: result.rows[0].body,
                since: result.rows[0].since,
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
//( INSERT INTO people.timeline(time,email, since, body) VALUES (now(),'milan.rodja1994gmail.com', dateof(now()), 'samoo');
//'INSERT INTO people.timeline(email, time, since, body)  VALUES(tempo,now(),dateof(now()),req.body.tweet)
//	var upsertSubscriber = 'INSERT INTO people.subscribers(email, pasword, first_name, last_name) VALUES(?,?,?,?)';
router.post('/',function(req, res){
    sess = req.session;
    var tempo = sess.email;
	var upsertTweet = 'INSERT INTO people.timeline(email, time, since, body)  VALUES(?,now(),dateof(now()),?)';
    console.log(req.body.tweet,tempo);
	client.execute(upsertTweet,[tempo,req.body.tweet]
    ,{ prepare: true} , 
	function(err, result){
		if(err){
			res.status(404).send({msg: err});
		} else{
			console.log('Tweet Added');
			res.redirect('/naslovna');
		}
	});
});

module.exports = router;

