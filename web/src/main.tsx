import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Slide, ToastContainer } from 'react-toastify'

import './index.css'
import './tailwind.css'

import { App } from './app'

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        autoClose={3000}
        transition={Slide}
        theme="light"
      />
    </BrowserRouter>
  </StrictMode>
)
