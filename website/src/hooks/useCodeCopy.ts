import { useEffect } from 'react'

/**
 * Injects premium copy-to-clipboard buttons into all code blocks.
 * Features: SVG clipboard/check icons, smooth state transitions, glassmorphism.
 */
export function useCodeCopy() {
    useEffect(() => {
        // TerminalCodeBlock handles copy for all MDX code blocks (figure > .code-window > pre).
        // This hook only covers edge-case standalone pre blocks (e.g. inside PackageTabs).
        const standaloneBlocks = document.querySelectorAll(
            '.doc-content pre:not(.code-window pre):not(.code-block pre)'
        )

        const clipboardSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`

        const checkSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`

        const inject = (container: HTMLElement, pre: HTMLElement) => {
            // Skip if already has a button
            if (container.querySelector('.code-copy-btn')) return

            const code = pre.querySelector('code')
            if (!code) return

            const btn = document.createElement('button')
            btn.className = 'code-copy-btn'
            btn.setAttribute('aria-label', 'Copy code')
            btn.setAttribute('type', 'button')
            btn.innerHTML = `${clipboardSvg}<span>copy</span>`

            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(code.textContent ?? '')
                    btn.innerHTML = `${checkSvg}<span>copied!</span>`
                    btn.classList.add('copied')
                    setTimeout(() => {
                        btn.innerHTML = `${clipboardSvg}<span>copy</span>`
                        btn.classList.remove('copied')
                    }, 2200)
                } catch {
                    // Clipboard API not available
                }
            })

            container.style.position = 'relative'
            container.appendChild(btn)
        }

        standaloneBlocks.forEach((pre) => {
            inject(pre as HTMLElement, pre as HTMLElement)
        })
    }, [])
}
