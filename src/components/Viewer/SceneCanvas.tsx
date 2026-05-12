import { Canvas } from '@react-three/fiber'
import { OrbitControls, GizmoHelper, GizmoViewcube, Grid } from '@react-three/drei'
import { useMemo, Suspense } from 'react'
import { usePanelStore } from '../../store/usePanelStore'
import { computeUnitCg } from '../../lib/cgCalculator'
import { PANEL_ROLES } from '../../types'
import type { PanelRole } from '../../types'
import { PanelMesh } from './PanelMesh'
import { LiftingPointMarker } from './LiftingPointMarker'

function Scene() {
  const { panels, selectedRole, setSelectedRole, roofEnabled } = usePanelStore()

  const result = useMemo(() => computeUnitCg(panels, roofEnabled), [panels, roofEnabled])
  const cgPos = result.cg

  // Determine which roles to render
  const activeRoles: PanelRole[] = roofEnabled ? [...PANEL_ROLES, 'roof'] : [...PANEL_ROLES]

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 12, 6]} intensity={1.2} castShadow />
      <directionalLight position={[-6, -4, -8]} intensity={0.3} />

      {/* Ground grid */}
      <Grid
        position={[0, -0.02, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#3a3a3a"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#555"
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid
      />

      {/* Panels — unified frame */}
      {activeRoles.map((role) => (
        <PanelMesh
          key={role}
          panel={panels[role]}
          panels={panels}
          isSelected={role === selectedRole}
          onClick={() => setSelectedRole(role)}
        />
      ))}

      {/* Lifting Point Marker */}
      {result.totalVolume > 0 && <LiftingPointMarker position={cgPos} />}

      {/* Orbit Controls */}
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} />

      {/* View cube gizmo */}
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewcube />
      </GizmoHelper>
    </>
  )
}

export function SceneCanvas() {
  return (
    <Canvas
      camera={{ position: [10, 8, 10], fov: 50, near: 0.1, far: 200 }}
      shadows
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#1a1a1a']} />
      <fog attach="fog" args={['#1a1a1a', 30, 80]} />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
