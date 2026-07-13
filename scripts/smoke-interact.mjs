/**
 * Interaction smoke test — visits home + all landings, exercises clicks/keys,
 * collects pageerrors / console errors, writes .debug-screenshots/smoke-report.json.
 *
 * Exit 0 if no serious pageerrors (TypeError | ReferenceError | SyntaxError), else 1.
 *
 * Usage: URL=http://localhost:3001 node scripts/smoke-interact.mjs
 */
import { chromium } from "playwright"
import fs from "fs"
import path from "path"

const base = process.env.URL || "http://localhost:3001"
const out = path.resolve(".debug-screenshots")
const reportPath = path.join(out, "smoke-report.json")
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

const SERIOUS_RE = /\b(TypeError|ReferenceError|SyntaxError)\b/

function isPosthogNoise(text) {
	const t = String(text).toLowerCase()
	return (
		t.includes("posthog") ||
		t.includes("us.i.posthog.com") ||
		t.includes("us-assets.i.posthog.com") ||
		t.includes("app.posthog.com") ||
		(t.includes("404") && t.includes("ingest"))
	)
}

function shouldIgnoreConsole(text) {
	if (isPosthogNoise(text)) return true
	const t = String(text)
	// Chromium often omits the URL from console 404s; we track failed
	// non-posthog requests separately via the response listener.
	if (/Failed to load resource: the server responded with a status of 404/i.test(t))
		return true
	if (/Failed to load resource/i.test(t) && /posthog|analytics|clerk/i.test(t))
		return true
	// Clerk dev fetch noise in offline/headless
	if (/Failed to fetch/i.test(t) && /clerk/i.test(t)) return true
	return false
}

fs.mkdirSync(out, { recursive: true })

