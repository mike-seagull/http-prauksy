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

// create the proxy (without context)
var home_api = proxy(home_api_opts);

const ssl_options = (env.toLowerCase() == "prod") ? {
	cert: fs.readFileSync('/home/michaelhollister/sslcert/fullchain.pem'),
	key: fs.readFileSync('/home/michaelhollister/sslcert/privkey.pem')
} : null;

let app = express();

app.use(morgan('common'));
app.use('/api', home_api);

const secure_app = (env.toUpperCase() == "prod") ? https.createServer(ssl_options, app) : null

module.exports = {
	http: app,
	https: secure_app
}
