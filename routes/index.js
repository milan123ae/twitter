var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result){
	console.log('index: cassandra connected');
});

var getAllSubscribers = 'SELECT * FROM people.subscribers';

/* GET home page. */

router.get('/', function(req, res) {
    sess=req.session;
    /*
    * Here we have assign the 'session' to 'sess'.
    * Now we can create any number of session variable we want.
    * in PHP we do as $_SESSION['var name'].
    * Here we do like this.
    */
    sess.email; // equivalent to $_SESSION['email'] in PHP.
   client.execute(getAllSubscribers,[],function(err,result){
	  if(err){
		  res.status(404).send({msg: err});
	  } 
	  else
		  {
			res.render('index',{
				subscribers: result.rows
		 }) 
	  }
  });
});

router.put('/likes/:time',function(req, res){
	console.log(req.body);
    console.log(req.params.time);
    var upsertLikes = "update people.timeline set likes=likes+ ['"+req.body.likes+"'] where time="+req.params.time;
    

	//var upsertSubscriber = 'INSERT INTO people.subscribers(email, pasword, first_name, last_name) VALUES(?,?,?,?)';
	client.execute(upsertLikes, { prepare: true} , 
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

router.get('/logout',function(req,res){
req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/');
  }
});
});

module.exports = router;

var getSubs = 'SELECT email, pasword FROM people.subscribers';
var jet = new Boolean(false);
router.post('/',function(req, res){
sess = req.session;
  sess.email=req.body.email;
    console.log(sess.email);
	client.execute(getSubs,[], 
	function(err, result){
		var mail = result.rows[0].email;
		var pass = result.rows[0].pasword;
		if(err){
             console.log(mail,pass,"OVDE");
			res.status(404).send({msg: err});
		} 
            for(var i=0; i<result.rows.length;i++){
                    if (sess.email == result.rows[i].email && req.body.pasword == result.rows[i].pasword) {
                        //console.log(result.rows[i].email, result.rows[i].pasword,req.body.pasword,req.body.email,"OPA");
                        res.redirect('/subscriber/'+result.rows[i].email);
                        jet = true;
   }}
        if(jet == false)
            {
                console.log('wrong password');
                res.send('loginMessage', 'Oops! Wrong password.');
            }
  
	});
});


