import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// essential
import { auth } from "./secrets/firebase";
import ProtectedRoute from "./shared-hooks/useRestrictPage";

// pages
import MainPage from "./pages/home";  
import LoginPage from "./pages/login";
import QrCheckPage from "./pages/qr";
import NotFoundPage from "./pages/404";
import LoadingPage from "./pages/loading";
import TimetablePage from "./pages/timeTable";
import MealtablePage from "./pages/meal";

// Temporary
import NothingPage from "./pages/temporary/nothing";


const useAuthInit = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async() => {
      await auth.authStateReady();
      setIsLoading(false);
    }
    init();
  }, []);

  return isLoading;
}

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    } />
    <Route path='/login' element={<LoginPage/>} />
    <Route path='/qr' element={
      <ProtectedRoute>
        <QrCheckPage />
      </ProtectedRoute>
    } />
    <Route path='/time' element={
      <ProtectedRoute>
        <TimetablePage />
      </ProtectedRoute>
    } />
    <Route path='/meal' element={
      <ProtectedRoute>
        <MealtablePage />
      </ProtectedRoute>
    } />
    <Route path='/*' element={<NotFoundPage/>} />
    
    <Route path='/temporary' element={<NothingPage/>} />
  </Routes>
);

export default function App() {
  const isLoading = useAuthInit();
  
  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) :
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      }
    </>
  )
}
