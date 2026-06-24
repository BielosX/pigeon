import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const setupMock = async () => {
    if (!import.meta.env.VITE_ENABLE_MOCK) {
        console.info('MSW Disabled')
        return
    }
    const { worker } = await import('./mocks/browser')
    console.info('MSW Enabled. Starting...')
    return worker.start({
        onUnhandledRequest: 'bypass'
    })
}

setupMock().then(() => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
})
