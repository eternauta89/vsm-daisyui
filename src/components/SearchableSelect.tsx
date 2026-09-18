import { useId, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

type SearchableSelectProps = {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  ariaLabel?: string
}

export default function SearchableSelect({ value, onChange, options, placeholder, ariaLabel }: SearchableSelectProps) {
  const popoverId = `searchable-select-${useId().replace(/:/g, '')}`
  const [query, setQuery] = useState('')
  const filtered = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()))

  const select = (option: string) => {
    onChange(option)
    setQuery('')
    ;(document.getElementById(popoverId) as HTMLElement | null)?.hidePopover()
  }

  return (
    <>
      <button
        type="button"
        className="border-base-300 bg-base-100 flex h-10 w-full items-center justify-between gap-2 rounded-lg border px-3 text-sm"
        popoverTarget={popoverId}
        style={{ anchorName: `--${popoverId}` } as React.CSSProperties}
        aria-label={ariaLabel}
      >
        <span className={`truncate ${value ? '' : 'opacity-40'}`}>{value || placeholder}</span>
        <ChevronDown className="size-4 shrink-0 opacity-60" />
      </button>

      <div
        className="dropdown bg-base-100 text-base-content border-base-300 rounded-box z-1 mt-1 w-72 max-w-full border p-2 shadow-md"
        popover="auto"
        id={popoverId}
        style={{ positionAnchor: `--${popoverId}` } as React.CSSProperties}
      >
        <label className="input mb-2 w-full">
          <Search className="size-4 opacity-60" />
          <input
            type="text"
            className="grow"
            placeholder="Buscar..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <ul className="menu max-h-48 w-full flex-nowrap overflow-y-auto p-0">
          {filtered.length === 0 && <li className="text-base-content/50 px-3 py-2 text-sm">Sin resultados</li>}
          {filtered.map((option) => (
            <li key={option}>
              <button type="button" onClick={() => select(option)}>
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
