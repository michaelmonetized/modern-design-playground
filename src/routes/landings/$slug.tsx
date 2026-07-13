import { createFileRoute, notFound } from "@tanstack/react-router"
import { LANDINGS } from "#/lib/home/assets"
import { LANDING_PAGES } from "#/components/landings/pages"

export const Route = createFileRoute("/landings/$slug")({
	component: LandingBySlug,
	loader: ({ params }) => {
		const meta = LANDINGS.find((l) => l.slug === params.slug)
		if (!meta || !LANDING_PAGES[params.slug]) throw notFound()
		return meta
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData ? `${loaderData.title} — Landing Gallery` : "Landing",
			},
		],
	}),
})

function LandingBySlug() {
	const { slug } = Route.useParams()
	const Page = LANDING_PAGES[slug]
	if (!Page) return null
	return <Page />
}
