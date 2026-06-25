/**
 * ArchitectureDiagrams.tsx
 *
 * Hand-crafted SVG diagrams for the Architecture docs page.
 * Designed to match the TermUI dark terminal aesthetic.
 * Uses CSS variables from the design system for consistency.
 */

/* ── Package Dependency Graph ─────────────────────────── */

const LAYER_COLORS = {
  application: { bg: 'rgba(0, 255, 136, 0.08)', border: 'rgba(0, 255, 136, 0.35)', label: '#00ff88' },
  component:   { bg: 'rgba(0, 212, 255, 0.08)', border: 'rgba(0, 212, 255, 0.35)', label: '#00d4ff' },
  feature:     { bg: 'rgba(255, 170, 0, 0.08)',  border: 'rgba(255, 170, 0, 0.35)',  label: '#ffaa00' },
  core:        { bg: 'rgba(255, 68, 102, 0.08)', border: 'rgba(255, 68, 102, 0.3)',  label: '#ff4466' },
}

const NODE_STYLE = {
  bg: 'rgba(20, 20, 40, 0.9)',
  border: 'rgba(80, 80, 120, 0.5)',
  hoverBorder: 'rgba(0, 255, 136, 0.6)',
  text: '#e8e8f0',
  subtext: '#9898b8',
  radius: 8,
}

function PackageNode({ x, y, label, sub, width = 160, height = 42 }: {
  x: number; y: number; label: string; sub?: string; width?: number; height?: number
}) {
  const h = sub ? height + 14 : height
  return (
    <g className="arch-node">
      <rect
        x={x} y={y} width={width} height={h} rx={NODE_STYLE.radius}
        fill={NODE_STYLE.bg}
        stroke={NODE_STYLE.border}
        strokeWidth={1}
      />
      <text
        x={x + width / 2} y={y + (sub ? 18 : h / 2 + 1)}
        textAnchor="middle" dominantBaseline="middle"
        fill={NODE_STYLE.text}
        fontSize={13} fontFamily="'JetBrains Mono', 'Fira Code', monospace" fontWeight={500}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + width / 2} y={y + 36}
          textAnchor="middle" dominantBaseline="middle"
          fill={NODE_STYLE.subtext}
          fontSize={10} fontFamily="'Inter', system-ui, sans-serif"
        >
          {sub}
        </text>
      )}
    </g>
  )
}

function LayerBand({ y, width, height, color, label }: {
  y: number; width: number; height: number
  color: typeof LAYER_COLORS.application; label: string
}) {
  return (
    <g>
      <rect
        x={16} y={y} width={width - 32} height={height} rx={12}
        fill={color.bg}
        stroke={color.border}
        strokeWidth={1}
        strokeDasharray="4 2"
      />
      <text
        x={32} y={y + 20}
        fill={color.label}
        fontSize={11} fontFamily="'JetBrains Mono', 'Fira Code', monospace"
        fontWeight={600} letterSpacing="0.05em" opacity={0.9}
      >
        {label}
      </text>
    </g>
  )
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const midY = (y1 + y2) / 2
  return (
    <g>
      <path
        d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
        fill="none"
        stroke="rgba(100, 100, 150, 0.4)"
        strokeWidth={1.5}
        markerEnd="url(#arrowhead)"
      />
    </g>
  )
}

