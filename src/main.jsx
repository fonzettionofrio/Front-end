import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegistraCliente from './pages/Palestra/RegistraCliente'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RegistraPT from './pages/Palestra/RegistraPT'
import Lista_appuntamenti from './pages/PT/ListaAppuntamenti'
import ElencoPT from './pages/Palestra/ElencoPT'
import ElencoClienti from './pages/Palestra/ElencoClienti'
import InfoUser from './pages/InfoUser'
import GestioneFascieOrarie from './pages/Palestra/GestioneFascieOrarie'
import ListaPrenotazioniPalestra from './pages/Palestra/components/ListaPrenotazioniPalestra'

// Crea il routing tra le pagine

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/infoUser',
    element: <InfoUser />,
  },
  {
    path: '/registraCliente',
    element: <RegistraCliente />,
  },
  {
    path: '/registraPT',
    element: <RegistraPT />,
  },
  {
    path: '/elencoPT',
    element: <ElencoPT />
  },
  {
    path: '/elencoClienti',
    element: <ElencoClienti />
  },
  {
    path: '/gestioneFascieOrarie',
    element: <GestioneFascieOrarie />
  },
  {
    path: '/listaPrenotazioniPalestra',
    element: <ListaPrenotazioniPalestra />
  }

])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
