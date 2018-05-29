
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function doGameEvents(){

  //every step, small chance of a little ship appearning
  if(Math.random()<0.005){
    makeDefaultShip();
  }

  //first wave at 20 seconds
  //make 10 default ships
  if(gameTime == 20*20){
    console.log("first wave");
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == 23*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }

  //second wave at 55 seconds
  //make 12 default ships and 2 big ships
  if(gameTime == 55*20){
    console.log("second wave");
    for(var i = 0; i < 6; i++){
      makeDefaultShip();
    }
    makeBigShip();
  }
  if(gameTime == 60*20){
    for(var i = 0; i < 6; i++){
      makeDefaultShip();
    }
    makeBigShip();
  }

  //third wave at 90 seconds
  //make 10 default ships, 5 big ships
  if(gameTime == 90*20){
    console.log("third wave");
    for(var i = 0; i < 4; i++){
      makeBigShip();
    }
    makeDefaultShip();
  }
  if(gameTime == 96*20){
    for(var i = 0; i < 9; i++){
      makeDefaultShip();
    }
    makeBigShip();
  }

  //fourth wave at 130 seconds (not too hard)
  //make 25 default ships
  if(gameTime == 130*20){
    console.log("fourth wave");
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == 132*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == 134*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == 136*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == 138*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }

  //fifth wave at 160 seconds (easy)
  //8 default ships, 3 big ships
  if(gameTime == 160*20){
    console.log("fifth wave");
    for(var i = 0; i < 3; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 3; i++){
      makeBigShip();
    }
  }
  if(gameTime == 163*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }

  //sixth wave at 185 seconds (hard)
  //11 default ships, 4 big ships, 4 long ships
  if(gameTime == 185*20){
    console.log("sixth wave");
    for(var i = 0; i < 6; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 4; i++){
      makeBigShip();
    }
  }
  if(gameTime == 190*20){
    for(var i = 0; i < 4; i++){
      makeLongShip();
    }
  }
  if(gameTime == 196*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
}

async function main(){
  showPrices();
  step();
  pause();
  while(true){
    while(!paused){
      step();
      await sleep(50);
    }
    await sleep(50);
  }
}
main();
