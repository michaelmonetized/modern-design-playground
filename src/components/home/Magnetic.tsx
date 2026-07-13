import { motion, useMotionValue, useSpring } from "motion/react"
import { useRef, type MouseEvent, type ReactNode } from "react"
import { cn } from "#/lib/utils"

type Props = {
	children: ReactNode
	strength?: number
	className?: string
}

export function Magnetic({ children, strength = 0.35, className }: Props) {
	const ref = useRef<HTMLDivElement>(null)
	const x = useMotionValue(0)
	const y = useMotionValue(0)
	const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.35 })
	const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.35 })

	const onMove = (e: MouseEvent) => {
		const el = ref.current
		if (!el) return
		const r = el.getBoundingClientRect()
		const dx = e.clientX - (r.left + r.width / 2)
		const dy = e.clientY - (r.top + r.height / 2)
		x.set(dx * strength)
		y.set(dy * strength)
	}

	const onLeave = () => {
		x.set(0)
		y.set(0)
	}

	return (
		<motion.div
			ref={ref}
			data-cursor="hover"
			onMouseMove={onMove}
			onMouseLeave={onLeave}
			style={{ x: sx, y: sy }}
			className={cn("inline-flex will-change-transform", className)}
		>
			{children}
		</motion.div>
	)
}
