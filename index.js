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
    itemId: "40f00380-b88a-46ed-8685-59d15a9f13d5",
    budgetId: "ff83414a-a8f7-4e20-bf8f-a2dbc9abcf9a",
  };

  await eb.deleteBudgetItem({ ...options, ...budgetLine });

  // await eb.logout({ ...options });
})();
