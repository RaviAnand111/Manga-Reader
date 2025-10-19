
browser.action.onClicked.addListener(() => {
  console.log('clicked');
  browser.tabs.create({
    url: 'https://developer.mozilla.org'
  })
})

browser.contextMenus.create({
  id: "eat-page",
  title: "Eat this page",
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  console.log('listener');
  if (info.menuItemId === "eat-page") {
    browser.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: ["page-eater.js"],
    });
  }
});
