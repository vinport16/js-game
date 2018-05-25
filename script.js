// drawing functions

function clearCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
}

function clearListeners(){
  var clone = canvas.cloneNode(true);
  canvas.parentNode.replaceChild(clone, canvas);
  canvas = clone;
  ctx = canvas.getContext("2d");

  drawEverything();
}

function drawCircle(position, r, fill, stroke){
	ctx.beginPath();
  ctx.arc(position.x, position.y, r, 0, 2 * Math.PI, false);
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();
}

function drawRectangle(tl, br, fill, stroke){
  ctx.beginPath();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.rect(tl.x, tl.y, br.x, br.y);
  ctx.fill();
  ctx.stroke();
}

function drawLine(v1, v2, stroke){
	ctx.beginPath();
	ctx.moveTo(v1.x,v1.y);
	ctx.lineTo(v2.x,v2.y);
	ctx.lineWidth = 2;
	ctx.strokeStyle = stroke;
	ctx.stroke();
}

function drawTower(o){
  drawCircle(o.position,o.radius,o.color,"rgba(255,255,100,1)");
  drawCircle(o.position, o.range, "rgba(0,255,0,0.08)", "rgba(255,255,255,0.0)");
}

function drawProtoTower(proto){
  if(checkCollisions(proto)){
    drawCircle(proto.position,proto.radius,"rgba(0,0,0,0)","rgba(255,100,100,100)");
  }else{
    drawCircle(proto.position,proto.radius,"rgba(0,0,0,0)","rgba(100,255,100,100)");
  }

  //draw connections
  proto.connected = [];
  protoConnect(proto);

  for(var j = 0; j < proto.connected.length; j++){
    var o = proto.connected[j];
    drawLine(getCenter(proto),getCenter(o),"rgba(20,80,200,0.3)");
  }

  //draw firing radius
  drawCircle(proto.position, proto.range, "rgba(0,0,0,0)", "rgba(255,255,255,0.6)");
}

function drawBuilding(o){
  drawRectangle(o.topLeft,subtract(o.bottomRight,o.topLeft),"rgba(0,255,0,0.1)","rgba(100,255,255,1)");
}

function drawProtoBuilding(proto){
  if(checkCollisions(proto)){
    drawRectangle(proto.topLeft,subtract(proto.bottomRight,proto.topLeft),"rgba(0,0,0,0)","rgba(255,100,100,100)");
  }else{
    drawRectangle(proto.topLeft,subtract(proto.bottomRight,proto.topLeft),"rgba(0,0,0,0)","rgba(100,255,100,100)");
  }

  //draw connections
  proto.connected = [];
  protoConnect(proto);

  for(var j = 0; j < proto.connected.length; j++){
    var o = proto.connected[j];
    drawLine(getCenter(proto),getCenter(o),"rgba(20,80,200,0.3)");
  }
}

function drawShip(o){
  drawCircle(o.position,o.radius,"rgba(255,0,0,0.6)","rgba(255,255,255,0.3)");
}

function drawProjectile(p){
  drawCircle(p.position,p.radius,p.color,"rgba(0,0,0,0)");
}

function drawEnemyProjectile(p){
  drawCircle(p.position,p.radius,p.color,"rgba(255,0,0,0.5)");
}

var zeroVector = {x:0,y:0};

function getVector(e){
  return {x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop};
}

function subtract(v1, v2){
  return {x: v1.x-v2.x, y: v1.y-v2.y};
}

function add(v1, v2){
  return {x: v1.x+v2.x, y: v1.y+v2.y};
}

function divide(v1,n){ //divide a vector by a number
  return {x: v1.x/n, y: v1.y/n};
}

function multiply(v1,n){ //multiply a vector by a number
  return {x: v1.x*n, y: v1.y*n};
}

function distance(v1, v2){
  return Math.sqrt( (v1.x-v2.x)*(v1.x-v2.x) + (v1.y-v2.y)*(v1.y-v2.y) );
}

function unitVector(v){
  return divide(v, distance(zeroVector,v));
}
// setup

var canvas = document.getElementById("canvas");

canvas.width = (document.body.clientWidth-10) * 0.70 ;
canvas.height = document.body.clientHeight - 10 ;

var ctx = canvas.getContext("2d");

var paused = false;
document.getElementById("pause").addEventListener("click",function(){paused = !paused;});








// ok
