const { Builder, By, Key, until } = require('selenium-webdriver');
const path = require('path');
const assert = require('assert');

async function navigateToLogin(driver) {
  await driver.get("http://localhost:3000/login")
  await driver.manage().window().setRect({ width: 1382, height: 744 })
  await driver.sleep(2000);
  await driver.findElement(By.name("username")).click()
  await driver.findElement(By.name("username")).sendKeys("seand")
  await driver.findElement(By.name("password")).click()
  await driver.findElement(By.name("password")).sendKeys("123")
  await driver.findElement(By.name("rememberMeLogin")).click()
  await driver.findElement(By.id(":r2:")).click()
}

async function navigateToAddInvoice(driver) {
  await driver.findElement(By.css(".MuiButtonBase-root:nth-child(2) > .MuiListItemText-root")).click()
}

describe('Upload File', function () {
  this.timeout(150000)
  let driver
  let vars
  beforeEach(async function () {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
    await navigateToLogin(driver)
    await driver.wait(until.urlIs('http://localhost:3000/dashboard/app'), 5000);
    await driver.sleep(1000);
    await navigateToAddInvoice(driver)
    await driver.wait(until.urlIs('http://localhost:3000/dashboard/add-invoice'), 5000);
  })
  afterEach(async function () {
    await driver.sleep(2000)
    await driver.quit();
  })
  it('uploads pdf file', async function () {
    // select pdf file
    await driver.wait(until.elementLocated(By.id('file-uploader')), 30000);
    const fileInput = await driver.findElement(By.css('#file-uploader > input'))
    const filePath = path.join(__dirname, 'ANG_LEONG_HUAT1_INVOICE2.pdf');
    fileInput.sendKeys(filePath);

    // process file
    await driver.findElement(By.id('process-file-button')).click();

    // store file button will render when processing is done
    await driver.wait(until.elementLocated(By.id('store-file-button')), 30000);
    await driver.findElement(By.id('store-file-button')).click();
    await driver.wait(until.elementLocated(By.linkText("Download stored image")), 30000);
    assert(await driver.findElement(By.linkText("Download stored image")).isDisplayed());
  })

  // it('does not upload file with invalid extension', async function () {
  //   // select invalid file
  //   await driver.wait(until.elementLocated(By.id('file-uploader')), 30000);
  //   const fileInput = await driver.findElement(By.css('#file-uploader > input'))
  //   const filePath = path.join(__dirname, 'login.spec.js');
  //   fileInput.sendKeys(filePath);

  //   // process file
  //   await driver.findElement(By.id('process-file-button')).click();

  //   // failure toast should be shown
  //   const toast = await driver.wait(until.elementLocated(By.css(".process-image-failure-toast")), 10000);
  //   await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
  //   assert.strictEqual(await toast.getText(), 'File type must be pdf');
  // })

})