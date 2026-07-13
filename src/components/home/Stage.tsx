import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sparkles, useTexture } from "@react-three/drei"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { GALLERY } from "#/lib/home/assets"
import { stage } from "#/lib/home/scroll-state"
import { decayPulse, stageBus } from "#/lib/home/stage-bus"

/**
 * Bulletproof cinematic stage.
 * Avoids custom GLSL (WebGL2 compile fragility) + heavy post stacks that
 * wiped alpha to 0. Uses drei materials + explicit opaque backdrop.
 * No remote Environment HDRI — it suspended/blanked the scene on 404.
 */

function CosmicBackdrop() {
	const mesh = useRef<THREE.Mesh>(null)
	const { viewport } = useThree()

	useFrame((state) => {
		const m = mesh.current
		if (!m) return
		stage.smooth += (stage.progress - stage.smooth) * 0.07
		const t = state.clock.elapsedTime
		const p = stage.smooth
		// Keep nebula billboard behind the camera through the full dolly
		const camZ = state.camera.position.z
		m.position.set(state.camera.position.x * 0.3, state.camera.position.y * 0.3, camZ - 14)
		m.scale.set(viewport.width * 2.4, viewport.height * 2.4, 1)
		const mat = m.material as THREE.ShaderMaterial
		if (mat.uniforms) {
			mat.uniforms.uTime.value = t
			mat.uniforms.uProgress.value = p
			mat.uniforms.uMouse.value.set(
				stage.pointer.x * 0.5 + 0.5,
				stage.pointer.y * 0.5 + 0.5,
			)
			mat.uniforms.uPulse.value = stageBus.pulse
		}
	})

	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uProgress: { value: 0 },
			uMouse: { value: new THREE.Vector2(0.5, 0.5) },
			uPulse: { value: 0 },
		}),
		[],
	)

	const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
	const fragmentShader = `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uProgress;
    uniform vec2 uMouse;
    uniform float uPulse;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
      vec2 u=f*f*(3.-2.*f);
      return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
    }
    float fbm(vec2 p){
      float v=0., a=.5;
      mat2 m=mat2(1.6,1.2,-1.2,1.6);
      for(int i=0;i<6;i++){ v+=a*noise(p); p=m*p; a*=.55; }
      return v;
    }

    void main(){
      vec2 uv = vUv;
      vec2 p = (uv - .5) * vec2(1.7, 1.0);
      vec2 m = (uMouse - .5) * vec2(1.7, 1.0);
      float t = uTime * .18;
      float pr = uProgress;
      float pulse = uPulse;

      // Deeper multi-domain warp — more motion & structure
      vec2 q = vec2(fbm(p*2.0+t), fbm(p*2.0+vec2(5.2,1.3)-t));
      vec2 r = vec2(
        fbm(p*2.5 + 3.4*q + vec2(1.7,9.2) + t*.7 + pr*2.4),
        fbm(p*2.5 + 3.4*q + vec2(8.3,2.8) - t*.5 + pr*1.2)
      );
      float n = fbm(p*2.8 + 2.6*r);

      float d = length(p - m);
      float well = exp(-d*d*10.0) * (1.0 + pulse*3.5);
      float streak = exp(-d*3.8) * length(uMouse-.5) * .28;
      n += well*.75 + streak + pulse*.55;

      // Dark cosmic field with saturated Catppuccin accents (no white blowout)
      vec3 deep   = vec3(0.07, 0.07, 0.12);
      vec3 mid    = vec3(0.13, 0.11, 0.22);
      vec3 mauve  = vec3(0.80, 0.64, 0.98);
      vec3 pink   = vec3(0.96, 0.74, 0.90);
      vec3 sapphire = vec3(0.48, 0.68, 0.98);
      vec3 teal   = vec3(0.36, 0.82, 0.80);
      vec3 peach  = vec3(0.98, 0.72, 0.55);

      float heat = smoothstep(0.08, 0.85, pr * 0.7 + n * 0.5);

      // Base nebula structure
      vec3 col = mix(deep, mid, smoothstep(0.0, 0.55, n));
      // Color washes — mix weight keeps luminance in check
      col = mix(col, mauve * 0.75, smoothstep(0.3, 0.72, n + pr*0.22) * 0.7);
      col = mix(col, pink * 0.8, smoothstep(0.5, 0.92, n + well*0.3) * 0.55);
      col = mix(col, sapphire * 0.7, smoothstep(0.55, 1.0, r.x*0.65 + n*0.4) * 0.55);
      col = mix(col, teal * 0.55, smoothstep(0.6, 1.0, r.y + pr*0.3) * 0.35 * heat);
      col = mix(col, peach * 0.6, heat * well * 0.35 + pulse * 0.2);

      // Filament ribbons
      float fil = smoothstep(0.45, 0.55, fract(n*5.2 + t + pr*1.2));
      col += fil * pink * (0.16 + pulse * 0.28);
      float fil2 = smoothstep(0.47, 0.53, fract(n*8.5 - t*1.3 + pr));
      col += fil2 * sapphire * (0.1 + pulse * 0.18);

      // Pulse flash — dramatic strike/resonate wash (still capped below type washout)
      col += mauve * pulse * 0.38;
      col += pink * pulse * pulse * 0.28;
      col += sapphire * pulse * 0.12;

      // Central field glow
      float coreGlow = exp(-length(p)*length(p)*1.6);
      col += mauve * coreGlow * (0.14 + pulse * 0.72 + pr * 0.08);
      col += sapphire * coreGlow * (0.05 + pulse * 0.22);
      col += pink * coreGlow * pulse * pulse * 0.35;

      // Vignette — dark edges, living center; pulse opens the well
      float vig = smoothstep(1.5, 0.18, length(p*vec2(0.82,1.05)));
      col *= mix(0.55, 1.12 + pulse * 0.18, vig);
      col += (hash(uv*vec2(900.)+t) - .5) * 0.035;

      // Soft floor so it's never pure black; soft ceiling so no white wash
      col = max(col, vec3(0.05, 0.05, 0.09));
      col *= 1.05 + pulse * 0.42 + pr * 0.1;
      // Keep headroom for hero type contrast; allow a brighter peak on full strike
      col = min(col, vec3(0.82 + pulse * 0.08, 0.74 + pulse * 0.06, 0.90));

      // OPAQUE — critical fix vs previous alpha wipe
      gl_FragColor = vec4(col, 1.0);
    }
  `

	return (
		<mesh ref={mesh} position={[0, 0, -14]} scale={[viewport.width * 2.4, viewport.height * 2.4, 1]}>
			<planeGeometry args={[1, 1]} />
			<shaderMaterial
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				depthWrite={false}
			/>
		</mesh>
	)
}

