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

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LogInPage />} />

          {/* Protected Routes /home and /profile if user hasn't logined yet*/}
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
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
