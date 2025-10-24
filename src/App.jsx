import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/Authcontext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/index.css";

// pages (lazy loading pour l'optimisation)
const Accueil = lazy(() => import("./pages/Accueil"));
const Club = lazy(() => import("./pages/Club"));
const Evenements = lazy(() => import("./pages/Evenements"));
const Galerie = lazy(() => import("./pages/Galerie"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Gestion = lazy(() => import("./pages/Gestion"));
const Sponsors = lazy(() => import("./pages/Sponsors"));
const ListeMembres = lazy(() => import("./pages/ListeMembres"));

// Composant de fallback pour le chargement
const LoadingFallback = () => (
  <div style={{ 
    padding: "3rem", 
    textAlign: "center", 
    color: "white",
    background: "rgba(255, 255, 255, 0.1)",
    margin: "2rem",
    borderRadius: "10px"
  }}>
    <div style={{ 
      display: "inline-block",
      width: "40px",
      height: "40px",
      border: "4px solid rgba(255, 255, 255, 0.3)",
      borderTop: "4px solid var(--primary-color)",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "1rem"
    }} />
    <p>Chargement…</p>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main id="main-content">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/club" element={<Club />} />
              <Route path="/evenements" element={<Evenements />} />
              <Route path="/galerie" element={<Galerie />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/gestion" element={<Gestion />} />
              <Route path="/membres" element={<ListeMembres />} />
              <Route path="/sponsors" element={<Sponsors />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}