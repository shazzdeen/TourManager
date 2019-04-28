const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const tour = require('./routes/tour.js')
const api = require('./routes/api.js')
const port = 3000




app.use(express.static('TM/'))
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(bodyParser.json());
app.use(express.json({strict: true}));
//app.use(express.methodOverride());
//app.use(app.router);

app.all('/tour/:method', (req, res) => tour[req.params.method](req, res))
//app.all('/v1/api/:method', (req, res, next) => api[req.params.method](req.originalUrl, res); next())

app.all('/v1/api/:method', function(req, res, next){
	res.setHeader('Content-Type', 'application/json');
	api[req.params.method](req, res);
	//next();
})

app.listen(port, () => console.log(`TM app listening on port ${port}!`))