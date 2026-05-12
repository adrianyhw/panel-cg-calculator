import { PanelList } from './components/Sidebar/PanelList'
import { PanelEditor } from './components/Sidebar/PanelEditor'
import { OpeningList } from './components/Sidebar/OpeningList'
import { LiftingPointResults } from './components/Sidebar/LiftingPointResults'
import { SceneCanvas } from './components/Viewer/SceneCanvas'

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-[#141414] text-white">
      {/* Header */}
      <header className="flex-none flex items-center gap-3 px-4 py-2.5 border-b border-concrete-700/50 bg-[#1c1c1c]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
              <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm3 3h8v8H8V8zm2 2v4h4v-4h-4z" />
            </svg>
          </div>
          <h1 className="text-sm font-semibold text-white">3D Frame Lifting Point Calculator</h1>
        </div>
        <span className="text-xs text-concrete-500 ml-2">
          Precast Concrete Frame — Crane Rigging Point
        </span>
        <div className="ml-auto flex items-center gap-3 text-xs text-concrete-500">
          <span>Click a panel in the viewport to select it</span>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex-none w-72 bg-[#1c1c1c] border-r border-concrete-700/50 overflow-y-auto flex flex-col">
          <div className="p-4 space-y-5">
            <PanelList />
            <div className="border-t border-concrete-700/40" />
            <PanelEditor />
            <div className="border-t border-concrete-700/40" />
            <OpeningList />
            <div className="border-t border-concrete-700/40" />
            <LiftingPointResults />
          </div>
        </aside>

        {/* 3D Viewport */}
        <main className="flex-1 relative">
          <SceneCanvas />

          {/* Viewport hint overlay */}
          <div className="absolute top-2 left-2 text-[10px] text-concrete-600 pointer-events-none select-none">
            Orbit: drag · Zoom: scroll · Pan: right-drag
          </div>
        </main>
      </div>
    </div>
  )
}
