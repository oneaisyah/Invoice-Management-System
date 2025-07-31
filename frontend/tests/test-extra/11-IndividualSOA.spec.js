const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function navigateToLogin(driver) {
  await driver.get("http://localhost:3000/login");
  await driver.manage().window().setRect({ width: 1382, height: 744 });
  await driver.sleep(2000);
  await driver.findElement(By.name("username")).click();
  await driver.findElement(By.name("username")).sendKeys("seand");
  await driver.findElement(By.name("password")).click();
  await driver.findElement(By.name("password")).sendKeys("123");
  await driver.findElement(By.name("rememberMeLogin")).click();
  await driver.findElement(By.id(":r2:")).click();
}

async function navigateToIndividualSOA(driver) {
  await driver.findElement(By.css(".soa-table .MuiDataGrid-row:nth-child(1) > .MuiDataGrid-cell:nth-child(1) > .MuiDataGrid-cellContent")).click();
  await driver.wait(until.elementLocated(By.id('soa-title')), 10000);
}

describe('Individual Statement of Account (SOA)', function() {
  this.timeout(30000);
  let driver;

  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    await navigateToLogin(driver);
    await driver.wait(until.urlIs('http://localhost:3000/dashboard/app'), 5000);
    await driver.wait(until.elementLocated(By.css('.soa-table')), 10000);
    await navigateToIndividualSOA(driver);
  });

  afterEach(async function() {
    await driver.quit();
  });

  it('can view the associated invoices attached to the soa', async function() {
    // Click on a specific element within the row
    await driver.findElement(By.css(".MuiDataGrid-row:nth-child(1) .go2534082608")).click();

    await driver.wait(until.urlContains("invoice"), 10000);
    await driver.wait(until.elementLocated(By.id("invoice-title")), 10000);

    const invoiceId = await driver.findElement(By.id("invoice-title")).getText();
    const expectedText = "Invoice ID"
    assert.strictEqual(invoiceId.includes(expectedText), true);
  });
  it('exports to csv', async function() {
    await driver.wait(until.elementLocated(By.id('export-soa-button')), 10000);
    await driver.findElement(By.id('export-soa-button')).click();

    const toast = await driver.wait(until.elementLocated(By.css(".export-soa-success-toast")), 10000);
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Statement of Account exported successfully! Look at your Downloads.');
  })
  it('deletes soa', async function() {
    await driver.wait(until.elementLocated(By.id('delete-soa-button')), 10000);
    await driver.findElement(By.id('delete-soa-button')).click();

    const toast = await driver.wait(until.elementLocated(By.css(".delete-soa-success-toast")), 10000);
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Statement of Account deleted successfully!');

    await driver.wait(until.urlIs('http://localhost:3000/dashboard/app'), 5000);
    assert.strictEqual(await driver.getCurrentUrl(), 'http://localhost:3000/dashboard/app');
  })
});
