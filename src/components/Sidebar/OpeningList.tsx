import { usePanelStore } from '../../store/usePanelStore'
import { PANEL_LABELS } from '../../types'
import type { Opening } from '../../types'

interface FieldProps {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
}

function SmallInput({ label, value, onChange, step = 0.05 }: FieldProps) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="text-[10px] text-concrete-500 uppercase">{label}</span>
      <input
        type="number"
        value={value}
        min={0}
        step={step}
        onChange={(e) => {
          const v = parseFloat(e.target.value)
          if (!isNaN(v) && v >= 0) onChange(v)
        }}
        className="w-full bg-concrete-800 border border-concrete-600 rounded px-1.5 py-1 text-xs text-right text-white focus:outline-none focus:border-blue-500"
      />
    </label>
  )
}

interface OpeningRowProps {
  opening: Opening
  onUpdate: (patch: Partial<Omit<Opening, 'id'>>) => void
  onRemove: () => void
}

function OpeningRow({ opening, onUpdate, onRemove }: OpeningRowProps) {
  return (
    <div className="bg-concrete-800 rounded-md p-2 border border-concrete-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-concrete-200">{opening.label}</span>
        <button
          onClick={onRemove}
          className="text-red-400 hover:text-red-300 text-xs px-1.5 py-0.5 rounded hover:bg-red-900/30"
        >
          Remove
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        <SmallInput label="Offset X (m)" value={opening.offsetX} onChange={(v) => onUpdate({ offsetX: v })} />
        <SmallInput label="Offset Y (m)" value={opening.offsetY} onChange={(v) => onUpdate({ offsetY: v })} />
        <SmallInput label="Width (m)" value={opening.width} onChange={(v) => onUpdate({ width: v })} />
        <SmallInput label="Height (m)" value={opening.height} onChange={(v) => onUpdate({ height: v })} />
      </div>
    </div>
  )
}

export function OpeningList() {
  const { panels, selectedRole, addOpening, removeOpening, updateOpening } = usePanelStore()
  const panel = panels[selectedRole]

  const isFloor = selectedRole === 'floor'
  const isRoof = selectedRole === 'roof'
  const canHaveOpenings = !isFloor && !isRoof

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-concrete-400">
          Openings — {PANEL_LABELS[selectedRole]}
        </h2>
        {canHaveOpenings && (
          <div className="flex gap-1">
            <button
              onClick={() => addOpening(selectedRole, 'Door')}
              className="text-xs bg-concrete-700 hover:bg-concrete-600 text-concrete-200 px-2 py-1 rounded"
            >
              + Door
            </button>
            <button
              onClick={() => addOpening(selectedRole, 'Window')}
              className="text-xs bg-concrete-700 hover:bg-concrete-600 text-concrete-200 px-2 py-1 rounded"
            >
              + Window
            </button>
          </div>
        )}
      </div>

      {!canHaveOpenings ? (
        <p className="text-xs text-concrete-500 italic">
          Openings are not applicable to the {isFloor ? 'floor' : 'roof'} panel.
        </p>
      ) : panel.openings.length === 0 ? (
        <p className="text-xs text-concrete-500 italic">No openings — add a door or window above.</p>
      ) : (
        <div className="space-y-2">
          {panel.openings.map((op) => (
            <OpeningRow
              key={op.id}
              opening={op}
              onUpdate={(patch) => updateOpening(selectedRole, op.id, patch)}
              onRemove={() => removeOpening(selectedRole, op.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
