import { useEffect, useMemo, useState } from "react"
import { stage } from "#/lib/home/scroll-state"

const MARKS = [
	{ id: "origin", t: 0.12, label: "01", name: "Origin" },
	{ id: "material", t: 0.28, label: "02", name: "Material" },
	{ id: "orbit", t: 0.48, label: "03", name: "Orbit" },
	{ id: "craft", t: 0.72, label: "04", name: "Craft" },
	{ id: "signal", t: 0.9, label: "05", name: "Signal" },
] as const

function activeChapterIndex(p: number) {
	// Last mark whose threshold we've crossed (with a small lead-in)
	for (let i = MARKS.length - 1; i >= 0; i--) {
		if (p >= MARKS[i].t - 0.03) return i
	}
	return 0
}

function jumpToChapter(id: string) {
	const el = document.getElementById(id)
	if (!el) return
	el.scrollIntoView({ behavior: "smooth", block: "start" })
	// Keep hash in sync with FloatingNav anchor links without fighting Lenis
	if (history.replaceState) {
		history.replaceState(null, "", `#${id}`)
	} else {
		window.location.hash = id
	}
}

export function ScrollProgress() {
	const [p, setP] = useState(0)
	const [hovered, setHovered] = useState<string | null>(null)

	useEffect(() => {
		let raf = 0
		const tick = () => {
			setP(stage.smooth || stage.progress)
			raf = requestAnimationFrame(tick)
		}
		raf = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf)
	}, [])

	const current = useMemo(() => activeChapterIndex(p), [p])

	return (
		<>
			{/*
			  Top beam lives *under* FloatingNav (z-50) so the glass pill is never
			  bisected by the progress line. pointer-events-none keeps it inert.
			*/}
			<div
				aria-hidden
				className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px] origin-left bg-gradient-to-r from-pink via-mauve to-sapphire"
				style={{ transform: `scaleX(${Math.max(p, 0.001)})` }}
			/>
			{/*
			  Right-edge chapter rail — z below FloatingNav, above page content.
			  Container is non-interactive; only mark buttons capture clicks so the
			  center nav / stage never compete for pointer space.
			*/}
			<nav
				aria-label="Chapter progress"
				className="pointer-events-none fixed top-1/2 right-3 z-[45] hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex"
			>
				<div className="relative h-48 w-px bg-white/10">
					<div
						className="absolute inset-x-0 top-0 w-px origin-top bg-gradient-to-b from-pink via-mauve to-sapphire transition-[height] duration-150 ease-out"
						style={{ height: `${Math.max(p * 100, 1)}%` }}
					/>
					{MARKS.map((m, i) => {
						const passed = p >= m.t - 0.04
						const isCurrent = i === current
						const isHot = isCurrent || hovered === m.id
						return (
							<button
								key={m.id}
								type="button"
								onClick={() => jumpToChapter(m.id)}
								onMouseEnter={() => setHovered(m.id)}
								onMouseLeave={() => setHovered(null)}
								onFocus={() => setHovered(m.id)}
								onBlur={() => setHovered(null)}
								aria-label={`Go to ${m.name}`}
								aria-current={isCurrent ? "true" : undefined}
								className="pointer-events-auto absolute right-0 flex -translate-y-1/2 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 outline-none focus-visible:ring-1 focus-visible:ring-pink/60"
								style={{ top: `${m.t * 100}%` }}
							>
								<span
									className={`flex items-center gap-1.5 transition-all duration-300 ${
										isHot ? "translate-x-0 opacity-100" : "translate-x-1 opacity-70"
									}`}
								>
									<span
										className={`font-mono text-[0.55rem] tracking-widest transition-colors duration-300 ${
											isCurrent
												? "text-pink"
												: passed
													? "text-white/55"
													: "text-white/28"
										}`}
									>
										{m.label}
									</span>
									<span
										className={`overflow-hidden whitespace-nowrap text-[0.6rem] font-semibold tracking-wide transition-all duration-300 ${
											isHot
												? "max-w-[4.5rem] text-text opacity-100"
												: "max-w-0 text-white/40 opacity-0"
										}`}
									>
										{m.name}
									</span>
								</span>
								<span
									className={`rounded-full transition-all duration-300 ${
										isCurrent
											? "size-2.5 bg-pink shadow-[0_0_14px_var(--catpuccin-pink),0_0_28px_rgba(245,194,231,0.35)] ring-2 ring-pink/30"
											: passed
												? "size-1.5 bg-pink/70 shadow-[0_0_8px_var(--catpuccin-pink)]"
												: "size-1.5 bg-white/25 hover:bg-white/50"
									}`}
								/>
							</button>
						)
					})}
				</div>
				<span className="font-mono text-[0.5rem] tracking-[0.25em] text-white/35 tabular-nums">
					{String(Math.round(p * 100)).padStart(2, "0")}
					<span className="text-white/20"> · </span>
					<span className="text-pink/70">{MARKS[current]?.name ?? ""}</span>
				</span>
			</nav>
		</>
	)
}
