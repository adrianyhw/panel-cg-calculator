import { usePanelStore } from '../../store/usePanelStore'
import { PANEL_LABELS } from '../../types'

interface FieldProps {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  step?: number
  readOnly?: boolean
}

function NumInput({ label, value, onChange, min = 0.01, step = 0.05, readOnly = false }: FieldProps) {
  return (
    <label className="flex items-center justify-between gap-2">
      <span className="text-xs text-concrete-400 w-24 shrink-0">{label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          min={min}
          step={step}
          readOnly={readOnly}
          onChange={(e) => {
            if (readOnly) return
            const v = parseFloat(e.target.value)
            if (!isNaN(v) && v > 0) onChange(v)
          }}
          className={`w-20 border rounded px-2 py-1 text-sm text-right text-white focus:outline-none ${
            readOnly
              ? 'bg-concrete-900 border-concrete-700 text-concrete-500 cursor-not-allowed'
              : 'bg-concrete-800 border-concrete-600 focus:border-blue-500'
          }`}
        />
        <span className="text-xs text-concrete-500 w-4">m</span>
      </div>
    </label>
  )
}

export function PanelEditor() {
  const { panels, selectedRole, setDimension } = usePanelStore()
  const panel = panels[selectedRole]

  const isFloor = selectedRole === 'floor'
  const isWall = selectedRole.startsWith('wall-')
  const isRoof = selectedRole === 'roof'

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-concrete-400 mb-2">
        Dimensions — {PANEL_LABELS[selectedRole]}
      </h2>
      <div className="space-y-2">
        <NumInput
          label="Length"
          value={panel.length}
          onChange={(v) => setDimension(selectedRole, 'length', v)}
          readOnly={isWall || isRoof}
        />
        <NumInput
          label={isFloor || isRoof ? 'Depth (width)' : 'Height'}
          value={panel.width}
          onChange={(v) => setDimension(selectedRole, 'width', v)}
          readOnly={isRoof}
        />
        <NumInput
          label="Thickness"
          value={panel.thickness}
          onChange={(v) => setDimension(selectedRole, 'thickness', v)}
          min={0.01}
          step={0.01}
        />
      </div>

      {/* Info messages */}
      {isWall && (
        <p className="mt-2 text-xs text-concrete-500 italic">
          Wall length auto-calculated from frame geometry (corner stitching).
        </p>
      )}
      {isRoof && (
        <p className="mt-2 text-xs text-concrete-500 italic">
          Roof dimensions match the floor. Only thickness is editable.
        </p>
      )}
      {isFloor && (
        <p className="mt-2 text-xs text-amber-400/80">
          Changing floor dimensions automatically updates wall lengths.
        </p>
      )}
    </div>
  )
}
