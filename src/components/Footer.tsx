export default function Footer() {
	const year = new Date().getFullYear()

	return (
		<footer className="text-muted-foreground mt-auto border-t border-border px-4 py-10">
			<div className="mx-auto flex w-full max-w-laptop flex-col items-center justify-between gap-2 text-center text-sm sm:flex-row sm:text-left">
				<p className="m-0">&copy; {year} Modern Design Playground</p>
				<p className="m-0">TanStack Start · shadcn/ui · Max</p>
			</div>
		</footer>
	)
}
