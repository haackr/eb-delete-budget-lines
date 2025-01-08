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

eb.isLoggedIn = async function isLoggedIn({
  page,
  environment
}) {
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
}

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

  if (account !== null) {
    try {
      const accountSelector = await page.waitForSelector(
        "#mwc_id_1_select"
      );
      await accountSelector.select(account);
      const continueButton = await page.waitForSelector("#continueBtn > .spinner-button-container");
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
      {timeout: 10000}
    );
    // console.locd debg(confirmButton);
    await confirmButton.click();
    await page.waitForNavigation();
    console.log(`${itemId} - ${projectName} - ${accountCode} - DELETED`)
  } catch (error) {
    console.error(`Error deleting line ${itemId} - ${projectName} - ${accountCode}: ${error}`);
  }
  // await page.goto(`https://${environment}.${baseurl}/`)
  // const newCookies =  await page.cookies();
  browser.close();
  return newCookies;
};

eb.deleteUser = async function deleteUser({
  cookies,
  environment,
  userName
}) {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  page.setCookie(...cookies);

  await page.goto(`https://${environment}.${baseurl}/da2/Setup/Admin/Users/ManageUsers.aspx`);
  try {
    const userNameField = await page.waitForSelector("input#ctl00_ctl00_ContentPlaceHolder1_contentSection_txtUserName");
    await usernameField.type(userName);
    const filterbutton = await page.waitForSelector("input.Button[value='Filter']")
    filterbutton.click();
    const checkAllBox = await page.waitForSelector("input[name='SelectAllCheckBox']")
    checkAllBox.click();
    const removeButton = await page.waitForSelector("input#ctl00_ctl00_ContentPlaceHolder1_contentSection_btnRemove")
    removeButton.click();

  } catch {

  }
}

export default eb;
