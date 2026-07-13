import { createFileRoute, Link } from "@tanstack/react-router"
import { LANDINGS } from "#/lib/home/assets"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "#/lib/utils"

export const Route = createFileRoute("/landings/")({
	component: LandingsIndex,
	head: () => ({
		meta: [{ title: "Landing Gallery — Modern Design Playground" }],
	}),
})

/** Per-world CSS micro-theaters — not stock cards */
const WORLD_ART: Record<
	string,
	{ bg: string; accent: string; ink: string; motif: "ink" | "grid" | "lamp" | "enso" | "rain" | "folio" | "map" | "wave" | "prism" }
> = {
	editorial: {
		bg: "#1a1410",
		accent: "#e8b4a0",
		ink: "#f4ebe0",
		motif: "ink",
	},
	brutalist: {
		bg: "#e6e2d8",
		accent: "#ff2a00",
		ink: "#0a0a0a",
		motif: "grid",
	},
	noir: {
		bg: "#050505",
		accent: "#cfc6b8",
		ink: "#f0ebe3",
		motif: "lamp",
	},
	zen: {
		bg: "#0f1412",
		accent: "#7d9b8a",
		ink: "#e8efe9",
		motif: "enso",
	},
	neon: {
		bg: "#0a0614",
		accent: "#ff2bd6",
		ink: "#e8f7ff",
		motif: "rain",
	},
	paper: {
		bg: "#f3ecdf",
		accent: "#8b3a2a",
		ink: "#2a2118",
		motif: "folio",
	},
	atlas: {
		bg: "#0c1218",
		accent: "#d4a84b",
		ink: "#e8e2d4",
		motif: "map",
	},
	pulse: {
		bg: "#0a0b14",
		accent: "#5eead4",
		ink: "#e2e8f0",
		motif: "wave",
	},
	prism: {
		bg: "#0b0a12",
		accent: "#c4b5fd",
		ink: "#faf5ff",
		motif: "prism",
	},
}

/** Deterministic micro-noise dots for motif floors (no Math.random — SSR safe) */
function MotifNoise({ ink, n = 96, accent }: { ink: string; n?: number; accent?: string }) {
	return (
		<div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
			{Array.from({ length: n }, (_, i) => (
				<span
					key={i}
					className="absolute rounded-full"
					style={{
						left: `${(i * 37 + 11) % 100}%`,
						top: `${(i * 53 + 7) % 100}%`,
						width: 1 + (i % 3),
						height: 1 + ((i * 2) % 3),
						background: accent && i % 5 === 0 ? accent : ink,
						opacity: 0.16 + (i % 7) * 0.055,
						boxShadow:
							i % 8 === 0
								? `0 0 2px ${accent && i % 5 === 0 ? accent : ink}`
								: undefined,
					}}
				/>
			))}
		</div>
	)
}

/** High-freq film grain plate for card floors */
function MotifGrain() {
	return (
		<div
			className="pointer-events-none absolute inset-0 z-[1] opacity-[0.18] mix-blend-overlay"
			style={{
				backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.9'/%3E%3C/svg%3E")`,
				backgroundSize: "100px 100px",
			}}
		/>
	)
}

