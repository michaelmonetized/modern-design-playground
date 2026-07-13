import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
	useRouterState,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import Footer from "../components/Footer"
import Header from "../components/Header"

import ClerkProvider from "../integrations/clerk/provider"

import ConvexProvider from "../integrations/convex/provider"

import PostHogProvider from "../integrations/posthog/provider"

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"

import { TooltipProvider } from "#/components/ui/tooltip"
import { Toaster } from "#/components/ui/sonner"

import appCss from "../styles.css?url"

import type { QueryClient } from "@tanstack/react-query"

import type { TRPCRouter } from "#/integrations/trpc/router"
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query"

interface MyRouterContext {
	queryClient: QueryClient

	trpc: TRPCOptionsProxy<TRPCRouter>
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Modern Design Playground",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body className="bg-background text-foreground font-sans antialiased [overflow-wrap:anywhere]">
				<ClerkProvider>
					<ConvexProvider>
						<PostHogProvider>
							<TooltipProvider>
								<AppChrome>{children}</AppChrome>
								<Toaster />
								<TanStackDevtools
									config={{
										position: "bottom-right",
									}}
									plugins={[
										{
											name: "Tanstack Router",
											render: <TanStackRouterDevtoolsPanel />,
										},
										TanStackQueryDevtools,
									]}
								/>
							</TooltipProvider>
						</PostHogProvider>
					</ConvexProvider>
				</ClerkProvider>
				<Scripts />
			</body>
		</html>
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
