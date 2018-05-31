
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var wavenum = 1;
var wavewait = false;

function waveAlert(){
  writeMessage("Wave "+wavenum);
  wavewait = true;
  wavenum += 1;
}

function endWaveAlert(){
  writeMessage("Wave "+(wavenum-1)+" complete!");
}

var waves = [];
for(var i = 0; i < 100; i++){
  waves[i] = -200;
}

waves[0] = 20;

function doGameEvents(){

  //check if wave is complete, mark time for next wave
  if(wavewait && numShips() == 0){
    wavewait = false;
    waves[wavenum-1] = Math.round(gameTime/20) + 15;
    endWaveAlert();
  }

  //every step, small chance of a little ship appearning
  if(Math.random()<0.002){
    makeDefaultShip();
  }


  //make 10 default ships
  if(gameTime == waves[0]*20){
    waveAlert();
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == (waves[0]+5)*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }


  //make 12 default ships and 2 big ships
  if(gameTime == waves[1]*20){
    waveAlert();
    for(var i = 0; i < 6; i++){
      makeDefaultShip();
    }
    makeBigShip();
  }
  if(gameTime == (waves[1]+5)*20){
    for(var i = 0; i < 6; i++){
      makeDefaultShip();
    }
    makeBigShip();
  }


  //make 10 default ships, 5 big ships
  if(gameTime == waves[2]*20){
    waveAlert();
    for(var i = 0; i < 4; i++){
      makeBigShip();
    }
    makeDefaultShip();
  }
  if(gameTime == (waves[2]+5)*20){
    for(var i = 0; i < 9; i++){
      makeDefaultShip();
    }
    makeBigShip();
  }


  //make 25 default ships
  if(gameTime == waves[3]*20){
    waveAlert();
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == (waves[3]+5)*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == (waves[3]+10)*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == (waves[3]+15)*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == (waves[3]+20)*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }


  //2 mother ships
  if(gameTime == waves[4]*20){
    waveAlert();
    makeMotherShip();
    makeMotherShip();
  }


  //8 default ships, 3 big ships
  if(gameTime == waves[5]*20){
    waveAlert();
    for(var i = 0; i < 3; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 3; i++){
      makeBigShip();
    }
  }
  if(gameTime == (waves[5]+3)*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }


  //4 mother ships
  if(gameTime == waves[6]*20){
    waveAlert();
    for(var i = 0; i < 4; i++){
      makeMotherShip();
    }
  }


  //11 default ships, 4 big ships, 4 long ships
  if(gameTime == waves[7]*20){
    waveAlert();
    for(var i = 0; i < 6; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 4; i++){
      makeBigShip();
    }
  }
  if(gameTime == (waves[7]+5)*20){
    for(var i = 0; i < 4; i++){
      makeLongShip();
    }
  }
  if(gameTime == (waves[7]+10)*20){
    for(var i = 0; i < 5; i++){
      makeDefaultShip();
    }
  }


  //18 default ships, 8 big ships, 8 long ships, 2 mother ships
  if(gameTime == waves[8]*20){
    waveAlert();
    for(var i = 0; i < 10; i++){
      makeDefaultShip();
    }
    for(var i = 0; i < 8; i++){
      makeBigShip();
    }
  }
  if(gameTime == (waves[8]+5)*20){
    for(var i = 0; i < 8; i++){
      makeLongShip();
    }
    for(var i = 0; i < 8; i++){
      makeDefaultShip();
    }
  }
  if(gameTime == (waves[8]+10)*23){
    makeMotherShip();
    makeMotherShip();
  }

  //20 default ships, 10 big ships, 10 long ships
  if(gameTime == waves[9]*20){
    waveAlert();
    for(var i = 0; i < 10; i++){
      makeBigShip();
    }
  }
  if(gameTime == (waves[9]+5)*20){
    for(var i = 0; i < 10; i++){
      makeLongShip();
    }
    for(var i = 0; i < 20; i++){
      makeDefaultShip();
    }
  }


  //15 default ships, 25 big ships, 10 long ships, 3 mother ships
  if(gameTime == waves[10]*20){
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
  if(gameTime == (waves[10]+5)*20){
    for(var i = 0; i < 20; i++){
      makeBigShip();
    }
    for(var i = 0; i < 10; i++){
      makeLongShip();
    }
  }


  //20 big ships, 25 long ships, 30 default ships
  if(gameTime == waves[11]*20){
    waveAlert();
    for(var i = 0; i < 20; i++){
      makeBigShip();
    }
  }
  if(gameTime == (waves[11]+5)*20){
    for(var i = 0; i < 25; i++){
      makeLongShip();
    }
  }
  if(gameTime == (waves[11]+15)*20){
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
