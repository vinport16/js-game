/*

vector:
  - x (integer)
  - y (integer)

tower:
 - type ("tower")
 - position (vector)
 - radius (integer)
 - color (string)
 - range (integer) : firing radius
 - energyRange (integer) : distance that energy can be transfered to/from
 - connected (array of objects) : things that can send energy to/from
 - activeConnections (array of objects) : things that it is currently drawing energy from
 - maxHealth (integer)
 - health (integer)
 - fireRate (integer) : max fires per second
 - fireEnergy (integer) : amount of energy needed per fire
 - projectile (object or false)
 - laser (object or false)

projectile:
 - type ("projectile")
 - position (vector)
 - radius (integer)
 - velocity (vector)
 - speed (integer)
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
 - activeConnections (array of objects) : things that it is currently drawing energy from
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
 - projectile (object)
 - laser (object)

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

    }
  }
  return false;
}

function getEnemyProjectileCollision(p){ //returns the object that the projectile has collided with and the index of that object in objects[]
  for(var i = 0; i < objects.length; i++){
    var o = objects[i];
    if(o.type == "tower"){

      var distance = Math.sqrt( (p.position.x-o.position.x)*(p.position.x-o.position.x) + (p.position.y-o.position.y)*(p.position.y-o.position.y) );
      if(distance < p.radius+o.radius){
        return [o,i];
      }

    }else if(o.type == "building"){

      if(buildingTowerOverlap(o,p)){
        return [o,i];
      }

    }
  }
  return false;
}

function getProjectileCollision(p){ //returns the enemy that the projectile has collided with and the index of that enemy in enemies[]
  for(var i = 0; i < enemies.length; i++){
    var o = enemies[i];
    if(o.type == "tower" || o.type == "ship"){
      if(distance(p.position,o.position) < p.radius+o.radius){
        return [o,i];
      }
    }else if(o.type == "building"){

      if(buildingTowerOverlap(o,object)){
        return [o,i];
      }
    }
  }
  return false;
}

function moveProjectile(p){
  if(p.target.destroyed){
    p.target = false;
  }
  if(p.target){
    p.velocity = multiply(unitVector(subtract(getCenter(p.target),p.position)),p.speed);
  }
  p.position = add(p.position,p.velocity);
}

function handleCollisions(){
  for(var i = 0; i < objects.length; i++){
    o = objects[i];
    if(o.type == "projectile"){
      collision = getProjectileCollision(o);
      if(collision){
        collision[0].health -= o.damage;
        o.destroyed = true;
        objects.splice(i,1);
        if(collision[0].health <= 0){
          collision[0].destroyed = true;
          enemies.splice(collision[1],1); // remove destroyed enemy from game
        }
      }
    }
  }
  for(var i = 0; i < enemies.length; i++){
    e = enemies[i];
    if(e.type == "projectile"){
      collision = getEnemyProjectileCollision(e);
      if(collision){
        collision[0].health -= e.damage;
        e.destroyed = true;
        enemies.splice(i,1);
        if(collision[0].health <= 0){
          collision[0].destroyed = true;
          objects.splice(collision[1],1); // remove destroyed object from game
        }
      }
    }
  }
}

function checkVisibility(o,target){
  if(target.type == "building"){
    if(buildingTowerOverlap(target,{radius:o.range, position:o.position})){
      return true;
    }
  }else{
    if(distance(getCenter(o),getCenter(target)) < o.range){
      return true;
    }
  }
  return false;
}

function fire(o, target, enemy){
  proj = {};
  proj.type = "projectile";
  proj.position = o.position;
  proj.radius = o.projectile.radius;
  proj.velocity = multiply(unitVector(subtract(getCenter(target),o.position)), o.projectile.speed);
  proj.speed = o.projectile.speed;
  proj.target = false;
  if(o.projectile.target){
    proj.target = target;
  }
  proj.damage = o.projectile.damage;
  proj.color = o.projectile.color;

  if(enemy){
    enemies.push(proj);
  }else{
    objects.push(proj);
  }
}

function towerCheckAndFire(tower){
  for(var i = 0; i < enemies.length; i++){
    e = enemies[i];
    if(e.type != "projectile" && checkVisibility(tower,e)){
      // need to do cooldown time !!
      if(Math.random() > 0.9 && getEnergyFor(tower,tower.fireEnergy)){
        fire(tower,e,false);
      }
    }
  }
}

function shipCheckAndFire(ship){
  for(var i = 0; i < objects.length; i++){
    o = objects[i];
    if(o.type != "projectile" && checkVisibility(ship,o)){

      //allocate energy ?? !!

      if(Math.random() > 0.9){
        fire(ship,o,true);
      }
    }
  }
}

function getClosestObject(e){
  var closest = false;
  for(var i = 0; i < objects.length; i++){
    var o = objects[i];
    if(o.type == "building" || o.type == "tower"){
      if(!closest){
        closest = o;
      }else if(distance(getCenter(o),e.position) < distance(getCenter(closest),e.position)){
        closest = o;
      }
    }
  }
  return closest;
}

function buildingArea(b){
  return Math.abs(b.topLeft.x - b.bottomRight.x) * Math.abs(b.topLeft.y - b.bottomRight.y);
}

function copyArray(a){
  var newa = [];
  for(var i = 0; i < a.length; i++){
    newa[i] = a[i];
  }
  return newa;
}

function findConnectedEnergyStoragePath(b){
  var q = [[b]];
  var visited = [b];
  while(q.length != 0){
    var b = q[0][q[0].length-1];
    if(b.energyMax && b.energy < b.energyMax){
      return(q[0]);
    }else{
      for(var i = 0; i < b.connected.length; i++){
        if(!visited.includes(b.connected[i])){
          var path = copyArray(q[0]);
          path.push(b.connected[i]);
          visited.push(b.connected[i]);
          q.push(path);
        }
      }
    }
    q.splice(0,1);
  }
  return false;

  /*
  var q = [[b]];
  while(q.length != 0){
    var b = q[0][q[0].length-1];
    if(b.type == "building" && b.energy < b.energyMax){
      return(q[0]);
    }else{
      for(var i = 0; i < b.connected.length; i++){
        if(!q[0].includes(b.connected[i])){
          var path = copyArray(q[0]);
          path.push(b.connected[i]);
          q.push(path);
        }
      }
    }
    q.splice(0,1);
  }
  return false; */
}

