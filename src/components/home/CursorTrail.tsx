import { useEffect, useRef } from "react"
import { stage } from "#/lib/home/scroll-state"

type Pt = { x: number; y: number; life: number; vx: number; vy: number }

export function CursorTrail() {
	const ref = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = ref.current
		if (!canvas) return
		const fine = window.matchMedia("(pointer: fine)").matches
		if (!fine) return

		const ctx = canvas.getContext("2d")
		if (!ctx) return

		let raf = 0
		const pts: Pt[] = []
		let mx = -999
		let my = -999
		let lmx = -999
		let lmy = -999

		const resize = () => {
			const dpr = Math.min(devicePixelRatio || 1, 1.5)
			canvas.width = Math.floor(innerWidth * dpr)
			canvas.height = Math.floor(innerHeight * dpr)
			canvas.style.width = `${innerWidth}px`
			canvas.style.height = `${innerHeight}px`
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		}
		resize()

		const onMove = (e: PointerEvent) => {
			mx = e.clientX
			my = e.clientY
		}

		const frame = () => {
			const w = innerWidth
			const h = innerHeight
			ctx.clearRect(0, 0, w, h)

			const vx = mx - lmx
			const vy = my - lmy
			const speed = Math.hypot(vx, vy)

			if (mx > 0) {
				const count = Math.min(6, 1 + Math.floor(speed / 6))
				for (let i = 0; i < count; i++) {
					pts.push({
						x: mx - vx * (i / count) * 0.4,
						y: my - vy * (i / count) * 0.4,
						life: 1,
						vx: vx * 0.04 + (Math.random() - 0.5) * 0.6,
						vy: vy * 0.04 + (Math.random() - 0.5) * 0.6,
					})
				}
			}

			// Core cursor
			if (mx > 0) {
				const r = 5 + Math.min(speed * 0.12, 10)
				ctx.beginPath()
				ctx.arc(mx, my, r, 0, Math.PI * 2)
				ctx.fillStyle = "rgba(245,194,231,0.95)"
				ctx.fill()
				ctx.beginPath()
				ctx.arc(mx, my, r * 2.8, 0, Math.PI * 2)
				ctx.strokeStyle = "rgba(203,166,247,0.45)"
				ctx.lineWidth = 1
				ctx.stroke()
			}

			for (let i = pts.length - 1; i >= 0; i--) {
				const p = pts[i]
				p.life -= 0.028
				p.x += p.vx
				p.y += p.vy
				p.vx *= 0.94
				p.vy *= 0.94
				if (p.life <= 0) {
					pts.splice(i, 1)
					continue
				}
				const pr = stage.smooth
				const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14)
				g.addColorStop(0, `rgba(245,194,231,${0.45 * p.life})`)
				g.addColorStop(0.5, `rgba(137,180,250,${0.2 * p.life * (0.5 + pr)})`)
				g.addColorStop(1, "rgba(17,17,27,0)")
				ctx.fillStyle = g
				ctx.beginPath()
				ctx.arc(p.x, p.y, 12 * p.life, 0, Math.PI * 2)
				ctx.fill()
			}

			lmx = mx
			lmy = my
			raf = requestAnimationFrame(frame)
		}

		window.addEventListener("pointermove", onMove, { passive: true })
		window.addEventListener("resize", resize)
		document.documentElement.classList.add("has-custom-cursor")
		raf = requestAnimationFrame(frame)

		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener("pointermove", onMove)
			window.removeEventListener("resize", resize)
			document.documentElement.classList.remove("has-custom-cursor")
		}
	}, [])

	return (
		<canvas
			ref={ref}
			aria-hidden
			className="pointer-events-none fixed inset-0 z-[80] h-dvh w-dvw mix-blend-screen"
		/>
	)
}
