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
            console.log("testing docs");
            try {
              // debugger;
              const foo = await page.$x(
                "//h1[contains(text(), 'Documentation')]"
              );
              result.push("docs success");
            } catch (e) {
              result.push(`docs ${e.toString()}`);
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
            console.log("testing overview");
            try {
              await page.$x("//h1[contains(text(), 'Overview')]");
              result.push("overview success");
            } catch (e) {
              result.push(`overview ${e.toString()}`);
            }
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
            console.log("testing quickstart");
            try {
              const [quickstart] = await page.$x(
                "//h1[contains(text(), 'Quickstart')]"
              );
              if (quickstart) {
                result.push("quickstart success");
              } else {
                result.push("failed to verify quickstart");
              }
            } catch (e) {
              result.push(`quickstart ${e.toString()}`);
            }
          },
        },
      },
    },
  });

  const testModel = createModel(feedbackMachine).withEvents({
    CLICK_DOCS: async (page) => {
      try {
        console.log("clicking docs");
        await Promise.all([
          page.waitForNavigation(),
          page.click('a[href="/docs"]'),
        ]);
        console.log("clicked docs");
      } catch (e) {
        console.log("failed event docs", e);
      }
    },
    CLICK_OVERVIEW: async (page) => {
      try {
        console.log("clicking overview");
        // await page.hover("#docsNav > nav > div > section > div.navGroups > div:nth-child(2) > ul > li.navListItem.navListItemActive > a");
        await Promise.all([
          page.waitForNavigation(),
          page.click('a[href="/docs/api-checks/"]'),
        ]);
      } catch (e) {
        console.log("failed event overview", e);
      }
    },
    CLICK_QUICKSTART: async (page) => {
      try {
        console.log("clicking quickstart");
        // await page.hover("#docsNav > nav > div > section > div.navGroups > div:nth-child(2) > ul > li.navListItem.navListItemActive > a");
        await Promise.all([
          page.waitForNavigation(),
          page.click('a[href="/docs/browser-checks/"]'),
        ]);
      } catch (e) {
        console.log("failed event overview", e);
      }
    },
  });

  async function forEachWithCallback(arrayCopy, callback) {
    let index = 0;
    const next = async () => {
      index++;
      if (arrayCopy.length > 0) {
        await callback(arrayCopy.shift(), index, next);
      }
    };
    await next();
  }

  const testPlans = testModel.getSimplePathPlans();

  await forEachWithCallback(testPlans, async (plan, i, next) => {
    await forEachWithCallback(plan.paths, async (path, i, next) => {
      try {
        console.log("going to page");
        await originalPage.goto("https://checklyhq.com/docs").catch((e) => {
          console.log("error", e);
        });
        console.log("went to page");
        await path.test(originalPage);
      } catch (e) {
        console.log(e);
      }

      await next();
    });

    await next();
  }),
    console.log("returing", result);
  return result;
};