function doConnectedEnergyStorage(b){
  var path = findConnectedEnergyStoragePath(b);
  if(path){
    //active connect them
    for(var i = 0; i < path.length-1; i++){
      path[i].activeConnections.push(path[i+1]);
    }
    //transfer energy
    var transferAmount = b.energy - b.energyMax;
    var openAmount = path[path.length-1].energyMax - path[path.length-1].energy;
    if(transferAmount > openAmount){
      path[path.length-1].energy += openAmount;
      b.energy -= openAmount;
    }else{
      path[path.length-1].energy += transferAmount;
      b.energy -= transferAmount;
    }
    return true;
  }
  return false;
}

function makeEnergy(building){
  building.energy += building.energyRate;
  if(building.energy > building.energyMax){
    var sent = doConnectedEnergyStorage(building);
    while(sent && building.energy > building.energyMax){
      sent = doConnectedEnergyStorage(building);
    }
  }
  if(building.energy > building.energyMax){
    building.energy = building.energyMax;
  }
}

function findConnectedEnergyPath(b){
  var q = [[b]];
  var visited = [b];
  while(q.length != 0){
    var b = q[0][q[0].length-1];
    if(b.type == "building" && b.energy > 0){
      return(q[0]);
    }else{
      for(var i = 0; i < b.connected.length; i++){
        if(!visited.includes(b.connected[i])){
          var path = copyArray(q[0]);
          path.push(b.connected[i]);
          visited.push(b.connected[i]);
          q.push(path);
        }
      }
    }
    q.splice(0,1);
  }
  return false;
}

