/*

vector:
  - x (integer)
  - y (integer)

tower:
 - type ("tower")
 - position (vector)
 - radius (integer)
 - price (integer)
 - color (string)
 - range (integer) : firing radius
 - energyRange (integer) : distance that energy can be transfered to/from
 - connected (array of objects) : things that can send energy to/from
 - activeConnections (array of objects) : things that it is currently drawing energy from
 - maxHealth (integer)
 - health (integer)
 - fireCooldown (integer) : cooldown time
 - cooldownTimer (integer) : # of frames until ready to fire
 - fireEnergy (integer) : amount of energy needed per fire
 - projectile (object or false)
 - laser (object or false)

projectile:
 - type ("projectile")
 - position (vector)
 - radius (integer)
 - velocity (vector)
 - speed (integer)
 - persist (boolean) : should this projectile persist after it destroys its target?
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
 - price (integer)
 - energyRange (integer) : distance that energy can be transfered to/from
 - connected (array of objects) : things that can send energy to/from
 - activeConnections (array of objects) : things that it is currently drawing energy from
 - maxHealth (integer)
 - health (integer)
 - energyRate (float) : how much energy can be produced per frame
 - energyMax (integer) : maximum energy storage
 - acitvationEnergy : amount of energy it needs access to in order to produce energy
 - energy (integer) : amount of energy in storage
 - heal (object or false) : can this building repair other buildings?
   - heal object {
                    waitUntil (float) : percent charge of entire complex before beginning to heal
                    cooldown (integer): # frames between heals
                    cooldownTimer (integer): # frames until next heal
                    energyReqired (integer): amount of energy needed per heal
                    healAmount (integer): amount of health to restore per heal
                   }
 - vital (boolean) : specifies if destruction of building will end the game

ship:
 - type ("ship")
 - position (vector)
 - volocity (vector)
 - radius (integer)
 - range (integer) : firing radius
 - maxHealth (integer)
 - health (integer)
 - bounty (integer) : amount of Gems you get when you destroy it
 - moveTarget (object) : thing it's moving towards
 - fireTarget (object) : thing it's firing at
 - fireCooldown (integer) : cooldown time
 - cooldownTimer (integer) : # of frames until ready to fire
 - projectile (object)
 - laser (object)

*/
var gameTime = 0; // # of steps that have happened in the game
var objects = []; // all of the objects under your control
var enemies = []; // all of the objects under enemy control
var activeHealPaths = []; // paths along which healing buildings are healing other objects
var heal = true; // toggle repairs
var gems = 800; // start with this many gems (money);
var prices = {};
prices.defaultTower = 100;
prices.rangedTower = 120;
prices.heavyTower = 120;
prices.chaingunTower = 100;
prices.seekingTower = 200;
prices.missileTower = 120;
prices.connectionTower = 10;

