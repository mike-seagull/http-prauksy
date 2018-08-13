const express = require('express');
const https = require('https');
const fs = require('fs');
const proxy = require('http-proxy-middleware');
const morgan = require('morgan');

const env = process.env.SERVER_ENV || "dev"

// proxy options
var home_api_opts = {
	target: 'http://127.0.0.1:3001', // target host
	changeOrigin: true, // needed for virtual hosted sites
	xfwd: true
};
var wss_opts = {
	target: 'http://127.0.0.1:3002',
	ws: true
}

// create the proxy (without context)
var home_api = proxy(home_api_opts);
var wss = proxy('/ws', { target: 'http://127.0.0.1:3002', ws: true});

const ssl_options = (env.toLowerCase() == "prod") ? {
	cert: fs.readFileSync('/usr/local/etc/sslcert/fullchain.pem'),
	key: fs.readFileSync('/usr/local/etc/sslcert/privkey.pem')
} : null;
let static_dir = (env.toLowerCase() == "prod") ? "/usr/local/etc/sslcert/static" : __dirname+'/static';
app.use(express.static(static_dir));
let app = express();

app.use(morgan('common'));
app.use('/api', home_api);
app.use(wss)

const secure_app = (env.toLowerCase() == "prod") ? https.createServer(ssl_options, app) : null

module.exports = {
	http: app,
	https: secure_app,
	proxies: {
		home_api: home_api,
		wss: wss
	}
}