function getEnergyFor(o,n){ //o = object that needs energy, n is amount needed
  var available = 0;
  var paths = [];
  var amounts = [];
  var path = findConnectedEnergyPath(o);
  while(path && available < n){

    var source = path[path.length-1];
    if(source.energy < n-available){
      amounts.push(source.energy);
      available += source.energy;
      source.energy = 0;
    }else{
      amounts.push(n-available);
      source.energy = source.energy - (n-available);
      available = n;
    }

    paths.push(path);
    path = findConnectedEnergyPath(o);
  }
  if(available < n){
    //return energy
    for(var i = 0; i < paths.length; i++){
      var path = paths[i];
      var source = path[path.length-1];
      source.energy += amounts[i];
    }
    return false;
  }else{
    for(var i = 0; i < paths.length; i++){
      var path = paths[i];
      //connect path
      for(var j = 0; j < path.length-1; j++){
        path[j].activeConnections.push(path[j+1]);
      }

    }
    return true;
  }
}

function getEnergyCapacity(){
  var cap = 0;
  for(var i = 0; i < objects.length; i++){
    if(objects[i].energyMax){
      cap += objects[i].energyMax;
    }
  }
  return cap;
}

function getEnergyTotal(){
  var e = 0;
  for(var i = 0; i < objects.length; i++){
    if(objects[i].energy){
      e += objects[i].energy;
    }
  }
  return e;
}

function drawEverything(){
  clearCanvas();
  //first draw connections
  for(var i = 0; i < objects.length; i++){
    //we're just gonna be lazy and draw all of the connections twice
    o1 = objects[i];
    if(o1.type == "building" || o1.type == "tower"){
      for(var j = 0; j < o1.connected.length; j++){
        var o2 = o1.connected[j];
        drawLine(getCenter(o1),getCenter(o2),"rgba(20,80,200,0.3)");
      }
    }
  }
  //draw active connections over normal connerctions
  for(var i = 0; i < objects.length; i++){
    o1 = objects[i];
    if(o1.activeConnections){
      for(var j = 0; j < o1.activeConnections.length; j++){
        var o2 = o1.activeConnections[j];
        drawLine(getCenter(o1),getCenter(o2),"rgba(50,255,200,0.5)");
      }
    }
  }

  //next draw buildings and towers
  for(var i = 0; i < objects.length; i++){
    var o = objects[i];
    if(o.type == "building"){
      drawBuilding(o);
    }else if(o.type == "tower"){
      drawTower(o);
    }
  }

  //next draw ships
  for(var i = 0; i < enemies.length; i++){
    var e = enemies[i];
    if(e.type == "ship"){
      drawShip(e);
    }
  }

  //next draw lasers

  //next draw projectiles
  for(var i = 0; i < objects.length; i++){
    o = objects[i];
    if(o.type == "projectile"){
      drawProjectile(o);
    }
  }
  for(var i = 0; i < enemies.length; i++){
    e = enemies[i];
    if(e.type == "projectile"){
      drawEnemyProjectile(e);
    }
  }
}

