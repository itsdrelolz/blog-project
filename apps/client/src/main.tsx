import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./hooks/AuthContext.tsx"; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
<<<<<<< HEAD
    <BrowserRouter >
    <App />
    </BrowserRouter>
=======
    <AuthProvider> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
>>>>>>> 8c04f6828e838fd7659cb7e66264a914d59e8d4e
  </StrictMode>,
);