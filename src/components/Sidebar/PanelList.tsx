import { usePanelStore } from '../../store/usePanelStore'
import { PANEL_LABELS, PANEL_ROLES } from '../../types'
import type { PanelRole } from '../../types'

export function PanelList() {
  const { selectedRole, setSelectedRole, roofEnabled, toggleRoof } = usePanelStore()

  // Build display list: always show floor + 4 walls, conditionally show roof
  const displayRoles: PanelRole[] = roofEnabled ? [...PANEL_ROLES, 'roof'] : [...PANEL_ROLES]

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-concrete-400 mb-2">
        Frame Panels
      </h2>
      <ul className="space-y-1">
        {displayRoles.map((role) => (
          <li key={role}>
            <button
              onClick={() => setSelectedRole(role)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedRole === role
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-concrete-300 hover:bg-concrete-700 hover:text-white'
              }`}
            >
              {PANEL_LABELS[role]}
            </button>
          </li>
        ))}
      </ul>

      {/* Roof toggle */}
      <label className="flex items-center gap-2 mt-3 px-2 py-1.5 rounded hover:bg-concrete-800 cursor-pointer">
        <input
          type="checkbox"
          checked={roofEnabled}
          onChange={toggleRoof}
          className="w-4 h-4 rounded border-concrete-600 text-blue-600 focus:ring-blue-500 bg-concrete-800"
        />
        <span className="text-xs text-concrete-300">Include Roof Panel</span>
      </label>
    </div>
  )
}
