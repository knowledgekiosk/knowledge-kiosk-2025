import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './Routes/router'
import { AuthProvider } from './ContextProvider/AuthProvider'
import { RouterProvider } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // e.g. show a toast with “Update available” and button to call updateSW()
  },
  onOfflineReady() {
    // e.g. notify “App ready for offline use”
  }
});
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
       <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </QueryClientProvider>
   
  </StrictMode>,
)
