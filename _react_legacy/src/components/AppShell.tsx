import { useState } from 'react'
import {
  BarChart3,
  ChevronDown,
  Clock,
  FileSignature,
  FileText,
  LogOut,
  Menu,
  Moon,
  Plus,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import ToastViewport from './ToastViewport'
import SolicitarValeModal from './SolicitarValeModal'

const navItems = [
  { to: '/vales-de-salida', label: 'Vales de salida', icon: FileText },
  { to: '/registros', label: 'Registros', icon: Clock },
  { to: '/control-de-stock', label: 'Control de stock', icon: BarChart3 },
  { to: '/permiso-de-retiro', label: 'Permisos de retiro', icon: ShieldCheck },
  { to: '/firmas-digitales', label: 'Firmas digitales', icon: FileSignature },
]

const DRAWER_ID = 'main-menu-drawer'

export default function AppShell() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const title =
    navItems.find((item) => location.pathname.startsWith(item.to))?.label ??
    'VSM'

  return (
    <div className="drawer">
      <input
        id={DRAWER_ID}
        type="checkbox"
        className="drawer-toggle"
        checked={menuOpen}
        onChange={(event) => setMenuOpen(event.target.checked)}
      />

      <div className="drawer-content min-h-screen bg-base-200">
        <header className="navbar bg-primary text-primary-content px-4 sm:px-6">
          <div className="flex-1">
            <label
              htmlFor={DRAWER_ID}
              className="btn btn-ghost btn-square drawer-button text-primary-content hover:bg-black/10 border-transparent hover:border-transparent"
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </label>
          </div>

          <div className="flex-none">
            <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
          </div>

          <div className="flex-1 flex justify-end items-center gap-3">
            <label className="swap swap-rotate">
              <input
                type="checkbox"
                className="theme-controller"
                value="dark"
              />
              <Sun className="swap-off size-5" />
              <Moon className="swap-on size-5" />
            </label>

            <button
              type="button"
              className="btn btn-ghost text-primary-content hover:bg-black/10 border-transparent hover:border-transparent gap-2 px-2"
              popoverTarget="user-menu"
              style={{ anchorName: '--user-menu' } as React.CSSProperties}
            >
              <div className="avatar avatar-placeholder avatar-online">
                <div className="bg-primary-content text-primary w-8 rounded-full">
                  <span className="text-xs font-semibold">FR</span>
                </div>
              </div>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-medium">frodriguez</span>
                <span className="block text-xs opacity-80">
                  Pañol - Operador
                </span>
              </span>
              <ChevronDown className="size-4" />
            </button>
            <ul
              className="dropdown dropdown-end menu bg-base-100 text-base-content rounded-box z-1 mt-2 w-56 p-2 shadow-md"
              popover="auto"
              id="user-menu"
              style={{ positionAnchor: '--user-menu' } as React.CSSProperties}
            >
              <li className="menu-title">Pañol - Operador</li>
              <li>
                <a>Mi perfil</a>
              </li>
              <li>
                <a>Cerrar sesión</a>
              </li>
            </ul>
          </div>
        </header>

        <main className="mx-auto max-w-[1200px] px-4 pt-6 pb-32 sm:px-6">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side z-50">
        <label
          htmlFor={DRAWER_ID}
          aria-label="Cerrar menú"
          className="drawer-overlay"
        ></label>

        <aside className="bg-neutral text-neutral-content flex min-h-full w-72 flex-col">
          <div className="bg-primary text-primary-content flex shrink-0 items-center justify-between px-4 py-3">
            <div>
              <p className="text-lg font-semibold leading-tight">Rioplatense</p>
              <p className="text-xs tracking-wide opacity-80">FRIGORÍFICO</p>
            </div>
            <label
              htmlFor={DRAWER_ID}
              className="cursor-pointer"
              aria-label="Cerrar menú"
            >
              <X className="size-5" />
            </label>
          </div>

          <nav className="flex grow flex-col gap-3 overflow-y-auto p-4">
            <button
              type="button"
              className="btn btn-primary w-full gap-2"
              onClick={() => {
                setMenuOpen(false)
                ;(
                  document.getElementById(
                    'solicitar_vale_modal',
                  ) as HTMLDialogElement | null
                )?.showModal()
              }}
            >
              <Plus className="size-4" />
              Solicitar vale
            </button>

            <ul className="menu w-full gap-1 p-0">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? 'menu-active border-primary text-neutral-content border-l-4 !bg-white/10'
                        : 'text-neutral-content'
                    }
                  >
                    <item.icon className="size-5" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 px-6 py-5 text-left"
            onClick={() => setMenuOpen(false)}
          >
            <LogOut className="size-5" />
            Cerrar sesión
          </button>
        </aside>
      </div>

      <ToastViewport />
      <SolicitarValeModal />
    </div>
  )
}
