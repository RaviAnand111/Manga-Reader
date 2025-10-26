const form = document.getElementById("valuesForm");

document.addEventListener('DOMContentLoaded', async (event) => {

  const { delay, length } = await browser.storage.local.get(['delay', 'length']);

  document.getElementById("delay").value = delay;
  document.getElementById("length").value = length;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const delay = document.getElementById("delay").value;
    const length = document.getElementById("length").value;

    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true
    })

    if (!tabs?.[0]) {
      throw new Error('No active tab found');
    }

    await injectScriptToPage(tabs[0])
    await storeTabIdInSessionStorage(tabs);
    await storeScrollDataInLocalStorage(delay, length);
    await sendMessageToPageToStartScrolling(tabs, delay, length);
  })

})

async function injectScriptToPage(tab) {
  try {
    let injectPromise = await browser.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: ["../content-script.js"],
      injectImmediately: true
    });
  } catch (error) {
    console.log('Script injection failed', error);
  }
}

async function sendMessageToPageToStartScrolling(tabs, delay, length) {
  try {
    await browser.tabs.sendMessage(
      tabs[0].id,
      {
        from: 'popup',
        action: 'start',
        delay,
        length
      },
      () => console.log('callback')
    )
  } catch (error) {
    console.log('Message sending failed', error);
  }
}

async function storeTabIdInSessionStorage(tabs) {
  try {
    const { approvedTabs = [] } = await browser.storage.session.get('approvedTabs')

    if (!approvedTabs.includes(tabs[0].id)) {
      approvedTabs.push(tabs[0].id);
      browser.storage.session.set({ approvedTabs });
    }
  } catch (error) {
    console.log('Storing tabid failed', error);
  }
}

async function storeScrollDataInLocalStorage(delay, length) {
  try {
    await browser.storage.local.set({
      delay,
      length
    });
  } catch (error) {
    console.log('Storing scroll data failed', error);
  }
}

