interface LogoMarkProps {
    /** Show the > chevron */
    showChevron?: boolean
    /** Show the _ cursor bar */
    showUnderscore?: boolean
    /** Height in px — width scales proportionally */
    height?: number
    color?: string
}

/**
 * The ">_" TermUI logo mark drawn as crisp geometric SVG paths.
 * No font rendering — always pixel-perfect at any size.
 */
export function LogoMark({
    showChevron = true,
    showUnderscore = true,
    height = 20,
    color = '#00ff88',
}: LogoMarkProps) {
    // Geometry defined on a 32 × 22 grid, scaled via height
    const vw = 32
    const vh = 22
    const w = (height / vh) * vw

    const glowId = 'lgm-glow'

    return (
        <svg
            width={w}
            height={height}
            viewBox={`0 0 ${vw} ${vh}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
        >
            <defs>
                <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="1.6" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* > chevron — two strokes meeting at mid-right */}
            {showChevron && (
                <path
                    d="M 2 2 L 13 11 L 2 20"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#${glowId})`}
                />
            )}

            {/* _ cursor bar */}
            {showUnderscore && (
                <rect
                    x="17"
                    y="18"
                    width="13"
                    height="3"
                    rx="1.5"
                    fill={color}
                    filter={`url(#${glowId})`}
                />
            )}
        </svg>
    )
}
