import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { PanelMap, PanelRole, Opening } from '../types'
import { PANEL_ROLES } from '../types'

// ─── Default panel dimensions ─────────────────────────────────────────────────
// Room: 6 m long × 4 m wide × 3 m high walls, 0.2 m thick concrete
// Corner stitching: N/S walls extend past E/W walls at corners

function makeDefaultPanels(): PanelMap {
  const floorL = 6.0
  const floorW = 4.0
  const wallHeight = 3.0
  const thickness = 0.2

  // N/S walls extend to cover corners: length = floor.L + E.thick + W.thick
  const nsLength = floorL + thickness + thickness

  return {
    floor: {
      role: 'floor',
      length: floorL,
      width: floorW,
      thickness,
      openings: [],
    },
    'wall-north': {
      role: 'wall-north',
      length: nsLength,
      width: wallHeight,
      thickness,
      openings: [],
    },
    'wall-south': {
      role: 'wall-south',
      length: nsLength,
      width: wallHeight,
      thickness,
      openings: [],
    },
    'wall-east': {
      role: 'wall-east',
      length: floorW,
      width: wallHeight,
      thickness,
      openings: [],
    },
    'wall-west': {
      role: 'wall-west',
      length: floorW,
      width: wallHeight,
      thickness,
      openings: [],
    },
    roof: {
      role: 'roof',
      length: nsLength,           // flush with N/S walls: floor.L + E.thick + W.thick
      width: floorW + 2 * thickness, // extends over N/S walls: floor.W + N.thick + S.thick
      thickness,
      openings: [],
    },
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface PanelStore {
  panels: PanelMap
  selectedRole: PanelRole
  roofEnabled: boolean
  setSelectedRole: (role: PanelRole) => void
  toggleRoof: () => void
  setDimension: (role: PanelRole, key: 'length' | 'width' | 'thickness', value: number) => void
  addOpening: (role: PanelRole, label: string) => void
  removeOpening: (role: PanelRole, id: string) => void
  updateOpening: (role: PanelRole, id: string, patch: Partial<Omit<Opening, 'id'>>) => void
  resetPanels: () => void
}

/**
 * Sync wall lengths and roof dimensions to match floor + corner stitching.
 * N/S walls extend full length including E/W thickness (corner stitching).
 * E/W walls butt between N/S walls.
 */
function syncFrameGeometry(panels: PanelMap): PanelMap {
  const floor = panels['floor']
  const eastThick = panels['wall-east'].thickness
  const westThick = panels['wall-west'].thickness
  const northThick = panels['wall-north'].thickness
  const southThick = panels['wall-south'].thickness

  // N/S length = floor length + east thickness + west thickness
  const nsLength = floor.length + eastThick + westThick
  // E/W length = floor width (fits between N/S inner faces)
  const ewLength = floor.width
  // Roof: same length as N/S walls; width extends over N/S walls
  const roofWidth = floor.width + northThick + southThick

  return {
    ...panels,
    'wall-north': { ...panels['wall-north'], length: nsLength },
    'wall-south': { ...panels['wall-south'], length: nsLength },
    'wall-east': { ...panels['wall-east'], length: ewLength },
    'wall-west': { ...panels['wall-west'], length: ewLength },
    roof: { ...panels['roof'], length: nsLength, width: roofWidth },
  }
}

export const usePanelStore = create<PanelStore>((set) => ({
  panels: makeDefaultPanels(),
  selectedRole: 'floor',
  roofEnabled: false,

  setSelectedRole: (role) => set({ selectedRole: role }),

  toggleRoof: () =>
    set((state) => {
      const newEnabled = !state.roofEnabled
      // If disabling roof and it was selected, switch to floor
      const selectedRole =
        !newEnabled && state.selectedRole === 'roof' ? 'floor' : state.selectedRole
      return { roofEnabled: newEnabled, selectedRole }
    }),

  setDimension: (role, key, value) =>
    set((state) => {
      const updated = {
        ...state.panels,
        [role]: { ...state.panels[role], [key]: value },
      }
      // Auto-sync frame geometry whenever any dimension changes
      return { panels: syncFrameGeometry(updated) }
    }),

  addOpening: (role, label) =>
    set((state) => {
      const panel = state.panels[role]
      const newOpening: Opening = {
        id: uuidv4(),
        label,
        offsetX: 0.5,
        offsetY: 0.1,
        width: label === 'Door' ? 1.0 : 0.8,
        height: label === 'Door' ? 2.1 : 1.0,
      }
      return {
        panels: {
          ...state.panels,
          [role]: { ...panel, openings: [...panel.openings, newOpening] },
        },
      }
    }),

  removeOpening: (role, id) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [role]: {
          ...state.panels[role],
          openings: state.panels[role].openings.filter((o) => o.id !== id),
        },
      },
    })),

  updateOpening: (role, id, patch) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [role]: {
          ...state.panels[role],
          openings: state.panels[role].openings.map((o) =>
            o.id === id ? { ...o, ...patch } : o,
          ),
        },
      },
    })),

  resetPanels: () => set({ panels: makeDefaultPanels(), selectedRole: 'floor', roofEnabled: false }),
}))

export { PANEL_ROLES }
