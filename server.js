const app = require('./app')

var server = app.http.listen(3080)
if (app.https) {
	app.https.listen(3443);
}
server.on("upgrade", app.proxies.wss.upgrade)