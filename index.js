import puppeteer from "puppeteer";
import Papa from "papaparse";
import fs from "fs";
import { PromisePool } from "@supercharge/promise-pool";
import { performance } from "node:perf_hooks";
import events from "events";
events.EventEmitter.defaultMaxListeners = 100;

const file = fs.createReadStream("./input.csv");

import eb from "./lib/ebutil.js";

import users from "./.users.json" assert { "type": "json" };

const environment = eb.Environments.US3;
let browser;
let page;
let options = {};
let cookies = {};

(async function main() {
  var budgetLines = [];

  Papa.parse(file, {
    header: true,
    step: function (result) {
      budgetLines.push(result.data);
    },
    complete: function (results, file) {
      console.log("File Load Complete!");
      // console.log(budgetLines);
      deleteLines(budgetLines);
    },
  });
})();

async function deleteLines(budgetLines) {
  browser = await puppeteer.launch({ headless: "new" });

  page = await browser.newPage();
  options = { environment, page, browser };

  if (fs.existsSync("./sessionCookies")) {
    cookies = JSON.parse(fs.readFileSync("./sessionCookies"));
    options.cookies = cookies;
    await page.setCookie(...cookies);
    console.log("-----trying existing session-----");
    if (!(await eb.isLoggedIn(options))) {
      await login();
    }
  } else {
    await login();
  }

  console.log("logged in");
  const start = performance.now();
  console.log("-----begin deleting lines-----");

  await PromisePool.for(budgetLines)
    .withConcurrency(5)
    .process(async (line) => {
      const newCookies = await eb.deleteBudgetItem({ ...line, ...options });
      // console.log(`${item.itemId} - ${item.projectName} - ${item.accountCode}`);
      options.cookies = newCookies;
    });

  console.log("-----lines deleted-----");
  console.log((performance.now() - start) / 1000);

  await eb.logout({ ...options });
  console.log("logged out");
  browser.close();
}

async function login() {
  cookies = await eb.login({ ...users.DataMigrationPROD, ...options });
  fs.writeFileSync("./sessionCookies", JSON.stringify(cookies));
  // console.log(cookies);
  options.cookies = cookies;
}
