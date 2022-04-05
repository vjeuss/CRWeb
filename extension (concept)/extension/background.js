console.log("Background Script Loaded");
chrome.runtime.onMessage.addListener((incomingMessage, sender) => {
  if ((incomingMessage.from === 'content') && (incomingMessage.subject === '')) {
    // chrome.pageAction.show(sender.tab.id);
    //   chrome.browserAction.openPopup()
  }
});