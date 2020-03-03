var express = require('express');
var router = express.Router();
var cp = require('child_process')

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/msg', function (req, res, next) {
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-control": "no-cache"
	})
	var spw = cp.spawn('ping', ['-c', '20', '127.0.0.1'])
	var str = ""
	var id = Date.now()


	spw.stdout.on('data', function (data) {
		str += data.toString();

		console.log("data: ", data.toString())

		// Flush out line by line.
		var lines = str.split("\n");
		for (var i in lines) {
			if (i == lines.length - 1) {
				str = lines[i];
			} else {
				res.write('['+id+'] ' + 'data: ' + lines[i] + "\n\n")
			}
		}
	})
	spw.stderr.on('data', function (data) {
		res.end('stderr: ' + data)
	})
	spw.on('error', function (err) {
		console.log('error:', err.message)
		res.end(err.stack)
	})
	spw.on('close', function (code) {
		console.log('close:', code)
		res.end(str);
	})

})

module.exports = router;
