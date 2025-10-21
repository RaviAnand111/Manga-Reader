
browser.tabs.onActivated.addListener((activeInfo) => {
  console.log(activeInfo.tabId, 'tabId');
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
