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
  //draw range
  drawCircle(o.position, o.range, "rgba(0,255,0,0.08)", "rgba(255,255,255,0.0)");
  //draw health level
  var p1 = subtract(o.position,{x:10,y:(4+o.radius)});
  var p2 = {x:(p1.x+20),y:(p1.y)};
  drawLine(p1,p2,"rgba(200,50,50,1)");
  p2.x = p1.x + 20*(o.health/o.maxHealth);
  drawLine(p1,p2,"rgba(150,200,150,1)");
}

function drawProtoTower(proto){
  if(checkCollisions(proto) || proto.price > gems){
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
  //draw energy level
  var p1 = subtract(o.topLeft,{x:0,y:3});
  var p2 = {x:o.bottomRight.x,y:p1.y};
  drawLine(p1,p2,"rgba(100,100,100,1)");
  p2.x = p1.x + (o.energy/o.energyMax)*(p2.x-p1.x);
  drawLine(p1,p2,"rgba(100,150,200,1)");
  //draw health level
  p1 = subtract(o.topLeft,{x:0,y:6});
  p2 = {x:o.bottomRight.x,y:p1.y};
  drawLine(p1,p2,"rgba(200,50,50,1)");
  p2.x = p1.x + (o.health/o.maxHealth)*(p2.x-p1.x);
  drawLine(p1,p2,"rgba(150,200,150,1)");
}

function drawProtoBuilding(proto){
  if(checkCollisions(proto) || proto.price > gems){
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
  //draw health level
  var p1 = subtract(o.position,{x:10,y:(4+o.radius)});
  var p2 = {x:(p1.x+20),y:(p1.y)};
  drawLine(p1,p2,"rgba(200,50,50,1)");
  p2.x = p1.x + 20*(o.health/o.maxHealth);
  drawLine(p1,p2,"rgba(150,200,150,1)");
}

function drawProjectile(p){
  drawCircle(p.position,p.radius,p.color,"rgba(0,0,0,0)");
}

function drawEnemyProjectile(p){
  drawCircle(p.position,p.radius,p.color,"rgba(255,0,0,0.5)");
}

function displayEnergy(){
  if(getEnergyCapacity()>0){
    document.getElementById("amount").style.width = ""+(100*getEnergyTotal()/getEnergyCapacity())+"%";
  }else{
    document.getElementById("amount").style.width = "0%";
  }
  document.getElementById("amount").innerHTML ="&nbsp" + Math.round(getEnergyTotal()) + "e";
}

function displayGems(){
  document.getElementById("gems").innerHTML = gems + "G";
}

function showPrices(){
  document.getElementById("text").innerHTML =
    "<strong>Prices:</strong><br>"+
    "default building: "+prices.defaultBuilding+"G<br>"+
    "battery: "+prices.battery+"G<br>"+
    "solar farm: "+prices.solarFarm+"G<br>"+
    "default tower: "+prices.defaultTower+"G<br>"+
    "ranged tower: "+prices.rangedTower+"G<br>"+
    "heavy tower: "+prices.heavyTower+"G<br>"+
    "chaingun tower: "+prices.chaingunTower+"G<br>"+
    "connection tower: "+prices.connectionTower+"G<br>";

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
function pause(){
  paused = !paused;
  if(!paused){
    document.getElementById("defaultBuilding").disabled = true;
    document.getElementById("defaultTower").disabled = true;
    document.getElementById("battery").disabled = true;
    document.getElementById("rangedTower").disabled = true;
    document.getElementById("solarFarm").disabled = true;
    document.getElementById("heavyTower").disabled = true;
    document.getElementById("chaingunTower").disabled = true;
    document.getElementById("relay").disabled = true;
    document.getElementById("pause").innerHTML = "pause";
  }else{
    document.getElementById("defaultBuilding").disabled = false;
    document.getElementById("defaultTower").disabled = false;
    document.getElementById("battery").disabled = false;
    document.getElementById("rangedTower").disabled = false;
    document.getElementById("solarFarm").disabled = false;
    document.getElementById("heavyTower").disabled = false;
    document.getElementById("chaingunTower").disabled = false;
    document.getElementById("relay").disabled = false;
    document.getElementById("pause").innerHTML = "resume";
  }
}

document.getElementById("pause").addEventListener("click",pause);







// ok
