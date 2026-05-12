import { useMemo } from 'react'
import * as THREE from 'three'
import type { Panel, PanelMap, PanelRole } from '../../types'
import { getPanelTransform } from '../../lib/cgCalculator'

interface PanelMeshProps {
  panel: Panel
  panels: PanelMap
  isSelected: boolean
  onClick: () => void
}

export function PanelMesh({ panel, panels, isSelected, onClick }: PanelMeshProps) {
  const { position, rotation } = getPanelTransform(panel.role as PanelRole, panels)

  const geometry = useMemo(() => {
    const { length, width, thickness, openings } = panel

    // Main panel shape (rectangle in XY local plane)
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.lineTo(length, 0)
    shape.lineTo(length, width)
    shape.lineTo(0, width)
    shape.closePath()

    // Punch holes for each opening
    for (const op of openings) {
      // Clamp opening to panel bounds to avoid degenerate geometry
      const x0 = Math.max(0, op.offsetX)
      const y0 = Math.max(0, op.offsetY)
      const x1 = Math.min(length, op.offsetX + op.width)
      const y1 = Math.min(width, op.offsetY + op.height)
      if (x1 <= x0 || y1 <= y0) continue

      const hole = new THREE.Path()
      hole.moveTo(x0, y0)
      hole.lineTo(x1, y0)
      hole.lineTo(x1, y1)
      hole.lineTo(x0, y1)
      hole.closePath()
      shape.holes.push(hole)
    }

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: thickness,
      bevelEnabled: false,
    }

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    geo.computeVertexNormals()
    return geo
  }, [panel])

  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <meshStandardMaterial
        color={isSelected ? '#9aacba' : '#7a8a96'}
        transparent
        opacity={0.82}
        side={THREE.DoubleSide}
        roughness={0.75}
        metalness={0.05}
      />
    </mesh>
  )
}
