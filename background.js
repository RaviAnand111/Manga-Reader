
browser.tabs.onActivated.addListener((activeInfo) => {
})

browser.contextMenus.create({
  id: "eat-page",
  title: "Eat this page",
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "eat-page") {
    browser.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: ["page-eater.js"],
    });
  }
});
