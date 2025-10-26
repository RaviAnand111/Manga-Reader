
browser.tabs.onActivated.addListener(async (tabInfo) => {
  const { approvedTabs = [] } = await browser.storage.session.get('approvedTabs');
  const isApproved = approvedTabs.includes(tabInfo.tabId);

  if (isApproved) {
    const { delay, length } = await browser.storage.local.get(['delay', 'length']);

    browser.tabs.sendMessage(
      tabInfo.tabId,
      {
        from: 'background',
        action: 'start',
        delay,
        length
      }
    )
  }

  approvedTabs.forEach((tabId) => {
    if (tabId !== tabInfo.tabId) {
      browser.tabs.sendMessage(
        tabId,
        {
          from: 'background',
          action: 'stop',
        }
      )
    }
  })
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
      files: ["content-script.js"],
    });
  }
});
