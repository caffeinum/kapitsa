var express = require('express');
var path = require("path");
var http = require("http");
var app = express();
// respond with "hello world" when a GET request is made to the homepage

app.use("/", express.static(__dirname + "/static"))

/* send http request get a picture url and send it back
app.get("/final", function(req, res) {
   res.send('pic\n');
})
*/
app.get("/form-submit", function(req, res) {
   // send http request get a picture url and send it back

    http.get({
        host: '127.0.0.1',
	port: '5000',
        path: '/hello/' + req.params.json,
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
	    res.send( "NODE: " + req.params.json + "\n<br>PYTHON: " + body );
        });
    });
})

app.get("/", function(req, res) {
// res.send("helloworld\n");  
	res.sendFile( path.join(__dirname, "static/index.html") )
})

app.listen(80, function () {
	console.log('app listening on port 80!')
})

