import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AccountantDashboard from './components/AccountantDashboard';
import ClientRegistrationForm from './components/ClientRegistrationForm';
import AccountantSignup from './components/AccountantSignup'; // Your existing accountant signup component

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);

    // Handle successful login
    const handleLoginSuccess = (data) => {
        console.log('Login successful, user data:', data);
        setUserData(data);
        setIsAuthenticated(true);
    };

    // Handle logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserData(null);
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to={getDefaultRoute(userData?.userRole)} replace />
                        ) : (
                            <Login onLoginSuccess={handleLoginSuccess} />
                        )
                    }
                />

                <Route
                    path="/accountant/signup"
                    element={<AccountantSignup />}
                />

                {/* Protected Routes - Require Authentication */}
                <Route
                    path="/accountant/dashboard"
                    element={
                        isAuthenticated && userData?.userRole === 'ACCOUNTANT' ? (
                            <AccountantDashboard userData={userData} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/client/registration"
                    element={
                        isAuthenticated && userData?.userRole === 'CLIENT' ? (
                            <ClientRegistrationForm userData={userData} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Default Route */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to={getDefaultRoute(userData?.userRole)} replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Catch-all route for 404 */}
                <Route
                    path="*"
                    element={
                        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">404 - Page Not Found</h2>
                                <p className="text-gray-600 mb-6">
                                    The page you're looking for doesn't exist.
                                </p>
                                <a
                                    href="/login"
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-block"
                                >
                                    Go to Login
                                </a>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </Router>
    );
}

// Helper function to get default route based on user role
function getDefaultRoute(userRole) {
    switch (userRole) {
        case 'ACCOUNTANT':
            return '/accountant/dashboard';
        case 'CLIENT':
            return '/client/registration';
        default:
            return '/login';
    }
}

export default App;