function Core() {
	const group = useRef<THREE.Group>(null)
	const shell = useRef<THREE.Mesh>(null)
	const wire = useRef<THREE.Mesh>(null)
	const wire2 = useRef<THREE.Mesh>(null)
	const inner = useRef<THREE.Mesh>(null)
	const lightA = useRef<THREE.PointLight>(null)
	const lightB = useRef<THREE.PointLight>(null)
	const sparkles = useRef<THREE.Points>(null)
	const pulseFlash = useRef(0)
	const modeBlend = useRef(0)
	const colorA = useMemo(() => new THREE.Color(), [])
	const colorB = useMemo(() => new THREE.Color(), [])

	useFrame((state, delta) => {
		decayPulse(delta)
		const g = group.current
		if (!g) return
		const t = state.clock.elapsedTime
		const p = stage.smooth
		const pulse = stageBus.pulse
		const mode = stageBus.material

		// Track sharp rising edges of pulse for extra flash — attack snaps hard
		pulseFlash.current = THREE.MathUtils.damp(
			pulseFlash.current,
			pulse,
			pulse > pulseFlash.current ? 28 : 2.8,
			delta,
		)
		const hit = Math.max(pulse, pulseFlash.current * 1.05)

		// Smooth material mode for transitions
		modeBlend.current = THREE.MathUtils.damp(modeBlend.current, mode, 5, delta)
		const mb = modeBlend.current

		const intro = 1 - THREE.MathUtils.smoothstep(p, 0, 0.18)
		const mid = THREE.MathUtils.smoothstep(p, 0.12, 0.5)
		const out = THREE.MathUtils.smoothstep(p, 0.65, 1)

		g.position.x = THREE.MathUtils.damp(
			g.position.x,
			stage.pointer.x * 0.55 + Math.sin(t * 0.4) * 0.12 + hit * stage.pointer.x * 0.2,
			4,
			delta,
		)
		g.position.y = THREE.MathUtils.damp(
			g.position.y,
			stage.pointer.y * 0.4 + Math.cos(t * 0.35) * 0.1 - mid * 0.55,
			4,
			delta,
		)
		g.position.z = THREE.MathUtils.damp(
			g.position.z,
			0.45 * intro - mid * 2.6 - out * 6.5 + hit * 0.35,
			3.2,
			delta,
		)
		// Pulse spins hard; scroll winds the core — strike reads as a violent kick
		g.rotation.y = t * 0.18 + p * Math.PI * 2.2 + hit * 3.6
		g.rotation.x = stage.pointer.y * 0.35 + Math.sin(t * 0.2) * 0.12 + hit * 0.65
		g.rotation.z = Math.sin(t * 0.15) * 0.08 + hit * 0.55 + p * 0.2

		// Keep core present but leave clear air for the early helix ring
		// Hit scale reads on strike without swallowing the whole hero frame
		const s =
			(0.72 + intro * 0.18 + mid * 0.2 + out * 0.12) *
			(1 + hit * 0.95 + pulse * pulse * 0.4)
		g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 6.5, delta))

		// Inner distort core — reacts to pulse + material
		if (inner.current) {
			const im = inner.current.material as THREE.MeshPhysicalMaterial & {
				distort?: number
				emissiveIntensity?: number
			}
			// MeshDistortMaterial exposes distort/speed on the material
			const distortMat = inner.current.material as unknown as {
				distort: number
				emissiveIntensity: number
				color: THREE.Color
				emissive: THREE.Color
				metalness: number
				roughness: number
			}
			distortMat.distort = THREE.MathUtils.damp(
				distortMat.distort ?? 0.45,
				0.38 + hit * 1.15 + mid * 0.15,
				7,
				delta,
			)
			distortMat.emissiveIntensity = THREE.MathUtils.damp(
				distortMat.emissiveIntensity ?? 0.45,
				0.55 + hit * 3.6 + intro * 0.25,
				10,
				delta,
			)

			// Mode-driven core palette
			if (mb < 0.5) {
				// glass → toward metal
				const k = mb * 2
				distortMat.color.lerpColors(
					colorA.set("#cba6f7"),
					colorB.set("#89b4fa"),
					k,
				)
				distortMat.emissive.lerpColors(
					colorA.set("#f5c2e7"),
					colorB.set("#74c7ec"),
					k,
				)
				distortMat.metalness = THREE.MathUtils.lerp(0.55, 0.95, k)
				distortMat.roughness = THREE.MathUtils.lerp(0.12, 0.2, k)
			} else {
				// metal → matte
				const k = (mb - 0.5) * 2
				distortMat.color.lerpColors(
					colorA.set("#89b4fa"),
					colorB.set("#f5c2e7"),
					k,
				)
				distortMat.emissive.lerpColors(
					colorA.set("#74c7ec"),
					colorB.set("#fab387"),
					k,
				)
				distortMat.metalness = THREE.MathUtils.lerp(0.95, 0.05, k)
				distortMat.roughness = THREE.MathUtils.lerp(0.2, 0.85, k)
			}
			void im
		}

		if (shell.current) {
			const sm = shell.current.material as THREE.MeshPhysicalMaterial
			shell.current.rotation.y = -t * 0.12 - hit * 0.8
			shell.current.rotation.x = hit * 0.3
			const shellScale = 1.55 + hit * 0.7
			shell.current.scale.setScalar(
				THREE.MathUtils.damp(shell.current.scale.x, shellScale, 7, delta),
			)

			if (mb < 0.5) {
				const k = mb * 2
				sm.color.lerpColors(colorA.set("#cba6f7"), colorB.set("#89b4fa"), k)
				sm.metalness = THREE.MathUtils.lerp(0.15, 1, k)
				sm.roughness = THREE.MathUtils.lerp(0.06, 0.12, k)
				sm.transmission = THREE.MathUtils.lerp(0.92, 0, k)
				sm.opacity = THREE.MathUtils.lerp(0.4, 0.92, k)
				sm.emissive = sm.emissive || new THREE.Color("#000000")
				sm.emissive.set(
					THREE.MathUtils.lerp(0.8, 0.2, k) * hit * 0.95,
					THREE.MathUtils.lerp(0.5, 0.4, k) * hit * 0.55,
					THREE.MathUtils.lerp(0.95, 0.9, k) * hit * 0.75,
				)
				sm.emissiveIntensity = hit * 2.6
			} else {
				const k = (mb - 0.5) * 2
				sm.color.lerpColors(colorA.set("#89b4fa"), colorB.set("#f5c2e7"), k)
				sm.metalness = THREE.MathUtils.lerp(1, 0, k)
				sm.roughness = THREE.MathUtils.lerp(0.12, 0.95, k)
				sm.transmission = 0
				sm.opacity = THREE.MathUtils.lerp(0.92, 0.98, k)
				sm.emissive.set(
					THREE.MathUtils.lerp(0.2, 0.95, k) * hit * 1.0,
					THREE.MathUtils.lerp(0.4, 0.55, k) * hit * 0.55,
					THREE.MathUtils.lerp(0.9, 0.7, k) * hit * 0.5,
				)
				sm.emissiveIntensity = hit * 3.0
			}
			sm.thickness = 1.2 + hit * 1.15
		}

		// Secondary wireframe cage — dramatic material-mode silhouette
		// glass: fine mauve lattice · metal: hard sapphire chrome · matte: soft peach volume
		if (wire.current) {
			const wm = wire.current.material as THREE.MeshBasicMaterial
			wire.current.rotation.y = t * 0.55 + hit * 1.8 + mb * 0.4
			wire.current.rotation.x = -t * 0.28 + Math.sin(t * 0.6) * 0.15 + hit * 0.5
			wire.current.rotation.z = Math.cos(t * 0.35) * 0.12 + p * 0.3
			// Glass tighter, metal expands, matte balloons softly
			const wireScale =
				(mb < 0.5
					? THREE.MathUtils.lerp(1.72, 1.95, mb * 2)
					: THREE.MathUtils.lerp(1.95, 2.25, (mb - 0.5) * 2)) +
				hit * 0.55 +
				Math.sin(t * 1.4) * 0.03
			wire.current.scale.setScalar(
				THREE.MathUtils.damp(wire.current.scale.x, wireScale, 6, delta),
			)
			if (mb < 0.5) {
				const k = mb * 2
				wm.color.lerpColors(colorA.set("#cba6f7"), colorB.set("#89b4fa"), k)
				wm.opacity = THREE.MathUtils.damp(
					wm.opacity,
					0.32 + hit * 0.55 + k * 0.18,
					8,
					delta,
				)
			} else {
				const k = (mb - 0.5) * 2
				wm.color.lerpColors(colorA.set("#89b4fa"), colorB.set("#fab387"), k)
				wm.opacity = THREE.MathUtils.damp(
					wm.opacity,
					0.5 + hit * 0.45 - k * 0.12,
					8,
					delta,
				)
			}
		}
		// Counter-rotating outer lattice for depth
		if (wire2.current) {
			const wm2 = wire2.current.material as THREE.MeshBasicMaterial
			wire2.current.rotation.y = -t * 0.38 - hit * 1.2
			wire2.current.rotation.x = t * 0.22 + hit * 0.35
			wire2.current.rotation.z = Math.sin(t * 0.5 + mb) * 0.2
			const s2 =
				(mb < 0.5
					? THREE.MathUtils.lerp(2.05, 2.35, mb * 2)
					: THREE.MathUtils.lerp(2.35, 2.65, (mb - 0.5) * 2)) +
				hit * 0.7
			wire2.current.scale.setScalar(
				THREE.MathUtils.damp(wire2.current.scale.x, s2, 5, delta),
			)
			if (mb < 0.5) {
				const k = mb * 2
				wm2.color.lerpColors(colorA.set("#f5c2e7"), colorB.set("#74c7ec"), k)
				wm2.opacity = THREE.MathUtils.damp(
					wm2.opacity,
					0.18 + hit * 0.4 + k * 0.12,
					8,
					delta,
				)
			} else {
				const k = (mb - 0.5) * 2
				wm2.color.lerpColors(colorA.set("#74c7ec"), colorB.set("#f5c2e7"), k)
				wm2.opacity = THREE.MathUtils.damp(
					wm2.opacity,
					0.28 + hit * 0.35 - k * 0.05,
					8,
					delta,
				)
			}
		}

		// Accent lights flare on pulse — punchy flash so the hit reads on camera
		// (Pass Q boosted base; BB keeps multipliers high + adds position kick)
		if (lightA.current) {
			lightA.current.intensity = 2.8 + hit * 20
			lightA.current.distance = 8 + hit * 15
		}
		if (lightB.current) {
			lightB.current.intensity = 2.2 + hit * 15
			lightB.current.distance = 10 + hit * 12
			lightB.current.position.x = 2 + Math.sin(t * 2 + hit * 4) * hit * 1.8
			lightB.current.position.y = -1 + hit * 0.6
		}
		if (sparkles.current) {
			sparkles.current.scale.setScalar(1 + hit * 0.9)
		}
	})

	return (
		<group ref={group}>
			<Float speed={1.5} rotationIntensity={0.45} floatIntensity={0.6}>
				<mesh ref={inner}>
					<icosahedronGeometry args={[1.25, 32]} />
					<MeshDistortMaterial
						color="#cba6f7"
						emissive="#f5c2e7"
						emissiveIntensity={0.65}
						distort={0.45}
						speed={2.4}
						roughness={0.12}
						metalness={0.55}
					/>
				</mesh>
				<mesh ref={shell} scale={1.55}>
					<icosahedronGeometry args={[1.25, 6]} />
					<meshPhysicalMaterial
						color="#cba6f7"
						transparent
						opacity={0.4}
						roughness={0.06}
						metalness={0.15}
						transmission={0.92}
						thickness={1.2}
						ior={1.45}
						emissive="#cba6f7"
						emissiveIntensity={0}
					/>
				</mesh>
				{/* Material-reactive wireframe cage (glass / metal / matte silhouette) */}
				<mesh ref={wire} scale={1.72}>
					<icosahedronGeometry args={[1.25, 2]} />
					<meshBasicMaterial
						color="#cba6f7"
						wireframe
						transparent
						opacity={0.38}
						depthWrite={false}
						toneMapped={false}
					/>
				</mesh>
				<mesh ref={wire2} scale={2.05}>
					<octahedronGeometry args={[1.25, 0]} />
					<meshBasicMaterial
						color="#f5c2e7"
						wireframe
						transparent
						opacity={0.22}
						depthWrite={false}
						toneMapped={false}
					/>
				</mesh>
			</Float>
			<Sparkles
				ref={sparkles}
				count={180}
				scale={7}
				size={3.5}
				speed={0.55}
				opacity={0.85}
				color="#f5c2e7"
			/>
			<pointLight ref={lightA} color="#f5c2e7" intensity={2.8} distance={8} />
			<pointLight
				ref={lightB}
				color="#89b4fa"
				intensity={2.2}
				distance={10}
				position={[2, -1, 2]}
			/>
		</group>
	)
}

