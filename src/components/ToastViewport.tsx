import { useSyncExternalStore } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { getSnapshot, subscribe } from '../lib/toast'

export default function ToastViewport() {
  const toasts = useSyncExternalStore(subscribe, getSnapshot)

  if (toasts.length === 0) return null

  return (
    <div className="toast toast-end toast-bottom z-[100]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'}`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}
