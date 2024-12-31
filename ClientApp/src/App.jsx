import React, { useState, useContext, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

// Create a context to store user role
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);

    const setRole = (role) => {
        setUserRole(role);
        localStorage.setItem('userRole', role);
    };

    return (
        <AuthContext.Provider value={{ userRole, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Default route: Home page */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/admin-dashboard"
                        element={<ProtectedRoute role="Admin" Component={AdminDashboard} />}
                    />
                    <Route
                        path="/client-dashboard"
                        element={<ProtectedRoute role="Client" Component={ClientDashboard} />}
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

// Protected Route Component
const ProtectedRoute = ({ role, Component }) => {
    const { userRole } = useAuth();
    return userRole === role ? <Component /> : <Navigate to="/" />;
};

export default App;
