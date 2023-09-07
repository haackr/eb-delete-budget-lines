import puppeteer from "puppeteer";
import eb from "./lib/ebutil.js";
import users from "./.users.json" assert { "type": "json" };

(async function main() {
  console.log("test");
  const browser1 = await puppeteer.launch({ headless: false });
  const page = await browser1.newPage();

  await eb.login({ page, ...users.test1, environment: eb.Environments.US1 });

  const cookies = await page.cookies();

  const browser2 = await puppeteer.launch({ headless: false });

  const page2 = await browser2.newPage();

  await page2.setCookie(...cookies);

  await page2.goto("https://app.e-Builder.net/");
})();
