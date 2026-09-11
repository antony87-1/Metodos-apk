import { useState, type ReactNode } from 'react'
import { ChevronDown, type LucideIcon } from 'lucide-react'

type Accent = 'indigo' | 'orange' | 'cyan'

const ACCENTS: Record<Accent, string> = {
  indigo: 'bg-indigo-600 shadow-indigo-200',
  orange: 'bg-orange-500 shadow-orange-200',
  cyan: 'bg-cyan-600 shadow-cyan-200',
}

interface CollapsibleSectionProps {
  id?: string
  eyebrow: string
  title: string
  icon: LucideIcon
  accent?: Accent
  defaultOpen?: boolean
  action?: ReactNode
  children: ReactNode
  className?: string
}

/** Panel that is always expanded from lg upwards and collapsible on tablet and phone. */
export function CollapsibleSection({
  id,
  eyebrow,
  title,
  icon: Icon,
  accent = 'indigo',
  defaultOpen = true,
  action,
  children,
  className,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const titleId = `${id ?? title.replace(/\s+/g, '-').toLowerCase()}-title`

  return (
    <section id={id} className={`panel flex flex-col overflow-hidden ${className ?? ''}`} aria-labelledby={titleId}>
      <div className="panel-head justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`panel-icon ${ACCENTS[accent]}`}>
            <Icon size={19} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="eyebrow truncate">{eyebrow}</p>
            <h2 id={titleId} className="truncate text-base font-semibold text-slate-950">{title}</h2>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {action}
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="icon-button lg:hidden"
            aria-expanded={open}
            aria-label={open ? `Contraer ${title}` : `Expandir ${title}`}
          >
            <ChevronDown size={17} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={`min-h-0 flex-1 flex-col ${open ? 'flex' : 'hidden'} lg:flex`}>{children}</div>
    </section>
  )
}
