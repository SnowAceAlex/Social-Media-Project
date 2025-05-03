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

function App() {
  return (
  <ThemeProvider>
    <SocketProvider> {/* Wrap socket kết nối trước */}
      <NotificationProvider> {/* Wrap notification state */}
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
  );
}

export default App;
