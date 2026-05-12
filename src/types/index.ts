// ─── Shared Types ─────────────────────────────────────────────────────────────

export type PanelRole =
  | 'floor'
  | 'wall-north'
  | 'wall-south'
  | 'wall-east'
  | 'wall-west'
  | 'roof'

/** Panels always present in the frame (floor + 4 walls) */
export const PANEL_ROLES: PanelRole[] = [
  'floor',
  'wall-north',
  'wall-south',
  'wall-east',
  'wall-west',
]

/** All roles including roof */
export const ALL_PANEL_ROLES: PanelRole[] = [
  'floor',
  'wall-north',
  'wall-south',
  'wall-east',
  'wall-west',
  'roof',
]

export const PANEL_LABELS: Record<PanelRole, string> = {
  floor: 'Floor',
  'wall-north': 'North Wall',
  'wall-south': 'South Wall',
  'wall-east': 'East Wall',
  'wall-west': 'West Wall',
  roof: 'Roof',
}

export interface Opening {
  id: string
  label: string // 'Door' | 'Window'
  // Position relative to panel bottom-left corner (metres)
  offsetX: number // along panel length axis
  offsetY: number // along panel height axis (0 = floor level for walls)
  width: number   // opening width (along panel length)
  height: number  // opening height
}

export interface Panel {
  role: PanelRole
  /** Horizontal span in panel-local space (metres) */
  length: number
  /** Vertical span in panel-local space — height for walls, depth for floor */
  width: number
  /** Concrete thickness (metres) */
  thickness: number
  openings: Opening[]
}

export type PanelMap = Record<PanelRole, Panel>

export interface CgResult {
  cg: [number, number, number]
  totalVolume: number
  perPanel: Partial<Record<PanelRole, { netVolume: number; localCg: [number, number, number] }>>
}
