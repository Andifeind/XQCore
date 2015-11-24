var express = require('express');
var app = express();
app.use(express.static(__dirname + '/examples'));

app.listen(3000);

var app2 = express();
app2.use(express.static(__dirname + '/docs'));

app2.listen(3001);