function WorldMotif({
	motif,
	accent,
	ink,
	hover,
}: {
	motif: (typeof WORLD_ART)[string]["motif"]
	accent: string
	ink: string
	hover: boolean
}) {
	if (motif === "ink") {
		return (
			<div className="absolute inset-0 overflow-hidden">
				{/* Dense paper plate: grain + baseline grid + multi-stain field */}
				<div
					className="absolute inset-0 opacity-95"
					style={{
						backgroundImage: `
							radial-gradient(ellipse at 18% 28%, ${accent}77 0%, transparent 48%),
							radial-gradient(ellipse at 78% 72%, ${ink}32 0%, transparent 42%),
							radial-gradient(ellipse at 50% 50%, ${accent}28 0%, transparent 60%),
							radial-gradient(ellipse at 62% 22%, ${ink}1a 0%, transparent 35%),
							radial-gradient(ellipse at 30% 80%, ${accent}18 0%, transparent 40%),
							repeating-linear-gradient(0deg, ${ink}12 0 1px, transparent 1px 5px),
							repeating-linear-gradient(90deg, ${ink}0c 0 1px, transparent 1px 8px),
							radial-gradient(${ink}1c 0.65px, transparent 0.75px)
						`,
						backgroundSize: "auto, auto, auto, auto, auto, auto, auto, 3.5px 3.5px",
					}}
				/>
				<MotifGrain />
				<MotifNoise ink={ink} accent={accent} n={110} />
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
					<div
						key={i}
						className="absolute rounded-full blur-2xl transition-all duration-700"
						style={{
							background: i % 2 === 0 ? accent : ink,
							opacity: 0.28 + (i % 3) * 0.07,
							width: 36 + i * 16,
							height: 36 + i * 16,
							left: `${3 + i * 8}%`,
							top: `${6 + (i % 6) * 12}%`,
							transform: hover ? `scale(${1.12 + i * 0.03})` : "scale(1)",
						}}
					/>
				))}
				{/* Drop-cap + dual rule columns + folio marks */}
				<div
					className="absolute top-2 left-2 font-serif text-5xl leading-none opacity-60 sm:text-6xl"
					style={{ color: accent, textShadow: `2px 2px 0 ${ink}28` }}
				>
					A
				</div>
				<div className="absolute top-3 right-2 left-12 space-y-0.5 opacity-55">
					{[94, 86, 90, 72, 88, 68, 92, 76, 84, 70, 91, 74, 87, 66, 89, 71, 93, 69].map(
						(w, i) => (
							<div
								key={i}
								className="h-px rounded-full"
								style={{
									width: `${w}%`,
									background: i % 4 === 0 ? accent : ink,
									opacity: 0.5 + (i % 3) * 0.1,
								}}
							/>
						),
					)}
				</div>
				{/* Column gutter rules */}
				<div
					className="absolute top-10 bottom-12 left-[48%] w-px opacity-25"
					style={{ background: `linear-gradient(180deg, transparent, ${ink}, transparent)` }}
				/>
				<div
					className="absolute top-12 bottom-14 left-[32%] w-px opacity-12"
					style={{ background: `linear-gradient(180deg, transparent, ${ink}, transparent)` }}
				/>
				{/* Mini plate stack denser */}
				<div className="absolute right-3 bottom-10 flex gap-1 opacity-60">
					{[0, 1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="h-11 w-7 border sm:w-8"
							style={{
								borderColor: `${accent}77`,
								background: `linear-gradient(160deg, ${accent}2a, transparent)`,
								transform: `rotate(${-8 + i * 4}deg)`,
								boxShadow: `1px 2px 0 ${ink}22`,
							}}
						/>
					))}
				</div>
				<div
					className="absolute right-3 bottom-4 font-serif text-4xl italic opacity-55 sm:text-5xl"
					style={{ color: ink }}
				>
					¶
				</div>
				<div
					className="absolute bottom-3 left-3 font-mono text-[0.4rem] tracking-[0.28em] uppercase opacity-45"
					style={{ color: accent }}
				>
					MEASURE 66 · LEAD 1.4
				</div>
			</div>
		)
	}
	if (motif === "grid") {
		// Pass DD: denser constructivist micro-floor — 16×10 brick field + triple hazard + stamps
		const bricks = Array.from({ length: 160 }, (_, i) => {
			const x = i % 16
			const y = (i / 16) | 0
			const solid = (x * 5 + y * 7) % 5 === 0 || (x + y) % 6 === 0 || (x * y) % 11 === 0
			const red = (x * 3 + y * 11) % 7 === 0 || (x + y * 3) % 13 === 0
			const yel = (x * 2 + y * 5) % 9 === 0 || (x * 4 + y) % 11 === 0
			const hatch = (x + y * 2) % 5 === 0
			return { solid, red, yel, hatch }
		})
		return (
			<div className="absolute inset-0">
				<div
					className="absolute inset-0 opacity-95"
					style={{
						backgroundImage: `
							linear-gradient(${ink}34 1px, transparent 1px),
							linear-gradient(90deg, ${ink}34 1px, transparent 1px),
							linear-gradient(${ink}14 1px, transparent 1px),
							linear-gradient(90deg, ${ink}14 1px, transparent 1px),
							repeating-linear-gradient(-45deg, ${accent}22 0 2px, transparent 2px 7px),
							repeating-linear-gradient(45deg, #ffcc0014 0 1px, transparent 1px 9px),
							radial-gradient(${ink}16 0.5px, transparent 0.65px)
						`,
						backgroundSize:
							"10px 10px, 10px 10px, 3px 3px, 3px 3px, auto, auto, 4px 4px",
					}}
				/>
				<MotifGrain />
				<MotifNoise ink={ink} accent={accent} n={72} />
				<div
					className="absolute inset-x-1.5 top-1.5 grid gap-px sm:inset-x-2 sm:top-2"
					style={{ height: "58%", gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
				>
					{bricks.map((b, i) => (
						<div
							key={i}
							className="min-h-0 transition-opacity duration-200"
							style={{
								background: b.red
									? accent
									: b.yel
										? "#ffcc00"
										: b.solid
											? ink
											: b.hatch
												? `repeating-linear-gradient(-45deg, ${ink}, ${ink} 1px, transparent 1px, transparent 3px)`
												: `${ink}1a`,
								opacity: hover || b.red || b.yel ? 1 : 0.75,
								boxShadow:
									b.solid || b.red || b.yel
										? `inset 0.5px 0.5px 0 ${ink}33, inset -0.5px -0.5px 0 #0004`
										: `inset 0 0 0 0.5px ${ink}12`,
							}}
						/>
					))}
				</div>
				{/* triple hazard tape */}
				<div
					className="absolute right-0 bottom-14 left-0 h-1 opacity-70"
					style={{
						background: `repeating-linear-gradient(45deg, #111, #111 4px, ${accent} 4px, ${accent} 8px, #ffcc00 8px, #ffcc00 12px)`,
					}}
				/>
				<div
					className="absolute right-0 bottom-12 left-0 h-1.5 opacity-85"
					style={{
						background: `repeating-linear-gradient(-45deg, ${accent}, ${accent} 5px, #ffcc00 5px, #ffcc00 10px, #111 10px, #111 15px)`,
					}}
				/>
				<div
					className="absolute right-0 bottom-9 left-0 h-2 opacity-80"
					style={{
						background: `repeating-linear-gradient(-45deg, ${accent}, ${accent} 6px, #ffcc00 6px, #ffcc00 12px, #111 12px, #111 18px)`,
					}}
				/>
				{/* constructivist corner blocks denser */}
				<div
					className="absolute top-2 right-2 size-6 opacity-85"
					style={{ background: accent, boxShadow: `3px 3px 0 #ffcc00` }}
				/>
				<div
					className="absolute top-10 right-3 size-3 opacity-75"
					style={{ background: ink }}
				/>
				<div
					className="absolute top-2 left-2 size-4 opacity-70"
					style={{ background: "#ffcc00", boxShadow: `2px 2px 0 ${accent}` }}
				/>
				<div
					className="absolute top-8 left-3 size-2 opacity-60"
					style={{ background: ink }}
				/>
				{/* bolt row */}
				<div className="absolute inset-x-3 top-[62%] flex justify-between opacity-50">
					{Array.from({ length: 12 }, (_, i) => (
						<span
							key={i}
							className="size-1.5 border"
							style={{
								borderColor: ink,
								background: i % 3 === 0 ? accent : i % 2 === 0 ? "#ffcc00" : ink,
								borderRadius: i % 2 === 0 ? "50%" : 0,
							}}
						/>
					))}
				</div>
				<p
					className="absolute right-2 bottom-2 text-3xl font-black tracking-tighter sm:text-4xl"
					style={{ color: ink, textShadow: `2px 2px 0 ${accent}66` }}
				>
					UGLY
				</p>
				<span
					className="absolute bottom-3 left-3 font-mono text-[0.4rem] font-black tracking-[0.25em] uppercase"
					style={{ background: accent, color: "#fff", padding: "1px 4px" }}
				>
					SYS.07
				</span>
				<span
					className="absolute bottom-3 left-14 font-mono text-[0.35rem] font-black tracking-[0.2em] uppercase opacity-70"
					style={{ background: ink, color: "#ffcc00", padding: "1px 3px" }}
				>
					GRID//16
				</span>
			</div>
		)
	}
	if (motif === "lamp") {
		return (
			<div className="absolute inset-0">
				{/* Dense noir: blinds + multi-lamp practicals + silhouette + film HUD */}
				<div
					className="absolute inset-0 opacity-95"
					style={{
						backgroundImage: `
							repeating-linear-gradient(180deg, transparent 0 6px, #00000080 6px 8px),
							radial-gradient(circle at 52% 38%, ${accent}88 0%, transparent 42%),
							radial-gradient(circle at 18% 70%, ${accent}40 0%, transparent 28%),
							radial-gradient(circle at 82% 55%, ${accent}32 0%, transparent 24%),
							radial-gradient(circle at 70% 22%, ${accent}22 0%, transparent 20%),
							radial-gradient(circle at 35% 50%, ${accent}18 0%, transparent 22%),
							radial-gradient(ellipse at 50% 100%, #000 0%, transparent 55%)
						`,
					}}
				/>
				<MotifGrain />
				<div
					className="absolute inset-0 transition-opacity duration-500"
					style={{
						background: `radial-gradient(circle at 52% 38%, ${accent}77 0%, transparent 38%)`,
						opacity: hover ? 1 : 0.8,
					}}
				/>
				{/* Subject silhouette + shoulder volume */}
				<div
					className="absolute bottom-[8%] left-1/2 h-[55%] w-[28%] -translate-x-1/2 opacity-60"
					style={{
						background: `linear-gradient(180deg, #0a0a0aee 0%, #050505 100%)`,
						clipPath: "polygon(30% 0%, 70% 0%, 85% 18%, 80% 100%, 20% 100%, 15% 18%)",
						filter: "blur(0.4px)",
						boxShadow: `0 0 40px #000a`,
					}}
				/>
				<div
					className="absolute bottom-[8%] left-1/2 h-[22%] w-[48%] -translate-x-1/2 opacity-40"
					style={{
						background: "linear-gradient(180deg, #0a0a0acc, transparent)",
						clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
					}}
				/>
				<div
					className="absolute top-[32%] left-1/2 h-28 w-44 -translate-x-1/2 rounded-full opacity-55 blur-2xl"
					style={{ background: accent }}
				/>
				{/* Practical lamps denser set */}
				{[
					[18, 68],
					[52, 34],
					[82, 52],
					[30, 48],
					[70, 72],
					[42, 58],
					[88, 30],
					[12, 40],
					[60, 62],
					[25, 28],
					[75, 40],
					[48, 78],
				].map(([x, y], i) => (
					<div
						key={i}
						className="absolute rounded-full"
						style={{
							left: `${x}%`,
							top: `${y}%`,
							width: 5 + (i % 3) * 3,
							height: 5 + (i % 3) * 3,
							background: accent,
							boxShadow: `0 0 ${12 + i * 3}px ${accent}, 0 0 ${22 + i * 5}px ${accent}88`,
							opacity: hover ? 0.95 : 0.75,
							transform: "translate(-50%, -50%)",
						}}
					/>
				))}
				{/* Film dust motes denser */}
				{Array.from({ length: 52 }, (_, i) => (
					<span
						key={i}
						className="absolute rounded-full"
						style={{
							width: 1 + (i % 2),
							height: 1 + (i % 2),
							left: `${5 + ((i * 17) % 90)}%`,
							top: `${8 + ((i * 23) % 78)}%`,
							background: ink,
							opacity: 0.22 + (i % 5) * 0.08,
						}}
					/>
				))}
				{/* Dual film HUD */}
				<div
					className="absolute top-2 left-2 font-mono text-[0.4rem] tracking-[0.28em] uppercase opacity-65"
					style={{ color: ink }}
				>
					TC 01:14:22:08
					<br />
					FRM 2401 · IRIS 2.8
				</div>
				<div
					className="absolute top-2 right-2 text-right font-mono text-[0.4rem] tracking-[0.28em] uppercase opacity-55"
					style={{ color: accent }}
				>
					REEL A
					<br />
					CAM 01
				</div>
				{/* Letterbox sprockets denser */}
				<div className="absolute inset-x-0 top-0 flex justify-between px-0.5 opacity-50">
					{Array.from({ length: 24 }, (_, i) => (
						<span key={i} className="mt-0.5 h-1.5 w-1 rounded-[1px] bg-black/85" />
					))}
				</div>
				<div className="absolute inset-x-0 bottom-0 flex justify-between px-0.5 opacity-50">
					{Array.from({ length: 24 }, (_, i) => (
						<span key={i} className="mb-0.5 h-1.5 w-1 rounded-[1px] bg-black/85" />
					))}
				</div>
				{/* Viewfinder corners */}
				<span className="absolute top-6 left-5 h-3 w-3 border-t border-l opacity-35" style={{ borderColor: ink }} />
				<span className="absolute top-6 right-5 h-3 w-3 border-t border-r opacity-35" style={{ borderColor: ink }} />
				<span className="absolute bottom-6 left-5 h-3 w-3 border-b border-l opacity-30" style={{ borderColor: ink }} />
				<span className="absolute right-5 bottom-6 h-3 w-3 border-r border-b opacity-30" style={{ borderColor: ink }} />
			</div>
		)
	}
	if (motif === "enso") {
		// Zen garden micro-theater: sand rings + stones + enso + season wash
		const stones = [
			[32, 58, 14],
			[58, 48, 10],
			[48, 68, 8],
			[70, 62, 7],
			[38, 42, 6],
			[64, 72, 5],
			[44, 52, 9],
			[26, 50, 5],
			[54, 38, 6],
			[72, 52, 5],
			[36, 72, 4],
		]
		return (
			<div className="absolute inset-0 overflow-hidden">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `
							radial-gradient(ellipse at 50% 55%, ${accent}3a 0%, transparent 55%),
							radial-gradient(circle at 50% 55%, transparent 22%, ${ink}12 23%, transparent 26%),
							radial-gradient(circle at 50% 55%, transparent 32%, ${ink}10 33%, transparent 36%),
							radial-gradient(circle at 50% 55%, transparent 42%, ${ink}0c 43%, transparent 46%),
							radial-gradient(circle at 50% 55%, transparent 52%, ${ink}0a 53%, transparent 56%),
							repeating-linear-gradient(95deg, transparent 0 2px, ${ink}0c 2px 3px),
							radial-gradient(${ink}16 0.55px, transparent 0.65px)
						`,
						backgroundSize: "auto, auto, auto, auto, auto, auto, 3px 3px",
					}}
				/>
				<MotifGrain />
				<MotifNoise ink={ink} accent={accent} n={68} />
				{/* Parallel rake bands denser */}
				{Array.from({ length: 18 }, (_, i) => (
					<div
						key={i}
						className="absolute left-[6%] h-px w-[88%] opacity-30"
						style={{
							top: `${16 + i * 4.4}%`,
							background: `linear-gradient(90deg, transparent, ${ink}, transparent)`,
							transform: `rotate(${-2.5 + (i % 4) * 0.8}deg)`,
						}}
					/>
				))}
				{/* Concentric sand ripples via extra rings */}
				{[14, 20, 26, 32, 38].map((r) => (
					<div
						key={r}
						className="absolute left-1/2 top-[52%] rounded-full border opacity-15"
						style={{
							width: `${r * 2}%`,
							height: `${r * 1.4}%`,
							borderColor: ink,
							transform: "translate(-50%, -50%)",
						}}
					/>
				))}
				{stones.map(([x, y, s], i) => (
					<div
						key={i}
						className="absolute rounded-full transition-transform duration-500"
						style={{
							left: `${x}%`,
							top: `${y}%`,
							width: s,
							height: s * 0.85,
							background: `radial-gradient(circle at 35% 30%, ${ink}dd, ${ink}88 55%, #0a100e)`,
							boxShadow: `0 2px 6px #0008, inset 1px 1px 0 ${accent}55`,
							transform: hover
								? `translate(-50%,-50%) scale(1.08)`
								: "translate(-50%,-50%)",
						}}
					/>
				))}
				<svg
					viewBox="0 0 200 200"
					className="absolute top-[6%] left-1/2 size-36 -translate-x-1/2 opacity-80 transition-transform duration-700 sm:size-40"
					style={{ transform: hover ? "translateX(-50%) rotate(10deg) scale(1.06)" : "translateX(-50%)" }}
				>
					<circle
						cx="100"
						cy="100"
						r="62"
						fill="none"
						stroke={accent}
						strokeWidth="7"
						strokeLinecap="round"
						strokeDasharray="340 80"
						strokeDashoffset={hover ? 18 : 0}
					/>
					<circle
						cx="100"
						cy="100"
						r="48"
						fill="none"
						stroke={ink}
						strokeWidth="0.8"
						opacity="0.28"
						strokeDasharray="6 4"
					/>
					<circle
						cx="100"
						cy="100"
						r="40"
						fill="none"
						stroke={ink}
						strokeWidth="1.2"
						opacity="0.4"
					/>
					<circle cx="100" cy="100" r="8" fill={accent} opacity="0.4" />
					<circle cx="100" cy="100" r="3" fill={ink} opacity="0.5" />
				</svg>
				<div
					className="absolute right-3 bottom-3 font-mono text-[0.4rem] tracking-[0.3em] uppercase opacity-50"
					style={{ color: accent }}
				>
					MA · BREATH
				</div>
				<div
					className="absolute bottom-3 left-3 font-mono text-[0.35rem] tracking-[0.25em] uppercase opacity-35"
					style={{ color: ink }}
				>
					VOID / FORM
				</div>
			</div>
		)
	}
	if (motif === "rain") {
		// Always-on animated rain — denser city + dual-hue streaks (never hover-gated)
		const skyline = [
			32, 48, 40, 62, 44, 56, 36, 52, 42, 58, 34, 50, 46, 60, 38, 54,
		]
		return (
			<div className="absolute inset-0 overflow-hidden">
				{/* Wet asphalt + multi-bloom sky */}
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `
							linear-gradient(180deg, #160a28 0%, #0c0718 45%, #080612 100%),
							radial-gradient(ellipse at 50% 100%, ${accent}33 0%, transparent 48%),
							radial-gradient(ellipse at 20% 30%, #00f0ff18 0%, transparent 40%),
							radial-gradient(ellipse at 80% 20%, ${accent}22 0%, transparent 35%)
						`,
					}}
				/>
				{/* Far fog bands */}
				<div
					className="absolute inset-x-0 top-[28%] h-8 opacity-25 blur-md"
					style={{
						background: `linear-gradient(90deg, transparent, ${accent}44, #00f0ff33, transparent)`,
					}}
				/>
				{/* Dense skyline silhouettes */}
				<div className="absolute inset-x-0 bottom-0 flex h-[48%] items-end justify-between gap-px px-0.5 opacity-80">
					{skyline.map((h, i) => (
						<div
							key={i}
							className="min-w-0 flex-1"
							style={{
								height: `${h + (i % 4) * 5}%`,
								background: `linear-gradient(180deg, #22143a, #0e0a1c 70%, #080612)`,
								borderLeft: `1px solid ${i % 2 === 0 ? accent : "#00f0ff"}28`,
								boxShadow:
									i % 3 === 0
										? `0 0 14px ${accent}44, inset 0 0 12px ${accent}18`
										: i % 3 === 1
											? `0 0 10px #00f0ff33`
											: undefined,
							}}
						>
							{/* denser window grid */}
							<div
								className="mt-0.5 grid grid-cols-3 gap-px p-0.5 opacity-70"
								style={{ height: "78%" }}
							>
								{Array.from({ length: 12 }, (_, w) => (
									<span
										key={w}
										style={{
											background:
												(i * 5 + w) % 5 === 0
													? accent
													: (i + w) % 4 === 0
														? "#00f0ff"
														: "#1a1040",
											opacity:
												(i * 3 + w) % 3 === 0
													? 0.95
													: (i + w) % 5 === 0
														? 0.55
														: 0.18,
											boxShadow:
												(i * 5 + w) % 5 === 0
													? `0 0 4px ${accent}`
													: undefined,
										}}
									/>
								))}
							</div>
						</div>
					))}
				</div>
				{/* Street wet sheen + multi puddles */}
				<div
					className="absolute inset-x-0 bottom-0 h-[14%] opacity-50"
					style={{
						background: `linear-gradient(180deg, transparent, #00f0ff12 40%, ${accent}18)`,
					}}
				/>
				{[
					[8, 5, 34],
					[42, 8, 26],
					[68, 4, 28],
					[22, 11, 18],
				].map(([l, b, w], i) => (
					<div
						key={i}
						className="absolute h-1.5 rounded-full opacity-45 blur-[1.5px]"
						style={{
							left: `${l}%`,
							bottom: `${b}%`,
							width: `${w}%`,
							background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? accent : "#00f0ff"}77, transparent)`,
						}}
					/>
				))}
				{/* Always-on rain field — denser dual layers (fast + slow), card-local fall */}
				{Array.from({ length: 72 }, (_, i) => (
					<span
						key={`r1-${i}`}
						className="absolute"
						style={{
							left: `${(i * 11 + 2) % 100}%`,
							top: `${-8 - (i % 7) * 4}%`,
							width: i % 6 === 0 ? 2 : 1,
							height: `${12 + (i % 7) * 5}%`,
							background: `linear-gradient(to bottom, transparent, ${i % 3 === 0 ? accent : i % 2 === 0 ? "#00f0ff" : ink}cc)`,
							animation: `gallery-rain-local ${0.55 + (i % 6) * 0.12}s linear infinite`,
							animationDelay: `${(i % 11) * 0.07}s`,
							opacity: 0.35 + (i % 5) * 0.1,
							filter: i % 3 === 0 ? `drop-shadow(0 0 2px ${accent})` : undefined,
						}}
					/>
				))}
				{Array.from({ length: 40 }, (_, i) => (
					<span
						key={`r2-${i}`}
						className="absolute"
						style={{
							left: `${(i * 17 + 7) % 100}%`,
							top: `${-12 - (i % 5) * 3}%`,
							width: 1,
							height: `${8 + (i % 4) * 4}%`,
							background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? "#00f0ff99" : `${accent}99`})`,
							animation: `gallery-rain-local ${0.9 + (i % 4) * 0.2}s linear infinite`,
							animationDelay: `${(i % 7) * 0.11}s`,
							opacity: 0.45,
						}}
					/>
				))}
				{/* Rain splash dots at street */}
				{Array.from({ length: 22 }, (_, i) => (
					<span
						key={`spl-${i}`}
						className="absolute rounded-full"
						style={{
							left: `${(i * 19 + 5) % 96}%`,
							bottom: `${4 + (i % 4) * 3}%`,
							width: 2 + (i % 2),
							height: 1,
							background: i % 2 === 0 ? accent : "#00f0ff",
							opacity: 0.35,
							animation: `gallery-splash ${0.6 + (i % 3) * 0.15}s ease-out infinite`,
							animationDelay: `${(i % 5) * 0.12}s`,
						}}
					/>
				))}
				{/* Neon signage cluster */}
				<div
					className="absolute top-2.5 left-2.5 font-black tracking-[0.22em] uppercase"
					style={{
						color: accent,
						textShadow: `0 0 10px ${accent}, 0 0 24px ${accent}, 0 0 40px ${accent}88`,
						fontSize: "0.55rem",
					}}
				>
					NIGHT
				</div>
				<div
					className="absolute top-2.5 right-2.5 font-black tracking-[0.22em] uppercase"
					style={{
						color: "#00f0ff",
						textShadow: "0 0 10px #00f0ff, 0 0 22px #00f0ff, 0 0 36px #00f0ff88",
						fontSize: "0.55rem",
					}}
				>
					MARKET
				</div>
				{/* Mid neon kanji-style bars */}
				<div className="absolute top-[36%] left-2 flex flex-col gap-0.5 opacity-70">
					{[0, 1, 2].map((i) => (
						<span
							key={i}
							className="h-3 w-1 rounded-sm"
							style={{
								background: i === 1 ? accent : "#00f0ff",
								boxShadow: `0 0 8px ${i === 1 ? accent : "#00f0ff"}`,
							}}
						/>
					))}
				</div>
				<div
					className="absolute right-2.5 bottom-2.5 font-black tracking-[0.32em] uppercase"
					style={{
						color: accent,
						textShadow: `0 0 16px ${accent}, 0 0 36px ${accent}, 0 0 48px ${accent}aa`,
						fontSize: "0.8rem",
					}}
				>
					OPEN
				</div>
				{/* Horizontal neon tube accents */}
				<div
					className="absolute top-[42%] right-[8%] h-px w-12 opacity-80"
					style={{
						background: `linear-gradient(90deg, transparent, #00f0ff, transparent)`,
						boxShadow: "0 0 10px #00f0ff",
					}}
				/>
				<div
					className="absolute top-[48%] right-[12%] h-px w-8 opacity-70"
					style={{
						background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
						boxShadow: `0 0 10px ${accent}`,
					}}
				/>
			</div>
		)
	}
	if (motif === "folio") {
		return (
			<div className="absolute inset-0 flex items-center justify-center p-5">
				{/* Desk grain under book */}
				<div
					className="absolute inset-0 opacity-90"
					style={{
						backgroundImage: `
							radial-gradient(ellipse at 40% 60%, ${accent}22 0%, transparent 50%),
							radial-gradient(ellipse at 70% 30%, ${ink}10 0%, transparent 40%),
							repeating-linear-gradient(90deg, ${ink}08 0 1px, transparent 1px 12px),
							repeating-linear-gradient(0deg, ${ink}05 0 1px, transparent 1px 18px),
							radial-gradient(${ink}12 0.6px, transparent 0.7px)
						`,
						backgroundSize: "auto, auto, auto, auto, 5px 5px",
					}}
				/>
				<MotifGrain />
				<MotifNoise ink={ink} accent={accent} n={64} />
				{/* Desk edge rule */}
				<div
					className="absolute inset-x-4 bottom-3 h-px opacity-20"
					style={{ background: `linear-gradient(90deg, transparent, ${ink}, transparent)` }}
				/>
				<div
					className="relative h-[80%] w-[72%] shadow-2xl transition-transform duration-500"
					style={{
						background: ink,
						transform: hover ? "rotateY(-20deg) rotateX(5deg)" : "rotateY(-10deg)",
						transformStyle: "preserve-3d",
						boxShadow: `8px 12px 28px #0005, 0 0 0 1px ${accent}44, 0 0 0 3px ${ink}11`,
					}}
				>
					{/* Spine gutter */}
					<div
						className="absolute inset-y-0 left-1/2 z-10 w-2.5 -translate-x-1/2"
						style={{
							background: `linear-gradient(90deg, ${ink}55, #0002, ${ink}55)`,
						}}
					/>
					<div
						className="absolute inset-y-0 left-0 w-1/2 border-r"
						style={{
							background: "linear-gradient(160deg, #faf6ee, #f0e8d8)",
							borderColor: `${accent}55`,
						}}
					>
						{/* left page type lines + drop cap */}
						<div
							className="absolute top-2.5 left-2 font-serif text-2xl leading-none opacity-55"
							style={{ color: accent }}
						>
							Aa
						</div>
						<div className="absolute top-9 right-2 left-2 space-y-1 opacity-50">
							{[90, 78, 88, 70, 84, 76, 92, 68, 86, 72, 80, 64, 88, 74, 82].map(
								(w, i) => (
									<div
										key={i}
										className="h-px"
										style={{
											width: `${w}%`,
											background: i % 5 === 0 ? accent : `${accent}99`,
										}}
									/>
								),
							)}
						</div>
						{/* folio number */}
						<span
							className="absolute bottom-2 left-2 font-serif text-[0.45rem] opacity-40"
							style={{ color: accent }}
						>
							12
						</span>
					</div>
					<div
						className="absolute inset-y-0 right-0 w-1/2"
						style={{ background: "linear-gradient(200deg, #efe6d4, #e8dcc8)" }}
					>
						<div className="absolute top-3 right-2 left-2 space-y-1 opacity-55">
							{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((n) => (
								<div
									key={n}
									className="h-px w-full"
									style={{ background: accent, opacity: 0.45 + (n % 3) * 0.08 }}
								/>
							))}
						</div>
						{/* dual ink blots */}
						<div
							className="absolute right-4 bottom-6 size-6 rounded-full opacity-35 blur-[1px]"
							style={{ background: accent }}
						/>
						<div
							className="absolute right-7 bottom-10 size-3 rounded-full opacity-25"
							style={{ background: accent }}
						/>
						<div
							className="absolute right-5 bottom-14 size-2 rounded-full opacity-20"
							style={{ background: ink }}
						/>
						<span
							className="absolute right-2 bottom-2 font-serif text-[0.45rem] opacity-40"
							style={{ color: accent }}
						>
							13
						</span>
					</div>
					{/* dog-ear */}
					<div
						className="absolute top-0 right-0 size-6"
						style={{
							background: `linear-gradient(225deg, transparent 50%, ${accent}66 50%)`,
						}}
					/>
				</div>
				{/* ribbon bookmark */}
				<div
					className="absolute top-[16%] right-[20%] h-[44%] w-1.5 opacity-75"
					style={{
						background: `linear-gradient(180deg, ${accent}, ${accent}aa 70%, ${accent}55)`,
						boxShadow: "1px 2px 4px #0003",
					}}
				/>
				{/* pen barrel */}
				<div
					className="absolute bottom-[18%] left-[12%] h-1 w-10 rotate-[-28deg] rounded-full opacity-40"
					style={{ background: `linear-gradient(90deg, ${ink}, ${accent})` }}
				/>
			</div>
		)
	}
	if (motif === "map") {
		return (
			<div className="absolute inset-0">
				{/* Cartographic density: dual graticule + landmasses + routes + pins */}
				<div
					className="absolute inset-0 opacity-95"
					style={{
						backgroundImage: `
							linear-gradient(${ink}18 1px, transparent 1px),
							linear-gradient(90deg, ${ink}18 1px, transparent 1px),
							linear-gradient(${ink}0a 1px, transparent 1px),
							linear-gradient(90deg, ${ink}0a 1px, transparent 1px),
							radial-gradient(ellipse at 35% 45%, ${accent}32 0%, transparent 40%),
							radial-gradient(ellipse at 70% 60%, ${ink}1c 0%, transparent 35%),
							radial-gradient(ellipse at 55% 25%, ${accent}14 0%, transparent 30%),
							radial-gradient(${ink}12 0.5px, transparent 0.65px)
						`,
						backgroundSize:
							"16px 16px, 16px 16px, 5px 5px, 5px 5px, auto, auto, auto, 4px 4px",
					}}
				/>
				<MotifGrain />
				<svg className="absolute inset-0 size-full opacity-80" viewBox="0 0 300 200">
					{/* landmass fills */}
					<path
						d="M30 90 C50 50, 90 40, 120 70 S170 120, 200 90 S250 40, 280 80 L280 160 L30 160 Z"
						fill={`${accent}22`}
						stroke={accent}
						strokeWidth="1"
						opacity="0.75"
					/>
					<path
						d="M50 40 C80 30, 100 50, 90 70 S40 60, 50 40"
						fill={`${ink}28`}
						stroke={ink}
						strokeWidth="0.8"
						opacity="0.55"
					/>
					<path
						d="M200 30 C230 20, 260 40, 250 60 S210 55, 200 30"
						fill={`${accent}14`}
						stroke={accent}
						strokeWidth="0.6"
						opacity="0.5"
					/>
					<path
						d="M110 140 C140 120, 170 150, 190 135 S220 160, 240 145 L240 175 L110 175 Z"
						fill={`${ink}1a`}
						stroke={ink}
						strokeWidth="0.5"
						opacity="0.45"
					/>
					{/* isobars */}
					{[30, 42, 55, 70, 85].map((r, i) => (
						<ellipse
							key={r}
							cx="150"
							cy="100"
							rx={r + 20}
							ry={r * 0.55}
							fill="none"
							stroke={ink}
							strokeWidth="0.4"
							opacity={0.12 + i * 0.035}
						/>
					))}
					{/* routes */}
					<path
						d="M20 140 C60 40, 120 180, 180 60 S260 150, 290 80"
						fill="none"
						stroke={accent}
						strokeWidth="1.6"
						strokeDasharray={hover ? "0" : "5 3"}
					/>
					<path
						d="M40 40 L80 90 L140 50 L200 120 L260 70"
						fill="none"
						stroke={ink}
						strokeWidth="1.1"
						opacity="0.55"
					/>
					<path
						d="M60 160 Q120 100 180 140 T280 100"
						fill="none"
						stroke={accent}
						strokeWidth="0.8"
						opacity="0.45"
						strokeDasharray="3 3"
					/>
					<path
						d="M30 100 L90 70 L150 110 L210 50 L270 90"
						fill="none"
						stroke={ink}
						strokeWidth="0.7"
						opacity="0.35"
						strokeDasharray="2 2"
					/>
					<path
						d="M50 150 L100 100 L160 130 L220 80 L280 120"
						fill="none"
						stroke={accent}
						strokeWidth="0.6"
						opacity="0.3"
						strokeDasharray="2 3"
					/>
					{/* pins + pulse rings denser */}
					{[
						[80, 90],
						[180, 60],
						[200, 120],
						[140, 50],
						[100, 130],
						[240, 95],
						[55, 55],
						[160, 145],
						[250, 40],
						[120, 80],
						[210, 150],
						[70, 120],
					].map(([x, y], i) => (
						<g key={i}>
							<circle
								cx={x}
								cy={y}
								r={hover ? 9 : 7}
								fill="none"
								stroke={i % 2 === 0 ? accent : ink}
								opacity="0.28"
							/>
							<circle
								cx={x}
								cy={y}
								r={hover ? 4.5 : 3}
								fill={i % 2 === 0 ? accent : ink}
								opacity={0.95}
							/>
						</g>
					))}
					{/* compass rose */}
					<g transform="translate(268,28)" opacity="0.65">
						<circle cx="0" cy="0" r="14" fill="none" stroke={ink} strokeWidth="0.6" />
						<circle cx="0" cy="0" r="9" fill="none" stroke={accent} strokeWidth="0.4" opacity="0.5" />
						<path d="M0,-12 L3,0 L0,12 L-3,0 Z" fill={accent} />
						<path d="M-12,0 L0,3 L12,0 L0,-3 Z" fill={ink} opacity="0.5" />
						<text x="0" y="-16" textAnchor="middle" fill={ink} fontSize="5" opacity="0.6">
							N
						</text>
					</g>
					{/* scale bar */}
					<g transform="translate(18,178)" opacity="0.5">
						<line x1="0" y1="0" x2="40" y2="0" stroke={ink} strokeWidth="1" />
						<line x1="0" y1="-2" x2="0" y2="2" stroke={ink} strokeWidth="0.8" />
						<line x1="20" y1="-2" x2="20" y2="2" stroke={ink} strokeWidth="0.6" />
						<line x1="40" y1="-2" x2="40" y2="2" stroke={ink} strokeWidth="0.8" />
					</g>
				</svg>
				<div
					className="absolute bottom-3 left-3 font-mono text-[0.45rem] tracking-[0.28em] uppercase opacity-70"
					style={{ color: ink }}
				>
					41°N · 74°W · FOG 0.4
				</div>
				<div
					className="absolute top-2 right-2 font-mono text-[0.4rem] tracking-[0.25em] uppercase opacity-50"
					style={{ color: accent }}
				>
					CHART 07
				</div>
			</div>
		)
	}
	if (motif === "wave") {
		// Dense EQ + dual playhead + track labels — always-on subtle bar motion
		const heights = [
			22, 38, 52, 34, 60, 46, 68, 42, 56, 32, 64, 48, 70, 36, 54, 44, 66, 30, 58, 50, 62, 40,
			52, 46, 72, 34, 48, 56, 38, 64, 44, 58, 50, 66, 42, 54, 60, 36, 48, 70, 40, 62,
		]
		return (
			<div className="absolute inset-0 overflow-hidden">
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `
							radial-gradient(ellipse at 50% 80%, ${accent}32 0%, transparent 50%),
							radial-gradient(ellipse at 20% 40%, #c084fc18 0%, transparent 40%),
							radial-gradient(ellipse at 80% 30%, #f472b614 0%, transparent 35%),
							linear-gradient(180deg, transparent 55%, #0a0b14ee 100%),
							repeating-linear-gradient(0deg, ${ink}0c 0 1px, transparent 1px 9px),
							repeating-linear-gradient(90deg, ${ink}08 0 1px, transparent 1px 12px),
							radial-gradient(${ink}14 0.5px, transparent 0.65px)
						`,
						backgroundSize: "auto, auto, auto, auto, auto, auto, 4px 4px",
					}}
				/>
				<MotifGrain />
				{/* track rails denser */}
				<div className="absolute top-2.5 left-2.5 space-y-0.5 opacity-60">
					{["KICK", "SNR", "HAT", "BASS", "PAD", "FX"].map((t, i) => (
						<div key={t} className="flex items-center gap-1">
							<span
								className="w-6 font-mono text-[0.32rem] tracking-widest"
								style={{ color: accent }}
							>
								{t}
							</span>
							<div className="flex gap-px">
								{Array.from({ length: 14 }, (_, s) => (
									<span
										key={s}
										className="h-1.5 w-1.5"
										style={{
											background:
												(i + s) % 3 === 0 ? accent : `${ink}33`,
											opacity: (i * 2 + s) % 4 === 0 ? 1 : 0.4,
											boxShadow:
												(i + s) % 3 === 0
													? `0 0 3px ${accent}88`
													: undefined,
										}}
									/>
								))}
							</div>
						</div>
					))}
				</div>
				{/* dual playheads */}
				<div
					className="absolute top-0 bottom-0 w-px opacity-75"
					style={{
						left: hover ? "62%" : "38%",
						background: `linear-gradient(180deg, transparent, ${accent}, transparent)`,
						boxShadow: `0 0 10px ${accent}`,
						transition: "left 0.4s ease",
					}}
				/>
				<div
					className="absolute top-0 bottom-0 w-px opacity-35"
					style={{
						left: hover ? "48%" : "55%",
						background: `linear-gradient(180deg, transparent, #c084fc, transparent)`,
						boxShadow: "0 0 6px #c084fc88",
						transition: "left 0.5s ease",
					}}
				/>
				<div className="absolute inset-x-0 bottom-0 flex h-[56%] items-end justify-center gap-px px-3 pb-7 sm:gap-0.5 sm:px-5">
					{heights.map((h, i) => (
						<div
							key={i}
							className="min-w-[2px] flex-1 rounded-t-sm"
							style={{
								height: `${h + (hover ? 12 : 4)}%`,
								background: `linear-gradient(to top, ${accent}, #c084fc, #f472b6, #60a5fa)`,
								opacity: 0.5 + (i % 5) * 0.09,
								animation: `gallery-bar ${0.55 + (i % 5) * 0.07}s ease-in-out infinite alternate`,
								animationDelay: `${i * 0.022}s`,
								boxShadow: i % 3 === 0 ? `0 0 6px ${accent}77` : undefined,
							}}
						/>
					))}
				</div>
				<div
					className="absolute right-3 bottom-2 font-mono text-[0.4rem] tracking-[0.28em] uppercase opacity-55"
					style={{ color: accent }}
				>
					BPM 124 · SWING
				</div>
				<div
					className="absolute bottom-2 left-3 font-mono text-[0.32rem] tracking-[0.2em] uppercase opacity-35"
					style={{ color: ink }}
				>
					16-STEP · LIVE
				</div>
			</div>
		)
	}
	// prism — denser spectral field + caustics + multi-facet gem + tall keys
	const spectrum = [
		"#f472b6",
		"#fb7185",
		"#c084fc",
		"#a78bfa",
		"#60a5fa",
		"#38bdf8",
		"#34d399",
		"#4ade80",
		"#fbbf24",
		"#f59e0b",
		"#f472b6",
		"#e879f9",
		"#c084fc",
		"#60a5fa",
		"#34d399",
		"#fb7185",
	]
	return (
		<div className="absolute inset-0 overflow-hidden">
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `
						linear-gradient(115deg, #f472b638 0%, transparent 28%, #60a5fa30 52%, #34d39928 72%, #fbbf2428 100%),
						radial-gradient(ellipse at 40% 40%, ${accent}50 0%, transparent 48%),
						radial-gradient(ellipse at 70% 65%, #60a5fa38 0%, transparent 42%),
						radial-gradient(ellipse at 20% 70%, #f472b62a 0%, transparent 40%),
						radial-gradient(ellipse at 80% 25%, #34d39920 0%, transparent 35%),
						radial-gradient(${accent}12 0.5px, transparent 0.65px)
					`,
					backgroundSize: "auto, auto, auto, auto, auto, 3.5px 3.5px",
				}}
			/>
			<MotifGrain />
			{/* Spectrum ribbon (top + bottom) */}
			<div
				className="absolute inset-x-0 top-0 h-2.5 opacity-95"
				style={{
					background:
						"linear-gradient(90deg, #f472b6, #c084fc, #60a5fa, #34d399, #fbbf24, #f472b6)",
					boxShadow: "0 0 18px #c084fc88",
				}}
			/>
			<div
				className="absolute inset-x-0 bottom-0 h-1.5 opacity-80"
				style={{
					background:
						"linear-gradient(90deg, #fbbf24, #34d399, #60a5fa, #c084fc, #f472b6, #fbbf24)",
				}}
			/>
			{/* 16-column spectral wall */}
			<div className="absolute inset-x-0 top-[16%] flex h-[54%] opacity-45">
				{spectrum.map((c, i) => (
					<div
						key={i}
						className="flex-1"
						style={{
							background: `linear-gradient(180deg, transparent, ${c}66 40%, ${c}40 70%, transparent)`,
						}}
					/>
				))}
			</div>
			{/* Caustic blobs — denser set */}
			{Array.from({ length: 18 }, (_, i) => (
				<div
					key={i}
					className="absolute rounded-full blur-xl transition-transform duration-700"
					style={{
						width: 28 + i * 9,
						height: 20 + i * 7,
						left: `${3 + i * 5.5}%`,
						top: `${10 + (i % 6) * 12}%`,
						background: spectrum[i % spectrum.length],
						opacity: 0.22 + (i % 4) * 0.05,
						transform: hover ? `scale(${1.12 + i * 0.02})` : "scale(1)",
					}}
				/>
			))}
			{/* Spectral ray lines — denser fan */}
			{Array.from({ length: 22 }, (_, i) => (
				<div
					key={i}
					className="absolute top-[42%] left-[28%] h-[2px] origin-left opacity-55"
					style={{
						width: "62%",
						background: `linear-gradient(90deg, ${spectrum[i % spectrum.length]}, transparent)`,
						transform: `rotate(${-54 + i * 5.2}deg)`,
						boxShadow: `0 0 6px ${spectrum[i % 5]}99`,
					}}
				/>
			))}
			{/* Incident beam stub */}
			<div
				className="absolute top-[40%] left-0 h-[3px] w-[28%] opacity-70"
				style={{
					background:
						"linear-gradient(90deg, transparent, rgba(255,255,255,0.85))",
					boxShadow: "0 0 14px rgba(255,255,255,0.55)",
				}}
			/>
			<div
				className="absolute top-1/2 left-[28%] size-28 -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 sm:size-32"
				style={{
					transform: hover
						? "translate(-50%,-50%) rotate(28deg) scale(1.2)"
						: "translate(-50%,-50%) rotate(14deg)",
					background: `conic-gradient(from 0deg, #f472b6, #c084fc, #60a5fa, #34d399, #fbbf24, #f472b6)`,
					clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
					filter: "saturate(1.55)",
					opacity: 0.96,
					boxShadow: `0 0 52px ${accent}88, 0 0 22px white`,
				}}
			/>
			{/* Tall mini key row */}
			<div className="absolute inset-x-2 bottom-2.5 flex h-11 gap-px opacity-90">
				{spectrum.slice(0, 16).map((c, i) => (
					<div
						key={i}
						className="relative flex-1 overflow-hidden rounded-t-md"
						style={{
							background: `linear-gradient(180deg, ${c}ee 0%, ${c}99 40%, #1a1525 100%)`,
							height: "100%",
							boxShadow:
								hover && i === 6
									? `0 0 14px ${c}, inset 0 4px 8px rgba(255,255,255,0.35)`
									: `inset 0 3px 6px rgba(255,255,255,0.22)`,
						}}
					>
						<span
							className="absolute inset-x-0 top-0 h-1/3 opacity-50"
							style={{
								background: `linear-gradient(180deg, rgba(255,255,255,0.5), transparent)`,
							}}
						/>
					</div>
				))}
			</div>
			{/* Particle motes denser */}
			{Array.from({ length: 40 }, (_, i) => (
				<div
					key={`mote-${i}`}
					className="absolute size-1 rounded-full"
					style={{
						left: `${(i * 13 + 4) % 96}%`,
						top: `${(i * 19 + 6) % 78}%`,
						background: spectrum[i % spectrum.length],
						opacity: 0.45 + (i % 3) * 0.15,
						boxShadow: `0 0 4px ${spectrum[i % 5]}`,
					}}
				/>
			))}
			<div
				className="absolute size-56 rounded-full opacity-32 blur-3xl"
				style={{
					left: "50%",
					top: "42%",
					transform: "translate(-50%,-50%)",
					background: `conic-gradient(from 90deg, ${accent}, transparent, #60a5fa, transparent, ${accent})`,
				}}
			/>
		</div>
	)
}

