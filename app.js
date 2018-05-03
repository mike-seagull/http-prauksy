var express = require('express');
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

var app = express();
app.use(morgan('common'));
app.use('/api', home_api);
app.use('/deploy', deploy);
app.listen(3000);
