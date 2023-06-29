const puppeteer = require('puppeteer')

describe('Scenario 1', () => {
  it('Verify which sections are active and which ones have available seats.', async () => {
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
    const activeSections = []
    const sectionsWithTwoSeats = []
    const sectionsWithoutTwoSeats = []
    const zones = await page.$$('#Levels > *')
    for (const section of zones) {
      const attr = await page.evaluate((el) => el.getAttribute('class'), section)
      const zoneName = await section.$eval('path', (el) => el.getAttribute('aria-label'))
      if (attr === ' has-zones') activeSections.push(zoneName)
    }
    for (const activeZone of activeSections) {
      await page.click(`path[aria-label="${activeZone}"]`)
      await page.click('.syos-level-selector__button')
      await page.waitForTimeout(3000)
      if ((await page.$('.syos-enhanced-notice__inner')) !== null) {
        await page.reload()
        await page.waitForSelector('.syos-level-selector-container')
        sectionsWithoutTwoSeats.push(activeZone)
      } else {
        sectionsWithTwoSeats.push(activeZone)
      }
    }
    await browser.close()
    console.log(`There are currently ${activeSections.length} active sections: '${activeSections.toString()}'.`)
    console.log(
      `There are ${
        sectionsWithTwoSeats.length
      } sections that have 2 available seats: '${sectionsWithTwoSeats.toString()}'.`
    )
    console.log(
      `${
        sectionsWithoutTwoSeats.length
      } sections: '${sectionsWithoutTwoSeats.toString()}' are active and do not have 2 available seats.`
    )
  })
})
