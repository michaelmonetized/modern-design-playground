/**
 * Marathon AFK harness — loops forever:
 * 1. verify server
 * 2. run screenshot iteration
 * 3. score weakest pages by PNG size (proxy for visual density)
 * 4. append STATUS-MARATHON.md
 * 5. sleep and repeat
 *
 * Usage:
 *   URL=http://localhost:3001 node scripts/marathon-forever.mjs
 */
import { spawn } from "child_process"
import fs from "fs"
import path from "path"
import http from "http"

const base = process.env.URL || "http://localhost:3001"
const out = path.resolve(".debug-screenshots")
const statusPath = path.resolve("STATUS-MARATHON.md")
const sleepMs = Number(process.env.SLEEP_MS || 180_000) // 3 min between cycles
let cycle = Number(process.env.CYCLE_START || 5)

function log(...a) {
	console.log(`[marathon ${new Date().toISOString()}]`, ...a)
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms))
}

function checkServer() {
	return new Promise((resolve) => {
		const u = new URL(base)
		const req = http.get(
			{ hostname: u.hostname, port: u.port, path: "/", timeout: 4000 },
			(res) => {
				res.resume()
				resolve(res.statusCode && res.statusCode < 500)
			},
		)
		req.on("error", () => resolve(false))
		req.on("timeout", () => {
			req.destroy()
			resolve(false)
		})
	})
}

function runIterate(iter) {
	return new Promise((resolve, reject) => {
		const child = spawn(
			"node",
			["scripts/iterate-loop.mjs"],
			{
				env: { ...process.env, URL: base, ITER_START: String(iter), ITER_MAX: "1" },
				stdio: "inherit",
				cwd: process.cwd(),
			},
		)
		child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`iter exit ${code}`))))
	})
}

function scoreScreenshots(iter) {
	const scores = []
	if (!fs.existsSync(out)) return scores
	for (const f of fs.readdirSync(out)) {
		if (!f.startsWith(`iter-${iter}-`) || !f.endsWith(".png")) continue
		const st = fs.statSync(path.join(out, f))
		const name = f.replace(`iter-${iter}-`, "").replace(".png", "")
		scores.push({ name, bytes: st.size, kb: Math.round(st.size / 1024) })
	}
	scores.sort((a, b) => a.bytes - b.bytes)
	return scores
}

function appendStatus(cycleNum, scores, note) {
	const weak = scores.slice(0, 4)
	const strong = scores.slice(-3).reverse()
	const block = `
### Auto-cycle ${cycleNum} — ${new Date().toISOString()}
- Base: ${base}
- Weakest (by PNG density): ${weak.map((s) => `${s.name} ${s.kb}KB`).join(", ") || "n/a"}
- Strongest: ${strong.map((s) => `${s.name} ${s.kb}KB`).join(", ") || "n/a"}
- Note: ${note}
`
	fs.appendFileSync(statusPath, block)
	log("status appended", weak.map((s) => s.name).join(","))
}

async function main() {
	log("starting forever loop", { base, sleepMs })
	fs.mkdirSync(out, { recursive: true })
	if (!fs.existsSync(statusPath)) {
		fs.writeFileSync(statusPath, "# Marathon STATUS\n")
	}

	while (true) {
		const up = await checkServer()
		if (!up) {
			log("server down — waiting 20s")
			await sleep(20_000)
			continue
		}
		try {
			log("running iterate", cycle)
			await runIterate(cycle)
			const scores = scoreScreenshots(cycle)
			const weak = scores[0]
			appendStatus(
				cycle,
				scores,
				weak
					? `Prioritize upgrade for: ${weak.name} (${weak.kb}KB). Subagents + main agent keep polishing.`
					: "No screenshots this cycle",
			)
			// Write machine-readable weak list for other agents
			fs.writeFileSync(
				path.join(out, "weakest.json"),
				JSON.stringify(
					{
						cycle,
						ts: new Date().toISOString(),
						weakest: scores.slice(0, 5),
						all: scores,
					},
					null,
					2,
				),
			)
			cycle++
		} catch (e) {
			log("cycle error", e)
			appendStatus(cycle, [], `ERROR: ${e}`)
		}
		log(`sleep ${sleepMs}ms before next cycle`)
		await sleep(sleepMs)
	}
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
