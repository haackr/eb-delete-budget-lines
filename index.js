import puppeteer from "puppeteer";
import eb from "./lib/ebutil.js";

import users from "./.users.json" assert { "type": "json" };

const environment = eb.Environments.US1;

(async function main() {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  const options = { environment, page, browser };

  await eb.login({ ...users.test1, ...options });

  const budgetLine = {
    portalId: "69e94efa-9e63-4a87-a281-fc28c1a54e39",
    itemId: "0eeb6344-111e-49bd-9f92-233182f3f67e",
    budgetId: "ff83414a-a8f7-4e20-bf8f-a2dbc9abcf9a",
  };

  await eb.deleteBudgetItem({ ...options, ...budgetLine });
  await eb.deleteBudgetItem({
    ...options,
    portalId: "fake",
    budgetId: "fake",
    itemId: "fake",
  });

  // await eb.logout({ ...options });
})();
