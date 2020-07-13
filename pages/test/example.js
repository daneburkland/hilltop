const Machine = require("xstate").Machine;
const createModel = require("@xstate/test").createModel;

module.exports = async function ({ page: originalPage }) {
  let result = [];

  const feedbackMachine = Machine({
    id: "feedback",
    initial: "docs",
    states: {
      docs: {
        on: {
          CLICK_OVERVIEW: "overview",
          CLICK_QUICKSTART: "quickstart",
        },
        meta: {
          test: async (page) => {
            console.log("testing");
            try {
              const html = await page.content();
              // debugger;
              //   await page.$x("//h1[contains(text(), 'Documentation')]");
              result.push("docs success");
            } catch (e) {
              result.push(e.toString());
            }
          },
        },
      },
      overview: {
        on: {
          CLICK_DOCS: "docs",
          CLICK_QUICKSTART: "quickstart",
        },
        meta: {
          test: async (page) => {
            const html = await page.content();
            // await page.$x("//h1[contains(text(), 'Overview')]");
            result.push("overview success");
          },
        },
      },
      quickstart: {
        on: {
          CLICK_DOCS: "docs",
          CLICK_OVERVIEW: "overview",
        },
        meta: {
          test: async (page) => {
            // await page.$x("//h2[contains(text(), 'What is a browser check?')]");
            const html = await page.content();
            result.push("quickstart success");
          },
        },
      },
    },
  });

  const testModel = createModel(feedbackMachine).withEvents({
    CLICK_DOCS: async (page) => {
      try {
        await Promise.all([
          // page.waitForNavigation(),
          page.click('a[href$="/docs"]'),
        ]);
      } catch (e) {
        console.log("failed event docs", e);
      }
    },
    CLICK_OVERVIEW: async (page) => {
      try {
        await Promise.all([
          page.waitForNavigation(),
          page.click('a[href$="/docs/api-checks/"]'),
        ]);
      } catch (e) {
        console.log("failed event overview", e);
      }
    },
    CLICK_QUICKSTART: async (page) => {
      try {
        await Promise.all([
          // page.waitForNavigation(),
          page.click('a[href$="/docs/browser-checks/"]'),
        ]);
      } catch (e) {
        console.log("failed event quickstart", e);
      }
    },
  });

  await originalPage.goto("https://checklyhq.com");

  const testPlans = testModel.getSimplePathPlans();
  testPlans.forEach((plan) => {
    plan.paths.forEach(async (path) => {
      console.log("path", path);
      try {
        await path.test(originalPage);
      } catch (e) {
        console.log(e);
      }
    });
  });

  return result;
};
