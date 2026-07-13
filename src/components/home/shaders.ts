/** Fullscreen background — volumetric ribbons + pointer gravity wells */
export const BG_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const BG_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uProgress;
uniform vec2 uPointer;
uniform vec2 uVelocity;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uColorD;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.7, 1.2, -1.2, 1.7);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = m * p + 0.13;
    a *= 0.55;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(1.6, 1.0);
  vec2 m = uPointer * vec2(0.85, 0.55);
  float t = uTime * 0.12;
  float pr = uProgress;

  // Multi-domain warp that evolves with scroll chapter
  float warp = 1.6 + pr * 2.4;
  vec2 q = vec2(
    fbm(p * warp + t + pr * 2.0),
    fbm(p * warp + vec2(5.2, 1.3) - t * 0.8)
  );
  vec2 r = vec2(
    fbm(p * 2.1 + 3.5 * q + vec2(1.7, 9.2) + t * 0.5),
    fbm(p * 2.1 + 3.5 * q + vec2(8.3, 2.8) - t * 0.35 + pr)
  );
  float n = fbm(p * 2.8 + 2.8 * r);

  // Pointer gravity + velocity streaks
  float d = length(p - m);
  float well = exp(-d * d * 14.0);
  float streak = exp(-d * 5.5) * length(uVelocity) * 2.2;
  n += well * 0.55 + streak;

  // Scroll morph: cooler depths → hotter filaments
  vec3 deep = mix(uColorD, uColorC, smoothstep(0.15, 0.75, n));
  vec3 hot = mix(uColorB, uColorA, smoothstep(0.4, 0.95, n + well * 0.25));
  float heat = smoothstep(0.2, 0.9, pr * 0.65 + n * 0.55);
  vec3 col = mix(deep, hot, heat);

  // Filament lines
  float filaments = smoothstep(0.48, 0.52, fract(n * 4.0 + pr));
  col += filaments * uColorA * 0.08;

  // Vignette + grain
  float vig = smoothstep(1.35, 0.15, length(p * vec2(0.9, 1.1)));
  float grain = (hash(uv * 900.0 + t) - 0.5) * 0.04;
  col = col * vig + grain;

  float alpha = 0.72 + well * 0.2;
  gl_FragColor = vec4(col, alpha);
}
`

/** Liquid glass shell — fresnel + iridescence driven by view + pointer */
export const GLASS_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorld;
varying vec3 vView;
uniform float uTime;
uniform float uDistort;
uniform vec2 uPointer;

// simplex-ish cheap noise
float n3(vec3 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

void main() {
  vec3 pos = position;
  float t = uTime * 0.8;
  float d = n3(normal * 2.5 + t) * uDistort;
  d += n3(normal * 5.0 - t * 1.3) * uDistort * 0.45;
  // pointer pulls surface
  d += dot(normal.xy, uPointer) * 0.08;
  pos += normal * d;

  vec4 world = modelMatrix * vec4(pos, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

export const GLASS_FRAG = /* glsl */ `
precision highp float;
varying vec3 vNormal;
varying vec3 vWorld;
varying vec3 vView;
uniform float uTime;
uniform float uProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.8);

  float band = 0.5 + 0.5 * sin(uTime * 0.7 + N.x * 4.0 + N.y * 3.0 + uProgress * 6.0);
  vec3 irid = mix(uColorA, uColorB, band);
  irid = mix(irid, uColorC, fres);

  float rim = smoothstep(0.2, 1.0, fres);
  vec3 col = irid * (0.35 + rim * 1.4);
  col += fres * fres * uColorA * 0.8;

  float alpha = 0.18 + fres * 0.65;
  gl_FragColor = vec4(col, alpha);
}
`
