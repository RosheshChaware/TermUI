import { useState } from 'react'

interface CodeBlockProps {
    lang?: string
    filename?: string
    children: string
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // clipboard not available
        }
    }

    return (
        <button
            className={`code-copy-btn${copied ? ' copied' : ''}`}
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy code'}
            type="button"
        >
            {copied ? '✓ copied' : 'copy'}
        </button>
    )
}

export function CodeBlock({ lang = 'sh', filename, children }: CodeBlockProps) {
    const text = children
    return (
        <div className="code-block">
            <div className="code-block-header">
                {filename && <span className="code-block-filename">{filename}</span>}
                <span className="code-block-lang">{lang}</span>
                <CopyButton text={text} />
            </div>
            <pre><code>{text}</code></pre>
        </div>
    )
}