function GalleryCard({
	index,
	url,
	total,
}: {
	index: number
	url: string
	total: number
}) {
	const tex = useTexture(url)
	// Helix planes are small on screen — mipmaps + modest anisotropy keep GPU cost down
	// without changing how the cards look at rest/fan.
	tex.colorSpace = THREE.SRGBColorSpace
	tex.generateMipmaps = true
	tex.minFilter = THREE.LinearMipmapLinearFilter
	tex.magFilter = THREE.LinearFilter
	tex.anisotropy = 4
	const mesh = useRef<THREE.Mesh>(null)

	useFrame((state, delta) => {
		const m = mesh.current
		if (!m) return
		const p = stage.smooth
		const t = state.clock.elapsedTime
		// Full helix fan by ~15% scroll; seed ring already readable at progress 0
		const fan = THREE.MathUtils.smoothstep(p, 0.0, 0.15)
		// Tunnel begins early so cards surround core mid-page
		const tunnel = THREE.MathUtils.smoothstep(p, 0.12, 0.7)
		const dissolve = THREE.MathUtils.smoothstep(p, 0.82, 1)
		const u = index / total
		// Mild stagger — never gate presence; all cards have strong base opacity
		const stagger = THREE.MathUtils.smoothstep(p, Math.max(0, u * 0.03), 0.04 + u * 0.08)
		const appear = THREE.MathUtils.clamp(0.88 + fan * 0.2 + stagger * 0.1, 0, 1.15)
		const angle = u * Math.PI * 2 + p * Math.PI * 2.8 + t * 0.07
		// Wider ring so cards sit around (not inside) the luminous core
		const radius = THREE.MathUtils.lerp(3.45, 4.15, fan)

		const hx = Math.cos(angle) * radius
		const hy =
			(u - 0.5) * THREE.MathUtils.lerp(2.15, 3.7, fan) +
			Math.sin(angle + t * 0.2) * 0.22
		// Closer to camera at rest so first paint reads as a ring of work
		const hz = -0.2 - u * 0.65 - (1 - fan) * 0.15

		const tz = -0.8 - u * 28 * tunnel - p * 8
		const tr = THREE.MathUtils.lerp(2.4, 3.1, tunnel)
		const tx = Math.cos(angle * 1.15) * tr
		const ty = Math.sin(angle * 1.15) * tr * 0.55

		const blend = tunnel
		const x = THREE.MathUtils.lerp(hx, tx, blend)
		const y = THREE.MathUtils.lerp(hy, ty, blend)
		const z = THREE.MathUtils.lerp(hz, tz, blend)

		const focused = stageBus.focus === index
		const pulse = stageBus.pulse
		m.position.x = THREE.MathUtils.damp(
			m.position.x,
			x + stage.pointer.x * 0.3 + (focused ? pulse * 0.15 : 0),
			4.2,
			delta,
		)
		m.position.y = THREE.MathUtils.damp(
			m.position.y,
			y + stage.pointer.y * 0.18,
			4.2,
			delta,
		)
		m.position.z = THREE.MathUtils.damp(m.position.z, z, 4.2, delta)
		m.lookAt(0, 0, m.position.z + 5)

		// Readable from first frame; brightens as fan/tunnel engage
		const vis = appear * (1 - dissolve * 0.92)
		const sc =
			(0.98 + fan * 0.48 + tunnel * 0.12) *
			(focused ? 1.4 : 1) *
			(1 + (focused ? pulse * 0.35 : 0) + pulse * 0.04)
		m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, Math.max(sc * vis, 0.4), 6, delta))
		const mat = m.material as THREE.MeshBasicMaterial
		// High base opacity so cards read through nebula even under hero type
		const targetOp = 0.78 + fan * 0.2 + (focused ? 0.12 : 0) + pulse * 0.06 - dissolve * 0.7
		mat.opacity = THREE.MathUtils.damp(mat.opacity, THREE.MathUtils.clamp(targetOp, 0.28, 1), 6, delta)
	})

	// Seed in a wide ring — first paint already shows the helix around the core
	const seedAngle = (index / total) * Math.PI * 2
	const seedR = 3.45
	const seedPos: [number, number, number] = [
		Math.cos(seedAngle) * seedR,
		(index / total - 0.5) * 2.15,
		-0.25 - (index / total) * 0.65,
	]

	return (
		<mesh ref={mesh} position={seedPos} scale={1.02}>
			<planeGeometry args={[3.05, 1.85]} />
			<meshBasicMaterial map={tex} transparent opacity={0.82} toneMapped={false} depthWrite={false} />
		</mesh>
	)
}