function WorldCard({
	l,
	i,
	active,
	onHover,
}: {
	l: (typeof LANDINGS)[number]
	i: number
	active: boolean
	onHover: (slug: string | null) => void
}) {
	const art = WORLD_ART[l.slug] ?? WORLD_ART.editorial!
	const ref = useRef<HTMLAnchorElement>(null)
	const mx = useMotionValue(0.5)
	const my = useMotionValue(0.5)
	const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 220, damping: 22 })
	const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 220, damping: 22 })

	return (
		<motion.div
			// Start visible so first paint / screenshots aren't empty mid-fade
			initial={{ opacity: 1, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: Math.min(i * 0.025, 0.18), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
			className="relative"
		>
			<Link
				ref={ref}
				to="/landings/$slug"
				params={{ slug: l.slug }}
				onMouseEnter={() => onHover(l.slug)}
				onMouseLeave={() => onHover(null)}
				onMouseMove={(e) => {
					const r = ref.current?.getBoundingClientRect()
					if (!r) return
					mx.set((e.clientX - r.left) / r.width)
					my.set((e.clientY - r.top) / r.height)
				}}
				className={cn(
					// Taller dense tiles — more motif surface for PNG density
					"group relative flex h-full min-h-[196px] flex-col overflow-hidden rounded-2xl border no-underline transition duration-500 sm:min-h-[220px] lg:min-h-[236px]",
					active
						? "border-[#f5c2e7]/50 shadow-[0_0_60px_-16px_#f5c2e7] z-[1]"
						: "border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)] hover:border-white/25",
				)}
				style={{ background: art.bg, color: art.ink }}
			>
				<motion.div
					className="absolute inset-0"
					style={{
						rotateX: rx,
						rotateY: ry,
						transformPerspective: 900,
					}}
				>
					<WorldMotif
						motif={art.motif}
						accent={art.accent}
						ink={art.ink}
						hover={active}
					/>
				</motion.div>

				{/* vignette + scan — keep motif readable; add edge chrome */}
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/15" />
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.07]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 3px)",
					}}
				/>
				{/* Corner ticks — instrument chrome */}
				<span
					className="pointer-events-none absolute top-2 left-2 size-2 border-t border-l opacity-40"
					style={{ borderColor: art.accent }}
				/>
				<span
					className="pointer-events-none absolute top-2 right-2 size-2 border-t border-r opacity-40"
					style={{ borderColor: art.accent }}
				/>
				<span
					className="pointer-events-none absolute bottom-2 left-2 size-2 border-b border-l opacity-30"
					style={{ borderColor: art.ink }}
				/>
				<span
					className="pointer-events-none absolute right-2 bottom-2 size-2 border-r border-b opacity-30"
					style={{ borderColor: art.ink }}
				/>

				<div className="relative z-10 flex h-full flex-col justify-between p-3.5 sm:p-4">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0">
							<div className="flex items-center gap-1.5">
								<span
									className="size-1.5 rounded-full"
									style={{
										background: art.accent,
										boxShadow: active ? `0 0 8px ${art.accent}` : undefined,
									}}
								/>
								<p
									className="text-[0.55rem] font-black tracking-[0.28em] uppercase"
									style={{ color: art.accent }}
								>
									{l.tag}
								</p>
							</div>
							<h2
								className="mt-1 truncate text-xl font-thin tracking-tight sm:text-2xl"
								style={{ textShadow: "0 1px 12px rgba(0,0,0,0.45)" }}
							>
								{l.title}
							</h2>
						</div>
						<div className="flex shrink-0 flex-col items-end gap-1">
							<span
								className="font-mono text-[0.55rem] tracking-widest opacity-55"
								style={{ color: art.ink }}
							>
								{String(i + 1).padStart(2, "0")}
							</span>
							{/* mini status diodes */}
							<div className="flex gap-0.5">
								{[0, 1, 2].map((d) => (
									<span
										key={d}
										className="h-1 w-2 rounded-[1px]"
										style={{
											background:
												d === 0 || active ? art.accent : `${art.ink}44`,
											opacity: d === 0 || active ? 0.9 : 0.4,
										}}
									/>
								))}
							</div>
						</div>
					</div>

					<div>
						<p
							className="line-clamp-2 max-w-measure text-[0.7rem] leading-snug opacity-80 sm:text-xs"
							style={{ color: art.ink, textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}
						>
							{l.pitch}
						</p>
						<div className="mt-2.5 flex items-center justify-between gap-2">
							<span
								className="inline-flex items-center gap-1.5 text-[0.65rem] font-black tracking-[0.16em] uppercase"
								style={{ color: art.accent }}
							>
								Enter
								<span className="transition-transform duration-300 group-hover:translate-x-1">
									→
								</span>
							</span>
							<span
								className="hidden rounded-full border px-2 py-0.5 font-mono text-[0.5rem] tracking-wider uppercase opacity-55 sm:inline"
								style={{ borderColor: `${art.ink}44`, color: art.ink }}
							>
								/{l.slug}
							</span>
						</div>
					</div>
				</div>
			</Link>
		</motion.div>
	)
}

