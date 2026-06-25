'use client'

import { useState } from 'react'

type FeedbackState = 'idle' | 'yes' | 'no' | 'submitted'

export function FeedbackWidget() {
    const [state, setState] = useState<FeedbackState>('idle')
    const [text, setText] = useState('')

    const handleSubmit = () => {
        // No backend — visual completion only
        console.info('[TermUI docs feedback]', { helpful: state === 'yes', text })
        setState('submitted')
    }

    if (state === 'submitted') {
        return (
            <div className="feedback">
                <span className="feedback-submitted">✓ thanks, feedback logged</span>
            </div>
        )
    }

    return (
        <div className="feedback">
            <span className="feedback-prompt">Was this page helpful?</span>
            <button
                type="button"
                className={`feedback-btn${state === 'yes' ? ' active' : ''}`}
                onClick={() => setState('yes')}
            >
                [Y]
            </button>
            <button
                type="button"
                className={`feedback-btn${state === 'no' ? ' active' : ''}`}
                onClick={() => setState('no')}
            >
                [N]
            </button>
            {(state === 'yes' || state === 'no') && (
                <>
                    <textarea
                        className="feedback-text"
                        placeholder={state === 'yes' ? 'What was most helpful?' : 'What could be improved?'}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={2}
                    />
                    <button
                        type="button"
                        className="feedback-btn feedback-btn--submit"
                        onClick={handleSubmit}
                    >
                        submit
                    </button>
                </>
            )}
        </div>
    )
}
