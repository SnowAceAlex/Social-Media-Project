import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LogInPage from "./pages/LogInPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
  </Router>
  );
}

export default App;