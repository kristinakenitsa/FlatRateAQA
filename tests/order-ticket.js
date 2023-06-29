const puppeteer = require('puppeteer')
const expect = require('chai').expect

describe('Scenario 2', () => {
  it('Add a ticket to the cart.', async () => {
    const browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: null
    })
    const page = await browser.newPage()
    await page.goto('https://my.laphil.com/en/syos2/performance/8928', {
      timeout: 60000,
      waitUntil: 'domcontentloaded'
    })
    await page.waitForSelector('.syos-level-selector-container')
    const quantityField = await page.$('.input-qty')
    const quantity = await page.evaluate((el) => el.getAttribute('value'), quantityField)
    if (quantity === '2') {
      await page.click('.decrement')
    }
    const quantityAfterReduce = await page.evaluate((el) => el.getAttribute('value'), quantityField)
    await page.click('.bestavailable-order')
    await page.click('.syos-level-selector__button')
    await page.waitForSelector('.syos-basket')
    const priceField = await page.waitForSelector('.syos-price')
    const priceTicketInfo = await priceField.evaluate((el) => el.textContent)
    await page.click('.syos-basket__actions > button')
    await page.waitForSelector('#targetDonationForm')
    const skippAdd = await page.$('#targetDonationSkip')
    await skippAdd.evaluate((b) => b.click())
    const ticketPriceField = await page.waitForSelector('#basket-main td .price')
    const currectTicketPrice = await ticketPriceField.evaluate((el) => el.textContent)
    expect(priceTicketInfo).to.eq(currectTicketPrice)
    const ticketQuantityField = await page.waitForSelector('#basket-main td .quantity')
    const currectTicketQuantity = await ticketQuantityField.evaluate((el) => el.textContent)
    expect(quantityAfterReduce).to.eq(currectTicketQuantity)
    await browser.close()
  })
})
