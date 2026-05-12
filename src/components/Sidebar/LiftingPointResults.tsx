import { useMemo } from 'react'
import { usePanelStore } from '../../store/usePanelStore'
import { computeUnitCg } from '../../lib/cgCalculator'
import { PANEL_LABELS } from '../../types'
import type { PanelRole } from '../../types'

function fmt(v: number) {
  return v.toFixed(3)
}

export function LiftingPointResults() {
  const { panels, roofEnabled, resetPanels } = usePanelStore()

  const result = useMemo(() => computeUnitCg(panels, roofEnabled), [panels, roofEnabled])

  const [cx, cy, cz] = result.cg

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-concrete-400">
          Lifting Point
        </h2>
        <button
          onClick={resetPanels}
          className="text-xs text-concrete-500 hover:text-concrete-300 underline"
        >
          Reset
        </button>
      </div>

      {/* Lifting Point coordinates */}
      <div className="bg-red-950/30 rounded-md p-3 border border-red-800/40 mb-3">
        <p className="text-xs text-red-300/80 mb-1 uppercase tracking-wide font-semibold">
          Crane Attachment Point (m)
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[['X', cx], ['Y', cy], ['Z', cz]].map(([axis, val]) => (
            <div key={axis as string} className="text-center">
              <div className="text-[10px] text-concrete-500">{axis as string}</div>
              <div className="text-sm font-mono font-semibold text-white">{fmt(val as number)}</div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-red-400/60 mt-2 text-center">
          Safe rigging point for lifting the entire 3D frame
        </p>
      </div>

      {/* Total volume & mass */}
      <div className="bg-concrete-800 rounded-md p-2 border border-concrete-600 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-concrete-400">Total concrete volume</span>
          <span className="text-sm font-mono text-white">{fmt(result.totalVolume)} m³</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-concrete-400">Frame mass (2400 kg/m³)</span>
          <span className="text-sm font-mono text-white">
            {(result.totalVolume * 2400).toFixed(0)} kg
          </span>
        </div>
      </div>

      {/* Per-panel breakdown */}
      <details className="group">
        <summary className="text-xs text-concrete-500 cursor-pointer hover:text-concrete-300 mb-1 list-none flex items-center gap-1">
          <span className="group-open:hidden">▶</span>
          <span className="hidden group-open:inline">▼</span>
          Per-panel breakdown
        </summary>
        <div className="space-y-1 mt-1">
          {(Object.keys(result.perPanel) as PanelRole[]).map((role) => {
            const data = result.perPanel[role]
            if (!data) return null
            const { netVolume, localCg } = data
            return (
              <div key={role} className="bg-concrete-800/60 rounded px-2 py-1 text-xs">
                <span className="text-concrete-300 font-medium">{PANEL_LABELS[role]}</span>
                <span className="text-concrete-500 ml-2">{fmt(netVolume)} m³</span>
                <span className="text-concrete-600 ml-2">
                  local CG ({localCg.map(fmt).join(', ')})
                </span>
              </div>
            )
          })}
        </div>
      </details>
    </div>
  )
}
