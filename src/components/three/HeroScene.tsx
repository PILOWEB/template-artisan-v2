/* Scène 3D légère : objet métier procédural (aucun asset à charger), matériau
   mat, lumière chaude, rotation pilotée par la souris, brouillard chaud et fond
   flouté qui simulent une profondeur de champ discrète. Chargée uniquement à
   partir de 768 px et sans prefers-reduced-motion. */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, type ReactElement } from 'react';
import * as THREE from 'three';
import { COULEUR_ACCENT, METIER, type Metier } from '@/config/site.config';

const MAT = {
  cuivre: { color: '#b46a3c', roughness: 0.72, metalness: 0.35 },
  laiton: { color: '#a8843f', roughness: 0.7, metalness: 0.35 },
  terre: { color: '#b4522e', roughness: 0.95, metalness: 0 },
  chene: { color: '#a5733f', roughness: 0.9, metalness: 0 },
  fonte: { color: '#3a3430', roughness: 0.85, metalness: 0.2 },
  lin: { color: '#d9ccb4', roughness: 1, metalness: 0 },
};

function Mat({ m }: { m: keyof typeof MAT }) {
  const p = MAT[m];
  return <meshStandardMaterial color={p.color} roughness={p.roughness} metalness={p.metalness} />;
}

/* Plomberie : coude de tuyau en cuivre avec une vanne à volant */
function Plomberie() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.9, 0.45, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.8, 32]} /><Mat m="cuivre" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.45, 0.16, 24, 48, Math.PI / 2]} /><Mat m="cuivre" />
      </mesh>
      <mesh position={[0.45, -0.9, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.8, 32]} /><Mat m="cuivre" />
      </mesh>
      {/* vanne */}
      <mesh position={[0.45, -0.7, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.3, 32]} /><Mat m="laiton" />
      </mesh>
      <mesh position={[0.45, -0.7, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} /><Mat m="laiton" />
      </mesh>
      <mesh position={[0.45, -0.7, 0.68]}>
        <torusGeometry args={[0.32, 0.045, 16, 48]} /><Mat m="terre" />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.45, -0.7, 0.68]} rotation={[0, 0, (i * Math.PI) / 3]}>
          <boxGeometry args={[0.64, 0.04, 0.04]} /><Mat m="terre" />
        </mesh>
      ))}
    </group>
  );
}

/* Électricité : bobine de cuivre autour d'un noyau mat */
function Electricite() {
  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 400; i++) {
      const t = (i / 400) * Math.PI * 14;
      pts.push(new THREE.Vector3(Math.cos(t) * 0.55, (i / 400) * 2.2 - 1.1, Math.sin(t) * 0.55));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  return (
    <group rotation={[0, 0, 0.35]}>
      <mesh><cylinderGeometry args={[0.42, 0.42, 2.4, 32]} /><Mat m="fonte" /></mesh>
      <mesh><tubeGeometry args={[curve, 600, 0.06, 10, false]} /><Mat m="cuivre" /></mesh>
    </group>
  );
}

/* Maçonnerie : briques en quinconce */
function Maconnerie() {
  const rows = [0, 1, 2, 3];
  return (
    <group position={[0, -0.7, 0]}>
      {rows.map((r) =>
        [0, 1, 2].map((c) => (
          <mesh key={`${r}-${c}`} position={[(c - 1) * 0.92 + (r % 2) * 0.46, r * 0.42, 0]}>
            <boxGeometry args={[0.86, 0.36, 0.42]} /><Mat m={r % 3 === 1 ? 'chene' : 'terre'} />
          </mesh>
        )),
      )}
    </group>
  );
}

/* Menuiserie : planches de chêne empilées en croix */
function Menuiserie() {
  return (
    <group>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, (i - 2) * 0.24, 0]} rotation={[0, (i % 2) * Math.PI / 2 + i * 0.05, 0]}>
          <boxGeometry args={[2.4, 0.16, 0.5]} /><Mat m="chene" />
        </mesh>
      ))}
    </group>
  );
}

/* Rénovation : truelle stylisée + briques */
function Renovation() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[1.6, 0.05, 0.9]} /><Mat m="fonte" />
      </mesh>
      <mesh position={[0.9, 0.55, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.08, 0.1, 0.9, 16]} /><Mat m="chene" />
      </mesh>
      <mesh position={[-0.6, -0.5, 0]}><boxGeometry args={[0.86, 0.36, 0.42]} /><Mat m="terre" /></mesh>
      <mesh position={[0.4, -0.5, 0.1]}><boxGeometry args={[0.86, 0.36, 0.42]} /><Mat m="terre" /></mesh>
    </group>
  );
}

const OBJETS: Record<Metier, () => ReactElement> = {
  plomberie: Plomberie,
  electricite: Electricite,
  maconnerie: Maconnerie,
  menuiserie: Menuiserie,
  renovation: Renovation,
};

function Objet() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const Comp = OBJETS[METIER];
  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Rotation lente continue + suivi souris amorti (asymétrique : rapide vers la cible, lent au retour)
    const targetY = pointer.x * 0.45 + t * 0.12;
    const targetX = -pointer.y * 0.25 + Math.sin(t * 0.4) * 0.06;
    const k = 1 - Math.pow(0.001, dt);
    g.rotation.y += (targetY - g.rotation.y) * k * 0.8;
    g.rotation.x += (targetX - g.rotation.x) * k * 0.8;
    g.position.y = Math.sin(t * 0.7) * 0.08;
  });
  return (
    <group ref={group} rotation={[0.3, -0.6, 0]} position={[0.9, 0.35, 0]} scale={0.82}>
      <Comp />
    </group>
  );
}

/* Fond flouté (profondeur de champ simulée) : un disque terre cuite très
   atténué derrière l'objet, dans le brouillard */
function Backdrop() {
  return (
    <mesh position={[0.6, -0.4, -3.5]}>
      <circleGeometry args={[2.6, 48]} />
      <meshBasicMaterial color={COULEUR_ACCENT} transparent opacity={0.16} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ background: 'transparent' }}
      frameloop="always"
    >
      <fog attach="fog" args={['#f4efe7', 5, 11]} />
      <ambientLight intensity={0.55} color="#f4efe7" />
      <directionalLight position={[3, 4, 3]} intensity={2.2} color="#ffd9a8" />
      <directionalLight position={[-4, -1, 2]} intensity={0.6} color="#eae0d2" />
      <pointLight position={[-2, 1, -3]} intensity={6} color={COULEUR_ACCENT} distance={9} />
      <Backdrop />
      <Objet />
    </Canvas>
  );
}
