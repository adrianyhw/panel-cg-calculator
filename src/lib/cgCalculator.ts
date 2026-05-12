import { Vector3, Euler, Matrix4 } from 'three'
import type { Panel, PanelMap, PanelRole, CgResult } from '../types'
import { PANEL_ROLES } from '../types'

// ─── Automatic world-space transforms for each panel role ────────────────────
// The floor's length and width drive all wall placements.
// Convention: floor lies in XZ plane (Y = 0 at floor surface upward).
// Panel local space: +X = length, +Y = height/width, +Z = thickness (outward normal)
// After transform, Z-thickness is folded into the world axes.
//
// Corner stitching: N/S walls extend past E/W walls. Their origin shifts to
// account for the extra thickness at corners.

export function getPanelTransform(
  role: PanelRole,
  panels: PanelMap,
): { position: Vector3; rotation: Euler } {
  const floor = panels['floor']
  const { length: fL, width: fW } = floor
  const westThick = panels['wall-west'].thickness
  const eastThick = panels['wall-east'].thickness
  const northThick = panels['wall-north'].thickness
  const wallHeight = panels['wall-north'].width // all walls same height

  switch (role) {
    case 'floor':
      // Floor: local XY = world XZ, lies at Y=0, extrudes downward (-Y)
      return {
        position: new Vector3(-fL / 2, 0, -fW / 2),
        rotation: new Euler(-Math.PI / 2, 0, 0),
      }
    case 'wall-north':
      // North wall: along X axis at Z = -fW/2, extrudes outward (-Z)
      // Shifted left by west wall thickness for corner stitching
      return {
        position: new Vector3(-fL / 2 - westThick, 0, -fW / 2),
        rotation: new Euler(0, 0, 0),
      }
    case 'wall-south':
      // South wall: along X axis at Z = -fW/2 - fW (south edge of floor), extrudes outward (-Z)
      // Ry(π) maps local +x → world -X and local +z → world -Z (outward for south)
      // Inner face (z=0) at Z = -(fW/2 + fW) = -3fW/2; outer face at Z = -3fW/2 - southThick
      return {
        position: new Vector3(fL / 2 + eastThick, 0, -fW / 2 - fW),
        rotation: new Euler(0, Math.PI, 0),
      }
    case 'wall-east':
      // East wall: along Z axis at X = +fL/2, extrudes outward (+X)
      // Fits between N/S wall inner faces
      return {
        position: new Vector3(fL / 2, 0, -fW / 2),
        rotation: new Euler(0, Math.PI / 2, 0),
      }
    case 'wall-west':
      // West wall: along Z axis at X = -fL/2, extrudes outward (-X)
      // Ry(-π/2) maps local (x,y,z) → world (-z, y, x)
      // Inner face (z=0) at X=-fL/2; outer face (z=westThick) at X=-fL/2-westThick
      // local x=0 → world Z=-3fW/2 (south end), local x=fW → world Z=-fW/2 (north end)
      return {
        position: new Vector3(-fL / 2, 0, -fW / 2 - fW),
        rotation: new Euler(0, -Math.PI / 2, 0),
      }
    case 'roof':
      // Roof: flush with outer edges of all 4 walls at Y = wallHeight, extrudes upward (+Y)
      // X: starts at west wall outer edge (-fL/2 - westThick), same span as N/S walls
      // Z: starts at north wall outer edge (-fW/2 + northThick), extends to south wall outer edge
      return {
        position: new Vector3(-fL / 2 - westThick, wallHeight, -fW / 2 + northThick),
        rotation: new Euler(-Math.PI / 2, 0, 0),
      }
  }
}

// ─── Per-panel CG in local space ─────────────────────────────────────────────

export function computeLocalCg(panel: Panel): {
  netVolume: number
  localCg: [number, number, number]
} {
  const { length, width, thickness, openings } = panel
  const grossVol = length * width * thickness
  const grossCg: [number, number, number] = [length / 2, width / 2, thickness / 2]

  let sumVolX = grossVol * grossCg[0]
  let sumVolY = grossVol * grossCg[1]
  let sumVolZ = grossVol * grossCg[2]
  let netVol = grossVol

  for (const op of openings) {
    const opVol = op.width * op.height * thickness
    const opCgX = op.offsetX + op.width / 2
    const opCgY = op.offsetY + op.height / 2
    const opCgZ = thickness / 2

    netVol -= opVol
    sumVolX -= opVol * opCgX
    sumVolY -= opVol * opCgY
    sumVolZ -= opVol * opCgZ
  }

  if (netVol <= 0) {
    return { netVolume: 0, localCg: [0, 0, 0] }
  }

  return {
    netVolume: netVol,
    localCg: [sumVolX / netVol, sumVolY / netVol, sumVolZ / netVol],
  }
}

// ─── Transform local CG to world space ────────────────────────────────────────

function localToWorld(
  localCg: [number, number, number],
  position: Vector3,
  rotation: Euler,
): Vector3 {
  const mat = new Matrix4()
  mat.makeRotationFromEuler(rotation)
  mat.setPosition(position)

  const v = new Vector3(...localCg)
  v.applyMatrix4(mat)
  return v
}

// ─── Overall unit CG ──────────────────────────────────────────────────────────

export function computeUnitCg(panels: PanelMap, roofEnabled: boolean): CgResult {
  let totalVol = 0
  let sumX = 0,
    sumY = 0,
    sumZ = 0

  const perPanel: CgResult['perPanel'] = {}

  // Determine active roles
  const activeRoles: PanelRole[] = roofEnabled
    ? [...PANEL_ROLES, 'roof']
    : [...PANEL_ROLES]

  for (const role of activeRoles) {
    const panel = panels[role]
    const { netVolume, localCg } = computeLocalCg(panel)
    perPanel[role] = { netVolume, localCg }

    if (netVolume <= 0) continue

    const { position, rotation } = getPanelTransform(role, panels)
    const worldCg = localToWorld(localCg, position, rotation)

    totalVol += netVolume
    sumX += netVolume * worldCg.x
    sumY += netVolume * worldCg.y
    sumZ += netVolume * worldCg.z
  }

  const cg: [number, number, number] =
    totalVol > 0 ? [sumX / totalVol, sumY / totalVol, sumZ / totalVol] : [0, 0, 0]

  return { cg, totalVolume: totalVol, perPanel }
}
