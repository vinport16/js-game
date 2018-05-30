
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
wavenum = 1;
function waveAlert(){
  alert("Wave "+wavenum);
  wavenum += 1;
}

function doGameEvents(){

  //every step, small chance of a little ship appearning
  if(Math.random()<0.005){
    makeDefaultShip();
  }


  //make 10 default ships
  if(gameTime == 20*20){
    waveAlert();
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == 23*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }


  //make 12 default ships and 2 big ships
  if(gameTime == 55*20){
    waveAlert();
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


  //make 10 default ships, 5 big ships
  if(gameTime == 90*20){
    waveAlert();
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


  //make 25 default ships
  if(gameTime == 130*20){
    waveAlert();
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


  //1 mother ship
  if(gameTime == 160*20){
    waveAlert();
    makeMotherShip();
  }


  //8 default ships, 3 big ships
  if(gameTime == 180*20){
    waveAlert();
    for(var i = 0; i < 3; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 3; i++){
      makeBigShip();
    }
  }
  if(gameTime == 183*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }


  //3 mother ships
  if(gameTime == 197*20){
    waveAlert();
    for(var i = 0; i < 3; i++){
      makeMotherShip();
    }
  }


  //11 default ships, 4 big ships, 4 long ships
  if(gameTime == 220*20){
    waveAlert();
    for(var i = 0; i < 6; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 4; i++){
      makeBigShip();
    }
  }
  if(gameTime == 225*20){
    for(var i = 0; i < 4; i++){
      makeLongShip();
    }
  }
  if(gameTime == 230*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }


  //18 default ships, 8 big ships, 8 long ships, 2 mother ships
  if(gameTime == 240*20){
    waveAlert();
    for(var i = 0; i < 10; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 8; i++){
      makeBigShip();
    }
  }
  if(gameTime == 245*20){
    for(var i = 0; i < 8; i++){
      makeLongShip();
    }
    for(var i = 0; i < 8; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == 250*23){
    makeMotherShip();
    makeMotherShip();
  }

  //20 default ships, 10 big ships, 10 long ships
  if(gameTime == 290*20){
    waveAlert();
    for(var i = 0; i < 10; i++){
      makeBigShip();
    }
  }
  if(gameTime == 300*20){
    for(var i = 0; i < 10; i++){
      makeLongShip();
    }
    for(var i = 0; i < 20; i++){
      makeDefaultShip();
    }
  }


  //15 default ships, 25 big ships, 10 long ships, 3 mother ships
  if(gameTime == 340*20){
    waveAlert();
    for(var i = 0; i < 15; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 5; i++){
      makeBigShip();
    }
    for(var i = 0; i < 3; i++){
      makeMotherShip();
    }
  }
  if(gameTime == 348*20){
    for(var i = 0; i < 20; i++){
      makeBigShip();
    }
    for(var i = 0; i < 10; i++){
      makeLongShip();
    }
  }


  //20 big ships, 25 long ships, 30 default ships
  if(gameTime == 395*20){
    waveAlert();
    for(var i = 0; i < 20; i++){
      makeBigShip();
    }
  }
  if(gameTime == 400*20){
    for(var i = 0; i < 25; i++){
      makeLongShip();
    }
  }
  if(gameTime == 410*20){
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
