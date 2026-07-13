/**
 * Nine flagship landing experiences — each a complete art-direction thesis
 * with its own interaction language, not a skin on the same layout.
 */
import {
	useEffect,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
	type MouseEvent as ReactMouseEvent,
	type PointerEvent as ReactPointerEvent,
	type ReactNode,
} from "react"
import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
	useTransform,
} from "motion/react"
import { MEDIA } from "#/lib/home/assets"
import { LandingsShell } from "./Shell"
import { cn } from "#/lib/utils"

/* ─────────────────────────────────────────────────────────
   Shared: magnetic cursor follower for landings
───────────────────────────────────────────────────────── */
function useSmoothPointer() {
	const x = useMotionValue(0)
	const y = useMotionValue(0)
	const sx = useSpring(x, { stiffness: 120, damping: 22 })
	const sy = useSpring(y, { stiffness: 120, damping: 22 })
	useEffect(() => {
		const onMove = (e: PointerEvent) => {
			x.set(e.clientX)
			y.set(e.clientY)
		}
		window.addEventListener("pointermove", onMove, { passive: true })
		return () => window.removeEventListener("pointermove", onMove)
	}, [x, y])
	return { sx, sy, x, y }
}

/* ═══════════════════════════════════════════════════════════
   1 — EDITORIAL  ·  immersive magazine with live type column
═══════════════════════════════════════════════════════════ */
export function EditorialLanding() {
	const quotes = useMemo(
		() => [
			"Type is the architecture of attention.",
			"A pull-quote should pull blood, not decoration.",
			"White space is not empty — it is held breath.",
			"The column is a river; the image is a dam.",
			"Serifs are the furniture of a sentence.",
			"End mid-breath. Leave the product the last word.",
		],
		[],
	)
	const chapters = useMemo(
		() => [
			{
				n: "I",
				t: "The Measure",
				b: "Sixty-eight characters is not a rule — it is a tempo. Faster reading is not better reading.",
				body: "Open a periodical and you can feel the grid before you read a word. Margins hold the argument. The measure is a metronome for the eye: too wide and the line collapses into a slog; too narrow and thought stutters. On this surface we treat measure as a live control — drag it, and the prose reflows like wet ink finding a new channel.",
			},
			{
				n: "II",
				t: "The Plate",
				b: "One photograph, fully considered, outperforms a carousel of compromises.",
				body: "The plate is not decoration. It is a second column of argument — light, grain, and crop. Click the figure to change plates. Drag across it to shift the focal point. Grayscale is a choice, not a default; toggle the ink wash and watch the same face become a different thesis.",
			},
			{
				n: "III",
				t: "The Close",
				b: "End mid-breath. Leave the next sentence for the product to finish.",
				body: "A strong close refuses the neat bow. It sets a tempo, then steps aside. The pull-quote below is a revolving door — each click deposits another stain of ink and advances the folio. When you leave, the next surface inherits the residual quiet of a well-set page.",
			},
			{
				n: "IV",
				t: "The Gutter",
				b: "What lives between columns is as intentional as what fills them.",
				body: "The gutter is charged space — ma, by another name. Expand a chapter and the gutter compresses; collapse it and the page inhales. Design is the discipline of deciding which silence stays.",
			},
		],
		[],
	)
	const plates = useMemo(
		() => [
			{ src: MEDIA.cover, cap: "Plate 01 · Cover study" },
			{ src: MEDIA.headshot, cap: "Plate 02 · Presence" },
			{ src: MEDIA.folly, cap: "Plate 03 · Atmosphere" },
			{ src: MEDIA.dance, cap: "Plate 04 · Motion still" },
		],
		[],
	)

	const [quote, setQuote] = useState(0)
	const [ink, setInk] = useState(0)
	const [openCh, setOpenCh] = useState<number | null>(0)
	const [plate, setPlate] = useState(0)
	const [focus, setFocus] = useState({ x: 50, y: 40 })
	const [mono, setMono] = useState(true)
	const [cols, setCols] = useState<1 | 2>(1)
	const [leading, setLeading] = useState(1.75)
	const [measure, setMeasure] = useState(0.72)
	const [stains, setStains] = useState<
		{ id: number; x: number; y: number; s: number }[]
	>(() => [
		{ id: -1, x: 12, y: 22, s: 14 },
		{ id: -2, x: 78, y: 18, s: 10 },
		{ id: -3, x: 88, y: 72, s: 16 },
		{ id: -4, x: 28, y: 80, s: 11 },
		{ id: -5, x: 55, y: 48, s: 8 },
		{ id: -6, x: 42, y: 14, s: 9 },
		{ id: -7, x: 68, y: 58, s: 13 },
		{ id: -8, x: 8, y: 62, s: 7 },
		{ id: -9, x: 92, y: 38, s: 12 },
		{ id: -10, x: 35, y: 42, s: 6 },
		// Pass DD2 — denser first-paint ink field
		{ id: -11, x: 18, y: 48, s: 5 },
		{ id: -12, x: 72, y: 32, s: 9 },
		{ id: -13, x: 48, y: 76, s: 12 },
		{ id: -14, x: 6, y: 34, s: 8 },
		{ id: -15, x: 94, y: 58, s: 7 },
		{ id: -16, x: 60, y: 12, s: 10 },
	])
	const [dropCap, setDropCap] = useState(true)
	const [night, setNight] = useState(false)
	const stageRef = useRef<HTMLDivElement>(null)
	// static fleck field — no Math.random (SSR-safe density)
	const inkFlecks = useMemo(
		() =>
			[
				[8, 12],
				[14, 28],
				[22, 8],
				[31, 44],
				[38, 19],
				[45, 62],
				[52, 11],
				[58, 36],
				[66, 74],
				[71, 22],
				[79, 48],
				[84, 9],
				[91, 66],
				[17, 71],
				[26, 55],
				[43, 33],
				[49, 81],
				[63, 51],
				[76, 14],
				[88, 29],
				[11, 41],
				[34, 67],
				[55, 24],
				[69, 59],
				[82, 77],
				[5, 53],
				[96, 43],
				[40, 6],
				[73, 85],
				[19, 88],
			] as const,
		[],
	)

	const advanceQuote = () => {
		setQuote((q) => (q + 1) % quotes.length)
		setInk((i) => i + 1)
	}

	const dropStain = (e: ReactMouseEvent<HTMLElement>) => {
		if ((e.target as HTMLElement).closest("button,a,input,label,blockquote"))
			return
		const r = e.currentTarget.getBoundingClientRect()
		setStains((s) => [
			...s.slice(-14),
			{
				id: Date.now(),
				x: ((e.clientX - r.left) / r.width) * 100,
				y: ((e.clientY - r.top) / r.height) * 100,
				s: 8 + Math.random() * 18,
			},
		])
		setInk((i) => i + 1)
	}

	const onPlateDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (e.buttons !== 1) return
		const r = e.currentTarget.getBoundingClientRect()
		setFocus({
			x: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
			y: Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)),
		})
	}

	const paper = night ? "#1a1612" : "#efe8dc"
	const inkC = night ? "#f0e9e0" : "#14110e"

	return (
		<LandingsShell dark={night} className="transition-colors duration-500">
			<div
				ref={stageRef}
				className="relative min-h-dvh overflow-hidden"
				style={{ background: paper, color: inkC }}
				onClick={dropStain}
			>
				{/* full-bleed plate ghost — densifies first paint (active plate only) */}
				<div className="pointer-events-none absolute inset-0 opacity-[0.24]">
					<img
						src={plates[plate].src}
						alt=""
						className="h-full w-full object-cover"
						decoding="async"
						fetchPriority={plate === 0 ? "high" : "auto"}
						style={{
							objectPosition: `${focus.x}% ${focus.y}%`,
							filter: mono
								? "grayscale(1) contrast(1.28)"
								: "grayscale(0.25) contrast(1.1)",
						}}
					/>
					<div
						className="absolute inset-0"
						style={{
							background: `linear-gradient(180deg, ${paper}ee 0%, ${paper}77 28%, ${paper}aa 100%)`,
						}}
					/>
				</div>
				{/* secondary plate ghosts — magazine collage density */}
				<div className="pointer-events-none absolute inset-y-0 right-0 w-[30%] opacity-[0.18] max-sm:hidden">
					<img
						src={plates[(plate + 1) % plates.length].src}
						alt=""
						className="h-full w-full object-cover"
						loading="lazy"
						decoding="async"
						style={{
							filter: mono ? "grayscale(1) contrast(1.12)" : "contrast(1.06)",
						}}
					/>
					<div
						className="absolute inset-0"
						style={{
							background: `linear-gradient(90deg, ${paper} 0%, transparent 55%)`,
						}}
					/>
				</div>
				{/* tertiary left ghost strip — kills empty cream on masthead left */}
				<div className="pointer-events-none absolute inset-y-[12%] left-0 w-[16%] opacity-[0.11] max-sm:hidden">
					<img
						src={plates[(plate + 2) % plates.length].src}
						alt=""
						className="h-full w-full object-cover"
						loading="lazy"
						decoding="async"
						style={{
							filter: mono ? "grayscale(1) contrast(1.08)" : "contrast(1.04)",
						}}
					/>
					<div
						className="absolute inset-0"
						style={{
							background: `linear-gradient(270deg, ${paper} 0%, transparent 60%)`,
						}}
					/>
				</div>

				{/* paper fiber — dual pass for denser stock */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply"
					style={{
						backgroundImage:
							"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
					}}
				/>
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply"
					style={{
						backgroundImage:
							"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)'/%3E%3C/svg%3E\")",
					}}
				/>
				{/* ambient ink wash — richer */}
				<div
					className="pointer-events-none absolute inset-0 opacity-60 mix-blend-multiply transition-all duration-700"
					style={{
						background: `
							radial-gradient(circle at 18% ${28 + (ink % 8) * 4}%, ${night ? "#5c3d2e99" : "#2a201888"}, transparent 42%),
							radial-gradient(circle at 82% 68%, ${night ? "#3d2a1e77" : "#5c3d2e55"}, transparent 48%),
							radial-gradient(ellipse 50% 30% at 50% 0%, ${night ? "#3a2a2077" : "#8a6a4a44"}, transparent 60%),
							radial-gradient(circle at 48% 88%, ${night ? "#4a302277" : "#3a2a1e33"}, transparent 40%),
							radial-gradient(circle at 6% 50%, ${night ? "#4a302244" : "#2a201822"}, transparent 28%)
						`,
					}}
				/>
				{/* rule grid watermark */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.09]"
					style={{
						backgroundImage: `
							linear-gradient(currentColor 1px, transparent 1px),
							linear-gradient(90deg, currentColor 1px, transparent 1px)
						`,
						backgroundSize: "32px 32px",
					}}
				/>
				{/* baseline guides — denser magazine texture */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.05]"
					style={{
						backgroundImage: `repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 18px)`,
					}}
				/>
				{/* column gutters — periodical proof marks */}
				<div
					className="pointer-events-none absolute inset-y-0 left-[8%] w-px opacity-[0.08] max-sm:hidden"
					style={{
						background:
							"repeating-linear-gradient(180deg, currentColor 0 3px, transparent 3px 9px)",
					}}
				/>
				<div
					className="pointer-events-none absolute inset-y-0 right-[8%] w-px opacity-[0.08] max-sm:hidden"
					style={{
						background:
							"repeating-linear-gradient(180deg, currentColor 0 3px, transparent 3px 9px)",
					}}
				/>
				{/* crop / registration marks — print-shop density */}
				{(
					[
						["top-3 left-3", "border-t border-l"],
						["top-3 right-3", "border-t border-r"],
						["bottom-3 left-3", "border-b border-l"],
						["bottom-3 right-3", "border-b border-r"],
					] as const
				).map(([pos, borders]) => (
					<div
						key={pos}
						className={cn(
							"pointer-events-none absolute size-5 opacity-30",
							pos,
							borders,
							"border-current",
						)}
					/>
				))}
				<div className="pointer-events-none absolute top-3 left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-current opacity-25" />
				<div className="pointer-events-none absolute bottom-3 left-1/2 size-2.5 -translate-x-1/2 rounded-full border border-current opacity-25" />
				<div className="pointer-events-none absolute top-1/2 left-3 size-2.5 -translate-y-1/2 rounded-full border border-current opacity-25" />
				<div className="pointer-events-none absolute top-1/2 right-3 size-2.5 -translate-y-1/2 rounded-full border border-current opacity-25" />
				{/* micro ink flecks */}
				{inkFlecks.map(([x, y], i) => (
					<div
						key={`fleck-${i}`}
						className="pointer-events-none absolute rounded-full opacity-40 mix-blend-multiply"
						style={{
							left: `${x}%`,
							top: `${y}%`,
							width: i % 3 === 0 ? 3 : 2,
							height: i % 3 === 0 ? 3 : 2,
							background: night ? "#c4a882" : "#2a2018",
						}}
					/>
				))}
				{/* ink stains */}
				{stains.map((s) => (
					<div
						key={s.id}
						className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 mix-blend-multiply"
						style={{
							left: `${s.x}%`,
							top: `${s.y}%`,
							width: `${s.s}vmax`,
							height: `${s.s}vmax`,
							background: night
								? "radial-gradient(circle, #c4a882bb, transparent 70%)"
								: "radial-gradient(circle, #2a201899, transparent 70%)",
						}}
					/>
				))}

				<article className="relative z-10 mx-auto max-w-desktop px-5 pt-16 pb-28 sm:px-8 lg:px-12">
					{/* running head */}
					<div className="mb-3 flex items-center justify-between border-b-2 border-current/20 pb-1.5 text-[0.55rem] font-black tracking-[0.35em] uppercase opacity-50">
						<span>Modern Design Playground</span>
						<span className="hidden items-center gap-2 sm:inline-flex">
							<span className="h-px w-6 bg-current/40" />
							Folio {String(12 + quote).padStart(2, "0")}
							<span className="h-px w-6 bg-current/40" />
						</span>
						<span className="sm:hidden">
							Folio {String(12 + quote).padStart(2, "0")}
						</span>
						<span>Spring Issue · {stains.length} stains</span>
					</div>

					{/* dense masthead band — plates + type above fold */}
					<header className="grid gap-4 border-b-2 border-current/30 pb-5 lg:grid-cols-[1fr_1.05fr]">
						<div>
							<p className="text-[0.62rem] font-black tracking-[0.4em] uppercase opacity-50">
								Vol. 01 · Nº {String(quote + 1).padStart(2, "0")} · Ink deposits{" "}
								{ink} · Stains {stains.length}
							</p>
							<h1 className="mt-2 font-serif text-[clamp(2.4rem,7.5vw,4.8rem)] leading-[0.94] font-normal tracking-tight">
								The long read
								<br />
								<em className="italic opacity-65">as product surface</em>
							</h1>
							<p className="mt-2 max-w-measure text-sm leading-relaxed opacity-55">
								A periodical instrument: live measure, leading, plates, and ink
								you deposit with every click. Typography as the product.
							</p>
							{/* measure strip — always above fold */}
							<div className="mt-3 flex flex-wrap items-center gap-4 border border-current/20 bg-current/[0.03] px-3 py-2 text-[0.65rem] tracking-wide">
								<label className="flex items-center gap-2 font-black tracking-[0.15em] uppercase opacity-80">
									Measure
									<input
										type="range"
										min={0.45}
										max={1}
										step={0.01}
										value={measure}
										onClick={(e) => e.stopPropagation()}
										onChange={(e) => setMeasure(Number(e.target.value))}
										className="w-28 accent-[#5c3d2e]"
										aria-label="Measure"
									/>
								</label>
								<label className="flex items-center gap-2 font-black tracking-[0.15em] uppercase opacity-80">
									Leading
									<input
										type="range"
										min={1.35}
										max={2.2}
										step={0.05}
										value={leading}
										onClick={(e) => e.stopPropagation()}
										onChange={(e) => setLeading(Number(e.target.value))}
										className="w-28 accent-[#5c3d2e]"
										aria-label="Leading"
									/>
								</label>
								<span className="font-mono opacity-55">
									ch≈{Math.round(measure * 72)} · lh {leading.toFixed(2)}
								</span>
							</div>
						</div>
						{/* plate contact sheet — dense first paint */}
						<div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-2 lg:grid-rows-2">
							{plates.map((p, i) => (
								<button
									key={p.cap}
									type="button"
									onClick={(e) => {
										e.stopPropagation()
										setPlate(i)
										setInk((n) => n + 1)
									}}
									className={cn(
										"relative aspect-[4/3] cursor-pointer overflow-hidden border transition lg:aspect-auto lg:min-h-[104px]",
										plate === i
											? "border-current ring-1 ring-current/40 shadow-[0_0_0_1px_currentColor]"
											: "border-current/25 opacity-85 hover:opacity-100",
									)}
								>
									<img
										src={p.src}
										alt=""
										className="absolute inset-0 h-full w-full object-cover"
										loading={i === 0 ? "eager" : "lazy"}
										decoding="async"
										style={{
											filter: mono
												? "grayscale(1) contrast(1.18)"
												: "contrast(1.06) saturate(0.85)",
										}}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
									{/* plate corner crop ticks */}
									<span className="pointer-events-none absolute top-1 left-1 size-2 border-t border-l border-white/50" />
									<span className="pointer-events-none absolute top-1 right-1 size-2 border-t border-r border-white/50" />
									<p className="absolute right-1.5 bottom-1.5 left-1.5 text-left text-[0.5rem] tracking-[0.18em] text-white/90 uppercase">
										{p.cap}
									</p>
								</button>
							))}
						</div>
					</header>

					{/* tool + control strip — compact, above fold */}
					<div className="mt-3 flex flex-wrap items-center gap-1.5 border-b border-current/15 pb-3">
						{(
							[
								["Ink turn", advanceQuote],
								["Columns " + cols, () => setCols((c) => (c === 1 ? 2 : 1))],
								[mono ? "Grayscale" : "Color plate", () => setMono((m) => !m)],
								[
									dropCap ? "Drop cap on" : "Drop cap off",
									() => setDropCap((d) => !d),
								],
								[night ? "Day paper" : "Night paper", () => setNight((n) => !n)],
								["Clear stains", () => setStains([])],
							] as const
						).map(([label, fn]) => (
							<button
								key={label}
								type="button"
								onClick={(e) => {
									e.stopPropagation()
									fn()
								}}
								className="cursor-pointer border border-current/25 px-2.5 py-1 text-[0.55rem] font-black tracking-[0.2em] uppercase transition hover:bg-current/5"
							>
								{label}
							</button>
						))}
						<span className="ml-auto font-mono text-[0.58rem] opacity-45">
							click paper → stain · drag plate → focus
						</span>
					</div>

					{/* deck / kicker strip — tight above fold */}
					<div className="mt-4 grid gap-3 border-y border-current/20 py-3 sm:grid-cols-3">
						{[
							["01", "Measure", "Live column width as tempo"],
							["02", "Plate", "Four frames, fully considered"],
							["03", "Ink", "Click paper to deposit stains"],
						].map(([n, t, d]) => (
							<div key={n} className="flex gap-2.5">
								<span className="font-serif text-xl opacity-30">{n}</span>
								<div>
									<p className="text-[0.6rem] font-black tracking-[0.2em] uppercase">
										{t}
									</p>
									<p className="mt-0.5 text-xs opacity-55">{d}</p>
								</div>
							</div>
						))}
					</div>

					<div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_0.9fr]">
						{/* type column */}
						<div
							className={cn(
								"space-y-1 text-[1.05rem]",
								cols === 2 && "sm:columns-2 sm:gap-8",
							)}
							style={{
								maxWidth: cols === 1 ? `${measure * 100}%` : undefined,
								lineHeight: leading,
							}}
						>
							<p
								className={cn(
									dropCap &&
										"first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-[4.2rem] first-letter:leading-[0.8] first-letter:font-normal",
								)}
							>
								An editorial landing treats the page like a periodical:
								hierarchy, columns of thought, and a single interactive
								pull-quote you cycle like turning a leaf with intent. Click
								empty paper to deposit ink. Drag the plate to reframe the
								subject.
							</p>
							<p className="mt-5 opacity-70">
								The photograph stays — one plate at a time, fully considered —
								while the argument moves under it. Expand a chapter. Advance the
								folio. Let the measure and leading become instruments, not
								defaults.
							</p>

							{chapters.map((c, i) => {
								const open = openCh === i
								return (
									<button
										key={c.n}
										type="button"
										onClick={(e) => {
											e.stopPropagation()
											setOpenCh(open ? null : i)
											setInk((n) => n + 1)
										}}
										className="group mt-2 w-full cursor-pointer break-inside-avoid border-t border-current/15 bg-transparent py-5 text-left transition hover:bg-current/[0.03]"
									>
										<div className="flex items-baseline gap-4">
											<span className="font-serif text-3xl opacity-30 transition group-hover:opacity-70">
												{c.n}
											</span>
											<div>
												<h3 className="text-sm font-black tracking-[0.2em] uppercase">
													{c.t}
												</h3>
												<p className="mt-1 opacity-65">{c.b}</p>
											</div>
										</div>
										<AnimatePresence>
											{open && (
												<motion.p
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 0.8 }}
													exit={{ height: 0, opacity: 0 }}
													className="mt-4 overflow-hidden font-serif text-[1.02rem] italic"
												>
													{c.body}
												</motion.p>
											)}
										</AnimatePresence>
									</button>
								)
							})}
						</div>

						{/* plate */}
						<figure className="lg:sticky lg:top-24">
							<div
								className="relative aspect-[3/4] cursor-crosshair overflow-hidden border border-current/20 shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
								onPointerMove={onPlateDrag}
								onClick={(e) => {
									e.stopPropagation()
									setPlate((p) => (p + 1) % plates.length)
									setInk((i) => i + 1)
								}}
							>
								<img
									src={plates[plate].src}
									alt=""
									className="h-full w-full object-cover transition-[object-position,filter] duration-300"
									decoding="async"
									style={{
										objectPosition: `${focus.x}% ${focus.y}%`,
										filter: mono
											? "grayscale(1) contrast(1.1)"
											: "grayscale(0) contrast(1.05) saturate(0.9)",
									}}
								/>
								{/* dual rules + plate number badge */}
								<div className="pointer-events-none absolute top-3 left-3 border border-white/50 bg-black/40 px-2 py-1 text-[0.55rem] tracking-[0.25em] text-white uppercase backdrop-blur-sm">
									Plate {String(plate + 1).padStart(2, "0")}
								</div>
								<div
									className="pointer-events-none absolute size-8 -translate-x-1/2 -translate-y-1/2 border border-white/70 mix-blend-difference"
									style={{ left: `${focus.x}%`, top: `${focus.y}%` }}
								/>
								<div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3">
									<p className="text-[0.6rem] tracking-[0.25em] text-white/85 uppercase">
										Drag to focus · click to change plate
									</p>
								</div>
							</div>
							<figcaption className="mt-3 flex justify-between text-[0.65rem] tracking-wide opacity-50">
								<span>{plates[plate].cap}</span>
								<span>
									{focus.x.toFixed(0)}×{focus.y.toFixed(0)}
								</span>
							</figcaption>
							{/* plate thumbs */}
							<div className="mt-3 flex gap-2">
								{plates.map((p, i) => (
									<button
										key={p.cap}
										type="button"
										onClick={(e) => {
											e.stopPropagation()
											setPlate(i)
										}}
										className={cn(
											"aspect-[3/4] w-14 cursor-pointer overflow-hidden border transition",
											plate === i
												? "border-current opacity-100 ring-1 ring-current/30"
												: "border-current/20 opacity-50 hover:opacity-80",
										)}
									>
										<img
											src={p.src}
											alt=""
											className="h-full w-full object-cover grayscale"
											loading={i === plate ? "eager" : "lazy"}
											decoding="async"
										/>
									</button>
								))}
							</div>
							{/* sidebar note */}
							<aside className="mt-6 border-l-2 border-current/25 pl-4">
								<p className="text-[0.6rem] font-black tracking-[0.25em] uppercase opacity-40">
									Editor&apos;s note
								</p>
								<p className="mt-2 font-serif text-sm leading-relaxed italic opacity-65">
									White space is charged. Every stain is a decision. The measure
									is not a preference — it is the tempo of the argument.
								</p>
							</aside>
						</figure>
					</div>

					{/* pull quote */}
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							advanceQuote()
						}}
						className="mt-16 w-full cursor-pointer border-y-2 border-current/25 bg-transparent py-12 text-left transition hover:bg-current/[0.03]"
					>
						<p className="mb-4 text-[0.55rem] font-black tracking-[0.4em] uppercase opacity-35">
							Pull quote · folio stain
						</p>
						<AnimatePresence mode="wait">
							<motion.blockquote
								key={quote}
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="font-serif text-[clamp(1.5rem,4vw,2.6rem)] leading-snug italic"
							>
								“{quotes[quote]}”
							</motion.blockquote>
						</AnimatePresence>
						<p className="mt-5 text-[0.65rem] font-black tracking-[0.3em] uppercase opacity-45">
							Tap to turn · {quote + 1}/{quotes.length} · folio stain +1
						</p>
					</button>

					{/* colophon strip */}
					<footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-current/15 pt-6 text-[0.6rem] tracking-[0.25em] uppercase opacity-40">
						<span>Set in Max · editorial instrument</span>
						<span>
							ch≈{Math.round(measure * 72)} · lh {leading.toFixed(2)} · ink {ink}
						</span>
						<span>Click paper · drag plate · open chapters</span>
					</footer>
				</article>
			</div>
		</LandingsShell>
	)
}

/* ═══════════════════════════════════════════════════════════
   2 — BRUTALIST  ·  constructivist wrecking floor
═══════════════════════════════════════════════════════════ */
/** 0 empty · 1 solid · 2 accent (red) · 3 hatch · 4 hazard yellow */
type BCell = 0 | 1 | 2 | 3 | 4

type BrutalTool = "paint" | "erase" | "flood" | "stamp" | "slash"
const BRUTAL_TOOLS: BrutalTool[] = ["paint", "erase", "flood", "stamp", "slash"]

/** Tiny 5×7 uppercase bitmaps for grid letter-stamping */
const BRUTAL_GLYPHS: Record<string, number[]> = {
	A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
	B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
	C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
	D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
	E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
	F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
	G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01110],
	H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
	I: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
	K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
	L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
	M: [0b10001, 0b11011, 0b10101, 0b10001, 0b10001, 0b10001, 0b10001],
	N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
	O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
	P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
	R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
	S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
	T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
	U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
	V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
	W: [0b10001, 0b10001, 0b10001, 0b10001, 0b10101, 0b11011, 0b10001],
	Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
	" ": [0, 0, 0, 0, 0, 0, 0],
}

type DustBit = {
	id: number
	x: number
	y: number
	vx: number
	vy: number
	size: number
	color: string
	life: number
}

function stampTextInto(
	cells: BCell[],
	cols: number,
	rows: number,
	text: string,
	ox: number,
	oy: number,
	value: BCell = 2,
) {
	let cursorX = ox
	for (const ch of text.split("")) {
		const g = BRUTAL_GLYPHS[ch] ?? BRUTAL_GLYPHS[" "]
		for (let row = 0; row < 7; row++) {
			const bits = g[row] ?? 0
			for (let col = 0; col < 5; col++) {
				if ((bits >> (4 - col)) & 1) {
					const x = cursorX + col
					const y = oy + row
					if (x >= 0 && y >= 0 && x < cols && y < rows) {
						cells[y * cols + x] = value
					}
				}
			}
		}
		cursorX += 6
		if (cursorX > cols - 5) break
	}
}

function makeBrutalSeed(cols: number, rows: number): BCell[] {
	const total = cols * rows
	const cells = Array.from({ length: total }, (_, i) => {
		const x = i % cols
		const y = (i / cols) | 0
		// Pass DD: max first-paint constructivist mass — every cell carries structure
		const diag = Math.abs(x - y * 1.2 + 4) < 1.8
		const diag2 = Math.abs(x + y - Math.floor(cols * 0.7)) < 1.5
		const diag3 = Math.abs(x - cols + y * 1.1 - 2) < 1.4
		const diag4 = Math.abs(x - y * 0.6 - 12) < 1.1
		const diag5 = Math.abs(x * 0.9 + y - Math.floor(rows * 0.85)) < 1.2
		const diag6 = Math.abs(x - y * 1.5 + 20) < 1.0
		const diag7 = Math.abs(x + y * 0.8 - Math.floor(cols * 0.35)) < 1.15
		const frame = x === 0 || y === 0 || x === cols - 1 || y === rows - 1
		const frame2 = x === 1 || y === 1 || x === cols - 2 || y === rows - 2
		const frame3 = x === 2 || y === 2 || x === cols - 3 || y === rows - 3
		const frame4 = x === 3 || y === 3 || x === cols - 4 || y === rows - 4
		const slab = y >= 1 && y <= 6 && x >= 1 && x <= Math.floor(cols * 0.48)
		const slab2 = y >= 11 && y <= 15 && x >= Math.floor(cols * 0.55) && x <= cols - 2
		const slab3 = y >= 18 && y <= 22 && x >= 2 && x <= Math.floor(cols * 0.42)
		const bar = y === rows - 2 || y === rows - 3 || y === rows - 4
		const barTop = y === 0 || y === 1
		const barMid = y === Math.floor(rows * 0.38) || y === Math.floor(rows * 0.39)
		const skyline = y > rows - 1 - ((x * 17 + 5) % 11) - 4
		const skyline2 = y > rows - 1 - ((x * 13 + 9) % 7) - 2 && x % 2 === 0
		const skyline3 = y > rows - 1 - ((x * 19 + 3) % 9) - 3 && x % 3 === 1
		const corner = x >= cols - 12 && y >= rows - 9
		const cornerTL = x <= 10 && y <= 7
		const cornerBR = x >= cols - 9 && y >= rows - 7
		const accentCol =
			(x === 3 ||
				x === 5 ||
				x === 8 ||
				x === 12 ||
				x === cols - 4 ||
				x === cols - 6 ||
				x === cols - 9 ||
				x === cols - 12) &&
			y <= rows - 2
		const accentRow =
			(y === 2 ||
				y === 4 ||
				y === 9 ||
				y === Math.floor(rows * 0.52) ||
				y === Math.floor(rows * 0.72) ||
				y === Math.floor(rows * 0.88)) &&
			x >= 1
		const blocks = ((x / 3) | 0) % 3 === 0 && y > 5 && y < rows - 3 && (y + x) % 2 === 0
		const blocks2 = ((y / 2) | 0) % 4 === 1 && x > 4 && x < cols - 4 && (x + y * 2) % 3 === 0
		const blocks3 = ((x / 4) | 0) % 2 === 0 && y > 8 && y < rows - 5 && (x * y) % 5 === 0
		const hazardBand =
			y === 7 || y === 8 || y === 9 || y === Math.floor(rows * 0.62) || y === Math.floor(rows * 0.45)
		const hazardDiag = (x + y * 2) % 9 === 0
		const hazardDiag2 = (x * 2 + y) % 11 === 0
		const hazardDiag3 = (x * 3 + y * 2) % 13 === 0
		const checker = (x + y) % 4 === 0 && y > 10 && y < rows - 4
		const checkerFine = (x + y) % 2 === 0 && y > 3 && y < 8 && x > cols * 0.5
		const checkerWide = (x % 3 === 0 || y % 3 === 0) && y > 14 && y < rows - 5 && x < cols * 0.35
		const rivet =
			(x % 6 === 0 && y % 5 === 0) ||
			(x % 7 === 3 && y % 6 === 2) ||
			(x % 5 === 2 && y % 8 === 4) ||
			(x % 8 === 1 && y % 7 === 3)
		const rebar =
			(x % 4 === 0 && y % 3 === 1) ||
			(y % 5 === 0 && x % 3 === 2) ||
			(x % 5 === 1 && y % 4 === 2)
		const weld =
			((x * 3 + y * 5) % 13 === 0 && y > 2 && y < rows - 2) ||
			((x * 5 + y * 7) % 17 === 0 && y > 4 && y < rows - 3)
		const rust = (x * 11 + y * 13) % 19 === 0 && y > 6
		const scaffold = x % 11 === 0 && y > 2 && y < rows - 2
		if (hazardBand && x % 3 === 0) return 4 as BCell
		if (hazardDiag && y > 1 && y < rows - 2) return 4 as BCell
		if (hazardDiag2 && y > 2 && y < rows - 3) return (x % 2 === 0 ? 4 : 2) as BCell
		if (hazardDiag3 && y > 3 && y < rows - 4) return (y % 2 === 0 ? 4 : 2) as BCell
		if (rivet) return 4 as BCell
		if (weld) return (x % 3 === 0 ? 2 : 4) as BCell
		if (rust) return (x % 2 === 0 ? 2 : 3) as BCell
		if (scaffold) return (y % 3 === 0 ? 4 : 3) as BCell
		if (rebar) return 3 as BCell
		if (accentCol || accentRow) return (x % 4 === 0 ? 4 : 2) as BCell
		if (diag || diag2 || diag3 || diag4 || diag5 || diag6 || diag7)
			return (x % 4 === 0 ? 4 : x % 3 === 0 ? 2 : 1) as BCell
		if (slab || slab2 || slab3)
			return ((x + y) % 6 === 0 ? 3 : (x + y) % 5 === 0 ? 4 : 1) as BCell
		if (bar || barTop || barMid) return (x % 3 === 0 ? 4 : x % 2 === 0 ? 2 : 1) as BCell
		if (skyline || skyline2 || skyline3)
			return ((x + y) % 3 === 0 ? 3 : (x + y) % 5 === 0 ? 4 : 1) as BCell
		if (corner && (x + y) % 2 === 0) return (x % 3 === 0 ? 4 : 3) as BCell
		if (cornerTL && (x + y) % 3 !== 0) return ((x * y) % 5 === 0 ? 4 : 1) as BCell
		if (cornerBR && (x + y) % 2 === 0) return (x % 4 === 0 ? 2 : 1) as BCell
		if (blocks || blocks2 || blocks3) return (x % 5 === 0 ? 2 : 1) as BCell
		if (checker || checkerFine || checkerWide) return 3 as BCell
		if (frame) return (x + y) % 5 === 0 ? (4 as BCell) : (1 as BCell)
		if (frame2 && (x + y) % 3 === 0) return 3 as BCell
		if (frame3 && (x + y) % 4 === 0) return 4 as BCell
		if (frame4 && (x + y) % 5 === 0) return 2 as BCell
		if ((x * 5 + y * 11) % 11 < 7) return 1 as BCell
		if ((x * 3 + y * 7) % 17 < 6) return 3 as BCell
		if ((x * 7 + y * 3) % 23 < 5) return 2 as BCell
		if ((x * 11 + y * 5) % 29 < 4) return 4 as BCell
		// residual grit — zero pure empty beige on seed
		if ((x * 13 + y * 17) % 31 < 6) return 3 as BCell
		if ((x * 19 + y * 23) % 37 < 5) return 1 as BCell
		if ((x * 29 + y * 13) % 41 < 4) return 4 as BCell
		if ((x * 31 + y * 19) % 43 < 3) return 2 as BCell
		if ((x * 37 + y * 29) % 47 < 3) return 3 as BCell
		return ((x + y * 3) % 7 === 0 ? 3 : (x * y) % 11 === 0 ? 4 : 1) as BCell
	})
	// Burn slogans into seed so first paint is never empty beige
	stampTextInto(cells, cols, rows, "BUILD", 2, 4, 2)
	stampTextInto(cells, cols, rows, "UGLY", 14, 9, 1)
	stampTextInto(cells, cols, rows, "TRUE", 26, 14, 4)
	stampTextInto(cells, cols, rows, "RAW", 34, 3, 2)
	stampTextInto(cells, cols, rows, "FORM", 2, 16, 4)
	stampTextInto(cells, cols, rows, "HARD", 20, 18, 2)
	stampTextInto(cells, cols, rows, "CLUNK", 30, 20, 4)
	stampTextInto(cells, cols, rows, "VOID", 8, 22, 2)
	stampTextInto(cells, cols, rows, "GRID", 36, 12, 1)
	return cells
}

export function BrutalistLanding() {
	// Finer wrecking-floor grid — more cells = more texture mass
	const cols = 48
	const rows = 28
	const total = cols * rows
	const [cells, setCells] = useState<BCell[]>(() => makeBrutalSeed(cols, rows))
	const [stamp, setStamp] = useState("TRUE")
	const [tool, setTool] = useState<BrutalTool>("paint")
	const [brush, setBrush] = useState(1)
	const [invert, setInvert] = useState(false)
	const [hazard, setHazard] = useState(true)
	const [hits, setHits] = useState(0)
	const [poster, setPoster] = useState(0)
	const [live, setLive] = useState(true)
	const [flash, setFlash] = useState(0)
	const [shake, setShake] = useState(0)
	const [boom, setBoom] = useState(0)
	const [tick, setTick] = useState(0)
	const [dragging, setDragging] = useState(false)
	const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
	const [dust, setDust] = useState<DustBit[]>([])
	const lastCellRef = useRef(0)
	const dustIdRef = useRef(0)
	const words = ["TRUE", "RAW", "HARD", "NOW", "FORM", "VOID", "CLUNK", "GRID"]
	const posters = [
		"BUILD UGLY",
		"NO SOFT POWER",
		"TYPE AS BRICK",
		"GRID OR DIE",
		"FORM FOLLOWS FIST",
		"CONCRETE TRUTH",
	]

	// Live pulse clock for hatch shimmer + siren
	useEffect(() => {
		if (!live) return
		const id = window.setInterval(() => setTick((t) => t + 1), 180)
		return () => window.clearInterval(id)
	}, [live])

	// Dust particle lifecycle
	useEffect(() => {
		if (dust.length === 0) return
		const id = window.setInterval(() => {
			setDust((bits) =>
				bits
					.map((b) => ({
						...b,
						x: b.x + b.vx,
						y: b.y + b.vy,
						vy: b.vy + 0.35,
						life: b.life - 1,
					}))
					.filter((b) => b.life > 0),
			)
		}, 32)
		return () => window.clearInterval(id)
	}, [dust.length > 0])

	const bang = (hard = false) => {
		setFlash((f) => f + 1)
		setShake((s) => s + 1)
		if (hard) setBoom((b) => b + 1)
	}

	const spawnDust = (clientX: number, clientY: number, hard = false) => {
		const n = hard ? 18 : 10
		const bits: DustBit[] = []
		for (let i = 0; i < n; i++) {
			const ang = Math.random() * Math.PI * 2
			const sp = 1.5 + Math.random() * (hard ? 7 : 4.5)
			const roll = Math.random()
			bits.push({
				id: ++dustIdRef.current,
				x: clientX + (Math.random() - 0.5) * 6,
				y: clientY + (Math.random() - 0.5) * 6,
				vx: Math.cos(ang) * sp,
				vy: Math.sin(ang) * sp - 2,
				size: 2 + Math.random() * (hard ? 5 : 3.5),
				color: roll > 0.66 ? "#ff2a00" : roll > 0.33 ? "#ffcc00" : invert ? "#e6e2d8" : "#0a0a0a",
				life: 14 + ((Math.random() * 10) | 0),
			})
		}
		setDust((d) => [...d.slice(-40), ...bits])
	}

	const paintAt = (i: number, mode = tool) => {
		lastCellRef.current = i
		const x0 = i % cols
		const y0 = (i / cols) | 0
		const r = mode === "slash" ? 0 : brush - 1
		setCells((c) => {
			const next = c.slice() as BCell[]
			for (let dy = -r; dy <= r; dy++) {
				for (let dx = -r; dx <= r; dx++) {
					const x = x0 + dx
					const y = y0 + dy
					if (x < 0 || y < 0 || x >= cols || y >= rows) continue
					if (dx * dx + dy * dy > r * r + 0.5) continue
					const j = y * cols + x
					if (mode === "erase") next[j] = 0
					else if (mode === "paint") next[j] = 1
					else if (mode === "slash") {
						// thick diagonal slash through point (red + yellow hazard edge)
						for (let k = -8; k <= 8; k++) {
							const sx = x0 + k
							const sy = y0 + k
							if (sx >= 0 && sy >= 0 && sx < cols && sy < rows)
								next[sy * cols + sx] = k % 3 === 0 ? 4 : 2
							const sx2 = x0 + k
							const sy2 = y0 - k
							if (sx2 >= 0 && sy2 >= 0 && sx2 < cols && sy2 < rows && Math.abs(k) < 3)
								next[sy2 * cols + sx2] = 1
						}
					} else next[j] = 1
				}
			}
			return next
		})
		setHits((h) => h + 1)
	}

	const stampWord = (origin: number) => {
		lastCellRef.current = origin
		const ox = origin % cols
		const oy = (origin / cols) | 0
		const letters = stamp.split("")
		setCells((c) => {
			const next = c.slice() as BCell[]
			let cursorX = ox
			for (const ch of letters) {
				const g = BRUTAL_GLYPHS[ch] ?? BRUTAL_GLYPHS[" "]
				for (let row = 0; row < 7; row++) {
					const bits = g[row] ?? 0
					for (let col = 0; col < 5; col++) {
						if ((bits >> (4 - col)) & 1) {
							const x = cursorX + col
							const y = oy + row
							if (x >= 0 && y >= 0 && x < cols && y < rows) {
								next[y * cols + x] = row === 0 || row === 6 ? 4 : 2
							}
						}
					}
				}
				cursorX += 6
			}
			return next
		})
		setHits((h) => h + stamp.length * 8)
		bang(true)
	}

	const floodFill = (start: number) => {
		lastCellRef.current = start
		const target = cells[start]
		const fill: BCell = target === 0 ? 1 : 0
		const next = cells.slice() as BCell[]
		const stack = [start]
		const seen = new Set<number>()
		while (stack.length) {
			const i = stack.pop()!
			if (seen.has(i) || i < 0 || i >= total) continue
			if (next[i] !== target) continue
			seen.add(i)
			next[i] = fill
			const x = i % cols
			const y = (i / cols) | 0
			if (x > 0) stack.push(i - 1)
			if (x < cols - 1) stack.push(i + 1)
			if (y > 0) stack.push(i - cols)
			if (y < rows - 1) stack.push(i + cols)
		}
		setCells(next)
		setHits((h) => h + seen.size)
		bang(true)
	}

	const pattern = (
		kind: "checker" | "stripe" | "noise" | "clear" | "full" | "diag" | "city" | "seed",
	) => {
		setCells(
			Array.from({ length: total }, (_, i) => {
				const x = i % cols
				const y = (i / cols) | 0
				if (kind === "clear") return 0 as BCell
				if (kind === "full") return 1 as BCell
				if (kind === "seed") return makeBrutalSeed(cols, rows)[i]!
				if (kind === "checker") return ((x + y) % 2 === 0 ? 1 : 0) as BCell
				if (kind === "stripe")
					return (x % 4 === 0 ? 4 : x % 3 === 0 ? 1 : x % 3 === 1 ? 3 : 0) as BCell
				if (kind === "diag")
					return (Math.abs((x - y + cols) % 5) < 2
						? (y % 4 === 0 ? 2 : y % 3 === 0 ? 4 : 1)
						: 0) as BCell
				if (kind === "city") {
					const h = ((x * 17 + 3) % 9) + 3
					if (y > rows - 1 - h) return (x % 3 === 0 ? 4 : x % 2 === 0 ? 1 : 3) as BCell
					if (y === rows - 1 - h && x % 3 === 0) return 2
					return 0 as BCell
				}
				const r = Math.random()
				if (r > 0.7) return 1
				if (r > 0.58) return 2
				if (r > 0.48) return 3
				if (r > 0.4) return 4
				return 0
			}),
		)
		bang()
	}

	const demolish = () => {
		// Cascade: knock cells down column-by-column with accent debris
		let step = 0
		const id = window.setInterval(() => {
			setCells((c) => {
				const next = c.slice() as BCell[]
				const col = step % cols
				for (let y = rows - 1; y >= 0; y--) {
					const j = y * cols + col
					if (next[j] !== 0) {
						// fall down
						if (y < rows - 1 && next[j + cols] === 0) {
							next[j + cols] = next[j]!
							next[j] = 0
						} else if (Math.random() > 0.7) {
							const roll = Math.random()
							next[j] = roll > 0.66 ? 2 : roll > 0.33 ? 4 : 0
						}
					}
				}
				return next
			})
			step++
			if (step > cols * 3) {
				window.clearInterval(id)
				bang(true)
			}
		}, 28)
		setHits((h) => h + 40)
	}

	const wreckingBall = () => {
		// Circular crater of accent + solid ring
		const cx = 8 + ((Math.random() * (cols - 16)) | 0)
		const cy = 4 + ((Math.random() * (rows - 8)) | 0)
		const rad = 3 + ((Math.random() * 3) | 0)
		setCells((c) => {
			const next = c.slice() as BCell[]
			for (let y = 0; y < rows; y++) {
				for (let x = 0; x < cols; x++) {
					const d = Math.hypot(x - cx, y - cy)
					const j = y * cols + x
					if (d < rad - 0.5) next[j] = 0
					else if (d < rad + 0.6) next[j] = (x + y) % 2 === 0 ? 2 : 4
					else if (d < rad + 1.8 && Math.random() > 0.4) next[j] = 1
				}
			}
			return next
		})
		setHits((h) => h + 25)
		bang(true)
	}

	const burnPoster = () => {
		// Stamp current poster slogan as giant type into the grid
		const text = posters[poster]!.replace(/\s+/g, " ")
		const ox = 1
		const oy = 4
		setCells((c) => {
			const next = c.map((v) => (v === 2 || v === 4 ? 1 : v)) as BCell[]
			let cursorX = ox
			for (const ch of text.split("")) {
				const g = BRUTAL_GLYPHS[ch] ?? BRUTAL_GLYPHS[" "]
				for (let row = 0; row < 7; row++) {
					const bits = g[row] ?? 0
					for (let col = 0; col < 5; col++) {
						if ((bits >> (4 - col)) & 1) {
							const x = cursorX + col
							const y = oy + row
							if (x >= 0 && y >= 0 && x < cols && y < rows) {
								next[y * cols + x] = col === 0 || col === 4 ? 4 : 2
							}
						}
					}
				}
				cursorX += 6
				if (cursorX > cols - 5) break
			}
			// fill background density so frame never looks empty
			for (let i = 0; i < total; i++) {
				if (next[i] === 0 && (i * 13) % 19 < 3) next[i] = 3
				if (next[i] === 0 && (i * 17) % 41 < 2) next[i] = 4
			}
			return next
		})
		bang(true)
	}

	// Keyboard: 1-5 tools · R reseed · Space flood last cell
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const t = e.target as HTMLElement | null
			if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))
				return
			if (e.key >= "1" && e.key <= "5") {
				const idx = Number(e.key) - 1
				const nextTool = BRUTAL_TOOLS[idx]
				if (nextTool) setTool(nextTool)
				return
			}
			if (e.key === "r" || e.key === "R") {
				e.preventDefault()
				pattern("seed")
				return
			}
			if (e.key === " " || e.code === "Space") {
				e.preventDefault()
				floodFill(lastCellRef.current)
			}
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	})

	const filled = cells.filter((c) => c > 0).length
	const density = Math.round((filled / total) * 100)
	const bg = invert ? "#0a0a0a" : "#e6e2d8"
	const fg = invert ? "#e6e2d8" : "#0a0a0a"
	const accent = "#ff2a00"
	const hazardY = "#ffcc00"
	const siren = live && density > 55 && tick % 2 === 0
	const highDensity = density > 52

	const bevel = (lit: string, shade: string) =>
		`inset 1px 1px 0 ${lit}, inset -1px -1px 0 ${shade}, inset 0 0 0 1px ${fg}33`

	const cellStyle = (v: BCell, i: number): CSSProperties => {
		const x = i % cols
		const y = (i / cols) | 0
		const flicker = live && v === 3 && (x + y + tick) % 5 === 0
		const speckA = 18 + ((x * 13 + y * 7) % 60)
		const speckB = 42 + ((x * 5 + y * 17) % 40)
		const speckC = 12 + ((x * 11 + y * 19) % 55)
		const px = 12 + (x % 7) * 11
		const py = 14 + (y % 6) * 12
		const px2 = 48 + (y % 5) * 9
		const py2 = 52 + (x % 4) * 11
		const px3 = 72 + (x % 3) * 8
		const py3 = 28 + (y % 7) * 9
		const px4 = 8 + (x % 9) * 9
		const py4 = 80 + (y % 5) * 3
		const px5 = 88 + (y % 4) * 2
		const py5 = 12 + (x % 8) * 8
		// empty cells: multi-speck concrete so PNG can't compress to flat beige
		if (v === 0) {
			const base = invert
				? `linear-gradient(135deg, #1a1a1a 0%, #0c0c0c ${speckA}%, #141414 ${speckC}%, #101010 100%)`
				: `linear-gradient(135deg, #e2dccf 0%, #c8c0b0 ${speckA}%, #d4cec0 ${speckB}%, #bdb6a6 ${speckC}%, #d8d2c4 100%)`
			return {
				backgroundImage: `
					radial-gradient(circle at ${px}% ${py}%, ${fg}30 0.4px, transparent 0.85px),
					radial-gradient(circle at ${px2}% ${py2}%, ${fg}24 0.35px, transparent 0.75px),
					radial-gradient(circle at ${px3}% ${py3}%, ${accent}22 0.35px, transparent 0.7px),
					radial-gradient(circle at ${px4}% ${py4}%, ${hazardY}18 0.3px, transparent 0.65px),
					radial-gradient(circle at ${px5}% ${py5}%, ${fg}1c 0.28px, transparent 0.6px),
					radial-gradient(circle at ${30 + (y % 4) * 14}% ${65 + (x % 5) * 6}%, ${hazardY}16 0.3px, transparent 0.65px),
					repeating-linear-gradient(${35 + (x % 3) * 20}deg, transparent, transparent 2px, ${fg}0c 2px, ${fg}0c 3px),
					repeating-linear-gradient(${-20 + (y % 4) * 15}deg, transparent, transparent 3px, ${fg}08 3px, ${fg}08 4px),
					${base}
				`,
				boxShadow: `inset 0 0 0 1px ${fg}1c, inset 1px 1px 0 ${fg}14, inset -1px -1px 0 ${fg}0c, inset 0 -2px 0 ${fg}0a`,
			}
		}
		if (v === 2)
			return {
				backgroundImage: `
					radial-gradient(circle at 28% 22%, #ff9a7aaa 0%, transparent 42%),
					radial-gradient(circle at ${px}% ${py}%, #fff5 0.45px, transparent 0.85px),
					radial-gradient(circle at ${px2}% ${py2}%, #0006 0.4px, transparent 0.75px),
					radial-gradient(circle at ${px3}% ${py3}%, #0004 0.35px, transparent 0.7px),
					radial-gradient(circle at ${px4}% ${py4}%, #ffcc0030 0.3px, transparent 0.65px),
					radial-gradient(circle at ${px5}% ${py5}%, #fff3 0.28px, transparent 0.55px),
					repeating-linear-gradient(90deg, transparent, transparent 3px, #0003 3px, #0003 4px),
					repeating-linear-gradient(0deg, transparent, transparent 4px, #0002 4px, #0002 5px),
					linear-gradient(145deg, #ff5a32 0%, ${accent} 28%, #e02200 48%, #cc2200 68%, #8a1400 100%)
				`,
				boxShadow: `${bevel("#ff8a6a", "#6a1000")}, 0 0 0 0.5px #ff2a0044, inset 0 -2px 0 #0004`,
			}
		if (v === 4)
			return {
				backgroundImage:
					live && (x + tick) % 7 === 0
						? `repeating-linear-gradient(-45deg, ${hazardY}, ${hazardY} 2px, #111 2px, #111 5px),
						   radial-gradient(circle at ${px}% ${py}%, #fff6 0.4px, transparent 0.7px),
						   radial-gradient(circle at ${px2}% ${py2}%, #0004 0.3px, transparent 0.6px)`
						: `
						radial-gradient(circle at 25% 28%, #fff8bb99 0%, transparent 38%),
						radial-gradient(circle at ${px}% ${py}%, #fff6 0.4px, transparent 0.75px),
						radial-gradient(circle at ${px2}% ${py2}%, #0004 0.35px, transparent 0.7px),
						radial-gradient(circle at ${px3}% ${py3}%, #a0800020 0.4px, transparent 0.75px),
						radial-gradient(circle at ${px4}% ${py4}%, #fff4 0.3px, transparent 0.6px),
						radial-gradient(circle at ${px5}% ${py5}%, #0003 0.28px, transparent 0.55px),
						repeating-linear-gradient(-45deg, transparent, transparent 3px, #0002 3px, #0002 4px),
						repeating-linear-gradient(45deg, transparent, transparent 4px, #0001 4px, #0001 5px),
						linear-gradient(145deg, #ffe88a 0%, ${hazardY} 32%, #f0c400 55%, #d4a800 78%, #a88800 100%)
					`,
				boxShadow: `${bevel("#fff2aa", "#886600")}, 0 0 0 0.5px #ffcc0044, inset 0 -2px 0 #0003`,
			}
		if (v === 3) {
			const hatchBg: string = flicker
				? `linear-gradient(0deg, ${accent}, ${accent})`
				: [
						`radial-gradient(circle at ${px}% ${py}%, ${accent}4a 0.4px, transparent 0.75px)`,
						`radial-gradient(circle at ${px2}% ${py2}%, ${hazardY}38 0.35px, transparent 0.7px)`,
						`radial-gradient(circle at ${px3}% ${py3}%, ${fg}28 0.3px, transparent 0.65px)`,
						`radial-gradient(circle at ${px4}% ${py4}%, ${accent}22 0.28px, transparent 0.55px)`,
						`radial-gradient(circle at ${px5}% ${py5}%, ${fg}18 0.25px, transparent 0.5px)`,
						`repeating-linear-gradient(-45deg, ${fg}, ${fg} 1.2px, transparent 1.2px, transparent 3.5px)`,
						`repeating-linear-gradient(45deg, ${hazardY}55, ${hazardY}55 1px, transparent 1px, transparent 4.5px)`,
						`repeating-linear-gradient(0deg, transparent, transparent 2px, ${fg}14 2px, ${fg}14 3px)`,
						`repeating-linear-gradient(90deg, transparent, transparent 3px, ${fg}0c 3px, ${fg}0c 4px)`,
						`linear-gradient(160deg, ${invert ? "#222" : "#d0c8b8"}, ${invert ? "#121212" : "#a8a090"} 55%, ${invert ? "#0a0a0a" : "#b8b0a0"})`,
					].join(",")
			return {
				backgroundImage: hatchBg,
				boxShadow: `${bevel(`${fg}66`, `${fg}88`)}, inset 0 0 0 0.5px ${fg}33`,
			}
		}
		// solid brick with micro-bevel + aggregate noise + mortar seams + occasional live pulse
		const mortar = (x + y) % 3 === 0
		const hi = invert ? "#fff4" : "#fff3"
		const lo = invert ? "#0007" : "#0006"
		const lo2 = invert ? "#0005" : "#0004"
		const lo3 = invert ? "#0008" : "#0006"
		const brickTop = invert ? "#444" : "#333"
		const brickMid = invert ? "#2a2a2a" : "#1c1c1c"
		const brickDeep = invert ? "#151515" : "#0d0d0d"
		const brickEdge = invert ? "#2e2e2e" : "#1a1a1a"
		const brickBg: string = [
			`radial-gradient(circle at ${px}% ${py}%, ${hi} 0.4px, transparent 0.85px)`,
			`radial-gradient(circle at ${px2}% ${py2}%, ${accent}28 0.35px, transparent 0.7px)`,
			`radial-gradient(circle at ${px3}% ${py3}%, ${hazardY}18 0.3px, transparent 0.65px)`,
			`radial-gradient(circle at ${px4}% ${py4}%, ${lo} 0.35px, transparent 0.7px)`,
			`radial-gradient(circle at ${px5}% ${py5}%, #fff2 0.28px, transparent 0.55px)`,
			`radial-gradient(circle at ${22 + (x % 5) * 14}% ${70 + (y % 3) * 8}%, ${lo2} 0.45px, transparent 0.8px)`,
			`linear-gradient(90deg, transparent 38%, ${lo2} 50%, transparent 62%)`,
			`linear-gradient(0deg, transparent 42%, #fff1 50%, transparent 58%)`,
			mortar
				? `repeating-linear-gradient(0deg, transparent, transparent 45%, ${lo3} 48%, transparent 52%)`
				: "",
			`repeating-linear-gradient(${(x * 17 + y * 11) % 90}deg, transparent, transparent 5px, #fff1 5px, #fff1 6px)`,
			`linear-gradient(160deg, ${brickTop} 0%, ${brickMid} 22%, ${fg} 42%, ${brickDeep} 68%, ${brickEdge} 88%, ${fg} 100%)`,
		]
			.filter(Boolean)
			.join(",")
		return {
			backgroundImage: brickBg,
			opacity: live && (i + tick) % 23 === 0 ? 0.78 : 1,
			boxShadow: `${bevel(invert ? "#777" : "#555", invert ? "#000" : "#000000cc")}, inset 0 -1px 0 ${lo3}`,
		}
	}

	const hitCell = (i: number, e?: { clientX: number; clientY: number }) => {
		lastCellRef.current = i
		const hard = tool === "flood" || tool === "stamp" || tool === "slash"
		if (e) spawnDust(e.clientX, e.clientY, hard)
		if (tool === "flood") floodFill(i)
		else if (tool === "stamp") stampWord(i)
		else paintAt(i)
	}

	// LED strip — 16 status diodes driven by density / hits / tick
	const leds = Array.from({ length: 16 }, (_, i) => {
		const thr = ((i + 1) / 16) * 100
		const on = density >= thr - 4
		const warn = thr > 55
		const pulse = live && on && (tick + i) % 4 === 0
		return { on, warn, pulse, i }
	})

	return (
		<LandingsShell dark={invert} className="h-dvh max-h-dvh overflow-hidden">
			<div
				className="relative flex h-dvh max-h-dvh flex-col overflow-hidden px-1.5 pt-12 pb-1 sm:px-2 sm:pt-13"
				style={{
					background: bg,
					color: fg,
					backgroundImage: `
						radial-gradient(ellipse 80% 50% at 20% 10%, ${accent}28, transparent 50%),
						radial-gradient(ellipse 50% 40% at 70% 20%, ${hazardY}18, transparent 45%),
						radial-gradient(ellipse 60% 40% at 90% 80%, ${fg}14, transparent 45%),
						radial-gradient(ellipse 40% 30% at 40% 70%, ${accent}12, transparent 50%),
						radial-gradient(${fg}10 0.55px, transparent 0.7px),
						repeating-linear-gradient(0deg, transparent, transparent 2px, ${fg}08 2px, ${fg}08 3px),
						repeating-linear-gradient(90deg, transparent, transparent 3px, ${fg}05 3px, ${fg}05 4px),
						repeating-linear-gradient(45deg, transparent, transparent 11px, ${fg}06 11px, ${fg}06 12px)
					`,
					backgroundSize:
						"auto, auto, auto, auto, 4px 4px, auto, auto, auto",
				}}
			>
				{hazard && (
					<>
						<motion.div
							className="pointer-events-none absolute inset-x-0 top-11 z-20 h-2 sm:top-12 sm:h-2.5"
							animate={{ backgroundPositionX: ["0px", "40px"] }}
							transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
							style={{
								background: `repeating-linear-gradient(-45deg, ${accent}, ${accent} 8px, ${hazardY} 8px, ${hazardY} 16px, #111 16px, #111 24px)`,
								backgroundSize: "48px 100%",
							}}
						/>
						<motion.div
							className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2 sm:h-2.5"
							animate={{ backgroundPositionX: ["40px", "0px"] }}
							transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
							style={{
								background: `repeating-linear-gradient(45deg, ${hazardY}, ${hazardY} 8px, ${accent} 8px, ${accent} 16px, #111 16px, #111 24px)`,
								backgroundSize: "48px 100%",
							}}
						/>
						{/* Side hazard rails for extra edge mass */}
						<div
							className="pointer-events-none absolute top-14 bottom-2 left-0 z-20 w-1.5 opacity-80"
							style={{
								background: `repeating-linear-gradient(0deg, ${accent}, ${accent} 6px, ${hazardY} 6px, ${hazardY} 12px, #111 12px, #111 18px)`,
							}}
						/>
						<div
							className="pointer-events-none absolute top-14 bottom-2 right-0 z-20 w-1.5 opacity-80"
							style={{
								background: `repeating-linear-gradient(0deg, ${hazardY}, ${hazardY} 6px, ${accent} 6px, ${accent} 12px, #111 12px, #111 18px)`,
							}}
						/>
					</>
				)}

				<div
					className="pointer-events-none absolute -right-8 top-10 z-0 h-[120%] w-14 origin-top rotate-12 opacity-90 sm:w-24"
					style={{
						background: `repeating-linear-gradient(-45deg, ${accent}, ${accent} 12px, ${hazardY} 12px, ${hazardY} 24px)`,
					}}
				/>
				<div
					className="pointer-events-none absolute -left-6 bottom-8 z-0 h-[50%] w-10 origin-bottom -rotate-12 opacity-70 sm:w-16"
					style={{
						background: `repeating-linear-gradient(45deg, ${hazardY}, ${hazardY} 10px, #111 10px, #111 20px)`,
					}}
				/>
				{/* Background grit flecks (page-level, behind instrument) */}
				<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
					{Array.from({ length: 80 }, (_, i) => (
						<span
							key={`pg-${i}`}
							className="absolute"
							style={{
								left: `${(i * 41 + 3) % 100}%`,
								top: `${(i * 29 + 17) % 100}%`,
								width: 1 + (i % 3),
								height: 1 + ((i * 3) % 3),
								background:
									i % 4 === 0 ? accent : i % 3 === 0 ? hazardY : fg,
								opacity: 0.18 + (i % 5) * 0.08,
								transform: `rotate(${(i * 23) % 80}deg)`,
							}}
						/>
					))}
				</div>

				{/* Click particle dust (fixed-layer DOM burst) */}
				<div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
					{dust.map((b) => (
						<span
							key={b.id}
							className="absolute block rounded-[1px]"
							style={{
								left: b.x,
								top: b.y,
								width: b.size,
								height: b.size * (0.65 + (b.id % 5) * 0.08),
								background: b.color,
								opacity: Math.min(1, b.life / 10),
								transform: `rotate(${(b.id * 37) % 90}deg)`,
								boxShadow: `0 0 2px ${b.color}`,
							}}
						/>
					))}
				</div>

				<AnimatePresence>
					{flash > 0 && (
						<motion.div
							key={flash}
							initial={{ opacity: 0.45 }}
							animate={{ opacity: 0 }}
							transition={{ duration: 0.28 }}
							className="pointer-events-none fixed inset-0 z-50"
							style={{
								background: `linear-gradient(120deg, ${accent}, ${hazardY})`,
							}}
						/>
					)}
				</AnimatePresence>

				{/* Crosshair reticle over paint floor */}
				{cursor && (
					<div
						className="pointer-events-none fixed z-40 mix-blend-difference"
						style={{ left: cursor.x, top: cursor.y, transform: "translate(-50%,-50%)" }}
					>
						<div className="relative size-10">
							<div className="absolute inset-x-0 top-1/2 h-px bg-white" />
							<div className="absolute inset-y-0 left-1/2 w-px bg-white" />
							<div className="absolute inset-0 border border-white/80" />
							<div
								className="absolute -inset-1 border border-dashed opacity-70"
								style={{ borderColor: hazardY }}
							/>
						</div>
					</div>
				)}

				<motion.div
					key={shake}
					initial={shake > 0 ? { x: 0, y: 0 } : false}
					animate={
						shake > 0
							? { x: [0, -6, 5, -3, 2, 0], y: [0, 3, -4, 2, 0] }
							: { x: 0, y: 0 }
					}
					transition={{ duration: 0.32 }}
					className="relative z-10 flex min-h-0 flex-1 flex-col"
				>
					<div
						className="relative flex min-h-0 flex-1 flex-col border-[4px] border-current sm:border-[5px]"
						style={{
							boxShadow: invert
								? `8px 8px 0 ${accent}, 12px 12px 0 ${hazardY}`
								: `8px 8px 0 #000, 12px 12px 0 ${hazardY}`,
						}}
					>
						{/* Compact status + title strip */}
						<div className="shrink-0 border-b-[4px] border-current px-2 py-1.5 sm:border-b-[5px] sm:px-3 sm:py-2">
							<div className="flex flex-wrap items-center gap-2 font-mono text-[0.55rem] font-bold tracking-[0.2em] sm:text-[0.65rem]">
								<span
									className="px-1.5 py-0.5"
									style={{
										background: siren ? accent : fg,
										color: siren ? "#000" : bg,
									}}
								>
									SYS.BRUTAL.07
								</span>
								<span>
									HITS {hits} · {filled}/{total} · {density}% ·{" "}
									{tool.toUpperCase()}
								</span>
								<span
									className="h-2 w-2 shrink-0"
									style={{
										background: live ? accent : fg,
										opacity: live && tick % 2 === 0 ? 1 : 0.35,
									}}
								/>
								<span
									className="h-2 w-2 shrink-0"
									style={{
										background: hazardY,
										opacity: highDensity && tick % 2 === 0 ? 1 : 0.4,
										boxShadow: highDensity ? `0 0 6px ${hazardY}` : undefined,
									}}
								/>
								<span className="ml-auto hidden font-mono text-[0.55rem] font-bold tracking-wide opacity-50 sm:inline">
									1–5 TOOL · R SEED · SPC FLOOD
								</span>
							</div>
							{/* Mini status LED strip */}
							<div className="mt-1 flex items-center gap-0.5">
								<span className="mr-1 font-mono text-[0.4rem] font-bold tracking-[0.2em] opacity-40">
									LOAD
								</span>
								{leds.map((led) => (
									<span
										key={led.i}
										className="h-1.5 flex-1 border border-current/20 sm:h-2"
										style={{
											background: led.on
												? led.warn
													? led.pulse
														? hazardY
														: accent
													: fg
												: `${fg}18`,
											boxShadow: led.on && led.warn ? `0 0 4px ${accent}` : undefined,
											opacity: led.on ? (led.pulse ? 1 : 0.85) : 0.35,
										}}
									/>
								))}
								<span
									className="ml-1 px-1 font-mono text-[0.45rem] font-black"
									style={{
										background: highDensity ? hazardY : "transparent",
										color: highDensity ? "#111" : fg,
									}}
								>
									{density}%
								</span>
							</div>
							<h1 className="mt-0.5 text-[clamp(1.4rem,4vw,2.75rem)] leading-none font-black tracking-tighter uppercase">
								Build Ugly{" "}
								<motion.span
									key={stamp}
									initial={{ scale: 1.15, backgroundColor: accent }}
									animate={{ scale: 1, backgroundColor: fg }}
									className="inline-block px-1.5"
									style={{ color: bg }}
								>
									{stamp}
								</motion.span>
								<span
									className="ml-1 inline-block px-1 align-middle font-mono text-[0.45rem] font-black tracking-widest sm:text-[0.55rem]"
									style={{ background: hazardY, color: "#111" }}
								>
									HAZ
								</span>
							</h1>
						</div>

						{/* Toolbar — dense wrap row */}
						<div className="flex shrink-0 flex-wrap items-center gap-1 border-b-[4px] border-current px-1.5 py-1 sm:border-b-[5px] sm:px-2 sm:py-1.5">
							{words.map((w) => (
								<button
									key={w}
									type="button"
									onClick={() => {
										setStamp(w)
										bang()
									}}
									className={cn(
										"cursor-pointer border-[2px] border-current px-1.5 py-0.5 font-mono text-[0.5rem] font-black sm:text-[0.6rem]",
										stamp === w ? "bg-[#ff2a00] text-black" : "bg-transparent",
									)}
								>
									{w}
								</button>
							))}
							<span className="mx-0.5 h-4 w-px bg-current opacity-30" />
							{(
								[
									["1 PAINT", "paint"],
									["2 ERASE", "erase"],
									["3 FLOOD", "flood"],
									["4 STAMP", "stamp"],
									["5 SLASH", "slash"],
								] as const
							).map(([label, t]) => (
								<button
									key={t}
									type="button"
									onClick={() => setTool(t)}
									className={cn(
										"cursor-pointer border-[2px] border-current px-1.5 py-0.5 font-mono text-[0.5rem] font-black sm:text-[0.6rem]",
										tool === t ? "bg-current" : "bg-transparent",
									)}
									style={tool === t ? { color: bg } : undefined}
								>
									{label}
								</button>
							))}
							{[1, 2, 3].map((n) => (
								<button
									key={n}
									type="button"
									onClick={() => setBrush(n)}
									className={cn(
										"cursor-pointer border-[2px] border-current px-1.5 py-0.5 font-mono text-[0.5rem] font-black",
										brush === n ? "bg-current" : "bg-transparent",
									)}
									style={brush === n ? { color: bg } : undefined}
								>
									{n}
								</button>
							))}
							<span className="mx-0.5 h-4 w-px bg-current opacity-30" />
							{(
								[
									["SEED", () => pattern("seed")],
									["CITY", () => pattern("city")],
									["DIAG", () => pattern("diag")],
									["NOISE", () => pattern("noise")],
									["BURN", burnPoster],
									["BALL", wreckingBall],
									["DEMOLISH", demolish],
									["INVERT", () => setInvert((v) => !v)],
									["HAZARD", () => setHazard((h) => !h)],
									["POSTER", () => setPoster((p) => (p + 1) % posters.length)],
									["LIVE", () => setLive((l) => !l)],
								] as const
							).map(([label, fn]) => (
								<button
									key={label}
									type="button"
									onClick={fn}
									className={cn(
										"cursor-pointer border-[2px] border-current bg-transparent px-1.5 py-0.5 font-mono text-[0.5rem] font-black hover:bg-[#ff2a00] hover:text-black sm:text-[0.55rem]",
										(label === "BALL" ||
											label === "DEMOLISH" ||
											label === "BURN") &&
											"border-[#ff2a00] text-[#ff2a00] hover:text-black",
										label === "HAZARD" && "border-[#ffcc00] text-[#cc9900]",
									)}
								>
									{label}
								</button>
							))}
						</div>

						{/* paint grid — FLEX-1 fills all remaining viewport (no dead beige) */}
						<div
							className="relative min-h-0 flex-1 touch-none select-none"
							onPointerDown={() => setDragging(true)}
							onPointerUp={() => setDragging(false)}
							onPointerLeave={() => {
								setDragging(false)
								setCursor(null)
							}}
							onPointerMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
						>
							{/* Triple film grain — high-frequency detail for PNG density */}
							<div
								className="pointer-events-none absolute inset-0 z-[4] opacity-[0.26] mix-blend-overlay"
								style={{
									backgroundImage: `
										url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.95'/%3E%3C/svg%3E")
									`,
									backgroundSize: "140px 140px",
								}}
							/>
							<div
								className="pointer-events-none absolute inset-0 z-[4] opacity-[0.16] mix-blend-soft-light"
								style={{
									backgroundImage: `
										url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)' opacity='0.8'/%3E%3C/svg%3E")
									`,
									backgroundSize: "90px 90px",
								}}
							/>
							<div
								className="pointer-events-none absolute inset-0 z-[4] opacity-[0.1] mix-blend-multiply"
								style={{
									backgroundImage: `
										url("data:image/svg+xml,%3Csvg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n3)' opacity='0.7'/%3E%3C/svg%3E")
									`,
									backgroundSize: "60px 60px",
								}}
							/>
							{/* Micro dust flecks + grit (deterministic, denser) */}
							<div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden opacity-60">
								{Array.from({ length: 220 }, (_, i) => (
									<span
										key={i}
										className="absolute"
										style={{
											left: `${(i * 37 + 5) % 100}%`,
											top: `${(i * 53 + 11) % 100}%`,
											width: 1 + (i % 4),
											height: 1 + ((i * 2) % 3),
											background:
												i % 5 === 0
													? accent
													: i % 3 === 0
														? hazardY
														: i % 7 === 0
															? "#fff"
															: fg,
											opacity: 0.22 + (i % 6) * 0.09,
											transform: `rotate(${(i * 17) % 90}deg)`,
											borderRadius: i % 4 === 0 ? "50%" : 0,
										}}
									/>
								))}
							</div>
							{/* Oil stains / corrosion patches */}
							<div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
								{Array.from({ length: 14 }, (_, i) => (
									<span
										key={`stain-${i}`}
										className="absolute rounded-full blur-[2px]"
										style={{
											left: `${(i * 17 + 8) % 90}%`,
											top: `${(i * 23 + 12) % 85}%`,
											width: 28 + (i % 5) * 14,
											height: 18 + (i % 4) * 10,
											background:
												i % 3 === 0
													? `${accent}22`
													: i % 2 === 0
														? `${hazardY}18`
														: `${fg}14`,
											opacity: 0.55,
										}}
									/>
								))}
							</div>
							{/* Rebar / formwork mesh denser */}
							<div
								className="pointer-events-none absolute inset-0 z-[2] opacity-[0.16]"
								style={{
									backgroundImage: `
										repeating-linear-gradient(0deg, transparent, transparent 11px, ${fg}55 11px, ${fg}55 12px),
										repeating-linear-gradient(90deg, transparent, transparent 17px, ${fg}40 17px, ${fg}40 18px),
										repeating-linear-gradient(0deg, transparent, transparent 35px, ${accent}28 35px, ${accent}28 36px),
										repeating-linear-gradient(90deg, transparent, transparent 41px, ${hazardY}22 41px, ${hazardY}22 42px),
										repeating-linear-gradient(45deg, transparent, transparent 23px, ${fg}18 23px, ${fg}18 24px),
										repeating-linear-gradient(-45deg, transparent, transparent 29px, ${accent}14 29px, ${accent}14 30px)
									`,
								}}
							/>
							{/* Diagonal hazard overlay when density high */}
							{hazard && highDensity && (
								<div
									className="pointer-events-none absolute inset-0 z-[2] mix-blend-multiply"
									style={{
										background: `repeating-linear-gradient(-45deg, transparent, transparent 6px, ${hazardY}30 6px, ${hazardY}30 10px, transparent 10px, transparent 16px, ${accent}24 16px, ${accent}24 18px)`,
										opacity: 0.65 + (density - 52) * 0.008,
									}}
								/>
							)}
							{/* Always-on light hazard wash for first-paint texture (even low density) */}
							{hazard && (
								<div
									className="pointer-events-none absolute inset-0 z-[2] opacity-[0.12] mix-blend-multiply"
									style={{
										background: `repeating-linear-gradient(-45deg, transparent, transparent 10px, ${hazardY}40 10px, ${hazardY}40 12px, transparent 12px, transparent 22px, ${accent}28 22px, ${accent}28 24px)`,
									}}
								/>
							)}
							{/* Scanline + CRT mesh always on for industrial chrome */}
							<div
								className="pointer-events-none absolute inset-0 z-[2] opacity-[0.13]"
								style={{
									backgroundImage: `
										repeating-linear-gradient(0deg, transparent, transparent 2px, ${fg} 2px, ${fg} 3px),
										repeating-linear-gradient(90deg, transparent, transparent 3px, ${fg}33 3px, ${fg}33 4px)
									`,
								}}
							/>
							{/* Crack / stress fracture lines + polylines */}
							<svg
								className="pointer-events-none absolute inset-0 z-[3] h-full w-full opacity-35 mix-blend-multiply"
								aria-hidden
							>
								{Array.from({ length: 36 }, (_, i) => {
									const x1 = (i * 47) % 100
									const y1 = (i * 31) % 100
									const x2 = (x1 + 8 + ((i * 13) % 22)) % 100
									const y2 = (y1 + 12 + ((i * 17) % 28)) % 100
									return (
										<line
											key={i}
											x1={`${x1}%`}
											y1={`${y1}%`}
											x2={`${x2}%`}
											y2={`${y2}%`}
											stroke={i % 3 === 0 ? accent : i % 2 === 0 ? hazardY : fg}
											strokeWidth={0.55 + (i % 3) * 0.3}
											opacity={0.35 + (i % 4) * 0.1}
										/>
									)
								})}
								{Array.from({ length: 10 }, (_, i) => {
									const x = (i * 19 + 5) % 90
									const y = (i * 27 + 8) % 80
									return (
										<polyline
											key={`pl-${i}`}
											points={`${x},${y} ${x + 6},${y + 4} ${x + 3},${y + 10} ${x + 11},${y + 14}`}
											fill="none"
											stroke={i % 2 === 0 ? accent : fg}
											strokeWidth="0.7"
											opacity="0.4"
										/>
									)
								})}
							</svg>
							<div className="pointer-events-none absolute inset-0 z-[3] flex items-end justify-between p-2 sm:p-3">
								<p
									className="max-w-[70%] text-[clamp(1.4rem,5vw,3.5rem)] leading-[0.88] font-black tracking-tighter uppercase mix-blend-difference"
									style={{ color: "#fff" }}
								>
									{posters[poster]}
								</p>
								<div className="text-right">
									<p
										className="font-mono text-[0.55rem] font-black tracking-[0.3em] mix-blend-difference uppercase opacity-80"
										style={{ color: "#fff" }}
									>
										{cols}×{rows}
									</p>
									<p
										className="mt-1 font-mono text-[0.45rem] font-black tracking-[0.2em] uppercase"
										style={{ color: hazardY, textShadow: "0 0 8px #000" }}
									>
										{highDensity ? "⚠ OVERLOAD" : "STANDBY"}
									</p>
									<p
										className="mt-1 font-mono text-[0.4rem] font-black tracking-[0.25em] uppercase opacity-70"
										style={{ color: accent, textShadow: "0 0 6px #000" }}
									>
										CLUNK · LIVE · REBAR
									</p>
									<p
										className="mt-0.5 font-mono text-[0.35rem] font-black tracking-[0.3em] uppercase opacity-60"
										style={{ color: "#fff", textShadow: "0 0 4px #000" }}
									>
										SYS.07 · FORMWORK
									</p>
								</div>
							</div>
							{/* corner + mid-edge + quarter rivets for industrial chrome noise */}
							{[
								"top-1 left-1",
								"top-1 right-1",
								"bottom-1 left-1",
								"bottom-1 right-1",
								"top-1 left-1/2 -translate-x-1/2",
								"bottom-1 left-1/2 -translate-x-1/2",
								"top-1/2 left-1 -translate-y-1/2",
								"top-1/2 right-1 -translate-y-1/2",
								"top-1 left-1/4",
								"top-1 right-1/4",
								"bottom-1 left-1/4",
								"bottom-1 right-1/4",
								"top-1/4 left-1",
								"top-1/4 right-1",
								"bottom-1/4 left-1",
								"bottom-1/4 right-1",
							].map((pos, ri) => (
								<span
									key={pos}
									className={cn(
										"pointer-events-none absolute z-[2] size-2 border-2 border-current sm:size-2.5",
										pos,
									)}
									style={{
										background:
											ri % 3 === 0 ? accent : ri % 2 === 0 ? hazardY : fg,
										boxShadow: `1px 1px 0 ${fg}, inset 0 0 0 1px ${ri % 2 === 0 ? "#fff4" : "#0004"}`,
										borderRadius: ri % 4 === 0 ? "50%" : 0,
									}}
								/>
							))}
							{/* Bolt grid denser — deterministic industrial hardware */}
							<div className="pointer-events-none absolute inset-2 z-[2] opacity-50">
								{Array.from({ length: 72 }, (_, i) => (
									<span
										key={i}
										className="absolute size-1.5 border border-current sm:size-2"
										style={{
											left: `${3 + (i % 12) * 8}%`,
											top: `${4 + ((i / 12) | 0) * 15}%`,
											background:
												i % 4 === 0 ? hazardY : i % 3 === 0 ? accent : fg,
											opacity: 0.38 + (i % 5) * 0.1,
											boxShadow: `inset 0 0 0 1px ${fg}44, 1px 1px 0 #0006`,
											borderRadius: i % 2 === 0 ? "50%" : 0,
											transform: `rotate(${(i * 15) % 45}deg)`,
										}}
									/>
								))}
							</div>
							{/* Weld marks along top + bottom + mid edges */}
							<div className="pointer-events-none absolute inset-x-3 top-2 z-[2] flex justify-between opacity-65">
								{Array.from({ length: 28 }, (_, i) => (
									<span
										key={i}
										className="h-1 w-2.5"
										style={{
											background:
												i % 3 === 0 ? accent : i % 2 === 0 ? hazardY : fg,
											opacity: 0.42 + (i % 4) * 0.12,
											transform: `rotate(${(i % 5) * 8 - 16}deg)`,
											boxShadow: `0 0 1px ${fg}`,
										}}
									/>
								))}
							</div>
							<div className="pointer-events-none absolute inset-x-3 bottom-2 z-[2] flex justify-between opacity-55">
								{Array.from({ length: 24 }, (_, i) => (
									<span
										key={i}
										className="h-1 w-2"
										style={{
											background: i % 2 === 0 ? hazardY : fg,
											opacity: 0.38 + (i % 5) * 0.1,
											transform: `rotate(${(i % 7) * 6 - 18}deg)`,
										}}
									/>
								))}
							</div>
							<div className="pointer-events-none absolute inset-y-6 left-2 z-[2] flex flex-col justify-between opacity-50">
								{Array.from({ length: 16 }, (_, i) => (
									<span
										key={i}
										className="h-2 w-1"
										style={{
											background: i % 3 === 0 ? accent : hazardY,
											opacity: 0.4 + (i % 4) * 0.1,
										}}
									/>
								))}
							</div>
							<div className="pointer-events-none absolute inset-y-6 right-2 z-[2] flex flex-col justify-between opacity-50">
								{Array.from({ length: 16 }, (_, i) => (
									<span
										key={i}
										className="h-2 w-1"
										style={{
											background: i % 2 === 0 ? fg : accent,
											opacity: 0.38 + (i % 5) * 0.1,
										}}
									/>
								))}
							</div>
							{/* Measurement tick marks / barcode strip */}
							<div className="pointer-events-none absolute inset-x-6 top-1/3 z-[2] flex h-3 items-end justify-between opacity-40">
								{Array.from({ length: 48 }, (_, i) => (
									<span
										key={i}
										className="w-px"
										style={{
											height: `${40 + (i % 5) * 12}%`,
											background: i % 8 === 0 ? accent : i % 4 === 0 ? hazardY : fg,
											opacity: 0.5 + (i % 3) * 0.15,
										}}
									/>
								))}
							</div>
							{/* Side plate stripes */}
							<div
								className="pointer-events-none absolute inset-y-4 left-0 z-[2] w-1.5 opacity-55"
								style={{
									background: `repeating-linear-gradient(0deg, ${accent}, ${accent} 4px, ${hazardY} 4px, ${hazardY} 8px, ${fg} 8px, ${fg} 12px)`,
								}}
							/>
							<div
								className="pointer-events-none absolute inset-y-4 right-0 z-[2] w-1.5 opacity-55"
								style={{
									background: `repeating-linear-gradient(0deg, ${hazardY}, ${hazardY} 4px, ${accent} 4px, ${accent} 8px, ${fg} 8px, ${fg} 12px)`,
								}}
							/>
							<div
								className="grid h-full w-full"
								style={{
									gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
									gridTemplateRows: `repeat(${rows}, minmax(0,1fr))`,
									background: invert ? "#111" : "#d0c9bb",
									backgroundImage: `
										linear-gradient(${fg}28 1px, transparent 1px),
										linear-gradient(90deg, ${fg}28 1px, transparent 1px),
										radial-gradient(${fg}18 0.5px, transparent 0.65px),
										radial-gradient(${accent}14 0.4px, transparent 0.55px),
										radial-gradient(${hazardY}10 0.35px, transparent 0.5px)
									`,
									backgroundSize: `calc(100% / ${cols}) calc(100% / ${rows}), calc(100% / ${cols}) calc(100% / ${rows}), 3px 3px, 5px 5px, 7px 7px`,
								}}
							>
								{cells.map((v, i) => (
									<button
										key={i}
										type="button"
										aria-label={`Cell ${i} state ${v}`}
										onClick={(e) => hitCell(i, e)}
										onPointerEnter={() => {
											lastCellRef.current = i
											if (dragging && tool !== "flood" && tool !== "stamp")
												paintAt(i)
										}}
										className="min-h-0 min-w-0 cursor-crosshair border-[0.5px] border-current/30 transition-[filter] hover:brightness-125 active:brightness-90"
										style={cellStyle(v, i)}
									/>
								))}
							</div>
						</div>

						{/* density bar — dual tone red/yellow */}
						<div className="shrink-0 border-t-[4px] border-current sm:border-t-[5px]">
							<div className="flex h-2 w-full sm:h-2.5">
								<div
									className="h-full transition-[width] duration-200"
									style={{
										width: `${Math.min(density, 55)}%`,
										background: fg,
									}}
								/>
								{density > 55 && (
									<div
										className="h-full transition-[width] duration-200"
										style={{
											width: `${density - 55}%`,
											background: `repeating-linear-gradient(90deg, ${accent}, ${accent} 4px, ${hazardY} 4px, ${hazardY} 8px)`,
										}}
									/>
								)}
								<div
									className="h-full flex-1 opacity-20"
									style={{ background: fg }}
								/>
							</div>
						</div>

						{/* stats — micro-concrete chrome so bottom strip won't compress flat */}
						<div className="grid shrink-0 grid-cols-5 border-t-[4px] border-current sm:border-t-[5px]">
							{(
								[
									["TYPE", stamp],
									["GRID", `${cols}×${rows}`],
									["CLUNK", `${filled}`],
									["MODE", tool.toUpperCase()],
									["LOAD", `${density}%`],
								] as const
							).map(([k, v], idx) => (
								<button
									key={k}
									type="button"
									onClick={() => {
										if (k === "TYPE")
											setStamp(
												words[(words.indexOf(stamp) + 1) % words.length]!,
											)
										if (k === "MODE") {
											setTool(
												BRUTAL_TOOLS[
													(BRUTAL_TOOLS.indexOf(tool) + 1) % BRUTAL_TOOLS.length
												]!,
											)
										}
										if (k === "CLUNK") pattern("noise")
										if (k === "LOAD") wreckingBall()
										if (k === "GRID") pattern("city")
										bang()
									}}
									className={cn(
										"relative cursor-pointer border-current p-1.5 text-left font-mono transition hover:bg-[#ff2a00] hover:text-black sm:p-2",
										idx < 4 && "border-r-[4px] sm:border-r-[5px]",
										k === "LOAD" && highDensity && "bg-[#ffcc00]/20",
									)}
									style={{
										backgroundImage: `
											radial-gradient(circle at ${20 + idx * 15}% ${30 + idx * 8}%, ${fg}12 0.5px, transparent 0.9px),
											radial-gradient(circle at ${60 + idx * 10}% ${55}% , ${fg}0c 0.4px, transparent 0.7px),
											repeating-linear-gradient(90deg, transparent, transparent 3px, ${fg}06 3px, ${fg}06 4px)
										`,
									}}
								>
									<p className="text-[0.4rem] font-bold tracking-[0.25em] opacity-50 sm:text-[0.5rem]">
										{k}
									</p>
									<p className="mt-0.5 truncate text-sm font-black sm:text-xl">
										{v}
									</p>
									<span
										className="pointer-events-none absolute top-1 right-1 size-1.5 border border-current opacity-40"
										style={{
											background:
												idx % 2 === 0 ? hazardY : idx === 4 ? accent : fg,
										}}
									/>
								</button>
							))}
						</div>

						<div
							className="shrink-0 overflow-hidden border-t-[4px] border-current sm:border-t-[5px]"
							style={{
								background: `repeating-linear-gradient(-45deg, ${fg}, ${fg} 12px, ${invert ? "#1a1a1a" : "#222"} 12px, ${invert ? "#1a1a1a" : "#222"} 24px)`,
							}}
						>
							<motion.p
								key={`${poster}-${boom}`}
								className="whitespace-nowrap py-1 font-mono text-xs font-black tracking-[0.3em] uppercase sm:py-1.5 sm:text-sm"
								style={{ color: hazardY }}
								animate={{ x: ["0%", "-50%"] }}
								transition={{
									duration: 12,
									repeat: Infinity,
									ease: "linear",
								}}
							>
								/// {posters[poster]} /// DRAG TO PAINT /// 1-5 TOOLS /// R SEED ///
								SPC FLOOD /// WRECKING BALL /// DEMOLISH /// NO SOFT POWER ///{" "}
								{posters[poster]} /// DRAG TO PAINT /// STAMP LETTERS ///
								WRECKING BALL /// DEMOLISH /// HAZARD YELLOW ///
							</motion.p>
						</div>
					</div>
				</motion.div>
			</div>
		</LandingsShell>
	)
}

/* ═══════════════════════════════════════════════════════════
   3 — NOIR  ·  multi-lamp cinematic stage (SOTD density)
═══════════════════════════════════════════════════════════ */
const NOIR_MOTES = Array.from({ length: 96 }, (_, i) => ({
	id: i,
	x: ((i * 37) % 97) + 1.5,
	y: ((i * 53) % 89) + 4,
	s: 1 + (i % 5) * 0.55,
	d: 9 + (i % 11) * 1.4,
	delay: (i % 9) * 0.55,
	drift: 12 + (i % 7) * 4,
}))

const NOIR_PRACTICALS = [
	{ x: 8, y: 18, r: 20, a: 0.18 },
	{ x: 92, y: 22, r: 16, a: 0.14 },
	{ x: 14, y: 72, r: 14, a: 0.12 },
	{ x: 86, y: 68, r: 18, a: 0.14 },
	{ x: 50, y: 92, r: 32, a: 0.12 },
	{ x: 38, y: 28, r: 10, a: 0.1 },
	{ x: 62, y: 48, r: 11, a: 0.09 },
] as const

/** Deterministic emulsion flecks / dust / hair for first-paint film mass */
const NOIR_FILM_FLECKS = Array.from({ length: 160 }, (_, i) => ({
	id: i,
	x: (i * 41 + 7) % 100,
	y: (i * 59 + 13) % 100,
	w: 1 + (i % 5),
	h: 1 + ((i * 3) % 4),
	rot: (i * 23) % 180,
	op: 0.12 + (i % 7) * 0.05,
	kind: i % 11, // 0 hair, 1-2 bright dust, rest grit
}))

/** Vertical / diagonal emulsion scratches (stock film defects) */
const NOIR_SCRATCHES = Array.from({ length: 18 }, (_, i) => ({
	id: i,
	x: 3 + ((i * 17) % 94),
	y: (i * 11) % 40,
	h: 18 + ((i * 13) % 55),
	w: i % 4 === 0 ? 1.2 : 0.55,
	op: 0.06 + (i % 5) * 0.035,
	tilt: ((i * 7) % 9) - 4,
}))

export function NoirLanding() {
	const scenes = useMemo(
		() => [
			{
				id: "subject",
				title: "The Subject",
				line: "She only exists where the lamp permits.",
				img: MEDIA.headshot,
				temp: 0.92,
				pos: "50% 28%",
			},
			{
				id: "corridor",
				title: "The Corridor",
				line: "Architecture is a conspiracy of darkness.",
				img: MEDIA.walkway,
				temp: 0.55,
				pos: "50% 50%",
			},
			{
				id: "folly",
				title: "The Folly",
				line: "Memory arrives as humidity and rim light.",
				img: MEDIA.folly,
				temp: 0.7,
				pos: "45% 40%",
			},
			{
				id: "motion",
				title: "The Cut",
				line: "Stillness is a decision, not a default.",
				img: MEDIA.dance,
				temp: 0.4,
				pos: "55% 35%",
			},
		],
		[],
	)
	const [scene, setScene] = useState(0)
	const [spot, setSpot] = useState({ x: 48, y: 32 })
	const [iris, setIris] = useState(34)
	const [lamps, setLamps] = useState<{ x: number; y: number; id: number }[]>(
		() => [
			{ x: 22, y: 58, id: 1 },
			{ x: 78, y: 42, id: 2 },
			{ x: 50, y: 72, id: 3 },
		],
	)
	const [grain, setGrain] = useState(true)
	const [letterbox, setLetterbox] = useState(true)
	const [flash, setFlash] = useState(0)
	const [follow, setFollow] = useState(true)
	// Title card is cinematic but translucent — subject + lamps always paint under it
	const [titleCard, setTitleCard] = useState(true)
	const [frame, setFrame] = useState(1001)
	const [timecode, setTimecode] = useState("01:00:00:00")
	const [irisPulse, setIrisPulse] = useState(0)
	const grainRef = useRef<HTMLCanvasElement>(null)
	const sc = scenes[scene]

	// rolling film counter + timecode
	useEffect(() => {
		let f = 1001
		const id = window.setInterval(() => {
			f += 1
			setFrame(f)
			const total = f - 1001
			const ff = total % 24
			const ss = Math.floor(total / 24) % 60
			const mm = Math.floor(total / (24 * 60)) % 60
			const hh = 1 + Math.floor(total / (24 * 60 * 60))
			setTimecode(
				`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}:${String(ff).padStart(2, "0")}`,
			)
		}, 1000 / 24)
		return () => clearInterval(id)
	}, [])

	// film grain — denser dual-pass emulsion (fine mono + warm coarse) for first-paint cinema mass
	useEffect(() => {
		if (!grain) return
		const c = grainRef.current
		if (!c) return
		const ctx = c.getContext("2d", { alpha: true })
		if (!ctx) return
		let raf = 0
		let frameN = 0
		const resize = () => {
			// higher res than 960×540 so grain reads on retina / 1440 captures
			const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
			c.width = Math.min(Math.floor(innerWidth * dpr), 1440)
			c.height = Math.min(Math.floor(innerHeight * dpr), 900)
		}
		const paint = () => {
			const { width: w, height: h } = c
			if (w < 2 || h < 2) return
			const img = ctx.createImageData(w, h)
			const d = img.data
			// step 1px fine grain; every other frame also stamps coarser blotches for organic stock look
			for (let i = 0; i < d.length; i += 4) {
				const n = Math.random()
				// slightly warm-biased mono (tungsten stock)
				const v = (n * 255) | 0
				const warm = (n * 40) | 0
				d[i] = Math.min(255, v + warm)
				d[i + 1] = v
				d[i + 2] = Math.max(0, v - (warm >> 1))
				// denser alpha than 32 — film emulsion should read at rest
				d[i + 3] = 48 + ((n * 36) | 0)
			}
			ctx.putImageData(img, 0, 0)
			// coarse emulsion blotches / chemical density (every frame — cheap relative to full buffer)
			ctx.save()
			ctx.globalCompositeOperation = "source-over"
			for (let k = 0; k < 90; k++) {
				const x = Math.random() * w
				const y = Math.random() * h
				const r = 0.6 + Math.random() * 3.2
				const a = 0.04 + Math.random() * 0.12
				ctx.fillStyle =
					Math.random() > 0.55
						? `rgba(255,236,210,${a})`
						: `rgba(12,8,6,${a * 1.3})`
				ctx.beginPath()
				ctx.arc(x, y, r, 0, Math.PI * 2)
				ctx.fill()
			}
			// occasional hair / fiber (1–3 per frame)
			if (frameN % 2 === 0) {
				ctx.strokeStyle = `rgba(240,230,210,${0.05 + Math.random() * 0.1})`
				ctx.lineWidth = 0.4 + Math.random() * 0.8
				const hx = Math.random() * w
				const hy = Math.random() * h
				ctx.beginPath()
				ctx.moveTo(hx, hy)
				ctx.quadraticCurveTo(
					hx + (Math.random() - 0.5) * 80,
					hy + (Math.random() - 0.5) * 80,
					hx + (Math.random() - 0.5) * 140,
					hy + (Math.random() - 0.5) * 140,
				)
				ctx.stroke()
			}
			ctx.restore()
			frameN++
		}
		resize()
		paint() // immediate first paint — no empty frame before RAF
		const loop = () => {
			paint()
			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)
		window.addEventListener("resize", resize)
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener("resize", resize)
		}
	}, [grain])

	const warm = sc.temp
	const rCh = Math.round(255 * warm + 40)
	const gCh = Math.round(220 * warm + 20)
	const bCh = Math.round(180 * warm)
	const lightRgb = `rgba(${rCh},${gCh},${bCh},`
	const lampMasks = [
		`radial-gradient(circle ${iris * 0.95}vmax at ${spot.x}% ${spot.y}%, black 0%, transparent 72%)`,
		...lamps.map(
			(l) =>
				`radial-gradient(circle ${iris * 0.55}vmax at ${l.x}% ${l.y}%, black 0%, transparent 70%)`,
		),
	].join(", ")

	const placeLamp = (e: ReactMouseEvent<HTMLDivElement>) => {
		if ((e.target as HTMLElement).closest("button,a,label,input")) return
		const r = e.currentTarget.getBoundingClientRect()
		const x = ((e.clientX - r.left) / r.width) * 100
		const y = ((e.clientY - r.top) / r.height) * 100
		setLamps((L) => [...L.slice(-5), { x, y, id: Date.now() }])
		setFlash((f) => f + 1)
		setIrisPulse((p) => p + 1)
	}

	const cueScene = (i: number) => {
		setScene(i)
		setFlash((f) => f + 1)
		setIrisPulse((p) => p + 1)
	}

	return (
		<LandingsShell className="bg-black text-[#f0e9e0]">
			<div
				className="relative min-h-dvh overflow-hidden"
				style={{ cursor: follow ? "none" : "crosshair" }}
				onPointerMove={(e) => {
					if (!follow) return
					const r = e.currentTarget.getBoundingClientRect()
					setSpot({
						x: ((e.clientX - r.left) / r.width) * 100,
						y: ((e.clientY - r.top) / r.height) * 100,
					})
				}}
				onWheel={(e) => {
					if (Math.abs(e.deltaY) < 2) return
					setIris((v) => Math.min(56, Math.max(10, v - e.deltaY * 0.02)))
					setIrisPulse((p) => p + 1)
				}}
				onClick={placeLamp}
			>
				{/* base void with warm underpaint — never pure empty black */}
				<div
					className="absolute inset-0"
					style={{
						background: `
							radial-gradient(ellipse 90% 70% at 50% 42%, #1a1410 0%, #080706 55%, #010101 100%),
							linear-gradient(180deg, #0c0a08 0%, #050403 45%, #0a0806 100%)
						`,
					}}
				/>

				{/* large key-lit silhouette — always fills frame at rest (never empty void) */}
				<img
					src={sc.img}
					alt=""
					className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-[opacity,filter] duration-700"
					style={{
						objectPosition: sc.pos,
						opacity: 0.52,
						filter: `grayscale(0.78) contrast(1.42) brightness(0.5) sepia(${0.35 + warm * 0.25})`,
					}}
				/>
				{/* soft full-frame ambient wash of subject */}
				<img
					src={sc.img}
					alt=""
					className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover opacity-28 blur-2xl transition-opacity duration-700"
					style={{
						objectPosition: sc.pos,
						filter: `sepia(0.6) brightness(0.62) saturate(0.75)`,
					}}
				/>
				{/* mid-weight subject plate — reads through title card */}
				<img
					src={sc.img}
					alt=""
					className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-22 mix-blend-soft-light transition-opacity duration-700"
					style={{
						objectPosition: sc.pos,
						filter: `grayscale(0.6) contrast(1.2) brightness(0.65) sepia(${0.2 + warm * 0.2})`,
					}}
				/>

				{/* secondary practicals (fixed set dressings) */}
				{NOIR_PRACTICALS.map((p, i) => (
					<div
						key={i}
						className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
						style={{
							left: `${p.x}%`,
							top: `${p.y}%`,
							width: `${p.r}vmax`,
							height: `${p.r}vmax`,
							background: `radial-gradient(circle, ${lightRgb}${p.a}), transparent 70%)`,
							boxShadow: `0 0 ${p.r * 2}px ${p.r * 0.4}px ${lightRgb}${p.a * 0.5})`,
						}}
					/>
				))}

				{/* rim / window strip practicals */}
				<div
					className="pointer-events-none absolute top-[12%] right-0 h-[55%] w-[3px] opacity-40"
					style={{
						background: `linear-gradient(180deg, transparent, ${lightRgb}0.55), transparent)`,
						boxShadow: `0 0 40px 12px ${lightRgb}0.12)`,
					}}
				/>
				<div
					className="pointer-events-none absolute top-[18%] left-0 h-[40%] w-[2px] opacity-25"
					style={{
						background: `linear-gradient(180deg, transparent, ${lightRgb}0.4), transparent)`,
						boxShadow: `0 0 28px 8px ${lightRgb}0.08)`,
					}}
				/>

				{/* floor bounce — warm ground plane */}
				<div
					className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
					style={{
						background: `
							radial-gradient(ellipse 80% 60% at 50% 100%, ${lightRgb}0.16), transparent 70%),
							linear-gradient(0deg, ${lightRgb}0.1) 0%, transparent 55%)
						`,
					}}
				/>

				{/* dynamic key + planted lamps field */}
				<div
					className="absolute inset-0 transition-[background] duration-150"
					style={{
						background: [
							`radial-gradient(circle ${iris}vmax at ${spot.x}% ${spot.y}%, ${lightRgb}0.28), transparent 62%)`,
							...lamps.map(
								(l) =>
									`radial-gradient(circle ${iris * 0.55}vmax at ${l.x}% ${l.y}%, ${lightRgb}0.18), transparent 55%)`,
							),
							`radial-gradient(ellipse 70% 50% at 50% 45%, ${lightRgb}0.06), transparent 70%)`,
						].join(", "),
					}}
				/>

				{/* subject revealed by lamps (bright layer) */}
				<img
					src={sc.img}
					alt=""
					className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-88 mix-blend-luminosity contrast-125 transition-[opacity,filter] duration-700"
					style={{
						objectPosition: sc.pos,
						WebkitMaskImage: lampMasks,
						maskImage: lampMasks,
						filter: `sepia(${1 - warm}) brightness(${0.95 + warm * 0.28}) contrast(1.2)`,
					}}
				/>

				{/* dust motes in the key beam */}
				<div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden">
					{NOIR_MOTES.map((m) => (
						<motion.span
							key={m.id}
							className="absolute rounded-full bg-[#ffe8c4]"
							style={{
								left: `${m.x}%`,
								top: `${m.y}%`,
								width: m.s,
								height: m.s,
								opacity: 0.15 + (m.id % 4) * 0.06,
								boxShadow: `0 0 ${m.s * 3}px ${m.s}px rgba(255,220,180,0.15)`,
							}}
							animate={{
								y: [0, -m.drift, m.drift * 0.4, 0],
								x: [0, m.drift * 0.35, -m.drift * 0.2, 0],
								opacity: [0.08, 0.35, 0.12, 0.08],
							}}
							transition={{
								duration: m.d,
								delay: m.delay,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>
					))}
				</div>

				{/* vignette + film edge burn */}
				<div
					className="pointer-events-none absolute inset-0 z-[5]"
					style={{
						background: `
							radial-gradient(ellipse 75% 70% at 50% 45%, transparent 35%, rgba(0,0,0,0.55) 100%),
							linear-gradient(90deg, rgba(0,0,0,0.45) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.45) 100%),
							linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.4) 100%)
						`,
					}}
				/>

				{/* film stock layers — always-on emulsion texture for first-paint density */}
				{/* dual SVG fractal grain (fine + coarse) */}
				<div
					className="pointer-events-none absolute inset-0 z-[5] opacity-[0.28] mix-blend-overlay"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.95'/%3E%3C/svg%3E")`,
						backgroundSize: "160px 160px",
					}}
				/>
				<div
					className="pointer-events-none absolute inset-0 z-[5] opacity-[0.16] mix-blend-soft-light"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.35' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)' opacity='0.85'/%3E%3C/svg%3E")`,
						backgroundSize: "96px 96px",
					}}
				/>
				{/* third low-freq cloud for organic density pockets */}
				<div
					className="pointer-events-none absolute inset-0 z-[5] opacity-[0.1] mix-blend-multiply"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.35' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n3)' opacity='0.7'/%3E%3C/svg%3E")`,
						backgroundSize: "280px 280px",
					}}
				/>

				{/* scanlines + CRT mesh — denser cinema raster */}
				<div
					className="pointer-events-none absolute inset-0 z-[5] opacity-[0.12]"
					style={{
						backgroundImage: `
							repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.42) 2px, rgba(0,0,0,0.42) 3px),
							repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,232,196,0.03) 3px, rgba(255,232,196,0.03) 4px)
						`,
					}}
				/>

				{/* emulsion scratches — stock film defects */}
				<div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
					{NOIR_SCRATCHES.map((s) => (
						<span
							key={s.id}
							className="absolute bg-[#f0e9e0]"
							style={{
								left: `${s.x}%`,
								top: `${s.y}%`,
								width: s.w,
								height: `${s.h}%`,
								opacity: s.op,
								transform: `rotate(${s.tilt}deg)`,
								boxShadow:
									s.id % 3 === 0
										? "0 0 2px rgba(255,232,200,0.25)"
										: undefined,
							}}
						/>
					))}
				</div>

				{/* dust flecks / grit / hair — deterministic film dirt */}
				<div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
					{NOIR_FILM_FLECKS.map((f) => (
						<span
							key={f.id}
							className="absolute"
							style={{
								left: `${f.x}%`,
								top: `${f.y}%`,
								width: f.kind === 0 ? 18 + (f.id % 28) : f.w,
								height: f.kind === 0 ? 0.7 : f.h,
								background:
									f.kind === 0
										? "linear-gradient(90deg, transparent, rgba(240,233,224,0.55), transparent)"
										: f.kind <= 2
											? "rgba(255,236,210,0.85)"
											: f.kind === 3
												? "rgba(8,6,4,0.7)"
												: "rgba(200,180,150,0.55)",
								opacity: f.op,
								transform: `rotate(${f.rot}deg)`,
								borderRadius: f.kind === 0 ? 0 : f.kind <= 2 ? "50%" : 0,
								boxShadow:
									f.kind <= 2
										? `0 0 ${2 + (f.id % 3)}px rgba(255,220,180,0.2)`
										: undefined,
							}}
						/>
					))}
				</div>

				{/* warm chemical stain patches — emulsion density */}
				<div
					className="pointer-events-none absolute inset-0 z-[5] opacity-[0.14] mix-blend-soft-light"
					style={{
						background: `
							radial-gradient(ellipse 28% 22% at 18% 30%, rgba(180,120,60,0.35), transparent 70%),
							radial-gradient(ellipse 22% 30% at 82% 62%, rgba(40,28,18,0.45), transparent 68%),
							radial-gradient(ellipse 35% 18% at 48% 78%, rgba(200,150,90,0.22), transparent 70%),
							radial-gradient(ellipse 18% 24% at 70% 18%, rgba(30,22,14,0.4), transparent 65%)
						`,
					}}
				/>

				{/* animated canvas grain (toggleable via Grain control) */}
				{grain && (
					<canvas
						ref={grainRef}
						className="pointer-events-none absolute inset-0 z-[6] h-full w-full opacity-55 mix-blend-overlay"
					/>
				)}
				{/* second animated pass feel via static fine noise boost when grain on */}
				{grain && (
					<div
						className="pointer-events-none absolute inset-0 z-[6] opacity-[0.14] mix-blend-soft-light"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nf'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nf)'/%3E%3C/svg%3E")`,
							backgroundSize: "64px 64px",
						}}
					/>
				)}

				{/* iris pulse ring on interaction */}
				<AnimatePresence>
					{irisPulse > 0 && (
						<motion.div
							key={irisPulse}
							initial={{ opacity: 0.5, scale: 0.55 }}
							animate={{ opacity: 0, scale: 1.35 }}
							transition={{ duration: 0.7, ease: "easeOut" }}
							className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ffe8c4]/50"
							style={{
								left: `${spot.x}%`,
								top: `${spot.y}%`,
								width: `${iris * 1.8}vmax`,
								height: `${iris * 1.8}vmax`,
								boxShadow: `0 0 40px 8px ${lightRgb}0.2)`,
							}}
						/>
					)}
				</AnimatePresence>

				{/* flash cut */}
				<AnimatePresence>
					{flash > 0 && (
						<motion.div
							key={flash}
							initial={{ opacity: 0.7 }}
							animate={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							className="pointer-events-none absolute inset-0 z-30"
							style={{
								background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, #fff8ee, #ffe8c4aa 30%, transparent 70%)`,
							}}
						/>
					)}
				</AnimatePresence>

				{/* letterbox with film perforations */}
				{letterbox && (
					<>
						<div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[7.5vh] bg-black">
							<div className="absolute inset-x-0 bottom-0 flex h-2 justify-between px-3 opacity-40">
								{Array.from({ length: 24 }).map((_, i) => (
									<span
										key={i}
										className="h-1.5 w-2.5 rounded-[1px] bg-[#f0e9e0]/25"
									/>
								))}
							</div>
						</div>
						<div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[7.5vh] bg-black">
							<div className="absolute inset-x-0 top-0 flex h-2 justify-between px-3 opacity-40">
								{Array.from({ length: 24 }).map((_, i) => (
									<span
										key={i}
										className="h-1.5 w-2.5 rounded-[1px] bg-[#f0e9e0]/25"
									/>
								))}
							</div>
						</div>
					</>
				)}

				{/* rolling film counter HUD — always above title card (z-55) */}
				<div className="pointer-events-none absolute top-[calc(7.5vh+0.75rem)] right-4 z-[55] font-mono text-[0.58rem] tracking-[0.2em] text-[#f0e9e0]/70 sm:right-8">
					<div className="border border-white/25 bg-black/55 px-3 py-2 shadow-[0_0_24px_rgba(0,0,0,0.45)] backdrop-blur-sm">
						<p className="opacity-60">TC {timecode}</p>
						<p className="mt-0.5">
							FRM {String(frame).padStart(6, "0")} · 24fps
						</p>
						<p className="mt-0.5 opacity-70">
							IRIS {iris.toFixed(0)} · LAMP {lamps.length + 1}
						</p>
						<p className="mt-0.5 opacity-45">
							{sc.id.toUpperCase()} · {(sc.temp * 5600).toFixed(0)}K
						</p>
					</div>
				</div>
				{/* left slate marker — film production HUD */}
				<div className="pointer-events-none absolute top-[calc(7.5vh+0.75rem)] left-4 z-[55] font-mono text-[0.55rem] tracking-[0.22em] text-[#f0e9e0]/45 sm:left-8">
					<div className="border border-white/15 bg-black/45 px-2.5 py-1.5 backdrop-blur-sm">
						<p>REEL 01 · CAM A</p>
						<p className="mt-0.5 opacity-70">2.39:1 · TUNGSTEN</p>
					</div>
				</div>

				{/* key lamp cursor */}
				{follow && (
					<div
						className="pointer-events-none absolute z-20 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/55"
						style={{
							left: `${spot.x}%`,
							top: `${spot.y}%`,
							boxShadow: `0 0 60px 20px ${lightRgb}0.32), 0 0 120px 40px ${lightRgb}0.12)`,
							background: `${lightRgb}0.08)`,
						}}
					>
						<div className="absolute inset-1 rounded-full border border-white/20" />
					</div>
				)}
				{/* planted practicals */}
				{lamps.map((l) => (
					<motion.div
						key={l.id}
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						className="pointer-events-none absolute z-20 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffe8c4]"
						style={{
							left: `${l.x}%`,
							top: `${l.y}%`,
							boxShadow: `0 0 28px 10px ${lightRgb}0.4), 0 0 60px 20px ${lightRgb}0.15)`,
						}}
					/>
				))}

				{/* dense cinematic title card — subject visible underneath */}
				<AnimatePresence>
					{titleCard && (
						<motion.button
							type="button"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0, scale: 1.02 }}
							transition={{ duration: 0.6 }}
							onClick={(e) => {
								e.stopPropagation()
								setTitleCard(false)
								setFlash((f) => f + 1)
							}}
							className="absolute inset-0 z-50 flex cursor-pointer flex-col items-center justify-center px-6 text-center"
							style={{
								// translucent so silhouette + lamps + HUD never read as empty void
								background:
									"radial-gradient(ellipse 65% 55% at 50% 42%, rgba(8,6,4,0.38), rgba(0,0,0,0.62) 72%)",
							}}
						>
							{/* film sprocket rails */}
							<div className="pointer-events-none absolute inset-y-0 left-3 flex w-4 flex-col justify-around opacity-30 sm:left-6">
								{Array.from({ length: 14 }).map((_, i) => (
									<span
										key={i}
										className="mx-auto h-3 w-2.5 rounded-[1px] border border-white/40"
									/>
								))}
							</div>
							<div className="pointer-events-none absolute inset-y-0 right-3 flex w-4 flex-col justify-around opacity-30 sm:right-6">
								{Array.from({ length: 14 }).map((_, i) => (
									<span
										key={i}
										className="mx-auto h-3 w-2.5 rounded-[1px] border border-white/40"
									/>
								))}
							</div>

							<motion.p
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 0.5, y: 0 }}
								transition={{ delay: 0.15 }}
								className="text-[0.65rem] tracking-[0.55em] uppercase"
							>
								Feature presentation · reel 01
							</motion.p>
							<motion.h2
								initial={{ opacity: 0, letterSpacing: "0.4em" }}
								animate={{ opacity: 1, letterSpacing: "0.08em" }}
								transition={{ delay: 0.28, duration: 0.9 }}
								className="mt-6 font-serif text-[clamp(3.5rem,12vw,7rem)] font-light"
							>
								NOIR
							</motion.h2>
							<motion.div
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{ delay: 0.55, duration: 0.7 }}
								className="mt-4 h-px w-40 origin-center bg-gradient-to-r from-transparent via-[#ffe8c4]/60 to-transparent"
							/>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 0.55 }}
								transition={{ delay: 0.7 }}
								className="mt-5 max-w-measure font-serif text-sm italic"
							>
								One lamp. Infinite shadow. A fashion still that answers to your
								hand.
							</motion.p>
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 0.4 }}
								transition={{ delay: 0.9 }}
								className="mt-3 max-w-phone text-[0.7rem] tracking-wide opacity-70"
							>
								Click to place lamps · scroll to iris · cue a scene · plant
								practicals
							</motion.p>
							<motion.span
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1.05 }}
								className="mt-10 border border-white/35 bg-white/5 px-8 py-3.5 text-[0.65rem] tracking-[0.4em] uppercase shadow-[0_0_40px_rgba(255,220,180,0.12)]"
							>
								Open the house lights
							</motion.span>
							<p className="mt-8 font-mono text-[0.55rem] tracking-[0.3em] opacity-30">
								{timecode} · FRM {frame}
							</p>
						</motion.button>
					)}
				</AnimatePresence>

				<div className="relative z-10 flex min-h-dvh flex-col justify-between px-5 py-24 sm:px-10 lg:px-14">
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div className="max-w-measure">
							<p className="text-[0.65rem] tracking-[0.5em] uppercase opacity-50">
								Noir · scene {String(scene + 1).padStart(2, "0")} / 04 · iris{" "}
								{iris.toFixed(0)} · lamps {lamps.length} ·{" "}
								{(sc.temp * 5600).toFixed(0)}K
							</p>
							<p className="mt-2 font-serif text-base italic opacity-70">
								{sc.line}
							</p>
							{/* scene plate strip */}
							<div className="mt-4 flex gap-2">
								{scenes.map((s, i) => (
									<button
										key={s.id}
										type="button"
										onClick={(e) => {
											e.stopPropagation()
											cueScene(i)
										}}
										className={cn(
											"relative h-12 w-9 cursor-pointer overflow-hidden border transition",
											scene === i
												? "border-white/60 opacity-100 ring-1 ring-[#ffe8c4]/40"
												: "border-white/15 opacity-50 hover:opacity-90",
										)}
										aria-label={s.title}
									>
										<img
											src={s.img}
											alt=""
											className="h-full w-full object-cover brightness-75 contrast-125"
											loading={i === scene ? "eager" : "lazy"}
											decoding="async"
											style={{ objectPosition: s.pos }}
										/>
									</button>
								))}
							</div>
						</div>
						<div className="flex flex-wrap justify-end gap-2">
							{scenes.map((s, i) => (
								<button
									key={s.id}
									type="button"
									onClick={(e) => {
										e.stopPropagation()
										cueScene(i)
									}}
									className={cn(
										"cursor-pointer border px-3 py-1.5 text-[0.6rem] tracking-[0.25em] uppercase transition",
										scene === i
											? "border-white/55 bg-white/10 shadow-[0_0_20px_rgba(255,220,180,0.12)]"
											: "border-white/15 opacity-60 hover:opacity-100",
									)}
								>
									{s.title}
								</button>
							))}
						</div>
					</div>

					<div className="mx-auto w-full max-w-desktop">
						{/* density block: big type + slate meta */}
						<div className="mb-6 flex flex-wrap items-end gap-6 opacity-50">
							<div className="h-px flex-1 min-w-[4rem] bg-gradient-to-r from-white/30 to-transparent" />
							<p className="font-mono text-[0.55rem] tracking-[0.35em] uppercase">
								Act {String(scene + 1).padStart(2, "0")} · {sc.id}
							</p>
						</div>
						<motion.h1
							key={sc.id}
							initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							transition={{ duration: 0.55 }}
							className="max-w-laptop font-serif text-[clamp(3rem,11vw,7.5rem)] leading-[0.9] font-light"
						>
							One lamp.
							<br />
							<em className="opacity-70">Infinite shadow.</em>
						</motion.h1>
						<p className="mt-6 max-w-measure text-base leading-relaxed opacity-65">
							Luxury is restraint. Aim the key light. Plant practicals. Dust
							catches in the beam. The frame only admits what you illuminate —
							silhouette waits in the dark until the lamp decides.
						</p>

						{/* instrument row */}
						<div className="mt-8 grid max-w-tablet gap-3 sm:grid-cols-2">
							<label
								className="flex items-center gap-3 border border-white/10 bg-black/30 px-3 py-2 text-[0.6rem] tracking-[0.2em] uppercase opacity-70"
								onClick={(e) => e.stopPropagation()}
							>
								Iris
								<input
									type="range"
									min={10}
									max={56}
									value={iris}
									onChange={(e) => {
										setIris(Number(e.target.value))
										setIrisPulse((p) => p + 1)
									}}
									className="w-full accent-[#e8c9a0]"
									aria-label="Iris"
								/>
								<span className="font-mono w-6">{iris.toFixed(0)}</span>
							</label>
							<label
								className="flex items-center gap-3 border border-white/10 bg-black/30 px-3 py-2 text-[0.6rem] tracking-[0.2em] uppercase opacity-70"
								onClick={(e) => e.stopPropagation()}
							>
								Key Y
								<input
									type="range"
									min={10}
									max={80}
									value={spot.y}
									onChange={(e) => {
										setFollow(false)
										setSpot((s) => ({ ...s, y: Number(e.target.value) }))
									}}
									className="w-full accent-[#e8c9a0]"
									aria-label="Key height"
								/>
								<span className="font-mono w-6">{spot.y.toFixed(0)}</span>
							</label>
						</div>

						<div className="mt-6 flex flex-wrap gap-2">
							{(
								[
									[
										"Center",
										() => {
											setSpot({ x: 50, y: 32 })
											setIrisPulse((p) => p + 1)
										},
									],
									[
										"Tighten",
										() => {
											setIris(14)
											setIrisPulse((p) => p + 1)
										},
									],
									[
										"Flood",
										() => {
											setIris(48)
											setIrisPulse((p) => p + 1)
										},
									],
									[
										"Seed lamps",
										() =>
											setLamps([
												{ x: 22, y: 58, id: Date.now() },
												{ x: 78, y: 42, id: Date.now() + 1 },
												{ x: 50, y: 72, id: Date.now() + 2 },
												{ x: 36, y: 36, id: Date.now() + 3 },
											]),
									],
									["Clear lamps", () => setLamps([])],
									[
										follow ? "Lock lamp" : "Follow",
										() => setFollow((f) => !f),
									],
									["Grain", () => setGrain((g) => !g)],
									["Letterbox", () => setLetterbox((l) => !l)],
									[
										"Flash cut",
										() => {
											setFlash((f) => f + 1)
											setScene((s) => (s + 1) % scenes.length)
											setIrisPulse((p) => p + 1)
										},
									],
								] as const
							).map(([label, fn]) => (
								<button
									key={label}
									type="button"
									onClick={(e) => {
										e.stopPropagation()
										fn()
									}}
									className="cursor-pointer border border-white/20 bg-black/25 px-4 py-2.5 text-[0.62rem] tracking-[0.28em] uppercase transition hover:border-white/45 hover:bg-white/8 hover:shadow-[0_0_24px_rgba(255,220,180,0.1)]"
								>
									{label}
								</button>
							))}
						</div>
					</div>

					{/* bottom slate + slate markers */}
					<div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/15 bg-gradient-to-t from-black/50 to-transparent pt-4">
						<div>
							<p className="font-mono text-[0.6rem] tracking-widest opacity-45">
								ROLL · {sc.id.toUpperCase()} · TEMP{" "}
								{(sc.temp * 5600).toFixed(0)}K · {timecode}
							</p>
							<p className="mt-1 text-[0.55rem] tracking-[0.25em] uppercase opacity-30">
								Key {spot.x.toFixed(0)}×{spot.y.toFixed(0)} · practicals{" "}
								{lamps.length} · grain {grain ? "ON" : "OFF"} ·{" "}
								{letterbox ? "2.39:1" : "OPEN"}
							</p>
						</div>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								setTitleCard(true)
							}}
							className="cursor-pointer border border-white/15 px-3 py-1.5 text-[0.6rem] tracking-[0.3em] uppercase opacity-50 transition hover:border-white/40 hover:opacity-100"
						>
							Title card
						</button>
					</div>
				</div>
			</div>
		</LandingsShell>
	)
}

/* ═══════════════════════════════════════════════════════════
   4 — ZEN  ·  garden of ma
═══════════════════════════════════════════════════════════ */
export function ZenLanding() {
	type Stone = { id: number; x: number; y: number; r: number; moss: number }
	// Deterministic seed stones — dense cluster visible on first paint (no Math.random)
	const seedStones: Stone[] = [
		{ id: 0, x: -90, y: 36, r: 44, moss: 0.42 },
		{ id: 1, x: 140, y: -72, r: 34, moss: 0.18 },
		{ id: 2, x: -150, y: 88, r: 54, moss: 0.58 },
		{ id: 3, x: 72, y: 110, r: 26, moss: 0.28 },
		{ id: 4, x: 200, y: 48, r: 22, moss: 0.22 },
		{ id: 5, x: -40, y: -110, r: 30, moss: 0.35 },
		{ id: 6, x: 30, y: 155, r: 38, moss: 0.5 },
		{ id: 7, x: -210, y: -20, r: 20, moss: 0.15 },
		{ id: 8, x: 175, y: 130, r: 18, moss: 0.4 },
	]
	const [stones, setStones] = useState<Stone[]>(seedStones)
	const [breath, setBreath] = useState(0)
	const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
	const [mode, setMode] = useState<"place" | "rake" | "enso" | "breath">(
		"rake",
	)
	const [season, setSeason] = useState<"dawn" | "noon" | "dusk" | "night">(
		"dawn",
	)
	const [enso, setEnso] = useState(0.82)
	const [showEnso, setShowEnso] = useState(true)
	const [selected, setSelected] = useState<number | null>(null)
	const [rakeCount, setRakeCount] = useState(0)
	const [breathFocus, setBreathFocus] = useState(false)
	const [seasonFlash, setSeasonFlash] = useState(0)
	const gardenRef = useRef<HTMLDivElement>(null)
	const sandRef = useRef<HTMLCanvasElement>(null)
	const rakeLiveRef = useRef<HTMLCanvasElement>(null)
	const drawing = useRef(false)
	const lastPt = useRef<{ x: number; y: number } | null>(null)
	const seasonRef = useRef(season)
	seasonRef.current = season

	const seasons = {
		dawn: {
			bg: "#f2ebe0",
			ink: "#2a241c",
			soft: "#b8a88c",
			glow: "#f0d4a8",
			sand: "#e8dcc8",
			sandDeep: "#c9b89a",
			sky: "#f7e8d0",
			accent: "#c4784a",
			mist: "rgba(255,230,190,0.45)",
		},
		noon: {
			bg: "#e6e0d0",
			ink: "#1a1612",
			soft: "#9a8a70",
			glow: "#fff8e8",
			sand: "#ddd4c0",
			sandDeep: "#b0a088",
			sky: "#d8e4e8",
			accent: "#6a8a6a",
			mist: "rgba(220,230,235,0.3)",
		},
		dusk: {
			bg: "#2c1e28",
			ink: "#f0dcc8",
			soft: "#6a4a52",
			glow: "#8a4050",
			sand: "#3a2830",
			sandDeep: "#1e1418",
			sky: "#4a2838",
			accent: "#e09070",
			mist: "rgba(120,50,70,0.35)",
		},
		night: {
			bg: "#0c0e14",
			ink: "#c8d0dc",
			soft: "#3a4458",
			glow: "#1a2840",
			sand: "#141820",
			sandDeep: "#080a10",
			sky: "#0a1020",
			accent: "#7a9cc8",
			mist: "rgba(40,60,100,0.4)",
		},
	} as const
	const pal = seasons[season]
	const isDark = season === "dusk" || season === "night"

	// breath cycle
	useEffect(() => {
		const cycle: { p: typeof phase; ms: number }[] = [
			{ p: "inhale", ms: 4000 },
			{ p: "hold", ms: 2000 },
			{ p: "exhale", ms: 5000 },
		]
		let i = 0
		let timer = 0
		const tick = () => {
			setPhase(cycle[i].p)
			if (cycle[i].p === "exhale") setBreath((b) => b + 1)
			timer = window.setTimeout(() => {
				i = (i + 1) % cycle.length
				tick()
			}, cycle[i].ms)
		}
		tick()
		return () => clearTimeout(timer)
	}, [])

	// sand base + rake trails + planted beds — always full viewport (window fallback if layout not ready)
	const paintSandBase = () => {
		const c = sandRef.current
		if (!c) return
		const ctx = c.getContext("2d")
		if (!ctx) return
		const dpr = Math.min(devicePixelRatio, 2)
		const rect = c.getBoundingClientRect()
		const W = Math.max(rect.width || c.clientWidth || innerWidth, 2)
		const H = Math.max(rect.height || c.clientHeight || innerHeight, 2)
		c.width = W * dpr
		c.height = H * dpr
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		const s = seasonRef.current
		const p = seasons[s]
		const dark = s === "dusk" || s === "night"
		// deterministic pseudo-noise (stable first paint, no empty frame)
		const n2 = (x: number, y: number) => {
			const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
			return v - Math.floor(v)
		}
		// layered base — sand plate with tonal banding so first paint isn't a flat wash
		const g = ctx.createRadialGradient(
			W * 0.5,
			H * 0.42,
			0,
			W * 0.5,
			H * 0.5,
			Math.max(W, H) * 0.82,
		)
		g.addColorStop(0, p.sand)
		g.addColorStop(0.28, dark ? p.sand : "#efe4d0")
		g.addColorStop(0.55, p.sandDeep)
		g.addColorStop(1, p.bg)
		ctx.fillStyle = g
		ctx.fillRect(0, 0, W, H)
		// diagonal sand strata (reads as material even at low zoom)
		for (let i = 0; i < 18; i++) {
			const y0 = (i / 18) * H
			const band = ctx.createLinearGradient(0, y0, W, y0 + H * 0.08)
			const a = dark ? 0.04 + (i % 3) * 0.015 : 0.045 + (i % 3) * 0.02
			band.addColorStop(
				0,
				dark ? `rgba(30,40,55,${a})` : `rgba(120,100,70,${a})`,
			)
			band.addColorStop(0.5, "transparent")
			band.addColorStop(
				1,
				dark ? `rgba(10,14,22,${a})` : `rgba(90,75,50,${a * 0.9})`,
			)
			ctx.fillStyle = band
			ctx.fillRect(0, y0, W, H * 0.1)
		}

		// moss / planted islands under the sand rings (lush, not empty desert)
		const mossBeds: {
			x: number
			y: number
			rx: number
			ry: number
			a: number
		}[] = [
			{ x: 0.18, y: 0.62, rx: 0.16, ry: 0.12, a: 0.32 },
			{ x: 0.78, y: 0.55, rx: 0.14, ry: 0.11, a: 0.3 },
			{ x: 0.42, y: 0.78, rx: 0.18, ry: 0.1, a: 0.28 },
			{ x: 0.62, y: 0.28, rx: 0.12, ry: 0.09, a: 0.26 },
			{ x: 0.28, y: 0.32, rx: 0.13, ry: 0.1, a: 0.27 },
			{ x: 0.88, y: 0.78, rx: 0.11, ry: 0.09, a: 0.29 },
			{ x: 0.12, y: 0.28, rx: 0.1, ry: 0.08, a: 0.24 },
			{ x: 0.52, y: 0.18, rx: 0.15, ry: 0.07, a: 0.22 },
			{ x: 0.7, y: 0.72, rx: 0.1, ry: 0.08, a: 0.25 },
			{ x: 0.35, y: 0.5, rx: 0.09, ry: 0.07, a: 0.2 },
			{ x: 0.08, y: 0.78, rx: 0.1, ry: 0.08, a: 0.26 },
			{ x: 0.92, y: 0.32, rx: 0.09, ry: 0.07, a: 0.23 },
		]
		for (const bed of mossBeds) {
			const cx = bed.x * W
			const cy = bed.y * H
			const rx = bed.rx * W
			const ry = bed.ry * H
			const mg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry))
			if (dark) {
				mg.addColorStop(0, `rgba(55,95,70,${bed.a + 0.18})`)
				mg.addColorStop(0.45, `rgba(40,70,55,${bed.a * 0.9})`)
				mg.addColorStop(1, "transparent")
			} else {
				mg.addColorStop(0, `rgba(55,100,48,${bed.a + 0.16})`)
				mg.addColorStop(0.45, `rgba(80,120,60,${bed.a * 0.85})`)
				mg.addColorStop(1, "transparent")
			}
			ctx.fillStyle = mg
			ctx.beginPath()
			ctx.ellipse(cx, cy, rx, ry, n2(bed.x, bed.y) * 0.8, 0, Math.PI * 2)
			ctx.fill()
			// fern flecks on moss
			ctx.fillStyle = dark
				? `rgba(90,140,100,${0.28 + bed.a})`
				: `rgba(35,80,40,${0.32 + bed.a})`
			for (let i = 0; i < 48; i++) {
				const u = n2(bed.x * 10 + i, bed.y * 8)
				const v = n2(bed.y * 12 + i, bed.x * 9)
				const px = cx + (u - 0.5) * rx * 1.7
				const py = cy + (v - 0.5) * ry * 1.7
				ctx.beginPath()
				ctx.ellipse(px, py, 2.4 + u * 3.5, 1.2 + v * 1.8, u * 2, 0, Math.PI * 2)
				ctx.fill()
			}
			// taller grass blades on bed edges
			ctx.strokeStyle = dark
				? `rgba(100,150,110,${0.22 + bed.a * 0.5})`
				: `rgba(45,90,40,${0.28 + bed.a * 0.5})`
			ctx.lineWidth = 1.1
			for (let i = 0; i < 16; i++) {
				const u = n2(bed.x * 3 + i, 20)
				const v = n2(21, bed.y * 4 + i)
				const bx = cx + (u - 0.5) * rx * 1.5
				const by = cy + (v - 0.5) * ry * 1.2
				ctx.beginPath()
				ctx.moveTo(bx, by)
				ctx.quadraticCurveTo(
					bx + (u - 0.5) * 8,
					by - 10 - v * 14,
					bx + (u - 0.5) * 14,
					by - 16 - v * 18,
				)
				ctx.stroke()
			}
		}

		// gravel rim / engawa edge — frames the garden as a yard, not bare sand
		const rim = ctx.createRadialGradient(
			W * 0.5,
			H * 0.5,
			Math.min(W, H) * 0.28,
			W * 0.5,
			H * 0.5,
			Math.max(W, H) * 0.74,
		)
		rim.addColorStop(0, "transparent")
		rim.addColorStop(0.5, "transparent")
		rim.addColorStop(
			0.72,
			dark ? "rgba(30,38,48,0.42)" : "rgba(90,78,58,0.32)",
		)
		rim.addColorStop(1, dark ? "rgba(12,16,22,0.62)" : "rgba(70,58,40,0.38)")
		ctx.fillStyle = rim
		ctx.fillRect(0, 0, W, H)
		// engawa plank lines (wooden deck edge)
		ctx.strokeStyle = dark ? "rgba(160,175,195,0.1)" : "rgba(70,55,35,0.14)"
		ctx.lineWidth = 1
		for (let i = 0; i < 9; i++) {
			const t = 0.04 + i * 0.015
			ctx.strokeRect(W * t, H * t, W * (1 - 2 * t), H * (1 - 2 * t))
		}
		// gravel pebbles on rim
		for (let i = 0; i < 420; i++) {
			const ang = n2(i, 0.3) * Math.PI * 2
			const rad = 0.38 + n2(i, 0.7) * 0.28
			const px = W * 0.5 + Math.cos(ang) * rad * Math.max(W, H) * 0.55
			const py = H * 0.5 + Math.sin(ang) * rad * Math.max(W, H) * 0.42
			const sz = 1.2 + n2(i, 1.1) * 2.8
			ctx.fillStyle = dark
				? `rgba(180,195,215,${0.08 + n2(i, 2) * 0.1})`
				: `rgba(60,48,32,${0.12 + n2(i, 2) * 0.14})`
			ctx.beginPath()
			ctx.ellipse(px, py, sz, sz * 0.7, ang, 0, Math.PI * 2)
			ctx.fill()
		}

		// concentric garden beds (raked rings) — high-contrast first-paint texture
		const ringInk = dark ? "rgba(210,220,235," : "rgba(32,24,14,"
		for (let r = 14; r < Math.max(W, H) * 0.98; r += 10) {
			const a = 0.1 + (r % 30 === 14 ? 0.08 : 0) + (r < 120 ? 0.06 : 0)
			ctx.strokeStyle = `${ringInk}${Math.min(a, 0.28)})`
			ctx.lineWidth = r % 40 < 10 ? 1.65 : 1.15
			ctx.beginPath()
			ctx.ellipse(W * 0.5, H * 0.48, r * 1.2, r * 0.72, 0, 0, Math.PI * 2)
			ctx.stroke()
			// micro ripple between primary rings
			if (r % 20 === 14) {
				ctx.strokeStyle = `${ringInk}${a * 0.45})`
				ctx.lineWidth = 0.7
				ctx.beginPath()
				ctx.ellipse(
					W * 0.5,
					H * 0.48,
					(r + 5) * 1.2,
					(r + 5) * 0.72,
					0.02,
					0,
					Math.PI * 2,
				)
				ctx.stroke()
			}
		}
		// secondary offset rings around primary stone seats (match seed cluster)
		const ringCenters = [
			[0.44, 0.52],
			[0.6, 0.4],
			[0.36, 0.6],
			[0.68, 0.56],
			[0.5, 0.36],
			[0.55, 0.66],
			[0.3, 0.44],
		]
		for (const [cxn, cyn] of ringCenters) {
			for (let r = 12; r < 120; r += 8) {
				const a = dark ? 0.1 + (r < 40 ? 0.06 : 0) : 0.12 + (r < 40 ? 0.07 : 0)
				ctx.strokeStyle = dark
					? `rgba(190,210,225,${a})`
					: `rgba(48,36,22,${a})`
				ctx.lineWidth = r % 24 < 8 ? 1.4 : 0.95
				ctx.beginPath()
				ctx.ellipse(
					cxn * W,
					cyn * H,
					r * 1.15,
					r * 0.76,
					n2(cxn, cyn) * 0.4,
					0,
					Math.PI * 2,
				)
				ctx.stroke()
			}
		}

		// pre-raked five-tine trails (deterministic garden memory — first paint already worked)
		const trails: [number, number, number, number][] = [
			[0.08, 0.58, 0.4, 0.4],
			[0.18, 0.76, 0.58, 0.7],
			[0.55, 0.34, 0.92, 0.5],
			[0.45, 0.64, 0.88, 0.82],
			[0.1, 0.32, 0.42, 0.24],
			[0.62, 0.18, 0.94, 0.32],
			[0.26, 0.48, 0.74, 0.56],
			[0.14, 0.88, 0.48, 0.9],
			[0.7, 0.6, 0.96, 0.72],
			[0.32, 0.2, 0.68, 0.28],
			[0.05, 0.45, 0.3, 0.62],
			[0.5, 0.85, 0.78, 0.62],
		]
		for (const [x0n, y0n, x1n, y1n] of trails) {
			const x0 = x0n * W
			const y0 = y0n * H
			const x1 = x1n * W
			const y1 = y1n * H
			const dx = x1 - x0
			const dy = y1 - y0
			const len = Math.hypot(dx, dy) || 1
			const nx = -dy / len
			const ny = dx / len
			const spacing = 4.8
			const alpha = dark ? 0.22 : 0.2
			for (let t = -2; t <= 2; t++) {
				const ox = nx * t * spacing
				const oy = ny * t * spacing
				ctx.beginPath()
				ctx.moveTo(x0 + ox, y0 + oy)
				// slight curve
				ctx.quadraticCurveTo(
					(x0 + x1) / 2 + nx * 16,
					(y0 + y1) / 2 + ny * 16,
					x1 + ox,
					y1 + oy,
				)
				ctx.strokeStyle = dark
					? `rgba(200,210,225,${alpha - Math.abs(t) * 0.03})`
					: `rgba(30,22,12,${alpha - Math.abs(t) * 0.028})`
				ctx.lineWidth = t === 0 ? 1.7 : 1.05
				ctx.lineCap = "round"
				ctx.stroke()
			}
		}

		// parallel rake suggestion bands across garden floor (readable texture)
		for (let y = H * 0.12; y < H * 0.96; y += 7.5) {
			const wave = Math.sin(y * 0.035) * 4
			ctx.strokeStyle = dark
				? `rgba(190,205,220,${0.07 + (Math.sin(y * 0.02) + 1) * 0.025})`
				: `rgba(42,32,18,${0.08 + (Math.sin(y * 0.02) + 1) * 0.03})`
			ctx.lineWidth = 0.85
			ctx.beginPath()
			ctx.moveTo(0, y + wave)
			for (let x = 0; x <= W; x += 40) {
				ctx.lineTo(x, y + Math.sin(x * 0.012 + y * 0.04) * 3.5)
			}
			ctx.stroke()
		}
		// cross-hatch secondary field (shallow angle)
		ctx.strokeStyle = dark ? "rgba(170,190,210,0.045)" : "rgba(55,42,24,0.05)"
		ctx.lineWidth = 0.65
		for (let x = -H; x < W + H; x += 14) {
			ctx.beginPath()
			ctx.moveTo(x, 0)
			ctx.lineTo(x + H * 0.35, H)
			ctx.stroke()
		}

		// grain scatter denser — sand reads as material (multi-size grit)
		for (let i = 0; i < 11000; i++) {
			const x = n2(i * 0.17, 1.3) * W
			const y = n2(2.1, i * 0.19) * H
			const sz = 0.9 + n2(i, 3.3) * 1.6
			ctx.fillStyle = dark
				? `rgba(220,230,240,${0.05 + n2(i, 0.4) * 0.08})`
				: `rgba(35,26,14,${0.055 + n2(i, 0.4) * 0.09})`
			ctx.fillRect(x, y, sz, sz)
		}
		ctx.fillStyle = dark ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.055)"
		for (let i = 0; i < 3600; i++) {
			const x = n2(i * 0.31, 4.2) * W
			const y = n2(5.7, i * 0.27) * H
			ctx.fillRect(x, y, 1.6, 1.6)
		}
		// larger grit clusters (small gravel pockets)
		for (let i = 0; i < 280; i++) {
			const x = n2(i * 2.1, 6) * W
			const y = n2(7, i * 1.9) * H
			ctx.fillStyle = dark
				? `rgba(150,165,185,${0.1 + n2(i, 8) * 0.1})`
				: `rgba(70,55,35,${0.12 + n2(i, 8) * 0.12})`
			ctx.beginPath()
			ctx.arc(x, y, 1.5 + n2(i, 9) * 2.2, 0, Math.PI * 2)
			ctx.fill()
		}

		// fallen leaf scatter (warm accent — garden life)
		for (let i = 0; i < 96; i++) {
			const x = n2(i * 1.3, 8) * W
			const y = n2(9, i * 1.7) * H
			const rot = n2(i, 11) * Math.PI
			const leafA = dark ? 0.18 + n2(i, 2) * 0.14 : 0.26 + n2(i, 2) * 0.18
			ctx.save()
			ctx.translate(x, y)
			ctx.rotate(rot)
			ctx.fillStyle =
				s === "dusk"
					? `rgba(200,90,70,${leafA})`
					: s === "night"
						? `rgba(100,120,90,${leafA * 0.75})`
						: s === "noon"
							? `rgba(80,115,45,${leafA})`
							: `rgba(175,95,48,${leafA})`
			ctx.beginPath()
			ctx.ellipse(0, 0, 5.5 + n2(i, 3) * 5, 2.4 + n2(i, 4) * 1.8, 0, 0, Math.PI * 2)
			ctx.fill()
			// leaf vein
			ctx.strokeStyle = dark
				? `rgba(220,200,160,${leafA * 0.5})`
				: `rgba(90,50,25,${leafA * 0.55})`
			ctx.lineWidth = 0.6
			ctx.beginPath()
			ctx.moveTo(-4, 0)
			ctx.lineTo(5, 0)
			ctx.stroke()
			ctx.restore()
		}

		// koi pond / water mirror (quiet reflective oval — garden landmark)
		{
			const px = W * 0.78
			const py = H * 0.38
			const prx = W * 0.09
			const pry = H * 0.055
			const water = ctx.createRadialGradient(px, py - 4, 0, px, py, prx)
			if (dark) {
				water.addColorStop(0, "rgba(60,100,130,0.35)")
				water.addColorStop(0.6, "rgba(30,55,80,0.28)")
				water.addColorStop(1, "rgba(20,40,55,0.08)")
			} else {
				water.addColorStop(0, "rgba(150,185,175,0.42)")
				water.addColorStop(0.55, "rgba(110,155,145,0.32)")
				water.addColorStop(1, "rgba(90,130,110,0.08)")
			}
			ctx.fillStyle = water
			ctx.beginPath()
			ctx.ellipse(px, py, prx, pry, -0.15, 0, Math.PI * 2)
			ctx.fill()
			ctx.strokeStyle = dark ? "rgba(160,200,220,0.22)" : "rgba(40,80,70,0.28)"
			ctx.lineWidth = 1.2
			ctx.stroke()
			// ripples
			for (let r = 0.35; r < 1; r += 0.22) {
				ctx.strokeStyle = dark
					? `rgba(180,210,230,${0.12 * (1 - r)})`
					: `rgba(50,90,80,${0.16 * (1 - r)})`
				ctx.beginPath()
				ctx.ellipse(px, py, prx * r, pry * r, -0.15, 0, Math.PI * 2)
				ctx.stroke()
			}
		}

		// soft horizon wash + bottom depth
		const sky = ctx.createLinearGradient(0, 0, 0, H * 0.32)
		sky.addColorStop(0, dark ? p.mist : "rgba(255,236,210,0.28)")
		sky.addColorStop(1, "transparent")
		ctx.fillStyle = sky
		ctx.fillRect(0, 0, W, H * 0.32)
		const floor = ctx.createLinearGradient(0, H * 0.62, 0, H)
		floor.addColorStop(0, "transparent")
		floor.addColorStop(1, dark ? "rgba(0,0,0,0.48)" : "rgba(40,30,18,0.22)")
		ctx.fillStyle = floor
		ctx.fillRect(0, H * 0.62, W, H * 0.38)
	}

	useEffect(() => {
		// paint immediately + rAF retries so first screenshot isn't empty sand
		paintSandBase()
		let id2 = 0
		let id3 = 0
		const id1 = requestAnimationFrame(() => {
			paintSandBase()
			id2 = requestAnimationFrame(() => {
				paintSandBase()
				id3 = window.setTimeout(paintSandBase, 48)
			})
		})
		const onResize = () => paintSandBase()
		window.addEventListener("resize", onResize)
		const ro =
			typeof ResizeObserver !== "undefined" && sandRef.current
				? new ResizeObserver(() => paintSandBase())
				: null
		if (sandRef.current && ro) ro.observe(sandRef.current)
		return () => {
			cancelAnimationFrame(id1)
			cancelAnimationFrame(id2)
			clearTimeout(id3)
			window.removeEventListener("resize", onResize)
			ro?.disconnect()
		}
	}, [season])

	const inkStroke = (
		ctx: CanvasRenderingContext2D,
		x0: number,
		y0: number,
		x1: number,
		y1: number,
	) => {
		const dx = x1 - x0
		const dy = y1 - y0
		const len = Math.hypot(dx, dy) || 1
		const nx = -dy / len
		const ny = dx / len
		const spacing = 5.5
		const dark = seasonRef.current === "dusk" || seasonRef.current === "night"
		const alpha = dark ? 0.22 : 0.16
		for (let t = -2; t <= 2; t++) {
			const ox = nx * t * spacing
			const oy = ny * t * spacing
			ctx.beginPath()
			ctx.moveTo(x0 + ox, y0 + oy)
			ctx.lineTo(x1 + ox, y1 + oy)
			ctx.strokeStyle = dark
				? `rgba(200,210,225,${alpha - Math.abs(t) * 0.03})`
				: `rgba(35,28,18,${alpha - Math.abs(t) * 0.025})`
			ctx.lineWidth = t === 0 ? 1.6 : 1.05
			ctx.lineCap = "round"
			ctx.stroke()
		}
		// fine sand scatter along stroke
		for (let i = 0; i < 4; i++) {
			const t = Math.random()
			const px = x0 + dx * t + (Math.random() - 0.5) * 14
			const py = y0 + dy * t + (Math.random() - 0.5) * 14
			ctx.fillStyle = dark
				? "rgba(220,230,240,0.08)"
				: "rgba(50,40,25,0.07)"
			ctx.fillRect(px, py, 1.2, 1.2)
		}
	}

	const onRakeStart = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (mode !== "rake") return
		if ((e.target as HTMLElement).closest("button,[data-stone]")) return
		const r = e.currentTarget.getBoundingClientRect()
		drawing.current = true
		lastPt.current = { x: e.clientX - r.left, y: e.clientY - r.top }
		e.currentTarget.setPointerCapture(e.pointerId)
	}
	const onRakeMove = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (!drawing.current || mode !== "rake" || !lastPt.current) return
		const r = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - r.left
		const y = e.clientY - r.top
		const sand = sandRef.current?.getContext("2d")
		const live = rakeLiveRef.current
		if (sand) {
			inkStroke(sand, lastPt.current.x, lastPt.current.y, x, y)
		}
		if (live) {
			const dpr = Math.min(devicePixelRatio, 2)
			if (
				live.width !== r.width * dpr ||
				live.height !== r.height * dpr
			) {
				live.width = r.width * dpr
				live.height = r.height * dpr
				live.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0)
			}
			const lctx = live.getContext("2d")
			if (lctx) {
				lctx.clearRect(0, 0, r.width, r.height)
				// tip glow
				const g = lctx.createRadialGradient(x, y, 0, x, y, 28)
				const dark =
					seasonRef.current === "dusk" || seasonRef.current === "night"
				g.addColorStop(0, dark ? "rgba(180,200,230,0.35)" : "rgba(80,60,30,0.2)")
				g.addColorStop(1, "transparent")
				lctx.fillStyle = g
				lctx.beginPath()
				lctx.arc(x, y, 28, 0, Math.PI * 2)
				lctx.fill()
			}
		}
		lastPt.current = { x, y }
	}
	const onRakeEnd = () => {
		if (!drawing.current) return
		drawing.current = false
		lastPt.current = null
		setRakeCount((n) => n + 1)
		const live = rakeLiveRef.current?.getContext("2d")
		const el = rakeLiveRef.current
		if (live && el) live.clearRect(0, 0, el.clientWidth, el.clientHeight)
	}

	const placeStone = (e: ReactMouseEvent<HTMLDivElement>) => {
		if (mode !== "place") return
		if ((e.target as HTMLElement).closest("button,[data-stone]")) return
		const r = e.currentTarget.getBoundingClientRect()
		const x = e.clientX - r.left - r.width / 2
		const y = e.clientY - r.top - r.height / 2
		setStones((s) => [
			...s,
			{
				id: Date.now(),
				x,
				y,
				r: 16 + Math.random() * 26,
				moss: Math.random() * 0.6,
			},
		])
	}

	const smoothSand = () => {
		paintSandBase()
		setRakeCount(0)
	}

	const breathScale =
		phase === "inhale" ? 1.12 : phase === "hold" ? 1.16 : 0.88

	return (
		<LandingsShell dark={isDark}>
			<div
				className="relative h-dvh max-h-dvh w-full overflow-hidden transition-[background-color,color] duration-[1800ms] ease-in-out"
				style={{ background: pal.bg, color: pal.ink }}
			>
				{/* full-viewport garden — fixed canvas owns first paint */}
				<div
					ref={gardenRef}
					className={cn(
						"absolute inset-0 h-full w-full",
						mode === "rake"
							? "cursor-crosshair"
							: mode === "place"
								? "cursor-cell"
								: "cursor-default",
					)}
					onClick={placeStone}
					onPointerDown={onRakeStart}
					onPointerMove={onRakeMove}
					onPointerUp={onRakeEnd}
					onPointerCancel={onRakeEnd}
				>
					<canvas
						ref={sandRef}
						className="absolute inset-0 block h-full w-full"
						style={{ width: "100%", height: "100%" }}
					/>
					<canvas
						ref={rakeLiveRef}
						className="pointer-events-none absolute inset-0 block h-full w-full"
						style={{ width: "100%", height: "100%" }}
					/>

					{/* CSS moss beds — first paint lush garden even before sand canvas settles */}
					<div className="pointer-events-none absolute inset-0 overflow-hidden">
						{[
							{ l: "4%", t: "50%", w: "24%", h: "20%", o: 0.72 },
							{ l: "66%", t: "46%", w: "22%", h: "18%", o: 0.68 },
							{ l: "26%", t: "70%", w: "30%", h: "16%", o: 0.65 },
							{ l: "54%", t: "16%", w: "18%", h: "14%", o: 0.58 },
							{ l: "12%", t: "20%", w: "20%", h: "16%", o: 0.62 },
							{ l: "76%", t: "70%", w: "18%", h: "14%", o: 0.68 },
							{ l: "38%", t: "6%", w: "26%", h: "12%", o: 0.5 },
							{ l: "48%", t: "58%", w: "14%", h: "12%", o: 0.45 },
							{ l: "82%", t: "28%", w: "14%", h: "12%", o: 0.55 },
							{ l: "2%", t: "72%", w: "16%", h: "14%", o: 0.6 },
						].map((bed, i) => (
							<div
								key={i}
								className="absolute rounded-[50%]"
								style={{
									left: bed.l,
									top: bed.t,
									width: bed.w,
									height: bed.h,
									opacity: bed.o,
									background: isDark
										? `radial-gradient(ellipse at 40% 40%, rgba(70,120,85,0.7), rgba(30,55,40,0.35) 52%, transparent 74%)`
										: `radial-gradient(ellipse at 40% 40%, rgba(70,120,55,0.68), rgba(100,140,75,0.38) 48%, transparent 74%)`,
									filter: "blur(0.4px)",
								}}
							/>
						))}
						{/* bamboo / reed stalks along left engawa */}
						{Array.from({ length: 22 }, (_, i) => (
							<div
								key={`b${i}`}
								className="absolute bottom-[5%] origin-bottom"
								style={{
									left: `${2 + i * 1.15}%`,
									width: 2.5 + (i % 4),
									height: `${16 + (i % 6) * 4.5}%`,
									borderRadius: 2,
									opacity: 0.42 + (i % 5) * 0.08,
									background: isDark
										? `linear-gradient(to top, rgba(40,70,50,0.95), rgba(90,130,95,0.65), rgba(120,150,110,0.25))`
										: `linear-gradient(to top, rgba(40,78,38,0.92), rgba(80,125,55,0.62), rgba(130,155,85,0.28))`,
									transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (1.5 + (i % 5))}deg)`,
									boxShadow: isDark
										? "0 0 8px rgba(60,100,70,0.25)"
										: "0 0 6px rgba(70,110,50,0.2)",
								}}
							/>
						))}
						{/* bamboo nodes (segment marks) */}
						{Array.from({ length: 12 }, (_, i) => (
							<div
								key={`bn${i}`}
								className="absolute"
								style={{
									left: `${3.2 + i * 1.8}%`,
									bottom: `${12 + (i % 4) * 6}%`,
									width: 8 + (i % 3),
									height: 2,
									borderRadius: 1,
									opacity: 0.35,
									background: isDark
										? "rgba(100,140,110,0.7)"
										: "rgba(45,80,40,0.65)",
								}}
							/>
						))}
						{/* right-side foliage mass */}
						{Array.from({ length: 18 }, (_, i) => (
							<div
								key={`f${i}`}
								className="absolute origin-bottom"
								style={{
									right: `${1 + i * 0.95}%`,
									bottom: `${3 + (i % 4) * 2}%`,
									width: 5 + (i % 4) * 2,
									height: `${14 + (i % 5) * 5.5}%`,
									borderRadius: "45% 45% 12% 12%",
									opacity: 0.4 + (i % 4) * 0.1,
									background: isDark
										? `radial-gradient(circle at 50% 20%, rgba(80,120,90,0.8), rgba(30,50,40,0.4))`
										: `radial-gradient(circle at 50% 20%, rgba(60,110,48,0.78), rgba(45,85,40,0.38))`,
									transform: `rotate(${(i - 8) * 2.8}deg)`,
								}}
							/>
						))}
						{/* maple / canopy blobs (top corners — garden ceiling) */}
						{[
							{ l: "-4%", t: "-6%", w: "32%", h: "22%", o: 0.28 },
							{ l: "78%", t: "-8%", w: "28%", h: "20%", o: 0.24 },
							{ l: "40%", t: "-4%", w: "22%", h: "12%", o: 0.16 },
						].map((can, i) => (
							<div
								key={`can${i}`}
								className="absolute rounded-[50%]"
								style={{
									left: can.l,
									top: can.t,
									width: can.w,
									height: can.h,
									opacity: can.o,
									background: isDark
										? "radial-gradient(ellipse at 50% 70%, rgba(50,80,60,0.55), transparent 70%)"
										: "radial-gradient(ellipse at 50% 70%, rgba(90,120,55,0.45), transparent 70%)",
									filter: "blur(8px)",
								}}
							/>
						))}
						{/* CSS sand-ring suggestion (visible before canvas) */}
						{Array.from({ length: 14 }, (_, i) => {
							const size = 12 + i * 7
							return (
								<div
									key={`ring${i}`}
									className="absolute left-1/2 top-[48%] rounded-full border"
									style={{
										width: `${size}vw`,
										height: `${size * 0.62}vw`,
										marginLeft: `${-size / 2}vw`,
										marginTop: `${-(size * 0.31)}vw`,
										opacity: 0.07 + (i % 3) * 0.025,
										borderColor: isDark
											? "rgba(200,215,230,0.55)"
											: "rgba(40,30,18,0.7)",
										borderWidth: i % 4 === 0 ? 1.5 : 1,
									}}
								/>
							)
						})}
						{/* gravel edge strip (top + bottom) + side engawa */}
						<div
							className="absolute inset-x-0 top-0 h-[9%]"
							style={{
								background: isDark
									? "linear-gradient(to bottom, rgba(20,28,38,0.65), transparent)"
									: "linear-gradient(to bottom, rgba(95,82,60,0.38), transparent)",
							}}
						/>
						<div
							className="absolute inset-x-0 bottom-0 h-[12%]"
							style={{
								background: isDark
									? "linear-gradient(to top, rgba(18,24,32,0.72), transparent)"
									: "linear-gradient(to top, rgba(85,72,50,0.42), transparent)",
							}}
						/>
						<div
							className="absolute inset-y-0 left-0 w-[5%]"
							style={{
								background: isDark
									? "linear-gradient(to right, rgba(18,24,32,0.45), transparent)"
									: "linear-gradient(to right, rgba(80,68,48,0.28), transparent)",
							}}
						/>
						<div
							className="absolute inset-y-0 right-0 w-[5%]"
							style={{
								background: isDark
									? "linear-gradient(to left, rgba(18,24,32,0.45), transparent)"
									: "linear-gradient(to left, rgba(80,68,48,0.28), transparent)",
							}}
						/>
					</div>

					{/* ambient season sky wash — kept light so sand texture reads */}
					<div
						className="pointer-events-none absolute inset-0 transition-all duration-[1800ms] ease-in-out"
						style={{
							background: `
								radial-gradient(ellipse 90% 42% at 50% 8%, ${pal.glow}88, transparent 58%),
								radial-gradient(ellipse 70% 48% at 16% 86%, ${pal.mist}, transparent 55%),
								radial-gradient(ellipse 50% 38% at 90% 72%, ${pal.accent}28, transparent 58%),
								radial-gradient(ellipse 36% 28% at 10% 58%, ${isDark ? "rgba(50,90,60,0.22)" : "rgba(90,130,70,0.14)"}, transparent 70%),
								radial-gradient(ellipse 32% 26% at 92% 48%, ${isDark ? "rgba(45,80,55,0.18)" : "rgba(80,120,65,0.12)"}, transparent 68%)
							`,
						}}
					/>

					{/* dramatic season flash wash */}
					{seasonFlash > 0 && (
						<motion.div
							key={seasonFlash}
							className="pointer-events-none absolute inset-0 z-[5]"
							initial={{ opacity: 0.55 }}
							animate={{ opacity: 0 }}
							transition={{ duration: 1.4, ease: "easeOut" }}
							style={{
								background: `radial-gradient(circle at 50% 40%, ${pal.glow}, ${pal.mist} 45%, transparent 70%)`,
								mixBlendMode: isDark ? "screen" : "multiply",
							}}
						/>
					)}

					{/* breath circle zone — center instrument */}
					<div
						className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center"
						style={{ opacity: breathFocus || mode === "breath" ? 1 : 0.9 }}
					>
						{/* outer pulse rings */}
						{[0, 1, 2].map((i) => (
							<motion.div
								key={i}
								className="absolute rounded-full border transition-[border-color] duration-[1800ms]"
								style={{
									borderColor: `${pal.ink}${i === 0 ? "28" : i === 1 ? "18" : "0c"}`,
									width: `min(${58 + i * 18}vw, ${360 + i * 120}px)`,
									height: `min(${58 + i * 18}vw, ${360 + i * 120}px)`,
								}}
								animate={{
									scale: breathScale * (1 - i * 0.04),
									opacity:
										phase === "hold"
											? 0.6 - i * 0.12
											: phase === "inhale"
												? 0.4 - i * 0.08
												: 0.22 - i * 0.04,
								}}
								transition={{
									duration: phase === "hold" ? 2 : phase === "inhale" ? 4 : 5,
									ease: "easeInOut",
								}}
							/>
						))}
						{/* solid breath core */}
						<motion.div
							className="absolute rounded-full transition-[background,box-shadow] duration-[1800ms]"
							style={{
								width: "min(24vw, 150px)",
								height: "min(24vw, 150px)",
								background: `radial-gradient(circle at 40% 35%, ${pal.glow}, ${pal.soft}99 55%, transparent 72%)`,
								boxShadow: `0 0 90px ${pal.glow}66`,
							}}
							animate={{
								scale: breathScale,
								opacity: phase === "hold" ? 0.95 : 0.6,
							}}
							transition={{
								duration: phase === "hold" ? 2 : phase === "inhale" ? 4 : 5,
								ease: "easeInOut",
							}}
						/>
						{/* enso — visible on first paint */}
						{showEnso && (
							<svg
								className="absolute size-[min(68vw,460px)] transition-[opacity] duration-[1800ms]"
								viewBox="0 0 100 100"
								style={{ opacity: mode === "enso" ? 0.72 : 0.48 }}
							>
								<motion.circle
									cx="50"
									cy="50"
									r="42"
									fill="none"
									stroke={pal.ink}
									strokeWidth={mode === "enso" ? 1.8 : 1.25}
									strokeLinecap="round"
									strokeDasharray={`${enso * 264} 264`}
									strokeDashoffset="18"
									transform="rotate(-95 50 50)"
									animate={{
										opacity: phase === "hold" ? 0.95 : 0.72,
									}}
								/>
								{/* imperfect brush gap highlight */}
								<circle
									cx="50"
									cy="8"
									r="1.6"
									fill={pal.accent}
									opacity={0.75}
								/>
							</svg>
						)}
						{/* phase label in breath zone */}
						{(mode === "breath" || breathFocus) && (
							<div className="absolute text-center">
								<p className="text-[0.55rem] tracking-[0.55em] uppercase opacity-50">
									{phase}
								</p>
								<p className="mt-1 text-3xl font-extralight tracking-[0.4em]">
									{phase === "inhale" ? "吸" : phase === "hold" ? "止" : "呼"}
								</p>
							</div>
						)}
					</div>

					{/* stones — large, high-contrast, above sand */}
					{stones.map((s) => (
						<motion.button
							key={s.id}
							type="button"
							data-stone
							drag
							dragMomentum={false}
							dragElastic={0.04}
							onClick={(e) => {
								e.stopPropagation()
								setSelected(s.id === selected ? null : s.id)
							}}
							onDoubleClick={(e) => {
								e.stopPropagation()
								setStones((all) => all.filter((x) => x.id !== s.id))
								setSelected(null)
							}}
							aria-label={`Stone ${s.id}`}
							className={cn(
								"absolute top-1/2 left-1/2 z-20 cursor-grab rounded-[45%_55%_48%_52%] active:cursor-grabbing",
								selected === s.id && "ring-2 ring-current/45",
							)}
							style={{
								x: s.x,
								y: s.y,
								width: s.r * 2,
								height: s.r * 2,
								marginLeft: -s.r,
								marginTop: -s.r,
								background: `
									radial-gradient(circle at 30% 26%, ${pal.soft}ee, transparent 45%),
									radial-gradient(circle at 72% 72%, ${pal.ink}, ${pal.sandDeep}),
									linear-gradient(145deg, ${pal.soft}, ${pal.ink})
								`,
								boxShadow: `
									0 ${12 + s.r * 0.25}px ${24 + s.r * 0.5}px ${pal.ink}55,
									0 2px 0 ${pal.soft}44,
									inset 0 2px 4px ${pal.soft}88,
									inset 0 -6px 12px ${pal.ink}33
								`,
							}}
							whileDrag={{ scale: 1.12, zIndex: 30 }}
						>
							{/* moss patch */}
							<span
								className="pointer-events-none absolute rounded-full"
								style={{
									left: "16%",
									top: "52%",
									width: `${32 + s.moss * 42}%`,
									height: `${20 + s.moss * 22}%`,
									background: isDark
										? `rgba(70,130,90,${0.32 + s.moss * 0.35})`
										: `rgba(50,95,48,${0.28 + s.moss * 0.4})`,
									filter: "blur(1.5px)",
								}}
							/>
						</motion.button>
					))}

					{/* quiet garden edge stones + pebble scatter (decorative, non-interactive) */}
					{[
						{ l: "6%", t: "auto", b: "8%", s: 18, o: 0.62 },
						{ l: "auto", r: "12%", t: "22%", s: 14, o: 0.52 },
						{ l: "auto", r: "8%", t: "62%", s: 22, o: 0.48 },
						{ l: "18%", t: "38%", s: 12, o: 0.5 },
						{ l: "72%", t: "70%", s: 16, o: 0.55 },
						{ l: "48%", t: "82%", s: 13, o: 0.48 },
						{ l: "88%", t: "40%", s: 11, o: 0.45 },
						{ l: "10%", t: "70%", s: 15, o: 0.52 },
						{ l: "35%", t: "16%", s: 10, o: 0.42 },
						{ l: "60%", t: "12%", s: 17, o: 0.46 },
						{ l: "24%", t: "58%", s: 9, o: 0.4 },
						{ l: "80%", t: "18%", s: 11, o: 0.44 },
						{ l: "4%", t: "42%", s: 13, o: 0.48 },
						{ l: "92%", t: "78%", s: 10, o: 0.4 },
						{ l: "55%", t: "88%", s: 12, o: 0.42 },
						{ l: "42%", t: "28%", s: 8, o: 0.38 },
					].map((p, i) => (
						<div
							key={`pebble-${i}`}
							className="pointer-events-none absolute rounded-[42%_58%_48%_52%]"
							style={{
								left: p.l,
								right: "r" in p ? p.r : undefined,
								top: p.t === "auto" ? undefined : p.t,
								bottom: "b" in p ? p.b : undefined,
								width: p.s,
								height: p.s,
								opacity: p.o,
								background: `radial-gradient(circle at 30% 28%, ${pal.soft}, ${pal.ink})`,
								boxShadow: `0 ${4 + p.s * 0.25}px ${10 + p.s * 0.4}px ${pal.ink}50`,
							}}
						/>
					))}
					{/* stepping-stone path (decorative path to lantern) */}
					{[
						{ l: "14%", b: "18%", s: 22 },
						{ l: "20%", b: "24%", s: 18 },
						{ l: "26%", b: "20%", s: 20 },
						{ l: "32%", b: "26%", s: 16 },
					].map((st, i) => (
						<div
							key={`step-${i}`}
							className="pointer-events-none absolute z-[2] rounded-[40%_60%_45%_55%]"
							style={{
								left: st.l,
								bottom: st.b,
								width: st.s,
								height: st.s * 0.72,
								opacity: 0.42,
								background: `radial-gradient(circle at 35% 30%, ${pal.soft}cc, ${pal.sandDeep})`,
								boxShadow: `0 3px 8px ${pal.ink}35`,
							}}
						/>
					))}
					{/* stone lantern silhouette (left) — garden landmark */}
					<div
						className="pointer-events-none absolute bottom-[14%] left-[9%] z-[3] flex flex-col items-center opacity-72"
						style={{ color: pal.ink }}
					>
						<div
							className="h-2.5 w-8 rounded-sm"
							style={{ background: pal.ink, opacity: 0.65 }}
						/>
						<div
							className="mt-0.5 flex h-7 w-9 items-center justify-center rounded-sm border"
							style={{
								borderColor: `${pal.ink}77`,
								background: `radial-gradient(circle, ${pal.glow}, ${pal.ink}55)`,
								boxShadow: `0 0 28px ${pal.glow}88, 0 0 48px ${pal.glow}44`,
							}}
						>
							<div
								className="size-2.5 rounded-full"
								style={{
									background: pal.glow,
									opacity: 1,
									boxShadow: `0 0 10px ${pal.glow}`,
								}}
							/>
						</div>
						<div
							className="h-12 w-4 rounded-sm"
							style={{ background: `linear-gradient(${pal.soft}, ${pal.ink})` }}
						/>
						<div
							className="h-2 w-10 rounded-sm"
							style={{ background: pal.ink, opacity: 0.6 }}
						/>
					</div>
					{/* secondary smaller lantern (right rear) */}
					<div
						className="pointer-events-none absolute bottom-[22%] right-[14%] z-[3] flex scale-75 flex-col items-center opacity-45"
						style={{ color: pal.ink }}
					>
						<div
							className="h-1.5 w-5 rounded-sm"
							style={{ background: pal.ink, opacity: 0.5 }}
						/>
						<div
							className="mt-0.5 flex h-5 w-6 items-center justify-center rounded-sm border"
							style={{
								borderColor: `${pal.ink}55`,
								background: `radial-gradient(circle, ${pal.glow}88, ${pal.ink}33)`,
								boxShadow: `0 0 16px ${pal.glow}55`,
							}}
						>
							<div
								className="size-1.5 rounded-full"
								style={{ background: pal.glow }}
							/>
						</div>
						<div
							className="h-7 w-2.5 rounded-sm"
							style={{ background: `linear-gradient(${pal.soft}, ${pal.ink})` }}
						/>
					</div>
				</div>

				{/* HUD — floats over garden, does not own layout */}
				<div className="pointer-events-none relative z-30 flex h-full flex-col justify-between px-4 pt-20 pb-5 sm:px-8">
					<div className="pointer-events-auto flex flex-wrap items-start justify-between gap-4">
						<div>
							<p className="text-[0.6rem] tracking-[0.5em] uppercase opacity-45">
								Zen · {season} · {phase} · breath {breath} · stones{" "}
								{stones.length} · rakes {rakeCount}
							</p>
							<h1 className="mt-3 text-[clamp(2.8rem,11vw,5.5rem)] font-extralight tracking-[0.4em]">
								間
							</h1>
							<p className="mt-2 max-w-phone text-sm leading-relaxed opacity-50">
								Ma — charged interval. The garden is the page. Rake. Place.
								Breathe. Leave space unfinished.
							</p>
						</div>
						<div className="flex flex-col items-end gap-2">
							<div className="flex flex-wrap justify-end gap-1.5">
								{(["rake", "place", "enso", "breath"] as const).map((m) => (
									<button
										key={m}
										type="button"
										onClick={() => {
											setMode(m)
											setBreathFocus(m === "breath")
										}}
										className={cn(
											"cursor-pointer border px-3.5 py-2 text-[0.58rem] tracking-[0.28em] uppercase backdrop-blur-sm transition",
											mode === m
												? "border-current/45 bg-current/10"
												: "border-current/12 bg-black/5 opacity-55 hover:opacity-100",
										)}
									>
										{m}
									</button>
								))}
							</div>
							<div className="flex flex-wrap justify-end gap-1.5">
								{(
									[
										["dawn", "#f0d4a8"],
										["noon", "#d8e4e8"],
										["dusk", "#8a4050"],
										["night", "#1a2840"],
									] as const
								).map(([s, swatch]) => (
									<button
										key={s}
										type="button"
										onClick={() => {
											if (s === season) return
											setSeason(s)
											setSeasonFlash((n) => n + 1)
										}}
										className={cn(
											"flex cursor-pointer items-center gap-2 border px-3 py-1.5 text-[0.55rem] tracking-[0.22em] uppercase backdrop-blur-sm transition-all duration-500",
											season === s
												? "border-current/50 bg-current/12 shadow-[0_0_24px_currentColor]"
												: "border-current/10 opacity-45 hover:opacity-80",
										)}
										style={
											season === s
												? { boxShadow: `0 0 20px ${swatch}66` }
												: undefined
										}
									>
										<span
											className="size-2.5 rounded-full ring-1 ring-current/20"
											style={{ background: swatch }}
										/>
										{s}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* bottom instrument bar */}
					<div className="pointer-events-auto flex flex-col items-center gap-3">
						<div className="flex flex-wrap items-center justify-center gap-2">
							<button
								type="button"
								onClick={() =>
									setStones((s) => [
										...s,
										{
											id: Date.now(),
											x: (Math.random() - 0.5) * 300,
											y: (Math.random() - 0.5) * 200,
											r: 20 + Math.random() * 30,
											moss: Math.random() * 0.6,
										},
									])
								}
								className="cursor-pointer border border-current/20 bg-black/5 px-5 py-2 text-[0.62rem] tracking-[0.3em] uppercase backdrop-blur-sm"
							>
								Place stone
							</button>
							<button
								type="button"
								onClick={smoothSand}
								className="cursor-pointer border border-current/20 bg-black/5 px-5 py-2 text-[0.62rem] tracking-[0.3em] uppercase backdrop-blur-sm"
							>
								Smooth sand
							</button>
							<button
								type="button"
								onClick={() => {
									setStones(seedStones)
									smoothSand()
									setSelected(null)
								}}
								className="cursor-pointer border border-current/20 bg-black/5 px-5 py-2 text-[0.62rem] tracking-[0.3em] uppercase backdrop-blur-sm"
							>
								Reset garden
							</button>
							<button
								type="button"
								onClick={() => setShowEnso((v) => !v)}
								className="cursor-pointer border border-current/20 bg-black/5 px-5 py-2 text-[0.62rem] tracking-[0.3em] uppercase backdrop-blur-sm"
							>
								Enso {showEnso ? "on" : "off"}
							</button>
							{selected !== null && (
								<button
									type="button"
									onClick={() => {
										setStones((all) => all.filter((x) => x.id !== selected))
										setSelected(null)
									}}
									className="cursor-pointer border border-current/20 bg-black/5 px-5 py-2 text-[0.62rem] tracking-[0.3em] uppercase backdrop-blur-sm"
								>
									Remove stone
								</button>
							)}
						</div>
						{mode === "enso" && (
							<label className="flex items-center gap-3 border border-current/15 bg-black/5 px-4 py-2 text-[0.6rem] tracking-[0.3em] uppercase backdrop-blur-sm">
								Openness
								<input
									type="range"
									min={0.12}
									max={0.98}
									step={0.01}
									value={enso}
									onChange={(e) => setEnso(Number(e.target.value))}
									className="w-36 accent-current"
								/>
								<span className="opacity-50 tabular-nums">
									{Math.round(enso * 100)}%
								</span>
							</label>
						)}
						<p className="text-center text-[0.52rem] tracking-[0.35em] uppercase opacity-35">
							{mode === "rake"
								? "Drag across sand — five-tine trails persist"
								: mode === "place"
									? "Click garden to place · drag stones · double-click remove"
									: mode === "enso"
										? "Tune the imperfect circle — leave the gap"
										: "Follow the circle · inhale 4 · hold 2 · exhale 5"}
						</p>
					</div>
				</div>
			</div>
		</LandingsShell>
	)
}

/* ═══════════════════════════════════════════════════════════
   5 — NEON  ·  night city rain engine
═══════════════════════════════════════════════════════════ */
export function NeonLanding() {
	type NeonMode = "rain" | "burst" | "scan" | "glitch" | "storm"
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const flashLayerRef = useRef<HTMLDivElement>(null)
	const modeRef = useRef<NeonMode>("storm")
	const hueRef = useRef(300)
	const densRef = useRef(1.8)
	const pointerRef = useRef({ x: 0, y: 0 })
	const signsRef = useRef<
		{ t: string; on: boolean; x: number; y: number; flicker: number }[]
	>([])
	const [hits, setHits] = useState(0)
	// Storm-first paint — electric district night hits hard before any click (EE2 denser)
	const [mode, setMode] = useState<NeonMode>("storm")
	const [hue, setHue] = useState(300)
	const [density, setDensity] = useState(1.8)
	const [signs, setSigns] = useState(() =>
		// Fully deterministic — no Math.random in initial state (SSR hydrate-safe)
		[
			"OPEN",
			"24H",
			"LOVE",
			"NOIR",
			"LIVE",
			"VOID",
			"TOKYO",
			"BAR",
			"ARC",
			"BOLT",
			"GRID",
			"WAVE",
		].map((t, i) => ({
			t,
			on: true,
			x: 3 + (i % 4) * 24 + (i % 2) * 2.5 + (i > 7 ? 6 : 0),
			y: 12 + Math.floor(i / 4) * 16 + (i % 3) * 2.2,
			flicker: ((i * 17 + 3) % 100) / 100,
		})),
	)
	const [strobe, setStrobe] = useState(false)
	const [district, setDistrict] = useState("MIDNIGHT")

	modeRef.current = mode
	hueRef.current = hue
	densRef.current = density
	signsRef.current = signs

	useEffect(() => {
		const c = canvasRef.current
		if (!c) return
		const ctx = c.getContext("2d")
		if (!ctx) return
		let raf = 0
		let t = 0
		const dpr = Math.min(devicePixelRatio, 1.75)
		const resize = () => {
			c.width = innerWidth * dpr
			c.height = innerHeight * dpr
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		}
		resize()

		type Drop = {
			x: number
			y: number
			s: number
			len: number
			w: number
			a: number
			hue: number
			vx: number
			kind: "rain" | "spark" | "orb"
		}
		type Ripple = { x: number; y: number; r: number; a: number; hue: number }
		type Bolt = {
			segs: { x: number; y: number }[]
			branches: { x: number; y: number }[][]
			life: number
			width: number
			hue: number
		}

		const drops: Drop[] = []
		const ripples: Ripple[] = []
		const bolts: Bolt[] = []
		let sheetFlash = 0
		let prevMode: NeonMode = modeRef.current
		let openingBurst = modeRef.current === "storm"
		// Deterministic puddles (client-only paint, but stable across remounts) — EE2 denser wet street
		const puddles = Array.from({ length: 24 }, (_, i) => ({
			x: 0.03 + (i % 6) * 0.16 + ((i * 7) % 5) * 0.01,
			y: 0.74 + Math.floor(i / 6) * 0.055 + ((i * 3) % 4) * 0.007,
			rx: 48 + ((i * 13) % 88),
			ry: 9 + ((i * 5) % 16),
		}))

		const spawnAmbient = (n: number, spreadY = true) => {
			const baseHue = hueRef.current
			const m = modeRef.current
			for (let i = 0; i < n; i++) {
				const thick = m === "storm" || m === "rain"
				const isStorm = m === "storm"
				drops.push({
					x: Math.random() * innerWidth,
					y: spreadY ? Math.random() * innerHeight : -Math.random() * 100,
					s: (Math.random() * 5 + 2.6) * (isStorm ? 1.85 : 1),
					len: thick
						? (isStorm ? 22 : 16) + Math.random() * (isStorm ? 48 : 32)
						: 9 + Math.random() * 18,
					w: thick
						? (isStorm ? 2.4 : 2) + Math.random() * (isStorm ? 3.2 : 2.6)
						: 1.3 + Math.random() * 1.5,
					a: 0.55 + Math.random() * (isStorm ? 0.45 : 0.48),
					hue: isStorm
						? 195 + Math.random() * 40 + (Math.random() > 0.7 ? baseHue * 0.15 : 0)
						: baseHue + (Math.random() - 0.5) * 55,
					vx:
						(isStorm ? -4.6 : m === "scan" ? 0.2 : -0.55) +
						(Math.random() - 0.5) * (isStorm ? 2.4 : 1.2),
					kind: "rain",
				})
			}
		}
		// thick storm curtain on first paint (EE2 heavier sheet)
		spawnAmbient(modeRef.current === "storm" ? 720 : 360, true)

		// Deterministic skyline + windows (no pure-random seed flicker on remount)
		const skyline = Array.from({ length: 56 }, (_, i) => {
			const mid = Math.abs(i - 28) / 28
			return 0.14 + (1 - mid) * 0.28 + ((i * 17 + 5) % 32) / 100
		})
		const windowSeed = Array.from({ length: 56 }, (_, bi) =>
			Array.from({ length: 28 }, (__, wi) => ((bi * 11 + wi * 7) % 10) > 3),
		)
		// street lamp posts (deterministic positions for first-paint mass)
		const streetLamps = Array.from({ length: 9 }, (_, i) => ({
			x: 0.06 + i * 0.11 + ((i * 3) % 5) * 0.008,
			h: 0.14 + ((i * 7) % 5) * 0.012,
		}))

		const spawnBolt = (W: number, baseY: number, mega = false) => {
			const segs: { x: number; y: number }[] = []
			const branches: { x: number; y: number }[][] = []
			let lx = W * (0.12 + Math.random() * 0.76)
			let ly = 0
			segs.push({ x: lx, y: ly })
			while (ly < baseY) {
				const step = (mega ? 22 : 28) + Math.random() * (mega ? 38 : 48)
				lx += (Math.random() - 0.5) * (mega ? 90 : 70)
				ly += step
				const ny = Math.min(ly, baseY)
				segs.push({ x: lx, y: ny })
				// forked side branches
				if (Math.random() > (mega ? 0.35 : 0.55) && ly < baseY * 0.85) {
					const branch: { x: number; y: number }[] = [{ x: lx, y: ny }]
					let bx = lx
					let by = ny
					const forks = mega ? 4 + Math.floor(Math.random() * 3) : 2 + Math.floor(Math.random() * 3)
					for (let f = 0; f < forks; f++) {
						bx += (Math.random() - 0.35) * 55 * (Math.random() > 0.5 ? 1 : -1)
						by += 18 + Math.random() * 36
						branch.push({ x: bx, y: Math.min(by, baseY) })
					}
					branches.push(branch)
				}
			}
			bolts.push({
				segs,
				branches,
				life: mega ? 1.15 : 1,
				width: mega ? 4.2 : 2.6 + Math.random() * 1.4,
				hue: 200 + Math.random() * 35,
			})
			// street strike sparks
			const tip = segs[segs.length - 1]
			for (let i = 0; i < (mega ? 28 : 14); i++) {
				const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI
				const sp = Math.random() * 7 + 2
				drops.push({
					x: tip.x,
					y: tip.y - 4,
					s: sp,
					len: 8 + Math.random() * 14,
					w: 1.2 + Math.random() * 1.8,
					a: 1,
					hue: 190 + Math.random() * 50,
					vx: Math.cos(ang) * sp,
					kind: "spark",
				})
			}
			for (let i = 0; i < 4; i++) {
				ripples.push({
					x: tip.x + (Math.random() - 0.5) * 30,
					y: baseY + 6 + i * 3,
					r: 6 + i * 10,
					a: mega ? 0.85 : 0.55,
					hue: 210 + i * 8,
				})
			}
			sheetFlash = Math.max(sheetFlash, mega ? 0.92 : 0.55 + Math.random() * 0.3)
		}

		const burstAt = (x: number, y: number, m: NeonMode) => {
			const n =
				m === "burst" ? 160 : m === "storm" ? 220 : m === "glitch" ? 90 : 70
			for (let i = 0; i < n; i++) {
				const ang =
					m === "scan"
						? -Math.PI / 2 + (Math.random() - 0.5) * 0.35
						: Math.random() * Math.PI * 2
				const sp = Math.random() * 9 + 2.5
				drops.push({
					x: x + (m === "glitch" ? (Math.random() - 0.5) * 100 : 0),
					y: y + (m === "glitch" ? (Math.random() - 0.5) * 50 : 0),
					s: sp,
					len: 10 + Math.random() * 20,
					w: 1.5 + Math.random() * 2,
					a: 1,
					hue:
						m === "burst"
							? hueRef.current + Math.random() * 50
							: m === "storm"
								? 190 + Math.random() * 50
								: hueRef.current + (Math.random() - 0.5) * 90,
					vx: Math.cos(ang) * sp * (m === "burst" || m === "storm" ? 0.7 : 0.2),
					kind: m === "burst" ? "orb" : m === "glitch" ? "spark" : "rain",
				})
			}
			// street splash rings
			const baseY = innerHeight * 0.72
			if (y > baseY - 40) {
				for (let i = 0; i < 3; i++) {
					ripples.push({
						x,
						y: Math.max(y, baseY + 4),
						r: 4 + i * 8,
						a: 0.7,
						hue: hueRef.current + i * 20,
					})
				}
			} else {
				ripples.push({
					x,
					y: baseY + 12,
					r: 6,
					a: 0.45,
					hue: hueRef.current,
				})
			}
			if (m === "storm") {
				spawnBolt(innerWidth, baseY, true)
			}
			setHits((h) => h + 1)
		}

		const onClick = (e: MouseEvent) => {
			if ((e.target as HTMLElement).closest("button,input,label,a")) return
			burstAt(e.clientX, e.clientY, modeRef.current)
		}
		const onMove = (e: PointerEvent) => {
			pointerRef.current = { x: e.clientX, y: e.clientY }
		}
		window.addEventListener("click", onClick)
		window.addEventListener("pointermove", onMove, { passive: true })
		window.addEventListener("resize", resize)

		// solid first frame — dense storm city, not black void (EE2 first-paint drama)
		{
			const W = innerWidth
			const H = innerHeight
			const baseY = H * 0.72
			const h0 = hueRef.current
			const isStorm0 = modeRef.current === "storm"
			ctx.fillStyle = "#04020c"
			ctx.fillRect(0, 0, W, H)
			// charged sky
			const sky0 = ctx.createLinearGradient(0, 0, 0, baseY)
			if (isStorm0) {
				sky0.addColorStop(0, "rgba(6,10,32,0.95)")
				sky0.addColorStop(0.45, "rgba(12,8,36,0.7)")
				sky0.addColorStop(1, "hsla(210, 70%, 38%, 0.35)")
			} else {
				sky0.addColorStop(0, "rgba(12,0,28,0.9)")
				sky0.addColorStop(1, `hsla(${h0}, 70%, 30%, 0.28)`)
			}
			ctx.fillStyle = sky0
			ctx.fillRect(0, 0, W, baseY)
			// cloud bank mass
			if (isStorm0) {
				for (let i = 0; i < 11; i++) {
					const cx = ((i * 0.17) % 1.2) * W - W * 0.05
					const cy = H * (0.03 + (i % 3) * 0.032)
					const cr = W * (0.16 + (i % 4) * 0.045)
					const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr)
					cg.addColorStop(0, `rgba(20,24,52,${0.48 + (i % 3) * 0.05})`)
					cg.addColorStop(0.55, "rgba(8,10,28,0.28)")
					cg.addColorStop(1, "transparent")
					ctx.fillStyle = cg
					ctx.beginPath()
					ctx.ellipse(cx, cy, cr, cr * 0.4, 0, 0, Math.PI * 2)
					ctx.fill()
				}
				const charge0 = ctx.createLinearGradient(0, 0, 0, H * 0.3)
				charge0.addColorStop(0, "hsla(215, 85%, 58%, 0.14)")
				charge0.addColorStop(1, "transparent")
				ctx.fillStyle = charge0
				ctx.fillRect(0, 0, W, H * 0.3)
			}
			// skyline + roof strips + windows
			const bw0 = W / skyline.length
			for (let i = 0; i < skyline.length; i++) {
				const bh = H * skyline[i] * (isStorm0 ? 1.08 : 1)
				const x = i * bw0
				const bg = ctx.createLinearGradient(x, baseY - bh, x, baseY)
				bg.addColorStop(0, "rgba(12,4,26,0.97)")
				bg.addColorStop(1, "rgba(2,0,8,0.99)")
				ctx.fillStyle = bg
				ctx.fillRect(x, baseY - bh, bw0 + 1.5, bh + 2)
				if (i % 2 === 0) {
					ctx.shadowBlur = isStorm0 ? 20 : 12
					ctx.shadowColor = `hsla(${h0 + i * 7}, 100%, 60%, 0.7)`
					ctx.fillStyle = `hsla(${h0 + i * 7}, 95%, 62%, 0.75)`
					ctx.fillRect(x + 2, baseY - bh, bw0 - 2, 2.2)
					ctx.shadowBlur = 0
				}
				const wins = windowSeed[i]
				let wi = 0
				for (let wy = baseY - bh + 8; wy < baseY - 10; wy += 10) {
					for (let wx = x + 4; wx < x + bw0 - 4; wx += 8) {
						const lit = wins[wi++ % wins.length]
						if (!lit) continue
						ctx.fillStyle = `hsla(${h0 + i * 5}, 95%, 68%, 0.55)`
						ctx.fillRect(wx, wy, 3.2, 4.5)
					}
				}
			}
			// wet asphalt + puddle glints
			const as0 = ctx.createLinearGradient(0, baseY, 0, H)
			as0.addColorStop(0, "rgba(8,4,16,0.95)")
			as0.addColorStop(0.4, `hsla(${h0}, 40%, 12%, 0.9)`)
			as0.addColorStop(1, "rgba(2,0,6,0.98)")
			ctx.fillStyle = as0
			ctx.fillRect(0, baseY, W, H - baseY)
			for (const pud of puddles) {
				const px = pud.x * W
				const py = pud.y * H
				const pg = ctx.createRadialGradient(px, py, 0, px, py, pud.rx)
				pg.addColorStop(0, `hsla(${h0 + 20}, 90%, 65%, 0.32)`)
				pg.addColorStop(0.45, `hsla(${h0}, 80%, 50%, 0.1)`)
				pg.addColorStop(1, "transparent")
				ctx.fillStyle = pg
				ctx.beginPath()
				ctx.ellipse(px, py, pud.rx, pud.ry, 0, 0, Math.PI * 2)
				ctx.fill()
			}
			// street lamps first paint
			for (const lamp of streetLamps) {
				const lx = lamp.x * W
				const ly = baseY
				const lh = lamp.h * H
				ctx.fillStyle = "rgba(18,14,28,0.95)"
				ctx.fillRect(lx - 1.5, ly - lh, 3, lh)
				const lg = ctx.createRadialGradient(lx, ly - lh, 0, lx, ly - lh, 70)
				lg.addColorStop(0, `hsla(${isStorm0 ? 210 : h0}, 100%, 78%, 0.55)`)
				lg.addColorStop(0.4, `hsla(${isStorm0 ? 200 : h0}, 90%, 55%, 0.18)`)
				lg.addColorStop(1, "transparent")
				ctx.fillStyle = lg
				ctx.beginPath()
				ctx.arc(lx, ly - lh, 70, 0, Math.PI * 2)
				ctx.fill()
			}
			// rain curtain seed (already in drops[])
			for (const d of drops) {
				if (d.kind !== "rain") continue
				const dx = d.vx * (isStorm0 ? 3.2 : 2)
				const grad = ctx.createLinearGradient(d.x, d.y, d.x + dx, d.y + d.len)
				grad.addColorStop(0, `hsla(${d.hue}, 90%, 80%, 0)`)
				grad.addColorStop(0.4, `hsla(${d.hue}, 95%, 75%, ${d.a})`)
				grad.addColorStop(1, `hsla(${d.hue}, 100%, 85%, ${d.a * 0.85})`)
				ctx.strokeStyle = grad
				ctx.lineWidth = d.w
				ctx.lineCap = "round"
				ctx.beginPath()
				ctx.moveTo(d.x, d.y)
				ctx.lineTo(d.x + dx, d.y + d.len)
				ctx.stroke()
			}
			// opening mega bolt on first paint when storm
			if (isStorm0) {
				spawnBolt(W, baseY, true)
				sheetFlash = 0.88
				const wash = ctx.createRadialGradient(
					W * 0.5,
					H * 0.12,
					0,
					W * 0.5,
					H * 0.35,
					H * 0.9,
				)
				wash.addColorStop(0, "rgba(210,230,255,0.42)")
				wash.addColorStop(0.4, "rgba(150,185,255,0.16)")
				wash.addColorStop(1, "transparent")
				ctx.fillStyle = wash
				ctx.fillRect(0, 0, W, H)
			}
		}

		const loop = () => {
			t += 0.016
			const m = modeRef.current
			const dens = densRef.current
			const baseHue = hueRef.current
			const W = innerWidth
			const H = innerHeight
			const baseY = H * 0.72
			const wind =
				m === "storm"
					? -5.4 + Math.sin(t * 1.7) * 1.1
					: m === "glitch"
						? Math.sin(t * 8) * 2
						: -0.7

			// re-enter storm → opening sequence again
			if (m === "storm" && prevMode !== "storm") {
				openingBurst = true
				spawnAmbient(180, true)
			}
			prevMode = m

			// wet night fade (lighter alpha so rain stays dense/visible)
			ctx.fillStyle =
				m === "glitch"
					? "rgba(8,0,18,0.18)"
					: m === "storm"
						? "rgba(2,3,16,0.12)"
						: "rgba(5,1,12,0.12)"
			ctx.fillRect(0, 0, W, H)

			// deep sky + horizon bloom
			const sky = ctx.createLinearGradient(0, 0, 0, baseY)
			if (m === "storm") {
				sky.addColorStop(0, "rgba(4,8,28,0.55)")
				sky.addColorStop(0.4, "rgba(10,6,32,0.28)")
				sky.addColorStop(0.75, `hsla(${baseHue + 40}, 40%, 22%, 0.14)`)
				sky.addColorStop(1, `hsla(210, 70%, 42%, 0.22)`)
			} else {
				sky.addColorStop(0, "rgba(12,0,28,0.35)")
				sky.addColorStop(0.55, `hsla(${baseHue}, 55%, 18%, 0.12)`)
				sky.addColorStop(1, `hsla(${baseHue + 30}, 80%, 40%, 0.18)`)
			}
			ctx.fillStyle = sky
			ctx.fillRect(0, 0, W, baseY)

			// storm cloud bank (EE2 heavier first-paint mass)
			if (m === "storm") {
				for (let i = 0; i < 12; i++) {
					const cx = ((i * 0.155 + t * 0.014) % 1.4) * W - W * 0.12
					const cy = H * (0.03 + (i % 4) * 0.028)
					const cr = W * (0.17 + (i % 5) * 0.038)
					const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr)
					cg.addColorStop(0, `rgba(18,22,52,${0.46 + (i % 3) * 0.06})`)
					cg.addColorStop(0.5, `rgba(8,10,30,0.26)`)
					cg.addColorStop(1, "transparent")
					ctx.fillStyle = cg
					ctx.beginPath()
					ctx.ellipse(cx, cy, cr, cr * 0.4, 0, 0, Math.PI * 2)
					ctx.fill()
				}
				// charged underbelly + lateral sheet glow
				const charge = ctx.createLinearGradient(0, 0, 0, H * 0.32)
				charge.addColorStop(0, `hsla(215, 85%, 58%, ${0.08 + sheetFlash * 0.22})`)
				charge.addColorStop(1, "transparent")
				ctx.fillStyle = charge
				ctx.fillRect(0, 0, W, H * 0.32)
				const sideL = ctx.createLinearGradient(0, 0, W * 0.35, 0)
				sideL.addColorStop(0, `hsla(210, 80%, 55%, ${0.06 + sheetFlash * 0.12})`)
				sideL.addColorStop(1, "transparent")
				ctx.fillStyle = sideL
				ctx.fillRect(0, 0, W * 0.35, baseY)
				const sideR = ctx.createLinearGradient(W, 0, W * 0.65, 0)
				sideR.addColorStop(0, `hsla(230, 75%, 55%, ${0.05 + sheetFlash * 0.1})`)
				sideR.addColorStop(1, "transparent")
				ctx.fillStyle = sideR
				ctx.fillRect(W * 0.65, 0, W * 0.35, baseY)
			}

			// city silhouette + windows
			const bw = W / skyline.length
			const powerDim = m === "storm" ? 0.55 + sheetFlash * 0.9 : 1
			for (let i = 0; i < skyline.length; i++) {
				const bh = H * skyline[i] * (m === "storm" ? 1.06 : 1)
				const x = i * bw
				const buildingGrad = ctx.createLinearGradient(x, baseY - bh, x, baseY)
				buildingGrad.addColorStop(0, "rgba(10,2,22,0.95)")
				buildingGrad.addColorStop(1, "rgba(2,0,8,0.98)")
				ctx.fillStyle = buildingGrad
				ctx.fillRect(x, baseY - bh, bw + 1.5, bh + 2)

				// neon strip on roof edges
				if (i % 3 === 0) {
					const stripA = m === "storm" ? 0.55 + sheetFlash * 0.55 : 0.85
					ctx.shadowBlur = m === "storm" ? 22 : 14
					ctx.shadowColor = `hsla(${baseHue + i * 8}, 100%, 60%, ${stripA})`
					ctx.fillStyle = `hsla(${baseHue + i * 8}, 95%, 62%, ${stripA})`
					ctx.fillRect(x + 2, baseY - bh, bw - 2, 2)
					ctx.shadowBlur = 0
				}

				const wins = windowSeed[i]
				let wi = 0
				for (let wy = baseY - bh + 10; wy < baseY - 12; wy += 11) {
					for (let wx = x + 5; wx < x + bw - 5; wx += 9) {
						const lit = wins[wi++ % wins.length]
						if (!lit) continue
						// storm brownout + flash surge
						const flicker =
							0.55 + 0.45 * Math.sin(t * 1.8 + i * 2.1 + wy * 0.05)
						const stormKill =
							m === "storm" &&
							Math.sin(t * 11 + i * 3.7 + wy * 0.02) < -0.55 &&
							sheetFlash < 0.2
						if (flicker < 0.25 || stormKill) continue
						const la = (0.35 + flicker * 0.45) * powerDim
						ctx.fillStyle = `hsla(${baseHue + i * 5}, 95%, 68%, ${la})`
						ctx.fillRect(wx, wy, 3.5, 5)
					}
				}
			}

			// canvas-drawn neon sign halos (behind DOM signs)
			for (const s of signsRef.current) {
				if (!s.on) continue
				const sx = (s.x / 100) * W + 40
				const sy = (s.y / 100) * H + 12
				const sh = baseHue + s.t.charCodeAt(0)
				const pulse =
					0.7 +
					0.3 * Math.sin(t * 3 + s.flicker * 10) +
					(m === "storm" ? sheetFlash * 0.8 : 0)
				const rad = m === "storm" ? 120 : 90
				const rg = ctx.createRadialGradient(sx, sy, 0, sx, sy, rad)
				rg.addColorStop(0, `hsla(${sh}, 100%, 65%, ${0.28 * pulse})`)
				rg.addColorStop(0.45, `hsla(${sh}, 100%, 50%, ${0.1 * pulse})`)
				rg.addColorStop(1, "transparent")
				ctx.fillStyle = rg
				ctx.fillRect(sx - rad, sy - 50, rad * 2, 100)
			}

			// wet asphalt plate
			const asphalt = ctx.createLinearGradient(0, baseY, 0, H)
			asphalt.addColorStop(0, "rgba(8,4,16,0.92)")
			asphalt.addColorStop(0.35, `hsla(${baseHue}, 40%, 12%, 0.88)`)
			asphalt.addColorStop(1, "rgba(2,0,6,0.96)")
			ctx.fillStyle = asphalt
			ctx.fillRect(0, baseY, W, H - baseY)

			// mirrored skyline reflection (wet street)
			ctx.save()
			ctx.beginPath()
			ctx.rect(0, baseY, W, H - baseY)
			ctx.clip()
			ctx.globalAlpha = m === "storm" ? 0.38 + sheetFlash * 0.25 : 0.28
			ctx.translate(0, baseY * 2)
			ctx.scale(1, -0.55)
			for (let i = 0; i < skyline.length; i++) {
				const bh = H * skyline[i]
				const x = i * bw
				ctx.fillStyle = `hsla(${baseHue + i * 4}, 70%, 40%, 0.35)`
				ctx.fillRect(x, baseY - bh, bw + 1, bh)
			}
			ctx.restore()

			// shimmering puddles
			for (const pud of puddles) {
				const px = pud.x * W
				const py = pud.y * H
				const wave = Math.sin(t * (m === "storm" ? 4.2 : 2.2) + pud.x * 12) * (m === "storm" ? 5 : 3)
				const pg = ctx.createRadialGradient(px, py, 0, px, py, pud.rx)
				const pudA =
					(0.22 + dens * 0.04 + (m === "storm" ? sheetFlash * 0.35 : 0))
				pg.addColorStop(0, `hsla(${baseHue + 20}, 90%, 65%, ${pudA})`)
				pg.addColorStop(0.4, `hsla(${baseHue}, 80%, 50%, 0.1)`)
				pg.addColorStop(1, "transparent")
				ctx.fillStyle = pg
				ctx.beginPath()
				ctx.ellipse(px + wave, py, pud.rx, pud.ry, 0, 0, Math.PI * 2)
				ctx.fill()
				// specular streak
				ctx.strokeStyle = `hsla(${baseHue}, 100%, 80%, ${0.18 + sheetFlash * 0.25})`
				ctx.lineWidth = 1
				ctx.beginPath()
				ctx.ellipse(px + wave, py - 2, pud.rx * 0.55, pud.ry * 0.35, 0, 0, Math.PI)
				ctx.stroke()
			}

			// horizon neon bleed into street
			const streetGlow = ctx.createLinearGradient(0, baseY, 0, H)
			streetGlow.addColorStop(
				0,
				`hsla(${baseHue}, 90%, 55%, ${0.18 + (m === "storm" ? sheetFlash * 0.4 : 0)})`,
			)
			streetGlow.addColorStop(0.35, `hsla(${baseHue + 40}, 80%, 45%, 0.08)`)
			streetGlow.addColorStop(1, "transparent")
			ctx.fillStyle = streetGlow
			ctx.fillRect(0, baseY, W, H - baseY)

			// street lamp practicals (every frame — anchors district density)
			for (const lamp of streetLamps) {
				const lx = lamp.x * W
				const ly = baseY
				const lh = lamp.h * H
				ctx.fillStyle = "rgba(16,12,24,0.92)"
				ctx.fillRect(lx - 1.6, ly - lh, 3.2, lh)
				ctx.fillStyle = `hsla(${m === "storm" ? 210 : baseHue}, 40%, 40%, 0.7)`
				ctx.fillRect(lx - 4, ly - lh - 3, 8, 4)
				const pulse =
					0.75 +
					0.25 * Math.sin(t * 2.1 + lamp.x * 12) +
					(m === "storm" ? sheetFlash * 0.55 : 0)
				const lg = ctx.createRadialGradient(lx, ly - lh, 0, lx, ly - lh, 85)
				lg.addColorStop(
					0,
					`hsla(${m === "storm" ? 205 : baseHue}, 100%, 78%, ${0.42 * pulse})`,
				)
				lg.addColorStop(
					0.35,
					`hsla(${m === "storm" ? 200 : baseHue}, 90%, 55%, ${0.14 * pulse})`,
				)
				lg.addColorStop(1, "transparent")
				ctx.fillStyle = lg
				ctx.beginPath()
				ctx.arc(lx, ly - lh, 85, 0, Math.PI * 2)
				ctx.fill()
				// wet ground pool under lamp
				const pool = ctx.createRadialGradient(lx, ly + 6, 0, lx, ly + 6, 55)
				pool.addColorStop(
					0,
					`hsla(${m === "storm" ? 210 : baseHue}, 90%, 70%, ${0.16 * pulse})`,
				)
				pool.addColorStop(1, "transparent")
				ctx.fillStyle = pool
				ctx.beginPath()
				ctx.ellipse(lx, ly + 6, 55, 12, 0, 0, Math.PI * 2)
				ctx.fill()
			}

			// weather-mode drama
			if (m === "scan") {
				for (let i = 0; i < 4; i++) {
					const sy = ((t * 220 + i * (H / 4)) % H)
					const sg = ctx.createLinearGradient(0, sy - 20, 0, sy + 20)
					sg.addColorStop(0, "transparent")
					sg.addColorStop(0.5, `hsla(${baseHue}, 100%, 70%, 0.14)`)
					sg.addColorStop(1, "transparent")
					ctx.fillStyle = sg
					ctx.fillRect(0, sy - 20, W, 40)
				}
				// HUD bars
				ctx.fillStyle = `hsla(${baseHue}, 100%, 65%, 0.08)`
				for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1)
			}

			if (m === "glitch") {
				for (let i = 0; i < 7; i++) {
					const gy = Math.random() * H
					const gh = 4 + Math.random() * 28
					const ox = (Math.random() - 0.5) * 40
					ctx.drawImage(
						c,
						0,
						gy * dpr,
						W * dpr,
						gh * dpr,
						ox,
						gy,
						W,
						gh,
					)
					ctx.fillStyle =
						i % 2 === 0
							? `hsla(${baseHue}, 100%, 60%, 0.06)`
							: `hsla(${baseHue + 120}, 100%, 55%, 0.05)`
					ctx.fillRect(ox, gy, W, gh)
				}
			}

			if (m === "storm") {
				// first-paint opening: multi-bolt barrage + sheet flash
				if (openingBurst) {
					if (t < 0.08) {
						spawnBolt(W, baseY, true)
						sheetFlash = 1
					} else if (t > 0.22 && t < 0.28) {
						spawnBolt(W, baseY, true)
						spawnBolt(W, baseY, false)
						sheetFlash = Math.max(sheetFlash, 0.85)
					} else if (t > 0.55 && t < 0.62) {
						spawnBolt(W, baseY, false)
						sheetFlash = Math.max(sheetFlash, 0.55)
					} else if (t > 1.05) {
						openingBurst = false
					}
				}

				// ongoing lightning — EE2 more frequent sheet + forked bolts
				const stormTick = Math.sin(t * 2.4) * 0.5 + 0.5
				if (
					Math.random() > 0.955 - stormTick * 0.025 ||
					(bolts.length === 0 && t > 0.9 && Math.random() > 0.55)
				) {
					const mega = Math.random() > 0.48
					spawnBolt(W, baseY, mega)
					if (mega && Math.random() > 0.35) spawnBolt(W, baseY, false)
					if (Math.random() > 0.72) spawnBolt(W, baseY, false)
				}
				// ambient sheet lightning (no bolt geometry)
				if (Math.random() > 0.985) {
					sheetFlash = Math.max(sheetFlash, 0.28 + Math.random() * 0.4)
				}

				// full-frame electric wash
				if (sheetFlash > 0.02) {
					const wash = ctx.createRadialGradient(
						W * 0.5,
						H * 0.15,
						0,
						W * 0.5,
						H * 0.35,
						H * 0.95,
					)
					wash.addColorStop(0, `rgba(210,230,255,${sheetFlash * 0.55})`)
					wash.addColorStop(0.35, `rgba(160,190,255,${sheetFlash * 0.22})`)
					wash.addColorStop(1, `rgba(40,60,120,${sheetFlash * 0.06})`)
					ctx.fillStyle = wash
					ctx.fillRect(0, 0, W, H)
					// hard edge flash for mega strikes
					if (sheetFlash > 0.7) {
						ctx.fillStyle = `rgba(230,240,255,${(sheetFlash - 0.7) * 0.55})`
						ctx.fillRect(0, 0, W, H)
					}
				}

				for (let i = bolts.length - 1; i >= 0; i--) {
					const b = bolts[i]
					b.life -= 0.045
					const a = Math.max(0, b.life)
					// core + glow pass
					ctx.lineCap = "round"
					ctx.lineJoin = "round"
					ctx.shadowBlur = 36
					ctx.shadowColor = `hsla(${b.hue}, 100%, 80%, ${a})`
					ctx.strokeStyle = `rgba(235,245,255,${a})`
					ctx.lineWidth = b.width
					ctx.beginPath()
					b.segs.forEach((s, j) =>
						j === 0 ? ctx.moveTo(s.x, s.y) : ctx.lineTo(s.x, s.y),
					)
					ctx.stroke()
					// hot white core
					ctx.shadowBlur = 8
					ctx.strokeStyle = `rgba(255,255,255,${a * 0.95})`
					ctx.lineWidth = b.width * 0.35
					ctx.beginPath()
					b.segs.forEach((s, j) =>
						j === 0 ? ctx.moveTo(s.x, s.y) : ctx.lineTo(s.x, s.y),
					)
					ctx.stroke()
					// branches
					for (const br of b.branches) {
						ctx.shadowBlur = 18
						ctx.strokeStyle = `hsla(${b.hue}, 90%, 85%, ${a * 0.75})`
						ctx.lineWidth = b.width * 0.45
						ctx.beginPath()
						br.forEach((s, j) =>
							j === 0 ? ctx.moveTo(s.x, s.y) : ctx.lineTo(s.x, s.y),
						)
						ctx.stroke()
					}
					// reflection flash on street
					const tip = b.segs[b.segs.length - 1]
					const rg = ctx.createRadialGradient(
						tip.x,
						baseY + 8,
						0,
						tip.x,
						baseY + 8,
						140,
					)
					rg.addColorStop(0, `rgba(210,230,255,${a * 0.45})`)
					rg.addColorStop(0.5, `rgba(140,180,255,${a * 0.12})`)
					rg.addColorStop(1, "transparent")
					ctx.fillStyle = rg
					ctx.beginPath()
					ctx.ellipse(tip.x, baseY + 10, 140, 28, 0, 0, Math.PI * 2)
					ctx.fill()
					// vertical light shaft
					const shaft = ctx.createLinearGradient(tip.x, 0, tip.x, baseY)
					shaft.addColorStop(0, `rgba(200,220,255,${a * 0.08})`)
					shaft.addColorStop(0.7, `rgba(180,210,255,${a * 0.18})`)
					shaft.addColorStop(1, `rgba(220,235,255,${a * 0.05})`)
					ctx.fillStyle = shaft
					ctx.fillRect(tip.x - 18, 0, 36, baseY)
					ctx.shadowBlur = 0
					if (b.life <= 0) bolts.splice(i, 1)
				}

				// wind debris + grit streaks (EE2 denser air)
				for (let i = 0; i < 22; i++) {
					const dx = ((t * 300 + i * 89) % (W + 140)) - 70
					const dy = ((i * 67 + t * 48) % (baseY * 0.92)) + 16
					ctx.strokeStyle = `hsla(210, 45%, 82%, ${0.08 + (i % 4) * 0.02})`
					ctx.lineWidth = 0.8 + (i % 3) * 0.35
					ctx.beginPath()
					ctx.moveTo(dx, dy)
					ctx.lineTo(dx - 32 - (i % 6) * 7, dy + 3 + (i % 3))
					ctx.stroke()
				}
				// distant heat-blue horizon sparks
				for (let i = 0; i < 16; i++) {
					const sx = ((i * 97 + t * 20) % W)
					const sy = baseY - 8 - ((i * 13) % 40)
					ctx.fillStyle = `hsla(${200 + (i % 5) * 8}, 100%, 80%, ${0.12 + sheetFlash * 0.25})`
					ctx.fillRect(sx, sy, 1.5 + (i % 2), 1.5 + (i % 2))
				}

				sheetFlash *= 0.9
			} else {
				sheetFlash = 0
				bolts.length = 0
			}

			// DOM flash layer sync (screen-space WOW without audio)
			const fl = flashLayerRef.current
			if (fl) {
				const v = m === "storm" ? Math.min(1, sheetFlash) : 0
				fl.style.opacity = String(v * 0.85)
			}

			if (m === "burst") {
				// ambient orbs drift
				for (let i = 0; i < 6; i++) {
					const ox = ((t * 40 + i * 97) % (W + 100)) - 50
					const oy = H * 0.25 + Math.sin(t + i) * 60 + i * 30
					const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, 50)
					og.addColorStop(0, `hsla(${baseHue + i * 25}, 100%, 70%, 0.2)`)
					og.addColorStop(1, "transparent")
					ctx.fillStyle = og
					ctx.beginPath()
					ctx.arc(ox, oy, 50, 0, Math.PI * 2)
					ctx.fill()
				}
			}

			// pointer neon trail
			const p = pointerRef.current
			if (p.x || p.y) {
				const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 140)
				pg.addColorStop(0, `hsla(${baseHue}, 100%, 70%, 0.22)`)
				pg.addColorStop(0.5, `hsla(${baseHue + 40}, 100%, 55%, 0.08)`)
				pg.addColorStop(1, "transparent")
				ctx.fillStyle = pg
				ctx.fillRect(p.x - 140, p.y - 140, 280, 280)
			}

			// maintain thick rain population (storm denser — EE2 curtain)
			const rainCount = drops.filter((d) => d.kind === "rain").length
			const target = Math.floor((m === "storm" ? 560 : 320) * dens)
			if (rainCount < target)
				spawnAmbient(Math.min(m === "storm" ? 36 : 18, target - rainCount), false)

			// ripples
			for (let i = ripples.length - 1; i >= 0; i--) {
				const r = ripples[i]
				r.r += m === "storm" ? 3.6 : 2.8
				r.a -= m === "storm" ? 0.014 : 0.018
				ctx.strokeStyle = `hsla(${r.hue}, 100%, 70%, ${r.a})`
				ctx.lineWidth = 2
				ctx.shadowBlur = 10
				ctx.shadowColor = `hsla(${r.hue}, 100%, 60%, 0.6)`
				ctx.beginPath()
				ctx.ellipse(r.x, r.y, r.r, r.r * 0.22, 0, 0, Math.PI * 2)
				ctx.stroke()
				ctx.shadowBlur = 0
				if (r.a <= 0) ripples.splice(i, 1)
			}

			ctx.lineCap = "round"
			for (let i = drops.length - 1; i >= 0; i--) {
				const d = drops[i]
				d.x += d.vx + wind * 0.35
				const fall =
					m === "scan" ? 7.5 : m === "storm" ? 11.2 : m === "burst" ? 4 : 5.2
				d.y += d.s * fall * 0.55
				if (m === "glitch") d.x += Math.sin(t * 45 + i) * 4
				d.a -= d.kind === "orb" ? 0.016 : d.kind === "spark" ? 0.028 : 0.0045

				// splash when rain hits street
				if (d.kind === "rain" && d.y >= baseY && d.a > 0.2) {
					if (Math.random() > (m === "storm" ? 0.45 : 0.7)) {
						ripples.push({
							x: d.x,
							y: baseY + 2 + Math.random() * 6,
							r: 2,
							a: m === "storm" ? 0.5 : 0.35,
							hue: d.hue,
						})
					}
					// recycle upward for continuous density
					d.y = -10 - Math.random() * 40
					d.x = Math.random() * W
					d.a = 0.45 + Math.random() * 0.5
					d.hue =
						m === "storm"
							? 195 + Math.random() * 40
							: baseHue + (Math.random() - 0.5) * 55
					d.vx = wind * 0.3 + (Math.random() - 0.5) * (m === "storm" ? 2 : 1.1)
					d.len = (m === "storm" ? 20 : 14) + Math.random() * (m === "storm" ? 40 : 28)
					d.w = (m === "storm" ? 2.2 : 1.8) + Math.random() * 2.4
				}

				ctx.shadowBlur = d.kind === "orb" ? 20 : 10
				ctx.shadowColor = `hsla(${d.hue}, 100%, 68%, 0.95)`
				if (d.kind === "orb") {
					ctx.fillStyle = `hsla(${d.hue}, 95%, 70%, ${d.a})`
					ctx.beginPath()
					ctx.arc(d.x, d.y, d.s * 0.7, 0, Math.PI * 2)
					ctx.fill()
				} else if (d.kind === "spark") {
					ctx.strokeStyle = `hsla(${d.hue}, 100%, 78%, ${d.a})`
					ctx.lineWidth = 1.6
					ctx.beginPath()
					ctx.moveTo(d.x, d.y)
					ctx.lineTo(d.x + d.vx * 5, d.y + d.s * 3.5)
					ctx.stroke()
				} else {
					// thick visible rain streak (storm: longer wind slash, EE2 brighter)
					const dx = d.vx * (m === "storm" ? 3.6 : 2.2)
					const dy = d.len * (m === "storm" ? 1.08 : 1)
					const aMul = m === "storm" ? 1.15 : 1
					const grad = ctx.createLinearGradient(d.x, d.y, d.x + dx, d.y + dy)
					grad.addColorStop(0, `hsla(${d.hue}, 90%, 80%, 0)`)
					grad.addColorStop(0.3, `hsla(${d.hue}, 95%, 78%, ${Math.min(1, d.a * aMul)})`)
					grad.addColorStop(1, `hsla(${d.hue + 20}, 100%, 88%, ${Math.min(1, d.a * aMul * 0.95)})`)
					ctx.strokeStyle = grad
					ctx.lineWidth = d.w * (m === "storm" ? 1.12 : 1)
					ctx.beginPath()
					ctx.moveTo(d.x, d.y)
					ctx.lineTo(d.x + dx, d.y + dy)
					ctx.stroke()

					// wet street reflection streak
					if (d.y > baseY - d.len) {
						const ry = baseY + (Math.max(0, d.y - baseY) * 0.35 + 4)
						ctx.strokeStyle = `hsla(${d.hue}, 90%, 65%, ${d.a * 0.35})`
						ctx.lineWidth = d.w * 0.7
						ctx.beginPath()
						ctx.moveTo(d.x, ry)
						ctx.lineTo(d.x + dx * 0.4, ry + 8)
						ctx.stroke()
					}
				}

				if (d.a <= 0 || d.y > H + 80) {
					if (d.kind === "rain") {
						d.y = -20
						d.x = Math.random() * W
						d.a = 0.45 + Math.random() * 0.5
						d.hue =
							m === "storm"
								? 195 + Math.random() * 40
								: baseHue + (Math.random() - 0.5) * 55
						d.vx = wind * 0.3 + (Math.random() - 0.5) * (m === "storm" ? 2 : 1)
						d.len = (m === "storm" ? 20 : 14) + Math.random() * (m === "storm" ? 40 : 28)
						d.w = (m === "storm" ? 2.2 : 1.8) + Math.random() * 2.4
					} else drops.splice(i, 1)
				}
			}
			ctx.shadowBlur = 0

			// vignette (storm: deeper, electric rim)
			const vig = ctx.createRadialGradient(
				W * 0.5,
				H * 0.45,
				H * 0.2,
				W * 0.5,
				H * 0.5,
				H * 0.85,
			)
			vig.addColorStop(0, "transparent")
			vig.addColorStop(
				1,
				m === "storm" ? "rgba(0,0,8,0.62)" : "rgba(0,0,0,0.45)",
			)
			ctx.fillStyle = vig
			ctx.fillRect(0, 0, W, H)

			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener("click", onClick)
			window.removeEventListener("pointermove", onMove)
			window.removeEventListener("resize", resize)
		}
	}, [])

	const districts = ["MIDNIGHT", "CHROME", "SAKURA", "VOID DOCK", "GRID 7"]
	const stormOn = mode === "storm"

	return (
		<LandingsShell className="bg-[#04020c] text-white">
			<canvas ref={canvasRef} className="fixed inset-0 z-0" />
			{/* screen flash layer — canvas drives opacity on bolt strikes */}
			<div
				ref={flashLayerRef}
				className="pointer-events-none fixed inset-0 z-[1] mix-blend-screen transition-none"
				style={{
					opacity: 0,
					background:
						"radial-gradient(ellipse 90% 70% at 50% 12%, rgba(210,230,255,0.75), rgba(120,160,255,0.2) 45%, transparent 70%)",
				}}
			/>
			{/* storm atmosphere: charged sky veil + rain skew chrome (EE2 denser) */}
			{stormOn && (
				<>
					<div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_0%,rgba(90,120,210,0.18),transparent_55%),radial-gradient(ellipse_at_15%_40%,rgba(60,90,180,0.1),transparent_45%),radial-gradient(ellipse_at_85%_30%,rgba(100,80,200,0.08),transparent_40%),linear-gradient(180deg,rgba(4,8,28,0.4)_0%,transparent_42%,rgba(0,0,10,0.28)_100%)]" />
					<div
						className="pointer-events-none fixed inset-x-0 top-0 z-[1] h-[32vh] opacity-85"
						style={{
							background:
								"linear-gradient(180deg, rgba(14,18,44,0.62), rgba(10,12,32,0.28), transparent)",
							animation: "storm-cloud-drift 9s ease-in-out infinite alternate",
						}}
					/>
					{/* secondary cloud shelf */}
					<div
						className="pointer-events-none fixed inset-x-0 top-[8%] z-[1] h-[18vh] opacity-55"
						style={{
							background:
								"radial-gradient(ellipse 80% 100% at 30% 50%, rgba(20,28,60,0.55), transparent 70%), radial-gradient(ellipse 70% 100% at 75% 40%, rgba(18,22,50,0.48), transparent 65%)",
							animation:
								"storm-cloud-drift 12s ease-in-out infinite alternate-reverse",
						}}
					/>
					{/* dual rain skew plates */}
					<div
						className="pointer-events-none fixed inset-0 z-[1] mix-blend-soft-light"
						style={{
							background:
								"repeating-linear-gradient(105deg, transparent 0 2px, rgba(150,190,255,0.045) 2px 3px)",
							animation: "storm-rain-skew 0.32s linear infinite",
						}}
					/>
					<div
						className="pointer-events-none fixed inset-0 z-[1] mix-blend-screen opacity-40"
						style={{
							background:
								"repeating-linear-gradient(112deg, transparent 0 5px, rgba(180,210,255,0.04) 5px 6px)",
							animation: "storm-rain-skew 0.48s linear infinite reverse",
						}}
					/>
					{/* deterministic CSS rain streaks for SSR/first paint without canvas wait */}
					<div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-55">
						{Array.from({ length: 48 }, (_, i) => (
							<span
								key={`rain-${i}`}
								className="absolute block"
								style={{
									left: `${(i * 7.3 + (i % 5) * 2.1) % 100}%`,
									top: `${(i * 11.7) % 70}%`,
									width: 1 + (i % 3),
									height: 18 + (i % 7) * 6,
									background: `linear-gradient(180deg, transparent, hsla(${195 + (i % 8) * 5}, 90%, 78%, 0.55), transparent)`,
									transform: `skewX(-12deg) rotate(${-8 + (i % 4)}deg)`,
									animation: `storm-rain-skew ${0.28 + (i % 5) * 0.04}s linear infinite`,
									animationDelay: `${(i % 10) * 0.03}s`,
								}}
							/>
						))}
					</div>
					{/* electric horizon rim + wet street mirror plate */}
					<div className="pointer-events-none fixed inset-x-0 bottom-0 z-[1] h-[32%] bg-[linear-gradient(0deg,rgba(2,4,16,0.55)_0%,transparent_70%),radial-gradient(ellipse_90%_40%_at_50%_0%,rgba(100,150,255,0.12),transparent_70%)]" />
					{/* billboard / antenna silhouettes for skyline chrome */}
					<div className="pointer-events-none fixed inset-x-0 top-[18%] z-[1] h-[28%] opacity-40">
						{Array.from({ length: 14 }, (_, i) => (
							<span
								key={`ant-${i}`}
								className="absolute bottom-0 block bg-slate-900/90"
								style={{
									left: `${4 + i * 7}%`,
									width: 2 + (i % 3),
									height: `${18 + ((i * 13) % 40)}%`,
									boxShadow:
										i % 3 === 0
											? "0 0 12px rgba(140,190,255,0.45)"
											: undefined,
								}}
							/>
						))}
					</div>
				</>
			)}
			{strobe && (
				<div className="pointer-events-none fixed inset-0 z-[1] animate-pulse bg-pink/15 mix-blend-screen" />
			)}

			{/* floating neon signs — high-contrast, readable on wet night */}
			<div className="pointer-events-none fixed inset-0 z-[2]">
				{signs.map((s, i) => {
					const sh = stormOn ? 200 + i * 18 : hue + i * 28
					return (
						<button
							key={s.t + i}
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								setSigns((all) =>
									all.map((x, j) => (j === i ? { ...x, on: !x.on } : x)),
								)
							}}
							className={cn(
								"pointer-events-auto absolute cursor-pointer font-black tracking-[0.32em] transition duration-300",
								s.on ? "opacity-100" : "opacity-25 grayscale",
							)}
							style={{
								left: `${s.x}%`,
								top: `${s.y}%`,
								fontSize: "clamp(1.05rem, 3.2vw, 1.85rem)",
								color: s.on ? `hsl(${sh} 100% 82%)` : "#666",
								WebkitTextStroke: s.on
									? `0.5px hsl(${sh} 90% 55% / 0.55)`
									: undefined,
								textShadow: s.on
									? stormOn
										? `0 0 2px #fff, 0 0 12px hsl(210 100% 70%), 0 0 32px hsl(${sh} 100% 55%), 0 0 64px hsl(220 100% 50%), 0 0 110px hsl(200 90% 45%)`
										: `0 0 2px #fff, 0 0 10px hsl(${sh} 100% 65%), 0 0 28px hsl(${sh} 100% 55%), 0 0 56px hsl(${sh} 100% 45%), 0 0 96px hsl(${sh} 90% 40%)`
									: "none",
								animation: s.on
									? stormOn
										? `neon-storm-flicker ${1.6 + s.flicker}s ease-in-out infinite`
										: `neon-flicker ${2.4 + s.flicker}s ease-in-out infinite`
									: undefined,
							}}
						>
							<span
								className="block rounded-sm border-2 px-4 py-2 backdrop-blur-[2px]"
								style={{
									borderColor: s.on
										? `hsl(${sh} 90% 62% / 0.85)`
										: "rgba(255,255,255,0.1)",
									boxShadow: s.on
										? `inset 0 0 28px hsl(${sh} 100% 50% / 0.4), 0 0 28px hsl(${sh} 100% 50% / 0.55), 0 0 2px #fff`
										: "none",
									background: s.on
										? `linear-gradient(180deg, hsl(${sh} 70% 18% / 0.72), hsl(${sh} 50% 8% / 0.55))`
										: "rgba(0,0,0,0.35)",
								}}
							>
								{s.t}
							</span>
						</button>
					)
				})}
			</div>

			{/* local keyframes for sign flicker + storm atmosphere */}
			<style>{`
				@keyframes neon-flicker {
					0%, 100% { opacity: 1; filter: brightness(1); }
					46% { opacity: 1; filter: brightness(1.15); }
					47% { opacity: 0.72; filter: brightness(0.7); }
					48% { opacity: 1; filter: brightness(1.2); }
					92% { opacity: 1; }
					93% { opacity: 0.85; }
					94% { opacity: 1; }
				}
				@keyframes neon-storm-flicker {
					0%, 100% { opacity: 1; filter: brightness(1.05) saturate(1.15); }
					12% { opacity: 0.55; filter: brightness(0.45); }
					14% { opacity: 1; filter: brightness(1.45) saturate(1.4); }
					38% { opacity: 0.9; filter: brightness(0.95); }
					52% { opacity: 0.35; filter: brightness(0.3); }
					54% { opacity: 1; filter: brightness(1.6) drop-shadow(0 0 12px #9cf); }
					78% { opacity: 1; filter: brightness(1.1); }
					91% { opacity: 0.7; filter: brightness(0.6); }
					93% { opacity: 1; filter: brightness(1.35); }
				}
				@keyframes storm-cloud-drift {
					from { transform: translateX(-2%) scaleY(1); opacity: 0.75; }
					to { transform: translateX(2%) scaleY(1.08); opacity: 0.95; }
				}
				@keyframes storm-rain-skew {
					from { transform: translate3d(0,0,0); }
					to { transform: translate3d(-12px, 18px, 0); }
				}
				@keyframes storm-title-surge {
					0%, 100% { filter: brightness(1); }
					40% { filter: brightness(1.05); }
					48% { filter: brightness(1.35) drop-shadow(0 0 28px rgba(160,200,255,0.55)); }
					52% { filter: brightness(0.9); }
					58% { filter: brightness(1.2); }
				}
				@keyframes storm-sign-pulse {
					0%, 100% { opacity: 0.55; }
					50% { opacity: 1; }
				}
			`}</style>
			{/* far district glow orbs (storm + non-storm ambient density) */}
			<div className="pointer-events-none fixed inset-0 z-[1]">
				{Array.from({ length: stormOn ? 10 : 6 }, (_, i) => (
					<span
						key={`glow-${i}`}
						className="absolute rounded-full blur-2xl"
						style={{
							left: `${8 + (i * 11) % 84}%`,
							top: `${22 + (i % 4) * 12}%`,
							width: 80 + (i % 5) * 28,
							height: 40 + (i % 3) * 16,
							background: stormOn
								? `hsla(${195 + i * 12}, 90%, 60%, 0.12)`
								: `hsla(${hue + i * 28}, 90%, 55%, 0.1)`,
							animation: `storm-sign-pulse ${3.2 + (i % 4) * 0.6}s ease-in-out infinite`,
							animationDelay: `${i * 0.2}s`,
						}}
					/>
				))}
			</div>

			{/* marquee */}
			<div
				className={cn(
					"pointer-events-none fixed top-[4.5rem] right-0 left-0 z-[3] overflow-hidden border-y py-2.5 backdrop-blur-md",
					stormOn
						? "border-sky-300/40 bg-slate-950/55"
						: "border-pink/30 bg-black/40",
				)}
			>
				<motion.div
					className={cn(
						"flex whitespace-nowrap text-[0.65rem] font-black tracking-[0.35em] uppercase",
						stormOn ? "text-sky-200" : "text-pink",
					)}
					animate={{ x: ["0%", "-50%"] }}
					transition={{ duration: stormOn ? 11 : 16, repeat: Infinity, ease: "linear" }}
					style={{
						textShadow: stormOn
							? "0 0 14px hsl(210 100% 65%), 0 0 28px hsl(220 90% 50%)"
							: `0 0 12px hsl(${hue} 100% 60%)`,
					}}
				>
					{Array.from({ length: 8 }).map((_, i) => (
						<span key={i} className="mx-8">
							{district} DISTRICT ·{" "}
							{stormOn ? "ELECTRICAL STORM" : "WET ASPHALT"} ·{" "}
							{mode.toUpperCase()} · HITS {hits} · AFTER HOURS ·{" "}
							{stormOn ? "BOLT LIVE" : "SIGNAL LIVE"} · RAIN DENSITY{" "}
							{density.toFixed(1)}×
						</span>
					))}
				</motion.div>
			</div>

			<div className="relative z-10 flex min-h-dvh flex-col justify-end px-5 pb-16 pt-28 sm:px-10">
				<div className="mx-auto w-full max-w-desktop">
					<p
						className={cn(
							"text-xs font-black tracking-[0.4em] uppercase",
							stormOn ? "text-sky-300" : "text-pink",
						)}
						style={
							stormOn
								? {
										textShadow:
											"0 0 12px hsl(210 100% 60%), 0 0 28px hsl(220 90% 50%)",
									}
								: undefined
						}
					>
						Neon · {district.toLowerCase()} · weather {mode}
						{stormOn ? " · charged" : ""} · hits {hits}
					</p>
					<h1
						className="mt-3 text-[clamp(3.5rem,14vw,9rem)] leading-[0.82] font-black tracking-tighter"
						style={{
							textShadow: stormOn
								? `0 0 20px hsl(210 100% 75%), 0 0 52px hsl(220 90% 60%), 0 0 110px hsl(200 80% 50%), 0 0 8px #fff`
								: `0 0 18px hsl(${hue} 90% 70%), 0 0 48px hsl(${hue + 40} 90% 60%), 0 0 100px hsl(${hue + 80} 80% 55%)`,
							animation: stormOn
								? "storm-title-surge 3.6s ease-in-out infinite"
								: undefined,
						}}
					>
						AFTER
						<br />
						HOURS
					</h1>
					<p className="text-subtext-0 mt-5 max-w-measure text-base">
						{stormOn
							? "The grid is failing. Wind-shear rain, forked bolts, sheet flash on wet chrome — the district remembers every strike."
							: "Strike the night. Toggle signs. Pick a district weather system. The city remembers every impact on wet chrome."}
					</p>

					<div className="mt-8 flex flex-wrap gap-2">
						{(["rain", "burst", "scan", "glitch", "storm"] as const).map(
							(m) => (
								<button
									key={m}
									type="button"
									onClick={(e) => {
										e.stopPropagation()
										setMode(m)
										if (m === "storm") setDensity((d) => Math.max(d, 1.7))
									}}
									className={cn(
										"cursor-pointer rounded-full border px-5 py-2 text-xs font-black tracking-widest uppercase transition",
										mode === m
											? m === "storm"
												? "border-sky-300 bg-sky-400/25 text-sky-100 shadow-[0_0_32px_rgba(125,190,255,0.55),0_0_8px_rgba(255,255,255,0.35)]"
												: "border-pink bg-pink/25 text-pink shadow-[0_0_24px_rgba(245,194,231,0.35)]"
											: "border-white/20 text-white/70 hover:border-white/40",
									)}
								>
									{m}
								</button>
							),
						)}
					</div>

					<div className="mt-4 flex flex-wrap items-center gap-3">
						{districts.map((d) => (
							<button
								key={d}
								type="button"
								onClick={(e) => {
									e.stopPropagation()
									setDistrict(d)
									setHue(
										d === "CHROME"
											? 200
											: d === "SAKURA"
												? 330
												: d === "VOID DOCK"
													? 270
													: d === "GRID 7"
														? 140
														: 300,
									)
								}}
								className={cn(
									"cursor-pointer border px-3 py-1.5 font-mono text-[0.6rem] tracking-widest",
									district === d
										? "border-sapphire bg-sapphire/20 text-sapphire shadow-[0_0_16px_rgba(137,180,250,0.35)]"
										: "border-white/15 text-white/50",
								)}
							>
								{d}
							</button>
						))}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								setStrobe((s) => !s)
							}}
							className={cn(
								"cursor-pointer rounded-full border px-4 py-1.5 text-[0.65rem] font-black tracking-widest uppercase",
								strobe
									? "border-red bg-red/20 text-red"
									: "border-white/20 text-white/60",
							)}
						>
							Strobe
						</button>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								setSigns((all) => all.map((s) => ({ ...s, on: true })))
							}}
							className="cursor-pointer rounded-full border border-white/20 px-4 py-1.5 text-[0.65rem] font-black tracking-widest text-white/60 uppercase"
						>
							All signs
						</button>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								setSigns((all) => all.map((s) => ({ ...s, on: !s.on })))
							}}
							className="cursor-pointer rounded-full border border-white/20 px-4 py-1.5 text-[0.65rem] font-black tracking-widest text-white/60 uppercase"
						>
							Flip signs
						</button>
					</div>

					<div className="mt-6 flex max-w-laptop flex-wrap items-center gap-6">
						<label className="text-subtext-0 flex items-center gap-3 text-xs">
							Hue
							<input
								type="range"
								min={0}
								max={360}
								value={hue}
								onClick={(e) => e.stopPropagation()}
								onChange={(e) => setHue(Number(e.target.value))}
								className="w-36 accent-[var(--catpuccin-pink)]"
							/>
						</label>
						<label className="text-subtext-0 flex items-center gap-3 text-xs">
							Density
							<input
								type="range"
								min={0.4}
								max={2.5}
								step={0.1}
								value={density}
								onClick={(e) => e.stopPropagation()}
								onChange={(e) => setDensity(Number(e.target.value))}
								className="w-28 accent-[var(--catpuccin-mauve)]"
							/>
							<span className="font-mono w-8">{density.toFixed(1)}</span>
						</label>
					</div>
				</div>
			</div>
		</LandingsShell>
	)
}

/* ═══════════════════════════════════════════════════════════
   6 — PAPER  ·  multi-page letterpress book
═══════════════════════════════════════════════════════════ */
export function PaperLanding() {
	const spreads = useMemo(
		() => [
			{
				sig: "A",
				folio: "i–ii",
				left: {
					t: "Dear reader,",
					deck: "Opening letter",
					b: "This surface pretends the web is still ink. Fold is a gesture. Texture is the product. You are holding a browser that wants to be a book — cloth spine, deckled edge, the faint bruise of type driven into fiber.",
					aside: "Set in a measure that breathes.",
					body: "The first impression is always a little deep. That is not a flaw; it is evidence. Light catches the wound and the page becomes relief — not decoration, but memory of pressure.",
					foot: "¹ The gathering begins before the title page admits it.",
				},
				right: {
					t: "Epigraph",
					deck: "From the margin",
					b: "“Paper remembers pressure. Screens forget — unless we teach them to indent.”",
					aside: "Keep the gutter charged.",
					body: "What follows is not a feature list. It is a signature of spreads: verso and recto in conversation, ribbon as state, dog-ear as affordance. Turn the corner. Feel the paper lift.",
					foot: "‡ Quoted from the house style of quiet interfaces.",
				},
			},
			{
				sig: "B",
				folio: "3–4",
				left: {
					t: "On craft",
					deck: "Spacing as fiber",
					b: "The fiber of the page is the spacing scale. The gutter is the margin’s twin. The colophon is the stack: type, motion, intention — bound, not stacked as cards.",
					aside: "Leading is a tempo, not a toggle.",
					body: "A book does not scroll; it commits. Each spread is a decision you can reverse only by turning back — a rarer honesty than infinite feed. Here the product is the turn itself.",
					foot: "² See also: the discipline of stopping mid-sentence.",
				},
				right: {
					t: "Letterpress",
					deck: "Impression & wound",
					b: "Each strike leaves a wound the light can read. Enable the pen: click and ink blooms; drag and a hairline scores the cream. The page keeps score in stains.",
					aside: "Ink is not UI chrome.",
					body: "Toggle impression to feel type sink. Flat type is a screen habit. Indented type is a promise that something was pressed — once — and stayed.",
					foot: "³ Blots are permanent for this sitting. Clear marks if you must.",
				},
			},
			{
				sig: "C",
				folio: "5–6",
				left: {
					t: "Signature",
					deck: "Gatherings",
					b: "Sheets folded into gatherings. Spreads that face each other like conversation across a table. Turn with the corner, the ribbon, or the polite buttons below the desk.",
					aside: "A signature is eight pages of trust.",
					body: "Bookmark a spread and the crimson ribbon claims it. Jump ribbon returns you like a finger held in the dark. This is navigation without a nav bar.",
					foot: "⁴ Dog-ear drag threshold: commit past half the peel.",
				},
				right: {
					t: "Margin notes",
					deck: "The second book",
					b: "What you write in the margin is the second book — quieter, truer, untypeset on purpose. The field below the spread is that margin, stretched for the hand.",
					aside: "Scribbles outrank slogans.",
					body: "Leave a note. Underline nothing important. The instrument rewards hesitation: cream density, hairline rules, running heads that refuse to apologize for paper.",
					foot: "§ Your note is local; the blot is theatrical.",
				},
			},
			{
				sig: "D",
				folio: "7–8",
				left: {
					t: "Colophon",
					deck: "How this was made",
					b: "Set for screens that still respect paper. Printed in imagination. Bound by the decision to turn — or not. No carousel. No hero stack. Only folio.",
					aside: "Type · motion · restraint.",
					body: "If the page feels full, that is the point: empty cream is a void we refuse. Ornaments, rules, footnotes, asides — the density of a real sheet, not a template with padding.",
					foot: "⁵ Close the book. The cloth cover waits.",
				},
				right: {
					t: "Fin.",
					deck: "Last leaf",
					b: "Close the book or turn back. Either gesture is a design decision. Thank you for the quiet — and for treating a landing like a volume you might keep.",
					aside: "End mid-breath if you prefer.",
					body: "The desk remains. The fiber remains. The next reader will find your ribbon, or they will not. That, too, is craft: leaving evidence without demanding applause.",
					foot: "¶ Printed by the instrument · not for sale · for keeping.",
				},
			},
		],
		[],
	)

	const [spread, setSpread] = useState(0)
	const [flipping, setFlipping] = useState(false)
	const [dir, setDir] = useState<1 | -1>(1)
	const [bookmark, setBookmark] = useState<number | null>(1)
	const [underlines, setUnderlines] = useState<
		{ id: number; spread: number; y: number; w: number; x: number }[]
	>(() => [
		// seed marks so cream is never empty on first paint
		{ id: 1, spread: 0, y: 62, x: 18, w: 42 },
		{ id: 2, spread: 0, y: 71, x: 22, w: 28 },
		// Pass DD2 — light density underlines (spread 0 only)
		{ id: 3, spread: 0, y: 54, x: 20, w: 34 },
		{ id: 4, spread: 0, y: 78, x: 24, w: 22 },
	])
	const [blots, setBlots] = useState<
		{
			id: number
			spread: number
			x: number
			y: number
			s: number
			rot: number
			kind: "blot" | "splatter"
		}[]
	>(() => [
		{ id: 10, spread: 0, x: 78, y: 22, s: 9, rot: 18, kind: "blot" },
		{ id: 11, spread: 0, x: 14, y: 48, s: 5, rot: 210, kind: "splatter" },
		{ id: 12, spread: 0, x: 88, y: 68, s: 6, rot: 95, kind: "blot" },
		// Pass DD2 — extra cream density (deterministic seeds)
		{ id: 13, spread: 0, x: 42, y: 36, s: 4, rot: 40, kind: "splatter" },
		{ id: 14, spread: 0, x: 62, y: 58, s: 7, rot: 130, kind: "blot" },
		{ id: 15, spread: 0, x: 28, y: 18, s: 5, rot: 300, kind: "splatter" },
	])
	const [inkStrokes, setInkStrokes] = useState<
		{ id: number; spread: number; points: { x: number; y: number }[] }[]
	>([])
	const [pen, setPen] = useState(true)
	const [press, setPress] = useState(true)
	const [open, setOpen] = useState(true)
	const [note, setNote] = useState("")
	const [dragCorner, setDragCorner] = useState(0)
	const [peel, setPeel] = useState(0)
	const drawing = useRef(false)
	const strokePts = useRef<{ x: number; y: number }[]>([])
	// Window-level peel listeners (survive PageFace re-identity remounts during setState)
	const peelDrag = useRef<{
		x: number
		y: number
		move: (ev: PointerEvent) => void
		up: (ev: PointerEvent) => void
	} | null>(null)

	const turn = (d: 1 | -1) => {
		if (flipping) return
		setDir(d)
		setFlipping(true)
		setPeel(d === 1 ? 1 : 0)
		window.setTimeout(() => {
			setSpread((p) => (p + d + spreads.length) % spreads.length)
			setFlipping(false)
			setDragCorner(0)
			setPeel(0)
		}, 520)
	}

	const beginPeel = (clientX: number, clientY: number) => {
		// tear down any prior drag
		if (peelDrag.current) {
			window.removeEventListener("pointermove", peelDrag.current.move)
			window.removeEventListener("pointerup", peelDrag.current.up)
			window.removeEventListener("pointercancel", peelDrag.current.up)
		}
		const startX = clientX
		const startY = clientY
		const travel = (ev: PointerEvent) =>
			Math.min(170, Math.hypot(ev.clientX - startX, ev.clientY - startY))
		const move = (ev: PointerEvent) => {
			const d = travel(ev)
			setDragCorner(d)
			setPeel(d / 170)
		}
		const up = (ev: PointerEvent) => {
			const d = travel(ev)
			window.removeEventListener("pointermove", move)
			window.removeEventListener("pointerup", up)
			window.removeEventListener("pointercancel", up)
			peelDrag.current = null
			if (d > 40) turn(1)
			else {
				setDragCorner(0)
				setPeel(0)
			}
		}
		peelDrag.current = { x: startX, y: startY, move, up }
		window.addEventListener("pointermove", move)
		window.addEventListener("pointerup", up)
		window.addEventListener("pointercancel", up)
		setDragCorner(0)
		setPeel(0.08)
	}

	const s = spreads[spread]
	const paperFiber =
		"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

	const PageFace = ({
		side,
		page,
	}: {
		side: "left" | "right"
		page: (typeof spreads)[0]["left"]
	}) => {
		const pageNo = spread * 2 + (side === "left" ? 1 : 2)
		return (
			<div
				className={cn(
					"relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f3ead8]",
					side === "left" ? "rounded-l-[2px]" : "rounded-r-[2px]",
				)}
				style={{
					// warm paper with slight left/right tone shift
					background:
						side === "left"
							? "linear-gradient(90deg, #efe4d0 0%, #f3ead8 18%, #f6eede 100%)"
							: "linear-gradient(270deg, #efe4d0 0%, #f3ead8 18%, #f7f0e2 100%)",
				}}
				onClick={(e) => {
					if (!pen) return
					if ((e.target as HTMLElement).closest("button")) return
					const r = e.currentTarget.getBoundingClientRect()
					const x = ((e.clientX - r.left) / r.width) * 100
					const y = ((e.clientY - r.top) / r.height) * 100
					const kind = Math.random() > 0.55 ? "splatter" : "blot"
					setBlots((b) => [
						...b.slice(-28),
						{
							id: Date.now() + Math.random(),
							spread,
							x,
							y,
							s: kind === "splatter" ? 3 + Math.random() * 8 : 5 + Math.random() * 14,
							rot: Math.random() * 360,
							kind,
						},
					])
				}}
				onPointerDown={(e) => {
					if (!pen || e.button !== 0) return
					if ((e.target as HTMLElement).closest("button")) return
					const r = e.currentTarget.getBoundingClientRect()
					const x = ((e.clientX - r.left) / r.width) * 100
					const y = ((e.clientY - r.top) / r.height) * 100
					drawing.current = true
					strokePts.current = [{ x, y }]
					setUnderlines((u) => [
						...u.slice(-30),
						{
							id: Date.now(),
							spread,
							y,
							x: Math.max(8, x - 8),
							w: 28 + Math.random() * 40,
						},
					])
					e.currentTarget.setPointerCapture(e.pointerId)
				}}
				onPointerMove={(e) => {
					if (!drawing.current || !pen) return
					const r = e.currentTarget.getBoundingClientRect()
					const x = ((e.clientX - r.left) / r.width) * 100
					const y = ((e.clientY - r.top) / r.height) * 100
					strokePts.current.push({ x, y })
					// live stroke as last ink stroke with id -1
					setInkStrokes((prev) => {
						const rest = prev.filter((s) => s.id !== -1)
						return [
							...rest,
							{ id: -1, spread, points: [...strokePts.current] },
						]
					})
				}}
				onPointerUp={() => {
					if (!drawing.current) return
					drawing.current = false
					const pts = strokePts.current
					strokePts.current = []
					setInkStrokes((prev) => {
						const rest = prev.filter((s) => s.id !== -1)
						if (pts.length < 2) return rest
						return [
							...rest.slice(-20),
							{ id: Date.now(), spread, points: pts },
						]
					})
				}}
			>
				{/* fiber + laid lines — Pass DD2 denser stock */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-multiply"
					style={{ backgroundImage: paperFiber }}
				/>
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply"
					style={{
						backgroundImage:
							"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E\")",
					}}
				/>
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.065]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(60,40,20,0.4) 23px)",
					}}
				/>
				{/* chain lines (laid paper) */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(90deg, transparent, transparent 36px, rgba(60,40,20,0.5) 37px)",
					}}
				/>
				{/* deckle edge suggestion */}
				<div
					className={cn(
						"pointer-events-none absolute inset-y-0 w-2.5 opacity-50",
						side === "left" ? "left-0" : "right-0",
					)}
					style={{
						background:
							side === "left"
								? "linear-gradient(90deg, rgba(80,60,30,0.16), transparent)"
								: "linear-gradient(270deg, rgba(80,60,30,0.16), transparent)",
					}}
				/>
				{/* spine shade */}
				<div
					className={cn(
						"pointer-events-none absolute inset-y-0 w-16",
						side === "left"
							? "right-0 bg-gradient-to-l from-black/[0.14] via-black/[0.05] to-transparent"
							: "left-0 bg-gradient-to-r from-black/[0.14] via-black/[0.05] to-transparent",
					)}
				/>
				{/* plate indent */}
				{press && (
					<div className="pointer-events-none absolute inset-6 rounded-[1px] border border-black/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(0,0,0,0.04)] sm:inset-8" />
				)}

				{/* ink blots */}
				{blots
					.filter((b) => b.spread === spread)
					.map((b) => (
						<div
							key={b.id}
							className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
							style={{
								left: `${b.x}%`,
								top: `${b.y}%`,
								width: `${b.s}%`,
								height: `${b.s * (b.kind === "splatter" ? 0.55 : 0.72)}%`,
								transform: `translate(-50%,-50%) rotate(${b.rot}deg)`,
								background:
									b.kind === "splatter"
										? "radial-gradient(ellipse at 40% 40%, rgba(28,18,12,0.45), rgba(28,18,12,0.12) 55%, transparent 70%)"
										: "radial-gradient(ellipse at 45% 40%, rgba(22,14,10,0.5), rgba(40,28,18,0.22) 50%, transparent 72%)",
								filter: "blur(0.3px)",
								borderRadius: b.kind === "splatter" ? "40% 60% 55% 45%" : "50%",
							}}
						/>
					))}
				{/* pen strokes (coords in % via viewBox) */}
				<svg
					className="pointer-events-none absolute inset-0 h-full w-full"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
				>
					{inkStrokes
						.filter((st) => st.spread === spread)
						.map((st) => (
							<polyline
								key={st.id}
								fill="none"
								stroke="rgba(28,16,10,0.52)"
								strokeWidth="0.4"
								strokeLinecap="round"
								strokeLinejoin="round"
								points={st.points.map((p) => `${p.x},${p.y}`).join(" ")}
							/>
						))}
				</svg>
				{underlines
					.filter((u) => u.spread === spread)
					.map((u) => (
						<div
							key={u.id}
							className="pointer-events-none absolute h-[1.5px] bg-[#3d2418]/40"
							style={{
								top: `${u.y}%`,
								left: `${u.x}%`,
								width: `${u.w}%`,
								transform: `rotate(${(u.id % 5) - 2}deg)`,
								boxShadow: "0 0.5px 0 rgba(80,40,20,0.15)",
							}}
						/>
					))}

				{/* running head */}
				<div className="relative z-[1] flex items-center justify-between border-b border-black/10 px-7 pt-6 pb-2 sm:px-10 sm:pt-8">
					<p className="font-serif text-[0.58rem] tracking-[0.38em] uppercase opacity-40">
						{side === "left" ? "Verso" : "Recto"} · sig. {s.sig}
					</p>
					<p className="font-serif text-[0.58rem] tracking-[0.28em] uppercase opacity-35">
						Letterpress · {s.folio}
					</p>
				</div>

				{/* dense folio body — cream always filled with type/ornament */}
				<div className="relative z-[1] flex flex-1 flex-col px-7 py-5 sm:px-10 sm:py-7">
					{/* column rule watermark — kills empty cream */}
					<div
						className="pointer-events-none absolute inset-y-4 right-6 w-px opacity-[0.07] sm:right-8"
						style={{
							background:
								"repeating-linear-gradient(180deg, #3d2a18 0 4px, transparent 4px 10px)",
						}}
					/>
					<div
						className="pointer-events-none absolute inset-6 opacity-[0.035] sm:inset-8"
						style={{
							backgroundImage: `
								radial-gradient(ellipse at 20% 30%, rgba(80,50,20,0.35), transparent 45%),
								radial-gradient(ellipse at 80% 70%, rgba(60,40,20,0.25), transparent 40%)
							`,
						}}
					/>
					<p className="font-serif text-[0.62rem] tracking-[0.32em] text-[#6a4a32]/70 uppercase">
						{page.deck}
					</p>
					<AnimatePresence mode="wait">
						<motion.div
							key={`${spread}-${side}-${page.t}`}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -6 }}
							transition={{ duration: 0.32 }}
							className="relative flex flex-1 flex-col"
						>
							<h2
								className="mt-3 font-serif text-[clamp(1.55rem,3.2vw,2.35rem)] leading-[1.1] text-[#1a1410]"
								style={
									press
										? {
												textShadow:
													"0 1px 0 rgba(255,255,255,0.4), 0 -0.6px 0 rgba(0,0,0,0.14)",
											}
										: undefined
								}
							>
								{page.t}
							</h2>
							{/* ornamental rule */}
							<div className="mt-4 mb-1 flex items-center gap-3 opacity-40">
								<div className="h-px flex-1 bg-[#3d2a18]" />
								<span className="font-serif text-[0.7rem]">❧</span>
								<div className="h-px flex-1 bg-[#3d2a18]" />
							</div>
							<p className="mt-3 font-serif text-[0.98rem] leading-[1.72] text-[#2a2018]/90 sm:text-[1.05rem]">
								{page.b}
							</p>
							<p className="mt-4 font-serif text-[0.92rem] leading-[1.7] text-[#2a2018]/78 sm:text-[0.98rem]">
								{page.body}
							</p>
							{/* filler ornaments so lower cream never reads empty */}
							<div className="mt-4 flex items-center justify-center gap-2 opacity-25">
								<span className="font-serif text-[0.65rem]">✦</span>
								<div className="h-px w-10 bg-[#3d2a18]" />
								<span className="font-serif text-[0.55rem] tracking-[0.3em] uppercase">
									{s.sig}
									{pageNo}
								</span>
								<div className="h-px w-10 bg-[#3d2a18]" />
								<span className="font-serif text-[0.65rem]">✦</span>
							</div>
							{/* marginalia column feel */}
							<aside className="mt-5 border-l-2 border-[#8b5a3c]/25 pl-3 font-serif text-[0.78rem] leading-snug text-[#5c3d2e]/75 italic">
								{page.aside}
							</aside>
							{note && side === "right" && (
								<aside className="mt-3 border-l-2 border-[#8b2942]/35 pl-3 font-serif text-[0.78rem] leading-snug text-[#6a2030] italic">
									{note}
								</aside>
							)}
							<div className="mt-auto flex items-end justify-between gap-3 pt-6">
								<p className="max-w-[85%] font-serif text-[0.68rem] leading-snug text-[#4a3828]/55">
									{page.foot}
								</p>
								<p className="font-serif text-sm tabular-nums opacity-45">
									{pageNo}
								</p>
							</div>
						</motion.div>
					</AnimatePresence>
				</div>

				{/* bottom hairline + catchword */}
				<div className="relative z-[1] flex items-center justify-between border-t border-black/10 px-7 py-2.5 sm:px-10">
					<span className="font-serif text-[0.55rem] tracking-[0.2em] uppercase opacity-30">
						{side === "left" ? "turn →" : "← return"}
					</span>
					<span className="font-serif text-[0.55rem] tracking-[0.25em] uppercase opacity-30">
						{spreads[(spread + (side === "right" ? 1 : 0)) % spreads.length]
							?.sig ?? "·"}
					</span>
				</div>

				{side === "right" && bookmark === spread && (
					<div className="absolute top-0 right-10 z-20 h-28 w-[18px] bg-[#8b2942] shadow-[2px_4px_10px_rgba(0,0,0,0.25)]">
						<div className="absolute inset-x-0 top-0 h-1 bg-[#a83a52]" />
						<div className="absolute bottom-0 left-0 h-0 w-0 border-x-[9px] border-t-[14px] border-x-transparent border-t-[#8b2942]" />
					</div>
				)}

				{/* physical dog-ear peel on recto — hit pad is full corner (clip only on visual) */}
				{side === "right" && (
					<button
						type="button"
						aria-label="Turn page — drag dog-ear"
						onPointerDown={(e) => {
							e.stopPropagation()
							e.preventDefault()
							// Window listeners — PageFace re-creates each render; capture on the
							// button would die on remount mid-drag. Parent ref + window survives.
							beginPeel(e.clientX, e.clientY)
						}}
						className="absolute right-0 bottom-0 z-30 size-36 cursor-grab touch-none border-0 bg-transparent p-0 active:cursor-grabbing sm:size-40"
						style={{
							// Full corner is the hit target — clip-path lives on visual child only
							// so density/layout never shrinks the grab zone to a few px.
							transform: `translate(${dragCorner * 0.08}px, ${-dragCorner * 0.06}px)`,
						}}
					>
						{/* folded triangle visual — larger rest peel for readability */}
						<span
							className="pointer-events-none absolute inset-0"
							style={{
								background: `
									linear-gradient(225deg,
										transparent ${40 - peel * 10}%,
										#cfc0a4 ${41 - peel * 10}%,
										#e0d2b8 52%,
										#efe4d0 70%,
										#e8dcc4 100%)
								`,
								// rest peel ~0.42 so dog-ear stays obvious on dense cream
								clipPath: `polygon(${100 - Math.max(0.42, peel) * 52}% 100%, 100% ${100 - Math.max(0.42, peel) * 52}%, 100% 100%)`,
								boxShadow:
									dragCorner > 0
										? `-12px -12px 28px rgba(0,0,0,${0.18 + peel * 0.2})`
										: "-4px -4px 14px rgba(0,0,0,0.2), inset 1px 1px 0 rgba(255,255,255,0.35)",
							}}
						/>
						{/* underside of peel */}
						<span
							className="pointer-events-none absolute inset-0"
							style={{
								background: `linear-gradient(225deg, transparent 48%, #b9a888 48%, #a89472 100%)`,
								opacity: 0.55 + peel * 0.45,
								clipPath: `polygon(${100 - Math.max(0.42, peel) * 52}% 100%, 100% ${100 - Math.max(0.42, peel) * 52}%, 100% 100%)`,
							}}
						/>
						{/* fold crease */}
						<span
							className="pointer-events-none absolute inset-0"
							style={{
								background: `linear-gradient(225deg, transparent ${47 - peel * 8}%, rgba(60,40,20,0.32) ${48 - peel * 8}%, transparent ${52 - peel * 6}%)`,
								clipPath: `polygon(${100 - Math.max(0.42, peel) * 52}% 100%, 100% ${100 - Math.max(0.42, peel) * 52}%, 100% 100%)`,
							}}
						/>
						<span className="pointer-events-none absolute right-2.5 bottom-2.5 font-serif text-[0.55rem] tracking-[0.18em] text-[#4a3420]/80 uppercase">
							turn
						</span>
					</button>
				)}
			</div>
		)
	}

	return (
		<LandingsShell className="bg-[#b8a990] text-[#1a1612]" dark={false}>
			<div
				className="relative flex h-dvh max-h-dvh flex-col overflow-hidden"
				style={{
					backgroundImage: `
						radial-gradient(ellipse 100% 80% at 50% 0%, #d4c8b0, transparent 55%),
						linear-gradient(180deg, #c4b59a 0%, #a89878 55%, #8a7a60 100%)
					`,
				}}
			>
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
					style={{ backgroundImage: paperFiber }}
				/>
				{/* desk wood planks */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.1]"
					style={{
						backgroundImage:
							"repeating-linear-gradient(90deg, transparent, transparent 44px, rgba(40,25,10,0.55) 45px)",
					}}
				/>
				{/* desk grain wash */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.12]"
					style={{
						background: `
							radial-gradient(ellipse 80% 50% at 50% 100%, rgba(40,25,10,0.35), transparent 60%),
							radial-gradient(ellipse 40% 30% at 15% 40%, rgba(60,40,20,0.18), transparent 50%),
							radial-gradient(ellipse 40% 30% at 85% 55%, rgba(60,40,20,0.15), transparent 50%)
						`,
					}}
				/>

				{/* compact chrome — book stage claims the viewport */}
				<div className="relative z-20 flex shrink-0 flex-wrap items-center justify-between gap-2 px-3 pt-14 pb-1.5 sm:px-5">
					<div>
						<p className="font-serif text-[0.58rem] tracking-[0.38em] uppercase opacity-55">
							Paper · sig. {s.sig} · {spread + 1}/{spreads.length}
							{bookmark !== null ? ` · ribbon @ ${bookmark + 1}` : ""}
							{pen ? " · pen wet" : ""}
						</p>
						<h1 className="font-serif text-lg tracking-tight sm:text-xl">
							Letterpress instrument
						</h1>
					</div>
					<div className="flex flex-wrap gap-1.5">
						{(
							[
								[pen ? "Pen on" : "Pen off", () => setPen((p) => !p), pen],
								[
									press ? "Impression" : "Flat type",
									() => setPress((p) => !p),
									press,
								],
								[
									bookmark === spread ? "Unpin" : "Bookmark",
									() => setBookmark((b) => (b === spread ? null : spread)),
									bookmark === spread,
								],
								[
									"Clear marks",
									() => {
										setUnderlines((u) => u.filter((x) => x.spread !== spread))
										setBlots((b) => b.filter((x) => x.spread !== spread))
										setInkStrokes((st) =>
											st.filter((x) => x.spread !== spread),
										)
									},
									false,
								],
								[open ? "Close" : "Open", () => setOpen((o) => !o), !open],
							] as const
						).map(([label, fn, on]) => (
							<button
								key={label}
								type="button"
								onClick={fn}
								className={cn(
									"cursor-pointer border px-2.5 py-1.5 text-[0.55rem] tracking-[0.18em] uppercase backdrop-blur-sm",
									on
										? "border-black/40 bg-[#f3ead8]"
										: "border-black/20 bg-[#f3ead8]/70",
								)}
							>
								{label}
							</button>
						))}
					</div>
				</div>

				{/* full-bleed book stage — open book fills remaining viewport */}
				<div
					className="relative z-10 flex min-h-0 flex-1 flex-col px-1.5 pb-1.5 sm:px-3 sm:pb-2"
					style={{ perspective: 1800 }}
				>
					{!open ? (
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="mx-auto my-auto flex h-[min(70vh,520px)] w-full max-w-phone cursor-pointer flex-col justify-between rounded-sm bg-[#2e2218] p-10 text-left shadow-[24px_36px_70px_rgba(0,0,0,0.4)]"
							style={{
								backgroundImage: `
									linear-gradient(160deg, #3d2e22 0%, #241810 100%),
									repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 4px)
								`,
							}}
						>
							<p className="font-serif text-[0.62rem] tracking-[0.42em] text-[#e8dcc8]/45 uppercase">
								Cloth bound · gold stamp
							</p>
							<div>
								<p className="font-serif text-4xl text-[#e8dcc8]">Paper</p>
								<p className="mt-3 font-serif text-sm text-[#e8dcc8]/50 italic">
									A browser that wants to be a book
								</p>
								<div className="mt-6 h-px w-16 bg-[#e8dcc8]/25" />
							</div>
							<p className="text-[0.58rem] tracking-[0.32em] text-[#e8dcc8]/40 uppercase">
								Click to open the volume
							</p>
						</button>
					) : (
						<>
							<motion.div
								animate={{
									rotateY: flipping ? dir * (dir > 0 ? -18 : 14) : 0,
									rotateX: flipping ? 2 : 0,
									scale: flipping ? 0.978 : 1,
								}}
								transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
								className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2px] shadow-[0_28px_70px_rgba(0,0,0,0.38),0_2px_0_rgba(255,255,255,0.08)_inset] md:flex-row"
								style={{ transformStyle: "preserve-3d" }}
							>
								{/* page stack edge (thickness) */}
								<div className="pointer-events-none absolute top-1 right-0 bottom-1 z-30 hidden w-2 md:block"
									style={{
										background:
											"linear-gradient(90deg, #e8dcc8, #d4c4a8 40%, #c8b898)",
										boxShadow: "2px 0 4px rgba(0,0,0,0.15)",
									}}
								/>
								{/* binding groove */}
								<div className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-20 hidden w-[5px] -translate-x-1/2 md:block"
									style={{
										background:
											"linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0.05) 40%, rgba(255,255,255,0.15) 50%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.2))",
									}}
								/>
								{/* flipping sheet overlay */}
								{flipping && dir === 1 && (
									<motion.div
										className="pointer-events-none absolute inset-y-0 right-0 z-40 hidden w-1/2 origin-left md:block"
										initial={{ rotateY: 0 }}
										animate={{ rotateY: -145 }}
										transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
										style={{
											transformStyle: "preserve-3d",
											background:
												"linear-gradient(90deg, #f6f0e4, #ebe0cc 70%, #d8c8a8)",
											boxShadow: "-12px 0 40px rgba(0,0,0,0.25)",
										}}
									>
										<div
											className="absolute inset-0 opacity-20 mix-blend-multiply"
											style={{ backgroundImage: paperFiber }}
										/>
									</motion.div>
								)}

								<PageFace side="left" page={s.left} />
								<div className="h-px bg-black/15 md:hidden" />
								<PageFace side="right" page={s.right} />
							</motion.div>

							{/* compact footer — book keeps the viewport */}
							<div className="mt-1.5 flex shrink-0 flex-wrap items-center justify-between gap-1.5 px-1">
								<div className="flex flex-wrap gap-1">
									<button
										type="button"
										onClick={() => turn(-1)}
										className="cursor-pointer border border-black/25 bg-[#f3ead8] px-3 py-1.5 text-[0.55rem] tracking-widest uppercase"
									>
										← Prev
									</button>
									<button
										type="button"
										onClick={() => turn(1)}
										className="cursor-pointer border border-black/25 bg-black/10 px-3 py-1.5 text-[0.55rem] tracking-widest uppercase"
									>
										Next →
									</button>
									{bookmark !== null && (
										<button
											type="button"
											onClick={() => setSpread(bookmark)}
											className="cursor-pointer border border-[#8b2942]/40 bg-[#8b2942]/12 px-2.5 py-1.5 text-[0.55rem] tracking-widest text-[#8b2942] uppercase"
										>
											Jump ribbon
										</button>
									)}
								</div>
								<div className="flex items-center gap-1.5">
									{spreads.map((sp, i) => (
										<button
											key={sp.sig}
											type="button"
											aria-label={`Signature ${sp.sig}`}
											onClick={() => setSpread(i)}
											className={cn(
												"flex size-6 cursor-pointer items-center justify-center rounded-sm border font-serif text-[0.6rem]",
												spread === i
													? "border-black bg-black text-[#f3ead8]"
													: "border-black/25 bg-[#f3ead8]/80",
												bookmark === i && "ring-2 ring-[#8b2942]/55",
											)}
										>
											{sp.sig}
										</button>
									))}
								</div>
								<label className="flex min-w-[min(100%,12rem)] items-center gap-1.5 font-serif text-[0.6rem] opacity-60">
									<span className="shrink-0 tracking-wider uppercase">
										Margin
									</span>
									<input
										value={note}
										onChange={(e) => setNote(e.target.value)}
										placeholder="Scribble…"
										className="w-full border border-black/15 bg-[#f3ead8]/95 px-2 py-1 font-serif text-sm text-[#1a1612] outline-none focus:border-black/35"
									/>
								</label>
							</div>
							<p className="mt-0.5 px-1 text-center font-serif text-[0.5rem] tracking-[0.28em] text-black/35 uppercase">
								{pen
									? "Pen wet · click blot · drag ink · peel dog-ear to turn"
									: "Pen dry · enable pen to stain · drag dog-ear · ribbon marks signature"}
							</p>
						</>
					)}
				</div>
			</div>
		</LandingsShell>
	)
}

/* ═══════════════════════════════════════════════════════════
   7 — ATLAS  ·  full-viewport expedition cartography
═══════════════════════════════════════════════════════════ */
export function AtlasLanding() {
	const pins = useMemo(
		() => [
			{
				id: "a",
				x: 22,
				y: 34,
				label: "Origin",
				lat: "41.2°N",
				lon: "12.4°E",
				elev: "128 m",
				note: "Where light first meets intention. The instrument begins here — cartography as biography, not decoration.",
				log: "Day 1 · Fixed position. Horizon clear. First soundings of the craft shelf.",
				img: MEDIA.heroStill,
			},
			{
				id: "b",
				x: 64,
				y: 24,
				label: "Orbit",
				lat: "48.8°N",
				lon: "2.3°E",
				elev: "35 m",
				note: "Products as satellites — Uncap, campaigns, craft surfaces in continuous motion around a quiet core.",
				log: "Day 4 · Tracked three product arcs. Signal strong on the western ridge.",
				img: MEDIA.uncapHome,
			},
			{
				id: "c",
				x: 74,
				y: 66,
				label: "Craft",
				lat: "35.6°N",
				lon: "139.7°E",
				elev: "40 m",
				note: "Standards under spectacle. The workshop continent — tools before fireworks, grids before glow.",
				log: "Day 9 · Entered workshop latitudes. Fog thinned by making.",
				img: MEDIA.designer,
			},
			{
				id: "d",
				x: 36,
				y: 74,
				label: "Signal",
				lat: "19.4°N",
				lon: "99.1°W",
				elev: "2 240 m",
				note: "Transmission continues. Ports open to other landings across the night ocean — every pin a handshake.",
				log: "Day 12 · High relay. Broadcast tested against weather layer.",
				img: MEDIA.campaign,
			},
			{
				id: "e",
				x: 50,
				y: 48,
				label: "Ma",
				lat: "—",
				lon: "—",
				elev: "0",
				note: "The empty sea between territories — charged interval, never vacant water. Chart the silence.",
				log: "Day ∞ · No coordinates. Only interval. Leave this pin un-named if you must.",
				img: MEDIA.folly,
			},
		],
		[],
	)
	const [active, setActive] = useState("a")
	// seed four pins so fog opens wide on first paint (map + haze both dense/readable) — Pass FF2
	const [visited, setVisited] = useState<string[]>(["a", "e", "b", "d"])
	const [zoom, setZoom] = useState(1)
	const [pan, setPan] = useState({ x: 0, y: 0 })
	const [layer, setLayer] = useState<"topo" | "signal" | "weather">("topo")
	const [journal, setJournal] = useState(true)
	const [routeOn, setRouteOn] = useState(true)
	const [fogOn, setFogOn] = useState(true)
	const [markers, setMarkers] = useState<
		{ x: number; y: number; id: number; label: string }[]
	>(() => [
		{ id: -1, x: 28, y: 42, label: "M1" },
		{ id: -2, x: 58, y: 55, label: "M2" },
		{ id: -3, x: 44, y: 28, label: "M3" },
		{ id: -4, x: 72, y: 38, label: "M4" },
		{ id: -5, x: 18, y: 62, label: "M5" },
		{ id: -6, x: 52, y: 68, label: "M6" },
	])
	const [dragging, setDragging] = useState(false)
	const [fieldNote, setFieldNote] = useState("")
	const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(
		null,
	)
	const mapRef = useRef<HTMLDivElement>(null)
	const cartoRef = useRef<HTMLCanvasElement>(null)
	const fogRef = useRef<HTMLCanvasElement>(null)
	const layerRef = useRef(layer)
	const visitedRef = useRef(visited)
	const fogOnRef = useRef(fogOn)
	const activeRef = useRef(active)
	layerRef.current = layer
	visitedRef.current = visited
	fogOnRef.current = fogOn
	activeRef.current = active
	const pin = pins.find((p) => p.id === active)!

	const visit = (id: string) => {
		setActive(id)
		setVisited((v) => (v.includes(id) ? v : [...v, id]))
	}

	// dense cartography + fog of war (full viewport) — Pass FF2 first-paint mass
	useEffect(() => {
		const c = cartoRef.current
		const fogC = fogRef.current
		if (!c) return
		const ctx = c.getContext("2d")
		const fogCtx = fogC?.getContext("2d")
		if (!ctx) return
		let raf = 0
		let t = 0
		const dpr = Math.min(devicePixelRatio, 2)
		const noise = (x: number, y: number) => {
			const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
			return s - Math.floor(s)
		}
		const fbm = (x: number, y: number) => {
			let v = 0
			let a = 0.5
			let f = 1
			for (let i = 0; i < 5; i++) {
				v += a * noise(x * f, y * f)
				a *= 0.5
				f *= 2.15
			}
			return v
		}
		const resize = () => {
			const W = innerWidth
			const H = innerHeight
			for (const canvas of [c, fogC]) {
				if (!canvas) continue
				canvas.width = W * dpr
				canvas.height = H * dpr
				canvas.style.width = `${W}px`
				canvas.style.height = `${H}px`
				canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0)
			}
		}
		resize()

		// packed landmass + archipelago seeds (FF2 denser continent pack)
		const coasts = [
			{ x: 0.18, y: 0.32, rx: 0.16, ry: 0.12 },
			{ x: 0.62, y: 0.28, rx: 0.2, ry: 0.1 },
			{ x: 0.72, y: 0.68, rx: 0.14, ry: 0.14 },
			{ x: 0.34, y: 0.72, rx: 0.18, ry: 0.1 },
			{ x: 0.48, y: 0.48, rx: 0.08, ry: 0.06 },
			{ x: 0.12, y: 0.58, rx: 0.1, ry: 0.16 },
			{ x: 0.88, y: 0.42, rx: 0.09, ry: 0.18 },
			{ x: 0.42, y: 0.18, rx: 0.07, ry: 0.05 },
			{ x: 0.55, y: 0.78, rx: 0.09, ry: 0.06 },
			{ x: 0.08, y: 0.22, rx: 0.06, ry: 0.08 },
			{ x: 0.78, y: 0.14, rx: 0.07, ry: 0.05 },
			{ x: 0.92, y: 0.72, rx: 0.05, ry: 0.07 },
			{ x: 0.28, y: 0.48, rx: 0.05, ry: 0.04 },
			{ x: 0.68, y: 0.48, rx: 0.06, ry: 0.05 },
			// FF2 archipelago / atolls
			{ x: 0.22, y: 0.12, rx: 0.045, ry: 0.035 },
			{ x: 0.38, y: 0.38, rx: 0.04, ry: 0.055 },
			{ x: 0.58, y: 0.58, rx: 0.055, ry: 0.04 },
			{ x: 0.82, y: 0.58, rx: 0.05, ry: 0.06 },
			{ x: 0.15, y: 0.78, rx: 0.06, ry: 0.045 },
			{ x: 0.95, y: 0.22, rx: 0.04, ry: 0.05 },
			{ x: 0.5, y: 0.08, rx: 0.05, ry: 0.03 },
			{ x: 0.05, y: 0.42, rx: 0.035, ry: 0.06 },
		]
		// settlement / sounding seeds (static world texture) — FF2 denser pack
		const towns = Array.from({ length: 118 }, (_, i) => ({
			x: noise(i * 1.7, 3.1),
			y: noise(i * 2.3, 7.9),
			s: 1.2 + noise(i, 4) * 3.4,
			name: [
				"Kite",
				"Vale",
				"Port",
				"Ridge",
				"Bay",
				"Fjord",
				"Isle",
				"Cape",
				"Haven",
				"Spire",
				"Drift",
				"Knob",
			][i % 12],
		}))
		const placeNames = [
			{ x: 0.18, y: 0.3, n: "ORIGIN SEA" },
			{ x: 0.62, y: 0.26, n: "ORBIT BANK" },
			{ x: 0.72, y: 0.66, n: "CRAFT RANGE" },
			{ x: 0.34, y: 0.7, n: "SIGNAL GULF" },
			{ x: 0.5, y: 0.48, n: "MA" },
			{ x: 0.88, y: 0.4, n: "EAST REEF" },
			{ x: 0.12, y: 0.56, n: "WEST TROUGH" },
			{ x: 0.42, y: 0.16, n: "NORTH REACH" },
			{ x: 0.55, y: 0.82, n: "SOUTH BANK" },
			{ x: 0.78, y: 0.48, n: "MID CHANNEL" },
			{ x: 0.28, y: 0.52, n: "INNER SOUND" },
			{ x: 0.68, y: 0.18, n: "ORBIT SHOAL" },
			{ x: 0.08, y: 0.36, n: "LEEWARD DEEP" },
			{ x: 0.9, y: 0.78, n: "LEEWARD REEF" },
			{ x: 0.46, y: 0.62, n: "QUIET PASS" },
			{ x: 0.32, y: 0.1, n: "HIGH LATITUDE" },
		]

		const loop = () => {
			t += 0.006
			const W = innerWidth
			const H = innerHeight
			ctx.clearRect(0, 0, W, H)

			// ocean bathymetry — multi-stop wash + depth rings (FF2 deeper plate)
			const ocean = ctx.createRadialGradient(
				W * 0.48,
				H * 0.52,
				0,
				W * 0.5,
				H * 0.5,
				Math.max(W, H) * 0.82,
			)
			ocean.addColorStop(0, "rgba(32,64,100,0.34)")
			ocean.addColorStop(0.35, "rgba(18,36,62,0.48)")
			ocean.addColorStop(0.7, "rgba(10,20,36,0.56)")
			ocean.addColorStop(1, "rgba(3,6,12,0.7)")
			ctx.fillStyle = ocean
			ctx.fillRect(0, 0, W, H)
			// secondary abyss wells for bathymetric mass
			for (const well of [
				[0.22, 0.62, 0.22],
				[0.78, 0.28, 0.2],
				[0.55, 0.78, 0.18],
			] as const) {
				const wg = ctx.createRadialGradient(
					W * well[0],
					H * well[1],
					0,
					W * well[0],
					H * well[1],
					Math.min(W, H) * well[2],
				)
				wg.addColorStop(0, "rgba(8,18,36,0.45)")
				wg.addColorStop(1, "transparent")
				ctx.fillStyle = wg
				ctx.fillRect(0, 0, W, H)
			}

			// isobaths (depth contours) — denser pack
			ctx.lineWidth = 1
			for (let r = 0; r < 12; r++) {
				const rad = Math.min(W, H) * (0.08 + r * 0.072)
				ctx.strokeStyle = `rgba(137,180,250,${0.12 - r * 0.007})`
				ctx.beginPath()
				ctx.ellipse(W * 0.5, H * 0.52, rad * 1.38, rad * 0.86, 0, 0, Math.PI * 2)
				ctx.stroke()
			}
			// offset isobath family (chart noise)
			for (let r = 0; r < 6; r++) {
				const rad = Math.min(W, H) * (0.15 + r * 0.11)
				ctx.strokeStyle = `rgba(116,199,236,${0.07 - r * 0.008})`
				ctx.beginPath()
				ctx.ellipse(
					W * 0.42,
					H * 0.48,
					rad * 1.15,
					rad * 0.72,
					0.2,
					0,
					Math.PI * 2,
				)
				ctx.stroke()
			}

			// dense graticule (Pass FF2 — finer mesh, stronger majors)
			for (let i = 0; i <= 80; i++) {
				const x = (i / 80) * W
				ctx.strokeStyle =
					i % 10 === 0
						? "rgba(137,180,250,0.32)"
						: i % 2 === 0
							? "rgba(137,180,250,0.12)"
							: "rgba(137,180,250,0.05)"
				ctx.lineWidth = i % 10 === 0 ? 1.35 : 0.65
				ctx.beginPath()
				ctx.moveTo(x, 0)
				ctx.lineTo(x, H)
				ctx.stroke()
			}
			for (let j = 0; j <= 54; j++) {
				const y = (j / 54) * H
				ctx.strokeStyle =
					j % 6 === 0
						? "rgba(137,180,250,0.28)"
						: j % 2 === 0
							? "rgba(137,180,250,0.1)"
							: "rgba(137,180,250,0.045)"
				ctx.lineWidth = j % 6 === 0 ? 1.2 : 0.65
				ctx.beginPath()
				ctx.moveTo(0, y)
				ctx.lineTo(W, y)
				ctx.stroke()
			}

			// rhumb / great-circle arcs — denser pack
			ctx.setLineDash([4, 9])
			for (let k = 0; k < 20; k++) {
				ctx.strokeStyle =
					k % 2 === 0 ? "rgba(203,166,247,0.16)" : "rgba(148,226,213,0.11)"
				ctx.lineWidth = 1
				ctx.beginPath()
				ctx.moveTo(0, H * (0.03 + k * 0.05))
				for (let x = 0; x <= W; x += 10) {
					const y =
						H * (0.03 + k * 0.05) +
						Math.sin(x * 0.004 + k + t * 0.3) * 34 +
						Math.cos(x * 0.002 + k) * 15
					ctx.lineTo(x, y)
				}
				ctx.stroke()
			}
			ctx.setLineDash([])

			// landmass silhouettes with coast noise + fill layers
			for (const land of coasts) {
				const cx = land.x * W
				const cy = land.y * H
				const rx = land.rx * W
				const ry = land.ry * H
				// outer shelf wash
				const shelf = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry) * 1.35)
				shelf.addColorStop(0, "rgba(40,70,100,0.35)")
				shelf.addColorStop(1, "transparent")
				ctx.fillStyle = shelf
				ctx.beginPath()
				ctx.ellipse(cx, cy, rx * 1.35, ry * 1.35, 0, 0, Math.PI * 2)
				ctx.fill()

				ctx.beginPath()
				for (let a = 0; a <= Math.PI * 2; a += 0.055) {
					const n = fbm(
						Math.cos(a) * 2 + land.x * 10,
						Math.sin(a) * 2 + land.y * 10,
					)
					const rr = 1 + (n - 0.5) * 0.34
					const px = cx + Math.cos(a) * rx * rr
					const py = cy + Math.sin(a) * ry * rr
					if (a === 0) ctx.moveTo(px, py)
					else ctx.lineTo(px, py)
				}
				ctx.closePath()
				const landFill = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry)
				landFill.addColorStop(0, "rgba(36,58,88,0.72)")
				landFill.addColorStop(0.55, "rgba(24,42,64,0.68)")
				landFill.addColorStop(1, "rgba(18,32,52,0.75)")
				ctx.fillStyle = landFill
				ctx.fill()
				ctx.strokeStyle = "rgba(148,226,213,0.38)"
				ctx.lineWidth = 1.4
				ctx.stroke()
				// double outer stroke (chart ink)
				ctx.strokeStyle = "rgba(137,180,250,0.12)"
				ctx.lineWidth = 3.5
				ctx.stroke()
				// inner contours (2 levels)
				for (const scale of [0.78, 0.55, 0.32]) {
					ctx.beginPath()
					for (let a = 0; a <= Math.PI * 2; a += 0.09) {
						const n = fbm(Math.cos(a) * 3 + land.x * 8, Math.sin(a) * 3 + scale)
						const rr = scale + (n - 0.5) * 0.12
						const px = cx + Math.cos(a) * rx * rr
						const py = cy + Math.sin(a) * ry * rr
						if (a === 0) ctx.moveTo(px, py)
						else ctx.lineTo(px, py)
					}
					ctx.closePath()
					ctx.strokeStyle = `rgba(137,180,250,${0.18 * scale + 0.05})`
					ctx.lineWidth = 0.9
					ctx.stroke()
				}
				// ridgeline hatch inside land
				ctx.save()
				ctx.beginPath()
				for (let a = 0; a <= Math.PI * 2; a += 0.08) {
					const n = fbm(Math.cos(a) * 2 + land.x * 10, Math.sin(a) * 2 + land.y * 10)
					const rr = 1 + (n - 0.5) * 0.28
					const px = cx + Math.cos(a) * rx * rr
					const py = cy + Math.sin(a) * ry * rr
					if (a === 0) ctx.moveTo(px, py)
					else ctx.lineTo(px, py)
				}
				ctx.closePath()
				ctx.clip()
				ctx.strokeStyle = "rgba(148,226,213,0.1)"
				ctx.lineWidth = 0.8
				for (let y = cy - ry; y < cy + ry; y += 5) {
					ctx.beginPath()
					ctx.moveTo(cx - rx, y)
					ctx.lineTo(cx + rx, y + 3)
					ctx.stroke()
				}
				ctx.restore()
			}

			// rivers / channels between major masses
			ctx.strokeStyle = "rgba(116,199,236,0.2)"
			ctx.lineWidth = 1.25
			ctx.setLineDash([2, 5])
			for (let r = 0; r < 12; r++) {
				const x0 = noise(r, 1) * W
				const y0 = noise(r, 2) * H
				ctx.beginPath()
				ctx.moveTo(x0, y0)
				let x = x0
				let y = y0
				for (let s = 0; s < 22; s++) {
					x += (noise(r + s, 5) - 0.35) * 28
					y += (noise(r + s, 9) - 0.4) * 22
					ctx.lineTo(x, y)
				}
				ctx.stroke()
			}
			ctx.setLineDash([])

			// global hatch texture
			ctx.save()
			ctx.globalAlpha = 0.065
			ctx.strokeStyle = "#89b4fa"
			ctx.lineWidth = 1
			for (let y = 0; y < H; y += 4) {
				ctx.beginPath()
				ctx.moveTo(0, y)
				ctx.lineTo(W, y + 5)
				ctx.stroke()
			}
			// counter-hatch
			ctx.globalAlpha = 0.038
			for (let x = 0; x < W; x += 7) {
				ctx.beginPath()
				ctx.moveTo(x, 0)
				ctx.lineTo(x - 18, H)
				ctx.stroke()
			}
			// stipple flecks (chart paper grain)
			ctx.globalAlpha = 0.12
			ctx.fillStyle = "#cdd6f4"
			for (let i = 0; i < 280; i++) {
				ctx.fillRect(noise(i * 1.3, 2.2) * W, noise(3.1, i * 1.7) * H, 1, 1)
			}
			ctx.restore()

			// towns / settlements / soundings
			for (const town of towns) {
				const tx = town.x * W
				const ty = town.y * H
				ctx.fillStyle = "rgba(205,214,244,0.5)"
				ctx.beginPath()
				ctx.arc(tx, ty, town.s, 0, Math.PI * 2)
				ctx.fill()
				ctx.strokeStyle = "rgba(148,226,213,0.28)"
				ctx.lineWidth = 0.8
				ctx.beginPath()
				ctx.arc(tx, ty, town.s + 3, 0, Math.PI * 2)
				ctx.stroke()
				// occasional town labels for chart density
				if (town.s > 3.2) {
					ctx.fillStyle = "rgba(186,194,222,0.28)"
					ctx.font = "8px ui-monospace, monospace"
					ctx.fillText(town.name, tx + town.s + 4, ty + 3)
				}
			}
			// depth soundings (fathoms-style ticks)
			ctx.fillStyle = "rgba(137,180,250,0.32)"
			ctx.font = "8px ui-monospace, monospace"
			for (let i = 0; i < 48; i++) {
				const sx = noise(i * 2.4, 11) * W
				const sy = noise(13, i * 1.9) * H
				const fath = Math.round(8 + noise(i, 17) * 92)
				ctx.fillText(String(fath), sx, sy)
			}

			// place-name labels
			ctx.font = "600 10px ui-monospace, monospace"
			ctx.fillStyle = "rgba(186,194,222,0.48)"
			for (const pl of placeNames) {
				ctx.fillText(pl.n, pl.x * W - 28, pl.y * H)
			}

			const L = layerRef.current
			if (L === "topo") {
				ctx.lineWidth = 1
				for (let y = 0; y < H; y += 6) {
					ctx.beginPath()
					for (let x = 0; x <= W; x += 3) {
						const n =
							fbm(x * 0.0032 + t * 0.12, y * 0.0032) * 20 +
							Math.sin(x * 0.013 + t + y * 0.014) * 4.5
						if (x === 0) ctx.moveTo(x, y + n)
						else ctx.lineTo(x, y + n)
					}
					ctx.strokeStyle =
						y % 24 === 0
							? "rgba(137,180,250,0.36)"
							: "rgba(137,180,250,0.14)"
					ctx.stroke()
				}
				// dense spot elevations
				ctx.fillStyle = "rgba(205,214,244,0.52)"
				ctx.font = "9px ui-monospace, monospace"
				for (let i = 0; i < 96; i++) {
					const x = noise(i, 1) * W
					const y = noise(i, 2) * H
					ctx.fillText(`${Math.round(noise(i, 3) * 3200)}m`, x, y)
				}
				// index contours every ~4th line mark
				ctx.strokeStyle = "rgba(249,226,175,0.18)"
				ctx.lineWidth = 1.35
				for (let y = 0; y < H; y += 28) {
					ctx.beginPath()
					for (let x = 0; x <= W; x += 5) {
						const n = fbm(x * 0.0025, y * 0.0025 + t * 0.05) * 18
						if (x === 0) ctx.moveTo(x, y + n)
						else ctx.lineTo(x, y + n)
					}
					ctx.stroke()
				}
				// hillshade ticks for PNG density
				ctx.strokeStyle = "rgba(148,226,213,0.08)"
				ctx.lineWidth = 0.7
				for (let i = 0; i < 60; i++) {
					const hx = noise(i * 3.1, 8) * W
					const hy = noise(9, i * 2.7) * H
					ctx.beginPath()
					ctx.moveTo(hx, hy)
					ctx.lineTo(hx + 6 + noise(i, 1) * 10, hy - 8 - noise(i, 2) * 12)
					ctx.stroke()
				}
			} else if (L === "signal") {
				for (let i = 0; i < pins.length; i++) {
					const px = pins[i]
					const cx = (px.x / 100) * W
					const cy = (px.y / 100) * H
					for (let ring = 0; ring < 5; ring++) {
						const r = 22 + ring * 28 + ((t * 55 + i * 40) % 100)
						ctx.strokeStyle = `hsla(${270 + i * 18}, 85%, 72%, ${0.36 - ring * 0.06 - r / 520})`
						ctx.lineWidth = 1.6 - ring * 0.2
						ctx.beginPath()
						ctx.arc(cx, cy, r, 0, Math.PI * 2)
						ctx.stroke()
					}
					// dual beams
					for (let b = 0; b < 3; b++) {
						ctx.strokeStyle = `hsla(${280 + i * 15 + b * 20}, 90%, 70%, 0.14)`
						ctx.beginPath()
						ctx.moveTo(cx, cy)
						ctx.lineTo(
							cx + Math.cos(t + i + b * 2.1) * 240,
							cy + Math.sin(t * 0.7 + i + b) * 240,
						)
						ctx.stroke()
					}
				}
				// mesh links between pins
				ctx.strokeStyle = "rgba(203,166,247,0.14)"
				ctx.setLineDash([3, 8])
				for (let i = 0; i < pins.length; i++) {
					for (let j = i + 1; j < pins.length; j++) {
						ctx.beginPath()
						ctx.moveTo((pins[i].x / 100) * W, (pins[i].y / 100) * H)
						ctx.lineTo((pins[j].x / 100) * W, (pins[j].y / 100) * H)
						ctx.stroke()
					}
				}
				ctx.setLineDash([])
			} else {
				// weather — denser cells + fronts
				for (let i = 0; i < 28; i++) {
					const cx = ((i * 89 + t * 40) % (W + 140)) - 70
					const cy = fbm(i * 0.2, t * 0.4) * H * 0.88 + H * 0.04
					const rad = 40 + noise(i, t) * 80
					const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
					g.addColorStop(0, "rgba(148,226,213,0.16)")
					g.addColorStop(0.45, "rgba(137,180,250,0.08)")
					g.addColorStop(1, "transparent")
					ctx.fillStyle = g
					ctx.beginPath()
					ctx.arc(cx, cy, rad, 0, Math.PI * 2)
					ctx.fill()
				}
				// dual front lines
				for (const base of [0.32, 0.58]) {
					ctx.strokeStyle =
						base < 0.5 ? "rgba(249,226,175,0.28)" : "rgba(243,139,168,0.2)"
					ctx.setLineDash([7, 5])
					ctx.lineWidth = 1.4
					ctx.beginPath()
					for (let x = 0; x <= W; x += 8) {
						const y =
							H * base +
							Math.sin(x * 0.01 + t + base * 4) * 38 +
							fbm(x * 0.01, t + base) * 28
						if (x === 0) ctx.moveTo(x, y)
						else ctx.lineTo(x, y)
					}
					ctx.stroke()
				}
				ctx.setLineDash([])
				// rain ticks
				ctx.strokeStyle = "rgba(137,180,250,0.12)"
				ctx.lineWidth = 1
				for (let i = 0; i < 60; i++) {
					const rx = ((i * 97 + t * 80) % W)
					const ry = ((i * 53 + t * 40) % H)
					ctx.beginPath()
					ctx.moveTo(rx, ry)
					ctx.lineTo(rx - 4, ry + 10)
					ctx.stroke()
				}
			}

			// lat/lon labels denser on edges + interior ticks
			ctx.fillStyle = "rgba(137,180,250,0.52)"
			ctx.font = "9px ui-monospace, monospace"
			for (let i = 0; i <= 12; i++) {
				ctx.fillText(`${90 - i * 15}°`, 6, (i / 12) * H * 0.94 + 18)
				ctx.fillText(`${i * 15 - 90}°`, (i / 12) * W * 0.94 + 18, H - 8)
			}
			// interior meridian labels
			ctx.fillStyle = "rgba(137,180,250,0.22)"
			ctx.font = "8px ui-monospace, monospace"
			for (let i = 1; i < 8; i++) {
				ctx.fillText(`${i * 20 - 80}°`, (i / 8) * W, H * 0.5)
			}
			// corner neatline ticks
			ctx.strokeStyle = "rgba(148,226,213,0.4)"
			ctx.lineWidth = 1.6
			const tick = 18
			for (const [ox, oy, dx, dy] of [
				[0, 0, 1, 1],
				[W, 0, -1, 1],
				[0, H, 1, -1],
				[W, H, -1, -1],
			] as const) {
				ctx.beginPath()
				ctx.moveTo(ox, oy + dy * tick * 2)
				ctx.lineTo(ox, oy)
				ctx.lineTo(ox + dx * tick * 2, oy)
				ctx.stroke()
				// secondary tick chevrons
				ctx.beginPath()
				ctx.moveTo(ox + dx * tick * 0.5, oy + dy * tick * 3)
				ctx.lineTo(ox, oy + dy * tick * 3)
				ctx.stroke()
			}
			// border minute ticks along neatline
			ctx.strokeStyle = "rgba(137,180,250,0.2)"
			ctx.lineWidth = 1
			for (let i = 0; i <= 40; i++) {
				const u = i / 40
				const len = i % 5 === 0 ? 10 : 5
				ctx.beginPath()
				ctx.moveTo(u * W, 0)
				ctx.lineTo(u * W, len)
				ctx.moveTo(u * W, H)
				ctx.lineTo(u * W, H - len)
				ctx.moveTo(0, u * H)
				ctx.lineTo(len, u * H)
				ctx.moveTo(W, u * H)
				ctx.lineTo(W - len, u * H)
				ctx.stroke()
			}

			// pin pulse rings on carto (under fog) for packed signal
			for (const p of pins) {
				const cx = (p.x / 100) * W
				const cy = (p.y / 100) * H
				const pulse = 10 + Math.sin(t * 2 + p.x) * 4
				for (const r of [pulse + 8, pulse + 18, pulse + 30]) {
					ctx.strokeStyle = `rgba(245,194,231,${0.24 - (r - pulse) * 0.004})`
					ctx.lineWidth = 1.15
					ctx.beginPath()
					ctx.arc(cx, cy, r, 0, Math.PI * 2)
					ctx.stroke()
				}
				ctx.fillStyle = "rgba(245,194,231,0.14)"
				ctx.beginPath()
				ctx.arc(cx, cy, 5.5, 0, Math.PI * 2)
				ctx.fill()
			}

			// fog of war — dense haze + chart texture; wide reveals at surveyed pins
			if (fogCtx && fogC) {
				fogCtx.clearRect(0, 0, W, H)
				if (fogOnRef.current) {
					// layered haze — map still peeks; fog reads as weather volume
					fogCtx.fillStyle = "rgba(6, 10, 16, 0.44)"
					fogCtx.fillRect(0, 0, W, H)
					// secondary cool wash
					const fogWash = fogCtx.createRadialGradient(
						W * 0.5,
						H * 0.45,
						0,
						W * 0.5,
						H * 0.5,
						Math.max(W, H) * 0.72,
					)
					fogWash.addColorStop(0, "rgba(20, 36, 58, 0.1)")
					fogWash.addColorStop(1, "rgba(4, 8, 14, 0.4)")
					fogCtx.fillStyle = fogWash
					fogCtx.fillRect(0, 0, W, H)
					// dense fog noise mottling
					fogCtx.fillStyle = "rgba(40, 58, 82, 0.13)"
					for (let i = 0; i < 480; i++) {
						const fx = noise(i * 0.7, t * 0.2) * W
						const fy = noise(t * 0.15, i * 1.1) * H
						fogCtx.beginPath()
						fogCtx.arc(fx, fy, 7 + noise(i, 2) * 38, 0, Math.PI * 2)
						fogCtx.fill()
					}
					// wispy cloud bands across unexplored chart
					fogCtx.strokeStyle = "rgba(90, 120, 160, 0.09)"
					fogCtx.lineWidth = 20
					for (let k = 0; k < 12; k++) {
						fogCtx.beginPath()
						const y0 = ((k * 0.09 + t * 0.02) % 1) * H
						for (let x = 0; x <= W; x += 16) {
							const y =
								y0 +
								Math.sin(x * 0.008 + k + t * 0.4) * 30 +
								noise(x * 0.01, k) * 22
							if (x === 0) fogCtx.moveTo(x, y)
							else fogCtx.lineTo(x, y)
						}
						fogCtx.stroke()
					}
					fogCtx.globalCompositeOperation = "destination-out"
					for (const p of pins) {
						if (!visitedRef.current.includes(p.id)) continue
						const cx = (p.x / 100) * W
						const cy = (p.y / 100) * H
						const rad =
							Math.min(W, H) *
							(p.id === activeRef.current ? 0.4 : 0.32)
						const g = fogCtx.createRadialGradient(
							cx,
							cy,
							rad * 0.08,
							cx,
							cy,
							rad,
						)
						g.addColorStop(0, "rgba(0,0,0,1)")
						g.addColorStop(0.4, "rgba(0,0,0,0.92)")
						g.addColorStop(1, "rgba(0,0,0,0)")
						fogCtx.fillStyle = g
						fogCtx.beginPath()
						fogCtx.arc(cx, cy, rad, 0, Math.PI * 2)
						fogCtx.fill()
					}
					// reveal along explored route
					if (visitedRef.current.length > 1) {
						for (let i = 0; i < pins.length; i++) {
							const a = pins[i]
							const b = pins[(i + 1) % pins.length]
							if (
								!visitedRef.current.includes(a.id) ||
								!visitedRef.current.includes(b.id)
							)
								continue
							const steps = 26
							for (let s = 0; s <= steps; s++) {
								const u = s / steps
								const cx = ((a.x + (b.x - a.x) * u) / 100) * W
								const cy = ((a.y + (b.y - a.y) * u) / 100) * H
								const g = fogCtx.createRadialGradient(cx, cy, 0, cx, cy, 92)
								g.addColorStop(0, "rgba(0,0,0,0.85)")
								g.addColorStop(1, "rgba(0,0,0,0)")
								fogCtx.fillStyle = g
								fogCtx.beginPath()
								fogCtx.arc(cx, cy, 92, 0, Math.PI * 2)
								fogCtx.fill()
							}
						}
					}
					fogCtx.globalCompositeOperation = "source-over"
					// dense paper grain + chart flecks on fog
					fogCtx.fillStyle = "rgba(110,130,160,0.07)"
					for (let i = 0; i < 700; i++) {
						fogCtx.fillRect(
							noise(i, t) * W,
							noise(t, i) * H,
							1 + (i % 3),
							1 + (i % 2),
						)
					}
					// crosshatch flecks in dense fog zones
					fogCtx.strokeStyle = "rgba(100,125,155,0.05)"
					fogCtx.lineWidth = 1
					for (let i = 0; i < 72; i++) {
						const hx = noise(i * 2.1, 3) * W
						const hy = noise(4, i * 1.8) * H
						fogCtx.beginPath()
						fogCtx.moveTo(hx - 10, hy)
						fogCtx.lineTo(hx + 10, hy + 3)
						fogCtx.stroke()
					}
					// unexplored question marks
					fogCtx.fillStyle = "rgba(137,180,250,0.18)"
					fogCtx.font = "12px ui-monospace, monospace"
					for (const p of pins) {
						if (visitedRef.current.includes(p.id)) continue
						fogCtx.fillText(
							"?",
							(p.x / 100) * W - 3,
							(p.y / 100) * H + 4,
						)
					}
				}
			}

			raf = requestAnimationFrame(loop)
		}
		// solid first paint — full cartography frame before RAF wait
		loop()
		window.addEventListener("resize", resize)
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener("resize", resize)
		}
	}, [pins])

	const expeditionPct = Math.round((visited.length / pins.length) * 100)

	return (
		<LandingsShell className="bg-[#060a10] text-text">
			<div
				ref={mapRef}
				className={cn(
					"relative h-dvh max-h-dvh overflow-hidden select-none",
					dragging ? "cursor-grabbing" : "cursor-grab",
				)}
				onPointerDown={(e) => {
					if ((e.target as HTMLElement).closest("button,a,input,label,aside"))
						return
					setDragging(true)
					dragRef.current = {
						x: e.clientX,
						y: e.clientY,
						px: pan.x,
						py: pan.y,
					}
					e.currentTarget.setPointerCapture(e.pointerId)
				}}
				onPointerMove={(e) => {
					if (!dragging || !dragRef.current) return
					const dx = e.clientX - dragRef.current.x
					const dy = e.clientY - dragRef.current.y
					setPan({
						x: dragRef.current.px + dx,
						y: dragRef.current.py + dy,
					})
				}}
				onPointerUp={() => {
					setDragging(false)
					dragRef.current = null
				}}
				onWheel={(e) => {
					e.preventDefault()
					const delta = e.deltaY > 0 ? -0.08 : 0.08
					setZoom((z) => Math.min(2.6, Math.max(0.65, z + delta)))
				}}
				onDoubleClick={(e) => {
					if ((e.target as HTMLElement).closest("button,a,aside")) return
					const r = e.currentTarget.getBoundingClientRect()
					const mx = (e.clientX - r.left - r.width / 2 - pan.x) / zoom + r.width / 2
					const my =
						(e.clientY - r.top - r.height / 2 - pan.y) / zoom + r.height / 2
					setMarkers((m) => [
						...m.slice(-12),
						{
							id: Date.now(),
							x: (mx / r.width) * 100,
							y: (my / r.height) * 100,
							label: `M${m.length + 1}`,
						},
					])
				}}
			>
				{/* full-viewport map stage */}
				<motion.div
					className="absolute inset-0 origin-center will-change-transform"
					animate={{ scale: zoom, x: pan.x, y: pan.y }}
					transition={{ type: "spring", stiffness: 160, damping: 24 }}
				>
					{/* base chart photo + deep grade — higher texture mass (Pass FF2) */}
					<img
						src={MEDIA.walkway}
						alt=""
						className="absolute inset-0 h-full w-full scale-110 object-cover opacity-68 contrast-140 saturate-[0.7]"
						decoding="async"
						fetchPriority="high"
					/>
					<div className="absolute inset-0 bg-[#0a1528]/28 mix-blend-multiply" />
					{/* secondary plate ghost for cartographic collage */}
					<img
						src={MEDIA.folly}
						alt=""
						className="absolute inset-0 h-full w-full scale-105 object-cover opacity-32 mix-blend-soft-light contrast-120"
						loading="lazy"
						decoding="async"
					/>
					{/* tertiary texture plate — chart collage mass */}
					<img
						src={MEDIA.heroStill}
						alt=""
						className="absolute inset-0 h-full w-full scale-100 object-cover opacity-14 mix-blend-overlay contrast-110"
						loading="lazy"
						decoding="async"
					/>
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,10,16,0.32)_50%,rgba(4,6,10,0.84)_100%)]" />
					{/* CSS first-paint graticule (no canvas wait) */}
					<div
						className="pointer-events-none absolute inset-0 opacity-[0.22]"
						style={{
							backgroundImage:
								"linear-gradient(rgba(137,180,250,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(137,180,250,0.35) 1px, transparent 1px), linear-gradient(rgba(137,180,250,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(137,180,250,0.12) 1px, transparent 1px)",
							backgroundSize: "120px 90px, 120px 90px, 24px 18px, 24px 18px",
						}}
					/>
					{/* SSR-safe landmass silhouettes for first-paint chart mass */}
					<div className="pointer-events-none absolute inset-0">
						{[
							{ l: "12%", t: "22%", w: "28%", h: "22%" },
							{ l: "52%", t: "16%", w: "32%", h: "20%" },
							{ l: "62%", t: "56%", w: "24%", h: "26%" },
							{ l: "22%", t: "60%", w: "30%", h: "20%" },
							{ l: "42%", t: "40%", w: "14%", h: "12%" },
							{ l: "4%", t: "48%", w: "16%", h: "28%" },
							{ l: "80%", t: "30%", w: "16%", h: "32%" },
							{ l: "36%", t: "8%", w: "12%", h: "10%" },
							{ l: "70%", t: "8%", w: "12%", h: "9%" },
							{ l: "8%", t: "12%", w: "10%", h: "14%" },
						].map((land, i) => (
							<div
								key={i}
								className="absolute rounded-[45%_55%_50%_50%] border border-teal/20 bg-[#1a3048]/45 shadow-[inset_0_0_40px_rgba(137,180,250,0.08)]"
								style={{
									left: land.l,
									top: land.t,
									width: land.w,
									height: land.h,
									transform: `rotate(${(i % 5) * 7 - 14}deg)`,
								}}
							/>
						))}
						{/* isobath rings as CSS ellipses */}
						{[38, 52, 68, 84].map((s) => (
							<div
								key={s}
								className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sapphire/15"
								style={{ width: `${s}%`, height: `${s * 0.62}%` }}
							/>
						))}
					</div>

					<canvas ref={cartoRef} className="absolute inset-0 h-full w-full" />
					<canvas
						ref={fogRef}
						className="pointer-events-none absolute inset-0 h-full w-full"
					/>

					{/* parchment grain frame */}
					<div
						className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
						style={{
							backgroundImage:
								"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
						}}
					/>
					{/* dual film grain for PNG density */}
					<div
						className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-soft-light"
						style={{
							backgroundImage:
								"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence baseFrequency='1.2' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
						}}
					/>
					{/* neatline border — double plate */}
					<div className="pointer-events-none absolute inset-2 rounded-sm border border-teal/30 shadow-[inset_0_0_0_1px_rgba(137,180,250,0.1)]" />
					<div className="pointer-events-none absolute inset-3 rounded-sm border border-sapphire/20" />
					<div className="pointer-events-none absolute inset-5 rounded-sm border border-white/[0.05]" />
					{/* corner registry marks */}
					{(
						[
							"top-4 left-4",
							"top-4 right-4",
							"bottom-4 left-4",
							"bottom-4 right-4",
						] as const
					).map((pos) => (
						<div
							key={pos}
							className={cn(
								"pointer-events-none absolute size-5 border-teal/40",
								pos,
								pos.includes("top") ? "border-t" : "border-b",
								pos.includes("left") ? "border-l" : "border-r",
							)}
						/>
					))}

					{/* route + secondary meridians */}
					{routeOn && (
						<svg className="absolute inset-0 h-full w-full overflow-visible">
							{/* faint great-circle decoration */}
							{[12, 24, 36, 48, 60, 72, 84].map((y) => (
								<path
									key={y}
									d={`M 0 ${y} Q 25 ${y - 8} 50 ${y} T 100 ${y}`}
									fill="none"
									stroke="rgba(203,166,247,0.14)"
									strokeWidth="0.65"
									strokeDasharray="2 6"
									vectorEffect="non-scaling-stroke"
									pathLength={100}
								/>
							))}
							{/* meridian decoration arcs */}
							{[15, 35, 55, 75].map((x) => (
								<path
									key={`m${x}`}
									d={`M ${x} 0 Q ${x + 6} 40 ${x} 70 T ${x} 100`}
									fill="none"
									stroke="rgba(148,226,213,0.1)"
									strokeWidth="0.55"
									strokeDasharray="3 7"
									vectorEffect="non-scaling-stroke"
									pathLength={100}
								/>
							))}
							{pins.map((p, i) => {
								const n = pins[(i + 1) % pins.length]
								const known =
									visited.includes(p.id) && visited.includes(n.id)
								return (
									<g key={p.id + "l"}>
										<motion.line
											x1={`${p.x}%`}
											y1={`${p.y}%`}
											x2={`${n.x}%`}
											y2={`${n.y}%`}
											stroke={known ? "#f5c2e7" : "#6c7086"}
											strokeWidth={known ? 2.4 : 1.1}
											strokeDasharray={known ? "2 10" : "4 12"}
											opacity={known ? 0.9 : fogOn ? 0.18 : 0.35}
											animate={
												known
													? { strokeDashoffset: [0, -24] }
													: { strokeDashoffset: 0 }
											}
											transition={{
												duration: 2.2,
												repeat: Infinity,
												ease: "linear",
											}}
										/>
										{known && (
											<>
												<circle
													cx={`${(p.x + n.x) / 2}%`}
													cy={`${(p.y + n.y) / 2}%`}
													r="2.5"
													fill="#f5c2e7"
													opacity="0.7"
												/>
												<circle
													cx={`${(p.x * 2 + n.x) / 3}%`}
													cy={`${(p.y * 2 + n.y) / 3}%`}
													r="1.5"
													fill="#94e2d5"
													opacity="0.5"
												/>
											</>
										)}
									</g>
								)
							})}
						</svg>
					)}

					{markers.map((m) => (
						<div
							key={m.id}
							className="absolute z-[5] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
							style={{ left: `${m.x}%`, top: `${m.y}%` }}
						>
							<div className="size-2.5 rotate-45 border border-teal bg-teal/80 shadow-[0_0_14px_#94e2d5]" />
							<span className="mt-1 font-mono text-[0.5rem] tracking-wider text-teal/80">
								{m.label}
							</span>
						</div>
					))}

					{pins.map((p) => {
						const isOn = active === p.id
						const seen = visited.includes(p.id)
						const veiled = fogOn && !seen
						return (
							<button
								key={p.id}
								type="button"
								onClick={(e) => {
									e.stopPropagation()
									visit(p.id)
								}}
								className="absolute z-10 flex -translate-x-1/2 -translate-y-full cursor-pointer flex-col items-center"
								style={{ left: `${p.x}%`, top: `${p.y}%` }}
								aria-label={p.label}
							>
								{/* halo rings for density */}
								<span
									className={cn(
										"pointer-events-none absolute top-3 size-16 -translate-y-1/2 rounded-full border opacity-40",
										isOn
											? "border-pink/50 shadow-[0_0_28px_rgba(245,194,231,0.35)]"
											: seen
												? "border-sapphire/40"
												: "border-white/15",
									)}
								/>
								<span
									className={cn(
										"pointer-events-none absolute top-3 size-24 -translate-y-1/2 rounded-full border opacity-20",
										isOn ? "border-pink/30" : "border-teal/20",
									)}
								/>
								{/* pin stem */}
								<span
									className={cn(
										"relative flex flex-col items-center transition-transform",
										isOn && "scale-110",
									)}
								>
									<span
										className={cn(
											"flex size-9 items-center justify-center rounded-full border-2 shadow-lg backdrop-blur-sm transition",
											isOn
												? "border-pink bg-pink/35 shadow-[0_0_40px_var(--catpuccin-pink)]"
												: seen
													? "border-sapphire bg-sapphire/30 hover:scale-110"
													: "border-overlay-1 bg-surface-0/80 hover:scale-105",
										)}
									>
										<span
											className={cn(
												"size-2.5 rounded-full",
												isOn ? "bg-pink" : seen ? "bg-sapphire" : "bg-overlay-1",
											)}
										/>
									</span>
									<span className="h-3.5 w-px bg-gradient-to-b from-white/60 to-transparent" />
									<span className="size-1.5 -mt-0.5 rounded-full bg-white/50" />
								</span>
								<span
									className={cn(
										"mt-1 rounded-full px-2.5 py-0.5 text-[0.55rem] font-black tracking-[0.22em] uppercase backdrop-blur-md",
										isOn
											? "bg-pink/30 text-pink ring-1 ring-pink/45"
											: veiled
												? "bg-black/65 text-white/40"
												: "bg-black/60 text-white/80 ring-1 ring-white/15",
									)}
								>
									{veiled ? "???" : p.label}
								</span>
								{seen && (
									<span className="mt-0.5 font-mono text-[0.5rem] text-teal/70">
										{p.lat} {p.lon}
									</span>
								)}
							</button>
						)
					})}
				</motion.div>

				{/* HUD over map */}
				<div className="pointer-events-none relative z-20 flex h-full flex-col justify-between px-3 pt-16 pb-4 sm:px-6">
					<div className="pointer-events-auto flex flex-wrap items-start justify-between gap-3">
						<div className="rounded-2xl border border-white/12 bg-black/50 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
							<p className="text-teal text-[0.62rem] font-black tracking-[0.4em] uppercase">
								Atlas · expedition {expeditionPct}% charted · z
								{zoom.toFixed(1)} · {markers.length} marks
							</p>
							<h1 className="mt-1 text-[clamp(1.5rem,4vw,2.4rem)] font-thin tracking-tight">
								Cartography of craft
							</h1>
							<p className="text-subtext-0 mt-1 max-w-measure text-[0.72rem] leading-relaxed">
								Full-chart instrument. Pan, scroll-zoom, open pins to burn fog.
								Journal the coast.
							</p>
							{/* legend strip — first-paint carto density */}
							<div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 border-t border-white/10 pt-2 font-mono text-[0.52rem] tracking-wide text-white/45">
								<span className="flex items-center gap-1">
									<span className="size-1.5 rounded-full bg-pink/80" /> pin
								</span>
								<span className="flex items-center gap-1">
									<span className="size-1.5 rotate-45 bg-teal/80" /> mark
								</span>
								<span className="flex items-center gap-1">
									<span className="h-px w-3 bg-sapphire/70" /> graticule
								</span>
								<span className="flex items-center gap-1">
									<span className="h-px w-3 border-t border-dashed border-pink/60" />{" "}
									route
								</span>
								<span className="flex items-center gap-1">
									<span className="h-2 w-2 rounded-full border border-teal/50 bg-[#1e3048]" />{" "}
									land
								</span>
								<span className="flex items-center gap-1">
									<span className="h-px w-3 bg-lavender/50" /> rhumb
								</span>
								<span className="text-white/30">
									{visited.length}/{pins.length} surveyed · fog{" "}
									{fogOn ? "on" : "off"} · {markers.length} marks
								</span>
							</div>
							{/* mini bathymetry key — chart plate density */}
							<div className="mt-2 flex items-center gap-1.5">
								<span className="font-mono text-[0.48rem] tracking-wider text-white/30 uppercase">
									Depth
								</span>
								<div className="flex h-1.5 flex-1 overflow-hidden rounded-full ring-1 ring-white/10">
									{[
										"bg-[#0a1628]",
										"bg-[#122848]",
										"bg-[#1a3a62]",
										"bg-[#2a5080]",
										"bg-[#4a78a8]",
										"bg-[#89b4fa]/70",
									].map((c, i) => (
										<div key={i} className={cn("h-full flex-1", c)} />
									))}
								</div>
								<span className="font-mono text-[0.48rem] text-white/30">
									0–4k m
								</span>
							</div>
						</div>
						<div className="flex items-start gap-2">
							{/* chart key */}
							<div className="hidden rounded-xl border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-xl sm:block">
								<p className="text-[0.5rem] font-black tracking-widest text-white/40 uppercase">
									Layer · {layer}
								</p>
								<div className="mt-1.5 space-y-1 font-mono text-[0.5rem] text-white/50">
									<div className="flex items-center gap-1.5">
										<span className="h-0.5 w-4 bg-teal/60" /> isobath
									</div>
									<div className="flex items-center gap-1.5">
										<span className="size-1.5 rounded-full bg-white/50" /> town
									</div>
									<div className="flex items-center gap-1.5">
										<span className="h-2 w-3 rounded-sm bg-[#1e3048]/90 ring-1 ring-teal/30" />{" "}
										land
									</div>
									<div className="flex items-center gap-1.5">
										<span className="h-px w-4 border-t border-dashed border-lavender/60" />{" "}
										rhumb
									</div>
									<div className="flex items-center gap-1.5">
										<span className="size-1.5 rounded-full bg-pink/70" /> pin
									</div>
									<div className="flex items-center gap-1.5">
										<span className="h-2 w-2 rounded-sm bg-white/10 ring-1 ring-sapphire/40" />{" "}
										fog
									</div>
								</div>
							</div>
							{/* mini scale */}
							<div className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-xl">
								<p className="text-[0.5rem] font-black tracking-widest text-white/40 uppercase">
									Scale
								</p>
								<div className="mt-1 flex items-end gap-1">
									<div
										className="h-1 bg-teal/70"
										style={{ width: `${48 / zoom}px` }}
									/>
									<span className="font-mono text-[0.55rem] text-teal/80">
										{Math.round(120 / zoom)} km
									</span>
								</div>
								<div className="mt-1.5 h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
								<p className="mt-1 font-mono text-[0.48rem] text-white/35">
									1:{Math.round(250000 / zoom)}
								</p>
							</div>
							<motion.div
								className="relative size-[5rem] rounded-full border border-white/25 bg-black/55 shadow-lg backdrop-blur-xl ring-1 ring-teal/20"
								animate={{ rotate: pan.x * 0.12 }}
							>
								{/* outer degree ring */}
								<div className="pointer-events-none absolute inset-0.5 rounded-full border border-white/10" />
								{/* compass rose ticks — 24 for denser rose */}
								{Array.from({ length: 24 }, (_, i) => (
									<div
										key={i}
										className={cn(
											"absolute top-1/2 left-1/2 origin-bottom bg-white/15",
											i % 3 === 0 ? "h-[44%] w-px bg-white/28" : "h-[38%] w-px",
										)}
										style={{
											transform: `translate(-50%, -100%) rotate(${i * 15}deg)`,
										}}
									/>
								))}
								<div className="absolute top-1 left-1/2 -translate-x-1/2 text-[0.55rem] font-black text-red">
									N
								</div>
								<div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[0.45rem] text-white/40">
									E
								</div>
								<div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[0.45rem] text-white/40">
									S
								</div>
								<div className="absolute top-1/2 left-1.5 -translate-y-1/2 text-[0.45rem] text-white/40">
									W
								</div>
								<div className="absolute top-1/2 left-1/2 h-7 w-0.5 -translate-x-1/2 -translate-y-[70%] rounded bg-gradient-to-t from-pink to-red" />
								<div className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-pink/40" />
							</motion.div>
						</div>
					</div>

					<div className="pointer-events-auto flex flex-wrap items-end justify-between gap-4">
						<div className="flex max-w-measure flex-col gap-2">
							<div className="flex flex-wrap gap-1.5">
								{(["topo", "signal", "weather"] as const).map((l) => (
									<button
										key={l}
										type="button"
										onClick={() => setLayer(l)}
										className={cn(
											"cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.6rem] font-black tracking-widest uppercase backdrop-blur-md",
											layer === l
												? "border-teal bg-teal/20 text-teal"
												: "border-white/12 bg-black/45 text-white/55 hover:text-white/80",
										)}
									>
										{l}
									</button>
								))}
							</div>
							<div className="flex flex-wrap gap-1.5">
								{(
									[
										["Zoom +", () => setZoom((z) => Math.min(2.6, z + 0.2))],
										["Zoom −", () => setZoom((z) => Math.max(0.65, z - 0.2))],
										[
											"Recenter",
											() => {
												setZoom(1)
												setPan({ x: 0, y: 0 })
											},
										],
										[
											`Route ${routeOn ? "on" : "off"}`,
											() => setRouteOn((r) => !r),
										],
										[
											`Fog ${fogOn ? "on" : "off"}`,
											() => setFogOn((f) => !f),
										],
										["Journal", () => setJournal((j) => !j)],
										["Clear marks", () => setMarkers([])],
									] as const
								).map(([label, fn]) => (
									<button
										key={label}
										type="button"
										onClick={fn}
										className="cursor-pointer rounded-full border border-white/12 bg-black/45 px-3 py-1.5 text-[0.6rem] font-bold tracking-wide text-white/65 backdrop-blur-md hover:border-white/25 hover:text-white"
									>
										{label}
									</button>
								))}
							</div>
							<p className="text-subtext-0 text-[0.65rem]">
								Drag pan · scroll zoom · double-click mark · pin reveals fog
							</p>
						</div>

						<AnimatePresence>
							{journal && (
								<motion.aside
									initial={{ opacity: 0, x: 48, y: 12 }}
									animate={{ opacity: 1, x: 0, y: 0 }}
									exit={{ opacity: 0, x: 48 }}
									transition={{ type: "spring", stiffness: 280, damping: 26 }}
									className="max-h-[min(58dvh,520px)] w-full max-w-[22rem] overflow-y-auto overflow-x-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-black/75 to-black/55 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:w-[22rem]"
								>
									{/* journal header strip */}
									<div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2">
										<p className="text-[0.58rem] font-black tracking-[0.32em] text-teal uppercase">
											Field journal
										</p>
										<p className="font-mono text-[0.58rem] text-white/40">
											{pin.lat} · {pin.lon} · {pin.elev}
										</p>
									</div>
									<div className="p-3">
										<AnimatePresence mode="wait">
											<motion.div
												key={pin.id}
												initial={{ opacity: 0, y: 12 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -8 }}
												transition={{ duration: 0.28 }}
											>
												<div className="flex items-start justify-between gap-2">
													<h2 className="text-2xl font-thin tracking-tight">
														{pin.label}
													</h2>
													<span
														className={cn(
															"rounded-full px-2 py-0.5 text-[0.55rem] font-black tracking-wider uppercase",
															visited.includes(pin.id)
																? "bg-teal/15 text-teal"
																: "bg-white/5 text-white/35",
														)}
													>
														{visited.includes(pin.id) ? "Surveyed" : "Unknown"}
													</span>
												</div>
												<p className="text-subtext-0 mt-1.5 line-clamp-3 text-sm leading-relaxed">
													{pin.note}
												</p>
												<p className="mt-1.5 line-clamp-2 border-l-2 border-pink/40 pl-2.5 font-mono text-[0.68rem] leading-relaxed text-pink/80">
													{pin.log}
												</p>
												<div className="relative mt-2 overflow-hidden rounded-xl ring-1 ring-white/10">
													<img
														src={pin.img}
														alt=""
														className="aspect-[16/9] max-h-28 w-full object-cover"
														loading="lazy"
														decoding="async"
													/>
													<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-1.5">
														<p className="font-mono text-[0.55rem] tracking-wider text-white/60 uppercase">
															Plate · {pin.id.toUpperCase()} · survey photo
														</p>
													</div>
												</div>
											</motion.div>
										</AnimatePresence>

										{/* pin selector as map index */}
										<div className="mt-3 grid grid-cols-5 gap-1">
											{pins.map((p) => (
												<button
													key={p.id}
													type="button"
													onClick={() => visit(p.id)}
													className={cn(
														"cursor-pointer rounded-lg px-1 py-1.5 text-[0.55rem] font-bold tracking-wide transition",
														active === p.id
															? "bg-pink/25 text-pink ring-1 ring-pink/40"
															: visited.includes(p.id)
																? "bg-white/10 text-white/75 hover:bg-white/15"
																: "bg-white/[0.04] text-white/30 hover:text-white/50",
													)}
												>
													{visited.includes(p.id) ? p.label : "· · ·"}
												</button>
											))}
										</div>

										<label className="mt-3 flex flex-col gap-1">
											<span className="text-[0.55rem] font-black tracking-[0.25em] text-white/35 uppercase">
												Scribble
											</span>
											<input
												value={fieldNote}
												onChange={(e) => setFieldNote(e.target.value)}
												placeholder="Field note for this pin…"
												className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-teal/40"
											/>
										</label>
										{fieldNote && (
											<p className="mt-1.5 font-mono text-[0.68rem] text-teal/70 italic">
												“{fieldNote}”
											</p>
										)}

										<div className="mt-3">
											<div className="mb-1 flex justify-between font-mono text-[0.55rem] text-white/40">
												<span>Expedition</span>
												<span>
													{visited.length}/{pins.length} · {expeditionPct}%
												</span>
											</div>
											<div className="h-1.5 overflow-hidden rounded-full bg-white/10">
												<motion.div
													className="h-full rounded-full bg-gradient-to-r from-teal via-sapphire to-pink"
													animate={{ width: `${expeditionPct}%` }}
													transition={{ type: "spring", stiffness: 120, damping: 18 }}
												/>
											</div>
										</div>
									</div>
								</motion.aside>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</LandingsShell>
	)
}

/* ═══════════════════════════════════════════════════════════
   8 — PULSE  ·  full visual instrument
═══════════════════════════════════════════════════════════ */
export function PulseLanding() {
	const STEPS = 16
	const TRACKS = [
		{ id: "kick", label: "KICK", color: "#89b4fa" },
		{ id: "snare", label: "SNARE", color: "#f5c2e7" },
		{ id: "hat", label: "HAT", color: "#94e2d5" },
		{ id: "perc", label: "PERC", color: "#cba6f7" },
	] as const

	const defaultSeq = () =>
		TRACKS.map((_, ti) =>
			Array.from({ length: STEPS }, (__, s) => {
				if (ti === 0) return s % 4 === 0
				if (ti === 1) return s % 8 === 4
				if (ti === 2) return s % 2 === 0
				return s === 3 || s === 11 || s === 14
			}),
		)

	const [beat, setBeat] = useState(0)
	const [bpm, setBpm] = useState(128)
	const [running, setRunning] = useState(true)
	const [swing, setSwing] = useState(0.12)
	const [seq, setSeq] = useState(defaultSeq)
	const [mutes, setMutes] = useState(() => TRACKS.map(() => false))
	const [solos, setSolos] = useState(() => TRACKS.map(() => false))
	const [view, setView] = useState<"seq" | "wave" | "pads">("seq")
	const [energy, setEnergy] = useState(1.45)
	const [hueShift, setHueShift] = useState(0)
	const [hits, setHits] = useState(0)
	const [padRings, setPadRings] = useState<
		{ id: number; ti: number; t: number }[]
	>([])
	const [flash, setFlash] = useState(0)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const waveRef = useRef<HTMLCanvasElement>(null)
	const seqRef = useRef(seq)
	const mutesRef = useRef(mutes)
	const solosRef = useRef(solos)
	const energyRef = useRef(energy)
	const hueRef = useRef(hueShift)
	const stepRef = useRef(0)
	const beatRef = useRef(0)
	const step = beat % STEPS
	const bars = 128

	seqRef.current = seq
	mutesRef.current = mutes
	solosRef.current = solos
	energyRef.current = energy
	hueRef.current = hueShift
	stepRef.current = step
	beatRef.current = beat

	useEffect(() => {
		if (!running) return
		const base = 60_000 / bpm / 4
		const swung =
			step % 2 === 1 ? base * (1 + swing * 0.35) : base * (1 - swing * 0.1)
		const id = window.setTimeout(() => setBeat((b) => b + 1), swung)
		return () => clearTimeout(id)
	}, [running, bpm, beat, step, swing])

	// flash on downbeat / active hits
	useEffect(() => {
		const anySolo = solos.some(Boolean)
		const live = TRACKS.some(
			(_, ti) =>
				seq[ti][step] &&
				!mutes[ti] &&
				!(anySolo && !solos[ti]),
		)
		if (live) setFlash((f) => f + 1)
	}, [step, seq, mutes, solos])

	// ambient field canvas — tall spectrum + particles + energy rings (first paint dense)
	useEffect(() => {
		const c = canvasRef.current
		if (!c) return
		const ctx = c.getContext("2d")
		if (!ctx) return
		let raf = 0
		let t = 0
		type Ring = {
			x: number
			y: number
			r: number
			a: number
			hue: number
			w: number
			spin: number
		}
		type Particle = {
			x: number
			y: number
			vx: number
			vy: number
			life: number
			max: number
			hue: number
			sz: number
		}
		const rings: Ring[] = []
		const particles: Particle[] = []
		const dpr = Math.min(devicePixelRatio, 1.75)
		const resize = () => {
			c.width = innerWidth * dpr
			c.height = innerHeight * dpr
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		}
		resize()
		// solid first paint
		ctx.fillStyle = "#11111b"
		ctx.fillRect(0, 0, innerWidth, innerHeight)

		// seed ambient particles so frame 1 is already dense
		for (let i = 0; i < 140; i++) {
			particles.push({
				x: Math.random() * innerWidth,
				y: Math.random() * innerHeight,
				vx: (Math.random() - 0.5) * 0.55,
				vy: (Math.random() - 0.5) * 0.55 - 0.15,
				life: 0.35 + Math.random() * 0.65,
				max: 0.55 + Math.random() * 0.45,
				hue: 160 + Math.random() * 140,
				sz: 0.8 + Math.random() * 2.4,
			})
		}
		// seed energy rings so first paint already has expanding field
		for (let i = 0; i < 10; i++) {
			rings.push({
				x: innerWidth * (0.18 + (i % 5) * 0.16),
				y: innerHeight * (0.28 + (i % 3) * 0.12),
				r: 18 + i * 22,
				a: 0.55 - i * 0.035,
				hue: 150 + i * 22,
				w: 2.2,
				spin: (i % 2 === 0 ? 1 : -1) * 0.4,
			})
		}

		let lastStep = -1
		const loop = () => {
			t += 0.016
			const W = innerWidth
			const H = innerHeight
			const s = stepRef.current
			const b = beatRef.current
			const en = energyRef.current
			const hs = hueRef.current
			const seqNow = seqRef.current
			const mutesNow = mutesRef.current
			const solosNow = solosRef.current

			// slower trail for denser afterimage field
			ctx.fillStyle = "rgba(17,17,27,0.14)"
			ctx.fillRect(0, 0, W, H)

			const anySolo = solosNow.some(Boolean)
			const activeHits = TRACKS.map((_, ti) => {
				if (mutesNow[ti]) return false
				if (anySolo && !solosNow[ti]) return false
				return seqNow[ti][s]
			})
			const kick = activeHits[0]
			const snare = activeHits[1]
			const hat = activeHits[2]
			const perc = activeHits[3]
			const liveCount = activeHits.filter(Boolean).length

			// deep vignette + radial energy well
			const well = ctx.createRadialGradient(
				W * 0.5,
				H * 0.42,
				20,
				W * 0.5,
				H * 0.42,
				Math.max(W, H) * 0.72,
			)
			well.addColorStop(
				0,
				`hsla(${190 + hs + (kick ? 20 : 0)}, 90%, 55%, ${0.12 + liveCount * 0.04 + en * 0.04})`,
			)
			well.addColorStop(0.35, `hsla(${260 + hs}, 70%, 40%, 0.06)`)
			well.addColorStop(1, "rgba(17,17,27,0)")
			ctx.fillStyle = well
			ctx.fillRect(0, 0, W, H)

			// subtle scan grid (tall field structure)
			ctx.save()
			ctx.strokeStyle = "rgba(137,180,250,0.045)"
			ctx.lineWidth = 1
			const gridY = 28
			for (let y = 0; y < H; y += gridY) {
				ctx.beginPath()
				ctx.moveTo(0, y + ((t * 18) % gridY))
				ctx.lineTo(W, y + ((t * 18) % gridY))
				ctx.stroke()
			}
			ctx.strokeStyle = "rgba(203,166,247,0.035)"
			for (let x = 0; x < W; x += 48) {
				ctx.beginPath()
				ctx.moveTo(x, 0)
				ctx.lineTo(x, H)
				ctx.stroke()
			}
			ctx.restore()

			// tall background EQ pillars (full-height density)
			const eqN = 72
			const eqW = W / eqN
			for (let i = 0; i < eqN; i++) {
				const liveBoost = activeHits[i % 4] ? 1.55 : 0.75
				const h =
					(H * 0.12 +
						Math.abs(Math.sin(t * 2.4 + i * 0.33 + b * 0.18)) * H * 0.38 +
						Math.abs(Math.sin(t * 5.1 + i * 0.9)) * H * 0.1) *
					en *
					liveBoost *
					(kick && i % 4 === 0 ? 1.25 : 1)
				const gx = i * eqW
				const grad = ctx.createLinearGradient(0, H, 0, H - h)
				grad.addColorStop(0, `hsla(${195 + hs + i * 2.2}, 85%, 48%, 0.22)`)
				grad.addColorStop(0.55, `hsla(${280 + hs + i}, 90%, 58%, 0.38)`)
				grad.addColorStop(1, `hsla(${330 + hs}, 95%, 70%, 0.55)`)
				ctx.fillStyle = grad
				ctx.fillRect(gx + 1, H - h, eqW - 2, h)
				// top glow cap
				ctx.fillStyle = `hsla(${200 + hs + i * 2}, 95%, 72%, ${0.18 + (liveBoost > 1 ? 0.2 : 0)})`
				ctx.fillRect(gx + 1, H - h - 2, eqW - 2, 3)
			}

			// spawn rings + particle bursts on step change
			if (s !== lastStep) {
				lastStep = s
				TRACKS.forEach((_tr, ti) => {
					if (!activeHits[ti]) return
					const bx = W * (0.15 + ti * 0.22)
					const by = H * (0.32 + (ti % 2) * 0.08)
					rings.push({
						x: bx,
						y: by,
						r: 10,
						a: 0.92,
						hue: 160 + hs + ti * 42,
						w: 3.2,
						spin: ti % 2 === 0 ? 1 : -1,
					})
					rings.push({
						x: bx,
						y: by,
						r: 4,
						a: 0.7,
						hue: 200 + hs + ti * 30,
						w: 1.6,
						spin: -1,
					})
					if (ti === 0) {
						rings.push({
							x: W * 0.5,
							y: H * 0.4,
							r: 28,
							a: 0.8,
							hue: 200 + hs,
							w: 4,
							spin: 1,
						})
						// radial spokes on kick
						for (let sp = 0; sp < 12; sp++) {
							const ang = (sp / 12) * Math.PI * 2 + t
							rings.push({
								x: W * 0.5 + Math.cos(ang) * 40,
								y: H * 0.4 + Math.sin(ang) * 28,
								r: 6,
								a: 0.55,
								hue: 140 + hs + sp * 8,
								w: 1.4,
								spin: 1,
							})
						}
					}
					// particle burst
					const burst = ti === 0 ? 28 : 14
					for (let p = 0; p < burst; p++) {
						const ang = Math.random() * Math.PI * 2
						const spd = 0.6 + Math.random() * 3.2 * en
						particles.push({
							x: bx,
							y: by,
							vx: Math.cos(ang) * spd,
							vy: Math.sin(ang) * spd - 0.4,
							life: 1,
							max: 0.7 + Math.random() * 0.5,
							hue: 150 + hs + ti * 40 + Math.random() * 40,
							sz: 1.2 + Math.random() * 3.5,
						})
					}
				})
				// continuous ambient sparkle top-up
				if (particles.length < 180) {
					for (let p = 0; p < 8; p++) {
						particles.push({
							x: Math.random() * W,
							y: H * (0.15 + Math.random() * 0.7),
							vx: (Math.random() - 0.5) * 0.8,
							vy: -0.2 - Math.random() * 0.6,
							life: 1,
							max: 0.5 + Math.random() * 0.5,
							hue: 180 + hs + Math.random() * 120,
							sz: 0.7 + Math.random() * 2,
						})
					}
				}
			}

			// multi-layer spectrum ribbons (tall vertical occupancy)
			const mids = [H * 0.28, H * 0.48, H * 0.62, H * 0.78]
			for (let layer = 0; layer < 5; layer++) {
				const midY = mids[layer % mids.length] + (layer > 3 ? H * 0.04 : 0)
				ctx.beginPath()
				const ampBase =
					(kick ? 110 : 34) * en * (1 - layer * 0.12) +
					(snare ? 48 : 0) +
					(hat ? 22 : 0) +
					(perc ? 28 : 0)
				for (let x = 0; x < W; x += 2) {
					const phase =
						x * 0.016 + b * 0.4 + layer * 0.7 + t * (1.1 + layer * 0.25)
					const y =
						midY +
						Math.sin(phase * 2.1) * ampBase * 0.55 +
						Math.sin(phase * 5.4 + s) * ampBase * 0.3 +
						Math.sin(phase * 11 + layer) * ampBase * 0.14 +
						Math.sin(phase * 17.5 + t) * ampBase * 0.06
					if (x === 0) ctx.moveTo(x, y)
					else ctx.lineTo(x, y)
				}
				ctx.strokeStyle = `hsla(${210 + hs + layer * 32}, 90%, ${68 - layer * 5}%, ${0.62 - layer * 0.08})`
				ctx.lineWidth = 2.8 - layer * 0.28
				ctx.shadowBlur = 16
				ctx.shadowColor = `hsla(${260 + hs + layer * 15}, 95%, 60%, 0.55)`
				ctx.stroke()
			}
			// mirrored ghost ribbons
			for (let layer = 0; layer < 2; layer++) {
				ctx.beginPath()
				const amp = (kick ? 70 : 20) * en * (1 - layer * 0.3)
				const midY = H * (0.72 + layer * 0.1)
				for (let x = 0; x < W; x += 3) {
					const phase = x * 0.02 + b * 0.35 + layer + t * 1.4
					const y =
						midY +
						Math.sin(phase * 2.2) * amp * 0.42 +
						Math.sin(phase * 6 + s) * amp * 0.22
					if (x === 0) ctx.moveTo(x, y)
					else ctx.lineTo(x, y)
				}
				ctx.strokeStyle = `hsla(${300 + hs + layer * 25}, 85%, 65%, ${0.38 - layer * 0.1})`
				ctx.lineWidth = 2 - layer * 0.4
				ctx.stroke()
			}
			ctx.shadowBlur = 0

			// concentric energy rings at stage center (always dense)
			const cx = W * 0.5
			const cy = H * 0.4
			for (let i = 0; i < 12; i++) {
				const pulse = kick ? 1.22 : snare ? 1.12 : hat ? 1.05 : 1
				const r =
					(24 + i * 38 + (b % 8) * 5 + Math.sin(t * 2.2 + i) * 10) *
					pulse *
					(0.88 + en * 0.22)
				ctx.strokeStyle = `hsla(${145 + hs + i * 16}, 80%, 62%, ${0.28 - i * 0.018})`
				ctx.lineWidth = kick && i < 3 ? 3.2 : 1.5
				ctx.beginPath()
				ctx.arc(cx, cy, r, 0, Math.PI * 2)
				ctx.stroke()
				// dashed outer orbit
				if (i % 2 === 0) {
					ctx.setLineDash([6, 10])
					ctx.strokeStyle = `hsla(${200 + hs + i * 12}, 70%, 70%, ${0.12 - i * 0.006})`
					ctx.beginPath()
					ctx.arc(cx, cy, r + 8, t + i, t + i + Math.PI * 1.4)
					ctx.stroke()
					ctx.setLineDash([])
				}
			}

			// radial energy beams on live hits
			if (liveCount > 0) {
				const beamN = 8 + liveCount * 2
				for (let i = 0; i < beamN; i++) {
					const ang = (i / beamN) * Math.PI * 2 + t * 0.35 + s * 0.2
					const len = (H * 0.22 + liveCount * 18) * en * (kick ? 1.3 : 1)
					ctx.strokeStyle = `hsla(${160 + hs + i * 18}, 90%, 65%, ${0.12 + liveCount * 0.03})`
					ctx.lineWidth = kick ? 2 : 1
					ctx.beginPath()
					ctx.moveTo(cx, cy)
					ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len)
					ctx.stroke()
				}
			}

			// hit rings expand
			for (let i = rings.length - 1; i >= 0; i--) {
				const r = rings[i]
				r.r += 5.2 * en
				r.a -= 0.016
				ctx.strokeStyle = `hsla(${r.hue}, 92%, 66%, ${r.a})`
				ctx.lineWidth = r.w
				ctx.shadowBlur = 22
				ctx.shadowColor = `hsla(${r.hue}, 100%, 60%, 0.75)`
				ctx.beginPath()
				ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2)
				ctx.stroke()
				// inner arc spin
				ctx.setLineDash([10, 14])
				ctx.lineWidth = 1.2
				ctx.beginPath()
				ctx.arc(r.x, r.y, r.r * 0.72, t * r.spin, t * r.spin + Math.PI)
				ctx.stroke()
				ctx.setLineDash([])
				if (r.a <= 0 || r.r > Math.max(W, H)) rings.splice(i, 1)
			}
			ctx.shadowBlur = 0

			// particles
			for (let i = particles.length - 1; i >= 0; i--) {
				const p = particles[i]
				p.x += p.vx * en
				p.y += p.vy * en
				p.vy += 0.012
				p.life -= 0.008
				const a = Math.max(0, p.life) * p.max
				ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${a})`
				ctx.shadowBlur = 8
				ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${a})`
				ctx.beginPath()
				ctx.arc(p.x, p.y, p.sz * (0.6 + a), 0, Math.PI * 2)
				ctx.fill()
				// short trail
				ctx.strokeStyle = `hsla(${p.hue}, 90%, 65%, ${a * 0.45})`
				ctx.lineWidth = 1
				ctx.beginPath()
				ctx.moveTo(p.x, p.y)
				ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4)
				ctx.stroke()
				if (p.life <= 0 || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
					particles.splice(i, 1)
				}
			}
			ctx.shadowBlur = 0

			// keep ambient particle floor
			while (particles.length < 100) {
				particles.push({
					x: Math.random() * W,
					y: Math.random() * H,
					vx: (Math.random() - 0.5) * 0.5,
					vy: (Math.random() - 0.5) * 0.5 - 0.1,
					life: 0.5 + Math.random() * 0.5,
					max: 0.4 + Math.random() * 0.4,
					hue: 170 + hs + Math.random() * 130,
					sz: 0.6 + Math.random() * 1.8,
				})
			}

			// bottom step playhead strip — thicker dual band
			const stripH = 16
			for (let i = 0; i < STEPS; i++) {
				const x = (i / STEPS) * W
				const w = W / STEPS
				const isPlay = i === s
				const armed = TRACKS.some(
					(_, ti) =>
						seqNow[ti][i] &&
						!mutesNow[ti] &&
						!(anySolo && !solosNow[ti]),
				)
				ctx.fillStyle = isPlay
					? `hsla(${140 + hs}, 90%, 65%, 0.98)`
					: armed
						? `hsla(${200 + hs}, 80%, 60%, 0.35)`
						: i % 4 === 0
							? "rgba(255,255,255,0.18)"
							: "rgba(255,255,255,0.07)"
				ctx.fillRect(x + 1, H - stripH - 8, w - 2, stripH)
				if (isPlay) {
					ctx.shadowBlur = 32
					ctx.shadowColor = `hsla(${140 + hs}, 100%, 60%, 0.95)`
					ctx.fillRect(x + 1, H - stripH - 8, w - 2, stripH)
					ctx.shadowBlur = 0
				}
			}
			// secondary micro-strip above
			for (let i = 0; i < STEPS * 2; i++) {
				const x = (i / (STEPS * 2)) * W
				const w = W / (STEPS * 2)
				ctx.fillStyle =
					Math.floor(i / 2) === s
						? `hsla(${160 + hs}, 90%, 70%, 0.55)`
						: "rgba(255,255,255,0.04)"
				ctx.fillRect(x + 0.5, H - stripH - 22, w - 1, 5)
			}

			// vertical playhead beam — full height, multi-core
			const px = ((s + 0.5) / STEPS) * W
			const pg = ctx.createLinearGradient(px, 0, px, H)
			pg.addColorStop(0, `hsla(${140 + hs}, 90%, 65%, 0.1)`)
			pg.addColorStop(0.15, `hsla(${140 + hs}, 90%, 65%, 0.28)`)
			pg.addColorStop(0.5, `hsla(${140 + hs}, 95%, 72%, 0.62)`)
			pg.addColorStop(0.85, `hsla(${140 + hs}, 90%, 65%, 0.28)`)
			pg.addColorStop(1, `hsla(${140 + hs}, 90%, 65%, 0.1)`)
			ctx.fillStyle = pg
			ctx.fillRect(px - 5, 0, 10, H)
			ctx.shadowBlur = 28
			ctx.shadowColor = `hsla(${140 + hs}, 100%, 60%, 0.8)`
			ctx.fillStyle = `hsla(${140 + hs}, 95%, 75%, 0.9)`
			ctx.fillRect(px - 1.5, 0, 3, H)
			ctx.shadowBlur = 0
			// side ticks along beam
			for (let y = 0; y < H; y += 22) {
				ctx.fillStyle = `hsla(${140 + hs}, 90%, 70%, 0.25)`
				ctx.fillRect(px - 10, y, 7, 1.5)
				ctx.fillRect(px + 3, y + 11, 7, 1.5)
			}

			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)
		window.addEventListener("resize", resize)
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener("resize", resize)
		}
	}, [])

	// dedicated wave-view canvas (fills panel)
	useEffect(() => {
		const c = waveRef.current
		if (!c || view !== "wave") return
		const ctx = c.getContext("2d")
		if (!ctx) return
		let raf = 0
		let t = 0
		const dpr = Math.min(devicePixelRatio, 1.5)
		const resize = () => {
			const r = c.getBoundingClientRect()
			c.width = r.width * dpr
			c.height = r.height * dpr
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		}
		resize()
		const ro = new ResizeObserver(resize)
		ro.observe(c)
		const loop = () => {
			t += 0.016
			const r = c.getBoundingClientRect()
			const W = r.width
			const H = r.height
			const s = stepRef.current
			const b = beatRef.current
			const en = energyRef.current
			const hs = hueRef.current
			const seqNow = seqRef.current
			const mutesNow = mutesRef.current
			const solosNow = solosRef.current
			const anySolo = solosNow.some(Boolean)
			const active = TRACKS.map(
				(_, ti) =>
					seqNow[ti][s] &&
					!mutesNow[ti] &&
					!(anySolo && !solosNow[ti]),
			)

			ctx.fillStyle = "rgba(10,10,18,0.35)"
			ctx.fillRect(0, 0, W, H)

			// multi-stem oscilloscope stacked full height
			TRACKS.forEach((tr, ti) => {
				const rowH = H / 4
				const mid = rowH * ti + rowH * 0.5
				const live = active[ti]
				const amp = (live ? 28 : 8) * en
				ctx.beginPath()
				for (let x = 0; x < W; x += 2) {
					const phase = x * 0.04 + b * 0.5 + ti * 1.7 + t * 2
					const y =
						mid +
						Math.sin(phase * (1.5 + ti * 0.4)) * amp +
						Math.sin(phase * 4.2) * amp * 0.35
					if (x === 0) ctx.moveTo(x, y)
					else ctx.lineTo(x, y)
				}
				ctx.strokeStyle = live ? tr.color : `${tr.color}55`
				ctx.lineWidth = live ? 2.4 : 1.2
				ctx.shadowBlur = live ? 14 : 0
				ctx.shadowColor = tr.color
				ctx.stroke()
				ctx.shadowBlur = 0

				// stem label bar
				ctx.fillStyle = live ? tr.color : `${tr.color}44`
				ctx.fillRect(0, rowH * ti, 4, rowH)
			})

			// playhead
			const px = ((s + 0.5) / STEPS) * W
			ctx.fillStyle = `hsla(${140 + hs}, 90%, 70%, 0.7)`
			ctx.fillRect(px - 1, 0, 2, H)
			ctx.fillStyle = `hsla(${140 + hs}, 90%, 70%, 0.12)`
			ctx.fillRect(px - 12, 0, 24, H)

			// FFT-style bars across bottom third
			const barN = 48
			for (let i = 0; i < barN; i++) {
				const liveBoost = active[i % 4] ? 1.6 : 0.7
				const h =
					(6 +
						Math.abs(Math.sin(t * 3 + i * 0.4 + b * 0.2)) * 40 +
						(i % 7) * 2) *
					en *
					liveBoost
				const bw = W / barN
				const grad = ctx.createLinearGradient(0, H, 0, H - h)
				grad.addColorStop(0, `hsla(${200 + hs + i * 3}, 80%, 55%, 0.9)`)
				grad.addColorStop(1, `hsla(${320 + hs}, 85%, 65%, 0.95)`)
				ctx.fillStyle = grad
				ctx.fillRect(i * bw + 1, H - h, bw - 2, h)
			}

			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)
		return () => {
			cancelAnimationFrame(raf)
			ro.disconnect()
		}
	}, [view])

	// prune pad rings
	useEffect(() => {
		if (!padRings.length) return
		const id = window.setInterval(() => {
			setPadRings((rs) => rs.filter((r) => Date.now() - r.t < 700))
		}, 80)
		return () => clearInterval(id)
	}, [padRings.length])

	const toggleCell = (ti: number, si: number) => {
		setSeq((s) =>
			s.map((row, r) =>
				r === ti ? row.map((v, c) => (c === si ? !v : v)) : row,
			),
		)
		setHits((h) => h + 1)
	}

	const padHit = (ti: number) => {
		setSeq((s) =>
			s.map((row, r) =>
				r === ti ? row.map((v, c) => (c === step ? true : v)) : row,
			),
		)
		setHits((h) => h + 1)
		setHueShift((h) => (h + 17) % 360)
		setPadRings((rs) => [
			...rs.slice(-12),
			{ id: Date.now() + ti, ti, t: Date.now() },
		])
		setFlash((f) => f + 1)
	}

	const anySolo = solos.some(Boolean)

	return (
		<LandingsShell className="bg-[#11111b] text-text">
			<canvas ref={canvasRef} className="fixed inset-0 z-0" />
			<div
				className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-100"
				style={{
					opacity: 0.62 + (flash % 2) * 0.1,
					background: `
						radial-gradient(circle at 50% 42%, hsl(${(160 + hueShift + step * 8) % 360} 80% 52% / ${0.18 + energy * 0.12}), transparent 52%),
						radial-gradient(ellipse 80% 40% at 50% 100%, hsl(${(220 + hueShift) % 360} 70% 45% / 0.12), transparent 60%),
						radial-gradient(circle at 15% 30%, hsl(${(280 + hueShift) % 360} 75% 50% / 0.08), transparent 35%),
						radial-gradient(circle at 85% 35%, hsl(${(190 + hueShift) % 360} 80% 55% / 0.08), transparent 35%)
					`,
				}}
			/>

			<div className="relative z-10 mx-auto flex min-h-dvh max-w-wide flex-col justify-between gap-2 px-4 pt-14 pb-4 sm:gap-3 sm:px-8 sm:pt-16 sm:pb-5">
				<div className="flex flex-wrap items-end justify-between gap-2">
					<div>
						<p className="text-green text-[0.65rem] font-black tracking-[0.35em] uppercase">
							Pulse · {bpm} BPM · step {step + 1}/{STEPS} · hits {hits}
						</p>
						<h1 className="mt-0.5 text-[clamp(1.45rem,4.2vw,2.55rem)] leading-[1.05] font-thin tracking-tight">
							Rhythm without{" "}
							<span className="text-subtext-0">speakers.</span>
						</h1>
					</div>
					<div className="flex flex-wrap gap-1.5">
						{(["seq", "wave", "pads"] as const).map((v) => (
							<button
								key={v}
								type="button"
								onClick={() => setView(v)}
								className={cn(
									"cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.6rem] font-black tracking-widest uppercase",
									view === v
										? "border-green bg-green/15 text-green shadow-[0_0_20px_rgba(166,227,161,0.25)]"
										: "border-white/15 text-white/55",
								)}
							>
								{v}
							</button>
						))}
					</div>
				</div>

				{/* tall equalizer + dual playhead — dramatic first-paint mid band */}
				<div className="relative flex h-[min(26vh,220px)] items-end gap-px overflow-hidden rounded-xl border border-white/10 bg-black/35 px-1 pt-2 shadow-[inset_0_-40px_80px_rgba(137,180,250,0.08),0_0_40px_rgba(203,166,247,0.08)] sm:h-[min(28vh,240px)] sm:gap-[2px] sm:px-1.5">
					{/* floor glow */}
					<div
						className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-70"
						style={{
							background: `linear-gradient(to top, hsl(${200 + hueShift} 80% 50% / 0.18), transparent)`,
						}}
					/>
					{/* playhead beam across EQ — full height */}
					<div
						className="pointer-events-none absolute inset-y-0 z-10 w-1.5 bg-green shadow-[0_0_28px_rgba(166,227,161,1)] transition-[left] duration-75"
						style={{ left: `calc(${((step + 0.5) / STEPS) * 100}% - 3px)` }}
					/>
					<div
						className="pointer-events-none absolute inset-y-0 z-[9] w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-green/20 to-transparent transition-[left] duration-75"
						style={{ left: `${((step + 0.5) / STEPS) * 100}%` }}
					/>
					{/* mirrored reflection ghost strip */}
					<div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[28%] scale-y-[-1] opacity-35 blur-[0.5px]">
						<div className="flex h-full items-end gap-px px-1 sm:gap-[2px] sm:px-1.5">
							{Array.from({ length: Math.min(bars, 64) }).map((_, i) => {
								const phase = (beat + i * 2) % 8
								const h = 18 + ((i * 17 + phase * 23) % 70)
								return (
									<div
										key={`eq-ref-${i}`}
										className="min-w-0 flex-1 rounded-t-sm"
										style={{
											height: `${h * energy * 0.45}%`,
											background: `linear-gradient(to top, hsl(${210 + hueShift + i * 4} 80% 50% / 0.5), transparent)`,
										}}
									/>
								)
							})}
						</div>
					</div>
					{Array.from({ length: bars }).map((_, i) => {
						const phase = (beat + i) % 8
						const trackBoost =
							seq[i % 4][step] &&
							!mutes[i % 4] &&
							!(anySolo && !solos[i % 4])
								? 1.75
								: 1
						const h =
							(28 + ((i * 19 + phase * 29) % 92)) * energy * trackBoost
						const on = phase < 5 || (step === i % STEPS && phase < 7)
						const isPlayCol = Math.floor((i / bars) * STEPS) === step
						return (
							<motion.div
								key={i}
								animate={{
									height: on
										? `${Math.min(100, h)}%`
										: `${12 * energy}%`,
									opacity: on ? 1 : 0.38,
								}}
								transition={{ type: "spring", stiffness: 520, damping: 24 }}
								className="relative z-[6] min-w-0 flex-1 rounded-t-sm"
								style={{
									background: `linear-gradient(to top, hsl(${195 + hueShift + i * 2.4} 90% 48%), hsl(${280 + hueShift + (i % 20)} 88% 60%), hsl(${330 + hueShift} 90% 72%))`,
									boxShadow: isPlayCol
										? `0 0 20px hsl(${200 + hueShift} 95% 60% / 0.85), 0 0 8px hsl(${320 + hueShift} 90% 65% / 0.5)`
										: on
											? `0 0 6px hsl(${220 + hueShift} 80% 55% / 0.35)`
											: undefined,
								}}
							/>
						)
					})}
				</div>

				{/* main view — sequencer / wave / pads fill remaining column */}
				<div className="min-h-0 flex-1">
					{view === "seq" && (
						<div className="relative space-y-1 rounded-2xl border border-white/8 bg-black/25 p-1.5 sm:space-y-1.5 sm:p-2.5">
							{/* step numbers + full-width playhead guide */}
							<div className="relative flex items-center gap-2">
								<div className="w-14 shrink-0 sm:w-20" />
								<div className="relative grid flex-1 grid-cols-8 gap-0.5 sm:grid-cols-[repeat(16,minmax(0,1fr))] sm:gap-1">
									{/* DOM playhead column highlight behind step labels */}
									<div
										className="pointer-events-none absolute inset-y-[-2px] z-0 rounded-sm bg-green/15 ring-1 ring-green/40 transition-[left,width] duration-75"
										style={{
											left: `calc(${(step / STEPS) * 100}% + 1px)`,
											width: `calc(${100 / STEPS}% - 2px)`,
										}}
									/>
									{Array.from({ length: STEPS }).map((_, si) => (
										<div
											key={si}
											className={cn(
												"relative z-[1] text-center font-mono text-[0.5rem]",
												si === step
													? "text-green font-bold"
													: si % 4 === 0
														? "text-white/45"
														: "text-white/22",
											)}
										>
											{si + 1}
										</div>
									))}
								</div>
							</div>
							{TRACKS.map((t, ti) => {
								const muted = mutes[ti]
								const solo = solos[ti]
								const dead = muted || (anySolo && !solo)
								const liveNow =
									seq[ti][step] && !dead
								return (
									<div key={t.id} className="flex items-center gap-1.5 sm:gap-2">
										<div className="flex w-14 shrink-0 items-center gap-1 sm:w-20 sm:flex-col sm:items-start sm:gap-0.5">
											<span
												className="text-[0.55rem] font-black tracking-[0.14em] sm:text-[0.62rem]"
												style={{
													color: t.color,
													textShadow: liveNow
														? `0 0 14px ${t.color}`
														: undefined,
												}}
											>
												{t.label}
											</span>
											<div className="flex gap-0.5">
												<button
													type="button"
													onClick={() =>
														setMutes((m) =>
															m.map((v, i) => (i === ti ? !v : v)),
														)
													}
													className={cn(
														"cursor-pointer rounded px-1 py-0.5 font-mono text-[0.45rem]",
														muted
															? "bg-red/30 text-red"
															: "bg-white/10 text-white/50",
													)}
												>
													M
												</button>
												<button
													type="button"
													onClick={() =>
														setSolos((s) =>
															s.map((v, i) => (i === ti ? !v : v)),
														)
													}
													className={cn(
														"cursor-pointer rounded px-1 py-0.5 font-mono text-[0.45rem]",
														solo
															? "bg-yellow/30 text-yellow"
															: "bg-white/10 text-white/50",
													)}
												>
													S
												</button>
											</div>
										</div>
										<div className="relative grid flex-1 grid-cols-8 gap-0.5 sm:grid-cols-[repeat(16,minmax(0,1fr))] sm:gap-1">
											{/* per-row playhead ghost */}
											<div
												className="pointer-events-none absolute inset-y-0 z-0 rounded-sm bg-green/10 transition-[left,width] duration-75"
												style={{
													left: `calc(${(step / STEPS) * 100}%)`,
													width: `${100 / STEPS}%`,
												}}
											/>
											{seq[ti].map((on, si) => (
												<button
													key={si}
													type="button"
													onClick={() => toggleCell(ti, si)}
													className={cn(
														"relative z-[1] aspect-square cursor-pointer rounded-sm border transition sm:aspect-auto sm:h-8",
														si === step &&
															"ring-2 ring-green shadow-[0_0_14px_rgba(166,227,161,0.65)]",
														on && !dead
															? "border-transparent"
															: "border-white/10 bg-white/5 hover:bg-white/10",
														dead && on && "opacity-30",
														si % 4 === 0 && !on && "bg-white/[0.07]",
													)}
													style={{
														background:
															on && !dead
																? si === step
																	? t.color
																	: `${t.color}cc`
																: undefined,
														boxShadow:
															on && si === step && !dead
																? `0 0 22px ${t.color}`
																: on && !dead
																	? `0 0 8px ${t.color}55`
																	: undefined,
													}}
												/>
											))}
										</div>
									</div>
								)
							})}
						</div>
					)}

					{view === "wave" && (
						<div className="relative h-[min(36vh,300px)] overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)] backdrop-blur">
							<canvas ref={waveRef} className="absolute inset-0 size-full" />
							<div className="pointer-events-none absolute top-3 left-4 z-10 flex gap-3">
								{TRACKS.map((t, ti) => {
									const live =
										seq[ti][step] &&
										!mutes[ti] &&
										!(anySolo && !solos[ti])
									return (
										<span
											key={t.id}
											className="rounded-full px-2 py-0.5 font-mono text-[0.55rem] tracking-widest uppercase"
											style={{
												color: t.color,
												background: live ? `${t.color}33` : "transparent",
												boxShadow: live ? `0 0 12px ${t.color}66` : undefined,
											}}
										>
											{t.label}
										</span>
									)
								})}
							</div>
							<p className="pointer-events-none absolute right-4 bottom-3 font-mono text-[0.55rem] tracking-widest text-white/40 uppercase">
								stem oscilloscope · step {step + 1}
							</p>
						</div>
					)}

					{view === "pads" && (
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
							{TRACKS.map((t, ti) => {
								const live =
									seq[ti][step] &&
									!mutes[ti] &&
									!(anySolo && !solos[ti])
								const rings = padRings.filter((r) => r.ti === ti)
								return (
									<button
										key={t.id}
										type="button"
										onClick={() => padHit(ti)}
										className="relative flex h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 transition active:scale-[0.96] sm:h-44"
										style={{
											background: live
												? `radial-gradient(circle at 50% 50%, ${t.color}55, ${t.color}18 55%, rgba(0,0,0,0.3))`
												: "radial-gradient(circle at 50% 60%, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
											boxShadow: live
												? `0 0 50px ${t.color}66, inset 0 0 30px ${t.color}22`
												: "inset 0 0 20px rgba(0,0,0,0.3)",
										}}
									>
										{/* hit feedback rings */}
										{rings.map((r) => (
											<span
												key={r.id}
												className="pointer-events-none absolute inset-0 flex items-center justify-center"
											>
												<span
													className="absolute size-16 animate-ping rounded-full opacity-60"
													style={{
														border: `2px solid ${t.color}`,
														boxShadow: `0 0 24px ${t.color}`,
														animationDuration: "0.65s",
													}}
												/>
												<span
													className="absolute size-28 rounded-full opacity-40"
													style={{
														border: `1px solid ${t.color}`,
														boxShadow: `0 0 40px ${t.color}88`,
														animation: "pulse 0.6s ease-out",
													}}
												/>
											</span>
										))}
										<span
											className="relative z-10 text-xl font-black tracking-[0.3em] sm:text-2xl"
											style={{
												color: t.color,
												textShadow: live
													? `0 0 20px ${t.color}`
													: undefined,
											}}
										>
											{t.label}
										</span>
										<span className="text-subtext-0 relative z-10 mt-2 text-[0.6rem] tracking-widest uppercase">
											{live ? "● live" : "tap to arm"}
										</span>
										{/* velocity arc */}
										<svg
											className="pointer-events-none absolute inset-2 opacity-30"
											viewBox="0 0 100 100"
										>
											<circle
												cx="50"
												cy="50"
												r="46"
												fill="none"
												stroke={t.color}
												strokeWidth="0.8"
												strokeDasharray={live ? "40 8" : "4 12"}
												className={live ? "origin-center animate-spin" : ""}
												style={{
													animationDuration: "8s",
												}}
											/>
										</svg>
									</button>
								)
							})}
						</div>
					)}
				</div>

				{/* transport — stays above fold */}
				<div className="mt-2 flex flex-col gap-2">
					<div className="flex flex-wrap items-center gap-1.5">
						<button
							type="button"
							onClick={() => setRunning((r) => !r)}
							className="bg-green text-crust cursor-pointer rounded-full px-5 py-2 text-sm font-black shadow-[0_0_24px_rgba(166,227,161,0.35)]"
						>
							{running ? "Pause" : "Play"}
						</button>
						<button
							type="button"
							onClick={() => {
								setBeat((b) => b + 4)
								setEnergy((e) => Math.min(2.2, e + 0.25))
								setHits((h) => h + 1)
								setFlash((f) => f + 1)
							}}
							className="cursor-pointer rounded-full border border-pink/40 bg-pink/15 px-5 py-2 text-sm font-black text-pink"
						>
							Drop
						</button>
						<button
							type="button"
							onClick={() => {
								setSeq(defaultSeq())
								setMutes(TRACKS.map(() => false))
								setSolos(TRACKS.map(() => false))
							}}
							className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-[0.65rem] font-black tracking-widest text-white/60 uppercase"
						>
							Preset
						</button>
						<button
							type="button"
							onClick={() =>
								setSeq((s) =>
									s.map((row) => row.map(() => Math.random() > 0.72)),
								)
							}
							className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-[0.65rem] font-black tracking-widest text-white/60 uppercase"
						>
							Random
						</button>
						<button
							type="button"
							onClick={() =>
								setSeq((s) => s.map((row) => row.map(() => false)))
							}
							className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-[0.65rem] font-black tracking-widest text-white/60 uppercase"
						>
							Clear
						</button>
						<button
							type="button"
							onClick={() => setBeat(0)}
							className="cursor-pointer rounded-full border border-white/15 px-4 py-2 text-[0.65rem] font-black tracking-widest text-white/60 uppercase"
						>
							Reset pos
						</button>
					</div>
					<div className="flex max-w-laptop flex-wrap items-center gap-4">
						<label className="text-subtext-0 flex items-center gap-2 text-xs">
							BPM
							<input
								type="range"
								min={70}
								max={180}
								value={bpm}
								onChange={(e) => setBpm(Number(e.target.value))}
								className="w-28 accent-[var(--catpuccin-green)]"
							/>
							<span className="w-10 font-mono">{bpm}</span>
						</label>
						<label className="text-subtext-0 flex items-center gap-2 text-xs">
							Swing
							<input
								type="range"
								min={0}
								max={1}
								step={0.05}
								value={swing}
								onChange={(e) => setSwing(Number(e.target.value))}
								className="w-24 accent-[var(--catpuccin-mauve)]"
							/>
						</label>
						<label className="text-subtext-0 flex items-center gap-2 text-xs">
							Energy
							<input
								type="range"
								min={0.4}
								max={2.2}
								step={0.1}
								value={energy}
								onChange={(e) => setEnergy(Number(e.target.value))}
								className="w-24 accent-[var(--catpuccin-pink)]"
							/>
						</label>
						<label className="text-subtext-0 flex items-center gap-2 text-xs">
							Hue
							<input
								type="range"
								min={0}
								max={360}
								value={hueShift}
								onChange={(e) => setHueShift(Number(e.target.value))}
								className="w-28 accent-[var(--catpuccin-sapphire)]"
							/>
						</label>
					</div>
				</div>
			</div>
		</LandingsShell>
	)
}

/* ═══════════════════════════════════════════════════════════
   9 — PRISM  ·  full-viewport spectral instrument
═══════════════════════════════════════════════════════════ */
export function PrismLanding() {
	const [hue, setHue] = useState(300)
	const [solo, setSolo] = useState<number | null>(null)
	const [dispersion, setDispersion] = useState(1.15)
	const [shatter, setShatter] = useState(false)
	const [locked, setLocked] = useState<number[]>([])
	const [mode, setMode] = useState<"split" | "combine" | "diffract">("split")
	const [beam, setBeam] = useState(true)
	const [plays, setPlays] = useState(0)
	const [keyBursts, setKeyBursts] = useState<
		{ id: number; i: number; h: number; t: number }[]
	>([])
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const hueRef = useRef(hue)
	const soloRef = useRef(solo)
	const modeRef = useRef(mode)
	const beamRef = useRef(beam)
	const dispRef = useRef(dispersion)
	const shatterRef = useRef(shatter)
	const lockedRef = useRef(locked)
	const burstsRef = useRef(keyBursts)
	const { sx, sy, x: mx, y: my } = useSmoothPointer()
	const glowX = useTransform(sx, (v) => v)
	const glowY = useTransform(sy, (v) => v)
	const prismRot = useTransform(sx, [0, 1600], [-18, 18])

	hueRef.current = hue
	soloRef.current = solo
	modeRef.current = mode
	beamRef.current = beam
	dispRef.current = dispersion
	shatterRef.current = shatter
	lockedRef.current = locked
	burstsRef.current = keyBursts

	const bands = useMemo(() => {
		const labels = ["R", "O", "Y", "G", "C", "B", "I", "V", "P", "M", "K", "W"]
		return Array.from({ length: 12 }, (_, i) => ({
			h: (hue + i * 12 * dispersion) % 360,
			label: labels[i],
			gain: locked.includes(i) ? 1.25 : solo === i ? 1.45 : 1,
		}))
	}, [hue, dispersion, solo, locked])

	// dense caustics / spectral field — continuous motion (Pass U denser first paint)
	useEffect(() => {
		const c = canvasRef.current
		if (!c) return
		const ctx = c.getContext("2d")
		if (!ctx) return
		let raf = 0
		let t = 0
		const dpr = Math.min(devicePixelRatio, 1.75)
		const resize = () => {
			c.width = innerWidth * dpr
			c.height = innerHeight * dpr
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		}
		resize()

		type Speck = {
			x: number
			y: number
			vx: number
			vy: number
			h: number
			r: number
			a: number
			trail: number
		}
		// EE2 — denser spectral particle field on first paint
		const specks: Speck[] = Array.from({ length: 580 }, () => ({
			x: Math.random() * innerWidth,
			y: Math.random() * innerHeight,
			vx: (Math.random() - 0.5) * 0.8,
			vy: (Math.random() - 0.5) * 0.55,
			h: Math.random() * 360,
			r: 0.85 + Math.random() * 4.2,
			a: 0.34 + Math.random() * 0.64,
			trail: Math.random() > 0.65 ? 1 : 0,
		}))

		// dense spectral first paint (no black flash) — EE2 max density on frame 0
		{
			const W0 = innerWidth
			const H0 = innerHeight
			const h0 = hueRef.current
			const d0 = dispRef.current
			const band0 = (i: number) => (h0 + i * 12 * d0) % 360
			ctx.fillStyle = "#11111b"
			ctx.fillRect(0, 0, W0, H0)
			// multi-row full-frame spectrum wash
			for (let i = 0; i < 12; i++) {
				const bh = band0(i)
				const gx = W0 * (0.06 + i * 0.08)
				for (const gy of [H0 * 0.26, H0 * 0.4, H0 * 0.54, H0 * 0.68]) {
					const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 220)
					g.addColorStop(0, `hsla(${bh}, 95%, 64%, 0.3)`)
					g.addColorStop(0.5, `hsla(${bh}, 90%, 48%, 0.1)`)
					g.addColorStop(1, "transparent")
					ctx.fillStyle = g
					ctx.fillRect(0, 0, W0, H0)
				}
			}
			// vertical spectrum bars (piano silhouette wash) — stronger
			for (let i = 0; i < 12; i++) {
				const bh = band0(i)
				const x0 = (i / 12) * W0
				const bar = ctx.createLinearGradient(x0, H0 * 0.24, x0, H0 * 0.94)
				bar.addColorStop(0, `hsla(${bh}, 90%, 55%, 0.0)`)
				bar.addColorStop(0.3, `hsla(${bh}, 95%, 60%, 0.24)`)
				bar.addColorStop(0.7, `hsla(${bh}, 80%, 42%, 0.16)`)
				bar.addColorStop(1, "transparent")
				ctx.fillStyle = bar
				ctx.fillRect(x0, H0 * 0.24, W0 / 12 + 2, H0 * 0.7)
			}
			// caustic floor first paint — denser rows + secondary phase
			for (let row = 0; row < 16; row++) {
				ctx.beginPath()
				for (let x = 0; x <= W0; x += 3) {
					const y =
						H0 * 0.46 +
						row * 18 +
						Math.sin(x * 0.014 + row) * 18 +
						Math.sin(x * 0.032 + row * 1.2) * 12 +
						Math.cos(x * 0.008 + row * 0.5) * 8
					if (x === 0) ctx.moveTo(x, y)
					else ctx.lineTo(x, y)
				}
				const ch = band0(row % 12)
				ctx.strokeStyle = `hsla(${ch}, 92%, 66%, ${0.3 - row * 0.014})`
				ctx.lineWidth = 2.9
				ctx.shadowBlur = 24
				ctx.shadowColor = `hsla(${ch}, 100%, 60%, 0.68)`
				ctx.stroke()
			}
			// caustic fill ellipses first paint
			for (let i = 0; i < 28; i++) {
				const cx = ((i * 97) % W0) + 16
				const cy = H0 * 0.52 + ((i * 41) % 150)
				const bh = band0(i % 12)
				const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 95)
				rg.addColorStop(0, `hsla(${bh}, 95%, 74%, 0.28)`)
				rg.addColorStop(0.5, `hsla(${bh}, 90%, 55%, 0.12)`)
				rg.addColorStop(1, "transparent")
				ctx.fillStyle = rg
				ctx.beginPath()
				ctx.ellipse(cx, cy, 72, 26, (i % 5) * 0.2, 0, Math.PI * 2)
				ctx.fill()
			}
			ctx.shadowBlur = 0
			// beam first paint — triple-pass rays (halo + glow + core)
			const cx0 = W0 * 0.26
			const cy0 = H0 * 0.4
			// incident double
			const ib0 = ctx.createLinearGradient(0, cy0 - 30, cx0, cy0)
			ib0.addColorStop(0, "rgba(255,255,255,0)")
			ib0.addColorStop(0.45, "rgba(255,255,255,0.55)")
			ib0.addColorStop(1, "rgba(255,255,255,0.92)")
			ctx.strokeStyle = ib0
			ctx.lineWidth = 5.5
			ctx.shadowBlur = 26
			ctx.shadowColor = "rgba(255,255,255,0.9)"
			ctx.beginPath()
			ctx.moveTo(0, cy0 - 18)
			ctx.lineTo(cx0, cy0)
			ctx.stroke()
			ctx.strokeStyle = "rgba(255,255,255,0.22)"
			ctx.lineWidth = 2
			ctx.beginPath()
			ctx.moveTo(0, cy0 - 6)
			ctx.lineTo(cx0 - 2, cy0 + 4)
			ctx.stroke()
			for (let i = 0; i < 12; i++) {
				const bh = band0(i)
				const spread = (i - 5.5) * 5.4 * d0
				// outer halo
				ctx.strokeStyle = `hsla(${bh}, 95%, 66%, 0.18)`
				ctx.lineWidth = 16
				ctx.shadowBlur = 32
				ctx.shadowColor = `hsla(${bh}, 100%, 60%, 0.55)`
				ctx.beginPath()
				ctx.moveTo(cx0, cy0)
				ctx.lineTo(W0 * 0.97, cy0 + spread * 9.2)
				ctx.stroke()
				// soft glow pass
				ctx.strokeStyle = `hsla(${bh}, 95%, 66%, 0.32)`
				ctx.lineWidth = 10
				ctx.shadowBlur = 28
				ctx.beginPath()
				ctx.moveTo(cx0, cy0)
				ctx.lineTo(W0 * 0.97, cy0 + spread * 9.2)
				ctx.stroke()
				// core pass
				ctx.strokeStyle = `hsla(${bh}, 98%, 72%, 0.78)`
				ctx.lineWidth = 3.4
				ctx.shadowBlur = 16
				ctx.beginPath()
				ctx.moveTo(cx0, cy0)
				ctx.lineTo(W0 * 0.97, cy0 + spread * 9.2)
				ctx.stroke()
				// tip spark
				ctx.fillStyle = `hsla(${bh}, 100%, 82%, 0.85)`
				ctx.beginPath()
				ctx.arc(W0 * 0.97, cy0 + spread * 9.2, 3.2, 0, Math.PI * 2)
				ctx.fill()
			}
			// seed particles on first paint so field isn't empty
			for (const sp of specks) {
				ctx.fillStyle = `hsla(${band0(Math.floor((sp.x / W0) * 12) % 12)}, 92%, 72%, ${sp.a * 0.9})`
				ctx.shadowBlur = 5
				ctx.shadowColor = `hsla(${sp.h}, 100%, 60%, 0.4)`
				ctx.beginPath()
				ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2)
				ctx.fill()
			}
			// prism body first paint — larger faceted
			const p0 = ctx.createLinearGradient(cx0 - 44, cy0 - 50, cx0 + 44, cy0 + 38)
			p0.addColorStop(0, "rgba(255,255,255,0.16)")
			p0.addColorStop(0.5, `hsla(${h0}, 60%, 70%, 0.12)`)
			p0.addColorStop(1, "rgba(255,255,255,0.05)")
			ctx.fillStyle = p0
			ctx.strokeStyle = "rgba(255,255,255,0.55)"
			ctx.lineWidth = 1.6
			ctx.shadowBlur = 30
			ctx.shadowColor = `hsla(${h0}, 90%, 60%, 0.8)`
			ctx.beginPath()
			ctx.moveTo(cx0, cy0 - 48)
			ctx.lineTo(cx0 + 44, cy0 + 36)
			ctx.lineTo(cx0 - 44, cy0 + 36)
			ctx.closePath()
			ctx.fill()
			ctx.stroke()
			ctx.strokeStyle = "rgba(255,255,255,0.6)"
			ctx.lineWidth = 1
			ctx.beginPath()
			ctx.moveTo(cx0, cy0 - 48)
			ctx.lineTo(cx0 + 10, cy0 + 12)
			ctx.stroke()
			ctx.shadowBlur = 0
		}

		const loop = () => {
			t += 0.014
			const W = innerWidth
			const H = innerHeight
			const curHue = hueRef.current
			const curSolo = soloRef.current
			const curMode = modeRef.current
			const curBeam = beamRef.current
			const curDisp = dispRef.current
			const curShatter = shatterRef.current
			const curLocked = lockedRef.current
			const bandH = (i: number) => (curHue + i * 12 * curDisp) % 360
			const activeHue = curSolo !== null ? bandH(curSolo) : curHue
			const px = mx.get() || W * 0.5
			const py = my.get() || H * 0.4

			ctx.fillStyle =
				curMode === "combine"
					? "rgba(17,17,27,0.1)"
					: curMode === "diffract"
						? "rgba(12,10,22,0.12)"
						: "rgba(17,17,27,0.11)"
			ctx.fillRect(0, 0, W, H)

			// dense rainbow ambient orbs following pointer (EE2)
			const fieldN = curMode === "diffract" ? 36 : 32
			for (let i = 0; i < fieldN; i++) {
				const bh = bandH(i % 12)
				const ox = Math.sin(t * 0.9 + i * 0.7) * 90 * curDisp
				const oy = Math.cos(t * 0.65 + i * 0.9) * 62
				const rad = 105 + i * 11 + Math.sin(t + i) * 26
				const g = ctx.createRadialGradient(
					px + ox,
					py + oy,
					0,
					px + ox,
					py + oy,
					rad,
				)
				const alpha =
					curSolo !== null && curSolo !== i % 12 && !curLocked.includes(i % 12)
						? 0.05
						: 0.19
				g.addColorStop(0, `hsla(${bh}, 95%, 64%, ${alpha})`)
				g.addColorStop(0.45, `hsla(${bh}, 90%, 50%, ${alpha * 0.5})`)
				g.addColorStop(1, "transparent")
				ctx.fillStyle = g
				ctx.beginPath()
				ctx.arc(px + ox, py + oy, rad, 0, Math.PI * 2)
				ctx.fill()
			}

			// continuous caustic light bands (floor of the room) — EE2 denser
			const causticY0 = H * 0.44
			for (let row = 0; row < 15; row++) {
				ctx.beginPath()
				for (let x = 0; x <= W; x += 3) {
					const n1 = Math.sin(x * 0.012 + t * 1.4 + row)
					const n2 = Math.sin(x * 0.028 - t * 0.9 + row * 1.3)
					const n3 = Math.cos(x * 0.007 + t * 0.5)
					const y =
						causticY0 +
						row * 18 +
						n1 * 20 * curDisp +
						n2 * 14 +
						n3 * 9 +
						Math.sin(t * 2 + row) * 5
					if (x === 0) ctx.moveTo(x, y)
					else ctx.lineTo(x, y)
				}
				const ch = (activeHue + row * 24) % 360
				ctx.strokeStyle = `hsla(${ch}, 92%, 66%, ${0.28 - row * 0.013})`
				ctx.lineWidth = 2.7
				ctx.shadowBlur = 24
				ctx.shadowColor = `hsla(${ch}, 100%, 60%, 0.68)`
				ctx.stroke()
			}
			ctx.shadowBlur = 0

			// secondary caustic fill blobs (swimming light)
			for (let i = 0; i < 28; i++) {
				const cx =
					((Math.sin(t * 0.35 + i * 1.1) * 0.5 + 0.5) * W + i * 36) % W
				const cy =
					H * 0.55 +
					Math.cos(t * 0.4 + i * 0.8) * 55 +
					Math.sin(t + i) * 22
				const bh = bandH(i % 12)
				const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 95)
				rg.addColorStop(0, `hsla(${bh}, 95%, 72%, 0.24)`)
				rg.addColorStop(0.5, `hsla(${bh}, 90%, 55%, 0.1)`)
				rg.addColorStop(1, "transparent")
				ctx.fillStyle = rg
				ctx.beginPath()
				ctx.ellipse(
					cx,
					cy,
					68 + Math.sin(t + i) * 18,
					22 + Math.cos(t * 1.2 + i) * 8,
					Math.sin(t * 0.3 + i) * 0.45,
					0,
					Math.PI * 2,
				)
				ctx.fill()
			}

			// prism beam system — mode-distinct
			if (curBeam) {
				const cx = W * 0.26
				const cy = H * 0.4

				// incident beam (double pass)
				const ib = ctx.createLinearGradient(0, cy - 30, cx, cy)
				ib.addColorStop(0, "rgba(255,255,255,0)")
				ib.addColorStop(0.5, "rgba(255,255,255,0.5)")
				ib.addColorStop(1, "rgba(255,255,255,0.85)")
				ctx.strokeStyle = ib
				ctx.lineWidth = curMode === "combine" ? 7 : 5
				ctx.shadowBlur = 24
				ctx.shadowColor = "rgba(255,255,255,0.9)"
				ctx.beginPath()
				ctx.moveTo(0, cy - 18 + Math.sin(t) * 3)
				ctx.lineTo(cx, cy)
				ctx.stroke()
				// secondary parallel ghost beam
				ctx.strokeStyle = "rgba(255,255,255,0.18)"
				ctx.lineWidth = 2
				ctx.shadowBlur = 8
				ctx.beginPath()
				ctx.moveTo(0, cy - 8 + Math.sin(t * 1.2) * 2)
				ctx.lineTo(cx - 4, cy + 6)
				ctx.stroke()

				if (curMode === "combine") {
					// recombined white core + faint spectrum halo
					for (let i = 0; i < 12; i++) {
						const bh = bandH(i)
						const ang = (i - 5.5) * 0.018 * curDisp
						ctx.strokeStyle = `hsla(${bh}, 90%, 70%, 0.16)`
						ctx.lineWidth = 10
						ctx.shadowBlur = 18
						ctx.shadowColor = `hsla(${bh}, 100%, 60%, 0.4)`
						ctx.beginPath()
						ctx.moveTo(cx, cy)
						ctx.lineTo(W * 0.95, cy + ang * H * 0.5 + Math.sin(t + i) * 4)
						ctx.stroke()
					}
					ctx.strokeStyle = "rgba(255,255,255,0.78)"
					ctx.lineWidth = 9
					ctx.shadowBlur = 36
					ctx.shadowColor = "white"
					ctx.beginPath()
					ctx.moveTo(cx, cy)
					ctx.lineTo(W * 0.98, cy + Math.sin(t * 0.8) * 6)
					ctx.stroke()
					// white bloom cluster
					for (const [bx, br, a] of [
						[0.68, 140, 0.24],
						[0.78, 100, 0.16],
						[0.88, 80, 0.12],
					] as const) {
						const wg = ctx.createRadialGradient(W * bx, cy, 0, W * bx, cy, br)
						wg.addColorStop(0, `rgba(255,255,255,${a})`)
						wg.addColorStop(1, "transparent")
						ctx.fillStyle = wg
						ctx.fillRect(W * bx - br, cy - br, br * 2, br * 2)
					}
				} else if (curMode === "diffract") {
					// interference fringes + fan — denser dots
					for (let i = 0; i < 12; i++) {
						const bh = bandH(i)
						const spread = (i - 5.5) * 10.2 * curDisp
						const muted =
							curSolo !== null && curSolo !== i && !curLocked.includes(i)
								? 0.07
								: 0.72
						// glow pass
						ctx.strokeStyle = `hsla(${bh}, 95%, 65%, ${muted * 0.35})`
						ctx.lineWidth = 8
						ctx.shadowColor = `hsla(${bh}, 100%, 60%, 0.9)`
						ctx.shadowBlur = 20
						ctx.beginPath()
						ctx.moveTo(cx, cy)
						const endY = cy + spread * 9.5 + Math.sin(t * 1.2 + i) * 12
						ctx.quadraticCurveTo(
							W * 0.55,
							cy + spread * 4.2 + Math.sin(t + i) * 22,
							W * 0.96,
							endY,
						)
						ctx.stroke()
						// core
						ctx.strokeStyle = `hsla(${bh}, 98%, 68%, ${muted})`
						ctx.lineWidth = 2.8
						ctx.beginPath()
						ctx.moveTo(cx, cy)
						ctx.quadraticCurveTo(
							W * 0.55,
							cy + spread * 4.2 + Math.sin(t + i) * 22,
							W * 0.96,
							endY,
						)
						ctx.stroke()
						// fringe dots along ray
						for (let f = 0; f < 14; f++) {
							const ft = f / 14
							const fx = cx + (W * 0.96 - cx) * ft
							const fy =
								cy +
								(endY - cy) * ft +
								Math.sin(t * 3 + f + i) * 7
							ctx.fillStyle = `hsla(${bh}, 100%, 78%, ${muted * 0.75})`
							ctx.beginPath()
							ctx.arc(fx, fy, 1.6 + Math.sin(t * 4 + f) * 0.9, 0, Math.PI * 2)
							ctx.fill()
						}
					}
				} else {
					// classic split fan — double-pass glow + core
					for (let i = 0; i < 12; i++) {
						const bh = bandH(i)
						const spread = (i - 5.5) * 5.2 * curDisp
						const muted =
							curSolo !== null && curSolo !== i && !curLocked.includes(i)
								? 0.08
								: 0.7
						const hot = curSolo === i || curLocked.includes(i)
						// soft bloom
						ctx.strokeStyle = `hsla(${bh}, 95%, 66%, ${muted * 0.32})`
						ctx.lineWidth = hot ? 12 : 9
						ctx.shadowColor = `hsla(${bh}, 100%, 60%, 0.9)`
						ctx.shadowBlur = 22
						ctx.beginPath()
						ctx.moveTo(cx, cy)
						const endY = cy + spread * 9 + Math.sin(t + i) * 8
						ctx.lineTo(W * 0.96, endY)
						ctx.stroke()
						// core
						ctx.strokeStyle = `hsla(${bh}, 98%, 70%, ${muted})`
						ctx.lineWidth = hot ? 4.5 : 2.8
						ctx.beginPath()
						ctx.moveTo(cx, cy)
						ctx.lineTo(W * 0.96, endY)
						ctx.stroke()
						// ray tip sparks
						ctx.fillStyle = `hsla(${bh}, 100%, 80%, ${muted * 0.85})`
						ctx.beginPath()
						ctx.arc(W * 0.96, endY, hot ? 4 : 2.4, 0, Math.PI * 2)
						ctx.fill()
					}
				}
				ctx.shadowBlur = 0

				// prism body glass (larger, faceted)
				const pGrad = ctx.createLinearGradient(cx - 40, cy - 48, cx + 40, cy + 36)
				pGrad.addColorStop(0, "rgba(255,255,255,0.14)")
				pGrad.addColorStop(0.5, `hsla(${activeHue}, 60%, 70%, 0.1)`)
				pGrad.addColorStop(1, "rgba(255,255,255,0.04)")
				ctx.fillStyle = pGrad
				ctx.strokeStyle = "rgba(255,255,255,0.5)"
				ctx.lineWidth = 1.5
				ctx.shadowBlur = 28
				ctx.shadowColor = `hsla(${activeHue}, 90%, 60%, 0.65)`
				ctx.beginPath()
				ctx.moveTo(cx, cy - 44)
				ctx.lineTo(cx + 40, cy + 34)
				ctx.lineTo(cx - 40, cy + 34)
				ctx.closePath()
				ctx.fill()
				ctx.stroke()
				// facet edge highlight
				ctx.strokeStyle = "rgba(255,255,255,0.55)"
				ctx.lineWidth = 1
				ctx.beginPath()
				ctx.moveTo(cx, cy - 44)
				ctx.lineTo(cx + 8, cy + 10)
				ctx.stroke()
				ctx.shadowBlur = 0
			}

			// key play bursts
			for (const burst of burstsRef.current) {
				const age = (Date.now() - burst.t) / 700
				if (age > 1) continue
				const bx = ((burst.i + 0.5) / 12) * W
				const by = H * 0.48
				const br = 28 + age * 160
				const bg = ctx.createRadialGradient(bx, by, 0, bx, by, br)
				bg.addColorStop(0, `hsla(${burst.h}, 100%, 72%, ${0.55 * (1 - age)})`)
				bg.addColorStop(0.45, `hsla(${burst.h}, 95%, 55%, ${0.22 * (1 - age)})`)
				bg.addColorStop(1, "transparent")
				ctx.fillStyle = bg
				ctx.beginPath()
				ctx.arc(bx, by, br, 0, Math.PI * 2)
				ctx.fill()
				// ring shockwave
				ctx.strokeStyle = `hsla(${burst.h}, 100%, 70%, ${0.4 * (1 - age)})`
				ctx.lineWidth = 2
				ctx.beginPath()
				ctx.arc(bx, by, 18 + age * 90, 0, Math.PI * 2)
				ctx.stroke()
			}

			// dense spectral particles
			for (const sp of specks) {
				sp.x += sp.vx + Math.sin(t + sp.y * 0.01) * 0.35
				sp.y += sp.vy + Math.cos(t * 0.8 + sp.x * 0.008) * 0.28
				if (sp.x < -10) sp.x = W + 10
				if (sp.x > W + 10) sp.x = -10
				if (sp.y < -10) sp.y = H + 10
				if (sp.y > H + 10) sp.y = -10
				// tint toward current spectrum
				const bi = Math.floor((sp.x / W) * 12) % 12
				sp.h = bandH(bi)
				if (curShatter) {
					sp.vx += (Math.random() - 0.5) * 0.18
					sp.vy += (Math.random() - 0.5) * 0.18
				}
				const dim =
					curSolo !== null &&
					bi !== curSolo &&
					!curLocked.includes(bi)
						? 0.22
						: 1
				// short trail for select particles
				if (sp.trail) {
					ctx.strokeStyle = `hsla(${sp.h}, 90%, 70%, ${sp.a * dim * 0.35})`
					ctx.lineWidth = 1
					ctx.beginPath()
					ctx.moveTo(sp.x - sp.vx * 8, sp.y - sp.vy * 8)
					ctx.lineTo(sp.x, sp.y)
					ctx.stroke()
				}
				ctx.fillStyle = `hsla(${sp.h}, 94%, 74%, ${sp.a * dim})`
				ctx.shadowBlur = 6
				ctx.shadowColor = `hsla(${sp.h}, 100%, 60%, 0.5)`
				ctx.beginPath()
				ctx.arc(
					sp.x,
					sp.y,
					curShatter ? sp.r * (1.55 + Math.sin(t * 6 + sp.x) * 0.65) : sp.r,
					0,
					Math.PI * 2,
				)
				ctx.fill()
			}
			ctx.shadowBlur = 0

			// spectrum ribbon top (EE2 triple wave)
			for (let x = 0; x < W; x += 2) {
				const bi = Math.floor((x / W) * 12)
				const bh = bandH(bi)
				const wave = Math.sin(x * 0.02 + t * 2) * 8
				const wave2 = Math.cos(x * 0.015 - t * 1.4) * 5
				const wave3 = Math.sin(x * 0.01 + t * 1.1) * 3
				ctx.fillStyle = `hsla(${bh}, 92%, 64%, 0.48)`
				ctx.fillRect(x, 5 + wave, 2, 5)
				ctx.fillStyle = `hsla(${bh}, 90%, 58%, 0.28)`
				ctx.fillRect(x, 16 + wave2, 2, 3)
				ctx.fillStyle = `hsla(${bh}, 88%, 55%, 0.16)`
				ctx.fillRect(x, H - 14 + wave3, 2, 3)
			}

			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)
		window.addEventListener("resize", resize)
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener("resize", resize)
		}
	}, [mx, my])

	// prune bursts
	useEffect(() => {
		if (!keyBursts.length) return
		const id = window.setInterval(() => {
			setKeyBursts((b) => b.filter((x) => Date.now() - x.t < 800))
		}, 100)
		return () => clearInterval(id)
	}, [keyBursts.length])

	const toggleLock = (i: number) => {
		setLocked((L) => (L.includes(i) ? L.filter((x) => x !== i) : [...L, i]))
	}

	const playKey = (i: number) => {
		setSolo(solo === i ? null : i)
		setPlays((p) => p + 1)
		setKeyBursts((b) => [
			...b.slice(-16),
			{ id: Date.now() + i, i, h: bands[i].h, t: Date.now() },
		])
	}

	return (
		<LandingsShell className="bg-[#11111b] text-text">
			{/* dense spectral underpaint — EE2 richer first frame before/with canvas */}
			<div
				className="pointer-events-none fixed inset-0 z-0"
				style={{
					background: `
						radial-gradient(ellipse 100% 80% at 50% 38%, hsl(${hue} 68% 22% / 0.72), #11111b 72%),
						radial-gradient(ellipse 55% 42% at 18% 28%, hsl(${(hue + 40) % 360} 75% 32% / 0.42), transparent 60%),
						radial-gradient(ellipse 55% 42% at 82% 48%, hsl(${(hue + 180) % 360} 75% 30% / 0.38), transparent 60%),
						radial-gradient(ellipse 40% 35% at 50% 70%, hsl(${(hue + 90) % 360} 70% 28% / 0.22), transparent 55%),
						conic-gradient(from ${hue}deg at 50% 55%,
							${bands.map((b) => `hsl(${b.h} 78% 32% / 0.48)`).join(",")}),
						#11111b
					`,
				}}
			/>
			{/* 12-column spectral wall wash under keys */}
			<div className="pointer-events-none fixed inset-x-0 top-[20%] z-0 flex h-[62%] opacity-50">
				{bands.map((b, i) => (
					<div
						key={`wall-${i}`}
						className="flex-1"
						style={{
							background: `linear-gradient(180deg, transparent 0%, hsl(${b.h} 92% 58% / 0.42) 32%, hsl(${b.h} 75% 38% / 0.28) 68%, transparent 100%)`,
							boxShadow: `inset 0 0 48px hsl(${b.h} 80% 50% / 0.2), 0 0 20px hsl(${b.h} 90% 50% / 0.08)`,
						}}
					/>
				))}
			</div>
			{/* static caustic floor (DOM) — dense first paint even before rAF */}
			<div
				className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[58%] opacity-70"
				style={{
					background: `
						repeating-linear-gradient(100deg,
							transparent 0,
							transparent 8px,
							hsl(${(hue + 40) % 360} 90% 60% / 0.12) 9px,
							transparent 16px),
						repeating-linear-gradient(80deg,
							transparent 0,
							transparent 14px,
							hsl(${(hue + 160) % 360} 90% 60% / 0.11) 15px,
							transparent 24px),
						repeating-linear-gradient(95deg,
							transparent 0,
							transparent 22px,
							hsl(${(hue + 220) % 360} 90% 60% / 0.08) 23px,
							transparent 36px),
						repeating-linear-gradient(70deg,
							transparent 0,
							transparent 32px,
							hsl(${(hue + 300) % 360} 90% 60% / 0.05) 33px,
							transparent 44px),
						radial-gradient(ellipse 90% 55% at 50% 100%, hsl(${hue} 85% 52% / 0.32), transparent 70%),
						radial-gradient(ellipse 40% 30% at 30% 80%, hsl(${(hue + 90) % 360} 90% 55% / 0.18), transparent 60%),
						radial-gradient(ellipse 35% 28% at 72% 85%, hsl(${(hue + 200) % 360} 90% 55% / 0.14), transparent 55%)
					`,
				}}
			/>
			{/* floating spectral motes (SSR-safe, deterministic) */}
			<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				{Array.from({ length: 40 }, (_, i) => {
					const bh = bands[i % 12].h
					return (
						<span
							key={`mote-${i}`}
							className="absolute rounded-full"
							style={{
								left: `${(i * 13.7 + (i % 5) * 4) % 100}%`,
								top: `${(i * 9.3 + (i % 7) * 3) % 100}%`,
								width: 3 + (i % 4) * 2,
								height: 3 + (i % 4) * 2,
								background: `hsl(${bh} 95% 70% / 0.55)`,
								boxShadow: `0 0 ${8 + (i % 5) * 3}px hsl(${bh} 100% 60% / 0.55)`,
								opacity: 0.45 + (i % 5) * 0.08,
							}}
						/>
					)
				})}
			</div>
			<canvas ref={canvasRef} className="fixed inset-0 z-[1]" />
			<motion.div
				className="pointer-events-none fixed size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-3xl"
				style={{
					x: glowX,
					y: glowY,
					background: `hsl(${solo !== null ? bands[solo].h : hue} 90% 60%)`,
				}}
			/>
			{/* secondary + tertiary orbit glows */}
			<div
				className="pointer-events-none fixed z-[1] size-80 rounded-full opacity-30 blur-3xl"
				style={{
					left: "68%",
					top: "26%",
					background: `hsl(${(hue + 140) % 360} 90% 55%)`,
				}}
			/>
			<div
				className="pointer-events-none fixed z-[1] size-56 rounded-full opacity-22 blur-3xl"
				style={{
					left: "12%",
					top: "55%",
					background: `hsl(${(hue + 220) % 360} 90% 55%)`,
				}}
			/>

			{/* decorative prism + ray fan ghost for first paint */}
			{beam && (
				<>
					<motion.div
						className="pointer-events-none fixed top-[36%] left-[22%] z-[2] -translate-x-1/2 -translate-y-1/2"
						style={{ rotate: prismRot }}
					>
						<div
							className="size-0 border-r-[56px] border-b-[98px] border-l-[56px] border-r-transparent border-b-white/45 border-l-transparent"
							style={{
								filter: `drop-shadow(0 0 44px hsl(${hue} 85% 60% / 0.95)) drop-shadow(0 0 20px white)`,
							}}
						/>
					</motion.div>
					{/* static spectral ray ghost (DOM, always on with beam) */}
					<div className="pointer-events-none fixed top-[36%] left-[22%] z-[1] h-[2px] w-[70vw] origin-left -translate-y-1/2">
						{bands.map((b, i) => (
							<span
								key={`rayg-${i}`}
								className="absolute left-0 top-0 h-px origin-left"
								style={{
									width: "100%",
									transform: `rotate(${(i - 5.5) * 2.8 * dispersion}deg)`,
									background: `linear-gradient(90deg, hsl(${b.h} 95% 70% / 0.55), hsl(${b.h} 90% 55% / 0.12), transparent)`,
									boxShadow: `0 0 12px hsl(${b.h} 100% 55% / 0.35)`,
								}}
							/>
						))}
					</div>
				</>
			)}

			{/* fixed spectrum ribbon for first-paint density */}
			<div className="pointer-events-none fixed inset-x-0 top-0 z-[2] flex h-2.5">
				{bands.map((b, i) => (
					<div
						key={i}
						className="flex-1"
						style={{
							background: `linear-gradient(180deg, hsl(${b.h} 95% 68%), hsl(${b.h} 85% 45%))`,
							boxShadow: `0 0 18px hsl(${b.h} 100% 50% / 0.6), 0 4px 22px hsl(${b.h} 100% 50% / 0.3)`,
						}}
					/>
				))}
			</div>
			{/* mid spectrum hairline under header */}
			<div className="pointer-events-none fixed inset-x-0 top-12 z-[2] flex h-px opacity-50">
				{bands.map((b, i) => (
					<div
						key={`mid-${i}`}
						className="flex-1"
						style={{
							background: `hsl(${b.h} 90% 55% / 0.7)`,
							boxShadow: `0 0 8px hsl(${b.h} 100% 50% / 0.35)`,
						}}
					/>
				))}
			</div>
			{/* bottom spectrum edge */}
			<div className="pointer-events-none fixed inset-x-0 bottom-0 z-[2] flex h-1.5 opacity-80">
				{bands.map((b, i) => (
					<div
						key={`bot-${i}`}
						className="flex-1"
						style={{
							background: `hsl(${b.h} 90% 52%)`,
							boxShadow: `0 0 12px hsl(${b.h} 100% 50% / 0.45)`,
						}}
					/>
				))}
			</div>

			<div className="relative z-10 mx-auto flex min-h-dvh max-w-wide flex-col justify-between px-5 pt-14 pb-5 sm:px-8">
				<div>
					<p className="text-lavender text-xs font-black tracking-[0.35em] uppercase">
						Prism · spectral instrument · mode {mode} · plays {plays}
					</p>
					<h1 className="mt-1.5 max-w-laptop text-[clamp(2rem,6.5vw,4.2rem)] font-thin tracking-tight">
						Split the signal.
						<br />
						<span className="text-subtext-0">
							{mode === "combine"
								? "Recombine into white heat."
								: mode === "diffract"
									? "Diffraction as interface."
									: "Then put it back together."}
						</span>
					</h1>
					<p className="text-subtext-0 mt-1.5 max-w-measure text-sm sm:text-base">
						Strike a key to paint the field. Double-click to lock a band.
						Shatter, disperse, recombine — every mode rewrites the light.
					</p>
				</div>

				{/* spectrum piano — tall dramatic keys dominate first paint (EE2) */}
				<div className="relative my-2 flex h-[min(60vh,560px)] gap-1 sm:my-3 sm:gap-1.5">
					{/* ambient key-bed glow — dual wash */}
					<div
						className="pointer-events-none absolute -inset-x-4 -bottom-6 h-28 rounded-full opacity-55 blur-2xl"
						style={{
							background: `linear-gradient(90deg, ${bands.map((b) => `hsl(${b.h} 90% 50% / 0.5)`).join(",")})`,
						}}
					/>
					<div
						className="pointer-events-none absolute -inset-x-2 -top-4 h-16 rounded-full opacity-35 blur-xl"
						style={{
							background: `linear-gradient(90deg, ${bands.map((b) => `hsl(${b.h} 95% 60% / 0.35)`).join(",")})`,
						}}
					/>
					{bands.map((b, i) => {
						const isSolo = solo === i
						const isLocked = locked.includes(i)
						const dimmed =
							solo !== null && solo !== i && !isLocked
						const recent = keyBursts.some(
							(k) => k.i === i && Date.now() - k.t < 400,
						)
						return (
							<motion.button
								key={b.label + i}
								type="button"
								onClick={() => playKey(i)}
								onDoubleClick={(e) => {
									e.preventDefault()
									toggleLock(i)
								}}
								animate={
									shatter
										? {
												y: [0, i % 2 === 0 ? -28 : 28, 0],
												rotate: [0, (i - 6) * 3.2, 0],
											}
										: recent
											? { y: [0, -14, 0], scale: [1, 1.08, 1] }
											: { y: 0, rotate: 0, scale: isSolo ? 1.07 : 1 }
								}
								transition={{
									duration: shatter ? 0.7 : 0.28,
									delay: shatter ? i * 0.03 : 0,
									repeat: shatter ? Infinity : 0,
									repeatDelay: shatter ? 0.4 : 0,
								}}
								className={cn(
									"group relative flex-1 cursor-pointer overflow-hidden rounded-t-3xl rounded-b-lg border transition",
									isSolo
										? "z-10 border-white shadow-[0_0_64px_rgba(255,255,255,0.4)]"
										: "border-white/15 hover:border-white/50",
									dimmed && "opacity-22",
									isLocked && "ring-2 ring-white/70",
								)}
								style={{
									background: `
										linear-gradient(180deg,
											hsl(${b.h} 100% ${78 * b.gain}%) 0%,
											hsl(${b.h} 95% 58%) 18%,
											hsl(${b.h} 85% 42%) 48%,
											hsl(${b.h} 70% 22%) 78%,
											hsl(${b.h} 55% 10%) 100%)
									`,
									boxShadow: recent
										? `0 0 56px hsl(${b.h} 100% 60% / 0.85), 0 0 24px hsl(${b.h} 100% 70% / 0.5), inset 0 -28px 50px hsl(${b.h} 80% 50% / 0.4), inset 0 8px 24px rgba(255,255,255,0.35)`
										: isSolo
											? `0 0 48px hsl(${b.h} 100% 55% / 0.7), 0 12px 40px hsl(${b.h} 80% 40% / 0.4), inset 0 6px 20px rgba(255,255,255,0.3)`
											: isLocked
												? `0 0 32px hsl(${b.h} 100% 55% / 0.45), inset 0 4px 16px rgba(255,255,255,0.2)`
												: `0 8px 28px hsl(${b.h} 80% 30% / 0.35), inset 0 4px 14px rgba(255,255,255,0.18)`,
								}}
							>
								{/* top specular cap */}
								<span
									className="pointer-events-none absolute inset-x-1 top-0 h-[28%] rounded-t-3xl opacity-70"
									style={{
										background: `linear-gradient(180deg, hsl(${b.h} 100% 92% / 0.55) 0%, hsl(${b.h} 100% 80% / 0.15) 50%, transparent 100%)`,
									}}
								/>
								{/* side edge bevel */}
								<span
									className="pointer-events-none absolute inset-y-0 left-0 w-[18%] opacity-40"
									style={{
										background: `linear-gradient(90deg, rgba(255,255,255,0.35), transparent)`,
									}}
								/>
								<span
									className="pointer-events-none absolute inset-y-0 right-0 w-[14%] opacity-30"
									style={{
										background: `linear-gradient(270deg, rgba(0,0,0,0.45), transparent)`,
									}}
								/>
								{/* caustic shimmer on key surface */}
								<span
									className="pointer-events-none absolute inset-0 opacity-60"
									style={{
										background: `repeating-linear-gradient(115deg, transparent, transparent 5px, hsl(${b.h} 100% 85% / 0.16) 5px, hsl(${b.h} 100% 85% / 0.16) 7px)`,
										transform: `translateY(${Math.sin(plays + i) * 4}px)`,
										animation: "prism-caustic 2.8s linear infinite",
										animationDelay: `${i * 0.1}s`,
									}}
								/>
								{/* secondary cross caustics */}
								<span
									className="pointer-events-none absolute inset-0 opacity-35 mix-blend-screen"
									style={{
										background: `repeating-linear-gradient(70deg, transparent, transparent 9px, hsl(${(b.h + 40) % 360} 100% 80% / 0.14) 9px, transparent 12px)`,
										animation: "prism-caustic 4.2s linear infinite reverse",
										animationDelay: `${i * 0.15}s`,
									}}
								/>
								{/* mid light stripe */}
								<span
									className="pointer-events-none absolute inset-x-[20%] top-[38%] h-px opacity-50"
									style={{
										background: `linear-gradient(90deg, transparent, hsl(${b.h} 100% 90% / 0.7), transparent)`,
										boxShadow: `0 0 12px hsl(${b.h} 100% 70% / 0.5)`,
									}}
								/>
								<span className="absolute inset-x-0 top-3 text-center text-[0.75rem] font-black tracking-wider text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
									{b.label}
								</span>
								<span
									className="absolute inset-x-0 top-9 mx-auto h-1 w-6 rounded-full opacity-60"
									style={{
										background: `hsl(${b.h} 100% 90%)`,
										boxShadow: `0 0 10px hsl(${b.h} 100% 70%)`,
									}}
								/>
								<span className="absolute inset-x-0 bottom-2.5 text-center font-mono text-[0.55rem] font-semibold text-white/80">
									{Math.round(b.h)}°
								</span>
								{isLocked && (
									<span className="absolute top-12 inset-x-0 text-center text-[0.5rem] font-bold tracking-widest text-white uppercase drop-shadow">
										lock
									</span>
								)}
								{/* press flash */}
								{recent && (
									<span
										className="pointer-events-none absolute inset-0"
										style={{
											background: `radial-gradient(circle at 50% 25%, hsl(${b.h} 100% 90% / 0.7), hsl(${b.h} 100% 70% / 0.25) 40%, transparent 70%)`,
										}}
									/>
								)}
								{/* bottom foot shadow inside key */}
								<span
									className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%]"
									style={{
										background: `linear-gradient(0deg, rgba(0,0,0,0.45), transparent)`,
									}}
								/>
							</motion.button>
						)
					})}
				</div>

				<style>{`
					@keyframes prism-caustic {
						0% { background-position: 0 0; }
						100% { background-position: 48px 72px; }
					}
				`}</style>

				{/* recombination stage — denser mode read */}
				<div
					className="relative h-24 overflow-hidden rounded-[1.5rem] border border-white/15 transition-all duration-500 sm:h-32"
					style={{
						background:
							mode === "combine"
								? `radial-gradient(circle at 50% 50%, #fff 0%, hsl(${hue} 40% 88%) 14%, hsl(${hue} 50% 42%) 38%, #11111b 70%)`
								: solo !== null
									? `radial-gradient(circle at 40% 40%, hsl(${bands[solo].h} 95% 75% / 0.95), hsl(${bands[solo].h} 70% 32% / 0.45) 42%, #11111b 70%)`
									: `conic-gradient(from ${hue + plays * 4}deg, ${bands.map((b) => `hsl(${b.h} 88% 60%)`).join(",")})`,
						filter:
							mode === "diffract"
								? "contrast(1.25) saturate(1.55) hue-rotate(8deg)"
								: "none",
						boxShadow:
							mode === "combine"
								? "0 0 70px rgba(255,255,255,0.28), inset 0 0 40px rgba(255,255,255,0.15)"
								: solo !== null
									? `0 0 56px hsl(${bands[solo].h} 90% 50% / 0.45)`
									: `0 0 48px hsl(${hue} 80% 50% / 0.28)`,
					}}
				>
					{/* animated caustic overlay */}
					<div
						className="pointer-events-none absolute inset-0 opacity-55 mix-blend-screen"
						style={{
							background: `repeating-radial-gradient(circle at ${40 + (plays % 5) * 5}% ${50 + (plays % 3) * 8}%, transparent 0, transparent 10px, hsl(${hue} 90% 70% / 0.22) 11px, transparent 16px)`,
						}}
					/>
					{/* secondary interference stripes in diffract */}
					{mode === "diffract" && (
						<div
							className="pointer-events-none absolute inset-0 opacity-40"
							style={{
								background: `repeating-linear-gradient(90deg, transparent 0, transparent 6px, rgba(255,255,255,0.12) 7px, transparent 10px)`,
							}}
						/>
					)}
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(17,17,27,0.5))]" />
					{/* mini spectrum strip */}
					<div className="absolute inset-x-5 top-2.5 flex h-3 overflow-hidden rounded-full border border-white/10">
						{bands.map((b, i) => (
							<div
								key={i}
								className="flex-1 transition-opacity"
								style={{
									background: `hsl(${b.h} 92% 62%)`,
									opacity:
										solo === null || solo === i || locked.includes(i)
											? 1
											: 0.18,
									boxShadow:
										solo === i ? `0 0 14px hsl(${b.h} 100% 60%)` : undefined,
								}}
							/>
						))}
					</div>
					<p className="absolute bottom-2 left-4 font-mono text-[0.6rem] tracking-widest text-white/60 uppercase">
						{mode === "combine"
							? "white point"
							: mode === "diffract"
								? "interference field"
								: "spectral field"}{" "}
						· locks {locked.length} · plays {plays}
					</p>
				</div>

				{/* controls */}
				<div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:gap-4">
					<div className="flex flex-wrap gap-2">
						{(["split", "combine", "diffract"] as const).map((m) => (
							<button
								key={m}
								type="button"
								onClick={() => setMode(m)}
								className={cn(
									"cursor-pointer rounded-full border px-5 py-2 text-xs font-black tracking-widest uppercase",
									mode === m
										? "border-lavender bg-lavender/20 text-lavender shadow-[0_0_20px_rgba(180,190,254,0.3)]"
										: "border-white/15 text-white/60",
								)}
							>
								{m}
							</button>
						))}
						<button
							type="button"
							onClick={() => setShatter((s) => !s)}
							className={cn(
								"cursor-pointer rounded-full border px-5 py-2 text-xs font-black tracking-widest uppercase",
								shatter
									? "border-pink bg-pink/20 text-pink"
									: "border-white/15 text-white/60",
							)}
						>
							Shatter
						</button>
						<button
							type="button"
							onClick={() => setBeam((b) => !b)}
							className="cursor-pointer rounded-full border border-white/15 px-5 py-2 text-xs font-black tracking-widest text-white/60 uppercase"
						>
							Beam {beam ? "on" : "off"}
						</button>
						<button
							type="button"
							onClick={() => {
								setSolo(null)
								setLocked([])
								setShatter(false)
								setMode("split")
								setPlays(0)
							}}
							className="cursor-pointer rounded-full border border-white/15 px-5 py-2 text-xs font-black tracking-widest text-white/60 uppercase"
						>
							Reset
						</button>
						<button
							type="button"
							onClick={() => setHue((h) => (h + 37) % 360)}
							className="cursor-pointer rounded-full border border-white/15 px-5 py-2 text-xs font-black tracking-widest text-white/60 uppercase"
						>
							Spin hue
						</button>
					</div>
					<div className="flex max-w-laptop flex-wrap items-center gap-6">
						<label className="text-subtext-0 flex flex-1 items-center gap-3 text-xs">
							Master hue
							<input
								type="range"
								min={0}
								max={360}
								value={hue}
								onChange={(e) => {
									setHue(Number(e.target.value))
									setSolo(null)
								}}
								className="w-full min-w-[8rem] accent-[var(--catpuccin-pink)]"
								aria-label="Master hue"
							/>
							<span className="font-mono w-10">{hue}°</span>
						</label>
						<label className="text-subtext-0 flex items-center gap-3 text-xs">
							Dispersion
							<input
								type="range"
								min={0.4}
								max={2.2}
								step={0.1}
								value={dispersion}
								onChange={(e) => setDispersion(Number(e.target.value))}
								className="w-32 accent-[var(--catpuccin-lavender)]"
								aria-label="Dispersion"
							/>
						</label>
					</div>
				</div>
			</div>
		</LandingsShell>
	)
}

export const LANDING_PAGES: Record<string, () => ReactNode> = {
	editorial: EditorialLanding,
	brutalist: BrutalistLanding,
	noir: NoirLanding,
	zen: ZenLanding,
	neon: NeonLanding,
	paper: PaperLanding,
	atlas: AtlasLanding,
	pulse: PulseLanding,
	prism: PrismLanding,
}
