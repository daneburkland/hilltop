const assert = require("assert");
module.exports = async function ({ page }) {
  await page.goto("https://checklyhq.com/");

  await page.waitFor('a[href="/docs"]');

  // get the text of the button
  await Promise.all([page.waitForNavigation(), page.click('a[href="/docs"]')]);

  console.log("clicked docs");

  await Promise.all([
    page.waitForNavigation(),
    page.click('a[href="/docs/api-checks/"]'),
  ]);

  await Promise.all([page.waitForNavigation(), page.click("a.navbar-brand")]);

  // assert using built-in assert function
  try {
    assert.equal(buttonText, "Start your free trial");
    return true;
  } catch (e) {
    return e;
  }
};
