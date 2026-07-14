import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

import type { ReactNode } from "react"
import TanstackQueryProvider, {
	getContext,
} from "./integrations/tanstack-query/root-provider"

export function getRouter() {
	const context = getContext()

	const router = createTanStackRouter({
		routeTree,
		context,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,

		Wrap: (props: { children: ReactNode }) => {
			return (
				<TanstackQueryProvider context={context}>
					{props.children}
				</TanstackQueryProvider>
			)
		},
	})

	return router
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
