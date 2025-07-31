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

async function inputInvoiceID(driver, invoiceID) {
  await driver.findElement(By.css("[data-testid='invoice-id-input']")).click()
  await driver.findElement(By.css("[data-testid='invoice-id-input']")).sendKeys(invoiceID)
}

async function inputSupplier(driver, supplier) {
  await driver.wait(until.elementLocated(By.css(".supplier-autocomplete")), 5000);
  await driver.findElement(By.css(".supplier-autocomplete")).click()
  await driver.findElement(By.name("supplier-input")).sendKeys(supplier)
  await driver.wait(until.elementLocated(By.css('.MuiAutocomplete-popper')), 5000)
  const suggestedSupplier = await driver.findElement(By.xpath("//li[contains(text(), supplier)]"))
  await suggestedSupplier.click()
}

async function inputItemTable(driver, product, price, quantity) {
  await driver.wait(until.elementLocated(By.css(".invoice-item-table")), 5000)
  await driver.wait(until.elementLocated(By.css(".product-autocomplete")), 5000)
  await driver.findElement(By.css(".product-autocomplete")).click()
  await driver.findElement(By.name("product-name-input")).sendKeys(product)
  await driver.wait(until.elementLocated(By.css('.MuiAutocomplete-popper')), 5000)
  const suggestedProduct = await driver.findElement(By.xpath("//li[contains(text(), product)]"))
  await suggestedProduct.click()
  await driver.findElement(By.name("price")).click()
  await driver.findElement(By.name("price")).sendKeys(price)
  await driver.findElement(By.name("quantity")).click()
  await driver.findElement(By.name("quantity")).sendKeys(quantity)
  await driver.findElement(By.id("add-product-button")).click()
}

async function inputItemTableIncomplete(driver, product, price) {
  await driver.wait(until.elementLocated(By.css(".invoice-item-table")), 5000)
  await driver.wait(until.elementLocated(By.css(".product-autocomplete")), 5000)
  await driver.findElement(By.css(".product-autocomplete")).click()
  await driver.findElement(By.name("product-name-input")).sendKeys(product)
  await driver.wait(until.elementLocated(By.css('.MuiAutocomplete-popper')), 5000)
  const suggestedProduct = await driver.findElement(By.xpath("//li[contains(text(), product)]"))
  await suggestedProduct.click()
  await driver.findElement(By.name("price")).click()
  await driver.findElement(By.name("price")).sendKeys(price)
  await driver.findElement(By.id("add-product-button")).click()
}

async function inputDateOfPurchase(driver, dateOfPurchase) {
  await driver.findElement(By.css("[data-testid='date-of-purchase-input']")).click()
  await driver.findElement(By.css("[data-testid='date-of-purchase-input']")).sendKeys(dateOfPurchase)
}

async function inputPaymentType(driver, paymentType) {
  await driver.findElement(By.css(".payment-type-autocomplete")).click()
  await driver.findElement(By.name("payment-type-input")).sendKeys(paymentType)
  await driver.wait(until.elementLocated(By.css('.MuiAutocomplete-popper')), 5000)
  await driver.sleep(1000)
  const suggestedPaymentType = await driver.findElement(By.xpath("//li[contains(text(), paymentType)]"))
  await suggestedPaymentType.click()
}

async function inputTotalPriceBeforeGST(driver, totalPriceBeforeGST) {
  await driver.findElement(By.css("[data-testid='total-price-before-gst-input']")).click()
  await driver.findElement(By.css("[data-testid='total-price-before-gst-input']")).sendKeys(totalPriceBeforeGST)
}

async function inputTotalPriceAfterGST(driver, totalPriceAfterGST) {
  await driver.findElement(By.css("[data-testid='total-price-after-gst-input']")).click()
  await driver.findElement(By.css("[data-testid='total-price-after-gst-input']")).sendKeys(totalPriceAfterGST)
}