function LandingsIndex() {
	const [hover, setHover] = useState<string | null>(null)
	const [clock, setClock] = useState(0)
	const [mounted, setMounted] = useState(false)
	const pointer = useRef({ x: 0.5, y: 0.5 })
	const [px, setPx] = useState(50)
	const [py, setPy] = useState(40)

	useEffect(() => {
		setMounted(true)
		// Force immersive dark gallery — never wash out on light system theme
		document.documentElement.classList.add("dark")
		document.documentElement.classList.remove("light")
		const id = window.setInterval(() => setClock((c) => c + 1), 80)
		return () => window.clearInterval(id)
	}, [])

	const featured = useMemo(
		() => LANDINGS.find((l) => l.slug === hover) ?? LANDINGS[0]!,
		[hover],
	)
	const art = WORLD_ART[featured.slug] ?? WORLD_ART.editorial!

	return (
		<main
			className="relative min-h-dvh overflow-hidden bg-[#0b0b12] text-[#cdd6f4]"
			onMouseMove={(e) => {
				pointer.current = {
					x: e.clientX / window.innerWidth,
					y: e.clientY / window.innerHeight,
				}
				setPx(pointer.current.x * 100)
				setPy(pointer.current.y * 100)
			}}
		>
			<style>{`
				@keyframes gallery-rain {
					0% { transform: translateY(-30px) rotate(14deg); opacity: 0; }
					20% { opacity: 0.7; }
					100% { transform: translateY(110vh) rotate(14deg); opacity: 0; }
				}
				@keyframes gallery-rain-local {
					0% { transform: translateY(0) rotate(12deg); opacity: 0; }
					12% { opacity: 0.75; }
					100% { transform: translateY(280%) rotate(12deg); opacity: 0; }
				}
				@keyframes gallery-splash {
					0%, 100% { transform: scaleX(0.4); opacity: 0; }
					40% { transform: scaleX(1.4); opacity: 0.55; }
				}
				@keyframes gallery-bar {
					from { transform: scaleY(0.85); }
					to { transform: scaleY(1.15); }
				}
				@keyframes gallery-twinkle {
					0%, 100% { opacity: 0.15; transform: scale(1); }
					50% { opacity: 0.85; transform: scale(1.4); }
				}
			`}</style>

			{/* Living ambient field — Pass DD denser mesh + bloom + starfield */}
			<div className="pointer-events-none absolute inset-0">
				<div
					className="absolute size-[65vmax] rounded-full blur-[140px] transition-all duration-700"
					style={{
						left: `${px * 0.4}%`,
						top: `${py * 0.3}%`,
						background: art.accent,
						opacity: 0.24,
					}}
				/>
				<div className="absolute top-[-15%] right-[-10%] size-[48vmax] rounded-full bg-[#89b4fa]/18 blur-[120px]" />
				<div className="absolute bottom-[-20%] left-[-10%] size-[52vmax] rounded-full bg-[#cba6f7]/16 blur-[130px]" />
				<div className="absolute top-[40%] left-[30%] size-[38vmax] rounded-full bg-[#f5c2e7]/12 blur-[100px]" />
				<div className="absolute top-[10%] left-[55%] size-[28vmax] rounded-full bg-[#94e2d5]/10 blur-[110px]" />
				<div className="absolute bottom-[15%] right-[20%] size-[24vmax] rounded-full bg-[#f9e2af]/09 blur-[90px]" />
				<div className="absolute top-[55%] right-[40%] size-[20vmax] rounded-full bg-[#f38ba8]/07 blur-[80px]" />
				{/* structural multi-mesh for PNG density */}
				<div
					className="absolute inset-0 opacity-[0.13]"
					style={{
						backgroundImage: `
							linear-gradient(#cdd6f4 1px, transparent 1px),
							linear-gradient(90deg, #cdd6f4 1px, transparent 1px)
						`,
						backgroundSize: "36px 36px",
					}}
				/>
				<div
					className="absolute inset-0 opacity-[0.07]"
					style={{
						backgroundImage: `
							linear-gradient(#cdd6f4 1px, transparent 1px),
							linear-gradient(90deg, #cdd6f4 1px, transparent 1px)
						`,
						backgroundSize: "7px 7px",
					}}
				/>
				<div
					className="absolute inset-0 opacity-[0.055]"
					style={{
						backgroundImage: `
							repeating-linear-gradient(45deg, transparent 0 12px, #cdd6f428 12px 13px),
							repeating-linear-gradient(-45deg, transparent 0 16px, #89b4fa1c 16px 17px)
						`,
					}}
				/>
				<div
					className="absolute inset-0 opacity-[0.09]"
					style={{
						backgroundImage: `radial-gradient(#cdd6f4 0.7px, transparent 0.8px)`,
						backgroundSize: "4.5px 4.5px",
					}}
				/>
				{/* film grain plate */}
				<div
					className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='ng'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23ng)' opacity='0.85'/%3E%3C/svg%3E")`,
						backgroundSize: "120px 120px",
					}}
				/>
				{/* major grid crosshairs */}
				<div
					className="absolute inset-0 opacity-[0.06]"
					style={{
						backgroundImage: `
							linear-gradient(#f5c2e7 1px, transparent 1px),
							linear-gradient(90deg, #f5c2e7 1px, transparent 1px)
						`,
						backgroundSize: "140px 140px",
						backgroundPosition: "0 0",
					}}
				/>
				{/* SSR-safe static starfield (always in first paint) */}
				{Array.from({ length: 140 }, (_, i) => (
					<span
						key={`s-${i}`}
						className="absolute rounded-full"
						style={{
							left: `${(i * 41 + 7) % 100}%`,
							top: `${(i * 29 + 13) % 100}%`,
							width: 1 + (i % 3),
							height: 1 + (i % 3),
							background:
								i % 6 === 0
									? "#f5c2e7"
									: i % 4 === 0
										? "#89b4fa"
										: i % 5 === 0
											? "#cba6f7"
											: "#ffffff",
							opacity: 0.15 + (i % 6) * 0.05,
							boxShadow:
								i % 7 === 0
									? `0 0 3px ${i % 3 === 0 ? "#f5c2e7" : "#89b4fa"}`
									: undefined,
						}}
					/>
				))}
				{/* Bright glint crosses — deterministic */}
				{Array.from({ length: 28 }, (_, i) => {
					const hue = i % 2 === 0 ? "#f5c2e7" : i % 3 === 0 ? "#cba6f7" : "#89b4fa"
					return (
						<span
							key={`g-${i}`}
							className="absolute"
							style={{
								left: `${(i * 47 + 11) % 98}%`,
								top: `${(i * 31 + 19) % 96}%`,
								width: 5 + (i % 3) * 2,
								height: 5 + (i % 3) * 2,
								opacity: 0.28 + (i % 4) * 0.08,
								boxShadow: `0 0 6px ${hue}88`,
							}}
						>
							<span
								className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
								style={{
									background: `linear-gradient(180deg, transparent, ${hue}, transparent)`,
								}}
							/>
							<span
								className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2"
								style={{
									background: `linear-gradient(90deg, transparent, ${hue}, transparent)`,
								}}
							/>
						</span>
					)
				})}
				{/* constellation lines (SVG) */}
				<svg className="absolute inset-0 size-full opacity-[0.14]" aria-hidden>
					{Array.from({ length: 36 }, (_, i) => {
						const x1 = (i * 37 + 5) % 100
						const y1 = (i * 53 + 9) % 100
						const x2 = (x1 + 8 + (i % 5) * 3) % 100
						const y2 = (y1 + 6 + (i % 4) * 4) % 100
						return (
							<line
								key={i}
								x1={`${x1}%`}
								y1={`${y1}%`}
								x2={`${x2}%`}
								y2={`${y2}%`}
								stroke={i % 3 === 0 ? art.accent : "#89b4fa"}
								strokeWidth="0.6"
							/>
						)
					})}
				</svg>
				{/* animated constellation layer — client-only drift + twinkle */}
				{mounted &&
					Array.from({ length: 130 }, (_, i) => (
						<span
							key={`a-${i}`}
							className="absolute rounded-full"
							style={{
								left: `${(i * 23 + (clock % 200) * 0.06) % 100}%`,
								top: `${(i * 37 + ((clock + i * 3) % 24) + 8) % 100}%`,
								width: 1 + (i % 4 === 0 ? 2 : i % 3),
								height: 1 + (i % 4 === 0 ? 2 : i % 3),
								background:
									i % 5 === 0
										? art.accent
										: i % 3 === 0
											? "#89b4fa"
											: i % 7 === 0
												? "#cba6f7"
												: "#ffffff",
								opacity: 0.12 + (i % 6) * 0.05,
								boxShadow:
									i % 6 === 0
										? `0 0 5px ${art.accent}`
										: i % 9 === 0
											? "0 0 4px #89b4fa"
											: undefined,
								animation:
									i % 5 === 0
										? `gallery-twinkle ${2.2 + (i % 4) * 0.4}s ease-in-out infinite`
										: undefined,
								animationDelay: `${(i % 8) * 0.2}s`,
							}}
						/>
					))}
				{/* soft vignette so cards stay primary */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0b0b12cc_100%)]" />
			</div>

			{/* Compact chrome — cards own first viewport (target: 6 visible on lg) */}
			<div className="relative mx-auto max-w-wide px-4 pt-10 pb-12 sm:px-6 lg:px-8">
				<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
					<div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1.5">
						<span className="inline-flex items-center gap-2 rounded-full bg-[#f5c2e7]/20 px-2.5 py-0.5 text-[0.58rem] font-black tracking-[0.28em] text-[#f5c2e7] uppercase">
							<span className="size-1.5 animate-pulse rounded-full bg-[#f5c2e7]" />
							Landing gallery
						</span>
						<span className="font-mono text-[0.55rem] tracking-widest text-white/40">
							09 WORLDS · LIVE
						</span>
						<h1 className="text-[clamp(1.2rem,2.6vw,1.85rem)] leading-none font-thin tracking-tight text-[#cdd6f4]">
							Nine instruments.{" "}
							<span className="bg-gradient-to-r from-[#f5c2e7] via-[#cba6f7] to-[#89b4fa] bg-clip-text text-transparent">
								Zero templates.
							</span>
						</h1>
					</div>
					<div className="flex shrink-0 flex-wrap items-center gap-2">
						<div
							className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 lg:flex"
							style={{ background: `${art.bg}cc` }}
						>
							<span className="font-mono text-[0.5rem] tracking-[0.25em] text-white/40 uppercase">
								Focus
							</span>
							<span className="text-sm font-thin" style={{ color: art.accent }}>
								{featured.title}
							</span>
							<span className="text-[0.65rem] text-white/45">{featured.tag}</span>
						</div>
						<Link
							to="/"
							className="rounded-full border border-white/15 px-4 py-1.5 text-[0.65rem] font-black tracking-widest text-white/60 no-underline uppercase transition hover:border-[#f5c2e7]/40 hover:text-[#f5c2e7]"
						>
							← Instrument
						</Link>
					</div>
				</div>

				{/* Dense 3×3 (lg) so first paint shows 6 cards; sm 2-col still packs 4 */}
				<div className="mt-4 grid grid-cols-1 gap-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:gap-3.5">
					{LANDINGS.map((l, i) => (
						<WorldCard
							key={l.slug}
							l={l}
							i={i}
							active={hover === l.slug}
							onHover={setHover}
						/>
					))}
				</div>

				<div className="text-overlay-0 mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 font-mono text-[0.55rem] tracking-[0.28em] uppercase">
					<span>Modern design playground · landings lab</span>
					<span>Hover · enter · every world is interactive</span>
				</div>
			</div>
		</main>
	)
}
