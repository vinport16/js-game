
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(){
  while(true){
    while(!paused){
      console.log("step");
      await sleep(500);
    }
    await sleep(500);
  }
}
main();