prices.defaultBuilding = 70;
prices.battery = 100;
prices.solarFarm = 200;
prices.repairBuilding = 190;
prices.fusionGenerator = 280;

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
  if(p.target.destroyed && !p.persist){
    p.target = false;
  }else if(p.target.destroyed && p.persist){
    var t = getClosestEnemy(p);
    if(t){
      p.target = t;
    }
  }
  if(p.target && !p.target.destroyed){
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
        if(!o.persist || collision[0].health >= o.damage){
          collision[0].health -= o.damage;
          o.destroyed = true;
          objects.splice(i,1);
        }else{
          o.damage -= collision[0].health;
          collision[0].health = 0;
        }
        if(collision[0].health <= 0){
          collision[0].destroyed = true;
          gems += collision[0].bounty; // get money
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
        if(!e.persist || collision[0].health >= e.damage){
          collision[0].health -= e.damage;
          e.destroyed = true;
          enemies.splice(i,1);
        }else{
          e.damage -= collision[0].health;
          collision[0].health = 0;
        }
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
  if(o.projectile.type == "projectile"){
    var proj = {};
    proj.type = "projectile";
    proj.position = o.position;
    proj.radius = o.projectile.radius;
    proj.velocity = multiply(unitVector(subtract(getCenter(target),o.position)), o.projectile.speed);
    proj.speed = o.projectile.speed;
    proj.target = false;
    proj.persist = o.projectile.persist;
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
  }else if(o.projectile.type == "ship"){ // always an enemy
    var p = {};
    p.type = "ship";
    p.position = o.position;
    p.radius = o.projectile.radius;
    p.velocity = o.projectile.velocity;
    p.target = false;
    p.range = o.projectile.range;
    p.maxHealth = o.projectile.maxHealth;
    p.health = p.maxHealth;
    p.bounty = o.projectile.bounty;
    p.moveTarget = getClosestObject(o);
    p.fireTarget = false;
    p.fireCooldown = o.projectile.fireCooldown;
    p.cooldownTimer = o.projectile.cooldownTimer;

    var q = {};
    q.type = "projectile";
    q.position = false;
    q.radius = o.projectile.projectile.radius;
    q.speed = o.projectile.projectile.speed;
    q.velocity = null;
    q.target = false;
    q.damage = o.projectile.projectile.damage;
    q.color = o.projectile.projectile.color;

    p.projectile = q;
    p.laser = false;

    enemies.push(p);
  }
}

function numShips(){
  var n = 0;
  for(var i = 0; i < enemies.length; i++){
    if(enemies[i].type == "ship"){
      n+=1;
    }
  }
  return n;
}

function towerCheckAndFire(tower){
  var e = getClosestEnemy(tower);
  if(e && tower.cooldownTimer <= 0 && distance(tower.position,getCenter(e)) <= tower.range && getEnergyFor(tower,tower.fireEnergy)){
    fire(tower,e,false);
    tower.cooldownTimer = tower.fireCooldown;
  }
}

function shipCheckAndFire(ship){
  ship.target = getClosestObject(ship);
  if(ship.target && ship.cooldownTimer <= 0 && distance(ship.position,getCenter(ship.target)) <= ship.range ){
    fire(ship,ship.target,true);
    ship.cooldownTimer = ship.fireCooldown;
  }
}

function getClosestObject(e){
  var closest = false;
  for(var i = 0; i < objects.length; i++){
    var o = objects[i];
    if(o.health){
      if(!closest){
        closest = o;
      }else if(distance(getCenter(o),e.position) < distance(getCenter(closest),e.position)){
        closest = o;
      }
    }
  }
  return closest;
}

function getClosestEnemy(e){
  var closest = false;
  for(var i = 0; i < enemies.length; i++){
    var o = enemies[i];
    if(o.health){
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
        if(!visited.includes(b.connected[i]) && b.connected[i].destroyed == undefined){
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
  if(building.activationEnergy){
    if(getEnergyFor(building,building.activationEnergy)){
      building.energy += building.energyRate + building.activationEnergy;
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
  }else{
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
        if(!visited.includes(b.connected[i]) && b.connected[i].destroyed == undefined){
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

function getHealPath(b){
  var q = [[b]];
  var visited = [b];
  while(q.length != 0){
    var b = q[0][q[0].length-1];
    if(b.maxHealth && b.health < b.maxHealth){
      return(q[0]);
    }else{
      for(var i = 0; i < b.connected.length; i++){
        if(!visited.includes(b.connected[i]) && b.connected[i].destroyed == undefined){
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

function doHeal(o){
  if(o.heal.cooldownTimer <= 0){
    var path = getHealPath(o);
    if(path && getEnergyFor(o,o.heal.energyReqired)){
      var end = path[path.length-1];
      end.health += o.heal.healAmount;
      if(end.health > end.maxHealth){
        end.health = end.maxHealth;
      }
      activeHealPaths.push(path);
      o.heal.cooldownTimer = o.heal.cooldown;
    }
  }else{
    o.heal.cooldownTimer -= 1;
  }
}

function drawEverything(){
  clearCanvas();

  //draw range shadows
  for(var i = 0; i < objects.length; i++){
    var o = objects[i];
    if(o.range){
      drawRange(o);
    }
  }

  //draw connections
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
  //draw active heal paths
  for(var i = 0; i < activeHealPaths.length; i++){
    path = activeHealPaths[i];
    for(var j = 0; j < path.length-1; j++){
      var p1 = path[j];
      var p2 = path[j+1];
      drawLine(getCenter(p1),getCenter(p2),"rgba(255,100,100,0.9)");
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

  displayGems();
}

function step(){
  //make ships & do game events
  doGameEvents();

  //clear activeConnections
  for(var i = 0; i < objects.length; i++){
    if(objects[i].activeConnections){
      objects[i].activeConnections = [];
    }
  }
  //clear activeHealPaths
  activeHealPaths = [];

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
      if(e.projectile.type == "ship" && e.moveTarget && distance(getCenter(e.moveTarget),e.position) < e.range-2){
        //if ship produces more ships
        e.moveTarget = getClosestObject(e);
        if(e.moveTarget){
          //move in a spiral towards target
          var towards = multiply(unitVector(subtract(getCenter(e.moveTarget),e.position)),e.velocity);
          var perp = {x:towards.y, y:-towards.x};
          var spiral = rotateVector(perp,-15);
          e.position = add(e.position,spiral);
        }
      }else{
        //normal ships
        if(e.moveTarget){
          e.position = add(e.position,multiply(unitVector(subtract(getCenter(e.moveTarget),e.position)),e.velocity));
        }else{
          e.moveTarget = getClosestObject(e);
        }
      }
    }
  }

  //buildings produce energy
  for(var i = 0; i < objects.length; i++){
    if(objects[i].type == "building"){
      makeEnergy(objects[i]);
    }
  }

  //buildings heal
  if(heal){
    for(var i = 0; i < objects.length; i++){
      if(objects[i].heal){
        doHeal(objects[i]);
      }
    }
  }

  //towers and ships tick down their cooldownTimers
  for(var i = 0; i < objects.length; i++){
    var o = objects[i];
    if(o.cooldownTimer){
      o.cooldownTimer -= 1;
    }
  }
  for(var i = 0; i < enemies.length; i++){
    var e = enemies[i];
    if(e.cooldownTimer){
      e.cooldownTimer -= 1;
    }
  }

  //towers fire
  for(var i = 0; i < objects.length; i++){
    var o = objects[i];
    if(o.type == "tower"){
      towerCheckAndFire(o);
    }
  }

  //ships fire
  for(var i = 0; i < enemies.length; i++){
    var e = enemies[i];
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

  //increase gameTime
  gameTime += 1;

  //draw
  displayEnergy();
  drawEverything();
}









// ok
