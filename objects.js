/*

vector:
  - x (integer)
  - y (integer)

tower:
 - type ("tower")
 - position (vector)
 - radius (integer)
 - range (integer) : firing radius
 - energyRange (integer) : distance that energy can be transfered to/from
 - connected (array of objects) : things that can send energy to/from
 - maxHealth (integer)
 - health (integer)
 - fireRate (integer) : max fires per second
 - fireEnergy (integer) : amount of energy needed per fire
 - projectile (object or false)
 - laser (object or false)

projectile:
 - type ("projectile")
 - position (vector)
 - velocity (vector)
 - target (object or false) : for seeking projectiles
 - damage (integer)
 - color (string)

laser:
 - type ("laser")
 - start object (object)
 - end object (object)
 - damage (integer)
 - duration (float)

building:
 - type ("building")
 - name (string)
 - topLeft (vector)
 - bottomRight (vector) : two corners define a rectangle
 - energyRange (integer) : distance that energy can be transfered to/from
 - connected (array of objects) : things that can send energy to/from
 - maxHealth (integer)
 - health (integer)
 - energyRate (float) : how much energy can be produced per pixel per second
 - energyMax : maximum energy storage
 - energy : amount of energy in storage
 - vital (boolean) : specifies if destruction of building will end the game

ship:
 - type ("ship")
 - position (vector)
 - volocity (vector)
 - radius (integer)
 - range (integer) : firing radius
 - maxHealth (integer)
 - health (integer)
 - moveTarget (object) : thing it's moving towards
 - fireTarget (object) : thing it's firing at
 - fireRate (integer) : max fires per second
 - fire (function)

*/

var objects = []; // all of the objects under your control
var enemies = []; // all of the objects under enemy control

function getCenter(object){
  var center;
  if(object.type == "building"){
    return {x: (object.topLeft.x + object.bottomRight.x)/2, y:(object.topLeft.y + object.bottomRight.y)/2 };
  }else if(object.type == "tower" || object.type == "projectile" || object.type == "ship"){
    return object.position;
  }
}

function connect(o1,o2){
  o1.connected.push(o2);
  o2.connected.push(o1);
}

function connectToAll(o1){
  var center1 = getCenter(o1);
  for(var i = 0; i < objects.length; i++){
    var o2 = objects[i];
    var center2 = getCenter(o2);
    if(distance(center1,center2) < o1.energyRange + o2.energyRange){
      connect(o1,o2);
    }
  }
}

function protoConnect(o1){
  var center1 = getCenter(o1);
  for(var i = 0; i < objects.length; i++){
    var o2 = objects[i];
    var center2 = getCenter(o2);
    if(distance(center1,center2) < o1.energyRange + o2.energyRange){
      o1.connected.push(o2);
    }
  }
}

function rectanglesOverlap(aw, ah, acx, acy, bw, bh, bcx, bcy){
  var w = 0.5 * (aw + bw);
  var h = 0.5 * (ah + bh);
  var dx = acx - bcx;
  var dy = acy - bcy;

  if (Math.abs(dx) <= w && Math.abs(dy) <= h)
  {
    return true;
    /*
    var wy = w * dy;
    var hx = h * dx;

    if (wy > hx)
    if (wy > -hx)
    // collision at the top
    else
    // on the left
    else
    if (wy > -hx)
    // on the right
    else
    // at the bottom
    */
  }
  return false;
}

function buildingTowerOverlap(rect,circle){
  var width = Math.abs(rect.topLeft.x - rect.bottomRight.x);
  var height = Math.abs(rect.topLeft.y - rect.bottomRight.y);

  var x = Math.abs(circle.position.x - (rect.topLeft.x+rect.bottomRight.x)/2);
  var y = Math.abs(circle.position.y - (rect.topLeft.y+rect.bottomRight.y)/2);

  if (x > (width/2 + circle.radius)) { return false; }
  if (y > (height/2 + circle.radius)) { return false; }

  if (x <= (width/2)) { return true; }
  if (y <= (height/2)) { return true; }

  var cornerDistance_sq = (x - width/2)*(x - width/2) +  (y - height/2)*(y - height/2);

  return cornerDistance_sq <= (circle.radius*circle.radius);
}

