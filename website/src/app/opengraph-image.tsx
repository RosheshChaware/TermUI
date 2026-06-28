import { ImageResponse } from 'next/og'

export const alt = 'TermUI — TypeScript framework for terminal user interfaces'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Default social card. Adapted from the ogimagecn "terminal" template
// (github.com/shadcn-labs/ogimagecn) to the TermUI brand: near-black surface,
// terminal grid, green accent, brand mark, big title, caption pill, stat row.
export default function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '80px',
                    background: '#0a0a12',
                    backgroundImage:
                        'linear-gradient(rgba(42,42,64,0.30) 1px, transparent 1px), linear-gradient(90deg, rgba(42,42,64,0.30) 1px, transparent 1px), radial-gradient(circle at 82% 12%, rgba(0,255,136,0.16), transparent 46%)',
                    backgroundSize: '48px 48px, 48px 48px, 100% 100%',
                    fontFamily: 'monospace',
                    color: '#e8e8f0',
                }}
            >
                {/* Brand mark + wordmark */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '52px',
                            height: '52px',
                            borderRadius: '12px',
                            background: '#00ff88',
                            color: '#0a0a12',
                            fontSize: '30px',
                            fontWeight: 800,
                        }}
                    >
                        {'>_'}
                    </div>
                    <div style={{ display: 'flex', fontSize: '34px', fontWeight: 700, letterSpacing: '0.04em', color: '#9898b8' }}>
                        termui.io
                    </div>
                </div>

                {/* Title + caption + stats */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            display: 'flex',
                            fontSize: '128px',
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            lineHeight: 1,
                        }}
                    >
                        TermUI
                    </div>

                    <div
                        style={{
                            alignSelf: 'flex-start',
                            display: 'flex',
                            marginTop: '34px',
                            padding: '14px 26px',
                            borderRadius: '12px',
                            background: 'rgba(0,255,136,0.08)',
                            border: '1px solid rgba(0,255,136,0.22)',
                            color: '#00ff88',
                            fontSize: '32px',
                            fontWeight: 600,
                        }}
                    >
                        Build terminal UIs in TypeScript. No React.
                    </div>

                    <div style={{ display: 'flex', gap: '36px', marginTop: '40px', fontSize: '28px', color: '#9898b8' }}>
                        <span>230 components</span>
                        <span style={{ color: '#3a3a55' }}>/</span>
                        <span>15 packages</span>
                        <span style={{ color: '#3a3a55' }}>/</span>
                        <span>MIT</span>
                    </div>
                </div>
            </div>
        ),
        { ...size },
    )
}
