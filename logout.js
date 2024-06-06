import puppeteer from "puppeteer";
import fs from "fs";
import eb from './lib/ebutil.js';

(async function main() {
    const environment = eb.Environments.US3;
    if(fs.existsSync("./sessionCookies")){
        console.log("session exists... begining logout...");
        const cookies = JSON.parse(fs.readFileSync("./sessionCookies"));
        const browser = await puppeteer.launch({headless: "new"});
        const page = await browser.newPage();
        await page.setCookie(...cookies);
        try {
            await eb.logout({page, environment});
            console.log("logout complete... deleting session...");
            fs.rmSync("./sessionCookies");
        } catch (error) {
            console.log("Error Logging Out");
        }
    } else {
        console.log("no existing session")
    }
})();