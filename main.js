
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waveAlert(n){
  alert("Wave "+n);
}

function doGameEvents(){

  //every step, small chance of a little ship appearning
  if(Math.random()<0.005){
    makeDefaultShip();
  }

  //first wave at 20 seconds
  //make 10 default ships
  if(gameTime == 20*20){
    waveAlert(1);
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
    waveAlert(2);
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
    waveAlert(3);
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
    waveAlert(4);
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
    waveAlert(5);
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
    waveAlert(6);
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

  //seventh wave at 220 seconds (hard)
  //18 default ships, 8 big ships, 8 long ships
  if(gameTime == 220*20){
    waveAlert(7);
    for(var i = 0; i < 10; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 8; i++){
      makeBigShip();
    }
  }
  if(gameTime == 225*20){
    for(var i = 0; i < 8; i++){
      makeLongShip();
    }
    for(var i = 0; i < 8; i++){
      makeDefaultShip();
    }
  }

  //eighth wave at 260 seconds (hard)
  //20 default ships, 10 big ships, 10 long ships
  if(gameTime == 260*20){
    waveAlert(8);
    for(var i = 0; i < 10; i++){
      makeBigShip();
    }
  }
  if(gameTime == 265*20){
    for(var i = 0; i < 10; i++){
      makeLongShip();
    }
    for(var i = 0; i < 20; i++){
      makeDefaultShip();
    }
  }

  //ninth wave at 310 seconds (hard)
  //25 default ships, 25 big ships, 10 long ships
  if(gameTime == 310*20){
    waveAlert(9);
    for(var i = 0; i < 25; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 5; i++){
      makeBigShip();
    }
  }
  if(gameTime == 318*20){
    for(var i = 0; i < 20; i++){
      makeBigShip();
    }
    for(var i = 0; i < 10; i++){
      makeLongShip();
    }
  }

  //tenth wave at 370 seconds (very hard)
  //20 big ships, 25 long ships, 30 default ships
  if(gameTime == 370*20){
    waveAlert(10);
    for(var i = 0; i < 20; i++){
      makeBigShip();
    }
  }
  if(gameTime == 375*20){
    for(var i = 0; i < 25; i++){
      makeLongShip();
    }
  }
  if(gameTime == 380*20){
    for(var i = 0; i < 30; i++){
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
