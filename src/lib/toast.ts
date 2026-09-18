export type ToastType = 'success' | 'error'

export type ToastItem = {
  id: number
  type: ToastType
  message: string
}

let toasts: ToastItem[] = []
let listeners: (() => void)[] = []
let nextId = 1

function emitChange() {
  for (const listener of listeners) listener()
}

export function showToast(type: ToastType, message: string) {
  const id = nextId++
  toasts = [...toasts, { id, type, message }]
  emitChange()
  setTimeout(() => {
    toasts = toasts.filter((toast) => toast.id !== id)
    emitChange()
  }, 4000)
}

export function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((item) => item !== listener)
  }
}

export function getSnapshot() {
  return toasts
}
