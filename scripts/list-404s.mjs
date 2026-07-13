import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const fails = []
page.on('response', r => { if (r.status()===404) fails.push(r.url()) })
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(4000)
console.log([...new Set(fails)].join('\n'))
await page.screenshot({ path: '.debug-screenshots/iter-2b-home.png' })
await browser.close()
