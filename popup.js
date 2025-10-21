console.log('popup js');

const form = document.getElementById("valuesForm");

form.addEventListener('submit', () => {
  const delay = document.getElementById("delay").value;

  browser.tabs.query({
    active: true, 
    currentWindow: true
  }, 
  (tabs) => {
    browser.tabs.sendMessage(
        tabs[0].id,
        {
          from: 'popup',
          action: 'start',
          delay
        },
        () => console.log('callback')
      ) 
  })
})

document.addEventListener('DOMContentLoaded', () => {
})

/*document.addEventListener('click', (event) => {
  if(!event.target.classList.contains("page-choice"))return;

  browser.tabs.create({
    url: event.target.textContent
  })

})*/

/*document.addEventListener('DOMContentLoaded', () => {
  browser.action.onClicked.addListener(() => browser.tabs.create({
    url: "https://developer.mozilla.org",
  }))
  console.log('popup.js loaded');
  const btnId = document.getElementById('greetBtn');
  btnId.addEventListener('click', () => {
    alert('popup.js loaded');
  })
})*/
