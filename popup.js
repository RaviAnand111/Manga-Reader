console.log('popup js');

document.addEventListener('click', (event) => {
  if(!event.target.classList.contains("page-choice"))return;

  browser.tabs.create({
    url: event.target.textContent
  })
})

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
