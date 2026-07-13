/** Shared bridge between DOM scroll/pointer and the WebGL stage (no React re-renders). */
export const stage = {
	/** 0–1 page scroll progress */
	progress: 0,
	/** smoothed progress */
	smooth: 0,
	/** pointer NDC-ish −1…1 */
	pointer: { x: 0, y: 0 },
	/** pointer velocity */
	velocity: { x: 0, y: 0 },
	/** viewport */
	vw: 1,
	vh: 1,
	/** reduced motion */
	reduce: false,
}

export function setProgress(p: number) {
	stage.progress = Math.min(1, Math.max(0, p))
}

export function setPointer(nx: number, ny: number) {
	const x = nx * 2 - 1
	const y = -(ny * 2 - 1)
	stage.velocity.x = x - stage.pointer.x
	stage.velocity.y = y - stage.pointer.y
	stage.pointer.x = x
	stage.pointer.y = y
}
