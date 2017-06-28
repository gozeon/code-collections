var formidable = require('formidable');

var allusers =  [];

exports.showIndex = function(req,res,next){
	res.render('index',{
		"login" : req.session.login,
	});
};
exports.login = function(req,res,next){

	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		var name = fields.name;
		if(!name){
			res.send('-2');
			return;
		}
		else if(allusers.indexOf(name) != -1){
			res.send('-1');
			return;
		}
		else{
			allusers.push(name);
			req.session.name = name;
			req.session.login = true;
			res.send('1');
		}

		// req.session.name = name;
	});
}
exports.chat = function(req,res,next){
	if(!req.session.name){
		res.redirect('/');
		return;
	}
	res.render("chat",{
		"name" : req.session.name,
		"login" : true
	});
}

exports.out = function(req,res,next){
	req.session.name = '';
	req.session.login = false;
	res.render('index',{
        "login": false
    });
}