export function PackageDependencyGraph() {
  const W = 720
  const layerH = 80
  const gap = 28
  const nodeW = 160

  // Layer Y positions
  const appY = 8
  const compY = appY + layerH + gap
  const featY = compY + layerH + gap
  const coreY = featY + layerH + gap
  const totalH = coreY + layerH + 50 + 8

  // Center helper
  const cx = W / 2

  return (
    <svg
      viewBox={`0 0 ${W} ${totalH}`}
      width="100%"
      style={{ maxWidth: W, display: 'block', margin: '1.5rem auto' }}
      role="img"
      aria-label="TermUI package dependency graph showing four layers: Application, Component, Feature, and Core"
    >
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M 0 0 L 8 3 L 0 6 Z" fill="rgba(100, 100, 150, 0.6)" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="g" />
          <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <style>{`
        .arch-node rect { transition: stroke 0.2s ease, filter 0.2s ease; }
        .arch-node:hover rect { stroke: ${NODE_STYLE.hoverBorder}; filter: url(#glow); }
      `}</style>

      {/* Layer bands */}
      <LayerBand y={appY}  width={W} height={layerH}   color={LAYER_COLORS.application} label="APPLICATION LAYER" />
      <LayerBand y={compY} width={W} height={layerH}   color={LAYER_COLORS.component}   label="COMPONENT LAYER" />
      <LayerBand y={featY} width={W} height={layerH}   color={LAYER_COLORS.feature}      label="FEATURE LAYER" />
      <LayerBand y={coreY} width={W} height={layerH + 50} color={LAYER_COLORS.core}      label="CORE LAYER" />

      {/* Application Layer nodes */}
      <PackageNode x={cx - nodeW * 1.5 - 20} y={appY + 30} label="@termuijs/ui" />
      <PackageNode x={cx - nodeW / 2}         y={appY + 30} label="@termuijs/quick" />
      <PackageNode x={cx + nodeW / 2 + 20}    y={appY + 30} label="create-termui-app" />

      {/* Component Layer nodes */}
      <PackageNode x={cx - nodeW * 1.5 - 20} y={compY + 30} label="@termuijs/widgets" />
      <PackageNode x={cx - nodeW / 2}         y={compY + 30} label="@termuijs/jsx" />
      <PackageNode x={cx + nodeW / 2 + 20}    y={compY + 30} label="@termuijs/store" />

      {/* Feature Layer nodes */}
      <PackageNode x={cx - nodeW * 1.5 - 20} y={featY + 30} label="@termuijs/tss" />
      <PackageNode x={cx - nodeW / 2}         y={featY + 30} label="@termuijs/router" />
      <PackageNode x={cx + nodeW / 2 + 20}    y={featY + 30} label="@termuijs/motion" />

      {/* Core Layer nodes — wider */}
      <PackageNode x={cx - 310 / 2 - 10}  y={coreY + 30} label="@termuijs/core" sub="Screen · Input · Events · Layout · Style" width={220} height={42} />
      <PackageNode x={cx + 310 / 2 - 190} y={coreY + 85} label="@termuijs/data" sub="CPU · Memory · Disk · Network · Processes" width={220} height={42} />

      {/* Arrows between layers */}
      <Arrow x1={cx} y1={appY + layerH} x2={cx} y2={compY} />
      <Arrow x1={cx} y1={compY + layerH} x2={cx} y2={featY} />
      <Arrow x1={cx} y1={featY + layerH} x2={cx} y2={coreY} />
    </svg>
  )
}

/* ── Render Pipeline ──────────────────────────────────── */

function PipelineNode({ x, y, label, sub, width = 140, color = '#00ff88' }: {
  x: number; y: number; label: string; sub?: string; width?: number; color?: string
}) {
  const h = sub ? 56 : 44
  return (
    <g className="pipeline-node">
      <rect
        x={x} y={y} width={width} height={h} rx={8}
        fill={NODE_STYLE.bg}
        stroke={`${color}33`}
        strokeWidth={1}
      />
      <rect
        x={x} y={y} width={width} height={3} rx={2}
        fill={color} opacity={0.6}
      />
      <text
        x={x + width / 2} y={y + (sub ? 20 : h / 2 + 1)}
        textAnchor="middle" dominantBaseline="middle"
        fill={NODE_STYLE.text}
        fontSize={12} fontFamily="'JetBrains Mono', 'Fira Code', monospace" fontWeight={500}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + width / 2} y={y + 38}
          textAnchor="middle" dominantBaseline="middle"
          fill={NODE_STYLE.subtext}
          fontSize={10} fontFamily="'Inter', system-ui, sans-serif"
        >
          {sub}
        </text>
      )}
    </g>
  )
}

function HArrow({ x1, y1, x2, y2, color = 'rgba(100, 100, 150, 0.5)' }: {
  x1: number; y1: number; x2: number; y2: number; color?: string
}) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.5}
      markerEnd="url(#arrowhead)"
    />
  )
}

