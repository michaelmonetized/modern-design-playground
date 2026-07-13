import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { cn } from "#/lib/utils"

export function LandingsShell({
	children,
	className,
	dark = true,
}: {
	children: ReactNode
	className?: string
	dark?: boolean
}) {
	return (
		<div
			className={cn(
				"min-h-dvh",
				dark ? "bg-crust text-text" : "bg-[#f4efe6] text-[#1a1814]",
				className,
			)}
		>
			<header className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-4 py-4 sm:px-6">
				<Link
					to="/landings"
					className="pointer-events-auto rounded-full border border-current/20 bg-black/50 px-3 py-1.5 text-xs font-bold tracking-wide no-underline shadow-lg backdrop-blur-md"
				>
					← Gallery
				</Link>
				<div className="pointer-events-auto flex gap-2">
					<Link
						to="/"
						className="rounded-full border border-current/20 bg-black/50 px-3 py-1.5 text-xs font-bold tracking-wide no-underline shadow-lg backdrop-blur-md"
					>
						Instrument
					</Link>
				</div>
			</header>
			{children}
		</div>
	)
}
