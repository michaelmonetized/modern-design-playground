import { stage } from "./scroll-state"

type Listener = () => void

/** Imperative pulses the WebGL stage can subscribe to (clicks from DOM). */
export const stageBus = {
	/** 0–1 burst energy */
	pulse: 0,
	/** material mode: 0 glass, 1 metal, 2 matte */
	material: 0,
	/** selected gallery index or -1 */
	focus: -1,
	_listeners: new Set<Listener>(),

	emit() {
		for (const l of this._listeners) l()
	},
	subscribe(fn: Listener) {
		this._listeners.add(fn)
		return () => this._listeners.delete(fn)
	},
	triggerPulse(strength = 1) {
		this.pulse = Math.min(1, this.pulse + strength)
		this.emit()
	},
	cycleMaterial() {
		this.material = (this.material + 1) % 3
		this.triggerPulse(0.45)
		this.emit()
	},
	setMaterial(mode: 0 | 1 | 2) {
		this.material = mode
		this.triggerPulse(0.45)
		this.emit()
	},
	setFocus(index: number) {
		this.focus = index
		this.triggerPulse(0.35)
		this.emit()
	},
	clearFocus() {
		this.focus = -1
		this.emit()
	},
}

// Decay pulse each frame from r3f
// Slightly slower than 0.85 so strike/resonate flashes linger on camera
export function decayPulse(delta: number) {
	if (stageBus.pulse > 0) {
		stageBus.pulse = Math.max(0, stageBus.pulse - delta * 0.72)
	}
	// slight pointer energy bleed into stage for feedback
	stage.velocity.x += (Math.random() - 0.5) * stageBus.pulse * 0.028
	stage.velocity.y += (Math.random() - 0.5) * stageBus.pulse * 0.028
}
