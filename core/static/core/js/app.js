// Theme persistence (mirrors the daisyUI theme-controller checkbox)
window.vsmSetTheme = function (theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('vsm-theme', theme)
}

document.addEventListener('DOMContentLoaded', function () {
  var saved = localStorage.getItem('vsm-theme')
  var toggle = document.querySelector('.theme-controller')
  if (saved && toggle) toggle.checked = saved === 'dark'
  if (window.lucide) window.lucide.createIcons()

  // Alpine.js inserts new [data-lucide] icons after the initial render
  // (e.g. filter chips, wizard steps). Re-run Lucide whenever the DOM changes.
  if (window.lucide) {
    var scheduled = false
    var observer = new MutationObserver(function () {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(function () {
        window.lucide.createIcons()
        scheduled = false
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }
})

// Toasts
window.vsmToast = function (type, message) {
  var container = document.getElementById('toast-container')
  if (!container) return
  var alert = document.createElement('div')
  alert.setAttribute('role', 'alert')
  alert.className = 'alert ' + (type === 'error' ? 'alert-error' : 'alert-success')
  var icon = document.createElement('i')
  icon.setAttribute('data-lucide', type === 'error' ? 'x-circle' : 'check-circle-2')
  icon.className = 'size-5'
  var span = document.createElement('span')
  span.textContent = message
  alert.appendChild(icon)
  alert.appendChild(span)
  container.appendChild(alert)
  if (window.lucide) window.lucide.createIcons()
  setTimeout(function () {
    alert.remove()
  }, 4000)
}

// Opens the "Capturar firma" modal pre-filled for a given solicitud
window.abrirCapturaFirma = function (vsm, retirante, legajo, formAction) {
  document.getElementById('firma-vsm').textContent = vsm
  document.getElementById('firma-retirante').textContent = retirante
  document.getElementById('firma-legajo').textContent = legajo
  document.getElementById('firma-form').setAttribute('action', formAction)
  document.getElementById('capturar_firma_modal').showModal()
}

// Badge styling per estado (mirrors core/templates/core/partials/estado_badge.html)
var VSM_ESTADO_BADGE = {
  Pendiente: { cls: 'badge badge-warning gap-1 text-black', icon: 'clock', label: 'Pendiente' },
  Entregado: { cls: 'badge badge-success gap-1 text-white', icon: 'check-circle-2', label: 'Entregado' },
  'No autorizada': { cls: 'badge gap-1 border-none bg-[#dc362e] text-white', icon: 'ban', label: 'No autorizada' },
  'Error SAP': { cls: 'badge gap-1 border-none bg-[#dc362e] text-white', icon: 'alert-triangle', label: 'Error SAP' },
}

// Opens the "Ver materiales" modal reflecting the estado of the clicked row
window.abrirVerMateriales = function (retirante, legajo, estado) {
  document.getElementById('ver-materiales-retirante').textContent = retirante
  document.getElementById('ver-materiales-legajo').textContent = legajo
  var badge = document.getElementById('ver-materiales-badge')
  var info = VSM_ESTADO_BADGE[estado] || VSM_ESTADO_BADGE.Pendiente
  badge.className = info.cls
  badge.innerHTML = '<i data-lucide="' + info.icon + '" class="size-3.5"></i>' + info.label
  document.getElementById('ver_materiales_modal').showModal()
}

// Opens the "Entregar materiales" modal pre-filled for a given vale
window.abrirEntregarMateriales = function (vsm, retirante, legajo, formAction) {
  document.getElementById('entregar-vsm').textContent = vsm
  document.getElementById('entregar-retirante').textContent = retirante
  document.getElementById('entregar-legajo').textContent = legajo
  document.getElementById('entregar_materiales_form').setAttribute('action', formAction)
  document.getElementById('entregar_materiales_modal').showModal()
}

// Auto-submit a search form when its input is cleared back to empty,
// so the results revert to the default (unfiltered) state immediately.
document.addEventListener('input', function (event) {
  if (!event.target.matches('[data-autosubmit-empty]')) return
  if (event.target.value === '') {
    event.target.form.requestSubmit()
  }
})
