var express = require('express');
var path = require("path");
var http = require("http");
var bodyparser = require("body-parser")

var image_generator = require("/home/kapitsa/image_gen")
var app = express();

app.use(bodyparser.urlencoded({
    extended: true
}))
app.use("/", express.static(__dirname + "/static"))

app.get("/image-gen", function(req, res) {
	var url = image_generator(55)	

	console.log( url )
	console.log( path.join(__dirname, url) )
	res.sendFile( path.join(__dirname, url) )
})

app.post("/form-submit", function(req, res) {
   // send http request get a picture url and send it back
console.log(req.body)
    http.get({
        host: 'localhost',
	port: '5000',
        path: '/get-pict?data=' + encodeURIComponent(req.body.json),
    }, function(response) {
        // Continuously update stream with data

	var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
	    var score = Number(body)

	    var url = image_generator(score)
	    res.send( url )
        });
    });
})

app.get("/", function(req, res) {
// res.send("helloworld\n");  
	res.sendFile( path.join(__dirname, "static/index.html") )
})

app.get("/set-answer", function(req,res) {
    var ans = req.query.answer
    var id = req.query.id
    
    // SAVE TO DB IF QUESTION IS OK
})

app.listen(80, function () {
	console.log('app listening on port 80!')
})

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

setTimeout(function () {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
