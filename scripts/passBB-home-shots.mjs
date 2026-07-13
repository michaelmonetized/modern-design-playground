import { chromium } from "playwright"
import fs from "fs"
import path from "path"

const base = process.env.URL || "http://localhost:3001"
const out = path.resolve(".debug-screenshots")
fs.mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 90000 })
await page.evaluate(() => {
  document.documentElement.classList.add("dark")
  document.documentElement.classList.remove("light")
})
await page.waitForSelector("[data-engine]", { timeout: 30000 })
await page.waitForTimeout(5200)

const restPath = path.join(out, "passBB-home-rest.png")
await page.screenshot({ path: restPath, fullPage: false })
console.log("rest", fs.statSync(restPath).size)

// Strike — capture while pulse is hot
await page.getByRole("button", { name: /Strike the field/i }).click()
await page.waitForTimeout(110)
const strikePath = path.join(out, "passBB-home-strike.png")
await page.screenshot({ path: strikePath, fullPage: false })
console.log("strike", fs.statSync(strikePath).size)

await page.waitForTimeout(1400)

// Single pointerdown only — avoid double-start
const res = page.locator('button[aria-label*="resonator"]')
const box = await res.boundingBox()
if (!box) throw new Error("no res")
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
await page.mouse.down()

// CHARGE_MS=1050, seed=0.1 → 50% at t≈467ms. Sample tightly.
let chargePct = 0
let lastLabel = ""
const t0 = Date.now()
while (Date.now() - t0 < 900) {
  await page.waitForTimeout(30)
  lastLabel = await res.innerText()
  const m = lastLabel.match(/(\d+)\s*%/)
  if (m) {
    chargePct = +m[1]
    // Capture window 48–58%
    if (chargePct >= 48 && chargePct <= 58) break
  }
}
// If we overshot, still screenshot current hold state
lastLabel = await res.innerText()
const m2 = lastLabel.match(/(\d+)\s*%/)
if (m2) chargePct = +m2[1]

const chargePath = path.join(out, "passBB-home-resonate-50.png")
await page.screenshot({ path: chargePath, fullPage: false })
console.log("resonate50", fs.statSync(chargePath).size, "label:", JSON.stringify(lastLabel.replace(/\s+/g," ").trim()), "pct:", chargePct)

await page.mouse.up()
await page.waitForTimeout(130)
const detPath = path.join(out, "passBB-home-resonate-release.png")
await page.screenshot({ path: detPath, fullPage: false })
console.log("release", fs.statSync(detPath).size)

console.log(JSON.stringify({
  restKB: Math.round(fs.statSync(restPath).size/1024),
  strikeKB: Math.round(fs.statSync(strikePath).size/1024),
  res50KB: Math.round(fs.statSync(chargePath).size/1024),
  releaseKB: Math.round(fs.statSync(detPath).size/1024),
  chargePct,
}))
await browser.close()