const report = {
	ts: new Date().toISOString(),
	base,
	pages: {},
	pageerrors: [],
	consoleErrors: [],
	resource404s: [],
	actions: [],
	serious: [],
	ok: false,
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

page.on("pageerror", (e) => {
	const text = e.message || String(e)
	if (isPosthogNoise(text)) return
	report.pageerrors.push({
		text,
		stack: e.stack || null,
		url: page.url(),
		ts: new Date().toISOString(),
	})
})

page.on("console", (m) => {
	if (m.type() !== "error") return
	const text = m.text()
	if (shouldIgnoreConsole(text)) return
	report.consoleErrors.push({
		text,
		url: page.url(),
		ts: new Date().toISOString(),
	})
})

page.on("response", (r) => {
	if (r.status() !== 404) return
	const u = r.url()
	if (isPosthogNoise(u)) return
	report.resource404s.push({ url: u, page: page.url() })
})

async function interactCenterAndKeys() {
	const vp = page.viewportSize() || { width: 1440, height: 900 }
	const cx = Math.floor(vp.width / 2)
	const cy = Math.floor(vp.height / 2)
	await page.mouse.click(cx, cy)
	await page.waitForTimeout(200)
	await page.mouse.click(cx + 40, cy - 30)
	await page.waitForTimeout(150)
	for (const key of ["a", "ArrowRight", " ", "Enter", "Escape"]) {
		await page.keyboard.press(key)
		await page.waitForTimeout(80)
	}
}

// ── Home ──────────────────────────────────────────────────────────────
try {
	await page.goto(base + "/", { waitUntil: "domcontentloaded", timeout: 90000 })
	await page.evaluate(() => {
		document.documentElement.classList.add("dark")
		document.documentElement.classList.remove("light")
	})
	const engine = await page
		.waitForSelector("[data-engine]", { timeout: 25000 })
		.then(() => true)
		.catch(() => false)
	await page.waitForTimeout(2500)
	report.actions.push({ page: "home", engine })

	// Click Strike / Hold / resonate style controls if present
	// (Magnetic wrappers + motion can make hit-targets unstable; force + noWaitAfter)
	const buttonLabels = [/Strike/i, /Hold/i, /resonate/i]
	const clickedHold = { v: false }
	for (const re of buttonLabels) {
		// Skip second match for "resonate" if we already held via /Hold/
		if (/resonate/i.test(re.source || String(re)) && clickedHold.v) continue
		const btn = page.getByRole("button", { name: re }).first()
		const count = await btn.count().catch(() => 0)
		if (count > 0) {
			try {
				await btn.scrollIntoViewIfNeeded().catch(() => {})
				// Hold-to-resonate: pointer down, wait, up
				if (/Hold|resonate/i.test(re.source || String(re))) {
					const box = await btn.boundingBox()
					if (box) {
						const x = box.x + box.width / 2
						const y = box.y + box.height / 2
						await page.mouse.move(x, y)
						await page.mouse.down()
						await page.waitForTimeout(600)
						await page.mouse.up()
						clickedHold.v = true
						report.actions.push({
							page: "home",
							action: "hold-resonate",
							label: re.toString(),
						})
					} else {
						await btn.click({ timeout: 4000, force: true, noWaitAfter: true })
						clickedHold.v = true
						report.actions.push({
							page: "home",
							action: "click",
							label: re.toString(),
						})
					}
				} else {
					await btn.click({ timeout: 4000, force: true, noWaitAfter: true })
					report.actions.push({
						page: "home",
						action: "click",
						label: re.toString(),
					})
				}
				await page.waitForTimeout(400)
			} catch (e) {
				// DOM fallback for magnetic/motion instability
				const ok = await page
					.evaluate((pattern) => {
						const re2 = new RegExp(pattern, "i")
						const b = [...document.querySelectorAll("button")].find((el) =>
							re2.test(el.textContent || el.getAttribute("aria-label") || ""),
						)
						if (!b) return false
						b.click()
						return true
					}, re.source || String(re))
					.catch(() => false)
				report.actions.push({
					page: "home",
					action: ok ? "click-dom-fallback" : "failed",
					label: re.toString(),
					error: ok ? undefined : String(e),
				})
			}
		}
	}

	// Cycle material if possible (Sample materials chapter action)
	await page.evaluate(() => {
		document.querySelector("#material")?.scrollIntoView({ behavior: "instant" })
	})
	await page.waitForTimeout(400)
	const materialBtn = page
		.getByRole("button", { name: /Sample materials|material/i })
		.first()
	if ((await materialBtn.count().catch(() => 0)) > 0) {
		try {
			await materialBtn.click({ timeout: 4000, force: true })
			await page.waitForTimeout(250)
			await materialBtn.click({ timeout: 4000, force: true })
			report.actions.push({ page: "home", action: "cycle-material-button" })
		} catch (e) {
			// DOM click fallback when magnetic/motion keeps node unstable
			const cycled = await page.evaluate(() => {
				const buttons = [...document.querySelectorAll("button")]
				const sample = buttons.find((b) =>
					/sample materials|materials/i.test(b.textContent || ""),
				)
				if (sample) {
					sample.click()
					sample.click()
					return true
				}
				return false
			})
			report.actions.push({
				page: "home",
				action: cycled ? "cycle-material-dom" : "cycle-material-failed",
				error: cycled ? undefined : String(e),
			})
		}
	} else {
		report.actions.push({ page: "home", action: "cycle-material-skipped" })
	}

	await interactCenterAndKeys()
	report.pages.home = {
		ok: true,
		engine,
		title: await page.title(),
		url: page.url(),
	}
} catch (e) {
	report.pages.home = { ok: false, error: String(e) }
	report.actions.push({ page: "home", action: "fatal", error: String(e) })
}

// ── Landings ──────────────────────────────────────────────────────────
async function gotoWithRetry(url, attempts = 3) {
	let lastErr
	for (let i = 0; i < attempts; i++) {
		try {
			await page.goto(url, {
				waitUntil: "domcontentloaded",
				timeout: 45000,
			})
			return
		} catch (e) {
			lastErr = e
			// net::ERR_ABORTED / mid-nav abort is common under HMR — retry
			await page.waitForTimeout(500 + i * 400)
		}
	}
	throw lastErr
}

for (const slug of slugs) {
	const pageKey = `landing:${slug}`
	try {
		await gotoWithRetry(base + "/landings/" + slug)
		await page.waitForTimeout(1400)
		await interactCenterAndKeys()
		await page.waitForTimeout(400)
		report.pages[pageKey] = {
			ok: true,
			title: await page.title(),
			url: page.url(),
		}
		report.actions.push({ page: pageKey, action: "interacted" })
	} catch (e) {
		report.pages[pageKey] = { ok: false, error: String(e) }
		report.actions.push({ page: pageKey, action: "fatal", error: String(e) })
	}
}

await browser.close()

// ── Score ──────────────────────────────────────────────────────────────
report.serious = report.pageerrors.filter((e) => SERIOUS_RE.test(e.text))
report.ok = report.serious.length === 0
// de-dupe resource 404s
report.resource404s = [...new Map(report.resource404s.map((r) => [r.url, r])).values()]

report.summary = {
	pagesVisited: Object.keys(report.pages).length,
	pageerrors: report.pageerrors.length,
	consoleErrors: report.consoleErrors.length,
	resource404s: report.resource404s.length,
	serious: report.serious.length,
	actions: report.actions.length,
}

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report.summary, null, 2))
console.log(`report → ${reportPath}`)
if (report.serious.length) {
	console.error("SERIOUS pageerrors:")
	for (const e of report.serious) console.error(" -", e.text, "@", e.url)
}
process.exit(report.ok ? 0 : 1)
