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

const environment = eb.Environments.US1;

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
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  const options = { environment, page, browser };
  const cookies = await eb.login({ ...users.test1, ...options });
  options.cookies = cookies;

  console.log("logged in");
  const start = performance.now();
  console.log("-----begin deleting lines-----");

  await PromisePool.for(budgetLines)
    .withConcurrency(5)
    .process(async (line) => {
      await eb.deleteBudgetItem({ ...line, ...options });
      console.log(line.itemId);
    });

  // for (let i = 0; i < budgetLines.length; i++) {
  //   await eb.deleteBudgetItem({ ...options, ...budgetLines[i] });
  //   console.log(budgetLines[i].itemId);
  // }
  console.log("-----lines deleted-----");
  console.log((performance.now() - start) / 1000);

  await eb.logout({ ...options });
  console.log("logged out");
  browser.close();
}
