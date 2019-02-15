const express = require('express');
const https = require('https');
const fs = require('fs');
const proxy = require('http-proxy-middleware');
const morgan = require('morgan');
const path = require('path');
const moment = require('moment-timezone');

const env = process.env.SERVER_ENV || "dev"

let log = (env.toLowerCase() == "prod") ? "/var/log/access.log" : path.join(__dirname, 'logs', 'access.log');
morgan.token('date', (req, res, tz) => {
	return moment().tz(tz).format('DD/MMM/YYYY:HH:mm:ss ZZ'); // fix local time
})
morgan.format('localtz', ':remote-addr - :remote-user [:date[America/Chicago]] ":method :url" HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');

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
	cert: fs.readFileSync('/usr/local/etc/http-prauksy/sslcert/fullchain.pem'),
	key: fs.readFileSync('/usr/local/etc/http-prauksy/sslcert/privkey.pem')
} : null;
let static_dir = (env.toLowerCase() == "prod") ? "/usr/local/etc/http-prauksy/static" : __dirname+'/static';
let app = express();

app.use(morgan("localtz", {stream: fs.createWriteStream(log, {flags: 'a'})}));
app.use('/api', home_api);
app.use(wss)
app.use(express.static(static_dir));
const secure_app = (env.toLowerCase() == "prod") ? https.createServer(ssl_options, app) : null

module.exports = {
	http: app,
	https: secure_app,
	proxies: {
		home_api: home_api,
		wss: wss
	}
}
