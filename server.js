var express = require('express');
var app = express();

// String
//notifier.notify('Message');

app.use(express.static(__dirname + '/public'));

const port = 3000;

app.listen(port);
console.log(port);

 
