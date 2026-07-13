import { Link } from "@tanstack/react-router"
import ClerkHeader from "../integrations/clerk/header-user.tsx"
import ThemeToggle from "./ThemeToggle"

export default function Header() {
	return (
		<header className="bg-background/80 sticky top-0 z-50 border-b border-border px-4 backdrop-blur-lg">
			<nav className="mx-auto flex w-full max-w-laptop flex-wrap items-center gap-x-4 gap-y-2 py-3">
				<Link
					to="/"
					className="text-foreground no-underline font-black tracking-tight"
				>
					Playground
				</Link>

				<div className="text-muted-foreground flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium">
					<Link
						to="/"
						className="hover:text-foreground no-underline"
						activeProps={{ className: "text-foreground no-underline" }}
					>
						Home
					</Link>
				</div>

				<div className="ml-auto flex items-center gap-2">
					<ThemeToggle />
					<ClerkHeader />
				</div>
			</nav>
		</header>
	)
}