function step(){
  //clear activeConnections
  for(var i = 0; i < objects.length; i++){
    if(objects[i].activeConnections){
      objects[i].activeConnections = [];
    }
  }

  //move projectiles
  for(var i = 0; i < objects.length; i++){
    o = objects[i];
    if(o.type == "projectile"){
      moveProjectile(o);
      //delete projectiles that are far off screen
      if(o.position.x < -1000 || o.position.y < -1000 || o.position.x > 1000+canvas.width || o.position.y > 1000+canvas.height ){
        o.destroyed = true;
        objects.splice(i,1);
      }
    }
  }
  for(var i = 0; i < enemies.length; i++){
    e = enemies[i];
    if(e.type == "projectile"){
      moveProjectile(e);
    }
  }

  //check projectile collisions, do damage
  handleCollisions();

  //laser damage

  //ships move
  for(var i = 0; i < enemies.length; i++){
    e = enemies[i];
    if(e.type == "ship"){
      if(e.moveTarget.destroyed){
        e.moveTarget = getClosestObject(e);
      }
      if(e.moveTarget){
        e.position = add(e.position,multiply(unitVector(subtract(getCenter(e.moveTarget),e.position)),e.velocity));
      }else{
        e.moveTarget = getClosestObject(e);
      }
    }
  }

  //buildings produce energy
  for(var i = 0; i < objects.length; i++){
    if(objects[i].type == "building"){
      makeEnergy(objects[i]);
    }
  }

  //towers fire
  for(var i = 0; i < objects.length; i++){
    o = objects[i];
    if(o.type == "tower"){
      towerCheckAndFire(o);
    }
  }

  //ships fire
  for(var i = 0; i < enemies.length; i++){
    e = enemies[i];
    if(e.type == "ship"){
      shipCheckAndFire(e);
    }
  }

  //remove connections to objects that have been destroyed
  for(var i = 0; i < objects.length; i++){
    if(objects[i].connected != undefined){
      for(var c = objects[i].connected.length-1; c >= 0; c--){
        if(objects[i].connected[c].destroyed){
          objects[i].connected.splice(c,1);
        }
      }
    }
  }

  //draw
  displayEnergy();
  drawEverything();
}

function makeBuilding(b){
    var offset = b.bottomRight;
    canvas.addEventListener("mousemove", function(event){
      drawEverything();
      b.topLeft = getVector(event);
      b.bottomRight = add(b.topLeft,offset);
      //var proto = {type: "building",topLeft: tl, bottomRight: getVector(event), energyRange: 100};
      drawProtoBuilding(b);
    });

    canvas.addEventListener("click", function(event){
      b.topLeft = getVector(event);
      b.bottomRight = add(b.topLeft,offset);
      if(checkCollisions(b)){
        clearListeners();
      }else{

        connectToAll(b);

        objects.push(b);

        clearListeners();
        displayEnergy();
      }
    });

}

function makeDefaultBuilding(){
  var building = {};
  building.type = "building";
  building.name = "yolo";
  building.topLeft = {x:0,y:0};
  building.bottomRight = {x:20,y:20};
  building.energyRange = 30;
  building.connected = [];
  building.activeConnections = [];
  building.maxHealth = 100;
  building.health = building.maxHealth;
  building.energyRate = 0.1;
  building.energyMax = 100;
  building.energy = 0;
  building.vital = false;

  makeBuilding(building);
}
document.getElementById("defaultBuilding").addEventListener("click",makeDefaultBuilding);

function makeBattery(){
  var building = {};
  building.type = "building";
  building.name = "battery";
  building.topLeft = {x:0,y:0};
  building.bottomRight = {x:20,y:15};
  building.energyRange = 40;
  building.connected = [];
  building.activeConnections = [];
  building.maxHealth = 80;
  building.health = building.maxHealth;
  building.energyRate = 0.00;
  building.energyMax = 300;
  building.energy = 0;
  building.vital = false;

  makeBuilding(building);
}
document.getElementById("battery").addEventListener("click",makeBattery);

function makeSolarFarm(){
  var building = {};
  building.type = "building";
  building.name = "yolo";
  building.topLeft = {x:0,y:0};
  building.bottomRight = {x:100,y:110};
  building.energyRange = 90;
  building.connected = [];
  building.activeConnections = [];
  building.maxHealth = 90;
  building.health = building.maxHealth;
  building.energyRate = 0.5;
  building.energyMax = 40;
  building.energy = 0;
  building.vital = false;

  makeBuilding(building);
}
document.getElementById("solarFarm").addEventListener("click",makeSolarFarm);


