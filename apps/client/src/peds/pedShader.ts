/**
 * GLSL for procedural pedestrian animation (vertex) and procedural clothing/face colouring (fragment).
 * Injected into MeshStandardMaterial / MeshDepthMaterial / MeshDistanceMaterial via onBeforeCompile.
 */
import { PIVOT } from './pedGeometry';

const v3 = (p: readonly number[]) => `vec3(${p.map((x) => x.toFixed(5)).join(', ')})`;

export const PED_VERTEX_PARS = /* glsl */ `
attribute vec4 aPart;
attribute vec4 aMeta;
attribute vec3 aAlt;
attribute vec4 iAnim;
attribute vec4 iAnimPrev;
attribute vec4 iLook;
attribute vec4 iColors0;
attribute vec4 iColors1;
attribute vec4 iColors2;
uniform float uTime;

#ifdef PED_COLOR
varying vec3 vPedRest;
varying float vPedAO;
flat varying float vPedSlot;
flat varying vec4 vPedC0;
flat varying vec4 vPedC1;
flat varying vec4 vPedC2;
#endif

#define PED_PI 3.14159265
#define PED_TAU 6.28318531

const vec3 P_ROOT = ${v3(PIVOT.root)};
const vec3 P_SPINE = ${v3(PIVOT.spine)};
const vec3 P_NECK = ${v3(PIVOT.neck)};
const vec3 P_SH = ${v3(PIVOT.shoulder)};
const vec3 P_EL = ${v3(PIVOT.elbow)};
const vec3 P_WR = ${v3(PIVOT.wrist)};
const vec3 P_HIP = ${v3(PIVOT.hip)};
const vec3 P_KNEE = ${v3(PIVOT.knee)};
const vec3 P_ANK = ${v3(PIVOT.ankle)};
const vec3 P_GRIP = ${v3(PIVOT.grip)};
const float HEAD_TOP = ${PIVOT.headTop.toFixed(4)};

mat3 pedRotX(float a) { float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }
mat3 pedRotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
mat3 pedRotZ(float a) { float c = cos(a), s = sin(a); return mat3(c, s, 0., -s, c, 0., 0., 0., 1.); }
mat3 pedEul(vec3 e) { return pedRotY(e.y) * pedRotX(e.x) * pedRotZ(e.z); }
// limb rotation: flex (forward swing), twist, abduction (away from the body); side = +1 left, -1 right
mat3 pedLimb(float flex, float twist, float abd, float side) { return pedRotZ(side * abd) * pedRotX(-flex) * pedRotY(side * twist); }
float pedBump(float x, float c, float w) { float d = fract(x - c + 0.5) - 0.5; return exp(-(d * d) / (w * w)); }
mat3 pedOrtho(mat3 m) { vec3 x = normalize(m[0]); vec3 y = normalize(m[1] - x * dot(x, m[1])); return mat3(x, y, cross(x, y)); }

// ------------------------------------------------------------------------------------------------ body morph
struct PedBody {
  float H, Hb, Sh, Lg, W, F, A;
  float latHip, latWaist, latChest, latSh, latNeck, dBack;
  float armG, legG, legGz, armDX, legDX;
  vec3 root, spine, neck, sh, el, wr, hip, knee, ank, grip; // morphed pivots (left side)
};

float pedLatAt(PedBody B, float y) {
  float s = mix(B.latHip, B.latWaist, smoothstep(0.95, 1.07, y));
  s = mix(s, B.latChest, smoothstep(1.07, 1.25, y));
  s = mix(s, B.latSh, smoothstep(1.28, 1.42, y));
  return mix(s, B.latNeck, smoothstep(1.44, 1.52, y));
}

vec3 pedMorphCentral(PedBody B, vec3 p, inout vec3 n) {
  float L = pedLatAt(B, p.y);
  float bel = exp(-pow((p.y - 1.05) / 0.12, 2.));
  float df = B.dBack * (1. + (B.W - 1.) * 1.5 * bel);
  float d = mix(B.dBack, df, smoothstep(-0.02, 0.03, p.z));
  vec3 q = vec3(p.x * L, p.y * B.Hb, p.z * d);
  float bust = B.F * 0.03 * exp(-pow((p.y - 1.27) / 0.065, 2.)) * smoothstep(0.0, 0.07, p.z)
             * exp(-pow((abs(p.x) - 0.07) / 0.065, 2.));
  float glute = B.F * 0.016 * exp(-pow((p.y - 0.9) / 0.07, 2.)) * smoothstep(0.0, 0.07, -p.z);
  q.z += (bust - glute) * B.Lg;
  n = normalize(n / vec3(L, B.Hb, d));
  return q;
}

vec3 pedHeadScale(PedBody B) { return vec3(B.Sh * (1. + 0.12 * (B.W - 1.)) * (1. - 0.04 * B.F), B.Sh, B.Sh * (1. - 0.03 * B.F)); }

vec3 pedMorphArm(PedBody B, vec3 p, float side) {
  vec3 q = vec3(p.x * side, p.y, p.z);
  float t = (P_SH.y - q.y) / (P_SH.y - P_WR.y);
  vec2 ax = mix(P_SH.xz, P_WR.xz, t);
  vec3 r = vec3(ax.x + B.armDX + (q.x - ax.x) * B.armG, q.y * B.Hb, ax.y + (q.z - ax.y) * B.armG);
  r.x *= side;
  return r;
}
vec3 pedMorphLeg(PedBody B, vec3 p, float side) {
  vec3 q = vec3(p.x * side, p.y, p.z);
  float t = (P_HIP.y - q.y) / (P_HIP.y - P_ANK.y);
  vec2 ax = mix(P_HIP.xz, P_ANK.xz, t);
  vec3 r = vec3(ax.x + B.legDX + (q.x - ax.x) * B.legG, q.y * B.Hb, ax.y + (q.z - ax.y) * B.legGz);
  r.x *= side;
  return r;
}
vec3 pedMorphFoot(PedBody B, vec3 p, float side) {
  vec3 q = vec3(p.x * side, p.y, p.z);
  float fw = B.Lg * (1. + 0.25 * (B.W - 1.)) * (1. - 0.08 * B.F);
  float fl = B.Hb * (1. - 0.07 * B.F);
  vec3 r = vec3(P_ANK.x + B.legDX + (q.x - P_ANK.x) * fw, q.y * B.Hb, P_ANK.z + (q.z - P_ANK.z) * fl);
  r.x *= side;
  return r;
}

PedBody pedMakeBody(vec4 look) {
  PedBody B;
  B.H = look.x; B.W = look.y; B.F = look.z; B.A = look.w;
  B.Sh = pow(B.H, 0.45);
  B.Hb = (HEAD_TOP * B.H - (HEAD_TOP - P_NECK.y) * B.Sh) / P_NECK.y;
  B.Lg = pow(B.H, 0.7);
  float w = B.W - 1.;
  B.latHip = B.Lg * (1. + 0.75 * w) * (1. + 0.09 * B.F);
  B.latWaist = B.Lg * (1. + 1.25 * w) * (1. - 0.1 * B.F);
  B.latChest = B.Lg * (1. + 0.85 * w) * (1. - 0.05 * B.F);
  B.latSh = B.Lg * (1. + 0.55 * w) * (1. - 0.11 * B.F);
  B.latNeck = B.Lg * (1. + 0.4 * w) * (1. - 0.1 * B.F);
  B.dBack = B.Lg * (1. + 0.7 * w) * (1. - 0.05 * B.F);
  B.armG = B.Lg * (1. + 0.8 * w) * (1. - 0.1 * B.F);
  B.legG = B.Lg * (1. + 0.75 * w) * (1. + 0.02 * B.F);
  B.legGz = B.Lg * (1. + 0.7 * w) * (1. - 0.05 * B.F);
  B.armDX = P_SH.x * (B.latSh - 1.);
  B.legDX = P_HIP.x * (B.latHip - 1.);
  vec3 dn = vec3(0., 1., 0.);
  B.root = pedMorphCentral(B, P_ROOT, dn);
  B.spine = pedMorphCentral(B, P_SPINE, dn);
  B.neck = pedMorphCentral(B, P_NECK, dn);
  B.sh = pedMorphArm(B, P_SH, 1.);
  B.el = pedMorphArm(B, P_EL, 1.);
  B.wr = pedMorphArm(B, P_WR, 1.);
  B.grip = pedMorphArm(B, P_GRIP, 1.);
  B.hip = pedMorphLeg(B, P_HIP, 1.);
  B.knee = pedMorphLeg(B, P_KNEE, 1.);
  B.ank = pedMorphLeg(B, P_ANK, 1.);
  return B;
}

vec3 pedMorph(PedBody B, vec3 p, int g, inout vec3 n) {
  if (g == 0) return pedMorphCentral(B, p, n);
  if (g == 1) { vec3 s = pedHeadScale(B); n = normalize(n / s); return B.neck + (p - P_NECK) * s; }
  if (g == 2 || g == 3) { float sd = g == 2 ? 1. : -1.; n = normalize(n / vec3(B.armG, B.Hb, B.armG)); return pedMorphArm(B, p, sd); }
  if (g == 4 || g == 5) { float sd = g == 4 ? 1. : -1.; n = normalize(n / vec3(B.legG, B.Hb, B.legGz)); return pedMorphLeg(B, p, sd); }
  if (g == 6 || g == 7) { return pedMorphFoot(B, p, g == 6 ? 1. : -1.); }
  return p;
}

// ------------------------------------------------------------------------------------------------ pose
struct PedPose {
  vec3 rootT; vec3 root; vec3 spine; vec3 neck;
  mat3 shL; mat3 shR; vec2 el; vec4 wr;
  vec3 hipL; vec3 hipR; vec2 knee; vec2 ankle;
};

PedPose pedMixPose(PedPose a, PedPose b, float k) {
  PedPose P;
  P.rootT = mix(a.rootT, b.rootT, k); P.root = mix(a.root, b.root, k);
  P.spine = mix(a.spine, b.spine, k); P.neck = mix(a.neck, b.neck, k);
  P.shL = pedOrtho(a.shL * (1. - k) + b.shL * k); P.shR = pedOrtho(a.shR * (1. - k) + b.shR * k);
  P.el = mix(a.el, b.el, k); P.wr = mix(a.wr, b.wr, k);
  P.hipL = mix(a.hipL, b.hipL, k); P.hipR = mix(a.hipR, b.hipR, k);
  P.knee = mix(a.knee, b.knee, k); P.ankle = mix(a.ankle, b.ankle, k);
  return P;
}

// Two-bone IK in torso rest space. S shoulder, E0/W0 rest elbow/wrist, T wrist target, pole = elbow direction hint.
void pedIK(vec3 S, vec3 E0, vec3 W0, vec3 T, vec3 pole, out mat3 R, out float flex) {
  float a = length(E0 - S), b = length(W0 - E0);
  vec3 d = T - S;
  float L = clamp(length(d), abs(a - b) + 0.01, (a + b) * 0.995);
  vec3 dn = normalize(d);
  float cosE = clamp((a * a + b * b - L * L) / (2. * a * b), -1., 1.);
  flex = PED_PI - acos(cosE);
  float x = (a * a - b * b + L * L) / (2. * L);
  float h = sqrt(max(a * a - x * x, 0.));
  vec3 pp = pole - dn * dot(pole, dn);
  pp = length(pp) > 1e-4 ? normalize(pp) : normalize(cross(dn, vec3(1., 0., 0.)));
  vec3 u1 = normalize(dn * x + pp * h);
  vec3 k1 = normalize(cross(dn, -pp));
  vec3 u0 = normalize(E0 - S);
  vec3 k0 = normalize(cross(u0, vec3(0., 0., 1.)));
  mat3 F0 = mat3(u0, k0, cross(u0, k0));
  mat3 F1 = mat3(u1, k1, cross(u1, k1));
  R = F1 * transpose(F0);
}

// target given in pelvis-local rest space -> torso rest space
vec3 pedToTorso(PedPose P, PedBody B, vec3 Tp) { return B.spine + transpose(pedEul(P.spine)) * (Tp - B.spine); }

void pedArmIK(inout PedPose P, PedBody B, float side, vec3 T, vec3 pole) {
  vec3 m = vec3(side, 1., 1.);
  mat3 R; float f;
  pedIK(B.sh * m, B.el * m, B.wr * m, T, pole, R, f);
  if (side > 0.) { P.shL = R; P.el.x = f; } else { P.shR = R; P.el.y = f; }
}

PedPose pedEvalPose(int anim, float ph, float spd, float rate, PedBody B, float seed, float t, uint style) {
  PedPose P;
  float Lt = distance(B.hip, B.knee), Ls = distance(B.knee, B.ank);
  float abd0 = 0.055 + (B.W - 1.) * 0.4 - 0.01 * B.F;
  P.rootT = vec3(0.); P.root = vec3(0.); P.spine = vec3(0.); P.neck = vec3(0.);
  P.el = vec2(0.2); P.wr = vec4(0.05, 0., 0.05, 0.);
  float armFwd = 0.03;
  P.hipL = vec3(0., 0., 0.035); P.hipR = vec3(0., 0., 0.035);
  P.knee = vec2(0.04); P.ankle = vec2(0.);
  // posture: elderly stoop
  float A = B.A;
  P.spine.x = 0.03 + 0.24 * A; P.neck.x = -0.04 - 0.14 * A; P.root.x = 0.04 * A;

  float sw = sin(t * 0.37 + seed * 31.) * 0.65 + sin(t * 0.17 + seed * 17.) * 0.35;  // weight shift
  float br = sin(t * 1.6 + seed * 5.);                                                // breathing
  float lk = sin(t * 0.29 + seed * 11.) * 0.7 + sin(t * 0.11 + seed * 3.) * 0.3;     // look around
  float swingL = 0., swingR = 0., elL = 0.2, elR = 0.2;

  bool loco = anim == 1 || anim == 2;
  float flight = 0.;
  if (loco) {
    float phL = ph, phR = fract(ph + 0.5);
    float wL = PED_TAU * phL;
    // stride (m per cycle) from the game-driven speed and the cadence -> hip sweep that keeps the stance foot planted
    float Lleg = Lt + Ls;
    float stride = rate > 1e-3 ? spd / rate : (anim == 1 ? 1.4 : 2.2) * B.H;
    if (anim == 1) {
      float amp = clamp(spd / 1.35, 0.35, 1.45) * (1. - 0.3 * A);
      float th0 = 0.08, tha = clamp(0.5 * (0.6 * stride - 0.24 * B.H) / Lleg, 0.04, 0.5);
      P.hipL.x = th0 + tha * cos(PED_TAU * (phL + 0.03));
      P.hipR.x = th0 + tha * cos(PED_TAU * (phR + 0.03));
      P.knee.x = 0.06 + 0.22 * amp * pedBump(phL, 0.13, 0.07) + (0.55 + 0.45 * amp) * pedBump(phL, 0.73, 0.11);
      P.knee.y = 0.06 + 0.22 * amp * pedBump(phR, 0.13, 0.07) + (0.55 + 0.45 * amp) * pedBump(phR, 0.73, 0.11);
      P.ankle.x = 0.15 * amp * pedBump(phL, 0.4, 0.12) - 0.36 * amp * pedBump(phL, 0.63, 0.06) + 0.08 * pedBump(phL, 0.86, 0.08) - 0.08 * pedBump(phL, 0.04, 0.04);
      P.ankle.y = 0.15 * amp * pedBump(phR, 0.4, 0.12) - 0.36 * amp * pedBump(phR, 0.63, 0.06) + 0.08 * pedBump(phR, 0.86, 0.08) - 0.08 * pedBump(phR, 0.04, 0.04);
      P.root.y = -0.085 * amp * cos(wL) * (1. + 0.4 * B.F);
      P.root.z = (0.045 + 0.035 * B.F) * amp * sin(wL);
      P.rootT.x = 0.012 * amp * sin(wL);
      P.spine.y = 0.12 * amp * cos(wL) * (1. - 0.3 * B.F);
      P.spine.x += 0.035 + 0.025 * amp;
      P.spine.z = -0.7 * P.root.z;
      P.neck.y = -(P.root.y + P.spine.y) * 0.8;
      P.neck.x -= 0.03;
      swingL = -0.3 * amp * cos(wL) * (1. - 0.25 * B.F) * (1. - 0.4 * A);
      swingR = -swingL;
      elL = 0.2 + 0.35 * max(swingL, 0.) + 0.08 * B.F;
      elR = 0.2 + 0.35 * max(swingR, 0.) + 0.08 * B.F;
      P.hipL.z = 0.02 - 0.02 * B.F; P.hipR.z = P.hipL.z;
    } else {
      float amp = clamp(spd / 3.2, 0.5, 1.4) * (1. - 0.3 * A);
      float tha = clamp(0.5 * (0.38 * stride - 0.2 * B.H) / Lleg, 0.1, 0.7);
      P.hipL.x = 0.17 + tha * cos(PED_TAU * (phL + 0.06));
      P.hipR.x = 0.17 + tha * cos(PED_TAU * (phR + 0.06));
      P.knee.x = 0.25 + 0.3 * pedBump(phL, 0.16, 0.07) + 1.2 * amp * pedBump(phL, 0.64, 0.14);
      P.knee.y = 0.25 + 0.3 * pedBump(phR, 0.16, 0.07) + 1.2 * amp * pedBump(phR, 0.64, 0.14);
      P.ankle.x = 0.18 * pedBump(phL, 0.12, 0.06) - 0.45 * pedBump(phL, 0.36, 0.07);
      P.ankle.y = 0.18 * pedBump(phR, 0.12, 0.06) - 0.45 * pedBump(phR, 0.36, 0.07);
      P.root.y = -0.1 * amp * cos(wL);
      P.root.z = 0.04 * amp * sin(wL);
      P.spine.y = 0.17 * amp * cos(wL);
      P.spine.x += 0.14;
      P.spine.z = -0.6 * P.root.z;
      P.neck.y = -(P.root.y + P.spine.y) * 0.85;
      P.neck.x -= 0.1;
      swingL = -0.5 * amp * cos(wL) - 0.12; swingR = 0.5 * amp * cos(wL) - 0.12;
      elL = 1.35 + 0.3 * max(swingL, 0.); elR = 1.35 + 0.3 * max(swingR, 0.);
      abd0 += 0.08;
      flight = 0.04 * amp * (pedBump(ph, 0.45, 0.08) + pedBump(ph, 0.95, 0.08));
    }
  } else {
    // standing base: weight shift, breathing, looking around
    float d = 0.022 * sw;
    P.rootT.x = d;
    P.root.z = 0.035 * sw;
    P.spine.z = -0.8 * P.root.z;
    float kL = 0.04 + 0.2 * max(-sw, 0.), kR = 0.04 + 0.2 * max(sw, 0.);
    P.knee = vec2(kL, kR);
    P.hipL.x = 0.5 * kL; P.hipR.x = 0.5 * kR;
    P.ankle = vec2(0.3 * kL, 0.3 * kR);
    P.hipL.z = 0.035 - d / (Lt + Ls); P.hipR.z = 0.035 + d / (Lt + Ls);
    P.spine.x += 0.012 * br;
    P.neck.y = 0.32 * lk; P.neck.x += 0.04 * sin(t * 0.4 + seed * 9.);
    swingL = 0.02 + 0.02 * br; swingR = 0.02 + 0.02 * br;
    // knee bend due to age
  }
  P.knee += 0.1 * A;
  P.hipL.x += 0.05 * A; P.hipR.x += 0.05 * A;

  vec3 mL = vec3(1., 1., 1.), mR = vec3(-1., 1., 1.);
  P.shL = pedLimb(armFwd + swingL, 0., abd0, 1.);
  P.shR = pedLimb(armFwd + swingR, 0., abd0, -1.);
  P.el = vec2(elL, elR);

  bool umbrellaHold = anim == 6 || (((style >> 11u) & 1u) == 1u && (anim == 0 || anim == 1));

  if (anim == 3) {
    // hail a taxi: right arm raised high, waving
    float wv = sin(PED_TAU * ph);
    vec3 T = B.sh * mR + vec3(-0.1 - 0.05 * wv, 0.5 * B.Hb, 0.12 * B.Hb);
    pedArmIK(P, B, -1., pedToTorso(P, B, T), vec3(-1., -0.4, -0.3));
    P.wr.zw = vec2(-0.35, 0.15 * wv);
    P.spine.z -= 0.06; P.spine.x -= 0.03;
    P.neck.y = -0.3 + 0.05 * lk; P.neck.x = -0.06;
  } else if (anim == 4) {
    // phone call: right hand at the ear, head tilted towards it
    P.neck = vec3(0.07 + 0.03 * sin(t * 0.7 + seed), 0.15 * lk, 0.12);
    vec3 hs = pedHeadScale(B);
    vec3 ear = B.neck + pedEul(P.neck) * ((vec3(-0.08, 1.628, 0.01) - P_NECK) * hs);
    vec3 T = ear + vec3(-0.035, -0.115, 0.045) * B.Hb;
    pedArmIK(P, B, -1., T, vec3(-0.5, -1., 0.15));
    P.wr.zw = vec2(-0.25, -0.35);
    if (seed > 0.5) {
      vec3 TL = B.hip * mL + vec3(0.07, 0.05, 0.1) * B.Hb;  // hand in pocket / on hip
      pedArmIK(P, B, 1., pedToTorso(P, B, TL), vec3(1., -0.3, -0.6));
    }
  } else if (anim == 5) {
    // sit: thighs ~horizontal, shins vertical, hands resting on the thighs
    P.hipL = vec3(1.32, 0.04, 0.07); P.hipR = vec3(1.32, 0.04, 0.07);
    P.knee = vec2(1.3); P.ankle = vec2(0.02);
    P.rootT.x = 0.; P.root = vec3(-0.05, 0., 0.); P.spine = vec3(-0.06 + 0.15 * A + 0.01 * br, 0., 0.);
    P.neck.x += 0.06;
    vec3 TL = B.hip * mL + vec3(0.035, 0.12, 0.28) * B.Hb;
    vec3 TR = B.hip * mR + vec3(-0.035, 0.12, 0.28) * B.Hb;
    pedArmIK(P, B, 1., pedToTorso(P, B, TL), vec3(1., -0.2, -1.));
    pedArmIK(P, B, -1., pedToTorso(P, B, TR), vec3(-1., -0.2, -1.));
    P.wr = vec4(0.25, 0.2, 0.25, 0.2);
  } else if (anim == 7) {
    // flinch / jump back (one-shot)
    float e = smoothstep(0., 0.14, ph);
    float k = e * (1. - 0.45 * smoothstep(0.45, 1., ph));
    P.rootT.z = -0.13 * e;
    P.spine += vec3(-0.2 * k, 0.25 * k, 0.);
    P.neck += vec3(-0.12 * k, 0.4 * k, 0.);
    P.hipR.x = -0.32 * e + 0.1 * k; P.knee.y = 0.35 * k; P.ankle.y = 0.1 * k;
    P.hipL.x = 0.25 * k; P.knee.x = 0.4 * k; P.ankle.x = 0.12 * k;
    vec3 restL = B.wr * mL, restR = B.wr * mR;
    vec3 defL = B.sh * mL + vec3(-0.07, -0.08, 0.3) * B.Hb, defR = B.sh * mR + vec3(0.05, -0.02, 0.32) * B.Hb;
    pedArmIK(P, B, 1., mix(restL + vec3(0., 0.02, 0.05), defL, k), vec3(1., -1., -0.4));
    pedArmIK(P, B, -1., mix(restR + vec3(0., 0.02, 0.05), defR, k), vec3(-1., -1., -0.4));
    P.wr = vec4(-0.6 * k, 0., -0.6 * k, 0.);
  } else if (anim == 8) {
    // tourist photo: both hands in front of the face
    P.neck = vec3(0.1, 0.04 * lk, 0.);
    P.spine.x -= 0.04;
    vec3 hs = pedHeadScale(B);
    vec3 c = B.neck + vec3(0., (1.6 - P_NECK.y) * hs.y, 0.3 * B.Hb);
    pedArmIK(P, B, 1., c + vec3(0.07, -0.12, -0.03) * B.Hb, vec3(1., -0.8, -0.3));
    pedArmIK(P, B, -1., c + vec3(-0.07, -0.12, -0.03) * B.Hb, vec3(-1., -0.8, -0.3));
    P.wr = vec4(-0.6, -0.15, -0.6, -0.15);
  }
  if (umbrellaHold) {
    float bob = loco ? 0.012 * sin(PED_TAU * 2. * ph) : 0.;
    vec3 T = B.sh * mR + vec3(0.08, -0.25 * B.Hb + bob, 0.27 * B.Hb);
    pedArmIK(P, B, -1., pedToTorso(P, B, T), vec3(-1., -1., -0.2));
    P.wr.zw = vec2(-0.25, 0.0);
    P.neck.y *= 0.5;
  }

  // ground contact: lowest ankle on the floor (legs given in world-sagittal terms here)
  float hx = B.hip.x;
  float dropL = (Lt * cos(P.hipL.x) + Ls * cos(P.hipL.x - P.knee.x)) * cos(P.hipL.z);
  float dropR = (Lt * cos(P.hipR.x) + Ls * cos(P.hipR.x - P.knee.y)) * cos(P.hipR.z);
  float sr = sin(P.root.z);
  P.rootT.y += -(Lt + Ls) + max(dropL - hx * sr, dropR + hx * sr) + flight;
  // convert leg angles to pelvis-local (legs stay world-vertical when the pelvis pitches/rolls/yaws)
  P.hipL.x += P.root.x; P.hipR.x += P.root.x;
  P.hipL.z -= P.root.z; P.hipR.z += P.root.z;
  P.hipL.y -= P.root.y; P.hipR.y += P.root.y;
  return P;
}

void pedJoint(inout mat3 R, inout vec3 t, mat3 Rl, vec3 pv) { mat3 Rn = R * Rl; t = R * pv + t - Rn * pv; R = Rn; }

void pedXform(int part, PedPose P, PedBody B, out mat3 R, out vec3 t) {
  R = pedEul(P.root);
  t = P.rootT + B.root - R * B.root;
  if (part == 0) return;
  if (part >= 9 && part <= 14) {
    float sd = (part % 2 == 1) ? 1. : -1.;
    vec3 m = vec3(sd, 1., 1.);
    vec3 hp = sd > 0. ? P.hipL : P.hipR;
    pedJoint(R, t, pedLimb(hp.x, hp.y, hp.z, sd), B.hip * m);
    if (part <= 10) return;
    pedJoint(R, t, pedRotX(sd > 0. ? P.knee.x : P.knee.y), B.knee * m);
    if (part <= 12) return;
    pedJoint(R, t, pedRotX(-(sd > 0. ? P.ankle.x : P.ankle.y)), B.ank * m);
    return;
  }
  pedJoint(R, t, pedEul(P.spine), B.spine);
  if (part == 1) return;
  if (part == 2) { pedJoint(R, t, pedEul(P.neck), B.neck); return; }
  int pa = part == 15 ? 8 : part == 16 ? 7 : part;
  float sd = (pa % 2 == 1) ? 1. : -1.;
  vec3 m = vec3(sd, 1., 1.);
  pedJoint(R, t, sd > 0. ? P.shL : P.shR, B.sh * m);
  if (pa <= 4) return;
  pedJoint(R, t, pedRotX(-(sd > 0. ? P.el.x : P.el.y)), B.el * m);
  if (pa <= 6) return;
  vec2 w = sd > 0. ? P.wr.xy : P.wr.zw;
  pedJoint(R, t, pedRotX(-w.x) * pedRotZ(sd * w.y), B.wr * m);
  if (part == 16) {
    // handbag: hangs from the left-hand grip, mostly upright, swings a little with the hand
    vec3 g = R * B.grip + t;
    float yaw = P.root.y + P.spine.y;
    mat3 Rb = pedOrtho(pedRotY(yaw) * 0.7 + R * 0.3);
    R = Rb;
    t = g - Rb * P_GRIP;
  }
  if (part == 15) {
    // umbrella: anchored at the right-hand grip, kept upright, facing like the torso
    vec3 g = R * (B.grip * m) + t;
    float yaw = P.root.y + P.spine.y;
    mat3 Ru = pedRotY(yaw) * pedRotX(0.07) * pedRotZ(-0.05);
    R = Ru;
    t = g - Ru * (P_GRIP * m);
  }
}

bool pedVisible(int v, uint st, int anim) {
  uint top = st & 3u;
  uint hat = (st >> 4u) & 3u;
  uint hair = (st >> 6u) & 3u;
  if (v == 0) return true;
  if (v == 1) return top >= 2u;
  if (v == 2) return top == 1u;
  if (v == 3) return top == 3u;
  if (v == 4) return top == 0u;
  if (v == 5) return (st & 4u) != 0u;
  if (v == 6) return (st & 256u) != 0u;
  if (v == 7) return hat == 1u;
  if (v == 8) return hat == 2u;
  if (v == 9) return hat == 3u;
  if (v == 10) return hair != 3u;
  if (v == 11) return hair == 1u;
  if (v == 12) return hair == 2u;
  if (v == 13) return (st & 512u) != 0u;
  if (v == 14) return (st & 1024u) != 0u && anim != 8;
  if (v == 15) return anim == 6 || ((st & 2048u) != 0u && (anim == 0 || anim == 1));
  if (v == 16) return anim == 4 || anim == 8;
  if (v == 17) return top != 0u;
  return true;
}

bool pedAltOn(int c, uint st) {
  if (c == 1) return (st & 4u) == 0u;
  if (c == 2) return (st & 3u) != 0u;
  if (c == 3) return (st & 8u) != 0u;
  return false;
}

float pedPhase(int anim, float ph0, float rate) {
  float p = ph0 + uTime * rate;
  return anim == 7 ? clamp(p, 0., 1.) : fract(p);
}

struct PedOut { vec3 pos; vec3 nrm; };

PedOut pedCompute() {
  PedOut o;
  uint st = uint(iColors1.w + 0.5);
  int anim = int(iAnim.x + 0.5);
  int vis = int(aMeta.y + 0.5);
  float slotPacked = aMeta.x;
  int mg = int(floor(slotPacked / 64. + 0.001));
  #ifdef PED_COLOR
  vPedRest = position;
  vPedAO = aMeta.w;
  vPedSlot = slotPacked - float(mg) * 64.;
  vPedC0 = iColors0; vPedC1 = iColors1; vPedC2 = iColors2;
  #endif
  if (!pedVisible(vis, st, anim)) { o.pos = vec3(0.); o.nrm = vec3(0., 1., 0.); return o; }
  vec3 rp = position + (pedAltOn(int(aMeta.z + 0.5), st) ? aAlt : vec3(0.));
  vec3 n = normal;
  PedBody B = pedMakeBody(iLook);
  vec3 mp = pedMorph(B, rp, mg, n);
  float seed = iColors2.w;
  float spd = iAnim.w;
  PedPose P = pedEvalPose(anim, pedPhase(anim, iAnim.y, iAnim.z), spd, iAnim.z, B, seed, uTime, st);
  float bk = clamp((uTime - iAnimPrev.w) / 0.3, 0., 1.);
  if (bk < 1.) {
    int pan = int(iAnimPrev.x + 0.5);
    PedPose Q = pedEvalPose(pan, pedPhase(pan, iAnimPrev.y, iAnimPrev.z), spd, iAnimPrev.z, B, seed, uTime, st);
    P = pedMixPose(Q, P, smoothstep(0., 1., bk));
  }
  float wB = aPart.z, wC = aPart.w, wA = 1. - wB - wC;
  mat3 R; vec3 t;
  pedXform(int(aPart.x + 0.5), P, B, R, t);
  mat3 Ra = R * wA; vec3 ta = t * wA;
  if (wB > 0.001) { pedXform(int(aPart.y + 0.5), P, B, R, t); Ra += R * wB; ta += t * wB; }
  if (wC > 0.001) { pedXform(0, P, B, R, t); Ra += R * wC; ta += t * wC; }
  o.pos = Ra * mp + ta;
  o.nrm = normalize(Ra * n);
  return o;
}
`;

