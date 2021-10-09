var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var session = require('express-session');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result){
	console.log('tweet: cassandra connected');
});

var getTweet = 'SELECT * FROM people.timeline WHERE time = ?';

router.get('/:time',isLoggedIn, function (req, res) {
    sess = req.session;
    client.execute(getTweet, [req.params.time], function (err, result) {
        if (err) {
            res.status(404).send({
                msg: err
            });
        }else

                {
			     res.render('tweet',{
                     data: result.rows,
                     session: sess.email,
                     likes: result.rows[0].likes,
				    email: result.rows[0].email,
				    time: result.rows[0].time,
				    body: result.rows[0].body,
                     since: result.rows[0].since,
                     comments: result.rows[0].comment,
    
                    })
                }
            });
    });

 var deleteTweet = "DELETE FROM people.timeline WHERE time = ?";

router.delete('/:time', function(req, res){
	client.execute(deleteTweet,[req.params.time], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		} else{
			res.json(result);
		}
	});
}); 



//var upsertComments 'INSERT INTO timeline(email,time,since,body,comment) VALUES(?,?,?,?,?)';
router.put('/:time',function(req, res){
	console.log(req.body);
    console.log(req.params.time);
    var upserComments = "update people.timeline set comment=comment+ ['"+req.body.comment+"'] where time="+req.params.time;
    

	//var upsertSubscriber = 'INSERT INTO people.subscribers(email, pasword, first_name, last_name) VALUES(?,?,?,?)';
	client.execute(upserComments, { prepare: true} , 
	function(err, result){
		if(err){
            console.log(req.body.comment);
			res.status(404).send({msg: err});
		} else{
			console.log('Coment Aded');
            res.json(result);
			//res.redirect('back');
                                    //res.redirect('/subscriber/'+result.rows[i].email);
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
