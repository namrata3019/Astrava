import { useRef, useState, type KeyboardEvent } from 'react'

type TabItem = {
  content: React.ReactNode
  id: string
  label: string
}

type TabsProps = {
  ariaLabel: string
  id: string
  items: TabItem[]
}

export function Tabs({ ariaLabel, id, items }: TabsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined

    if (event.key === 'ArrowRight') nextIndex = (index + 1) % items.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + items.length) % items.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = items.length - 1

    if (nextIndex === undefined) return

    event.preventDefault()
    const nextItem = items[nextIndex]

    if (!nextItem) return

    setActiveId(nextItem.id)
    tabRefs.current[nextIndex]?.focus()
  }

  const activeItem = items.find((item) => item.id === activeId)

  return (
    <div>
      <div
        aria-label={ariaLabel}
        className="flex flex-wrap gap-2"
        role="tablist"
      >
        {items.map((item, index) => {
          const isActive = item.id === activeId

          return (
            <button
              aria-controls={`${id}-panel-${item.id}`}
              aria-selected={isActive}
              className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${isActive ? 'bg-midnight text-ivory' : 'bg-soft-gray/60 text-ink hover:bg-soft-gray'}`}
              id={`${id}-tab-${item.id}`}
              key={item.id}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {activeItem && (
        <div
          aria-labelledby={`${id}-tab-${activeItem.id}`}
          className="pt-5"
          id={`${id}-panel-${activeItem.id}`}
          role="tabpanel"
          tabIndex={0}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  )
}
