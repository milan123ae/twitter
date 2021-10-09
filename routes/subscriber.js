var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var session = require('express-session');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result){
	console.log('subscriber: cassandra connected');
});

var getSubscriberById = 'SELECT * FROM people.subscribers WHERE email = ?';
var getTime = 'SELECT time FROM people.timeline';

router.get('/:email',isLoggedIn, function (req, res) {
    sess = req.session;
    console.log(sess.email);
    client.execute(getSubscriberById, [req.params.email], function (err, result) {
        if (err) {
            res.status(404).send({
                msg: err
            });
        } else
            client.execute(getTime, [], function (err, result2) {
                console.log(result2.rows[0]);
                if (err) {
                    res.status(404).send({
                        msg: err
                    });
                } else

                {
                    res.render('subscriber', {
                        session: sess.email,
                        time: result2.rows[0].time,
                        email: result.rows[0].email,
                        pasword: result.rows[0].pasword,
                        first_name: result.rows[0].first_name,
                        last_name: result.rows[0].last_name,
                    })
                }
            });
    });
});

var deleteSubscriber = "DELETE FROM people.subscribers WHERE email = ?";

router.delete('/:email', function(req, res){
	client.execute(deleteSubscriber,[req.params.email], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		} else{
			res.json(result);
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
