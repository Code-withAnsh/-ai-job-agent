const { chromium } = require("playwright");
const config = require("../config/config");

async function launchBrowser() {
  const browser = await chromium.launch({
    headless: config.browser.headless,
    slowMo: config.browser.slowMo,
  });

  const page = await browser.newPage();

  return { browser, page };
}

module.exports = { launchBrowser };
