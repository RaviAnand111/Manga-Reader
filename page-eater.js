
let yCoord = 0, delay = 1000, length = 100, scrollInterval = null;

if (typeof window !== 'undefined') {
  yCoord = window.scrollY;
}

function startScrolling(yCoord) {
  if (scrollInterval) clearInterval(scrollInterval);

  scrollInterval = setInterval(() => {
    yCoord += Number(length);
    window.scroll({
      top: yCoord,
      behavior: 'smooth'
    });
  }, delay)
}

function stopScrolling() {
  console.log('scrolling stopped');
  clearInterval(scrollInterval);
  scrollInterval = null;
}

browser.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.from == 'popup') {

    // length comes in second from popup, convert to ms
    if (msg.delay) {
      delay = msg.delay * 1000;
    }

    if (msg.length) {
      length = msg.length;
    }

    if (msg.action == 'start') {
      startScrolling(window.scrollY);
      hijackSpaceBar();
    } else if (msg.action == 'stop') {
      stopScrolling();
      removeSpaceBarHijack();
    }

  }
})

let keysPressed = [];
let spacePressedForLongTime = false;

function keyDownEventListener(event) {
  if (event.code === 'Space' && event.key === ' ') {
    event.preventDefault();

    if (event.repeat) {
      spacePressedForLongTime = true;
    } else {
      spacePressedForLongTime = false;
    }
    spaceBarKeyDownListener(event);
  }
}

function keyUpEventListener(event) {
  if (event.code === 'Space' && event.key === ' ') {
    event.preventDefault();
    spaceBarKeyUpListener(event);
  }
}

function spaceBarKeyDownListener(event) {
  if (
    event.target.tagName === 'INPUT' ||
    event.target.tagName === 'TEXTAREA' ||
    event.target.isContentEditable
  ) return;
  console.log('event in keydown', scrollInterval);
  if (!scrollInterval) {
    startScrolling(window.scrollY);
  } else {
    if (!event.repeat) {
      stopScrolling();
    }
  }
}

function spaceBarKeyUpListener(event) {
  if (
    event.target.tagName === 'INPUT' ||
    event.target.tagName === 'TEXTAREA' ||
    event.target.isContentEditable
  ) return;

  if (spacePressedForLongTime && !scrollInterval) {
    console.log('scrolling started');
    startScrolling(window.scrollY);
  }
}


function hijackSpaceBar() {
  document.body.addEventListener('keydown', keyDownEventListener)
  document.body.addEventListener('keyup', keyUpEventListener)
}

function removeSpaceBarHijack() {
  document.body.removeEventListener('keydown', keyDownEventListener);
  document.body.addEventListener('keyup', keyUpEventListener)
}
