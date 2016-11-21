var Canvas = require('canvas')

var fs = require('fs');
var width = 1032
var height = 617

function drawBackground() {
	ctx.fillStyle = "#F1F2E4"
	ctx.fillRect(0,0,width,height)
}

function drawBorder() {
	ctx.beginPath()
	ctx.strokeStyle = "#557a5d"
	ctx.lineWidth = "10"
	ctx.rect(0,0,width,height)
	ctx.stroke()
}

function drawFace(grade) {
	var half = height / 2
	var kap = fs.readFileSync(__dirname + "/static/img/results/st.png")
  	img = new Image;
  	img.src = kap;
	ctx.drawImage(img, 0, 0, width, height)
//  	ctx.drawImage(img, half - img.width/2, half - img.height/2, img.width, img.height);
}

function drawTexts(grade) {
	ctx.fillStyle = "black"
	ctx.font = "30px Verdana"
	ctx.fillText("Главный признак таланта - это", 500, 500)
	ctx.fillText("когда человек знает, чего он хочет", 450, 550)
}

function drawGrade(grade) {
	ctx.fillStyle = "#F1F2E4"
	ctx.fillRect(650,200,350,200)

	ctx.fillStyle = "#3B797D"
	ctx.font = 'bold 120px impact';
	ctx.fillText(grade + "%", 650, 400);
 
}

function drawKapitsa(ctx, grade) {
	ctx.clearRect(0,0,width,height)
// draw background
//	drawBackground()
// draw image switch
	drawFace(grade)
// draw citation and header
//	drawBorder()
// draw grade
	drawGrade(grade)
}

function generator(grade) {
	Image = Canvas.Image
	canvas = new Canvas(width, height)
	
	ctx = canvas.getContext('2d')
	drawKapitsa(ctx, grade*100)
	
	var path = '/img/results/' + randomString(8) + '.png'
	fs.writeFileSync(__dirname + "/static" + path, canvas.toBuffer());
	
	return path;
}

function randomString(N) {
	var s = "abcdefghijklmnopqrstuvwxyz";
	return Array(N).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
}

module.exports = generator
