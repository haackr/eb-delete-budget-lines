import puppeteer from "puppeteer";

const eb = {};
const baseurl = "e-builder.net";

eb.Environments = {
  US1: "app",
  US2: "app-us2",
  US3: "app-us3",
  US4: "app-us4",
  GOV: "gov",
  CA: "app.ca",
};

eb.isLoggedIn = async function isLoggedIn({ page, environment }) {
  console.log("checking existing session");
  await page.goto(`https://${environment}.${baseurl}/`);

  try {
    await page.waitForSelector(".tabs");
    // console.log("Home page loaded?");
    console.log("existing session valid!");
    return true;
  } catch (error) {
    console.log("existing session invalid");
    return false;
  }
};

eb.login = async function login({
  page,
  username,
  password,
  environment,
  account,
}) {
  await page.goto(`https://${environment}.${baseurl}/`);

  let usernameField = null;

  // console.log(account);

  try {
    usernameField = await page.waitForSelector("#UnityConstructLogin_Username");
  } catch (error) {
    console.error(error);
    return "Error loading login page.";
  }
  const passwordField = await page.$("#UnityConstructLogin_Password");
  const loginButton = await page.$("#signIn > .spinner-button-container");
  await usernameField.type(username);
  await passwordField.type(password);
  await loginButton.click();
  // await page.waitForNavigation({ waitUntil: "networkidle2" });

  if (account != null) {
    try {
      const accountSelector = await page.evaluateHandle(
        `document.querySelector("#selectAccount").shadowRoot.querySelector("#mwc_id_1_select")`
      );
      await accountSelector.select(account);
      const continueButton = await page.waitForSelector(
        "#continueBtn > .spinner-button-containfer"
      );
      await continueButton.click();
    } catch (error) {
      console.error(`Error loading account selector: ${error}`);
      await page.goto(`https://${environment}.${baseurl}/Login/Logout.aspx`);
      throw new Error("Error Logging In");
    }
  }
  try {
    await page.waitForSelector(".tabs");
    // console.log("Home page loaded?");
  } catch (error) {
    console.error(`Error loading home page: ${error}`);
    await page.goto(`https://${environment}.${baseurl}/Login/Logout.aspx`);
    throw new Error("Error Loggin In");
  }

  return page.cookies();
};

eb.logout = async function logout({ page, environment }) {
  try {
    await page.goto(`https://${environment}.${baseurl}/Login/Logout.aspx`);
  } catch (error) {
    console.error(`Error logging out: ${error}`);
  }
};

eb.deleteBudgetItem = async function deleteBudgetItem({
  cookies,
  environment,
  itemId,
  accountCode,
  projectName,
  budgetId,
  portalId,
}) {
  // console.log("called");
  // console.log(cookies);
  const browser = await puppeteer.launch({ headless: "new" });

  const page = await browser.newPage();
  await page.setCookie(...cookies);
  await page.goto(
    `https://${environment}.${baseurl}/da2/Cost/Budgets/LineItemDetails.aspx?Mode=Edit&PortalID=${portalId}&BudgetLineItemID=${itemId}&BudgetID=${budgetId}`
  );

  try {
    const deleteButton = await page.waitForSelector(
      "input.Button[value=Delete]",
      {
        timeout: 10000,
      }
    );
    await deleteButton.click();
    const confirmButton = await page.waitForSelector(
      "input.Button[value='Yes, Delete the Line Item']",
      { timeout: 10000 }
    );
    // console.locd debg(confirmButton);
    await confirmButton.click();
    await page.waitForNavigation();
    console.log(`${itemId} - ${projectName} - ${accountCode} - DELETED`);
  } catch (error) {
    console.error(
      `Error deleting line ${itemId} - ${projectName} - ${accountCode}: ${error}`
    );
  }
  // await page.goto(`https://${environment}.${baseurl}/`)
  // const newCookies =  await page.cookies();
  browser.close();
  return newCookies;
};

eb.deleteUser = async function deleteUser({ cookies, environment, userName }) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  page.setCookie(...cookies);

  await page.goto(
    `https://${environment}.${baseurl}/da2/Setup/Admin/Users/ManageUsers.aspx`
  );
  try {
    const userNameField = await page.waitForSelector(
      "input#ctl00_ctl00_ContentPlaceHolder1_contentSection_txtUserName"
    );
    await usernameField.type(userName);
    const filterbutton = await page.waitForSelector(
      "input.Button[value='Filter']"
    );
    filterbutton.click();
    const checkAllBox = await page.waitForSelector(
      "input[name='SelectAllCheckBox']"
    );
    checkAllBox.click();
    const removeButton = await page.waitForSelector(
      "input#ctl00_ctl00_ContentPlaceHolder1_contentSection_btnRemove"
    );
    removeButton.click();
  } catch {}
};

