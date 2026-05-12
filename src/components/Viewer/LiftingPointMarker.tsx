import { Html } from '@react-three/drei'

interface LiftingPointMarkerProps {
  position: [number, number, number]
}

export function LiftingPointMarker({ position }: LiftingPointMarkerProps) {
  return (
    <group position={position}>
      {/* Lifting point sphere */}
      <mesh>
        <sphereGeometry args={[0.15, 20, 20]} />
        <meshStandardMaterial
          color="#ff3b30"
          emissive="#ff3b30"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Crosshair lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={6}
            array={new Float32Array([
              -0.6, 0, 0,   0.6, 0, 0,
               0, -0.6, 0,  0, 0.6, 0,
               0, 0, -0.6,  0, 0, 0.6,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff3b30" opacity={0.7} transparent />
      </lineSegments>

      {/* Label */}
      <Html
        distanceFactor={12}
        style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
        position={[0.3, 0.3, 0]}
      >
        <div
          style={{
            background: 'rgba(255, 59, 48, 0.9)',
            color: '#fff',
            padding: '3px 8px',
            borderRadius: 4,
            fontSize: 11,
            fontFamily: 'monospace',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(255,59,48,0.3)',
          }}
        >
          LIFTING POINT ({position.map((v) => v.toFixed(2)).join(', ')})
        </div>
      </Html>
    </group>
  )
}
