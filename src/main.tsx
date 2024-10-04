import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store/store.ts'
import { IntlProvider } from 'react-intl'
import enMessages from './translations/Messages.ts'
import viMessages from './translations/vi.json'
const messages={
  en: enMessages,
  vi:viMessages
}
const language = 'vi'; // 'en', 'vi'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntlProvider messages={messages[language]} locale={language}>
    <Provider store={store}>
    <App />
    </Provider>
    </IntlProvider>
  </StrictMode>,
)