export function RenderPipeline() {
  const W = 700
  const nodeW = 130
  const startX = 20
  const gap = 16

  const positions = [
    { x: startX, label: 'State Change', sub: 'dirty flag / store', color: '#9898b8' },
    { x: startX + nodeW + gap, label: 'Layout Engine', sub: 'flexbox algorithm', color: '#00ff88' },
    { x: startX + (nodeW + gap) * 2, label: 'Style Resolve', sub: 'TSS variables', color: '#00d4ff' },
    { x: startX + (nodeW + gap) * 3, label: 'Buffer Diff', sub: 'prev → next', color: '#ffaa00' },
    { x: startX + (nodeW + gap) * 4, label: 'Flush', sub: 'stdout', color: '#ff4466' },
  ]

  return (
    <svg
      viewBox={`0 0 ${W} 80`}
      width="100%"
      style={{ maxWidth: W, display: 'block', margin: '1.5rem auto' }}
      role="img"
      aria-label="TermUI render pipeline: State Change → Layout Engine → Style Resolve → Buffer Diff → Flush to stdout"
    >
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M 0 0 L 8 3 L 0 6 Z" fill="rgba(100, 100, 150, 0.6)" />
        </marker>
      </defs>

      <style>{`
        .pipeline-node rect { transition: stroke 0.2s ease, filter 0.2s ease; }
        .pipeline-node:hover rect { stroke: rgba(0, 255, 136, 0.5); }
      `}</style>

      {positions.map((p, i) => (
        <g key={i}>
          <PipelineNode x={p.x} y={10} label={p.label} sub={p.sub} width={nodeW} color={p.color} />
          {i < positions.length - 1 && (
            <HArrow
              x1={p.x + nodeW}
              y1={38}
              x2={positions[i + 1].x}
              y2={38}
            />
          )}
        </g>
      ))}
    </svg>
  )
}

/* ── Event Flow ───────────────────────────────────────── */

export function EventFlow() {
  const W = 660
  const nodeW = 145
  const gap = 18
  const startX = 12

  const steps = [
    { label: 'Raw stdin', sub: 'bytes', color: '#9898b8' },
    { label: 'InputParser', sub: 'decode sequences', color: '#00ff88' },
    { label: 'EventEmitter', sub: 'bubble up tree', color: '#00d4ff' },
    { label: 'Key Handlers', sub: '+ app-level events', color: '#ffaa00' },
  ]

  return (
    <svg
      viewBox={`0 0 ${W} 80`}
      width="100%"
      style={{ maxWidth: W, display: 'block', margin: '1.5rem auto' }}
      role="img"
      aria-label="TermUI event flow: Raw stdin → InputParser → EventEmitter → Key Handlers"
    >
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M 0 0 L 8 3 L 0 6 Z" fill="rgba(100, 100, 150, 0.6)" />
        </marker>
      </defs>

      <style>{`
        .pipeline-node rect { transition: stroke 0.2s ease; }
        .pipeline-node:hover rect { stroke: rgba(0, 255, 136, 0.5); }
      `}</style>

      {steps.map((s, i) => (
        <g key={i}>
          <PipelineNode x={startX + i * (nodeW + gap)} y={10} label={s.label} sub={s.sub} width={nodeW} color={s.color} />
          {i < steps.length - 1 && (
            <HArrow
              x1={startX + i * (nodeW + gap) + nodeW}
              y1={38}
              x2={startX + (i + 1) * (nodeW + gap)}
              y2={38}
            />
          )}
        </g>
      ))}
    </svg>
  )
}

/* ── Dev Server ───────────────────────────────────────── */

export function DevServerFlow() {
  const W = 540
  const nodeW = 155
  const gap = 18
  const startX = 12

  const steps = [
    { label: 'File Change', sub: 'debounced 200ms', color: '#9898b8' },
    { label: 'FileWatcher', sub: 'fs.watch', color: '#00d4ff' },
    { label: 'DevServer', sub: 'SIGTERM → fork()', color: '#00ff88' },
  ]

  return (
    <svg
      viewBox={`0 0 ${W} 80`}
      width="100%"
      style={{ maxWidth: W, display: 'block', margin: '1.5rem auto' }}
      role="img"
      aria-label="TermUI dev server flow: File Change → FileWatcher → DevServer (SIGTERM old, fork new)"
    >
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M 0 0 L 8 3 L 0 6 Z" fill="rgba(100, 100, 150, 0.6)" />
        </marker>
      </defs>

      <style>{`
        .pipeline-node rect { transition: stroke 0.2s ease; }
        .pipeline-node:hover rect { stroke: rgba(0, 255, 136, 0.5); }
      `}</style>

      {steps.map((s, i) => (
        <g key={i}>
          <PipelineNode x={startX + i * (nodeW + gap)} y={10} label={s.label} sub={s.sub} width={nodeW} color={s.color} />
          {i < steps.length - 1 && (
            <HArrow
              x1={startX + i * (nodeW + gap) + nodeW}
              y1={38}
              x2={startX + (i + 1) * (nodeW + gap)}
              y2={38}
            />
          )}
        </g>
      ))}
    </svg>
  )
}
