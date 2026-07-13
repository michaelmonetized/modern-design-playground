import type { GalleryItem } from "#/lib/home/assets"
import { Button, buttonVariants } from "#/components/ui/button"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "#/components/ui/sheet"
import { stageBus } from "#/lib/home/stage-bus"
import { cn } from "#/lib/utils"

export function CaseStudySheet({
	item,
	open,
	onOpenChange,
}: {
	item: GalleryItem | null
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				onOpenChange(next)
				if (!next) stageBus.clearFocus()
			}}
		>
			<SheetContent
				side="right"
				className="flex w-full flex-col gap-0 overflow-y-auto border-white/10 bg-mantle/97 p-0 backdrop-blur-xl sm:max-w-measure"
			>
				{item && (
					<>
						<div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-white/10">
							<img
								src={item.src}
								alt=""
								className="h-full w-full object-cover"
								loading="lazy"
								decoding="async"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-mantle via-mantle/20 to-transparent" />
							<div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
							<div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
								<p className="text-pink text-[0.65rem] font-black tracking-[0.32em] uppercase drop-shadow">
									Case study
								</p>
								<span className="rounded-full border border-white/20 bg-crust/50 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-subtext-0 backdrop-blur-md">
									{item.year}
								</span>
							</div>
						</div>

						<SheetHeader className="gap-2.5 p-6 pb-3">
							<p className="text-sapphire text-xs font-black tracking-[0.28em] uppercase">
								{item.meta}
							</p>
							<SheetTitle className="text-3xl font-thin tracking-tight sm:text-4xl">
								{item.title}
							</SheetTitle>
							<SheetDescription className="text-subtext-0 text-base leading-relaxed">
								{item.blurb}
							</SheetDescription>
						</SheetHeader>

						<div className="px-6 pb-2">
							<p className="text-overlay-1 mb-2.5 text-[0.6rem] font-black tracking-[0.28em] uppercase">
								Stack
							</p>
							<div className="flex flex-wrap gap-2">
								{item.stack.map((s) => (
									<span
										key={s}
										className="rounded-full border border-pink/25 bg-pink/8 px-3 py-1.5 text-xs font-semibold text-text"
									>
										{s}
									</span>
								))}
							</div>
						</div>

						<div className="mx-6 mt-4 rounded-2xl border border-white/10 bg-surface-0/40 p-4">
							<p className="text-subtext-1 text-xs leading-relaxed">
								This frame lives in the 3D helix and the archive corridor.
								Opening it focuses the stage — pulse to feel the field respond.
							</p>
						</div>

						<div className="mt-auto flex flex-col gap-2 p-6 pt-6 sm:flex-row sm:flex-wrap">
							<Button
								className="h-10 flex-1 px-4 shadow-[0_0_32px_-8px_var(--catpuccin-pink)]"
								onClick={() => {
									stageBus.triggerPulse(1)
								}}
							>
								Pulse the stage
							</Button>
							<a
								href="/landings"
								className={cn(
									buttonVariants({ variant: "outline" }),
									"h-10 flex-1 border-white/15 px-4 no-underline",
								)}
							>
								All worlds →
							</a>
							<Button
								variant="ghost"
								className="h-10 sm:w-auto"
								onClick={() => onOpenChange(false)}
							>
								Close
							</Button>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	)
}
