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
import BookmarksPage from "./pages/BookmarksPage";
import FriendsPage from "./pages/FriendsPage";
import MessagePage from "./pages/MessagePage";

function App() {
  const [isLoading, setLoading] = useState(true);
  useEffect(()=>{
    const timer = setTimeout(()=>{
      setLoading(false);
    }, 2000)
    return () => clearTimeout(timer); 
  },[]);

  return (
  <ThemeProvider>
  {
    isLoading ? (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-dark">    
        <img src="/Insta_logo.gif" className="w-35"/>
      </div>
    ) : (
      <>
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
                  <Route path="/bookmarks" element={
                    <PrivateRoute>
                      <BookmarksPage/>
                    </PrivateRoute>
                  } />
                  <Route path="/friends" element={
                    <PrivateRoute>
                      <FriendsPage/>
                    </PrivateRoute>
                  } />
                  <Route path="/conversation" element={
                    <PrivateRoute>
                      <MessagePage/>
                    </PrivateRoute>
                  } />
                  <Route path="/conversation/:conversationId/" element={
                    <PrivateRoute>
                      <MessagePage/>
                    </PrivateRoute>
                  } />
                </Route>
              </Routes>
            </Router>
          </NotificationProvider>
        </SocketProvider>
      </>
    )
  }
  </ThemeProvider>
  );
}

export default App;