/**
 * Progressive helix textures: outer Scene Suspense no longer waits for all
 * 12 maps. Mount in batches + per-card Suspense so early ring cards
 * (smaller PNGs/WebPs) paint first; heavy walkway/headshot arrive shortly after.
 * Pass R: initial batch 8 so first ~4s always shows a full-looking ring.
 * Visual: same seed ring — missing indices simply aren't present until ready.
 */
function Gallery() {
	const total = GALLERY.length
	const [count, setCount] = useState(() => Math.min(8, total))

	useEffect(() => {
		if (count >= total) return
		const timer = window.setTimeout(() => {
			setCount((c) => Math.min(total, c + 2))
		}, 90)
		return () => window.clearTimeout(timer)
	}, [count, total])

	return (
		<group>
			{GALLERY.slice(0, count).map((item, i) => (
				<Suspense key={item.src} fallback={null}>
					<GalleryCard index={i} url={item.src} total={total} />
				</Suspense>
			))}
		</group>
	)
}

/** Orbital rings + pulse shockwaves — pure three.js, no post stack */
function Orbitals() {
	const a = useRef<THREE.Mesh>(null)
	const b = useRef<THREE.Mesh>(null)
	const c = useRef<THREE.Mesh>(null)
	const wave = useRef<THREE.Mesh>(null)
	const wave2 = useRef<THREE.Mesh>(null)
	const lastPulse = useRef(0)
	const waveT = useRef(0)
	const waveT2 = useRef(0)

	useFrame((state, delta) => {
		const t = state.clock.elapsedTime
		const p = stage.smooth
		const pulse = stageBus.pulse
		if (pulse > lastPulse.current + 0.15) {
			if (waveT.current > 0.4) waveT2.current = 0
			else waveT.current = 0
		}
		lastPulse.current = pulse
		waveT.current = Math.min(2.2, waveT.current + delta * (1.1 + pulse))
		waveT2.current = Math.min(2.2, waveT2.current + delta * 0.95)

		if (a.current) {
			a.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.2) * 0.08
			a.current.rotation.z = t * 0.18 + p * 1.2
			const s = 2.1 + pulse * 0.85 + Math.sin(t * 0.5) * 0.05
			a.current.scale.setScalar(s)
			const mat = a.current.material as THREE.MeshBasicMaterial
			mat.opacity = 0.22 + pulse * 0.7
		}
		if (b.current) {
			b.current.rotation.x = Math.PI / 2.1
			b.current.rotation.y = -t * 0.12 + p
			b.current.rotation.z = t * 0.08
			b.current.scale.setScalar(2.85 + pulse * 0.65)
			const mat = b.current.material as THREE.MeshBasicMaterial
			mat.opacity = 0.14 + pulse * 0.5
		}
		if (c.current) {
			c.current.rotation.x = Math.PI / 3 + p * 0.4
			c.current.rotation.z = -t * 0.22
			c.current.scale.setScalar(3.5 + Math.sin(t * 0.4) * 0.1 + pulse * 0.85)
			const mat = c.current.material as THREE.MeshBasicMaterial
			mat.opacity = 0.1 + pulse * 0.42
		}
		const applyWave = (mesh: THREE.Mesh | null, age: number, colorBoost: number) => {
			if (!mesh) return
			const life = age / 2.0
			const s = 0.4 + life * 9.5
			mesh.scale.setScalar(s)
			mesh.lookAt(state.camera.position)
			const mat = mesh.material as THREE.MeshBasicMaterial
			mat.opacity = Math.max(
				0,
				(1 - life) * (0.7 + colorBoost * 0.4) * Math.min(1, pulse * 2.4 + 0.2),
			)
			mesh.visible = life < 1 && mat.opacity > 0.02
		}
		applyWave(wave.current, waveT.current, 1)
		applyWave(wave2.current, waveT2.current, 0.5)
	})

	return (
		<group>
			<mesh ref={a} rotation={[Math.PI / 2.4, 0, 0]}>
				<torusGeometry args={[1, 0.012, 12, 128]} />
				<meshBasicMaterial color="#cba6f7" transparent opacity={0.25} depthWrite={false} />
			</mesh>
			<mesh ref={b} rotation={[Math.PI / 2.1, 0.4, 0]}>
				<torusGeometry args={[1, 0.008, 10, 96]} />
				<meshBasicMaterial color="#89b4fa" transparent opacity={0.16} depthWrite={false} />
			</mesh>
			<mesh ref={c} rotation={[Math.PI / 3, 0, 0.5]}>
				<torusGeometry args={[1, 0.006, 8, 80]} />
				<meshBasicMaterial color="#f5c2e7" transparent opacity={0.12} depthWrite={false} />
			</mesh>
			<mesh ref={wave} visible={false}>
				<ringGeometry args={[0.92, 1, 64]} />
				<meshBasicMaterial color="#f5c2e7" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
			</mesh>
			<mesh ref={wave2} visible={false}>
				<ringGeometry args={[0.92, 1, 64]} />
				<meshBasicMaterial color="#89b4fa" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
			</mesh>
		</group>
	)
}

