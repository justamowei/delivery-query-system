import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import Homepage_and_searching from "./component/homepage_and_searching";
import Result from "./component/result";
import ProtectedRoute from "./component/ProtectedRoutes";
function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/results" element={<ProtectedRoute><Result /></ProtectedRoute>} />
                  <Route path="/" element={<ProtectedRoute><Homepage_and_searching /></ProtectedRoute>} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
