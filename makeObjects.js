function makeBuilding(b){
  disableAllButtons();
  document.getElementById("cancel").disabled = false;
  document.getElementById("cancel").addEventListener("click",function(){
    clearListeners();
    enableAllButtons();
  });
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
    if(checkCollisions(b) || b.price > gems){
      clearListeners();
      enableAllButtons();
    }else{

      connectToAll(b);

      objects.push(b);

      gems -= b.price;

      clearListeners();
      enableAllButtons();
      displayEnergy();
    }
  });

}

function selectObject(){
  disableAllButtons()
  document.getElementById("cancel").disabled = false;
  document.getElementById("cancel").addEventListener("click",function(){
    clearListeners();
    enableAllButtons();
  });

  canvas.addEventListener("click", function(event){

    var obj = getCollision(getVector(event));

    if(obj){
      // how much can you sell it for?
      // half original price * % remaining health + energy/3
      var price = (obj.price/2) * (obj.health/obj.maxHealth);
      if(obj.energyMax){
        price += obj.energy * 0.33;
      }
      if(!price){
        price = 0;
      }
      price = Math.round(price);
      if(confirm("Do you want to sell this "+obj.type+" for "+price+"G?")){
        destroyObject(obj);
        gems += price;
        displayEnergy();
      }
      clearListeners();
      enableAllButtons();
    }
  });

}

function newDefaultBuilding(){
  var building = {};
  building.type = "building";
  building.name = "yolo";
  building.topLeft = {x:0,y:0};
  building.bottomRight = {x:20,y:30};
  building.price = prices.defaultBuilding;
  building.energyRange = 30;
  building.connected = [];
  building.activeConnections = [];
  building.maxHealth = 300;
  building.health = building.maxHealth;
  building.energyRate = 0.1;
  building.energyMax = 100;
  building.energy = 0;
  building.vital = false;

  rep = {};
  rep.waitUntil = 0.6;
  rep.cooldown = 40;
  rep.cooldownTimer = 0;
  rep.energyReqired = 3;
  rep.healAmount = 1;

  building.heal = rep;

  return(building);
}
function makeDefaultBuilding(){
  makeBuilding(newDefaultBuilding());
}
document.getElementById("defaultBuilding").addEventListener("click",makeDefaultBuilding);
describeBuilding(document.getElementById("defaultBuilding"),newDefaultBuilding());

function newFusionGenerator(){
  var building = {};
  building.type = "building";
  building.name = "fusion";
  building.topLeft = {x:0,y:0};
  building.bottomRight = {x:50,y:45};
  building.price = prices.fusionGenerator;
  building.energyRange = 30;
  building.connected = [];
  building.activeConnections = [];
  building.maxHealth = 30;
  building.health = building.maxHealth;
  building.activationEnergy = 500;
  building.energyRate = 1.5;
  building.energyMax = 350;
  building.energy = 0;
  building.vital = false;

  building.heal = false;

  return(building);
}
function makeFusionGenerator(){
  makeBuilding(newFusionGenerator());
}
document.getElementById("fusionGenerator").addEventListener("click",makeFusionGenerator);
describeBuilding(document.getElementById("fusionGenerator"),newFusionGenerator());

function newBattery(){
  var building = {};
  building.type = "building";
  building.name = "battery";
  building.topLeft = {x:0,y:0};
  building.bottomRight = {x:20,y:15};
  building.price = prices.battery;
  building.energyRange = 40;
  building.connected = [];
  building.activeConnections = [];
  building.maxHealth = 80;
  building.health = building.maxHealth;
  building.energyRate = 0.00;
  building.energyMax = 300;
  building.energy = 0;
  building.vital = false;
  building.heal = false;

  return(building);
}
function makeBattery(){
  makeBuilding(newBattery());
}
document.getElementById("battery").addEventListener("click",makeBattery);
describeBuilding(document.getElementById("battery"),newBattery());

