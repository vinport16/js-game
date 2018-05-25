
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(){
  while(true){
    while(!paused){
      step();
      await sleep(100);
    }
    await sleep(100);
  }
}
main();