describe('Add Invoice', function () {
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
    // select file
    await driver.wait(until.elementLocated(By.id('file-uploader')), 30000);
    const fileInput = await driver.findElement(By.css('#file-uploader > input'))
    const filePath = path.join(__dirname, 'TEST_INVOICE.pdf');
    fileInput.sendKeys(filePath);

    // process file
    await driver.findElement(By.id('process-file-button')).click();
  })
  afterEach(async function () {
    await driver.sleep(2000);
    await driver.quit();
  })
  it('creates new supplier', async function () {
    const supplierName = "Test Supplier 1"
    const supplierAddress = "Test Address 1"
    const supplierUEN = "000000001C"

    await driver.executeScript('window.scrollTo(0, 0);')
    await driver.wait(until.elementLocated(By.id('new-supplier-button')), 10000);
    await driver.findElement(By.id('new-supplier-button')).click()

    await driver.wait(until.elementLocated(By.name("supplier-name")), 10000);
    await driver.findElement(By.name("supplier-name")).click()
    await driver.findElement(By.name("supplier-name")).sendKeys(supplierName)
    await driver.findElement(By.name("supplier-address")).click()
    await driver.findElement(By.name("supplier-address")).sendKeys(supplierAddress)
    await driver.findElement(By.name("supplier-uen")).click()
    await driver.findElement(By.name("supplier-uen")).sendKeys(supplierUEN)  // MUST CHANGE ON EVERY TEST RUN

    await driver.findElement(By.id('create-supplier-button')).click()

    const toast = await driver.wait(until.elementLocated(By.css(".add-supplier-success-toast")), 10000);
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Supplier added successfully!');
  })
  it('creates new product', async function () {
    const productName = "Test Product 1"
    const productUPC = "000000000002"
    await driver.wait(until.elementLocated(By.id('new-product-button')), 10000)
    await driver.findElement(By.id('new-product-button')).click()

    await driver.wait(until.elementLocated(By.name("product-name")), 10000);
    await driver.findElement(By.name("product-name")).click()
    await driver.findElement(By.name("product-name")).sendKeys(productName)

    await driver.findElement(By.name("product-upc")).click()
    await driver.findElement(By.name("product-upc")).sendKeys(productUPC)  // MUST CHNAGE ON EVERY TEST RUN

    await driver.findElement(By.id('create-product-button')).click()

    const toast = await driver.wait(until.elementLocated(By.css(".add-product-success-toast")), 10000);
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Product added successfully!');
  })
  it('adds invoice with Invoice ID, existing supplier, filled product table, valid date of purchase, existing payment type, valid total price before and after gst and image link', async function () {
    // store file button will render when processing is done
    await driver.wait(until.elementLocated(By.id('store-file-button')), 30000);
    await driver.findElement(By.id('store-file-button')).click();

    // fill in invoice details
    const invoiceID = "0000001"
    const supplier = "Test Supplier"
    const product1 = "Test Product"
    const price1 = "4"
    const quantity1 = "10"
    const dateOfPurchase = "01012021"
    const paymentType = "paynow"
    const totalPriceBeforeGST = "40"
    const totalPriceAfterGST = "43.2"
    await driver.executeScript('window.scrollTo(0, 0);');

    await inputInvoiceID(driver, invoiceID)

    await inputSupplier(driver, supplier)

    await inputItemTable(driver, product1, price1, quantity1)
    await driver.wait(until.elementLocated(By.css(".add-item-success-toast")), 10000);

    await inputDateOfPurchase(driver, dateOfPurchase)

    await inputPaymentType(driver, paymentType)

    await inputTotalPriceBeforeGST(driver, totalPriceBeforeGST)

    await inputTotalPriceAfterGST(driver, totalPriceAfterGST)

    await driver.findElement(By.id("invoice-submit-button")).click()
    const toast = await driver.wait(until.elementLocated(By.css(".add-invoice-success-toast")), 10000)
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Invoice added successfully!');
  })
  it('shows alert when no Invoice ID', async function () {
    // store file button will render when processing is done
    await driver.wait(until.elementLocated(By.id('store-file-button')), 30000);
    await driver.findElement(By.id('store-file-button')).click();

    // fill in invoice details
    const supplier = "Test Supplier"
    const product1 = "Test Product"
    const price1 = "4"
    const quantity1 = "10"
    const dateOfPurchase = "01012021"
    const paymentType = "paynow"
    const totalPriceBeforeGST = "40"
    const totalPriceAfterGST = "43.2"
    await driver.executeScript('window.scrollTo(0, 0);');

    await inputSupplier(driver, supplier)

    await inputItemTable(driver, product1, price1, quantity1)
    await driver.wait(until.elementLocated(By.css(".add-item-success-toast")), 10000);

    await inputDateOfPurchase(driver, dateOfPurchase)

    await inputPaymentType(driver, paymentType)

    await inputTotalPriceBeforeGST(driver, totalPriceBeforeGST)

    await inputTotalPriceAfterGST(driver, totalPriceAfterGST)

    await driver.findElement(By.id("invoice-submit-button")).click()
    const toast = await driver.wait(until.elementLocated(By.css(".add-invoice-failure-toast")), 10000)
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Please fill in all fields correctly.');
  })
  it('shows alert when no supplier', async function () {
    // store file button will render when processing is done
    await driver.wait(until.elementLocated(By.id('store-file-button')), 30000);
    await driver.findElement(By.id('store-file-button')).click();

    // fill in invoice details
    const invoiceID = "0000002"
    const product1 = "Test Product"
    const price1 = "4"
    const quantity1 = "10"
    const dateOfPurchase = "01012021"
    const paymentType = "paynow"
    const totalPriceBeforeGST = "40"
    const totalPriceAfterGST = "43.2"
    await driver.executeScript('window.scrollTo(0, 0);');

    await inputInvoiceID(driver, invoiceID)

    await inputItemTable(driver, product1, price1, quantity1)
    await driver.wait(until.elementLocated(By.css(".add-item-success-toast")), 10000);

    await inputDateOfPurchase(driver, dateOfPurchase)

    await inputPaymentType(driver, paymentType)

    await inputTotalPriceBeforeGST(driver, totalPriceBeforeGST)

    await inputTotalPriceAfterGST(driver, totalPriceAfterGST)

    await driver.findElement(By.id("invoice-submit-button")).click()
    const toast = await driver.wait(until.elementLocated(By.css(".add-invoice-failure-toast")), 10000)
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Please fill in all fields correctly.');
  })
  it('shows alert when unfilled product table', async function () {
    // store file button will render when processing is done
    await driver.wait(until.elementLocated(By.id('store-file-button')), 30000);
    await driver.findElement(By.id('store-file-button')).click();

    // fill in invoice details
    const invoiceID = "0000003"
    const supplier = "Test Supplier"
    const product1 = "Test Product"
    const price1 = "4"
    const dateOfPurchase = "01012021"
    const paymentType = "paynow"
    const totalPriceBeforeGST = "40"
    const totalPriceAfterGST = "43.2"
    await driver.executeScript('window.scrollTo(0, 0);');

    await inputInvoiceID(driver, invoiceID)

    await inputSupplier(driver, supplier)

    await inputItemTableIncomplete(driver, product1, price1)
    await driver.wait(until.elementLocated(By.css(".add-item-success-toast")), 10000);

    await inputDateOfPurchase(driver, dateOfPurchase)

    await inputPaymentType(driver, paymentType)

    await inputTotalPriceBeforeGST(driver, totalPriceBeforeGST)

    await inputTotalPriceAfterGST(driver, totalPriceAfterGST)

    await driver.findElement(By.id("invoice-submit-button")).click()
    const toast = await driver.wait(until.elementLocated(By.css(".add-invoice-failure-toast")), 10000)
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Please fill in all fields correctly.');
  })
  it('shows alert when no date of purchase', async function () {
    // store file button will render when processing is done
    await driver.wait(until.elementLocated(By.id('store-file-button')), 30000);
    await driver.findElement(By.id('store-file-button')).click();

    // fill in invoice details
    const invoiceID = "0000004"
    const supplier = "Test Supplier"
    const product1 = "Test Product"
    const price1 = "4"
    const quantity1 = "10"
    const paymentType = "paynow"
    const totalPriceBeforeGST = "40"
    const totalPriceAfterGST = "43.2"
    await driver.executeScript('window.scrollTo(0, 0);');

    await inputInvoiceID(driver, invoiceID)

    await inputSupplier(driver, supplier)

    await inputItemTable(driver, product1, price1, quantity1)
    await driver.wait(until.elementLocated(By.css(".add-item-success-toast")), 10000);

    await inputPaymentType(driver, paymentType)

    await inputTotalPriceBeforeGST(driver, totalPriceBeforeGST)

    await inputTotalPriceAfterGST(driver, totalPriceAfterGST)

    await driver.findElement(By.id("invoice-submit-button")).click()
    const toast = await driver.wait(until.elementLocated(By.css(".add-invoice-failure-toast")), 10000)
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Please fill in all fields correctly.');
  })
  it('shows alert when no total price before gst', async function () {
    // store file button will render when processing is done
    await driver.wait(until.elementLocated(By.id('store-file-button')), 30000);
    await driver.findElement(By.id('store-file-button')).click();

    // fill in invoice details
    const invoiceID = "0000005"
    const supplier = "Test Supplier"
    const product1 = "Test Product"
    const price1 = "4"
    const quantity1 = "10"
    const dateOfPurchase = "01012021"
    const paymentType = "paynow"
    const totalPriceAfterGST = "43.2"
    await driver.executeScript('window.scrollTo(0, 0);');

    await inputInvoiceID(driver, invoiceID)

    await inputSupplier(driver, supplier)

    await inputItemTable(driver, product1, price1, quantity1)
    await driver.wait(until.elementLocated(By.css(".add-item-success-toast")), 10000);

    await inputDateOfPurchase(driver, dateOfPurchase)
    await driver.executeScript('window.scrollBy(0, 100);');

    await inputPaymentType(driver, paymentType)

    await inputTotalPriceAfterGST(driver, totalPriceAfterGST)

    await driver.findElement(By.id("invoice-submit-button")).click()
    const toast = await driver.wait(until.elementLocated(By.css(".add-invoice-failure-toast")), 10000)
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Please fill in all fields correctly.');
  })
  it('shows alert when no total price after gst', async function () {
    // store file button will render when processing is done
    await driver.wait(until.elementLocated(By.id('store-file-button')), 30000);
    await driver.findElement(By.id('store-file-button')).click();

    // fill in invoice details
    const invoiceID = "0000006"
    const supplier = "Test Supplier"
    const product1 = "Test Product"
    const price1 = "4"
    const quantity1 = "10"
    const dateOfPurchase = "01012021"
    const paymentType = "paynow"
    const totalPriceBeforeGST = "40"
    await driver.executeScript('window.scrollTo(0, 0);');

    await inputInvoiceID(driver, invoiceID)

    await inputSupplier(driver, supplier)

    await inputItemTable(driver, product1, price1, quantity1)
    await driver.wait(until.elementLocated(By.css(".add-item-success-toast")), 10000);

    await inputDateOfPurchase(driver, dateOfPurchase)

    await inputPaymentType(driver, paymentType)

    await inputTotalPriceBeforeGST(driver, totalPriceBeforeGST)

    await driver.findElement(By.id("invoice-submit-button")).click()
    const toast = await driver.wait(until.elementLocated(By.css(".add-invoice-failure-toast")), 10000)
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Please fill in all fields correctly.');
  })
  it('shows alert when sum of product price * quantity is not equal to total price before gst or total price after gst', async function () {
    // store file button will render when processing is done
    await driver.wait(until.elementLocated(By.id('store-file-button')), 30000);
    await driver.findElement(By.id('store-file-button')).click();

    // fill in invoice details
    const invoiceID = "0000007"
    const supplier = "Test Supplier"
    const product1 = "Test Product"
    const price1 = "4"
    const quantity1 = "9"
    const dateOfPurchase = "01012021"
    const paymentType = "paynow"
    const totalPriceBeforeGST = "40"
    const totalPriceAfterGST = "43.2"
    await driver.executeScript('window.scrollTo(0, 0);');

    await inputInvoiceID(driver, invoiceID)

    await inputSupplier(driver, supplier)

    await inputItemTable(driver, product1, price1, quantity1)
    await driver.wait(until.elementLocated(By.css(".add-item-success-toast")), 10000);

    await inputDateOfPurchase(driver, dateOfPurchase)

    await inputPaymentType(driver, paymentType)

    await inputTotalPriceBeforeGST(driver, totalPriceBeforeGST)

    await inputTotalPriceAfterGST(driver, totalPriceAfterGST)

    await driver.findElement(By.id("invoice-submit-button")).click()
    const toast = await driver.wait(until.elementLocated(By.css(".add-invoice-failure-toast")), 10000)
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Please fill in all fields correctly.');
  })
  it('shows alert when total price after gst is not more than total price before gst', async function () {
    // store file button will render when processing is done
    await driver.wait(until.elementLocated(By.id('store-file-button')), 30000);
    await driver.findElement(By.id('store-file-button')).click();

    // fill in invoice details
    const invoiceID = "0000008"
    const supplier = "Test Supplier"
    const product1 = "Test Product"
    const price1 = "4"
    const quantity1 = "10"
    const dateOfPurchase = "01012021"
    const paymentType = "paynow"
    const totalPriceBeforeGST = "43.2"
    const totalPriceAfterGST = "40"
    await driver.executeScript('window.scrollTo(0, 0);');

    await inputInvoiceID(driver, invoiceID)

    await inputSupplier(driver, supplier)

    await inputItemTable(driver, product1, price1, quantity1)
    await driver.wait(until.elementLocated(By.css(".add-item-success-toast")), 10000);

    await inputDateOfPurchase(driver, dateOfPurchase)

    await inputPaymentType(driver, paymentType)

    await inputTotalPriceBeforeGST(driver, totalPriceBeforeGST)

    await inputTotalPriceAfterGST(driver, totalPriceAfterGST)

    await driver.findElement(By.id("invoice-submit-button")).click()
    const toast = await driver.wait(until.elementLocated(By.css(".add-invoice-failure-toast")), 10000)
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Please fill in all fields correctly.');
  })
  it('shows alert when date of purchase is after today', async function () {
    // store file button will render when processing is done
    await driver.wait(until.elementLocated(By.id('store-file-button')), 30000);
    await driver.findElement(By.id('store-file-button')).click();

    // fill in invoice details
    const invoiceID = "0000009"
    const supplier = "Test Supplier"
    const product1 = "Test Product"
    const price1 = "4"
    const quantity1 = "10"
    const dateOfPurchase = "01012024"
    const paymentType = "paynow"
    const totalPriceBeforeGST = "40"
    const totalPriceAfterGST = "43.2"
    await driver.executeScript('window.scrollTo(0, 0);');

    await inputInvoiceID(driver, invoiceID)

    await inputSupplier(driver, supplier)

    await inputItemTable(driver, product1, price1, quantity1)
    await driver.wait(until.elementLocated(By.css(".add-item-success-toast")), 10000);

    await inputDateOfPurchase(driver, dateOfPurchase)

    await inputPaymentType(driver, paymentType)

    await inputTotalPriceBeforeGST(driver, totalPriceBeforeGST)

    await inputTotalPriceAfterGST(driver, totalPriceAfterGST)

    await driver.findElement(By.id("invoice-submit-button")).click()
    const toast = await driver.wait(until.elementLocated(By.css(".add-invoice-failure-toast")), 10000)
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Please fill in all fields correctly.');
  })
  it('shows alert when image link is not stored', async function () {
    // fill in invoice details
    const invoiceID = "0000010"
    const supplier = "Test Supplier"
    const product1 = "Test Product"
    const price1 = "4"
    const quantity1 = "10"
    const dateOfPurchase = "01012021"
    const paymentType = "paynow"
    const totalPriceBeforeGST = "40"
    const totalPriceAfterGST = "43.2"
    await driver.executeScript('window.scrollTo(0, 0);');

    await inputInvoiceID(driver, invoiceID)

    await inputSupplier(driver, supplier)

    await inputItemTable(driver, product1, price1, quantity1)
    await driver.wait(until.elementLocated(By.css(".add-item-success-toast")), 10000);

    await inputDateOfPurchase(driver, dateOfPurchase)

    await inputPaymentType(driver, paymentType)

    await inputTotalPriceBeforeGST(driver, totalPriceBeforeGST)

    await inputTotalPriceAfterGST(driver, totalPriceAfterGST)

    await driver.findElement(By.id("invoice-submit-button")).click()
    const toast = await driver.wait(until.elementLocated(By.css(".add-invoice-failure-toast")), 10000)
    await driver.wait(async () => (await toast.getText()).trim() !== '', 5000);
    assert.strictEqual(await toast.getText(), 'Please fill in all fields correctly.');
  })
})

// ADDED "Test Supplier 1" with UEN: "", "Test Product 1" with UPC: "" AND invoiceID: "0000001"