function makeTower(tower){

  canvas.addEventListener("mousemove", function(event){
    drawEverything();
    //var proto = {type: "tower", position: getVector(event), radius: 10, energyRange: 50, range:70};
    tower.position = getVector(event);
    drawProtoTower(tower);
  });

  canvas.addEventListener("click", function(event){
    tower.position = getVector(event);
    if(checkCollisions(tower)){
      clearListeners();
    }else{

      connectToAll(tower);

      objects.push(tower);

      clearListeners();
    }
  });

}

function makeDefaultTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "ha-ha";
  tower.position = null;
  tower.radius = 10;
  tower.color = "rgba(0,0,255,0.5)";
  tower.range = 210;
  tower.energyRange = 50;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 50;
  tower.health = tower.maxHealth;
  tower.fireRate = 0.5;
  tower.fireEnergy = 2;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.radius = 4;
  p.speed = 10;
  p.velocity = null;
  p.target = true;
  p.damage = 5;
  p.color = "red";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 10;
  laser.duration = 3;

  tower.laser = laser;

  makeTower(tower);
}
document.getElementById("defaultTower").addEventListener("click",makeDefaultTower);

function makeRangedTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "range me";
  tower.position = null;
  tower.radius = 11;
  tower.color = "rgba(150,25,200,0.5)";
  tower.range = 320;
  tower.energyRange = 50;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 60;
  tower.health = tower.maxHealth;
  tower.fireRate = 0.5;
  tower.fireEnergy = 3;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.radius = 3;
  p.speed = 13;
  p.velocity = null;
  p.target = true;
  p.damage = 5;
  p.color = "pink";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 10;
  laser.duration = 3;

  tower.laser = laser;

  makeTower(tower);
}
document.getElementById("rangedTower").addEventListener("click",makeRangedTower);

function makeHeavyTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "She's So Heavy";
  tower.position = null;
  tower.radius = 13;
  tower.color = "rgba(0,0,150,0.5)";
  tower.range = 100;
  tower.energyRange = 40;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 70;
  tower.health = tower.maxHealth;
  tower.fireRate = 0.5;
  tower.fireEnergy = 5;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.radius = 8;
  p.speed = 8;
  p.velocity = null;
  p.target = true;
  p.damage = 12;
  p.color = "pink";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 10;
  laser.duration = 3;

  tower.laser = laser;

  makeTower(tower);
}
document.getElementById("heavyTower").addEventListener("click",makeHeavyTower);

function makeConnectionTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "connect-me";
  tower.position = null;
  tower.radius = 3;
  tower.color = "rgba(255,0,255,0.5)";
  tower.range = 0;
  tower.energyRange = 70;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 60;
  tower.health = tower.maxHealth;
  tower.fireRate = 0;
  tower.fireEnergy = 0;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.speed = 0;
  p.radius = 0;
  p.velocity = null;
  p.target = false;
  p.damage = 0;
  p.color = "red";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 0;
  laser.duration = 0;

  tower.laser = laser;

  makeTower(tower);
}
document.getElementById("relay").addEventListener("click",makeConnectionTower);

function makeShip(){
  ship = {};
  ship.type = "ship";
  ship.position = {x: (Math.random()*5-20), y: (Math.random()*canvas.height)};
  ship.velocity = 2;
  ship.radius = 8;
  ship.range = 45;
  ship.maxHealth = 70;
  ship.health = ship.maxHealth;
  ship.moveTarget = getClosestObject(ship);
  ship.fireTarget = false;
  ship.fireRate = 4;

  var p = {};
  p.type = "projectile";
  p.position = false;
  p.radius = 3;
  p.speed = 8;
  p.velocity = null;
  p.target = false;
  p.damage = 10;
  p.color = "yellow";

  ship.projectile = p;
  ship.laser = false;

  enemies.push(ship);
  drawEverything();
}
document.getElementById("ship").addEventListener("click",makeShip);









// ok
