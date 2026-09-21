import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import ValesDeSalida from './pages/ValesDeSalida'
import ControlDeStock from './pages/ControlDeStock'
import PermisoDeRetiro from './pages/PermisoDeRetiro'
import Registros from './pages/Registros'
import FirmasDigitales from './pages/FirmasDigitales'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/vales-de-salida" replace />} />
        <Route path="vales-de-salida" element={<ValesDeSalida />} />
        <Route path="registros" element={<Registros />} />
        <Route path="control-de-stock" element={<ControlDeStock />} />
        <Route path="permiso-de-retiro" element={<PermisoDeRetiro />} />
        <Route path="firmas-digitales" element={<FirmasDigitales />} />
      </Route>
    </Routes>
  )
}

export default App
