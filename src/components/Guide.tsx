import { useCallback, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Placement = 'top' | 'bottom' | 'left' | 'right'

interface GuideProps {
  title: string
  detail: ReactNode
  formula?: string
  placement?: Placement
  children: ReactNode
  className?: string
  /** Renders the anchor as a block-level div (use when wrapping cards, buttons or tiles). */
  block?: boolean
  /** Makes the anchor itself reachable by keyboard. Omit when the child is already focusable. */
  focusable?: boolean
}

interface Position {
  top: number
  left: number
  arrowLeft: number
  arrowTop: number
  placement: Placement
}

const GAP = 12
const MARGIN = 10
const WIDTH = 288

function computePosition(rect: DOMRect, height: number, preferred: Placement): Position {
  const viewportW = window.innerWidth
  const viewportH = window.innerHeight
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

  let placement = preferred
  if (placement === 'top' && rect.top - height - GAP < MARGIN) placement = 'bottom'
  else if (placement === 'bottom' && rect.bottom + height + GAP > viewportH - MARGIN) placement = 'top'
  else if (placement === 'right' && rect.right + WIDTH + GAP > viewportW - MARGIN) placement = 'left'
  else if (placement === 'left' && rect.left - WIDTH - GAP < MARGIN) placement = 'right'

  let top: number
  let left: number

  if (placement === 'top' || placement === 'bottom') {
    top = placement === 'top' ? rect.top - height - GAP : rect.bottom + GAP
    left = clamp(rect.left + rect.width / 2 - WIDTH / 2, MARGIN, Math.max(MARGIN, viewportW - WIDTH - MARGIN))
  } else {
    left = placement === 'left' ? rect.left - WIDTH - GAP : rect.right + GAP
    top = clamp(rect.top + rect.height / 2 - height / 2, MARGIN, Math.max(MARGIN, viewportH - height - MARGIN))
  }

  return {
    top,
    left,
    arrowLeft: clamp(rect.left + rect.width / 2 - left, 16, WIDTH - 16),
    arrowTop: clamp(rect.top + rect.height / 2 - top, 16, Math.max(16, height - 16)),
    placement,
  }
}

export function Guide({ title, detail, formula, placement = 'top', children, className, block, focusable }: GuideProps) {
  const anchorRef = useRef<HTMLElement | null>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)
  const [position, setPosition] = useState<Position | null>(null)
  const tooltipId = useId()

  useLayoutEffect(() => {
    if (!anchorRect || !bubbleRef.current) return
    setPosition(computePosition(anchorRect, bubbleRef.current.offsetHeight, placement))
  }, [anchorRect, placement])

  const open = useCallback(() => {
    const rect = anchorRef.current?.getBoundingClientRect()
    if (rect) setAnchorRect(rect)
  }, [])

  const close = useCallback(() => {
    setAnchorRect(null)
    setPosition(null)
  }, [])

  const arrowStyle = !position
    ? undefined
    : position.placement === 'top' || position.placement === 'bottom'
      ? { left: position.arrowLeft, [position.placement === 'top' ? 'bottom' : 'top']: -5 }
      : { top: position.arrowTop, [position.placement === 'left' ? 'right' : 'left']: -5 }

  const anchorProps = {
    ref: (node: HTMLElement | null) => { anchorRef.current = node },
    className: `${block ? 'block' : 'inline-flex'} guide-target ${className ?? ''}`,
    onMouseEnter: open,
    onMouseLeave: close,
    onFocusCapture: open,
    onBlurCapture: close,
    'aria-describedby': anchorRect ? tooltipId : undefined,
    ...(focusable ? { tabIndex: 0, 'aria-label': `Ayuda: ${title}` } : {}),
  }

  const anchor = block ? <div {...anchorProps}>{children}</div> : <span {...anchorProps}>{children}</span>

  return (
    <>
      {anchor}

      {anchorRect && createPortal(
        <div
          ref={bubbleRef}
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none fixed z-[60] animate-guide-in"
          style={{
            width: WIDTH,
            top: position?.top ?? -9999,
            left: position?.left ?? -9999,
            visibility: position ? 'visible' : 'hidden',
          }}
        >
          <div className="relative rounded-2xl border border-white/10 bg-slate-900/95 p-4 text-left shadow-guide backdrop-blur-xl">
            <span
              className="absolute h-2.5 w-2.5 rotate-45 border-b border-r border-white/10 bg-slate-900/95"
              style={arrowStyle}
            />
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-300">Guía</p>
            <p className="mt-1 text-sm font-bold text-white">{title}</p>
            <div className="mt-1.5 text-[13px] leading-5 text-slate-300">{detail}</div>
            {formula && (
              <p className="mt-3 rounded-lg bg-white/[0.07] px-3 py-2 font-mono text-xs text-cyan-300">{formula}</p>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
