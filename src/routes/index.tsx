import { createFileRoute } from "@tanstack/react-router"
import { HomeExperience } from "#/components/home/HomeExperience"

export const Route = createFileRoute("/")({
	component: HomePage,
	head: () => ({
		meta: [
			{
				title: "Modern Design Playground — An instrument of scroll & light",
			},
			{
				name: "description",
				content:
					"A continuous WebGL stage: liquid glass core, image helix → tunnel, pointer gravity, GSAP choreography. Flagship-grade design system playground.",
			},
		],
	}),
})

function HomePage() {
	return <HomeExperience />
}
