var express = require('express');
var app = express();
var ejs = require('ejs');
var path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

var port = 8080;

var defaultRoutes = require('./routes/index.js');


app.use('/static', express.static(path.join(__dirname, 'static')));
app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);

app.use('/', defaultRoutes);

app.listen(port, function () {
   console.log(`http://localhost:${port}`);
});


 