/**
 * Pointer energy ribbon in WebGL — samples stage.pointer into a fading
 * polyline that feeds the core, flares on stageBus.pulse.
 * Uses primitive THREE.Line (R3F `line` collides with SVG).
 */
function EnergyTrail() {
	const TRAIL = 48
	const lineObj = useMemo(() => {
		const geom = new THREE.BufferGeometry()
		const pos = new Float32Array(TRAIL * 3)
		geom.setAttribute("position", new THREE.BufferAttribute(pos, 3))
		const mat = new THREE.LineBasicMaterial({
			color: new THREE.Color("#f5c2e7"),
			transparent: true,
			opacity: 0.35,
			depthWrite: false,
			toneMapped: false,
			blending: THREE.AdditiveBlending,
		})
		return new THREE.Line(geom, mat)
	}, [])
	const glowRef = useRef<THREE.Points>(null)
	const history = useRef<THREE.Vector3[]>(
		Array.from({ length: TRAIL }, () => new THREE.Vector3(0, 0, 0.5)),
	)
	const seeded = useRef(false)
	const glowPos = useMemo(() => new Float32Array(TRAIL * 3), [])
	const tmp = useMemo(() => new THREE.Vector3(), [])

	useFrame((state, delta) => {
		const line = lineObj
		const t = state.clock.elapsedTime
		const pulse = stageBus.pulse
		const p = stage.smooth
		// Map pointer NDC into a plane near the core / camera mid-field
		const camZ = state.camera.position.z
		const depth = THREE.MathUtils.lerp(camZ - 3.2, camZ - 5.5, p * 0.4)
		const spread = 2.6 + pulse * 0.8
		tmp.set(
			stage.pointer.x * spread + Math.sin(t * 2.2) * 0.04 * pulse,
			stage.pointer.y * spread * 0.72 + Math.cos(t * 1.8) * 0.03,
			depth + stage.pointer.x * stage.pointer.y * 0.3,
		)

		const hist = history.current
		if (!seeded.current) {
			for (let i = 0; i < TRAIL; i++) hist[i].copy(tmp)
			seeded.current = true
		}

		// Shift trail; head chases pointer with velocity kick
		for (let i = TRAIL - 1; i > 0; i--) {
			hist[i].lerp(hist[i - 1], THREE.MathUtils.clamp(delta * 18, 0, 1))
		}
		hist[0].lerp(tmp, THREE.MathUtils.clamp(0.35 + pulse * 0.45, 0, 1))
		// Velocity bleed
		hist[0].x += stage.velocity.x * 0.35
		hist[0].y += stage.velocity.y * 0.28

		const posAttr = line.geometry.attributes.position as THREE.BufferAttribute
		const arr = posAttr.array as Float32Array
		for (let i = 0; i < TRAIL; i++) {
			const v = hist[i]
			arr[i * 3] = v.x
			arr[i * 3 + 1] = v.y
			arr[i * 3 + 2] = v.z
			glowPos[i * 3] = v.x
			glowPos[i * 3 + 1] = v.y
			glowPos[i * 3 + 2] = v.z
		}
		posAttr.needsUpdate = true

		const mat = line.material as THREE.LineBasicMaterial
		const speed = Math.hypot(stage.velocity.x, stage.velocity.y)
		mat.opacity = THREE.MathUtils.damp(
			mat.opacity,
			0.22 + Math.min(speed * 2.2, 0.45) + pulse * 0.55,
			10,
			delta,
		)
		// Material-mode tint
		const mode = stageBus.material
		if (mode === 0) mat.color.set("#f5c2e7")
		else if (mode === 1) mat.color.set("#89b4fa")
		else mat.color.set("#fab387")

		if (glowRef.current) {
			const gAttr = glowRef.current.geometry.attributes
				.position as THREE.BufferAttribute
			;(gAttr.array as Float32Array).set(glowPos)
			gAttr.needsUpdate = true
			const gm = glowRef.current.material as THREE.PointsMaterial
			gm.opacity = mat.opacity * 0.85
			gm.size = 0.06 + pulse * 0.1 + Math.min(speed * 0.08, 0.06)
			gm.color.copy(mat.color)
		}
	})

	return (
		<group>
			<primitive object={lineObj} />
			<points ref={glowRef}>
				<bufferGeometry>
					<bufferAttribute attach="attributes-position" args={[glowPos, 3]} />
				</bufferGeometry>
				<pointsMaterial
					color="#f5c2e7"
					size={0.07}
					transparent
					opacity={0.3}
					depthWrite={false}
					sizeAttenuation
					toneMapped={false}
					blending={THREE.AdditiveBlending}
				/>
			</points>
		</group>
	)
}

