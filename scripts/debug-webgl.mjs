import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const logs = []
page.on('console', m => logs.push([m.type(), m.text()]))
page.on('pageerror', e => logs.push(['pageerror', e.message]))
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 90000 })
await page.waitForTimeout(5000)
const info = await page.evaluate(() => {
  const c = document.querySelectorAll('canvas')
  return {
    canvasCount: c.length,
    r3f: !!document.querySelector('[data-engine]'),
    html: document.documentElement.className,
  }
})
console.log(JSON.stringify({ info, logs: logs.filter(l => l[0]==='error'||l[0]==='pageerror'||l[1]?.includes('Shader')||l[1]?.includes('THREE')||l[1]?.includes('WebGL')).slice(0,40) }, null, 2))
await page.screenshot({ path: '.debug-screenshots/webgl-debug.png' })
await browser.close()
