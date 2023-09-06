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

eb.login = async function login({
  page,
  username,
  password,
  environment,
  account,
}) {
  await page.goto(`https://${environment}.${baseurl}/`);

  const usernameField = await page.waitForSelector("#Username");
  const passwordField = await page.waitForSelector("#Password");
  const loginButton = await page.waitForSelector("input[type=submit]");
  await usernameField.type(username);
  await passwordField.type(password);
  await loginButton.click();

  if (account !== null) {
    const accountSelector = await page.waitForSelector(
      "select[name=selAccount]"
    );
    // console.log(accountSelector);
    await accountSelector.select(account);
  }

  await page.waitForSelector(".tabs");
  console.log("Home page loaded?");
};

eb.logout = async function logout({ page, environment }) {
  await page.goto(`https://${environment}.${baseurl}/Login/Logout.aspx`);
};

eb.deleteBudgetItem = async function deleteBudgetItem({
  browser,
  environment,
  itemId,
  budgetId,
  portalId,
}) {
  const page = await browser.newPage();
  await page.goto(
    `https://${environment}.${baseurl}/da2/Cost/Budgets/LineItemDetails.aspx?Mode=Edit&PortalID=${portalId}&BudgetLineItemID=${itemId}}&BudgetID=${budgetId}`
  );
  // const deleteButton = await page.waitForSelector("input.button[value=Delete]");
  deleteButton.click();
};

export default eb;
