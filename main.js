
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(){
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

document.getElementById("other").addEventListener("click",step);
