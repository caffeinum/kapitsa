var express = require('express');
var path = require("path");
var http = require("http");
var bodyparser = require("body-parser")
var swig  = require('swig');

var image_generator = require("./image_gen")
var app = express();

var template_index = swig.compileFile( path.join(__dirname, "static/index.html") )
var template_final = swig.compileFile( path.join(__dirname, "static/final.html") )


app.use(bodyparser.urlencoded({
    extended: true
}))
app.use("/", express.static(__dirname + "/static"))


app.get("/feedback", function(req, res) {
    http.get({
        host: 'localhost',
        port: '5000',
        path: '/feedback?id=' + req.query.id + "&status=" + req.query.status,
    }, function( response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            res.send("Success!")    
        });
    })
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
                image_url = "static/img/results/error.png"
            }
            var output = template_final({
                score: Math.round( 100 * score),
                image_url: image_url,
                image_id: id,
                user_id: id
            });

            res.send(output)
                
        });
    });

})

app.get("/team", function(req, res) {  
    res.sendFile( path.join(__dirname, "static/team.html") )
})


app.get("*", function(req, res) {  
    console.log(req.query)
    var output = template_index({
                need_share: req.query.need_share,
                image_url: req.query.image_url,
                score: req.query.score
            });
    res.send(output)
})

app.listen(80, function () {
	console.log('app listening on port 80!')
})

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
