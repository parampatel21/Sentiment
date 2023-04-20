import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalProvider } from "./components/GlobalState";
// import the page generating function from the respective .js files
import Profile from "./Profile";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Videos from "./Videos";
import Scripts from "./Scripts";
import Reports from "./Reports";
import VideoID from "./VideoID";
import ScriptID from "./ScriptID";
import ReportID from "./ReportID";
import Record from "./Record";
import TestingGrounds from "./TestingGrounds"
import AboutUs from "./About";


function App() {
  return (
    <GlobalProvider>
      <AuthProvider>
        <Container className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}>
          <div className="w-100" style={{ maxWidth: "100%" }}>
            <Router>
              <AuthProvider>
                {/* Add routes to different pages here using desired path name and .js component name */}
                <Routes>
                  {/* TODO: PROTECT ROUTES WHEN USER !AUTHENTICATED */}
                  <Route exact path="/" element={<Dashboard />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/scripts" element={<Scripts />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/videos/:id" element={<VideoID />} />
                  <Route path="/scripts/:id" element={<ScriptID />} />
                  <Route path="/reports/:id" element={<ReportID />} />
                  <Route path="/record" element={<Record />} />
                  <Route path="/testing-grounds" element={<TestingGrounds />} />
                </Routes>
              </AuthProvider>
            </Router>
          </div>
        </Container>
      </AuthProvider>
    </GlobalProvider>


  );
}

export default App;