export const PED_FRAGMENT_PARS = /* glsl */ `
varying vec3 vPedRest;
varying float vPedAO;
flat varying float vPedSlot;
flat varying vec4 vPedC0;
flat varying vec4 vPedC1;
flat varying vec4 vPedC2;

vec3 pedSRGB(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
vec3 pedUnpack(float f) {
  uint u = uint(f + 0.5);
  return pedSRGB(vec3(float((u >> 16u) & 255u), float((u >> 8u) & 255u), float(u & 255u)) / 255.);
}
float pedLum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
// coverage of the region d < 0 with screen-space anti-aliasing
float pedIn(float d) { float w = max(fwidth(d), 1e-5); return clamp(0.5 - d / w, 0., 1.); }

vec3 pedAlbedo(out float rough, out float metal) {
  int slot = int(vPedSlot + 0.5);
  uint st = uint(vPedC1.w + 0.5);
  vec3 skin = pedUnpack(vPedC0.x), hair = pedUnpack(vPedC0.y), top = pedUnpack(vPedC0.z), bottom = pedUnpack(vPedC0.w);
  vec3 shoes = pedUnpack(vPedC1.x), coat = pedUnpack(vPedC1.y), accent = pedUnpack(vPedC1.z);
  vec3 bag = pedUnpack(vPedC2.x), umb = pedUnpack(vPedC2.y), legw = pedUnpack(vPedC2.z);
  float seed = vPedC2.w;
  vec3 p = vPedRest;
  uint topL = st & 3u;
  bool skirt = (st & 4u) != 0u;
  bool stripes = (st & 16384u) != 0u;
  bool backpack = (st & 512u) != 0u;
  uint hairSt = (st >> 6u) & 3u;
  rough = 0.85; metal = 0.;
  vec3 c = top;
  float det = clamp(1.6 - fwidth(p.y) * 220., 0., 1.); // fine-detail fade with distance
  vec3 topC = top;
  if (stripes) topC = mix(top, accent, pedIn(abs(fract(p.y / 0.03) - 0.5) - 0.2) * det + (1. - det) * 0.4);

  if (slot == 0 || slot == 16) {
    c = skin; rough = 0.55;
  } else if (slot == 1) {
    // ---- head: skin + procedural face + hairline + beard
    c = skin; rough = 0.55;
    float ang = abs(atan(p.x, p.z + 0.01));
    float front = 1. - smoothstep(0.55, 0.85, ang);
    vec2 e = vec2(abs(p.x) - 0.033, p.y - 1.648);
    float socket = exp(-dot(e / vec2(0.024, 0.017), e / vec2(0.024, 0.017)));
    c *= 1. - 0.22 * socket * front;
    float eyeD = length(e / vec2(0.0115, 0.0058));
    float eyeM = pedIn(eyeD - 1.) * front * det;
    vec3 eyeC = mix(vec3(0.33, 0.31, 0.29) * 0.55, vec3(0.025, 0.018, 0.012), pedIn(length(e) - 0.0056));
    c = mix(c, eyeC, eyeM);
    float by = p.y - (1.669 + 0.004 * (1. - pow((abs(p.x) - 0.034) / 0.02, 2.)));
    float browM = pedIn(abs(by) - 0.0035) * step(0.012, abs(p.x)) * pedIn(abs(p.x) - 0.054) * front;
    c = mix(c, hair * 0.7, browM * (0.35 + 0.5 * det));
    vec2 lp = vec2(p.x / 0.024, (p.y - 1.5715) / 0.0062);
    float lipM = pedIn(length(lp) - 1.) * front;
    c = mix(c, c * vec3(0.8, 0.55, 0.53), lipM * 0.75);
    if ((st & 4096u) != 0u) {
      float bm = smoothstep(1.612, 1.598, p.y) * smoothstep(1.528, 1.545, p.y) * (1. - smoothstep(1.55, 1.75, ang));
      bm *= 1. - lipM * 0.7;
      bm = max(bm, pedIn(abs(p.y - 1.582) - 0.006) * pedIn(abs(p.x) - 0.03) * front);
      c = mix(c, hair * 0.85, clamp(bm, 0., 1.) * 0.9);
    }
    if (hairSt != 3u) {
      float hl = mix(hairSt == 0u ? 1.707 : 1.7, 1.655, smoothstep(0.3, 1.25, ang));
      hl = mix(hl, hairSt == 0u ? 1.575 : 1.6, smoothstep(1.55, 2.5, ang));
      float hm = pedIn(hl - p.y);
      c = mix(c, hair, hm); rough = mix(rough, 0.5, hm);
    } else {
      float hm = pedIn(1.585 - p.y) * 0. + pedIn(p.y - 1.69) * pedIn(1.585 - p.y + 0.0) ;
      hm = pedIn(p.y - 1.69) * pedIn(1.59 - p.y) * smoothstep(1.1, 1.4, ang);
      c = mix(c, hair, hm * 0.9);
    }
  } else if (slot == 2) {
    c = p.y > 0.99 ? topC : bottom;
    if (!skirt && abs(p.y - 0.993) < 0.011) { c = shoes * 0.7 + 0.01; rough = 0.45; if (abs(p.x) < 0.018 && p.z > 0.) { c = vec3(0.5); metal = 0.8; rough = 0.3; } }
    if (backpack && p.z > 0. && p.y > 1.1) c = mix(c, bag * 0.8, pedIn(abs(abs(p.x) - 0.09) - 0.017));
    if (p.y < 0.99) rough = 0.9;
  } else if (slot == 3) {
    c = topL != 0u ? coat : topC;
  } else if (slot == 4) {
    if (skirt) { c = (st & 32768u) != 0u ? skin : mix(legw, skin, 0.12); rough = (st & 32768u) != 0u ? 0.55 : 0.6; }
    else { c = bottom; rough = 0.9; }
  } else if (slot == 5) {
    bool light = pedLum(shoes) > 0.3;
    c = shoes; rough = light ? 0.75 : 0.38;
    float sole = pedIn(p.y - 0.017);
    c = mix(c, light ? vec3(0.8) : vec3(0.03), sole);
  } else if (slot == 6 || slot == 7) {
    c = coat; rough = slot == 6 ? 0.8 : 0.75;
    bool trench = topL == 3u;
    if (trench) rough = 0.68;
    if (slot == 7 && pedLum(coat) < 0.02 && seed > 0.55 && (st & 8192u) == 0u) rough = 0.42; // leather jacket
    float fz = step(0.0, p.z);
    // lapels (V)
    float lv = abs(abs(p.x) - (p.y - 1.24) * 0.42 - 0.01);
    if (p.y > 1.24 && p.y < 1.47) c *= 1. - 0.45 * pedIn(lv - 0.0022) * fz * det;
    // suit: shirt + tie in the V
    if (slot == 7 && (st & 8192u) != 0u && p.y > 1.2 && p.y < 1.48 && fz > 0.) {
      float vm = pedIn(abs(p.x) - (p.y - 1.2) * 0.3);
      vec3 shirt = pedLum(accent) > 0.35 ? accent : vec3(0.85, 0.86, 0.88);
      float tie = pedIn(abs(p.x) - 0.011 - (1.46 - p.y) * 0.022);
      vec3 tieC = pedLum(accent) > 0.35 ? vec3(0.12, 0.13, 0.2) : accent;
      c = mix(c, mix(shirt, tieC, tie * step(p.y, 1.455)), vm);
      rough = mix(rough, 0.6, vm);
    }
    // buttons
    float bx = trench ? abs(abs(p.x) - 0.055) : abs(p.x);
    float bys = slot == 6 ? 0.11 : 0.09;
    float bph = fract((p.y - 0.98) / bys + 0.5) - 0.5;
    float btn = pedIn(length(vec2(bx, bph * bys)) - 0.0075) * step(slot == 6 ? 0.9 : 0.95, p.y) * step(p.y, 1.25) * fz * det;
    c = mix(c, c * 0.35, btn);
    // front opening below the waist
    if (slot == 6 && p.y < 0.98) c *= 1. - 0.5 * pedIn(abs(p.x) - 0.0025) * fz * det;
    // pockets
    float pk = pedIn(abs(p.y - 0.94) - 0.004) * pedIn(abs(abs(p.x) - 0.12) - 0.04) * fz;
    c *= 1. - 0.4 * pk * det;
    if (backpack && p.z > 0. && p.y > 1.1) c = mix(c, bag * 0.8, pedIn(abs(abs(p.x) - 0.1) - 0.017));
  } else if (slot == 8) {
    c = bottom; rough = 0.85;
  } else if (slot == 9) {
    c = hair; rough = 0.48;
    c *= 0.92 + 0.08 * smoothstep(1.6, 1.75, p.y);
  } else if (slot == 10) {
    c = accent; rough = 0.95;
  } else if (slot == 11) {
    uint hat = (st >> 4u) & 3u;
    c = hat == 3u ? coat * 0.55 + 0.01 : accent * 0.85;
    rough = 0.8;
    if (hat == 3u && p.y > 1.69 && p.y < 1.715) c *= 0.35;
  } else if (slot == 12) {
    c = bag; rough = 0.45;
  } else if (slot == 13) {
    c = umb; rough = 0.32;
    float a = atan(p.z - ${PIVOT.grip[2].toFixed(4)}, p.x + ${PIVOT.grip[0].toFixed(4)}) / (6.28318531 / 8.);
    c *= 1. - 0.25 * pedIn(abs(fract(a) - 0.5) * -1. + 0.47);
  } else if (slot == 14) {
    c = vec3(0.025); rough = 0.3; metal = 0.5;
  } else if (slot == 15) {
    c = coat * 0.85; rough = 0.8;
  }
  // cheap rest-space ambient occlusion: torso sides behind the arms, inner limbs, crotch, ground proximity
  float ao = vPedAO;
  float ax = abs(p.x);
  if (slot == 2 || slot == 6 || slot == 7) ao *= 1. - 0.2 * smoothstep(0.12, 0.175, ax) * smoothstep(0.92, 1.05, p.y) * (1. - smoothstep(1.32, 1.42, p.y));
  if (slot == 3) ao *= 1. - 0.18 * smoothstep(0.205, 0.17, ax) * step(0.95, p.y);
  if (slot == 4) ao *= (1. - 0.22 * smoothstep(0.06, 0.015, ax) * smoothstep(0.55, 0.82, p.y)) * mix(0.82, 1., smoothstep(0.02, 0.4, p.y));
  if (slot == 2 && p.y < 0.9) ao *= mix(0.75, 1., smoothstep(0.8, 0.9, p.y));
  if (slot == 5) ao *= mix(0.8, 1., smoothstep(0.0, 0.06, p.y));
  return c * ao;
}
`;
