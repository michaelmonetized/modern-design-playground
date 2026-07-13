import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CHAPTERS, GALLERY, LANDINGS, type GalleryItem } from "#/lib/home/assets"
import { stageBus } from "#/lib/home/stage-bus"
import { CaseStudySheet } from "./CaseStudySheet"
import { Magnetic } from "./Magnetic"

gsap.registerPlugin(ScrollTrigger)

const STACK_NOTES = [
	{ k: "WebGL", v: "Custom GLSL field + liquid core + image helix/tunnel" },
	{ k: "Scroll", v: "Lenis smooth scroll synced to GSAP ScrollTrigger" },
	{ k: "Motion", v: "Pointer gravity, magnetic CTAs, kinetic type" },
	{ k: "Post", v: "Bloom · chromatic aberration · grain · vignette" },
	{ k: "System", v: "Max type · Catppuccin · Base UI · Oxc toolchain" },
]

const KINETIC_A =
	"MATERIAL  ORBIT  SIGNAL  LIGHT  HAND  MATERIAL  ORBIT  SIGNAL"
const KINETIC_B =
	"CRAFT  FIELD  PULSE  GLASS  CORE  CRAFT  FIELD  PULSE  GLASS"

type Shockwave = { id: number; x: number; y: number; power: number }

export function Chapters() {
	const root = useRef<HTMLDivElement>(null)
	const [active, setActive] = useState<GalleryItem | null>(null)
	const [open, setOpen] = useState(false)
	const [stackOpen, setStackOpen] = useState(false)
	const [materialLabel, setMaterialLabel] = useState("Glass")
	const kineticARef = useRef<HTMLParagraphElement>(null)
	const kineticBRef = useRef<HTMLParagraphElement>(null)
	const scrambleTimer = useRef(0)
	const [charge, setCharge] = useState(0)
	const [charging, setCharging] = useState(false)
	const chargeRaf = useRef(0)
	const chargeInterval = useRef(0)
	const chargeVal = useRef(0)
	const [shockwaves, setShockwaves] = useState<Shockwave[]>([])
	const heroRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const el = root.current
		if (!el) return
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		const ctx = gsap.context(() => {
			const panels = gsap.utils.toArray<HTMLElement>("[data-chapter]")
			panels.forEach((panel) => {
				const lines = panel.querySelectorAll("[data-reveal]")
				gsap.set(lines, {
					y: reduce ? 0 : 48,
					opacity: 0,
					filter: reduce ? "none" : "blur(12px)",
				})
				ScrollTrigger.create({
					trigger: panel,
					start: "top 70%",
					end: "bottom 40%",
					onEnter: () => {
						gsap.to(lines, {
							y: 0,
							opacity: 1,
							filter: "blur(0px)",
							duration: reduce ? 0.01 : 1.1,
							ease: "power3.out",
							stagger: reduce ? 0 : 0.08,
						})
					},
					onLeaveBack: () => {
						gsap.to(lines, {
							y: reduce ? 0 : 32,
							opacity: 0.15,
							filter: reduce ? "none" : "blur(8px)",
							duration: 0.5,
							stagger: 0.03,
						})
					},
				})
			})

			const strip = el.querySelector<HTMLElement>("[data-strip]")
			const track = el.querySelector<HTMLElement>("[data-strip-track]")
			if (strip && track) {
				const total = () => track.scrollWidth - window.innerWidth + 64
				gsap.to(track, {
					x: () => -total(),
					ease: "none",
					scrollTrigger: {
						trigger: strip,
						start: "top top",
						end: () => `+=${total()}`,
						pin: true,
						scrub: 1,
						invalidateOnRefresh: true,
					},
				})
			}

			const kinetic = el.querySelector<HTMLElement>("[data-kinetic]")
			const kineticWordA = el.querySelector<HTMLElement>("[data-kinetic-a]")
			const kineticWordB = el.querySelector<HTMLElement>("[data-kinetic-b]")
			if (kinetic && kineticWordA) {
				gsap.fromTo(
					kineticWordA,
					{ xPercent: 18, opacity: 0.2 },
					{
						xPercent: -38,
						opacity: 1,
						ease: "none",
						scrollTrigger: {
							trigger: kinetic,
							start: "top bottom",
							end: "bottom top",
							scrub: true,
						},
					},
				)
			}
			if (kinetic && kineticWordB) {
				gsap.fromTo(
					kineticWordB,
					{ xPercent: -28, opacity: 0.15 },
					{
						xPercent: 22,
						opacity: 0.85,
						ease: "none",
						scrollTrigger: {
							trigger: kinetic,
							start: "top bottom",
							end: "bottom top",
							scrub: true,
						},
					},
				)
			}
		}, el)

		return () => ctx.revert()
	}, [])

	const openCase = (item: GalleryItem, index: number) => {
		setActive(item)
		setOpen(true)
		stageBus.setFocus(index)
	}

	const scrambleKinetic = () => {
		const nodes = [
			{ node: kineticARef.current, original: KINETIC_A },
			{ node: kineticBRef.current, original: KINETIC_B },
		]
		const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ·/✦"
		// Cancel any in-flight scramble so restores always land
		if (scrambleTimer.current) window.clearInterval(scrambleTimer.current)
		let frame = 0
		const restore = () => {
			if (scrambleTimer.current) window.clearInterval(scrambleTimer.current)
			scrambleTimer.current = 0
			for (const { node, original } of nodes) {
				if (node) node.textContent = original
			}
		}
		scrambleTimer.current = window.setInterval(() => {
			frame++
			for (const { node, original } of nodes) {
				if (!node) continue
				node.textContent = original
					.split("")
					.map((ch, i) => {
						if (ch === "\u00a0" || ch === " ") return ch
						if (frame > 12 + i * 0.15) return original[i]
						return glyphs[(Math.random() * glyphs.length) | 0]
					})
					.join("")
			}
			if (frame > 40) restore()
		}, 32)
		// Hard backup restore in case the tab throttles intervals
		window.setTimeout(restore, 1600)
		stageBus.triggerPulse(0.7)
	}

	const stopChargeLoop = () => {
		cancelAnimationFrame(chargeRaf.current)
		chargeRaf.current = 0
		if (chargeInterval.current) {
			window.clearInterval(chargeInterval.current)
			chargeInterval.current = 0
		}
	}

	const startResonate = () => {
		stopChargeLoop()
		setCharging(true)
		// Immediate hum so hold feels alive on first frame
		const t0 = performance.now()
		const seed = 0.1
		chargeVal.current = seed
		setCharge(seed)
		stageBus.triggerPulse(0.12)
		// Time-based charge: ~1.05s seed→full (independent of rAF throttle under WebGL)
		const CHARGE_MS = 1050
		const tick = () => {
			const now = performance.now()
			const c = Math.min(1, seed + ((now - t0) / CHARGE_MS) * (1 - seed))
			chargeVal.current = c
			setCharge(c)
			// Sustained "hum": core swells with charge without whiteout (release is the boom)
			const hum = 0.08 + c * 0.36
			if (stageBus.pulse < hum) {
				stageBus.triggerPulse(hum - stageBus.pulse)
			}
			// Micro spikes for orbital/wave liveliness (more frequent as charge rises)
			const spikeChance = 0.86 - c * 0.16
			if (c > 0.15 && Math.random() > spikeChance) {
				stageBus.triggerPulse(0.04 + c * 0.12)
			}
		}
		// Interval keeps DOM + hum alive even when browser throttles rAF under 3D load
		chargeInterval.current = window.setInterval(tick, 33)
		// rAF path for smoother desktops (harmless double-tick; values are time-derived)
		const rafTick = () => {
			tick()
			chargeRaf.current = requestAnimationFrame(rafTick)
		}
		chargeRaf.current = requestAnimationFrame(rafTick)
	}

	const releaseResonate = (clientX?: number, clientY?: number) => {
		stopChargeLoop()
		setCharging(false)
		const power = Math.max(0.35, chargeVal.current)
		chargeVal.current = 0
		setCharge(0)

		// Primary detonation into the shared stage bus
		stageBus.triggerPulse(Math.min(1, power * 1.05))
		// Cascading aftershocks for a full "wow" hit — still only uses stageBus API
		if (power > 0.4) {
			window.setTimeout(() => stageBus.triggerPulse(power * 0.62), 90)
			window.setTimeout(() => stageBus.triggerPulse(power * 0.4), 200)
			window.setTimeout(() => stageBus.triggerPulse(power * 0.22), 340)
		}
		if (power > 0.7) {
			window.setTimeout(() => stageBus.triggerPulse(0.28), 480)
		}
		// Cycle material on max charge
		if (power > 0.92) {
			stageBus.cycleMaterial()
			setMaterialLabel(
				(["Glass", "Metal", "Matte"] as const)[stageBus.material] ?? "Glass",
			)
		}

		const hero = heroRef.current
		let x = 50
		let y = 70
		if (hero) {
			const r = hero.getBoundingClientRect()
			const cx = clientX ?? r.left + r.width * 0.28
			const cy = clientY ?? r.top + r.height * 0.72
			x = ((cx - r.left) / r.width) * 100
			y = ((cy - r.top) / r.height) * 100
		}
		const id = Date.now()
		// Dual shock rings on strong release for extra DOM feedback
		setShockwaves((s) => [
			...s.slice(-3),
			{ id, x, y, power },
			...(power > 0.55
				? [{ id: id + 1, x: x + 1.5, y: y - 1, power: power * 0.65 }]
				: []),
		])
		window.setTimeout(() => {
			setShockwaves((s) => s.filter((w) => w.id !== id && w.id !== id + 1))
		}, 1500)
	}

	useEffect(() => {
		return () => {
			cancelAnimationFrame(chargeRaf.current)
			if (chargeInterval.current) window.clearInterval(chargeInterval.current)
			if (scrambleTimer.current) window.clearInterval(scrambleTimer.current)
		}
	}, [])

	const materials = ["Glass", "Metal", "Matte"] as const
	const featuredLandings = LANDINGS.slice(0, 4)

	return (
		<div ref={root} className="relative z-10">
			<section
				ref={heroRef}
				className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden px-5 pb-14 pt-28 sm:px-8 sm:pb-16"
			>
				{/* Charge ambient wash — grows with hold so resonate reads before release */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-[4] transition-opacity duration-150"
					style={{
						opacity: charging ? 0.35 + charge * 0.65 : 0,
						background: `
							radial-gradient(ellipse 70% 55% at 28% 72%,
								color-mix(in oklab, var(--catpuccin-pink) ${18 + charge * 42}%, transparent),
								transparent 70%),
							radial-gradient(ellipse 50% 40% at 55% 60%,
								color-mix(in oklab, var(--catpuccin-mauve) ${10 + charge * 30}%, transparent),
								transparent 65%),
							radial-gradient(ellipse 90% 70% at 50% 100%,
								color-mix(in oklab, var(--catpuccin-sapphire) ${6 + charge * 18}%, transparent),
								transparent 60%)
						`,
						boxShadow: charging
							? `inset 0 0 ${80 + charge * 160}px ${20 + charge * 40}px color-mix(in oklab, var(--catpuccin-pink) ${8 + charge * 22}%, transparent)`
							: undefined,
					}}
				/>
				{/* Charge progress ring (viewport-centered near CTAs) */}
				{charging && (
					<div
						aria-hidden
						className="pointer-events-none absolute z-[5] rounded-full"
						style={{
							left: "28%",
							top: "72%",
							width: `${48 + charge * 220}px`,
							height: `${48 + charge * 220}px`,
							transform: "translate(-50%, -50%)",
							border: `2px solid color-mix(in oklab, var(--catpuccin-pink) ${40 + charge * 50}%, transparent)`,
							boxShadow: `
								0 0 ${24 + charge * 80}px ${4 + charge * 20}px color-mix(in oklab, var(--catpuccin-pink) ${25 + charge * 35}%, transparent),
								inset 0 0 ${16 + charge * 40}px color-mix(in oklab, var(--catpuccin-mauve) ${15 + charge * 25}%, transparent)
							`,
							opacity: 0.45 + charge * 0.5,
							animation: "chapter-charge-ring 1.1s ease-in-out infinite",
						}}
					/>
				)}
				{/* Shockwave rings from resonator detonation */}
				<div className="pointer-events-none absolute inset-0 z-[5]">
					{shockwaves.map((w) => (
						<span
							key={w.id}
							className="absolute rounded-full border border-pink/80"
							style={{
								left: `${w.x}%`,
								top: `${w.y}%`,
								width: 12,
								height: 12,
								transform: "translate(-50%, -50%)",
								animation: `chapter-shock ${0.9 + w.power * 0.5}s cubic-bezier(0.1,0.7,0.2,1) forwards`,
								boxShadow: `0 0 ${40 + w.power * 80}px ${10 + w.power * 30}px color-mix(in oklab, var(--catpuccin-pink) ${30 + w.power * 40}%, transparent)`,
							}}
						/>
					))}
				</div>
				<style>{`
					@keyframes chapter-shock {
						0% { opacity: 0.95; width: 12px; height: 12px; border-width: 3px; filter: blur(0px); }
						60% { opacity: 0.55; border-width: 2px; }
						100% { opacity: 0; width: min(140vw, 920px); height: min(140vw, 920px); border-width: 0px; filter: blur(8px); }
					}
					@keyframes chapter-charge-glow {
						0%, 100% { opacity: 0.55; }
						50% { opacity: 1; }
					}
					@keyframes chapter-charge-ring {
						0%, 100% { filter: blur(0px); }
						50% { filter: blur(1.5px); }
					}
					@keyframes chapter-scan {
						0% { transform: translateY(0); opacity: 0; }
						15% { opacity: 0.9; }
						100% { transform: translateY(min(52vh, 420px)); opacity: 0; }
					}
					@keyframes kinetic-glow {
						0%, 100% { filter: drop-shadow(0 0 18px color-mix(in oklab, var(--catpuccin-pink) 35%, transparent)); }
						50% { filter: drop-shadow(0 0 42px color-mix(in oklab, var(--catpuccin-mauve) 55%, transparent)); }
					}
					@keyframes plate-breathe {
						0%, 100% { opacity: 0.55; }
						50% { opacity: 0.9; }
					}
					@keyframes mote-drift {
						0% { transform: translateY(0) scale(1); opacity: 0.35; }
						50% { transform: translateY(-12px) scale(1.15); opacity: 0.85; }
						100% { transform: translateY(0) scale(1); opacity: 0.35; }
					}
				`}</style>

				<div className="mx-auto w-full max-w-desktop">
					<p
						data-reveal
						className="text-pink mb-3 text-xs font-black tracking-[0.4em] uppercase"
						style={{
							textShadow: charging
								? `0 0 ${12 + charge * 28}px color-mix(in oklab, var(--catpuccin-pink) ${40 + charge * 50}%, transparent)`
								: undefined,
							letterSpacing: charging
								? `${0.4 + charge * 0.12}em`
								: undefined,
							transition: "letter-spacing 0.12s linear, text-shadow 0.12s linear",
						}}
					>
						Modern Design Playground
					</p>
					<h1
						className="max-w-laptop text-[clamp(2.4rem,8.5vw,6.5rem)] leading-[0.9] font-thin tracking-tight"
						style={{
							filter: charging
								? `saturate(${1 + charge * 1.35}) hue-rotate(${charge * 32}deg) brightness(${1 + charge * 0.12})`
								: undefined,
							transform: charging
								? `scale(${1 + charge * 0.012})`
								: undefined,
							transformOrigin: "left bottom",
							transition: "filter 0.12s linear, transform 0.12s linear",
						}}
					>
						<span data-reveal className="block">
							An instrument
						</span>
						<span
							data-reveal
							className="from-pink via-mauve to-sapphire block bg-gradient-to-r bg-clip-text text-transparent"
						>
							made of scroll,
						</span>
						<span data-reveal className="block">
							light &amp; hand.
						</span>
					</h1>
					<p
						data-reveal
						className="text-subtext-0 mt-5 max-w-measure text-base leading-relaxed sm:text-lg"
					>
						One continuous WebGL field. Pointer gravity. Camera dolly. A helix
						of real work that becomes a tunnel. Click to intervene — the stage
						listens.
					</p>
					<div data-reveal className="mt-6 flex flex-wrap items-center gap-3">
						<Magnetic>
							<a
								href="#orbit"
								className="bg-primary text-primary-foreground inline-flex rounded-full px-7 py-3 text-sm font-black no-underline shadow-[0_0_48px_-10px_var(--catpuccin-pink)]"
							>
								Enter the orbit
							</a>
						</Magnetic>
						<Magnetic strength={0.22}>
							<button
								type="button"
								onClick={() => stageBus.triggerPulse(1)}
								className="border-border/80 inline-flex cursor-pointer rounded-full border px-7 py-3 text-sm font-semibold backdrop-blur-md"
							>
								Strike the field
							</button>
						</Magnetic>
						{/* Hold-to-charge resonator — cascades stageBus pulses + shockwaves */}
						<button
							type="button"
							aria-label="Hold to charge resonator, release to detonate"
							onPointerDown={(e) => {
								e.preventDefault()
								;(e.currentTarget as HTMLButtonElement).setPointerCapture(
									e.pointerId,
								)
								startResonate()
							}}
							onPointerUp={(e) => releaseResonate(e.clientX, e.clientY)}
							onPointerCancel={() => releaseResonate()}
							onKeyDown={(e) => {
								if (e.key === " " || e.key === "Enter") {
									e.preventDefault()
									if (!charging) startResonate()
								}
							}}
							onKeyUp={(e) => {
								if (e.key === " " || e.key === "Enter") {
									e.preventDefault()
									releaseResonate()
								}
							}}
							className="group relative inline-flex min-w-[11rem] cursor-pointer flex-col items-stretch overflow-hidden rounded-full border bg-pink/10 px-1 py-1 text-left backdrop-blur-md select-none"
							style={{
								borderColor: charging
									? `color-mix(in oklab, var(--catpuccin-pink) ${55 + charge * 45}%, white)`
									: undefined,
								boxShadow: charging
									? `0 0 ${20 + charge * 48}px ${-4 + charge * 8}px color-mix(in oklab, var(--catpuccin-pink) ${30 + charge * 50}%, transparent),
									   0 0 ${40 + charge * 80}px ${-8 + charge * 12}px color-mix(in oklab, var(--catpuccin-mauve) ${15 + charge * 35}%, transparent),
									   inset 0 0 ${12 + charge * 24}px color-mix(in oklab, var(--catpuccin-pink) ${10 + charge * 30}%, transparent)`
									: "0 0 0 0 transparent",
								transform: charging
									? `scale(${1 + charge * 0.04})`
									: undefined,
								transition:
									"box-shadow 0.1s linear, transform 0.1s linear, border-color 0.1s linear",
							}}
						>
							<span
								className="pointer-events-none absolute inset-0 origin-left rounded-full bg-gradient-to-r from-pink/50 via-mauve/40 to-sapphire/45"
								style={{
									transform: `scaleX(${Math.max(0.06, charge)})`,
									opacity: charging ? 0.98 : 0.35,
									animation: charging
										? `chapter-charge-glow ${0.7 - charge * 0.35}s ease-in-out infinite`
										: undefined,
								}}
							/>
							{/* Secondary shimmer sweep while charging */}
							{charging && (
								<span
									aria-hidden
									className="pointer-events-none absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
									style={{
										left: `${Math.min(100, charge * 100) - 20}%`,
										opacity: 0.35 + charge * 0.45,
									}}
								/>
							)}
							<span className="relative z-10 flex items-center justify-between gap-3 px-5 py-2">
								<span className="text-pink text-sm font-black tracking-wide">
									{charging
										? charge > 0.92
											? "OVERLOAD"
											: charge > 0.55
												? `Resonating ${Math.round(charge * 100)}%`
												: `Charging ${Math.round(charge * 100)}%`
										: "Hold to resonate"}
								</span>
								<span
									className="relative flex h-3 w-3 items-center justify-center"
									aria-hidden
								>
									<span
										className="absolute inset-0 rounded-full bg-pink/40"
										style={{
											transform: `scale(${1 + charge * 2.4})`,
											opacity: charging ? 0.35 + charge * 0.4 : 0.25,
										}}
									/>
									<span
										className="relative h-2.5 w-2.5 rounded-full bg-pink shadow-[0_0_16px_var(--catpuccin-pink)]"
										style={{
											transform: `scale(${1 + charge * 1.8})`,
											opacity: 0.5 + charge * 0.5,
											boxShadow: charging
												? `0 0 ${8 + charge * 28}px var(--catpuccin-pink)`
												: undefined,
										}}
									/>
								</span>
							</span>
						</button>
						<Magnetic strength={0.2}>
							<a
								href="/landings"
								className="border-border/80 text-sapphire inline-flex rounded-full border px-7 py-3 text-sm font-semibold no-underline backdrop-blur-md"
							>
								9 more worlds →
							</a>
						</Magnetic>
					</div>
					<p
						data-reveal
						className="text-overlay-1 mt-6 text-[0.65rem] font-bold tracking-[0.32em] uppercase"
						style={{
							color: charging
								? charge > 0.92
									? "var(--catpuccin-peach)"
									: "var(--catpuccin-pink)"
								: undefined,
							textShadow: charging
								? `0 0 ${10 + charge * 24}px color-mix(in oklab, var(--catpuccin-pink) ${50 + charge * 40}%, transparent)`
								: undefined,
							transition: "color 0.12s linear, text-shadow 0.12s linear",
						}}
					>
						{charging
							? charge > 0.92
								? "OVERLOAD — release to cycle material"
								: charge > 0.5
									? `Charged ${Math.round(charge * 100)}% — release to detonate`
									: "Hold — field is charging · release to strike"
							: "Scroll — the camera is listening · hold resonate to charge"}
					</p>
				</div>
			</section>

			{CHAPTERS.slice(0, 2).map((ch, chIdx) => {
				const primary = chIdx === 0 ? GALLERY[0] : GALLERY[2]
				const secondary = chIdx === 0 ? GALLERY[1] : GALLERY[3]
				const tertiary = chIdx === 0 ? GALLERY[7] : GALLERY[5]
				const primaryIdx = chIdx === 0 ? 0 : 2
				const secondaryIdx = chIdx === 0 ? 1 : 3
				const telemetry =
					chIdx === 0
						? [
								{ k: "Field", v: "WebGL · GLSL" },
								{ k: "Cam", v: "Dolly scrub" },
								{ k: "Core", v: "Liquid pulse" },
								{ k: "Hand", v: "Pointer force" },
							]
						: [
								{ k: "Glass", v: "Soft caustic" },
								{ k: "Metal", v: "Hard rim" },
								{ k: "Matte", v: "Room drink" },
								{ k: "Live", v: materialLabel },
							]
				return (
					<section
						key={ch.id}
						id={ch.id}
						data-chapter
						className="relative flex min-h-[100dvh] items-center overflow-hidden px-5 py-32 sm:px-8 sm:py-36"
					>
						{/* Light edge wash only — avoid muting Stage helix entropy */}
						<div
							aria-hidden
							className="pointer-events-none absolute inset-0"
							style={{
								background:
									chIdx === 0
										? `radial-gradient(ellipse 40% 36% at 82% 28%, color-mix(in oklab, var(--catpuccin-mauve) 12%, transparent), transparent 70%)`
										: `radial-gradient(ellipse 38% 34% at 18% 58%, color-mix(in oklab, var(--catpuccin-pink) 10%, transparent), transparent 68%)`,
							}}
						/>
						{/* Corner fiducials */}
						{[
							"top-6 left-5 sm:left-8",
							"top-6 right-5 sm:right-8",
							"bottom-6 left-5 sm:left-8",
							"bottom-6 right-5 sm:right-8",
						].map((pos) => (
							<span
								key={pos}
								aria-hidden
								className={`pointer-events-none absolute ${pos} h-3 w-3 border-pink/35 ${
									pos.includes("top") && pos.includes("left")
										? "border-t border-l"
										: pos.includes("top")
											? "border-t border-r"
											: pos.includes("left")
												? "border-b border-l"
												: "border-b border-r"
								}`}
							/>
						))}
						{/* Chapter index watermark */}
						<span
							aria-hidden
							className={`pointer-events-none absolute select-none font-thin leading-none tracking-tighter text-white/[0.045] ${
								chIdx === 0
									? "right-[-2%] top-[8%] text-[clamp(8rem,28vw,22rem)] sm:right-[4%]"
									: "left-[-4%] bottom-[6%] text-[clamp(8rem,28vw,22rem)] sm:left-[2%]"
							}`}
						>
							{String(chIdx + 1).padStart(2, "0")}
						</span>
						{/* Floating plate stack — primary + satellite + ghost tertiary */}
						<div
							data-reveal
							className={`absolute ${chIdx === 0 ? "right-[-2%] top-[12%] sm:right-[2%]" : "left-[-4%] bottom-[8%] sm:left-[1%]"} hidden w-[min(46vw,460px)] sm:block`}
						>
							{/* Ghost tertiary plate (depth stack) */}
							{tertiary && (
								<div
									aria-hidden
									className={`absolute ${chIdx === 0 ? "-left-[18%] top-[8%]" : "-right-[16%] bottom-[10%]"} w-[58%] rotate-[-8deg] opacity-40`}
								>
									<div className="border-white/10 relative aspect-[4/5] overflow-hidden rounded-[1.4rem] border shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)]">
										<img
											src={tertiary.src}
											alt=""
											className="h-full w-full object-cover opacity-70 mix-blend-luminosity"
											loading="lazy"
											decoding="async"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-crust/90 via-transparent to-mauve/15" />
									</div>
								</div>
							)}
							{/* Secondary satellite plate */}
							{secondary && (
								<button
									type="button"
									aria-label={`Preview ${secondary.title}`}
									onClick={() => {
										openCase(secondary, secondaryIdx)
										stageBus.triggerPulse(0.35)
									}}
									className={`absolute z-[2] ${chIdx === 0 ? "-left-[22%] bottom-[-4%]" : "-right-[20%] top-[-6%]"} w-[52%] cursor-pointer rotate-[7deg] border-0 bg-transparent p-0 text-left transition duration-300 hover:rotate-[4deg] hover:scale-[1.03]`}
								>
									<div className="border-white/18 group relative aspect-[5/6] overflow-hidden rounded-[1.35rem] border bg-surface-0/40 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.7),0_0_32px_-14px_var(--catpuccin-sapphire)]">
										<img
											src={secondary.src}
											alt=""
											className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.05] group-hover:opacity-100"
											loading="lazy"
											decoding="async"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-crust/95 via-crust/20 to-transparent" />
										<span className="text-sapphire absolute top-3 left-3 text-[0.55rem] font-black tracking-[0.28em] uppercase">
											{chIdx === 0 ? "Signal" : "Alloy"}
										</span>
										<div className="absolute inset-x-0 bottom-0 p-3.5">
											<p className="text-[0.55rem] font-bold tracking-[0.22em] text-white/50 uppercase">
												{secondary.meta}
											</p>
											<p className="mt-0.5 text-sm font-thin">{secondary.title}</p>
										</div>
									</div>
								</button>
							)}
							{/* Primary plate — tilt + scanline */}
							<button
								type="button"
								aria-label={`Preview ${primary?.title ?? "field study"}`}
								onClick={() => {
									if (primary) openCase(primary, primaryIdx)
									stageBus.triggerPulse(0.45)
								}}
								onPointerMove={(e) => {
									const el = e.currentTarget
									const r = el.getBoundingClientRect()
									const px = (e.clientX - r.left) / r.width - 0.5
									const py = (e.clientY - r.top) / r.height - 0.5
									el.style.transform = `perspective(900px) rotateY(${px * 14}deg) rotateX(${-py * 10}deg) scale(1.02)`
								}}
								onPointerLeave={(e) => {
									e.currentTarget.style.transform =
										"perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)"
								}}
								className="border-white/18 from-mauve/30 to-sapphire/20 group relative z-[3] aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[2rem] border bg-gradient-to-br p-0 text-left opacity-90 shadow-[0_40px_100px_-28px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06),0_0_48px_-18px_var(--catpuccin-pink)] transition-transform duration-300 ease-out will-change-transform hover:border-pink/45 hover:shadow-[0_48px_120px_-28px_rgba(0,0,0,0.75),0_0_56px_-10px_var(--catpuccin-pink)]"
							>
								<img
									src={primary?.src}
									alt=""
									className="h-full w-full object-cover opacity-88 mix-blend-luminosity transition duration-500 group-hover:scale-[1.06] group-hover:opacity-100 group-hover:mix-blend-normal"
									loading={chIdx === 0 ? "eager" : "lazy"}
									decoding="async"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-crust via-crust/10 to-mauve/25" />
								{/* Micro grid overlay on plate */}
								<div
									aria-hidden
									className="pointer-events-none absolute inset-0 opacity-[0.12]"
									style={{
										backgroundImage: `
											linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
											linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
										`,
										backgroundSize: "28px 28px",
									}}
								/>
								{/* Live LED strip */}
								<div
									aria-hidden
									className="absolute top-4 right-4 flex gap-1"
								>
									{[0, 1, 2, 3, 4].map((d) => (
										<span
											key={d}
											className="h-1.5 w-1.5 rounded-full bg-pink/70 shadow-[0_0_8px_var(--catpuccin-pink)]"
											style={{
												opacity: 0.35 + d * 0.12,
												animation: `plate-breathe ${1.2 + d * 0.15}s ease-in-out ${d * 0.1}s infinite`,
											}}
										/>
									))}
								</div>
								<span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-pink/80 opacity-0 shadow-[0_0_18px_var(--catpuccin-pink)] transition-opacity duration-300 group-hover:animate-[chapter-scan_1.4s_ease-in-out_infinite] group-hover:opacity-100" />
								<div className="absolute inset-x-0 bottom-0 p-5">
									<div className="mb-2 flex flex-wrap gap-1.5">
										{(primary?.stack ?? []).slice(0, 3).map((s) => (
											<span
												key={s}
												className="rounded-full border border-white/15 bg-crust/50 px-2 py-0.5 text-[0.55rem] font-bold tracking-wide text-white/70 backdrop-blur-sm"
											>
												{s}
											</span>
										))}
									</div>
									<p className="text-pink text-[0.6rem] font-black tracking-[0.3em] uppercase">
										{chIdx === 0 ? "Field study" : "Surface sample"}
									</p>
									<p className="mt-1 text-sm font-thin sm:text-base">
										{primary?.title}
									</p>
									<p className="text-subtext-1 mt-2 text-[0.65rem] font-bold tracking-wide opacity-70 transition group-hover:opacity-100">
										Click to open · tilt follows hand
									</p>
								</div>
							</button>
						</div>
						<div
							className={`relative z-10 mx-auto w-full max-w-desktop ${chIdx === 0 ? "sm:pr-[min(42vw,420px)]" : "sm:pl-[min(42vw,420px)]"}`}
						>
							<div
								data-reveal
								className="mb-4 flex flex-wrap items-center gap-2"
							>
								<p className="text-sapphire text-xs font-black tracking-[0.32em] uppercase">
									{ch.kicker}
								</p>
								<span
									aria-hidden
									className="bg-border/60 hidden h-px w-8 sm:block"
								/>
								<span className="text-overlay-1 text-[0.6rem] font-bold tracking-[0.24em] uppercase">
									{chIdx === 0 ? "Optics · 01/05" : "Contact · 02/05"}
								</span>
							</div>
							<h2
								data-reveal
								className="max-w-laptop text-[clamp(2rem,6vw,4.75rem)] leading-[1.02] font-thin tracking-tight"
							>
								{ch.title}
							</h2>
							<p
								data-reveal
								className="text-subtext-0 mt-6 max-w-measure text-base leading-relaxed sm:text-lg"
							>
								{ch.body}
							</p>
							{ch.detail && (
								<p
									data-reveal
									className="text-subtext-1 border-border/50 mt-4 max-w-measure border-l-2 border-pink/40 pl-4 text-sm leading-relaxed"
								>
									{ch.detail}
								</p>
							)}
							{/* Telemetry chip row — high-frequency density */}
							<div
								data-reveal
								className="mt-6 grid max-w-measure grid-cols-2 gap-2 sm:grid-cols-4"
							>
								{telemetry.map((t) => (
									<div
										key={t.k}
										className="border-white/10 from-surface-0/40 to-surface-0/10 rounded-xl border bg-gradient-to-br px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm"
									>
										<p className="text-pink text-[0.55rem] font-black tracking-[0.22em] uppercase">
											{t.k}
										</p>
										<p className="text-subtext-0 mt-1 text-[0.7rem] font-semibold leading-snug">
											{t.v}
										</p>
									</div>
								))}
							</div>
							{ch.action && (
								<div data-reveal className="mt-8 flex flex-wrap items-end gap-4">
									<Magnetic>
										<button
											type="button"
											onClick={() => {
												if (ch.id === "origin") stageBus.triggerPulse(1)
												if (ch.id === "material") {
													stageBus.cycleMaterial()
													setMaterialLabel(
														materials[stageBus.material] ?? "Glass",
													)
												}
											}}
											className="group border-pink/45 bg-pink/12 hover:bg-pink/22 hover:border-pink/70 inline-flex cursor-pointer flex-col items-start rounded-2xl border px-6 py-5 text-left shadow-[0_0_40px_-16px_var(--catpuccin-pink)] transition"
										>
											<span className="text-pink text-sm font-black tracking-wide">
												{ch.action.label}
												{ch.id === "material" ? ` · ${materialLabel}` : ""}
											</span>
											<span className="text-subtext-0 mt-1.5 max-w-[16rem] text-xs leading-snug">
												{ch.action.hint}
											</span>
										</button>
									</Magnetic>
									{ch.id === "material" && (
										<div className="flex flex-wrap gap-2">
											{materials.map((m, mi) => (
												<button
													key={m}
													type="button"
													onClick={() => {
														stageBus.setMaterial(mi as 0 | 1 | 2)
														setMaterialLabel(m)
													}}
													className={`cursor-pointer rounded-full border px-3.5 py-2 text-xs font-bold transition ${
														materialLabel === m
															? "border-pink bg-pink/25 text-pink shadow-[0_0_24px_-6px_var(--catpuccin-pink)]"
															: "border-white/15 text-subtext-0 hover:border-white/35 hover:text-text"
													}`}
												>
													{m}
												</button>
											))}
										</div>
									)}
									{ch.id === "origin" && (
										<a
											href="#orbit"
											className="text-sapphire hover:text-pink border-border/70 inline-flex items-center rounded-full border px-5 py-3 text-xs font-bold tracking-wide no-underline transition"
										>
											Skip to archive →
										</a>
									)}
								</div>
							)}
						</div>
					</section>
				)
			})}

			<section
				data-kinetic
				className="relative flex h-[86dvh] flex-col items-center justify-center overflow-hidden"
			>
				{/* Soft kinetic wash — keep light so Stage helix stays detailed */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--catpuccin-pink)_12%,transparent),transparent_60%)]"
				/>
				{/* Horizontal rule ticks */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-x-0 top-[18%] flex justify-between px-4 opacity-40 sm:px-10"
				>
					{Array.from({ length: 24 }).map((_, i) => (
						<span
							key={i}
							className={`w-px bg-white/50 ${i % 4 === 0 ? "h-4" : "h-2 opacity-50"}`}
						/>
					))}
				</div>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-x-0 bottom-[18%] flex justify-between px-4 opacity-35 sm:px-10"
				>
					{Array.from({ length: 24 }).map((_, i) => (
						<span
							key={i}
							className={`w-px bg-white/45 ${i % 4 === 0 ? "h-4" : "h-2 opacity-50"}`}
						/>
					))}
				</div>
				{/* Constellation motes */}
				<div aria-hidden className="pointer-events-none absolute inset-0">
					{[
						[12, 22],
						[28, 68],
						[42, 18],
						[55, 78],
						[68, 30],
						[78, 62],
						[88, 24],
						[18, 48],
						[35, 42],
						[62, 52],
						[48, 12],
						[72, 80],
						[8, 75],
						[92, 48],
						[50, 55],
					].map(([x, y], i) => (
						<span
							key={i}
							className="absolute h-1 w-1 rounded-full bg-pink/70 shadow-[0_0_10px_var(--catpuccin-pink)]"
							style={{
								left: `${x}%`,
								top: `${y}%`,
								animation: `mote-drift ${2.4 + (i % 5) * 0.35}s ease-in-out ${i * 0.12}s infinite`,
							}}
						/>
					))}
				</div>
				{/* Soft index mark between material → orbit */}
				<span
					aria-hidden
					className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(10rem,36vw,28rem)] leading-none font-thin tracking-tighter text-white/[0.032]"
				>
					··
				</span>
				{/* Side rails */}
				<span
					aria-hidden
					className="text-overlay-1 pointer-events-none absolute top-1/2 left-3 hidden -translate-y-1/2 -rotate-90 text-[0.55rem] font-black tracking-[0.4em] uppercase sm:block"
				>
					Kinetic · A/B
				</span>
				<span
					aria-hidden
					className="text-overlay-1 pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rotate-90 text-[0.55rem] font-black tracking-[0.4em] uppercase sm:block"
				>
					Scramble ready
				</span>
				<button
					type="button"
					onClick={scrambleKinetic}
					className="absolute inset-0 z-10 cursor-pointer border-0 bg-transparent"
					aria-label="Scramble kinetic type"
				/>
				<div className="pointer-events-none relative z-[1] flex w-full flex-col gap-2 sm:gap-4">
					<p
						ref={kineticARef}
						data-kinetic-a
						className="from-pink via-mauve to-sapphire whitespace-nowrap bg-gradient-to-r bg-clip-text text-[clamp(3.2rem,15vw,12rem)] leading-[0.88] font-thin tracking-tighter text-transparent will-change-transform"
						style={{ animation: "kinetic-glow 4.5s ease-in-out infinite" }}
					>
						MATERIAL&nbsp;&nbsp;ORBIT&nbsp;&nbsp;SIGNAL&nbsp;&nbsp;LIGHT&nbsp;&nbsp;HAND&nbsp;&nbsp;MATERIAL&nbsp;&nbsp;ORBIT&nbsp;&nbsp;SIGNAL
					</p>
					{/* Micro hash marquee between dual lines */}
					<p
						aria-hidden
						className="text-overlay-1/80 whitespace-nowrap text-center text-[0.55rem] font-black tracking-[0.55em] uppercase sm:text-[0.65rem]"
					>
						✦ · FIELD · PULSE · GLASS · METAL · MATTE · CORE · LIGHT · HAND ·
						ORBIT · SIGNAL · CRAFT · ✦ · FIELD · PULSE · GLASS · METAL · MATTE
					</p>
					<p
						ref={kineticBRef}
						data-kinetic-b
						className="from-sapphire/90 via-teal/80 to-pink/80 whitespace-nowrap bg-gradient-to-r bg-clip-text text-[clamp(2rem,10vw,7.5rem)] leading-[0.9] font-thin tracking-tighter text-transparent opacity-85 will-change-transform"
					>
						CRAFT&nbsp;&nbsp;FIELD&nbsp;&nbsp;PULSE&nbsp;&nbsp;GLASS&nbsp;&nbsp;CORE&nbsp;&nbsp;CRAFT&nbsp;&nbsp;FIELD&nbsp;&nbsp;PULSE&nbsp;&nbsp;GLASS
					</p>
				</div>
				<p className="text-overlay-1 absolute bottom-10 left-1/2 z-20 -translate-x-1/2 text-[0.65rem] font-bold tracking-[0.28em] uppercase">
					Click to scramble · dual kinetic field
				</p>
			</section>

			<section id="orbit" data-strip className="relative">
				{/* No soft radial wash — preserves Stage helix photo entropy behind cards.
				    Opaque collage plates add mid-scroll density without muting the field. */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
				>
					{[
						{ src: GALLERY[4]?.src, x: "0%", y: "5%", w: 200, h: 136, r: -9, o: 0.92 },
						{ src: GALLERY[6]?.src, x: "13%", y: "1%", w: 158, h: 108, r: 6, o: 0.88 },
						{ src: GALLERY[8]?.src, x: "76%", y: "3%", w: 180, h: 124, r: 8, o: 0.92 },
						{ src: GALLERY[9]?.src, x: "88%", y: "18%", w: 138, h: 176, r: -5, o: 0.9 },
						{ src: GALLERY[10]?.src, x: "1%", y: "26%", w: 128, h: 164, r: 10, o: 0.86 },
						{ src: GALLERY[11]?.src, x: "85%", y: "56%", w: 148, h: 104, r: -7, o: 0.84 },
						{ src: GALLERY[7]?.src, x: "68%", y: "6%", w: 132, h: 92, r: 4, o: 0.88 },
						{ src: GALLERY[5]?.src, x: "22%", y: "10%", w: 118, h: 84, r: -12, o: 0.82 },
						{ src: GALLERY[3]?.src, x: "7%", y: "56%", w: 136, h: 96, r: 7, o: 0.8 },
						// Cover soft core void above the card row
						{ src: GALLERY[1]?.src, x: "36%", y: "8%", w: 168, h: 112, r: -3, o: 0.78 },
						{ src: GALLERY[2]?.src, x: "48%", y: "14%", w: 150, h: 100, r: 5, o: 0.74 },
					].map(
						(p, i) =>
							p.src && (
								<div
									key={i}
									className="absolute overflow-hidden rounded-2xl border border-white/30 shadow-[0_24px_56px_-14px_rgba(0,0,0,0.85)]"
									style={{
										left: p.x,
										top: p.y,
										width: p.w,
										height: p.h,
										transform: `rotate(${p.r}deg)`,
										opacity: p.o,
									}}
								>
									<img
										src={p.src}
										alt=""
										className="h-full w-full object-cover brightness-110 contrast-110"
										loading={i < 4 ? "eager" : "lazy"}
										decoding="async"
									/>
								</div>
							),
					)}
				</div>
				{/* Film sprocket rails */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-x-0 top-0 z-[3] flex h-4 items-center justify-between gap-1 border-b border-white/12 bg-crust/60 px-2 backdrop-blur-md sm:h-5 sm:px-4"
				>
					{Array.from({ length: 56 }).map((_, i) => (
						<span
							key={i}
							className="h-2 w-1.5 shrink-0 rounded-[1px] border border-white/30 bg-white/15 sm:h-2.5 sm:w-2"
						/>
					))}
				</div>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex h-4 items-center justify-between gap-1 border-t border-white/12 bg-crust/60 px-2 backdrop-blur-md sm:h-5 sm:px-4"
				>
					{Array.from({ length: 56 }).map((_, i) => (
						<span
							key={i}
							className="h-2 w-1.5 shrink-0 rounded-[1px] border border-white/30 bg-white/15 sm:h-2.5 sm:w-2"
						/>
					))}
				</div>
				{/* 03 watermark */}
				<span
					aria-hidden
					className="pointer-events-none absolute top-[6%] right-[3%] z-[1] select-none text-[clamp(7rem,22vw,18rem)] leading-none font-thin tracking-tighter text-white/[0.055]"
				>
					03
				</span>
				{/* Compact header + dominant card strip for mid-scroll PNG density */}
				<div className="relative z-[2] flex h-dvh flex-col justify-end pb-8 pt-10 sm:justify-center sm:pb-10 sm:pt-12">
					<div className="mx-auto mb-4 w-full max-w-desktop px-5 sm:mb-6 sm:px-8">
						<div className="mb-2 flex flex-wrap items-center gap-2">
							<p className="text-yellow text-xs font-black tracking-[0.3em] uppercase">
								03 — Archive corridor
							</p>
							<span className="rounded-full border border-yellow/35 bg-yellow/15 px-2.5 py-0.5 text-[0.55rem] font-black tracking-[0.18em] text-yellow uppercase">
								{GALLERY.length} frames
							</span>
							<span className="rounded-full border border-pink/30 bg-pink/12 px-2.5 py-0.5 text-[0.55rem] font-bold tracking-[0.16em] text-pink uppercase">
								Pin · Scrub · Open
							</span>
						</div>
						<div className="flex flex-wrap items-end justify-between gap-3">
							<div>
								<h2 className="text-3xl font-thin tracking-tight sm:text-5xl">
									Pin. Scrub.{" "}
									<span className="text-pink">Click to open.</span>
								</h2>
								<p className="text-subtext-1 mt-1.5 max-w-measure text-sm leading-relaxed">
									Real product frames — hover for lift and rim light, open for
									the full case study sheet.
								</p>
							</div>
							{/* Compact filmstrip — only first 8 thumbs to keep strip cards prioritized */}
							<div
								aria-hidden
								className="hidden gap-1.5 md:flex"
							>
								{GALLERY.slice(0, 8).map((g, i) => (
									<div
										key={g.src}
										className={`relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-md border ${
											i < 3
												? "border-pink/50 shadow-[0_0_14px_-4px_var(--catpuccin-pink)]"
												: "border-white/18"
										}`}
									>
										<img
											src={g.src}
											alt=""
											className="h-full w-full object-cover brightness-110"
											loading="lazy"
											decoding="async"
										/>
										<span className="absolute right-0.5 bottom-0.5 text-[0.45rem] font-black text-white tabular-nums drop-shadow-md">
											{String(i + 1).padStart(2, "0")}
										</span>
									</div>
								))}
							</div>
						</div>
						{/* Timeline tick bar */}
						<div
							aria-hidden
							className="mt-3 flex max-w-laptop items-end gap-0.5"
						>
							{GALLERY.map((_, i) => (
								<span
									key={i}
									className={`flex-1 rounded-sm ${
										i < 3
											? "h-2.5 bg-pink/75 shadow-[0_0_12px_color-mix(in_oklab,var(--catpuccin-pink)_55%,transparent)]"
											: i < 6
												? "h-2 bg-mauve/60"
												: "h-1.5 bg-white/30"
									}`}
								/>
							))}
						</div>
					</div>
					<div
						data-strip-track
						className="flex w-max gap-4 px-5 will-change-transform sm:gap-6 sm:px-8"
					>
						{GALLERY.map((item, i) => (
							<button
								key={item.src}
								type="button"
								onClick={() => openCase(item, i)}
								data-cursor="media"
								aria-label={`Open case study: ${item.title}`}
								className="group relative h-[56vh] w-[78vw] max-w-[520px] shrink-0 cursor-pointer overflow-hidden rounded-[1.5rem] border border-white/18 bg-mantle p-0 text-left shadow-[0_28px_70px_-24px_rgba(0,0,0,0.65)] transition duration-300 hover:-translate-y-1.5 hover:border-pink/50 hover:shadow-[0_36px_90px_-24px_rgba(0,0,0,0.7),0_0_48px_-14px_var(--catpuccin-pink)] focus-visible:border-pink/60 focus-visible:outline-none sm:h-[62vh] sm:w-[39vw]"
							>
								<img
									src={item.src}
									alt=""
									className="h-full w-full object-cover brightness-[1.08] contrast-[1.08] saturate-[1.06] transition duration-500 group-hover:scale-[1.07] group-focus-visible:scale-[1.07]"
									loading={i < 4 ? "eager" : "lazy"}
									decoding="async"
									fetchPriority={i < 3 ? "high" : "auto"}
								/>
								{/* Top chrome */}
								<div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
									<span className="rounded-md border border-white/20 bg-crust/65 px-2 py-1 text-[0.55rem] font-black tracking-[0.2em] text-white/85 uppercase backdrop-blur-md">
										{item.year}
									</span>
									<span
										aria-hidden
										className="rounded-md border border-white/15 bg-crust/50 px-2 py-1 text-[0.65rem] font-black tracking-[0.22em] text-white/65 tabular-nums backdrop-blur-sm"
									>
										{String(i + 1).padStart(2, "0")}
										<span className="text-white/30">
											/{String(GALLERY.length).padStart(2, "0")}
										</span>
									</span>
								</div>
								<div
									aria-hidden
									className="absolute top-1/2 left-3 flex -translate-y-1/2 flex-col gap-1"
								>
									{[0, 1, 2, 3].map((d) => (
										<span
											key={d}
											className="h-1.5 w-1.5 rounded-full bg-pink/75 shadow-[0_0_8px_var(--catpuccin-pink)]"
											style={{ opacity: 0.4 + d * 0.15 }}
										/>
									))}
								</div>
								{/* Bottom-only gradient — preserve mid-frame photo detail */}
								<div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-crust via-crust/70 to-transparent" />
								<div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 transition group-hover:ring-pink/35" />
								<div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
									<div className="mb-2 flex flex-wrap gap-1">
										{item.stack.slice(0, 3).map((s) => (
											<span
												key={s}
												className="rounded-full border border-white/18 bg-crust/55 px-2 py-0.5 text-[0.55rem] font-bold tracking-wide text-white/80 backdrop-blur-sm"
											>
												{s}
											</span>
										))}
									</div>
									<p className="text-xs font-bold tracking-[0.25em] text-white/70 uppercase drop-shadow">
										{item.meta}
									</p>
									<p className="mt-1 text-2xl font-thin tracking-tight text-white drop-shadow sm:text-3xl">
										{item.title}
									</p>
									<p className="text-pink mt-3 text-xs font-bold tracking-wide">
										Open case study →
									</p>
								</div>
							</button>
						))}
					</div>
				</div>
			</section>

			{CHAPTERS.slice(2).map((ch) => {
				if (ch.id === "orbit") return null
				const mark = ch.id === "craft" ? "04" : ch.id === "signal" ? "05" : null
				return (
					<section
						key={ch.id}
						id={ch.id}
						data-chapter
						className="relative flex min-h-[100dvh] items-center overflow-hidden px-5 py-32 sm:px-8 sm:py-36"
					>
						{mark && (
							<span
								aria-hidden
								className="pointer-events-none absolute top-[10%] right-[-1%] select-none text-[clamp(8rem,26vw,20rem)] leading-none font-thin tracking-tighter text-white/[0.035] sm:right-[3%]"
							>
								{mark}
							</span>
						)}
						{ch.id === "signal" && (
							<div
								aria-hidden
								className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,color-mix(in_oklab,var(--catpuccin-sapphire)_12%,transparent),transparent_55%)]"
							/>
						)}
						<div className="relative z-10 mx-auto w-full max-w-desktop">
							<p
								data-reveal
								className="text-teal mb-4 text-xs font-black tracking-[0.32em] uppercase"
							>
								{ch.kicker}
							</p>
							<h2
								data-reveal
								className="max-w-laptop text-[clamp(2rem,6vw,4.75rem)] leading-[1.02] font-thin tracking-tight"
							>
								{ch.title}
							</h2>
							<p
								data-reveal
								className="text-subtext-0 mt-6 max-w-measure text-base leading-relaxed sm:text-lg"
							>
								{ch.body}
							</p>
							{ch.detail && (
								<p
									data-reveal
									className="text-subtext-1 border-border/50 mt-4 max-w-measure border-l-2 border-teal/40 pl-4 text-sm leading-relaxed"
								>
									{ch.detail}
								</p>
							)}
							{ch.id === "craft" && (
								<div data-reveal className="mt-8 space-y-6">
									<div className="flex flex-wrap items-center gap-3">
										<button
											type="button"
											onClick={() => setStackOpen((v) => !v)}
											className="border-border bg-surface-0/50 hover:bg-surface-1/60 hover:border-pink/40 inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition"
										>
											{stackOpen ? "Hide the stack" : "Open the stack"}
											<span className="text-pink">{stackOpen ? "−" : "+"}</span>
										</button>
										<Magnetic strength={0.2}>
											<a
												href="/landings"
												className="border-sapphire/40 text-sapphire hover:bg-sapphire/10 inline-flex rounded-full border px-5 py-2.5 text-sm font-bold no-underline transition"
											>
												Browse landings →
											</a>
										</Magnetic>
									</div>
									{stackOpen && (
										<ul className="border-border/60 max-w-measure space-y-3 border-l pl-5">
											{STACK_NOTES.map((n) => (
												<li key={n.k} className="text-sm">
													<span className="text-pink font-black tracking-wide">
														{n.k}
													</span>
													<span className="text-subtext-0"> — {n.v}</span>
												</li>
											))}
										</ul>
									)}
								</div>
							)}
							{ch.id === "signal" && (
								<div data-reveal className="mt-10 space-y-8">
									<div className="flex flex-wrap gap-3">
										<Magnetic>
											<a
												href="/landings"
												className="bg-primary text-primary-foreground inline-flex rounded-full px-8 py-3.5 text-sm font-black no-underline shadow-[0_0_48px_-10px_var(--catpuccin-pink)]"
											>
												Explore 9 more landings
											</a>
										</Magnetic>
										<Magnetic strength={0.2}>
											<a
												href="/landings/neon"
												className="border-border/80 hover:border-pink/40 inline-flex rounded-full border px-7 py-3.5 text-sm font-semibold no-underline transition"
											>
												Start with Neon
											</a>
										</Magnetic>
										<Magnetic strength={0.2}>
											<a
												href="https://github.com/michaelmonetized"
												target="_blank"
												rel="noreferrer"
												className="border-border/80 hover:border-white/30 inline-flex rounded-full border px-7 py-3.5 text-sm font-semibold no-underline transition"
											>
												GitHub
											</a>
										</Magnetic>
									</div>
									<div>
										<p className="text-overlay-1 mb-3 text-[0.6rem] font-black tracking-[0.28em] uppercase">
											Featured worlds
										</p>
										<div className="grid max-w-laptop grid-cols-2 gap-3 sm:grid-cols-4">
											{featuredLandings.map((l) => (
												<a
													key={l.slug}
													href={`/landings/${l.slug}`}
													className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${l.tone} p-4 no-underline transition hover:-translate-y-0.5 hover:border-pink/35 hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)]`}
												>
													<p className="text-overlay-1 text-[0.6rem] font-bold tracking-[0.2em] uppercase">
														{l.tag}
													</p>
													<p className="mt-1 text-base font-thin tracking-tight">
														{l.title}
													</p>
													<p className="text-subtext-1 mt-2 line-clamp-2 text-[0.7rem] leading-snug opacity-80">
														{l.pitch}
													</p>
													<span className="text-pink mt-3 block text-[0.65rem] font-bold opacity-0 transition group-hover:opacity-100">
														Enter →
													</span>
												</a>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					</section>
				)
			})}

			<footer className="text-subtext-0 border-t border-white/10 px-5 py-12 text-center text-sm sm:px-8">
				<p className="m-0">
					WebGL stage · GSAP · Lenis · interactive archive ·{" "}
					<a href="/landings" className="text-pink no-underline">
						landing gallery
					</a>
				</p>
			</footer>

			<CaseStudySheet item={active} open={open} onOpenChange={setOpen} />
		</div>
	)
}
