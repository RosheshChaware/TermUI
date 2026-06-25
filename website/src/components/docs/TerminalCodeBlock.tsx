'use client'
import { useRef, useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

const LANG_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
    bash:       { icon: '▶', label: 'TERMINAL',    color: '#28c840' },
    sh:         { icon: '▶', label: 'TERMINAL',    color: '#28c840' },
    shell:      { icon: '▶', label: 'TERMINAL',    color: '#28c840' },
    zsh:        { icon: '▶', label: 'TERMINAL',    color: '#28c840' },
    ts:         { icon: '○', label: 'TYPESCRIPT',  color: '#4B9CD3' },
    typescript: { icon: '○', label: 'TYPESCRIPT',  color: '#4B9CD3' },
    tsx:        { icon: '○', label: 'TSX',         color: '#4B9CD3' },
    js:         { icon: '◉', label: 'JAVASCRIPT',  color: '#f0db4f' },
    javascript: { icon: '◉', label: 'JAVASCRIPT',  color: '#f0db4f' },
    jsx:        { icon: '◉', label: 'JSX',         color: '#f0db4f' },
    css:        { icon: '◆', label: 'CSS',         color: '#00d4ff' },
    json:       { icon: '{}', label: 'JSON',       color: '#a8a29e' },
    yaml:       { icon: '≡', label: 'YAML',        color: '#cb4a32' },
    yml:        { icon: '≡', label: 'YAML',        color: '#cb4a32' },
    md:         { icon: '¶', label: 'MARKDOWN',    color: '#519aba' },
    mdx:        { icon: '¶', label: 'MDX',         color: '#519aba' },
}

const ClipboardIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
)

const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

type PreProps = ComponentPropsWithoutRef<'pre'> & { 'data-language'?: string }

export function TerminalCodeBlock({
    children,
    'data-language': language,
    className,
    ...props
}: PreProps) {
    const [copied, setCopied] = useState(false)
    const windowRef = useRef<HTMLDivElement>(null)
    const lang = language ?? ''
    const cfg = LANG_CONFIG[lang] ?? {
        icon: '·',
        label: lang.toUpperCase() || 'CODE',
        color: '#9898b8',
    }

    const handleCopy = async () => {
        const pre = windowRef.current?.querySelector('pre')
        const text = pre?.textContent ?? ''
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard API not available
        }
    }

    return (
        <div className="code-window" data-language={lang} ref={windowRef}>
            <div className="code-chrome">
                <div className="traffic-lights" aria-hidden="true">
                    <span className="tl tl-red" />
                    <span className="tl tl-yellow" />
                    <span className="tl tl-green" />
                </div>
                <div className="code-lang-label">
                    <span className="code-lang-icon" style={{ color: cfg.color }}>
                        {cfg.icon}
                    </span>
                    <span className="code-lang-text" style={{ color: cfg.color }}>
                        {cfg.label}
                    </span>
                </div>
                <button
                    className={`code-copy-btn${copied ? ' copied' : ''}`}
                    onClick={handleCopy}
                    aria-label={copied ? 'Copied' : 'Copy code'}
                    type="button"
                >
                    {copied ? (
                        <>
                            <CheckIcon />
                            <span>copied!</span>
                        </>
                    ) : (
                        <>
                            <ClipboardIcon />
                            <span>copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className={className} data-language={lang} {...props}>
                {children}
            </pre>
        </div>
    )
}
