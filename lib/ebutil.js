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

  let usernameField = null;

  try {
    usernameField = await page.waitForSelector("#Username");
  } catch (error) {
    console.error(error);
    return "Error loading login page.";
  }
  const passwordField = await page.$("#Password");
  const loginButton = await page.$("input[type=submit]");
  await usernameField.type(username);
  await passwordField.type(password);
  await loginButton.click();

  if (account !== null) {
    try {
      const accountSelector = await page.waitForSelector(
        "select[name=selAccount]"
      );
      await accountSelector.select(account);
    } catch (error) {
      console.error(`Error loading account selector: ${error}`);
    }
  }
  try {
    await page.waitForSelector(".tabs");
    console.log("Home page loaded?");
  } catch (error) {
    console.error(`Error loading home page: ${error}`);
  }
};

eb.logout = async function logout({ page, environment }) {
  try {
    await page.goto(`https://${environment}.${baseurl}/Login/Logout.aspx`);
  } catch (error) {
    console.error(`Error logging out: ${error}`);
  }
};

eb.deleteBudgetItem = async function deleteBudgetItem({
  page,
  environment,
  itemId,
  budgetId,
  portalId,
}) {
  // const page = await browser.newPage();
  await page.goto(
    `https://${environment}.${baseurl}/da2/Cost/Budgets/LineItemDetails.aspx?Mode=Edit&PortalID=${portalId}&BudgetLineItemID=${itemId}&BudgetID=${budgetId}`
  );

  try {
    const deleteButton = await page.waitForSelector(
      "input.Button[value=Delete]",
      {
        timeout: 1000,
      }
    );
    await deleteButton.click();
    const confirmButton = await page.waitForSelector(
      "input.Button[value='Yes, Delete the Line Item']"
    );
    // confirmButton.click();
  } catch (error) {
    console.error("Error: can't find delete button.");
  }

  // page.close();
};

export default eb;