/** Soft starfield dust that drifts with scroll */
function DustField() {
	const ref = useRef<THREE.Points>(null)
	const positions = useMemo(() => {
		const n = 600
		const arr = new Float32Array(n * 3)
		for (let i = 0; i < n; i++) {
			const r = 4 + Math.random() * 14
			const theta = Math.random() * Math.PI * 2
			const phi = Math.acos(2 * Math.random() - 1)
			arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
			arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
			arr[i * 3 + 2] = r * Math.cos(phi) - 4
		}
		return arr
	}, [])

	useFrame((state) => {
		const pts = ref.current
		if (!pts) return
		const t = state.clock.elapsedTime
		const p = stage.smooth
		pts.rotation.y = t * 0.02 + p * 0.4
		pts.rotation.x = Math.sin(t * 0.05) * 0.05
		pts.position.z = -p * 6
		const mat = pts.material as THREE.PointsMaterial
		mat.opacity = 0.35 + stageBus.pulse * 0.55
		mat.size = 0.035 + stageBus.pulse * 0.07
	})

	return (
		<points ref={ref}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" args={[positions, 3]} />
			</bufferGeometry>
			<pointsMaterial
				color="#cba6f7"
				size={0.04}
				transparent
				opacity={0.4}
				depthWrite={false}
				sizeAttenuation
			/>
		</points>
	)
}

