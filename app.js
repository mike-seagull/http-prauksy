var express = require('express');
const https = require('https');
const fs = require('fs');
var proxy = require('http-proxy-middleware');
var morgan = require('morgan');

// proxy options
var home_api_opts = {
	target: 'http://127.0.0.1:3001', // target host
	changeOrigin: true // needed for virtual hosted sites
};

var deploy_opts = {
	target: 'http://127.0.0.1:3002', // target host
	changeOrigin: true // needed for virtual hosted sites
};
// create the proxy (without context)
var home_api = proxy(home_api_opts);
var deploy = proxy(deploy_opts);

function saveIp(req, resp, next) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	fs.appendFile('/home/michaelhollister/repos/http-proxy/access.log', ip+"\n", (err) => {
		if (err) {
			console.error(err);
		}
	});
	next();
}

const ssl_options = {
	cert: fs.readFileSync(__dirname+'/sslcert/fullchain.pem'),
	key: fs.readFileSync(__dirname+'/sslcert/privkey.pem')
};

var app = express();
app.use(morgan('common'));
app.use(saveIp);
app.use(express.static(__dirname+'/static'));
app.use('/api', home_api);
app.use('/deploy', deploy);

app.listen(3080);
https.createServer(ssl_options, app).listen(3443);
