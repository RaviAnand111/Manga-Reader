
let yCoord = 0, delay = 1000, scrollInterval = null;

function startScrolling(){
  if(scrollInterval) clearInterval(scrollInterval);

  scrollInterval = setInterval(() => {
     yCoord += 500;
     window.scroll({
      top: yCoord,
      behavior: 'smooth'
    }); 
  }, delay)
}

browser.runtime.onMessage.addListener((msg, sender, response) => {
  if(msg.from == 'popup'){

    if(msg.action == 'start'){
      startScrolling();
    } else if(msg.action == 'stop'){
      clearInterval(scrollInterval);
    }

    if(msg.delay){
     console.log(msg.delay);
     delay = msg.delay
    }

  }
})
