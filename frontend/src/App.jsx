import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LogInPage from "./pages/LogInPage";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import HashtagPage from "./pages/HashtagPage";
import { NotificationProvider } from "./contexts/NotificationContext";
import { SocketProvider } from "./contexts/SocketContext";
import NotificationPage from "./pages/NotificationPage";
import { useEffect, useState } from "react";

function App() {
  const [isLoading, setLoading] = useState(true);
  useEffect(()=>{
    const timer = setTimeout(()=>{
      setLoading(false);
    }, 1500)
    return () => clearTimeout(timer); 
  },[]);

  return (
  <>
  {
    isLoading ? (
      <div className="flex items-center justify-center h-screen bg-white">    
        <img src="/InstaLogo.png" className="w-32"/>
      </div>
    ) : (
      <ThemeProvider>
        <SocketProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LogInPage />} />

                <Route element={<Layout />}>
                  <Route path="/home" element={
                    <PrivateRoute>
                      <HomePage />
                    </PrivateRoute>
                  } />
                  <Route path="/profile/me" element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } />
                  <Route path="/profile/:id" element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  } />
                  <Route path="/hashtag/:hashtag/" element={
                    <PrivateRoute>
                      <HashtagPage/>
                    </PrivateRoute>
                  } />
                  <Route path="/notification" element={
                    <PrivateRoute>
                      <NotificationPage/>
                    </PrivateRoute>
                  } />
                </Route>
              </Routes>
            </Router>
          </NotificationProvider>
        </SocketProvider>
      </ThemeProvider>
    )
  }
  </>
  );
}

export default App;