eb.removeUsersFromProjects = async function removeUsersFromProjects({
  cookies,
  environment,
  userId,
  projects,
}) {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.setCookie(...cookies);
  await page.goto(
    `https://${environment}.${baseurl}/da2/Setup/Admin/Users/ManageMemberships.aspx?UserID={${userId}}`
  );

  try {
    const projectSelector = await page.waitForSelector(
      "#ctl00_ctl00_ContentPlaceHolder1_contentSection_lbxSelectedProjects"
    );
    await delay(5000);
    await page.select(
      "#ctl00_ctl00_ContentPlaceHolder1_contentSection_lbxSelectedProjects",
      "{32768229-F4A7-4F14-8FB5-47473D110F8D}", "{3FE50AEA-F5E0-420A-A2C6-F2CBAFAAB8F2}", "{98AD1EF2-496B-4867-8308-02795A68D957}", "{34F7EB29-40DD-456E-8489-E52166157580}", "{593B7DB5-ED39-4DC4-97F5-12BE4F07707C}", "{C2D7EA97-D4EF-4A86-88EC-C3ACF7F28D0D}", "{F6A81420-44DC-4CF0-9631-F0E099B27694}", "{BE0BED1B-7E01-47E0-AFF6-B4704D573F60}", "{E488AFE7-001D-4355-B7EE-29190E3DE121}", "{933937C9-2A16-46FD-A0A4-F884F443344A}", "{A79E62EA-7642-430E-97C0-C98E01A9EB31}", "{000E0CDE-3FEB-4643-8FBC-942A5F314CE4}", "{9FDEC9C5-D75A-4318-8A2F-93783A0F6313}", "{5B396B97-F656-4C91-BB8F-C69338D2A056}", "{5CC7A7D1-22C6-4E01-B905-EF3DE93A99A3}", "{FB4712F4-F3EC-4E86-9618-C3DA89D88E43}", "{086B089D-580A-4EF1-8294-5251D368107F}", "{A4698A71-9DC3-4256-842D-90F0CB74AFC2}", "{E68CC95D-33A0-4D30-B5BD-9A80A3698875}", "{9D8A81BC-0E95-4021-82DC-DF8C02076FEA}", "{CD76CB14-A608-4E0E-8435-34D63488DDD0}", "{424529FD-BB0C-40DB-B785-D1F600CDB0E4}", "{4DD034A0-2999-4A71-B60E-3C7C24006221}", "{A72958FF-D9AB-406C-9791-0007D7B4A87A}", "{09A29EC4-DD2D-492C-B922-10707FB05D0E}", "{BACF53E9-C661-422E-B9EC-CB59031554B5}", "{14B6D320-BE7D-4719-B732-FA94E8913ABF}", "{A5E05F51-5453-4476-A417-BA310D17A495}", "{8D9F76EE-BAD3-4D56-9DE0-2350E9E66331}", "{835F10C1-C4C5-4B11-8663-A92560840078}", "{3DC2F361-9CD8-4AAE-8F15-2332B4AA4246}", "{A0B8608E-464B-4D32-8DA1-918CD03F8437}", "{6D086041-9956-452D-A233-F6E9B8992699}", "{23993D55-1F4A-4818-9ACF-66EBCB37AB70}", "{325670D4-7638-4086-B605-D5F6F53F9E9A}", "{DBC48144-0544-406C-9914-E8B849633FBC}", "{D2527BD7-9BF1-475E-B126-A0887700620C}", "{9F90E709-FC87-4874-AFD0-A1C5A70985F0}", "{6369FB3E-F296-4ABE-A19A-A2DB055E6230}", "{A3325DA0-01A5-4DAF-8C0E-D41A677EA08B}", "{558C8B96-CA72-4E1F-829B-4BFB181FF26F}", "{A06F68CE-F7E3-426C-827F-B82C94B1C252}", "{72EB3E10-AD6B-41BC-AE13-66DD15E7743B}", "{89ED3B6F-C588-433E-8775-AF7D2B5816B2}", "{73E37E76-A33F-427D-9D6F-7C77CC4A3EA4}", "{D06D4109-7F04-406B-9BCB-C8D4FAF705E6}", "{DC4805CE-8632-4D03-8EEF-62EFB618121F}", "{7060C053-93AF-4B3E-A4EA-D81F89741D2C}", "{35CBB0CA-7DB5-462D-A0E4-356C1F0A5893}", "{31FE8ED8-6841-41B0-BC5B-3133BA1144F5}", "{9DB9AEB6-6719-45E7-A08E-3147A6499AC4}", "{CDDE049D-7DCC-4971-84EE-E2C3CA95A2E8}", "{4CA5F958-A8AE-4458-933D-978DDF0DAEAD}", "{205AB920-A6D4-4E83-A3FD-9798390FCA64}", "{93902AA1-98BD-4F47-95DC-9FBD21D4DF39}", "{8D063608-EC3A-4A1A-9FA4-68AB5AEB7F1D}", "{C0E80A31-56CF-43D3-8251-B3CAB3A10811}", "{0CFB292F-1E62-4158-8894-3AD2519D968F}", "{112D389C-E5AC-42E4-981C-95E348111FB9}", "{1E1F5463-C260-4713-B1AB-EEE1696E8C2A}", "{79B024E1-CFDB-47F8-85CD-39DA255BCF58}", "{D3FB03AB-7484-4114-8BDF-2F66BB0DC25D}", "{3F019AB6-A161-4798-AE09-28661941AB68}", "{6884E30B-55C1-4A44-A5A8-B99A66C8BD04}", "{C8E77952-039D-4A3C-B9A9-7F92B7949735}", "{1AB79AF6-276A-4492-B830-B1485AB5360B}", "{16E8BFDA-FC5A-4388-8FC8-45F66A6E1314}", "{AA392581-D5C0-495C-BB8B-5890E82331DF}", "{C3661A72-5FA5-47F7-A7F4-99B454CBEB61}", "{76C5A6AE-1038-4475-9C85-D225E791CE3A}", "{A181E51C-B3B9-436C-AEF8-59176613C8B0}", "{41080854-0EB9-4319-B095-C493A9467E5B}", "{A5A998C9-D1B8-42E1-AE3C-9F385697419F}", "{14D983EB-454C-4674-BB61-210A6CD163CD}", "{D3863315-4BDF-4FCA-8616-20D9967D32EA}", "{AC617593-C0D8-4F22-B370-FEA1497CAF99}", "{147B7FD3-0D33-49D3-8015-CE44B8F17D20}", "{F941246E-96D9-42FB-91B0-8D73B073D532}", "{EC485190-ADBA-48C1-94CB-9179FC5A57E2}", "{93846C2A-78D8-44D3-8F9E-8C39462865C1}", "{3F496D2C-1A3E-446F-9711-5D22CD82FFB3}", "{6D046BB3-296A-46E2-A695-F47602DBE411}", "{12C9F67F-0C37-4D42-A7D5-532DF34C97BC}", "{3D1DF7C7-B539-4BE3-A76C-26331239D6DD}", "{C23FD4B2-C45D-4770-9805-214F95BB2E2C}", "{C73D421D-A7CF-4938-B3EA-669AA5CA0483}", "{FAC134F3-CA09-4FB6-9280-2BA68CFAAF5D}", "{0EFCB080-64F7-4C23-A334-8FDCF3B054D7}", "{30C57A16-E687-4657-AA03-0D7B29AD4611}", "{B0184E09-842C-4EC9-B7F0-05891E7E7427}", "{E7B3A38F-C7F1-49FA-B4B5-C2C64285B82A}", "{CB46F089-F90C-4616-BE91-390FE3E16CE1}", "{66038253-76D5-444C-AA10-7086F8EF6CAB}", "{98A86C17-DC7E-4494-9962-0A552205BB98}", "{82B875BC-C72F-422B-BDCE-0AEE2E021CA9}", "{D80FAD30-6884-46C7-87BB-179ECB0AB934}", "{0782F4E6-B33E-4648-AFA1-E28B729BAB7B}", "{A951631B-E38A-47BC-B967-8D5302735E47}", "{9448BD83-7E3C-4580-8235-96752A3CDA83}", "{1206FB74-02D5-44A8-9689-48C070B35BFA}", "{6C38FADC-26AD-4955-8457-5EBF30AB1A24}", "{3374360D-E2D7-4FE6-86B6-57AF26547317}", "{E386AD15-C686-4D27-B744-1025C651E20F}", "{1F6B6D0C-A266-412E-A8D7-066BEDCFA23D}", "{22EFA1FE-4011-4D15-BC19-63B42A901402}", "{E2A8F767-36C1-43F6-878F-056402D18C0C}", "{5070FFA8-6231-4475-A983-80902B777108}", "{729DE1D4-3628-4122-86F6-798190D4C5A7}", "{B016F615-8BCC-479C-86E0-C3FD73E97337}", "{A8060592-D7D7-41BE-A474-6975628150C6}", "{53172BF9-E6CD-40F4-95B0-085746ED7D32}", "{A050C015-BF2F-4FD0-ABF3-7406EEC42541}", "{76F58818-05E8-46B5-940F-F104169DEB46}", "{82269AA0-252C-4FFC-AF60-FA93CADE90DC}", "{F99290A3-8BA7-4B20-B043-D95CE30ADAA0}", "{9082EB1C-67D2-490B-951A-0591E422BF83}", "{93EBF00E-1828-4F09-BBA2-AFE5E515EC2F}", "{C7E150E9-FBF8-4DEE-9286-05154D02E70B}", "{91B13EE6-202C-4885-940D-E143AC4E455A}", "{6B853E2B-A073-44DA-B879-1E0080B4FAA2}", "{E80792B1-028B-415B-8F8A-8E58CE313774}"
    );
    await delay(10000);
    const removeProjectButton = await page.$(
      "#ctl00_ctl00_ContentPlaceHolder1_contentSection_btnRemoveProject"
    );
    await removeProjectButton.click();
    await delay(10000);
  } catch (error) {}
  browser.close();
};

function delay(t, val) {
  return new Promise((res) => {
    setTimeout(() => {
      res(val);
    }, t);
  });
}

export default eb;