/** Scene lights swell on stageBus.pulse so strike/resonate wash the whole field */
function PulseLights() {
	const amb = useRef<THREE.AmbientLight>(null)
	const dir = useRef<THREE.DirectionalLight>(null)
	const fill = useRef<THREE.PointLight>(null)

	useFrame((_, delta) => {
		const pulse = stageBus.pulse
		if (amb.current) {
			amb.current.intensity = THREE.MathUtils.damp(
				amb.current.intensity,
				0.72 + pulse * 0.85,
				10,
				delta,
			)
		}
		if (dir.current) {
			dir.current.intensity = THREE.MathUtils.damp(
				dir.current.intensity,
				1.95 + pulse * 2.4,
				10,
				delta,
			)
		}
		if (fill.current) {
			fill.current.intensity = THREE.MathUtils.damp(
				fill.current.intensity,
				2.6 + pulse * 4.5,
				12,
				delta,
			)
		}
	})

	return (
		<>
			<ambientLight ref={amb} intensity={0.72} />
			<directionalLight
				ref={dir}
				position={[5, 8, 4]}
				intensity={1.95}
				color="#f5e0dc"
			/>
			<pointLight
				ref={fill}
				position={[-5, -2, 3]}
				intensity={2.6}
				color="#89b4fa"
			/>
		</>
	)
}

