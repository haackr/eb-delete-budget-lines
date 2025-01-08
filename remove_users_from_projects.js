import puppeteer from "puppeteer";
import fs from "fs";
import { performance } from "node:perf_hooks";
import events from "events";
events.EventEmitter.defaultMaxListeners = 100;

const ALL_USERS = ["9f869c6f-282d-4f3c-94b1-4e59d3858ca0", "00893cfb-bd08-4c3a-8eb8-691bbe81c2de", "0caef439-8919-4abe-9fb5-e7812b065fe4", "522bc8c1-accf-468b-9eef-9118d19a2b87", "f1c4b442-b636-4663-89aa-5f57d8472be9", "e872702f-b077-4c65-a2da-2ee5bc0fd9fd", "5983439b-06d3-48a6-a4db-21de2e09cea0", "e2a7440e-8b83-4cf4-9563-29cdac49f404", "afe2bad1-c04c-4f1a-bbea-463ee0788ead", "d4b9fc98-bdb6-4452-b676-08bc011374e6", "eb7b9320-fd5f-4727-b580-785d9ba77c8b", "e4df9424-5a04-4cac-86f5-322ac182cafc", "652cc37b-4661-4531-99f0-3fe970a92e2e", "e6e93e95-ef22-4921-8b6f-c804a780be87", "4554c28f-d056-4b25-9e43-42f8a85c7782", "3fbee1d3-f89b-4194-8b87-5fc7ca838225", "964e5bdb-a3b6-499d-a1c2-857b11ec5b1e", "c6a19a58-8460-443e-8105-bbc987c4f786", "939f727d-9efe-4867-99ef-13488d6ef2b0", "a08a1b30-d02b-4546-b1c8-3017720c61d3", "46784dbf-603c-4d88-8168-1b85993f15b9", "38a4919e-7bea-41e9-bc87-8883f5bfca13", "304cbca5-2fd9-45ea-91aa-2e4ac45a72c3", "e621e026-f83a-4c03-9cbf-6dc4c14fdaa3", "6fe51836-17d5-4d5e-9a11-d050616c59fb", "bc968974-8ace-4667-9266-33cbf2fe8b97", "4bfd4694-1b1d-49f2-9b53-07fdf9ecca38", "3fa1c50a-996e-4f58-adb6-8482614de16d", "c3e30d73-31ab-4a85-821c-86ad6dc2a748", "9ac51edc-4f76-406f-a871-d9f4575f9283", "01d2cb8f-bac6-4f66-9252-a95d44934be6", "07998e6d-c89c-457b-9c18-554f2a430f4c", "6d4c51c8-a2b8-4f56-a42a-908abdade021", "fd1a0953-5f1b-48f9-a64f-5321c1204728", "0809f94c-c7fd-41ec-a467-e2eaabe3697c", "da457af3-784f-4730-9459-648ebbd0bdb5", "f9437cf7-2ac9-4247-b623-7454e9d76fbb", "8c68869b-06f4-45dd-be2b-8d0690c1185b", "4a09871a-85df-4800-b730-8c805fa7aa9a", "8ff2bae8-2e4c-437e-85e3-afb618a381e1", "1f3d7625-98a6-4f45-96bc-4877b54c0338", "b3826d49-69da-4608-bed9-79fab3445260", "6c3a58d1-72c2-41bc-815f-125775621690", "4c91b2ab-9c71-42d8-bcde-6041b24b169f", "9feb7e2d-0376-49be-a003-d335d1d4ec57", "51701d17-2cb8-496a-9640-b66f44a9eba3"];
const ALL_PROJECTS = ["{32768229-F4A7-4F14-8FB5-47473D110F8D}", "{3FE50AEA-F5E0-420A-A2C6-F2CBAFAAB8F2}", "{98AD1EF2-496B-4867-8308-02795A68D957}", "{34F7EB29-40DD-456E-8489-E52166157580}", "{593B7DB5-ED39-4DC4-97F5-12BE4F07707C}", "{C2D7EA97-D4EF-4A86-88EC-C3ACF7F28D0D}", "{F6A81420-44DC-4CF0-9631-F0E099B27694}", "{BE0BED1B-7E01-47E0-AFF6-B4704D573F60}", "{E488AFE7-001D-4355-B7EE-29190E3DE121}", "{933937C9-2A16-46FD-A0A4-F884F443344A}", "{A79E62EA-7642-430E-97C0-C98E01A9EB31}", "{000E0CDE-3FEB-4643-8FBC-942A5F314CE4}", "{9FDEC9C5-D75A-4318-8A2F-93783A0F6313}", "{5B396B97-F656-4C91-BB8F-C69338D2A056}", "{5CC7A7D1-22C6-4E01-B905-EF3DE93A99A3}", "{FB4712F4-F3EC-4E86-9618-C3DA89D88E43}", "{086B089D-580A-4EF1-8294-5251D368107F}", "{A4698A71-9DC3-4256-842D-90F0CB74AFC2}", "{E68CC95D-33A0-4D30-B5BD-9A80A3698875}", "{9D8A81BC-0E95-4021-82DC-DF8C02076FEA}", "{CD76CB14-A608-4E0E-8435-34D63488DDD0}", "{424529FD-BB0C-40DB-B785-D1F600CDB0E4}", "{4DD034A0-2999-4A71-B60E-3C7C24006221}", "{A72958FF-D9AB-406C-9791-0007D7B4A87A}", "{09A29EC4-DD2D-492C-B922-10707FB05D0E}", "{BACF53E9-C661-422E-B9EC-CB59031554B5}", "{14B6D320-BE7D-4719-B732-FA94E8913ABF}", "{A5E05F51-5453-4476-A417-BA310D17A495}", "{8D9F76EE-BAD3-4D56-9DE0-2350E9E66331}", "{835F10C1-C4C5-4B11-8663-A92560840078}", "{3DC2F361-9CD8-4AAE-8F15-2332B4AA4246}", "{A0B8608E-464B-4D32-8DA1-918CD03F8437}", "{6D086041-9956-452D-A233-F6E9B8992699}", "{23993D55-1F4A-4818-9ACF-66EBCB37AB70}", "{325670D4-7638-4086-B605-D5F6F53F9E9A}", "{DBC48144-0544-406C-9914-E8B849633FBC}", "{D2527BD7-9BF1-475E-B126-A0887700620C}", "{9F90E709-FC87-4874-AFD0-A1C5A70985F0}", "{6369FB3E-F296-4ABE-A19A-A2DB055E6230}", "{A3325DA0-01A5-4DAF-8C0E-D41A677EA08B}", "{558C8B96-CA72-4E1F-829B-4BFB181FF26F}", "{A06F68CE-F7E3-426C-827F-B82C94B1C252}", "{72EB3E10-AD6B-41BC-AE13-66DD15E7743B}", "{89ED3B6F-C588-433E-8775-AF7D2B5816B2}", "{73E37E76-A33F-427D-9D6F-7C77CC4A3EA4}", "{D06D4109-7F04-406B-9BCB-C8D4FAF705E6}", "{DC4805CE-8632-4D03-8EEF-62EFB618121F}", "{7060C053-93AF-4B3E-A4EA-D81F89741D2C}", "{35CBB0CA-7DB5-462D-A0E4-356C1F0A5893}", "{31FE8ED8-6841-41B0-BC5B-3133BA1144F5}", "{9DB9AEB6-6719-45E7-A08E-3147A6499AC4}", "{CDDE049D-7DCC-4971-84EE-E2C3CA95A2E8}", "{4CA5F958-A8AE-4458-933D-978DDF0DAEAD}", "{205AB920-A6D4-4E83-A3FD-9798390FCA64}", "{93902AA1-98BD-4F47-95DC-9FBD21D4DF39}", "{8D063608-EC3A-4A1A-9FA4-68AB5AEB7F1D}", "{C0E80A31-56CF-43D3-8251-B3CAB3A10811}", "{0CFB292F-1E62-4158-8894-3AD2519D968F}", "{112D389C-E5AC-42E4-981C-95E348111FB9}", "{1E1F5463-C260-4713-B1AB-EEE1696E8C2A}", "{79B024E1-CFDB-47F8-85CD-39DA255BCF58}", "{D3FB03AB-7484-4114-8BDF-2F66BB0DC25D}", "{3F019AB6-A161-4798-AE09-28661941AB68}", "{6884E30B-55C1-4A44-A5A8-B99A66C8BD04}", "{C8E77952-039D-4A3C-B9A9-7F92B7949735}", "{1AB79AF6-276A-4492-B830-B1485AB5360B}", "{16E8BFDA-FC5A-4388-8FC8-45F66A6E1314}", "{AA392581-D5C0-495C-BB8B-5890E82331DF}", "{C3661A72-5FA5-47F7-A7F4-99B454CBEB61}", "{76C5A6AE-1038-4475-9C85-D225E791CE3A}", "{A181E51C-B3B9-436C-AEF8-59176613C8B0}", "{41080854-0EB9-4319-B095-C493A9467E5B}", "{A5A998C9-D1B8-42E1-AE3C-9F385697419F}", "{14D983EB-454C-4674-BB61-210A6CD163CD}", "{D3863315-4BDF-4FCA-8616-20D9967D32EA}", "{AC617593-C0D8-4F22-B370-FEA1497CAF99}", "{147B7FD3-0D33-49D3-8015-CE44B8F17D20}", "{F941246E-96D9-42FB-91B0-8D73B073D532}", "{EC485190-ADBA-48C1-94CB-9179FC5A57E2}", "{93846C2A-78D8-44D3-8F9E-8C39462865C1}", "{3F496D2C-1A3E-446F-9711-5D22CD82FFB3}", "{6D046BB3-296A-46E2-A695-F47602DBE411}", "{12C9F67F-0C37-4D42-A7D5-532DF34C97BC}", "{3D1DF7C7-B539-4BE3-A76C-26331239D6DD}", "{C23FD4B2-C45D-4770-9805-214F95BB2E2C}", "{C73D421D-A7CF-4938-B3EA-669AA5CA0483}", "{FAC134F3-CA09-4FB6-9280-2BA68CFAAF5D}", "{0EFCB080-64F7-4C23-A334-8FDCF3B054D7}", "{30C57A16-E687-4657-AA03-0D7B29AD4611}", "{B0184E09-842C-4EC9-B7F0-05891E7E7427}", "{E7B3A38F-C7F1-49FA-B4B5-C2C64285B82A}", "{CB46F089-F90C-4616-BE91-390FE3E16CE1}", "{66038253-76D5-444C-AA10-7086F8EF6CAB}", "{98A86C17-DC7E-4494-9962-0A552205BB98}", "{82B875BC-C72F-422B-BDCE-0AEE2E021CA9}", "{D80FAD30-6884-46C7-87BB-179ECB0AB934}", "{0782F4E6-B33E-4648-AFA1-E28B729BAB7B}", "{A951631B-E38A-47BC-B967-8D5302735E47}", "{9448BD83-7E3C-4580-8235-96752A3CDA83}", "{1206FB74-02D5-44A8-9689-48C070B35BFA}", "{6C38FADC-26AD-4955-8457-5EBF30AB1A24}", "{3374360D-E2D7-4FE6-86B6-57AF26547317}", "{E386AD15-C686-4D27-B744-1025C651E20F}", "{1F6B6D0C-A266-412E-A8D7-066BEDCFA23D}", "{22EFA1FE-4011-4D15-BC19-63B42A901402}", "{E2A8F767-36C1-43F6-878F-056402D18C0C}", "{5070FFA8-6231-4475-A983-80902B777108}", "{729DE1D4-3628-4122-86F6-798190D4C5A7}", "{B016F615-8BCC-479C-86E0-C3FD73E97337}", "{A8060592-D7D7-41BE-A474-6975628150C6}", "{53172BF9-E6CD-40F4-95B0-085746ED7D32}", "{A050C015-BF2F-4FD0-ABF3-7406EEC42541}", "{76F58818-05E8-46B5-940F-F104169DEB46}", "{82269AA0-252C-4FFC-AF60-FA93CADE90DC}", "{F99290A3-8BA7-4B20-B043-D95CE30ADAA0}", "{9082EB1C-67D2-490B-951A-0591E422BF83}", "{93EBF00E-1828-4F09-BBA2-AFE5E515EC2F}", "{C7E150E9-FBF8-4DEE-9286-05154D02E70B}", "{91B13EE6-202C-4885-940D-E143AC4E455A}", "{6B853E2B-A073-44DA-B879-1E0080B4FAA2}", "{E80792B1-028B-415B-8F8A-8E58CE313774}"];

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
  console.log(`---- BEGIN REMOVING USERS FROM PROJECTS -----`);
  removeUsersFromProjects(ALL_USERS, ALL_PROJECTS);
  console.log("----- REMOVAL COMPLETE -----");

})();


async function removeUsersFromProjects(users, projects) {
  for (const userId of users) {
    console.log(`Removing projects from ${userId}...`)
    await eb.removeUsersFromProjects({userId, projects, ...options})
  }
}

async function login() {
  cookies = await eb.login({ ...users.DataMigration2, ...options });
  fs.writeFileSync("./sessionCookies",JSON.stringify(cookies));
  // console.log(cookies);
  options.cookies = cookies;
}