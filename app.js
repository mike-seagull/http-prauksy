var express = require('express');
var proxy = require('http-proxy-middleware');
var morgan = require('morgan');
var fs = require('fs')

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


var app = express();
app.use(morgan('common'));
app.use(saveIp);
app.use('/api', home_api);
app.use('/deploy', deploy);
app.listen(3000);
