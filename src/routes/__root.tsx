import {
	Outlet,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router"
import Footer from "../components/Footer"
import Header from "../components/Header"

import ClerkProvider from "../integrations/clerk/provider"

import ConvexProvider from "../integrations/convex/provider"

import PostHogProvider from "../integrations/posthog/provider"

import { TooltipProvider } from "#/components/ui/tooltip"
import { Toaster } from "#/components/ui/sonner"

import type { QueryClient } from "@tanstack/react-query"

import type { TRPCRouter } from "#/integrations/trpc/router"
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query"

interface MyRouterContext {
	queryClient: QueryClient

	trpc: TRPCOptionsProxy<TRPCRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootLayout,
})

function RootLayout() {
	return (
		<ClerkProvider>
			<ConvexProvider>
				<PostHogProvider>
					<TooltipProvider>
						<AppChrome>
							<Outlet />
						</AppChrome>
						<Toaster />
					</TooltipProvider>
				</PostHogProvider>
			</ConvexProvider>
		</ClerkProvider>
	)
}

function AppChrome({ children }: { children: React.ReactNode }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname })
	// Immersive full-bleed experiences: instrument home + landing gallery/worlds
	const isImmersive =
		pathname === "/" ||
		pathname === "/landings" ||
		pathname.startsWith("/landings/")

	if (isImmersive) {
		return <div className="min-h-dvh">{children}</div>
	}

	return (
		<div className="flex min-h-dvh flex-col">
			<Header />
			<div className="flex-1">{children}</div>
			<Footer />
		</div>
	)
}
