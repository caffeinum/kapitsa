var express = require('express');
var path = require("path");
var http = require("http");
var bodyparser = require("body-parser")
var swig  = require('swig');

var image_generator = require("./image_gen")
var app = express();

var template = swig.compileFile( path.join(__dirname, "static/final.html") )

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
            
            var json = JSON.parse(body)
	    console.log("j", json);
            if ( json["OK"] ) {
                var score = Number(json["score"])
                var id = json["id"]
                var url = image_generator(id, score)
                json["url"] = url
                res.send( json )
            } else {
                res.send(json)
            }
                
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

app.post("/final", function(req, res){
    console.log(req.body)
    http.get({
        host: 'localhost',
        port: '5000',
        path: '/get-pict?data=' + encodeURIComponent( JSON.stringify(req.body) ),
    }, function(response) {
        // Continuously update stream with data

        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            var image_url = ""
            var json = JSON.parse(body)
            
            console.log( "json", json )
            
            if ( json["OK"] ) {
                var score =  Number( json["score"] )
                var id = json["id"]
                
                image_url = image_generator(id, score)
            } else {
                image_url = "error.png"
            }
            var output = template({
                score: Math.round( 100 * score),
                image_url: image_url,
                image_id: id
            });

            res.send(output)
                
        });
    });

})

app.listen(80, function () {
	console.log('app listening on port 80!')
})

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
