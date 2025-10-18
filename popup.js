document.addEventListener('DOMContentLoaded', () => {
  console.log('popup.js loaded');
  const btnId = document.getElementById('greetBtn');
  btnId.addEventListener('click', () => {
    alert('popup.js loaded');
  })
})
