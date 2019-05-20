const express = require('express');
const basicAuth = require('express-basic-auth')
const https = require('https');
const fs = require('fs');
const proxy = require('http-proxy-middleware');
const morgan = require('morgan');
const path = require('path');
const moment = require('moment-timezone');

const env = process.env.SERVER_ENV || "dev"
const jenkins_proxy_username = process.env.JENKINS_USER || ""
const jenkins_proxy_password = process.env.JENKINS_PASS || ""

let log = (["prod", "test"].indexOf(env.toLowerCase()) >= 0) ? "/var/log/access.log" : path.join(__dirname, 'logs', 'access.log');
morgan.token('date', (req, res, tz) => {
	return moment().tz(tz).format('DD/MMM/YYYY:HH:mm:ss ZZ'); // fix local time
})
morgan.format('localtz', ':remote-addr - :remote-user [:date[America/Chicago]] ":method :url" HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');

// proxy options
var home_api_opts = {
	target: 'http://webserver.cgull.me:3001', // target host
	changeOrigin: true, // needed for virtual hosted sites
	xfwd: true
};
var jenkins_opts = {
	onProxyReq: (proxyReq, req, res) => {
		// require basic auth for proxy but remove when sending the request
		if (req.headers.authorization) {
			let auth_header = req.headers.authorization.replace('Basic ','');
			auth_header = new Buffer(auth_header, 'base64').toString('ascii')
			let [username, password] = auth_header.split(":")
			if (username === jenkins_proxy_username && password === jenkins_proxy_password) {
				proxyReq.setHeader('Authorization', '');
			} else {
				res.status(401).send("Access Denied")
			}
		} else {
			res.status(401).send("Access Denied")
		}
	},
	target: 'http://services.cgull.me:8080', // target host
	changeOrigin: true, // needed for virtual hosted sites
	xfwd: true
};


// create the proxy (without context)
var home_api = proxy(home_api_opts);
var jenkins = proxy(jenkins_opts);

const ssl_options = (env.toLowerCase() == "prod") ? {
	cert: fs.readFileSync('/usr/local/etc/http-prauksy/sslcert/fullchain.pem'),
	key: fs.readFileSync('/usr/local/etc/http-prauksy/sslcert/privkey.pem')
} : null;
let static_dir = (["prod", "test"].indexOf(env.toLowerCase()) >= 0) ? "/usr/local/etc/http-prauksy/static" : __dirname+'/static';
let app = express();

app.use(morgan("localtz", {stream: fs.createWriteStream(log, {flags: 'a'})}));
app.use('/api', home_api);
app.use('/github-webhook/', jenkins);
app.use(express.static(static_dir));
const secure_app = (env.toLowerCase() == "prod") ? https.createServer(ssl_options, app) : null

module.exports = {
	http: app,
	https: secure_app,
	proxies: {
		home_api: home_api,
		jenkins: jenkins,
	}
}
