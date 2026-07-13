/**
 * Long-running verification + iteration harness.
 * Screenshots every landing, logs WebGL health, writes a report.
 * Designed to be re-run while AFK.
 */
import { chromium } from "playwright"
import fs from "fs"
import path from "path"

const base = process.env.URL || "http://localhost:3001"
const out = path.resolve(".debug-screenshots")
const reportPath = path.join(out, "iteration-report.json")
const slugs = [
	"editorial",
	"brutalist",
	"noir",
	"zen",
	"neon",
	"paper",
	"atlas",
	"pulse",
	"prism",
]

fs.mkdirSync(out, { recursive: true })

async function shot(page, name) {
	const file = path.join(out, name)
	await page.screenshot({ path: file, fullPage: false })
	return file
}

async function webglHealth(page) {
	return page.evaluate(() => {
		const canvases = [...document.querySelectorAll("canvas")]
		const result = {
			count: canvases.length,
			sizes: canvases.map((c) => [c.width, c.height]),
			pixel: null,
			hasWebGL: false,
		}
		for (const c of canvases) {
			const gl = c.getContext("webgl2") || c.getContext("webgl")
			if (!gl) continue
			result.hasWebGL = true
			// preserveDrawingBuffer may be false — still useful if non-zero
			const data = new Uint8Array(4)
			try {
				gl.readPixels(
					(c.width / 2) | 0,
					(c.height / 2) | 0,
					1,
					1,
					gl.RGBA,
					gl.UNSIGNED_BYTE,
					data,
				)
				result.pixel = [...data]
			} catch (e) {
				result.pixel = ["error", String(e)]
			}
			break
		}
		return result
	})
}

async function runOnce(iteration) {
	const browser = await chromium.launch({ headless: true })
	const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
	const errors = []
	page.on("pageerror", (e) => errors.push(e.message))
	page.on("console", (m) => {
		if (m.type() === "error") errors.push(m.text())
	})

	const report = {
		iteration,
		ts: new Date().toISOString(),
		base,
		pages: {},
		errors: [],
	}

	// Home
	await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 90000 })
	await page.evaluate(() => {
		document.documentElement.classList.add("dark")
		document.documentElement.classList.remove("light")
	})
	// Wait for R3F canvas engine + first paint (Environment/textures)
	await page.waitForSelector("[data-engine]", { timeout: 20000 }).catch(() => {})
	await page.waitForTimeout(4000)
	report.pages.home = {
		shot: await shot(page, `iter-${iteration}-home.png`),
		webgl: await webglHealth(page),
		title: await page.title(),
	}
	await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35))
	await page.waitForTimeout(1200)
	await shot(page, `iter-${iteration}-home-mid.png`)

	// Gallery index
	await page.goto(base + "/landings", { waitUntil: "domcontentloaded", timeout: 30000 })
	await page.waitForTimeout(1000)
	report.pages.gallery = {
		shot: await shot(page, `iter-${iteration}-gallery.png`),
		cards: await page.locator("a[href*='/landings/']").count(),
	}

	// Each world
	for (const slug of slugs) {
		try {
			await page.goto(base + "/landings/" + slug, {
				waitUntil: "domcontentloaded",
				timeout: 45000,
			})
			await page.waitForTimeout(1600)
			// interact: click center
			await page.mouse.click(720, 450)
			await page.waitForTimeout(400)
			report.pages[slug] = {
				shot: await shot(page, `iter-${iteration}-${slug}.png`),
				ok: true,
				title: await page.title(),
			}
		} catch (e) {
			report.pages[slug] = { ok: false, error: String(e) }
		}
	}

	report.errors = errors.slice(0, 40)
	const prev = fs.existsSync(reportPath)
		? JSON.parse(fs.readFileSync(reportPath, "utf8"))
		: { runs: [] }
	prev.runs = prev.runs || []
	prev.runs.push(report)
	prev.latest = report
	fs.writeFileSync(reportPath, JSON.stringify(prev, null, 2))
	await browser.close()
	console.log(
		`[iter ${iteration}] home webgl=${JSON.stringify(report.pages.home.webgl)} galleryCards=${report.pages.gallery.cards} errors=${errors.length}`,
	)
	return report
}

const start = Number(process.env.ITER_START || 1)
const max = Number(process.env.ITER_MAX || 1)
for (let i = start; i < start + max; i++) {
	try {
		await runOnce(i)
	} catch (e) {
		console.error("iteration failed", i, e)
	}
}
console.log("iteration harness complete")
