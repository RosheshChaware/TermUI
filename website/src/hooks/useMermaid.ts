import { useEffect } from 'react'

/**
 * Client-side Mermaid diagram initializer.
 * Dynamically loads mermaid from CDN and renders all ```mermaid code blocks
 * into SVG diagrams. Only runs in the browser.
 */
export function useMermaid() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Find all mermaid code blocks rendered by MDX
    const codeBlocks = document.querySelectorAll('pre > code.language-mermaid')
    if (codeBlocks.length === 0) return

    // Convert code blocks to mermaid-renderable divs
    const containers: HTMLElement[] = []
    codeBlocks.forEach((block) => {
      const pre = block.parentElement
      if (!pre) return

      const div = document.createElement('div')
      div.className = 'mermaid'
      div.textContent = block.textContent || ''
      pre.replaceWith(div)
      containers.push(div)
    })

    // Dynamically load mermaid via script tag (avoids TS module resolution issues)
    const existingScript = document.querySelector('script[data-mermaid]')
    if (existingScript) {
      // Mermaid already loaded, just re-run
      const w = window as unknown as { mermaid?: { run: (opts: { nodes: HTMLElement[] }) => void } }
      if (w.mermaid) {
        w.mermaid.run({ nodes: containers })
      }
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
    script.setAttribute('data-mermaid', 'true')
    script.onload = () => {
      const w = window as unknown as {
        mermaid?: {
          initialize: (config: Record<string, unknown>) => void
          run: (opts: { nodes: HTMLElement[] }) => void
        }
      }
      if (w.mermaid) {
        w.mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#2563eb',
            primaryTextColor: '#e2e8f0',
            primaryBorderColor: '#3b82f6',
            lineColor: '#64748b',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            background: '#0f172a',
            mainBkg: '#1e293b',
            nodeBorder: '#3b82f6',
            clusterBkg: '#1e293b',
            clusterBorder: '#334155',
            titleColor: '#e2e8f0',
            edgeLabelBackground: '#1e293b',
          },
          flowchart: {
            curve: 'basis',
            padding: 16,
          },
        })
        w.mermaid.run({ nodes: containers })
      }
    }
    document.head.appendChild(script)
  }, [])
}
