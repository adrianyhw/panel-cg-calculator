# Panel CG Calculator

A web-based 3D Center of Gravity calculator for precast concrete panel assemblies.

## Requirements

- Node.js 18+ (https://nodejs.org)
- npm (bundled with Node.js)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open http://localhost:5173 in your browser.

## Usage

1. **Select a panel** from the left sidebar (Floor, North Wall, South Wall, East Wall, West Wall).
2. **Edit dimensions** — Length, Width (height for walls), Thickness.
3. **Add openings** (Door / Window) to wall panels — set offset X/Y and size.
4. The **3D viewer** updates in real time. Click a panel in the 3D view to select it.
5. The **CG Results** section shows the overall Center of Gravity coordinates and total concrete volume.

## Tech Stack

- Vite + React 18 + TypeScript
- Three.js via @react-three/fiber + @react-three/drei
- Zustand (state management)
- Tailwind CSS v3

## CG Calculation

Uniform concrete density is assumed. The CG is computed as the volume-weighted centroid of all panels (gross volume minus opening volumes), transformed into world coordinates based on each panel's role in the room assembly.