function CameraRig() {
	const baseFov = useRef(42)

	useFrame((state, delta) => {
		const p = stage.smooth
		const cam = state.camera as THREE.PerspectiveCamera
		const pulse = stageBus.pulse
		const t = state.clock.elapsedTime

		// Dramatic multi-phase dolly: hold → dive past core → tunnel rush → pull-through
		const dive = THREE.MathUtils.smoothstep(p, 0.08, 0.45)
		const rush = THREE.MathUtils.smoothstep(p, 0.4, 0.85)
		const exit = THREE.MathUtils.smoothstep(p, 0.78, 1)

		const z =
			THREE.MathUtils.lerp(6.2, 2.4, dive) +
			THREE.MathUtils.lerp(0, -14, rush) +
			THREE.MathUtils.lerp(0, -6, exit) +
			// Pulse kicks camera forward into the core (dramatic strike read)
			pulse * 0.55

		// Arc: rise into mid-field, then drop into the tunnel throat
		const y =
			0.15 +
			Math.sin(p * Math.PI) * 0.85 +
			Math.sin(p * Math.PI * 2) * 0.25 -
			rush * 0.35 +
			stage.pointer.y * 0.2 +
			pulse * 0.08

		const xTarget =
			stage.pointer.x * (0.55 + dive * 0.35) +
			Math.sin(p * Math.PI * 1.5) * 0.55 +
			Math.sin(t * 0.25) * 0.04 +
			pulse * stage.pointer.x * 0.18

		cam.position.x = THREE.MathUtils.damp(cam.position.x, xTarget, 2.8, delta)
		cam.position.y = THREE.MathUtils.damp(cam.position.y, y, 2.8, delta)
		cam.position.z = THREE.MathUtils.damp(cam.position.z, z, 2.4, delta)

		// FOV punch: widen as we enter tunnel, tighten on exit, kick on pulse
		const fovTarget =
			baseFov.current + dive * 6 + rush * 14 - exit * 8 + pulse * 10
		cam.fov = THREE.MathUtils.damp(cam.fov, fovTarget, 3.6, delta)
		cam.updateProjectionMatrix()

		// Dutch roll through the field — pulse tilts harder
		const roll = Math.sin(p * Math.PI * 2) * 0.12 + pulse * 0.14 * stage.pointer.x
		cam.rotation.z = THREE.MathUtils.damp(cam.rotation.z, roll, 3, delta)

		const lookZ = z - 4.5 - rush * 3
		const lookY = stage.pointer.y * 0.2 + Math.sin(p * Math.PI) * 0.15
		const lookX = stage.pointer.x * 0.4 + Math.sin(p * Math.PI) * 0.2
		// Preserve roll by looking then re-applying z rotation
		cam.lookAt(lookX, lookY, lookZ)
		cam.rotation.z += roll * 0.35
	})
	return null
}

function Scene() {
	return (
		<>
			{/* Solid clear so we never get empty transparent frame */}
			<color attach="background" args={["#11111b"]} />
			{/* Distant fog so near-ring helix cards stay crisp at progress 0 */}
			<fog attach="fog" args={["#13131f", 18, 52]} />
			<CosmicBackdrop />
			<DustField />
			<PulseLights />
			<pointLight position={[0, 3, -4]} intensity={1.6} color="#cba6f7" />
			<pointLight position={[3, 1, -6]} intensity={1.2} color="#f5c2e7" />
			<Core />
			<Orbitals />
			<EnergyTrail />
			{/* No remote Environment HDRI — local lights only.
			    Gallery self-manages per-card Suspense + staggered mount. */}
			<Gallery />
			<CameraRig />
		</>
	)
}

export function Stage() {
	return (
		<div
			className="pointer-events-none fixed inset-0 z-0"
			style={{ width: "100vw", height: "100dvh" }}
			data-engine="r3f"
			aria-hidden
		>
			<Canvas
				dpr={[1, 1.75]}
				camera={{ position: [0, 0.2, 6.2], fov: 42, near: 0.1, far: 100 }}
				gl={{
					antialias: true,
					alpha: false,
					powerPreference: "high-performance",
					toneMapping: THREE.ACESFilmicToneMapping,
					outputColorSpace: THREE.SRGBColorSpace,
				}}
				onCreated={({ gl }) => {
					gl.setClearColor("#11111b", 1)
				}}
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					background: "#11111b",
				}}
			>
				<Scene />
			</Canvas>
		</div>
	)
}
