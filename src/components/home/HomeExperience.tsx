import { ClientOnly } from "./ClientOnly"
import { Chapters } from "./Chapters"
import { CursorTrail } from "./CursorTrail"
import { FloatingNav } from "./FloatingNav"
import { GrainOverlay } from "./GrainOverlay"
import { ScrollProgress } from "./ScrollProgress"
import { SmoothScroll } from "./SmoothScroll"
import { Stage } from "./Stage"

export function HomeExperience() {
	return (
		<SmoothScroll>
			{/* Force dark stage so WebGL + tokens never wash out in light mode */}
			<div className="home-experience dark relative min-h-dvh bg-[#11111b] text-[#cdd6f4]">
				{/* Persistent cinematic stage — the real page */}
				<ClientOnly
					fallback={
						<div
							className="fixed inset-0 z-0 overflow-hidden"
							style={{ background: "#11111b" }}
							aria-hidden
						>
							{/* Layered cosmic field — mirrors WebGL CosmicBackdrop while hydrating */}
							<div
								className="absolute inset-0"
								style={{
									background: `
										radial-gradient(ellipse 80% 60% at 28% 22%, rgba(203,166,247,0.42), transparent 55%),
										radial-gradient(ellipse 70% 55% at 72% 78%, rgba(137,180,250,0.38), transparent 50%),
										radial-gradient(ellipse 50% 40% at 50% 50%, rgba(245,194,231,0.18), transparent 60%),
										radial-gradient(ellipse 100% 80% at 50% 100%, rgba(17,17,27,0.9), transparent 40%),
										linear-gradient(165deg, #13131c 0%, #11111b 40%, #1a1528 100%)
									`,
								}}
							/>
							{/* Soft filament streaks */}
							<div
								className="absolute inset-0 opacity-60"
								style={{
									background: `
										radial-gradient(ellipse 40% 8% at 40% 35%, rgba(245,194,231,0.22), transparent 70%),
										radial-gradient(ellipse 35% 6% at 60% 55%, rgba(137,180,250,0.18), transparent 70%),
										radial-gradient(ellipse 25% 5% at 45% 70%, rgba(148,226,213,0.12), transparent 70%)
									`,
								}}
							/>
							{/* Central glow — previews liquid core */}
							<div
								className="absolute left-1/2 top-[42%] h-[min(42vw,320px)] w-[min(42vw,320px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
								style={{
									background:
										"radial-gradient(circle, rgba(245,194,231,0.35) 0%, rgba(203,166,247,0.22) 35%, rgba(137,180,250,0.08) 60%, transparent 72%)",
									filter: "blur(8px)",
									animation: "home-core-breathe 4.5s ease-in-out infinite",
								}}
							/>
							<div
								className="absolute left-1/2 top-[42%] h-[min(18vw,140px)] w-[min(18vw,140px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
								style={{
									background:
										"radial-gradient(circle, rgba(205,214,244,0.25) 0%, rgba(203,166,247,0.4) 40%, transparent 70%)",
									boxShadow:
										"0 0 60px 20px rgba(203,166,247,0.15), 0 0 120px 40px rgba(245,194,231,0.08)",
									animation: "home-core-breathe 4.5s ease-in-out infinite reverse",
								}}
							/>
							{/* Vignette */}
							<div
								className="absolute inset-0"
								style={{
									background:
										"radial-gradient(ellipse 75% 70% at 50% 45%, transparent 30%, rgba(17,17,27,0.55) 100%)",
								}}
							/>
							<style>{`
								@keyframes home-core-breathe {
									0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
									50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
								}
							`}</style>
						</div>
					}
				>
					<Stage />
					<CursorTrail />
				</ClientOnly>
				<GrainOverlay />
				<ScrollProgress />
				<FloatingNav />

				{/* DOM is the score; WebGL is the orchestra */}
				<div className="relative z-10">
					<Chapters />
				</div>
			</div>
		</SmoothScroll>
	)
}
