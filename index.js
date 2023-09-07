import puppeteer from "puppeteer";
import Papa from "papaparse";
import fs from "fs";
import { PromisePool } from "@supercharge/promise-pool";

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
      console.log(budgetLines);
      deleteLines(budgetLines);
    },
  });
})();

async function deleteLines(budgetLines) {
  const browser = await puppeteer.launch({ headless: "new" });

  const page = await browser.newPage();

  const options = { environment, page, browser };

  await eb.login({ ...users.test1, ...options });
  console.log("logged in");

  // const budgetLine = {
  //   portalId: "69e94efa-9e63-4a87-a281-fc28c1a54e39",
  //   itemId: "0eeb6344-111e-49bd-9f92-233182f3f67e",
  //   budgetId: "ff83414a-a8f7-4e20-bf8f-a2dbc9abcf9a",
  // };

  // const budgetPromise = [];

  // for (let i = 0; i < budgetLines.length; i++) {
  //   budgetPromise.push(eb.deleteBudgetItem({ ...options, ...budgetLines[i] }));
  // }

  console.log("-----begin deleting lines-----");

  const { results, errors } = await PromisePool.for(budgetLines)
    .withConcurrency(5)
    .process(async (line) => {
      await eb.deleteBudgetItem({ ...options, ...line });
      console.log(`${line.itemId} deleted`);
    });

  console.log("-----lines deleted-----");

  await eb.logout({ ...options });
  console.log("logged out");
}