function newSolarFarm(){
  var building = {};
  building.type = "building";
  building.name = "yolo";
  building.topLeft = {x:0,y:0};
  building.bottomRight = {x:130,y:150};
  building.price = prices.solarFarm;
  building.energyRange = 90;
  building.connected = [];
  building.activeConnections = [];
  building.maxHealth = 90;
  building.health = building.maxHealth;
  building.energyRate = 0.5;
  building.energyMax = 10;
  building.energy = 0;
  building.vital = false;
  building.heal = false;

  return(building);
}
function makeSolarFarm(){
  var building = {};
  building.type = "building";
  building.name = "yolo";
  building.topLeft = {x:0,y:0};
  building.bottomRight = {x:130,y:150};
  building.price = prices.solarFarm;
  building.energyRange = 90;
  building.connected = [];
  building.activeConnections = [];
  building.maxHealth = 90;
  building.health = building.maxHealth;
  building.energyRate = 0.5;
  building.energyMax = 10;
  building.energy = 0;
  building.vital = false;
  building.heal = false;

  makeBuilding(newSolarFarm());
}
document.getElementById("solarFarm").addEventListener("click",makeSolarFarm);
describeBuilding(document.getElementById("solarFarm"),newSolarFarm());

function newRepairBuilding(){
  var building = {};
  building.type = "building";
  building.name = "rep-me";
  building.topLeft = {x:0,y:0};
  building.bottomRight = {x:50,y:25};
  building.price = prices.repairBuilding;
  building.energyRange = 40;
  building.connected = [];
  building.activeConnections = [];
  building.maxHealth = 150;
  building.health = building.maxHealth;
  building.energyRate = 0.05;
  building.energyMax = 40;
  building.energy = 0;
  building.vital = false;

  rep = {};
  rep.waitUntil = 0.6;
  rep.cooldown = 20;
  rep.cooldownTimer = 0;
  rep.energyReqired = 8;
  rep.healAmount = 6;

  building.heal = rep;

  return(building);
}
function makeRepairBuilding(){
  makeBuilding(newRepairBuilding());
}
document.getElementById("repairBuilding").addEventListener("click",makeRepairBuilding);
describeBuilding(document.getElementById("repairBuilding"),newRepairBuilding());


function makeTower(tower){

  disableAllButtons();
  document.getElementById("cancel").disabled = false;
  document.getElementById("cancel").addEventListener("click",function(){
    clearListeners();
    enableAllButtons();
  });

  canvas.addEventListener("mousemove", function(event){
    drawEverything();
    //var proto = {type: "tower", position: getVector(event), radius: 10, energyRange: 50, range:70};
    tower.position = getVector(event);
    drawProtoTower(tower);
  });

  canvas.addEventListener("click", function(event){
    tower.position = getVector(event);
    if(checkCollisions(tower) || tower.price > gems){
      enableAllButtons();
      clearListeners();
    }else{

      connectToAll(tower);

      objects.push(tower);

      gems -= tower.price;

      enableAllButtons();
      clearListeners();
    }
  });

}

function newDefaultTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "ha-ha";
  tower.position = null;
  tower.radius = 10;
  tower.price = prices.defaultTower;
  tower.color = "rgba(0,0,255,0.5)";
  tower.range = 210;
  tower.energyRange = 50;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 50;
  tower.health = tower.maxHealth;
  tower.fireCooldown = 5;
  tower.cooldownTimer = 0;
  tower.fireEnergy = 2;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.radius = 4;
  p.speed = 10;
  p.velocity = null;
  p.target = true;
  p.damage = 8;
  p.color = "red";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 10;
  laser.duration = 3;

  tower.laser = laser;
  return(tower);
}
function makeDefaultTower(){
  makeTower(newDefaultTower());
}
document.getElementById("defaultTower").addEventListener("click",makeDefaultTower);
describeTower(document.getElementById("defaultTower"),newDefaultTower());

function newRangedTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "range me";
  tower.position = null;
  tower.radius = 11;
  tower.price = prices.rangedTower;
  tower.color = "rgba(150,25,200,0.5)";
  tower.range = 330;
  tower.energyRange = 50;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 60;
  tower.health = tower.maxHealth;
  tower.fireCooldown = 20;
  tower.cooldownTimer = 0;
  tower.fireEnergy = 12;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.radius = 3;
  p.speed = 13;
  p.velocity = null;
  p.target = true;
  p.damage = 45;
  p.color = "pink";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 10;
  laser.duration = 3;

  tower.laser = laser;

  return(tower);
}
function makeRangedTower(){
  makeTower(newRangedTower());
}
document.getElementById("rangedTower").addEventListener("click",makeRangedTower);
describeTower(document.getElementById("rangedTower"),newRangedTower());

function newHeavyTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "She's So Heavy";
  tower.position = null;
  tower.radius = 13;
  tower.price = prices.heavyTower;
  tower.color = "rgba(0,0,150,0.5)";
  tower.range = 120;
  tower.energyRange = 40;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 250;
  tower.health = tower.maxHealth;
  tower.fireCooldown = 18;
  tower.cooldownTimer = 0;
  tower.fireEnergy = 40;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.radius = 10;
  p.speed = 8;
  p.velocity = null;
  p.target = false;
  p.damage = 70;
  p.persist = true;
  p.color = "pink";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 10;
  laser.duration = 3;

  tower.laser = laser;

  return(tower);
}
function makeHeavyTower(){
  makeTower(newHeavyTower());
}
document.getElementById("heavyTower").addEventListener("click",makeHeavyTower);
describeTower(document.getElementById("heavyTower"),newHeavyTower());

function newGoliathTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "goliath";
  tower.position = null;
  tower.radius = 35;
  tower.price = prices.goliathTower;
  tower.color = "rgba(100,50,150,0.5)";
  tower.range = 120;
  tower.energyRange = 50;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 600;
  tower.health = tower.maxHealth;
  tower.fireCooldown = 50;
  tower.cooldownTimer = 0;
  tower.fireEnergy = 300;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.radius = 110;
  p.speed = 1.5;
  p.velocity = null;
  p.target = false;
  p.damage = 550;
  p.persist = true;
  p.color = "rgba(255,100,170,0.7)";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 10;
  laser.duration = 3;

  tower.laser = laser;

  return(tower);
}
function makeGoliathTower(){
  makeTower(newGoliathTower());
}
document.getElementById("goliathTower").addEventListener("click",makeGoliathTower);
describeTower(document.getElementById("goliathTower"),newGoliathTower());

function newChaingunTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "chain";
  tower.position = null;
  tower.radius = 11;
  tower.price = prices.chaingunTower;
  tower.color = "rgba(0,0,0,0.5)";
  tower.range = 190;
  tower.energyRange = 30;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 80;
  tower.health = tower.maxHealth;
  tower.fireCooldown = 2;
  tower.cooldownTimer = 0;
  tower.fireEnergy = 2;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.radius = 2;
  p.speed = 14;
  p.velocity = null;
  p.target = true;
  p.damage = 5;
  p.color = "white";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 10;
  laser.duration = 3;

  tower.laser = laser;

  return(tower);
}
function makeChaingunTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "chain";
  tower.position = null;
  tower.radius = 11;
  tower.price = prices.chaingunTower;
  tower.color = "rgba(0,0,0,0.5)";
  tower.range = 190;
  tower.energyRange = 30;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 80;
  tower.health = tower.maxHealth;
  tower.fireCooldown = 2;
  tower.cooldownTimer = 0;
  tower.fireEnergy = 3;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.radius = 2;
  p.speed = 14;
  p.velocity = null;
  p.target = false;
  p.damage = 8;
  p.color = "white";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 10;
  laser.duration = 3;

  tower.laser = laser;

  makeTower(newChaingunTower());
}
document.getElementById("chaingunTower").addEventListener("click",makeChaingunTower);
describeTower(document.getElementById("chaingunTower"),newChaingunTower());

function newSeekingTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "ha-ha";
  tower.position = null;
  tower.radius = 8;
  tower.price = prices.seekingTower;
  tower.color = "rgba(100,100,100,0.8)";
  tower.range = 310;
  tower.energyRange = 50;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 40;
  tower.health = tower.maxHealth;
  tower.fireCooldown = 200;
  tower.cooldownTimer = 0;
  tower.fireEnergy = 300;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.radius = 5;
  p.speed = 11;
  p.velocity = null;
  p.target = true;
  p.persist = true;
  p.damage = 400;
  p.color = "white";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 10;
  laser.duration = 3;

  tower.laser = laser;

  return(tower);
}
function makeSeekingTower(){
  makeTower(newSeekingTower());
}
document.getElementById("seekingTower").addEventListener("click",makeSeekingTower);
describeTower(document.getElementById("seekingTower"),newSeekingTower());

function newMissileTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "missule";
  tower.position = null;
  tower.radius = 9;
  tower.price = prices.missileTower;
  tower.color = "rgba(150,110,100,0.8)";
  tower.range = 300;
  tower.energyRange = 50;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 50;
  tower.health = tower.maxHealth;
  tower.fireCooldown = 40;
  tower.cooldownTimer = 0;
  tower.fireEnergy = 10;
  tower.fire = null; // put fire function here (?) !!

  var p = {};
  p.type = "projectile";
  p.position = null;
  p.radius = 6;
  p.speed = 5;
  p.velocity = null;
  p.target = true;
  p.persist = true;
  p.damage = 20;
  p.color = "white";

  tower.projectile = p;

  var laser = {};
  laser.type = "laser";
  laser.startObject = tower;
  laser.endObject = false;
  laser.damage = 10;
  laser.duration = 3;

  tower.laser = laser;

  return(tower);
}
function makeMissileTower(){
  makeTower(newMissileTower());
}
document.getElementById("missileTower").addEventListener("click",makeMissileTower);
describeTower(document.getElementById("missileTower"),newMissileTower());

function newConnectionTower(){
  var tower = {};
  tower.type = "tower";
  tower.name = "connect-me";
  tower.position = null;
  tower.radius = 3;
  tower.price = prices.connectionTower;
  tower.color = "rgba(255,0,255,0.5)";
  tower.range = 0;
  tower.energyRange = 70;
  tower.connected = [];
  tower.activeConnections = [];
  tower.maxHealth = 60;
  tower.health = tower.maxHealth;
  tower.fireCooldown = 100;
  tower.cooldownTimer = 100;
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

  return(tower);
}
function makeConnectionTower(){
  makeTower(newConnectionTower());
}
document.getElementById("relay").addEventListener("click",makeConnectionTower);
describeTower(document.getElementById("relay"),newConnectionTower());

function positionLeftOfScreen(){
  return {x: (Math.random()*20-50), y: (Math.random()*canvas.height)};
}
function positionRightOfScreen(){
  return {x: (Math.random()*20+30+canvas.width), y: (Math.random()*canvas.height)};
}
function positionAboveScreen(){
  return {x: (Math.random()*canvas.width), y:(Math.random()*20-50)};
}
function positionBelowScreen(){
  return {x: (Math.random()*canvas.width), y:(Math.random()*20+30+canvas.height)};
}
function positionAnywhereAround(){
  var n = Math.random()*4;
  if(n<1){
    return positionLeftOfScreen();
  }else if(n<2){
    return positionRightOfScreen();
  }else if(n<3){
    return positionAboveScreen();
  }else{
    return positionBelowScreen();
  }
}

function makeDefaultShip(){
  ship = {};
  ship.type = "ship";
  ship.position = positionAnywhereAround();
  ship.velocity = 2;
  ship.radius = 8;
  ship.range = 45;
  ship.maxHealth = 70;
  ship.health = ship.maxHealth;
  ship.bounty = 10;
  ship.moveTarget = getClosestObject(ship);
  ship.fireTarget = false;
  ship.fireCooldown = 8;
  ship.cooldownTimer = 0;

  var p = {};
  p.type = "projectile";
  p.position = false;
  p.radius = 3;
  p.speed = 8;
  p.velocity = null;
  p.target = false;
  p.damage = 7;
  p.color = "yellow";

  ship.projectile = p;
  ship.laser = false;

  enemies.push(ship);
  drawEverything();
}

function makeBigShip(){
  ship = {};
  ship.type = "ship";
  ship.position = positionAnywhereAround();
  ship.velocity = 1;
  ship.radius = 15;
  ship.range = 110;
  ship.maxHealth = 200;
  ship.health = ship.maxHealth;
  ship.bounty = 40;
  ship.moveTarget = getClosestObject(ship);
  ship.fireTarget = false;
  ship.fireCooldown = 20;
  ship.cooldownTimer = 0;

  var p = {};
  p.type = "projectile";
  p.position = false;
  p.radius = 5;
  p.speed = 3;
  p.velocity = null;
  p.target = false;
  p.damage = 20;
  p.color = "gold";

  ship.projectile = p;
  ship.laser = false;

  enemies.push(ship);
  drawEverything();
}