function checkCollisions(object){
  for(var i = 0; i < objects.length; i++){
    var o = objects[i];
    if(object.type == "building" && o.type == "building"){

      var aw = Math.abs(object.topLeft.x - object.bottomRight.x);
      var ah = Math.abs(object.topLeft.y - object.bottomRight.y);
      var acx = (object.topLeft.x + object.bottomRight.x)/2;
      var acy = (object.topLeft.y + object.bottomRight.y)/2;
      var bw = Math.abs(o.topLeft.x - o.bottomRight.x);
      var bh = Math.abs(o.topLeft.y - o.bottomRight.y);
      var bcx = (o.topLeft.x + o.bottomRight.x)/2;
      var bcy = (o.topLeft.y + o.bottomRight.y)/2;
      if(rectanglesOverlap(aw, ah, acx, acy, bw, bh, bcx, bcy)){
        return true;
      }
    }else if(object.type == "tower" && o.type == "tower"){

      var distance = Math.sqrt( (object.position.x-o.position.x)*(object.position.x-o.position.x) + (object.position.y-o.position.y)*(object.position.y-o.position.y) );
      if(distance < object.radius+o.radius){
        return true;
      }

    }else if(object.type == "tower" && o.type == "building"){

      if(buildingTowerOverlap(o,object)){
        return true;
      }

    }else if(object.type == "building" && o.type == "tower"){

      if(buildingTowerOverlap(object,o)){
        return true;
      }

    }else{
      console.log("invalid type! -> "+object.type+" or "+o.type);
    }
  }
  return false;
}

function drawEverything(){
  clearCanvas();
  //first draw connections

  for(var i = 0; i < objects.length; i++){
    //we're just gonna be lazy and draw all of the connections twice
    o1 = objects[i];
    for(var j = 0; j < o1.connected.length; j++){
      var o2 = o1.connected[j];
      drawLine(getCenter(o1),getCenter(o2),"rgba(20,80,200,0.3)");
    }
  }
  //next draw buildings and towers
  for(var i = 0; i < objects.length; i++){
    var o = objects[i];
    if(o.type == "building"){
      drawRectangle(o.topLeft,subtract(o.bottomRight,o.topLeft),"rgba(0,40,0,10)","rgba(100,255,255,100)");
    }else if(o.type == "tower"){
      drawCircle(o.position,o.radius,"rgba(0,0,100,10)","rgba(255,255,100,100)");
    }
  }
  //next draw ships

  //next draw lasers

  //next draw projectiles

}

function makeBuilding(){
  canvas.addEventListener("click", function(event){

    var tl = getVector(event);

    canvas.addEventListener("mousemove", function(event){
      drawEverything();
      var proto = {type: "building",topLeft: tl, bottomRight: getVector(event), energyRange: 100};
      drawProtoBuilding(proto);
    });

    canvas.addEventListener("click", function(event){
      if(checkCollisions({type: "building",topLeft: tl, bottomRight: getVector(event)})){
        clearListeners();
      }else{
        var building = {};
        building.type = "building";
        building.name = "yolo";
        building.topLeft = tl;
        building.bottomRight = getVector(event);
        building.energyRange = 100;
        building.connected = [];
        building.maxHealth = 100;
        building.health = building.maxHealth;
        building.energyRate = 0.02;
        building.energyMax = 20;
        building.energy = 0;
        building.vital = false;

        connectToAll(building);

        objects.push(building);

        clearListeners();
      }
    });
  });

}

document.getElementById("building").addEventListener("click",makeBuilding);

function makeTower(){

  canvas.addEventListener("mousemove", function(event){
    drawEverything();
    var proto = {type: "tower", position: getVector(event), radius: 10, energyRange: 50};
    drawProtoTower(proto);
  });

  canvas.addEventListener("click", function(event){
    if(checkCollisions({type: "tower", position: getVector(event), radius: 10})){
      clearListeners();
    }else{
      var tower = {};
      tower.type = "tower";
      tower.name = "ha-ha";
      tower.position = getVector(event);
      tower.radius = 10;
      tower.energyRange = 50;
      tower.connected = [];
      tower.maxHealth = 50;
      tower.health = tower.maxHealth;
      tower.fireRate = 0.5;
      tower.fireEnergy = 1;
      tower.fire = null; // put fire function here (?) !!

      var p = {};
      p.type = "projectile";
      p.position = tower.position;
      p.velocity = 10;
      p.target = false;
      p.damage = 15;
      p.color = "red";

      tower.projectile = p;

      var laser = {};
      laser.type = "laser";
      laser.startObject = tower;
      laser.endObject = false;
      laser.damage = 10;
      laser.duration = 3;

      tower.laser = laser;

      connectToAll(tower);

      objects.push(tower);

      clearListeners();
    }
  });

}

document.getElementById("tower").addEventListener("click",makeTower);














// ok
