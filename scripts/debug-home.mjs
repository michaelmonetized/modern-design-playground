import { chromium } from "playwright"
import fs from "fs"

const base = process.env.URL || "http://localhost:3001"
const out = ".debug-screenshots"

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const logs = []
page.on("console", (m) => logs.push({ type: m.type(), text: m.text() }))
page.on("pageerror", (e) => logs.push({ type: "pageerror", text: e.message }))

await page.goto(base + "/", { waitUntil: "networkidle", timeout: 60000 })
await page.waitForTimeout(3500)
await page.screenshot({ path: `${out}/home-top.png`, fullPage: false })

await page.evaluate(() => {
	document.documentElement.classList.remove("light")
	document.documentElement.classList.add("dark")
})
await page.waitForTimeout(500)
await page.screenshot({ path: `${out}/home-dark.png` })

const info = await page.evaluate(() => {
	const canvases = [...document.querySelectorAll("canvas")].map((c) => ({
		w: c.width,
		h: c.height,
		display: getComputedStyle(c).display,
		visibility: getComputedStyle(c).visibility,
		opacity: getComputedStyle(c).opacity,
		z: getComputedStyle(c).zIndex,
		pos: getComputedStyle(c).position,
		parent: c.parentElement?.className,
		cls: c.className,
	}))
	let pixel = null
	for (const c of document.querySelectorAll("canvas")) {
		try {
			const gl = c.getContext("webgl2") || c.getContext("webgl")
			if (gl) {
				const data = new Uint8Array(4)
				gl.readPixels(
					(c.width / 2) | 0,
					(c.height / 2) | 0,
					1,
					1,
					gl.RGBA,
					gl.UNSIGNED_BYTE,
					data,
				)
				pixel = [...data]
				break
			}
		} catch {
			/* ignore */
		}
	}
	return {
		canvases,
		pixel,
		htmlClass: document.documentElement.className,
		bodyBg: getComputedStyle(document.body).backgroundColor,
		errors: window.__errors || null,
	}
})

await page.mouse.move(400, 400)
await page.waitForTimeout(200)
await page.mouse.move(900, 500)
await page.waitForTimeout(800)
await page.screenshot({ path: `${out}/home-moved.png` })

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4))
await page.waitForTimeout(2000)
await page.screenshot({ path: `${out}/home-mid.png` })

const filtered = logs.filter(
	(l) => l.type === "error" || l.type === "pageerror" || l.type === "warning",
)
fs.writeFileSync(`${out}/console.json`, JSON.stringify({ logs: filtered, info }, null, 2))
console.log(JSON.stringify({ logs: filtered.slice(0, 50), info }, null, 2))

for (const slug of ["editorial", "brutalist", "neon", "prism", "atlas"]) {
	await page.goto(base + "/landings/" + slug, {
		waitUntil: "domcontentloaded",
		timeout: 30000,
	})
	await page.waitForTimeout(1500)
	await page.screenshot({ path: `${out}/landing-${slug}.png` })
}

await browser.close()
console.log("done")
