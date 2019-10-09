'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

let metricsService = require('./data/metricsService');

let setActivity = require('./activities/setShortLinkActivity');
let getActivity = require('./activities/getLinkActivity');

app.post('/create', function (req, res) {
	let link = req.body.params.link;
	let requestedShortLink = req.body.params.requestedShortLink || "";

	if (!link || link == "") {
		res.writeHead(400, {'Content-Type': 'text/json'});
		res.write("Link not specified");
		res.end();
		return;
	}

	try {
		let result = setActivity.exec(link, requestedShortLink);
		res.writeHead(200, {'Content-Type': 'text/json'});
		res.write(JSON.stringify(result));
		res.end();
		return;
	} catch (err) {
		console.log(err);
		res.writeHead(500, {'Content-Type': 'text/json'});
		res.write(err);
		res.end();
		return;
	}
});

app.get('/:shortLink', function (req, res) {
	let shortLink = req.params.shortLink || "";
	if (shortLink === "") {
		res.writeHead(400, {'Content-Type': 'text/html'});
		res.write("Shortcut not defined");
		res.end();
		return;
	} 

	let fullLink;
	try {
		fullLink = getActivity.exec(shortLink, req);
	} catch (err) {
		console.log(err);
		res.writeHead(500, {'Content-Type': 'text/json'});
		res.write(err);
		res.end();
		return;
	}

	if (fullLink) {
		res.redirect(fullLink);
		res.end();
		return;
	} else {
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.write("Link not found for shortlink");
		res.end();
		return;
	}
});

app.post('/get-metrics', function(req, res) {
	let shortLink = req.body.params.shortLink || "";
	if (!shortLink || shortLink == "") {
		res.writeHead(400, {'Content-Type': 'text/json'});
		res.write("shortLink not specified");
		res.end();
		return;
	}

	metricsService.generateMetrics(shortLink).then(result => {
		console.log(result);
		res.writeHead(200, {'Content-Type': 'text/json'});
		res.write(JSON.stringify(result));
		res.end();
	})
	return;
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
