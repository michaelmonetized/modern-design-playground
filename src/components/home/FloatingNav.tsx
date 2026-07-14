import { Link } from "@tanstack/react-router"
import ThemeToggle from "../ThemeToggle"
import { Magnetic } from "./Magnetic"

export function FloatingNav() {
	// z-50: above ScrollProgress beam (z-40) + chapter rail (z-45); no shared hit targets with right rail
	return (
		<header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5">
			<nav className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-mantle/50 px-2 py-1.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:gap-2 sm:px-3">
				<Magnetic strength={0.18}>
					<Link
						to="/"
						className="text-foreground px-3 py-1.5 text-sm font-black tracking-tight no-underline"
					>
						Playground
					</Link>
				</Magnetic>
				<a
					href="#material"
					className="text-subtext-0 hover:text-foreground hidden px-2 py-1.5 text-sm no-underline sm:inline"
				>
					Material
				</a>
				<a
					href="#orbit"
					className="text-subtext-0 hover:text-foreground hidden px-2 py-1.5 text-sm no-underline sm:inline"
				>
					Orbit
				</a>
				<a
					href="#signal"
					className="text-subtext-0 hover:text-foreground hidden px-2 py-1.5 text-sm no-underline sm:inline"
				>
					Signal
				</a>
				<Link
					to="/landings"
					className="text-pink px-2 py-1.5 text-sm font-bold no-underline"
				>
					Worlds
				</Link>
				<div className="ml-1 flex items-center gap-2 border-l border-white/10 pl-2 sm:pl-3">
					<ThemeToggle />
				</div>
			</nav>
		</header>
	)
}