function makeLongShip(){
  ship = {};
  ship.type = "ship";
  ship.position = positionAnywhereAround();
  ship.velocity = 1.5;
  ship.radius = 12;
  ship.range = 230;
  ship.maxHealth = 160;
  ship.health = ship.maxHealth;
  ship.bounty = 60;
  ship.moveTarget = getClosestObject(ship);
  ship.fireTarget = false;
  ship.fireCooldown = 3;
  ship.cooldownTimer = 0;

  var p = {};
  p.type = "projectile";
  p.position = false;
  p.radius = 2;
  p.speed = 12;
  p.velocity = null;
  p.target = false;
  p.damage = 2;
  p.color = "white";

  ship.projectile = p;
  ship.laser = false;

  enemies.push(ship);
  drawEverything();
}

function newMotherShip(){
  ship = {};
  ship.type = "ship";
  ship.position = positionAnywhereAround();
  ship.velocity = 1;
  ship.radius = 20;
  ship.range = 240;
  ship.maxHealth = 600;
  ship.health = ship.maxHealth;
  ship.bounty = 200;
  ship.moveTarget = getClosestObject(ship);
  ship.fireTarget = false;
  ship.fireCooldown = 40;
  ship.cooldownTimer = 0;

  var p = {};
  p.type = "ship";
  p.position = false;
  p.radius = 5;
  p.velocity = 2;
  p.target = false;
  p.range = 100;
  p.maxHealth = 30;
  p.health = p.maxHealth;
  p.bounty = 8;
  p.moveTarget = getClosestObject(ship);
  p.fireTarget = false;
  p.fireCooldown = 11;
  p.cooldownTimer = 0;

  var q = {};
  q.type = "projectile";
  q.position = false;
  q.radius = 3;
  q.speed = 8;
  q.velocity = null;
  q.target = false;
  q.damage = 5;
  q.color = "yellow";

  p.projectile = q;
  p.laser = false;

  ship.projectile = p;
  return ship;
}
function makeMotherShip(){
  enemies.push(newMotherShip);
  drawEverything();
}

function newBigMotherShip(){
  ship = {};
  ship.type = "ship";
  ship.position = positionAnywhereAround();
  ship.velocity = 1;
  ship.radius = 30;
  ship.range = 320;
  ship.maxHealth = 1000;
  ship.health = ship.maxHealth;
  ship.bounty = 400;
  ship.moveTarget = getClosestObject(ship);
  ship.fireTarget = false;
  ship.fireCooldown = 80;
  ship.cooldownTimer = 0;

  var p = {};
  p.type = "ship";
  p.position = false;
  p.radius = 14;
  p.velocity = 1.5;
  p.target = false;
  p.range = 150;
  p.maxHealth = 110;
  p.health = p.maxHealth;
  p.bounty = 15;
  p.moveTarget = getClosestObject(ship);
  p.fireTarget = false;
  p.fireCooldown = 8;
  p.cooldownTimer = 0;

  var q = {};
  q.type = "projectile";
  q.position = false;
  q.radius = 4;
  q.speed = 6;
  q.velocity = null;
  q.target = false;
  q.damage = 9;
  q.color = "blue";

  p.projectile = q;

  ship.projectile = p;
  ship.laser = false;
  return ship;
}
function makeBigMotherShip(){
  enemies.push(newBigMotherShip());
  drawEverything();
}

function makeSomeShips(){
  if(confirm("are you sure that you want to make some ships?")){
    for(var i = 0; i < 10; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 5; i++){
      makeBigShip();
    }
    for(var i = 0; i < 4; i++){
      makeLongShip();
    }
    makeMotherShip();
    makeBigMotherShip();
  }
}

document.getElementById("ship").addEventListener("click",makeSomeShips);
document.getElementById("selectObject").addEventListener("click",selectObject);
