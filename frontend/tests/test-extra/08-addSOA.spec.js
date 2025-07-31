const { Builder, By, Key, until } = require('selenium-webdriver');
const path = require('path');
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

async function navigateToAddSOA(driver) {
    await driver.findElement(By.css(".MuiButtonBase-root:nth-child(3) > .MuiListItemText-root")).click()
}

async function inputReferenceNumber(driver) {
    await driver.findElement(By.name("referenceNumber")).click()
    await driver.findElement(By.name("referenceNumber")).sendKeys("123456789")
}

async function inputSupplier(driver) {
    const supplier = "Test Supplier"
    await driver.findElement(By.id("choose-supplier-button")).click()
    await driver.findElement(By.name("supplierName")).click()

    await driver.findElement(By.name("supplierName")).click()
    await driver.findElement(By.name("supplierName")).sendKeys(supplier)
    await driver.sleep(2000)

    await driver.executeScript("window.scrollBy(0, 100)")
    await driver.findElement(By.css(".supplier-table > .MuiDataGrid-row:nth-child(1) > .MuiDataGrid-cellContent")).click()

    const button = await driver.findElement(By.id("confirm-add-supplier-button"))
    await driver.executeScript("arguments[0].scrollIntoView();", button);
    await button.click()

    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    const expectedAlert = "Chose supplier"
    assert.ok(alertText.includes(expectedAlert))
    await alert.accept()
    await driver.switchTo().defaultContent()
}

async function inputPayment(driver) {
    const paymentRecipientName = "Test Recipient"
    await driver.executeScript("window.scrollBy(0, 100)")
    await driver.findElement(By.id('add-cancel-payment-button')).click()
    await driver.findElement(By.name('payment-recipient-name')).click()
    await driver.findElement(By.name('payment-recipient-name')).sendKeys(paymentRecipientName)
    await driver.sleep(2000)

    const tableRow = await driver.findElement(By.css(".payment-table > .MuiDataGrid-cell:nth-child(1) > .MuiDataGrid-cellContent"))
    await driver.executeScript("arguments[0].scrollIntoView();", tableRow);
    await tableRow.click()

    const button = await driver.findElement(By.id('add-payment-button'))
    await driver.executeScript("arguments[0].scrollIntoView();", button);
    await button.click()

    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    const expectedAlert = "Added payment"
    assert.ok(alertText.includes(expectedAlert))
    await alert.accept()
    await driver.switchTo().defaultContent()

    await driver.findElement(By.id('add-cancel-payment-button')).click()
}

async function inputInvoice(driver) {
    const invoiceID = "0000001"
    await driver.executeScript("window.scrollBy(0, 100)")
    await driver.findElement(By.id('add-cancel-invoice-button')).click()
    await driver.findElement(By.name('invoiceIDSearch')).click()
    await driver.findElement(By.name('invoiceIDSearch')).sendKeys(invoiceID)
    await driver.sleep(2000)

    await driver.findElement(By.css(".invoice-table > .MuiDataGrid-cell:nth-child(1) > .MuiDataGrid-cellContent")).click()
    await driver.findElement(By.id('add-invoice-button')).click()

    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    const expectedAlert = "Added invoice"
    assert.ok(alertText.includes(expectedAlert))
    await alert.accept()
    await driver.switchTo().defaultContent()

    await driver.findElement(By.id('add-cancel-invoice-button')).click()
}

async function inputDateIssued(driver) {
    const date = "01022021"

    await driver.findElement(By.name('dateIssued')).click()
    await driver.findElement(By.name('dateIssued')).sendKeys(date)
}

async function inputDateDue(driver) {
    const date = "01032021"

    await driver.findElement(By.name('dateDue')).click()
    await driver.findElement(By.name('dateDue')).sendKeys(date)
}

async function inputAmountOutstanding(driver) {
    const amount = "43.20"

    await driver.findElement(By.name('amountOutstanding')).click()
    await driver.findElement(By.name('amountOutstanding')).sendKeys(amount)
}

async function inputAmountPaid(driver) {
  const amount = "0"

  await driver.findElement(By.name('amountPaid')).click()
  await driver.findElement(By.name('amountPaid')).sendKeys(amount)
}

async function inputAmountOverdue(driver) {
  const amount = "0"

  await driver.findElement(By.name('amountOverdue')).click()
  await driver.findElement(By.name('amountOverdue')).sendKeys(amount)
}

describe('Add Statement of Account (SOA)', function() {
  this.timeout(30000);
  let driver;

  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    await navigateToLogin(driver);
    await driver.wait(until.urlIs('http://localhost:3000/dashboard/app'), 5000);
    await navigateToAddSOA(driver);
    await driver.wait(until.urlIs('http://localhost:3000/dashboard/add-soa'), 5000);
    // select file
    await driver.wait(until.elementLocated(By.id('file-uploader')), 30000);
    const fileInput = await driver.findElement(By.css('#file-uploader > input'))
    const filePath = path.join(__dirname, 'ANG_LEONG_HUAT_SOA_1.pdf');
    fileInput.sendKeys(filePath);

    // process file
    await driver.findElement(By.id('store-file-button')).click();
    await driver.executeScript('window.scrollTo(0, 0);')
  });

  afterEach(async function() {
    await driver.sleep(2000)
    await driver.quit();
  });
  it('should add SOA', async function() {
    await driver.sleep(1000)
    await inputReferenceNumber(driver)
    await driver.sleep(1000)
    await inputSupplier(driver)
    await driver.sleep(1000)
    await inputPayment(driver)
    await driver.sleep(1000)
    await inputInvoice(driver)
    await driver.sleep(1000)
    await inputDateIssued(driver)
    await driver.sleep(1000)
    await inputDateDue(driver)
    await driver.sleep(1000)
    await inputAmountOutstanding(driver)
    await driver.sleep(1000)
    await inputAmountPaid(driver)
    await driver.sleep(1000)
    await inputAmountOverdue(driver)
    await driver.sleep(7000)
  })
});
