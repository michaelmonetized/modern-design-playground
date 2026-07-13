import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { setProgress, stage } from "#/lib/home/scroll-state"

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: ReactNode }) {
	useEffect(() => {
		stage.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		stage.vw = window.innerWidth
		stage.vh = window.innerHeight

		const lenis = new Lenis({
			lerp: stage.reduce ? 1 : 0.072,
			smoothWheel: !stage.reduce,
			syncTouch: false,
			wheelMultiplier: 0.88,
		})

		lenis.on("scroll", () => {
			const limit = lenis.limit || 1
			setProgress(limit > 0 ? lenis.scroll / limit : 0)
			ScrollTrigger.update()
		})

		const onPointer = (ev: PointerEvent) => {
			stage.vw = window.innerWidth
			stage.vh = window.innerHeight
			const nx = ev.clientX / stage.vw
			const ny = ev.clientY / stage.vh
			const x = nx * 2 - 1
			const y = -(ny * 2 - 1)
			stage.velocity.x += (x - stage.pointer.x) * 0.6
			stage.velocity.y += (y - stage.pointer.y) * 0.6
			stage.pointer.x = x
			stage.pointer.y = y
		}
		const onResize = () => {
			stage.vw = window.innerWidth
			stage.vh = window.innerHeight
			ScrollTrigger.refresh()
		}

		window.addEventListener("pointermove", onPointer, { passive: true })
		window.addEventListener("resize", onResize)

		// Sync GSAP ticker → Lenis
		const ticker = (time: number) => {
			lenis.raf(time * 1000)
		}
		gsap.ticker.add(ticker)
		gsap.ticker.lagSmoothing(0)

		// Initial progress
		setProgress(0)

		return () => {
			gsap.ticker.remove(ticker)
			lenis.destroy()
			window.removeEventListener("pointermove", onPointer)
			window.removeEventListener("resize", onResize)
			ScrollTrigger.getAll().forEach((t) => t.kill())
		}
	}, [])

	return children
}
