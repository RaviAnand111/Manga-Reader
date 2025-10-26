let yCoord = 0, delay = 1000, length = 100, scrollInterval = null;

if (typeof window !== 'undefined') {
  yCoord = window.scrollY;
}

function startScrolling() {
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
  clearInterval(scrollInterval);
  scrollInterval = null;
}

browser.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.from == 'popup' || msg.from == 'background') {

    // length comes in second from popup, convert to ms
    if (msg.delay) {
      delay = msg.delay * 1000;
    }

    if (msg.length) {
      length = msg.length;
    }

    if (msg.action == 'start') {
      startScrolling();
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
    event.target.isContentEditable ||
    spacePressedForLongTime
  ) return;

  if (!scrollInterval) {
    startScrolling();
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
    startScrolling();
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

document.addEventListener('scroll', (event) => {
  // is user scrolls past or up then the current scrolling position pick up that as the new base location for scrolling
  if (window.scrollY !== yCoord) {
    stopScrolling();
    yCoord = window.scrollY;
    startScrolling();
  }
  
  // subtracting the twice of length of scroll distance assuming the website has footer below the reading material
  const endOfPage = document.documentElement.scrollHeight - (2 * length);
  const currentScrollPosition = window.innerHeight + window.scrollY;

  if (
    currentScrollPosition >= endOfPage
  ) {
    stopScrolling();
  }
})
