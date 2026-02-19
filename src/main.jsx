import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// --- PROVIDERS ---
import { Provider } from 'react-redux'
import store from './store/store.js'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from '@/pages/ErrorFallback.jsx';
import { ActionAlertProvider } from './context/ActionAlertContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}> 
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>
            <ActionAlertProvider>
            <ErrorBoundary 
                FallbackComponent={ErrorFallback} 
                onReset={() => window.location.reload()} // Reset logic
            >
                <App />
            </ErrorBoundary>
            </ActionAlertProvider>
          </ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)