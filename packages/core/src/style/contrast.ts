import { type Color, contrastRatio, colorToRgb } from './Color.js';

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360;
    s /= 100;
    l /= 100;
    let r = l;
    let g = l;
    let b = l;

    if (s !== 0) {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function candidateRatio(h: number, s: number, newL: number, bg: Color): number {
    const [nr, ng, nb] = hslToRgb(h, s, newL);
    return contrastRatio({ type: 'rgb', r: nr, g: ng, b: nb }, bg);
}

export function adjustForContrast(fg: Color, bg: Color, targetRatio = 4.5): Color {
    if (fg.type === 'none' || bg.type === 'none') return fg;

    const ratio = contrastRatio(fg, bg);
    if (ratio >= targetRatio) return fg;

    const [r, g, b] = colorToRgb(fg);
    const [h, s, l] = rgbToHsl(r, g, b);

    // Binary search for the lowest L that meets targetRatio (dark end, L→0)
    // and the highest L that meets targetRatio (light end, L→100).
    // Then pick whichever is closer to the original L.

    let darkBest = -1;  // highest L in [0, l) that meets ratio (darken direction)
    {
        let lo = 0, hi = Math.floor(l);
        // Check if darkening can ever meet the target
        if (candidateRatio(h, s, 0, bg) >= targetRatio) {
            // Binary search: find the maximum L in [0, floor(l)] that meets ratio
            // Contrast at L=0 is high, contrast rises again as L falls
            // Find the boundary: the highest L where ratio is still >= target
            while (lo < hi) {
                const mid = Math.ceil((lo + hi) / 2);
                if (candidateRatio(h, s, mid, bg) >= targetRatio) {
                    lo = mid; // mid works, try higher
                } else {
                    hi = mid - 1; // mid doesn't work, go lower
                }
            }
            if (candidateRatio(h, s, lo, bg) >= targetRatio) {
                darkBest = lo;
            }
        }
    }

    let lightBest = -1; // lowest L in (l, 100] that meets ratio (lighten direction)
    {
        let lo = Math.ceil(l), hi = 100;
        // Check if lightening can ever meet the target
        if (candidateRatio(h, s, 100, bg) >= targetRatio) {
            // Binary search: find the minimum L in [ceil(l), 100] that meets ratio
            while (lo < hi) {
                const mid = Math.floor((lo + hi) / 2);
                if (candidateRatio(h, s, mid, bg) >= targetRatio) {
                    hi = mid; // mid works, try lower
                } else {
                    lo = mid + 1; // mid doesn't work, go higher
                }
            }
            if (candidateRatio(h, s, lo, bg) >= targetRatio) {
                lightBest = lo;
            }
        }
    }

    let bestL: number;

    if (darkBest === -1 && lightBest === -1) {
        // No valid L found — fall back to white or black
        const whiteRatio = contrastRatio({ type: 'rgb', r: 255, g: 255, b: 255 }, bg);
        const blackRatio = contrastRatio({ type: 'rgb', r: 0, g: 0, b: 0 }, bg);
        const [nr, ng, nb] = whiteRatio > blackRatio ? [255, 255, 255] : [0, 0, 0];
        return { type: 'rgb', r: nr, g: ng, b: nb };
    } else if (darkBest === -1) {
        bestL = lightBest;
    } else if (lightBest === -1) {
        bestL = darkBest;
    } else {
        // Pick the closer boundary to the original L
        bestL = (l - darkBest) <= (lightBest - l) ? darkBest : lightBest;
    }

    const [fr, fg_, fb] = hslToRgb(h, s, bestL);

    if (fg.type === 'hex') {
        const hexStr = '#' + [fr, fg_, fb].map(x => x.toString(16).padStart(2, '0')).join('');
        return { type: 'hex', hex: hexStr };
    }
    return { type: 'rgb', r: fr, g: fg_, b: fb };
}
