import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './Context/AppContext.js'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css';
import "@mantine/dates/styles.css";
import { DatesProvider } from '@mantine/dates'

import "dayjs/locale/es"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <MantineProvider >
          <Notifications/>
            <DatesProvider settings={{locale: 'es'}}>
              <App />
            </DatesProvider>
        </MantineProvider>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
