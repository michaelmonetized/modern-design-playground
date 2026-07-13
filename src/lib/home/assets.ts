export const MEDIA = {
	/** Orphan on disk (45MB) — not referenced by any home/landing component. Do not wire without a compressed source. */
	heroVideo: "/media/hero-video.webm",
	heroStill: "/media/hero-michael.jpg",
	headshot: "/media/headshot-full.jpg",
	portrait: "/media/michael-hero.jpeg",
	/** Heavy (~18MB). Editorial plate only; thumbs use loading=lazy. Prefer a future compressed variant. */
	cover: "/media/cover-tall.jpeg",
	walkway: "/media/walkway.png",
	folly: "/media/folly.avif",
	dance: "/media/dance.jpg",
	campaign: "/media/campaign-monitoring.webp",
	goals: "/media/goal-first.webp",
	behavior: "/media/user-behavior.webp",
	video: "/media/video-production.png",
	designer: "/media/web-designer.png",
	direct: "/media/direct-approach.png",
	uncapHome: "/media/uncap-home.png",
	uncapGallery: "/media/uncap-gallery.png",
} as const

export type GalleryItem = {
	title: string
	meta: string
	src: string
	blurb: string
	stack: string[]
	year: string
}

/** Ordered for the 3D helix / tunnel + interactive archive */
export const GALLERY: GalleryItem[] = [
	{
		title: "Uncap",
		meta: "Product systems",
		src: MEDIA.uncapHome,
		blurb:
			"A developer social surface where repository gravity meets cinematic product UI. Scroll as navigation; systems as story.",
		stack: ["TanStack Start", "Convex", "Clerk", "Catppuccin"],
		year: "2025",
	},
	{
		title: "Campaign",
		meta: "Intelligence",
		src: MEDIA.campaign,
		blurb:
			"Monitoring as narrative — signals, not spreadsheets. Designed for operators who still care how light falls on data.",
		stack: ["Realtime", "Charts", "Design tokens"],
		year: "2024",
	},
	{
		title: "Goals",
		meta: "Growth design",
		src: MEDIA.goals,
		blurb:
			"Goal-first composition: every CTA earns its place by pointing at a measurable intention.",
		stack: ["Conversion", "Motion", "IA"],
		year: "2024",
	},
	{
		title: "Direct",
		meta: "Brand performance",
		src: MEDIA.direct,
		blurb:
			"Performance creative that refuses to look like performance creative. Direct response with craft.",
		stack: ["Brand", "Paid media", "Systems"],
		year: "2023",
	},
	{
		title: "Behavior",
		meta: "Research UI",
		src: MEDIA.behavior,
		blurb:
			"User behavior made legible without voyeurism — patterns, not peeping. Interfaces for research teams.",
		stack: ["Analytics UX", "Privacy-aware"],
		year: "2023",
	},
	{
		title: "Cinema",
		meta: "Production",
		src: MEDIA.video,
		blurb:
			"Production tooling aesthetics — timelines, cuts, and the calm of a well-lit edit suite.",
		stack: ["Media", "Workflow"],
		year: "2022",
	},
	{
		title: "Craft",
		meta: "Surfaces",
		src: MEDIA.designer,
		blurb:
			"The designer’s desk as product metaphor — sketch, iterate, ship. Texture as interface.",
		stack: ["Marketing", "Identity"],
		year: "2022",
	},
	{
		title: "Gallery",
		meta: "Light study",
		src: MEDIA.uncapGallery,
		blurb:
			"A study in product light: soft rim, deep mantle, pink signal. Cataloguing UI as still life.",
		stack: ["Uncap", "Gallery"],
		year: "2025",
	},
	{
		title: "Walkway",
		meta: "Place",
		src: MEDIA.walkway,
		blurb:
			"Architectural path as scroll metaphor — depth maps, masks, and the invitation to keep walking.",
		stack: ["Invite", "Scroll"],
		year: "2025",
	},
	{
		title: "Portrait",
		meta: "Presence",
		src: MEDIA.headshot,
		blurb:
			"Human presence in a machine-heavy stack. The face that signs the work.",
		stack: ["Brand", "Portrait"],
		year: "—",
	},
	{
		title: "Folly",
		meta: "Atmosphere",
		src: MEDIA.folly,
		blurb:
			"Place memory — humid air, long horizons, the kind of light you design toward.",
		stack: ["Atmosphere", "Still"],
		year: "—",
	},
	{
		title: "Motion",
		meta: "Film still",
		src: MEDIA.dance,
		blurb:
			"Bodies in time. Reminder that kinetic UI comes from real movement, not just easing curves.",
		stack: ["Film", "Kinetic"],
		year: "—",
	},
]

