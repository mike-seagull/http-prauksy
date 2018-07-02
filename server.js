const app = require('./app')

app.http.listen(3080)
if (app.https) {
	app.https.listen(3443);
}
