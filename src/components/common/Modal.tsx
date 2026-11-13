import { useEffect, useRef, type ReactNode } from 'react'
import { Button } from './Button'

type ModalProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string
}

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = 'astrava-modal-title'

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  return (
    <dialog
      aria-labelledby={titleId}
      className="m-auto w-[min(92vw,36rem)] rounded-3xl border border-soft-gray bg-ivory p-0 text-ink shadow-2xl backdrop:bg-midnight/65"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      ref={dialogRef}
    >
      <div className="flex items-start justify-between gap-6 border-b border-soft-gray px-6 py-5">
        <h2 className="font-display text-2xl">{title}</h2>
        <Button onClick={onClose} type="button" variant="quiet">
          Close
        </Button>
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  )
}