export const CHAPTERS = [
	{
		id: "origin",
		kicker: "01 — Origin",
		title: "Light is the first interface.",
		body: "Before components, tokens, or frameworks — there was optics. This page is a continuous instrument: one scroll, one field of light, one hand on the glass. Every photon is intentional.",
		detail:
			"A single WebGL volume replaces the usual section stack. Camera, core, and archive share one timeline — nothing is a prop.",
		action: {
			label: "Pulse the field",
			hint: "Inject energy into the WebGL core · watch bloom respond",
		},
	},
	{
		id: "material",
		kicker: "02 — Material",
		title: "Surfaces that remember contact.",
		body: "Pointer force warps the field. Scroll steers the camera. Every asset is a plane in a living volume — not a stack of sections pretending to be one story.",
		detail:
			"Glass holds soft caustics. Metal catches hard rim light. Matte drinks the room. Sample them live on the liquid core.",
		action: {
			label: "Sample materials",
			hint: "Cycle glass / metal / matte on the liquid core",
		},
	},
	{
		id: "orbit",
		kicker: "03 — Orbit",
		title: "Work as a gravitational system.",
		body: "Real frames from products and places. They do not sit in a grid — they orbit, align, and let you fly through the archive like a corridor of memory.",
		detail: null,
		action: null,
	},
	{
		id: "craft",
		kicker: "04 — Craft",
		title: "Standards, then spectacle.",
		body: "The open web earned kinetic type, GPU materials, and scroll as choreography. This is that inheritance, spent carefully — Max, Catppuccin, Motion, Three, GSAP.",
		detail:
			"Provenance first: type system, color system, motion system, then the show. Spectacle without standards is noise.",
		action: {
			label: "Open the stack",
			hint: "Expand the technical provenance",
		},
	},
	{
		id: "signal",
		kicker: "05 — Signal",
		title: "Continue the transmission.",
		body: "A design system playground that behaves like a flagship. Fork the feeling. Rebuild the instrument. Ship something that still feels impossible in IE’s long shadow.",
		detail:
			"Nine more worlds await — editorial ink, neon rain, noir cinema, zen sand, spectral keys, and more.",
		action: null,
	},
] as const

export const LANDINGS = [
	{
		slug: "editorial",
		title: "Editorial",
		tag: "Longform",
		pitch: "Live measure & leading. Ink stains. Plates you reframe.",
		tone: "from-rosewater/30 to-mantle",
	},
	{
		slug: "brutalist",
		title: "Brutalist",
		tag: "Swiss raw",
		pitch: "Paint, flood, stamp the grid until it means something.",
		tone: "from-red/40 to-crust",
	},
	{
		slug: "noir",
		title: "Noir",
		tag: "Luxury dark",
		pitch: "Fashion stillness. One light. Infinite shadow.",
		tone: "from-overlay-0/50 to-crust",
	},
	{
		slug: "zen",
		title: "Zen",
		tag: "Ma / void",
		pitch: "Rake sand. Place stones. Breathe with the enso.",
		tone: "from-surface-0/40 to-base",
	},
	{
		slug: "neon",
		title: "Neon",
		tag: "Night market",
		pitch: "Chromatic noise, wet asphalt, clickable heat.",
		tone: "from-pink/40 via-mauve/30 to-sapphire/40",
	},
	{
		slug: "paper",
		title: "Paper",
		tag: "Letterpress",
		pitch: "Open book, dog-ear turns, pen blots, ribbon bookmark.",
		tone: "from-yellow/20 to-peach/20",
	},
	{
		slug: "atlas",
		title: "Atlas",
		tag: "Cartography",
		pitch: "Explore a map of ideas; pins open worlds.",
		tone: "from-teal/30 to-blue/30",
	},
	{
		slug: "pulse",
		title: "Pulse",
		tag: "Rhythm",
		pitch: "16-step visual sequencer — pads, mute, swing, drop.",
		tone: "from-green/30 to-sapphire/30",
	},
	{
		slug: "prism",
		title: "Prism",
		tag: "Spectral",
		pitch: "Split light into interactive spectra.",
		tone: "from-lavender/40 via-pink/30 to-yellow/30",
	},
] as const

export type LandingSlug = (typeof LANDINGS)[number]["slug"]
