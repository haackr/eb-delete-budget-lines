import puppeteer from "puppeteer";
import fs from "fs";
import { performance } from "node:perf_hooks";
import events from "events";
events.EventEmitter.defaultMaxListeners = 100;

const ALL_USERS = ["9f869c6f-282d-4f3c-94b1-4e59d3858ca0", "00893cfb-bd08-4c3a-8eb8-691bbe81c2de", "0caef439-8919-4abe-9fb5-e7812b065fe4", "522bc8c1-accf-468b-9eef-9118d19a2b87", "f1c4b442-b636-4663-89aa-5f57d8472be9", "e872702f-b077-4c65-a2da-2ee5bc0fd9fd", "5983439b-06d3-48a6-a4db-21de2e09cea0", "e2a7440e-8b83-4cf4-9563-29cdac49f404", "afe2bad1-c04c-4f1a-bbea-463ee0788ead", "d4b9fc98-bdb6-4452-b676-08bc011374e6", "eb7b9320-fd5f-4727-b580-785d9ba77c8b", "e4df9424-5a04-4cac-86f5-322ac182cafc", "652cc37b-4661-4531-99f0-3fe970a92e2e", "e6e93e95-ef22-4921-8b6f-c804a780be87", "4554c28f-d056-4b25-9e43-42f8a85c7782", "3fbee1d3-f89b-4194-8b87-5fc7ca838225", "964e5bdb-a3b6-499d-a1c2-857b11ec5b1e", "c6a19a58-8460-443e-8105-bbc987c4f786", "939f727d-9efe-4867-99ef-13488d6ef2b0", "a08a1b30-d02b-4546-b1c8-3017720c61d3", "46784dbf-603c-4d88-8168-1b85993f15b9", "38a4919e-7bea-41e9-bc87-8883f5bfca13", "304cbca5-2fd9-45ea-91aa-2e4ac45a72c3", "e621e026-f83a-4c03-9cbf-6dc4c14fdaa3", "6fe51836-17d5-4d5e-9a11-d050616c59fb", "bc968974-8ace-4667-9266-33cbf2fe8b97", "4bfd4694-1b1d-49f2-9b53-07fdf9ecca38", "3fa1c50a-996e-4f58-adb6-8482614de16d", "c3e30d73-31ab-4a85-821c-86ad6dc2a748", "9ac51edc-4f76-406f-a871-d9f4575f9283", "01d2cb8f-bac6-4f66-9252-a95d44934be6", "07998e6d-c89c-457b-9c18-554f2a430f4c", "6d4c51c8-a2b8-4f56-a42a-908abdade021", "fd1a0953-5f1b-48f9-a64f-5321c1204728", "0809f94c-c7fd-41ec-a467-e2eaabe3697c", "da457af3-784f-4730-9459-648ebbd0bdb5", "f9437cf7-2ac9-4247-b623-7454e9d76fbb", "8c68869b-06f4-45dd-be2b-8d0690c1185b", "4a09871a-85df-4800-b730-8c805fa7aa9a", "8ff2bae8-2e4c-437e-85e3-afb618a381e1", "1f3d7625-98a6-4f45-96bc-4877b54c0338", "b3826d49-69da-4608-bed9-79fab3445260", "6c3a58d1-72c2-41bc-815f-125775621690", "4c91b2ab-9c71-42d8-bcde-6041b24b169f", "9feb7e2d-0376-49be-a003-d335d1d4ec57", "51701d17-2cb8-496a-9640-b66f44a9eba3"];
const PROJECTS = ["{CA11B7CC3-A2FC-4747-A3D1-B63638C094C9}"];

import eb from "./lib/ebutil.js";

import users from "./.users.json" with { "type": "json" };

const environment = eb.Environments.US3;
let browser;
let page;
let options = {};
let cookies = {};

(async function main() {
  browser = await puppeteer.launch({ headless: false });

  page = await browser.newPage();
  options = { environment, page, browser };

  if(fs.existsSync("./sessionCookies")) {
    cookies = JSON.parse(fs.readFileSync("./sessionCookies"));
    options.cookies = cookies;
    await page.setCookie(...cookies);
    console.log("-----trying existing session-----");
    if(! await eb.isLoggedIn(options)) {
      await login();
    }
  } else {
    await login();
  }

  console.log("logged in");
  removeUsersFromProjects(ALL_USERS, PROJECTS);

})();


async function removeUsersFromProjects(users, projects) {
  for (const userId of users) {
    console.log(options.toString());
    console.log(userId)
    await eb.removeUsersFromProjects({userId, projects, ...options})
  }
}

async function login() {
  cookies = await eb.login({ ...users.DataMigration2, ...options });
  fs.writeFileSync("./sessionCookies",JSON.stringify(cookies));
  // console.log(cookies);
  options.cookies = cookies;
}