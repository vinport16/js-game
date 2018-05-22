// drawing functions

function clearCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function drawCircle(x, y, r, fill){
	ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = fill;
    ctx.lineWidth = 0;
    ctx.strokeStyle = "rgba(255, 255, 255, 0)";
    ctx.fill();
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2, fill){
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineWidth = 3;
	ctx.strokeStyle = fill;
	ctx.stroke();
}

// setup

var canvas = document.getElementById("canvas");

canvas.width = (document.body.clientWidth-10) * 0.70 ;
canvas.height = document.body.clientHeight - 10 ;

var ctx = canvas.getContext("2d");

xcenter = canvas.width/2;
ycenter = canvas.height/2;

function printMousePos(event) {
  drawCircle(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 5, "red");
}

function drawHover(event){
  clearCanvas();
  drawCircle(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 15, "red");
}

//canvas.addEventListener("click", printMousePos); // this runs printMousePos every time the mouse clicks
canvas.addEventListener("mousemove", drawHover); // this runs printMousePos every time the position of the mouse changes
